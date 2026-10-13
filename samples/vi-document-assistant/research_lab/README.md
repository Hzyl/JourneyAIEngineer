# Research Labs A/B/C / Ba lab nghiên cứu

Các lab dùng dữ liệu tiếng Việt tự tạo; không phải chính sách thật. Mặc định chỉ
chạy Python chuẩn, không tải model, không cài dependency và không gọi API trả phí.
Lab A là truy xuất và trích nguyên văn; Lab B/C dùng công cụ và bộ điều khiển giả lập,
không có LLM. Sample và bộ đánh giá 12 câu ở thư mục cha được giữ nguyên.

These labs use invented Vietnamese documents, standard-library retrieval and
scripted tools. They do not generate answers with an LLM. The older 12-case
evaluation in the parent directory remains separate and unchanged.

## Chạy / Run

Từ thư mục gốc repo / From the repository root:

```powershell
.venv/Scripts/python.exe -X utf8 samples/vi-document-assistant/run_research_lab.py --lab all
.venv/Scripts/python.exe -X utf8 samples/vi-document-assistant/run_research_lab.py --lab a --split dev --output lab-a-dev.json
# Chỉ mở test sau khi chốt thiết kế / Inspect test only after freezing your design:
.venv/Scripts/python.exe -X utf8 samples/vi-document-assistant/run_research_lab.py --lab a --split test --output lab-a-test.json
```

`--lab` accepts `a|b|c|all`; `--split` accepts `dev|test|all` and affects
Lab A only. Defaults are all labs and dev split. Output must be a **new** JSON
file; existing files are never overwritten. Successful execution does not mean
every evaluation case passed: inspect failures and stop reasons in the report.

## Lab A: nguồn và phép đo / Evidence and metrics

- `data/documents.json`: 12 documents, 22 line chunks, versioned text and explicit
  `allowed_users`. User B can read all documents; A cannot read `assessment`.
- `data/questions.json`: 30 labeled questions, 20 answerable, 5 unanswerable,
  5 ambiguous, with fixed dev/test membership. Labels are human-authored examples.
- Each chunk preserves `document_id/version/chunk_id/line/text/allowed_users`.
  Line numbers are one-based; blank lines are skipped without renumbering.
- Exact duplicate identities are skipped. Contradictory content/ACL for the same
  identity is rejected. Identical content in different sources remains separate,
  retaining each source's ACL. Search folds Vietnamese accents but citations keep
  the original Unicode text.
- `fact_key` is manually authored metadata: two different statements with the
  same key require clarification. The two refund sources deliberately conflict;
  neither is chosen as authoritative. This is not a learned contradiction detector.

Recall@3 = relevant retrieved chunk IDs / all gold chunk IDs per question.
MRR@3 = 1 / first relevant rank, or 0 if none occurs in the first three results.
Hit@1 checks whether the first result is gold. Reported retrieval means include
only cases with gold evidence, including the two conflicting-source questions.
Questions without gold have null retrieval scores. Decision accuracy separately
requires the expected action, a gold citation for answerable cases and exact
authorized citations. Category action accuracy checks the action alone.

Không có nguồn thì từ chối; câu ngắn hoặc điểm bằng nhau thì hỏi lại. Cả lexical
và embedding dùng cùng cổng bằng chứng lexical: ít nhất hai token khớp và tỷ lệ
khớp ít nhất 0,35. Đây là giá trị minh họa cố định, không phải độ tin cậy ngữ nghĩa
đã hiệu chuẩn. Không điều chỉnh theo kết quả test.

The extractive policy abstains below the shared lexical evidence gate, asks for
clarification for underspecified queries, ties or authored conflicts, and otherwise
returns one source line. An exact citation check proves location/text/authorization,
**not semantic groundedness** of an arbitrary claim. No generation metric is claimed.

Latency is measured wall time of retrieval plus decision. First-use embedding
index construction is included; model loading is outside per-question timing.
p50/p95 use nearest-rank selection. Hashes cover canonical JSON fixtures and Python
source files; runtime metadata names the method, model status and platform.

## Embedding protocol / Giao diện embedding

```python
import sys
sys.path.insert(0, "samples/vi-document-assistant")
from research_lab import lab_a, lab_b, lab_c
report = lab_a.run()  # dev only
final_report = lab_a.run(split="test")
b, c = lab_b.run(), lab_c.run()
```

An optional `lab_a.run(embedding_backend=backend, split="dev")` accepts an object:

- `backend.encode(texts: list[str]) -> sequence[sequence[float]]`
- `backend.metadata: dict`, JSON-safe and declaring `is_mock: bool`.

Vectors must be finite, nonempty and dimensionally consistent. Cosine similarity
uses the same authorized corpus, questions, split and top-k as the lexical method.
The encoder sees only authorized chunks. Injected test doubles must use
`is_mock=True`; their scores are not model measurements.

**Mô hình thật chỉ chạy trong Colab / Real model execution is Colab-only.**
Open `notebooks/lab-a-evidence-retrieval.ipynb`. After the learner installs the
notebook's pinned packages in Colab, use:

```python
from research_lab.embeddings import ColabSentenceTransformer
backend = ColabSentenceTransformer()
report = lab_a.run(embedding_backend=backend, split="dev")
```

`--embeddings` invokes that same guarded backend. It rejects local execution
before importing ML packages or downloading weights. It loads
`sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`, revision
`e8f8c211226b894fcb81acc59f3b34ba3efd5f42`, on CPU with safetensors and
`trust_remote_code=False`. The pinned model card lists 384 dimensions, maximum
sequence length 128 and Apache-2.0 licensing. It produces embeddings, not answers.
Long inputs are truncated; this corpus deliberately uses short source lines.
The report records the actual device, package versions and revision.
Source: [pinned model card](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/blob/e8f8c211226b894fcb81acc59f3b34ba3efd5f42/README.md).

## Lab B: workflow và phục hồi / Workflow and recovery

Both strategies use the same three tasks and scorer. The fixed workflow searches
once and reads its selected source. The scripted adaptive variant uses the
predeclared fallback query after no result or inadequate evidence. It is not an
LLM agent, and its small-fixture result is not a general claim about agents.

`ToolSession` supports only `search` and `read_document`, maximum five attempts
and configurable active execution timeout. Invalid arguments and forbidden tool
attempts count. Repeated queries, missing results, tool errors and timeouts have
explicit statuses. A fake injected clock makes timeout tests deterministic.
These immediate in-process tools use cooperative deadline checks; real blocking
network tools require transport cancellation.

`Runner` records state transitions and stop reasons. `MemoryStore` loses state
with a new instance. `JsonStore` atomically writes trusted synthetic state to disk;
resume keeps calls, repeated-query history and elapsed active execution time.
Downtime is excluded from that active budget. Tests resume from a separate Python
process. Checkpoints bind fixture/task/strategy/principal; files are neither
signed nor encrypted and must not be loaded from untrusted sources.

The checkpoint demonstration enables `Runner(..., require_approval=True)`.
After search, it pauses at `waiting_approval`; calling `run()` returns
`stop_reason="awaiting_approval"` without additional tool calls. Saving and
restoring that checkpoint preserves the pending gate and consumed budget.
`approve(principal, canonical_hash(task), approved=True)` permits the read only
for the same principal/task. A false decision terminates with `approval_denied`.
This is explicit **fake approval**, not authenticated human consent; a production
application must supply authenticated identity and durable authorization itself.
The tests verify pending/denied gates and approved resume in a separate process.

Phần checkpoint dừng chờ phê duyệt giả trước khi đọc, giữ nguyên quyền người dùng,
nhiệm vụ và ngân sách khi phục hồi. Không có phê duyệt thì không gọi thêm công cụ;
từ chối thì dừng. Đây là mô phỏng quyết định, không thay thế xác thực người dùng thật.

## Lab C: regression quyền đọc / Authorization regression

`data/security_cases.json` fixes eight cases, user A/B, an injection document and
a fake secret canary. Both variants report the same fixture version/hash and corpus
hash. The deliberately unsafe **before** variant bypasses document ACLs for this
synthetic exercise only. **After** filters candidates before scoring and checks
rights before reading. Missing and forbidden documents share a denial status.

Raw tool arguments, document text and exception messages never enter telemetry.
Trace events include only allowlisted tool names, statuses, states and latency.
The test canary is invented and never emitted in the report. Reading attack text
does not execute it; requests for tools outside the allowlist are denied.
This demonstrates application boundaries in a scripted controller, **not proof**
against prompt injection in a genuine model or a production MCP server.

## Kiểm tra và giới hạn / Checks and limits

```powershell
.venv/Scripts/python.exe -X utf8 -m pytest -q tests/test_research_lab_a.py tests/test_research_lab_b.py tests/test_research_lab_c.py
```

These tests cover metric arithmetic, exact attribution, Unicode, ingestion,
conflicting sources, ACLs before scoring/encoding, invalid embeddings, bounded
tools, redacted traces, CLI output and process restart recovery.

Không suy chất lượng ngoài thực tế từ fixture công khai. Tập test ở đây không còn
độc lập nếu người học đã đọc hoặc tối ưu theo nó. Chưa chạy Colab/model thật trong
kiểm thử local. `provider_cost_usd=0` chỉ có nghĩa không gọi provider trả phí;
không đo chi phí CPU, điện hay dịch vụ Colab.

Public synthetic fixtures are not an independent held-out benchmark after
inspection. Local tests do not execute Colab or a real model. Zero provider API
cost does not imply zero compute cost. No deployment or production security
certification is performed.
