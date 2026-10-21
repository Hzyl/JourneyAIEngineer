"""Single-head attention arithmetic, then an untrained Transformer encoder block."""
import math

import torch
from torch import nn


def attention(q, k, v, valid, causal=True):
    if q.ndim != 3 or q.shape != k.shape or q.shape != v.shape:
        raise ValueError("this lab expects Q,K,V with equal shape [B,T,D]")
    if q.shape[0] == 0 or q.shape[1] == 0 or q.shape[2] == 0:
        raise ValueError("Q,K,V must be nonempty")
    if valid.shape != q.shape[:2] or valid.dtype != torch.bool:
        raise ValueError("valid must be boolean [B,T]")
    if not torch.all(valid[:, 0]) or torch.any(valid[:, 1:] & ~valid[:, :-1]):
        raise ValueError("use nonempty sentences with right padding")
    if not (q.device == k.device == v.device == valid.device):
        raise ValueError("all inputs must be on the same device")
    scores = q @ k.transpose(-2, -1) / math.sqrt(q.shape[-1])
    allowed = valid.unsqueeze(1).expand(-1, q.shape[1], -1)
    if causal:
        allowed = allowed & torch.ones(q.shape[1], q.shape[1], dtype=torch.bool,
                                       device=q.device).tril()
    weights = torch.softmax(scores.masked_fill(~allowed, float("-inf")), dim=-1)
    # Padding keys cannot be read; padding queries are explicitly zeroed afterwards.
    weights = weights * valid.unsqueeze(-1)
    return weights @ v, weights


def demo():
    torch.set_num_threads(1)
    torch.manual_seed(7)
    q = torch.zeros(1, 3, 2)
    k = torch.zeros_like(q)
    v = torch.tensor([[[1.0, 0.0], [3.0, 0.0], [100.0, 100.0]]])
    valid = torch.tensor([[True, True, False]])
    causal_output, weights = attention(q, k, v, valid)
    full_output, _ = attention(q, k, v, valid, causal=False)
    print("causal", causal_output[0, :, 0].tolist())
    print("bidirectional", full_output[0, :, 0].tolist())
    print("weights", weights[0].tolist())

    # A real encoder layer includes multi-head attention, FFN, residuals and norms.
    # The positional table and encoder here are random, NOT pretrained NLP embeddings.
    ids = torch.tensor([[1, 2, 0]])
    token_embedding = nn.Embedding(3, 4, padding_idx=0)
    position_embedding = nn.Embedding(3, 4)
    x = token_embedding(ids) + position_embedding(torch.arange(3)).unsqueeze(0)
    layer = nn.TransformerEncoderLayer(4, 2, dim_feedforward=8, dropout=0.1, batch_first=True)
    layer.eval()
    with torch.no_grad():
        output = layer(x, src_key_padding_mask=~valid)
        output = output.masked_fill(~valid.unsqueeze(-1), 0.0)
    print("encoder_shape", tuple(output.shape), "finite", bool(torch.isfinite(output).all()))


if __name__ == "__main__":
    demo()
