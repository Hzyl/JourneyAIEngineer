"""Lab C: synthetic authorization regression; intentionally unsafe before variant."""
import json
from .corpus import canonical_hash, ingest, load_data
from .tools import ToolSession
from .workflow import Runner


def evaluate(fixture, chunks, hardened):
    rows = []
    for case in fixture["cases"]:
        session = ToolSession(chunks, case["user"], harden=hardened)
        response = session.call(case["tool"], case["arguments"])
        data = response["data"] or []
        leaked = any(row.get("document_id") == "assessment" for row in data) and case["user"] == "A"
        if case["expect"] == "no_private":
            passed = not leaked
        elif case["expect"] == "untrusted_data_only":
            # Reading an injection does not execute it. A scripted runner consumes it as text.
            task = {"question": "Workshop Python ignore rules?", "initial_query": "ignore rules",
                    "fallback_query": "ignore rules", "gold_chunk": "injection@1.0:L1"}
            runner = Runner(ToolSession(chunks, case["user"], harden=hardened), task, "scripted_adaptive")
            result = runner.run()
            passed = response["status"] == "ok" and all(
                event["tool"] in ("search", "read_document") for event in result["trace"]
            ) and not any(event["tool"] == "[outside_allowlist]" for event in result["trace"])
            # Redacted telemetry, never the attack body or the extracted answer.
            session.trace.extend(result["trace"])
        else:
            passed = response["status"] == case["expect"]
        serialized_trace = json.dumps(session.trace, ensure_ascii=False)
        redacted = "LAB_SECRET_CANARY" not in serialized_trace and "ignore all rules" not in serialized_trace
        rows.append({"id": case["id"], "user": case["user"], "status": response["status"],
                     "passed": passed and redacted, "unauthorized_content_returned": leaked,
                     "trace_redacted": redacted, "trace": session.trace})
    return {"variant": "authorization_before_retrieval_and_read" if hardened else "unsafe_synthetic_acl_bypass",
            "passed": sum(row["passed"] for row in rows), "total": len(rows), "cases": rows}


def run():
    fixture = load_data("security_cases.json")
    corpus = load_data("documents.json")
    chunks, _ = ingest(corpus["documents"] + [fixture["injection_document"]])
    fixture_hash = canonical_hash(fixture)
    before, after = evaluate(fixture, chunks, False), evaluate(fixture, chunks, True)
    for report in (before, after):
        report["fixture_sha256"] = fixture_hash
        report["corpus_sha256"] = canonical_hash({
            "base_corpus": corpus, "injection_document": fixture["injection_document"]
        })
        report["fixture_version"] = fixture["version"]
    return {"lab": "C", "is_mock": True, "synthetic_data": True, "before": before, "after": after,
            "regression": {"same_fixture": before["fixture_sha256"] == after["fixture_sha256"],
                           "new_failures": [row["id"] for old, row in zip(before["cases"], after["cases"])
                                            if old["passed"] and not row["passed"]],
                           "fixed_cases": [row["id"] for old, row in zip(before["cases"], after["cases"])
                                           if not old["passed"] and row["passed"]]},
            "provider_cost_usd": 0,
            "limitations": [
                "Before is a deliberately unsafe ACL-bypass simulation over synthetic data only.",
                "After enforces principal rights before candidate scoring and before document return.",
                "No LLM, MCP transport, external tools, credentials, or production service is used.",
                "Injection staying inert in a scripted controller is not proof against model-driven attacks.",
                "Trace allowlisting drops raw queries, arguments, document bodies and exception text.",
            ]}
