"""A small, dependency-free package for normalized weighted scores."""

from math import isfinite


def weighted_score(items: list[tuple[float, float]]) -> float:
    """Return the weighted mean; scores are 0..100 and weights are >0..1."""
    if not isinstance(items, list) or not items:
        raise ValueError("items must be a non-empty list")
    for item in items:
        if not isinstance(item, tuple) or len(item) != 2:
            raise ValueError("each item must be a (score, weight) tuple")
        score, weight = item
        for value in (score, weight):
            if type(value) not in (int, float):
                raise ValueError("score and weight must be numbers, excluding bool")
        # Bounds reject huge integers before conversion in isfinite.
        if not 0 <= score <= 100 or not 0 < weight <= 1:
            raise ValueError("score must be 0..100 and weight must be >0..1")
        if not isfinite(score) or not isfinite(weight):
            raise ValueError("score and weight must be finite")
    total_weight = sum(weight for _, weight in items)
    return sum(score * (weight / total_weight) for score, weight in items)
