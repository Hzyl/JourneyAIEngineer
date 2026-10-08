import unittest
import numpy as np
from probability_demo import conditional_metrics, simulate


class ProbabilityTests(unittest.TestCase):
    def test_reproducible_sampling_and_population_moments(self):
        first = simulate(20000)
        np.testing.assert_array_equal(first["samples"], simulate(20000)["samples"])
        self.assertLess(abs(first["mean"] - 0.2), 0.015)
        self.assertAlmostEqual(first["variance"], first["mean"] * (1 - first["mean"]))

    def test_probability_boundaries_and_invalid_inputs(self):
        for probability in [0, 1]:
            self.assertEqual(simulate(20, probability)["mean"], probability)
            self.assertEqual(simulate(20, probability)["variance"], 0)
        for size in [0, -1, True, 2.5]:
            with self.assertRaises(ValueError):
                simulate(size)
        for probability in [-0.1, 1.1, float("nan"), float("inf")]:
            with self.assertRaises(ValueError):
                simulate(10, probability)

    def test_precision_and_recall_have_different_denominators(self):
        result = conditional_metrics([1] * 100 + [0] * 900,
                                     [1] * 80 + [0] * 20 + [1] * 90 + [0] * 810)
        self.assertEqual(result["true_positives"], 80)
        self.assertAlmostEqual(result["prevalence"], 0.1)
        self.assertAlmostEqual(result["recall"], 0.8)
        self.assertAlmostEqual(result["precision"], 80 / 170)

    def test_undefined_conditionals_are_not_zero(self):
        result = conditional_metrics([0, 0], [0, 0])
        self.assertIsNone(result["recall"])
        self.assertIsNone(result["precision"])
        self.assertEqual(conditional_metrics([1], [0])["recall"], 0)

    def test_invalid_label_vectors_and_preservation(self):
        labels = [0, 1]
        conditional_metrics(labels, [1, 1])
        self.assertEqual(labels, [0, 1])
        for actual, predicted in [([], []), ([1], [0, 1]), ([2], [0]), ([[1]], [[1]]),
                                  ([float("nan")], [0])]:
            with self.assertRaises(ValueError):
                conditional_metrics(actual, predicted)


if __name__ == "__main__":
    unittest.main()
