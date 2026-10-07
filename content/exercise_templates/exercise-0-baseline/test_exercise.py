import unittest

from starter import summarize_scores


class ScoreTests(unittest.TestCase):
    def test_normal_scores(self):
        self.assertEqual(summarize_scores([60, 80, 100]), {"count": 3, "total": 240, "mean": 80})

    def test_zero_is_observed_and_none_is_missing(self):
        self.assertEqual(summarize_scores([0, None, 20]), {"count": 2, "total": 20, "mean": 10})

    def test_empty_inputs_have_no_mean(self):
        for values in ([], [None, None]):
            with self.subTest(values=values):
                self.assertEqual(summarize_scores(values), {"count": 0, "total": 0, "mean": None})

    def test_invalid_scores_are_rejected(self):
        for value in (-1, 101, "80", True, float("nan"), float("inf")):
            with self.subTest(value=value), self.assertRaises(ValueError):
                summarize_scores([value])

    def test_input_is_not_modified(self):
        scores = [10, None, 30]
        summarize_scores(scores)
        self.assertEqual(scores, [10, None, 30])


if __name__ == "__main__":
    unittest.main()
