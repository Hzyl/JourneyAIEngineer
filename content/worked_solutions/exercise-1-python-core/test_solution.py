import unittest

from study_scores import weighted_score


class WeightedScoreTests(unittest.TestCase):
    def test_weighted_mean(self):
        self.assertAlmostEqual(weighted_score([(80, 0.25), (100, 0.75)]), 95)

    def test_weights_need_not_sum_to_one(self):
        self.assertAlmostEqual(weighted_score([(0, 0.2), (100, 0.2)]), 50)

    def test_does_not_mutate_input(self):
        items = [(20, 0.1), (60, 0.3)]
        before = items.copy()
        weighted_score(items)
        self.assertEqual(items, before)

    def test_boundaries(self):
        self.assertEqual(weighted_score([(0, 1)]), 0)
        self.assertEqual(weighted_score([(100, 1)]), 100)

    def test_bad_inputs(self):
        for items in ([], None, [(20,)], [(20, 0)], [(20, -1)], [(20, 2)],
                      [(101, 1)], [(-1, 1)], [(True, 1)], [(20, True)],
                      [("20", 1)], [(float("nan"), 1)], [(20, float("inf"))]):
            with self.subTest(items=items), self.assertRaises(ValueError):
                weighted_score(items)


if __name__ == "__main__":
    unittest.main()
