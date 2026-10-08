import unittest
import numpy as np
from pca_demo import affine, project_pca


class PCATests(unittest.TestCase):
    def setUp(self):
        self.x = np.array([[-2, -1], [-2, 1], [2, -1], [2, 1]], dtype=float)

    def test_affine_matches_hand_calculation_and_preserves_input(self):
        before = self.x.copy()
        np.testing.assert_allclose(affine(self.x, [2, -1], 1), [-2, -4, 6, 4])
        np.testing.assert_array_equal(self.x, before)

    def test_shape_and_finite_validation(self):
        for values in [[], [1, 2], [[1, float("nan")]]]:
            with self.assertRaises(ValueError):
                project_pca(values)
        for weights in [[1], [[1], [2]], [1, float("inf")]]:
            with self.assertRaises(ValueError):
                affine(self.x, weights)

    def test_one_component_retains_horizontal_variation(self):
        result = project_pca(self.x)
        self.assertEqual(result["scores"].shape, (4, 1))
        self.assertEqual(result["axes"].shape, (1, 2))
        np.testing.assert_allclose(result["reconstructed"], [[-2, 0], [-2, 0], [2, 0], [2, 0]])
        self.assertAlmostEqual(result["explained_ratio"], 0.8)
        self.assertAlmostEqual(result["squared_error"], 4)

    def test_full_components_reconstruct_and_translation_is_restored(self):
        shifted = self.x + [10, -3]
        np.testing.assert_allclose(project_pca(shifted, 2)["reconstructed"], shifted)
        np.testing.assert_allclose(project_pca(shifted)["reconstructed"],
                                   project_pca(self.x)["reconstructed"] + [10, -3])

    def test_constant_data_and_invalid_component_count(self):
        for values in [[[1, 1]], [[1, 1], [1, 1]]]:
            with self.assertRaises(ValueError):
                project_pca(values)
        for count in [0, 3, True, 1.5]:
            with self.assertRaises(ValueError):
                project_pca(self.x, count)


if __name__ == "__main__":
    unittest.main()
