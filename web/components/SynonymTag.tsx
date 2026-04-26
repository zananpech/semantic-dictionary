'use client';

interface SynonymTagProps {
  label: string;
  onPress?: (label: string) => void;
}

export function SynonymTag({ label, onPress }: SynonymTagProps) {
  return (
    <button
      onClick={() => onPress?.(label)}
      className="px-3 py-1 rounded-full text-xs font-bold transition-all
                 hover:scale-105 hover:opacity-80 active:scale-95"
      style={{
        color: 'var(--teal)',
        backgroundColor: 'var(--teal-bg)',
        border: '1.5px solid var(--teal-border)',
      }}
    >
      {label}
    </button>
  );
}
