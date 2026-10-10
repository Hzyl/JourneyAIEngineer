import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from scripts import build_exercise_catalog as builder


class ExerciseEditorialTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.content = Path(self.directory.name)
        self.slug = "exercise-0-example"
        self.editorial = {
            "title_vi": "Thực hành · Ví dụ",
            "description_vi": "1. Làm ví dụ.\n\nTự kiểm tra: Giải thích kết quả.",
            "hints": ["Dùng dữ liệu nhỏ để đối chiếu."],
        }
        self.write("curriculum.json", {
            "phases": [{"order": 0, "slug": "phase-00", "modules": [{
                "slug": "example", "title_vi": "Tiêu đề gốc",
                "title_en": "Original title", "lessons": ["one"],
            }]}],
        })
        self.write("module_guides.json", {"modules": {"example": {
            "practice_vi": "Hướng dẫn gốc", "checkpoint_vi": "Tiêu chí gốc",
            "practice_en": "Original practice", "checkpoint_en": "Original check",
        }}})

    def write(self, name, payload):
        (self.content / name).write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")

    def build_with(self, overrides):
        self.write("exercise_editorial_vi.json", {"schema_version": 1, "exercises": overrides})
        with patch.object(builder, "CONTENT", self.content):
            return builder.build_catalog()

    def test_reviewed_copy_survives_guide_changes_without_changing_metadata(self):
        generated = self.build_with({self.slug: self.editorial})["exercises"][0]
        for key, value in self.editorial.items():
            self.assertEqual(generated[key], value)
        self.assertEqual(generated["id"], 1)
        self.assertEqual(generated["lesson_slugs"], ["phase-00-example-1"])
        self.assertEqual(generated["title_en"], "Lab · Original title")
        self.assertEqual(generated["description_en"], "Original practice\n\nCheckpoint: Original check")
        self.write("module_guides.json", {"modules": {"example": {"practice_vi": "Bản mới"}}})
        rebuilt = self.build_with({self.slug: self.editorial})["exercises"][0]
        for key, value in self.editorial.items():
            self.assertEqual(rebuilt[key], value)

    def test_unknown_exercise_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "Unknown exercise"):
            self.build_with({"exercise-unknown": self.editorial})

    def test_invalid_or_non_editorial_fields_are_rejected(self):
        cases = [
            {**self.editorial, "slug": "renamed"},
            {**self.editorial, "test_command": "unexpected command"},
            {**self.editorial, "title_vi": ""},
            {**self.editorial, "description_vi": ["wrong type"]},
            {**self.editorial, "hints": []},
            {**self.editorial, "hints": [""]},
            {"title_vi": "Missing required prose"},
        ]
        for override in cases:
            with self.subTest(override=override), self.assertRaises(ValueError):
                self.build_with({self.slug: override})

    def test_catalog_rebuild_is_deterministic_and_matches_saved_output(self):
        first = builder.build_catalog()
        second = builder.build_catalog()
        self.assertEqual(first, second)
        expected = json.loads((builder.CONTENT / "exercises.json").read_text(encoding="utf-8"))
        self.assertEqual(first, expected)


if __name__ == "__main__":
    unittest.main()
