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
    "why_it_matters_vi", "why_it_matters_en", "study_steps_vi", "study_steps_en",
    "practice_plan", "interview_questions",
}
required_tool_fields = {
    "slug", "name", "category", "when_vi", "when_en", "when_not_vi", "when_not_en",
    "install_vi", "install_en", "how_vi", "how_en", "commands", "error_vi", "error_en",
    "combine_vi", "combine_en", "risks_vi", "risks_en", "lesson_refs",
}
required_resource_fields = {
    "slug", "title_vi", "title_en", "provider", "url", "type", "language", "level",
    "official", "phase_ids", "description_vi", "description_en", "how_to_use_vi", "how_to_use_en",
}


def main() -> None:
    curriculum = json.loads((ROOT / "content" / "curriculum.json").read_text(encoding="utf-8"))
    catalog = json.loads((ROOT / "content" / "lessons.json").read_text(encoding="utf-8"))
    phases = curriculum.get("phases", [])
    lessons = catalog.get("lessons", [])
    assert len(phases) == 23, f"expected 23 phases (core + 15 GenAI stages), got {len(phases)}"
    assert sum(1 for phase in phases if phase.get("track") == "genai-specialization") == 15, "GenAI specialization stages are incomplete"
    expected_lesson_count = sum(len(module["lessons"]) for phase in phases for module in phase["modules"])
    assert len(lessons) == expected_lesson_count, f"expected {expected_lesson_count} lessons, got {len(lessons)}"
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
        assert len(item["study_steps_vi"]) >= 4 and len(item["study_steps_en"]) >= 4, f"study plan is too short for {item['lesson_id']}"
        assert item["practice_plan"].get("vi", {}).get("task") and item["practice_plan"].get("en", {}).get("task")
        assert len(item["interview_questions"].get("vi", [])) >= 3
        assert any(resource.get("language") == "en" for resource in item["resources"]), f"no English resource for {item['lesson_id']}"
        assert any(resource.get("language") == "vi" for resource in item["resources"]), f"no Vietnamese support resource for {item['lesson_id']}"
        for resource in item["resources"]:
            assert resource.get("purpose_vi") and resource.get("read_vi"), f"resource guidance missing for {item['lesson_id']}"
            if resource.get("kind") == "in_app":
                assert not resource.get("url"), f"internal resource must not have an external URL: {item['lesson_id']}"
            else:
                parsed = urlparse(resource["url"])
                assert parsed.scheme in {"http", "https"} and parsed.netloc, f"invalid resource URL: {resource['url']}"
                assert resource["url"] != "https://github.com/Hzyl/JouneyAIEngineer", "generic repository link is not a study resource"
    guides = json.loads((ROOT / "content" / "module_guides.json").read_text(encoding="utf-8"))
    module_slugs = {module["slug"] for phase in phases for module in phase["modules"]}
    assert module_slugs == set(guides.get("modules", {})), "every curriculum module needs a module guide"
    guide_fields = {"focus_vi", "focus_en", "practice_vi", "practice_en", "checkpoint_vi", "checkpoint_en"}
    assert all(guide_fields.issubset(value) for value in guides["modules"].values()), "module guide fields are incomplete"
    tools = json.loads((ROOT / "content" / "tools.json").read_text(encoding="utf-8"))
    assert tools and all(required_tool_fields.issubset(tool) for tool in tools), "tool guide fields are incomplete"
    resources_path = ROOT / "content" / "resources.json"
    resources = json.loads(resources_path.read_text(encoding="utf-8")).get("resources", [])
    assert len(resources) >= 20, "reference library should contain at least 20 sources"
    assert len({item["slug"] for item in resources}) == len(resources), "resource slugs must be unique"
    phase_slugs = {f"phase-{index:02d}" for index, _ in enumerate(phases)}
    missing_resources = {item["slug"]: sorted(required_resource_fields - item.keys()) for item in resources if required_resource_fields - item.keys()}
    assert not missing_resources, f"missing resource fields: {missing_resources}"
    for item in resources:
        parsed = urlparse(item["url"])
        assert parsed.scheme in {"http", "https"} and parsed.netloc, f"invalid resource URL: {item['url']}"
        assert item["phase_ids"] and set(item["phase_ids"]).issubset(phase_slugs), f"invalid phase mapping: {item['slug']}"
        assert item["description_vi"] and item["how_to_use_vi"], f"resource guidance missing: {item['slug']}"
    assert any(item["url"] == "https://github.com/rohitg00/ai-engineering-from-scratch" for item in resources), "requested AI Engineering from Scratch reference is missing"
    program = curriculum["program"]
    projects = program.get("portfolio_projects", [])
    assert len(projects) >= 4 and len({project["slug"] for project in projects}) == len(projects), "portfolio projects are incomplete"
    assert all(project.get("deliverables") and project.get("evaluation") for project in projects), "portfolio project evidence is incomplete"
    assert len(program.get("career_checklist", [])) >= 6, "career checklist is incomplete"
    print(f"Content valid: {len(phases)} phases, {len(lessons)} structured lessons, {len(tools)} tool guides, {len(resources)} reference sources")


if __name__ == "__main__":
    main()
