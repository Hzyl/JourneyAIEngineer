"""Build the editable, structured lesson catalog from the roadmap source.

The roadmap keeps the high-level programme readable while this catalog carries
the fields needed by the learning experience.  Running the script is safe and
deterministic: it rewrites only ``content/lessons.json``.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
CURRICULUM_PATH = ROOT / "content" / "curriculum.json"
OUTPUT_PATH = ROOT / "content" / "lessons.json"
MODULE_GUIDES_PATH = ROOT / "content" / "module_guides.json"


def load_module_guides() -> dict[str, dict[str, Any]]:
    if not MODULE_GUIDES_PATH.exists():
        return {}
    payload = json.loads(MODULE_GUIDES_PATH.read_text(encoding="utf-8"))
    return payload.get("modules", {})


MODULE_GUIDES = load_module_guides()


TOPIC_EN = {
    "Cài Python và kiểm tra phiên bản": "Install Python and verify the version",
    "Thiết lập VS Code và terminal": "Set up VS Code and the terminal",
    "Tạo virtual environment đầu tiên": "Create your first virtual environment",
    "Jupyter, Colab và khi nào dùng chúng": "Jupyter, Colab and when to use them",
    "Bài kiểm tra Python cơ bản": "Python baseline assessment",
    "Bài kiểm tra toán và logic": "Math and logic baseline assessment",
    "Bài kiểm tra Git và terminal": "Git and terminal baseline assessment",
    "Đọc kết quả và chọn nhịp học": "Read results and choose a learning pace",
    "Cách dùng roadmap và checkpoint": "Use the roadmap and checkpoints",
    "Cách ghi study session": "Record a study session",
    "Cách viết journal tuần": "Write a weekly journal",
    "Dùng ChatGPT/Codex để học có kiểm soát": "Use ChatGPT/Codex with learning controls",
    "Kiểu dữ liệu và biến": "Data types and variables",
    "Control flow và comprehension": "Control flow and comprehensions",
    "Function, scope và typing": "Functions, scope and typing",
    "Class và object-oriented design": "Classes and object-oriented design",
    "Module và package": "Modules and packages",
    "Exception và logging": "Exceptions and logging",
    "Debugging có giả thuyết": "Hypothesis-driven debugging",
    "pytest và test boundary": "pytest and test boundaries",
    "CSV và JSON": "CSV and JSON",
    "Parquet và columnar data": "Parquet and columnar data",
    "CLI với argparse": "CLI tools with argparse",
    "Validate schema và dữ liệu thiếu": "Validate schemas and missing data",
    "Git add, diff và commit": "Git add, diff and commit",
    "Branch và pull request": "Branches and pull requests",
    "Terminal PowerShell/Linux": "PowerShell and Linux terminals",
    "HTTP, REST và JSON": "HTTP, REST and JSON",
    "SELECT, JOIN và GROUP BY": "SELECT, JOIN and GROUP BY",
    "Subquery và window function": "Subqueries and window functions",
    "List, dict, set và queue": "Lists, dicts, sets and queues",
    "Big-O và trade-off": "Big-O and trade-offs",
    "Vector và không gian": "Vectors and spaces",
    "Matrix multiplication": "Matrix multiplication",
    "Dot product, norm và distance": "Dot products, norms and distances",
    "Eigenvalue, eigenvector và PCA": "Eigenvalues, eigenvectors and PCA",
    "Hàm số và đạo hàm": "Functions and derivatives",
    "Partial derivative": "Partial derivatives",
    "Gradient và level set": "Gradients and level sets",
    "Chain rule trong neural network": "The chain rule in neural networks",
    "Biến ngẫu nhiên và phân phối": "Random variables and distributions",
    "Kỳ vọng và phương sai": "Expectation and variance",
    "Conditional probability và Bayes": "Conditional probability and Bayes",
    "Sampling và luật số lớn": "Sampling and the law of large numbers",
    "Bias, variance và overfitting": "Bias, variance and overfitting",
    "Maximum likelihood": "Maximum likelihood",
    "Gradient descent": "Gradient descent",
    "SGD, momentum và Adam": "SGD, momentum and Adam",
    "Supervised và unsupervised": "Supervised and unsupervised learning",
    "Dataset, feature và label": "Datasets, features and labels",
    "Train validation test split": "Train, validation and test splits",
    "Data leakage và baseline": "Data leakage and baselines",
    "Linear regression": "Linear regression",
    "Logistic regression": "Logistic regression",
    "Decision tree và random forest": "Decision trees and random forests",
    "Gradient boosting": "Gradient boosting",
    "Missing data": "Missing data",
    "Categorical data": "Categorical data",
    "Scaling và transformation": "Scaling and transformations",
    "Feature engineering": "Feature engineering",
    "Classification metrics": "Classification metrics",
    "Regression metrics": "Regression metrics",
    "Cross-validation": "Cross-validation",
    "Hyperparameter tuning": "Hyperparameter tuning",
    "Imbalanced data": "Imbalanced data",
    "Calibration": "Calibration",
    "Error analysis": "Error analysis",
    "Model interpretation và serialization": "Model interpretation and serialization",
    "Tensor và shape": "Tensors and shapes",
    "Broadcasting": "Broadcasting",
    "Dataset và DataLoader": "Datasets and DataLoaders",
    "Autograd và computational graph": "Autograd and computational graphs",
    "Forward pass và loss": "Forward passes and loss",
    "Backward pass": "Backward passes",
    "Optimizer và learning rate": "Optimizers and learning rates",
    "Validation và checkpoint": "Validation and checkpoints",
    "Overfitting và regularization": "Overfitting and regularization",
    "Dropout và batch normalization": "Dropout and batch normalization",
    "Data augmentation": "Data augmentation",
    "Early stopping và resume": "Early stopping and resuming training",
    "CNN và image classifier": "CNNs and image classifiers",
    "Transfer learning": "Transfer learning",
    "Embedding và text classifier": "Embeddings and text classifiers",
    "Attention và Transformer overview": "Attention and a Transformer overview",
    "Shape error": "Shape errors",
    "NaN và exploding gradient": "NaN values and exploding gradients",
    "GPU memory": "GPU memory",
    "Experiment logging": "Experiment logging",
    "Package code và configuration": "Package code and configuration",
    "FastAPI route": "FastAPI routes",
    "Request response validation": "Request and response validation",
    "Batch inference": "Batch inference",
    "Docker image": "Docker images",
    "Docker compose basics": "Docker Compose basics",
    "Unit và integration test": "Unit and integration tests",
    "CI pipeline": "CI pipelines",
    "Model versioning": "Model versioning",
    "Data versioning": "Data versioning",
    "MLflow tracking": "MLflow tracking",
    "Reproducibility": "Reproducibility",
    "Structured logging": "Structured logging",
    "Latency p50/p95": "p50/p95 latency",
    "Data drift": "Data drift",
    "Concept drift và rollback": "Concept drift and rollback",
    "Environment variables": "Environment variables",
    "Input limits": "Input limits",
    "Dependency hygiene": "Dependency hygiene",
    "PII và secret redaction": "PII and secret redaction",
    "Tokenization": "Tokenization",
    "Word và sentence embedding": "Word and sentence embeddings",
    "Language model": "Language models",
    "Context window": "Context windows",
    "Attention": "Attention",
    "Encoder và decoder": "Encoders and decoders",
    "Prompt design": "Prompt design",
    "Structured output và function calling": "Structured output and function calling",
    "Vector search": "Vector search",
    "Chunking": "Chunking",
    "Metadata filter": "Metadata filters",
    "Reranking và hybrid retrieval": "Reranking and hybrid retrieval",
    "RAG pipeline": "RAG pipelines",
    "Citation": "Citations",
    "Không đủ bằng chứng": "Insufficient evidence",
    "RAG failure analysis": "RAG failure analysis",
    "Evaluation set": "Evaluation sets",
    "Hallucination": "Hallucinations",
    "Prompt injection": "Prompt injection",
    "Latency và token cost": "Latency and token cost",
    "Fine-tuning khi nào": "When to fine-tune",
    "LoRA và PEFT": "LoRA and PEFT",
    "Quantization": "Quantization",
    "Tool-using agent có điều kiện dừng": "Tool-using agents with stop conditions",
    "Chọn domain": "Choose a domain",
    "Viết problem statement": "Write a problem statement",
    "Xác định user và metric": "Define users and metrics",
    "Thiết kế architecture": "Design the architecture",
    "Baseline và MVP": "Baseline and MVP",
    "Evaluation report": "Evaluation reports",
    "Demo và README": "Demos and READMEs",
    "Limitations và roadmap": "Limitations and roadmap",
    "Project README": "Project READMEs",
    "Architecture diagram": "Architecture diagrams",
    "Video demo": "Video demos",
    "GitHub profile": "GitHub profiles",
    "CV AI Engineer": "AI Engineer CVs",
    "Trình bày project": "Presenting projects",
    "ML interview questions": "ML interview questions",
    "AI system design": "AI system design",
}

# The GenAI specialization is kept as a separate vocabulary block so the core
# curriculum remains easy to scan and future stages can be added safely.
TOPIC_EN.update({
    "Python cho AI service và typed contract": "Python for AI services and typed contracts",
    "Linux shell và môi trường tái lập": "Linux shell and reproducible environments",
    "REST API, SQL và Docker cho AI": "REST APIs, SQL and Docker for AI",
    "CI/CD và cloud căn bản": "CI/CD and cloud fundamentals",
    "Supervised và unsupervised learning": "Supervised and unsupervised learning",
    "Embedding và similarity search": "Embeddings and similarity search",
    "Train, validation, test và leakage": "Train, validation, test, and leakage",
    "Loss function, optimizer và overfitting": "Loss functions, optimizers, and overfitting",
    "Neural network và backpropagation": "Neural networks and backpropagation",
    "Self-attention và scaled dot product": "Self-attention and scaled dot product",
    "Transformer encoder và decoder": "Transformer encoders and decoders",
    "KV cache và inference efficiency": "KV cache and inference efficiency",
    "Chat completion và message lifecycle": "Chat completion and message lifecycle",
    "System prompt và user prompt": "System prompts and user prompts",
    "Structured output và JSON Schema": "Structured outputs and JSON Schema",
    "Streaming, rate limit và retry": "Streaming, rate limits, and retries",
    "Document parsing và ingestion": "Document parsing and ingestion",
    "Chunking, metadata và context": "Chunking, metadata, and context",
    "Embedding và vector database": "Embeddings and vector databases",
    "Retriever, context và LLM": "Retrievers, context, and the LLM",
    "Hybrid search: BM25 và vector search": "Hybrid search: BM25 and vector search",
    "Reranking và top-k selection": "Reranking and top-k selection",
    "Query rewrite và metadata filtering": "Query rewriting and metadata filtering",
    "Citation, faithfulness và evaluation": "Citations, faithfulness, and evaluation",
    "Function calling và tool schema": "Function calling and tool schemas",
    "Tool validation và argument policy": "Tool validation and argument policies",
    "Retry, timeout và idempotency": "Retries, timeouts, and idempotency",
    "Error handling và secure tool execution": "Error handling and secure tool execution",
    "Planning và task decomposition": "Planning and task decomposition",
    "Memory: state, history và retrieval": "Memory: state, history, and retrieval",
    "Agent loop và điều kiện dừng": "Agent loops and stop conditions",
    "Human in the loop và guardrails": "Human in the loop and guardrails",
    "MCP architecture và message flow": "MCP architecture and message flow",
    "MCP client và server": "MCP clients and servers",
    "MCP tools và resources": "MCP tools and resources",
    "MCP prompts và security": "MCP prompts and security",
    "LLM evaluation và test set": "LLM evaluation and test sets",
    "RAG evaluation: retrieval và answer": "RAG evaluation: retrieval and answers",
    "Agent evaluation và trajectory": "Agent evaluation and trajectories",
    "Hallucination, faithfulness và metrics": "Hallucination, faithfulness, and metrics",
    "Structured logging và tracing": "Structured logging and tracing",
    "Token usage và latency": "Token usage and latency",
    "Cost monitoring và budget": "Cost monitoring and budgets",
    "Dashboard, alert và incident": "Dashboards, alerts, and incidents",
    "Streaming và caching": "Streaming and caching",
    "Retry, fallback và rate limit": "Retries, fallbacks, and rate limits",
    "Queue và worker": "Queues and workers",
    "High availability và capacity": "High availability and capacity",
    "Dataset preparation và SFT": "Dataset preparation and SFT",
    "LoRA, QLoRA và PEFT": "LoRA, QLoRA, and PEFT",
    "Fine-tuning evaluation": "Fine-tuning evaluation",
    "Quantization và model trade-offs": "Quantization and model trade-offs",
    "Transformers và PyTorch inference": "Transformers and PyTorch inference",
    "vLLM và serving throughput": "vLLM and serving throughput",
    "GGUF, quantization và Ollama": "GGUF, quantization, and Ollama",
    "GPU optimization và inference benchmark": "GPU optimization and inference benchmarks",
    "Architecture end-to-end cho AI product": "End-to-end architecture for an AI product",
    "Scalability, reliability và failure modes": "Scalability, reliability, and failure modes",
    "Security, cost optimization và model selection": "Security, cost optimization, and model selection",
    "Design review và capstone proposal": "Design review and capstone proposal",
})


RESOURCE_BY_PHASE: dict[int, list[dict[str, str]]] = {
    0: [
        {"title": "Python Tutorial", "url": "https://docs.python.org/3/tutorial/", "language": "en"},
        {"title": "VS Code Python", "url": "https://code.visualstudio.com/docs/languages/python", "language": "en"},
        {"title": "Git Reference", "url": "https://git-scm.com/docs", "language": "en"},
    ],
    1: [
        {"title": "Python Standard Library", "url": "https://docs.python.org/3/library/", "language": "en"},
        {"title": "pytest Documentation", "url": "https://docs.pytest.org/en/stable/", "language": "en"},
        {"title": "SQLite Documentation", "url": "https://www.sqlite.org/docs.html", "language": "en"},
        {"title": "MDN HTTP Overview", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview", "language": "en"},
    ],
    2: [
        {"title": "NumPy Linear Algebra", "url": "https://numpy.org/doc/stable/reference/routines.linalg.html", "language": "en"},
        {"title": "SciPy Optimize", "url": "https://docs.scipy.org/doc/scipy/tutorial/optimize.html", "language": "en"},
        {"title": "scikit-learn Mathematical Foundations", "url": "https://scikit-learn.org/stable/user_guide.html", "language": "en"},
    ],
    3: [
        {"title": "scikit-learn User Guide", "url": "https://scikit-learn.org/stable/user_guide.html", "language": "en"},
        {"title": "scikit-learn Model Evaluation", "url": "https://scikit-learn.org/stable/modules/model_evaluation.html", "language": "en"},
        {"title": "scikit-learn Pipelines", "url": "https://scikit-learn.org/stable/modules/compose.html", "language": "en"},
    ],
    4: [
        {"title": "PyTorch Tutorials", "url": "https://pytorch.org/tutorials/", "language": "en"},
        {"title": "PyTorch Data Loading", "url": "https://pytorch.org/tutorials/beginner/basics/data_tutorial.html", "language": "en"},
        {"title": "PyTorch Optimization", "url": "https://pytorch.org/docs/stable/optim.html", "language": "en"},
    ],
    5: [
        {"title": "FastAPI Documentation", "url": "https://fastapi.tiangolo.com/", "language": "en"},
        {"title": "Docker Get Started", "url": "https://docs.docker.com/get-started/", "language": "en"},
        {"title": "MLflow Documentation", "url": "https://mlflow.org/docs/latest/ml/tracking/", "language": "en"},
    ],
    6: [
        {"title": "Hugging Face NLP Course", "url": "https://huggingface.co/learn/nlp-course/chapter1/1", "language": "en"},
        {"title": "Hugging Face Transformers Docs", "url": "https://huggingface.co/docs/transformers/index", "language": "en"},
        {"title": "FAISS Documentation", "url": "https://faiss.ai/", "language": "en"},
    ],
    7: [
        {"title": "GitHub Docs", "url": "https://docs.github.com/en", "language": "en"},
        {"title": "Google Engineering Practices", "url": "https://google.github.io/eng-practices/", "language": "en"},
        {"title": "The Twelve-Factor App", "url": "https://12factor.net/", "language": "en"},
    ],
}

RESOURCE_BY_PHASE.update({
    8: [
        {"title": "FastAPI Documentation", "url": "https://fastapi.tiangolo.com/", "language": "en"},
        {"title": "GitHub Actions Documentation", "url": "https://docs.github.com/en/actions", "language": "en"},
        {"title": "Docker Get Started", "url": "https://docs.docker.com/get-started/", "language": "en"},
    ],
    9: [
        {"title": "Google Machine Learning Crash Course", "url": "https://developers.google.com/machine-learning/crash-course", "language": "en"},
        {"title": "scikit-learn User Guide", "url": "https://scikit-learn.org/stable/user_guide.html", "language": "en"},
        {"title": "Sentence Transformers", "url": "https://www.sbert.net/", "language": "en"},
    ],
    10: [
        {"title": "PyTorch Tutorials", "url": "https://pytorch.org/tutorials/", "language": "en"},
        {"title": "The Illustrated Transformer", "url": "https://jalammar.github.io/illustrated-transformer/", "language": "en"},
        {"title": "Attention Is All You Need", "url": "https://arxiv.org/abs/1706.03762", "language": "en"},
    ],
    11: [
        {"title": "OpenAI Function Calling Guide", "url": "https://platform.openai.com/docs/guides/function-calling", "language": "en"},
        {"title": "JSON Schema", "url": "https://json-schema.org/learn/getting-started-step-by-step", "language": "en"},
        {"title": "OpenAI Cookbook", "url": "https://cookbook.openai.com/", "language": "en"},
    ],
    12: [
        {"title": "Qdrant Concepts", "url": "https://qdrant.tech/documentation/concepts/", "language": "en"},
        {"title": "FAISS Getting Started", "url": "https://github.com/facebookresearch/faiss/wiki/Getting-started", "language": "en"},
        {"title": "Hugging Face NLP Course", "url": "https://huggingface.co/learn/nlp-course/chapter1/1", "language": "en"},
    ],
    13: [
        {"title": "Elasticsearch Reference", "url": "https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html", "language": "en"},
        {"title": "Ragas Documentation", "url": "https://docs.ragas.io/en/stable/", "language": "en"},
        {"title": "Qdrant Hybrid Search", "url": "https://qdrant.tech/documentation/concepts/hybrid-queries/", "language": "en"},
    ],
    14: [
        {"title": "OpenAI Function Calling Guide", "url": "https://platform.openai.com/docs/guides/function-calling", "language": "en"},
        {"title": "JSON Schema", "url": "https://json-schema.org/learn/getting-started-step-by-step", "language": "en"},
        {"title": "Tenacity Documentation", "url": "https://tenacity.readthedocs.io/en/latest/", "language": "en"},
    ],
    15: [
        {"title": "Building Effective Agents", "url": "https://www.anthropic.com/research/building-effective-agents", "language": "en"},
        {"title": "LangGraph Documentation", "url": "https://langchain-ai.github.io/langgraph/", "language": "en"},
        {"title": "OpenAI Cookbook", "url": "https://cookbook.openai.com/", "language": "en"},
    ],
    16: [
        {"title": "MCP Getting Started", "url": "https://modelcontextprotocol.io/docs/getting-started/intro", "language": "en"},
        {"title": "MCP Specification", "url": "https://modelcontextprotocol.io/specification/2025-06-18", "language": "en"},
        {"title": "MCP Python SDK", "url": "https://github.com/modelcontextprotocol/python-sdk", "language": "en"},
    ],
    17: [
        {"title": "OpenAI Evals", "url": "https://github.com/openai/evals", "language": "en"},
        {"title": "Ragas Documentation", "url": "https://docs.ragas.io/en/stable/", "language": "en"},
        {"title": "DeepEval Documentation", "url": "https://deepeval.com/docs/getting-started", "language": "en"},
    ],
    18: [
        {"title": "OpenTelemetry Python", "url": "https://opentelemetry.io/docs/languages/python/", "language": "en"},
        {"title": "Prometheus Overview", "url": "https://prometheus.io/docs/introduction/overview/", "language": "en"},
        {"title": "Langfuse Documentation", "url": "https://langfuse.com/docs", "language": "en"},
    ],
    19: [
        {"title": "Redis Documentation", "url": "https://redis.io/docs/latest/", "language": "en"},
        {"title": "Celery Documentation", "url": "https://docs.celeryq.dev/en/stable/", "language": "en"},
        {"title": "Kubernetes Basics", "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/", "language": "en"},
    ],
    20: [
        {"title": "Hugging Face PEFT", "url": "https://huggingface.co/docs/peft/index", "language": "en"},
        {"title": "Hugging Face TRL", "url": "https://huggingface.co/docs/trl/index", "language": "en"},
        {"title": "bitsandbytes Documentation", "url": "https://huggingface.co/docs/bitsandbytes/main/en/index", "language": "en"},
    ],
    21: [
        {"title": "vLLM Documentation", "url": "https://docs.vllm.ai/en/latest/", "language": "en"},
        {"title": "Ollama Documentation", "url": "https://docs.ollama.com/", "language": "en"},
        {"title": "llama.cpp", "url": "https://github.com/ggml-org/llama.cpp", "language": "en"},
    ],
    22: [
        {"title": "Google Rules of Machine Learning", "url": "https://developers.google.com/machine-learning/guides/rules-of-ml", "language": "en"},
        {"title": "Full Stack Deep Learning", "url": "https://fullstackdeeplearning.com/", "language": "en"},
        {"title": "Machine Learning Systems Design", "url": "https://github.com/chiphuyen/machine-learning-systems-design", "language": "en"},
    ],
})


SPECIFIC_RESOURCES: list[tuple[tuple[str, ...], dict[str, str]]] = [
    (("cài python", "python"), {"title": "Python downloads", "url": "https://www.python.org/downloads/", "language": "en", "purpose_vi": "Trang tải Python chính thức; dùng để cài đúng bản stable.", "read_vi": "Chọn Windows installer 64-bit, kiểm tra Add Python to PATH và xác nhận bằng python --version.", "purpose_en": "Official Python downloads; use it to install a stable release.", "read_en": "Choose the 64-bit Windows installer, enable PATH, and verify with python --version."}),
    (("vs code", "terminal"), {"title": "VS Code Getting Started", "url": "https://code.visualstudio.com/docs/getstarted/getting-started", "language": "en", "purpose_vi": "Hướng dẫn chính thức để mở folder, terminal và workspace.", "read_vi": "Đọc phần mở folder và integrated terminal trước khi làm exercise.", "purpose_en": "Official guide for folders, terminals, and workspaces.", "read_en": "Read the folder and integrated-terminal sections before the exercise."}),
    (("virtual environment", "venv"), {"title": "Python venv", "url": "https://docs.python.org/3/library/venv.html", "language": "en", "purpose_vi": "Tài liệu chính thức cho môi trường phụ thuộc tách biệt.", "read_vi": "Tập trung vào tạo, activate, deactivate và cách kiểm tra interpreter.", "purpose_en": "Official reference for isolated Python environments.", "read_en": "Focus on create, activate, deactivate, and interpreter verification."}),
    (("jupyter", "colab"), {"title": "Jupyter Documentation", "url": "https://docs.jupyter.org/en/latest/", "language": "en", "purpose_vi": "Hiểu notebook, kernel và lúc nào notebook phù hợp.", "read_vi": "Đọc phần bắt đầu rồi so sánh notebook với package Python trong workspace.", "purpose_en": "Understand notebooks, kernels, and when notebooks fit.", "read_en": "Read the getting-started section and compare notebooks with a Python package."}),
    (("pytest", "test boundary"), {"title": "pytest Getting Started", "url": "https://docs.pytest.org/en/stable/getting-started.html", "language": "en", "purpose_vi": "Viết test dễ đọc và chạy được từ terminal.", "read_vi": "Đọc test discovery, assert và fixture cơ bản.", "purpose_en": "Write readable tests that run from a terminal.", "read_en": "Read test discovery, assertions, and basic fixtures."}),
    (("exception", "logging"), {"title": "Python logging", "url": "https://docs.python.org/3/library/logging.html", "language": "en", "purpose_vi": "Ghi context có cấu trúc khi debug và chạy production.", "read_vi": "Đọc levels, logger, handler; không log secret hoặc dữ liệu PII.", "purpose_en": "Add structured context for debugging and production.", "read_en": "Read levels, loggers, and handlers; never log secrets or PII."}),
    (("csv", "json"), {"title": "Python CSV and JSON", "url": "https://docs.python.org/3/library/csv.html", "language": "en", "purpose_vi": "Đọc/ghi dữ liệu tabular và cấu trúc với thư viện chuẩn.", "read_vi": "Đọc dialect, DictReader/DictWriter và kiểm tra encoding.", "purpose_en": "Read and write tabular and structured data with the standard library.", "read_en": "Focus on dialects, DictReader/DictWriter, and encoding."}),
    (("argparse", "cli"), {"title": "argparse Documentation", "url": "https://docs.python.org/3/library/argparse.html", "language": "en", "purpose_vi": "Biến script thành CLI có help và input rõ ràng.", "read_vi": "Đọc positional, optional arguments, type và error message.", "purpose_en": "Turn a script into a CLI with explicit help and inputs.", "read_en": "Read positional/optional arguments, types, and errors."}),
    (("git add", "branch", "pull request"), {"title": "Git Book: Branching", "url": "https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell", "language": "en", "purpose_vi": "Hiểu branch, diff và commit trước khi đưa artifact lên GitHub.", "read_vi": "Đọc branch, staging area và cách review diff trước push.", "purpose_en": "Understand branches, diffs, and commits before publishing artifacts.", "read_en": "Read branches, the staging area, and reviewing a diff before push."}),
    (("http", "rest", "json"), {"title": "MDN HTTP Overview", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview", "language": "en", "purpose_vi": "Nắm request, response, method, status và JSON boundary.", "read_vi": "Đọc request/response cycle, status code và content type.", "purpose_en": "Learn request, response, methods, status codes, and JSON boundaries.", "read_en": "Read the request/response cycle, status codes, and content types."}),
    (("matrix", "vector", "pca"), {"title": "NumPy Quickstart", "url": "https://numpy.org/doc/stable/user/quickstart.html", "language": "en", "purpose_vi": "Thực hành array, shape và phép toán vector bằng NumPy.", "read_vi": "Đọc array shape, indexing và broadcasting rồi in shape ở mỗi bước.", "purpose_en": "Practice arrays, shapes, and vector operations with NumPy.", "read_en": "Read array shapes, indexing, and broadcasting; print every shape."}),
    (("probability", "bayes", "sampling", "variance"), {"title": "SciPy Statistics Reference", "url": "https://docs.scipy.org/doc/scipy/reference/stats.html", "language": "en", "purpose_vi": "Tra cứu phân phối và phép thống kê để kiểm chứng mô phỏng.", "read_vi": "Chọn một distribution, ghi tham số và so sánh lý thuyết với sample.", "purpose_en": "Reference distributions and statistics for simulation checks.", "read_en": "Choose one distribution, record parameters, and compare theory with samples."}),
    (("gradient descent", "optimization", "maximum likelihood"), {"title": "SciPy Optimize Tutorial", "url": "https://docs.scipy.org/doc/scipy/tutorial/optimize.html", "language": "en", "purpose_vi": "Liên hệ objective, gradient và optimizer với bài toán tối ưu.", "read_vi": "Đọc minimize và callback; ghi rõ objective, điểm bắt đầu và điều kiện dừng.", "purpose_en": "Connect objectives, gradients, and optimizers to optimization problems.", "read_en": "Read minimize and callbacks; record the objective, start point, and stopping rule."}),
    (("train validation test", "cross-validation", "metric", "calibration"), {"title": "scikit-learn Model Evaluation", "url": "https://scikit-learn.org/stable/modules/model_evaluation.html", "language": "en", "purpose_vi": "Chọn metric và cách đánh giá theo chi phí sai lầm.", "read_vi": "Đọc metric classification/regression, scorer và cross-validation.", "purpose_en": "Choose metrics and evaluation procedures based on error cost.", "read_en": "Read classification/regression metrics, scorers, and cross-validation."}),
    (("missing data", "categorical", "preprocessing", "feature engineering"), {"title": "scikit-learn Preprocessing", "url": "https://scikit-learn.org/stable/modules/preprocessing.html", "language": "en", "purpose_vi": "Đặt imputation, encoding và scaling trong pipeline chống leakage.", "read_vi": "Đọc transformer, ColumnTransformer và fit/transform boundary.", "purpose_en": "Use leakage-safe imputation, encoding, and scaling in pipelines.", "read_en": "Read transformers, ColumnTransformer, and the fit/transform boundary."}),
    (("tensor", "pytorch", "dataloader"), {"title": "PyTorch Fundamentals", "url": "https://pytorch.org/tutorials/beginner/basics/intro.html", "language": "en", "purpose_vi": "Học tensor, Dataset, DataLoader và training loop theo flow chính thức.", "read_vi": "Đọc data, model, autograd và optimization theo thứ tự.", "purpose_en": "Learn tensors, datasets, dataloaders, and loops from the official flow.", "read_en": "Read data, models, autograd, and optimization in that order."}),
    (("autograd", "backward", "chain rule"), {"title": "PyTorch Autograd", "url": "https://pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html", "language": "en", "purpose_vi": "Đối chiếu gradient tự tính với computational graph.", "read_vi": "Đọc requires_grad, backward và gradient accumulation.", "purpose_en": "Compare hand-computed gradients with the computational graph.", "read_en": "Read requires_grad, backward, and gradient accumulation."}),
    (("cnn", "image classifier", "transfer learning"), {"title": "PyTorch Transfer Learning", "url": "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html", "language": "en", "purpose_vi": "Xây image classifier thực tế mà không train từ đầu mù quáng.", "read_vi": "Đọc data augmentation, pretrained model và đánh giá validation.", "purpose_en": "Build a practical image classifier without blindly training from scratch.", "read_en": "Read augmentation, pretrained models, and validation evaluation."}),
    (("fastapi", "request response", "batch inference"), {"title": "FastAPI Tutorial", "url": "https://fastapi.tiangolo.com/tutorial/", "language": "en", "purpose_vi": "Đóng gói inference thành API có schema và docs tự sinh.", "read_vi": "Đọc path operation, Pydantic body và response model.", "purpose_en": "Package inference as an API with schemas and generated docs.", "read_en": "Read path operations, Pydantic bodies, and response models."}),
    (("docker", "compose"), {"title": "Docker Get Started", "url": "https://docs.docker.com/get-started/", "language": "en", "purpose_vi": "Đóng gói service và kiểm tra nó trong môi trường sạch.", "read_vi": "Đọc image, container, volume và health check.", "purpose_en": "Package a service and verify it in a clean environment.", "read_en": "Read images, containers, volumes, and health checks."}),
    (("ci", "pipeline"), {"title": "GitHub Actions Documentation", "url": "https://docs.github.com/en/actions", "language": "en", "purpose_vi": "Tự động chạy quality gate trước khi merge hoặc push artifact.", "read_vi": "Đọc workflow, runner, secrets và artifact.", "purpose_en": "Automate quality gates before merging or publishing artifacts.", "read_en": "Read workflows, runners, secrets, and artifacts."}),
    (("mlflow", "tracking", "experiment"), {"title": "MLflow Tracking", "url": "https://mlflow.org/docs/latest/ml/tracking/", "language": "en", "purpose_vi": "Lưu params, metrics, model và run metadata để tái lập.", "read_vi": "Đọc experiment, run, params, metrics và artifacts.", "purpose_en": "Store params, metrics, models, and run metadata for reproducibility.", "read_en": "Read experiments, runs, params, metrics, and artifacts."}),
    (("tokenization", "token", "context window"), {"title": "Hugging Face Tokenizers", "url": "https://huggingface.co/docs/transformers/main/en/tokenizer_summary", "language": "en", "purpose_vi": "Đo token thật trước khi nói về context và cost.", "read_vi": "Đọc tokenizer, special tokens và truncation/padding.", "purpose_en": "Measure real tokens before reasoning about context and cost.", "read_en": "Read tokenizers, special tokens, and truncation/padding."}),
    (("embedding", "sentence"), {"title": "Sentence Transformers", "url": "https://www.sbert.net/", "language": "en", "purpose_vi": "Tạo sentence embedding và đánh giá similarity trên câu tiếng Việt.", "read_vi": "Đọc semantic search và similarity; ghi rõ model embedding đã chọn.", "purpose_en": "Create sentence embeddings and evaluate similarity on Vietnamese text.", "read_en": "Read semantic search and similarity; record the embedding model."}),
    (("vector search", "faiss", "reranking"), {"title": "FAISS Documentation", "url": "https://faiss.ai/", "language": "en", "purpose_vi": "Thử index và top-k retrieval trước khi thêm generation.", "read_vi": "Đọc index, distance metric và kiểm tra hit@k.", "purpose_en": "Try indexing and top-k retrieval before adding generation.", "read_en": "Read indexes, distance metrics, and hit@k evaluation."}),
    (("rag", "citation", "hallucination", "prompt injection"), {"title": "Hugging Face NLP Course", "url": "https://huggingface.co/learn/nlp-course/chapter1/1", "language": "en", "purpose_vi": "Đặt nền tảng transformer và đánh giá an toàn cho ứng dụng NLP/LLM.", "read_vi": "Đọc chương liên quan, sau đó ghi lại assumption và failure case cho lesson.", "purpose_en": "Build transformer and safety foundations for NLP/LLM applications.", "read_en": "Read the relevant chapter, then record assumptions and failure cases."}),
    (("github profile", "project readme", "architecture diagram"), {"title": "GitHub Documentation", "url": "https://docs.github.com/en", "language": "en", "purpose_vi": "Chuẩn hóa repo, README và artifact để người khác review được.", "read_vi": "Đọc phần README/repository và đối chiếu với portfolio của bạn.", "purpose_en": "Make repositories, READMEs, and artifacts reviewable by others.", "read_en": "Read repository and README guidance and compare it with your portfolio."}),
]


def resource_matches(title: str, tokens: tuple[str, ...]) -> bool:
    lowered = title.lower()
    return any(token in lowered for token in tokens)


def enriched_resources(title: str, phase_resources: list[dict[str, str]]) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    seen: set[str] = set()

    def add(resource: dict[str, Any], required: bool = False) -> None:
        key = resource.get("url") or f"internal:{resource.get('title')}"
        if key in seen:
            return
        seen.add(key)
        item = dict(resource)
        item.setdefault("kind", "official")
        item.setdefault("required", required)
        item.setdefault("purpose_vi", "Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.")
        item.setdefault("purpose_en", "Official reference to verify the lesson concept.")
        item.setdefault("read_vi", "Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.")
        item.setdefault("read_en", "Read the relevant section, run a small example, and record one verified insight.")
        result.append(item)

    for resource in phase_resources:
        add(resource, required=False)
    for tokens, resource in SPECIFIC_RESOURCES:
        if resource_matches(title, tokens):
            add(resource, required=True)
            break
    add(
        {
            "title": "Giải thích tiếng Việt và checklist của lesson",
            "url": "",
            "language": "vi",
            "kind": "in_app",
            "purpose_vi": "Phần giải thích, code example, checklist và tiêu chí hoàn thành ngay trong app.",
            "purpose_en": "The explanation, code example, checklist, and completion criteria inside the app.",
            "read_vi": "Đọc theo thứ tự Study plan → Concept notes → Code example → Practice plan.",
            "read_en": "Follow Study plan → Concept notes → Code example → Practice plan.",
        },
        required=True,
    )
    return result


def lesson_guide(title: str, title_en: str, module: dict[str, Any], kind: str, resources: list[dict[str, Any]]) -> dict[str, Any]:
    guide = MODULE_GUIDES.get(module["slug"], {})
    focus_vi = guide.get("focus_vi", f"Hiểu {title.lower()} bằng trực giác, code chạy được và bằng chứng có thể review.")
    focus_en = guide.get("focus_en", f"Understand {title_en.lower()} through intuition, executable code, and reviewable evidence.")
    practice_vi = guide.get("practice_vi", f"Áp dụng {title.lower()} vào một bài toán nhỏ trong workspace, rồi kiểm tra bằng test hoặc output có expected result.")
    practice_en = guide.get("practice_en", f"Apply {title_en.lower()} to a small workspace task, then verify it with a test or an expected output.")
    checkpoint_vi = guide.get("checkpoint_vi", "Bạn giải thích được quyết định, giả định, edge case và cách kiểm tra kết quả.")
    checkpoint_en = guide.get("checkpoint_en", "You can explain the decision, assumptions, edge cases, and how to verify the result.")
    external = next((item for item in resources if item.get("kind") != "in_app"), None)
    first_resource_vi = external.get("title") if external else "tài liệu tham khảo"
    first_resource_en = external.get("title") if external else "the reference material"
    study_steps_vi = [
        f"Đọc phần Concept notes để trả lời: {focus_vi}",
        f"Mở {first_resource_vi}, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.",
        "Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.",
        f"Làm bài thực hành: {practice_vi}",
        "Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.",
    ]
    study_steps_en = [
        f"Read the concept notes and answer: {focus_en}",
        f"Open {first_resource_en}, read the section marked Read this lesson, and record one verified example or definition.",
        "Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.",
        f"Complete the practice task: {practice_en}",
        "Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.",
    ]
    deliverables_vi = guide.get("deliverables_vi", ["Một file code chạy được", "Một test hoặc output expected", "Một note nêu edge case và trade-off"])
    deliverables_en = guide.get("deliverables_en", ["One executable code file", "One test or expected output", "One note describing an edge case and trade-off"])
    return {
        "why_it_matters_vi": focus_vi,
        "why_it_matters_en": focus_en,
        "study_steps_vi": study_steps_vi,
        "study_steps_en": study_steps_en,
        "practice_plan": {
            "vi": {"task": practice_vi, "deliverables": deliverables_vi, "checkpoint": checkpoint_vi, "stretch": f"Viết thêm một failure test cho {title.lower()} và giải thích kết quả."},
            "en": {"task": practice_en, "deliverables": deliverables_en, "checkpoint": checkpoint_en, "stretch": f"Add a failure test for {title_en.lower()} and explain the result."},
        },
        "interview_questions": {
            "vi": [
                f"Bạn sẽ giải thích {title.lower()} cho một đồng đội mới như thế nào?",
                f"Một assumption nào của {title.lower()} có thể sai trong production?",
                "Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?",
            ],
            "en": [
                f"How would you explain {title_en.lower()} to a new teammate?",
                f"Which assumption behind {title_en.lower()} could fail in production?",
                "Which metric or test would prove the result is trustworthy?",
            ],
        },
    }


def kind_for(title: str, phase_order: int) -> str:
    text = title.lower()
    if phase_order in {10}:
        return "deep"
    if phase_order in {11, 12, 13, 14, 15, 16, 17, 20, 21}:
        return "llm"
    if phase_order in {18, 19, 22}:
        return "mlops"
    if phase_order == 9:
        return "ml"
    if phase_order == 2 or any(word in text for word in ("vector", "matrix", "gradient", "probability", "bayes", "variance", "likelihood", "sampling", "eigen", "pca", "calculus")):
        return "math"
    if phase_order == 3 or any(word in text for word in ("regression", "classification", "tree", "forest", "boosting", "metric", "cross-validation", "model", "feature", "leakage", "calibration")):
        return "ml"
    if phase_order == 4 or any(word in text for word in ("tensor", "pytorch", "cnn", "embedding", "attention", "neural", "gpu", "gradient")):
        return "deep"
    if phase_order == 5 or any(word in text for word in ("api", "docker", "ci", "versioning", "logging", "latency", "drift", "security", "secret", "environment")):
        return "mlops"
    if phase_order == 6 or any(word in text for word in ("token", "embedding", "language", "context", "prompt", "vector search", "chunk", "rag", "hallucination", "injection", "lora", "quantization", "agent")):
        return "llm"
    return "software"


def terms_for(title: str, module: dict[str, Any], kind: str) -> list[str]:
    pieces = [piece.lower() for piece in re.split(r"[^A-Za-zÀ-ỹ0-9]+", title) if len(piece) > 2]
    shared = {
        "software": ["Python", "testing", "debugging", "maintainability"],
        "math": ["NumPy", "vector", "gradient", "optimization"],
        "ml": ["dataset", "feature", "baseline", "evaluation"],
        "deep": ["PyTorch", "tensor", "loss", "training"],
        "mlops": ["inference", "observability", "reproducibility", "deployment"],
        "llm": ["token", "embedding", "retrieval", "evaluation"],
    }[kind]
    return list(dict.fromkeys([*pieces[:6], *shared, module["slug"]]))[:10]


def formula_for(kind: str, title: str) -> list[str]:
    text = title.lower()
    if kind == "math":
        if "matrix" in text:
            return ["(AB)_{ij} = Σ_k A_{ik}B_{kj}"]
        if "gradient" in text or "descent" in text:
            return ["θ_{t+1} = θ_t − η ∇J(θ_t)"]
        if "probability" in text or "bayes" in text:
            return ["P(A|B) = P(B|A)P(A) / P(B)"]
        if "variance" in text or "expectation" in text:
            return ["Var(X) = E[(X − E[X])²]"]
        return ["x · y = Σ_i x_i y_i", "||x||₂ = √(Σ_i x_i²)"]
    if kind == "ml":
        if "classification" in text or "logistic" in text:
            return ["σ(z) = 1 / (1 + e^(−z))", "precision = TP / (TP + FP)"]
        if "regression" in text:
            return ["MSE = (1/n) Σ_i (y_i − ŷ_i)²"]
        return ["risk(f) = E[L(y, f(x))]", "score = metric(y_true, y_pred)"]
    if kind == "deep":
        if "attention" in text:
            return ["Attention(Q,K,V) = softmax(QKᵀ / √d_k)V"]
        return ["z = Wx + b", "θ_{t+1} = θ_t − η ∇J(θ_t)"]
    if kind == "llm":
        return ["similarity(a,b) = (a · b) / (||a||₂ ||b||₂)"]
    if kind == "mlops":
        return ["p95 = percentile(latencies, 95)", "throughput = completed_requests / elapsed_seconds"]
    return []


def code_example(kind: str, title: str) -> dict[str, str]:
    if kind == "math":
        code = "import numpy as np\n\nx = np.array([1.0, 2.0])\nw = np.array([0.3, 0.4])\nscore = x @ w\nprint(score)"
        explanation = "Kiểm tra shape, kiểu dữ liệu và phép tính bằng một ví dụ nhỏ trước khi mở rộng."
    elif kind == "ml":
        code = "from sklearn.model_selection import train_test_split\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nmodel = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))\nmodel.fit(X_train, y_train)\nprint(model.score(X_test, y_test))"
        explanation = "Đặt preprocessing trong pipeline để tránh học thông tin từ test set."
    elif kind == "deep":
        code = "import torch\n\nmodel = torch.nn.Sequential(torch.nn.Linear(4, 8), torch.nn.ReLU(), torch.nn.Linear(8, 2))\noptimizer = torch.optim.Adam(model.parameters(), lr=1e-3)\nlogits = model(torch.randn(16, 4))\nloss = logits.square().mean()\nloss.backward()\noptimizer.step()\noptimizer.zero_grad()"
        explanation = "Training loop tối thiểu phải làm rõ forward, loss, backward và optimizer step."
    elif kind == "mlops":
        code = "from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Request(BaseModel):\n    value: float\n\n@app.post('/predict')\ndef predict(request: Request):\n    return {'prediction': request.value, 'model_version': 'v1'}"
        explanation = "API boundary cần schema rõ ràng, version model và output có thể kiểm thử."
    elif kind == "llm":
        code = "def grounded_answer(answer: str, evidence: list[str]) -> str:\n    if not evidence:\n        return 'Chưa đủ bằng chứng trong tài liệu.'\n    return f'{answer}\\n\\nNguồn: ' + '; '.join(evidence)"
        explanation = "Luôn tách retrieval evidence khỏi generation và có nhánh từ chối khi thiếu bằng chứng."
    else:
        code = "from pathlib import Path\n\npath = Path('input.txt')\ntext = path.read_text(encoding='utf-8')\nlines = [line.strip() for line in text.splitlines() if line.strip()]\nprint(len(lines))"
        explanation = "Ví dụ nhỏ nên có input rõ ràng, xử lý edge case và output có thể kiểm tra."
    return {"language": "python", "title": f"Minimal example: {TOPIC_EN.get(title, title)}", "code": code, "explanation_vi": explanation, "explanation_en": "Start with a small executable example whose assumptions and output are easy to inspect."}


def build() -> list[dict[str, Any]]:
    curriculum = json.loads(CURRICULUM_PATH.read_text(encoding="utf-8"))
    all_slugs: list[str] = []
    for phase in curriculum["phases"]:
        for module in phase["modules"]:
            all_slugs.extend(f"{phase['slug']}-{module['slug']}-{index + 1}" for index, _ in enumerate(module["lessons"]))

    records: list[dict[str, Any]] = []
    for phase in curriculum["phases"]:
        order = phase["order"]
        phase_resources = RESOURCE_BY_PHASE[order]
        for module in phase["modules"]:
            exercise_id = f"exercise-{order}-{module['slug']}"
            for index, title_vi in enumerate(module["lessons"]):
                slug = f"{phase['slug']}-{module['slug']}-{index + 1}"
                title_en = TOPIC_EN.get(title_vi, f"{module['title_en']} — lesson {index + 1}")
                kind = kind_for(title_vi, order)
                previous = all_slugs[all_slugs.index(slug) - 1] if all_slugs.index(slug) else None
                following = all_slugs[all_slugs.index(slug) + 1 : all_slugs.index(slug) + 3]
                prerequisites = [] if previous is None else [previous]
                if order > 0:
                    prerequisites.append(f"phase-{order - 1:02d}")
                resources = list(dict.fromkeys(tuple(sorted(item.items())) for item in phase_resources))
                resource_list = enriched_resources(title_vi, [dict(item) for item in resources])
                guide = lesson_guide(title_vi, title_en, module, kind, resource_list)
                record = {
                    "lesson_id": slug,
                    "phase_id": phase["slug"],
                    "module_id": module["slug"],
                    "title_vi": title_vi,
                    "title_en": title_en,
                    "summary_vi": f"Nắm {title_vi.lower()} bằng trực giác, một ví dụ chạy được và một lần tự kiểm tra trong bối cảnh AI Engineer.",
                    "summary_en": f"Understand {title_en.lower()} through intuition, an executable example and a self-check relevant to AI engineering.",
                    "learning_objectives": [
                        f"Giải thích {title_vi.lower()} bằng ví dụ cụ thể.",
                        f"Viết hoặc sửa một đoạn code nhỏ áp dụng {title_vi.lower()}.",
                        "Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.",
                    ],
                    "learning_objectives_en": [
                        f"Explain {title_en.lower()} with a concrete example.",
                        f"Write or adapt a small code example applying {title_en.lower()}.",
                        "Recognize its assumptions, limits and one common failure mode.",
                    ],
                    "prerequisites": prerequisites,
                    "key_terms": terms_for(title_vi, module, kind),
                    "concept_notes_vi": f"{title_vi} là một mảnh ghép của module {module['title_vi']}. Hãy bắt đầu bằng câu hỏi: dữ liệu hoặc tín hiệu nào đi vào, phép biến đổi nào diễn ra, và đầu ra được dùng để quyết định điều gì? Sau đó chạy ví dụ nhỏ trước khi tối ưu hoặc mở rộng.\n\nTrong công việc AI Engineer, khái niệm này thường xuất hiện cùng kiểm thử, đo lường và phân tích lỗi. Đừng chỉ ghi nhớ định nghĩa: hãy viết lại bằng lời của bạn, thay đổi một giả định và quan sát kết quả.",
                    "concept_notes_en": f"{title_en} is one building block of {module['title_en']}. Start by asking what enters the computation, what transformation happens, and how the output supports a decision. Run a small example before scaling it.\n\nIn AI engineering this concept is tied to testing, measurement and error analysis. Do not stop at the definition: restate it, change one assumption and observe the result.",
                    "why_it_matters_vi": guide["why_it_matters_vi"],
                    "why_it_matters_en": guide["why_it_matters_en"],
                    "study_steps_vi": guide["study_steps_vi"],
                    "study_steps_en": guide["study_steps_en"],
                    "practice_plan": guide["practice_plan"],
                    "interview_questions": guide["interview_questions"],
                    "formulas": formula_for(kind, title_vi),
                    "code_examples": [code_example(kind, title_vi)],
                    "resources": resource_list,
                    "exercise_ids": [exercise_id],
                    "review_item_ids": [f"{slug}-review"],
                    "estimated_minutes": 45 if order < 3 else 60,
                    "completion_checklist": [
                        "Tự giải thích được input, biến đổi và output.",
                        "Chạy hoặc sửa được ví dụ code trong workspace.",
                        "Ghi lại một edge case hoặc failure mode.",
                        "Trả lời review card mà không nhìn đáp án trước.",
                    ],
                    "completion_criteria": [
                        "Có thể giải thích khái niệm bằng lời của mình và liên hệ với một bài toán AI Engineer.",
                        "Có thể tự chạy, sửa hoặc mở rộng ví dụ code trong workspace.",
                        "Có thể nhận diện một giả định, edge case và cách kiểm tra kết quả.",
                    ],
                    "common_mistakes": [
                        "Học thuộc thuật ngữ nhưng không kiểm tra shape, input hoặc giả định.",
                        "Chỉ nhìn metric hoặc output tốt mà bỏ qua baseline và error analysis.",
                        "Sao chép code mà không viết lại bằng lời và test một trường hợp biên.",
                    ],
                    "next_lessons": following,
                    "review_question_vi": f"Hãy giải thích {title_vi.lower()} bằng lời của bạn, nêu một ví dụ AI Engineer và một lỗi thường gặp.",
                    "review_question_en": f"Explain {title_en.lower()} in your own words, give one AI engineering example and one common failure.",
                    "review_answer_vi": "Một câu trả lời đạt yêu cầu cần có định nghĩa, trực giác, ví dụ code hoặc dữ liệu, giả định và cách kiểm tra lỗi.",
                    "review_answer_en": "A useful answer includes the definition, intuition, a code or data example, assumptions and a way to test for failure.",
                }
                records.append(record)
    return records


if __name__ == "__main__":
    records = build()
    OUTPUT_PATH.write_text(json.dumps({"schema_version": "1.0", "lessons": records}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(records)} structured lessons to {OUTPUT_PATH}")
