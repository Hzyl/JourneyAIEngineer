"""English copy for passive findings; identifiers and Vietnamese fields stay stable."""

from pathlib import Path


COPY = {
    "source-shell-true": (
        "Subprocess call uses shell=True",
        "Remove shell=True; use an argument list, a command allowlist and input-boundary tests.",
    ),
    "source-sql-fstring": (
        "SQL query is built with an f-string",
        "Review every dynamic value. Parameterize user data and allowlist any dynamic SQL structure.",
    ),
    "source-cors-wildcard": (
        "CORS allows every origin",
        "Use an explicit origin allowlist and review credentials and CORS before publishing.",
    ),
    "endpoint-online-auth": (
        "Write endpoint has no obvious authentication marker in its handler",
        "Keep this endpoint local-only or verify authentication, authorization, rate limits and audit logging before hosting.",
    ),
    "endpoint-input-contract": (
        "Write endpoint has no explicit body model",
        "Define a Pydantic input contract or document why this endpoint does not accept a body.",
    ),
    "endpoint-input-size": (
        "String input has no declared maximum length",
        "Set an appropriate length limit or document why it is open-ended, then review gateway payload limits and rate limits.",
    ),
    "frontend-dangerous-html": (
        "Frontend inserts raw HTML",
        "Render untrusted content as text or sanitize it with an explicit policy.",
    ),
    "control-no-shell-true": (
        "No shell=True call found in the inspected API source",
        "Keep argument lists, shell=False and timeouts for new subprocess calls.",
    ),
    "control-cors-not-wildcard": (
        "No wildcard CORS list found in the inspected API source",
        "Keep an explicit origin allowlist for previews and public beta.",
    ),
    "source-inspection-unavailable": (
        "API source could not be inspected",
        "Use a source checkout with readable, valid Python files and run the review again.",
    ),
}

LIMITATIONS_EN = [
    "This is a passive review: it sends no requests to target endpoints and does not prove exploitability.",
    "Findings identify code to read and test in an authorized staging environment; they are not confirmed vulnerabilities.",
    "Pattern checks cover apps/api/main.py and top-level src/*.tsx files, not every dependency or runtime control.",
    "No external security tool is installed or executed.",
]

LIMITATIONS_VI = [
    "Đây là rà soát thụ động: không gửi yêu cầu tới các điểm cuối được kiểm tra và không chứng minh có thể khai thác lỗ hổng.",
    "Mỗi kết quả chỉ ra phần mã nguồn cần đọc và kiểm thử trong môi trường được cho phép; đó chưa phải lỗ hổng đã xác nhận.",
    "Phép kiểm tra mẫu mã chỉ bao gồm apps/api/main.py và các tệp src/*.tsx ở cấp đầu; chưa bao phủ mọi thư viện phụ thuộc hay biện pháp bảo vệ khi ứng dụng chạy.",
    "Không cài hoặc chạy công cụ bảo mật bên ngoài.",
]


def english_finding(finding: dict, evidence_override: str = "") -> dict[str, str]:
    rule = next(key for key in COPY if finding["id"] == key or finding["id"].startswith(key + "-"))
    title, remediation = COPY[rule]
    filename = Path(finding["source_file"]).name if finding["source_file"] else "API source"
    location = f"{filename}:{finding['source_line']}"
    endpoint = f"{'/'.join(finding['methods'])} {finding['path']}"
    evidence = {
        "source-shell-true": f"{location} contains a call with shell=True.",
        "source-sql-fstring": f"{location} passes an f-string to execute().",
        "source-cors-wildcard": f"{location} contains a wildcard allow_origins list.",
        "endpoint-online-auth": f"{endpoint} has no recognized auth/token marker in its handler source. Middleware is not evaluated.",
        "endpoint-input-contract": f"{endpoint} exposes no Pydantic body model in route metadata.",
        "endpoint-input-size": f"{endpoint} includes string fields without maxLength in its schema.",
        "frontend-dangerous-html": f"{location} contains dangerouslySetInnerHTML.",
        "control-no-shell-true": "The parsed API file has no recognized subprocess call with shell=True.",
        "control-cors-not-wildcard": "The parsed API file has no recognized wildcard allow_origins list.",
        "source-inspection-unavailable": "The API file is missing, unreadable, too large or not valid Python. No source guardrail is marked as checked.",
    }[rule]
    return {"title_en": title, "evidence_en": evidence_override or evidence, "remediation_en": remediation}
