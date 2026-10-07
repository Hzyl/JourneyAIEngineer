"""Load reviewed lesson sources while preserving stable legacy identifiers."""

import json
from pathlib import Path
from typing import Any


def load_lesson_catalog(path: Path) -> dict[str, dict[str, Any]]:
    if not path.exists():
        return {}
    payload = json.loads(path.read_text(encoding="utf-8"))
    items = payload.get("lessons", [])
    lessons = {item["lesson_id"]: {**item, "quality_status": "draft"} for item in items}
    if len(lessons) != len(items):
        raise ValueError("Duplicate lesson identifiers in catalog")
    for source in sorted((path.parent / "curated").glob("*.json")):
        reviewed = json.loads(source.read_text(encoding="utf-8"))
        lesson_id = reviewed.get("lesson_id")
        original = lessons.get(lesson_id)
        if original is None or source.stem != lesson_id:
            raise ValueError(f"Unknown or mismatched curated lesson: {source.name}")
        for field in ("phase_id", "module_id", "prerequisites", "review_item_ids", "exercise_ids"):
            if reviewed.get(field) != original.get(field):
                raise ValueError(f"Curated lesson changes stable {field}: {lesson_id}")
        if reviewed.get("quality_status") != "reviewed" or not reviewed.get("reviewed_at"):
            raise ValueError(f"Curated lesson has no review metadata: {lesson_id}")
        lessons[lesson_id] = reviewed
    return lessons


def validate_portfolio_references(curriculum: dict) -> None:
    phase_ids = {phase["slug"] for phase in curriculum["phases"]}
    projects = curriculum["program"].get("portfolio_projects", [])
    slugs = [project["slug"] for project in projects]
    if len(set(slugs)) != len(slugs):
        raise ValueError("Duplicate portfolio project identifiers")
    for project in projects:
        if project["phase_id"] not in phase_ids:
            raise ValueError(f"Unknown portfolio phase: {project['slug']} -> {project['phase_id']}")


def validate_learning_routes(payload: dict, curriculum: dict) -> None:
    if payload.get("schema_version") != 1:
        raise ValueError("Unsupported learning route schema")
    phase_ids = {phase["slug"] for phase in curriculum["phases"]}
    routes = payload.get("routes", [])
    identifiers = [route["id"] for route in routes]
    if not routes or len(set(identifiers)) != len(identifiers):
        raise ValueError("Learning route identifiers must be unique")
    for route in routes:
        phases = route.get("phase_ids", [])
        if not phases or len(phases) != len(set(phases)) or not set(phases) <= phase_ids:
            raise ValueError(f"Invalid phases in learning route: {route['id']}")
        hours = route.get("weekly_hours", [])
        if len(hours) != 2 or not 0 < hours[0] <= hours[1] <= 40:
            raise ValueError(f"Invalid weekly budget: {route['id']}")
        for field in ("title", "audience", "outcome", "next"):
            if not all(route.get(f"{field}_{language}") for language in ("vi", "en")):
                raise ValueError(f"Missing bilingual {field}: {route['id']}")
