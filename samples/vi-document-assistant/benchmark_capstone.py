"""Small bounded HTTP load probe for the loopback teaching API, never a cloud service."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import json
import math
from pathlib import Path
import platform
from time import perf_counter
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen


def measure(base_url, count=20, concurrency=1):
    parsed = urlparse(base_url)
    if parsed.scheme != "http" or parsed.hostname not in ("localhost", "127.0.0.1"):
        raise ValueError("Benchmark is restricted to the local teaching server")
    if parsed.username or parsed.password or parsed.query or parsed.fragment or parsed.path not in ("", "/"):
        raise ValueError("Use a loopback origin without credentials, path or query")
    if type(count) is not int or not 1 <= count <= 200 or concurrency not in (1, 2, 4):
        raise ValueError("Use 1..200 requests and concurrency 1, 2 or 4")
    question = "Thư viện mở cửa lúc mấy giờ?"
    body = json.dumps({"question": question, "method": "lexical"}).encode()

    def once(index):
        start = perf_counter()
        status, correct, trace_present = 0, False, False
        request = Request(base_url.rstrip("/") + "/query", data=body,
                          headers={"Content-Type": "application/json", "X-Lab-Key": "demo-A-public"})
        try:
            with urlopen(request, timeout=5) as response:
                status = response.status
                payload = json.loads(response.read(32_000))
                trace_present = bool(response.headers.get("X-Trace-Id"))
                correct = (payload.get("action") == "answer"
                           and "08:00" in (payload.get("answer") or "")
                           and payload.get("citations", [{}])[0].get("chunk_id") == "library@1.0:L1")
        except HTTPError as error:
            status = error.code
        except (URLError, TimeoutError, ValueError, KeyError, IndexError):
            pass
        return {"request": index, "status": status, "correct_fixture_answer": correct,
                "trace_present": trace_present, "latency_ms": (perf_counter() - start) * 1000}

    start = perf_counter()
    with ThreadPoolExecutor(max_workers=concurrency) as pool:
        rows = list(pool.map(once, range(count)))
    seconds = perf_counter() - start
    latencies = sorted(row["latency_ms"] for row in rows)
    successful = sum(row["status"] == 200 for row in rows)
    return {
        "utc": datetime.now(timezone.utc).isoformat(),
        "environment": {"python": platform.python_version(), "platform": platform.platform()},
        "workload": {"requests": count, "concurrency": concurrency, "question_chars": len(question),
                     "warmup_requests": 0, "timeout_seconds": 5, "method": "lexical"},
        "elapsed_seconds": seconds, "successful_requests_per_second": successful / seconds,
        "latency_ms": {"p50": latencies[math.ceil(count * .5) - 1],
                       "p95": latencies[math.ceil(count * .95) - 1], "convention": "nearest rank"},
        "http_error_rate": 1 - successful / count,
        "correct_fixture_answers": sum(row["correct_fixture_answer"] for row in rows),
        "missing_trace_ids": sum(not row["trace_present"] for row in rows),
        "provider_cost_usd": 0, "infrastructure_cost": "not_measured", "ttft_ms": None,
        "model": "none", "generation": "not_run", "cases": rows,
        "limits": "Loopback extractive fixture only; no neural RAG, token stream, GPU or production capacity claim.",
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default="http://127.0.0.1:8091")
    parser.add_argument("--requests", type=int, default=20)
    parser.add_argument("--concurrency", type=int, choices=(1, 2, 4), default=1)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    report = measure(args.url, args.requests, args.concurrency)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k != "cases"}, indent=2))
    if report["http_error_rate"] or report["correct_fixture_answers"] != args.requests or report["missing_trace_ids"]:
        raise SystemExit("Benchmark correctness gate failed; inspect report")
