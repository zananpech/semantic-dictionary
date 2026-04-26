// Client-side data loading — we fetch the JSON once, cache it in memory,
// then expose the same search() and getRandomWords() API as the mobile app.

import type { WordEntry } from './types';

let _dict: WordEntry[] | null = null;

async function getDict(): Promise<WordEntry[]> {
  if (_dict) return _dict;
  const res = await fetch('/clean_dictionary.json');
  const raw: { Word: string; POS: string; Definition: string }[] = await res.json();
  _dict = raw
    .map((item, i) => ({
      id: i,
      word: item.Word ?? '',
      pos: (item.POS ?? 'unknown').toLowerCase(),
      senses: [
        {
          definition: item.Definition ?? '',
          examples: [] as string[],
          synonyms: [] as string[],
        },
      ],
    }))
    .filter(e => e.word.length > 0);
  return _dict;
}

export async function loadDictionary(): Promise<WordEntry[]> {
  return getDict();
}

export function search(
  dict: WordEntry[],
  query: string,
  mode: 'semantic' | 'keyword',
): WordEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  if (mode === 'keyword') {
    return dict
      .filter(w => w.word.toLowerCase().includes(q) || w.pos.includes(q))
      .slice(0, 100);
  }

  // Semantic: score by how many query tokens appear in the definition
  const queryTokens = q.split(/\s+/).filter(Boolean);
  const scored = dict
    .map(entry => {
      const haystack = entry.senses
        .map(s => s.definition)
        .join(' ')
        .toLowerCase();
      const score = queryTokens.filter(t => haystack.includes(t)).length;
      return { entry, score };
    })
    .filter(r => r.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 100).map(r => r.entry);
}

export function getRandomWords(dict: WordEntry[], count = 5): WordEntry[] {
  const shuffled = [...dict].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
