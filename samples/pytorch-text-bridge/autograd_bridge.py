"""Compare a scalar loss gradient to hand calculation, then update once."""
import torch


def demo():
    torch.set_num_threads(1)
    x = torch.tensor([1.0, 2.0])
    w = torch.tensor([0.2, -0.1], requires_grad=True)
    b = torch.tensor(0.5, requires_grad=True)
    optimizer = torch.optim.SGD([w, b], lr=0.1)

    def loss():
        prediction = x @ w + b
        return (prediction - 1.0).square()

    before = float(loss().detach())
    loss().backward()
    print("gradient", w.grad.tolist(), float(b.grad))
    # A fresh graph, but the same .grad buffers: accumulation is deliberate here.
    loss().backward()
    print("accumulated", w.grad.tolist(), float(b.grad))
    optimizer.zero_grad(set_to_none=True)
    loss().backward()
    optimizer.step()
    print("weights", [round(float(v), 3) for v in w.detach()], round(float(b.detach()), 3))
    print("loss", round(before, 3), "->", round(float(loss().detach()), 3))
    detached = (x @ w + b).detach()
    print("detached_requires_grad", detached.requires_grad)
    return w, b


if __name__ == "__main__":
    demo()
