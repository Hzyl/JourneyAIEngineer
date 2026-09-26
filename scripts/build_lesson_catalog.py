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


def kind_for(title: str, phase_order: int) -> str:
    text = title.lower()
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
                resource_list = [dict(item) for item in resources]
                resource_list.append(
                    {
                        "title": "Ghi chú tiếng Việt trong Journey AI Engineer",
                        "url": "https://github.com/Hzyl/JouneyAIEngineer",
                        "language": "vi",
                    }
                )
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
