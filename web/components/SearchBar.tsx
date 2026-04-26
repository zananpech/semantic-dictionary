'use client';

import { useRef } from 'react';

type Mode = 'semantic' | 'keyword';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  loading?: boolean;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChange,
  mode,
  onModeChange,
  loading,
  onClear,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const placeholder =
    mode === 'semantic'
      ? 'Describe the word you need…'
      : 'Type a word to look up…';

  return (
    <div className="flex flex-col gap-2 px-4 py-3" style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* Search pill */}
      <div
        className="flex items-center gap-2.5 h-13 px-4 rounded-2xl transition-shadow focus-within:shadow-lg"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1.5px solid var(--border-main)',
          boxShadow: '0 3px 8px rgba(108,99,255,0.10)',
          height: '54px',
        }}
      >
        <span className="text-lg shrink-0">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          className="flex-1 bg-transparent outline-none text-base font-medium placeholder:font-normal"
          style={{
            color: 'var(--text-heading)',
            // placeholder via css var trick
          }}
        />
        {loading ? (
          <div
            className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin shrink-0"
            style={{ borderColor: 'var(--indigo)', borderTopColor: 'transparent' }}
          />
        ) : value.length > 0 ? (
          <button
            onClick={() => { onClear?.(); inputRef.current?.focus(); }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                       shrink-0 transition-all hover:scale-110 active:scale-95"
            style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-muted)' }}
          >
            ✕
          </button>
        ) : null}
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        {(['semantic', 'keyword'] as const).map(m => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className="flex-1 h-9 rounded-xl text-sm font-bold transition-all
                       hover:opacity-90 active:scale-95"
            style={
              mode === m
                ? {
                    backgroundColor: 'var(--indigo)',
                    color: 'var(--text-on-color)',
                    border: '1.5px solid var(--indigo)',
                  }
                : {
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-muted)',
                    border: '1.5px solid var(--border-main)',
                  }
            }
          >
            {m === 'semantic' ? '✨ By meaning' : '🔤 By keyword'}
          </button>
        ))}
      </div>
    </div>
  );
}
