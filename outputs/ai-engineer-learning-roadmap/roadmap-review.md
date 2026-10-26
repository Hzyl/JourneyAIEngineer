# Roadmap Review — Phát hiện vấn đề và đề xuất nâng cấp

> Tài liệu tổng hợp: issues, trùng lặp, phân nhánh chuyên sâu, đề xuất song ngữ.
> Dựa trên phân tích 23 phases, 208 lessons, 3 learning routes, 37 module guides.

---

## 1. Tổng hợp vấn đề (Issues Summary)

### Thứ tự chưa hợp lý

| # | Vấn đề | Phase liên quan | Mức |
|---|---|---|---|
| I1 | FastAPI/Docker (phase-05) ở **sau** Deep Learning (phase-04). Trong thực tế, người học cần HTTP/REST/API serving trước khi triển khai model. | phase-05 vs phase-01 | P0 |
| I2 | Route "application" nhảy phase-00→08→09→11→12, bỏ qua toán. Nhưng phase-09 dạy embedding/cosine similarity — cần linear algebra. | learning_routes.json "application" | P0 |
| I3 | Module "adaptation" trong phase-06 giới thiệu agent + fine-tuning trước khi học tool calling (phase-14) và fine-tuning chi tiết (phase-20). | phase-06 adaptation | P1 |

### Prerequisite thiếu

| # | Vấn đề | Mức |
|---|---|---|
| I4 | Phase-09 (GenAI ML fundamentals) cần linear algebra basics nhưng không ghi prerequisite. | P0 |
| I5 | Phase-12/13 (RAG) projects dùng FastAPI nhưng route "application" chưa dạy FastAPI riêng. Phase-08 chỉ review nhanh. | P1 |
| I6 | Phase-15 (agents) cần phase-14 (tool calling) — đúng thứ tự trong accelerated track, nhưng phase-06 adaptation đã nhắc agent trước. | P1 |

### Nội dung trùng lặp

| # | Chủ đề | Xuất hiện ở | Mức |
|---|---|---|---|
| I7 | Embedding & cosine similarity | phase-02, phase-04, phase-06, phase-09 (4 lần) | P1 |
| I8 | Transformer/attention | phase-04 (intro), phase-06 (prompting), phase-10 (deep) | P1 |
| I9 | RAG pipeline | phase-06 (core, 8 bài), phase-12 (GenAI, 4 bài) | P1 |
| I10 | Fine-tuning/LoRA | phase-06 adaptation, phase-20 (dedicated) | P1 |
| I11 | Observability | phase-05 (ML ops), phase-18 (GenAI ops) | P1 |
| I12 | FastAPI/Docker basics | phase-05, phase-08 | P1 |

### Phần quá rộng

| # | Phase | Bài | Modules | Vấn đề | Mức |
|---|---|---|---|---|---|
| I13 | phase-06 | 24 | 6 | Gộp NLP + Transformer + Retrieval + RAG + Quality + Adaptation | P1 |
| I14 | phase-05 | 20 | 5 | Trộn software engineering (API/Docker) với ML engineering (tracking/drift) | P1 |

### Thiếu thực hành

| # | Vấn đề | Mức |
|---|---|---|
| I15 | 198/208 bài là draft (chưa rà soát) | P2 |
| I16 | `projects/` folder chỉ có README scaffold 1KB | P1 |
| I17 | GenAI phases (08–22) chưa có worked solutions | P2 |

### Thuật ngữ

| # | Thuật ngữ | Bối cảnh | Đề xuất | Mức |
|---|---|---|---|---|
| I18 | "Adaptation" | Module slug trong phase-06 | Đổi thành "model-selection" hoặc tách agent riêng | P2 |
| I19 | "Baseline" | 2 nghĩa: self-assessment (phase-00) vs dummy model (phase-03) | Ghi rõ ngữ cảnh | P2 |

---

## 2. Đề xuất nâng cấp theo mức độ (chi tiết)

### P0 — Cần sửa để roadmap không gây học sai

**P0-1: Ghi prerequisite toán cho route "application"**
- Hiện tại: Route "application" nhảy từ phase-00 → phase-08, phase-09 dạy "Embedding và tìm kiếm tương đồng" nhưng không yêu cầu linear algebra.
- Sửa: Thêm note trong learning_routes.json hoặc phase-09 rằng cần ít nhất: dot product, cosine similarity, norm (phase-02 linear-algebra bài 1–3).
- Không cần học toàn bộ phase-02 cho route này. Chỉ cần 3/16 bài toán.
- Cơ sở: module_guides.json → genai-ml-fundamentals → "Embedding và tìm kiếm tương đồng" — cần hiểu cosine similarity.

**P0-2: Annotation rõ core vs GenAI RAG**
- Hiện tại: phase-06 (core) có 8 bài retrieval+rag. Phase-12/13 (GenAI) có 8 bài RAG foundations + advanced RAG.
- Vấn đề: Người học route "deep-ml" và route "application" đều gặp RAG, nhưng ở phases khác nhau.
- Sửa: Ghi rõ trong module guide hoặc lesson: "Nếu theo route application → dùng phase-12/13. Nếu theo route deep-ml → dùng phase-06 retrieval/rag."

**P0-3: Đảm bảo HTTP/REST cho route "application"**
- Phase-08 (genai-software) review nhanh "REST API, SQL và Docker cho AI" trong 1 bài (bài 3).
- Nếu người học chưa biết HTTP/REST, 1 bài review không đủ.
- Sửa: Ghi prerequisite: "Cần biết HTTP/REST/JSON. Nếu chưa → đọc phase-01 developer-tools-4 trước."

### P1 — Nên sửa để học hiệu quả hơn

**P1-1: Label mức độ cho nội dung trùng**
- Embedding: "Giới thiệu (phase-02)" → "Ứng dụng trong DL (phase-04)" → "NLP context (phase-06)" → "GenAI recap (phase-09)"
- Transformer: "Overview (phase-04-4)" → "Prompting (phase-06)" → "Deep dive (phase-10)"
- RAG: "Core (phase-06)" → "GenAI foundations (phase-12)" → "Advanced (phase-13)"

**P1-2: Tách phase-06**
- Đề xuất: NLP+Transformers (bài 1–8), Retrieval+RAG (bài 9–16), Quality+Adaptation (bài 17–24)
- Giữ nguyên lesson ID, chỉ regroup modules.

**P1-3: Scaffold portfolio projects**
- Tạo template trong `projects/`: problem_statement.md, evaluation_template.md, model_card_template.md
- Mỗi project folder: README template, .gitkeep cho src/tests/data

**P1-4: Skip/review list cụ thể cho mỗi route**
- Foundation: học tất cả phase-00 → phase-03
- Application: skip phase-01–06 nếu pass baseline, nhưng đọc phase-01 developer-tools-4 + phase-02 linear-algebra bài 1–3
- Deep ML: học tất cả, có thể skip phase-00 baseline nếu đã có kinh nghiệm

### P2 — Nâng cấp khi có thời gian

**P2-1**: Worked solutions cho GenAI phases
**P2-2**: Estimated time cho từng module (tổng hợp từ lesson workload)
**P2-3**: Common mistakes section cho module guides
**P2-4**: Đổi slug "adaptation" thành tên rõ hơn
**P2-5**: Thêm "decision tree" cho lúc chọn route (interactive flowchart)

---

## 3. Phân nhánh chuyên sâu sau Core

Sau khi hoàn thành phần nền tảng (Chặng 0–7 hoặc phase-00 → phase-07), người học chọn hướng:

### Hướng A: LLM/RAG Engineer

| Tiêu chí | Nội dung |
|---|---|
| **Kiến thức cần thêm** | Chunking nâng cao, hybrid retrieval, reranking, evaluation pipeline, prompt engineering |
| **Project nên làm** | Vietnamese Document Assistant (RAG), Document Intelligence System |
| **Công cụ nên biết** | FAISS, Qdrant, sentence-transformers, LangChain/LlamaIndex (tham khảo), Ragas |
| **Phase trong repo** | phase-11, 12, 13, 17, 18, 19 |
| **Ưu tiên** | Cao — đây là hướng chính của AI Engineer hiện tại |
| **Chưa cần học ngay** | Fine-tuning (phase-20), local LLM (phase-21), system design nâng cao (phase-22) |

### Hướng B: ML Platform / MLOps Engineer

| Tiêu chí | Nội dung |
|---|---|
| **Kiến thức cần thêm** | CI/CD cho ML, model registry, data versioning, A/B testing, feature store |
| **Project nên làm** | ML Service API với Docker + CI, experiment tracking dashboard |
| **Công cụ nên biết** | MLflow, DVC, Docker Compose, GitHub Actions, Prometheus/Grafana |
| **Phase trong repo** | phase-05 (đào sâu), phase-18 (observability), phase-19 (production) |
| **Ưu tiên** | Trung bình — phù hợp nếu thích infra hơn model |
| **Chưa cần học ngay** | Agent/MCP (phase-15, 16), fine-tuning |

### Hướng C: Computer Vision Engineer

| Tiêu chí | Nội dung |
|---|---|
| **Kiến thức cần thêm** | CNN architectures (ResNet, EfficientNet), object detection, segmentation, video |
| **Project nên làm** | DL Classifier (mở rộng), custom object detector |
| **Công cụ nên biết** | PyTorch, torchvision, OpenCV, Albumentations, ONNX |
| **Phase trong repo** | phase-04 (vision-nlp module), phase-05 (API serving) |
| **Ưu tiên** | Trung bình — hẹp hơn nhưng chuyên sâu |
| **Chưa cần học ngay** | LLM/RAG (phase-06, 11–13), agent (phase-15) |

### Hướng D: NLP / Multimodal Engineer

| Tiêu chí | Nội dung |
|---|---|
| **Kiến thức cần thêm** | Transformer chi tiết, fine-tuning (SFT, RLHF), multilingual models, multimodal |
| **Project nên làm** | Text classifier, Vietnamese NER, multimodal search |
| **Công cụ nên biết** | Hugging Face Transformers, Tokenizers, PEFT, Datasets |
| **Phase trong repo** | phase-06 (nlp-foundations, transformers), phase-10, phase-20 |
| **Ưu tiên** | Trung bình — đòi hỏi GPU |
| **Chưa cần học ngay** | Agent/MCP, system design nâng cao |

### Hướng E: Applied ML Engineer

| Tiêu chí | Nội dung |
|---|---|
| **Kiến thức cần thêm** | Time series, recommendation, tabular deep learning, AutoML |
| **Project nên làm** | Tabular ML (mở rộng), forecasting service, recommendation API |
| **Công cụ nên biết** | scikit-learn, XGBoost, LightGBM, Optuna, SHAP |
| **Phase trong repo** | phase-03 (đào sâu), phase-05 (serving) |
| **Ưu tiên** | Trung bình — nhiều việc nhưng ít "AI Engineer" hype |
| **Chưa cần học ngay** | LLM/RAG, agent, fine-tuning |

---

## 4. Bản song ngữ tóm tắt

### Tiếng Việt

**Lộ trình Journey AI Engineer** có 23 giai đoạn (208 bài học), chia thành 8 giai đoạn nền tảng và 15 giai đoạn chuyên sâu GenAI. Roadmap bao phủ đầy đủ 11 chặng năng lực từ "chưa biết gì" đến "sẵn sàng chuẩn bị ứng tuyển".

**Điểm mạnh**: phạm vi rộng, song ngữ, có module guides rõ ràng, có study playbook, có lab notebooks thực hành.

**Điểm cần cải thiện**: prerequisite chưa tường minh cho route "application" (thiếu toán), nội dung trùng lặp giữa core và GenAI chưa được label rõ, phase-06 quá lớn (24 bài/6 modules).

**Không hứa hẹn việc làm**. Hoàn thành roadmap là mốc "sẵn sàng chuẩn bị ứng tuyển", cần tiếp tục luyện qua project thực tế và phỏng vấn.

### English

**Journey AI Engineer** contains 23 phases (208 lessons): 8 core phases and 15 GenAI specialization phases. The roadmap fully covers all 11 competency stages from "complete beginner" to "ready to prepare for applications".

**Strengths**: comprehensive scope, bilingual content, clear module guides with checkpoints, study playbook, hands-on lab notebooks.

**Areas for improvement**: prerequisites not explicit for the "application" route (math gaps), overlapping content between core and GenAI tracks not clearly labeled, phase-06 too large (24 lessons/6 modules).

**No employment guarantee**. Completing the roadmap marks "ready to start preparing for applications" — continued practice through real projects and interviews is essential.

---

## 5. Nguồn và độ tin cậy (Transparency)

| Loại | Ghi chú |
|---|---|
| **Đã kiểm tra từ repo** | Cấu trúc phases/modules/lessons (curriculum.json), learning routes, module guides, study playbook, research integration notes, notebooks, samples |
| **Dựa trên nguồn chính thức** | Tên công cụ và framework (Python, PyTorch, FastAPI, scikit-learn, Hugging Face, Docker) — từ resources.json |
| **Đề xuất thiết kế curriculum** | Thứ tự chặng, prerequisite chains, project ladder, specialization tracks — dựa trên cấu trúc repo + kiến thức domain |
| **Chưa được xác minh** | Nội dung chi tiết 198 bài draft, worked solutions, tất cả external links, chất lượng từng ví dụ code |
| **Roadmap KHÔNG phải lời hứa việc làm** | Đây là thiết kế curriculum, không phải cam kết tuyển dụng |

---

*File này kết hợp: phát hiện vấn đề, đề xuất ưu tiên, phân nhánh chuyên sâu và bản song ngữ.*
*Dữ liệu từ curriculum.json, learning_routes.json, module_guides.json, RESEARCH-INTEGRATION.md.*
