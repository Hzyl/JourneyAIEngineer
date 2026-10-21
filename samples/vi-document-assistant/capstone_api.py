"""Local-only teaching service over synthetic Lab A data; not production auth."""
from contextlib import asynccontextmanager, closing
import logging
import os
from pathlib import Path
import sqlite3
from time import perf_counter
from typing import Literal
from uuid import uuid4

from fastapi import Depends, FastAPI, Header, HTTPException, Request
from pydantic import BaseModel, ConfigDict, Field

from research_lab.corpus import load_fixture
from research_lab.ranking import methods, permitted
from research_lab.retrieval import select_evidence

LOG = logging.getLogger("journey.capstone")
LOG.setLevel(logging.INFO)
if not LOG.handlers:
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter("%(asctime)s %(name)s %(message)s"))
    LOG.addHandler(handler)
LAB_KEYS = {"demo-A-public": "A", "demo-B-public": "B"}


class Question(BaseModel):
    model_config = ConfigDict(extra="forbid")
    question: str = Field(min_length=3, max_length=400, pattern=r"\S")
    method: Literal["lexical", "bm25", "vector", "hybrid", "hybrid_phrase_rerank"] = "lexical"
    document_id: str | None = Field(default=None, max_length=80, pattern=r"^[a-z0-9-]+$")


def principal(x_lab_key: str | None = Header(default=None)):
    user = LAB_KEYS.get(x_lab_key or "")
    if user is None:
        raise HTTPException(401, "Use a documented synthetic lab identity")
    return user


def connection(path):
    return closing(sqlite3.connect(path, timeout=3))


def create_app(state_dir=None):
    state = Path(state_dir or os.environ.get("LAB_STATE_DIR", ".build/rag-capstone"))
    database = state / "requests.sqlite"
    chunks, _, _, provenance = load_fixture()
    searches = methods()

    @asynccontextmanager
    async def lifespan(app):
        state.mkdir(parents=True, exist_ok=True)
        with connection(database) as db:
            db.execute("CREATE TABLE IF NOT EXISTS counters (name TEXT PRIMARY KEY, value INTEGER NOT NULL)")
            db.execute("INSERT OR IGNORE INTO counters VALUES ('completed_queries', 0)")
            db.commit()
        yield

    app = FastAPI(title="Journey synthetic RAG capstone", lifespan=lifespan,
                  docs_url=None, redoc_url=None, openapi_url=None)

    @app.middleware("http")
    async def trace(request: Request, call_next):
        trace_id = uuid4().hex
        started = perf_counter()
        response = await call_next(request)
        elapsed = (perf_counter() - started) * 1000
        # No headers, user text, source content, tokens or raw query strings.
        route = request.url.path if request.url.path in ("/health", "/ready", "/query", "/stats") else "other"
        LOG.info("trace_id=%s route=%s status=%s elapsed_ms=%.3f", trace_id, route, response.status_code, elapsed)
        response.headers["X-Trace-Id"] = trace_id
        return response

    @app.get("/health")
    def health():
        return {"status": "alive", "synthetic_data": True, "generation": "not_run"}

    @app.get("/ready")
    def ready():
        try:
            with connection(database) as db:
                db.execute("SELECT value FROM counters WHERE name='completed_queries'").fetchone()
        except sqlite3.Error:
            raise HTTPException(503, "Lab state unavailable") from None
        return {"status": "ready", "chunks": len(chunks), "corpus_sha256": provenance["corpus_sha256"]}

    @app.get("/stats")
    def stats(user=Depends(principal)):
        with connection(database) as db:
            count = db.execute("SELECT value FROM counters WHERE name='completed_queries'").fetchone()[0]
        return {"completed_queries": count, "scope": "aggregate synthetic requests, persisted locally"}

    @app.post("/query")
    def query(payload: Question, user=Depends(principal)):
        started = perf_counter()
        authorized = permitted(chunks, user, payload.document_id)
        ranked = searches[payload.method](payload.question, authorized, user, 3)
        decision = select_evidence(payload.question, ranked, authorized, user)
        # Persist counters only; learner questions and source text never enter this database.
        with connection(database) as db:
            db.execute("UPDATE counters SET value=value+1 WHERE name='completed_queries'")
            db.commit()
        return {
            "method": payload.method, "action": decision["action"], "reason": decision["reason"],
            "answer": decision.get("answer"),
            "citations": [{key: c[key] for key in ("document_id", "version", "chunk_id", "line", "text")}
                          for c in decision["citations"]],
            "latency_ms": (perf_counter() - started) * 1000,
            "generation": "not_run", "provider_cost_usd": 0, "synthetic_data": True,
        }

    return app


app = create_app()
