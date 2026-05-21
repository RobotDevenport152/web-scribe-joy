import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") ?? "";

  if (!signature || !webhookSecret || !stripeKey) {
    console.error("Missing stripe-signature, STRIPE_WEBHOOK_SECRET, or STRIPE_SECRET_KEY");
    return new Response("Missing configuration", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;

    if (!orderId) {
      console.error("No order_id in session metadata, session:", session.id);
      return new Response("No order_id in metadata", { status: 400 });
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error } = await serviceClient
      .from("orders")
      .update({
        status: "paid",
        payment_intent_id: (session.payment_intent as string) ?? null,
      })
      .eq("id", orderId)
      .eq("status", "pending"); // guard against double-processing

    if (error) {
      console.error("Failed to update order:", orderId, error);
      return new Response("Failed to update order", { status: 500 });
    }

    console.log("Order marked as paid:", orderId);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
