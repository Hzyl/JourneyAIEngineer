"""Verify the lesson examples using independent numerical and data-split checks."""
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path
import subprocess
import sys

import pytest
import yaml

LESSONS = Path(__file__).resolve().parents[1] / 'content' / 'lessons'


def example(number):
    path = LESSONS / f'phase-03-classical-ml-evaluation-{number}.md'
    return yaml.safe_load(path.read_text(encoding='utf-8').split('---', 2)[1])['code_examples'][0]


def load(number):
    namespace = {}
    with redirect_stdout(StringIO()):
        exec(compile(example(number)['code'], f'evaluation_{number}.py', 'exec'), namespace)
    return namespace


@pytest.mark.parametrize('number', [1, 2, 3, 4])
def test_standalone_example_matches_published_output(number, tmp_path):
    source = example(number)
    script = tmp_path / 'evaluation.py'
    script.write_text(source['code'], encoding='utf-8')
    result = subprocess.run([sys.executable, '-X', 'utf8', str(script)], cwd=tmp_path,
                            capture_output=True, text=True, encoding='utf-8', timeout=10)
    assert result.returncode == 0, result.stderr
    assert result.stdout.strip() == source['expected_output'].strip()


def test_classification_matches_hand_counted_confusion_matrix():
    metrics = load(1)['binary_metrics']([1, 1, 1, 0, 0, 0], [1, 1, 0, 1, 0, 0])
    assert metrics['counts'] == (2, 1, 2, 1)
    assert [metrics[key] for key in ['accuracy', 'precision', 'recall', 'f1']] == pytest.approx([2 / 3] * 4)


def test_accuracy_can_hide_complete_failure_on_the_minority_class():
    measure = load(1)['binary_metrics']
    labels = [0] * 99 + [1]
    baseline = measure(labels, [0] * 100)
    assert baseline['accuracy'] == pytest.approx(0.99)
    assert baseline['precision'] == baseline['recall'] == baseline['f1'] == 0
    assert measure([0, 0], [0, 0])['f1'] == 0


@pytest.mark.parametrize('truth,guess', [([], []), ([1], []), ([2], [1]), ([0], [float('nan')])])
def test_binary_metric_rejects_invalid_labels(truth, guess):
    with pytest.raises(ValueError):
        load(1)['binary_metrics'](truth, guess)


def test_equal_absolute_error_can_have_different_squared_error():
    measure = load(2)['regression_metrics']
    uniform = measure([10] * 4, [8] * 4)
    outlier = measure([10] * 4, [10, 10, 10, 2])
    assert uniform == pytest.approx({'mae': 2, 'mse': 4, 'rmse': 2})
    assert outlier == pytest.approx({'mae': 2, 'mse': 16, 'rmse': 4})
    assert measure([-3, 0, 2], [-3, 0, 2]) == {'mae': 0, 'mse': 0, 'rmse': 0}


@pytest.mark.parametrize('truth,guess', [
    ([], []), ([1], []), ([float('nan')], [0]), ([0], [float('inf')]),
])
def test_regression_metric_rejects_unusable_pairs(truth, guess):
    with pytest.raises(ValueError):
        load(2)['regression_metrics'](truth, guess)


def test_each_cross_validation_fold_fits_only_its_training_targets():
    validate = load(3)['cross_validate_mean']
    folds = [[0, 1], [2, 3], [4, 5]]
    targets = [2, 4, 6, 8, 10, 12]
    results = validate(targets, folds)
    assert [row['training_mean'] for row in results] == pytest.approx([9, 7, 5])
    assert [row['mae'] for row in results] == pytest.approx([6, 1, 6])
    for row in results:
        assert set(row['train']).isdisjoint(row['valid'])
        assert sorted(row['train'] + row['valid']) == list(range(6))
    changed_validation = validate([200, 400, *targets[2:]], folds)
    assert changed_validation[0]['training_mean'] == results[0]['training_mean']
    assert changed_validation[0]['mae'] != results[0]['mae']
    assert targets == [2, 4, 6, 8, 10, 12]


@pytest.mark.parametrize('folds', [
    [[0, 1, 2, 3]], [[], [0, 1, 2, 3]], [[0, 1], [1, 2, 3]],
    [[0], [1, 2]], [[-1, 0], [1, 2, 3]], [[0, 1], [2, True]],
])
def test_cross_validation_requires_a_disjoint_complete_partition(folds):
    with pytest.raises(ValueError):
        load(3)['cross_validate_mean']([2, 4, 6, 8], folds)


def test_knn_selection_uses_development_data_and_declared_tie_breaks():
    lesson = load(4)
    for key in ['test_rows', 'test_targets', 'test_predictions']:
        lesson.pop(key, None)
    training = [(0, 0), (1, 1), (2, 6), (3, 3), (4, 4), (5, 5)]
    validation = [(1.9, 2), (3.9, 4)]
    selected, scores = lesson['select_neighbors'](training, validation, [1, 3, 5])
    assert selected == 5
    assert [score for _, score in scores] == pytest.approx([2, 2 / 3, 0.5])
    final = lesson['fit_knn'](training + validation, selected)
    predicted = lesson['predict_knn'](final, [0.5, 4.5])
    assert predicted == pytest.approx([2.4, 4.4])
    assert lesson['mean_absolute_error']([0.5, 4.5], predicted) == pytest.approx(1)
    tied = lesson['select_neighbors']([(0, 2), (1, 2), (2, 2)], [(3, 2)], [3, 1])
    assert tied[0] == 1
    model = lesson['fit_knn']([(0, 10), (2, 20)], 1)
    assert lesson['predict_knn'](model, [1]) == [10]


@pytest.mark.parametrize('neighbors', [0, -1, 3, 1.5, True])
def test_knn_rejects_invalid_neighbor_counts(neighbors):
    with pytest.raises(ValueError):
        load(4)['fit_knn']([(0, 0), (1, 1)], neighbors)


@pytest.mark.parametrize('bad_value', [float('nan'), float('inf')])
def test_knn_rejects_nonfinite_inputs(bad_value):
    lesson = load(4)
    with pytest.raises(ValueError):
        lesson['fit_knn']([(0, 0), (1, bad_value)], 1)
    with pytest.raises(ValueError):
        lesson['predict_knn'](lesson['fit_knn']([(0, 0)], 1), [bad_value])
