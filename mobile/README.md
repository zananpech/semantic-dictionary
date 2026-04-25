# Lexicon — Mobile App

A reverse dictionary mobile app built with **Expo** + **Gluestack UI**. Describe what you mean and find the perfect word.

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [Expo Go](https://expo.dev/go) on your phone (iOS or Android)

> **No simulator required.** Expo Go lets you preview the app instantly on your real device.

---

## Getting Started

### 1. Install dependencies

```bash
cd mobile
npm install
```

### 2. Start the dev server

```bash
npx expo start --clear
```

### 3. Open on your device

Once the server is running, a **QR code** will appear in your terminal.

| Platform | How to scan |
|---|---|
| **iOS** | Open the Camera app and point it at the QR code |
| **Android** | Open the Expo Go app and tap **Scan QR code** |

The app will load on your device automatically.

---

## Running on Simulators (optional)

If you have Xcode or Android Studio installed:

```bash
# iOS simulator
npx expo start --ios

# Android emulator
npx expo start --android
```

---

## Project Structure

```
mobile/
├── app/
│   ├── _layout.tsx        # Root layout (Gluestack provider, dark theme)
│   ├── index.tsx          # Home screen — search, discovery, results
│   └── bookmarks.tsx      # Saved words screen
├── components/
│   ├── SearchBar.tsx      # Search input with mode toggle
│   ├── WordCard.tsx       # Word result card (full + compact)
│   ├── PosBadge.tsx       # Part-of-speech colour badge
│   ├── SynonymTag.tsx     # Tappable synonym pill
│   └── EmptyState.tsx     # No results / empty views
├── lib/
│   ├── types.ts           # TypeScript types (WordEntry, Sense, Bookmark)
│   └── mockData.ts        # 20 mock words + search helpers (no API needed)
└── components/ui/         # Auto-generated Gluestack UI components
```

---

## Features

- 🔮 **Search by meaning** — describe a concept, find the word
- 🔤 **Search by keyword** — look up a specific word
- 💡 **Suggestion chips** — tap an example prompt to start searching
- 🎲 **Discovery words** — 5 random words on the home screen, refreshable
- ⭐ **Bookmarks** — save words and view them on a dedicated screen
- 📋 **Copy to clipboard** — tap 📋 on any word card

---

## Connecting to the Backend (future)

The app currently runs on **mock data** (`lib/mockData.ts`). To connect it to the real FastAPI backend:

1. Start the backend server from the repo root:
   ```bash
   bash start.sh
   ```

2. Find your machine's local IP address (e.g. `192.168.1.x`).

3. Update `lib/api.ts` (to be created) with your IP:
   ```ts
   const BASE_URL = 'http://192.168.1.x:8000';
   ```

4. Replace the `search` / `getRandomWords` calls in `app/index.tsx` with the API helpers.

> **Note:** Use your LAN IP — not `localhost`. On a physical device, `localhost` points to the device itself, not your computer.

---

## Resetting the Cache

If you run into any bundling issues:

```bash
npx expo start --clear
```
