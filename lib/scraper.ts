// // lib/scraper.ts
// import * as cheerio from 'cheerio';

// export interface ScrapeResult {
//   pageTitle: string;
//   metaDescription: string;
//   productDescription: string;
//   hasProductSchema: boolean;
//   schemaData: Record<string, unknown> | null;
//   h1Text: string;
//   imageAltTexts: string[];
// }

// export async function scrapeProductPage(url: string): Promise<ScrapeResult> {
//   const response = await fetch(url, {
//     headers: {
//       'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
//       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
//       'Accept-Language': 'en-US,en;q=0.9',
//       'Accept-Encoding': 'gzip, deflate, br',
//       'Cache-Control': 'no-cache',
//       'Sec-Fetch-Dest': 'document',
//       'Sec-Fetch-Mode': 'navigate',
//       'Sec-Fetch-Site': 'none',
//     },
//     signal: AbortSignal.timeout(30_000),
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch page: HTTP ${response.status}`);
//   }

//   const html = await response.text();
//   const $ = cheerio.load(html);

//   // ── Basic meta ──────────────────────────────────────────────────────────────
//   const pageTitle = $('title').text().trim();
//   const metaDescription =
//     $('meta[name="description"]').attr('content')?.trim() ??
//     $('meta[property="og:description"]').attr('content')?.trim() ??
//     '';

//   // ── H1 ──────────────────────────────────────────────────────────────────────
//   const h1Text = $('h1').first().text().trim();

//   // ── Product description heuristic ───────────────────────────────────────────
//   // Try common e-commerce selectors first, then fall back to largest <p> block
//   const descSelectors = [
//     '[data-testid="product-description"]',
//     '.product-description',
//     '.product__description',
//     '#product-description',
//     '[itemprop="description"]',
//     '.woocommerce-product-details__short-description',
//     '.product-single__description',
//   ];

//   let productDescription = '';
//   for (const sel of descSelectors) {
//     const text = $(sel).text().trim();
//     if (text.length > 50) { productDescription = text; break; }
//   }

//   // Fall back: find the longest <p> on the page
//   if (!productDescription) {
//     $('p').each((_, el) => {
//       const t = $(el).text().trim();
//       if (t.length > productDescription.length) productDescription = t;
//     });
//   }

//   // ── JSON-LD structured data ─────────────────────────────────────────────────
//   let schemaData: Record<string, unknown> | null = null;

//   $('script[type="application/ld+json"]').each((_, element) => {
//     try {
//       const json = JSON.parse($(element).html() ?? '');
//       const isProduct =
//         json['@type'] === 'Product' ||
//         (Array.isArray(json['@graph']) &&
//           json['@graph'].some((item: { '@type': string }) => item['@type'] === 'Product'));
//       if (isProduct) schemaData = json;
//     } catch {
//       // silently skip malformed JSON blobs
//     }
//   });

//   // ── Image alt texts ─────────────────────────────────────────────────────────
//   const imageAltTexts: string[] = [];
//   $('img[alt]').each((_, el) => {
//     const alt = $(el).attr('alt')?.trim();
//     if (alt) imageAltTexts.push(alt);
//   });

//   return {
//     pageTitle,
//     metaDescription,
//     productDescription: productDescription.slice(0, 3000), // cap at 3k chars for AI
//     hasProductSchema: !!schemaData,
//     schemaData,
//     h1Text,
//     imageAltTexts: imageAltTexts.slice(0, 10),
//   };
// }
// lib/scraper.ts

export interface ScrapeResult {
  pageTitle: string;
  metaDescription: string;
  productDescription: string;
  hasProductSchema: boolean;
  schemaData: Record<string, unknown> | null;
  h1Text: string;
  imageAltTexts: string[];
}

export async function scrapeProductPage(url: string): Promise<ScrapeResult> {
  // Jina Reader fetches any page as clean text — no bot blocks, no timeouts
  const jinaUrl = `https://r.jina.ai/${url}`;

  const response = await fetch(jinaUrl, {
    headers: {
      'Accept': 'application/json',
      'X-Return-Format': 'json',
    },
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Page not found. Check the URL is correct.');
    }
    throw new Error(`Failed to fetch page: HTTP ${response.status}`);
  }

  const data = await response.json();
  const content = data.data;

  return {
    pageTitle:          content.title        ?? '',
    metaDescription:    content.description  ?? '',
    productDescription: (content.content     ?? '').slice(0, 3000),
    hasProductSchema:   false,
    schemaData:         null,
    h1Text:             content.title        ?? '',
    imageAltTexts:      [],
  };
}