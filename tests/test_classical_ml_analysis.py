"""Independent numeric, adversarial and standalone execution checks for analysis lessons."""
from contextlib import redirect_stdout
from copy import deepcopy
from io import StringIO
from pathlib import Path
import ast
import json
import subprocess
import sys

import pytest
import yaml

LESSONS = Path(__file__).resolve().parents[1] / 'content' / 'lessons'


def lesson(number):
    path = LESSONS / f'phase-03-classical-ml-analysis-{number}.md'
    return yaml.safe_load(path.read_text(encoding='utf-8').split('---', 2)[1])


def load(number):
    namespace = {}
    with redirect_stdout(StringIO()):
        exec(compile(lesson(number)['code_examples'][0]['code'], f'analysis_{number}.py', 'exec'), namespace)
    return namespace


@pytest.mark.parametrize('number', [1, 2, 3, 4])
def test_standalone_stdout_stdlib_and_content_contract(number, tmp_path):
    content = lesson(number)
    example = content['code_examples'][0]
    for node in ast.walk(ast.parse(example['code'])):
        if isinstance(node, ast.Import):
            assert all(alias.name.split('.')[0] in sys.stdlib_module_names for alias in node.names)
        elif isinstance(node, ast.ImportFrom):
            assert node.module.split('.')[0] in sys.stdlib_module_names
    script = tmp_path / 'analysis.py'
    script.write_text(example['code'], encoding='utf-8')
    result = subprocess.run([sys.executable, '-I', str(script)], cwd=tmp_path, capture_output=True,
                            text=True, encoding='utf-8', timeout=10)
    assert result.returncode == 0, result.stderr
    assert result.stdout == example['expected_output'].rstrip('\n') + '\n'
    identity = f'phase-03-classical-ml-analysis-{number}'
    assert content['lesson_id'] == identity
    assert content['phase_id'] == 'phase-03-classical-ml'
    assert content['module_id'] == 'analysis'
    assert content['exercise_ids'] == ['exercise-3-analysis']
    assert [(card['id'], card['type']) for card in content['review_cards']] == [
        (f'{identity}-{kind}', kind) for kind in ['recall', 'application', 'debug', 'interview']]
    assert content['review_item_ids'] == [card['id'] for card in content['review_cards']]
    for language in ['vi', 'en']:
        assert content[f'concept_notes_{language}']
        assert content['practice_plan'][language]['deliverables']
        assert example[f'setup_{language}']
        assert all(card[f'answer_{language}'] for card in content['review_cards'])
    assert example['status'] == 'runnable'


def test_imbalance_counts_boundary_and_undefined_denominators():
    report = load(1)['binary_report']
    measured = report([1, 0, 1, 0, 0], [0.5, 0.8, 0.2, 0.1, 0.7], 0.5)
    assert [measured[key] for key in ['tp', 'fp', 'tn', 'fn']] == [1, 2, 1, 1]
    assert measured['precision'] == pytest.approx(1 / 3)
    assert measured['recall'] == 0.5
    assert measured['prevalence'] == 0.4
    assert report([0], [0.1], 0.5)['precision'] is None
    assert report([0], [0.1], 0.5)['recall'] is None
    assert report([1], [0.1], 0.5)['recall'] == 0


@pytest.mark.parametrize('labels,scores,threshold', [
    ([], [], 0.5), ([1], [], 0.5), ([2], [0.1], 0.5), ([True], [0.1], 0.5),
    ([1], [float('nan')], 0.5), ([1], [float('inf')], 0.5), ([1], [-0.1], 0.5),
    ([1], [1.1], 0.5), ([1], [0.1], float('nan')), ([1], [0.1], -1),
])
def test_imbalance_rejects_invalid_input(labels, scores, threshold):
    with pytest.raises(ValueError):
        load(1)['binary_report'](labels, scores, threshold)


def test_calibration_can_worsen_independent_test_without_changing_labels():
    namespace = load(2)
    rates = namespace['fit_histogram']([0, 0, 0, 1, 0, 1, 1, 1], [0.05] * 4 + [0.95] * 4)
    assert rates == (0.25, 0.75)
    probabilities = [0.05, 0.05, 0.95, 0.95]
    adjusted = namespace['calibrate'](probabilities, rates)
    assert adjusted == [0.25, 0.25, 0.75, 0.75]
    assert [value >= 0.5 for value in adjusted] == [False, False, True, True]
    assert namespace['brier']([0, 1, 0, 1], probabilities) == pytest.approx(0.4525)
    assert namespace['brier']([0, 1, 0, 1], adjusted) == pytest.approx(0.3125)
    assert namespace['brier']([0, 0, 1, 1], probabilities) == pytest.approx(0.0025)
    assert namespace['brier']([0, 0, 1, 1], adjusted) == pytest.approx(0.0625)
    assert rates == (0.25, 0.75)
    assert set(namespace['calibration_ids']).isdisjoint(namespace['test_ids'])
    assert namespace['reliability']([0, 1, 0], [0, 0.5, 1]) == [
        {'support': 1, 'mean': 0, 'rate': 0}, {'support': 2, 'mean': 0.75, 'rate': 0.5}]
    assert namespace['reliability']([0], [0.1])[1] == {'support': 0, 'mean': None, 'rate': None}
    with pytest.raises(ValueError, match='both calibration bins'):
        namespace['fit_histogram']([0], [0.1])


@pytest.mark.parametrize('labels,probabilities', [([], []), ([0], []), ([2], [0.5]),
    ([0], [float('nan')]), ([0], [float('inf')]), ([0], [-1]), ([0], [1.1])])
def test_calibration_rejects_invalid_pairs(labels, probabilities):
    with pytest.raises(ValueError):
        load(2)['brier'](labels, probabilities)


def test_error_slices_denominators_and_single_error_sensitivity():
    namespace = load(3)
    overall, groups = namespace['slice_reports']([1, 1, 0, 0, 0], [0, 1, 1, 0, 0], ['a'] * 3 + ['b'] * 2)
    assert groups['a']['support'] == 3
    assert groups['a']['positives'] == 2
    assert groups['a']['recall'] == groups['a']['precision'] == 0.5
    assert groups['a']['error_rate'] == pytest.approx(2 / 3)
    assert groups['b']['recall'] is None
    assert overall['error_rate'] == 0.4
    assert namespace['group_report']([1, 1, 0], [1, 1, 1])['recall'] == 1
    assert namespace['error_log'] == [('case-3', 'desktop', 'FP'), ('case-5', 'mobile', 'FN'),
                                      ('case-6', 'mobile', 'FN'), ('case-7', 'mobile', 'FP')]


@pytest.mark.parametrize('labels,predictions,groups', [
    ([], [], []), ([1], [0], []), ([2], [0], ['a']), ([1], [2], ['a']),
    ([1], [0], ['']), ([1], [0], [' ']), ([1], [0], [None]),
])
def test_error_slices_reject_invalid_data(labels, predictions, groups):
    with pytest.raises(ValueError):
        load(3)['slice_reports'](labels, predictions, groups)


def test_serialization_preserves_preprocessing_and_named_order():
    namespace = load(4)
    model = namespace['load_model'](namespace['serialized'])
    assert namespace['predict'](model, [{'age': 10, 'size': 50}]) == [100]
    assert namespace['predict'](model, [{'age': 20, 'size': 70}]) == [102]
    assert namespace['predict'](model, [{'size': 71, 'age': 20}]) == pytest.approx([102.2])
    assert model['preprocess'] == {'mean': [50, 10], 'scale': [10, 5]}


@pytest.mark.parametrize('field,value', [('version', 2), ('version', True), ('features', ['age', 'size']),
    ('coefficients', [2]), ('coefficients', [float('inf'), 1]), ('intercept', float('nan')),
    ('preprocess', {'mean': [50, 10], 'scale': [0, 5]}), ('schema', 'unknown')])
def test_serialization_rejects_broken_contract(field, value):
    namespace = load(4)
    model = deepcopy(namespace['model'])
    model[field] = value
    with pytest.raises(ValueError):
        namespace['load_model'](json.dumps(model))


def test_serialization_rejects_duplicate_extra_missing_and_nonfinite_values():
    namespace = load(4)
    for serialized in ['{"version":1,"version":2}', 'null', '{"intercept":NaN}',
                       json.dumps({**namespace['model'], 'extra': 1})]:
        with pytest.raises(ValueError):
            namespace['load_model'](serialized)
    for rows in [[], [{'size': 60}], [{'size': 60, 'age': float('nan')}],
                 [{'size': 60, 'age': 15, 'extra': 1}], [{'size': True, 'age': 15}]]:
        with pytest.raises(ValueError):
            namespace['predict'](namespace['model'], rows)
