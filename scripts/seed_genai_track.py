"""Add the version-controlled GenAI specialization track to the curriculum.

The core curriculum remains intact. This idempotent script appends the 15
GenAI stages from the learning plan, adds their module guides and registers the
six portfolio projects plus the reference links needed to study them.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
CURRICULUM_PATH = ROOT / "content" / "curriculum.json"
GUIDES_PATH = ROOT / "content" / "module_guides.json"
RESOURCES_PATH = ROOT / "content" / "resources.json"


def stage(
    order: int,
    slug: str,
    title_vi: str,
    title_en: str,
    summary_vi: str,
    summary_en: str,
    module_slug: str,
    module_vi: str,
    module_en: str,
    lessons: list[tuple[str, str]],
    focus_vi: str,
    focus_en: str,
    practice_vi: str,
    practice_en: str,
    checkpoint_vi: str,
    checkpoint_en: str,
) -> dict[str, Any]:
    return {
        "order": order,
        "slug": slug,
        "title_vi": title_vi,
        "title_en": title_en,
        "summary_vi": summary_vi,
        "summary_en": summary_en,
        "module_slug": module_slug,
        "module_vi": module_vi,
        "module_en": module_en,
        "lessons": lessons,
        "focus_vi": focus_vi,
        "focus_en": focus_en,
        "practice_vi": practice_vi,
        "practice_en": practice_en,
        "checkpoint_vi": checkpoint_vi,
        "checkpoint_en": checkpoint_en,
    }


STAGES: list[dict[str, Any]] = [
    stage(8, "phase-08-genai-software", "Software Engineering cho GenAI", "Software Engineering for GenAI", "Củng cố nền tảng để biến prototype GenAI thành service có test, container và pipeline.", "Strengthen the foundations needed to turn a GenAI prototype into a tested service with a container and delivery pipeline.", "genai-software-foundations", "GenAI software foundations", "GenAI software foundations", [
        ("Python cho AI service và typed contract", "Python for AI services and typed contracts"),
        ("Linux shell và môi trường tái lập", "Linux shell and reproducible environments"),
        ("REST API, SQL và Docker cho AI", "REST APIs, SQL and Docker for AI"),
        ("CI/CD và cloud căn bản", "CI/CD and cloud fundamentals"),
    ], "Một AI Engineer phải kiểm soát boundary của service, dependency và release trước khi tối ưu model.", "An AI Engineer must control service boundaries, dependencies, and releases before optimizing a model.", "Đóng gói một endpoint AI giả lập bằng FastAPI, Docker và GitHub Actions; ghi lại contract, health check và lệnh rollback.", "Package a stub AI endpoint with FastAPI, Docker, and GitHub Actions; document its contract, health check, and rollback command.", "Clone trên máy sạch, chạy test và container bằng một chuỗi lệnh; giải thích được lỗi thuộc code, môi trường hay deployment.", "From a clean clone, run tests and the container with one command sequence and distinguish code, environment, and deployment failures."),
    stage(9, "phase-09-genai-ml-fundamentals", "Machine Learning Fundamentals cho GenAI", "Machine Learning Fundamentals for GenAI", "Hiểu dữ liệu, embedding, similarity và tối ưu để không dùng LLM như một hộp đen.", "Understand data, embeddings, similarity, and optimization so an LLM is not treated as a black box.", "genai-ml-fundamentals", "GenAI ML fundamentals", "GenAI ML fundamentals", [
        ("Supervised và unsupervised learning", "Supervised and unsupervised learning"),
        ("Embedding và similarity search", "Embeddings and similarity search"),
        ("Train, validation, test và leakage", "Train, validation, test, and leakage"),
        ("Loss function, optimizer và overfitting", "Loss functions, optimizers, and overfitting"),
    ], "Embedding và metric là cầu nối giữa dữ liệu của người dùng với retrieval, clustering và model quality.", "Embeddings and metrics connect user data to retrieval, clustering, and model quality.", "Tạo một embedding benchmark nhỏ: split dữ liệu, đo cosine similarity, kiểm tra leakage và vẽ loss curve.", "Build a small embedding benchmark: split data, measure cosine similarity, check leakage, and plot a loss curve.", "Bạn giải thích được một similarity score, một split hợp lệ và cách overfitting làm kết quả retrieval kém đi.", "You can explain a similarity score, a valid split, and how overfitting degrades retrieval."),
    stage(10, "phase-10-genai-transformers", "Deep Learning và Transformer", "Deep Learning and Transformers", "Đi từ neural network và backpropagation đến self-attention, encoder/decoder và KV cache.", "Move from neural networks and backpropagation to self-attention, encoder/decoder models, and KV cache.", "genai-transformers", "Deep learning and Transformers", "Deep learning and Transformers", [
        ("Neural network và backpropagation", "Neural networks and backpropagation"),
        ("Self-attention và scaled dot product", "Self-attention and scaled dot product"),
        ("Transformer encoder và decoder", "Transformer encoders and decoders"),
        ("KV cache và inference efficiency", "KV cache and inference efficiency"),
    ], "Transformer chỉ trở nên dễ hiểu khi theo dõi tensor shape, attention weights và chi phí inference.", "Transformers become understandable when you trace tensor shapes, attention weights, and inference cost.", "Tự viết attention tối giản bằng PyTorch/NumPy, đo shape và so sánh inference có/không có cache.", "Implement minimal attention with PyTorch/NumPy, inspect shapes, and compare inference with and without caching.", "Bạn vẽ được luồng Q/K/V, giải thích encoder/decoder và định lượng vì sao KV cache giảm latency.", "You can draw the Q/K/V flow, explain encoder/decoder roles, and quantify why KV cache reduces latency."),
    stage(11, "phase-11-llm-application", "LLM Application Engineering", "LLM Application Engineering", "Xây ứng dụng gọi model có prompt boundary, output schema, streaming và giới hạn vận hành.", "Build model-powered applications with prompt boundaries, output schemas, streaming, and operational limits.", "llm-application", "LLM application contracts", "LLM application contracts", [
        ("Chat completion và message lifecycle", "Chat completion and message lifecycle"),
        ("System prompt và user prompt", "System prompts and user prompts"),
        ("Structured output và JSON Schema", "Structured outputs and JSON Schema"),
        ("Streaming, rate limit và retry", "Streaming, rate limits, and retries"),
    ], "LLM application engineering là thiết kế contract và failure boundary quanh model, không phải chỉ viết một prompt dài.", "LLM application engineering designs contracts and failure boundaries around a model, not just a long prompt.", "Xây LLM Chat API có schema request/response, streaming giả lập, retry có backoff và token budget.", "Build an LLM Chat API with request/response schemas, simulated streaming, backoff retries, and a token budget.", "Một client khác có thể gọi API mà không biết prompt nội bộ; output sai schema và rate limit đều có test riêng.", "Another client can call the API without knowing internal prompts, and schema failures plus rate limits have dedicated tests."),
    stage(12, "phase-12-genai-rag", "RAG nền tảng", "RAG Foundations", "Xây pipeline từ document parsing đến chunking, embedding, vector database, retriever và grounded answer.", "Build the pipeline from document parsing through chunking, embeddings, a vector database, retrieval, and grounded answers.", "rag-foundations", "RAG foundations", "RAG foundations", [
        ("Document parsing và ingestion", "Document parsing and ingestion"),
        ("Chunking, metadata và context", "Chunking, metadata, and context"),
        ("Embedding và vector database", "Embeddings and vector databases"),
        ("Retriever, context và LLM", "Retrievers, context, and the LLM"),
    ], "RAG tách retrieval khỏi generation để câu trả lời có thể truy nguồn và từ chối khi không có bằng chứng.", "RAG separates retrieval from generation so answers can be sourced and can abstain without evidence.", "Xây ingestion pipeline cho tài liệu tiếng Việt, lưu metadata, benchmark top-k và trả lời kèm các chunk evidence.", "Build an ingestion pipeline for Vietnamese documents, preserve metadata, benchmark top-k, and answer with evidence chunks.", "Bạn chỉ ra được lỗi do parsing, chunking, retrieval hay generation bằng một evaluation case cụ thể.", "You can attribute a failure to parsing, chunking, retrieval, or generation with a concrete evaluation case."),
    stage(13, "phase-13-genai-advanced-rag", "Advanced RAG", "Advanced RAG", "Nâng chất lượng retrieval bằng hybrid search, reranking, query rewrite, filtering, citation và evaluation.", "Improve retrieval with hybrid search, reranking, query rewriting, filtering, citations, and evaluation.", "advanced-rag", "Advanced retrieval", "Advanced retrieval", [
        ("Hybrid search: BM25 và vector search", "Hybrid search: BM25 and vector search"),
        ("Reranking và top-k selection", "Reranking and top-k selection"),
        ("Query rewrite và metadata filtering", "Query rewriting and metadata filtering"),
        ("Citation, faithfulness và evaluation", "Citations, faithfulness, and evaluation"),
    ], "Advanced RAG phải cải thiện retrieval bằng số liệu chứ không chỉ thêm nhiều component.", "Advanced RAG should improve retrieval with measurements rather than simply adding components.", "Tạo evaluation set 30 câu, so sánh vector/BM25/hybrid, thêm reranker và phân tích failure theo query type.", "Create a 30-question evaluation set, compare vector/BM25/hybrid retrieval, add a reranker, and slice failures by query type.", "Bạn biết retrieval fail ở recall hay ranking, citation có đủ evidence không và thay đổi nào đáng giữ.", "You can tell whether retrieval failed on recall or ranking, whether citations support claims, and which change is worth keeping."),
    stage(14, "phase-14-genai-tool-calling", "Tool Calling", "Tool Calling", "Cho model dùng API và database bên ngoài với schema, validation, retry, timeout và error handling an toàn.", "Let a model use external APIs and databases with safe schemas, validation, retries, timeouts, and error handling.", "tool-calling", "Tool calling contracts", "Tool calling contracts", [
        ("Function calling và tool schema", "Function calling and tool schemas"),
        ("Tool validation và argument policy", "Tool validation and argument policies"),
        ("Retry, timeout và idempotency", "Retries, timeouts, and idempotency"),
        ("Error handling và secure tool execution", "Error handling and secure tool execution"),
    ], "Tool calling biến output model thành hành động nên cần contract chặt hơn chat thông thường.", "Tool calling turns model output into actions, so its contracts must be stricter than ordinary chat.", "Xây tool đọc database giả lập với schema validation, timeout, retry có giới hạn và audit log không chứa secret.", "Build a mock database tool with schema validation, bounded retries, timeouts, and an audit log without secrets.", "Tool sai input không thể chạy side effect; retry không nhân đôi giao dịch và lỗi được trả về có thể sửa.", "Invalid tool input cannot cause side effects, retries do not duplicate transactions, and errors are actionable."),
    stage(15, "phase-15-genai-agents", "AI Agents", "AI Agents", "Thiết kế agent loop có planning, memory, tool use, human approval và guardrails kiểm soát được.", "Design a controllable agent loop with planning, memory, tool use, human approval, and guardrails.", "ai-agents", "Agent loops and guardrails", "Agent loops and guardrails", [
        ("Planning và task decomposition", "Planning and task decomposition"),
        ("Memory: state, history và retrieval", "Memory: state, history, and retrieval"),
        ("Agent loop và điều kiện dừng", "Agent loops and stop conditions"),
        ("Human in the loop và guardrails", "Human in the loop and guardrails"),
    ], "Agent là một vòng lặp điều khiển có state và side effect; độ tin cậy đến từ giới hạn và quan sát được.", "An agent is a control loop with state and side effects; reliability comes from limits and observability.", "Xây research agent tối giản có max steps, tool allowlist, memory state và bước phê duyệt trước side effect.", "Build a minimal research agent with max steps, a tool allowlist, memory state, and approval before side effects.", "Agent dừng đúng khi đạt mục tiêu hoặc gặp guardrail; mọi tool call có lý do, input và output để review.", "The agent stops when it reaches the goal or a guardrail, and every tool call has reviewable intent, input, and output."),
    stage(16, "phase-16-genai-mcp", "Model Context Protocol (MCP)", "Model Context Protocol (MCP)", "Hiểu kiến trúc MCP, client/server, tools, resources, prompts và security boundary.", "Understand MCP architecture, clients/servers, tools, resources, prompts, and security boundaries.", "mcp", "MCP architecture", "MCP architecture", [
        ("MCP architecture và message flow", "MCP architecture and message flow"),
        ("MCP client và server", "MCP clients and servers"),
        ("MCP tools và resources", "MCP tools and resources"),
        ("MCP prompts và security", "MCP prompts and security"),
    ], "MCP chuẩn hóa cách model khám phá context và capability, nhưng không loại bỏ trách nhiệm về quyền truy cập.", "MCP standardizes how models discover context and capabilities without removing access-control responsibility.", "Viết MCP server local cung cấp một resource và một tool read-only, kiểm tra schema và quyền truy cập.", "Write a local MCP server exposing one resource and one read-only tool, then test schemas and access control.", "Bạn vẽ được flow client/server, phân biệt tool với resource/prompt và nêu được threat model tối thiểu.", "You can draw the client/server flow, distinguish tools from resources/prompts, and state a minimum threat model."),
    stage(17, "phase-17-genai-evaluation", "Evaluation cho LLM, RAG và Agent", "Evaluation for LLMs, RAG, and Agents", "Đo quality, hallucination, faithfulness và metrics để mỗi thay đổi có bằng chứng.", "Measure quality, hallucination, faithfulness, and metrics so every change has evidence.", "genai-evaluation", "GenAI evaluation", "GenAI evaluation", [
        ("LLM evaluation và test set", "LLM evaluation and test sets"),
        ("RAG evaluation: retrieval và answer", "RAG evaluation: retrieval and answers"),
        ("Agent evaluation và trajectory", "Agent evaluation and trajectories"),
        ("Hallucination, faithfulness và metrics", "Hallucination, faithfulness, and metrics"),
    ], "Evaluation là cách phân biệt demo nghe hay với hệ thống đáng tin và có thể cải thiện.", "Evaluation distinguishes a fluent demo from a trustworthy system that can improve.", "Tạo golden set, rubric và regression suite cho RAG/agent; lưu cả lỗi và chi phí mỗi run.", "Create a golden set, rubric, and regression suite for RAG/agents, recording failures and cost for every run.", "Bạn biết metric nào đo retrieval, metric nào đo grounded answer và khi nào human review bắt buộc.", "You can identify retrieval metrics, grounded-answer metrics, and when human review is required."),
    stage(18, "phase-18-genai-observability", "Observability cho hệ thống AI", "Observability for AI Systems", "Theo dõi logging, tracing, token usage, latency, cost, dashboard và alert trong runtime.", "Track logging, tracing, token usage, latency, cost, dashboards, and alerts at runtime.", "genai-observability", "AI observability", "AI observability", [
        ("Structured logging và tracing", "Structured logging and tracing"),
        ("Token usage và latency", "Token usage and latency"),
        ("Cost monitoring và budget", "Cost monitoring and budgets"),
        ("Dashboard, alert và incident", "Dashboards, alerts, and incidents"),
    ], "Không có telemetry thì không biết lỗi nằm ở model, retrieval, provider hay hạ tầng.", "Without telemetry you cannot tell whether a failure is in the model, retrieval, provider, or infrastructure.", "Instrument một request end-to-end với trace id, token/cost fields, p50/p95 latency và alert budget.", "Instrument an end-to-end request with a trace ID, token/cost fields, p50/p95 latency, and a budget alert.", "Từ một trace bạn tìm được nguyên nhân của latency/cost spike mà không log prompt nhạy cảm.", "From one trace you can identify a latency or cost spike without logging sensitive prompts."),
    stage(19, "phase-19-genai-production", "Production Engineering cho GenAI", "Production Engineering for GenAI", "Đưa hệ thống lên production với caching, fallback, queue, worker, scaling và availability.", "Take the system to production with caching, fallbacks, queues, workers, scaling, and availability.", "genai-production", "Production GenAI systems", "Production GenAI systems", [
        ("Streaming và caching", "Streaming and caching"),
        ("Retry, fallback và rate limit", "Retries, fallbacks, and rate limits"),
        ("Queue và worker", "Queues and workers"),
        ("High availability và capacity", "High availability and capacity"),
    ], "Production quality là behavior khi provider chậm, lỗi, đắt hoặc traffic tăng chứ không chỉ happy path.", "Production quality is behavior when providers are slow, failing, expensive, or traffic grows—not just the happy path.", "Thiết kế service có cache policy, provider fallback, queue worker và load test đơn giản với SLO rõ ràng.", "Design a service with a cache policy, provider fallback, queue worker, and a small load test with explicit SLOs.", "Bạn giải thích được trade-off consistency, latency, cost và availability bằng số liệu đo được.", "You can explain consistency, latency, cost, and availability trade-offs with measured evidence."),
    stage(20, "phase-20-genai-finetuning", "Fine-tuning và PEFT", "Fine-tuning and PEFT", "Biết khi nào fine-tune, chuẩn bị dataset, SFT/LoRA/QLoRA, evaluation và quantization.", "Know when to fine-tune, prepare datasets, use SFT/LoRA/QLoRA, evaluate, and quantize.", "fine-tuning", "Fine-tuning decisions", "Fine-tuning decisions", [
        ("Dataset preparation và SFT", "Dataset preparation and SFT"),
        ("LoRA, QLoRA và PEFT", "LoRA, QLoRA, and PEFT"),
        ("Fine-tuning evaluation", "Fine-tuning evaluation"),
        ("Quantization và model trade-offs", "Quantization and model trade-offs"),
    ], "Fine-tuning chỉ đáng làm khi data và evaluation chứng minh prompting/RAG chưa giải quyết được vấn đề.", "Fine-tuning is justified only when data and evaluation show prompting/RAG are insufficient.", "Chuẩn bị dataset có split và license rõ ràng, chạy LoRA nhỏ, so sánh baseline và đo memory/quality.", "Prepare a dataset with explicit splits and licensing, run a small LoRA experiment, and compare memory and quality to baseline.", "Bạn bảo vệ được quyết định fine-tune hay không bằng quality, cost, data volume và maintenance risk.", "You can defend whether to fine-tune using quality, cost, data volume, and maintenance risk."),
    stage(21, "phase-21-genai-local-llm", "Local LLM và inference", "Local LLMs and Inference", "Chạy model local với Transformers, PyTorch, vLLM, GGUF và tối ưu GPU/inference.", "Run models locally with Transformers, PyTorch, vLLM, GGUF, and GPU/inference optimization.", "local-llm", "Local LLM serving", "Local LLM serving", [
        ("Transformers và PyTorch inference", "Transformers and PyTorch inference"),
        ("vLLM và serving throughput", "vLLM and serving throughput"),
        ("GGUF, quantization và Ollama", "GGUF, quantization, and Ollama"),
        ("GPU optimization và inference benchmark", "GPU optimization and inference benchmarks"),
    ], "Local LLM giúp hiểu rõ memory, throughput và trade-off giữa model size, quality và privacy.", "Local LLMs expose the trade-offs among memory, throughput, model size, quality, and privacy.", "Chạy một model nhỏ local, đo cold/warm latency, tokens/sec, VRAM và so sánh quantized với full precision.", "Run a small local model, measure cold/warm latency, tokens/sec, VRAM, and compare quantized with full precision.", "Bạn chọn được runtime theo hardware, workload và privacy requirement thay vì chọn theo trend.", "You can choose a runtime from hardware, workload, and privacy requirements rather than hype."),
    stage(22, "phase-22-genai-system-design", "AI System Design", "AI System Design", "Tổng hợp architecture, scalability, security, cost, model selection và thiết kế end-to-end.", "Synthesize architecture, scalability, security, cost, model selection, and end-to-end design.", "genai-system-design", "AI system design", "AI system design", [
        ("Architecture end-to-end cho AI product", "End-to-end architecture for an AI product"),
        ("Scalability, reliability và failure modes", "Scalability, reliability, and failure modes"),
        ("Security, cost optimization và model selection", "Security, cost optimization, and model selection"),
        ("Design review và capstone proposal", "Design review and capstone proposal"),
    ], "Senior AI Engineer phải giải thích quyết định hệ thống qua user value, reliability, security và cost.", "A senior AI Engineer explains system decisions through user value, reliability, security, and cost.", "Viết design doc cho Production GenAI System, có data flow, SLO, threat model, cost estimate và rollout plan.", "Write a design document for a Production GenAI System with data flow, SLOs, threat model, cost estimate, and rollout plan.", "Reviewer có thể lần theo từng quyết định, failure mode, metric và kế hoạch rollback trong design doc.", "A reviewer can trace every decision, failure mode, metric, and rollback plan in the design document."),
]


PROJECTS: list[dict[str, Any]] = [
    {
        "slug": "llm-chat-api",
        "title_vi": "LLM Chat API",
        "title_en": "LLM Chat API",
        "phase_id": "phase-11-llm-application",
        "problem_vi": "Xây API chat có prompt boundary, structured output, streaming, rate limit và fallback.",
        "problem_en": "Build a chat API with prompt boundaries, structured output, streaming, rate limits, and fallback.",
        "stack": ["Python", "FastAPI", "JSON Schema", "Docker"],
        "deliverables": ["API contract", "streaming demo", "rate-limit test", "cost log", "README"],
        "evaluation": "Schema validity, latency, retry behavior, rate-limit correctness, and cost per request.",
        "github_path": "projects/llm-chat-api",
        "estimated_weeks": 3,
        "track": "genai-specialization",
    },
    {
        "slug": "document-intelligence",
        "title_vi": "Document Intelligence System",
        "title_en": "Document Intelligence System",
        "phase_id": "phase-12-genai-rag",
        "problem_vi": "Parse tài liệu tiếng Việt, trích xuất thông tin và trả lời có evidence.",
        "problem_en": "Parse Vietnamese documents, extract information, and answer with evidence.",
        "stack": ["Python", "FastAPI", "PyMuPDF", "FAISS"],
        "deliverables": ["ingestion pipeline", "chunking policy", "metadata schema", "evidence API", "evaluation set"],
        "evaluation": "Parsing coverage, retrieval recall, grounded answer rate, and abstention quality.",
        "github_path": "projects/document-intelligence",
        "estimated_weeks": 4,
        "track": "genai-specialization",
    },
    {
        "slug": "advanced-rag-system",
        "title_vi": "Advanced RAG System",
        "title_en": "Advanced RAG System",
        "phase_id": "phase-13-genai-advanced-rag",
        "problem_vi": "So sánh BM25, vector, hybrid, reranking và query rewrite trên evaluation set cố định.",
        "problem_en": "Compare BM25, vector, hybrid retrieval, reranking, and query rewriting on a fixed evaluation set.",
        "stack": ["Python", "FAISS", "BM25", "Reranker", "Ragas"],
        "deliverables": ["retrieval benchmark", "failure slices", "citation policy", "quality report", "latency report"],
        "evaluation": "Recall@k, MRR, answer faithfulness, citation coverage, latency, and cost.",
        "github_path": "projects/advanced-rag-system",
        "estimated_weeks": 5,
        "track": "genai-specialization",
    },
    {
        "slug": "ai-database-api-assistant",
        "title_vi": "AI Assistant với Database và API",
        "title_en": "AI Assistant with Database and APIs",
        "phase_id": "phase-14-genai-tool-calling",
        "problem_vi": "Cho model gọi database/API qua tool schema có validation, timeout, retry và audit.",
        "problem_en": "Let a model call databases/APIs through validated tool schemas with timeouts, retries, and audit logs.",
        "stack": ["FastAPI", "SQLite/PostgreSQL", "Pydantic", "Tool calling"],
        "deliverables": ["tool registry", "validation tests", "idempotency key", "audit log", "security notes"],
        "evaluation": "Invalid-call rejection, side-effect safety, timeout behavior, and trace completeness.",
        "github_path": "projects/ai-database-api-assistant",
        "estimated_weeks": 4,
        "track": "genai-specialization",
    },
    {
        "slug": "research-assistant-agent",
        "title_vi": "Research Assistant Agent",
        "title_en": "Research Assistant Agent",
        "phase_id": "phase-15-genai-agents",
        "problem_vi": "Agent lập kế hoạch, tìm evidence, dùng tool có giới hạn và yêu cầu người duyệt trước side effect.",
        "problem_en": "An agent plans, gathers evidence, uses bounded tools, and requests approval before side effects.",
        "stack": ["Python", "FastAPI", "RAG", "MCP", "OpenTelemetry"],
        "deliverables": ["agent loop", "trajectory log", "human approval", "guardrail tests", "evaluation report"],
        "evaluation": "Task success, tool-call correctness, stop-condition compliance, faithfulness, and cost.",
        "github_path": "projects/research-assistant-agent",
        "estimated_weeks": 5,
        "track": "genai-specialization",
    },
    {
        "slug": "production-genai-system",
        "title_vi": "End-to-End Production GenAI System",
        "title_en": "End-to-End Production GenAI System",
        "phase_id": "phase-22-genai-system-design",
        "problem_vi": "Thiết kế và triển khai hệ thống GenAI có observability, evaluation, security, cost và rollback.",
        "problem_en": "Design and ship a GenAI system with observability, evaluation, security, cost controls, and rollback.",
        "stack": ["FastAPI", "Docker", "Redis", "MLflow/Langfuse", "GitHub Actions"],
        "deliverables": ["architecture ADR", "SLO/SLA", "threat model", "load test", "dashboard", "demo video"],
        "evaluation": "End-to-end reliability, reproducibility, p95 latency, cost budget, security, and rollback readiness.",
        "github_path": "projects/production-genai-system",
        "estimated_weeks": 8,
        "track": "genai-specialization",
    },
]


REFERENCE_RESOURCES = [
    ("anthropic-effective-agents", "Building effective agents", "Building effective agents", "Anthropic", "https://www.anthropic.com/research/building-effective-agents", "Engineering guide", ["phase-15", "phase-22"], "Bài viết chính thức về khi nào dùng workflow hay agent và cách giữ hệ thống đơn giản.", "Official guidance on when to use workflows or agents and how to keep systems simple.", "Đọc trước khi thiết kế agent loop; ghi rõ lý do agent cần thiết.", "Read before designing an agent loop and write down why an agent is necessary.", True),
    ("openai-function-calling", "Function calling guide", "Function calling guide", "OpenAI", "https://platform.openai.com/docs/guides/function-calling", "Official docs", ["phase-11", "phase-14"], "Tài liệu về gọi function, tool schema và structured arguments.", "Documentation for function calling, tool schemas, and structured arguments.", "Dùng để viết contract tool và test invalid arguments.", "Use it to define tool contracts and test invalid arguments.", True),
    ("json-schema-learning", "JSON Schema getting started", "JSON Schema getting started", "JSON Schema", "https://json-schema.org/learn/getting-started-step-by-step", "Official docs", ["phase-11", "phase-14"], "Nền tảng schema để kiểm tra structured output và tool input.", "Schema foundations for validating structured outputs and tool inputs.", "Viết schema trước code; tạo test cho field thiếu, sai kiểu và giá trị ngoài miền.", "Write the schema before code and test missing fields, wrong types, and out-of-range values.", True),
    ("model-context-protocol", "MCP getting started", "MCP getting started", "Model Context Protocol", "https://modelcontextprotocol.io/docs/getting-started/intro", "Official docs", ["phase-16"], "Giới thiệu kiến trúc MCP, client, server và capability discovery.", "Introduction to MCP architecture, clients, servers, and capability discovery.", "Đọc message flow rồi làm MCP server read-only local.", "Read the message flow before building a local read-only MCP server.", True),
    ("mcp-specification", "MCP specification", "MCP specification", "Model Context Protocol", "https://modelcontextprotocol.io/specification/2025-06-18", "Specification", ["phase-16"], "Đặc tả nguồn để kiểm tra tools, resources, prompts và security boundary.", "Normative reference for tools, resources, prompts, and security boundaries.", "Dùng khi cần phân biệt capability và quyền truy cập; không copy config mà không hiểu.", "Use it to distinguish capabilities from access rights; do not copy configuration blindly.", True),
    ("mcp-python-sdk", "MCP Python SDK", "MCP Python SDK", "Model Context Protocol", "https://github.com/modelcontextprotocol/python-sdk", "GitHub repo", ["phase-16"], "SDK Python để thực hành MCP client/server local.", "Python SDK for practicing local MCP clients and servers.", "Chọn một example nhỏ, thêm validation và test quyền truy cập.", "Choose one small example and add validation plus access-control tests.", True),
    ("ragas-docs", "Ragas documentation", "Ragas documentation", "Ragas", "https://docs.ragas.io/en/stable/", "Official docs", ["phase-13", "phase-17"], "Framework đánh giá RAG với dataset, metrics và experiment.", "A framework for RAG evaluation with datasets, metrics, and experiments.", "Dùng sau khi có golden set; lưu version metric cùng report.", "Use it after creating a golden set and version the metrics with the report.", False),
    ("openai-evals", "OpenAI Evals", "OpenAI Evals", "OpenAI", "https://github.com/openai/evals", "GitHub repo", ["phase-17"], "Framework và pattern để xây evaluation suite cho model.", "Framework and patterns for building model evaluation suites.", "Bắt đầu với evaluator deterministic trước khi thêm LLM judge.", "Start with deterministic evaluators before adding an LLM judge.", True),
    ("opentelemetry-python", "OpenTelemetry Python", "OpenTelemetry Python", "OpenTelemetry", "https://opentelemetry.io/docs/languages/python/", "Official docs", ["phase-18", "phase-19"], "Instrumentation chuẩn mở cho traces, metrics và logs.", "Open instrumentation standard for traces, metrics, and logs.", "Thêm trace id vào một request end-to-end và redact prompt nhạy cảm.", "Add a trace ID to one end-to-end request and redact sensitive prompts.", True),
    ("prometheus-overview", "Prometheus overview", "Prometheus overview", "Prometheus", "https://prometheus.io/docs/introduction/overview/", "Official docs", ["phase-18", "phase-19"], "Metrics time series và alerting cho service production.", "Time-series metrics and alerting for production services.", "Chọn ba metric có action rõ ràng: latency, errors và cost/budget.", "Choose three actionable metrics: latency, errors, and cost/budget.", True),
    ("langfuse-docs", "Langfuse documentation", "Langfuse documentation", "Langfuse", "https://langfuse.com/docs", "Official docs", ["phase-17", "phase-18"], "Tracing, prompt/version management và LLM cost observability.", "Tracing, prompt/version management, and LLM cost observability.", "Dùng để soi một trace lỗi; không log PII hoặc secret.", "Use it to inspect a failed trace without logging PII or secrets.", False),
    ("redis-docs", "Redis documentation", "Redis documentation", "Redis", "https://redis.io/docs/latest/", "Official docs", ["phase-19"], "Cache, queue primitives và rate-limit building blocks.", "Cache, queue primitives, and rate-limit building blocks.", "So sánh cache key, TTL và failure behavior trước khi đưa vào API.", "Compare cache keys, TTLs, and failure behavior before adding it to the API.", True),
    ("celery-docs", "Celery documentation", "Celery documentation", "Celery", "https://docs.celeryq.dev/en/stable/", "Official docs", ["phase-19"], "Task queue/worker pattern cho job inference hoặc ingestion dài.", "Task queue and worker patterns for long inference or ingestion jobs.", "Vẽ retry/idempotency trước khi chạy worker thật.", "Draw retry and idempotency behavior before running a real worker.", True),
    ("kubernetes-basics", "Kubernetes basics", "Kubernetes basics", "Kubernetes", "https://kubernetes.io/docs/tutorials/kubernetes-basics/", "Official docs", ["phase-19", "phase-22"], "Khái niệm deployment, service, scaling và rollout.", "Concepts for deployments, services, scaling, and rollouts.", "Chỉ học sau Docker; map từng object với một nhu cầu production cụ thể.", "Study it after Docker and map each object to a concrete production need.", True),
    ("hugging-face-trl", "TRL documentation", "TRL documentation", "Hugging Face", "https://huggingface.co/docs/trl/index", "Official docs", ["phase-20"], "Thư viện training và alignment cho SFT, preference optimization.", "Training and alignment library for SFT and preference optimization.", "Đọc data collator và evaluation trước khi chạy fine-tuning.", "Read the data collator and evaluation sections before fine-tuning.", True),
    ("hugging-face-bitsandbytes", "bitsandbytes documentation", "bitsandbytes documentation", "Hugging Face", "https://huggingface.co/docs/bitsandbytes/main/en/index", "Official docs", ["phase-20", "phase-21"], "Quantization và optimizer 8-bit/4-bit cho model lớn.", "Quantization and 8-bit/4-bit optimizers for larger models.", "Đo quality và memory trước/sau quantization; lưu hardware context.", "Measure quality and memory before and after quantization and record hardware context.", True),
    ("vllm-docs", "vLLM documentation", "vLLM documentation", "vLLM", "https://docs.vllm.ai/en/latest/", "Official docs", ["phase-21", "phase-22"], "Serving LLM high-throughput với batching và OpenAI-compatible API.", "High-throughput LLM serving with batching and an OpenAI-compatible API.", "Benchmark tokens/sec và p95 trên cùng prompt set với runtime khác.", "Benchmark tokens/sec and p95 on the same prompt set against another runtime.", True),
    ("ollama-docs", "Ollama documentation", "Ollama documentation", "Ollama", "https://docs.ollama.com/", "Official docs", ["phase-21"], "Cách chạy model local nhanh để học inference và prototyping.", "A fast way to run local models for inference learning and prototyping.", "Dùng model nhỏ, ghi rõ RAM/VRAM và không coi kết quả local là production benchmark.", "Use a small model, record RAM/VRAM, and do not treat local results as production benchmarks.", True),
    ("llama-cpp", "llama.cpp", "llama.cpp", "ggml-org", "https://github.com/ggml-org/llama.cpp", "GitHub repo", ["phase-21"], "Runtime C/C++ phổ biến cho model GGUF và local inference.", "A popular C/C++ runtime for GGUF models and local inference.", "Đọc quantization/runtime trade-off rồi chạy một model nhỏ.", "Read the quantization/runtime trade-offs before running a small model.", False),
    ("elasticsearch-bm25", "Elasticsearch text relevance", "Elasticsearch text relevance", "Elastic", "https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html", "Official docs", ["phase-13"], "Reference cho inverted index, BM25 và text retrieval.", "Reference for inverted indexes, BM25, and text retrieval.", "Dùng để giải thích vì sao hybrid search bổ sung lexical signal cho vector.", "Use it to explain why hybrid search adds lexical signals to vectors.", True),
]


def main() -> None:
    curriculum = json.loads(CURRICULUM_PATH.read_text(encoding="utf-8"))
    existing_phase_slugs = {phase["slug"] for phase in curriculum["phases"]}
    for item in STAGES:
        if item["slug"] in existing_phase_slugs:
            continue
        curriculum["phases"].append({
            "slug": item["slug"],
            "order": item["order"],
            "duration_weeks": 1,
            "track": "genai-specialization",
            "title_vi": item["title_vi"],
            "title_en": item["title_en"],
            "summary_vi": item["summary_vi"],
            "summary_en": item["summary_en"],
            "modules": [{
                "slug": item["module_slug"],
                "title_vi": item["module_vi"],
                "title_en": item["module_en"],
                "lessons": [lesson[0] for lesson in item["lessons"]],
            }],
            "resources": [],
        })

    program = curriculum["program"]
    program["standard_weeks"] = 68
    program["accelerated_weeks"] = 34
    program["description_vi"] = "Chương trình core 8 phase và GenAI specialization 15 giai đoạn, đi từ nền tảng đến xây dựng, đánh giá và vận hành hệ thống AI production."
    program["description_en"] = "An 8-phase core plus a 15-stage GenAI specialization, from foundations to building, evaluating, and operating production AI systems."
    project_slugs = {project["slug"] for project in program.get("portfolio_projects", [])}
    program["portfolio_projects"] = program.get("portfolio_projects", []) + [project for project in PROJECTS if project["slug"] not in project_slugs]
    program["career_checklist"] = list(dict.fromkeys(program.get("career_checklist", []) + [
        "Có LLM Chat API, Document Intelligence và Advanced RAG với evaluation set rõ ràng.",
        "Có một tool-calling/agent project ghi trajectory, guardrail và human approval.",
        "Có MCP hoặc local LLM lab kèm threat model, hardware context và benchmark.",
        "Có production GenAI design doc nêu SLO, cost budget, observability và rollback.",
    ]))
    CURRICULUM_PATH.write_text(json.dumps(curriculum, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    guides = json.loads(GUIDES_PATH.read_text(encoding="utf-8"))
    guide_modules = guides.setdefault("modules", {})
    for item in STAGES:
        guide_modules.setdefault(item["module_slug"], {
            "focus_vi": item["focus_vi"],
            "focus_en": item["focus_en"],
            "practice_vi": item["practice_vi"],
            "practice_en": item["practice_en"],
            "checkpoint_vi": item["checkpoint_vi"],
            "checkpoint_en": item["checkpoint_en"],
            "deliverables_vi": ["Một implementation nhỏ chạy được", "Một test hoặc benchmark", "Một note về failure mode và trade-off"],
            "deliverables_en": ["One working implementation", "One test or benchmark", "One note on failure modes and trade-offs"],
        })
    GUIDES_PATH.write_text(json.dumps(guides, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    resource_payload = json.loads(RESOURCES_PATH.read_text(encoding="utf-8"))
    existing_resource_slugs = {resource["slug"] for resource in resource_payload.get("resources", [])}
    for resource in resource_payload.get("resources", []):
        if resource.get("url") == "https://github.com/rohitg00/ai-engineering-from-scratch":
            resource["phase_ids"] = [f"phase-{index:02d}" for index in range(len(curriculum["phases"]))]
    for slug, title_vi, title_en, provider, url, resource_type, phase_ids, description_vi, description_en, how_vi, how_en, official in REFERENCE_RESOURCES:
        if slug in existing_resource_slugs:
            continue
        resource_payload["resources"].append({
            "slug": slug,
            "title_vi": title_vi,
            "title_en": title_en,
            "provider": provider,
            "url": url,
            "type": resource_type,
            "language": "en",
            "level": "intermediate",
            "official": official,
            "phase_ids": phase_ids,
            "description_vi": description_vi,
            "description_en": description_en,
            "how_to_use_vi": how_vi,
            "how_to_use_en": how_en,
        })
    RESOURCES_PATH.write_text(json.dumps(resource_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"GenAI track ready: {len(STAGES)} stages, {sum(len(item['lessons']) for item in STAGES)} lessons, {len(PROJECTS)} projects")


if __name__ == "__main__":
    main()
