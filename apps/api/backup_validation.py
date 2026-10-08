"""Validate portable backup values before database lookup or filesystem access."""
from datetime import datetime
from typing import Annotated, Literal

from pydantic import AfterValidator, BaseModel, ConfigDict, Field, ValidationError


SQLITE_MAX_INTEGER = 2**63 - 1
Counter = Annotated[int, Field(ge=0, le=SQLITE_MAX_INTEGER)]
Flag = Annotated[int, Field(ge=0, le=1)]


def utf8_text(value: str) -> str:
    try:
        value.encode("utf-8")
    except UnicodeError as error:
        raise ValueError("must contain valid UTF-8 text") from error
    return value


Text = Annotated[str, AfterValidator(utf8_text)]


def iso_timestamp(value: str) -> str:
    # Empty legacy timestamps use the importer's existing default behavior.
    if value:
        try:
            datetime.fromisoformat(value)
        except ValueError as error:
            raise ValueError("must be an ISO timestamp") from error
    return value


Timestamp = Annotated[Text, AfterValidator(iso_timestamp)]


class BackupRow(BaseModel):
    model_config = ConfigDict(strict=True)


class ProgressRow(BackupRow):
    lesson_slug: Text
    status: Literal["not_started", "in_progress", "blocked", "completed", "needs_review"]
    minutes_spent: Counter
    completed_at: Timestamp | None = None
    updated_at: Timestamp | None = None


class ReviewStateRow(BackupRow):
    id: Annotated[int, Field(gt=0, le=SQLITE_MAX_INTEGER)]
    lesson_slug: Text
    interval_days: Counter
    repetitions: Counter
    ease_factor: Annotated[float, Field(gt=0, le=SQLITE_MAX_INTEGER, allow_inf_nan=False)] = 2.5
    lapses: Counter = 0
    leech: Flag = 0
    suspended: Flag = 0
    due_at: Timestamp | None = None
    last_reviewed_at: Timestamp | None = None


class ReviewHistoryRow(BackupRow):
    review_id: Annotated[int, Field(gt=0, le=SQLITE_MAX_INTEGER)]
    lesson_slug: Text
    rating: Literal["again", "hard", "good", "easy"]
    thought_seconds: Counter = 0
    answer_text: Text = ""
    created_at: Timestamp | None = None


class NoteRow(BackupRow):
    lesson_slug: Text | None = None
    title: Text = "Imported note"
    body: Text = ""
    created_at: Timestamp | None = None
    updated_at: Timestamp | None = None


class SessionRow(BackupRow):
    lesson_slug: Text | None = None
    minutes: Counter = 0
    note: Text = ""
    created_at: Timestamp | None = None


class JournalRow(BackupRow):
    path: Text
    content: Text


class BackupValues(BackupRow):
    schema_version: Annotated[int, Field(ge=1, le=1)]
    settings: dict[Annotated[Text, Field(max_length=100)], Annotated[Text, Field(max_length=1000)]]
    progress: list[ProgressRow]
    review_state: list[ReviewStateRow]
    review_history: list[ReviewHistoryRow]
    notes: list[NoteRow]
    study_sessions: list[SessionRow]
    journal_files: list[JournalRow]


SETTING_CHOICES = {
    "language": {"vi", "en"},
    "track": {"standard", "accelerated"},
    "show_completed_lessons": {"true", "false"},
    "onboarding_complete": {"true", "false"},
    "target_role": {"internship", "junior", "career_switch"},
    "experience_level": {"beginner", "intermediate", "advanced"},
}


def validate_backup_values(payload: dict) -> list[str]:
    """Return field locations without echoing private note or journal contents."""
    try:
        BackupValues.model_validate(payload)
    except ValidationError as error:
        return [
            f"{'.'.join(str(part) for part in item['loc'])}: "
            + ("must be an object" if item["type"] == "model_type" else item["msg"])
            for item in error.errors(include_input=False, include_context=False, include_url=False)
        ]
    errors = []
    settings = payload["settings"]
    for key, choices in SETTING_CHOICES.items():
        if key in settings and settings[key] not in choices:
            errors.append(f"settings.{key}: unsupported value")
    if "weekly_goal_minutes" in settings:
        try:
            goal = int(settings["weekly_goal_minutes"])
        except ValueError:
            goal = 0
        if not 60 <= goal <= 10080:
            errors.append("settings.weekly_goal_minutes: must be an integer from 60 to 10080")
    return errors
