from __future__ import annotations

import hmac
import json
import os
import re
import shlex
import shutil
import sqlite3
import subprocess
import sys
import threading
import time
from urllib.parse import urlsplit, urlunsplit
from contextlib import asynccontextmanager
from datetime import date, datetime, timedelta, timezone, tzinfo
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from apps.api.security_audit import audit_app


IS_FROZEN = bool(getattr(sys, "frozen", False))
BUNDLE_ROOT = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parents[2])).resolve()
APP_ROOT = Path(sys.executable).resolve().parent if IS_FROZEN else BUNDLE_ROOT
_PROJECT_ROOT_ENV = os.environ.get("JOURNEY_PROJECT_ROOT", "").strip()
PROJECT_ROOT_CONFIGURED = bool(_PROJECT_ROOT_ENV)
PROJECT_ROOT = Path(_PROJECT_ROOT_ENV or (APP_ROOT if (APP_ROOT / ".git").exists() else BUNDLE_ROOT)).resolve()
_LEGACY_DATA_ROOT = APP_ROOT / ".data"
_LOCAL_APP_DATA = Path(os.environ.get("LOCALAPPDATA") or (Path.home() / "AppData" / "Local")) / "JourneyAIEngineer"
if os.environ.get("JOURNEY_DATA_DIR", "").strip():
    DATA_ROOT = Path(os.environ["JOURNEY_DATA_DIR"]).resolve()
elif IS_FROZEN and _LEGACY_DATA_ROOT.exists():
    # Preserve the first portable build's adjacent data so an upgrade never
    # silently starts from an empty progress database.
    DATA_ROOT = _LEGACY_DATA_ROOT.resolve()
elif IS_FROZEN:
    DATA_ROOT = _LOCAL_APP_DATA.resolve()
else:
    DATA_ROOT = (BUNDLE_ROOT / ".data").resolve()
DB_PATH = DATA_ROOT / "journey.db"
CONTENT_ROOT = Path(os.environ.get("JOURNEY_CONTENT_DIR", BUNDLE_ROOT / "content")).resolve()
WORKSPACE_ROOT = DATA_ROOT / "workspaces"
JOURNAL_ROOT = Path(os.environ.get("JOURNEY_JOURNAL_DIR", DATA_ROOT / "journal" if IS_FROZEN else BUNDLE_ROOT / "journal")).resolve()
FRONTEND_ROOT = Path(os.environ.get("JOURNEY_FRONTEND_DIR", BUNDLE_ROOT / "dist")).resolve()
LESSON_CATALOG_PATH = CONTENT_ROOT / "lessons.json"
MODULE_GUIDES_PATH = CONTENT_ROOT / "module_guides.json"
RESOURCE_LIBRARY_PATH = CONTENT_ROOT / "resources.json"
SAFE_SLUG = re.compile(r"^[a-z0-9][a-z0-9-]*$")
SUBPROCESS_OPTIONS: dict[str, Any] = {}
if os.name == "nt":
    SUBPROCESS_OPTIONS["creationflags"] = getattr(subprocess, "CREATE_NO_WINDOW", 0)


# The packaged launcher uses these timestamps to determine whether a browser tab
# is still connected. This state intentionally lives in memory: it is a runtime
# signal, not learning data, and must never be persisted in the user's database.
RUNTIME_HEARTBEAT_TIMEOUT_SECONDS = 12.0
_RUNTIME_CLIENTS: dict[str, float] = {}
_RUNTIME_LOCK = threading.Lock()
SCHEMA_VERSION = 4
LOCAL_ONLY_ENV = "JOURNEY_LOCAL_ONLY"


def local_only_enabled() -> bool:
    return os.environ.get(LOCAL_ONLY_ENV, "true").strip().casefold() not in {"0", "false", "no", "off"}


def require_local_request(request: Request | None = None) -> None:
    """Keep filesystem, subprocess, and Git capabilities on the local app boundary."""

    if not local_only_enabled() or request is None:
        return
    client_host = request.client.host if request.client else ""
    if client_host not in {"127.0.0.1", "::1", "localhost"}:
        raise HTTPException(403, "This capability is local-only")
    origin = request.headers.get("origin", "").strip()
    if origin:
        parsed = urlsplit(origin)
        if parsed.scheme not in {"http", "https"} or parsed.hostname not in {"127.0.0.1", "localhost", "::1"}:
            raise HTTPException(403, "This capability is local-only")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def connect() -> sqlite3.Connection:
    DATA_ROOT.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA busy_timeout = 5000")
    # WAL is persistent per database and substantially reduces reader/writer lock
    # contention for the local desktop app.  Ignore a read-only/filesystem failure
    # here; the connection remains usable and migrations still report errors.
    try:
        conn.execute("PRAGMA journal_mode = WAL")
    except sqlite3.DatabaseError:
        pass
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


def read_resource_library() -> list[dict[str, Any]]:
    """Read the curated reference library from editable version-controlled JSON."""

    if not RESOURCE_LIBRARY_PATH.exists():
        return []
    payload = json.loads(RESOURCE_LIBRARY_PATH.read_text(encoding="utf-8"))
    return payload.get("resources", [])


def _prune_runtime_clients(now: float | None = None) -> int:
    current = now if now is not None else time.monotonic()
    expired = [
        client_id
        for client_id, last_seen in _RUNTIME_CLIENTS.items()
        if current - last_seen > RUNTIME_HEARTBEAT_TIMEOUT_SECONDS
    ]
    for client_id in expired:
        _RUNTIME_CLIENTS.pop(client_id, None)
    return len(_RUNTIME_CLIENTS)


def runtime_has_active_clients() -> bool:
    """Return whether at least one browser tab recently checked in."""

    with _RUNTIME_LOCK:
        return _prune_runtime_clients() > 0


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


def local_timezone() -> tzinfo:
    """Return the machine timezone used for calendar-facing learning metrics."""

    return datetime.now().astimezone().tzinfo or timezone.utc


def local_day_for_iso(value: str | None, target_timezone: tzinfo | None = None) -> date | None:
    """Convert a stored timestamp into the user's local calendar day safely."""

    if not value:
        return None
    try:
        parsed = datetime.fromisoformat(value)
    except (TypeError, ValueError):
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(target_timezone or local_timezone()).date()


def study_streak(db: sqlite3.Connection) -> int:
    rows = db.execute("SELECT created_at FROM study_sessions").fetchall()
    target_timezone = local_timezone()
    days = {
        day
        for row in rows
        if (day := local_day_for_iso(row["created_at"], target_timezone)) is not None
    }
    cursor = datetime.now(target_timezone).date()
    streak = 0
    while cursor in days:
        streak += 1
        cursor -= timedelta(days=1)
    if streak == 0:
        cursor = datetime.now(target_timezone).date() - timedelta(days=1)
        while cursor in days:
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


def sanitize_remote(text: str) -> str:
    """Remove embedded Git credentials while retaining a useful remote hint."""

    value = text.strip()
    if not value:
        return ""
    sanitized_lines: list[str] = []
    for line in value.splitlines():
        parts = line.split()
        if len(parts) >= 2:
            remote_url = parts[1]
            try:
                parsed = urlsplit(remote_url)
                if parsed.scheme and parsed.netloc:
                    hostname = parsed.hostname or ""
                    port = f":{parsed.port}" if parsed.port else ""
                    clean_url = urlunsplit((parsed.scheme, hostname + port, parsed.path, parsed.query, parsed.fragment))
                    sanitized_lines.append(" ".join([parts[0], clean_url, *parts[2:]]))
                    continue
            except ValueError:
                pass
        sanitized_lines.append(redact_secrets(line))
    return "\n".join(sanitized_lines)


def data_root_writable() -> bool:
    try:
        DATA_ROOT.mkdir(parents=True, exist_ok=True)
        probe = DATA_ROOT / ".journey-write-check"
        probe.write_text("ok", encoding="utf-8")
        probe.unlink(missing_ok=True)
        return True
    except OSError:
        return False


def git_publish_available() -> bool:
    if not PROJECT_ROOT_CONFIGURED and not (PROJECT_ROOT / ".git").exists():
        return False
    try:
        result = run_git(["rev-parse", "--show-toplevel"])
        return result.returncode == 0
    except (OSError, subprocess.TimeoutExpired):
        return False


SECRET_SCAN_PATTERNS = (
    re.compile(r"(?i)\b(?:api[_-]?key|secret|token|password)\b\s*[:=]\s*[\"']?[^\s\"']{8,}"),
    re.compile(r"(?i)\bgh[pousr]_[A-Za-z0-9_\-]{20,}\b"),
    re.compile(r"\bsk-[A-Za-z0-9]{20,}\b"),
    re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
)
PUBLISH_ROOTS = {"exercises", "projects", "journal"}
WORKSPACE_IGNORES = {".git", ".venv", "__pycache__", ".pytest_cache", "node_modules"}

# Feedback is deliberately a small, moderated boundary.  The local app can
# collect suggestions without exposing private learner data or giving a public
# caller any moderation capability.
FEEDBACK_ADMIN_TOKEN_ENV = "JOURNEY_FEEDBACK_ADMIN_TOKEN"
FEEDBACK_KINDS = frozenset({
    "unclear",
    "incorrect",
    "missing_example",
    "missing_resource",
    "broken_link",
    "typo",
    "exercise_problem",
    "feature_request",
})
FEEDBACK_STATUSES = frozenset({"pending", "triaged", "accepted", "rejected", "drafted", "implemented"})
PUBLIC_FEEDBACK_STATUSES = frozenset({"accepted", "implemented"})
FEEDBACK_TRANSITIONS: dict[str, frozenset[str]] = {
    "pending": frozenset({"pending", "triaged", "rejected"}),
    "triaged": frozenset({"triaged", "accepted", "rejected", "drafted"}),
    "accepted": frozenset({"accepted", "drafted", "implemented", "rejected"}),
    "drafted": frozenset({"drafted", "implemented", "rejected"}),
    "implemented": frozenset({"implemented"}),
    "rejected": frozenset({"rejected", "triaged"}),
}


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

    db.execute("CREATE TABLE IF NOT EXISTS schema_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)")

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
    # v4 removes the old one-card-per-lesson uniqueness constraint.  Existing
    # local databases created during the v3 development window are rebuilt
    # additively while their scheduling state is copied across.
    card_indexes = db.execute("PRAGMA index_list('review_cards')").fetchall()
    has_lesson_unique = False
    for index in card_indexes:
        if int(index[2]) == 1:
            columns_for_index = db.execute(f"PRAGMA index_info('{index[1]}')").fetchall()
            if [row[2] for row in columns_for_index] == ["lesson_id"]:
                has_lesson_unique = True
                break
    if has_lesson_unique:
        old_cards = db.execute("SELECT id,lesson_id,question_vi,question_en,answer_vi,answer_en,type,hint_vi,hint_en FROM review_cards").fetchall()
        old_state = db.execute("SELECT card_id,due_at,interval_days,repetitions,ease_factor,lapses,leech,suspended,last_reviewed_at FROM review_state").fetchall() if db.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='review_state'").fetchone() else []
        db.execute("PRAGMA foreign_keys = OFF")
        db.execute("DROP TABLE IF EXISTS review_state")
        db.execute("DROP TABLE review_cards")
        db.execute("""CREATE TABLE review_cards (id INTEGER PRIMARY KEY, lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE, question_vi TEXT NOT NULL, question_en TEXT NOT NULL, answer_vi TEXT NOT NULL, answer_en TEXT NOT NULL, type TEXT NOT NULL DEFAULT 'recall', hint_vi TEXT NOT NULL DEFAULT '', hint_en TEXT NOT NULL DEFAULT '')""")
        db.executemany("INSERT INTO review_cards(id,lesson_id,question_vi,question_en,answer_vi,answer_en,type,hint_vi,hint_en) VALUES(?,?,?,?,?,?,?,?,?)", [tuple(row) for row in old_cards])
        db.execute("PRAGMA foreign_keys = ON")
    # v3 splits immutable prompt/answer content from mutable scheduling state.
    # review_items remains as a compatibility mirror for older clients and data.
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS review_cards (
            id INTEGER PRIMARY KEY,
            lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
            question_vi TEXT NOT NULL,
            question_en TEXT NOT NULL,
            answer_vi TEXT NOT NULL,
            answer_en TEXT NOT NULL,
            type TEXT NOT NULL DEFAULT 'recall',
            hint_vi TEXT NOT NULL DEFAULT '',
            hint_en TEXT NOT NULL DEFAULT ''
        )
        """
    )
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS review_state (
            card_id INTEGER PRIMARY KEY REFERENCES review_cards(id) ON DELETE CASCADE,
            due_at TEXT NOT NULL,
            interval_days INTEGER NOT NULL DEFAULT 0,
            repetitions INTEGER NOT NULL DEFAULT 0,
            ease_factor REAL NOT NULL DEFAULT 2.5,
            lapses INTEGER NOT NULL DEFAULT 0,
            leech INTEGER NOT NULL DEFAULT 0,
            suspended INTEGER NOT NULL DEFAULT 0,
            last_reviewed_at TEXT
        )
        """
    )
    if "old_state" in locals() and old_state:
        db.executemany("INSERT OR IGNORE INTO review_state(card_id,due_at,interval_days,repetitions,ease_factor,lapses,leech,suspended,last_reviewed_at) VALUES(?,?,?,?,?,?,?,?,?)", [tuple(row) for row in old_state])
    db.execute("CREATE INDEX IF NOT EXISTS idx_review_state_due ON review_state(suspended, due_at)")
    for column, definition in {
        "type": "TEXT NOT NULL DEFAULT 'recall'",
        "hint_vi": "TEXT NOT NULL DEFAULT ''",
        "hint_en": "TEXT NOT NULL DEFAULT ''",
    }.items():
        try:
            db.execute(f"ALTER TABLE review_cards ADD COLUMN {column} {definition}")
        except sqlite3.OperationalError as error:
            if "duplicate column" not in str(error).lower():
                raise
    # Existing review_items IDs are retained so review_history and old clients
    # continue to resolve the same cards after migration.
    db.execute(
        """
        INSERT OR IGNORE INTO review_cards(id,lesson_id,question_vi,question_en,answer_vi,answer_en)
        SELECT id,lesson_id,question_vi,question_en,answer_vi,answer_en FROM review_items
        """
    )
    db.execute(
        """
        INSERT OR IGNORE INTO review_state(card_id,due_at,interval_days,repetitions,ease_factor,last_reviewed_at)
        SELECT id,due_at,interval_days,repetitions,ease_factor,last_reviewed_at FROM review_items
        """
    )
    db.execute(
        "INSERT INTO schema_meta(key,value) VALUES('version',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        (str(SCHEMA_VERSION),),
    )
    db.execute(f"PRAGMA user_version = {SCHEMA_VERSION}")
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        """
    )
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
            author_id TEXT,
            display_name TEXT NOT NULL DEFAULT '',
            kind TEXT NOT NULL,
            body TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            moderation_note TEXT NOT NULL DEFAULT '',
            resolved_commit TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            CHECK(kind IN ('unclear','incorrect','missing_example','missing_resource','broken_link','typo','exercise_problem','feature_request')),
            CHECK(status IN ('pending','triaged','accepted','rejected','drafted','implemented'))
        )
        """
    )
    db.execute("CREATE INDEX IF NOT EXISTS idx_feedback_lesson_status ON feedback(lesson_id, status)")
    db.execute("CREATE INDEX IF NOT EXISTS idx_feedback_status_updated ON feedback(status, updated_at DESC)")
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
    sync_review_cards()
    hydrate_lesson_catalog()
    hydrate_exercises()


def sync_review_cards() -> None:
    """Synchronize legacy review_items into canonical cards and scheduling state."""

    with connect() as db:
        rows = db.execute("SELECT id,lesson_id,question_vi,question_en,answer_vi,answer_en,due_at,interval_days,repetitions,ease_factor,last_reviewed_at FROM review_items").fetchall()
        for row in rows:
            db.execute("""INSERT OR IGNORE INTO review_cards(id,lesson_id,question_vi,question_en,answer_vi,answer_en) VALUES(?,?,?,?,?,?)""",
                       tuple(row[key] for key in ("id", "lesson_id", "question_vi", "question_en", "answer_vi", "answer_en")))
            db.execute("""UPDATE review_cards SET lesson_id=?,question_vi=?,question_en=?,answer_vi=?,answer_en=? WHERE id=?""",
                       (row["lesson_id"], row["question_vi"], row["question_en"], row["answer_vi"], row["answer_en"], row["id"]))
            db.execute("""INSERT OR IGNORE INTO review_state(card_id,due_at,interval_days,repetitions,ease_factor,last_reviewed_at) VALUES(?,?,?,?,?,?)""",
                       (row["id"], row["due_at"], row["interval_days"], row["repetitions"], row["ease_factor"], row["last_reviewed_at"]))



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
                    legacy_card = {
                        "id": f"{slug}-recall",
                        "type": "recall",
                        "question_vi": lesson_data.get("review_question_vi", f"Bạn hãy giải thích {lesson_title.lower()} bằng lời của mình và đưa ra một ví dụ khi làm AI Engineer."),
                        "question_en": lesson_data.get("review_question_en", f"Explain {lesson_title_en.lower()} in your own words and give one AI engineering example."),
                        "answer_vi": lesson_data.get("review_answer_vi", f"Cần nêu định nghĩa, trực giác, một ví dụ code hoặc dữ liệu, và một lỗi thường gặp khi dùng {lesson_title.lower()}."),
                        "answer_en": lesson_data.get("review_answer_en", f"Include the definition, intuition, a code or data example, and one common failure mode for {lesson_title_en.lower()}."),
                        "hint_vi": "Bắt đầu bằng một ví dụ nhỏ.", "hint_en": "Start with a small example.",
                    }
                    review_cards = lesson_data.get("review_cards") or [
                        legacy_card,
                        {**legacy_card, "id": f"{slug}-application", "type": "application", "question_vi": f"Viết một ví dụ code áp dụng {lesson_title.lower()}.", "question_en": f"Write a small code example applying {lesson_title_en.lower()}.", "hint_vi": "Bắt đầu bằng input và output tối thiểu.", "hint_en": "Start with the smallest input and output."},
                        {**legacy_card, "id": f"{slug}-debug", "type": "debug", "question_vi": f"Bạn sẽ debug lỗi của {lesson_title.lower()} theo thứ tự nào?", "question_en": f"What would you debug first when {lesson_title_en.lower()} fails?", "hint_vi": "Kiểm tra input và baseline trước.", "hint_en": "Check the input and baseline first."},
                        {**legacy_card, "id": f"{slug}-interview", "type": "interview", "question_vi": f"Nêu một trade-off của {lesson_title.lower()}.", "question_en": f"Name one trade-off of {lesson_title_en.lower()}.", "hint_vi": "Nói về chất lượng, chi phí hoặc độ trễ.", "hint_en": "Discuss quality, cost or latency."},
                    ]
                    existing_reviews = db.execute("SELECT * FROM review_items WHERE lesson_id=? ORDER BY id", (lesson_id,)).fetchall()
                    for card_index, card in enumerate(review_cards):
                        values = (card.get("question_vi", legacy_card["question_vi"]), card.get("question_en", legacy_card["question_en"]), card.get("answer_vi", legacy_card["answer_vi"]), card.get("answer_en", legacy_card["answer_en"]))
                        if card_index < len(existing_reviews):
                            review_id = existing_reviews[card_index]["id"]
                            db.execute("UPDATE review_items SET question_vi=?,question_en=?,answer_vi=?,answer_en=? WHERE id=?", (*values, review_id))
                        else:
                            due = now_iso() if lesson_id <= 12 else (datetime.now(timezone.utc) + timedelta(days=lesson_id % 7 + card_index + 1)).isoformat()
                            review_id = db.execute("INSERT INTO review_items(lesson_id,question_vi,question_en,answer_vi,answer_en,due_at) VALUES(?,?,?,?,?,?)", (lesson_id, *values, due)).lastrowid
                        db.execute(
                            "INSERT INTO review_cards(id,lesson_id,question_vi,question_en,answer_vi,answer_en,type,hint_vi,hint_en) VALUES(?,?,?,?,?,?,?,?,?) "
                            "ON CONFLICT(id) DO UPDATE SET lesson_id=excluded.lesson_id,question_vi=excluded.question_vi,question_en=excluded.question_en,answer_vi=excluded.answer_vi,answer_en=excluded.answer_en,type=excluded.type,hint_vi=excluded.hint_vi,hint_en=excluded.hint_en",
                            (review_id, lesson_id, *values, card.get("type", "recall"), card.get("hint_vi", ""), card.get("hint_en", "")),
                        )
                        review_row = db.execute("SELECT due_at,interval_days,repetitions,ease_factor,last_reviewed_at FROM review_items WHERE id=?", (review_id,)).fetchone()
                        db.execute("INSERT OR IGNORE INTO review_state(card_id,due_at,interval_days,repetitions,ease_factor,last_reviewed_at) VALUES(?,?,?,?,?,?)", (review_id, review_row["due_at"], review_row["interval_days"], review_row["repetitions"], review_row["ease_factor"], review_row["last_reviewed_at"]))
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


class BackupImportRequest(BaseModel):
    payload: dict[str, Any]
    confirm: bool = False


class RuntimeClientRequest(BaseModel):
    client_id: str = Field(min_length=8, max_length=120)


class FeedbackSubmission(BaseModel):
    lesson_slug: str = Field(min_length=1, max_length=200)
    kind: str = Field(min_length=1, max_length=40)
    body: str = Field(min_length=1, max_length=2000)
    display_name: str | None = Field(default=None, max_length=80)


class FeedbackModerationUpdate(BaseModel):
    status: str = Field(min_length=1, max_length=20)
    moderation_note: str = Field(default="", max_length=4000)
    resolved_commit: str = Field(default="", max_length=120)


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
    return {**dict(phase), "track": "genai-specialization" if phase["order_index"] >= 8 else "core", "modules": modules}


@app.get("/api/health")
def health() -> dict[str, Any]:
    writable = data_root_writable()
    return {
        "status": "ok" if writable else "degraded",
        "service": "journey-ai-engineer-api",
        "mode": "packaged" if IS_FROZEN else "local",
        "data_root_writable": writable,
        "project_root_configured": PROJECT_ROOT_CONFIGURED,
        "git_publish_available": git_publish_available(),
        "local_only": local_only_enabled(),
    }


@app.get("/api/health/live")
def health_live() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/health/ready")
def health_ready() -> dict[str, Any]:
    ready = data_root_writable()
    content_ready = LESSON_CATALOG_PATH.exists() and (CONTENT_ROOT / "curriculum.json").exists()
    try:
        with connect() as db:
            db.execute("SELECT 1").fetchone()
    except sqlite3.DatabaseError:
        ready = False
    ready = ready and content_ready
    return {"status": "ready" if ready else "not_ready", "ready": ready, "content_ready": content_ready}


@app.get("/api/security/audit")
def security_audit(request: Request = None) -> dict[str, Any]:  # type: ignore[assignment]
    """Run a passive local source/endpoint review without network or payloads."""

    if request is not None:
        client_host = request.client.host if request.client else ""
        if client_host not in {"127.0.0.1", "::1", "localhost"}:
            raise HTTPException(403, "Passive security audit is local-only")
    return audit_app(app, PROJECT_ROOT)


@app.post("/api/runtime/heartbeat")
def runtime_heartbeat(payload: RuntimeClientRequest) -> dict[str, Any]:
    """Register a live browser tab without touching durable learning data."""

    with _RUNTIME_LOCK:
        _RUNTIME_CLIENTS[payload.client_id] = time.monotonic()
        active_clients = _prune_runtime_clients()
    return {"ok": True, "active_clients": active_clients}


@app.post("/api/runtime/disconnect")
def runtime_disconnect(payload: RuntimeClientRequest) -> dict[str, Any]:
    """Remove a tab immediately when pagehide/sendBeacon is available."""

    with _RUNTIME_LOCK:
        _RUNTIME_CLIENTS.pop(payload.client_id, None)
        active_clients = _prune_runtime_clients()
    return {"ok": True, "active_clients": active_clients}


@app.get("/api/roadmap")
def roadmap() -> dict[str, Any]:
    with connect() as db:
        phases = [phase_payload(db, phase) for phase in db.execute("SELECT * FROM phases ORDER BY order_index").fetchall()]
    return {"program": json.loads((CONTENT_ROOT / "curriculum.json").read_text(encoding="utf-8"))["program"], "phases": phases}


@app.get("/api/resources")
def resources(query: str | None = None, phase: str | None = None, resource_type: str | None = None) -> dict[str, Any]:
    """Return the searchable, phase-aware reference library."""

    items = read_resource_library()
    normalized_query = (query or "").strip().casefold()
    normalized_phase = (phase or "").strip().casefold()
    normalized_type = (resource_type or "").strip().casefold()
    if normalized_query:
        items = [
            item
            for item in items
            if normalized_query in " ".join(
                str(item.get(field, ""))
                for field in ("title_vi", "title_en", "provider", "description_vi", "description_en", "type")
            ).casefold()
        ]
    if normalized_phase and normalized_phase != "all":
        items = [item for item in items if normalized_phase in {str(value).casefold() for value in item.get("phase_ids", [])}]
    if normalized_type and normalized_type != "all":
        items = [item for item in items if str(item.get("type", "")).casefold() == normalized_type]
    return {"resources": items, "count": len(items), "total": len(read_resource_library())}


@app.get("/api/search")
def search(q: str = "", type: str = "all", phase: str = "all", status: str = "all", limit: int = 50) -> dict[str, Any]:
    """Search local lessons, curated resources, and exercises with stable output."""

    query = q.strip()
    if len(query) > 120:
        raise HTTPException(400, "q must contain at most 120 characters")
    clean_type = type.strip().casefold() or "all"
    allowed_types = {"all", "phases", "modules", "lessons", "resources", "exercises"}
    if clean_type not in allowed_types:
        raise HTTPException(400, "type must be phases, modules, lessons, resources, exercises, or all")
    clean_phase = phase.strip().casefold() or "all"
    if len(clean_phase) > 80:
        raise HTTPException(400, "phase must contain at most 80 characters")
    clean_status = status.strip().casefold() or "all"
    allowed_statuses = {"all", "not_started", "in_progress", "blocked", "completed", "needs_review", "available"}
    if clean_status not in allowed_statuses:
        raise HTTPException(400, "Unsupported status")
    if limit < 1 or limit > 100:
        raise HTTPException(400, "limit must be between 1 and 100")
    needle = query.casefold()
    results: list[dict[str, Any]] = []

    def matches(text: str) -> bool:
        return not needle or needle in text.casefold()

    with connect() as db:
        if clean_type in {"all", "phases"}:
            rows = db.execute("SELECT slug,title_vi,title_en,summary_vi,summary_en,order_index FROM phases ORDER BY order_index").fetchall()
            for row in rows:
                item = dict(row)
                if not matches(" ".join(str(item.get(key, "")) for key in ("slug", "title_vi", "title_en", "summary_vi", "summary_en"))):
                    continue
                if clean_phase != "all" and clean_phase != item["slug"].casefold():
                    continue
                if clean_status not in {"all", "available"}:
                    continue
                results.append({"type": "phase", "id": item["slug"], "slug": item["slug"], "title": item["title_vi"], "title_en": item["title_en"], "subtitle": "Phase", "phase": item["slug"], "status": "available"})
        if clean_type in {"all", "modules"}:
            rows = db.execute("SELECT m.slug,m.title_vi,m.title_en,p.slug AS phase_slug FROM modules m JOIN phases p ON p.id=m.phase_id ORDER BY p.order_index,m.order_index").fetchall()
            for row in rows:
                item = dict(row)
                if not matches(" ".join(str(item.get(key, "")) for key in ("slug", "title_vi", "title_en", "phase_slug"))):
                    continue
                if clean_phase != "all" and clean_phase != item["phase_slug"].casefold():
                    continue
                if clean_status not in {"all", "available"}:
                    continue
                results.append({"type": "module", "id": item["slug"], "slug": item["slug"], "title": item["title_vi"], "title_en": item["title_en"], "subtitle": item["phase_slug"], "phase": item["phase_slug"], "status": "available"})
        if clean_type in {"all", "lessons"}:
            rows = db.execute("""SELECT l.slug,l.title_vi,l.title_en,l.summary_vi,l.summary_en,
                p.slug AS phase_slug,COALESCE(pr.status,'not_started') AS status
                FROM lessons l JOIN modules m ON m.id=l.module_id JOIN phases p ON p.id=m.phase_id
                LEFT JOIN progress pr ON pr.lesson_id=l.id ORDER BY p.order_index,m.order_index,l.order_index,l.id""").fetchall()
            for row in rows:
                item = dict(row)
                haystack = " ".join(str(item.get(key, "")) for key in ("slug", "title_vi", "title_en", "summary_vi", "summary_en", "phase_slug"))
                if (clean_phase != "all" and clean_phase not in item["phase_slug"].casefold()) or (clean_status not in {"all", item["status"]}) or not matches(haystack):
                    continue
                results.append({"type": "lesson", "id": item["slug"], "slug": item["slug"], "title": item["title_vi"], "title_en": item["title_en"], "phase": item["phase_slug"], "status": item["status"]})
        if clean_type in {"all", "exercises"}:
            rows = db.execute("""SELECT e.slug,e.title_vi,e.title_en,e.description_vi,e.description_en,
                p.slug AS phase_slug FROM exercises e JOIN modules m ON m.id=e.module_id JOIN phases p ON p.id=m.phase_id
                ORDER BY p.order_index,m.order_index,e.id""").fetchall()
            for row in rows:
                item = dict(row)
                haystack = " ".join(str(item.get(key, "")) for key in ("slug", "title_vi", "title_en", "description_vi", "description_en", "phase_slug"))
                if (clean_phase != "all" and clean_phase not in item["phase_slug"].casefold()) or (clean_status not in {"all", "available"}) or not matches(haystack):
                    continue
                results.append({"type": "exercise", "id": item["slug"], "slug": item["slug"], "title": item["title_vi"], "title_en": item["title_en"], "phase": item["phase_slug"], "status": "available"})
    if clean_type in {"all", "resources"}:
        for resource in read_resource_library():
            phase_ids = [str(value) for value in resource.get("phase_ids", [])]
            haystack = " ".join(str(resource.get(field, "")) for field in ("slug", "title_vi", "title_en", "provider", "description_vi", "description_en", "type"))
            if (clean_phase != "all" and clean_phase not in {value.casefold() for value in phase_ids}) or (clean_status not in {"all", "available"}) or not matches(haystack):
                continue
            results.append({"type": "resource", "id": resource.get("slug", ""), "slug": resource.get("slug", ""), "title": resource.get("title_vi", resource.get("title_en", "")), "title_en": resource.get("title_en", ""), "phase": sorted(phase_ids), "status": "available", "url": resource.get("url", "")})
    order = {"phase": 0, "module": 1, "lesson": 2, "resource": 3, "exercise": 4}
    results.sort(key=lambda item: (order[item["type"]], str(item.get("id", ""))))
    return {"query": query, "type": clean_type, "phase": clean_phase, "status": clean_status, "results": results[:limit], "count": min(len(results), limit), "total": len(results)}


def _feedback_payload(row: sqlite3.Row, include_moderation: bool = False) -> dict[str, Any]:
    """Serialize feedback without ever returning the private author identity."""

    payload: dict[str, Any] = {
        "id": row["id"],
        "lesson_slug": row["lesson_slug"],
        "lesson_title_vi": row["lesson_title_vi"],
        "lesson_title_en": row["lesson_title_en"],
        "kind": row["kind"],
        "body": row["body"],
        "status": row["status"],
        "display_name": row["display_name"] or None,
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }
    if include_moderation:
        payload.update({
            "moderation_note": row["moderation_note"],
            "resolved_commit": row["resolved_commit"],
        })
    return payload


def _feedback_lesson(db: sqlite3.Connection, lesson_slug: str) -> sqlite3.Row:
    lesson = db.execute(
        "SELECT id,slug,title_vi,title_en FROM lessons WHERE slug=?",
        (lesson_slug,),
    ).fetchone()
    if not lesson:
        raise HTTPException(404, "Lesson not found")
    return lesson


def list_feedback(lesson_slug: str | None = None, limit: int = 50) -> dict[str, Any]:
    """Return approved feedback only; this is the public/community contract."""

    if limit < 1 or limit > 100:
        raise HTTPException(400, "limit must be between 1 and 100")
    clean_slug = (lesson_slug or "").strip()
    if clean_slug and not SAFE_SLUG.fullmatch(clean_slug):
        raise HTTPException(400, "Invalid lesson slug")
    params: list[Any] = [*PUBLIC_FEEDBACK_STATUSES]
    where = "f.status IN (?, ?)"
    if clean_slug:
        where += " AND l.slug=?"
        params.append(clean_slug)
    params.append(limit)
    with connect() as db:
        if clean_slug:
            _feedback_lesson(db, clean_slug)
        rows = db.execute(
            f"""SELECT f.id,f.display_name,f.kind,f.body,f.status,f.created_at,f.updated_at,
                l.slug AS lesson_slug,l.title_vi AS lesson_title_vi,l.title_en AS lesson_title_en,
                f.moderation_note,f.resolved_commit
                FROM feedback f JOIN lessons l ON l.id=f.lesson_id
                WHERE {where}
                ORDER BY f.created_at DESC, f.id DESC LIMIT ?""",
            params,
        ).fetchall()
    return {"items": [_feedback_payload(row) for row in rows], "count": len(rows)}


def submit_feedback(payload: FeedbackSubmission) -> dict[str, Any]:
    """Store a plain-text suggestion as pending moderation."""

    lesson_slug = payload.lesson_slug.strip()
    kind = payload.kind.strip().casefold()
    body = payload.body.strip()
    display_name = (payload.display_name or "").strip()
    if not SAFE_SLUG.fullmatch(lesson_slug):
        raise HTTPException(400, "Invalid lesson slug")
    if kind not in FEEDBACK_KINDS:
        raise HTTPException(400, "Unsupported feedback kind")
    if len(body) < 5:
        raise HTTPException(400, "Feedback must contain at least 5 characters")
    if len(body) > 2000:
        raise HTTPException(400, "Feedback must contain at most 2000 characters")
    if "\x00" in body or "\x00" in display_name:
        raise HTTPException(400, "Feedback contains an invalid character")
    if len(display_name) > 80:
        raise HTTPException(400, "Display name must contain at most 80 characters")
    timestamp = now_iso()
    with connect() as db:
        lesson = _feedback_lesson(db, lesson_slug)
        cursor = db.execute(
            """INSERT INTO feedback(lesson_id,display_name,kind,body,status,created_at,updated_at)
            VALUES(?,?,?,?,?,?,?)""",
            (lesson["id"], display_name, kind, body, "pending", timestamp, timestamp),
        )
        row = db.execute(
            """SELECT f.id,f.display_name,f.kind,f.body,f.status,f.created_at,f.updated_at,
                l.slug AS lesson_slug,l.title_vi AS lesson_title_vi,l.title_en AS lesson_title_en,
                f.moderation_note,f.resolved_commit
                FROM feedback f JOIN lessons l ON l.id=f.lesson_id WHERE f.id=?""",
            (cursor.lastrowid,),
        ).fetchone()
    return {
        "feedback": _feedback_payload(row),
        "message": "Đã ghi nhận góp ý. Góp ý sẽ xuất hiện sau khi được duyệt.",
    }


def _require_feedback_admin(request: Request) -> None:
    expected = os.environ.get(FEEDBACK_ADMIN_TOKEN_ENV, "").strip()
    if not expected:
        raise HTTPException(503, "Feedback moderation is not configured")
    supplied = request.headers.get("X-Journey-Admin-Token", "")
    if not supplied or not hmac.compare_digest(supplied, expected):
        raise HTTPException(403, "Invalid feedback moderation token")


@app.get("/api/feedback")
def feedback(lesson_slug: str | None = None, limit: int = 50) -> dict[str, Any]:
    return list_feedback(lesson_slug, limit)


@app.post("/api/feedback", status_code=201)
def create_feedback(payload: FeedbackSubmission) -> dict[str, Any]:
    return submit_feedback(payload)


@app.get("/api/feedback/moderation")
def feedback_moderation(request: Request, status: str | None = None, limit: int = 100) -> dict[str, Any]:
    _require_feedback_admin(request)
    if limit < 1 or limit > 200:
        raise HTTPException(400, "limit must be between 1 and 200")
    clean_status = (status or "").strip().casefold()
    if clean_status and clean_status not in FEEDBACK_STATUSES:
        raise HTTPException(400, "Unsupported feedback status")
    params: list[Any] = []
    where = "1=1"
    if clean_status:
        where += " AND f.status=?"
        params.append(clean_status)
    params.append(limit)
    with connect() as db:
        rows = db.execute(
            f"""SELECT f.id,f.display_name,f.kind,f.body,f.status,f.created_at,f.updated_at,
                l.slug AS lesson_slug,l.title_vi AS lesson_title_vi,l.title_en AS lesson_title_en,
                f.moderation_note,f.resolved_commit
                FROM feedback f JOIN lessons l ON l.id=f.lesson_id
                WHERE {where} ORDER BY f.updated_at ASC, f.id ASC LIMIT ?""",
            params,
        ).fetchall()
    return {"items": [_feedback_payload(row, include_moderation=True) for row in rows], "count": len(rows)}


@app.patch("/api/feedback/{feedback_id}/moderation")
def update_feedback_moderation(feedback_id: int, payload: FeedbackModerationUpdate, request: Request) -> dict[str, Any]:
    _require_feedback_admin(request)
    next_status = payload.status.strip().casefold()
    if next_status not in FEEDBACK_STATUSES:
        raise HTTPException(400, "Unsupported feedback status")
    moderation_note = payload.moderation_note.strip()
    resolved_commit = payload.resolved_commit.strip()
    with connect() as db:
        row = db.execute(
            """SELECT f.id,f.display_name,f.kind,f.body,f.status,f.created_at,f.updated_at,
                l.slug AS lesson_slug,l.title_vi AS lesson_title_vi,l.title_en AS lesson_title_en,
                f.moderation_note,f.resolved_commit
                FROM feedback f JOIN lessons l ON l.id=f.lesson_id WHERE f.id=?""",
            (feedback_id,),
        ).fetchone()
        if not row:
            raise HTTPException(404, "Feedback not found")
        if next_status not in FEEDBACK_TRANSITIONS[row["status"]]:
            raise HTTPException(409, f"Cannot move feedback from {row['status']} to {next_status}")
        db.execute(
            "UPDATE feedback SET status=?,moderation_note=?,resolved_commit=?,updated_at=? WHERE id=?",
            (next_status, moderation_note, resolved_commit, now_iso(), feedback_id),
        )
        updated = db.execute(
            """SELECT f.id,f.display_name,f.kind,f.body,f.status,f.created_at,f.updated_at,
                l.slug AS lesson_slug,l.title_vi AS lesson_title_vi,l.title_en AS lesson_title_en,
                f.moderation_note,f.resolved_commit
                FROM feedback f JOIN lessons l ON l.id=f.lesson_id WHERE f.id=?""",
            (feedback_id,),
        ).fetchone()
    return {"feedback": _feedback_payload(updated, include_moderation=True)}


@app.get("/api/dashboard")
def dashboard() -> dict[str, Any]:
    with connect() as db:
        totals = db.execute("SELECT COUNT(*) AS total, SUM(CASE WHEN p.status='completed' THEN 1 ELSE 0 END) AS completed, SUM(CASE WHEN p.status='in_progress' THEN 1 ELSE 0 END) AS in_progress FROM lessons l LEFT JOIN progress p ON p.lesson_id=l.id").fetchone()
        due = db.execute("SELECT COUNT(*) AS n FROM review_state WHERE due_at <= ? AND suspended=0", (now_iso(),)).fetchone()["n"]
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
        reviews = db.execute("SELECT c.*,s.due_at,s.interval_days,s.repetitions,s.ease_factor,s.lapses,s.leech,s.suspended,s.last_reviewed_at FROM review_cards c JOIN review_state s ON s.card_id=c.id WHERE c.lesson_id=? ORDER BY c.id", (row["id"],)).fetchall()
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
        rows = db.execute("""SELECT c.*,s.due_at,s.interval_days,s.repetitions,s.ease_factor,s.lapses,s.leech,s.suspended,s.last_reviewed_at,
            l.slug AS lesson_slug,l.title_vi AS lesson_title_vi,l.title_en AS lesson_title_en,p.title_vi AS phase_title_vi,e.slug AS related_exercise
            FROM review_cards c JOIN review_state s ON s.card_id=c.id JOIN lessons l ON l.id=c.lesson_id
            JOIN modules m ON m.id=l.module_id JOIN phases p ON p.id=m.phase_id
            LEFT JOIN exercises e ON e.module_id=m.id
            WHERE s.due_at <= ? AND s.suspended=0 ORDER BY s.due_at,c.id LIMIT 30""", (now_iso(),)).fetchall()
    return {"items": [dict(row) for row in rows], "count": len(rows)}


@app.post("/api/reviews/{review_id}/answer")
def answer_review(review_id: int, payload: ReviewAnswer) -> dict[str, Any]:
    with connect() as db:
        review = db.execute("SELECT c.*,s.* FROM review_cards c JOIN review_state s ON s.card_id=c.id WHERE c.id=?", (review_id,)).fetchone()
        if not review:
            raise HTTPException(404, "Review item not found")
        rating = payload.rating
        quality = {"again": 0, "hard": 3, "good": 4, "easy": 5}[rating]
        ease = float(review["ease_factor"] or 2.5)
        repetitions = int(review["repetitions"] or 0)
        lapses = int(review["lapses"] or 0)
        interval_before = int(review["interval_days"] or 0)
        if quality < 3:
            repetitions = 0
            lapses += 1
            ease = max(1.3, ease - 0.2)
            interval = 1
        else:
            repetitions += 1
            ease = max(1.3, ease + (0.15 if quality == 5 else -0.15 if quality == 3 else 0.0))
            if rating == "hard":
                interval = max(1, round((interval_before or 1) * 1.2))
            elif repetitions == 1:
                interval = 1
            elif repetitions == 2:
                interval = 6
            else:
                interval = max(1, round((interval_before or 1) * ease * (1.3 if rating == "easy" else 1.0)))
        interval = min(365, interval)
        leech = 1 if lapses >= 8 else int(review["leech"] or 0)
        suspended = 1 if leech else int(review["suspended"] or 0)
        due = (datetime.now(timezone.utc) + timedelta(days=interval)).isoformat()
        reviewed_at = now_iso()
        db.execute("""UPDATE review_state SET due_at=?,interval_days=?,repetitions=?,ease_factor=?,lapses=?,leech=?,suspended=?,last_reviewed_at=? WHERE card_id=?""",
                   (due, interval, repetitions, ease, lapses, leech, suspended, reviewed_at, review_id))
        db.execute("""UPDATE review_items SET due_at=?,interval_days=?,repetitions=?,ease_factor=?,last_reviewed_at=? WHERE id=?""",
                   (due, interval, repetitions, ease, reviewed_at, review_id))
        history_id = db.execute(
            "INSERT INTO review_history(review_id,rating,thought_seconds,answer_text,created_at) VALUES(?,?,?,?,?)",
            (review_id, payload.rating, payload.thought_seconds, payload.answer_text, now_iso()),
        ).lastrowid
    return {"review_id": review_id, "history_id": history_id, "next_due_at": due, "interval_days": interval,
            "ease_factor": ease, "repetitions": repetitions, "lapses": lapses, "leech": bool(leech), "suspended": bool(suspended)}


@app.get("/api/reviews/history")
def review_history(limit: int = 50) -> dict[str, Any]:
    bounded_limit = max(1, min(limit, 200))
    with connect() as db:
        rows = db.execute(
            """SELECT h.*,r.question_vi,r.question_en,l.slug AS lesson_slug,l.title_vi AS lesson_title_vi
            FROM review_history h JOIN review_cards r ON r.id=h.review_id JOIN lessons l ON l.id=r.lesson_id
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
            FROM review_cards r JOIN lessons l ON l.id=r.lesson_id
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
def create_workspace(slug: str, request: Request = None) -> dict[str, Any]:  # type: ignore[assignment]
    require_local_request(request)
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
def open_workspace(workspace_id: int, request: Request = None) -> dict[str, Any]:  # type: ignore[assignment]
    require_local_request(request)
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
def open_workspace_folder(workspace_id: int, request: Request = None) -> dict[str, Any]:  # type: ignore[assignment]
    require_local_request(request)
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
def export_workspace(workspace_id: int, request: Request = None) -> dict[str, Any]:  # type: ignore[assignment]
    require_local_request(request)
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
def run_workspace(workspace_id: int, request: Request = None) -> dict[str, Any]:  # type: ignore[assignment]
    require_local_request(request)
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
def workspace_runs(workspace_id: int, limit: int = 20, request: Request = None) -> dict[str, Any]:  # type: ignore[assignment]
    require_local_request(request)
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
def git_status(request: Request = None) -> dict[str, Any]:  # type: ignore[assignment]
    require_local_request(request)
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
    return {"root": "configured-project" if PROJECT_ROOT_CONFIGURED else "local-project", "branch": branch, "status": status, "remote": sanitize_remote(remote), "last_commit": last_commit}


@app.get("/api/git/diff")
def git_diff(request: Request = None) -> dict[str, str]:  # type: ignore[assignment]
    require_local_request(request)
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
def suggested_commit(request: Request = None) -> dict[str, Any]:  # type: ignore[assignment]
    require_local_request(request)
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
def publish_git(payload: GitPublishRequest, request: Request = None) -> dict[str, Any]:  # type: ignore[assignment]
    """Commit and push explicitly selected learning artifacts.

    The endpoint deliberately accepts only learner-owned artifact roots and refuses to
    touch an already staged worktree. This keeps an exercise publish from accidentally
    committing application code or an unrelated change.
    """

    require_local_request(request)
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
        "remote": sanitize_remote(remote),
        "files": staged_paths,
        "message": message,
    }


@app.post("/api/journal/export")
def export_journal(request: Request = None) -> dict[str, Any]:  # type: ignore[assignment]
    require_local_request(request)
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


BACKUP_SCHEMA_VERSION = 1
BACKUP_STATUS_VALUES = {"not_started", "in_progress", "blocked", "completed", "needs_review"}
BACKUP_REVIEW_RATINGS = {"again", "hard", "good", "easy"}


def _backup_journal_files() -> list[dict[str, str]]:
    """Collect text journal artifacts without copying databases, workspaces or secrets."""

    if not JOURNAL_ROOT.exists():
        return []
    files: list[dict[str, str]] = []
    for path in sorted(JOURNAL_ROOT.rglob("*")):
        if path.is_symlink() or not path.is_file() or path.suffix.lower() not in {".md", ".json", ".txt"}:
            continue
        try:
            relative = path.relative_to(JOURNAL_ROOT).as_posix()
            content = redact_secrets(path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError):
            continue
        if contains_secret(content):
            continue
        files.append({"path": relative, "content": content})
    return files


def _build_backup_payload() -> dict[str, Any]:
    with connect() as db:
        lesson_slugs = {row["id"]: row["slug"] for row in db.execute("SELECT id,slug FROM lessons").fetchall()}
        card_rows = db.execute(
            """SELECT rc.id, l.slug AS lesson_slug, rc.type, rs.due_at, rs.interval_days,
               rs.repetitions, rs.ease_factor, rs.lapses, rs.leech, rs.suspended,
               rs.last_reviewed_at
               FROM review_cards rc JOIN lessons l ON l.id=rc.lesson_id
               LEFT JOIN review_state rs ON rs.card_id=rc.id ORDER BY rc.id"""
        ).fetchall()
        progress = [dict(row) | {"lesson_slug": lesson_slugs.get(row["lesson_id"], "")} for row in db.execute("SELECT lesson_id,status,minutes_spent,completed_at,updated_at FROM progress ORDER BY lesson_id").fetchall()]
        notes = [dict(row) | {"lesson_slug": lesson_slugs.get(row["lesson_id"], "") if row["lesson_id"] else None} for row in db.execute("SELECT lesson_id,title,body,created_at,updated_at FROM notes ORDER BY id").fetchall()]
        sessions = [dict(row) | {"lesson_slug": lesson_slugs.get(row["lesson_id"], "") if row["lesson_id"] else None} for row in db.execute("SELECT lesson_id,minutes,note,created_at FROM study_sessions ORDER BY id").fetchall()]
        history_rows = db.execute(
            """SELECT rh.review_id, l.slug AS lesson_slug, rh.rating, rh.thought_seconds,
               rh.answer_text, rh.created_at
               FROM review_history rh JOIN review_cards rc ON rc.id=rh.review_id
               JOIN lessons l ON l.id=rc.lesson_id ORDER BY rh.id"""
        ).fetchall()
        settings = {row["key"]: row["value"] for row in db.execute("SELECT key,value FROM settings").fetchall()}
    review_state = [dict(row) for row in card_rows]
    return {
        "schema_version": BACKUP_SCHEMA_VERSION,
        "app_version": "0.1.0",
        "exported_at": now_iso(),
        "settings": settings,
        "progress": progress,
        "review_state": review_state,
        "review_history": [dict(row) for row in history_rows],
        "notes": notes,
        "study_sessions": sessions,
        "journal_files": _backup_journal_files(),
    }


def _write_backup_files(payload: dict[str, Any]) -> tuple[Path, Path]:
    backup_dir = DATA_ROOT / "backups"
    backup_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().astimezone().strftime("%Y%m%d-%H%M%S")
    json_path = backup_dir / f"journey-backup-{stamp}.json"
    suffix = 1
    while json_path.exists():
        json_path = backup_dir / f"journey-backup-{stamp}-{suffix}.json"
        suffix += 1
    json_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    markdown_path = json_path.with_suffix(".md")
    markdown = "\n".join([
        "# Journey AI Engineer backup",
        "",
        f"- Exported: `{payload['exported_at']}`",
        f"- Lessons with progress: **{len(payload['progress'])}**",
        f"- Review cards: **{len(payload['review_state'])}**",
        f"- Notes: **{len(payload['notes'])}**",
        f"- Study sessions: **{len(payload['study_sessions'])}**",
        f"- Journal files: **{len(payload['journal_files'])}**",
        "",
        "This file is a human-readable manifest. The JSON file beside it is the import source.",
        "",
    ])
    markdown_path.write_text(markdown, encoding="utf-8")
    return json_path, markdown_path


def _validate_backup_payload(payload: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    if payload.get("schema_version") != BACKUP_SCHEMA_VERSION:
        errors.append(f"Unsupported backup schema_version: {payload.get('schema_version')!r}")
    for key, expected in (("settings", dict), ("progress", list), ("review_state", list), ("review_history", list), ("notes", list), ("study_sessions", list), ("journal_files", list)):
        if not isinstance(payload.get(key), expected):
            errors.append(f"{key} must be a {expected.__name__}")
    if errors:
        return errors
    with connect() as db:
        lesson_slugs = {row["slug"] for row in db.execute("SELECT slug FROM lessons").fetchall()}
        cards = {row["id"]: row["lesson_slug"] for row in db.execute("SELECT rc.id,l.slug AS lesson_slug FROM review_cards rc JOIN lessons l ON l.id=rc.lesson_id").fetchall()}
    for index, row in enumerate(payload["progress"]):
        if not isinstance(row, dict):
            errors.append(f"progress[{index}] must be an object")
            continue
        if row.get("lesson_slug") not in lesson_slugs:
            errors.append(f"progress[{index}] references an unknown lesson")
        if row.get("status") not in BACKUP_STATUS_VALUES or not isinstance(row.get("minutes_spent"), int) or row.get("minutes_spent", -1) < 0:
            errors.append(f"progress[{index}] has invalid status or minutes_spent")
    for index, row in enumerate(payload["review_state"]):
        if not isinstance(row, dict):
            errors.append(f"review_state[{index}] must be an object")
            continue
        if row.get("id") not in cards or row.get("lesson_slug") != cards.get(row.get("id")):
            errors.append(f"review_state[{index}] references an unknown card")
        if not isinstance(row.get("interval_days"), int) or row.get("interval_days", -1) < 0 or not isinstance(row.get("repetitions"), int) or row.get("repetitions", -1) < 0:
            errors.append(f"review_state[{index}] has invalid scheduling values")
    for index, row in enumerate(payload["review_history"]):
        if not isinstance(row, dict):
            errors.append(f"review_history[{index}] must be an object")
            continue
        if row.get("review_id") not in cards or row.get("lesson_slug") != cards.get(row.get("review_id")) or row.get("rating") not in BACKUP_REVIEW_RATINGS:
            errors.append(f"review_history[{index}] is invalid")
    for group in ("notes", "study_sessions"):
        for index, row in enumerate(payload[group]):
            if not isinstance(row, dict):
                errors.append(f"{group}[{index}] must be an object")
                continue
            if row.get("lesson_slug") is not None and row.get("lesson_slug") not in lesson_slugs:
                errors.append(f"{group}[{index}] references an unknown lesson")
    for index, row in enumerate(payload["journal_files"]):
        relative = row.get("path") if isinstance(row, dict) else None
        if not isinstance(relative, str) or not relative or Path(relative).is_absolute() or ".." in Path(relative).parts or Path(relative).suffix.lower() not in {".md", ".json", ".txt"}:
            errors.append(f"journal_files[{index}] has an unsafe path")
        elif not isinstance(row.get("content"), str) or contains_secret(row["content"]):
            errors.append(f"journal_files[{index}] contains invalid or secret content")
    return errors


@app.post("/api/backup/export")
def export_backup(request: Request = None) -> dict[str, Any]:  # type: ignore[assignment]
    require_local_request(request)
    payload = _build_backup_payload()
    json_path, markdown_path = _write_backup_files(payload)
    return {"payload": payload, "json_path": str(json_path), "markdown_path": str(markdown_path)}


@app.post("/api/backup/preview")
def preview_backup(request_data: BackupImportRequest, request: Request = None) -> dict[str, Any]:  # type: ignore[assignment]
    require_local_request(request)
    errors = _validate_backup_payload(request_data.payload)
    return {"valid": not errors, "errors": errors, "counts": {key: len(request_data.payload.get(key, [])) for key in ("progress", "review_state", "review_history", "notes", "study_sessions", "journal_files")}}


@app.post("/api/backup/import")
def import_backup(request_data: BackupImportRequest, request: Request = None) -> dict[str, Any]:  # type: ignore[assignment]
    require_local_request(request)
    errors = _validate_backup_payload(request_data.payload)
    if errors:
        raise HTTPException(422, {"message": "Backup validation failed", "errors": errors})
    if not request_data.confirm:
        raise HTTPException(400, "Set confirm=true after reviewing the backup preview.")
    safety_payload = _build_backup_payload()
    safety_json, safety_markdown = _write_backup_files(safety_payload)
    payload = request_data.payload
    with connect() as db:
        db.execute("BEGIN")
        db.execute("DELETE FROM review_history")
        db.execute("DELETE FROM review_state")
        db.execute("DELETE FROM progress")
        db.execute("DELETE FROM notes")
        db.execute("DELETE FROM study_sessions")
        db.execute("DELETE FROM settings")
        lesson_ids = {row["slug"]: row["id"] for row in db.execute("SELECT id,slug FROM lessons").fetchall()}
        for row in payload["progress"]:
            db.execute("INSERT INTO progress(lesson_id,status,minutes_spent,completed_at,updated_at) VALUES(?,?,?,?,?)", (lesson_ids[row["lesson_slug"]], row["status"], row["minutes_spent"], row.get("completed_at"), row.get("updated_at") or now_iso()))
        for row in payload["review_state"]:
            db.execute("INSERT INTO review_state(card_id,due_at,interval_days,repetitions,ease_factor,lapses,leech,suspended,last_reviewed_at) VALUES(?,?,?,?,?,?,?,?,?)", (row["id"], row.get("due_at") or now_iso(), row.get("interval_days", 0), row.get("repetitions", 0), row.get("ease_factor", 2.5), row.get("lapses", 0), row.get("leech", 0), row.get("suspended", 0), row.get("last_reviewed_at")))
        for row in payload["review_history"]:
            db.execute("INSERT INTO review_history(review_id,rating,thought_seconds,answer_text,created_at) VALUES(?,?,?,?,?)", (row["review_id"], row["rating"], row.get("thought_seconds", 0), row.get("answer_text", ""), row.get("created_at") or now_iso()))
        for row in payload["notes"]:
            db.execute("INSERT INTO notes(lesson_id,title,body,created_at,updated_at) VALUES(?,?,?,?,?)", (lesson_ids.get(row.get("lesson_slug")) if row.get("lesson_slug") else None, row.get("title", "Imported note"), row.get("body", ""), row.get("created_at") or now_iso(), row.get("updated_at") or now_iso()))
        for row in payload["study_sessions"]:
            db.execute("INSERT INTO study_sessions(lesson_id,minutes,note,created_at) VALUES(?,?,?,?)", (lesson_ids.get(row.get("lesson_slug")) if row.get("lesson_slug") else None, row.get("minutes", 0), row.get("note", ""), row.get("created_at") or now_iso()))
        for key, value in payload["settings"].items():
            if isinstance(key, str) and isinstance(value, str) and len(key) <= 100 and len(value) <= 1000:
                db.execute("INSERT INTO settings(key,value,updated_at) VALUES(?,?,?)", (key, value, now_iso()))
    restored_files = 0
    for row in payload["journal_files"]:
        target = (JOURNAL_ROOT / row["path"]).resolve()
        if JOURNAL_ROOT.resolve() not in target.parents:
            continue
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(redact_secrets(row["content"]), encoding="utf-8")
        restored_files += 1
    sync_review_cards()
    return {"imported": True, "safety_backup_json": str(safety_json), "safety_backup_markdown": str(safety_markdown), "restored_journal_files": restored_files}


@app.post("/api/context/export")
def export_context(payload: ContextRequest, request: Request = None) -> dict[str, Any]:  # type: ignore[assignment]
    require_local_request(request)
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
