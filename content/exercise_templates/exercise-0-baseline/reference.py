import math


def summarize_scores(scores):
    values = []
    for score in scores:
        if score is None:
            continue
        if isinstance(score, bool) or not isinstance(score, (int, float)):
            raise ValueError("Scores must be numbers or None")
        if not math.isfinite(score) or not 0 <= score <= 100:
            raise ValueError("Scores must be finite and between 0 and 100")
        values.append(score)
    total = sum(values)
    return {"count": len(values), "total": total, "mean": total / len(values) if values else None}
