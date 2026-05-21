export function AuditSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 32 }}>
      {/* Top row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass shimmer" style={{ height: 180, borderRadius: 16 }} />
        ))}
      </div>
      <div className="glass shimmer" style={{ height: 140, borderRadius: 16 }} />
      <div className="glass shimmer" style={{ height: 200, borderRadius: 16 }} />

      <p style={{
        textAlign: 'center', fontSize: 13, color: 'var(--muted)',
        marginTop: 8, animation: 'pulse-ring 2s ease infinite',
      }}>
        Scraping page · Checking robots.txt · Running Gemini analysis…
      </p>
    </div>
  );
}
