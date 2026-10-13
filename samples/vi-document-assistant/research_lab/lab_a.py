"""Lab A: evaluate retrieval separately from a synthetic extractive policy."""
from datetime import datetime, timezone
import hashlib
import json
import math
from pathlib import Path
import platform
from time import perf_counter
from .corpus import exact_citation, load_fixture
from .embeddings import MODEL_CARD
from .retrieval import EmbeddingSearch, lexical_search, select_evidence

TOP_K = 3


def average(values):
    return sum(values) / len(values) if values else None


def evaluate(search, chunks, questions, split):
    rows = []
    for case in (q for q in questions if q["split"] == split):
        start = perf_counter()
        ranked = search(case["question"], chunks, case["user"], TOP_K)
        decision = select_evidence(case["question"], ranked, chunks, case["user"])
        elapsed = (perf_counter() - start) * 1000
        retrieved = [r["chunk"]["chunk_id"] for r in ranked]
        gold = set(case["gold"])
        hit_positions = [i + 1 for i, identifier in enumerate(retrieved) if identifier in gold]
        citation_checks = [exact_citation(c, chunks, case["user"]) for c in decision["citations"]]
        reasons = []
        if decision["action"] != case["expected_action"]:
            reasons.append("wrong_action")
        if case["category"] == "answerable" and not any(
            c["chunk_id"] in gold for c in decision["citations"]
        ):
            reasons.append("missing_gold_citation")
        if not all(citation_checks):
            reasons.append("inexact_or_unauthorized_citation")
        rows.append({
            "id": case["id"], "category": case["category"], "question": case["question"],
            "expected_action": case["expected_action"], "gold": case["gold"],
            "retrieved": [{"chunk_id": r["chunk"]["chunk_id"], "score": r["score"]} for r in ranked],
            "recall_at_k": len(set(retrieved) & gold) / len(gold) if gold else None,
            "reciprocal_rank": 1 / hit_positions[0] if hit_positions else (0.0 if gold else None),
            "hit_at_1": bool(retrieved and retrieved[0] in gold) if gold else None,
            "citation_exactness": all(citation_checks) if citation_checks else None,
            "decision": decision, "passed": not reasons, "failures": reasons, "latency_ms": elapsed,
        })
    evidence_rows = [r for r in rows if r["gold"]]
    latencies = sorted(r["latency_ms"] for r in rows)
    return {
        "split": split, "count": len(rows),
        "retrieval": {
            "top_k": TOP_K, "evidence_cases": len(evidence_rows),
            "recall_at_k": average([r["recall_at_k"] for r in evidence_rows]),
            "mrr_at_k": average([r["reciprocal_rank"] for r in evidence_rows]),
            "hit_at_1": average([r["hit_at_1"] for r in evidence_rows]),
            "denominator": "Cases with labeled evidence, including conflicting-source questions.",
        },
        "decision_accuracy": average([r["passed"] for r in rows]),
        "by_category": {
            category: {"count": sum(r["category"] == category for r in rows),
                       "action_accuracy": average([r["decision"]["action"] == r["expected_action"]
                                                   for r in rows if r["category"] == category])}
            for category in ("answerable", "unanswerable", "ambiguous")
        },
        "failures": [{"id": r["id"], "reasons": r["failures"]} for r in rows if r["failures"]],
        "latency_ms": {"p50": latencies[math.ceil(len(rows) * .5) - 1],
                       "p95": latencies[math.ceil(len(rows) * .95) - 1],
                       "convention": "nearest rank", "scope": "retrieval plus decision, cold first index included"},
        "cases": rows,
    }


def run(embedding_backend=None, split="dev"):
    if split not in ("dev", "test", "all"):
        raise ValueError("split must be dev, test or all")
    selected_splits = ("dev", "test") if split == "all" else (split,)
    chunks, questions, issues, provenance = load_fixture()
    # Both variants share byte-identical data, split, top-k and decision policy.
    searches = {"lexical": lexical_search}
    metadata = {"lexical": {"method": "accent-insensitive token overlap", "is_mock": False,
                            "model": "none", "generation": "none"}}
    if embedding_backend is not None:
        details = getattr(embedding_backend, "metadata", None)
        if not isinstance(details, dict) or type(details.get("is_mock")) is not bool:
            raise ValueError("Embedding backend metadata must declare is_mock true or false")
        json.dumps(details, allow_nan=False)
        searches["embedding"] = EmbeddingSearch(chunks, embedding_backend)
        metadata["embedding"] = details
    report = {
        "lab": "A", "schema_version": 1, "synthetic_data": True, "selected_split": split,
        "run": {"utc": datetime.now(timezone.utc).isoformat(), "python": platform.python_version(),
                "platform": platform.platform(), "provider_cost_usd": 0, "generation": "not_run"},
        "provenance": {**provenance, "source_hashes": {
            p.name: hashlib.sha256(p.read_bytes()).hexdigest()
            for p in sorted(Path(__file__).parent.glob("*.py"))
        }},
        "corpus": {"documents": 12, "chunks": len(chunks), "ingestion_issues": issues},
        "model_card": MODEL_CARD, "methods": {},
        "policy": {"minimum_overlap": 2, "minimum_coverage": .35,
                   "clarify": "fewer than 3 tokens, tied top scores, or conflicting authored fact keys",
                   "threshold_selection": "Fixed teaching values, not optimized or calibrated on test.",
                   "split_use": "Develop with dev; select test explicitly for final evaluation."},
        "limitations": [
            "Retrieval and exact-extractive decisions only; no LLM generation or semantic groundedness judge.",
            "Exact citation checks prove source location/text and ACL, not that evidence supports arbitrary claims.",
            "Small synthetic questions are not a benchmark of real Vietnamese document quality.",
            "Conflict detection uses manually authored fact keys and is not general contradiction detection.",
            "Inspecting the test cases creates evaluation leakage; do not tune using their outcomes.",
        ],
    }
    for name, search in searches.items():
        report["methods"][name] = {"metadata": metadata[name], **{
            name: evaluate(search, chunks, questions, name) for name in selected_splits
        }}
    json.dumps(report, ensure_ascii=False, allow_nan=False)
    return report
