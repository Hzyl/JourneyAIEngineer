# Critical Path — Đường học bắt buộc ngắn nhất

> Dựa trên phân tích 23 phases, 208 lessons trong repo Journey AI Engineer.
> Mục tiêu: từ "chưa biết gì" đến "có portfolio đủ để chuẩn bị ứng tuyển AI Engineer intern/junior".

---

## Đường chính (Critical Path)

```
Chặng 0          Chặng 1           Chặng 3         Chặng 4           Chặng 5
Định hướng  ───→ Python & ───→  Toán cho  ───→  ML cổ      ───→  Deep
& cách học       Công cụ         AI/ML          điển              Learning
(phase-00)       (phase-01)      (phase-02)     (phase-03)        (phase-04)
  1 tuần          6 tuần          6 tuần         8 tuần            8 tuần
                    │                              │
                    │                              ▼
                    │                          PROJECT 1
                    │                          Tabular ML
                    ▼                              │
                PROJECT 0                          ▼
                Python pkg                     PROJECT 2
                                               Deep Learning
                                                   │
        ┌──────────────────────────────────────────┘
        ▼
    Chặng 6           Chặng 7           Chặng 8           Chặng 9
    Data & ML  ───→   LLM & NLP  ───→  RAG &      ───→   Agent &
    Engineering       Engineering      Search             Evaluation
    (phase-05)        (phase-06        (phase-06          (phase-06
     8 tuần           nlp+trans+       retrieval+rag+     adaptation +
                      phase-11)        phase-12,13)       phase-14,15,
        │              4+4 bài          12+8 bài          16,17)
        ▼                │                  │                │
    PROJECT 3            │                  ▼                ▼
    API/ML Service       │              PROJECT 4        PROJECT 5
                         │              RAG App          Agent/Eval
                         │                  │                │
                         └──────────────────┴────────────────┘
                                            │
                                            ▼
                                      Chặng 10
                                      Production &
                                      Portfolio
                                      (phase-07 +
                                      phase-18,19,22)
                                         6 tuần
                                            │
                                            ▼
                                        CAPSTONE
                                      2-3 projects
                                      hoàn chỉnh
```

### Tổng thời gian Critical Path (standard track)

| Giai đoạn | Tuần | Tích lũy |
|---|---|---|
| Chặng 0: Định hướng | 1 | 1 |
| Chặng 1: Python & Công cụ | 6 | 7 |
| Chặng 3: Toán cho AI | 6 | 13 |
| Chặng 4: ML cổ điển | 8 | 21 |
| Chặng 5: Deep Learning | 8 | 29 |
| Chặng 6: Data/ML Engineering | 8 | 37 |
| Chặng 7: LLM & NLP | 4 | 41 |
| Chặng 8: RAG & Search | 6 | 47 |
| Chặng 9: Agent & Evaluation | 4 | 51 |
| Chặng 10: Production & Portfolio | 6 | 57 |
| **Tổng** | **~57 tuần** | |

> Lưu ý: con số này khớp gần với standard_weeks = 68 trong curriculum.json (bao gồm cả GenAI specialization phases 20, 21). Critical path bỏ qua fine-tuning, local LLM — đó là tùy chọn.

---

## Các phần có thể học song song

| Phần A | Phần B | Điều kiện |
|---|---|---|
| Chặng 3 (Toán) | Chặng 1 phần sau (Git, HTTP) | Toán chỉ cần Python cơ bản |
| Chặng 4 (ML) dạng đọc | Chặng 3 phần optimization | Optimization là prerequisite cho ML training |
| Portfolio work (viết README, demo) | Bất kỳ chặng nào từ 4 trở đi | Portfolio là quá trình liên tục |
| Phỏng vấn prep (study-playbook) | Từ chặng 4 trở đi | Bắt đầu journal + review cards sớm |

### Song song thực tế cho route "application" (từ learning_routes.json)

Nếu đã biết Python + HTTP/JSON:
```
phase-00 ──→ phase-08 ──→ phase-09 ──→ phase-11 ──→ phase-12 ──→ phase-17 ──→ phase-18 ──→ phase-19 ──→ phase-07
              (cần bổ sung: linear-algebra basics cho embedding/cosine)
```
Thời gian: ~10 tuần (accelerated) theo learning_routes.json weekly_hours [6,8].

---

## Các phần có thể để sau (tùy chọn)

| Phần | Phase trong repo | Khi nào cần |
|---|---|---|
| Fine-tuning & PEFT | phase-20-genai-finetuning | Khi RAG/prompting không đủ cho use case |
| Local LLM & serving | phase-21-genai-local-llm | Khi cần privacy hoặc giảm chi phí API |
| MCP (Model Context Protocol) | phase-16-genai-mcp | Khi xây hệ thống multi-tool phức tạp |
| Advanced RAG (BM25, reranking) | phase-13-genai-advanced-rag | Sau khi RAG cơ bản hoạt động |
| AI System Design nâng cao | phase-22-genai-system-design | Chuẩn bị phỏng vấn senior |
| Trị riêng, PCA (phase-02 bài 4) | phase-02-math-ml-linear-algebra-4 | Khi cần dimensionality reduction |
| Window functions SQL | phase-01-python-software-sql-structures-2 | Khi làm data engineering |

---

## Mốc năng lực và thời điểm tương ứng

| Mốc | Thời điểm | Bằng chứng |
|---|---|---|
| **Có nền tảng** | Sau Chặng 1 (tuần 7) | Python package có test, Git workflow |
| **Có thể tự xây project nhỏ** | Sau Chặng 4 (tuần 21) | ML project có baseline, metric, error analysis |
| **Có thể xây AI feature hoàn chỉnh** | Sau Chặng 8 (tuần 47) | RAG app có citation, evaluation, failure analysis |
| **Có portfolio đủ để nhận feedback** | Sau Chặng 9 (tuần 51) | 3+ projects trên GitHub với README, demo |
| **Chuẩn bị ứng tuyển** | Sau Chặng 10 (tuần 57) | CV, interview stories, 2-3 projects hoàn chỉnh |
| **Cần tiếp tục** | Liên tục | Luyện qua project mới và phỏng vấn |

> ⚠️ Hoàn thành roadmap KHÔNG đảm bảo có việc. Đây là mốc "sẵn sàng chuẩn bị ứng tuyển", không phải mốc "chắc chắn được nhận".

---

## Đường tắt cho người đã có kinh nghiệm

### Đã biết Python + Git + HTTP
- Skip: phase-00, phase-01
- Bắt đầu từ: phase-02 (Toán) hoặc phase-08 (GenAI software) nếu theo route "application"
- Tiết kiệm: ~7 tuần

### Đã biết ML cơ bản (sklearn, pandas)
- Skip: phase-03
- Bắt đầu từ: phase-04 (Deep Learning) hoặc phase-06 (LLM/RAG)
- Tiết kiệm: ~8 tuần

### Đã biết Deep Learning (PyTorch)
- Skip: phase-04
- Bắt đầu từ: phase-05 (MLOps) hoặc phase-06 (LLM/RAG)
- Tiết kiệm: ~8 tuần

> Mỗi lần "skip", hãy làm bài baseline assessment (phase-00 module baseline) để xác nhận.

---

*Dựa trên curriculum.json, learning_routes.json và module_guides.json trong repo.*
