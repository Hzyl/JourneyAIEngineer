"""Bounded static pattern checks; unreadable source is not a successful check."""

import ast
import re
from pathlib import Path
from typing import Any, Callable


def ast_findings(source_path: Path, finding: Callable[..., dict[str, Any]]) -> tuple[list[dict[str, Any]], bool]:
    try:
        if source_path.stat().st_size > 1_000_000:
            return [], False
        source_text = source_path.read_text(encoding="utf-8")
        tree = ast.parse(source_text, filename=str(source_path))
    except (OSError, SyntaxError, UnicodeError):
        return [], False
    findings: list[dict[str, Any]] = []
    for node in ast.walk(tree):
        if not isinstance(node, ast.Call):
            continue
        function_name = ""
        if isinstance(node.func, ast.Attribute):
            function_name = node.func.attr
        elif isinstance(node.func, ast.Name):
            function_name = node.func.id
        if function_name in {"run", "Popen", "call", "check_call", "check_output"}:
            shell_true = any(
                keyword.arg == "shell"
                and isinstance(keyword.value, ast.Constant)
                and keyword.value.value is True
                for keyword in node.keywords
            )
            if shell_true:
                findings.append(finding(
                    "source-shell-true",
                    "critical",
                    "needs_human_review",
                    "Subprocess có shell=True",
                    f"{source_path.name}:{node.lineno} gọi subprocess với shell=True.",
                    "Loại bỏ shell=True, dùng argv list, allowlist command và test input boundary.",
                    source_file=str(source_path),
                    source_line=node.lineno,
                ))
        if function_name == "execute" and node.args and isinstance(node.args[0], ast.JoinedStr):
            findings.append(finding(
                f"source-sql-fstring-{node.lineno}",
                "medium",
                "needs_human_review",
                "SQL query được tạo bằng f-string",
                f"{source_path.name}:{node.lineno} truyền f-string vào execute().",
                "Kiểm tra toàn bộ giá trị động; dùng parameterized query cho dữ liệu người dùng và giữ phần SQL động trong allowlist.",
                source_file=str(source_path),
                source_line=node.lineno,
            ))
    cors_wildcard = re.search(r"allow_origins\s*=\s*\[[^\]]*[\"']\*[\"']", source_text)
    if cors_wildcard:
        line = source_text[:cors_wildcard.start()].count("\n") + 1
        findings.append(finding(
            "source-cors-wildcard",
            "high",
            "needs_human_review",
            "CORS cho phép mọi origin",
            f"{source_path.name}:{line} chứa allow_origins=['*'].",
            "Đổi sang allowlist origin cụ thể và kiểm tra credential/CORS trước khi public.",
            source_file=str(source_path),
            source_line=line,
        ))
    return findings, True
