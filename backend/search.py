"""
Search Engine: BM25 semantic search + keyword matching over the dictionary index.
"""

import json
import os
import re
from rank_bm25 import BM25Okapi


class SemanticSearchEngine:
    """Dual-mode search engine: keyword matching + BM25 semantic search."""

    def __init__(self, dictionary_path: str):
        self.dictionary = []
        self.bm25 = None
        self._corpus_tokens = []
        self._load(dictionary_path)

    def _load(self, path: str):
        """Load dictionary and build BM25 index."""
        with open(path, "r", encoding="utf-8") as f:
            self.dictionary = json.load(f)

        # Build BM25 corpus: each document is all definitions + synonyms for one entry
        self._corpus_tokens = []
        for entry in self.dictionary:
            doc_parts = []
            for sense in entry["senses"]:
                doc_parts.append(sense["definition"])
                doc_parts.extend(sense.get("synonyms", []))
                doc_parts.extend(sense.get("examples", []))
            doc_text = " ".join(doc_parts).lower()
            tokens = self._tokenize(doc_text)
            self._corpus_tokens.append(tokens)

        self.bm25 = BM25Okapi(self._corpus_tokens)
        print(f"Search engine loaded: {len(self.dictionary)} entries indexed")

    @staticmethod
    def _tokenize(text: str) -> list[str]:
        """Simple whitespace + punctuation tokenizer."""
        return re.findall(r"[a-z']+", text.lower())

    def search_keyword(self, query: str, limit: int = 20) -> list[dict]:
        """Search by keyword: exact and prefix matching on word headings."""
        query_lower = query.lower().strip()
        if not query_lower:
            return []

        exact = []
        starts_with = []
        contains = []

        for entry in self.dictionary:
            word = entry["word"]
            if word == query_lower:
                exact.append(entry)
            elif word.startswith(query_lower):
                starts_with.append(entry)
            elif query_lower in word:
                contains.append(entry)

        # Combine with priority: exact > starts_with > contains
        results = exact + starts_with[:limit] + contains[:limit]
        return results[:limit]

    def search_semantic(self, query: str, limit: int = 20) -> list[dict]:
        """Search by meaning: BM25 ranking over definitions."""
        query_lower = query.lower().strip()
        if not query_lower:
            return []

        tokens = self._tokenize(query_lower)
        if not tokens:
            return []

        scores = self.bm25.get_scores(tokens)

        # Get top indices sorted by score (descending)
        ranked_indices = sorted(
            range(len(scores)),
            key=lambda i: scores[i],
            reverse=True
        )

        results = []
        seen_words = set()

        for idx in ranked_indices:
            if scores[idx] <= 0:
                break
            entry = self.dictionary[idx]
            # Deduplicate by word (same word can appear with different POS)
            word_key = entry["word"]
            if word_key in seen_words:
                continue
            seen_words.add(word_key)

            result = {**entry, "score": round(float(scores[idx]), 3)}
            results.append(result)

            if len(results) >= limit:
                break

        return results

    def get_word(self, keyword: str) -> list[dict]:
        """Get all entries for a specific word."""
        keyword_lower = keyword.lower().strip()
        return [
            entry for entry in self.dictionary
            if entry["word"] == keyword_lower
        ]

    def get_random(self, count: int = 1) -> list[dict]:
        """Get random word entries for discovery."""
        import random
        if count >= len(self.dictionary):
            return self.dictionary
        # Prefer words with examples and synonyms for better display
        good_entries = [
            e for e in self.dictionary
            if any(s.get("examples") for s in e["senses"])
            and any(s.get("synonyms") for s in e["senses"])
            and len(e["word"]) > 3
        ]
        pool = good_entries if len(good_entries) >= count else self.dictionary
        return random.sample(pool, min(count, len(pool)))
