"""Deterministic retrieval plus an optional injected embedding encoder."""
import math
from .corpus import tokens


def lexical_search(query, chunks, user, top_k=3):
    query_tokens = tokens(query)
    rows = []
    # Authorization happens before a chunk is scored or added to candidates.
    allowed = [c for c in chunks if user in c["allowed_users"]]
    for chunk in allowed:
        overlap = len(query_tokens & tokens(chunk["text"]))
        if overlap:
            rows.append({"chunk": chunk, "score": overlap / max(len(query_tokens), 1)})
    return sorted(rows, key=lambda r: (-r["score"], r["chunk"]["chunk_id"]))[:top_k]


def vectors(backend, texts):
    result = [[float(v) for v in row] for row in backend.encode(texts)]
    if len(result) != len(texts) or not result or not result[0]:
        raise ValueError("Embedding backend returned invalid vector count/dimension")
    width = len(result[0])
    if any(len(row) != width or not all(math.isfinite(v) for v in row) for row in result):
        raise ValueError("Embedding backend returned nonfinite or inconsistent vectors")
    return result


def cosine(a, b):
    if len(a) != len(b):
        raise ValueError("Query/document embedding dimensions differ")
    norm = math.sqrt(sum(v * v for v in a) * sum(v * v for v in b))
    return sum(x * y for x, y in zip(a, b)) / norm if norm else 0.0


class EmbeddingSearch:
    def __init__(self, chunks, backend):
        self.chunks, self.backend, self.cache = chunks, backend, {}

    def __call__(self, query, chunks, user, top_k=3):
        # Per-principal indexing: unauthorized text never reaches the encoder.
        allowed = [c for c in chunks if user in c["allowed_users"]]
        if not allowed:
            return []
        cache_key = (user, tuple(c["chunk_id"] for c in allowed))
        if cache_key not in self.cache:
            self.cache[cache_key] = vectors(self.backend, [c["text"] for c in allowed])
        query_vector = vectors(self.backend, [query])[0]
        rows = [{"chunk": c, "score": cosine(query_vector, v)}
                for c, v in zip(allowed, self.cache[cache_key])]
        return sorted(rows, key=lambda r: (-r["score"], r["chunk"]["chunk_id"]))[:top_k]


def select_evidence(query, ranked, chunks, user):
    """Conservative extractive teaching policy; never reads evaluation labels.

    A shared lexical coverage gate is deliberately kept for both retrievers.
    It is not a calibrated semantic confidence score. Fact keys are manually
    authored corpus metadata, not a learned contradiction detector.
    """
    if not ranked:
        return {"action": "abstain", "reason": "no_evidence", "citations": []}
    query_tokens = tokens(query)
    if len(query_tokens) < 3:
        return {"action": "clarify", "reason": "underspecified_query", "citations": []}
    best = ranked[0]["chunk"]
    overlap = len(query_tokens & tokens(best["text"]))
    if overlap < 2 or overlap / max(len(query_tokens), 1) < 0.35:
        return {"action": "abstain", "reason": "low_lexical_evidence", "citations": []}
    conflicts = [c for c in chunks if user in c["allowed_users"] and best["fact_key"]
                 and c["fact_key"] == best["fact_key"]]
    if len({c["text"] for c in conflicts}) > 1:
        return {"action": "clarify", "reason": "conflicting_sources", "citations": conflicts}
    if len(ranked) > 1 and math.isclose(ranked[0]["score"], ranked[1]["score"], abs_tol=1e-9):
        return {"action": "clarify", "reason": "tied_candidates", "citations": []}
    return {"action": "answer", "reason": "extractive_evidence", "citations": [best],
            "answer": best["text"]}
