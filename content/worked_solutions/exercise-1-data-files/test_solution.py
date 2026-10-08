import json
from pathlib import Path
import subprocess
import sys
from tempfile import TemporaryDirectory
import unittest

from clean_scores import clean_scores


class CleanScoresTests(unittest.TestCase):
    def setUp(self):
        self.directory = TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.source = Path(self.directory.name) / "scores.csv"

    def write(self, text):
        self.source.write_text(text, encoding="utf-8", newline="")

    def test_records_errors_and_line_numbers(self):
        self.write("name,score\n An ,0\nBinh,100\nBad,NaN\n,50\nShort\nLong,10,extra\n")
        self.assertEqual(clean_scores(self.source), {
            "records": [{"name": "An", "score": 0.0}, {"name": "Binh", "score": 100.0}],
            "errors": [{"line": 4, "reason": "invalid_score"},
                       {"line": 5, "reason": "empty_name"},
                       {"line": 6, "reason": "column_count"},
                       {"line": 7, "reason": "column_count"}],
        })

    def test_header_and_empty_data(self):
        for header in ("", "name,score,score\n", "score,name\n"):
            self.write(header)
            with self.assertRaises(ValueError):
                clean_scores(self.source)
        self.write("name,score\n")
        self.assertEqual(clean_scores(self.source), {"records": [], "errors": []})

    def test_invalid_scores(self):
        for score in ("", "text", "-1", "101", "inf", "-inf"):
            self.write(f"name,score\nAn,{score}\n")
            self.assertEqual(clean_scores(self.source)["errors"],
                             [{"line": 2, "reason": "invalid_score"}])

    def test_bom_unicode_and_multiline_name(self):
        for ending in ("\n", "\r\n"):
            with self.subTest(ending=ending):
                self.write('\ufeffname,score\n"Huy, An",20\n"Bình\nMai",30\n'.replace("\n", ending))
                self.assertEqual([r["name"] for r in clean_scores(self.source)["records"]],
                                 ["Huy, An", f"Bình{ending}Mai"])

    def test_cli_repeats_without_appending_or_changing_source(self):
        self.write("name,score\nAn,0\n")
        original = self.source.read_bytes()
        output = self.source.with_suffix(".json")
        command = [sys.executable, str(Path(__file__).with_name("clean_scores.py")),
                   str(self.source), str(output)]
        subprocess.run(command, check=True, capture_output=True, timeout=10)
        first = output.read_bytes()
        subprocess.run(command, check=True, capture_output=True, timeout=10)
        self.assertEqual(output.read_bytes(), first)
        self.assertEqual(json.loads(first)["records"], [{"name": "An", "score": 0.0}])
        self.assertEqual(self.source.read_bytes(), original)
        rejected = subprocess.run(command[:-1] + [str(self.source)], capture_output=True, timeout=10)
        self.assertNotEqual(rejected.returncode, 0)
        self.assertEqual(self.source.read_bytes(), original)


if __name__ == "__main__":
    unittest.main()
