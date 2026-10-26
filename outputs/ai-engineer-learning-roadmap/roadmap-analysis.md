# Phân tích Roadmap học AI Engineer — Journey AI Engineer

> Phân tích dựa trên dữ liệu thật từ repo `JourneyAIEngineer` tại commit hiện tại.
> Không dùng số liệu mặc định hoặc giả định từ trí nhớ.

---

## 1. Tổng quan Roadmap hiện tại trong repo

### Dữ liệu đã đọc

| Nguồn | Nội dung |
|---|---|
| `curriculum.json` | 23 phases (phase-00 → phase-22), 208 bài học, 10 portfolio projects, accelerated track 34 tuần |
| `lessons.json` | 208 bài (3.8 MB), nội dung song ngữ Việt/Anh |
| `content/lessons/*.md` | 208 file markdown, mỗi file ~16–35 KB |
| `module_guides.json` | 37 module guides với focus, practice, checkpoint |
| `learning_routes.json` | 3 hướng học: Foundation, Application, Deep ML |
| `exercises.json` | Bài tập (79 KB) |
| `resources.json` | 59 tài nguyên tham khảo |
| `study-playbook.md` | Hướng dẫn cách học, nhịp tuần, chuẩn evidence |
| `RESEARCH-INTEGRATION.md` | Ghi chú tích hợp nghiên cứu, kiểm chứng |
| `notebooks/` | 3 lab notebooks (A: evidence retrieval, B: workflow agent, C: security regression) |
| `samples/vi-document-assistant/` | Ví dụ trợ lý tài liệu tiếng Việt |

### Cấu trúc Phase hiện tại

| # | Phase ID | Tên | Track | Tuần | Module | Bài |
|---|---|---|---|---|---|---|
| 0 | phase-00-onboarding | Bắt đầu và đánh giá đầu vào | Core | 1 | 3 | 12 |
| 1 | phase-01-python-software | Python và kỹ thuật phần mềm | Core | 6 | 5 | 20 |
| 2 | phase-02-math-ml | Toán cho AI và học máy | Core | 6 | 4 | 16 |
| 3 | phase-03-classical-ml | Học máy cổ điển | Core | 8 | 5 | 20 |
| 4 | phase-04-deep-learning | Học sâu với PyTorch | Core | 8 | 5 | 20 |
| 5 | phase-05-mlops | Triển khai và MLOps | Core | 8 | 5 | 20 |
| 6 | phase-06-llm-rag | NLP, LLMs và RAG | Core | 10 | 6 | 24 |
| 7 | phase-07-capstone-career | Đồ án, portfolio, ứng tuyển | Core | 6 | 4 | 16 |
| 8 | phase-08-genai-software | Kỹ thuật phần mềm cho GenAI | GenAI | 1 | 1 | 4 |
| 9 | phase-09-genai-ml-fundamentals | Nền tảng ML cho GenAI | GenAI | 1 | 1 | 4 |
| 10 | phase-10-genai-transformers | Học sâu và Transformer | GenAI | 1 | 1 | 4 |
| 11 | phase-11-llm-application | Phát triển ứng dụng LLM | GenAI | 1 | 1 | 4 |
| 12 | phase-12-genai-rag | RAG nền tảng | GenAI | 1 | 1 | 4 |
| 13 | phase-13-genai-advanced-rag | RAG nâng cao | GenAI | 1 | 1 | 4 |
| 14 | phase-14-genai-tool-calling | Gọi công cụ | GenAI | 1 | 1 | 4 |
| 15 | phase-15-genai-agents | Agent AI | GenAI | 1 | 1 | 4 |
| 16 | phase-16-genai-mcp | Model Context Protocol | GenAI | 1 | 1 | 4 |
| 17 | phase-17-genai-evaluation | Đánh giá LLM/RAG/Agent | GenAI | 1 | 1 | 4 |
| 18 | phase-18-genai-observability | Theo dõi vận hành | GenAI | 1 | 1 | 4 |
| 19 | phase-19-genai-production | Vận hành GenAI | GenAI | 1 | 1 | 4 |
| 20 | phase-20-genai-finetuning | Tinh chỉnh và PEFT | GenAI | 1 | 1 | 4 |
| 21 | phase-21-genai-local-llm | Mô hình cục bộ | GenAI | 1 | 1 | 4 |
| 22 | phase-22-genai-system-design | Thiết kế hệ thống AI | GenAI | 1 | 1 | 4 |
| | **Tổng** | | | **68** | **50** | **208** |

### Nhãn chất lượng
- **10 bài reviewed** (đã rà soát)
- **198 bài draft** (bản nháp, đang tiếp tục biên tập)

---

## 2. Đối chiếu Roadmap hiện tại với 11 Chặng năng lực

| Chặng | Chủ đề | Phase trong repo | Mức bao phủ |
|---|---|---|---|
| **0** — Định hướng | AI Engineer làm gì, phân biệt vai trò, cách học | phase-00 (3 module, 12 bài) | ✅ Đầy đủ |
| **1** — Công cụ & Python | Python, test, Git, terminal, VS Code | phase-01 (5 module, 20 bài) | ✅ Đầy đủ |
| **2** — SE cho AI | FastAPI, Docker, REST, SQL, CI | phase-05 + phase-01 (developer-tools, sql) | ⚠️ Phân tán |
| **3** — Toán & thống kê | Vector, matrix, probability, gradient | phase-02 (4 module, 16 bài) | ✅ Đầy đủ |
| **4** — Machine Learning | Dataset, baseline, models, metrics, error analysis | phase-03 (5 module, 20 bài) | ✅ Đầy đủ |
| **5** — Deep Learning | Tensor, training loop, CNN, Transformer overview | phase-04 (5 module, 20 bài) | ✅ Đầy đủ |
| **6** — Data & ML Eng. | Versioning, tracking, drift, rollback | phase-05 (tracking, observability) | ✅ Đầy đủ |
| **7** — LLM & NLP | Token, embedding, prompt, structured output | phase-06 (nlp, transformers) + phase-11 | ✅ Đầy đủ |
| **8** — RAG & Search | Chunking, vector search, reranking, citation | phase-06 + phase-12, 13 | ✅ Đầy đủ |
| **9** — Agent & Eval | Tool-using agent, stop conditions, evaluation | phase-14, 15, 16, 17 | ✅ Đầy đủ |
| **10** — Production & Portfolio | Deploy, monitoring, portfolio, CV | phase-07 + phase-18, 19, 22 | ✅ Đầy đủ |

**Kết luận**: Roadmap hiện tại bao phủ tất cả 11 chặng. Vấn đề chính ở thứ tự, prerequisite và trùng lặp.

---

## 3. Bảng đánh giá chi tiết từng chặng

### Chặng 0 — Định hướng và cách học

| Tiêu chí | Kết quả |
|---|---|
| Prerequisite | Không — đúng, đây là điểm bắt đầu |
| Năng lực đạt được | Hiểu vai trò AI Engineer, thiết lập môi trường, ghi learning artifact |
| Lesson hiện có | 12 bài: environment (4), baseline (4), learning-system (4) |
| Artifact cần tạo | Workspace có .venv, kết quả tự đánh giá, nhật ký buổi học đầu |
| Điều kiện chuyển chặng | Tạo lại môi trường từ clone mới, có kết quả tự đánh giá |
| Đánh giá | ✅ Có đủ |

### Chặng 1 — Công cụ và Python

| Tiêu chí | Kết quả |
|---|---|
| Prerequisite | Chặng 0 |
| Năng lực đạt được | Viết Python có test, dùng Git, đọc HTTP/JSON, hiểu SQL cơ bản |
| Lesson hiện có | 20 bài: python-core (4), reliable-code (4), data-files (4), developer-tools (4), sql-structures (4) |
| Artifact cần tạo | Python package với test và README |
| Điều kiện chuyển chặng | Giải thích code, đổi yêu cầu không cần copy tutorial |
| Đánh giá | ✅ Có đủ. Bao phủ vượt yêu cầu (thêm SQL, Big-O) |

### Chặng 2 — Software Engineering cho AI

| Tiêu chí | Kết quả |
|---|---|
| Prerequisite | Chặng 1 |
| Lesson hiện có | Phân tán: phase-01 (HTTP/REST, SQL) + phase-05 (FastAPI, Docker, CI) |
| Đánh giá | ⚠️ Có nhưng phân tán. FastAPI/Docker ở phase-05 (sau DL) |

### Chặng 3 — Toán và thống kê

| Tiêu chí | Kết quả |
|---|---|
| Prerequisite | Chặng 1 (Python) |
| Lesson hiện có | 16 bài: linear-algebra (4), calculus (4), probability (4), optimization (4) |
| Đánh giá | ✅ Có đủ. Module guides yêu cầu liên hệ ML |

### Chặng 4–10

*(Tương tự bảng chi tiết — xem Section 2 ở trên. Tất cả đều ✅ Có đủ)*

---

## 4. Phát hiện vấn đề

### 4.1 Thứ tự chưa hợp lý (P0)
- FastAPI/Docker ở phase-05 (sau Deep Learning), nhưng là kỹ năng nền tảng
- Route "application" bỏ qua toán nhưng phase-09 cần embedding/cosine similarity

### 4.2 Prerequisite thiếu (P0)
- Phase-09 (GenAI ML) cần linear algebra (dot product, cosine) nhưng không ghi
- Phase-12/13 (RAG) cần FastAPI nhưng route "application" chưa dạy

### 4.3 Nội dung trùng lặp (P1)
- Embedding: phase-02, phase-04, phase-06, phase-09 (4 lần)
- Transformer: phase-04, phase-06, phase-10 (3 lần)
- RAG: phase-06 vs phase-12 (core vs GenAI)
- Fine-tuning: phase-06 vs phase-20
- Observability: phase-05 vs phase-18

### 4.4 Phase quá rộng (P1)
- phase-06 (24 bài, 6 modules) — nên tách
- phase-05 (20 bài) — trộn SE và ML engineering

### 4.5 Thiếu thực hành (P2)
- 198/208 bài là draft
- Projects folder chỉ có README scaffold
- GenAI phases chưa có worked solutions

---

## 5. Đề xuất nâng cấp

### P0 — Cần sửa để không gây học sai
1. Ghi rõ prerequisite toán cho route "application"
2. Annotation rõ: phase-06 RAG (core) vs phase-12/13 RAG (GenAI)
3. Đảm bảo route "application" có đủ HTTP/REST trước phase-11

### P1 — Nên sửa
4. Label mức độ cho nội dung trùng (giới thiệu / đào sâu / nâng cao)
5. Tách phase-06 thành 2–3 phases nhỏ hơn
6. Thêm scaffold cho portfolio projects
7. Route "application" cần danh sách skip/review cụ thể

### P2 — Nâng cấp khi có thời gian
8. Worked solutions cho GenAI phases
9. Estimated time cho từng module
10. Common mistakes section cho module guides

---

## 6. Nguồn và độ tin cậy

| Đã kiểm tra | Nguồn |
|---|---|
| Số phases/modules/lessons | curriculum.json (đếm trực tiếp) |
| Nhãn chất lượng | README.md dòng 56–57 |
| Portfolio projects | curriculum.json → portfolio_projects (10 items) |
| Learning routes | learning_routes.json (3 routes) |
| Module guides | module_guides.json (37 entries) |
| Research notes | RESEARCH-INTEGRATION.md |

| Chưa xác minh |
|---|
| Nội dung chi tiết 198 bài draft |
| Worked solutions content |
| Tất cả liên kết tài nguyên |

*Phân tích này chỉ dựa trên dữ liệu trong repo. Không sửa code, không đổi ID, không xóa nội dung.*
