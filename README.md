# Lexicon — Semantic Dictionary

> *Find the perfect word to express yourself.*

Lexicon is a semantic dictionary that lets you search by **meaning**, not just spelling. Describe what you want to say and it surfaces the right word — powered by BM25 ranking over WordNet definitions, examples, and synonyms.

The project is a **monorepo** with three sub-projects:

| Sub-project | Stack | Purpose |
|-------------|-------|---------|
| `backend/`  | Python · FastAPI · BM25 | REST API + data pipeline |
| `mobile/`   | React Native · Expo · NativeWind | iOS / Android app |
| `web/`      | Next.js 16 · shadcn/ui · Tailwind CSS 4 | Browser app |

---

## Features

- **Semantic search** — describe a concept and find matching words (BM25 over definitions, examples, and synonyms)
- **Keyword search** — exact, prefix, and substring matching on word headings
- **Word discovery** — random word surfacing weighted toward rich entries
- **Bookmarks** — save words for later across both mobile and web
- **Word detail view** — POS, all senses, example sentences, and synonyms

---

## Project Structure

```
semantic-dictionary/
├── backend/
│   ├── main.py            # FastAPI app — search & word endpoints
│   ├── search.py          # SemanticSearchEngine (BM25 + keyword)
│   └── data_pipeline.py   # One-time script: WordNet → data/dictionary.json
├── data/
│   ├── dictionary.json    # Generated WordNet index (~38 MB)
│   └── clean_dictionary.json  # Cleaned subset used by the mobile app
├── mobile/                # Expo / React Native app
│   ├── app/
│   │   ├── index.tsx      # Search & discovery screen
│   │   └── bookmarks.tsx  # Saved words screen
│   └── lib/               # Data loading utilities
├── web/                   # Next.js web app
│   └── app/
│       ├── page.tsx       # Main search page
│       └── bookmarks/     # Bookmarks page
├── start.sh               # One-command dev launcher (backend)
└── pyproject.toml         # Python dependencies (managed by uv)
```

---

## Quick Start

### Backend

Requirements: Python ≥ 3.10, [uv](https://docs.astral.sh/uv/)

```bash
# Install dependencies and start the API server
./start.sh
```

The server starts at **http://localhost:8000**.

#### First-time setup — build the dictionary index

If `data/dictionary.json` doesn't exist yet, the server will build it automatically on startup (requires NLTK WordNet data). You can also run it manually:

```bash
uv run python backend/data_pipeline.py
```

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/search?q=<query>&mode=semantic\|keyword&limit=20` | Search words |
| `GET` | `/api/word/<keyword>` | Fetch all senses for a word |
| `GET` | `/api/random?count=5` | Random word discovery |

---

### Web App

Requirements: Node.js ≥ 18

```bash
cd web
npm install
npm run dev
```

Opens at **http://localhost:3000**.

---

### Mobile App

Requirements: Node.js ≥ 18, Expo CLI (`npm install -g expo-cli`)

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app, or press `a` / `i` for Android / iOS simulator.

---

## Tech Stack

### Backend
- **FastAPI** — async REST API
- **rank-bm25** — BM25Okapi ranking over definition corpus
- **NLTK / WordNet** — source dictionary data
- **uv** — dependency management and virtual environment

### Web
- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4** + **shadcn/ui** components
- **TypeScript**

### Mobile
- **Expo** (SDK 54) + **React Native 0.81**
- **NativeWind** (Tailwind for React Native)
- **Expo Router** — file-based navigation
- **Gluestack UI** — component primitives
- **AsyncStorage** — local bookmark persistence

---

## Data

The dictionary is sourced from **WordNet** via NLTK. The pipeline (`data_pipeline.py`) extracts every synset and groups senses by word + part-of-speech, producing a structured JSON array:

```json
{
  "word": "ephemeral",
  "pos": "adjective",
  "senses": [
    {
      "definition": "lasting for a markedly brief time",
      "examples": ["the ephemeral joys of childhood"],
      "synonyms": ["fugacious", "passing", "short-lived", "transient", "transitory"]
    }
  ]
}
```

The mobile app uses `data/clean_dictionary.json` — a cleaned/filtered subset of the full index.

---

## Environment Variables

Create `backend/.env.local` for any secrets (e.g. HuggingFace token for embedding experiments):

```
HF_TOKEN=hf_...
```

---

## License

MIT
