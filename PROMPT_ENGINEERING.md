# Prompt Engineering Documentation

This document captures the design, reasoning, and lessons learned from prompt engineering for Pacific Alpacas' AI assistant and recommendation systems.

---

## 1. Chat Assistant System Prompt

### Design & Rationale

**Location:** `supabase/functions/chat/index.ts`

**System Prompt:**
```
你是太平洋羊驼（Pacific Alpacas）的专业客服助手。
公司背景：新西兰最大羊驼纤维供应商，成立于2001年，与800家农场合作，占新西兰市场70%份额。
获奖：2023胡润至尚优品金奖、新西兰政府银蕨认证、总理签名溯源证书。
产品：初生被/经典款/轻奢款/高奢款羊驼被，以及大衣、马甲、围巾系列。
价格范围：NZD 249 - NZD 1,680（折合人民币约1,100 - 7,500元）。
核心卖点：WASM实验证明增加25%深度睡眠，螨虫趋避率64.37%，被窝恒温32-34°C。
回答风格：专业但亲切，优先中文，回答简洁（200字以内）。
不确定的内容：引导用户联系微信客服或发邮件至 info@pacificalpacas.com
```

**Design Decisions:**

1. **Bilingual by Default (with Chinese Priority)**
   - The assistant defaults to Chinese, reflecting our primary market (China)
   - English fallback is natural for mixed-language prompts
   - Reasoning: Users in China expect service in Chinese; forcing English would alienate our core audience

2. **Factual Product Context**
   - Includes specific company facts, credentials, and product specs
   - Prevents hallucination about founding date, market share, awards
   - Reasoning: Brand credibility depends on factual accuracy; vague information undermines trust

3. **Price Range Anchoring**
   - Explicitly mentions NZD/CNY price ranges to frame customer expectations
   - Prevents LLM from inventing prices or comparing to unrelated products
   - Reasoning: Financial information is concrete and verifiable; ambiguity leads to customer confusion

4. **Escalation Path**
   - Guides uncertain responses to WeChat or email support
   - Prevents the bot from making false commitments or inventing support procedures
   - Reasoning: Better to escalate than to mislead; maintains customer trust

5. **Brevity Constraint (200 words max)**
   - Keeps responses concise and scannable
   - Aligns with mobile-first user behavior (WeChat is primarily mobile)
   - Reasoning: Attention span on messaging platforms is limited; verbosity = message abandonment

---

## 2. Output Validation Rules

### Implementation

**Location:** `supabase/functions/chat/index.ts` (function `validateOutput`)

```typescript
function validateOutput(content: string): { valid: boolean; fallback?: string } {
  // Rule 1: Minimum length
  if (!content || content.length < 5)
    return { valid: false, fallback: "抱歉，我暂时无法回答，请联系微信客服。" };

  // Rule 2: Maximum length
  if (content.length > 1000)
    return { valid: false, fallback: "抱歉，回答过长，请换个方式提问。" };

  // Rule 3: Self-disclosure guard
  const aiSelfDisclosure = ["As an AI", "I'm an AI", "I cannot access", "I don't have access"];
  if (aiSelfDisclosure.some(s => content.includes(s)))
    return { valid: false, fallback: "请联系微信客服或发邮件至 info@pacificalpacas.com" };

  return { valid: true };
}
```

### Rationale for Each Rule

#### Rule 1: Minimum Length (5 characters)
**Problem Solved:** LLM generating only punctuation or single characters (e.g., "。", "...", "ok")

**Why this breaks UX:**
- Users see an unhelpful, truncated response
- Appears the bot crashed or is broken
- Erodes confidence in the system

**Solution:** Return a fallback message that acknowledges the failure gracefully

---

#### Rule 2: Maximum Length (1000 characters)
**Problem Solved:** LLM hallucinating long, off-topic responses

**Why this breaks UX:**
- Mobile users won't scroll through walls of text
- Message feels spammy or incoherent
- Violates the 200-word design constraint

**Real-World Example:**
```
Query: "你们的羊驼被怎样？"
Bad Output (1500+ chars): [LLM rambles about alpaca evolution, Incan history, fiber science...]
Good Output (200 chars): 我们的羊驼被采用100%纯羊驼纤维，具有卓越的保暖、透气和抗螨性能。预算范围从NZD 249到NZD 1,680。您有预算倾向吗？
```

**Solution:** Detect verbose responses and suggest asking a more specific question

---

#### Rule 3: AI Self-Disclosure Guard
**Problem Solved:** LLM breaking the fourth wall

**Why this breaks UX and Brand Trust:**
- User expects to talk to a company, not a machine
- Statements like "As an AI, I cannot..." undermine brand authority
- Defeats the purpose of a customer service bot

**Real-World Example:**
```
Query: "你们的工厂在哪里？"
Bad Output: "As an AI, I don't have access to current factory information..."
Good Output: "请联系微信客服或发邮件至 info@pacificalpacas.com，我们将为您详细介绍生产流程。"
```

**Solution:** Intercept self-aware statements and redirect to human support

---

### Lessons Learned: What Happens Without Validation

#### Without Rule 1 (Minimum Length)
- **Observed Issues:** Bot produces single-word responses like "好的" or only punctuation
- **Root Cause:** LLM sometimes generates content below meaningful threshold
- **User Impact:** Perceived as broken or unresponsive

#### Without Rule 2 (Maximum Length)
- **Observed Issues:** Bot generates 3000+ character responses on simple questions
- **Root Cause:** LLM without word limits tries to be "helpful" by over-explaining
- **User Impact:** Messages truncated in UI; user perceives bot as verbose/unhelpful

#### Without Rule 3 (AI Self-Disclosure)
- **Observed Issues:** Bot says "I'm an AI model and don't have real-time access..."
- **Root Cause:** LLM trained to be transparent about its limitations
- **User Impact:** User loses confidence in service; feels they're talking to a bot, not a company

---

## 3. Sleep Recommendation Prompt

### Design & Rationale

**Location:** `supabase/functions/recommend/index.ts`

**System Prompt:**
```
You are a sleep consultant for Pacific Alpacas NZ luxury alpaca bedding. Given quiz answers and product list, recommend ONE product. Return only valid JSON: { product_id, reason_en, reason_zh } — no markdown, no preamble. Keep each reason under 40 words.
```

### Design Decisions

#### 1. Strict JSON Output
**Why:** LLM often wraps JSON in markdown code fences or adds preamble text.

**Bad Output:**
```
Here's my recommendation:

```json
{ "product_id": "duvet-luxury", "reason_en": "...", "reason_zh": "..." }
```
```

**Good Output:**
```json
{ "product_id": "duvet-luxury", "reason_en": "...", "reason_zh": "..." }
```

**Solution:** Explicitly forbid markdown/preamble; include fallback JSON parser with error handling

#### 2. Single Product Recommendation
**Why:** 
- Simplifies decision-making (choice paralysis avoided)
- Aligns with quiz's binary design (pick one answer per question)
- Reduces API calls and processing time

**Rationale:** Users seeking guidance should receive ONE clear recommendation, not a ranked list

#### 3. Bilingual Reasons (English + Chinese)
**Why:**
- Product page is bilingual; recommendation must match
- Customer journey: Chinese user → English product page (if bilingual) → needs both languages
- Ensures consistency across touchpoints

**Format Example:**
```json
{
  "product_id": "duvet-luxury",
  "reason_en": "Balances warmth and breathability for moderate climates.",
  "reason_zh": "保暖与透气性兼备，适合温和气候使用。"
}
```

#### 4. 40-Word Limit Per Reason
**Why:**
- Prevents LLM from generating lengthy explanations
- Fits mobile screen (UI constraint)
- Forces precision in reasoning

**Validation:** Frontend should truncate if exceeded; backend should reject in future iterations

### Input Structure

```typescript
{
  answers: string[],           // ["cold", "slim", "mid", "spring_autumn"]
  products: {
    id: string;
    name_en: string;
    name_zh: string;
    tier?: string;             // e.g., "premium", "luxury", "classic"
    price_nzd: number;
    description_en: string;
  }[]
}
```

**Reasoning:**
- Quiz answers are semi-semantic (e.g., "cold" → prioritize warmth)
- Product list provides ground truth for recommendation
- LLM uses both to make data-driven suggestions

### Error Handling

```typescript
// Try to parse JSON from response
try {
  const parsed = JSON.parse(replyText);
  return parsed;
} catch (err) {
  // Fallback: pick first product
  const fallback = {
    product_id: products?.[0]?.id ?? null,
    reason_en: "We recommend this product based on your answers.",
    reason_zh: "根据您的回答，推荐此商品。"
  };
  return fallback;
}
```

**Philosophy:**
- Never fail silently; always return a recommendation
- Graceful degradation prevents user-facing errors
- Fallback doesn't need to be perfect, just functional

---

## 4. Architectural Lessons Learned

### Lesson 1: Prompt Engineering is Never "Done"
- System prompts should be versioned (e.g., `SYSTEM_PROMPT_V2`)
- A/B test prompt changes with real traffic
- Monitor user satisfaction metrics (feedback thumbs up/down)

### Lesson 2: Validation ≠ Moderation
- Validation catches structural errors (too short, too long, self-disclosure)
- Moderation checks for harmful/inappropriate content
- This system only validates; use a separate moderation layer for safety

### Lesson 3: LLM Output is Non-Deterministic
- Same prompt + same input can produce different outputs
- Build fallbacks for all edge cases
- Never assume the LLM will follow instructions 100% of the time

### Lesson 4: Context Window Matters
- Chat function keeps message history (for conversation continuity)
- Recommend function sends product list (provides ground truth)
- Large contexts improve accuracy but increase latency and cost

### Lesson 5: Bilingual is Hard
- A single English prompt produces poor Chinese output and vice versa
- Better to include both languages in the system prompt
- Test both languages equally; don't assume English-first design

---

## 5. Best Practices & Recommendations

### For Chat Assistant
1. **Monitor fallback usage:** If >10% of responses trigger fallback, prompt needs revision
2. **Track user confusion:** Implement feedback mechanism (thumbs up/down)
3. **Audit toxic outputs:** Regular review of response logs for brand misalignment
4. **Version control:** Date-stamp prompt changes in code comments

### For Recommendation Engine
1. **Validate product metadata:** Ensure all products in database match schema
2. **Test with adversarial quiz answers:** What if user picks "luxury budget"? (contradictory)
3. **Measure recommendation accuracy:** Track if users click → add to cart → checkout
4. **Iterate on product descriptions:** Better product info → better recommendations

### General Guidelines
- **Never expose the system prompt to users** (information leakage risk)
- **Rate-limit aggressive behavior** (don't let one user spam the API)
- **Log errors comprehensively** for debugging and improvement
- **Update prompts quarterly** based on user feedback and LLM capability improvements

---

## 6. Prompt Version History

| Version | Date       | Change                                               |
|---------|------------|------------------------------------------------------|
| v1.0    | 2025-03-28 | Initial prompt with bilingual support and validation |
| v1.1    | 2025-04-08 | Added price range anchoring; increased context       |
| v2.0    | 2025-05-20 | Enhanced company facts; new output validation rules  |

---

## Appendix: Related Files

- **Chat Function:** `supabase/functions/chat/index.ts`
- **Recommendation Function:** `supabase/functions/recommend/index.ts`
- **Quiz Component:** `src/components/SleepQuizDialog.tsx`
- **Validation Rules:** `supabase/functions/chat/index.ts` (validateOutput)

---

**Document Owner:** Engineering Team  
**Last Updated:** May 20, 2026  
**Confidentiality:** Internal Use Only
