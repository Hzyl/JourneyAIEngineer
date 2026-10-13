"""Optional genuine embedding run, explicitly restricted to Google Colab."""
import importlib.util
from pathlib import Path
import platform

MODEL_ID = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
REVISION = "e8f8c211226b894fcb81acc59f3b34ba3efd5f42"
MODEL_CARD = {
    "model_id": MODEL_ID, "revision": REVISION, "dimensions": 384,
    "max_sequence_length": 128, "license": "Apache-2.0",
    "source": f"https://huggingface.co/{MODEL_ID}/blob/{REVISION}/README.md",
    "purpose": "Multilingual sentence embeddings; no answer generation.",
    "limits": "Truncation at 128 tokens; model card is not a Vietnamese quality benchmark.",
}


def require_colab():
    # Fail before importing ML packages or constructing a model.
    try:
        available = importlib.util.find_spec("google.colab") is not None
    except (ImportError, ModuleNotFoundError, ValueError):
        available = False
    if not available or not Path("/content").is_dir():
        raise RuntimeError("Real embeddings are Colab-only. Open notebook lab-a-evidence-retrieval.ipynb.")


class ColabSentenceTransformer:
    """Requires learner-installed sentence-transformers in their Colab runtime."""
    def __init__(self):
        require_colab()
        from importlib.metadata import version
        from sentence_transformers import SentenceTransformer
        self.model = SentenceTransformer(MODEL_ID, revision=REVISION, device="cpu", trust_remote_code=False,
                                         model_kwargs={"use_safetensors": True})
        self.model.max_seq_length = MODEL_CARD["max_sequence_length"]
        if self.model.get_sentence_embedding_dimension() != MODEL_CARD["dimensions"]:
            raise ValueError("Unexpected embedding dimension for pinned model")
        self.metadata = {
            **MODEL_CARD, "is_mock": False, "runtime": "Google Colab",
            "device": str(self.model.device), "python": platform.python_version(),
            "packages": {name: version(name) for name in ("sentence-transformers", "transformers", "torch")},
            "normalize_embeddings": True, "batch_size": 16,
        }

    def encode(self, texts):
        return self.model.encode(texts, batch_size=16, normalize_embeddings=True, show_progress_bar=False).tolist()
