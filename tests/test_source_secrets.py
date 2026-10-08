import json
import subprocess
import sys
from pathlib import Path

import pytest

from scripts.source_secrets import redacted_report, scan_payloads


def markers():
    return [b"-----BEGIN " + b"PRIVATE KEY-----", b"AKIA" + b"A" * 16,
            b"ghp_" + b"a" * 24, b"sk-" + b"proj-" + b"b" * 32]


@pytest.mark.parametrize("value", markers(), ids=["private-key", "aws", "github", "api"])
def test_markers_report_only_location_and_rule(value):
    findings = scan_payloads({"src/example.ts": b"// first line\nconst value = '" + value + b"'\n"})
    assert len(findings) == 1
    assert findings[0]["path"] == "src/example.ts"
    assert findings[0]["line"] == 2
    assert value.decode() not in redacted_report(findings)
    assert "const value" not in redacted_report(findings)


def test_ordinary_source_and_pattern_definitions_do_not_match():
    script = Path(__file__).resolve().parents[1] / "scripts" / "source_secrets.py"
    assert scan_payloads({"script.py": script.read_bytes(), "code.ts": b"export const count = 42"}) == []


def test_source_archive_cli_fails_without_echoing_a_marker_in_new_source(tmp_path):
    (tmp_path / "package.json").write_text(json.dumps({"version": "1.2.3"}), encoding="utf-8")
    (tmp_path / "src").mkdir()
    value = markers()[2]
    (tmp_path / "src" / "new.ts").write_bytes(b"const token = '" + value + b"'")
    script = Path(__file__).resolve().parents[1] / "scripts" / "source_secrets.py"
    result = subprocess.run([sys.executable, str(script), "--root", str(tmp_path), "--source-archive"],
                            capture_output=True, text=True)
    assert result.returncode == 1
    assert "src/new.ts" in result.stdout
    assert value.decode() not in result.stdout + result.stderr
    assert "const token" not in result.stdout + result.stderr
