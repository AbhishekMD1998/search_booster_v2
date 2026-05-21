import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface AuditResult {
  aiScore: number;
  weaknesses: string[];
  rewrittenDescription: string;
  reasoning: string;
}

export async function generateSeoAudit(params: {
  pageTitle: string;
  metaDescription: string;
  productDescription: string;
  h1Text: string;
  hasProductSchema: boolean;
  robotsStatus: string;
}): Promise<AuditResult> {

  const prompt = `You are an expert AI-SEO auditor. Evaluate how well this product page is optimized for AI search engines like Perplexity, ChatGPT Browse, and Google SGE.

PAGE TITLE: ${params.pageTitle || '(missing)'}
META DESCRIPTION: ${params.metaDescription || '(missing)'}
H1 TEXT: ${params.h1Text || '(missing)'}
HAS PRODUCT SCHEMA: ${params.hasProductSchema ? 'YES' : 'NO'}
ROBOTS STATUS: ${params.robotsStatus}
PRODUCT DESCRIPTION:
---
${params.productDescription || '(none)'}
---

Return ONLY valid JSON, no markdown, no backticks:
{
  "aiScore": <1-100>,
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "rewrittenDescription": "<150-200 word rewrite optimized for AI search>",
  "reasoning": "<1-2 sentence score explanation>"
}`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  const text = response.choices[0].message.content ?? '{}';
  const parsed = JSON.parse(text);

  return {
    aiScore:              Math.max(1, Math.min(100, Number(parsed.aiScore))),
    weaknesses:           Array.isArray(parsed.weaknesses) ? parsed.weaknesses.slice(0, 3) : [],
    rewrittenDescription: parsed.rewrittenDescription ?? '',
    reasoning:            parsed.reasoning ?? '',
  };
}