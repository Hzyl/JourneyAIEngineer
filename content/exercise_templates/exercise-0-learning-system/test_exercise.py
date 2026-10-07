import unittest

from starter import total_study_minutes


class StudyMinuteTests(unittest.TestCase):
    def test_focused_intervals(self):
        self.assertEqual(total_study_minutes([{"id": "a", "minutes": 20}, {"id": "b", "minutes": 25}]), 45)

    def test_empty_week(self):
        self.assertEqual(total_study_minutes([]), 0)

    def test_same_session_is_counted_once(self):
        self.assertEqual(total_study_minutes([{"id": "a", "minutes": 20}, {"id": "a", "minutes": 20}]), 20)

    def test_conflicting_retry_is_rejected(self):
        with self.assertRaises(ValueError):
            total_study_minutes([{"id": "a", "minutes": 20}, {"id": "a", "minutes": 25}])

    def test_invalid_entries_are_rejected(self):
        invalid = [None, {}, {"id": " ", "minutes": 20}]
        invalid.extend({"id": "a", "minutes": value} for value in (0, -1, 1441, True, 1.5, "20"))
        for entry in invalid:
            with self.subTest(entry=entry), self.assertRaises(ValueError):
                total_study_minutes([entry])


if __name__ == "__main__":
    unittest.main()
