"""Run authored preprocessing examples and independently check their data boundaries."""
from contextlib import redirect_stdout
from io import StringIO
import math
from pathlib import Path
import subprocess
import sys

import pytest
import yaml


LESSONS = Path(__file__).resolve().parents[1] / "content" / "lessons"


def example(number):
    path = LESSONS / f"phase-03-classical-ml-preprocessing-{number}.md"
    return yaml.safe_load(path.read_text(encoding="utf-8").split("---", 2)[1])["code_examples"][0]


def load(number):
    namespace = {}
    with redirect_stdout(StringIO()):
        exec(compile(example(number)["code"], f"preprocessing_{number}.py", "exec"), namespace)
    return namespace


@pytest.mark.parametrize("number", [1, 2, 3, 4])
def test_example_runs_standalone_and_matches_documented_output(number, tmp_path):
    source = example(number)
    script = tmp_path / "preprocessing.py"
    script.write_text(source["code"], encoding="utf-8")
    result = subprocess.run([sys.executable, "-X", "utf8", str(script)], cwd=tmp_path,
                            capture_output=True, text=True, encoding="utf-8", timeout=10)
    assert result.returncode == 0, result.stderr
    assert result.stdout.strip() == source["expected_output"].strip()


def test_missing_values_keep_train_median_and_distinguish_real_zero():
    functions = load(1)
    training = [10, None, 20, 100]
    fill = functions["fit_median"](training)
    assert fill == 20.0
    assert functions["transform_missing"]([None, 0, 200], fill) == [
        (20.0, 1), (0.0, 0), (200.0, 0),
    ]
    assert functions["transform_missing"]([None, -1000, 1000], fill)[0] == (20.0, 1)
    assert fill == 20.0
    assert training == [10, None, 20, 100]
    assert functions["fit_median"]([None, 0, 4]) == 2.0


@pytest.mark.parametrize("values", [[], [None], [True], [float("nan")], [float("inf")], ["7"]])
def test_missing_value_fit_rejects_unusable_training_data(values):
    with pytest.raises(ValueError):
        load(1)["fit_median"](values)


def test_categorical_vocabulary_is_frozen_and_flags_are_disjoint():
    functions = load(2)
    vocabulary = functions["fit_categories"](["red", "blue", None, "red"])
    assert vocabulary == ("blue", "red")
    assert functions["transform_categories"](["red", "green", None], vocabulary) == [
        [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0],
    ]
    assert functions["transform_categories"](["blue", "new"], vocabulary) == [
        [1, 0, 0, 0], [0, 0, 0, 1],
    ]
    assert vocabulary == ("blue", "red")
    literal_marker = functions["fit_categories"](["__UNKNOWN__"])
    assert functions["transform_categories"](["__UNKNOWN__", None, "new"], literal_marker) == [
        [1, 0, 0], [0, 1, 0], [0, 0, 1],
    ]
    assert functions["transform_categories"]([None, "new"], functions["fit_categories"]([None])) == [
        [1, 0], [0, 1],
    ]


def test_categorical_inputs_reject_invalid_types_and_ambiguous_vocabulary():
    functions = load(2)
    for values in ([], [5], [False]):
        with pytest.raises(ValueError):
            functions["fit_categories"](values)
    for vocabulary in (("red", "red"), (None,)):
        with pytest.raises(ValueError):
            functions["transform_categories"](["red"], vocabulary)


def test_scaler_uses_population_variance_from_train_only():
    functions = load(3)
    training = [2, 4, 6]
    state = functions["fit_scaler"](training)
    assert state == pytest.approx((4.0, math.sqrt(8.0 / 3.0)))
    scaled = functions["transform_scaled"](training, state)
    assert sum(scaled) / len(scaled) == pytest.approx(0.0)
    assert sum(value * value for value in scaled) / len(scaled) == pytest.approx(1.0)
    assert functions["transform_scaled"]([4, 100], state) == pytest.approx([
        0.0, 96.0 / math.sqrt(8.0 / 3.0),
    ])
    assert state == pytest.approx((4.0, math.sqrt(8.0 / 3.0)))
    assert training == [2, 4, 6]


def test_constant_column_and_log_counts_have_finite_explicit_behavior():
    functions = load(3)
    state = functions["fit_scaler"]([7, 7])
    assert state == (7.0, 1.0)
    assert functions["transform_scaled"]([7, 9], state) == [0.0, 2.0]
    assert functions["log_counts"]([0, 3, 8]) == pytest.approx([0, math.log(4), math.log(9)])
    with pytest.raises(ValueError):
        functions["log_counts"]([-1])
    for invalid_state in ((0, 0), (0, -1), (0, float("nan")), (0,)):
        with pytest.raises(ValueError):
            functions["transform_scaled"]([1], invalid_state)


@pytest.mark.parametrize("values", [[], [None], [True], [float("nan")], [float("inf")], ["2"]])
def test_scaler_rejects_empty_or_invalid_training_data(values):
    with pytest.raises(ValueError):
        load(3)["fit_scaler"](values)


def event(customer="A", day=1, available=1, amount=10):
    return {
        "customer_id": customer, "event_day": day,
        "available_day": available, "amount": amount,
    }


def test_features_use_event_window_and_actual_availability_before_prediction():
    purchase_features = load(4)["purchase_features"]
    events = [
        event(day=0, available=0, amount=5),
        event(day=-1, available=1, amount=100),
        event(day=29, available=29, amount=20),
        event(day=29, available=30, amount=1000),
        event(day=30, available=30, amount=2000),
        event(customer="B", day=10, available=10, amount=3000),
    ]
    assert purchase_features(events, "A", 30) == {
        "purchase_count": 2, "total_spend": 25.0, "mean_purchase": 12.5, "no_history": 0,
    }
    assert purchase_features(events, "A", 30, window_days=7) == {
        "purchase_count": 1, "total_spend": 20.0, "mean_purchase": 20.0, "no_history": 0,
    }
    assert purchase_features(events, "A", 31) == {
        "purchase_count": 3, "total_spend": 3020.0,
        "mean_purchase": 3020.0 / 3, "no_history": 0,
    }


def test_zero_spend_is_distinct_from_missing_history():
    purchase_features = load(4)["purchase_features"]
    events = [event(amount=0)]
    assert purchase_features(events, "A", 2) == {
        "purchase_count": 1, "total_spend": 0.0, "mean_purchase": 0.0, "no_history": 0,
    }
    assert purchase_features(events, "NEW", 2) == {
        "purchase_count": 0, "total_spend": 0.0, "mean_purchase": 0.0, "no_history": 1,
    }


@pytest.mark.parametrize("invalid_event", [
    event(day=True), event(available=False), event(day=3, available=2),
    event(amount=-1), event(amount=float("nan")), event(amount=float("inf")), event(amount=True),
])
def test_features_reject_invalid_source_events(invalid_event):
    with pytest.raises(ValueError):
        load(4)["purchase_features"]([invalid_event], "A", 30)


@pytest.mark.parametrize("cutoff,window", [(True, 30), (30.5, 30), (30, 0), (30, -1), (30, True)])
def test_features_reject_invalid_time_window(cutoff, window):
    with pytest.raises(ValueError):
        load(4)["purchase_features"]([], "A", cutoff, window)
