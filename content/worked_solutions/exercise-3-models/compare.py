"""Compare small classifiers on bounded, independent synthetic observations."""
import argparse
import json
from pathlib import Path
import random
from time import perf_counter

from models import boost_predict, fit_boost, fit_logistic, fit_tree, logistic_predict, majority


def make_partitions(seed=42):
    rng = random.Random(seed)
    partitions = {}
    for name, count in [('train', 240), ('validation', 80), ('test', 80)]:
        rows = []
        for i in range(count):
            signal, distractor = rng.uniform(-1, 1), rng.uniform(-1, 1)
            label = int(-0.35 < signal < 0.4)
            if rng.random() < 0.08:
                label = 1 - label
            rows.append({'id': f'{name}-{i:03}', 'x': [signal, distractor], 'y': label})
        partitions[name] = rows
    return partitions


def metrics(actual, predicted):
    if (not actual or len(actual) != len(predicted)
            or any(type(v) is not int or v not in (0, 1) for v in [*actual, *predicted])):
        raise ValueError('Use aligned nonempty binary labels')
    tn = sum(a == 0 and p == 0 for a, p in zip(actual, predicted))
    fp = sum(a == 0 and p == 1 for a, p in zip(actual, predicted))
    fn = sum(a == 1 and p == 0 for a, p in zip(actual, predicted))
    tp = sum(a == 1 and p == 1 for a, p in zip(actual, predicted))
    recall = tp / (tp + fn) if tp + fn else None
    specificity = tn / (tn + fp) if tn + fp else None
    balanced = (recall + specificity) / 2 if recall is not None and specificity is not None else None
    return {'tn': tn, 'fp': fp, 'fn': fn, 'tp': tp, 'accuracy': (tn + tp) / len(actual),
            'balanced_accuracy': balanced, 'precision': tp / (tp + fp) if tp + fp else None,
            'recall': recall}


def fit_candidates(train):
    x, y = [row['x'] for row in train], [row['y'] for row in train]

    def constant():
        baseline = majority(y)
        return lambda row: baseline, {'constant': baseline}

    def logistic():
        weights = fit_logistic(x, y)
        return lambda row: logistic_predict(weights, row), {'coefficients': len(weights)}

    def tree():
        model = fit_tree(x, y, max_depth=2)
        return model.predict, {'nodes': model.node_count()}

    def boost():
        ensemble = fit_boost(x, y, rounds=20)
        baseline = majority(y)
        return (lambda row: boost_predict(ensemble, row, baseline),
                {'estimators': len(ensemble), 'nodes': sum(t.node_count() for _, t in ensemble)})

    # Order also defines the validation-score tie policy, before scores are seen.
    builders = [('majority', constant),
                ('logistic', logistic), ('tree', tree), ('adaboost', boost)]
    candidates = {}
    for name, build in builders:
        start = perf_counter()
        predict, complexity = build()
        candidates[name] = (predict, complexity, (perf_counter() - start) * 1000)
    return candidates


def evaluate(rows, predict):
    predictions = [predict(row['x']) for row in rows]
    return metrics([row['y'] for row in rows], predictions)


def first_error(rows, predict):
    for row in rows:
        predicted = predict(row['x'])
        if predicted != row['y']:
            return {'id': row['id'], 'features': row['x'], 'actual': row['y'], 'predicted': predicted}
    return None


def prediction_time(rows, predict):
    # Warm up, then average 100 batches; includes Python loop/call overhead.
    for row in rows:
        predict(row['x'])
    start = perf_counter()
    for _ in range(100):
        for row in rows:
            predict(row['x'])
    return (perf_counter() - start) * 1_000_000 / (100 * len(rows))


def compare(partitions=None, include_test=False):
    seed = 42 if partitions is None else None
    partitions = make_partitions() if partitions is None else partitions
    candidates = fit_candidates(partitions['train'])
    results = {}
    for name, (predict, complexity, fit_ms) in candidates.items():
        results[name] = {
            'train': evaluate(partitions['train'], predict),
            'validation': evaluate(partitions['validation'], predict),
            'first_validation_error': first_error(partitions['validation'], predict),
            'complexity': complexity, 'fit_ms': fit_ms,
            'prediction_us_per_row': prediction_time(partitions['validation'], predict),
        }
    if any(result['validation']['balanced_accuracy'] is None for result in results.values()):
        raise ValueError('Validation must contain both classes for balanced-accuracy selection')
    selected = max(results, key=lambda name: results[name]['validation']['balanced_accuracy'])
    report = {
        'seed': seed,
        'features': ['signal', 'distractor'],
        'split_ids': {name: [row['id'] for row in rows] for name, rows in partitions.items()},
        'selection': 'validation balanced accuracy; ties: majority, logistic, tree, adaboost',
        'models': results, 'selected': selected,
        'limitations': 'Synthetic IID rows, 8% random label-flip probability, bounded features; '
                        'not a production benchmark. Timings include Python overhead and vary by machine.',
    }
    if include_test:
        report['test'] = {'model': selected, 'metrics': evaluate(partitions['test'], candidates[selected][0])}
    return report


def save_report(report, path):
    # Exclusive creation protects an earlier experiment artifact from accidental overwrite.
    with Path(path).open('x', encoding='utf-8') as output:
        json.dump(report, output, indent=2, allow_nan=False)
        output.write('\n')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--include-test', action='store_true', help='Reveal only the selected model on test')
    parser.add_argument('--output', type=Path, help='Create a new JSON file; never overwrite an existing file')
    args = parser.parse_args()
    report = compare(include_test=args.include_test)
    if args.output:
        try:
            save_report(report, args.output)
        except FileExistsError:
            parser.error('Output already exists; choose a new filename')
    else:
        print(json.dumps(report, indent=2, allow_nan=False))
