'use client';

import { useState } from 'react';
import type { WordEntry } from '@/lib/types';
import { PosBadge } from './PosBadge';
import { SynonymTag } from './SynonymTag';

interface WordCardProps {
  entry: WordEntry;
  compact?: boolean;
  bookmarked?: boolean;
  onBookmark?: (entry: WordEntry) => void;
  onSynonymPress?: (word: string) => void;
}

export function WordCard({
  entry,
  compact = false,
  bookmarked = false,
  onBookmark,
  onSynonymPress,
}: WordCardProps) {
  const [copied, setCopied] = useState(false);
  const firstSense = entry.senses[0];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(entry.word);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (compact) {
    return (
      <div
        className="rounded-2xl p-4 flex items-start gap-3 transition-all hover:shadow-md animate-fade-in-up"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1.5px solid var(--border-card)',
          boxShadow: '0 4px 12px rgba(108,99,255,0.08)',
        }}
      >
        <div className="flex-1 min-w-0">
          <p
            className="text-lg font-extrabold mb-1.5 tracking-tight leading-tight"
            style={{ color: 'var(--text-heading)' }}
          >
            {entry.word}
          </p>
          <div className="mb-2">
            <PosBadge pos={entry.pos} />
          </div>
          {firstSense && (
            <p
              className="text-sm line-clamp-2 leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              {firstSense.definition}
            </p>
          )}
        </div>
        <button
          onClick={() => onBookmark?.(entry)}
          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg
                     transition-all hover:scale-110 active:scale-95"
          style={{
            backgroundColor: bookmarked ? 'var(--amber)' : 'var(--surface-alt)',
          }}
          title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          {bookmarked ? '★' : '☆'}
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 animate-fade-in-up transition-all hover:shadow-lg"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1.5px solid var(--border-card)',
        boxShadow: '0 4px 16px rgba(108,99,255,0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex-1 min-w-0">
          <h2
            className="text-2xl font-extrabold tracking-tight mb-2"
            style={{ color: 'var(--text-heading)' }}
          >
            {entry.word}
          </h2>
          <PosBadge pos={entry.pos} />
        </div>
        <div className="flex gap-2 shrink-0">
          {/* Copy */}
          <button
            onClick={handleCopy}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base
                       transition-all hover:scale-110 active:scale-95"
            style={{ backgroundColor: 'var(--surface-alt)' }}
            title="Copy word"
          >
            {copied ? '✓' : '📋'}
          </button>
          {/* Bookmark */}
          <button
            onClick={() => onBookmark?.(entry)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base
                       transition-all hover:scale-110 active:scale-95"
            style={{ backgroundColor: bookmarked ? 'var(--amber)' : 'var(--surface-alt)' }}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            {bookmarked ? '★' : '☆'}
          </button>
        </div>
      </div>

      {/* Senses */}
      <div className="space-y-3">
        {entry.senses.slice(0, 3).map((sense, i) => (
          <div
            key={i}
            className={i > 0 ? 'pt-3' : ''}
            style={
              i > 0
                ? { borderTop: '1.5px solid var(--surface-alt)' }
                : undefined
            }
          >
            <p
              className="text-sm leading-relaxed mb-2 font-medium"
              style={{ color: 'var(--text-body)' }}
            >
              {sense.definition}
            </p>
            {sense.examples[0] && (
              <p
                className="text-xs italic leading-relaxed mb-2.5 pl-3"
                style={{
                  color: 'var(--text-muted)',
                  borderLeft: '3px solid var(--indigo)',
                }}
              >
                &quot;{sense.examples[0]}&quot;
              </p>
            )}
            {sense.synonyms.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {sense.synonyms.slice(0, 6).map(syn => (
                  <SynonymTag key={syn} label={syn} onPress={onSynonymPress} />
                ))}
              </div>
            )}
          </div>
        ))}
        {entry.senses.length > 3 && (
          <p
            className="text-xs text-center font-semibold pt-1"
            style={{ color: 'var(--text-label)' }}
          >
            +{entry.senses.length - 3} more sense
            {entry.senses.length - 3 !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
}
