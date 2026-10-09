"""Small teaching implementations, not replacements for production ML libraries."""
from dataclasses import dataclass
import math


def validate_training(x, y):
    if not x or len(x) != len(y) or not x[0]:
        raise ValueError('Use nonempty, aligned features and labels')
    width = len(x[0])
    if any(len(row) != width for row in x):
        raise ValueError('Feature widths must agree')
    if any(isinstance(v, bool) or not isinstance(v, (int, float)) or not math.isfinite(v)
           for row in x for v in row):
        raise ValueError('Features must be finite numbers')
    if any(type(label) is not int or label not in (0, 1) for label in y):
        raise ValueError('Labels must be integer 0 or 1')


def majority(y):
    # Predeclared tie rule: choose class zero.
    return int(sum(y) > len(y) / 2)


def sigmoid(value):
    if value >= 0:
        return 1 / (1 + math.exp(-value))
    exp_value = math.exp(value)
    return exp_value / (1 + exp_value)


def fit_logistic(x, y, epochs=500, learning_rate=0.3):
    """Full-batch gradient descent on binary cross entropy, without regularization."""
    validate_training(x, y)
    if type(epochs) is not int or epochs < 1 or not 0 < learning_rate <= 1:
        raise ValueError('Use positive epochs and a learning rate in (0, 1]')
    weights = [0.0] * (len(x[0]) + 1)
    for _ in range(epochs):
        gradient = [0.0] * len(weights)
        for row, label in zip(x, y):
            features = [1.0, *row]
            error = sigmoid(sum(w * value for w, value in zip(weights, features))) - label
            for j, value in enumerate(features):
                gradient[j] += error * value
        weights = [w - learning_rate * g / len(y) for w, g in zip(weights, gradient)]
    return weights


def logistic_predict(weights, row):
    score = sum(w * value for w, value in zip(weights, [1.0, *row]))
    return int(sigmoid(score) >= 0.5)


@dataclass(frozen=True)
class Node:
    prediction: int
    feature: int | None = None
    threshold: float = 0.0
    left: 'Node | None' = None
    right: 'Node | None' = None

    def predict(self, row):
        node = self
        while node.feature is not None:
            node = node.left if row[node.feature] <= node.threshold else node.right
        return node.prediction

    def node_count(self):
        return 1 if self.feature is None else 1 + self.left.node_count() + self.right.node_count()


def fit_tree(x, y, max_depth=2, weights=None):
    """Greedy axis-aligned binary tree with weighted Gini impurity."""
    validate_training(x, y)
    if type(max_depth) is not int or max_depth < 0:
        raise ValueError('Depth must be a nonnegative integer')
    weights = [1 / len(y)] * len(y) if weights is None else list(weights)
    if (len(weights) != len(y) or any(not math.isfinite(w) or w < 0 for w in weights)
            or sum(weights) <= 0):
        raise ValueError('Weights must be finite, nonnegative and have a positive total')

    def totals(indices):
        return [sum(weights[i] for i in indices if y[i] == label) for label in (0, 1)]

    def impurity(indices):
        zero, one = totals(indices)
        total = zero + one
        return 0.0 if total == 0 else total - (zero * zero + one * one) / total

    def grow(indices, depth):
        zero, one = totals(indices)
        leaf = Node(int(one > zero))
        if depth == 0 or min(zero, one) == 0:
            return leaf
        best = None
        best_score = impurity(indices)
        for feature in range(len(x[0])):
            values = sorted({x[i][feature] for i in indices})
            for low, high in zip(values, values[1:]):
                threshold = low / 2 + high / 2
                left = [i for i in indices if x[i][feature] <= threshold]
                right = [i for i in indices if x[i][feature] > threshold]
                if not left or not right:
                    continue
                score = impurity(left) + impurity(right)
                if score < best_score - 1e-12:
                    best_score = score
                    best = feature, threshold, left, right
        if best is None:
            return leaf
        feature, threshold, left, right = best
        return Node(leaf.prediction, feature, threshold, grow(left, depth - 1), grow(right, depth - 1))

    return grow(list(range(len(y))), max_depth)


def fit_boost(x, y, rounds=20):
    """Binary AdaBoost with depth-one trees and signed-label exponential updates."""
    validate_training(x, y)
    if type(rounds) is not int or rounds < 1:
        raise ValueError('Rounds must be a positive integer')
    weights = [1 / len(y)] * len(y)
    signed = [2 * label - 1 for label in y]
    ensemble = []
    for _ in range(rounds):
        stump = fit_tree(x, y, max_depth=1, weights=weights)
        predictions = [2 * stump.predict(row) - 1 for row in x]
        error = sum(w for w, actual, predicted in zip(weights, signed, predictions) if actual != predicted)
        if error >= 0.5 - 1e-12:
            break
        bounded = max(error, 1e-15)
        alpha = 0.5 * math.log((1 - bounded) / bounded)
        ensemble.append((alpha, stump))
        if error <= 1e-15:
            break
        weights = [w * math.exp(-alpha * actual * predicted)
                   for w, actual, predicted in zip(weights, signed, predictions)]
        total = sum(weights)
        weights = [w / total for w in weights]
    return ensemble


def boost_predict(ensemble, row, fallback):
    if not ensemble:
        return fallback
    margin = sum(alpha * (2 * tree.predict(row) - 1) for alpha, tree in ensemble)
    return int(margin > 0)
