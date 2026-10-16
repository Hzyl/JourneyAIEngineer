"""Execute the published model examples and check their mathematical contracts."""
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path
import subprocess
import sys

import pytest
import yaml

LESSONS = Path(__file__).resolve().parents[1] / 'content' / 'lessons'


def source(number):
    path = LESSONS / f'phase-03-classical-ml-models-{number}.md'
    return yaml.safe_load(path.read_text(encoding='utf-8').split('---', 2)[1])['code_examples'][0]


def load(number):
    namespace = {}
    with redirect_stdout(StringIO()):
        exec(compile(source(number)['code'], f'model_{number}.py', 'exec'), namespace)
    return namespace


@pytest.mark.parametrize('number', [1, 2, 3, 4])
def test_example_runs_standalone_and_matches_documented_output(number, tmp_path):
    example = source(number)
    script = tmp_path / 'model.py'
    script.write_text(example['code'], encoding='utf-8')
    result = subprocess.run([sys.executable, '-X', 'utf8', str(script)], cwd=tmp_path,
                            capture_output=True, text=True, encoding='utf-8', timeout=10)
    assert result.returncode == 0, result.stderr
    assert result.stdout.strip() == example['expected_output'].strip()


def test_linear_fit_recovers_coefficients_and_beats_training_mean_on_held_out_data():
    example = load(1)
    train_x = [3, 0, 2, 1]
    train_y = [7, 1, 5, 3]
    slope, intercept = example['fit_line'](train_x, train_y)
    assert (slope, intercept) == pytest.approx((2, 1))
    validation_x = [0.5, 2.5]
    validation_y = [2, 6]
    predictions = [slope * value + intercept for value in validation_x]
    baseline = [sum(train_y) / len(train_y)] * len(validation_y)
    assert example['mse'](validation_y, predictions) == pytest.approx(0)
    assert example['mse'](validation_y, baseline) > example['mse'](validation_y, predictions)
    assert train_x == [3, 0, 2, 1]
    assert train_y == [7, 1, 5, 3]


@pytest.mark.parametrize('number', [1, 3, 4])
@pytest.mark.parametrize('xs,ys', [([], []), ([1, 2], [0]), ([1, 1], [0, 1])])
def test_fitting_rejects_unusable_or_unaligned_data(number, xs, ys):
    fit = load(number)['fit_line' if number == 1 else 'fit_stump']
    with pytest.raises(ValueError):
        fit(xs, ys)


def test_logistic_scores_and_threshold_metrics_match_hand_counted_confusion_matrices():
    example = load(2)
    assert example['sigmoid'](0) == pytest.approx(0.5)
    assert example['sigmoid'](-1000) == pytest.approx(0)
    assert example['sigmoid'](1000) == pytest.approx(1)
    labels = [1, 0, 1, 0]
    probabilities = [0.8, 0.6, 0.4, 0.2]
    high = example['binary_metrics'](labels, example['classify'](probabilities, 0.5))
    low = example['binary_metrics'](labels, example['classify'](probabilities, 0.3))
    assert (high['precision'], high['recall']) == pytest.approx((1 / 2, 1 / 2))
    assert (low['precision'], low['recall']) == pytest.approx((2 / 3, 1))
    assert example['classify']([0.5], 0.5) == [1]


@pytest.mark.parametrize('probabilities,threshold', [([1.1], 0.5), ([-0.1], 0.5), ([0.5], 1.1)])
def test_thresholding_rejects_invalid_probability_ranges(probabilities, threshold):
    with pytest.raises(ValueError):
        load(2)['classify'](probabilities, threshold)


def test_undefined_precision_and_recall_use_the_documented_zero_rule():
    metrics = load(2)['binary_metrics']([0, 0], [0, 0])
    assert metrics['precision'] == 0
    assert metrics['recall'] == 0


@pytest.mark.parametrize('labels,predictions', [([], []), ([1], []), ([2], [1]), ([0], [2])])
def test_binary_metrics_reject_unaligned_or_nonbinary_labels(labels, predictions):
    with pytest.raises(ValueError):
        load(2)['binary_metrics'](labels, predictions)


@pytest.mark.parametrize('number', [1, 3, 4])
@pytest.mark.parametrize('bad_value', [float('nan'), float('inf')])
def test_fit_rejects_nonfinite_features(number, bad_value):
    fit = load(number)['fit_line' if number == 1 else 'fit_stump']
    with pytest.raises(ValueError):
        fit([0, bad_value], [0, 1])


def test_classification_stump_learns_a_split_instead_of_only_counting_labels():
    example = load(3)
    stump = example['fit_stump']([4, 1, 3, 2], [1, 0, 1, 0])
    assert stump['threshold'] == pytest.approx(2.5)
    assert [example['predict_stump'](stump, value) for value in [1, 2, 3, 4]] == [0, 0, 1, 1]


def test_boosting_fits_residuals_and_a_shrunk_update_reduces_squared_error():
    example = load(4)
    xs = [0, 1, 2, 3]
    targets = [0, 0, 4, 4]
    baseline = sum(targets) / len(targets)
    residuals = [target - baseline for target in targets]
    stump = example['fit_stump'](xs, residuals)
    assert stump['threshold'] == pytest.approx(1.5)
    predictions = [baseline + 0.5 * example['predict_stump'](stump, value) for value in xs]
    before = sum((target - baseline) ** 2 for target in targets) / len(targets)
    after = sum((target - prediction) ** 2 for target, prediction in zip(targets, predictions)) / len(targets)
    assert after == pytest.approx(before / 4)
    assert after < before


def test_boosting_zero_residuals_produce_no_update():
    example = load(4)
    stump = example['fit_stump']([3, 1, 2], [0, 0, 0])
    assert [example['predict_stump'](stump, value) for value in [1, 2, 3]] == [0, 0, 0]
