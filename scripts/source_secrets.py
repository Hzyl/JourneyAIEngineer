"""Fail on common secret markers without printing their values."""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Mapping

PATTERNS = {
    "private-key": rb"-----BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----",
    "aws-access-key": rb"AKIA[0-9A-Z]{16}",
    "github-token": rb"gh[pousr]_[A-Za-z0-9]{20,}",
    "api-key": rb"sk-[A-Za-z0-9_-]{20,}",
}


def scan_payloads(payloads: Mapping[str, bytes]) -> list[dict]:
    findings = []
    for name, content in payloads.items():
        for rule, pattern in PATTERNS.items():
            match = re.search(pattern, content)
            if match:
                findings.append({"path": name, "line": content.count(b"\n", 0, match.start()) + 1, "rule": rule})
    return findings


def redacted_report(findings: list[dict]) -> str:
    return "Potential secret markers; values withheld:\n" + json.dumps(findings, ensure_ascii=True, indent=2)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--source-archive", action="store_true", help="Check the public source allowlist, including new files")
    args = parser.parse_args()
    root = args.root.resolve()
    try:
        if args.source_archive:
            sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
            from scripts.package_source import source_files
            files = source_files(root)
        else:
            result = subprocess.run(["git", "ls-files", "-z", "--cached"], cwd=root,
                                    check=True, capture_output=True)
            files = [root / name.decode("utf-8") for name in result.stdout.split(b"\0") if name]
        payloads = {}
        for file in files:
            if file.is_symlink() or root not in file.resolve().parents:
                raise ValueError("Linked or external path in scan input")
            payloads[file.relative_to(root).as_posix()] = file.read_bytes()
        findings = scan_payloads(payloads)
    except (OSError, ValueError, subprocess.CalledProcessError):
        print("Source inspection failed. Verify the repository, selected paths and file access; no file contents printed.",
              file=sys.stderr)
        return 2
    if findings:
        print(redacted_report(findings))
        return 1
    print(f"Checked {len(payloads)} files: no supported secret marker found.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
