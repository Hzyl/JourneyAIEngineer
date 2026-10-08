"""Inspect matrix shapes and the information lost by a PCA projection."""
import numpy as np


def matrix(values) -> np.ndarray:
    result = np.asarray(values, dtype=float)
    if result.ndim != 2 or min(result.shape) == 0 or not np.isfinite(result).all():
        raise ValueError("Expected a non-empty finite matrix")
    return result


def affine(features, weights, bias=0.0) -> np.ndarray:
    x = matrix(features)
    w = np.asarray(weights, dtype=float)
    if w.shape != (x.shape[1],) or not np.isfinite(w).all() or not np.isfinite(bias):
        raise ValueError("Expected one finite weight per feature and a finite scalar bias")
    return x @ w + bias


def project_pca(features, components=1) -> dict:
    x = matrix(features)
    if x.shape[0] < 2:
        raise ValueError("PCA needs at least two samples")
    if type(components) is not int or not 1 <= components <= min(x.shape):
        raise ValueError("Invalid number of components")
    mean = x.mean(axis=0)
    centered = x - mean
    _, singular_values, directions = np.linalg.svd(centered, full_matrices=False)
    variance = singular_values ** 2 / (x.shape[0] - 1)
    total = variance.sum()
    if total == 0:
        raise ValueError("Constant data has no variance to explain")
    axes = directions[:components]
    scores = centered @ axes.T
    reconstructed = scores @ axes + mean
    return {
        "mean": mean, "axes": axes, "scores": scores, "reconstructed": reconstructed,
        "explained_ratio": variance[:components].sum() / total,
        "squared_error": np.sum((x - reconstructed) ** 2),
    }


def main():
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    x = np.array([[-2, -1], [-2, 1], [2, -1], [2, 1]], dtype=float)
    w = np.array([2, -1], dtype=float)
    prediction = affine(x, w, bias=1)
    result = project_pca(x)
    print("X", x.shape, "w", w.shape, "prediction", prediction.shape, prediction)
    for key in ["mean", "axes", "scores", "reconstructed"]:
        print(key, result[key].shape, result[key])
    print("Explained ratio:", result["explained_ratio"])
    print("Squared reconstruction error:", result["squared_error"])
    fig, ax = plt.subplots()
    restored = result["reconstructed"]
    ax.scatter(x[:, 0], x[:, 1], label="Original")
    ax.scatter(restored[:, 0], restored[:, 1], marker="x", label="One-component reconstruction")
    for original, projected in zip(x, restored):
        ax.plot([original[0], projected[0]], [original[1], projected[1]], color="gray", alpha=0.5)
    ax.set(xlabel="Feature 1", ylabel="Feature 2", title="PCA discards the vertical variation")
    ax.set_aspect("equal")
    ax.legend()
    fig.tight_layout()
    fig.savefig("pca.png", dpi=150)
    plt.close(fig)


if __name__ == "__main__":
    main()
