import unittest
from gradient_demo import autograd_gradient, descent, finite_difference, gradient, loss


class GradientTests(unittest.TestCase):
    def test_hand_derivative_and_stationary_point(self):
        self.assertEqual([gradient(w) for w in [0, 3, 5]], [-6, 0, 4])
        self.assertEqual(loss(3), 0)

    def test_finite_difference_matches_analytic(self):
        for weight in [-10, 0, 3, 5, 20]:
            self.assertAlmostEqual(finite_difference(weight), gradient(weight), places=6)
        for epsilon in [0, -1, float("nan"), float("inf")]:
            with self.assertRaises(ValueError):
                finite_difference(0, epsilon)

    def test_autograd_matches_both_independent_derivatives(self):
        for weight in [-10, 0, 3, 5, 20]:
            self.assertAlmostEqual(autograd_gradient(weight), gradient(weight), places=10)
            self.assertAlmostEqual(autograd_gradient(weight), finite_difference(weight), places=6)

    def test_learning_rate_convergence_oscillation_and_divergence(self):
        values = descent(0, 0.1)
        self.assertTrue(all(loss(a) > loss(b) for a, b in zip(values, values[1:])))
        self.assertEqual(descent(0, 0.5, 1), [0, 3])
        self.assertEqual(descent(0, 1, 3), [0, 6, 0, 6])
        self.assertGreater(loss(descent(0, 1.1)[-1]), loss(0))

    def test_invalid_optimizer_inputs_and_zero_steps(self):
        self.assertEqual(descent(2, 0.1, 0), [2])
        for rate in [0, -0.1, float("nan"), float("inf")]:
            with self.assertRaises(ValueError):
                descent(0, rate)
        for steps in [-1, True, 1.5, 1001]:
            with self.assertRaises(ValueError):
                descent(0, 0.1, steps)


if __name__ == "__main__":
    unittest.main()
