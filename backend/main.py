"""
Semantic Dictionary — FastAPI Backend
Serves the API and the frontend static files.
"""

import os
import subprocess
import sys

from fastapi import FastAPI, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager

from search import SemanticSearchEngine

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(SCRIPT_DIR, "..", "data", "dictionary.json")
FRONTEND_DIR = os.path.join(SCRIPT_DIR, "..", "frontend")


def ensure_dictionary():
    """Build the dictionary index if it doesn't exist."""
    if not os.path.exists(DATA_PATH):
        print("Dictionary index not found. Running data pipeline...")
        pipeline_script = os.path.join(SCRIPT_DIR, "data_pipeline.py")
        subprocess.run([sys.executable, pipeline_script], check=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: ensure data exists and load search engine."""
    ensure_dictionary()
    app.state.engine = SemanticSearchEngine(DATA_PATH)
    yield


app = FastAPI(
    title="Semantic Dictionary",
    description="Find the perfect word to express yourself",
    lifespan=lifespan,
)


@app.get("/api/search")
async def search(
    q: str = Query(..., min_length=1, description="Search query"),
    mode: str = Query("semantic", description="Search mode: 'semantic' or 'keyword'"),
    limit: int = Query(20, ge=1, le=50, description="Max results"),
):
    """Search for words by keyword or meaning."""
    engine: SemanticSearchEngine = app.state.engine

    if mode == "keyword":
        results = engine.search_keyword(q, limit=limit)
    else:
        results = engine.search_semantic(q, limit=limit)

    return {"query": q, "mode": mode, "count": len(results), "results": results}


@app.get("/api/word/{keyword}")
async def get_word(keyword: str):
    """Get full details for a specific word."""
    engine: SemanticSearchEngine = app.state.engine
    results = engine.get_word(keyword)
    if not results:
        return {"error": "Word not found", "keyword": keyword}
    return {"keyword": keyword, "entries": results}


@app.get("/api/random")
async def random_word(count: int = Query(5, ge=1, le=20)):
    """Get random words for discovery."""
    engine: SemanticSearchEngine = app.state.engine
    results = engine.get_random(count)
    return {"results": results}


# Serve frontend static files
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")


@app.get("/")
async def serve_frontend():
    """Serve the main frontend page."""
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))
