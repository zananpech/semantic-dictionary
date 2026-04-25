// Load the bundled dictionary JSON and expose search helpers.
// Raw entries are shaped { Word, POS, Definition }; we normalise them
// to the WordEntry interface: { word, pos, senses: [{ definition, examples, synonyms }] }.

import { WordEntry } from './types';

const RAW = require('../assets/clean_dictionary.json');

/** @type {import('./types').WordEntry[]} */
export const DICTIONARY: import('./types').WordEntry[] = RAW
  .map((item: any, i: number) => ({
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
  .filter((e: import('./types').WordEntry) => e.word.length > 0);

/**
 * Search the dictionary.
 * @param {string} query
 * @param {'semantic' | 'keyword'} mode
 * @returns {import('./types').WordEntry[]}
 */
export function search(query: string, mode: 'semantic' | 'keyword'): WordEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  if (mode === 'keyword') {
    return DICTIONARY.filter(
      (w) => w.word.toLowerCase().includes(q) || w.pos.includes(q)
    ).slice(0, 100);
  }

  // Semantic: score by how many query tokens appear in the definition
  const queryTokens = q.split(/\s+/).filter(Boolean);
  const scored = DICTIONARY.map((entry) => {
    const haystack = entry.senses
      .map((s) => s.definition)
      .join(' ')
      .toLowerCase();
    const score = queryTokens.filter((t) => haystack.includes(t)).length;
    return { entry, score };
  }).filter((r) => r.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 100).map((r) => r.entry);
}

/**
 * Return a random sample of dictionary entries.
 * @param {number} count
 * @returns {import('./types').WordEntry[]}
 */
export function getRandomWords(count: number = 5): WordEntry[] {
  const shuffled = [...DICTIONARY].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
