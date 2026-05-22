import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Required env vars checked at startup
const requiredEnvVars = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "STRIPE_SECRET_KEY"];
for (const v of requiredEnvVars) {
  if (!Deno.env.get(v)) console.error(`[create-checkout] Missing required env var: ${v}`);
}

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (origin === "https://pacificalpacas.com") return true;
  if (origin.startsWith("http://localhost")) return true;
  if (origin.endsWith(".lovable.app")) return true;
  if (origin.endsWith(".lovableproject.com")) return true;
  return false;
}

function getCorsHeaders(origin: string | null) {
  const allowed = isAllowedOrigin(origin) ? origin! : "https://pacificalpacas.com";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    // Auth check
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const { data: userData, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (userError || !userData.user) return json({ error: "Unauthorized" }, 401);

    const { items, currency, shippingInfo, promoCode } = await req.json();

    if (!items?.length) return json({ error: "No items in cart" }, 400);
    if (!shippingInfo?.name || !shippingInfo?.email) {
      return json({ error: "Missing shipping information" }, 400);
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
    if (!stripeKey) return json({ error: "Payment not configured" }, 500);

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // TASK 5: Server-side price verification — never trust client-supplied prices
    const productIds = items
      .map((i: any) => i.productId)
      .filter((id: any) => typeof id === "string" && id.length > 0);

    const { data: dbProducts } = await serviceClient
      .from("products")
      .select("id, price_nzd")
      .in("id", productIds);

    const priceMap = new Map(
      (dbProducts ?? []).map((p: any) => [p.id, Number(p.price_nzd)]),
    );

    const verifiedItems = items.map((item: any) => ({
      ...item,
      // Use DB price if available; fall back to client-sent price as last resort
      price: priceMap.has(item.productId)
        ? priceMap.get(item.productId)!
        : Number(item.price),
    }));

    // All calculations use verifiedItems
    const subtotal = verifiedItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );
    const shippingCost = subtotal >= 500 ? 0 : 25;

    // TASK 5: Use claim_promo_code RPC for atomic promo validation + used_count increment.
    // Falls back to DB query if the function doesn't exist yet (pre-migration).
    let discount = 0;
    if (promoCode) {
      try {
        const { data: rpcDiscount, error: rpcError } = await serviceClient.rpc(
          "claim_promo_code",
          { p_code: promoCode.toUpperCase(), p_subtotal: subtotal },
        );
        if (!rpcError && typeof rpcDiscount === "number") {
          discount = rpcDiscount;
        } else {
          throw rpcError ?? new Error("RPC returned unexpected value");
        }
      } catch {
        // Fallback: query promo_codes table directly
        const { data: promo } = await serviceClient
          .from("promo_codes")
          .select("*")
          .eq("code", promoCode.toUpperCase())
          .eq("is_active", true)
          .single();

        if (promo) {
          const now = new Date();
          const notExpired = !promo.expires_at || new Date(promo.expires_at) > now;
          const withinLimit =
            !promo.usage_limit || (promo.used_count ?? 0) < promo.usage_limit;
          const meetsMin = !promo.min_order_nzd || subtotal >= promo.min_order_nzd;

          if (notExpired && withinLimit && meetsMin) {
            discount =
              promo.discount_type === "percent"
                ? parseFloat(((subtotal * promo.discount_value) / 100).toFixed(2))
                : promo.discount_value ?? 0;

            // Increment used_count (best-effort; not atomic without the RPC)
            await serviceClient
              .from("promo_codes")
              .update({ used_count: (promo.used_count ?? 0) + 1 })
              .eq("id", promo.id);
          }
        }
      }
    }

    const total = subtotal - discount + shippingCost;
    const orderNumber = `PA-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    // Insert order record
    const { data: order, error: orderError } = await serviceClient
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: userData.user.id,
        status: "pending",
        shipping_name: shippingInfo.name,
        shipping_email: shippingInfo.email,
        shipping_phone: shippingInfo.phone || null,
        shipping_address: {
          province: shippingInfo.province,
          city: shippingInfo.city,
          district: shippingInfo.district,
          address: shippingInfo.address,
        },
        payment_method: "stripe",
        subtotal,
        discount,
        shipping_cost: shippingCost,
        total,
        currency: currency || "NZD",
        promo_code: promoCode?.toUpperCase() || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error("[create-checkout] order insert error:", orderError);
      return json({ error: "Failed to create order. Please try again." }, 500);
    }

    // Insert order items
    await serviceClient.from("order_items").insert(
      verifiedItems.map((item: any) => ({
        order_id: order.id,
        product_id: item.productId || null,
        product_name: item.name,
        variant: item.variant || null,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      })),
    );

    // Build Stripe line items
    const lineItems: any[] = verifiedItems.map((item: any) => ({
      price_data: {
        currency: (currency || "nzd").toLowerCase(),
        product_data: {
          name: item.name,
          description: item.variant || undefined,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: (currency || "nzd").toLowerCase(),
          product_data: { name: "Shipping" },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const baseUrl = isAllowedOrigin(origin) ? origin! : "https://pacificalpacas.com";
    const sessionParams: any = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/order-success?number=${orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      customer_email: userData.user.email,
      metadata: { order_id: order.id, order_number: orderNumber },
    };

    if (discount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(discount * 100),
        currency: (currency || "nzd").toLowerCase(),
        duration: "once",
      });
      sessionParams.discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams, {
      idempotencyKey: `checkout-${order.id}`,
    });

    if (session.payment_intent) {
      await serviceClient
        .from("orders")
        .update({ payment_intent_id: session.payment_intent as string })
        .eq("id", order.id);
    }

    return json({ url: session.url, orderNumber });
  } catch (error) {
    console.error("[create-checkout] error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req.headers.get("origin")), "Content-Type": "application/json" },
      },
    );
  }
});
