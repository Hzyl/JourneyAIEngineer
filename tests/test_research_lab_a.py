"""Behavior and attribution checks for research Lab A; no model downloads."""
from collections import Counter
from copy import deepcopy
import json
import math
from pathlib import Path
import sys
import unicodedata
import pytest

SAMPLE = Path(__file__).resolve().parents[1] / "samples" / "vi-document-assistant"
sys.path.insert(0, str(SAMPLE))
from research_lab import lab_a
from research_lab.corpus import exact_citation, ingest, load_data, load_fixture, tokens
from research_lab.embeddings import ColabSentenceTransformer
from research_lab.retrieval import EmbeddingSearch, cosine, lexical_search, select_evidence


def test_fixture_scope_splits_and_exact_evidence():
    chunks, questions, _, provenance = load_fixture()
    assert len(load_data("documents.json")["documents"]) == 12
    assert Counter(q["category"] for q in questions) == {"answerable": 20, "unanswerable": 5, "ambiguous": 5}
    assert {q["split"] for q in questions} == {"dev", "test"}
    assert len({q["id"] for q in questions}) == 30
    assert len(provenance["corpus_sha256"]) == 64
    assert all(exact_citation(c, chunks, "B") for c in chunks)
    tampered = {**chunks[0], "text": "Fabricated claim"}
    assert not exact_citation(tampered, chunks, "B")
    assert not exact_citation(next(c for c in chunks if c["document_id"] == "assessment"), chunks, "A")


def test_ingestion_empty_duplicate_identity_conflict_and_acl_alias():
    doc = {"document_id": "example", "version": "1", "text": "Có dấu.\n\nDòng ba.", "allowed_users": ["B"]}
    chunks, issues = ingest([doc, deepcopy(doc), {**doc, "document_id": "empty", "text": "  "}])
    assert [c["line"] for c in chunks] == [1, 3]
    assert {r["kind"] for r in issues} == {"duplicate_identity_skipped", "empty_document"}
    with pytest.raises(ValueError, match="Conflicting"):
        ingest([doc, {**doc, "text": "Different"}])
    alias = {**doc, "document_id": "alias", "allowed_users": ["A"]}
    chunks, issues = ingest([doc, alias])
    assert any(i["kind"] == "duplicate_content_retained" for i in issues)
    assert {r["chunk"]["document_id"] for r in lexical_search("có dấu", chunks, "A")} == {"alias"}
    assert ingest([]) == ([], [])
    with pytest.raises(ValueError, match="ACL"):
        ingest([{**doc, "allowed_users": None}])


def test_unicode_normalization_preserves_original_citation():
    text = unicodedata.normalize("NFD", "Thư viện mở cửa")
    chunks, _ = ingest([{"document_id": "vi", "version": "1", "text": text, "allowed_users": ["A"]}])
    assert tokens("Thư viện Đà Nẵng") == tokens("thu vien da nang")
    result = lexical_search("thu vien mo cua", chunks, "A")
    assert result[0]["chunk"]["text"] == text
    assert exact_citation(result[0]["chunk"], chunks, "A")


def test_conflict_requires_clarification_not_arbitrary_source():
    chunks, questions, _, _ = load_fixture()
    for case in (q for q in questions if q["id"] in ("q26", "q27")):
        result = select_evidence(case["question"], lexical_search(case["question"], chunks, "B"), chunks, "B")
        assert result["action"] == "clarify"
        assert result["reason"] == "conflicting_sources"
        assert {c["chunk_id"] for c in result["citations"]} == set(case["gold"])
        assert "answer" not in result


class TokenMockEncoder:
    metadata = {"is_mock": True, "model_id": "token-count-test-double", "revision": "1"}

    def __init__(self):
        self.encoded = []
        self.vocabulary = sorted({token for c in load_fixture()[0] for token in tokens(c["text"])})

    def encode(self, texts):
        self.encoded.extend(texts)
        return [[float(word in tokens(text)) for word in self.vocabulary] for text in texts]


def test_embedding_protocol_comparison_and_authorization_before_encoding():
    chunks, _, _, _ = load_fixture()
    encoder = TokenMockEncoder()
    search = EmbeddingSearch(chunks, encoder)
    search("Workshop Python", chunks, "A")
    assert not any("Hội đồng" in text for text in encoder.encoded)
    report = lab_a.run(encoder, split="all")
    assert set(report["methods"]) == {"lexical", "embedding"}
    assert report["methods"]["embedding"]["metadata"]["is_mock"] is True
    for split in ("dev", "test"):
        left, right = (report["methods"][method][split] for method in ("lexical", "embedding"))
        assert [c["id"] for c in left["cases"]] == [c["id"] for c in right["cases"]]
        assert left["retrieval"]["top_k"] == right["retrieval"]["top_k"] == 3
    json.dumps(report, allow_nan=False)


def test_metrics_use_partial_recall_and_reciprocal_rank():
    chunks, _, _, _ = load_fixture()
    selected = chunks[:3]
    case = {"id": "metric", "split": "dev", "category": "answerable", "user": "B",
            "question": "Thư viện mở cửa lúc nào?", "gold": [selected[1]["chunk_id"], selected[2]["chunk_id"]],
            "expected_action": "answer"}
    def ranked(*args):
        return [{"chunk": selected[0], "score": 1}, {"chunk": selected[1], "score": .5}]
    report = lab_a.evaluate(ranked, chunks, [case], "dev")
    assert report["retrieval"]["recall_at_k"] == .5
    assert report["retrieval"]["mrr_at_k"] == .5
    assert report["retrieval"]["hit_at_1"] == 0
    assert math.isclose(cosine([3, 4], [6, 8]), 1)
    assert cosine([1, 0], [0, 1]) == 0
    assert cosine([0, 0], [3, 4]) == 0


def test_invalid_embeddings_fail_explicitly():
    chunks = load_fixture()[0]
    encoder = TokenMockEncoder()
    encoder.encode = lambda texts: [[float("nan")] for text in texts]
    with pytest.raises(ValueError, match="nonfinite"):
        EmbeddingSearch(chunks, encoder)("Python", chunks, "A")
    with pytest.raises(ValueError, match="metadata"):
        lab_a.run(object())


def test_real_backend_rejects_local_before_package_import(monkeypatch):
    monkeypatch.delenv("COLAB_RELEASE_TAG", raising=False)
    monkeypatch.delenv("COLAB_BACKEND_VERSION", raising=False)
    with pytest.raises(RuntimeError, match="Colab-only"):
        ColabSentenceTransformer()


def test_default_hides_test_results_and_final_test_is_explicit():
    dev = lab_a.run()
    assert "dev" in dev["methods"]["lexical"]
    assert "test" not in dev["methods"]["lexical"]
    final = lab_a.run(split="test")
    assert "test" in final["methods"]["lexical"]
    assert "dev" not in final["methods"]["lexical"]
    assert dev["provenance"]["fixture_sha256"] == final["provenance"]["fixture_sha256"]
    with pytest.raises(ValueError, match="split"):
        lab_a.run(split="invalid")


def test_failed_retriever_reports_misses_instead_of_hiding_them():
    chunks, questions, _, _ = load_fixture()
    report = lab_a.evaluate(lambda *args: [], chunks, questions, "test")
    assert report["retrieval"]["recall_at_k"] == 0
    assert report["retrieval"]["mrr_at_k"] == 0
    assert report["failures"]
    assert any("missing_gold_citation" in row["reasons"] for row in report["failures"])
