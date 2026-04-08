import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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
  return { "Access-Control-Allow-Origin": allowed, "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" };
}
const PROMO_CODES: Record<string, { discount: number; type: "percent" | "fixed"; minAmount?: number }> = {
  WELCOME10: { discount: 10, type: "percent" }, LUXURY20: { discount: 20, type: "percent", minAmount: 500 }, ALPACA50: { discount: 50, type: "fixed" },
};
function calculatePromoDiscount(code: string | null | undefined, subtotal: number): number {
  if (!code) return 0;
  const promo = PROMO_CODES[code.toUpperCase()];
  if (!promo) return 0;
  if (promo.minAmount && subtotal < promo.minAmount) return 0;
  return promo.type === "percent" ? parseFloat((subtotal * promo.discount / 100).toFixed(2)) : promo.discount;
}
Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "");
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (userError || !userData.user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { items, currency, shippingInfo, promoCode } = await req.json();
    if (!items?.length) return new Response(JSON.stringify({ error: "No items" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!shippingInfo?.name || !shippingInfo?.email) return new Response(JSON.stringify({ error: "Missing shipping info" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
    if (!stripeKey) return new Response(JSON.stringify({ error: "Payment not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const shippingCost = subtotal >= 500 ? 0 : 25;
    const discount = calculatePromoDiscount(promoCode, subtotal);
    const total = subtotal - discount + shippingCost;
    const orderNumber = `PA-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const serviceClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const { data: order, error: orderError } = await serviceClient.from("orders").insert({ order_number: orderNumber, user_id: userData.user.id, status: "pending", shipping_name: shippingInfo.name, shipping_email: shippingInfo.email, shipping_phone: shippingInfo.phone || null, shipping_address: { province: shippingInfo.province, city: shippingInfo.city, district: shippingInfo.district, address: shippingInfo.address }, payment_method: "stripe", subtotal, discount, shipping_cost: shippingCost, total, currency: currency || "NZD", promo_code: promoCode?.toUpperCase() || null }).select().single();
    if (orderError) { console.error("Order error:", JSON.stringify(orderError)); return new Response(JSON.stringify({ error: "Failed to create order", detail: orderError.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
    await serviceClient.from("order_items").insert(items.map((item: any) => ({ order_id: order.id, product_id: item.productId || null, product_name: item.name, variant: item.variant || null, quantity: item.quantity, unit_price: item.price, total_price: item.price * item.quantity })));
    const lineItems: any[] = items.map((item: any) => ({ price_data: { currency: (currency || "nzd").toLowerCase(), product_data: { name: item.name, description: item.variant || undefined }, unit_amount: Math.round(item.price * 100) }, quantity: item.quantity }));
    if (shippingCost > 0) lineItems.push({ price_data: { currency: (currency || "nzd").toLowerCase(), product_data: { name: "Shipping" }, unit_amount: Math.round(shippingCost * 100) }, quantity: 1 });
    const baseUrl = isAllowedOrigin(origin) ? origin! : "https://pacificalpacas.com";
    const sessionParams: any = { payment_method_types: ["card"], line_items: lineItems, mode: "payment", success_url: `${baseUrl}/order-success?number=${orderNumber}&session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${baseUrl}/checkout`, customer_email: userData.user.email, metadata: { order_id: order.id, order_number: orderNumber } };
    if (discount > 0) { const coupon = await stripe.coupons.create({ amount_off: Math.round(discount * 100), currency: (currency || "nzd").toLowerCase(), duration: "once" }); sessionParams.discounts = [{ coupon: coupon.id }]; }
    const session = await stripe.checkout.sessions.create(sessionParams, { idempotencyKey: `checkout-${order.id}` });
    if (session.payment_intent) await serviceClient.from("orders").update({ payment_intent_id: session.payment_intent as string }).eq("id", order.id);
    return new Response(JSON.stringify({ url: session.url, orderNumber }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...getCorsHeaders(req.headers.get("origin")), "Content-Type": "application/json" } });
  }
});
