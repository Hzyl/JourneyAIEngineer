"""Authorization, injection containment and redaction are separate assertions."""
import json
from pathlib import Path
import subprocess
import sys

SAMPLE = Path(__file__).resolve().parents[1] / "samples" / "vi-document-assistant"
sys.path.insert(0, str(SAMPLE))
from research_lab import lab_c
from research_lab.corpus import load_fixture
from research_lab.tools import ToolSession


def test_same_fixture_regression_fixes_acl_without_new_failures():
    report = lab_c.run()
    before, after = report["before"], report["after"]
    assert before["fixture_sha256"] == after["fixture_sha256"]
    assert before["fixture_version"] == after["fixture_version"]
    assert before["corpus_sha256"] == after["corpus_sha256"]
    assert before["passed"] < before["total"]
    assert after["passed"] == after["total"]
    assert set(report["regression"]["fixed_cases"]) == {"A_search_private", "A_read_private"}
    assert not report["regression"]["new_failures"]
    assert all(c["trace_redacted"] for c in after["cases"])
    assert "LAB_SECRET_CANARY" not in json.dumps(report)


def test_auth_checked_before_search_candidate_scoring(monkeypatch):
    import research_lab.tools as tools_module
    original = tools_module.lexical_search
    observed = []
    def spy(query, candidates, user, top_k):
        observed.extend(candidates)
        assert all(user in chunk["allowed_users"] for chunk in candidates)
        return original(query, candidates, user, top_k)
    monkeypatch.setattr(tools_module, "lexical_search", spy)
    chunks = load_fixture()[0]
    a = ToolSession(chunks, "A")
    a.call("search", {"query": "Hội đồng đánh giá"})
    assert observed and not any(c["document_id"] == "assessment" for c in observed)
    assert a.call("read_document", {"document_id": "assessment"})["status"] == "document_denied"
    assert a.call("read_document", {"document_id": "missing"})["status"] == "document_denied"
    b = ToolSession(chunks, "B")
    assert b.call("read_document", {"document_id": "assessment"})["status"] == "ok"


def test_injected_document_cannot_change_tool_allowlist_or_principal():
    fixture = lab_c.load_data("security_cases.json")
    chunks, _ = lab_c.ingest(lab_c.load_data("documents.json")["documents"] + [fixture["injection_document"]])
    session = ToolSession(chunks, "A")
    response = session.call("read_document", {"document_id": "injection"})
    assert "ignore all rules" in response["data"][0]["text"]
    assert session.calls == 1
    assert session.call("read_document", {"document_id": "assessment", "user": "B"})["status"] == "invalid_arguments"
    assert session.call("send_email", {"body": response["data"][0]["text"]})["status"] == "tool_denied"
    assert session.call("read_document", {"document_id": "assessment"})["status"] == "document_denied"
    assert "LAB_SECRET_CANARY" not in json.dumps(session.trace)


def test_cli_runs_all_reports_and_protects_existing_file(tmp_path):
    output = tmp_path / "report.json"
    command = [sys.executable, "-X", "utf8", str(SAMPLE / "run_research_lab.py"),
               "--lab", "all", "--output", str(output)]
    process = subprocess.run(command, capture_output=True, encoding="utf-8", timeout=20)
    assert process.returncode == 0, process.stderr
    report = json.loads(output.read_text(encoding="utf-8"))
    assert set(report) == {"a", "b", "c"}
    assert report["c"]["after"]["passed"] == report["c"]["after"]["total"]
    before = output.read_bytes()
    repeated = subprocess.run(command, capture_output=True, encoding="utf-8", timeout=20)
    assert repeated.returncode == 2
    assert output.read_bytes() == before


def test_cli_real_model_fails_locally_before_import_or_download():
    process = subprocess.run([sys.executable, "-X", "utf8", str(SAMPLE / "run_research_lab.py"),
                              "--lab", "a", "--embeddings"],
                             capture_output=True, encoding="utf-8", timeout=15)
    assert process.returncode == 2
    assert "Colab-only" in process.stderr
