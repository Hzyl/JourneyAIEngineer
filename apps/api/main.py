from __future__ import annotations

import json
import os
import re
import shlex
import shutil
import sqlite3
import subprocess
import sys
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field


IS_FROZEN = bool(getattr(sys, "frozen", False))
BUNDLE_ROOT = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parents[2])).resolve()
APP_ROOT = Path(sys.executable).resolve().parent if IS_FROZEN else BUNDLE_ROOT
PROJECT_ROOT = Path(os.environ.get("JOURNEY_PROJECT_ROOT", APP_ROOT if (APP_ROOT / ".git").exists() else BUNDLE_ROOT)).resolve()
DATA_ROOT = Path(os.environ.get("JOURNEY_DATA_DIR", APP_ROOT / ".data" if IS_FROZEN else BUNDLE_ROOT / ".data")).resolve()
DB_PATH = DATA_ROOT / "journey.db"
CONTENT_ROOT = Path(os.environ.get("JOURNEY_CONTENT_DIR", BUNDLE_ROOT / "content")).resolve()
WORKSPACE_ROOT = DATA_ROOT / "workspaces"
JOURNAL_ROOT = Path(os.environ.get("JOURNEY_JOURNAL_DIR", APP_ROOT / "journal" if IS_FROZEN else BUNDLE_ROOT / "journal")).resolve()
FRONTEND_ROOT = Path(os.environ.get("JOURNEY_FRONTEND_DIR", BUNDLE_ROOT / "dist")).resolve()
LESSON_CATALOG_PATH = CONTENT_ROOT / "lessons.json"
MODULE_GUIDES_PATH = CONTENT_ROOT / "module_guides.json"
SAFE_SLUG = re.compile(r"^[a-z0-9][a-z0-9-]*$")
SUBPROCESS_OPTIONS: dict[str, Any] = {}
if os.name == "nt":
    SUBPROCESS_OPTIONS["creationflags"] = getattr(subprocess, "CREATE_NO_WINDOW", 0)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def connect() -> sqlite3.Connection:
    DATA_ROOT.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def loads(value: str | None, fallback: Any = None) -> Any:
    if not value:
        return fallback if fallback is not None else []
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        return fallback if fallback is not None else []


def read_lesson_catalog() -> dict[str, dict[str, Any]]:
    """Read the editable lesson catalog without making the API depend on it."""

    if not LESSON_CATALOG_PATH.exists():
        return {}
    payload = json.loads(LESSON_CATALOG_PATH.read_text(encoding="utf-8"))
    return {item["lesson_id"]: item for item in payload.get("lessons", [])}


def read_module_guides() -> dict[str, dict[str, Any]]:
    if not MODULE_GUIDES_PATH.exists():
        return {}
    payload = json.loads(MODULE_GUIDES_PATH.read_text(encoding="utf-8"))
    return payload.get("modules", {})


EXERCISE_TEST_CODE = '''import unittest

from starter import solve


class ExerciseContractTest(unittest.TestCase):
    def test_solution_returns_reviewable_evidence(self):
        evidence = solve()
        self.assertIsInstance(evidence, dict)
        self.assertTrue(str(evidence.get("result", "")).strip(), "result must contain the computed outcome")
        self.assertTrue(str(evidence.get("explanation", "")).strip(), "explanation must describe the reasoning")


if __name__ == "__main__":
    unittest.main()
'''


def exercise_material(module: dict[str, Any], guides: dict[str, dict[str, Any]]) -> dict[str, str]:
    guide = guides.get(module["slug"], {})
    practice_vi = guide.get("practice_vi", f"Áp dụng module {module['title_vi']} vào một bài toán nhỏ.")
    practice_en = guide.get("practice_en", f"Apply {module['title_en']} to a small problem.")
    checkpoint_vi = guide.get("checkpoint_vi", "Giải thích được giả định, edge case và cách kiểm tra kết quả.")
    checkpoint_en = guide.get("checkpoint_en", "Explain assumptions, edge cases, and how to verify the result.")
    starter = f'''"""Practice: {module["title_vi"]}

Đọc README, làm task bên dưới và trả về evidence có thể review.
Task: {practice_vi}
"""


def solve() -> dict[str, str]:
    """Return the computed result and a short explanation of your reasoning."""
    # TODO: implement the module task; do not copy a tutorial without explaining it.
    raise NotImplementedError("Implement solve() before running the exercise test")


if __name__ == "__main__":
    print(solve())
'''
    description_vi = f"{practice_vi}\n\nCheckpoint: {checkpoint_vi}"
    description_en = f"{practice_en}\n\nCheckpoint: {checkpoint_en}"
    return {
        "description_vi": description_vi,
        "description_en": description_en,
        "starter_code": starter,
        "test_command": "python -m unittest -v test_exercise.py",
    }


def json_text(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False)


DEFAULT_SETTINGS = {
    "language": "vi",
    "track": "standard",
    "weekly_goal_minutes": "720",
    "show_completed_lessons": "true",
    "target_role": "internship",
    "experience_level": "beginner",
    "onboarding_complete": "false",
}


def settings_payload(db: sqlite3.Connection) -> dict[str, str]:
    values = dict(DEFAULT_SETTINGS)
    rows = db.execute("SELECT key,value FROM settings").fetchall()
    values.update({row["key"]: row["value"] for row in rows})
    return values


def study_streak(db: sqlite3.Connection) -> int:
    rows = db.execute("SELECT DISTINCT substr(created_at,1,10) AS day FROM study_sessions ORDER BY day DESC").fetchall()
    days = {row["day"] for row in rows}
    cursor = datetime.now(timezone.utc).date()
    streak = 0
    while cursor.isoformat() in days:
        streak += 1
        cursor -= timedelta(days=1)
    if streak == 0:
        cursor = datetime.now(timezone.utc).date() - timedelta(days=1)
        while cursor.isoformat() in days:
            streak += 1
            cursor -= timedelta(days=1)
    return streak


def redact_secrets(text: str) -> str:
    patterns = [
        re.compile(r"(?i)(api[_-]?key|secret|token|password)\s*([:=])\s*([^\s\n]+)"),
        re.compile(r"(?i)(authorization:\s*bearer\s+)([^\s\n]+)"),
    ]
    redacted = text
    for pattern in patterns:
        redacted = pattern.sub(lambda match: f"{match.group(1)}{match.group(2) if match.lastindex and match.lastindex >= 2 and match.group(2) in ':=' else ''}***REDACTED***", redacted)
    return redacted


SECRET_SCAN_PATTERNS = (
    re.compile(r"(?i)\b(?:api[_-]?key|secret|token|password)\b\s*[:=]\s*[\"']?[^\s\"']{8,}"),
    re.compile(r"(?i)\bgh[pousr]_[A-Za-z0-9_\-]{20,}\b"),
    re.compile(r"\bsk-[A-Za-z0-9]{20,}\b"),
    re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
)
PUBLISH_ROOTS = {"exercises", "projects", "journal"}
WORKSPACE_IGNORES = {".git", ".venv", "__pycache__", ".pytest_cache", "node_modules"}


def contains_secret(text: str) -> bool:
    return any(pattern.search(text) for pattern in SECRET_SCAN_PATTERNS)


def run_git(args: list[str], timeout: int = 15) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", "-C", str(PROJECT_ROOT), *args],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=timeout,
        shell=False,
        **SUBPROCESS_OPTIONS,
    )


def project_relative_path(raw_path: str) -> tuple[Path, str]:
    candidate_text = raw_path.strip().replace("\\", "/")
    if not candidate_text or Path(candidate_text).is_absolute():
        raise HTTPException(400, "Artifact path must be a relative repository path")
    candidate = (PROJECT_ROOT / candidate_text).resolve()
    project_root = PROJECT_ROOT.resolve()
    if candidate == project_root or project_root not in candidate.parents:
        raise HTTPException(400, "Artifact path escapes the project root")
    relative = candidate.relative_to(project_root)
    if not relative.parts or relative.parts[0] not in PUBLISH_ROOTS:
        raise HTTPException(400, "Only exercises, projects, and journal artifacts can be published")
    return candidate, relative.as_posix()


def scan_workspace_files(workspace_path: Path) -> tuple[list[Path], list[str]]:
    files: list[Path] = []
    skipped: list[str] = []
    for path in sorted(workspace_path.rglob("*")):
        relative = path.relative_to(workspace_path)
        if any(part in WORKSPACE_IGNORES or part.startswith(".env") for part in relative.parts) or path.suffix.lower() in {".db", ".sqlite", ".sqlite3"}:
            skipped.append(relative.as_posix())
            continue
        if path.is_symlink() or not path.is_file():
            skipped.append(relative.as_posix())
            continue
        files.append(path)
    return files, skipped


def ensure_schema(db: sqlite3.Connection) -> None:
    """Apply additive migrations so an existing local database keeps its data."""

    columns = {
        "concept_notes_vi": "TEXT NOT NULL DEFAULT ''",
        "concept_notes_en": "TEXT NOT NULL DEFAULT ''",
        "formulas_json": "TEXT NOT NULL DEFAULT '[]'",
        "code_examples_json": "TEXT NOT NULL DEFAULT '[]'",
        "common_mistakes_json": "TEXT NOT NULL DEFAULT '[]'",
        "next_lessons_json": "TEXT NOT NULL DEFAULT '[]'",
        "completion_criteria_json": "TEXT NOT NULL DEFAULT '[]'",
    }
    existing = {row[1] for row in db.execute("PRAGMA table_info(lessons)").fetchall()}
    for name, definition in columns.items():
        if name not in existing:
            db.execute(f"ALTER TABLE lessons ADD COLUMN {name} {definition}")
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS review_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            review_id INTEGER NOT NULL REFERENCES review_items(id) ON DELETE CASCADE,
            rating TEXT NOT NULL,
            thought_seconds INTEGER NOT NULL DEFAULT 0,
            answer_text TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL
        )
        """
    )
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        """
    )
def init_db() -> None:
    DATA_ROOT.mkdir(parents=True, exist_ok=True)
    WORKSPACE_ROOT.mkdir(parents=True, exist_ok=True)
    JOURNAL_ROOT.mkdir(parents=True, exist_ok=True)
    with connect() as db:
        db.executescript(
            """
            CREATE TABLE IF NOT EXISTS phases (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug TEXT NOT NULL UNIQUE,
                title_vi TEXT NOT NULL,
                title_en TEXT NOT NULL,
                summary_vi TEXT NOT NULL,
                summary_en TEXT NOT NULL,
                duration_weeks INTEGER NOT NULL,
                order_index INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS modules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                phase_id INTEGER NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
                slug TEXT NOT NULL UNIQUE,
                title_vi TEXT NOT NULL,
                title_en TEXT NOT NULL,
                order_index INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS lessons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
                slug TEXT NOT NULL UNIQUE,
                title_vi TEXT NOT NULL,
                title_en TEXT NOT NULL,
                summary_vi TEXT NOT NULL,
                summary_en TEXT NOT NULL,
                objectives_json TEXT NOT NULL,
                prerequisites_json TEXT NOT NULL,
                keywords_json TEXT NOT NULL,
                resources_json TEXT NOT NULL,
                checklist_json TEXT NOT NULL,
                concept_notes_vi TEXT NOT NULL DEFAULT '',
                concept_notes_en TEXT NOT NULL DEFAULT '',
                formulas_json TEXT NOT NULL DEFAULT '[]',
                code_examples_json TEXT NOT NULL DEFAULT '[]',
                common_mistakes_json TEXT NOT NULL DEFAULT '[]',
                next_lessons_json TEXT NOT NULL DEFAULT '[]',
                completion_criteria_json TEXT NOT NULL DEFAULT '[]',
                estimated_minutes INTEGER NOT NULL,
                order_index INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS exercises (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
                slug TEXT NOT NULL UNIQUE,
                title_vi TEXT NOT NULL,
                title_en TEXT NOT NULL,
                description_vi TEXT NOT NULL,
                description_en TEXT NOT NULL,
                difficulty TEXT NOT NULL,
                estimated_minutes INTEGER NOT NULL,
                test_command TEXT NOT NULL,
                starter_code TEXT NOT NULL,
                hints_json TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS review_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
                question_vi TEXT NOT NULL,
                question_en TEXT NOT NULL,
                answer_vi TEXT NOT NULL,
                answer_en TEXT NOT NULL,
                due_at TEXT NOT NULL,
                interval_days INTEGER NOT NULL DEFAULT 0,
                repetitions INTEGER NOT NULL DEFAULT 0,
                ease_factor REAL NOT NULL DEFAULT 2.5,
                last_reviewed_at TEXT
            );
            CREATE TABLE IF NOT EXISTS progress (
                lesson_id INTEGER PRIMARY KEY REFERENCES lessons(id) ON DELETE CASCADE,
                status TEXT NOT NULL DEFAULT 'not_started',
                minutes_spent INTEGER NOT NULL DEFAULT 0,
                completed_at TEXT,
                updated_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS study_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lesson_id INTEGER REFERENCES lessons(id) ON DELETE SET NULL,
                minutes INTEGER NOT NULL,
                note TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lesson_id INTEGER REFERENCES lessons(id) ON DELETE SET NULL,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS workspaces (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                exercise_id INTEGER NOT NULL UNIQUE REFERENCES exercises(id) ON DELETE CASCADE,
                path TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS workspace_runs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
                command TEXT NOT NULL,
                status TEXT NOT NULL,
                exit_code INTEGER,
                output TEXT NOT NULL,
                duration_ms INTEGER NOT NULL,
                created_at TEXT NOT NULL
            );
            """
        )
        ensure_schema(db)
    seed_content()
    hydrate_lesson_catalog()
    hydrate_exercises()



def seed_content() -> None:
    curriculum_path = CONTENT_ROOT / "curriculum.json"
    if not curriculum_path.exists():
        return
    curriculum = json.loads(curriculum_path.read_text(encoding="utf-8"))
    catalog = read_lesson_catalog()
    guides = read_module_guides()
    with connect() as db:
        for phase in curriculum["phases"]:
            phase_values = (
                phase["title_vi"],
                phase["title_en"],
                phase["summary_vi"],
                phase["summary_en"],
                phase["duration_weeks"],
                phase["order"],
            )
            existing_phase = db.execute("SELECT id FROM phases WHERE slug=?", (phase["slug"],)).fetchone()
            if existing_phase:
                phase_id = existing_phase["id"]
                db.execute(
                    "UPDATE phases SET title_vi=?,title_en=?,summary_vi=?,summary_en=?,duration_weeks=?,order_index=? WHERE id=?",
                    (*phase_values, phase_id),
                )
            else:
                phase_id = db.execute(
                    "INSERT INTO phases(slug,title_vi,title_en,summary_vi,summary_en,duration_weeks,order_index) VALUES(?,?,?,?,?,?,?)",
                    (phase["slug"], *phase_values),
                ).lastrowid
            for module_index, module in enumerate(phase["modules"]):
                module_values = (phase_id, module["title_vi"], module["title_en"], module_index)
                existing_module = db.execute("SELECT id FROM modules WHERE slug=?", (module["slug"],)).fetchone()
                if existing_module:
                    module_id = existing_module["id"]
                    db.execute(
                        "UPDATE modules SET phase_id=?,title_vi=?,title_en=?,order_index=? WHERE id=?",
                        (*module_values, module_id),
                    )
                else:
                    module_id = db.execute(
                        "INSERT INTO modules(phase_id,slug,title_vi,title_en,order_index) VALUES(?,?,?,?,?)",
                        (phase_id, module["slug"], module["title_vi"], module["title_en"], module_index),
                    ).lastrowid
                for lesson_index, lesson_title in enumerate(module["lessons"]):
                    slug = f"{phase['slug']}-{module['slug']}-{lesson_index + 1}"
                    lesson_data = catalog.get(slug, {})
                    lesson_title_en = lesson_data.get("title_en", lesson_title)
                    keywords = [word for word in re.split(r"[^A-Za-zÀ-ỹ0-9]+", lesson_title.lower()) if len(word) > 2][:8]
                    resources = lesson_data.get("resources", phase.get("resources", []))
                    objectives_vi = lesson_data.get(
                        "learning_objectives",
                        [
                            f"Giải thích {lesson_title.lower()} bằng ví dụ cụ thể.",
                            f"Viết được một bài thực hành nhỏ về {lesson_title.lower()}.",
                            "Biết khi nào khái niệm này hữu ích và nhận diện lỗi thường gặp.",
                        ],
                    )
                    objectives_en = lesson_data.get(
                        "learning_objectives_en",
                        [
                            f"Explain {lesson_title_en.lower()} with a concrete example.",
                            f"Implement a small exercise about {lesson_title_en.lower()}.",
                            "Recognize when to use it and diagnose common mistakes.",
                        ],
                    )
                    lesson_values = (
                        module_id,
                        lesson_title,
                        lesson_title_en,
                        lesson_data.get("summary_vi", f"Học {lesson_title.lower()} qua lý thuyết ngắn, code và câu hỏi tự kiểm tra."),
                        lesson_data.get("summary_en", f"Learn {lesson_title_en.lower()} through concise theory, code and self-check questions."),
                        json_text({"vi": objectives_vi, "en": objectives_en}),
                        json_text(lesson_data.get("prerequisites", [])),
                        json_text(lesson_data.get("key_terms", keywords)),
                        json_text(resources),
                        json_text(lesson_data.get("completion_checklist", ["Đọc phần giải thích", "Chạy ví dụ", "Tự làm exercise", "Trả lời review card"])),
                        lesson_data.get("concept_notes_vi", ""),
                        lesson_data.get("concept_notes_en", ""),
                        json_text(lesson_data.get("formulas", [])),
                        json_text(lesson_data.get("code_examples", [])),
                        json_text(lesson_data.get("common_mistakes", [])),
                        json_text(lesson_data.get("next_lessons", [])),
                        json_text(lesson_data.get("completion_criteria", lesson_data.get("completion_checklist", []))),
                        lesson_data.get("estimated_minutes", 45 if phase["order"] < 3 else 60),
                        lesson_index,
                    )
                    existing_lesson = db.execute("SELECT id FROM lessons WHERE slug=?", (slug,)).fetchone()
                    if existing_lesson:
                        lesson_id = existing_lesson["id"]
                        db.execute(
                            """UPDATE lessons SET module_id=?,title_vi=?,title_en=?,summary_vi=?,summary_en=?,objectives_json=?,prerequisites_json=?,keywords_json=?,resources_json=?,checklist_json=?,concept_notes_vi=?,concept_notes_en=?,formulas_json=?,code_examples_json=?,common_mistakes_json=?,next_lessons_json=?,completion_criteria_json=?,estimated_minutes=?,order_index=? WHERE id=?""",
                            (*lesson_values, lesson_id),
                        )
                    else:
                        lesson_id = db.execute(
                            """INSERT INTO lessons(module_id,slug,title_vi,title_en,summary_vi,summary_en,objectives_json,prerequisites_json,keywords_json,resources_json,checklist_json,concept_notes_vi,concept_notes_en,formulas_json,code_examples_json,common_mistakes_json,next_lessons_json,completion_criteria_json,estimated_minutes,order_index)
                            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                            (module_id, slug, *lesson_values[1:]),
                        ).lastrowid
                    question_vi = lesson_data.get(
                        "review_question_vi",
                        f"Bạn hãy giải thích {lesson_title.lower()} bằng lời của mình và đưa ra một ví dụ khi làm AI Engineer.",
                    )
                    answer_vi = lesson_data.get(
                        "review_answer_vi",
                        f"Cần nêu định nghĩa, trực giác, một ví dụ code hoặc dữ liệu, và một lỗi thường gặp khi dùng {lesson_title.lower()}.",
                    )
                    question_en = lesson_data.get(
                        "review_question_en",
                        f"Explain {lesson_title_en.lower()} in your own words and give one AI engineering example.",
                    )
                    answer_en = lesson_data.get(
                        "review_answer_en",
                        f"Include the definition, intuition, a code or data example, and one common failure mode for {lesson_title_en.lower()}.",
                    )
                    review = db.execute("SELECT id FROM review_items WHERE lesson_id=?", (lesson_id,)).fetchone()
                    if review:
                        db.execute(
                            "UPDATE review_items SET question_vi=?,question_en=?,answer_vi=?,answer_en=? WHERE id=?",
                            (question_vi, question_en, answer_vi, answer_en, review["id"]),
                        )
                    else:
                        due = now_iso() if lesson_id <= 12 else (datetime.now(timezone.utc) + timedelta(days=lesson_id % 7 + 1)).isoformat()
                        db.execute(
                            "INSERT INTO review_items(lesson_id,question_vi,question_en,answer_vi,answer_en,due_at) VALUES(?,?,?,?,?,?)",
                            (lesson_id, question_vi, question_en, answer_vi, answer_en, due),
                        )
                material = exercise_material(module, guides)
                exercise_slug = f"exercise-{phase['order']}-{module['slug']}"
                exercise_values = (
                    module_id,
                    f"Bài thực hành: {module['title_vi']}",
                    f"Practice: {module['title_en']}",
                    material["description_vi"],
                    material["description_en"],
                    "starter" if phase["order"] < 3 else "intermediate",
                    90,
                    material["test_command"],
                    material["starter_code"],
                    json_text(["Bắt đầu bằng input/output rõ ràng.", "Viết một test cho case bình thường và một edge case.", "Ghi lại điều bạn chưa hiểu trong journal."]),
                )
                existing_exercise = db.execute("SELECT id FROM exercises WHERE slug=?", (exercise_slug,)).fetchone()
                if existing_exercise:
                    db.execute(
                        """UPDATE exercises SET module_id=?,title_vi=?,title_en=?,description_vi=?,description_en=?,difficulty=?,estimated_minutes=?,test_command=?,starter_code=?,hints_json=? WHERE id=?""",
                        (*exercise_values, existing_exercise["id"]),
                    )
                else:
                    db.execute(
                        """INSERT INTO exercises(module_id,slug,title_vi,title_en,description_vi,description_en,difficulty,estimated_minutes,test_command,starter_code,hints_json)
                        VALUES(?,?,?,?,?,?,?,?,?,?,?)""",
                        (module_id, exercise_slug, *exercise_values[1:]),
                    )


def hydrate_lesson_catalog() -> None:
    """Backfill structured fields for databases created before the catalog existed."""

    catalog = read_lesson_catalog()
    if not catalog:
        return
    with connect() as db:
        rows = db.execute("SELECT slug FROM lessons").fetchall()
        for row in rows:
            lesson = catalog.get(row["slug"])
            if not lesson:
                continue
            objectives = {
                "vi": lesson.get("learning_objectives", []),
                "en": lesson.get("learning_objectives_en", []),
            }
            db.execute(
                """UPDATE lessons SET
                    title_en=?, summary_vi=?, summary_en=?, objectives_json=?,
                    prerequisites_json=?, keywords_json=?, resources_json=?,
                    checklist_json=?, concept_notes_vi=?, concept_notes_en=?,
                    formulas_json=?, code_examples_json=?, common_mistakes_json=?,
                    next_lessons_json=?, completion_criteria_json=?, estimated_minutes=?
                    WHERE slug=?""",
                (
                    lesson.get("title_en", lesson["title_vi"]),
                    lesson.get("summary_vi", ""),
                    lesson.get("summary_en", ""),
                    json_text(objectives),
                    json_text(lesson.get("prerequisites", [])),
                    json_text(lesson.get("key_terms", [])),
                    json_text(lesson.get("resources", [])),
                    json_text(lesson.get("completion_checklist", [])),
                    lesson.get("concept_notes_vi", ""),
                    lesson.get("concept_notes_en", ""),
                    json_text(lesson.get("formulas", [])),
                    json_text(lesson.get("code_examples", [])),
                    json_text(lesson.get("common_mistakes", [])),
                    json_text(lesson.get("next_lessons", [])),
                    json_text(lesson.get("completion_criteria", lesson.get("completion_checklist", []))),
                    lesson.get("estimated_minutes", 60),
                    lesson["lesson_id"],
                ),
            )


def hydrate_exercises() -> None:
    """Upgrade legacy compile-only exercises without touching learner files."""

    guides = read_module_guides()
    with connect() as db:
        rows = db.execute(
            """SELECT e.id,e.starter_code,m.slug,m.title_vi,m.title_en
            FROM exercises e JOIN modules m ON m.id=e.module_id"""
        ).fetchall()
        for row in rows:
            material = exercise_material(dict(row), guides)
            db.execute(
                """UPDATE exercises SET description_vi=?,description_en=?,test_command=?,starter_code=? WHERE id=?""",
                (material["description_vi"], material["description_en"], material["test_command"], material["starter_code"], row["id"]),
            )


class ProgressUpdate(BaseModel):
    status: str = Field(pattern="^(not_started|in_progress|blocked|completed|needs_review)$")
    minutes_spent: int = Field(default=0, ge=0, le=1440)


class ReviewAnswer(BaseModel):
    rating: str = Field(pattern="^(again|hard|good|easy)$")
    thought_seconds: int = Field(default=0, ge=0, le=7200)
    answer_text: str = Field(default="", max_length=12000)


class SessionCreate(BaseModel):
    lesson_slug: str | None = None
    minutes: int = Field(ge=1, le=1440)
    note: str = Field(default="", max_length=2000)


class NoteCreate(BaseModel):
    lesson_slug: str | None = None
    title: str = Field(min_length=1, max_length=200)
    body: str = Field(min_length=1, max_length=10000)


class SettingsUpdate(BaseModel):
    language: str | None = Field(default=None, pattern="^(vi|en)$")
    track: str | None = Field(default=None, pattern="^(standard|accelerated)$")
    weekly_goal_minutes: int | None = Field(default=None, ge=60, le=10080)
    show_completed_lessons: bool | None = None
    target_role: str | None = Field(default=None, pattern="^(internship|junior|career_switch)$")
    experience_level: str | None = Field(default=None, pattern="^(beginner|intermediate|advanced)$")
    onboarding_complete: bool | None = None


class GitPublishRequest(BaseModel):
    paths: list[str] = Field(min_length=1, max_length=20)
    message: str = Field(min_length=5, max_length=120)
    confirm: bool = False


class ContextRequest(BaseModel):
    lesson_slug: str | None = None
    exercise_slug: str | None = None
    question: str = Field(default="Hãy giúp tôi hiểu phần này bằng gợi ý từng bước.", max_length=4000)


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(title="Journey AI Engineer API", version="0.1.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


def phase_payload(db: sqlite3.Connection, phase: sqlite3.Row) -> dict[str, Any]:
    modules = []
    for module in db.execute("SELECT * FROM modules WHERE phase_id=? ORDER BY order_index", (phase["id"],)).fetchall():
        lessons = db.execute(
            """SELECT l.*, COALESCE(p.status,'not_started') AS status, COALESCE(p.minutes_spent,0) AS minutes_spent
            FROM lessons l LEFT JOIN progress p ON p.lesson_id=l.id WHERE l.module_id=? ORDER BY l.order_index""",
            (module["id"],),
        ).fetchall()
        modules.append({
            "id": module["id"], "slug": module["slug"], "title_vi": module["title_vi"], "title_en": module["title_en"],
            "lessons": [dict(lesson) for lesson in lessons],
        })
    return {**dict(phase), "modules": modules}


@app.get("/api/health")
def health() -> dict[str, Any]:
    return {"status": "ok", "service": "journey-ai-engineer-api", "database": str(DB_PATH)}


@app.get("/api/roadmap")
def roadmap() -> dict[str, Any]:
    with connect() as db:
        phases = [phase_payload(db, phase) for phase in db.execute("SELECT * FROM phases ORDER BY order_index").fetchall()]
    return {"program": json.loads((CONTENT_ROOT / "curriculum.json").read_text(encoding="utf-8"))["program"], "phases": phases}


@app.get("/api/dashboard")
def dashboard() -> dict[str, Any]:
    with connect() as db:
        totals = db.execute("SELECT COUNT(*) AS total, SUM(CASE WHEN p.status='completed' THEN 1 ELSE 0 END) AS completed, SUM(CASE WHEN p.status='in_progress' THEN 1 ELSE 0 END) AS in_progress FROM lessons l LEFT JOIN progress p ON p.lesson_id=l.id").fetchone()
        due = db.execute("SELECT COUNT(*) AS n FROM review_items WHERE due_at <= ?", (now_iso(),)).fetchone()["n"]
        current = db.execute("""SELECT l.slug,l.title_vi,l.title_en,m.title_vi AS module_title,p.title_vi AS phase_title
            FROM lessons l JOIN modules m ON m.id=l.module_id JOIN phases p ON p.id=m.phase_id
            LEFT JOIN progress pr ON pr.lesson_id=l.id
            WHERE COALESCE(pr.status,'not_started') != 'completed' ORDER BY p.order_index,m.order_index,l.order_index LIMIT 1""").fetchone()
        minutes = db.execute("SELECT COALESCE(SUM(minutes),0) AS n FROM study_sessions").fetchone()["n"]
        week_start = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
        weekly_minutes = db.execute("SELECT COALESCE(SUM(minutes),0) AS n FROM study_sessions WHERE created_at >= ?", (week_start,)).fetchone()["n"]
        lessons_this_week = db.execute("SELECT COUNT(*) AS n FROM progress WHERE status='completed' AND completed_at >= ?", (week_start,)).fetchone()["n"]
        settings = settings_payload(db)
        streak_days = study_streak(db)
        phase_rows = db.execute("""SELECT p.slug,p.title_vi,p.title_en,p.duration_weeks,COUNT(l.id) AS lessons,
            SUM(CASE WHEN pr.status='completed' THEN 1 ELSE 0 END) AS completed
            FROM phases p JOIN modules m ON m.phase_id=p.id JOIN lessons l ON l.module_id=m.id
            LEFT JOIN progress pr ON pr.lesson_id=l.id GROUP BY p.id ORDER BY p.order_index""").fetchall()
    total = totals["total"] or 0
    completed = totals["completed"] or 0
    return {
        "total_lessons": total,
        "completed_lessons": completed,
        "in_progress_lessons": totals["in_progress"] or 0,
        "progress_percent": round(completed / total * 100, 1) if total else 0,
        "due_reviews": due,
        "study_minutes": minutes,
        "weekly_minutes": weekly_minutes,
        "weekly_goal_minutes": int(settings["weekly_goal_minutes"]),
        "lessons_this_week": lessons_this_week,
        "streak_days": streak_days,
        "current_lesson": dict(current) if current else None,
        "phases": [dict(row) for row in phase_rows],
    }


@app.get("/api/lessons/{slug}")
def lesson_detail(slug: str) -> dict[str, Any]:
    with connect() as db:
        row = db.execute("""SELECT l.*,m.slug AS module_slug,m.title_vi AS module_title_vi,m.title_en AS module_title_en,p.slug AS phase_slug,p.title_vi AS phase_title_vi,p.title_en AS phase_title_en,COALESCE(pr.status,'not_started') AS status,COALESCE(pr.minutes_spent,0) AS minutes_spent
            FROM lessons l JOIN modules m ON m.id=l.module_id JOIN phases p ON p.id=m.phase_id LEFT JOIN progress pr ON pr.lesson_id=l.id WHERE l.slug=?""", (slug,)).fetchone()
        if not row:
            raise HTTPException(404, "Lesson not found")
        reviews = db.execute("SELECT * FROM review_items WHERE lesson_id=?", (row["id"],)).fetchall()
        exercises = db.execute("SELECT * FROM exercises WHERE module_id=?", (row["module_id"],)).fetchall()
    result = dict(row)
    guide_fallbacks: dict[str, Any] = {
        "why_it_matters_vi": "",
        "why_it_matters_en": "",
        "study_steps_vi": [],
        "study_steps_en": [],
        "practice_plan": {"vi": {}, "en": {}},
        "interview_questions": {"vi": [], "en": []},
    }
    for key in (
        "objectives_json",
        "prerequisites_json",
        "keywords_json",
        "resources_json",
        "checklist_json",
        "formulas_json",
        "code_examples_json",
        "common_mistakes_json",
        "next_lessons_json",
        "completion_criteria_json",
    ):
        result[key.removesuffix("_json")] = loads(result.pop(key))
    result["reviews"] = [dict(item) for item in reviews]
    result["exercises"] = [dict(item) for item in exercises]
    catalog_item = read_lesson_catalog().get(slug, {})
    if catalog_item.get("resources"):
        result["resources"] = catalog_item["resources"]
    for key in (
        "why_it_matters_vi",
        "why_it_matters_en",
        "study_steps_vi",
        "study_steps_en",
        "practice_plan",
        "interview_questions",
    ):
        result[key] = catalog_item.get(key, guide_fallbacks[key])
    result["lesson_id"] = result["slug"]
    result["phase_id"] = result["phase_slug"]
    result["module_id"] = result["module_slug"]
    result["learning_objectives"] = result["objectives"]
    result["completion_checklist"] = result["checklist"]
    result["exercise_ids"] = [item["slug"] for item in exercises]
    result["review_item_ids"] = [item["id"] for item in reviews]
    result["guide"] = {
        "why_it_matters_vi": result["why_it_matters_vi"],
        "why_it_matters_en": result["why_it_matters_en"],
        "study_steps_vi": result["study_steps_vi"],
        "study_steps_en": result["study_steps_en"],
        "practice_plan": result["practice_plan"],
        "interview_questions": result["interview_questions"],
    }
    return result


@app.patch("/api/lessons/{slug}/progress")
def update_progress(slug: str, payload: ProgressUpdate) -> dict[str, Any]:
    timestamp = now_iso()
    with connect() as db:
        lesson = db.execute("SELECT id FROM lessons WHERE slug=?", (slug,)).fetchone()
        if not lesson:
            raise HTTPException(404, "Lesson not found")
        completed_at = timestamp if payload.status == "completed" else None
        db.execute("""INSERT INTO progress(lesson_id,status,minutes_spent,completed_at,updated_at) VALUES(?,?,?,?,?)
            ON CONFLICT(lesson_id) DO UPDATE SET status=excluded.status,minutes_spent=progress.minutes_spent+excluded.minutes_spent,completed_at=excluded.completed_at,updated_at=excluded.updated_at""", (lesson["id"], payload.status, payload.minutes_spent, completed_at, timestamp))
        if payload.minutes_spent:
            db.execute("INSERT INTO study_sessions(lesson_id,minutes,note,created_at) VALUES(?,?,?,?)", (lesson["id"], payload.minutes_spent, "Lesson progress", timestamp))
    return {"slug": slug, "status": payload.status, "minutes_added": payload.minutes_spent}


@app.post("/api/study-sessions")
def create_session(payload: SessionCreate) -> dict[str, Any]:
    with connect() as db:
        lesson_id = None
        if payload.lesson_slug:
            lesson = db.execute("SELECT id FROM lessons WHERE slug=?", (payload.lesson_slug,)).fetchone()
            if not lesson:
                raise HTTPException(404, "Lesson not found")
            lesson_id = lesson["id"]
        db.execute("INSERT INTO study_sessions(lesson_id,minutes,note,created_at) VALUES(?,?,?,?)", (lesson_id, payload.minutes, payload.note, now_iso()))
    return {"status": "recorded"}


@app.get("/api/reviews/due")
def due_reviews() -> dict[str, Any]:
    with connect() as db:
        rows = db.execute("""SELECT r.*,l.slug AS lesson_slug,l.title_vi AS lesson_title_vi,l.title_en AS lesson_title_en,p.title_vi AS phase_title_vi
            FROM review_items r JOIN lessons l ON l.id=r.lesson_id JOIN modules m ON m.id=l.module_id JOIN phases p ON p.id=m.phase_id
            WHERE r.due_at <= ? ORDER BY r.due_at LIMIT 30""", (now_iso(),)).fetchall()
    return {"items": [dict(row) for row in rows], "count": len(rows)}


@app.post("/api/reviews/{review_id}/answer")
def answer_review(review_id: int, payload: ReviewAnswer) -> dict[str, Any]:
    intervals = {"again": 1, "hard": 2, "good": 4, "easy": 7}
    with connect() as db:
        review = db.execute("SELECT * FROM review_items WHERE id=?", (review_id,)).fetchone()
        if not review:
            raise HTTPException(404, "Review item not found")
        repetitions = 0 if payload.rating == "again" else review["repetitions"] + 1
        interval = intervals[payload.rating] if repetitions <= 1 else min(180, max(1, round(review["interval_days"] * (1.3 if payload.rating == "good" else 1.7 if payload.rating == "easy" else 1.05))))
        due = (datetime.now(timezone.utc) + timedelta(days=interval)).isoformat()
        db.execute("UPDATE review_items SET due_at=?,interval_days=?,repetitions=?,last_reviewed_at=? WHERE id=?", (due, interval, repetitions, now_iso(), review_id))
        history_id = db.execute(
            "INSERT INTO review_history(review_id,rating,thought_seconds,answer_text,created_at) VALUES(?,?,?,?,?)",
            (review_id, payload.rating, payload.thought_seconds, payload.answer_text, now_iso()),
        ).lastrowid
    return {"review_id": review_id, "history_id": history_id, "next_due_at": due, "interval_days": interval}


@app.get("/api/reviews/history")
def review_history(limit: int = 50) -> dict[str, Any]:
    bounded_limit = max(1, min(limit, 200))
    with connect() as db:
        rows = db.execute(
            """SELECT h.*,r.question_vi,r.question_en,l.slug AS lesson_slug,l.title_vi AS lesson_title_vi
            FROM review_history h JOIN review_items r ON r.id=h.review_id JOIN lessons l ON l.id=r.lesson_id
            ORDER BY h.created_at DESC LIMIT ?""",
            (bounded_limit,),
        ).fetchall()
    return {"items": [dict(row) for row in rows], "count": len(rows)}


@app.get("/api/reviews/weak-topics")
def weak_topics() -> dict[str, Any]:
    with connect() as db:
        rows = db.execute(
            """SELECT l.slug AS lesson_slug,l.title_vi,COUNT(h.id) AS attempts,
            SUM(CASE WHEN h.rating IN ('again','hard') THEN 1 ELSE 0 END) AS hard_attempts,
            MAX(h.created_at) AS last_reviewed_at
            FROM review_items r JOIN lessons l ON l.id=r.lesson_id
            LEFT JOIN review_history h ON h.review_id=r.id
            GROUP BY l.id HAVING attempts > 0 ORDER BY hard_attempts DESC,attempts DESC LIMIT 12"""
        ).fetchall()
    return {"items": [dict(row) for row in rows]}


@app.get("/api/exercises")
def exercises() -> dict[str, Any]:
    with connect() as db:
        rows = db.execute("""SELECT e.*,m.title_vi AS module_title_vi,p.title_vi AS phase_title_vi,w.id AS workspace_id,w.path AS workspace_path
            FROM exercises e JOIN modules m ON m.id=e.module_id JOIN phases p ON p.id=m.phase_id LEFT JOIN workspaces w ON w.exercise_id=e.id ORDER BY p.order_index,m.order_index,e.id""").fetchall()
    result = []
    for row in rows:
        value = dict(row)
        value["hints"] = loads(value.pop("hints_json"))
        result.append(value)
    return {"exercises": result}


def require_slug(slug: str) -> None:
    if not SAFE_SLUG.fullmatch(slug):
        raise HTTPException(400, "Invalid slug")


def ensure_workspace_files(path: Path, exercise: sqlite3.Row) -> bool:
    """Create missing workspace files without overwriting a learner's code."""

    path.mkdir(parents=True, exist_ok=True)
    repaired = False
    starter = path / "starter.py"
    if not starter.exists():
        starter.write_text(exercise["starter_code"], encoding="utf-8")
        repaired = True
    else:
        try:
            existing_starter = starter.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            existing_starter = ""
        if "return \"your solution\"" in existing_starter and "TODO" in existing_starter:
            starter.write_text(exercise["starter_code"], encoding="utf-8")
            repaired = True
    test_file = path / "test_exercise.py"
    if not test_file.exists():
        test_file.write_text(EXERCISE_TEST_CODE, encoding="utf-8")
        repaired = True
    exercise_contract = f"""\n\n## Exercise contract\n\n1. Implement `solve()` in `starter.py`; return a dictionary with non-empty `result` and `explanation` fields.\n2. Run `{exercise['test_command']}`. The first run is expected to fail while the TODO remains.\n3. Change one assumption, add an edge-case check, then run the test again.\n4. Save the final code and a short note explaining the trade-off before exporting the artifact.\n\n## Checkpoint\n\n{exercise['description_vi']}\n"""
    readme = path / "README.md"
    if not readme.exists():
        readme.write_text(
            f"# {exercise['title_vi']}\n\n{exercise['description_vi']}\n\n## Test\n\n```powershell\n{exercise['test_command']}\n```\n{exercise_contract}",
            encoding="utf-8",
        )
        repaired = True
    else:
        try:
            readme_text = readme.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            readme_text = ""
        if "## Exercise contract" not in readme_text:
            readme.write_text(readme_text.rstrip() + exercise_contract + "\n", encoding="utf-8")
            repaired = True
    return repaired


@app.post("/api/exercises/{slug}/workspace")
def create_workspace(slug: str) -> dict[str, Any]:
    require_slug(slug)
    workspace_root = WORKSPACE_ROOT.resolve()
    path = (workspace_root / slug).resolve()
    if workspace_root not in path.parents:
        raise HTTPException(400, "Invalid workspace path")
    with connect() as db:
        exercise = db.execute("SELECT * FROM exercises WHERE slug=?", (slug,)).fetchone()
        if not exercise:
            raise HTTPException(404, "Exercise not found")
        existing = db.execute("SELECT * FROM workspaces WHERE exercise_id=?", (exercise["id"],)).fetchone()
        if existing:
            existing_path = Path(existing["path"]).resolve()
            if workspace_root not in existing_path.parents:
                raise HTTPException(400, "Invalid workspace path")
            if existing_path.exists() and not existing_path.is_dir():
                raise HTTPException(409, "Workspace path is not a directory")
            repaired = ensure_workspace_files(existing_path, exercise)
            return {"workspace": dict(existing), "created": False, "repaired": repaired}
        ensure_workspace_files(path, exercise)
        workspace_id = db.execute("INSERT INTO workspaces(exercise_id,path,created_at) VALUES(?,?,?)", (exercise["id"], str(path), now_iso())).lastrowid
        row = db.execute("SELECT * FROM workspaces WHERE id=?", (workspace_id,)).fetchone()
    return {"workspace": dict(row), "created": True, "repaired": False}


@app.post("/api/workspaces/{workspace_id}/open")
def open_workspace(workspace_id: int) -> dict[str, Any]:
    with connect() as db:
        workspace = db.execute("SELECT * FROM workspaces WHERE id=?", (workspace_id,)).fetchone()
    if not workspace:
        raise HTTPException(404, "Workspace not found")
    code_cli = shutil.which("code.cmd") or shutil.which("code")
    if not code_cli:
        return {"opened": False, "path": workspace["path"], "message": "VS Code CLI not found; open this path manually."}
    try:
        subprocess.Popen([code_cli, "--reuse-window", workspace["path"]], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, **SUBPROCESS_OPTIONS)
    except OSError as error:
        return {"opened": False, "path": workspace["path"], "message": str(error)}
    return {"opened": True, "path": workspace["path"]}


def workspace_row(workspace_id: int) -> sqlite3.Row:
    with connect() as db:
        row = db.execute(
            """SELECT w.*,e.slug AS exercise_slug,e.title_vi,e.description_vi,e.starter_code,e.test_command
            FROM workspaces w JOIN exercises e ON e.id=w.exercise_id WHERE w.id=?""",
            (workspace_id,),
        ).fetchone()
    if not row:
        raise HTTPException(404, "Workspace not found")
    workspace_root = WORKSPACE_ROOT.resolve()
    workspace_path = Path(row["path"]).resolve()
    if workspace_root not in workspace_path.parents or workspace_path == workspace_root:
        raise HTTPException(400, "Invalid workspace path")
    if workspace_path.exists() and not workspace_path.is_dir():
        raise HTTPException(409, "Workspace path is not a directory")
    return row


@app.post("/api/workspaces/{workspace_id}/open-folder")
def open_workspace_folder(workspace_id: int) -> dict[str, Any]:
    row = workspace_row(workspace_id)
    workspace_path = Path(row["path"]).resolve()
    try:
        workspace_path.mkdir(parents=True, exist_ok=True)
        if os.name == "nt":
            subprocess.Popen(["explorer.exe", str(workspace_path)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, **SUBPROCESS_OPTIONS)
        else:
            opener = shutil.which("xdg-open") or shutil.which("open")
            if not opener:
                return {"opened": False, "path": str(workspace_path), "message": "No folder opener was found; open this path manually."}
            subprocess.Popen([opener, str(workspace_path)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, **SUBPROCESS_OPTIONS)
    except OSError as error:
        return {"opened": False, "path": str(workspace_path), "message": str(error)}
    return {"opened": True, "path": str(workspace_path)}


def safe_file_contains_secret(path: Path) -> bool:
    try:
        text = path.read_bytes().decode("utf-8", errors="ignore")
    except OSError:
        return False
    return contains_secret(text)


@app.post("/api/workspaces/{workspace_id}/export")
def export_workspace(workspace_id: int) -> dict[str, Any]:
    row = workspace_row(workspace_id)
    workspace_path = Path(row["path"]).resolve()
    try:
        ensure_workspace_files(workspace_path, row)
    except OSError as error:
        raise HTTPException(500, f"Could not prepare workspace: {error}") from error

    files, skipped = scan_workspace_files(workspace_path)
    secret_files = [path.relative_to(workspace_path).as_posix() for path in files if safe_file_contains_secret(path)]
    if secret_files:
        raise HTTPException(422, {"message": "Artifact contains a possible secret; remove it before exporting.", "secret_files": secret_files})

    exercise_slug = row["exercise_slug"]
    require_slug(exercise_slug)
    target_root = (PROJECT_ROOT / "exercises" / exercise_slug).resolve()
    exercises_root = (PROJECT_ROOT / "exercises").resolve()
    if exercises_root not in target_root.parents:
        raise HTTPException(400, "Invalid artifact path")
    try:
        target_root.mkdir(parents=True, exist_ok=True)
        copied: list[str] = []
        for source in files:
            relative = source.relative_to(workspace_path)
            target = (target_root / relative).resolve()
            if target_root not in target.parents and target != target_root:
                raise HTTPException(400, "Invalid workspace file path")
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, target)
            copied.append(relative.as_posix())
    except OSError as error:
        raise HTTPException(500, f"Could not export workspace: {error}") from error
    return {
        "workspace_id": workspace_id,
        "artifact_path": target_root.relative_to(PROJECT_ROOT).as_posix(),
        "files": copied,
        "skipped": skipped,
        "secret_files": [],
    }


@app.post("/api/workspaces/{workspace_id}/run")
def run_workspace(workspace_id: int) -> dict[str, Any]:
    with connect() as db:
        row = db.execute("""SELECT w.*,e.test_command,e.starter_code,e.title_vi,e.description_vi FROM workspaces w JOIN exercises e ON e.id=w.exercise_id WHERE w.id=?""", (workspace_id,)).fetchone()
    if not row:
        raise HTTPException(404, "Workspace not found")
    workspace_root = WORKSPACE_ROOT.resolve()
    workspace_path = Path(row["path"]).resolve()
    if workspace_root not in workspace_path.parents:
        raise HTTPException(400, "Invalid workspace path")
    try:
        ensure_workspace_files(workspace_path, row)
    except OSError as error:
        raise HTTPException(500, f"Could not prepare workspace: {error}") from error
    command = row["test_command"]
    args = shlex.split(command, posix=False)
    allowed = {"python", "py", "pytest", "uv"}
    executable_path = args[0].strip('"\'') if args else ""
    executable = Path(executable_path).name.lower().replace(".exe", "") if executable_path else ""
    if executable not in allowed:
        raise HTTPException(400, "Exercise command is not allowed")
    started = datetime.now(timezone.utc)
    status = "passed"
    exit_code: int | None = None
    try:
        result = subprocess.run([executable_path, *args[1:]], cwd=str(workspace_path), capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=20, shell=False, **SUBPROCESS_OPTIONS)
        exit_code = result.returncode
        output = redact_secrets((result.stdout + result.stderr)[-12000:])
        if exit_code != 0:
            status = "failed"
    except subprocess.TimeoutExpired as error:
        status = "timeout"
        output = redact_secrets(((error.stdout or "") + (error.stderr or ""))[-12000:] + "\nProcess timed out after 20 seconds.")
    except OSError as error:
        status = "error"
        output = redact_secrets(str(error))
    duration_ms = round((datetime.now(timezone.utc) - started).total_seconds() * 1000)
    with connect() as db:
        run_id = db.execute("INSERT INTO workspace_runs(workspace_id,command,status,exit_code,output,duration_ms,created_at) VALUES(?,?,?,?,?,?,?)", (workspace_id, command, status, exit_code, output, duration_ms, now_iso())).lastrowid
    return {"run_id": run_id, "command": command, "status": status, "exit_code": exit_code, "output": output, "duration_ms": duration_ms}


@app.get("/api/workspaces/{workspace_id}/runs")
def workspace_runs(workspace_id: int, limit: int = 20) -> dict[str, Any]:
    bounded_limit = max(1, min(limit, 100))
    with connect() as db:
        if not db.execute("SELECT 1 FROM workspaces WHERE id=?", (workspace_id,)).fetchone():
            raise HTTPException(404, "Workspace not found")
        rows = db.execute(
            "SELECT * FROM workspace_runs WHERE workspace_id=? ORDER BY created_at DESC LIMIT ?",
            (workspace_id, bounded_limit),
        ).fetchall()
    return {"runs": [dict(row) for row in rows], "count": len(rows)}


@app.get("/api/tools")
def tools() -> dict[str, Any]:
    path = CONTENT_ROOT / "tools.json"
    return {"tools": json.loads(path.read_text(encoding="utf-8")) if path.exists() else []}


@app.get("/api/settings")
def get_settings() -> dict[str, Any]:
    with connect() as db:
        values = settings_payload(db)
    return {
        "language": values["language"],
        "track": values["track"],
        "weekly_goal_minutes": int(values["weekly_goal_minutes"]),
        "show_completed_lessons": values["show_completed_lessons"].lower() == "true",
        "target_role": values["target_role"],
        "experience_level": values["experience_level"],
        "onboarding_complete": values["onboarding_complete"].lower() == "true",
    }


@app.patch("/api/settings")
def update_settings(payload: SettingsUpdate) -> dict[str, Any]:
    changes = payload.model_dump(exclude_none=True)
    if "show_completed_lessons" in changes:
        changes["show_completed_lessons"] = "true" if changes["show_completed_lessons"] else "false"
    if "onboarding_complete" in changes:
        changes["onboarding_complete"] = "true" if changes["onboarding_complete"] else "false"
    with connect() as db:
        for key, value in changes.items():
            db.execute(
                "INSERT INTO settings(key,value,updated_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at",
                (key, str(value), now_iso()),
            )
        values = settings_payload(db)
    return {
        "language": values["language"],
        "track": values["track"],
        "weekly_goal_minutes": int(values["weekly_goal_minutes"]),
        "show_completed_lessons": values["show_completed_lessons"].lower() == "true",
        "target_role": values["target_role"],
        "experience_level": values["experience_level"],
        "onboarding_complete": values["onboarding_complete"].lower() == "true",
    }


@app.get("/api/notes")
def list_notes() -> dict[str, Any]:
    with connect() as db:
        rows = db.execute("""SELECT n.*,l.slug AS lesson_slug,l.title_vi AS lesson_title_vi FROM notes n LEFT JOIN lessons l ON l.id=n.lesson_id ORDER BY n.updated_at DESC""").fetchall()
    return {"notes": [dict(row) for row in rows]}


@app.post("/api/notes")
def create_note(payload: NoteCreate) -> dict[str, Any]:
    lesson_id = None
    with connect() as db:
        if payload.lesson_slug:
            lesson = db.execute("SELECT id FROM lessons WHERE slug=?", (payload.lesson_slug,)).fetchone()
            if not lesson:
                raise HTTPException(404, "Lesson not found")
            lesson_id = lesson["id"]
        timestamp = now_iso()
        note_id = db.execute("INSERT INTO notes(lesson_id,title,body,created_at,updated_at) VALUES(?,?,?,?,?)", (lesson_id, payload.title, payload.body, timestamp, timestamp)).lastrowid
        row = db.execute("SELECT * FROM notes WHERE id=?", (note_id,)).fetchone()
    return {"note": dict(row)}


@app.get("/api/git/status")
def git_status() -> dict[str, Any]:
    def run(args: list[str]) -> tuple[str, int]:
        try:
            result = subprocess.run(["git", "-C", str(PROJECT_ROOT), *args], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=10, shell=False, **SUBPROCESS_OPTIONS)
            return result.stdout.strip(), result.returncode
        except (OSError, subprocess.TimeoutExpired):
            return "", 1
    branch, _ = run(["branch", "--show-current"])
    status, _ = run(["status", "--short"])
    remote, _ = run(["remote", "-v"])
    last_commit, _ = run(["log", "-1", "--oneline"])
    return {"root": str(PROJECT_ROOT), "branch": branch, "status": status, "remote": redact_secrets(remote), "last_commit": last_commit}


@app.get("/api/git/diff")
def git_diff() -> dict[str, str]:
    try:
        result = subprocess.run(["git", "-C", str(PROJECT_ROOT), "diff", "HEAD", "--", "."], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=10, shell=False, **SUBPROCESS_OPTIONS)
        if result.returncode != 0:
            staged = subprocess.run(["git", "-C", str(PROJECT_ROOT), "diff", "--cached", "--", "."], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=10, shell=False, **SUBPROCESS_OPTIONS)
            unstaged = subprocess.run(["git", "-C", str(PROJECT_ROOT), "diff", "--", "."], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=10, shell=False, **SUBPROCESS_OPTIONS)
            result.stdout = "\n".join(part for part in (staged.stdout or "", unstaged.stdout or "") if part)
        if not result.stdout:
            result = subprocess.run(["git", "-C", str(PROJECT_ROOT), "diff", "--", "."], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=10, shell=False, **SUBPROCESS_OPTIONS)
        return {"diff": redact_secrets((result.stdout or "")[-30000:])}
    except (OSError, subprocess.TimeoutExpired):
        return {"diff": ""}


@app.get("/api/git/suggested-commit")
def suggested_commit() -> dict[str, Any]:
    status = git_status()["status"]
    paths = [line[3:].strip() for line in status.splitlines() if len(line) > 3]
    phases = sorted({match.group(1) for path in paths if (match := re.search(r"phase[-_](\d+)", path, re.IGNORECASE))})
    if any(path.startswith("journal/") for path in paths):
        message = f"journal(week): export learning reflection{f' for phase-{phases[0]}' if phases else ''}"
    elif any(path.startswith("content/") for path in paths):
        message = f"learn(phase-{phases[0]}): update curriculum content" if phases else "learn(curriculum): update lesson content"
    elif any(path.startswith("projects/") for path in paths):
        message = "project: update portfolio artifact"
    elif any(path.startswith(("apps/", "src/", "tests/")) for path in paths):
        message = "feat(app): improve learning workflow"
    else:
        message = "learn: update journey artifacts"
    return {"message": message, "files": paths, "requires_confirmation": True}


@app.post("/api/git/publish")
def publish_git(payload: GitPublishRequest) -> dict[str, Any]:
    """Commit and push explicitly selected learning artifacts.

    The endpoint deliberately accepts only learner-owned artifact roots and refuses to
    touch an already staged worktree. This keeps an exercise publish from accidentally
    committing application code or an unrelated change.
    """

    if not payload.confirm:
        raise HTTPException(400, "Review the diff and confirm before publishing to GitHub.")
    message = payload.message.strip()
    if len(message) < 5:
        raise HTTPException(400, "Commit message must contain at least five non-space characters")
    if "\n" in message or "\r" in message or "\x00" in message:
        raise HTTPException(400, "Commit message must be a single line")

    root_check = run_git(["rev-parse", "--show-toplevel"])
    if root_check.returncode != 0:
        raise HTTPException(409, "This folder is not a Git repository")

    normalized: list[str] = []
    candidates: list[Path] = []
    for raw_path in payload.paths:
        candidate, relative = project_relative_path(raw_path)
        if relative in normalized:
            raise HTTPException(400, "Duplicate artifact path")
        if not candidate.exists():
            raise HTTPException(404, f"Artifact path does not exist: {relative}")
        normalized.append(relative)
        candidates.append(candidate)

    staged_before = run_git(["diff", "--cached", "--name-only"])
    if staged_before.returncode != 0:
        raise HTTPException(500, redact_secrets(staged_before.stderr or "Could not inspect the Git index"))
    if staged_before.stdout.strip():
        raise HTTPException(409, "The Git index already contains staged changes; review and clear them first.")

    secret_files: list[str] = []
    for candidate in candidates:
        paths = [candidate] if candidate.is_file() else [path for path in candidate.rglob("*") if path.is_file()]
        for path in paths:
            relative_parts = path.relative_to(PROJECT_ROOT).parts
            if path.is_symlink() or any(part in WORKSPACE_IGNORES or part.startswith(".env") for part in relative_parts) or path.suffix.lower() in {".db", ".sqlite", ".sqlite3"}:
                raise HTTPException(400, f"Artifact contains a blocked file: {path.relative_to(PROJECT_ROOT).as_posix()}")
            if safe_file_contains_secret(path):
                secret_files.append(path.relative_to(PROJECT_ROOT).as_posix())
    if secret_files:
        raise HTTPException(422, {"message": "Artifact contains a possible secret; remove it before publishing.", "secret_files": sorted(secret_files)})

    add_result = run_git(["add", "--", *normalized])
    if add_result.returncode != 0:
        raise HTTPException(500, redact_secrets(add_result.stderr or "Git add failed"))

    def reset_selected_paths() -> None:
        run_git(["reset", "--", *normalized])

    staged_paths_result = run_git(["diff", "--cached", "--name-only"])
    staged_paths = [line.strip().replace("\\", "/") for line in staged_paths_result.stdout.splitlines() if line.strip()]
    unexpected = [
        path for path in staged_paths
        if not any(path == requested or path.startswith(requested.rstrip("/") + "/") for requested in normalized)
    ]
    if staged_paths_result.returncode != 0 or unexpected or not staged_paths:
        reset_selected_paths()
        raise HTTPException(409, "Git staged files do not match the selected artifact paths.")

    cached_diff = run_git(["diff", "--cached", "--binary"])
    if cached_diff.returncode != 0 or contains_secret(cached_diff.stdout or ""):
        reset_selected_paths()
        raise HTTPException(422, "The staged artifact looks like it contains a secret; nothing was committed.")

    commit_result = run_git(["commit", "-m", message])
    if commit_result.returncode != 0:
        reset_selected_paths()
        raise HTTPException(409, redact_secrets(commit_result.stderr or "Git commit failed"))

    branch_result = run_git(["branch", "--show-current"])
    branch = branch_result.stdout.strip()
    if not branch:
        raise HTTPException(409, "The repository is in detached HEAD; choose a branch before pushing.")
    remote_result = run_git(["remote", "get-url", "origin"])
    remote = redact_secrets(remote_result.stdout.strip())
    if remote_result.returncode != 0 or not remote:
        raise HTTPException(409, "GitHub remote 'origin' is not configured; the commit was kept locally.")
    commit_hash_result = run_git(["rev-parse", "--short", "HEAD"])
    commit_hash = commit_hash_result.stdout.strip() or "unknown"
    push_result = run_git(["push", "origin", branch], timeout=60)
    if push_result.returncode != 0:
        detail = redact_secrets((push_result.stderr or push_result.stdout or "Git push failed").strip())
        raise HTTPException(502, f"Commit {commit_hash} was created locally, but push failed: {detail}")
    return {
        "committed": True,
        "pushed": True,
        "commit": commit_hash,
        "branch": branch,
        "remote": remote,
        "files": staged_paths,
        "message": message,
    }


@app.post("/api/journal/export")
def export_journal() -> dict[str, Any]:
    stamp = datetime.now().astimezone()
    iso_calendar = stamp.isocalendar()
    week = f"{iso_calendar.year:04d}-W{iso_calendar.week:02d}"
    path = JOURNAL_ROOT / "weekly" / f"{week}.md"
    path.parent.mkdir(parents=True, exist_ok=True)
    with connect() as db:
        completed = db.execute("""SELECT l.title_vi FROM lessons l JOIN progress p ON p.lesson_id=l.id WHERE p.status='completed' ORDER BY p.completed_at DESC LIMIT 20""").fetchall()
        minutes = db.execute("SELECT COALESCE(SUM(minutes),0) AS n FROM study_sessions WHERE created_at >= ?", ((stamp - timedelta(days=7)).astimezone(timezone.utc).isoformat(),)).fetchone()["n"]
    content = f"# Week {week}\n\n## Đã học\n\n- Tổng thời gian ghi nhận: **{minutes} phút**\n\n## Bài đã hoàn thành\n\n" + "\n".join(f"- {row['title_vi']}" for row in completed) + "\n\n## Điều chưa hiểu\n\n- Ghi thêm tại đây.\n\n## Kế hoạch tuần tới\n\n- Chọn lesson tiếp theo trong app.\n"
    preserved = False
    if path.exists():
        existing = path.read_text(encoding="utf-8")
        first_reflection_heading = "## \u0110i\u1ec1u ch\u01b0a hi\u1ec3u"
        if first_reflection_heading in existing:
            generated_head = content[:content.index(first_reflection_heading)].rstrip()
            preserved_tail = existing[existing.index(first_reflection_heading):].strip()
            content = f"{generated_head}\n\n{preserved_tail}\n"
            preserved = True
    path.write_text(content, encoding="utf-8")
    return {"path": str(path), "week": week, "preserved_reflections": preserved}


@app.post("/api/context/export")
def export_context(payload: ContextRequest) -> dict[str, Any]:
    if payload.lesson_slug:
        require_slug(payload.lesson_slug)
    if payload.exercise_slug:
        require_slug(payload.exercise_slug)
    lesson = None
    exercise = None
    progress = None
    note = None
    if payload.lesson_slug:
        with connect() as db:
            lesson = db.execute("SELECT * FROM lessons WHERE slug=?", (payload.lesson_slug,)).fetchone()
            if not lesson:
                raise HTTPException(404, "Lesson not found")
            progress = db.execute("SELECT * FROM progress WHERE lesson_id=?", (lesson["id"],)).fetchone()
            note = db.execute("SELECT title,body,updated_at FROM notes WHERE lesson_id=? ORDER BY updated_at DESC LIMIT 1", (lesson["id"],)).fetchone()
    if payload.exercise_slug:
        with connect() as db:
            exercise = db.execute("SELECT * FROM exercises WHERE slug=?", (payload.exercise_slug,)).fetchone()
            if not exercise:
                raise HTTPException(404, "Exercise not found")
    context_dir = JOURNAL_ROOT / "context"
    context_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S-%f")
    path = context_dir / f"{timestamp}-context.md"
    suffix = 1
    while path.exists():
        path = context_dir / f"{timestamp}-{suffix}-context.md"
        suffix += 1
    lesson_title = lesson["title_vi"] if lesson else "Chưa chọn lesson"
    exercise_title = exercise["title_vi"] if exercise else "Chưa chọn exercise"
    progress_status = progress["status"] if progress else "not_started"
    progress_minutes = progress["minutes_spent"] if progress else 0
    note_block = f"{note['title']}\n\n{note['body']}" if note else "Chưa có note cho lesson này."
    exercise_path = "Chưa tạo workspace."
    if exercise:
        with connect() as db:
            workspace = db.execute("SELECT path FROM workspaces WHERE exercise_id=?", (exercise["id"],)).fetchone()
            if workspace:
                exercise_path = workspace["path"]
    body = redact_secrets(f"""# Journey AI Engineer Context\n\n## Lesson\n{lesson_title}\n\n## Lesson progress\n- Status: {progress_status}\n- Minutes recorded: {progress_minutes}\n\n## Exercise\n{exercise_title}\n- Workspace: {exercise_path}\n\n## Latest note\n{note_block}\n\n## Câu hỏi\n{payload.question}\n\n## Cách trả lời mong muốn\n- Giải thích bằng tiếng Việt, giữ thuật ngữ English trong ngoặc.\n- Cho tôi gợi ý từng bước trước khi đưa lời giải hoàn chỉnh.\n- Chỉ ra giả định, edge case và cách tự kiểm tra.\n- Không yêu cầu hoặc hiển thị API key, token hay dữ liệu bí mật.\n\n## Lời nhắc\nTôi đang học để trở thành AI Engineer. Hãy ưu tiên giúp tôi hiểu và tự làm được.\n""")
    path.write_text(body, encoding="utf-8")
    return {"path": str(path), "content": body}


if FRONTEND_ROOT.exists():
    assets_root = FRONTEND_ROOT / "assets"
    if assets_root.is_dir():
        app.mount("/assets", StaticFiles(directory=assets_root), name="frontend-assets")


@app.get("/{full_path:path}", include_in_schema=False)
def serve_frontend(full_path: str) -> FileResponse:
    """Serve the production SPA when the API is running from the packaged executable."""

    if full_path == "api" or full_path.startswith("api/"):
        raise HTTPException(404, "API endpoint not found")
    frontend_root = FRONTEND_ROOT.resolve()
    requested = (frontend_root / full_path).resolve()
    if frontend_root not in requested.parents and requested != frontend_root:
        raise HTTPException(404, "Frontend file not found")
    if requested.is_file():
        return FileResponse(requested)
    index = frontend_root / "index.html"
    if index.is_file():
        return FileResponse(index)
    raise HTTPException(404, "Frontend build not found; run npm run build first")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("apps.api.main:app", host="127.0.0.1", port=8000, reload=True)
