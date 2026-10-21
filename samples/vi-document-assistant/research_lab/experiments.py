"""One-variable retrieval comparisons on the existing versioned Lab A fixture."""
import argparse
from collections import Counter
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import platform

from .corpus import load_fixture
from .lab_a import evaluate
from .ranking import methods


DEV_PROBES = [
    {"id": "probe-paraphrase", "split": "dev", "category": "answerable", "user": "A",
     "question": "Chỗ cho mượn sách bắt đầu đón bạn đọc lúc mấy giờ?",
     "gold": ["library@1.0:L1"], "expected_action": "answer"},
    {"id": "probe-typo", "split": "dev", "category": "answerable", "user": "A",
     "question": "Workshp Pythn diễn ra tại phòng nào?",
     "gold": ["workshop@1.0:L1"], "expected_action": "answer"},
    {"id": "probe-unsupported-detail", "split": "dev", "category": "unanswerable", "user": "A",
     "question": "Thư viện cho mượn sách với mức phạt trả muộn bao nhiêu tiền?",
     "gold": [], "expected_action": "abstain"},
    {"id": "probe-underspecified", "split": "dev", "category": "ambiguous", "user": "A",
     "question": "Hạn chót?", "gold": [], "expected_action": "clarify"},
    {"id": "probe-forbidden", "split": "dev", "category": "unanswerable", "user": "A",
     "question": "Hội đồng đánh giá chấm báo cáo theo bao nhiêu tiêu chí?",
     "gold": [], "expected_action": "abstain"},
]


def run(split="dev", embedding_backend=None):
    if split not in ("dev", "test"):
        raise ValueError("Choose dev or test explicitly")
    chunks, questions, issues, provenance = load_fixture()
    metadata = {"is_mock": False, "model": "none", "method": "sparse character trigram cosine"}
    if embedding_backend is not None:
        metadata = getattr(embedding_backend, "metadata", None)
        if not isinstance(metadata, dict) or type(metadata.get("is_mock")) is not bool:
            raise ValueError("Embedding metadata must explicitly declare is_mock")
    results = {}
    probes = {}
    for name, search in methods(embedding_backend).items():
        score = evaluate(search, chunks, questions, split)
        categories = Counter()
        for case in score["cases"]:
            retrieved = [row["chunk_id"] for row in case["retrieved"]]
            if case["gold"] and not set(case["gold"]) & set(retrieved):
                case["diagnosis"] = "retrieval_miss"
            elif case["gold"] and retrieved and retrieved[0] not in case["gold"]:
                case["diagnosis"] = "ranking_error"
            elif not case["passed"]:
                case["diagnosis"] = "answer_policy_error"
            else:
                case["diagnosis"] = "passed"
            categories[case["diagnosis"]] += 1
        score["error_categories"] = dict(categories)
        results[name] = score
        if split == "dev":
            probes[name] = evaluate(search, chunks, DEV_PROBES, "dev")
    report = {
        "lab": "retrieval-ablation", "schema_version": 1, "split": split,
        "synthetic_data": True, "utc": datetime.now(timezone.utc).isoformat(),
        "runtime": {"python": platform.python_version(), "platform": platform.platform(),
                    "provider_cost_usd": 0, "generation": "not_run", "llm_judge": "not_run"},
        "provenance": {**provenance, "source_hashes": {
            p.name: hashlib.sha256(p.read_bytes()).hexdigest()
            for p in sorted(Path(__file__).parent.glob("*.py"))}},
        "configuration": {"top_k": 3, "candidates": 6, "rrf_constant": 60, "ranks_start_at": 1,
                          "bm25_k1": 1.2, "bm25_b": .75, "vector": metadata,
                          "reranker": "ordered-bigram-overlap heuristic, NOT a CrossEncoder",
                          "chunks": "existing source lines; stable IDs and exact provenance",
                          "decision_policy": "same Lab A lexical gate for every method"},
        "ingestion_issues": issues, "methods": results,
        "dev_probes": probes,
        "dev_probe_sha256": hashlib.sha256(json.dumps(DEV_PROBES, sort_keys=True).encode()).hexdigest(),
        "comparisons": [
            {"before": "lexical", "after": "bm25", "change": "term weighting and length normalization"},
            {"before": "bm25", "after": "hybrid", "change": "add vector ranking via RRF"},
            {"before": "hybrid", "after": "hybrid_phrase_rerank", "change": "rerank identical candidate pool"},
        ],
        "limitations": [
            "Default vectors represent character overlap, not neural semantic understanding.",
            "Default reranking is an inspectable heuristic; it does not validate a neural reranker.",
            "Optional Colab embedding changes one retriever; the answer policy stays lexical.",
            "Gold labels reach evaluators only. Public synthetic dev/test is not a hidden benchmark.",
            "Citation exactness/coverage does not establish semantic groundedness or factual accuracy.",
            "Latency includes retrieval and policy, not network, LLM inference, TTFT or GPU serving.",
            "A citation may exist while failing to support a claim; audit important answers manually.",
            "Five authored development stress cases are reported separately; never merged into the frozen test set.",
        ],
    }
    json.dumps(report, allow_nan=False)
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--split", choices=("dev", "test"), default="dev")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    report = run(args.split)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for name, score in report["methods"].items():
        print(name, "Recall@3", round(score["retrieval"]["recall_at_k"], 4),
              "MRR@3", round(score["retrieval"]["mrr_at_k"], 4),
              "failures", len(score["failures"]))


if __name__ == "__main__":
    main()
