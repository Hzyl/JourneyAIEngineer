"""Compare an analytic derivative, a finite difference and PyTorch autograd."""
import math


def loss(weight: float) -> float:
    return (weight - 3) ** 2


def gradient(weight: float) -> float:
    return 2 * (weight - 3)


def finite_difference(weight: float, epsilon=1e-5) -> float:
    if not math.isfinite(weight) or not math.isfinite(epsilon) or epsilon <= 0:
        raise ValueError("Expected finite weight and positive epsilon")
    return (loss(weight + epsilon) - loss(weight - epsilon)) / (2 * epsilon)


def autograd_gradient(weight: float) -> float:
    import torch
    value = torch.tensor(float(weight), dtype=torch.float64, requires_grad=True)
    objective = (value - 3) ** 2
    derivative, = torch.autograd.grad(objective, value)
    return derivative.item()


def descent(start: float, rate: float, steps=12) -> list[float]:
    if not math.isfinite(start) or not math.isfinite(rate) or rate <= 0:
        raise ValueError("Expected finite start and positive rate")
    if type(steps) is not int or not 0 <= steps <= 1000:
        raise ValueError("Expected 0 to 1000 integer steps")
    values = [float(start)]
    for _ in range(steps):
        updated = values[-1] - rate * gradient(values[-1])
        if not math.isfinite(updated):
            raise ArithmeticError("Non-finite update; inspect the learning rate")
        values.append(updated)
    return values


def main():
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    for weight in [0.0, 3.0, 5.0]:
        print(weight, "analytic", gradient(weight), "finite", finite_difference(weight),
              "autograd", autograd_gradient(weight))
    x = [index / 10 for index in range(-20, 81)]
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(x, [loss(value) for value in x])
    axes[0].set(xlabel="Weight", ylabel="Loss", title="L(w) = (w - 3)^2")
    for rate in [0.1, 0.5, 1.0, 1.1]:
        values = descent(0, rate)
        axes[1].plot(range(len(values)), [loss(value) for value in values], label=f"rate={rate}")
    axes[1].set(xlabel="Step", ylabel="Loss", title="Learning-rate comparison", yscale="symlog")
    axes[1].legend()
    fig.tight_layout()
    fig.savefig("gradient.png", dpi=150)
    plt.close(fig)


if __name__ == "__main__":
    main()
