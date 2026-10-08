"""Linear regression with sample-wise SGD, momentum and Adam."""
import numpy as np


def regression_data(seed=19):
    rng = np.random.default_rng(seed)
    x = rng.uniform(-1, 1, 160)
    y = 2 * x + 1 + rng.normal(0, 0.1, x.size)
    return x[:120], y[:120], x[120:], y[120:]


def mse(x, y, parameters) -> float:
    return float(np.mean((parameters[0] * x + parameters[1] - y) ** 2))


def fit(x, y, valid_x, valid_y, method="sgd", rate=0.03, epochs=40, seed=7):
    arrays = [np.asarray(values, dtype=float) for values in [x, y, valid_x, valid_y]]
    if any(values.ndim != 1 or not values.size or not np.isfinite(values).all() for values in arrays):
        raise ValueError("Expected non-empty finite vectors")
    x, y, valid_x, valid_y = arrays
    if x.shape != y.shape or valid_x.shape != valid_y.shape:
        raise ValueError("Feature and target shapes must match")
    if method not in {"sgd", "momentum", "adam"} or not np.isfinite(rate) or rate <= 0:
        raise ValueError("Invalid method or learning rate")
    if type(epochs) is not int or not 1 <= epochs <= 1000:
        raise ValueError("Expected 1 to 1000 epochs")
    parameters = np.zeros(2)
    first = np.zeros(2)
    second = np.zeros(2)
    rng = np.random.default_rng(seed)
    history = [(mse(x, y, parameters), mse(valid_x, valid_y, parameters))]
    step = 0
    for _ in range(epochs):
        for index in rng.permutation(x.size):
            step += 1
            residual = parameters[0] * x[index] + parameters[1] - y[index]
            gradient = 2 * residual * np.array([x[index], 1])
            if method == "sgd":
                update = gradient
            elif method == "momentum":
                first = 0.9 * first + gradient
                update = first
            else:
                first = 0.9 * first + 0.1 * gradient
                second = 0.999 * second + 0.001 * gradient ** 2
                corrected_first = first / (1 - 0.9 ** step)
                corrected_second = second / (1 - 0.999 ** step)
                update = corrected_first / (np.sqrt(corrected_second) + 1e-8)
            parameters -= rate * update
            # Fail explicitly instead of drawing a misleading truncated loss curve.
            if not np.isfinite(parameters).all() or np.max(np.abs(parameters)) > 1e6:
                raise ArithmeticError("Exploding update: try a smaller learning rate")
        history.append((mse(x, y, parameters), mse(valid_x, valid_y, parameters)))
    return parameters, np.asarray(history)


def main():
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    data = regression_data()
    fig, ax = plt.subplots(figsize=(8, 5))
    for method, rate in [("sgd", 0.03), ("momentum", 0.003), ("adam", 0.003), ("sgd", 0.00001)]:
        parameters, history = fit(*data, method=method, rate=rate)
        label = f"{method}, lr={rate}"
        print(label, "parameters", parameters, "train/validation MSE", history[-1])
        line, = ax.plot(history[:, 0], label=label + " train")
        ax.plot(history[:, 1], linestyle="--", color=line.get_color(), label=label + " validation")
    try:
        fit(*data, rate=2)
    except ArithmeticError as error:
        print("Large-rate run:", error)
    ax.set(xlabel="Epoch (0 = before training)", ylabel="MSE", yscale="log",
           title="Same initialization, data and shuffle seed; rates differ")
    ax.legend(fontsize="small")
    fig.tight_layout()
    fig.savefig("loss-curves.png", dpi=150)
    plt.close(fig)


if __name__ == "__main__":
    main()
