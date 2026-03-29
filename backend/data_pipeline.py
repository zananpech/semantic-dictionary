"""
Data Pipeline: Extracts words from WordNet and builds a searchable JSON index.
Run this once to generate data/dictionary.json.
"""

import json
import os
import sys
import nltk


def ensure_nltk_data():
    """Download required NLTK data if not already present."""
    for resource in ["wordnet", "omw-1.4"]:
        try:
            nltk.data.find(f"corpora/{resource}")
        except LookupError:
            print(f"Downloading NLTK resource: {resource}...")
            nltk.download(resource, quiet=True)


def build_dictionary():
    """Extract words, definitions, POS, examples, and synonyms from WordNet."""
    from nltk.corpus import wordnet as wn

    POS_MAP = {
        "n": "noun",
        "v": "verb",
        "a": "adjective",
        "r": "adverb",
        "s": "adjective satellite",
    }

    words = {}  # keyed by "word::pos" to group senses

    for synset in wn.all_synsets():
        pos = POS_MAP.get(synset.pos(), synset.pos())
        definition = synset.definition()
        examples = synset.examples()

        # Get all lemma names in this synset
        lemma_names = [lemma.name().replace("_", " ") for lemma in synset.lemmas()]

        for lemma in synset.lemmas():
            word = lemma.name().replace("_", " ")
            # Skip words with digits or very short words
            if any(c.isdigit() for c in word) or len(word) < 2:
                continue

            key = f"{word.lower()}::{pos}"

            if key not in words:
                words[key] = {
                    "word": word.lower(),
                    "pos": pos,
                    "senses": [],
                }

            # Synonyms are other words in the same synset
            synonyms = [w for w in lemma_names if w.lower() != word.lower()]

            words[key]["senses"].append({
                "definition": definition,
                "examples": examples,
                "synonyms": list(set(synonyms)),
            })

    # Convert to list and sort by word
    dictionary = sorted(words.values(), key=lambda x: x["word"])

    # Filter: keep only entries where at least one sense has a definition
    dictionary = [
        entry for entry in dictionary
        if any(s["definition"].strip() for s in entry["senses"])
    ]

    print(f"Extracted {len(dictionary)} word entries from WordNet")
    return dictionary


def save_dictionary(dictionary, output_path):
    """Save dictionary to JSON file."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(dictionary, f, ensure_ascii=False)
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"Saved dictionary to {output_path} ({size_mb:.1f} MB)")


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, "..", "data", "dictionary.json")

    print("=== Semantic Dictionary — Data Pipeline ===")
    print()

    ensure_nltk_data()
    dictionary = build_dictionary()
    save_dictionary(dictionary, output_path)

    print()
    print("Done! Dictionary is ready.")


if __name__ == "__main__":
    main()
