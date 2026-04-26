'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Bookmark } from '@/lib/types';
import { PosBadge } from '@/components/PosBadge';
import { EmptyState } from '@/components/EmptyState';

const BM_KEY = 'lexicon-bookmarks';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BM_KEY);
      if (raw) setBookmarks(JSON.parse(raw));
    } catch {}
  }, []);

  const remove = (bm: Bookmark) => {
    const next = bookmarks.filter(
      b => !(b.word === bm.word && b.pos === bm.pos),
    );
    setBookmarks(next);
    localStorage.setItem(BM_KEY, JSON.stringify(next));
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* Header */}
      <header
        className="flex items-center gap-3 px-5 pt-5 pb-4 sticky top-0 z-10"
        style={{
          backgroundColor: 'var(--page-bg)',
          borderBottom: '1.5px solid var(--border-card)',
        }}
      >
        <Link href="/" aria-label="Back">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold
                       transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1.5px solid var(--border-main)',
              color: 'var(--indigo)',
              boxShadow: '0 2px 4px rgba(108,99,255,0.10)',
            }}
          >
            ←
          </div>
        </Link>

        <h1
          className="flex-1 text-xl font-extrabold tracking-tight"
          style={{ color: 'var(--text-heading)' }}
        >
          Saved Words
        </h1>

        {bookmarks.length > 0 && (
          <span
            className="px-3 py-1 rounded-full text-xs font-extrabold"
            style={{ backgroundColor: 'var(--coral)', color: 'var(--text-on-color)' }}
          >
            {bookmarks.length}
          </span>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full px-4 py-4 pb-12">
          {bookmarks.length === 0 ? (
            <EmptyState
              icon="📚"
              title="No saved words yet"
              subtitle={"Tap the ☆ on any word\nto save it here."}
            />
          ) : (
            <div className="flex flex-col gap-2.5 stagger-children">
              {bookmarks.map(bm => (
                <div
                  key={`${bm.word}-${bm.pos}`}
                  className="flex items-start gap-3 p-4 rounded-2xl animate-fade-in-up
                             transition-all hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1.5px solid var(--border-card)',
                    boxShadow: '0 3px 10px rgba(108,99,255,0.07)',
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-lg font-extrabold tracking-tight mb-1.5"
                      style={{ color: 'var(--text-heading)' }}
                    >
                      {bm.word}
                    </p>
                    <div className="mb-2">
                      <PosBadge pos={bm.pos} />
                    </div>
                    <p
                      className="text-sm leading-relaxed line-clamp-2"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {bm.definition}
                    </p>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => remove(bm)}
                    className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center
                               text-xs font-bold transition-all hover:scale-110 active:scale-95 mt-0.5"
                    style={{
                      backgroundColor: 'var(--coral-light)',
                      border: '1.5px solid var(--coral-border)',
                      color: 'var(--coral)',
                    }}
                    title="Remove bookmark"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
