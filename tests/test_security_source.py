from pathlib import Path

import pytest
from fastapi import FastAPI

from apps.api.security_audit import audit_app


def source(tmp_path: Path, text: str) -> Path:
    file = tmp_path / "apps" / "api" / "main.py"
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(text, encoding="utf-8")
    return file


@pytest.mark.parametrize("content", [None, "not valid python !!!", "x" * 1_000_001],
                         ids=["missing", "invalid-python", "oversized"])
def test_unavailable_source_never_claims_verified_controls(tmp_path, content):
    if content is not None:
        source(tmp_path, content)
    report = audit_app(FastAPI(), tmp_path)
    assert report["summary"]["verified_controls"] == 0
    assert not any(item["status"] == "verified_control" for item in report["findings"])
    unavailable = next(item for item in report["findings"] if item["id"] == "source-inspection-unavailable")
    assert unavailable["status"] == "needs_human_review"
    assert "could not be inspected" in unavailable["title_en"]


def test_read_failure_never_claims_verified_controls(tmp_path, monkeypatch):
    file = source(tmp_path, "x = 1\n")
    original = Path.read_text

    def fail_read(path, *args, **kwargs):
        if path == file:
            raise OSError("Synthetic unreadable source")
        return original(path, *args, **kwargs)

    monkeypatch.setattr(Path, "read_text", fail_read)
    report = audit_app(FastAPI(), tmp_path)
    assert report["summary"]["verified_controls"] == 0


def test_successful_static_checks_are_bilingual_and_keep_relative_paths(tmp_path):
    source(tmp_path, "import subprocess\nsubprocess.run(['python', '--version'], shell=False)\n")
    report = audit_app(FastAPI(), tmp_path)
    assert report["summary"]["verified_controls"] == 2
    assert report["limitations_en"]
    assert report["network_requests"] == report["payloads_sent"] == 0
    for finding in report["findings"]:
        assert finding["title_en"] and finding["evidence_en"] and finding["remediation_en"]
        assert finding["source_file"] == "apps/api/main.py"
        assert str(tmp_path) not in str(finding)


def test_risky_patterns_have_translated_evidence_and_no_matching_control(tmp_path):
    source(tmp_path, "import subprocess\nsubprocess.run('echo example', shell=True)\n"
           "db.execute(f'SELECT {value}')\nallow_origins = ['*']\n")
    frontend = tmp_path / "src"
    frontend.mkdir()
    (frontend / "App.tsx").write_text("<div dangerouslySetInnerHTML={value} />", encoding="utf-8")
    report = audit_app(FastAPI(), tmp_path)
    assert report["summary"]["verified_controls"] == 0
    assert len(report["findings"]) == 4
    for finding in report["findings"]:
        assert finding["title_en"] and finding["evidence_en"] and finding["remediation_en"]
        assert str(tmp_path) not in str(finding)
