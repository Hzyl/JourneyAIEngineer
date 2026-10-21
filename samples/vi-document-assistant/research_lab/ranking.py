"""Inspectable retrieval ablations; no model download, provider or evaluation labels."""
from collections import Counter
import math
import re
import unicodedata

from .retrieval import EmbeddingSearch, lexical_search


def words(text):
    normalized = unicodedata.normalize("NFD", text.casefold().replace("đ", "d"))
    normalized = "".join(c for c in normalized if unicodedata.category(c) != "Mn")
    return re.findall(r"\w+", normalized)


def permitted(chunks, user, document_id=None):
    # Filter before scoring AND before computing corpus statistics/encoding.
    return [c for c in chunks if user in c["allowed_users"]
            and (document_id is None or c["document_id"] == document_id)]


def checked_k(top_k):
    if type(top_k) is not int or not 1 <= top_k <= 100:
        raise ValueError("top_k must be an integer in 1..100")


def ordered(rows, top_k):
    return sorted(rows, key=lambda row: (-row["score"], row["chunk"]["chunk_id"]))[:top_k]


def bm25(query, chunks, user, top_k=3):
    checked_k(top_k)
    allowed = permitted(chunks, user)
    if not allowed:
        return []
    documents = [Counter(words(c["text"])) for c in allowed]
    average_length = sum(sum(d.values()) for d in documents) / len(documents)
    if average_length == 0:
        return []
    terms = set(words(query))
    frequency = {term: sum(term in doc for doc in documents) for term in terms}
    rows = []
    k1, b = 1.2, 0.75
    for chunk, doc in zip(allowed, documents):
        score = 0.0
        for term in terms:
            tf = doc[term]
            idf = math.log(1 + (len(documents) - frequency[term] + .5) / (frequency[term] + .5))
            denominator = tf + k1 * (1 - b + b * sum(doc.values()) / average_length)
            score += idf * tf * (k1 + 1) / denominator
        if score > 0:
            rows.append({"chunk": chunk, "score": score})
    return ordered(rows, top_k)


def character_counts(text):
    normalized = " ".join(words(text))
    return Counter(normalized[index:index + 3] for index in range(max(0, len(normalized) - 2)))


def character_search(query, chunks, user, top_k=3):
    """Sparse character trigram cosine baseline, NOT pretrained semantic embeddings."""
    checked_k(top_k)
    query_counts = character_counts(query)
    query_norm = math.sqrt(sum(value * value for value in query_counts.values()))
    if not query_norm:
        return []
    rows = []
    for chunk in permitted(chunks, user):
        counts = character_counts(chunk["text"])
        norm = math.sqrt(sum(value * value for value in counts.values()))
        score = sum(value * counts[key] for key, value in query_counts.items()) / (query_norm * norm) if norm else 0
        if score > 0:
            rows.append({"chunk": chunk, "score": score})
    return ordered(rows, top_k)


def fuse(rankings, top_k=3, constant=60):
    """Teaching convention: 1-based ranks, k=60; not Qdrant's default formula."""
    checked_k(top_k)
    if not math.isfinite(constant) or constant <= 0:
        raise ValueError("RRF constant must be finite and positive")
    merged = {}
    for ranking in rankings:
        seen = set()
        for rank, row in enumerate(ranking, 1):
            identifier = row["chunk"]["chunk_id"]
            if identifier in seen:
                raise ValueError("Duplicate candidate within a ranking")
            seen.add(identifier)
            target = merged.setdefault(identifier, {"chunk": row["chunk"], "score": 0.0})
            if target["chunk"] != row["chunk"]:
                raise ValueError("Conflicting candidate metadata")
            target["score"] += 1 / (constant + rank)
    return ordered(list(merged.values()), top_k)


class HybridSearch:
    def __init__(self, vector_search=character_search, candidates=6):
        checked_k(candidates)
        self.vector_search = vector_search
        self.candidates = candidates

    def __call__(self, query, chunks, user, top_k=3):
        checked_k(top_k)
        allowed = permitted(chunks, user)
        count = max(top_k, self.candidates)
        rankings = [bm25(query, allowed, user, count), self.vector_search(query, allowed, user, count)]
        return fuse(rankings, top_k)


def phrase_scores(query, candidates):
    """Heuristic reranker: ordered bigram overlap, NOT a learned CrossEncoder."""
    sequence = words(query)
    query_pairs = set(zip(sequence, sequence[1:]))
    result = []
    for row in candidates:
        sequence = words(row["chunk"]["text"])
        pairs = set(zip(sequence, sequence[1:]))
        result.append(len(query_pairs & pairs) / max(1, len(query_pairs)))
    return result


class RerankedSearch:
    def __init__(self, retrieval, scorer=phrase_scores, candidates=6):
        checked_k(candidates)
        self.retrieval = retrieval
        self.scorer = scorer
        self.candidates = candidates

    def __call__(self, query, chunks, user, top_k=3):
        checked_k(top_k)
        allowed = permitted(chunks, user)
        candidates = self.retrieval(query, allowed, user, max(top_k, self.candidates))
        scores = list(self.scorer(query, candidates))
        if len(scores) != len(candidates) or any(not math.isfinite(float(s)) for s in scores):
            raise ValueError("Reranker must return one finite score per candidate")
        rows = [{"chunk": row["chunk"], "score": float(score), "prior_rank": rank}
                for rank, (row, score) in enumerate(zip(candidates, scores))]
        # Preserve retrieval order on equal reranker scores, avoiding arbitrary tie gains.
        return sorted(rows, key=lambda row: (-row["score"], row["prior_rank"]))[:top_k]


def methods(embedding_backend=None):
    vector = character_search if embedding_backend is None else EmbeddingSearch([], embedding_backend)
    hybrid = HybridSearch(vector)
    return {
        "lexical": lexical_search,
        "bm25": bm25,
        "vector": vector,
        "hybrid": hybrid,
        "hybrid_phrase_rerank": RerankedSearch(hybrid),
    }
