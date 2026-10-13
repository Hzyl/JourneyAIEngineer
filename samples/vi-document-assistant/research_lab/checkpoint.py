"""RAM versus durable JSON checkpoints for trusted synthetic lab state only."""
from copy import deepcopy
import json
from pathlib import Path
import os


class MemoryStore:
    def __init__(self):
        self.value = None

    def save(self, state):
        self.value = deepcopy(state)

    def load(self):
        return deepcopy(self.value)


class JsonStore:
    def __init__(self, path):
        self.path = Path(path)

    def save(self, state):
        # Atomic same-directory replacement prevents a half-written checkpoint.
        temporary = self.path.with_suffix(self.path.suffix + ".tmp")
        with temporary.open("w", encoding="utf-8") as stream:
            json.dump(state, stream, ensure_ascii=False, allow_nan=False)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, self.path)

    def load(self):
        return json.loads(self.path.read_text(encoding="utf-8")) if self.path.exists() else None
