"""Offline Vietnamese document retrieval baseline. No model, network or API key."""
import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path
from time import perf_counter

ROOT = Path(__file__).resolve().parent
STOPWORDS = set("ai la va cua cho co nao bao nhieu gi khi thi de toi muon can duoc voi trong o mot cac the nay".split())


def tokens(text: str) -> set[str]:
    plain = unicodedata.normalize("NFD", text.lower().replace("đ", "d"))
    plain = "".join(char for char in plain if unicodedata.category(char) != "Mn")
    return set(re.findall(r"[a-z0-9]+", plain)) - STOPWORDS


def answer(question: str, directory: Path = ROOT / "documents") -> dict:
    started = perf_counter()
    query = tokens(question)
    candidates = []
    for document in sorted(directory.glob("*.md")):
        if document.is_symlink():
            continue
        for line, text in enumerate(document.read_text(encoding="utf-8").splitlines(), 1):
            if not text.strip() or text.startswith("#"):
                continue
            overlap = query & tokens(text)
            score = len(overlap) / max(1, len(query))
            if len(overlap) >= 2 and score >= 0.5:
                candidates.append((score, document.name, line, text))
    candidates.sort(key=lambda row: (-row[0], row[1], row[2]))
    best = candidates[:1]
    citations = [{"source": name, "line": line, "quote": text} for _, name, line, text in best]
    return {
        "answer": best[0][3] if best else "Không tìm thấy bằng chứng đủ rõ trong tài liệu mẫu.",
        "abstained": not bool(best),
        "citations": citations,
        "method": "lexical-extractive-baseline",
        "provider_cost_usd": 0,
        "latency_ms": round((perf_counter() - started) * 1000, 3),
    }


def evaluate(path: Path = ROOT / "evaluation.json") -> dict:
    cases = json.loads(path.read_text(encoding="utf-8"))
    results = []
    for case in cases:
        result = answer(case["question"])
        expected = case["source"]
        correct = result["abstained"] if expected is None else (
            bool(result["citations"]) and result["citations"][0]["source"] == expected
            and case["contains"] in result["answer"]
        )
        results.append({"id": case["id"], "passed": correct, "latency_ms": result["latency_ms"]})
    return {"cases": results, "passed": sum(row["passed"] for row in results), "total": len(results),
            "provider_cost_usd": 0, "scope": "synthetic smoke set, not a general quality benchmark"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("question", nargs="?")
    parser.add_argument("--evaluate", action="store_true")
    args = parser.parse_args()
    if not args.evaluate and not args.question:
        parser.error("Provide a question or --evaluate")
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    result = evaluate() if args.evaluate else answer(args.question)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if args.evaluate and result["passed"] != result["total"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
