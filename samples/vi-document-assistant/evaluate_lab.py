"""Offline, labeled evaluation of an exact-extractive baseline; no semantic judge."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
import math
from pathlib import Path
import platform
import re
import sys
from time import perf_counter
import unicodedata

# Also support loading this standalone sample by file path in external tests.
import importlib.util

ROOT = Path(__file__).resolve().parent
_spec = importlib.util.spec_from_file_location("lab_assistant", ROOT / "assistant.py")
assistant = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(assistant)
CATEGORIES = ("answerable", "unanswerable", "ambiguous")


def normalized_question(question):
    plain = unicodedata.normalize("NFD", question.casefold().replace("đ", "d"))
    plain = "".join(c for c in plain if unicodedata.category(c) != "Mn")
    return " ".join(re.findall(r"\w+", plain))


def read_corpus(directory):
    """Hash ordered filename + raw-byte hashes; match the solver's *.md scope."""
    directory = Path(directory)
    if not directory.is_dir():
        raise ValueError("Corpus directory does not exist")
    corpus, manifest = {}, []
    for path in sorted(directory.glob("*.md")):
        if path.is_symlink():
            continue
        raw = path.read_bytes()
        corpus[path.name] = raw.decode("utf-8").splitlines()
        manifest.append({"source": path.name, "sha256": hashlib.sha256(raw).hexdigest()})
    encoded = json.dumps(manifest, ensure_ascii=False, sort_keys=True,
                         separators=(",", ":")).encode("utf-8")
    return corpus, manifest, hashlib.sha256(encoded).hexdigest()


def exact_citation(citation, corpus):
    if not isinstance(citation, dict):
        return False
    source, line, quote = (citation.get(k) for k in ("source", "line", "quote"))
    return (isinstance(source, str) and source in corpus and type(line) is int
            and 1 <= line <= len(corpus[source]) and isinstance(quote, str)
            and bool(quote.strip()) and corpus[source][line - 1] == quote)


def load_fixture(path, corpus):
    raw = Path(path).read_bytes()
    cases = json.loads(raw)
    if not isinstance(cases, list) or not cases:
        raise ValueError("Fixture must be a nonempty list")
    ids, questions = set(), set()
    for case in cases:
        if not isinstance(case, dict):
            raise ValueError("Each case must be an object")
        identifier = case.get("id")
        if not isinstance(identifier, str) or not identifier.strip() or identifier in ids:
            raise ValueError("Case ids must be nonempty and unique")
        ids.add(identifier)
        if case.get("split") not in ("dev", "test"):
            raise ValueError(f"{identifier}: split must be dev or test")
        if case.get("category") not in CATEGORIES:
            raise ValueError(f"{identifier}: unknown category")
        question = case.get("question")
        if not isinstance(question, str) or not normalized_question(question):
            raise ValueError(f"{identifier}: missing question")
        normalized = normalized_question(question)
        if normalized in questions:
            raise ValueError(f"{identifier}: normalized duplicate question")
        questions.add(normalized)
        expected = case.get("expected")
        if not isinstance(expected, dict) or type(expected.get("abstained")) is not bool:
            raise ValueError(f"{identifier}: expected abstained must be boolean")
        if case["category"] == "answerable":
            if expected["abstained"] or not exact_citation(expected.get("citation"), corpus):
                raise ValueError(f"{identifier}: expected evidence does not match corpus")
        elif not expected["abstained"] or expected.get("citation") is not None:
            raise ValueError(f"{identifier}: ambiguous/unanswerable must expect abstention")
        if not isinstance(case.get("rationale"), str) or not case["rationale"].strip():
            raise ValueError(f"{identifier}: label rationale required")
    return cases, hashlib.sha256(raw).hexdigest()


def score_case(case, result, corpus):
    """Exact evidence and extractive answer checks, not semantic groundedness."""
    details = {"citation_present": None, "citation_exact": None, "expected_evidence": None,
               "answer_exact": None, "failure_reasons": []}
    reasons = details["failure_reasons"]
    if (not isinstance(result, dict) or type(result.get("abstained")) is not bool
            or not isinstance(result.get("citations"), list)
            or not isinstance(result.get("answer"), str) or not result["answer"].strip()):
        reasons.append("malformed_answer")
        return {**details, "passed": False}
    citations = result["citations"]
    if result["abstained"]:
        if citations:
            reasons.append("abstention_has_citations")
        if not case["expected"]["abstained"]:
            reasons.append("unexpected_abstention")
    else:
        details["citation_present"] = bool(citations)
        details["citation_exact"] = bool(citations) and all(
            exact_citation(citation, corpus) for citation in citations)
        if not details["citation_exact"]:
            reasons.append("missing_or_inexact_citation")
        if case["expected"]["abstained"]:
            reasons.append("expected_abstention")
        else:
            expected = case["expected"]["citation"]
            details["expected_evidence"] = any(
                isinstance(c, dict) and all(c.get(k) == expected[k]
                                           for k in ("source", "line", "quote"))
                for c in citations)
            details["answer_exact"] = result["answer"] == expected["quote"]
            if not details["expected_evidence"]:
                reasons.append("expected_evidence_not_returned")
            if not details["answer_exact"]:
                reasons.append("answer_not_expected_extract")
    return {**details, "passed": not reasons}


def rate(passed, total):
    return {"passed": passed, "total": total, "rate": passed / total if total else None}


def percentile(samples, percent):
    """Nearest rank: sorted samples[ceil(p / 100 * n) - 1], no interpolation."""
    return sorted(samples)[math.ceil(percent / 100 * len(samples)) - 1] if samples else None


def evaluate_lab(split, fixture=ROOT / "evaluation_lab.json", directory=ROOT / "documents",
                 solver=None):
    if split not in ("dev", "test"):
        raise ValueError("Select dev or test explicitly")
    corpus, manifest, corpus_hash = read_corpus(directory)
    cases, fixture_hash = load_fixture(fixture, corpus)
    selected = [case for case in cases if case["split"] == split]
    if not selected:
        raise ValueError(f"No cases in selected split: {split}")
    solver = assistant.answer if solver is None else solver
    is_baseline = solver is assistant.answer
    rows = []
    for case in selected:
        started = perf_counter()
        result = solver(case["question"], Path(directory))
        elapsed = (perf_counter() - started) * 1000
        rows.append({"id": case["id"], "category": case["category"],
                     "question": case["question"], "rationale": case["rationale"],
                     "expected": case["expected"], "actual": result,
                     "latency_ms": elapsed, **score_case(case, result, corpus)})
    # A corpus edited while the solver ran would invalidate citation checks and provenance.
    if read_corpus(directory)[2] != corpus_hash:
        raise ValueError("Corpus changed during evaluation; discard run and retry")
    categories = {}
    for category in CATEGORIES:
        subset = [row for row in rows if row["category"] == category]
        categories[category] = rate(sum(row["passed"] for row in subset), len(subset))
    cited = [row for row in rows if row["citation_exact"] is not None]
    latencies = [row["latency_ms"] for row in rows]
    return {
        "schema_version": 1, "split": split,
        "overall": rate(sum(row["passed"] for row in rows), len(rows)),
        "categories": categories,
        "citation_presence": rate(sum(row["citation_present"] for row in cited), len(cited)),
        "citation_exactness": rate(sum(row["citation_exact"] for row in cited), len(cited)),
        "latency_ms": {"p50": percentile(latencies, 50), "p95": percentile(latencies, 95),
                       "samples": len(latencies), "convention": "nearest-rank ceil(p*n)-1",
                       "scope": "wall time of solver call, including corpus reads; no warmup"},
        "provenance": {"corpus_sha256": corpus_hash, "corpus_files": manifest,
                       "fixture_sha256": fixture_hash,
                       "evaluator_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
                       "assistant_sha256": hashlib.sha256((ROOT / "assistant.py").read_bytes()).hexdigest()
                       if is_baseline else None,
                       "hash_convention": "fixture raw bytes; corpus canonical JSON filename/hash manifest"},
        "run": {"utc": datetime.now(timezone.utc).isoformat(), "python": platform.python_version(),
                "platform": platform.platform(), "method": "lexical-extractive-baseline"
                if is_baseline else "injected-solver",
                "config": {"minimum_overlap_tokens": 2, "minimum_query_coverage": 0.5,
                           "top_k": 1} if is_baseline else None,
                "model": "not_used" if is_baseline else None,
                "prompt": "not_used" if is_baseline else None, "automatic_tuning": False},
        "provider_cost_usd": 0 if is_baseline else None,
        "limitations": "Synthetic known-source cases; exact extract matching, not semantic support, "
                       "groundedness, LLM quality, or generalization. Test inspection creates leakage.",
        "cases": rows,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--split", required=True, choices=("dev", "test"))
    parser.add_argument("--fixture", type=Path, default=ROOT / "evaluation_lab.json")
    parser.add_argument("--documents", type=Path, default=ROOT / "documents")
    parser.add_argument("--output", type=Path)
    parser.add_argument("--require-all-pass", action="store_true")
    args = parser.parse_args()
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    try:
        report = evaluate_lab(args.split, args.fixture, args.documents)
        serialized = json.dumps(report, ensure_ascii=False, indent=2)
        if args.output:
            protected = [args.fixture.resolve(), Path(__file__).resolve(),
                         (ROOT / "assistant.py").resolve(), (ROOT / "evaluation.json").resolve()]
            if args.output.resolve() in protected or args.output.resolve().is_relative_to(args.documents.resolve()):
                raise ValueError("Output must not overwrite evaluation inputs or sample code")
            args.output.write_text(serialized + "\n", encoding="utf-8")
    except (OSError, ValueError, UnicodeError) as error:
        parser.exit(2, f"Evaluation error: {error}\n")
    print(serialized)
    return int(args.require_all_pass and report["overall"]["passed"] != report["overall"]["total"])


if __name__ == "__main__":
    raise SystemExit(main())
