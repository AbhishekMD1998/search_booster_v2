// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AuditResult {
  aiScore: number;
  weaknesses: string[];
  rewrittenDescription: string;
  reasoning: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

export async function generateSeoAudit(params: {
  pageTitle: string;
  metaDescription: string;
  productDescription: string;
  h1Text: string;
  hasProductSchema: boolean;
  robotsStatus: string;
}): Promise<AuditResult> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
    },
  });

  const prompt = `You are an expert AI-SEO auditor. Your job is to evaluate how well a product page is optimized for discovery by AI search engines like Perplexity, ChatGPT Browse, and Google SGE.

Analyze the following product page data:

PAGE TITLE: ${params.pageTitle || '(missing)'}
META DESCRIPTION: ${params.metaDescription || '(missing)'}
H1 TEXT: ${params.h1Text || '(missing)'}
HAS PRODUCT SCHEMA (JSON-LD): ${params.hasProductSchema ? 'YES' : 'NO'}
ROBOTS.TXT STATUS: ${params.robotsStatus}
PRODUCT DESCRIPTION:
---
${params.productDescription || '(no description found)'}
---

Return ONLY a valid JSON object (no markdown, no backticks, no extra text) with this exact shape:
{
  "aiScore": <integer 1-100>,
  "weaknesses": [
    "<weakness 1 — specific and actionable, max 20 words>",
    "<weakness 2 — specific and actionable, max 20 words>",
    "<weakness 3 — specific and actionable, max 20 words>"
  ],
  "rewrittenDescription": "<A completely rewritten product description optimized for AI search. It must: (1) open with what the product IS and WHO it's for, (2) include semantic keywords naturally, (3) answer the implied questions a user would ask, (4) be 150-200 words, (5) use plain prose without bullet points>",
  "reasoning": "<1-2 sentence explanation of the score>"
}

Scoring rubric:
- 80-100: Excellent AI-SEO. Has schema, clear descriptions, no crawler blocks.
- 60-79:  Good but has gaps (missing schema OR weak description OR partial blocks).
- 40-59:  Needs work. Missing multiple signals.
- 1-39:   Poor. Missing schema, vague descriptions, AND potentially blocked.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Strip any accidental markdown fences
  const clean = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(clean);

  return {
    aiScore: Math.max(1, Math.min(100, Number(parsed.aiScore))),
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.slice(0, 3) : [],
    rewrittenDescription: parsed.rewrittenDescription ?? '',
    reasoning: parsed.reasoning ?? '',
  };
}
