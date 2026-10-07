import pytest
from apps.api import backup_journal
from test_review_activation import FIRST, app  # noqa: F401


def test_failed_second_file_restores_first_and_keeps_database(app, monkeypatch):
    app.update_progress(FIRST, app.ProgressUpdate(status="completed", minutes_spent=25))
    root = app.JOURNAL_ROOT
    root.mkdir(parents=True, exist_ok=True)
    first = root / "first.md"
    first.write_text("original", encoding="utf-8")
    payload = app._build_backup_payload()
    payload["progress"] = []
    payload["journal_files"] = [{"path": "first.md", "content": "replacement"},
                                {"path": "second.md", "content": "new"}]
    replace = backup_journal._replace_bytes

    def fail_second(path, content):
        if path.name == "second.md":
            raise OSError("Simulated disk failure")
        replace(path, content)

    monkeypatch.setattr(backup_journal, "_replace_bytes", fail_second)
    with pytest.raises(OSError, match="Simulated disk failure"):
        app.import_backup(app.BackupImportRequest(payload=payload, confirm=True))
    assert first.read_text(encoding="utf-8") == "original"
    assert not (root / "second.md").exists()
    with app.connect() as db:
        assert db.execute("SELECT minutes_spent FROM progress").fetchone()[0] == 25


def test_database_exception_restores_old_files_and_removes_new_files(tmp_path):
    old = tmp_path / "old.md"
    old.write_text("before", encoding="utf-8")
    with pytest.raises(RuntimeError, match="commit failed"):
        with backup_journal.restore_journal(tmp_path, [{"path": "old.md", "content": "after"},
                                                       {"path": "new.md", "content": "new"}]):
            assert old.read_text(encoding="utf-8") == "after"
            raise RuntimeError("commit failed")
    assert old.read_text(encoding="utf-8") == "before"
    assert not (tmp_path / "new.md").exists()


@pytest.mark.parametrize("names", [["../escape.md"], ["C:escape.md"], ["file.md:stream.txt"],
                                   ["CON.txt"], ["a.md", "A.md"], ["folder/../a.md"]])
def test_unsafe_or_duplicate_journal_destination_rejected(tmp_path, names):
    with pytest.raises(ValueError):
        backup_journal.journal_targets(tmp_path, [{"path": name, "content": "text"} for name in names])
