"""Create canonical Markdown lesson sources from the legacy generated catalog.

This is intentionally deterministic and idempotent.  It is kept in source
control so a future curriculum migration can be repeated without hand editing
208 files.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from scripts import build_lesson_catalog as catalog  # noqa: E402


def topic_code(title: str, kind: str) -> tuple[str, str]:
    text = title.lower()
    if "đạo hàm" in text or "derivative" in text or "gradient" in text or "chain rule" in text:
        code = """def finite_difference(f, x, step=1e-5):
    if step <= 0:
        raise ValueError('step must be positive')
    return (f(x + step) - f(x - step)) / (2 * step)

print(round(finite_difference(lambda value: value ** 2, 3.0), 5))"""
        return code, "So sánh đạo hàm giải tích với finite difference và kiểm tra bước h dương, đủ nhỏ."
    if "eigen" in text or "pca" in text or "svd" in text:
        code = """import numpy as np

matrix = np.array([[2.0, 0.0], [0.0, 1.0]])
values, vectors = np.linalg.eig(matrix)
u, singular_values, vt = np.linalg.svd(matrix)
print({'eigenvalues': values.tolist(), 'singular_values': singular_values.tolist()})"""
        return code, "Kiểm tra lại shape và reconstruction error khi dùng eigen decomposition hoặc SVD."
    if "mle" in text or "likelihood" in text or "maximum likelihood" in text:
        code = """import math

observations = [1.0, 1.2, 0.8]
mean = sum(observations) / len(observations)
log_likelihood = sum(-0.5 * (value - mean) ** 2 for value in observations)
print({'mean_mle': mean, 'log_likelihood': log_likelihood})"""
        return code, "Tối ưu log-likelihood thay vì tích likelihood trực tiếp để tránh underflow số học."
    if "sgd" in text or "momentum" in text or "adam" in text:
        code = """parameter = 2.0
gradient = 4.0
learning_rate = 0.1
momentum = 0.9
velocity = 0.0
velocity = momentum * velocity + gradient
parameter -= learning_rate * velocity
print({'updated_parameter': parameter, 'velocity': velocity})"""
        return code, "Theo dõi gradient, learning rate và state của optimizer; reset state khi đổi experiment."
    if any(word in text for word in ("matrix", "vector", "dot product", "norm", "distance", "embedding", "similarity")):
        code = """from math import sqrt

def dot(left: list[float], right: list[float]) -> float:
    if len(left) != len(right):
        raise ValueError('vectors must have equal length')
    return sum(a * b for a, b in zip(left, right))

left = [1.0, 2.0]
right = [0.5, 3.0]
print({'dot': dot(left, right), 'norm_left': sqrt(dot(left, left))})"""
        return code, "Kiểm tra shape trước phép toán; ví dụ dùng dữ liệu nhỏ để kết quả có thể tính tay."
    if any(word in text for word in ("probability", "bayes", "sampling", "random", "variance", "expectation")):
        code = """from collections import Counter

samples = ['pass', 'pass', 'fail', 'pass']
counts = Counter(samples)
probability_pass = counts['pass'] / len(samples)
print({'counts': dict(counts), 'p_pass': probability_pass})"""
        return code, "Tách mẫu quan sát khỏi ước lượng; luôn nêu kích thước mẫu và giả định độc lập."
    if any(word in text for word in ("regression", "classification", "metric", "calibration", "baseline", "leakage", "feature")):
        code = """def accuracy(y_true: list[int], y_pred: list[int]) -> float:
    if len(y_true) != len(y_pred) or not y_true:
        raise ValueError('non-empty aligned labels are required')
    return sum(a == b for a, b in zip(y_true, y_pred)) / len(y_true)

print(accuracy([1, 0, 1], [1, 1, 1]))"""
        return code, "Giữ một baseline và kiểm tra định dạng label trước khi diễn giải metric."
    if any(word in text for word in ("tensor", "neural", "backward", "forward", "optimizer", "dropout", "cnn", "attention")):
        code = """def linear(x: list[float], weights: list[float], bias: float = 0.0) -> float:
    if len(x) != len(weights):
        raise ValueError('shape mismatch')
    return sum(value * weight for value, weight in zip(x, weights)) + bias

prediction = linear([1.0, 2.0], [0.2, -0.1], 0.5)
print({'prediction': prediction, 'loss': (prediction - 1.0) ** 2})"""
        return code, "Làm rõ shape, forward output và loss trước khi thêm framework hoặc tối ưu hóa."
    if any(word in text for word in ("api", "http", "rest", "docker", "ci", "logging", "latency", "drift", "security", "versioning")):
        code = """import time

def timed_response(value: float) -> dict[str, float]:
    started = time.perf_counter()
    result = value * 2
    return {'result': result, 'latency_ms': (time.perf_counter() - started) * 1000}

print(timed_response(3.0))"""
        return code, "Đo boundary nhỏ bằng input hợp lệ, output có schema và một chỉ số vận hành quan sát được."
    if any(word in text for word in ("token", "prompt", "language", "context", "rag", "retrieval", "hallucination", "agent", "tool", "mcp", "transformer")):
        code = """def grounded_answer(answer: str, evidence: list[str]) -> str:
    if not evidence:
        return 'Insufficient evidence'
    return answer + '\\nSources: ' + '; '.join(evidence)

print(grounded_answer('A concise answer', ['doc-1']))"""
        return code, "Tách evidence khỏi generation và từ chối khi không có bằng chứng đủ dùng."
    code = """from dataclasses import dataclass

@dataclass(frozen=True)
class Result:
    value: str
    valid: bool

result = Result(value='ready', valid=True)
print(result)"""
    return code, "Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case."


def concept_note(title: str, module_id: str) -> tuple[str, str]:
    """Give each lesson an in-app explanation grounded in its actual topic."""

    text = title.casefold()
    notes = [
        (("python", "function", "class", "object", "exception", "logging", "debug", "type hint", "testing", "pytest", "package", "virtual environment"),
         f"{title} là một kỹ năng Software Engineering dùng để biến ý tưởng thành code có thể đọc, kiểm tra và bảo trì. Hãy xác định input, output, invariant và lỗi có thể xảy ra trước khi viết implementation. Trong Python, giữ boundary nhỏ giúp test nhanh và traceback chỉ ra đúng lớp lỗi.",
         f"{title} is a Software Engineering skill for turning an idea into code that can be read, tested, and maintained. Define the inputs, outputs, invariants, and failure modes before implementing. In Python, small boundaries make tests fast and tracebacks actionable."),
        (("git", "commit", "branch", "pull request", "terminal", "powershell", "linux"),
         f"{title} giúp một AI Engineer làm việc có thể truy vết: mỗi thay đổi cần có diff, lý do và cách kiểm chứng. Thực hành bằng một repository nhỏ, tạo một lỗi có chủ ý, đọc output của terminal rồi sửa bằng commit rõ nghĩa.",
         f"{title} makes AI engineering work traceable: every change needs a diff, a reason, and a verification step. Practise in a small repository, introduce an intentional failure, read the terminal output, and fix it with a focused commit."),
        (("rest", "http", "api", "json", "sql", "database"),
         f"{title} mô tả một boundary giữa dữ liệu và service. Một request tốt có schema, validation, status code, timeout và thông tin lỗi có thể hành động; query tốt có parameter binding, index phù hợp và test cho dữ liệu rỗng hoặc sai kiểu.",
         f"{title} describes a boundary between data and a service. A sound request has a schema, validation, status code, timeout, and actionable errors; a sound query uses parameter binding, appropriate indexes, and tests empty or malformed data."),
        (("docker", "ci/cd", "cloud", "deployment", "deploy"),
         f"{title} nối code với môi trường chạy thật. Hãy ghi rõ artifact, dependency, configuration, health check và cách rollback; một build thành công chưa đủ nếu chưa chạy smoke test trong môi trường gần production.",
         f"{title} connects code to a real runtime. Document the artifact, dependencies, configuration, health check, and rollback path; a successful build is not enough without a smoke test in a production-like environment."),
        (("vector", "matrix", "dot product", "norm", "distance"),
         f"{title} là nền tảng biểu diễn dữ liệu số. Luôn ghi shape, đơn vị và trục của tensor; kiểm tra phép nhân bằng một ví dụ nhỏ trước khi dùng batch lớn. Với similarity, chuẩn hóa cách đo để hai vector khác scale không làm sai kết luận.",
         f"{title} is a foundation for numerical representations. Track tensor shapes, units, and axes; verify multiplication on a small example before using a large batch. For similarity, normalize the measure so scale differences do not change the conclusion."),
        (("eigen", "eigenvector", "pca", "svd"),
         f"{title} tìm một hệ trục giúp mô tả cấu trúc biến thiên của dữ liệu. PCA thường center dữ liệu trước, còn SVD cung cấp factorization ổn định để lấy các hướng chính. Kiểm tra reconstruction error và explained variance thay vì chỉ nhìn hình vẽ.",
         f"{title} finds a coordinate system that describes the structure of variation in data. PCA usually centers data first, while SVD provides a stable factorization for principal directions. Check reconstruction error and explained variance instead of relying only on a plot."),
        (("đạo hàm", "derivative", "gradient", "chain rule", "backprop"),
         f"{title} cho biết output thay đổi thế nào khi một tham số thay đổi. Dùng finite difference trên input nhỏ để kiểm tra gradient, sau đó theo dõi chain rule qua từng phép biến đổi; dấu và scale của gradient quyết định bước cập nhật có ổn định hay không.",
         f"{title} describes how an output changes when a parameter changes. Use finite differences on a small input to check a gradient, then trace the chain rule through each transformation; gradient sign and scale determine whether updates are stable."),
        (("probability", "probability", "bayes", "sampling", "random", "variance", "expectation", "distribution", "confidence interval"),
         f"{title} giúp định lượng bất định thay vì chỉ đưa một dự đoán. Phân biệt xác suất điều kiện với xác suất biên, population với sample, và nêu giả định của phân phối hoặc khoảng tin cậy trước khi diễn giải kết quả.",
         f"{title} quantifies uncertainty instead of returning only a prediction. Distinguish conditional from marginal probability, population from sample, and state distribution or confidence-interval assumptions before interpreting a result."),
        (("supervised", "unsupervised", "regression", "classification", "clustering", "feature", "leakage", "cross-validation", "metric", "calibration", "baseline"),
         f"{title} là một quyết định trong classical Machine Learning: xác định label, baseline, split và metric trước khi chọn model. Preprocessing phải fit chỉ trên train; error analysis cần chỉ ra nhóm dữ liệu làm model sai và cách kiểm tra lại giả thuyết.",
         f"{title} is a classical Machine Learning decision: define the label, baseline, split, and metric before choosing a model. Fit preprocessing on train only; error analysis should identify the groups where the model fails and how to retest the hypothesis."),
        (("tensor", "neural", "cnn", "dropout", "batch normalization", "transfer learning", "pytorch", "optimizer"),
         f"{title} là một mảnh của Deep Learning pipeline: tensor đi qua forward pass, loss tạo tín hiệu, backprop tính gradient và optimizer cập nhật tham số. Tách train/eval mode, lưu checkpoint và theo dõi validation để phân biệt overfit với lỗi dữ liệu.",
         f"{title} is one part of a Deep Learning pipeline: tensors flow through a forward pass, loss creates a signal, backprop computes gradients, and the optimizer updates parameters. Separate train/eval modes, save checkpoints, and track validation to distinguish overfitting from data errors."),
        (("attention", "transformer", "encoder", "decoder", "kv cache"),
         f"{title} giải thích cách Transformer phân bổ trọng số cho token liên quan. Theo dõi shape của Q, K, V, mask và context length; khi tối ưu inference, KV cache giảm việc tính lại key/value nhưng đổi lại dùng thêm memory.",
         f"{title} explains how a Transformer weights relevant tokens. Track the shapes of Q, K, V, masks, and context length; during inference, KV cache avoids recomputing keys and values at the cost of memory."),
        (("token", "prompt", "structured output", "json schema", "streaming", "rate limit", "chat completion"),
         f"{title} thuộc LLM Application Engineering: thiết kế contract giữa ứng dụng và model. Xác định instruction, input, output schema, timeout, retry và giới hạn token; parse output như dữ liệu không tin cậy và trả lỗi có thể xử lý.",
         f"{title} belongs to LLM Application Engineering: design the contract between the application and the model. Define instructions, inputs, output schema, timeout, retry, and token limits; parse model output as untrusted data and return actionable errors."),
        (("embedding", "retrieval", "chunking", "vector database", "reranking", "hybrid", "bm25", "citation", "rag"),
         f"{title} là một mắt xích của RAG. Tách parsing, chunking, indexing, retrieval, reranking và generation để biết lỗi nằm ở đâu. Chunk cần giữ đủ ngữ cảnh; evaluation phải đo retrieval recall, groundedness và câu trả lời không có bằng chứng.",
         f"{title} is one link in a RAG system. Separate parsing, chunking, indexing, retrieval, reranking, and generation so failures are attributable. Chunks need enough context; evaluation should measure retrieval recall, groundedness, and abstention when evidence is missing."),
        (("tool", "function calling", "agent", "planning", "memory", "guardrail", "human in the loop", "mcp"),
         f"{title} mở rộng model bằng hành động có kiểm soát. Tool schema phải validate input, giới hạn quyền, timeout và retry; agent loop cần điều kiện dừng, log từng bước và human approval cho thao tác có side effect.",
         f"{title} extends a model with controlled actions. Tool schemas must validate inputs, limit permissions, and define timeout and retry; an agent loop needs stopping conditions, step logs, and human approval for side effects."),
        (("evaluation", "hallucination", "faithfulness", "observability", "logging", "tracing", "latency", "cost", "monitoring", "drift"),
         f"{title} biến một demo AI thành hệ thống có thể tin cậy. Định nghĩa metric và dataset kiểm thử trước, ghi prompt/model/version/token/latency, rồi phân tích failure theo retrieval, generation, data hoặc infrastructure thay vì chỉ nhìn một điểm số.",
         f"{title} turns an AI demo into a system that can be trusted. Define metrics and an evaluation set first, record prompt/model/version/tokens/latency, and attribute failures to retrieval, generation, data, or infrastructure instead of relying on one score."),
        (("fine-tuning", "lora", "qlora", "peft", "quantization", "local llm", "gguf", "vllm", "gpu"),
         f"{title} là tối ưu hóa model sau khi đã có evaluation baseline. Chuẩn bị dataset sạch, tách train/eval, theo dõi memory và quality regression; chọn fine-tuning, quantization hoặc local serving dựa trên chất lượng, latency, chi phí và quyền riêng tư.",
         f"{title} is model optimization after establishing an evaluation baseline. Prepare clean data, split train/eval, track memory and quality regressions, and choose fine-tuning, quantization, or local serving based on quality, latency, cost, and privacy."),
    ]
    for keywords, vi, en in notes:
        if any(keyword in text for keyword in keywords):
            return vi, en
    return (f"{title} là khái niệm của module {module_id}. Hãy xác định input, output, giả định, failure mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.",
            f"{title} is a concept in the {module_id} module. Identify the inputs, outputs, assumptions, failure modes, and verification method with a small example before scaling to a project.")


def enrich(record: dict) -> dict:
    title = record["title_vi"]
    title_en = record["title_en"]
    kind = catalog.kind_for(title, int(record["phase_id"].split("-")[1]))
    code, code_note = topic_code(title, kind)
    code = f"# Topic: {title_en} ({record['lesson_id']})\n{code}"
    record["summary_vi"] = f"Học {title} qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case."
    record["summary_en"] = f"Learn {title_en} through an input → transformation → output model, then verify it with an edge-case exercise."
    note_vi, note_en = concept_note(title, record["module_id"])
    record["concept_notes_vi"] = note_vi
    record["concept_notes_en"] = note_en
    record["code_examples"] = [{
        "language": "python", "title": f"{title_en}: inspect one complete path", "code": code,
        "status": "runnable", "purpose_vi": f"Minh họa đường đi input → output của {title.lower()}.",
        "purpose_en": f"Illustrate the input-to-output path for {title_en.lower()}.",
        "setup": "Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.",
        "expected_output": "Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.",
        "edge_case_vi": "Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.",
        "edge_case_en": "Try an empty input, a wrong shape or missing data and record the failure.",
        "explanation_vi": code_note, "explanation_en": "Keep the boundary executable and inspectable; change one input and verify the expected output.",
    }]
    # A formula is useful only when the concept has a real mathematical or
    # operational relationship.  Non-mathematical lessons intentionally keep
    # this list empty instead of inventing a generic pseudo-equation.
    record["formulas"] = catalog.formula_for(kind, title)
    record["common_mistakes"] = [
        f"Bỏ qua invariant hoặc shape khi áp dụng {title.lower()}.",
        f"Đánh giá {title.lower()} bằng một output tốt mà không có baseline hoặc failure case.",
        f"Sao chép ví dụ {title.lower()} mà không thay input và kiểm tra kết quả biên.",
    ]
    record["completion_checklist"] = [
        f"Giải thích được input, biến đổi và output của {title.lower()}.",
        "Chạy hoặc sửa được code example với một input mới.",
        "Ghi lại một edge case, metric hoặc failure mode.",
        "Trả lời review card bằng bằng chứng cụ thể.",
    ]
    record["completion_criteria"] = [
        f"Mô tả được khi nào dùng {title.lower()} và khi nào cần baseline khác.",
        "Có artifact chạy được và output có thể kiểm tra.",
        "Nêu được một giả định, edge case và cách kiểm chứng.",
    ]
    # Four deliberately different card types make review useful instead of
    # repeating one generic interview prompt for every lesson.  Keep the old
    # scalar fields below for clients that still read the v0 schema.
    slug = record["lesson_id"]
    review_cards = [
        {
            "id": f"{slug}-recall",
            "type": "recall",
            "question_vi": f"Định nghĩa {title.lower()} bằng lời của bạn. Input, biến đổi và output là gì?",
            "question_en": f"Define {title_en.lower()} in your own words. What are the input, transformation and output?",
            "answer_vi": f"Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng {title.lower()}.",
            "answer_en": f"A strong answer names the input, transformation, output and the context where {title_en.lower()} is used.",
            "hint_vi": "Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.",
            "hint_en": "Start with a small example you can calculate by hand.",
        },
        {
            "id": f"{slug}-application",
            "type": "application",
            "question_vi": f"Viết một ví dụ code hoặc thiết kế nhỏ áp dụng {title.lower()} cho bài toán AI Engineer.",
            "question_en": f"Write a small code example or design that applies {title_en.lower()} to an AI engineering problem.",
            "answer_vi": f"Ví dụ cho {title.lower()} cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng ({slug}).",
            "answer_en": f"The {title_en.lower()} example should have an explicit input, expected output and a way to run or verify it ({slug}).",
            "hint_vi": "Dùng code example trong lesson rồi thay một giả định.",
            "hint_en": "Start from the lesson code example and change one assumption.",
        },
        {
            "id": f"{slug}-debug",
            "type": "debug",
            "question_vi": f"Nếu kết quả của {title.lower()} sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?",
            "question_en": f"If {title_en.lower()} produces a wrong result or a metric drops, what would you debug first?",
            "answer_vi": f"Với {title.lower()}, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test nhỏ và error analysis ({slug}).",
            "answer_en": f"For {title_en.lower()}, check inputs/shapes, preprocessing and the baseline first; then isolate the failure with a small test and error analysis ({slug}).",
            "hint_vi": "Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.",
            "hint_en": "Do not start by changing the model or adding complexity.",
        },
        {
            "id": f"{slug}-interview",
            "type": "interview",
            "question_vi": f"Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của {title.lower()} như thế nào?",
            "question_en": f"In an interview, how would you explain a trade-off and one edge case of {title_en.lower()}?",
            "answer_vi": f"Câu trả lời về {title.lower()} cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production ({slug}).",
            "answer_en": f"The answer about {title_en.lower()} should cover assumptions, metrics/cost, limitations and how to reduce production risk ({slug}).",
            "hint_vi": "Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.",
            "hint_en": "Relate it to latency, quality, cost or observability where relevant.",
        },
    ]
    record["review_cards"] = review_cards
    record["review_item_ids"] = [card["id"] for card in review_cards]
    record["review_answer_vi"] = f"{review_cards[0]['answer_vi']} Hãy liên hệ cụ thể với {title.lower()} trong lesson {slug}."
    record["review_answer_en"] = f"{review_cards[0]['answer_en']} Relate it specifically to {title_en.lower()} in lesson {slug}."
    record["review_question_vi"] = review_cards[0]["question_vi"]
    record["review_question_en"] = review_cards[0]["question_en"]
    return record


def main() -> None:
    curriculum = catalog.json.loads(catalog.CURRICULUM_PATH.read_text(encoding="utf-8"))
    records = catalog.build_legacy(curriculum)
    catalog.LESSON_SOURCE_DIR.mkdir(parents=True, exist_ok=True)
    for record in records:
        record = enrich(record)
        body = f"# {record['title_vi']} / {record['title_en']}\n\n{record['concept_notes_vi']}\n\n## Practice\n\n{record['practice_plan']['vi']['task']}\n"
        frontmatter = yaml.safe_dump(record, allow_unicode=True, sort_keys=False, width=120)
        (catalog.LESSON_SOURCE_DIR / f"{record['lesson_id']}.md").write_text(f"---\n{frontmatter}---\n{body}", encoding="utf-8")
    print(f"Wrote {len(records)} canonical lesson sources")


if __name__ == "__main__":
    main()
