"""Run Journey's passive endpoint security review from the repository root."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from apps.api.main import app
from apps.api.security_audit import audit_app


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    parser = argparse.ArgumentParser(description="Passive, non-invasive endpoint security review")
    parser.add_argument("--format", choices=("summary", "json"), default="summary")
    parser.add_argument("--strict", action="store_true", help="fail if a critical/high finding is present")
    args = parser.parse_args()
    report = audit_app(app)
    if args.format == "json":
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        summary = report["summary"]
        print(
            "Passive security audit: "
            f"{report['route_count']} routes, "
            f"{summary['needs_human_review']} findings cần human review, "
            f"{summary['verified_controls']} guardrails đã kiểm chứng, "
            f"network={report['network_requests']}, payloads={report['payloads_sent']}"
        )
        for finding in report["findings"]:
            print(f"- [{finding['severity']}/{finding['status']}] {finding['title_vi']} :: {finding['evidence']}")
    if args.strict and any(finding["severity"] in {"critical", "high"} for finding in report["findings"]):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
