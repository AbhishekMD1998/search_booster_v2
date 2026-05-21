'use client';
import { useState } from 'react';
import { ScoreRing } from './ScoreRing';
import type { AuditResponse } from '@/types/audit';

interface Props { result: AuditResponse; }

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    PASSED:    { label: '✓ AI Crawlers Allowed',  color: '#34d399', bg: 'rgba(52,211,153,0.08)'  },
    BLOCKED:   { label: '✗ AI Crawlers Blocked',  color: '#f87171', bg: 'rgba(248,113,113,0.08)' },
    NOT_FOUND: { label: '— robots.txt Not Found', color: '#6b6b80', bg: 'rgba(107,107,128,0.08)' },
  };
  const s = map[status] ?? map.NOT_FOUND;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: s.bg, border: `1px solid ${s.color}30`,
      borderRadius: 10, padding: '8px 14px',
      fontSize: 14, fontWeight: 700, color: s.color,
    }}>
      {s.label}
    </div>
  );
}

export function AuditResultCard({ result }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(result.rewrittenDescription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-scale-in" style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 32 }}>

      {/* ── Row 1: Score + Robots + Schema ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: 16, alignItems: 'stretch' }}>

        {/* Score */}
        <div className="glass" style={{
          padding: '28px 32px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 12,
        }}>
          <ScoreRing score={result.aiScore} />
          <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', maxWidth: 140, lineHeight: 1.5 }}>
            {result.reasoning}
          </p>
        </div>

        {/* Robots */}
        <div className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Robots.txt
          </span>
          <StatusBadge status={result.robotsStatus} />
          {result.blockedBots.length > 0 && (
            <div>
              <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Blocked crawlers:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {result.blockedBots.map(bot => (
                  <span key={bot} style={{
                    fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
                    background: 'rgba(248,113,113,0.08)', color: '#f87171',
                    border: '1px solid rgba(248,113,113,0.2)',
                    borderRadius: 6, padding: '3px 8px',
                  }}>{bot}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Schema */}
        <div className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            JSON-LD Schema
          </span>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: result.hasProductSchema ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
            border: `1px solid ${result.hasProductSchema ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
            borderRadius: 10, padding: '8px 14px',
            fontSize: 14, fontWeight: 700,
            color: result.hasProductSchema ? '#34d399' : '#f87171',
          }}>
            {result.hasProductSchema ? '✓ Product Schema Found' : '✗ No Product Schema'}
          </div>
          {result.pageTitle && (
            <div>
              <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Page title</p>
              <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>{result.pageTitle}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Row 2: Weaknesses ── */}
      {result.weaknesses.length > 0 && (
        <div className="glass" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>⚠</div>
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>Semantic Weaknesses</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {result.weaknesses.map((w, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6, flexShrink: 0, marginTop: 1,
                  background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: '#fbbf24',
                }}>{i + 1}</div>
                <p style={{ fontSize: 14, color: 'rgba(240,240,245,0.8)', lineHeight: 1.6 }}>{w}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Row 3: Rewrite ── */}
      {result.rewrittenDescription && (
        <div className="glass" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'rgba(124,106,255,0.1)', border: '1px solid rgba(124,106,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
              }}>✦</div>
              <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>AI-Optimised Rewrite</span>
            </div>
            <button
              onClick={copy}
              className="btn btn-ghost"
              style={{ fontSize: 13, padding: '7px 14px' }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 12, padding: '20px 24px',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
            color: 'rgba(240,240,245,0.85)', lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
          }}>
            {result.rewrittenDescription}
          </div>
        </div>
      )}
    </div>
  );
}
