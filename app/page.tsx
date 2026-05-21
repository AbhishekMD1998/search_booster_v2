import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* ── Background orbs ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 800, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,106,255,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)',
        }} />
      </div>

      {/* ── Nav ── */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #7c6aff, #6054cc)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 900, color: '#fff',
          }}>AI</div>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>Search Booster</span>
        </div>
        <Link href="/dashboard" style={{
          fontSize: 14, color: 'var(--muted)', textDecoration: 'none',
          padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)',
          transition: 'all 0.2s',
        }}>
          Dashboard →
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px', position: 'relative', zIndex: 1, textAlign: 'center',
      }}>

        {/* Badge */}
        <div className="animate-fade-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(124,106,255,0.1)', border: '1px solid rgba(124,106,255,0.2)',
          borderRadius: 100, padding: '6px 16px', marginBottom: 32,
          fontSize: 13, color: 'var(--accent2)', fontWeight: 600,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
            boxShadow: '0 0 8px var(--accent)',
            animation: 'pulse-ring 2s ease infinite',
          }} />
          Powered by Google Gemini 1.5 Flash
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up-2" style={{
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: 900,
          lineHeight: 1.0,
          letterSpacing: '-0.04em',
          marginBottom: 24,
          maxWidth: 800,
        }}>
          Is your product{' '}
          <em style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic' }}>
            <span className="gradient-text">invisible</span>
          </em>
          <br />to AI search?
        </h1>

        <p className="animate-fade-up-3" style={{
          fontSize: 20, color: 'var(--muted)', maxWidth: 520,
          lineHeight: 1.6, marginBottom: 48,
        }}>
          Paste any product URL. Get an AI readiness score, semantic weaknesses, and an optimised rewrite — in 15 seconds.
        </p>

        {/* CTA */}
        <div className="animate-fade-up-4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/dashboard" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
            Audit a product page
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Trust signals */}
        <div className="animate-fade-up-4" style={{
          display: 'flex', gap: 32, marginTop: 64, flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {[
            { icon: '🤖', text: 'Checks 10 AI crawlers' },
            { icon: '🏷️', text: 'Validates JSON-LD schema' },
            { icon: '✍️', text: 'AI-optimised rewrites' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 14 }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ── */}
      <section style={{ padding: '80px 40px', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16,
        }}>
          {[
            {
              label: 'Crawler Check',
              title: 'Are AI bots blocked?',
              desc: 'We scan your robots.txt for GPTBot, Claude-Web, PerplexityBot and 7 more.',
              color: '#f87171',
            },
            {
              label: 'Schema Audit',
              title: 'Do AI engines understand you?',
              desc: 'Validates JSON-LD Product structured data — what AI uses to extract price, brand & availability.',
              color: '#fbbf24',
            },
            {
              label: 'Gemini Rewrite',
              title: 'Get an optimised description',
              desc: 'AI rewrites your product copy to answer the questions AI search engines actually answer.',
              color: '#7c6aff',
            },
          ].map(({ label, title, desc, color }) => (
            <div key={label} className="glass" style={{ padding: 28 }}>
              <div style={{
                display: 'inline-block', fontSize: 11, fontWeight: 700,
                color, background: `${color}18`, border: `1px solid ${color}30`,
                borderRadius: 6, padding: '3px 10px', marginBottom: 16,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>{label}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>{title}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
