"""Passive security review for the local Journey API.

This module deliberately does not make network requests, generate attack
payloads, execute endpoint handlers, or clone/install external security tools.
It inventories the FastAPI contract and checks source-level guardrails so a
learner can review likely risk before choosing an authorized staging test.
"""

from __future__ import annotations

import ast
import inspect
import re
from pathlib import Path
from typing import Any, get_args, get_origin

from fastapi.routing import APIRoute
from pydantic import BaseModel


WRITE_METHODS = frozenset({"POST", "PUT", "PATCH", "DELETE"})
API_PREFIX = "/api/"
SEVERITY_ORDER = {"critical": 4, "high": 3, "medium": 2, "low": 1, "info": 0}


def _source_for_endpoint(endpoint: Any) -> tuple[str | None, int | None, str]:
    try:
        source_path = inspect.getsourcefile(endpoint)
        source_lines, start_line = inspect.getsourcelines(endpoint)
    except (OSError, TypeError):
        return None, None, ""
    return source_path, start_line, "".join(source_lines)


def _body_model(route: APIRoute) -> type[BaseModel] | None:
    for field in getattr(route.dependant, "body_params", []):
        model = getattr(field, "type_", None) or getattr(getattr(field, "field_info", None), "annotation", None)
        while get_origin(model) is not None and get_args(model):
            model = next((argument for argument in get_args(model) if argument is not type(None)), get_args(model)[0])
        if isinstance(model, type) and issubclass(model, BaseModel):
            return model
    return None


def _unbounded_string_fields(model: type[BaseModel] | None) -> list[str]:
    if model is None:
        return []
    try:
        schema = model.model_json_schema()
    except (AttributeError, TypeError, ValueError):
        return []
    properties = schema.get("properties", {})
    return [
        name
        for name, field in properties.items()
        if field.get("type") == "string" and "maxLength" not in field and "pattern" not in field
    ]


def _route_record(route: APIRoute) -> dict[str, Any]:
    methods = sorted(str(method).upper() for method in (route.methods or set()))
    source_path, line, source = _source_for_endpoint(route.endpoint)
    body_model = _body_model(route)
    return {
        "path": route.path,
        "methods": methods,
        "name": route.name,
        "endpoint": getattr(route.endpoint, "__name__", route.name),
        "operation_id": route.operation_id,
        "mutating": bool(WRITE_METHODS.intersection(methods)),
        "body_model": body_model.__name__ if body_model else None,
        "unbounded_string_fields": _unbounded_string_fields(body_model),
        "source_file": source_path,
        "source_line": line,
        "source": source,
    }


def inventory_routes(app: Any) -> list[dict[str, Any]]:
    """List API routes without invoking any route handler."""

    routes = [
        _route_record(route)
        for route in getattr(app, "routes", [])
        if isinstance(route, APIRoute) and route.path.startswith(API_PREFIX)
    ]
    return sorted(routes, key=lambda item: (item["path"], item["methods"]))


def _finding(
    finding_id: str,
    severity: str,
    status: str,
    title_vi: str,
    evidence: str,
    remediation_vi: str,
    *,
    path: str | None = None,
    methods: list[str] | None = None,
    source_file: str | None = None,
    source_line: int | None = None,
) -> dict[str, Any]:
    return {
        "id": finding_id,
        "severity": severity,
        "status": status,
        "title_vi": title_vi,
        "evidence": evidence,
        "remediation_vi": remediation_vi,
        "path": path,
        "methods": methods or [],
        "source_file": source_file,
        "source_line": source_line,
    }


def _ast_findings(source_path: Path) -> list[dict[str, Any]]:
    if not source_path.exists() or source_path.stat().st_size > 1_000_000:
        return []
    try:
        source_text = source_path.read_text(encoding="utf-8")
        tree = ast.parse(source_text, filename=str(source_path))
    except (OSError, SyntaxError, UnicodeError):
        return []
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
                findings.append(_finding(
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
            findings.append(_finding(
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
        findings.append(_finding(
            "source-cors-wildcard",
            "high",
            "needs_human_review",
            "CORS cho phép mọi origin",
            f"{source_path.name}:{line} chứa allow_origins=['*'].",
            "Đổi sang allowlist origin cụ thể và kiểm tra credential/CORS trước khi public.",
            source_file=str(source_path),
            source_line=line,
        ))
    return findings


def _route_findings(routes: list[dict[str, Any]]) -> list[dict[str, Any]]:
    findings: list[dict[str, Any]] = []
    for route in routes:
        source_lower = route["source"].casefold()
        has_auth_boundary = any(marker in source_lower for marker in ("_require_", "auth", "token", "depends("))
        if route["mutating"] and not has_auth_boundary:
            findings.append(_finding(
                f"endpoint-online-auth-{route['endpoint']}",
                "medium",
                "needs_human_review",
                "Endpoint ghi dữ liệu chưa có dấu hiệu auth online",
                f"{'/'.join(route['methods'])} {route['path']} không có auth/token rõ trong handler; hiện phù hợp local-only nhưng chưa sẵn sàng public.",
                "Giữ endpoint ở local-only hoặc thêm authentication, authorization, rate limit và audit log trước khi deploy online.",
                path=route["path"],
                methods=route["methods"],
                source_file=route["source_file"],
                source_line=route["source_line"],
            ))
        if route["mutating"] and not route["body_model"]:
            findings.append(_finding(
                f"endpoint-input-contract-{route['endpoint']}",
                "low",
                "needs_human_review",
                "Endpoint ghi dữ liệu không có body model rõ ràng",
                f"{'/'.join(route['methods'])} {route['path']} không expose Pydantic body model.",
                "Xác định input contract bằng Pydantic model hoặc ghi rõ vì sao endpoint không nhận body.",
                path=route["path"],
                methods=route["methods"],
                source_file=route["source_file"],
                source_line=route["source_line"],
            ))
        if route["unbounded_string_fields"]:
            fields = ", ".join(route["unbounded_string_fields"])
            findings.append(_finding(
                f"endpoint-input-size-{route['endpoint']}",
                "low",
                "needs_human_review",
                "Body có string chưa thấy max length",
                f"{route['body_model']} ({fields}) tại {route['path']} chưa có maxLength trong schema.",
                "Đặt giới hạn độ dài phù hợp hoặc ghi lại lý do field cần mở; sau đó kiểm tra rate limit và payload size ở gateway.",
                path=route["path"],
                methods=route["methods"],
                source_file=route["source_file"],
                source_line=route["source_line"],
            ))
    return findings


def _display_path(path: str | None, root: Path) -> str | None:
    """Return a project-relative path so local machine paths never leave the app."""

    if not path:
        return None
    try:
        return Path(path).resolve().relative_to(root.resolve()).as_posix()
    except (OSError, ValueError):
        # A frozen build may not contain the source tree. Keep only the filename
        # instead of exposing a full user profile or checkout path.
        return Path(path).name


def audit_app(app: Any, source_root: Path | None = None) -> dict[str, Any]:
    """Build a deterministic, non-invasive endpoint security review."""

    root = source_root or Path(__file__).resolve().parents[2]
    routes = inventory_routes(app)
    findings = _route_findings(routes)
    api_source = root / "apps" / "api" / "main.py"
    findings.extend(_ast_findings(api_source))
    frontend_files = list((root / "src").glob("*.tsx")) if (root / "src").exists() else []
    for source_path in frontend_files:
        try:
            source_text = source_path.read_text(encoding="utf-8")
        except (OSError, UnicodeError):
            continue
        if "dangerouslySetInnerHTML" in source_text:
            line = source_text[:source_text.index("dangerouslySetInnerHTML")].count("\n") + 1
            findings.append(_finding(
                "frontend-dangerous-html",
                "high",
                "needs_human_review",
                "Frontend chèn HTML nguy hiểm",
                f"{source_path.name}:{line} chứa dangerouslySetInnerHTML.",
                "Render dữ liệu không tin cậy bằng text node hoặc sanitize bằng policy rõ ràng.",
                source_file=str(source_path),
                source_line=line,
            ))
    if not any(finding["id"] == "source-shell-true" for finding in findings):
        findings.append(_finding(
            "control-no-shell-true",
            "info",
            "verified_control",
            "Không phát hiện shell=True trong API source",
            "AST scan không thấy subprocess call với shell=True.",
            "Giữ nguyên argv list, shell=False và timeout cho mọi subprocess mới.",
            source_file=str(api_source) if api_source.exists() else None,
        ))
    if not any(finding["id"] == "source-cors-wildcard" for finding in findings):
        findings.append(_finding(
            "control-cors-not-wildcard",
            "info",
            "verified_control",
            "CORS không dùng wildcard",
            "AST/text scan không thấy allow_origins=['*'] trong API source.",
            "Giữ allowlist origin cụ thể khi mở preview hoặc public beta.",
            source_file=str(api_source) if api_source.exists() else None,
        ))
    public_routes = []
    for route in routes:
        public_route = {key: value for key, value in route.items() if key != "source"}
        public_route["source_file"] = _display_path(public_route.get("source_file"), root)
        public_routes.append(public_route)
    public_findings = []
    for finding in findings:
        public_finding = dict(finding)
        public_finding["source_file"] = _display_path(public_finding.get("source_file"), root)
        public_findings.append(public_finding)
    public_findings.sort(key=lambda item: (-SEVERITY_ORDER[item["severity"]], item["id"]))
    status_counts: dict[str, int] = {}
    severity_counts: dict[str, int] = {}
    for finding in public_findings:
        status_counts[finding["status"]] = status_counts.get(finding["status"], 0) + 1
        severity_counts[finding["severity"]] = severity_counts.get(finding["severity"], 0) + 1
    return {
        "mode": "passive",
        "safe_mode": True,
        "network_requests": 0,
        "payloads_sent": 0,
        "external_tools": [],
        "source_root": "project",
        "route_count": len(routes),
        "routes": public_routes,
        "findings": public_findings,
        "summary": {
            "status_counts": status_counts,
            "severity_counts": severity_counts,
            "candidate_count": status_counts.get("candidate", 0),
            "needs_human_review": status_counts.get("needs_human_review", 0),
            "verified_controls": status_counts.get("verified_control", 0),
        },
        "limitations_vi": [
            "Đây là review thụ động; không gửi request tới target và không chứng minh exploitability.",
            "Finding cần human review là dấu hiệu để đọc code/test trên staging có ủy quyền.",
            "Không clone, cài hoặc gọi RedAmon hay công cụ tấn công nào.",
        ],
    }
