"""Show why PAD=0 still needs a denominator mask for sentence pooling."""
import torch
from torch import nn


def masked_mean(vectors, valid):
    if vectors.ndim != 3 or valid.shape != vectors.shape[:2]:
        raise ValueError("expected vectors [B,T,D] and mask [B,T]")
    if valid.dtype != torch.bool or vectors.device != valid.device:
        raise ValueError("mask must be boolean and on the same device")
    counts = valid.sum(dim=1, keepdim=True)
    if vectors.shape[0] == 0 or torch.any(counts == 0):
        raise ValueError("empty or all-padding sentence")
    return (vectors * valid.unsqueeze(-1)).sum(dim=1) / counts


def demo():
    torch.set_num_threads(1)
    # Hand-picked vectors expose arithmetic, not pretrained semantic quality.
    weights = torch.tensor([[0.0, 0.0], [2.0, 0.0], [0.0, 4.0]])
    embedding = nn.Embedding.from_pretrained(weights, freeze=False, padding_idx=0)
    ids = torch.tensor([[1, 2, 0], [1, 0, 0]])
    vectors = embedding(ids)
    pooled = masked_mean(vectors, ids.ne(0))
    padded_ids = torch.nn.functional.pad(ids, (0, 2), value=0)
    padded = masked_mean(embedding(padded_ids), padded_ids.ne(0))
    print("pooled", pooled.tolist())
    print("padding_invariant", torch.allclose(pooled, padded))
    print("naive_mean_invariant", torch.allclose(vectors.mean(1), embedding(padded_ids).mean(1)))
    pooled.sum().backward()
    print("pad_gradient", embedding.weight.grad[0].tolist())
    print("token_1_gradient", embedding.weight.grad[1].tolist())
    try:
        masked_mean(torch.zeros(1, 3, 2), torch.zeros(1, 3, dtype=torch.bool))
    except ValueError as error:
        print("rejected:", error)


if __name__ == "__main__":
    demo()
