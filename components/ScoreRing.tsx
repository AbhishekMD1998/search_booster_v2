'use client';
import { useEffect, useState } from 'react';

interface Props { score: number; size?: number; }

function scoreColor(s: number) {
  if (s >= 75) return '#34d399';
  if (s >= 50) return '#fbbf24';
  if (s >= 30) return '#fb923c';
  return '#f87171';
}

export function ScoreRing({ score, size = 140 }: Props) {
  const [displayed, setDisplayed] = useState(0);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const color = scoreColor(score);
  const offset = circ - (displayed / 100) * circ;

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplayed(Math.round(eased * score));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', inset: '20%', borderRadius: '50%',
        background: color, filter: 'blur(24px)', opacity: 0.2,
      }} />
      <svg width={size} height={size} viewBox="0 0 120 120" style={{ position: 'relative' }}>
        {/* Track */}
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        {/* Progress */}
        <circle
          cx="60" cy="60" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="score-progress"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
        {/* Score */}
        <text x="60" y="54" textAnchor="middle" fill={color}
          style={{ fontSize: 28, fontWeight: 900, fontFamily: 'Cabinet Grotesk, sans-serif' }}>
          {displayed}
        </text>
        <text x="60" y="70" textAnchor="middle" fill="rgba(255,255,255,0.3)"
          style={{ fontSize: 9, fontWeight: 600, fontFamily: 'Cabinet Grotesk, sans-serif', letterSpacing: '0.1em' }}>
          AI SCORE
        </text>
      </svg>
    </div>
  );
}
