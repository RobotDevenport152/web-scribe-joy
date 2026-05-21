import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a sleep consultant for Pacific Alpacas NZ luxury alpaca bedding. Given quiz answers and product list, recommend ONE product. Return only valid JSON: { product_id, reason_en, reason_zh } — no markdown, no preamble. Keep each reason under 40 words.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const answers: string[] = Array.isArray(body.answers) ? body.answers : [];
    const products = Array.isArray(body.products) ? body.products : [];

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

    const userMessage = {
      role: "user",
      content: JSON.stringify({ answers, products }),
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [userMessage],
      }),
    });

    if (!response.ok) {
      const txt = await response.text();
      console.error("Anthropic recommend error:", response.status, txt);
      return new Response(JSON.stringify({ error: "AI 服务不可用" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const replyText = data?.content?.[0]?.text ?? data?.message ?? '';

    // Try to parse JSON from the model reply
    try {
      const parsed = JSON.parse(replyText);
      return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch (err) {
      console.warn("Recommend parse failed, returning fallback", err);
      // Fallback: pick first product
      const fallback = {
        product_id: products?.[0]?.id ?? null,
        reason_en: "We recommend this product based on your answers. Contact support for details.",
        reason_zh: "根据您的回答，推荐此商品。如需详情请联系客服。",
      };
      return new Response(JSON.stringify(fallback), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  } catch (e) {
    console.error("recommend error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
