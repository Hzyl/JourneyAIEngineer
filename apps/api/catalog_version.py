"""Portable content fingerprint independent of checkout line endings."""
import hashlib
import json
from pathlib import Path


def catalog_metadata(content: Path, app_version: str) -> dict:
    digest = hashlib.sha256()
    for path in sorted(content.rglob("*")):
        if path.suffix not in {".json", ".md", ".py"} or path.name == "catalog-version.json":
            continue
        text = path.read_text(encoding="utf-8-sig").replace("\r\n", "\n")
        if path.suffix == ".json":
            text = json.dumps(json.loads(text), sort_keys=True, ensure_ascii=False, separators=(",", ":"))
        digest.update(path.relative_to(content).as_posix().encode())
        digest.update(b"\0")
        digest.update(text.encode("utf-8"))
        digest.update(b"\0")
    return {"schema_version": 1, "app_version": app_version, "content_sha256": digest.hexdigest()}
