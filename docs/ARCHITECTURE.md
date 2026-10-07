# Architecture

## Mục tiêu v0.1

Journey AI Engineer có bản desktop/local-first và web beta.
Bản local v0.1 chạy single-user, ưu tiên khả năng học thật, chạy lại và version-control artifact.
Web beta lưu dữ liệu theo tài khoản trên Supabase; hai runtime không tự đồng bộ dữ liệu với nhau.

```text
React 19 + Vite + TypeScript
        │ HTTP loopback (127.0.0.1)
        ▼
FastAPI + Pydantic + local capability guards
        │
        ├── SQLite (progress, review state, notes, journal metadata)
        ├── content/curriculum.json (phase/module roadmap)
        ├── content/lessons/*.md (source of truth)
        ├── content/lessons.json (generated runtime catalog)
        ├── .data/workspaces (exercise sandboxes)
        └── Git/VS Code adapters (explicit local actions)
```

## Content pipeline

Markdown frontmatter và body là nguồn chuẩn để reviewer đọc diff. `scripts/build_lesson_catalog.py` parse chúng thành `content/lessons.json`, sau đó `scripts/validate_content.py` kiểm tra:

- 23 phase / 208 lesson và ID resolve;
- prerequisite/next lesson không có vòng lặp;
- objective, explanation, practice, checklist, resource guidance và review card;
- Python snippet đánh dấu `runnable` có thể compile;
- formula/code/review answer không bị copy generic hàng loạt;
- accelerated track map và workload.

JSON generated được commit để fresh clone chạy ngay, nhưng không được sửa tay thay cho Markdown.

## Runtime data và portable mode

Source clone dùng `.data/` trong project để thuận tiện backup local; portable executable dùng data root writable của user (`%LOCALAPPDATA%\JourneyAIEngineer`) và có `JOURNEY_DATA_DIR` override. `JOURNEY_PROJECT_ROOT` trỏ tới clone repo khi cần export artifact/Git. Database, `.env`, token và journal riêng luôn ở ngoài source artifact.

## Local capability boundary

Các route đọc Git, mở folder/VS Code, tạo workspace và chạy test là local capabilities. Chúng có path allowlist, timeout, output cap, secret scan và confirmation trước publish. API chỉ bind loopback; health response không được trả absolute path hoặc credential. `local_tools_enabled` có thể tắt capability khi cần.

Web beta tách các adapter local khỏi frontend hosted, dùng Supabase Auth và Postgres/RLS.
Không triển khai public bằng cách expose FastAPI local hiện tại.

## Web beta

The deployed web beta uses a separate runtime:

```text
Cloudflare Pages (React/Vite static SPA)
        │ Supabase JS with the learner's JWT
        ▼
Supabase Auth + Postgres + RLS
        │
        └── per-user progress, reviews, notes, journal, settings and sessions

Desktop/local remains: React → FastAPI loopback → SQLite + workspace/Git adapters
```

The web runtime imports a static curriculum catalog and has no route to local filesystem, Git, VS Code, test runner, backup database or subprocess code. Web and desktop learning data are separate in beta; no automatic two-way migration is promised. See [WEB-BETA.md](WEB-BETA.md) for the deployment gate and [WEB-BETA-PRIVACY.md](WEB-BETA-PRIVACY.md) for data handling.

## Learning state

Nội dung card (`review_cards`) bất biến; lịch học (`review_state`) lưu due time, interval, ease, repetitions, lapses và suspended/leech. Migration additive giữ progress/history cũ. SM-2 scheduler nhận `again`, `hard`, `good`, `easy`; review sai liên kết trở lại lesson/topic yếu.

## Release flow

```text
Markdown edit → build/validate → Python tests → lint/build
             → build_exe.ps1 → package_release.ps1
             → versioned ZIP + SHA256SUMS → human review → GitHub Release
```

CI chạy content validation, Python tests, `pip check`, `npm ci`, lint và Vite build. Release package không chứa `.data`, database, `.venv`, `node_modules`, `.env`, secret hoặc build cache. SmartScreen warning là hệ quả binary chưa code-sign, không phải dấu hiệu checksum đã xác minh nhà phát hành.

## Public product roadmap

- **v0.1:** local single-user, source clone, portable Windows package, bilingual lessons, workspace, review, journal và Git context bridge.
- **Web beta đã triển khai:** Cloudflare Pages + Supabase Auth/Postgres/RLS, email/password authentication
  và lưu dữ liệu học theo tài khoản. Xem [WEB-BETA.md](WEB-BETA.md) để biết trạng thái rollout auth.
- **Sau beta:** public learning hub/feedback moderation, self-service account deletion,
  stronger hosted E2E/monitoring và optional provider adapters; giữ local export/import làm đường lui.
