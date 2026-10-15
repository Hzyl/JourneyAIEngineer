"""Execute the outcome lesson and challenge independent evidence, not claims."""
from copy import deepcopy
import json
from pathlib import Path
import re
import subprocess
import sys

import pytest
import yaml

LESSON = Path(__file__).resolve().parents[1] / 'content/lessons/phase-17-genai-evaluation-genai-evaluation-3.md'


@pytest.fixture
def lesson():
    return yaml.safe_load(LESSON.read_text(encoding='utf-8').split('---', 2)[1])


@pytest.fixture
def example(lesson, capsys):
    namespace = {}
    exec(compile(lesson['code_examples'][1]['code'], 'agent_outcome.py', 'exec'), namespace)
    capsys.readouterr()
    return namespace


def test_second_example_runs_as_a_standalone_file(lesson, tmp_path):
    example = lesson['code_examples'][1]
    script = tmp_path / 'agent_outcome.py'
    script.write_text(example['code'], encoding='utf-8')
    result = subprocess.run([sys.executable, '-X', 'utf8', str(script)], cwd=tmp_path,
                            capture_output=True, text=True, encoding='utf-8', timeout=20)
    assert result.returncode == 0, result.stderr
    assert result.stdout.strip() == example['expected_output']
    actual = json.loads(result.stdout)
    assert actual == {
        'false_success': 'fail:outcome', 'alternative_order': 'pass',
        'wrong_report': 'fail:outcome', 'missing_field': 'fail:outcome',
        'unauthorized': 'fail:permission', 'too_many_calls': 'fail:budget',
        'too_slow': 'fail:budget', 'ambiguous_task': 'task_definition_error',
    }


@pytest.mark.parametrize('report', [None, {}, {'document_id': 'guide'},
                                  {'document_id': 'other', 'item_count': 3},
                                  {'document_id': 'guide', 'item_count': 4},
                                  {'document_id': 'guide', 'item_count': '3'}])
def test_success_flags_cannot_rescue_wrong_or_missing_observed_report(example, report):
    observed = {**example['good'], 'report': report}
    solver = {'claimed_success': True, 'correct': True, 'trace': ['search', 'read_document'],
              'report': example['good']['report']}
    assert example['grade'](example['task'], solver, observed) == 'fail:outcome'


@pytest.mark.parametrize('tools', [['search', 'read_document'], ['read_document', 'search'],
                                 ['read_document'], ['search'] * 5])
def test_valid_outcome_does_not_require_claim_or_reference_path(example, tools):
    observed = {**example['good'], 'tools': tools, 'seconds': 2}
    assert example['grade'](example['task'], {'claimed_success': False}, observed) == 'pass'


@pytest.mark.parametrize('change,expected', [
    ({'tools': ['search', 'write', 'read_document']}, 'fail:permission'),
    ({'tools': ['delete']}, 'fail:permission'),
    ({'tools': ['search'] * 6}, 'fail:budget'),
    ({'seconds': 2.001}, 'fail:budget'),
    ({'seconds': -1}, 'fail:budget'),
    ({'seconds': float('nan')}, 'fail:budget'),
])
def test_harness_constraints_override_safe_solver_claims(example, change, expected):
    solver = {'claimed_success': True, 'trace': ['search'], 'seconds': 0}
    assert example['grade'](example['task'], solver, {**example['good'], **change}) == expected


@pytest.mark.parametrize('task', [{}, {'prompt': 'Make a useful report'},
                                 {'prompt': 'Useful report', 'expected_report': {}},
                                 {'prompt': 'Useful report', 'expected_report': 'good'},
                                 {'prompt': ' ', 'expected_report': {'item_count': 3}}])
def test_undefined_acceptance_criteria_are_task_errors_even_with_good_evidence(example, task):
    with pytest.raises(example['TaskDefinitionError']):
        example['grade'](task, example['solver'], example['good'])


def test_task_criteria_drive_grading_without_changing_inputs(example):
    task = deepcopy(example['task'])
    task['expected_report']['item_count'] = 4
    observed = deepcopy(example['good'])
    before = deepcopy((task, example['solver'], observed))
    assert example['grade'](task, example['solver'], observed) == 'fail:outcome'
    observed['report']['item_count'] = 4
    observed['report']['note'] = 'Extra fields are allowed by this contract.'
    assert example['grade'](task, example['solver'], observed) == 'pass'
    assert task == before[0]
    assert example['solver'] == before[1]
    assert example['good'] == before[2]


def test_documented_self_check_has_the_promised_solution(lesson, tmp_path):
    body = LESSON.read_text(encoding='utf-8').split('---', 2)[2]
    mutation = re.search(r'```python\n(.*?)```', body, re.S).group(1)
    solution = re.search(r'```text\n(.*?)```', body, re.S).group(1).strip()
    result = subprocess.run([sys.executable, '-X', 'utf8', '-c',
                             lesson['code_examples'][1]['code'] + '\n' + mutation],
                            cwd=tmp_path, capture_output=True, text=True,
                            encoding='utf-8', timeout=20)
    assert result.returncode == 0, result.stderr
    assert '\n'.join(result.stdout.strip().splitlines()[1:]) == solution


def test_required_null_field_must_be_present(example):
    task = {'prompt': 'Return status, including null when unknown.',
            'expected_report': {'status': None}}
    observed = {**example['good'], 'report': {}}
    assert example['grade'](task, example['solver'], observed) == 'fail:outcome'
    observed['report'] = {'status': None}
    assert example['grade'](task, example['solver'], observed) == 'pass'
