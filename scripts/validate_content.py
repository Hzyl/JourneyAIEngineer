"""Validate the version-controlled curriculum before it is pushed."""

from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
required_lesson_fields = {
    "lesson_id", "phase_id", "module_id", "title_vi", "title_en", "summary_vi", "summary_en",
    "learning_objectives", "prerequisites", "key_terms", "concept_notes_vi", "concept_notes_en",
    "formulas", "code_examples", "resources", "exercise_ids", "review_item_ids", "estimated_minutes",
    "completion_checklist", "completion_criteria", "common_mistakes", "next_lessons",
}
required_tool_fields = {
    "slug", "name", "category", "when_vi", "when_en", "when_not_vi", "when_not_en",
    "install_vi", "install_en", "how_vi", "how_en", "commands", "error_vi", "error_en",
    "combine_vi", "combine_en", "risks_vi", "risks_en", "lesson_refs",
}


def main() -> None:
    curriculum = json.loads((ROOT / "content" / "curriculum.json").read_text(encoding="utf-8"))
    catalog = json.loads((ROOT / "content" / "lessons.json").read_text(encoding="utf-8"))
    phases = curriculum.get("phases", [])
    lessons = catalog.get("lessons", [])
    assert len(phases) == 8, f"expected 8 phases, got {len(phases)}"
    assert len(lessons) == 148, f"expected 148 lessons, got {len(lessons)}"
    assert len({item["lesson_id"] for item in lessons}) == len(lessons), "lesson ids must be unique"
    expected_ids = {
        f"{phase['slug']}-{module['slug']}-{lesson_index + 1}"
        for phase in phases
        for module in phase["modules"]
        for lesson_index, _ in enumerate(module["lessons"])
    }
    assert {item["lesson_id"] for item in lessons} == expected_ids, "lesson catalog does not match curriculum"
    missing = {item["lesson_id"]: sorted(required_lesson_fields - item.keys()) for item in lessons if required_lesson_fields - item.keys()}
    assert not missing, f"missing lesson fields: {missing}"
    for item in lessons:
        assert item["estimated_minutes"] > 0
        assert item["learning_objectives"] and item.get("learning_objectives_en")
        assert item["completion_checklist"] and item["completion_criteria"]
        assert item["exercise_ids"] and item["review_item_ids"]
        assert item["code_examples"], f"no code example for {item['lesson_id']}"
        assert any(resource.get("language") == "en" for resource in item["resources"]), f"no English resource for {item['lesson_id']}"
        assert any(resource.get("language") == "vi" for resource in item["resources"]), f"no Vietnamese support resource for {item['lesson_id']}"
        for resource in item["resources"]:
            parsed = urlparse(resource["url"])
            assert parsed.scheme in {"http", "https"} and parsed.netloc, f"invalid resource URL: {resource['url']}"
    tools = json.loads((ROOT / "content" / "tools.json").read_text(encoding="utf-8"))
    assert tools and all(required_tool_fields.issubset(tool) for tool in tools), "tool guide fields are incomplete"
    program = curriculum["program"]
    projects = program.get("portfolio_projects", [])
    assert len(projects) >= 4 and len({project["slug"] for project in projects}) == len(projects), "portfolio projects are incomplete"
    assert all(project.get("deliverables") and project.get("evaluation") for project in projects), "portfolio project evidence is incomplete"
    assert len(program.get("career_checklist", [])) >= 6, "career checklist is incomplete"
    print(f"Content valid: {len(phases)} phases, {len(lessons)} structured lessons, {len(tools)} tool guides")


if __name__ == "__main__":
    main()
