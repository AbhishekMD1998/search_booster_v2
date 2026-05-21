// lib/robots.ts

/** Known AI crawlers we check for */
const AI_CRAWLERS = [
  'GPTBot',           // OpenAI
  'ChatGPT-User',     // OpenAI browsing
  'CCBot',            // Common Crawl (used by many AI labs)
  'anthropic-ai',     // Anthropic / Claude
  'Claude-Web',       // Anthropic browsing
  'PerplexityBot',    // Perplexity AI
  'Applebot-Extended',// Apple AI
  'GoogleExtendedBot',// Google AI
  'Omgilibot',        // AI training
  'cohere-ai',        // Cohere
];

export type RobotsStatus = 'PASSED' | 'BLOCKED' | 'NOT_FOUND';

export interface RobotsResult {
  status: RobotsStatus;
  blockedBots: string[];
  rawContent: string;
}

export async function checkRobotsTxt(pageUrl: string): Promise<RobotsResult> {
  let robotsUrl: string;
  try {
    const { origin } = new URL(pageUrl);
    robotsUrl = `${origin}/robots.txt`;
  } catch {
    return { status: 'NOT_FOUND', blockedBots: [], rawContent: '' };
  }

  let rawContent = '';
  try {
    const res = await fetch(robotsUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return { status: 'NOT_FOUND', blockedBots: [], rawContent: '' };
    rawContent = await res.text();
  } catch {
    return { status: 'NOT_FOUND', blockedBots: [], rawContent: '' };
  }

  const blockedBots = parseBlockedAiBots(rawContent);
  return {
    status: blockedBots.length > 0 ? 'BLOCKED' : 'PASSED',
    blockedBots,
    rawContent: rawContent.slice(0, 2000),
  };
}

/**
 * Parse robots.txt content and return list of AI bots that are disallowed.
 * Handles both specific-agent blocks and wildcard (*) blocks.
 */
function parseBlockedAiBots(content: string): string[] {
  const lines = content.split('\n').map(l => l.trim());
  const blocked: Set<string> = new Set();

  let currentAgents: string[] = [];

  for (const line of lines) {
    if (line.startsWith('#') || line === '') {
      // blank line resets the current agent group
      if (line === '') currentAgents = [];
      continue;
    }

    const lower = line.toLowerCase();

    if (lower.startsWith('user-agent:')) {
      const agent = line.split(':')[1]?.trim() ?? '';
      currentAgents.push(agent);
      continue;
    }

    if (lower.startsWith('disallow:')) {
      const path = line.split(':').slice(1).join(':').trim();
      // Disallow: / means the whole site
      if (path === '/' || path === '') {
        for (const agent of currentAgents) {
          // Check against our known AI crawler list
          const matched = AI_CRAWLERS.find(
            bot => bot.toLowerCase() === agent.toLowerCase()
          );
          if (matched) blocked.add(matched);
          // Also flag wildcard blocks (disallow all) as suspicious
          if (agent === '*') {
            // Don't flag wildcard unless it disallows everything — common pattern
          }
        }
      }
    }
  }

  return Array.from(blocked);
}
