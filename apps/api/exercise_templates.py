"""Versioned exercise checks, kept separate from learner-owned source files."""

import hashlib
import json
import re
from pathlib import Path


def read_template(content_root: Path, slug: str) -> dict | None:
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", slug):
        raise ValueError("Invalid exercise template identifier")
    folder = content_root / "exercise_templates" / slug
    manifest = folder / "manifest.json"
    if not manifest.exists():
        return None
    metadata = json.loads(manifest.read_text(encoding="utf-8"))
    if metadata.get("exercise_slug") != slug or metadata.get("schema_version") != 1:
        raise ValueError("Invalid exercise template manifest")
    return {
        **metadata,
        "starter_code": (folder / "starter.py").read_text(encoding="utf-8"),
        "test_code": (folder / "test_exercise.py").read_text(encoding="utf-8"),
        "description_vi": (folder / "README.vi.md").read_text(encoding="utf-8"),
        "description_en": (folder / "README.en.md").read_text(encoding="utf-8"),
    }


def managed_checks(workspace: Path, template: dict) -> tuple[str, bool]:
    code = template["test_code"]
    version = hashlib.sha256(code.encode("utf-8")).hexdigest()[:16]
    relative = f".journey-checks/{version}"
    folder = workspace / relative
    if not folder.resolve().is_relative_to(workspace.resolve()):
        raise ValueError("Exercise checks must stay inside the workspace")
    folder.mkdir(parents=True, exist_ok=True)
    file = folder / "test_exercise.py"
    if not file.resolve().is_relative_to(workspace.resolve()):
        raise ValueError("Exercise check file must stay inside the workspace")
    if file.exists():
        if file.read_text(encoding="utf-8") != code:
            raise ValueError("Managed exercise checks were modified; restore them from the versioned template")
        return relative, False
    file.write_text(code, encoding="utf-8")
    return relative, True


def prepare_template_workspace(workspace: Path, template: dict) -> bool:
    workspace.mkdir(parents=True, exist_ok=True)
    _, changed = managed_checks(workspace, template)
    files = {
        "starter.py": template["starter_code"],
        "test_exercise.py": template["test_code"],
        "README.md": template["description_vi"],
        "README.en.md": template["description_en"],
    }
    for name, content in files.items():
        file = workspace / name
        if not file.resolve().is_relative_to(workspace.resolve()):
            raise ValueError("Exercise files must stay inside the workspace")
        if not file.exists():
            file.write_text(content, encoding="utf-8")
            changed = True
    return changed
