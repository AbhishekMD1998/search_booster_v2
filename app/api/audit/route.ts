// app/api/audit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { scrapeProductPage } from '@/lib/scraper';
import { checkRobotsTxt } from '@/lib/robots';
import { generateSeoAudit } from '@/lib/gemini';
import { prisma } from '@/lib/prisma';
import type { AuditResponse } from '@/types/audit';

export async function POST(request: NextRequest) {
  try {
    const userId = 'public-user';

    const body = await request.json();
    const { url } = body as { url?: string };

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error();
    } catch {
      return NextResponse.json({ error: 'Invalid URL. Please include http:// or https://' }, { status: 400 });
    }

    const [scrapeResult, robotsResult] = await Promise.allSettled([
      scrapeProductPage(parsedUrl.href),
      checkRobotsTxt(parsedUrl.href),
    ]);

    if (scrapeResult.status === 'rejected') {
      const msg = scrapeResult.reason instanceof Error ? scrapeResult.reason.message : 'Unknown error';
      return NextResponse.json({ error: `Could not fetch the page. ${msg}` }, { status: 422 });
    }

    const scrape = scrapeResult.value;
    const robots = robotsResult.status === 'fulfilled'
      ? robotsResult.value
      : { status: 'NOT_FOUND' as const, blockedBots: [], rawContent: '' };

    const audit = await generateSeoAudit({
      pageTitle: scrape.pageTitle,
      metaDescription: scrape.metaDescription,
      productDescription: scrape.productDescription,
      h1Text: scrape.h1Text,
      hasProductSchema: scrape.hasProductSchema,
      robotsStatus: robots.status,
    });

    const saved = await prisma.productAudit.create({
      data: {
        userId,
        url: parsedUrl.href,
        pageTitle: scrape.pageTitle,
        robotsStatus: robots.status,
        hasProductSchema: scrape.hasProductSchema,
        aiScore: audit.aiScore,
        weaknesses: audit.weaknesses,
        rewrittenDesc: audit.rewrittenDescription,
        rawSchemaSnippet: scrape.schemaData ? JSON.stringify(scrape.schemaData).slice(0, 2000) : null,
      },
    });

    const response: AuditResponse = {
      success: true,
      id: saved.id,
      url: parsedUrl.href,
      pageTitle: scrape.pageTitle,
      hasProductSchema: scrape.hasProductSchema,
      robotsStatus: robots.status,
      blockedBots: robots.blockedBots,
      aiScore: audit.aiScore,
      weaknesses: audit.weaknesses,
      rewrittenDescription: audit.rewrittenDescription,
      reasoning: audit.reasoning,
      createdAt: saved.createdAt.toISOString(),
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('[/api/audit] Error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
