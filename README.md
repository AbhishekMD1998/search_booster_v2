# AI Search Booster 🚀

A **Micro-SaaS** that audits any product page for AI search engine visibility. Built with Next.js 14, Gemini 1.5 Flash, Supabase, and Clerk.

---

## What it does

Given any product URL, the app:
1. **Scrapes** the page with Cheerio (title, meta, h1, description, image alts)
2. **Checks robots.txt** for AI crawler blocks (GPTBot, Claude-Web, PerplexityBot, etc.)
3. **Validates** JSON-LD / Schema.org Product structured data
4. **Generates** an AI SEO audit via Gemini 1.5 Flash:
   - Score out of 100
   - 3 specific semantic weaknesses
   - A fully rewritten, AI-optimised product description
5. **Saves** results to Supabase so users can see their history

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | Next.js 14 (App Router)           |
| Scraping    | Cheerio                           |
| AI          | Google Gemini 1.5 Flash           |
| Auth        | Clerk                             |
| Database    | Supabase (PostgreSQL) + Prisma    |
| Styling     | Tailwind CSS                      |
| Deployment  | Vercel                            |

---

## 12-Day Build Plan

### Week 1 — Core Features

| Day | Goal |
|-----|------|
| 1 (Mon) | Init repo, build scraper API, verify cheerio reads page titles |
| 2 (Tue) | Add robots.txt parser, detect blocked AI crawlers |
| 3 (Wed) | **Break day** — rest & review |
| 4 (Thu) | Wire up Gemini API, prompt for JSON audit response |
| 5 (Fri) | Test with 3-4 real e-commerce URLs, harden JSON parsing |
| 6 (Sat) | Build the Dashboard UI (score ring, badges, rewrite card) |

### Week 2 — Database, Auth & Launch

| Day | Goal |
|-----|------|
| 7-8 (Mon-Tue) | Supabase + Prisma setup, save audit history |
| 9 (Wed) | **Break day** |
| 10 (Thu) | Clerk auth, protect routes, sign-in flow |
| 11 (Fri) | Polish error states, edge cases |
| 12 (Sat) | Deploy to Vercel, share on LinkedIn/Twitter |

---

## Setup — Step by Step

### Prerequisites
- Node.js 18+
- A Google account (for Gemini)
- A Supabase account (free tier fine)
- A Clerk account (free tier fine)

---

### Step 1 — Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/ai-search-booster.git
cd ai-search-booster
npm install
```

---

### Step 2 — Get your API keys

#### Gemini (Day 4)
1. Go to [https://aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **Get API Key** → **Create API Key**
4. Copy the key

#### Supabase (Day 7-8)
1. Go to [https://supabase.com](https://supabase.com) → New Project
2. Once created: **Settings** → **Database** → copy the **Connection String** (URI format)
3. Replace `[YOUR-PASSWORD]` with your project password

#### Clerk (Day 10)
1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com) → Create Application
2. Enable **Google** and/or **Email Magic Links**
3. Copy your **Publishable Key** and **Secret Key** from API Keys

---

### Step 3 — Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in all values:

```env
GEMINI_API_KEY=your_gemini_key
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

---

### Step 4 — Set up the database

```bash
npx prisma generate     # generates the Prisma client
npx prisma db push      # pushes schema to Supabase
```

To view your data in a GUI:
```bash
npx prisma studio
```

---

### Step 5 — Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

### Step 6 — Test your API (Day 1 verification)

While `npm run dev` is running:

```bash
curl -X POST http://localhost:3000/api/audit \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.amazon.com/dp/B07XJ8C8F5"}'
```

You should see a JSON response with `pageTitle`, `robotsStatus`, `aiScore`, etc.

> **Note:** The `/api/audit` endpoint requires auth. For raw testing without auth,
> temporarily comment out the `auth()` check and `prisma.create()` in `app/api/audit/route.ts`.

---

### Step 7 — Deploy to Vercel (Day 12)

```bash
# Push to GitHub first
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ai-search-booster.git
git push -u origin main
```

Then:
1. Go to [vercel.com](https://vercel.com) → **Import Project** → pick your repo
2. Under **Environment Variables**, add all keys from your `.env.local`
3. Click **Deploy** — done!

---

## Project Structure

```
ai-search-booster/
├── app/
│   ├── api/
│   │   ├── audit/route.ts      ← Core audit endpoint (POST)
│   │   └── history/route.ts    ← Fetch past audits (GET)
│   ├── dashboard/page.tsx      ← Main UI
│   ├── sign-in/                ← Clerk sign-in
│   ├── sign-up/                ← Clerk sign-up
│   ├── layout.tsx              ← Root layout (ClerkProvider)
│   └── globals.css
├── components/
│   ├── AuditResultCard.tsx     ← Results display
│   ├── AuditSkeleton.tsx       ← Loading state
│   └── ScoreRing.tsx           ← Animated score circle
├── lib/
│   ├── scraper.ts              ← Cheerio scraping logic
│   ├── robots.ts               ← robots.txt parser
│   ├── gemini.ts               ← Gemini AI integration
│   └── prisma.ts               ← Prisma singleton client
├── prisma/
│   └── schema.prisma           ← Database schema
├── types/
│   └── audit.ts                ← Shared TypeScript types
├── middleware.ts               ← Clerk route protection
└── .env.example                ← Environment variable template
```

---

## After Launch — Share It

- Post on LinkedIn: _"Built an AI SEO auditor in 12 days — here's the link"_
- Share in r/ecommerce, r/SEO, r/SideProject
- Post on Twitter/X with a screen recording

---

## License

MIT
# aisearchbooster
# search_booster_v2
