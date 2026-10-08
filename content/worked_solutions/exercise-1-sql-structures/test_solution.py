import sqlite3
import unittest

from learning_log import create_log, seed, weekly_join, weekly_lookup


class LearningLogTests(unittest.TestCase):
    def setUp(self):
        self.db = create_log()
        self.addCleanup(self.db.close)

    def assert_both(self, week, expected):
        self.assertEqual(weekly_join(self.db, week), expected)
        self.assertEqual(weekly_lookup(self.db, week), expected)

    def test_week_boundaries_and_zero_sessions(self):
        seed(self.db)
        self.assert_both("2026-10-05", [(1, "An", 45), (2, "Binh", 30), (3, "Chi", 0)])
        self.assert_both("2026-10-12", [(1, "An", 100), (2, "Binh", 0), (3, "Chi", 0)])

    def test_empty_database_and_empty_week(self):
        self.assert_both("2026-10-05", [])
        seed(self.db)
        self.assert_both("2026-09-28", [(1, "An", 0), (2, "Binh", 0), (3, "Chi", 0)])

    def test_same_names_stay_separate_and_sessions_are_not_distinct_minutes(self):
        self.db.executemany("INSERT INTO learners VALUES (?, ?)", [(1, "An"), (2, "An")])
        self.db.executemany("INSERT INTO sessions VALUES (?, ?, ?, ?)", [
            (1, 1, "2026-10-05", 20), (2, 1, "2026-10-05", 20), (3, 2, "2026-10-05", 10),
        ])
        self.assert_both("2026-10-05", [(1, "An", 40), (2, "An", 10)])

    def test_foreign_key_primary_key_and_minutes_constraints(self):
        seed(self.db)
        for row in [(9, 999, "2026-10-05", 20), (1, 1, "2026-10-05", 20),
                    (9, 1, "2026-10-05", 0), (9, 1, "2026-10-05", 1441)]:
            with self.subTest(row=row), self.assertRaises(sqlite3.IntegrityError):
                self.db.execute("INSERT INTO sessions VALUES (?, ?, ?, ?)", row)

    def test_invalid_week_and_year_boundary(self):
        for query in [weekly_join, weekly_lookup]:
            for week in ["2026-10-06", "2026-02-30", "20261005", "bad'; DROP TABLE learners;--"]:
                with self.subTest(week=week), self.assertRaises(ValueError):
                    query(self.db, week)
        self.db.execute("INSERT INTO learners VALUES (1, 'An')")
        self.db.executemany("INSERT INTO sessions VALUES (?, 1, ?, 20)", [
            (1, "2026-12-28"), (2, "2027-01-03"), (3, "2027-01-04"),
        ])
        self.assert_both("2026-12-28", [(1, "An", 40)])


if __name__ == "__main__":
    unittest.main()
