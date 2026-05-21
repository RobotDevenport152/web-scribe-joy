import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `你是太平洋羊驼（Pacific Alpacas）的专业客服助手。
公司背景：新西兰最大羊驼纤维供应商，成立于2001年，与800家农场合作，占新西兰市场70%份额。
获奖：2023胡润至尚优品金奖、新西兰政府银蕨认证、总理签名溯源证书。
产品：初生被/经典款/轻奢款/高奢款羊驼被，以及大衣、马甲、围巾系列。
价格范围：NZD 249 - NZD 1,680（折合人民币约1,100 - 7,500元）。
核心卖点：WASM实验证明增加25%深度睡眠，螨虫趋避率64.37%，被窝恒温32-34°C。
回答风格：专业但亲切，优先中文，回答简洁（200字以内）。
不确定的内容：引导用户联系微信客服或发邮件至 info@pacificalpacas.com`;
function validateOutput(content: string): { valid: boolean; fallback?: string } {
  if (!content || content.length < 5)
    return { valid: false, fallback: "抱歉，我暂时无法回答，请联系微信客服。" };
  if (content.length > 1000)
    return { valid: false, fallback: "抱歉，回答过长，请换个方式提问。" };
  const aiSelfDisclosure = ["As an AI", "I'm an AI", "I cannot access", "I don't have access"];
  if (aiSelfDisclosure.some(s => content.includes(s)))
    return { valid: false, fallback: "请联系微信客服或发邮件至 info@pacificalpacas.com" };
  return { valid: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

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
        messages: messages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "请求过于频繁，请稍后再试。" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI 额度已用完。" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Anthropic error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI 服务暂不可用" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    // anthopic response text location per spec
    const replyText = data?.content?.[0]?.text ?? (data?.message ?? '');
    const check = validateOutput(replyText || '');
    const final = check.valid ? replyText : (check.fallback ?? '抱歉，暂时无法回答');
    return new Response(JSON.stringify({ reply: final }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
