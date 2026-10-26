# Project Ladder — Thang dự án từ cơ bản đến capstone

> Mỗi project xây trên kiến thức của project trước.
> Dữ liệu portfolio_projects từ curriculum.json, đối chiếu module_guides.json.

---

## Project 0: Python Package (Tooling)

| Tiêu chí | Nội dung |
|---|---|
| **Mục tiêu** | Viết package Python nhỏ có cấu trúc, test và README |
| **Kiến thức cần có** | Chặng 0 + Chặng 1: Python syntax, function, module, typing, pytest, Git |
| **Phase tương ứng** | phase-01-python-software |
| **Output** | Package có `__init__.py`, hàm thuần, type hints, pytest tests, `.gitignore`, README |
| **Test/Evaluation** | pytest pass, edge cases covered, import từ package khác thành công |
| **Artifact đưa lên GitHub** | `projects/python-tooling/` — source, tests, README, requirements.txt |
| **Tiêu chí project đủ tốt** | Người khác cài được (`pip install -e .`), chạy test pass, README giải thích mục đích và cách dùng |

### Ví dụ cụ thể
- Data validator: kiểm tra schema CSV/JSON, báo lỗi dòng nào
- CLI tool: đọc file, xử lý, xuất kết quả, có argparse

---

## Project 1: Classical ML Pipeline

| Tiêu chí | Nội dung |
|---|---|
| **Mục tiêu** | Xây pipeline ML có thể tái lập: từ dữ liệu đến model card |
| **Kiến thức cần có** | Project 0 + Chặng 3 (toán) + Chặng 4 (ML cổ điển) |
| **Phase tương ứng** | phase-03-classical-ml |
| **Output** | Data dictionary, baseline (dummy/majority), pipeline (sklearn), error analysis, model card |
| **Test/Evaluation** | Hold-out test, cross-validation, metric rationale, error slices by group |
| **Artifact đưa lên GitHub** | `projects/tabular-ml/` — notebook/script, data dictionary, model card, README |
| **Tiêu chí project đủ tốt** | Có baseline → improved model comparison. Metric gắn với chi phí lỗi. Error analysis chỉ ra model sai ở đâu, với nhóm nào. |

### Từ curriculum.json
- Slug: `tabular-ml`
- Problem: "Predict churn, fraud or demand with a reproducible ML pipeline"
- Stack: Python, pandas, scikit-learn, pytest
- Estimated: 3 tuần

---

## Project 2: Deep Learning Classifier

| Tiêu chí | Nội dung |
|---|---|
| **Mục tiêu** | Huấn luyện model DL, phân tích overfitting, quản lý checkpoint |
| **Kiến thức cần có** | Project 1 + Chặng 5 (Deep Learning) |
| **Phase tương ứng** | phase-04-deep-learning |
| **Output** | Training loop, dataset card, confusion matrix, checkpoint, experiment report |
| **Test/Evaluation** | Validation protocol, ablation/optimizer comparison, failure analysis |
| **Artifact đưa lên GitHub** | `projects/deep-learning/` — training script, dataset card, experiment report, README |
| **Tiêu chí project đủ tốt** | Train/val curves cho thấy kiểm soát overfitting. Có checkpoint có thể resume. Report giải thích decisions (LR, batch size, augmentation). |

### Từ curriculum.json
- Slug: `deep-learning`
- Stack: PyTorch, NumPy, TensorBoard or MLflow
- Estimated: 4 tuần

---

## Project 3: API / ML Service

| Tiêu chí | Nội dung |
|---|---|
| **Mục tiêu** | Đóng gói model thành API có test, Docker, monitoring |
| **Kiến thức cần có** | Project 2 + Chặng 2 (FastAPI, Docker) + Chặng 6 (tracking, observability) |
| **Phase tương ứng** | phase-05-mlops |
| **Output** | FastAPI service, health check, Docker image, CI pipeline, structured logs, model versioning |
| **Test/Evaluation** | Unit + integration test, valid/invalid request tests, p50/p95 latency, rollback runbook |
| **Artifact đưa lên GitHub** | `projects/ml-service/` — API code, Dockerfile, tests, CI config, README |
| **Tiêu chí project đủ tốt** | Người khác chạy `docker build && docker run`, gọi API, nhận response đúng schema. Model thay được mà không sửa API. Có log + health check. |

### Ghi chú
Repo hiện chưa khai báo project riêng cho ML service, nhưng phase-05 module guides (api, containers) mô tả rõ deliverables.

---

## Project 4: RAG Application (Vietnamese Document Assistant)

| Tiêu chí | Nội dung |
|---|---|
| **Mục tiêu** | Trợ lý tài liệu tiếng Việt có retrieval, citation, abstention |
| **Kiến thức cần có** | Project 3 + Chặng 7 (LLM/NLP) + Chặng 8 (RAG) |
| **Phase tương ứng** | phase-06-llm-rag + phase-12-genai-rag |
| **Output** | Chunking policy, evaluation set (30 questions), retrieval metrics, citation UI, cost/latency log |
| **Test/Evaluation** | Retrieval recall, answer faithfulness, abstention quality, latency, cost |
| **Artifact đưa lên GitHub** | `projects/vietnamese-rag/` — ingestion, retrieval, API, evaluation set, README |
| **Tiêu chí project đủ tốt** | Trả lời có trích nguồn. Từ chối khi không đủ bằng chứng. Evaluation set có câu đúng, câu phải từ chối, câu mơ hồ. Failure cases được phân loại. |

### Từ curriculum.json
- Slug: `vietnamese-rag`
- Stack: FastAPI, sentence-transformers, FAISS, LLM provider or Ollama
- Estimated: 5 tuần

### Repo hiện có
- `samples/vi-document-assistant/` — ví dụ RAG không cần LLM, 12 ca đánh giá ban đầu
- Lab A notebook — 30 câu hỏi (20 có đáp án, 5 thiếu bằng chứng, 5 mơ hồ)

---

## Project 5: Agent with Evaluation

| Tiêu chí | Nội dung |
|---|---|
| **Mục tiêu** | Agent dùng tool giả lập, có giới hạn, test lỗi, evaluation report |
| **Kiến thức cần có** | Project 4 + Chặng 9 (Agent, tool calling, evaluation) |
| **Phase tương ứng** | phase-14 + phase-15 + phase-17 |
| **Output** | Agent loop, trajectory log, human approval, guardrail tests, evaluation report |
| **Test/Evaluation** | Task success rate, tool-call correctness, stop-condition compliance, faithfulness, cost |
| **Artifact đưa lên GitHub** | `projects/research-assistant-agent/` — agent code, tool stubs, tests, eval report, README |
| **Tiêu chí project đủ tốt** | Agent dừng đúng (max steps hoặc goal). Mỗi tool call có logged intent/input/output. Guardrail test chặn lời gọi không hợp lệ. Budget/timeout hoạt động. |

### Từ curriculum.json
- Slug: `research-assistant-agent`
- Stack: Python, FastAPI, RAG, MCP, OpenTelemetry
- Estimated: 5 tuần

### Repo hiện có
- Lab B notebook — workflow vs agent, tool giả lập, checkpoint
- Lab C notebook — phân quyền, security regression

---

## Capstone: AI Product

| Tiêu chí | Nội dung |
|---|---|
| **Mục tiêu** | Chọn vấn đề thực, xây MVP có kiến trúc, đánh giá, demo |
| **Kiến thức cần có** | Tất cả projects trước + Chặng 10 (production, portfolio, career) |
| **Phase tương ứng** | phase-07-capstone-career + phase-18, 19, 22 |
| **Output** | Problem statement, architecture diagram, MVP, evaluation report, demo video, interview story |
| **Test/Evaluation** | User value, reliability, reproducibility, observability, clear trade-offs |
| **Artifact đưa lên GitHub** | `projects/capstone-ai-product/` — toàn bộ code, docs, tests, README |
| **Tiêu chí project đủ tốt** | Reviewer hiểu: xây gì, cho ai, thước đo gì, trong 2 phút đọc README. Demo chạy được từ clone. Có known limitations. |

### Từ curriculum.json
- Slug: `capstone-ai-product`
- Stack: Python, FastAPI, Docker, GitHub Actions
- Estimated: 6 tuần

---

## Tổng quan Project Ladder

```
Project 0     Project 1      Project 2       Project 3       Project 4       Project 5      Capstone
Python pkg → Tabular ML → DL Classifier → ML Service → Vietnamese RAG → Research Agent → AI Product
  (P01)        (P03)          (P04)          (P05)         (P06+P12)       (P14+P15)       (P07)
 1-2 tuần     3 tuần         4 tuần         3-4 tuần       5 tuần          5 tuần         6 tuần
                                                                                      ≈ 27-29 tuần
                                                                                      cho projects
```

> Tổng thời gian dành cho projects: ~27–29 tuần (nằm trong tổng 57 tuần critical path, không cộng thêm).

---

## Lưu ý quan trọng

1. **Mỗi project xây trên project trước** — không nhảy cóc. Project 4 (RAG) cần API serving skills từ Project 3.

2. **Portfolio bắt đầu tích lũy từ Project 1** — không đợi đến Capstone. Mỗi project đều đưa lên GitHub với README.

3. **Tiêu chí "đủ tốt" không phải tiêu chí "hoàn hảo"** — focus vào: có baseline, có metric, có error analysis, có limitations. Không cần state-of-the-art accuracy.

4. **Thời gian ước tính từ curriculum.json** — thực tế phụ thuộc vào nền tảng và thời gian đầu tư mỗi tuần.

---

*Dữ liệu từ curriculum.json (portfolio_projects, phases), module_guides.json (deliverables), và repo samples.*
