'use client';

const POS_STYLES: Record<string, { color: string; bg: string }> = {
  noun:      { color: '#FF6584', bg: 'rgba(255,101,132,0.12)' },
  verb:      { color: '#6C63FF', bg: 'rgba(108,99,255,0.12)' },
  adjective: { color: '#FFAA00', bg: 'rgba(255,170,0,0.13)' },
  adverb:    { color: '#0ABFBC', bg: 'rgba(10,191,188,0.12)' },
  fallback:  { color: '#9B97C0', bg: 'rgba(155,151,192,0.12)' },
};

export function PosBadge({ pos }: { pos: string }) {
  const style = POS_STYLES[pos.toLowerCase()] ?? POS_STYLES.fallback;
  return (
    <span
      className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide"
      style={{ color: style.color, backgroundColor: style.bg }}
    >
      {pos}
    </span>
  );
}
