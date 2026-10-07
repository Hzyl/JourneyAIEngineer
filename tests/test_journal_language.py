from test_api import load_module


def test_note_labels_are_bilingual_without_changing_user_content(tmp_path, monkeypatch):
    module = load_module(tmp_path, monkeypatch)
    slug = "phase-00-onboarding-environment-1"
    module.create_note(module.NoteCreate(lesson_slug=slug, title="My insight", body="Giữ nguyên nội dung."))
    module.create_note(module.NoteCreate(title="General", body="My own words."))
    rows = {note["title"]: note for note in module.list_notes()["notes"]}
    with module.connect() as db:
        lesson = db.execute("SELECT title_vi,title_en FROM lessons WHERE slug=?", (slug,)).fetchone()
    assert rows["My insight"]["lesson_title_vi"] == lesson["title_vi"]
    assert rows["My insight"]["lesson_title_en"] == lesson["title_en"]
    assert rows["My insight"]["body"] == "Giữ nguyên nội dung."
    assert rows["General"]["lesson_title_en"] is None
    assert rows["General"]["body"] == "My own words."
