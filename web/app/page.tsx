'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { loadDictionary, search, getRandomWords } from '@/lib/loadData';
import type { WordEntry, Bookmark } from '@/lib/types';
import { SearchBar } from '@/components/SearchBar';
import { WordCard } from '@/components/WordCard';
import { EmptyState } from '@/components/EmptyState';

const SUGGEST_PROMPTS = [
  { label: '🌧 Smell of rain on earth',         q: 'smell of rain on dry earth' },
  { label: '🕰 Nostalgia for a time never lived', q: 'nostalgia for a time you never lived in' },
  { label: '🗣 Someone who talks too much',       q: 'someone who talks excessively' },
  { label: '💡 Sudden moment of insight',         q: 'sudden moment of clarity or insight' },
  { label: '😶‍🌫️ Deep unexplained sadness',     q: 'deep sadness without obvious cause' },
];

const BM_KEY = 'lexicon-bookmarks';

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-4">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="skeleton rounded-2xl"
          style={{ height: '130px', animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const [dict, setDict] = useState<WordEntry[]>([]);
  const [dictLoading, setDictLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'semantic' | 'keyword'>('semantic');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<WordEntry[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [discovery, setDiscovery] = useState<WordEntry[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load dictionary on mount
  useEffect(() => {
    loadDictionary().then(d => {
      setDict(d);
      setDiscovery(getRandomWords(d, 5));
      setDictLoading(false);
    });
  }, []);

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(BM_KEY);
      if (raw) setBookmarks(JSON.parse(raw));
    } catch {}
  }, []);

  const saveBookmarks = (next: Bookmark[]) => {
    localStorage.setItem(BM_KEY, JSON.stringify(next));
  };

  const handleBookmark = useCallback((entry: WordEntry) => {
    const def = entry.senses[0]?.definition ?? '';
    const bm: Bookmark = { word: entry.word, pos: entry.pos, definition: def };
    setBookmarks(prev => {
      const exists = prev.some(b => b.word === entry.word && b.pos === entry.pos);
      const next = exists
        ? prev.filter(b => !(b.word === entry.word && b.pos === entry.pos))
        : [...prev, bm];
      saveBookmarks(next);
      return next;
    });
  }, []);

  const isBookmarked = (entry: WordEntry) =>
    bookmarks.some(b => b.word === entry.word && b.pos === entry.pos);

  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!text.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    searchTimeout.current = setTimeout(() => {
      setResults(search(dict, text.trim(), mode));
      setHasSearched(true);
      setLoading(false);
    }, 300);
  };

  const handleModeChange = (next: 'semantic' | 'keyword') => {
    setMode(next);
    if (query.trim()) {
      setLoading(true);
      setTimeout(() => {
        setResults(search(dict, query.trim(), next));
        setLoading(false);
      }, 150);
    }
  };

  const handleSynonymPress = (word: string) => {
    setQuery(word);
    setMode('keyword');
    setResults(search(dict, word, 'keyword'));
    setHasSearched(true);
  };

  const handleChipPress = (q: string) => {
    setQuery(q);
    setMode('semantic');
    setResults(search(dict, q, 'semantic'));
    setHasSearched(true);
  };

  const showHome = !hasSearched && !query;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* ── Header ── */}
      <header
        className="flex items-center justify-between px-5 pt-5 pb-3 sticky top-0 z-10"
        style={{ backgroundColor: 'var(--page-bg)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center text-base font-extrabold"
            style={{ backgroundColor: 'var(--indigo)', color: 'var(--text-on-color)' }}
          >
            L
          </div>
          <span
            className="text-xl font-extrabold tracking-tight"
            style={{ color: 'var(--text-heading)' }}
          >
            Lexicon
          </span>
        </div>

        <Link href="/bookmarks" aria-label="Saved words">
          <div
            className="relative w-10 h-10 rounded-2xl flex items-center justify-center text-lg
                       transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1.5px solid var(--border-main)',
              boxShadow: '0 2px 6px rgba(108,99,255,0.10)',
            }}
          >
            🔖
            {bookmarks.length > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full
                           text-[9px] font-extrabold flex items-center justify-center px-1"
                style={{
                  backgroundColor: 'var(--coral)',
                  color: 'var(--text-on-color)',
                  border: '2px solid var(--page-bg)',
                }}
              >
                {bookmarks.length > 9 ? '9+' : bookmarks.length}
              </span>
            )}
          </div>
        </Link>
      </header>

      {/* ── Search Bar ── */}
      <SearchBar
        value={query}
        onChange={handleQueryChange}
        mode={mode}
        onModeChange={handleModeChange}
        loading={loading}
        onClear={() => {
          setQuery('');
          setResults([]);
          setHasSearched(false);
        }}
      />

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full">
          {dictLoading ? (
            <LoadingSkeleton />
          ) : showHome ? (
            /* ── Home: Hero + Chips + Discovery ── */
            <div className="px-4 pb-12">
              {/* Hero */}
              <div className="text-center py-10 animate-fade-in-up">
                <h1
                  className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-3"
                  style={{ color: 'var(--text-heading)' }}
                >
                  Find the{' '}
                  <span style={{ color: 'var(--indigo)' }}>perfect word</span>
                </h1>
                <p
                  className="text-base leading-relaxed max-w-sm mx-auto"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Express yourself better — discover words you didn&apos;t know you needed.
                </p>
              </div>

              {/* Suggestion Chips */}
              <p
                className="text-[11px] font-extrabold uppercase tracking-widest mb-3"
                style={{ color: 'var(--text-label)' }}
              >
                Try describing…
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar mb-7">
                {SUGGEST_PROMPTS.map(p => (
                  <button
                    key={p.q}
                    onClick={() => handleChipPress(p.q)}
                    className="shrink-0 h-9 px-4 rounded-full text-sm font-semibold
                               whitespace-nowrap transition-all hover:scale-105 hover:shadow-md
                               active:scale-95"
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: '1.5px solid var(--border-main)',
                      color: 'var(--text-body)',
                      boxShadow: '0 2px 4px rgba(108,99,255,0.08)',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Discovery */}
              <div className="flex items-center justify-between mb-3">
                <p
                  className="text-[11px] font-extrabold uppercase tracking-widest"
                  style={{ color: 'var(--text-label)' }}
                >
                  Words to explore
                </p>
                <button
                  onClick={() => setDiscovery(getRandomWords(dict, 5))}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all
                             hover:opacity-90 active:scale-95"
                  style={{
                    backgroundColor: 'var(--amber)',
                    color: 'var(--text-on-color)',
                  }}
                >
                  ↻ Shuffle
                </button>
              </div>

              <div className="flex flex-col gap-2.5 stagger-children">
                {discovery.map(entry => (
                  <WordCard
                    key={entry.id}
                    entry={entry}
                    compact
                    bookmarked={isBookmarked(entry)}
                    onBookmark={handleBookmark}
                    onSynonymPress={handleSynonymPress}
                  />
                ))}
              </div>
            </div>
          ) : hasSearched && results.length === 0 ? (
            <EmptyState
              title="No words found"
              subtitle="Try rephrasing or switching to a different mode."
            />
          ) : (
            /* ── Results ── */
            <div className="px-4 pb-12">
              <p
                className="text-[11px] font-extrabold uppercase tracking-widest mt-3 mb-4"
                style={{ color: 'var(--text-label)' }}
              >
                {results.length} word{results.length !== 1 ? 's' : ''} found
              </p>
              <div className="flex flex-col gap-3 stagger-children">
                {results.map(item => (
                  <WordCard
                    key={item.id}
                    entry={item}
                    bookmarked={isBookmarked(item)}
                    onBookmark={handleBookmark}
                    onSynonymPress={handleSynonymPress}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
