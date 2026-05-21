'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { AuditResultCard } from '@/components/AuditResultCard';
import { AuditSkeleton } from '@/components/AuditSkeleton';
import type { AuditResponse } from '@/types/audit';

const EXAMPLES = [
  { label: 'amazon.com', url: 'https://www.amazon.com/dp/B07XJ8C8F5' },
  { label: 'nike.com',   url: 'https://www.nike.com/t/air-max-270-shoes' },
];

export default function DashboardPage() {
  const [url, setUrl]         = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<AuditResponse | null>(null);
  const [error, setError]     = useState('');
  const inputRef              = useRef<HTMLInputElement>(null);

  const runAudit = async (target?: string) => {
    const u = (target ?? url).trim();
    if (!u) { inputRef.current?.focus(); return; }

    setLoading(true);
    setResult(null);
    setError('');

    try {
      const res  = await fetch('/api/audit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ url: u }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Audit failed');
      setResult(data as AuditResponse);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: 0, left: '30%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,106,255,0.08) 0%, transparent 70%)',
        }} />
      </div>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px',
        background: 'rgba(6,6,8,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, #7c6aff, #6054cc)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 900, color: '#fff',
          }}>AI</div>
          <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Search Booster
          </span>
        </Link>
        <span style={{ fontSize: 12, color: 'var(--muted)', background: 'rgba(255,255,255,0.04)', padding: '4px 12px', borderRadius: 100, border: '1px solid var(--border)' }}>
          Free · No account needed
        </span>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 80px' }}>

        {/* Hero */}
        <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1,
            marginBottom: 14,
          }}>
            Audit your{' '}
            <span className="gradient-text">product page</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.6 }}>
            Paste any URL. Get an AI readiness score, semantic weaknesses, and a Gemini-powered rewrite.
          </p>
        </div>

        {/* Search bar */}
        <div className="animate-fade-up-2 glass-strong" style={{
          display: 'flex', gap: 8, padding: 8, borderRadius: 18,
          boxShadow: '0 0 0 1px rgba(124,106,255,0.1), 0 8px 40px rgba(0,0,0,0.4)',
          marginBottom: 16,
        }}>
          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && runAudit()}
            placeholder="https://yourstore.com/products/your-product"
            disabled={loading}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              padding: '12px 16px', fontSize: 15, color: 'var(--text)',
              fontFamily: 'Cabinet Grotesk, sans-serif',
            }}
          />
          <button
            onClick={() => runAudit()}
            disabled={loading || !url.trim()}
            className="btn btn-primary"
            style={{ borderRadius: 12, minWidth: 140, flexShrink: 0 }}
          >
            {loading ? (
              <>
                <svg className="animate-spin-slow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Analysing…
              </>
            ) : (
              <>Analyse</>
            )}
          </button>
        </div>

        {/* Example URLs */}
        <div className="animate-fade-up-2" style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Try:</span>
          {EXAMPLES.map(({ label, url: u }) => (
            <button
              key={label}
              onClick={() => { setUrl(u); runAudit(u); }}
              disabled={loading}
              style={{
                fontSize: 12, color: 'var(--accent2)',
                background: 'rgba(124,106,255,0.06)',
                border: '1px solid rgba(124,106,255,0.15)',
                borderRadius: 8, padding: '5px 12px', cursor: 'pointer',
                fontFamily: 'Cabinet Grotesk, sans-serif',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', gap: 14, alignItems: 'flex-start',
            background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)',
            borderRadius: 14, padding: '16px 20px', marginBottom: 24,
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>⚠</span>
            <div>
              <p style={{ fontWeight: 700, color: '#f87171', marginBottom: 4, fontSize: 14 }}>Audit failed</p>
              <p style={{ fontSize: 13, color: 'rgba(248,113,113,0.7)' }}>{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && <AuditSkeleton />}

        {/* Result */}
        {result && !loading && <AuditResultCard result={result} />}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            <div className="animate-float" style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 14 }}>Your audit results will appear here</p>
          </div>
        )}
      </main>
    </div>
  );
}
