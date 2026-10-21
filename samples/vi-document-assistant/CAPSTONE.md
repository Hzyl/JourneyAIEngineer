# Trợ lý tài liệu: RAG → đánh giá → triển khai / Document assistant capstone

Đây là **một project xuyên suốt**, mở rộng `vietnamese-rag`, không thêm một portfolio trùng. Dữ liệu là 12 tài liệu giả công khai, 30 câu hỏi đã có (14 dev, 16 test). API mặc định trả đoạn trích nguyên văn có nguồn; **không gọi LLM**. Generation thật là thí nghiệm Colab tùy chọn, được báo riêng.

This extends the existing `vietnamese-rag` portfolio project. The default API is a reproducible extractive baseline; optional hosted-Colab generation is a separate experiment. Nothing here changes Journey learner data, Supabase, or the public website.

## Chuẩn bị / Prerequisites

- Python, HTTP/JSON, chunking, Recall@k/MRR, quyền đọc / read permissions.
- Chạy lightweight lab bằng Python 3.11+; API dùng FastAPI/Uvicorn. Không cần model hay GPU cho baseline.
- Máy yếu: dùng [Lab A Colab](https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-a-evidence-retrieval.ipynb) với **hosted runtime**, không local runtime. Package/model tải lên máy chủ Colab, không máy cá nhân. Lưu báo cáo trước khi runtime hết hạn. Các thay đổi chưa publish phải được upload từ bản local hoặc đợi revision được xuất bản.
- Không cần Git: GitHub → Code → Download ZIP, giải nén. Lưu SHA nguồn/version tải về để tái lập; link `main` có thể đổi.
- Hướng dẫn dưới dùng PowerShell, bắt đầu tại thư mục `samples/vi-document-assistant`. Linux/macOS dùng `python3`, `.venv-capstone/bin/python` tương ứng. Không chạy các lệnh container trên web Journey; web chỉ hiển thị hướng dẫn.

## M1 — Kiểm tra đầu vào và chunking / Validate ingestion

Đọc `research_lab/corpus.py` và `data/` bên trong `research_lab`. Mỗi chunk giữ `document_id`, `version`, `chunk_id`, `line`, `text`, `allowed_users`. Kiểm tra tài liệu lỗi, rỗng, bản trùng và nguồn mâu thuẫn. Chạy bài `phase-12-genai-rag-rag-1` và `rag-2` trong Journey để thử chunking theo cửa sổ/heading, offset và ánh xạ citation; lab này giữ line chunks để so retriever công bằng.

Acceptance: source locations and ACL survive ingestion; broken input produces a recorded issue, not invented content. Before rechunking, map reference answers to source spans. Preserve the original test split; do not relabel gold based on retrieved output.

## M2–M3 — Baseline, ablation và lỗi / Retrieval and error analysis

Không cài package cho phần offline / no dependencies needed:

```powershell
python -m research_lab.experiments --split dev --output evidence/retrieval-dev.json
```

Các phương pháp: lexical overlap, BM25 (`k1=1.2`, `b=.75`), cosine vector trigram ký tự, BM25/vector RRF (hạng từ 1, constant 60), rồi rerank bằng ordered-bigram overlap. **Vector và reranker mặc định không phải model neural.** Quyền và metadata được lọc trước thống kê/encoding. Labels chỉ đi vào evaluator.

Expected qualitative result: the original 14 dev cases are easy; all five methods currently get Recall@3=1 with zero fixture failures. Five separate development probes expose two failures (library paraphrase and unsupported late-return fee). Their lexical decision accuracy is 3/5 and Recall@3 is 1/2 over the two evidence-bearing probes. Keep these failures. Do not conclude that hybrid/rerank improves quality when only latency increases.

Đọc từng `cases`, `failures`, `error_categories`, hash nguồn, mẫu số và p95. Truy xuất đúng chưa chứng minh câu trả lời đúng. Citation nguyên văn vẫn có thể không hỗ trợ chi tiết được hỏi. Ghi quyết định chọn baseline rồi mới mở test:

```powershell
python -m research_lab.experiments --split test --output evidence/retrieval-test.json
```

After viewing test, later tuning needs a fresh unseen set for independent evaluation. This small public synthetic set is not a real-world Vietnamese benchmark.

## M4 — Model tùy chọn trên Colab / Optional model experiment

Lab A đã có ô cài `sentence-transformers==5.1.2` và `transformers==4.57.1`, cùng embedding model ghim revision. Chạy ablation với backend đó để đổi **một** biến. Không gọi cosine là xác suất đúng. Reranker offline vẫn là heuristic; muốn dùng CrossEncoder cần thử riêng, giữ cùng pool và lưu revision/latency/truncation.

Ô `RUN_GENERATION=False` không tải model. Nếu bật, module `research_lab/generation.py` chỉ cho chạy hosted Colab, tải `Qwen/Qwen2.5-0.5B-Instruct` revision `7ae557604adf67be50417f59c2c2f167def9a775`, CPU, tối đa 2048 input tokens và 96 output tokens/câu. Không cần API key. Có thể chậm hoặc hết RAM/quota Colab; dừng và ghi NOT RUN/FAILED thay vì chuyển sang máy cá nhân.

Generation uses two dev questions with a fixed lexical retriever. Expected acceptance: cite the correct library-hours passage; abstain on the absent late-return fee. **Actual wording and quality are not guaranteed.** Record model/package revision, prompt hash, actual token counts, loading/inference time, truncation flag and raw outputs. Review each claim as supported/unsupported/unclear against evidence, recording reviewer and disagreements in `human_claim_review`. No automatic LLM judge or injection-resistance claim is made. TTFT is null because this experiment does not stream.

The model is optional, not required for local CPU work. LoRA, GPU serving and vLLM are further specializations, justified by measured failure/data/budget. Never use an unpinned `latest` developer-preview serving guide as verified instructions.

## M5 — Phục vụ API trên máy / Native serving

Nếu đã có môi trường chứa FastAPI/Uvicorn phù hợp, dùng interpreter đó. Nếu chưa, người học tạo môi trường riêng (không sửa môi trường app):

```powershell
python -m venv .venv-capstone
.venv-capstone\Scripts\python -m pip install -r capstone-requirements.txt
$env:LAB_STATE_DIR = "$PWD/.build/capstone-state"
.venv-capstone\Scripts\python -m uvicorn capstone_api:app --host 127.0.0.1 --port 8091 --no-access-log --log-level info
```

Trong terminal khác / another terminal:

```powershell
Invoke-RestMethod http://127.0.0.1:8091/ready
$headers = @{ 'X-Lab-Key' = 'demo-A-public' }
$body = @{ question = 'Thư viện mở cửa lúc mấy giờ?'; method = 'lexical' } | ConvertTo-Json
Invoke-RestMethod http://127.0.0.1:8091/query -Method Post -Headers $headers -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($body))
Invoke-RestMethod http://127.0.0.1:8091/stats -Headers $headers
```

Expected: readiness with a 64-character corpus hash; answer containing `08:00` and citation `library@1.0:L1`; counter increases once. No key → 401. Extra field, empty/too-long question or unknown method → 422. `document_id` filters **before** retrieval. User A cannot obtain B-only chunks by changing method or query. Keys `demo-A-public`/`demo-B-public` are public fixture identities, **not production authentication**.

`/health` checks liveness; `/ready` checks corpus/state access. `/query` returns `generation: not_run`; Colab generation is not silently used here. A later generator must retain authorization and evidence boundaries and be evaluated separately before enabling it.

## M6 — Compose, phục hồi và tải / Containers, recovery and load

Docker commands may build/download images on the learner’s machine. Stop the native server first to avoid port 8091 collision. Do not report them as executed unless they actually ran:

```powershell
docker compose -f compose.capstone.yaml config --quiet
docker compose -f compose.capstone.yaml up --build -d api
docker compose -f compose.capstone.yaml --profile verify run --rm probe
docker compose -f compose.capstone.yaml images
```

`probe` calls `http://api:8080/ready` via service DNS; the host calls `127.0.0.1:8091`. `service_healthy` gates startup, not ongoing HA. The container uses a non-root user, read-only root, dropped capabilities and a named volume for **counters only**. It stores no question text, learner data or credentials. Pinned image tags/dependencies help reproduction but are not complete immutable locks; record digest and resolve/transitively lock packages before a release.

Send one query and save `/stats`; restart `api`, wait for `/ready`, then compare `/stats`. The counter must survive. This tests persistence across process/container restart, not backup recovery or multi-node availability. Rollback: keep the prior image digest and compatible state schema, restart it and repeat readiness/correctness probes. Do not use a destructive volume reset as rollback.

```powershell
docker compose -f compose.capstone.yaml restart api
python benchmark_capstone.py --requests 20 --concurrency 1 --output evidence/load-c1.json
python benchmark_capstone.py --requests 20 --concurrency 2 --output evidence/load-c2.json
docker compose -f compose.capstone.yaml down
```

Không thêm `-v`: lệnh đó xóa volume. Benchmark chỉ chấp nhận loopback, 1–200 request, concurrency 1/2/4. Nó kiểm tra HTTP, câu trả lời fixture, citation và trace ID; đáp án sai làm exit nonzero dù HTTP 200. Báo cáo có p50/p95 nearest-rank, throughput, errors, environment và workload. Provider cost=0; infrastructure cost chưa đo; TTFT=null. Không ngoại suy 20 request thành capacity production. Tăng tải nhỏ từng bước, dừng khi sai correctness hoặc vượt ngân sách tự đặt.

## Báo cáo nghiệm thu / Evidence report

Nộp `EVIDENCE.md` cùng JSON reports; template dưới **không phải kết quả đã chạy**:

| Mốc / Milestone | Artifact | Status and limits |
|---|---|---|
| M1 ingestion | source hashes, issues, citation mapping | PASS/FAIL/NOT RUN |
| M2 baseline | retrieval-dev.json | per-case errors and denominators |
| M3 ablation | dev probes and frozen test | no assumed improvement |
| M4 generation | Colab export, manual claim review | optional, never infer from retrieval |
| M5 native API | HTTP correctness, ACL, trace, restart | separate from Docker |
| M6 container | image digest, probe, restart/load JSON | config alone is not execution |

For each failure, record source → expected → actual → likely layer → next one-variable experiment. Define a workload-specific latency budget before running; keep errors/timeouts and report variation instead of selecting the fastest run.

Trước deploy public cần auth thật, TLS, rate/body limits, secrets, dependency/image scan, backup/restore và model safety review nếu có generation. Compose này là lab loopback; không mở port public, không đưa demo keys hoặc dữ liệu riêng vào một sản phẩm thật.

## Nguồn và phạm vi bằng chứng / Sources and evidence

- [Docker startup order](https://docs.docker.com/compose/how-tos/startup-order/), [volumes](https://docs.docker.com/engine/storage/volumes/), [FastAPI containers](https://fastapi.tiangolo.com/deployment/docker/).
- [Stanford IR: BM25](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html), [Qdrant hybrid queries](https://qdrant.tech/documentation/search/hybrid-queries/) (defaults differ from this lab), [Sentence Transformers retrieve/rerank](https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html).
- [OpenTelemetry concepts](https://opentelemetry.io/docs/concepts/observability-primer/), [Qwen model card](https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct), [Colab FAQ](https://research.google.com/colaboratory/faq.html).
- TikTok T14 (Docker), T17/T22 (overlapping project ideas), T24 (RAG-to-operation) remain M/H topic leads. No full-video/transcript claim, promotional employment/chunking percentage or independently unverified benchmark is reused.
