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
                    "Bỏ shell=True, truyền danh sách đối số và chỉ cho phép các lệnh đã định. Kiểm thử các giá trị biên của đầu vào.",
                    source_file=str(source_path),
                    source_line=node.lineno,
                ))
        if function_name == "execute" and node.args and isinstance(node.args[0], ast.JoinedStr):
            findings.append(finding(
                f"source-sql-fstring-{node.lineno}",
                "medium",
                "needs_human_review",
                "Truy vấn SQL được tạo bằng f-string",
                f"{source_path.name}:{node.lineno} truyền f-string vào execute().",
                "Kiểm tra mọi giá trị động. Truyền dữ liệu người dùng bằng tham số truy vấn; chỉ cho phép các cấu trúc SQL động đã định trước.",
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
            "Chỉ cho phép các origin cụ thể và kiểm tra việc gửi thông tin xác thực qua CORS trước khi công khai ứng dụng.",
            source_file=str(source_path),
            source_line=line,
        ))
    return findings, True
