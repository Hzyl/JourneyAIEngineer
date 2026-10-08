"""Bernoulli sampling and a synthetic classifier's conditional probabilities."""
import numpy as np


def simulate(size: int, probability=0.2, seed=42) -> dict:
    if type(size) is not int or size < 1:
        raise ValueError("Expected a positive integer sample size")
    if not np.isfinite(probability) or not 0 <= probability <= 1:
        raise ValueError("Expected a probability between zero and one")
    samples = np.random.default_rng(seed).binomial(1, probability, size=size)
    return {"samples": samples, "mean": samples.mean(), "variance": samples.var(ddof=0)}


def conditional_metrics(labels, predictions) -> dict:
    actual = np.asarray(labels)
    predicted = np.asarray(predictions)
    if (actual.ndim != 1 or actual.size == 0 or actual.shape != predicted.shape
            or not np.isin(actual, [0, 1]).all() or not np.isin(predicted, [0, 1]).all()):
        raise ValueError("Expected equal non-empty binary vectors")
    tp = int(np.sum((actual == 1) & (predicted == 1)))
    positive = int(actual.sum())
    flagged = int(predicted.sum())
    return {
        "prevalence": float(actual.mean()),
        "recall": tp / positive if positive else None,
        "precision": tp / flagged if flagged else None,
        "true_positives": tp,
    }


def main():
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    probability = 0.2
    print("Theoretical E[X]:", probability, "Var(X):", probability * (1 - probability))
    fig, axes = plt.subplots(1, 3, figsize=(10, 3))
    for ax, size in zip(axes, [20, 200, 20000]):
        result = simulate(size, probability)
        print(size, "mean", result["mean"], "population-form sample variance", result["variance"])
        ax.hist(result["samples"], bins=[-0.5, 0.5, 1.5],
                weights=np.ones(size) / size, rwidth=0.7)
        ax.set(title=f"n={size}", xlabel="Bernoulli outcome", ylabel="Observed fraction",
               xticks=[0, 1], ylim=(0, 1))
    fig.tight_layout()
    fig.savefig("histogram.png", dpi=150)
    plt.close(fig)
    labels = [1] * 100 + [0] * 900
    predicted = [1] * 80 + [0] * 20 + [1] * 90 + [0] * 810
    print("Synthetic classifier:", conditional_metrics(labels, predicted))


if __name__ == "__main__":
    main()
