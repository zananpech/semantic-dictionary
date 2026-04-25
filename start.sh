#!/usr/bin/env bash
# ─────────────────────────────────────────────
#  Semantic Dictionary — Start Script
#  Starts the FastAPI backend which also serves
#  the static frontend at http://localhost:8000
# ─────────────────────────────────────────────

set -e  # Exit immediately on error

# Resolve the project root relative to this script
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║       Semantic Dictionary 📖         ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ── 1. Sync dependencies with uv ──
echo "▶ Syncing dependencies with uv..."
cd "$ROOT"
uv sync

echo ""
echo "▶ Starting server..."
echo "   Backend API  →  http://localhost:8000/api"
echo "   Frontend     →  http://localhost:8000"
echo ""
echo "   Press Ctrl+C to stop."
echo ""

# ── 2. Launch FastAPI via uv run (uses the managed .venv) ──
cd "$BACKEND"
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
