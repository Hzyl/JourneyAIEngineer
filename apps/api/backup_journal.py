"""Validated journal destinations and atomic individual file replacement."""
from pathlib import Path, PureWindowsPath
import os
import tempfile


def journal_targets(root: Path, rows: list[dict]) -> list[tuple[Path, str]]:
    result = []
    seen = set()
    for row in rows:
        name = row.get("path") if isinstance(row, dict) else None
        if not isinstance(name, str) or not name or "\x00" in name or ":" in name:
            raise ValueError("Journal backup contains an unsafe path")
        windows = PureWindowsPath(name)
        relative = Path(name.replace("\\", "/"))
        if windows.drive or windows.root or relative.is_absolute() or ".." in relative.parts:
            raise ValueError("Journal backup must use relative paths inside the journal folder")
        if relative.suffix.lower() not in {".md", ".json", ".txt"}:
            raise ValueError("Journal backup contains an unsupported file type")
        if any(char in '<>:"|?*' or ord(char) < 32 for part in relative.parts for char in part):
            raise ValueError("Journal backup contains an invalid Windows filename")
        if any(part.rstrip(" .") != part or PureWindowsPath(part).is_reserved() for part in relative.parts):
            raise ValueError("Journal backup contains a reserved Windows filename")
        target = (root / relative).resolve()
        identity = str(target).casefold()
        if root.resolve() not in target.parents or target.is_dir() or identity in seen:
            raise ValueError("Journal backup contains an external, duplicate or directory destination")
        content = row.get("content")
        if not isinstance(content, str):
            raise ValueError("Journal content must be text")
        seen.add(identity)
        result.append((target, content))
    return result


def _replace_bytes(target: Path, data: bytes) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary = tempfile.mkstemp(prefix=".journey-import-", dir=target.parent)
    try:
        with os.fdopen(descriptor, "wb") as stream:
            stream.write(data)
        os.replace(temporary, target)
    finally:
        Path(temporary).unlink(missing_ok=True)
