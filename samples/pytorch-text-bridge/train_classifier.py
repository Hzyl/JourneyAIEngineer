"""Tiny text classification with real autograd, validation and checkpoint selection."""
from copy import deepcopy
import json

import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset

TRAIN = [
    ("bài hay", 1), ("học tốt", 1), ("bài dễ", 1), ("hay tốt", 1),
    ("bài tệ", 0), ("học khó", 0), ("bài chán", 0), ("tệ khó", 0),
]
VALIDATION = [("học hay", 1), ("tốt dễ", 1), ("học chán", 0), ("khó chán", 0)]
VOCAB = {"<PAD>": 0, "<UNK>": 1}
for word in sorted({word for text, _ in TRAIN for word in text.split()}):
    VOCAB[word] = len(VOCAB)


def encode(texts, width=4):
    if not texts or width < 1:
        raise ValueError("need texts and a positive width")
    rows = []
    for text in texts:
        words = text.lower().split()
        if not words:
            raise ValueError("empty sentence")
        if len(words) > width:
            raise ValueError("sentence exceeds width; choose a truncation policy explicitly")
        row = [VOCAB.get(word, 1) for word in words]
        rows.append(row + [0] * (width - len(row)))
    return torch.tensor(rows, dtype=torch.long)


class TextClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.embedding = nn.Embedding(len(VOCAB), 8, padding_idx=0)
        self.dropout = nn.Dropout(0.2)
        self.classifier = nn.Linear(8, 2)

    def forward(self, ids):
        if ids.ndim != 2 or ids.dtype != torch.long:
            raise ValueError("expected long token IDs [B,T]")
        valid = ids.ne(0)
        counts = valid.sum(1, keepdim=True)
        if ids.shape[0] == 0 or torch.any(counts == 0):
            raise ValueError("empty or all-padding sentence")
        vectors = self.embedding(ids)
        pooled = (vectors * valid.unsqueeze(-1)).sum(1) / counts
        return self.classifier(self.dropout(pooled))


def evaluate(model, ids, labels):
    model.eval()
    with torch.no_grad():
        logits = model(ids)
        loss = float(nn.functional.cross_entropy(logits, labels))
        predictions = logits.argmax(1)
        confusion = torch.zeros(2, 2, dtype=torch.long)
        for actual, predicted in zip(labels, predictions):
            confusion[actual, predicted] += 1
    return loss, predictions, confusion


def run(epochs=80):
    torch.set_num_threads(1)
    torch.manual_seed(7)
    train_ids = encode([text for text, _ in TRAIN])
    train_y = torch.tensor([label for _, label in TRAIN])
    val_ids = encode([text for text, _ in VALIDATION])
    val_y = torch.tensor([label for _, label in VALIDATION])
    loader = DataLoader(TensorDataset(train_ids, train_y), batch_size=4, shuffle=True,
                        generator=torch.Generator().manual_seed(7), num_workers=0)
    model = TextClassifier()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.03)
    initial_loss, _, _ = evaluate(model, train_ids, train_y)
    best_loss = float("inf")
    best_state = deepcopy(model.state_dict())
    for _ in range(epochs):
        model.train()
        for ids, labels in loader:
            optimizer.zero_grad(set_to_none=True)
            logits = model(ids)
            loss = nn.functional.cross_entropy(logits, labels)
            loss.backward()
            optimizer.step()
        val_loss, _, _ = evaluate(model, val_ids, val_y)
        if val_loss < best_loss:
            best_loss = val_loss
            best_state = deepcopy(model.state_dict())
    model.load_state_dict(best_state)
    final_loss, _, _ = evaluate(model, train_ids, train_y)
    val_loss, predictions, confusion = evaluate(model, val_ids, val_y)
    # Held-out counterexample: same tokens, different order, opposite intended sentiment.
    challenge = encode(["không tốt mà tệ", "không tệ mà tốt"])
    _, challenge_predictions, _ = evaluate(model, challenge, torch.tensor([0, 1]))
    report = {
        "train_shape": list(train_ids.shape),
        "initial_train_loss": round(initial_loss, 4),
        "final_train_loss": round(final_loss, 4),
        "validation_loss": round(val_loss, 4),
        "validation_correct": int(predictions.eq(val_y).sum()),
        "validation_count": len(VALIDATION),
        "confusion_rows_actual": confusion.tolist(),
        "order_pair_predictions": challenge_predictions.tolist(),
        "order_pair_correct": int(challenge_predictions.eq(torch.tensor([0, 1])).sum()),
    }
    return model, report


if __name__ == "__main__":
    _, result = run()
    print(json.dumps(result, ensure_ascii=False, indent=2))
