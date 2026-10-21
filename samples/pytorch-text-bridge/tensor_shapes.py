"""CPU tensor-to-token bridge; no downloaded data or model."""
import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset


def validate_ids(ids, vocabulary_size):
    if ids.ndim != 2 or ids.shape[0] == 0 or ids.shape[1] == 0:
        raise ValueError("ids must have nonempty shape [batch, tokens]")
    if ids.dtype != torch.long:
        raise ValueError("token IDs must use torch.long")
    if torch.any(ids < 0) or torch.any(ids >= vocabulary_size):
        raise ValueError("token ID outside vocabulary")
    if torch.any(ids.ne(0).sum(dim=1) == 0):
        raise ValueError("each sentence needs at least one non-padding token")


def demo():
    torch.set_num_threads(1)
    # 0 = PAD; the other numbers are vocabulary IDs, not word meanings.
    ids = torch.tensor([[2, 3, 0], [4, 0, 0]], dtype=torch.long)
    labels = torch.tensor([1, 0], dtype=torch.long)
    loader = DataLoader(TensorDataset(ids, labels), batch_size=2, shuffle=False)
    batch_ids, batch_labels = next(iter(loader))
    validate_ids(batch_ids, vocabulary_size=6)
    embedding = nn.Embedding(6, 4, padding_idx=0)
    token_vectors = embedding(batch_ids)
    mask = batch_ids.ne(0)
    lengths = mask.sum(dim=1, keepdim=True)
    sentence_vectors = (token_vectors * mask.unsqueeze(-1)).sum(dim=1) / lengths
    print("ids", tuple(batch_ids.shape), str(batch_ids.dtype), str(batch_ids.device))
    print("tokens", tuple(token_vectors.shape), "sentences", tuple(sentence_vectors.shape))
    print("labels", tuple(batch_labels.shape), "lengths", lengths.squeeze(1).tolist())
    try:
        validate_ids(batch_ids.flatten(), vocabulary_size=6)
    except ValueError as error:
        print("rejected:", error)


if __name__ == "__main__":
    demo()
