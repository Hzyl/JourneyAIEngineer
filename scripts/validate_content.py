"""Strict validation for the version-controlled curriculum and lesson sources."""
from __future__ import annotations

import ast
import json
import sys
import tempfile
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

REQUIRED_LESSON_FIELDS = {
    "lesson_id", "phase_id", "module_id", "title_vi", "title_en", "summary_vi", "summary_en",
    "learning_objectives", "learning_objectives_en", "prerequisites", "key_terms", "concept_notes_vi",
    "concept_notes_en", "formulas", "code_examples", "resources", "exercise_ids", "review_item_ids",
    "estimated_minutes", "completion_checklist", "completion_criteria", "common_mistakes", "next_lessons",
    "why_it_matters_vi", "why_it_matters_en", "study_steps_vi", "study_steps_en", "practice_plan",
    "interview_questions", "review_cards", "review_question_vi", "review_question_en", "review_answer_vi", "review_answer_en",
}
REQUIRED_RESOURCE_FIELDS = {"title", "url", "language", "kind", "purpose_vi", "purpose_en", "read_vi", "read_en"}


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _acyclic(nodes: set[str], edges: dict[str, list[str]], label: str) -> None:
    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(node: str) -> None:
        if node in visiting:
            raise AssertionError(f"{label} graph contains a cycle at {node}")
        if node in visited:
            return
        visiting.add(node)
        for target in edges.get(node, []):
            visit(target)
        visiting.remove(node)
        visited.add(node)

    for node in nodes:
        visit(node)


def _validate_python_snippets(lessons: list[dict]) -> None:
    snippets: list[str] = []
    for lesson in lessons:
        examples = lesson["code_examples"]
        _assert(examples, f"no code example for {lesson['lesson_id']}")
        for index, example in enumerate(examples):
            language = example.get("language", "").lower()
            _assert(language in {"python", "powershell", "bash", "sql", "json"},
                    f"unsupported snippet language in {lesson['lesson_id']}")
            code = example.get("code", "")
            _assert(code.strip(), f"empty code example {lesson['lesson_id']}:{index}")
            _assert(example.get("status") in {"runnable", "conceptual"}, f"code example status missing: {lesson['lesson_id']}:{index}")
            _assert(all(example.get(field) for field in ("title", "purpose_vi", "purpose_en", "setup", "expected_output", "edge_case_vi", "edge_case_en")), f"code example guidance missing: {lesson['lesson_id']}:{index}")
            if language != "python":
                _assert(example.get("status") == "conceptual", "non-Python snippets require manual environment checks")
                continue
            try:
                ast.parse(code, filename=f"{lesson['lesson_id']}:{index}")
                compile(code, f"{lesson['lesson_id']}:{index}", "exec")
            except SyntaxError as error:
                raise AssertionError(f"Python snippet does not compile: {lesson['lesson_id']}:{index}: {error}") from error
            snippets.append(code)
    duplicates = [snippet for snippet, count in Counter(snippets).items() if count > 1]
    _assert(not duplicates, f"duplicate code snippets found ({len(duplicates)})")


def validate(root: Path = ROOT) -> None:
    content = root / "content"
    curriculum = json.loads((content / "curriculum.json").read_text(encoding="utf-8"))
    catalog = json.loads((content / "lessons.json").read_text(encoding="utf-8"))
    phases = curriculum.get("phases", [])
    lessons = catalog.get("lessons", [])
    expected_ids = [f"{phase['slug']}-{module['slug']}-{index + 1}" for phase in phases for module in phase["modules"] for index, _ in enumerate(module["lessons"])]
    ids = [lesson.get("lesson_id") for lesson in lessons]
    _assert(len(phases) == 23, f"expected 23 phases, got {len(phases)}")
    _assert(len(lessons) == len(expected_ids) == 208, f"expected 208 lessons, got {len(lessons)}")
    _assert(ids == expected_ids and len(set(ids)) == len(ids), "catalog order or IDs do not match curriculum")

    source_dir = content / "lessons"
    source_paths = sorted(source_dir.glob("*.md"))
    _assert(len(source_paths) == len(expected_ids), "every lesson must have one Markdown source")
    _assert({path.stem for path in source_paths} == set(expected_ids), "lesson source filenames do not match IDs")
    from scripts.build_lesson_catalog import build
    with tempfile.TemporaryDirectory() as tmp:
        generated_path = Path(tmp) / "lessons.json"
        build(generated_path)
        generated = json.loads(generated_path.read_text(encoding="utf-8"))
    _assert(generated == catalog, "lessons.json is stale; run build_lesson_catalog.py")

    from apps.api.catalog_content import load_lesson_catalog, validate_portfolio_references, validate_learning_routes
    validate_portfolio_references(curriculum)
    validate_learning_routes(json.loads((content / "learning_routes.json").read_text(encoding="utf-8")), curriculum)
    lessons = list(load_lesson_catalog(content / "lessons.json").values())

    missing = {lesson["lesson_id"]: sorted(REQUIRED_LESSON_FIELDS - lesson.keys()) for lesson in lessons if REQUIRED_LESSON_FIELDS - lesson.keys()}
    _assert(not missing, f"missing required lesson fields: {missing}")
    lesson_ids = set(ids)
    phase_by_slug = {phase["slug"]: phase for phase in phases}
    phase_aliases = {f"phase-{phase['order']:02d}" for phase in phases}
    exercise_ids = {f"exercise-{phase['order']}-{module['slug']}" for phase in phases for module in phase["modules"]}
    for lesson in lessons:
        lid = lesson["lesson_id"]
        _assert(lesson["phase_id"] in phase_by_slug, f"invalid phase reference: {lid}")
        _assert(lesson["estimated_minutes"] > 0, f"invalid workload: {lid}")
        for field in ("learning_objectives", "learning_objectives_en", "completion_checklist", "completion_criteria", "common_mistakes", "study_steps_vi", "study_steps_en"):
            _assert(isinstance(lesson[field], list) and lesson[field], f"empty {field}: {lid}")
        _assert(len(lesson["study_steps_vi"]) >= 4 and len(lesson["study_steps_en"]) >= 4, f"study plan too short: {lid}")
        _assert(lesson["practice_plan"].get("vi", {}).get("task") and lesson["practice_plan"].get("en", {}).get("task"), f"practice task missing: {lid}")
        _assert(len(lesson["interview_questions"].get("vi", [])) >= 3, f"interview review too short: {lid}")
        _assert(set(lesson["prerequisites"]).issubset(lesson_ids), f"invalid prerequisite reference: {lid}")
        _assert(set(lesson["next_lessons"]).issubset(lesson_ids), f"invalid next lesson reference: {lid}")
        _assert(set(lesson["exercise_ids"]).issubset(exercise_ids), f"exercise does not resolve: {lid}")
        cards = lesson["review_cards"]
        _assert(isinstance(cards, list) and len(cards) >= 4, f"each lesson needs at least four review cards: {lid}")
        _assert([card.get("id") for card in cards] == lesson["review_item_ids"], f"review card IDs do not resolve: {lid}")
        _assert({card.get("type") for card in cards} >= {"recall", "application", "debug", "interview"}, f"review card types incomplete: {lid}")
        for card in cards:
            _assert(all(card.get(field) for field in ("id", "type", "question_vi", "question_en", "answer_vi", "answer_en", "hint_vi", "hint_en")), f"review card fields missing: {lid}")
        for resource in lesson["resources"]:
            _assert(REQUIRED_RESOURCE_FIELDS.issubset(resource), f"resource fields missing: {lid}")
            if resource["kind"] == "in_app":
                _assert(not resource["url"], f"in-app resource must not have URL: {lid}")
            else:
                parsed = urlparse(resource["url"])
                _assert(parsed.scheme in {"http", "https"} and parsed.netloc, f"invalid resource URL: {resource['url']}")

    _acyclic(lesson_ids, {lesson["lesson_id"]: lesson["prerequisites"] for lesson in lessons}, "prerequisite")
    _acyclic(lesson_ids, {lesson["lesson_id"]: lesson["next_lessons"] for lesson in lessons}, "next lesson")
    _validate_python_snippets(lessons)
    for field in ("concept_notes_vi", "concept_notes_en", "review_answer_vi", "review_answer_en"):
        duplicates = {value: count for value, count in Counter(lesson[field] for lesson in lessons).items() if count > 1}
        _assert(not duplicates, f"duplicate generic {field}: {len(duplicates)} values")
    all_card_answers = [card["answer_vi"] for lesson in lessons for card in lesson["review_cards"]]
    duplicate_card_answers = [value for value, count in Counter(all_card_answers).items() if count > 1]
    _assert(not duplicate_card_answers, f"duplicate review card answers found: {len(duplicate_card_answers)}")

    guides = json.loads((content / "module_guides.json").read_text(encoding="utf-8"))
    module_slugs = {module["slug"] for phase in phases for module in phase["modules"]}
    _assert(module_slugs == set(guides.get("modules", {})), "every curriculum module needs a module guide")
    resources = json.loads((content / "resources.json").read_text(encoding="utf-8")).get("resources", [])
    _assert(len(resources) >= 20 and len({item["slug"] for item in resources}) == len(resources), "reference library is incomplete")
    for resource in resources:
        parsed = urlparse(resource["url"])
        _assert(parsed.scheme in {"http", "https"} and parsed.netloc, f"invalid reference URL: {resource['slug']}")
        _assert(resource["phase_ids"] and all(phase_id in phase_by_slug or phase_id in phase_aliases for phase_id in resource["phase_ids"]), f"invalid phase mapping: {resource['slug']}")

    accelerated = curriculum["program"].get("accelerated_track")
    _assert(isinstance(accelerated, dict), "accelerated_track metadata is required")
    mapping = accelerated.get("lesson_map", [])
    _assert(accelerated.get("weeks") == curriculum["program"].get("accelerated_weeks"), "accelerated weeks mismatch")
    _assert({item.get("lesson_id") for item in mapping} == lesson_ids and len(mapping) == len(lessons), "accelerated lesson map is incomplete")
    _assert(all(1 <= item.get("week", 0) <= accelerated["weeks"] and item.get("workload_minutes", 0) > 0 for item in mapping), "accelerated workload metadata is invalid")


def main() -> None:
    validate()
    print("Content valid: 23 phases, 208 structured lessons, canonical Markdown sources, and strict reference checks")


if __name__ == "__main__":
    main()
