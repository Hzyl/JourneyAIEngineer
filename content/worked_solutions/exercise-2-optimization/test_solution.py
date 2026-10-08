import unittest
import numpy as np
from optimizers import fit, mse, regression_data


class OptimizerTests(unittest.TestCase):
    def setUp(self):
        self.data = regression_data()

    def test_algorithms_learn_parameters_and_reduce_holdout_error(self):
        for method, rate in [("sgd", 0.03), ("momentum", 0.003), ("adam", 0.003)]:
            with self.subTest(method=method):
                parameters, history = fit(*self.data, method=method, rate=rate)
                np.testing.assert_allclose(parameters, [2, 1], atol=0.12)
                self.assertLess(history[-1, 1], 0.03)
                self.assertLess(history[-1, 1], history[0, 1])

    def test_reproducibility_and_no_input_mutation(self):
        copies = [values.copy() for values in self.data]
        first = fit(*self.data)
        second = fit(*self.data)
        np.testing.assert_array_equal(first[0], second[0])
        np.testing.assert_array_equal(first[1], second[1])
        for values, original in zip(self.data, copies):
            np.testing.assert_array_equal(values, original)

    def test_validation_labels_never_change_parameter_updates(self):
        x, y, vx, vy = self.data
        first, _ = fit(x, y, vx, vy)
        second, changed_history = fit(x, y, vx, vy + 100)
        np.testing.assert_array_equal(first, second)
        self.assertGreater(changed_history[-1, 1], 1000)

    def test_tiny_rate_undertrains_and_large_rate_is_detected(self):
        _, tiny = fit(*self.data, rate=0.00001)
        _, normal = fit(*self.data)
        self.assertGreater(tiny[-1, 1], 10 * normal[-1, 1])
        with self.assertRaises(ArithmeticError):
            fit(*self.data, rate=2)

    def test_metric_and_invalid_arguments(self):
        self.assertEqual(mse(np.array([0, 1]), np.array([1, 3]), [2, 1]), 0)
        for kwargs in [{"method": "unknown"}, {"rate": 0}, {"rate": float("nan")},
                       {"epochs": True}, {"epochs": 0}]:
            with self.assertRaises(ValueError):
                fit(*self.data, **kwargs)
        with self.assertRaises(ValueError):
            fit([0], [1, 2], [0], [1])


if __name__ == "__main__":
    unittest.main()
