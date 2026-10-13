# Research completion implementation contract — 2026-10-13

Finish the full approved research handoff in the existing curriculum. Preserve all
lesson/phase/module/review/exercise IDs, prerequisites, quality labels and existing
uncommitted work. Reuse the 12-case sample without modifying it. No commit, push,
deployment, local package installation, model download or paid API call.

## Ownership

- Codex parent: notebooks, UI links, final documentation, generated catalogs and
  integration verification.
- Curriculum child: this plan; the 16 selected lesson Markdown sources; and
  `tests/test_research_lessons.py`. No curated overrides.
- Lab executor (Codex child after OMX bridge failure): only `samples/vi-document-assistant/research_lab/**`,
  `samples/vi-document-assistant/run_research_lab.py` and
  `tests/test_research_lab*.py`. Satellites return to the parent; no nesting.

## Lab interfaces

- Lab A: 12 synthetic documents with document_id/version/text/allowed_users; 30 labeled
  questions (20 answerable, 5 unanswerable, 5 ambiguous). Chunks retain
  document_id/version/chunk_id/line/text/allowed_users.
- `lab_a.run(embedding_backend=None, split="dev")` returns JSON-safe reports: lexical baseline
  always, source attribution, split, top-k metrics, failures, latency and
  provenance. Genuine SentenceTransformer execution is optional and Colab-only.
- `lab_b.run()` and `lab_c.run()` return reports. Read-only fake tools enforce
  authorization, a maximum of five calls, time budget and denial cases. Include
  redacted traces, checkpoint/resume, a principal/task-bound fake approval gate,
  and before/after regression. The fake gate does not provide real authentication.
- CLI: `python samples/vi-document-assistant/run_research_lab.py --lab a|b|c|all
  [--split dev|test|all] [--embeddings] [--output PATH]`. No paid-service imports or calls.
- Colab notebooks: `notebooks/lab-a-evidence-retrieval.ipynb`,
  `notebooks/lab-b-workflow-agent.ipynb`,
  `notebooks/lab-c-security-regression.ipynb`.

## Ordered implementation

1. Inspect source schemas and existing examples; replace remaining placeholder
   examples in the 16 selected P1/P2 lessons with self-contained stdlib programs.
2. Explain the concepts and practices equivalently in Vietnamese and English:
   model cards, tokenizer/embedding/generation, retrieval/reranking, app-level
   authorization, context selection, durable state, MCP 2025-06-18 lifecycle,
   evaluation, telemetry, retries, tuning, serving and architecture tradeoffs.
3. Implement Labs A/B/C and optional real-model Colab execution. Label every mock
   and synthetic measurement; do not claim real model quality from mock tests.
4. Add external Colab resources with bilingual purpose/read guidance. Public main
   links become usable only after an authorized push; no editor prerequisite.
5. Execute every new snippet in a temporary directory, assert documented outputs,
   run meaningful failure/edge cases, then regenerate and validate catalogs.
6. Parent checks UI, notebooks, identity preservation and integrated tests, then
   reports implementation separately from unrun real-model/remote execution.

## Acceptance evidence

No fabricated benchmarks, model-card details or quality improvements. Keep
source IDs/version/locations, evaluate retrieval separately from generation,
hold evaluation data fixed, and distinguish RAM state from disk recovery.
Optional Colab dependencies and downloads occur only in the learner's Colab
runtime. Local checks use `.venv/Scripts/python.exe -X utf8` and RTK.

## Verification result

Integrated checks passed on 2026-10-13: 251 pytest tests, 247 frontend tests,
content/fingerprint validation, lint and production build. The 16 authored
examples match their documented outputs and have independent boundary checks.
The Colab callout passed 24 local production browser configurations across
three labs, two languages, 320/1440 px, and light/dark themes.

The OMX bridge selected gpt-5.6-terra/medium from the configured routing file,
but its installed CLI rejected the model version before project edits.
Codex children completed the bounded lab/curriculum tasks; the parent integrated
and verified them. No bridge update, real GEPA or local ML installation occurred.
Notebook setup/baseline/export ran with mocked HTTP fixtures; real Colab model
execution and publication remain unverified. See RESEARCH-INTEGRATION.md.
