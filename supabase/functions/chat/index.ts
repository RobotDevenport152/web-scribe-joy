import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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

// Simple in-memory rate limiter for anonymous users.
// Resets on cold start; good enough as a lightweight safeguard.
const anonRequests = new Map<string, { count: number; resetAt: number }>();
const ANON_MAX = 10;
const ANON_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function checkAnonRate(ip: string): boolean {
  const now = Date.now();
  const rec = anonRequests.get(ip);
  if (!rec || now > rec.resetAt) {
    anonRequests.set(ip, { count: 1, resetAt: now + ANON_WINDOW_MS });
    return true;
  }
  if (rec.count >= ANON_MAX) return false;
  rec.count++;
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
    if (!GEMINI_API_KEY) {
      console.error("[chat] GEMINI_API_KEY not configured");
      return json({ error: "AI service is not configured." }, 500);
    }

    // Determine auth status — authenticated users get full token budget;
    // anonymous users are rate-limited and get a shorter response.
    const authHeader = req.headers.get("Authorization");
    let isAuthenticated = false;
    if (authHeader) {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      );
      const { data } = await supabaseClient.auth.getUser(
        authHeader.replace("Bearer ", ""),
      );
      isAuthenticated = !!data?.user;
    }

    if (!isAuthenticated) {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
      if (!checkAnonRate(ip)) {
        return json(
          { reply: "请求过于频繁，请稍后再试。" },
          429,
        );
      }
    }

    const { messages } = await req.json();

    const fullPrompt =
      SYSTEM_PROMPT +
      "\n\n对话历史：\n" +
      messages
        .map((m: { role: string; content: string }) => `${m.role === "user" ? "用户" : "助手"}: ${m.content}`)
        .join("\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: isAuthenticated ? 1000 : 300,
          },
        }),
      },
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("[chat] Gemini API error:", response.status, errText);
      if (response.status === 429) {
        return json({ reply: "请求过于频繁，请稍后再试。" }, 429);
      }
      return json({ reply: "AI 服务暂不可用，请稍后重试或联系微信客服。" }, 500);
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "抱歉，我暂时无法回答，请稍后再试或联系微信客服。";

    return json({ reply });
  } catch (e) {
    console.error("[chat] error:", e);
    return json({ reply: "网络异常，请稍后重试或联系微信客服。" }, 500);
  }
});
