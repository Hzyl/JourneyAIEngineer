# Nâng cấp nội dung từ nghiên cứu — 21/10/2026

Hoàn tất kiểm tra cuối: 22/10/2026 (giờ Việt Nam).

Phạm vi: sửa 18 bài hiện có, không thêm phase/lesson/project ID hoặc thay quan hệ prerequisite, exercise, review card, next lesson. Giữ 23 phase, 208 bài và 10 portfolio project. Không sửa Supabase hoặc tiến độ người học. Giai đoạn triển khai ban đầu chưa commit, push hay deploy; phạm vi xuất bản sau xác nhận được ghi ở cuối báo cáo.

## Nguồn và độ chắc chắn

Đã đọc đầy đủ `JourneyAIEngineer-research-handoff-2026-10-12.md` (bản cập nhật tới 21/10) và `JourneyAIEngineer-TikTok-summary-2026-10-21.md`, gồm toàn bộ yêu cầu mục 5. Khảo sát repo cũ trong handoff được xem là lịch sử; quyết định bên dưới dựa trên source hiện tại.

T13–T26 gồm 10 bài ảnh và 4 video chỉ đọc metadata/khung hình từng phần. Giữ M/H; không nâng thành P (transcript đầy đủ) hoặc V (xem toàn bộ). Không dùng tỷ lệ quảng cáo việc làm/chunking, số sao hoặc benchmark chưa tái lập. T20 chưa chứng minh định lý, T21 chưa xác định repo, T23 chưa đọc đầy đủ PDF/năm thành tố: không tự lấp các khoảng trống. LoRA và self-host GPU chỉ là specialization có điều kiện.

Nguồn kỹ thuật được đối chiếu trực tiếp với tài liệu chính thức: PyTorch tutorial/API (fallback GitHub raw khi docs chặn), Docker Compose/volumes, FastAPI containers, Stanford IR BM25, Qdrant hybrid queries, Sentence Transformers retrieve/rerank, OpenTelemetry concepts, MCP specification 2025-06-18, LangGraph interrupts và Qwen model card. Liên kết cụ thể nằm trong từng bài và [CAPSTONE.md](../../samples/vi-document-assistant/CAPSTONE.md). Qdrant và lab có quy ước hạng/hằng số RRF khác nhau, được ghi rõ.

## Nội dung đã có → khoảng trống → thay đổi

| Nhóm | Hiện có và phần giữ lại | Khoảng trống đã sửa |
|---|---|---|
| PyTorch, 5 bài | Giải thích tensor/autograd/train/embedding/attention còn đúng | Thay ví dụ generic bằng tensor shape, autograd accumulation, classifier có train/validation, masked pooling và causal/padding mask nối với TransformerEncoderLayer |
| Docker/Compose, 2 bài | Khái niệm image, service, network/volume | Dockerfile và Compose cho API corpus giả; health/readiness, service DNS, non-root, volume counter, HTTP probe, restart và giới hạn production |
| Hybrid/rerank, 2 bài | Ví dụ RRF và mock-score giúp hiểu metric | Thêm BM25, sparse character vectors, RRF, heuristic rerank trên cùng corpus; ACL trước scoring/encoding; so sánh có config/hash và probe khó riêng |
| Tool/agent/MCP, 4 bài | Lab B/C, ví dụ checkpoint subprocess cũ | Allowlist/schema/object permission, bounded loop/deadline, exact-action approval/expiry/revocation, idempotent retry và đọc trạng thái cuối |
| Evaluation, 1 bài | Fixture 4 ca tách retrieval/support/abstention | Cây chẩn đoán lỗi, câu paraphrase và câu hỏi thiếu chi tiết, mẫu số metric, manual claim review; không gọi exact citation là groundedness |
| Observability/production, 2 bài | Khái niệm latency/token/capacity còn đúng | HTTP trace ID, log không lưu nội dung, p50/p95/error/throughput, unknown token/TTFT, tải loopback có giới hạn, restart khác HA |
| Capstone, 2 bài | Project `vietnamese-rag`, MVP và báo cáo | Một chuỗi M1–M6, artifact/rubric/nguồn, optional Colab generation, báo cáo đo thật và các bước NOT RUN riêng |

18 nguồn Markdown được sửa:

- `phase-04-deep-learning-{pytorch-core-1,pytorch-core-4,training-1,vision-nlp-3,vision-nlp-4}`.
- `phase-05-mlops-{containers-1,containers-2}`.
- `phase-07-capstone-career-{ship-1,ship-2}`.
- `phase-13-genai-advanced-rag-{advanced-rag-1,advanced-rag-2}`.
- `phase-14-genai-tool-calling-tool-calling-4`.
- `phase-15-genai-agents-{ai-agents-3,ai-agents-4}`.
- `phase-16-genai-mcp-mcp-4`.
- `phase-17-genai-evaluation-genai-evaluation-2`.
- `phase-18-genai-observability-genai-observability-2`.
- `phase-19-genai-production-genai-production-4`.

Mỗi bài có giải thích VI/EN, prerequisite được diễn giải mà không đổi liên kết ID, ví dụ/setup/output, tình huống lỗi, bài tập và tiêu chí kiểm chứng. Nội dung mới được ghi vào frontmatter hiển thị trên web, không chỉ nằm trong Markdown body. Catalog được sinh lại từ source, không sửa tay.

## Lab và ranh giới

- [PyTorch text bridge](../../samples/pytorch-text-bridge/README.md): 5 ví dụ CPU nhỏ, không tải pretrained model. Mean pooling không hiểu thứ tự; test đảo câu chỉ đúng 1/2 là giới hạn được giữ lại, không che đi.
- [Safe tool boundaries](../../samples/safe-tool-boundaries/README.md): simulator scripted, không phải MCP server/OAuth hay LLM thật. Root tách thêm ví dụ resume/expiry/state drift và 16 câu hỏi/đáp án ôn tập riêng theo mục tiêu.
- [RAG capstone](../../samples/vi-document-assistant/CAPSTONE.md): tái dùng 12 tài liệu giả, 30 câu hỏi và corpus/fixture IDs cũ. Không thêm project portfolio trùng. Lọc metadata/quyền trước retrieval.
- [Lab A](../../notebooks/lab-a-evidence-retrieval.ipynb): thêm ablation và 5 dev probes riêng. Embedding Colab cũ được giữ; optional Qwen generation mặc định tắt. Không tải model mới lên PC.
- API mặc định là **extractive baseline**, không sinh ngôn ngữ bằng LLM. Qwen generation là phép thử Colab riêng trên 2 câu dev, chưa chạy thật; model/revision được ghim, có token/input budgets và manual claim review. Không hứa chất lượng tiếng Việt hoặc prompt-injection resistance.

## Kết quả đo thực tế

Offline retrieval cùng corpus/config:

| Split | Số câu | Kết quả |
|---|---:|---|
| Dev cũ | 14 | Cả 5 phương pháp Recall@3=1, 0 lỗi fixture |
| Test giữ nguyên | 16 | Cả 5 phương pháp Recall@3=1, 0 lỗi fixture |
| Stress dev mới, báo riêng | 5 | Lexical decision accuracy 3/5; Recall@3 1/2 trên 2 ca có gold; lỗi paraphrase và phí phạt không có nguồn |

Không có bằng chứng từ bộ dễ này rằng hybrid/rerank tốt hơn baseline. Tập nhỏ, public và synthetic không đại diện benchmark ngoài đời. Chẩn đoán phải phân biệt retrieval miss với answer-policy failure; citation nguyên văn không đồng nghĩa câu hỏi được trả lời.

Native HTTP trên Windows/Python 3.11.15, 21/10/2026 13:27 UTC, lexical, 20 request/lượt, câu hỏi 28 ký tự, timeout 5 giây, không warm-up riêng:

| Concurrency | Đáp án đúng | HTTP lỗi | p50 ms | p95 ms | Thành công/giây |
|---|---:|---:|---:|---:|---:|
| 1 | 20/20 | 0 | 10.18 | 33.73 | 53.36 |
| 2 | 20/20 | 0 | 9.86 | 35.62 | 103.21 |

Đây là smoke/load measurement của fixture loopback, có công việc kiểm tra khác trên máy, không là benchmark kiểm soát để kết luận tốc độ tăng do concurrency. Nearest-rank percentile; HTTP client timing khác server retrieval/SQLite timing. Provider cost=0 vì không gọi provider; chi phí hạ tầng chưa đo; TTFT=null. Counter 85 → 85 qua restart tiến trình. **Không gọi đây là Docker run hoặc HA.**

Corpus canonical SHA-256: `a372b1a3410a3bae2ca9727f9236389519098d87b83b61ee674c846e222a3e2b`.
Question fixture SHA-256: `fc081c70394aa5fb241c9df96df1c730cd8ce680c32826462a54ab0d00f87546`.

## Kiểm chứng

- 20 ví dụ Python nhúng của 18 bài chạy ở subprocess, output khớp; API examples gọi HTTP thật.
- `npm test`: content validation, security scan, **559 Python tests pass / 13 skip**, lint, **331 Vitest tests pass**, TypeScript/Vite production build pass. 13 skip thuộc PyTorch do `.venv` không có torch. Môi trường torch có sẵn chạy riêng **14/14 test pass**, gồm 13 behavior test và một source-sync test; dùng pytest/PyYAML từ `.venv`, không cài thêm gói.
- Sau chỉnh sửa cuối chỉ tách ngôn ngữ setup PyTorch, chạy lại content validation, 14 test PyTorch, TypeScript/Vite build và browser. Đều exit 0; không coi lượt full suite trước đó là một lượt chạy lại sau thay đổi cuối.
- Kiểm tra browser production cuối: **8/8 test pass**, mỗi test đọc 18 bài, bao phủ VI/EN × 320/1440 px × light/dark; mở đáp án bằng keyboard, focus code, đọc output, contrast, không tràn ngang, chữ nội dung ≥16px và không có lỗi JavaScript. Không gọi Supabase thật/ghi dữ liệu học. Đã xem lại ảnh setup tiếng Anh ở desktop tối và tiếng Việt ở mobile sáng.
- Compose `config --quiet` pass. **Docker Engine đang tắt: build/up/probe/restart container NOT RUN.** Native restart/HTTP không thay thế bằng chứng container.
- Colab thật, pretrained embedding mới, Qwen inference, neural reranker, GPU/vLLM, MCP/OAuth transport thật và security audit production: **NOT RUN**.
- Lint còn hai cảnh báo sẵn có ở AuthProvider; Vite còn cảnh báo bundle hosted lớn. Passive security scan chỉ là heuristic: 31 findings cần người rà, không phải 31 lỗi đã khai thác hoặc chứng nhận an toàn. Không mở rộng scope để sửa auth/bundle trong lô nội dung này.
- Snapshot đối chiếu giữ toàn bộ protected lesson/card identity, source draft 4 bài analysis có sẵn và hash database học. Source chưa sửa vẫn nguyên. Catalog cũng phản ánh 4 draft analysis cũ vì quy trình sinh toàn bộ; không nhận chúng là phần sáng tác của lô này.

Các lệnh kiểm tra chính (tại repo; mỗi lệnh riêng):

```powershell
rtk proxy npm.cmd test
rtk proxy .venv\Scripts\python.exe -X utf8 scripts/validate_content.py
rtk proxy .build\math-verification\Scripts\python.exe -X utf8 -c "import sys; from pathlib import Path; sys.path.append(str(Path('.venv/Lib/site-packages').resolve())); import pytest; raise SystemExit(pytest.main(['tests/test_pytorch_text_bridge.py', '-q']))"
rtk proxy npx.cmd playwright test --config=playwright.production.config.ts tests/e2e/hosted-research-upgrade.spec.ts
rtk proxy npm.cmd run build
rtk proxy docker compose -f samples/vi-document-assistant/compose.capstone.yaml config --quiet
rtk git diff --check
```

Bằng chứng local chi tiết ở `.build/research-20261021/`: `verification.json`, `retrieval-{dev,test}.json`, `load-c{1,2}.json`, `native-api.log`, `screens/`, báo cáo hai module và bản nguồn tài liệu đã đọc. Đây là artifact kiểm thử được ignore, không phải dữ liệu học.

## Phạm vi xuất bản sau xác nhận — 22/10/2026

Người dùng đã yêu cầu commit và push. Thông điệp: `feat(learning): add practical PyTorch RAG and safe agent labs`; đích `origin/main` tại `https://github.com/Hzyl/JourneyAIEngineer.git`.

Chuẩn bị bản xuất bản 47 file từ HEAD cùng đúng nguồn của 18 bài và các sample/test/tài liệu liên quan. Sinh lại catalog bằng script của repo trong bản kiểm tra riêng: đối chiếu với HEAD xác nhận đúng 18 lesson record thay đổi, không có ID mới hoặc mất ID. Bốn draft analysis, test analysis, bản nháp lazy catalog và thư mục ảnh roadmap có sẵn không nằm trong commit này; working tree vẫn giữ chúng. Catalog của working tree vì thế có thể khác catalog đã stage.

Kiểm tra lại bản xuất bản riêng:

- Content validation và catalog fingerprint: pass, 23 phase/208 bài.
- Python: **518 passed, 13 skipped**; 13 kiểm tra torch và source-sync được chạy riêng, **14/14 passed**. Số test Python khác lượt working tree ở trên vì không kèm bộ test analysis chưa thuộc lô này.
- Frontend: **331/331 passed**; lint và TypeScript/Vite production build pass với các warning có sẵn đã ghi trên.
- Browser production: **8/8 passed**, cùng ma trận 18 bài × VI/EN × 320/1440 × light/dark, dùng dữ liệu giả.
- Lượt `npm test` trong bản riêng dừng lần đầu ở lint vì thư mục `.build` bị Git ignore theo repo cha. Đã tạo Git root riêng cho bản kiểm tra, chạy lại lint, unit frontend và build thành công; không đổi cấu hình lint hoặc bỏ qua cảnh báo để đạt kết quả.
- Không đưa `.env`, database học, artifact kiểm thử, token hoặc output notebook vào phạm vi xuất bản. Không thay đổi cấu hình hay migration Supabase.

Đây là kiểm chứng trước push. Trạng thái deploy Cloudflare và model/container thật không được suy ra từ các kết quả này.
