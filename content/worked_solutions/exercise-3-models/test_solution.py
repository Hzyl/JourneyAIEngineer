import math
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from compare import compare, make_partitions, metrics, save_report
from models import boost_predict, fit_boost, fit_logistic, fit_tree, logistic_predict, majority, sigmoid


class ModelTests(unittest.TestCase):
    def test_baseline_tie_and_majority(self):
        self.assertEqual(majority([0, 1]), 0)
        self.assertEqual(majority([0, 1, 1]), 1)

    def test_logistic_gradient_and_linear_boundary(self):
        weights = fit_logistic([[-1], [1]], [0, 1], epochs=1, learning_rate=0.2)
        self.assertAlmostEqual(weights[0], 0)
        self.assertAlmostEqual(weights[1], 0.1)
        self.assertEqual([logistic_predict(weights, row) for row in [[-1], [1]]], [0, 1])
        self.assertEqual(sigmoid(-1000), 0)
        self.assertEqual(sigmoid(1000), 1)

    def test_tree_depth_and_nonlinear_interval(self):
        x = [[-3], [-2], [-1], [0], [1], [2], [3]]
        y = [0, 0, 1, 1, 1, 0, 0]
        tree = fit_tree(x, y, max_depth=2)
        self.assertEqual([tree.predict(row) for row in x], y)
        self.assertLessEqual(tree.node_count(), 7)
        self.assertEqual(fit_tree(x, y, max_depth=0).node_count(), 1)

    def test_weighted_leaf_and_constant_features(self):
        tree = fit_tree([[0], [0], [0]], [0, 0, 1], weights=[0.1, 0.1, 0.8])
        self.assertEqual(tree.predict([0]), 1)
        self.assertEqual(tree.node_count(), 1)

    def test_boost_stops_on_perfect_and_uninformative_stumps(self):
        perfect = fit_boost([[-1], [1]], [0, 1])
        self.assertEqual(len(perfect), 1)
        self.assertTrue(math.isfinite(perfect[0][0]))
        self.assertEqual(boost_predict(perfect, [1], 0), 1)
        empty = fit_boost([[0], [0]], [0, 1])
        self.assertEqual(empty, [])
        self.assertEqual(boost_predict(empty, [0], 0), 0)

    def test_invalid_training_data_is_rejected(self):
        for fit in (fit_logistic, fit_tree, fit_boost):
            for x, y in [([], []), ([[0]], []), ([[float('nan')]], [0]),
                         ([[0], [1, 2]], [0, 1]), ([[1]], [2]), ([[True]], [0])]:
                with self.subTest(fit=fit.__name__, x=x, y=y):
                    with self.assertRaises(ValueError):
                        fit(x, y)


class ExperimentTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.partitions = make_partitions()
        cls.report = compare(cls.partitions, include_test=True)

    def test_partitions_are_reproducible_and_disjoint(self):
        self.assertEqual(self.partitions, make_partitions())
        self.assertEqual([len(rows) for rows in self.partitions.values()], [240, 80, 80])
        ids = [row['id'] for rows in self.partitions.values() for row in rows]
        self.assertEqual(len(ids), len(set(ids)))
        for rows in self.partitions.values():
            self.assertTrue(all(len(row['x']) == 2 and all(-1 <= v <= 1 for v in row['x']) for row in rows))
            self.assertEqual({row['y'] for row in rows}, {0, 1})

    def test_metrics_and_undefined_values(self):
        score = metrics([0, 0, 1, 1], [0, 1, 0, 1])
        self.assertEqual([score[k] for k in ('tn', 'fp', 'fn', 'tp')], [1, 1, 1, 1])
        self.assertEqual(score['balanced_accuracy'], 0.5)
        self.assertIsNone(metrics([0, 1], [0, 0])['precision'])
        self.assertIsNone(metrics([0], [0])['balanced_accuracy'])
        for actual, predicted in [([], []), ([0], [0, 1]), ([0], [True])]:
            with self.assertRaises(ValueError):
                metrics(actual, predicted)

    def test_default_never_evaluates_test_or_passes_holdouts_to_fit(self):
        # Replace test with unusable rows: default reporting may read IDs, never labels/features.
        partitions = {**self.partitions, 'test': [{'id': 'hidden-test'}]}
        candidates = {'constant': (lambda row: 0, {'constant': 0}, 0)}
        with patch('compare.fit_candidates', return_value=candidates) as fit:
            report = compare(partitions)
        fit.assert_called_once_with(partitions['train'])
        self.assertNotIn('test', report)
        self.assertEqual(self.report['test']['model'], self.report['selected'])
        self.assertEqual(set(self.report['test']), {'model', 'metrics'})

    def test_report_selection_errors_and_timing(self):
        results = self.report['models']
        expected = max(results, key=lambda name: results[name]['validation']['balanced_accuracy'])
        self.assertEqual(self.report['selected'], expected)
        # Published seed-42 table: protect the learner-facing numbers from silent drift.
        for name, counts in {'majority': [43, 0, 37, 0], 'logistic': [43, 0, 37, 0],
                             'tree': [40, 3, 1, 36], 'adaboost': [40, 3, 1, 36]}.items():
            self.assertEqual([results[name]['validation'][key] for key in ('tn', 'fp', 'fn', 'tp')], counts)
        lookup = {row['id']: row for row in self.partitions['validation']}
        for result in results.values():
            self.assertGreaterEqual(result['fit_ms'], 0)
            self.assertGreaterEqual(result['prediction_us_per_row'], 0)
            error = result['first_validation_error']
            if error is not None:
                self.assertEqual(error['actual'], lookup[error['id']]['y'])
                self.assertEqual(error['features'], lookup[error['id']]['x'])
                self.assertNotEqual(error['actual'], error['predicted'])

    def test_report_does_not_overwrite_artifact(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'report.json'
            save_report({'selected': 'tree'}, path)
            original = path.read_bytes()
            with self.assertRaises(FileExistsError):
                save_report({'selected': 'other'}, path)
            self.assertEqual(path.read_bytes(), original)


if __name__ == '__main__':
    unittest.main()
