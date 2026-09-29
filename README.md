# Journey AI Engineer

> **Local-first learning product cho AI Engineer** — học theo roadmap, làm bài trong VS Code, ôn tập có lịch, lưu journal và tạo project evidence có thể review.

[![CI](https://github.com/Hzyl/JourneyAIEngineer/actions/workflows/ci.yml/badge.svg)](https://github.com/Hzyl/JourneyAIEngineer/actions/workflows/ci.yml)
[![Latest release](https://img.shields.io/github/v/release/Hzyl/JourneyAIEngineer?display_name=tag)](https://github.com/Hzyl/JourneyAIEngineer/releases/latest)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)

Journey AI Engineer biến việc học AI Engineer thành một vòng lặp có thể kiểm chứng:

~~~text
Roadmap → Lesson → Practice Lab → Test → Review → Journal → Git evidence
~~~

Mục tiêu của sản phẩm là giúp người học đi từ Python/software engineering đến machine learning, deep learning, LLM/RAG, evaluation, observability và system design. Nội dung giải thích chính nằm trong app bằng tiếng Việt, thuật ngữ giữ bằng English và có resource chính thức để đọc sâu.

> **Phiên bản hiện tại: v0.1.2 public beta.** Đây là app local-first, single-user trên Windows. v0.1 chưa có tài khoản, cloud sync, public hosted API hay API AI trả phí. Đừng expose API local ra Internet.

---

## Chọn cách dùng

### Cách 1 — Portable .exe: dành cho người muốn tải về và học ngay

Dùng cách này nếu bạn chỉ muốn thử app, không muốn cài Python/Node/Git và không cần sửa source code.

1. Mở [GitHub Releases](https://github.com/Hzyl/JourneyAIEngineer/releases/latest).
2. Tải **JourneyAIEngineer-v0.1.2-windows-x64.zip** và **SHA256SUMS.txt** trong cùng release.
3. Kiểm tra checksum theo hướng dẫn bên dưới.
4. Giải nén ZIP vào một thư mục riêng, ví dụ `C:\Users\<you>\Documents\JourneyAIEngineer`.
5. Mở thư mục vừa giải nén và double-click **JourneyAIEngineer.exe**.

App sẽ tự khởi động server chỉ trên máy bạn, mở trình duyệt và không mở cửa sổ terminal. Khi tab cuối cùng đóng, server local sẽ tự dừng sau một khoảng ngắn.

Nếu Windows SmartScreen cảnh báo, hãy kiểm tra đúng nguồn tải và checksum. Binary beta chưa được code-sign nên cảnh báo này có thể xuất hiện.

### Kiểm tra SHA-256 trên PowerShell

Chạy trong thư mục chứa ZIP và SHA256SUMS.txt:

~~~powershell
$zip = '.\JourneyAIEngineer-v0.1.2-windows-x64.zip'
$expected = ((Get-Content '.\SHA256SUMS.txt' -Raw).Trim() -split '\s+')[0].ToLowerInvariant()
$actual = (Get-FileHash $zip -Algorithm SHA256).Hash.ToLowerInvariant()

if ($actual -ne $expected) {
  throw 'Checksum không khớp. Xóa ZIP và tải lại từ GitHub Release.'
}

'Checksum OK: ' + $actual
~~~

Portable app lưu tiến trình ở:

~~~text
%LOCALAPPDATA%\JourneyAIEngineer
~~~

Nơi này chứa database, review state, notes, journal và workspace local của **riêng người đang dùng máy**. Nó không được commit lên GitHub và không tự publish artifact.

Có thể đổi data root trước khi mở app:

~~~powershell
$env:JOURNEY_DATA_DIR = "$env:USERPROFILE\JourneyAIEngineerData"
.\JourneyAIEngineer.exe
~~~

### Cách 2 — Source clone: dành cho học viên muốn sửa code và push artifact

Dùng cách này nếu bạn muốn sửa lesson, làm exercise trong VS Code, xem Git diff, tạo commit và đưa artifact lên fork/repository của mình.

Source clone **không tự xuất hiện trên Desktop**. Git sẽ tạo folder ngay trong thư mục hiện tại của PowerShell. Ví dụ, để clone vào Desktop:

~~~powershell
Set-Location "$env:USERPROFILE\Desktop"
git clone https://github.com/Hzyl/JourneyAIEngineer.git
Set-Location .\JourneyAIEngineer
~~~

Nếu repository đang private, tài khoản GitHub của bạn phải được cấp quyền trước khi clone. Khi repository public, mọi người có thể clone bằng lệnh trên.

Cài yêu cầu:

- Windows 10/11
- Python 3.11+
- Node.js 20+
- Git
- VS Code (khuyến nghị cho exercise)
- Docker **không bắt buộc** cho local v0.1

Thiết lập và chạy:

~~~powershell
.\scripts\setup.ps1
.\scripts\dev.ps1
~~~

Mở [http://127.0.0.1:5173](http://127.0.0.1:5173). Dữ liệu runtime của source clone nằm trong .data\; thư mục này đã được ignore.

Muốn dừng app dev, quay lại cửa sổ PowerShell đang chạy dev.ps1 và nhấn **Ctrl+C**.

### Portable và source clone khác nhau thế nào?

| Bạn muốn làm gì? | Dùng | Dữ liệu | GitHub |
| --- | --- | --- | --- |
| Học ngay bằng double-click | Portable ZIP + .exe | `%LOCALAPPDATA%\JourneyAIEngineer` | Không tự push |
| Sửa lesson/exercise, mở VS Code | Source clone | `.data\` trong clone | Có thể review diff rồi push |
| Chia sẻ cho nhiều tài khoản qua web | Chưa hỗ trợ ở v0.1 | Cần hosted architecture | Cần auth, Postgres/RLS, rate limit |

Portable build có thể dùng workspace local. Nếu muốn export artifact/Git từ portable, đặt biến môi trường tới một source clone mà bạn sở hữu **trước khi mở executable**:

~~~powershell
$env:JOURNEY_PROJECT_ROOT = 'C:\src\JourneyAIEngineer'
.\JourneyAIEngineer.exe
~~~

Không có source clone, app vẫn dùng được cho học, review và test local; UI sẽ tắt các thao tác publish GitHub thay vì báo lỗi mơ hồ.

---

## Một vòng học mẫu

1. Mở **Roadmap**, chọn phase và lesson phù hợp với prerequisite.
2. Đọc concept notes, ví dụ, common mistakes và completion criteria ngay trong app.
3. Từ **Practice Lab**, tạo workspace; app trỏ VS Code vào đúng thư mục.
4. Tự làm trước, chạy test theo exercise manifest và lưu output/evidence.
5. Đánh dấu lesson, trả lời review card (again, hard, good, easy).
6. Ghi điều đã học vào **Journal**; khi bị kẹt, tạo context export rồi tự dán sang ChatGPT/Codex.
7. Mở **Journal & Git**, đọc diff, kiểm tra secret và chỉ publish artifact sau khi xác nhận.

App không gọi API AI trực tiếp ở v0.1 và không cần API key. Context bridge chỉ tạo Markdown để người học kiểm soát nội dung, chi phí và dữ liệu gửi ra ngoài.

## Có gì trong sản phẩm?

- **23 phase / 208 lesson** theo dependency graph từ software engineering đến AI system design.
- Song ngữ Việt/English, objective, prerequisite, walkthrough, code example, practice, resource guidance và review cards.
- Track **Standard** (12–15 tháng) và **Accelerated** (học để tạo evidence sớm).
- Workspace và test contract cho exercise; có thể mở trực tiếp bằng VS Code.
- Spaced review, weak-topic detection, notes, journal và context export.
- Git status/diff, secret redaction, commit message gợi ý và publish sau xác nhận.
- Backup/export progress và dữ liệu học local.
- Resource library official-first; tài liệu community được gắn nhãn để phân biệt với nguồn chính thức.

Các project showcase gồm LLM Chat API, Document Intelligence, Advanced RAG, AI Assistant với database/API, Research Assistant Agent và End-to-End Production GenAI System.

---

## Dữ liệu, riêng tư và giới hạn

- Source code, lesson Markdown và tài liệu có thể commit lên GitHub.
- .data\, database, .env, .venv\, journal private, token và secret **không được commit**.
- Portable runtime lưu trong %LOCALAPPDATA%\JourneyAIEngineer; xóa thư mục này có thể làm mất progress chưa backup.
- Local API chỉ bind 127.0.0.1. Không forward port, không bind 0.0.0.0 và không dùng nó như public code-execution endpoint.
- v0.1 chưa có login, password recovery, multi-user isolation, public progress sync hay cloud backup.
- Nếu bạn muốn chia sẻ beta khi repository còn private, người thử cần được cấp quyền GitHub; Release/clone sẽ không mở cho người ngoài. Khi sẵn sàng public, hãy kiểm tra secret/history scan trước khi đổi visibility.

Xem [SECURITY.md](SECURITY.md) để hiểu local boundary và cách báo cáo lỗ hổng.

Security audit trong repository là **passive inventory**: `scripts/security_audit.py` chỉ đọc route/schema/source pattern, không gửi request, không gọi handler, không tạo payload và không tự chạy RedAmon. Chỉ kiểm tra target mà bạn sở hữu hoặc được ủy quyền trong môi trường staging cô lập.

---

## Đóng góp và feedback

- Lỗi có thể tái hiện: dùng [Bug report](https://github.com/Hzyl/JourneyAIEngineer/issues/new?template=bug_report.yml).
- Ý tưởng về lesson/UX: dùng [Feature request](https://github.com/Hzyl/JourneyAIEngineer/issues/new?template=feature_request.yml).
- Trao đổi trải nghiệm beta: dùng [GitHub Discussions](https://github.com/Hzyl/JourneyAIEngineer/discussions).
- Thay đổi code/content: đọc [CONTRIBUTING.md](CONTRIBUTING.md), tạo branch và mở pull request.

Khi báo lỗi, hãy ghi mode (Portable hoặc Source clone), version/commit, Windows/browser, bước tái hiện, expected và actual behavior. Không gửi token, database, journal riêng hoặc file .env.

---

## Kiểm tra contributor

Sau khi clone và chạy setup:

~~~powershell
python scripts/build_lesson_catalog.py
python scripts/validate_content.py
python -m pytest -q --basetemp .build\pytest -o cache_dir=.build\pytest-cache
npm ci
npm run lint
npm run build
npm run test:e2e
~~~

Hoặc dùng:

~~~powershell
.\scripts\test.ps1
~~~

Đóng gói bản Windows:

~~~powershell
npm run package:windows
~~~

Script sẽ chạy quality gates, build JourneyAIEngineer.exe, tạo ZIP versioned và SHA256SUMS.txt trong:

~~~text
.build\releases\
~~~

ZIP chỉ chứa executable và tài liệu tối thiểu; không chứa .data\, database, .venv\, node_modules, .env hoặc journal runtime.

---

## Kiến trúc ngắn gọn

~~~mermaid
flowchart LR
    UI[React + TypeScript + Vite] --> API[FastAPI loopback]
    API --> DB[(SQLite local)]
    API --> CAT[Generated lesson catalog]
    API --> WS[Workspace + test runner]
    API --> GIT[Local Git/context bridge]
    SRC[Markdown/YAML lessons] --> BUILD[Build + validation]
    BUILD --> CAT
~~~

Markdown/YAML là source of truth cho lesson; content/lessons.json là catalog generated để app chạy nhanh sau fresh clone. Database runtime không nằm trong source tree public.

Đọc thêm:

- [Windows quickstart](docs/QUICKSTART-WINDOWS.md)
- [Public beta guide](docs/PUBLIC-BETA.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Study playbook](content/study-playbook.md)

## Roadmap

- **v0.1:** local-first single-user, bilingual curriculum, review, workspace, journal, Git context bridge, source clone và Windows portable release.
- **v0.2:** public read-only learning hub và feedback moderation sau khi chốt auth/data isolation.
- **v0.3:** optional hosted progress sync, account recovery và provider adapters; local export/import vẫn là đường lui.

## License

Source code của repository dùng [Apache-2.0](LICENSE). Nội dung, dataset, model và code bên thứ ba giữ license riêng; hãy xem attribution trước khi tái sử dụng.
