from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def difficulty_for(phase_order: int) -> str:
    if phase_order <= 1:
        return "easy"
    if phase_order <= 7:
        return "medium"
    return "hard"


def apply_editorial(exercises: list[dict[str, Any]]) -> None:
    """Apply reviewed Vietnamese prose while protecting generated metadata."""
    payload = read_json(CONTENT / "exercise_editorial_vi.json")
    if not isinstance(payload, dict) or payload.get("schema_version") != 1:
        raise ValueError("Exercise editorial source must use schema_version 1")
    overrides = payload.get("exercises")
    if not isinstance(overrides, dict):
        raise ValueError("Exercise editorial source must contain an exercises object")
    by_slug = {exercise["slug"]: exercise for exercise in exercises}
    unknown = set(overrides) - set(by_slug)
    if unknown:
        raise ValueError(f"Unknown exercise editorial slugs: {', '.join(sorted(unknown))}")
    for slug, fields in overrides.items():
        if not isinstance(fields, dict) or set(fields) != {"title_vi", "description_vi", "hints"}:
            raise ValueError(f"{slug}: editorial fields must be title_vi, description_vi and hints")
        for field in ("title_vi", "description_vi"):
            if not isinstance(fields[field], str) or not fields[field].strip():
                raise ValueError(f"{slug}: {field} must be nonempty text")
        hints = fields["hints"]
        if not isinstance(hints, list) or not hints or any(
            not isinstance(hint, str) or not hint.strip() for hint in hints
        ):
            raise ValueError(f"{slug}: hints must be a nonempty list of nonempty text")
        by_slug[slug].update(fields)


def build_catalog() -> dict[str, Any]:
    curriculum = read_json(CONTENT / "curriculum.json")
    guides = read_json(CONTENT / "module_guides.json").get("modules", {})
    exercises: list[dict[str, Any]] = []
    index = 1

    for phase in curriculum["phases"]:
        for module in phase["modules"]:
            guide = guides.get(module["slug"], {})
            lesson_slugs = [
                f"{phase['slug']}-{module['slug']}-{lesson_index}"
                for lesson_index, _ in enumerate(module["lessons"], start=1)
            ]
            practice_vi = guide.get("practice_vi", f"Áp dụng {module['title_vi']} vào một bài toán nhỏ có thể kiểm tra.")
            practice_en = guide.get("practice_en", f"Apply {module['title_en']} to a small verifiable problem.")
            checkpoint_vi = guide.get("checkpoint_vi", "Trình bày được giả định, trường hợp biên và cách kiểm tra kết quả.")
            checkpoint_en = guide.get("checkpoint_en", "Explain assumptions, edge cases, and how to verify the result.")
            exercises.append({
                "id": index,
                "slug": f"exercise-{phase['order']}-{module['slug']}",
                "phase_id": phase["slug"],
                "module_id": module["slug"],
                "lesson_slugs": lesson_slugs,
                "title_vi": f"Thực hành · {module['title_vi']}",
                "title_en": f"Lab · {module['title_en']}",
                "description_vi": f"{practice_vi}\n\nTự kiểm tra: {checkpoint_vi}",
                "description_en": f"{practice_en}\n\nCheckpoint: {checkpoint_en}",
                "difficulty": difficulty_for(int(phase["order"])),
                "estimated_minutes": max(45, len(lesson_slugs) * 25),
                "test_command": "Dùng bản sao mã nguồn hoặc ứng dụng chạy trực tiếp để mở thư mục bài tập và chạy kiểm thử trên máy cá nhân.",
                "hints": [checkpoint_vi],
            })
            index += 1

    apply_editorial(exercises)
    return {"schema_version": "1.0", "exercises": exercises}


def main() -> None:
    parser = argparse.ArgumentParser(description="Build the hosted exercise catalog.")
    parser.add_argument("--output", type=Path, default=CONTENT / "exercises.json")
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(build_catalog(), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
