# Journey AI Engineer

Một chương trình học AI Engineer chạy local: roadmap core 53 tuần + 15 chặng GenAI (68 tuần nếu học đầy đủ), lesson song ngữ, review cards, bài tập mở trong VS Code, journal và Git context bridge.

## Chạy nhanh trên Windows

```powershell
.\scripts\setup.ps1
.\scripts\dev.ps1
```

Sau đó mở frontend tại http://127.0.0.1:5173.

## Đóng gói thành một file `.exe`

Nếu muốn mở app bằng double-click thay vì chạy hai development server, chạy:

```powershell
.\scripts\build_exe.ps1
```

Script sẽ build frontend production, cài PyInstaller vào `.venv` nếu máy chưa có, rồi tạo `JourneyAIEngineer.exe` ngay tại thư mục project. Double-click file này để app tự khởi động API, phục vụ giao diện local và mở trình duyệt. App chọn port trống bắt đầu từ `8765` nên không bị phụ thuộc vào development server.

Database, workspace bài tập và journal của bản `.exe` được giữ trong `.data` và `journal` cạnh file executable. Vì vậy rebuild hoặc thay file `.exe` không làm mất tiến trình. Sau mỗi thay đổi source, chạy lại `scripts\build_exe.ps1` để tạo executable mới; file `.exe` được ignore và không push vào GitHub.

Bản packaged chạy nền không hiện terminal. Mỗi browser tab gửi heartbeat local; khi tab cuối cùng đóng, app gửi `disconnect` bằng `sendBeacon` và launcher chờ một khoảng an toàn khoảng 15–20 giây trước khi tự tắt. Progress, study session, settings, review history và checklist đã lưu được ghi ngay vào SQLite/localStorage; ghi chú đang soạn chỉ được ghi khi bấm **Lưu ghi chú**. Khi mở lại shortcut, app sẽ khởi động một process sạch và mở tab mới.

## Thành phần

- `apps/api`: FastAPI + SQLite, seed curriculum từ `content/curriculum.json`.
- `src`: React/Vite UI.
- `content`: chương trình học và hướng dẫn công cụ, được version-control.
- `content/resources.json`: thư viện 50 nguồn sách, course, documentation và repository; có mapping theo phase, cách đọc và link gốc.
- `.data`: database, workspace bài tập và output runtime; không commit.
- `journal`: weekly reflection và artifact có thể push lên GitHub.

## Các luồng chính

1. Mở **Lộ trình**, chọn lesson và đọc mục tiêu/checklist.
2. Đánh dấu lesson hoàn thành sau khi tự làm exercise.
3. Mở **Bài tập**, tạo workspace rồi mở bằng VS Code.
4. Chạy test trong app; runner chỉ chạy command do exercise manifest khai báo.
5. Ôn card trong **Ôn tập**.
6. Export journal hoặc context ở **Journal & Git**.
7. Mở **Tài liệu** để lọc nguồn theo phase, loại tài liệu hoặc từ khóa; ưu tiên đọc một nguồn rồi quay lại làm bài.
8. Review `git diff`, sau đó tự commit/push khi đã kiểm tra.

## Feedback và cộng đồng (local beta)

Trong mỗi lesson có panel **Giúp bài học tốt hơn**. Bạn có thể báo phần khó hiểu, lỗi chính tả/link, thiếu ví dụ/tài liệu, vấn đề bài tập hoặc đề xuất tính năng. Nội dung được trim và giới hạn 2.000 ký tự, lưu vào SQLite ở trạng thái `pending`; React hiển thị plain text nên không biến nội dung góp ý thành HTML.

Trang **Cộng đồng** chỉ đọc feedback có trạng thái `accepted` hoặc `implemented`. Email, tiến độ, Journal và ghi chú riêng không đi vào payload public. Bản local không cần tài khoản; nếu sau này mở beta online, lớp auth/RLS và moderation phải được thêm ở backend/cloud, không đặt admin token trong frontend.

Moderation local chỉ mở khi người vận hành tự cấu hình token trong process backend:

```powershell
$env:JOURNEY_FEEDBACK_ADMIN_TOKEN = "tao-mot-token-dai-ngau-nhien"
python -m uvicorn apps.api.main:app --reload --port 8000
```

Gọi `GET /api/feedback/moderation` hoặc `PATCH /api/feedback/{id}/moderation` bằng header `X-Journey-Admin-Token`. API fail-closed khi biến môi trường chưa có, kiểm tra transition trạng thái và không nhận token qua query string. Không commit token, `.data/journey.db` hoặc dữ liệu moderation lên GitHub. Khi mở public beta, nên chuyển feedback sang Postgres/RLS, thêm GitHub/email auth, rate limit, CAPTCHA/abuse review và quy trình export draft → người duyệt → commit thủ công.

Ví dụ xem hàng chờ và duyệt một góp ý trong PowerShell (chỉ chạy trên máy quản trị):

```powershell
$headers = @{ "X-Journey-Admin-Token" = $env:JOURNEY_FEEDBACK_ADMIN_TOKEN }
Invoke-RestMethod "http://127.0.0.1:8000/api/feedback/moderation?status=pending" -Headers $headers
Invoke-RestMethod "http://127.0.0.1:8000/api/feedback/1/moderation" -Method Patch -Headers $headers -ContentType "application/json" -Body '{"status":"triaged","moderation_note":"Cần kiểm tra lại ví dụ."}'
```

## RedAmon và kiểm thử bảo mật có ủy quyền

RedAmon ([`samugit83/redamon`](https://github.com/samugit83/redamon)) được ghi trong **Công cụ** như một security lab tham khảo, không được nhúng hoặc tự chạy trong Journey. Có thể dùng nó để kiểm tra sản phẩm của chính bạn sau khi tạo staging cô lập, dữ liệu giả, allowlist target và văn bản ủy quyền rõ ràng. Luồng nên bắt đầu bằng **Journey Passive Security Audit** → dependency/SAST → unit/integration test → staging có ủy quyền → chỉ khi thật sự cần mới cân nhắc tool bên ngoài → triage → sửa → regression test → security report.

Không trỏ RedAmon vào production/public target hoặc hệ thống của người khác; không đưa credential thật; không expose dashboard ra Internet; không auto-merge CodeFix. README của công cụ cảnh báo về reconnaissance/exploitation, lưu dữ liệu trong database, gửi dữ liệu tới LLM/API bên thứ ba và khả năng token/API key được lưu plaintext. Hãy xem tài liệu và license hiện hành trước mỗi lần dùng, pin version/image, chạy Docker/WSL2 trong filesystem Linux riêng và xóa dữ liệu thử nghiệm sau khi review.

### Passive Endpoint Security Review (safe mode)

Journey có một lớp review thụ động trong **Security Lab** và trong tester. Lớp này chỉ đọc route table của FastAPI, Pydantic body schema và một số pattern trong source; nó **không gửi network request, không gọi handler, không tạo payload, không clone/cài/chạy RedAmon**. Mục tiêu là lập inventory và đưa ra finding để bạn đọc code, không phải khẳng định endpoint đã bị khai thác.

Chạy từ thư mục project:

```powershell
python scripts/security_audit.py --format summary
python scripts/security_audit.py --format json > .data/security-audit.json
```

Report phân biệt `needs_human_review` với `verified_control`. Với finding cần review, đọc handler và schema, viết test control trong local/staging có ủy quyền, xác nhận có lỗi thật hay false positive, rồi sửa và chạy lại regression test. UI chỉ hiển thị đường dẫn source tương đối để không làm lộ profile máy. Nếu sau này mở app online, endpoint review này phải được giữ local-only hoặc đặt sau auth; không public inventory source cho người lạ.

## Nội dung học

Curriculum gồm 8 phase core từ onboarding đến capstone, sau đó nối thêm 15 chặng GenAI: Python/software engineering, toán ML, classical ML, PyTorch, MLOps, NLP/LLM/RAG, LLM application, RAG nâng cao, agents, evaluation, observability, production và system design. Mỗi module có lesson, exercise và review item seed tự động.

Trang **Tài liệu** là thư viện tham khảo riêng, không thay thế lesson. Nguồn community [`AI Engineering from Scratch`](https://github.com/rohitg00/ai-engineering-from-scratch) được giữ đúng URL bạn cung cấp và đặt cạnh các nguồn official như Python, NumPy, scikit-learn, PyTorch, FastAPI, Docker, MLflow, Hugging Face, Google ML, Stanford CS229, D2L và Full Stack Deep Learning. Các chặng GenAI bổ sung thêm nguồn cho function calling, JSON Schema, MCP, RAG evaluation, OpenTelemetry, Prometheus, Langfuse, Redis, vLLM, Ollama, PEFT và system design. Khi một nguồn community không truy cập được, dùng nguồn official cùng phase để tiếp tục học.

## GenAI specialization

Sau 8 phase core, roadmap có 15 chặng chuyên sâu bám theo năng lực GenAI đi làm: Software Engineering, ML fundamentals, Transformer, LLM application, RAG, Advanced RAG, Tool Calling, Agents, MCP, Evaluation, Observability, Production Engineering, Fine-tuning, Local LLM và AI System Design. Mỗi chặng có 4 lesson, bài thực hành, review card, nguồn đọc và checkpoint; tổng cộng thêm 60 lesson.

Sáu project mới được seed sẵn để tạo portfolio theo chuỗi tăng dần: **LLM Chat API**, **Document Intelligence System**, **Advanced RAG System**, **AI Assistant với Database & API**, **Research Assistant Agent** và **End-to-End Production GenAI System**. Mỗi project có stack, deliverables, evaluation, đường dẫn GitHub và số tuần dự kiến.

Nếu cần tạo lại dữ liệu curriculum sau khi chỉnh nội dung, chạy:

```powershell
python scripts/seed_genai_track.py
python scripts/build_lesson_catalog.py
python scripts/validate_content.py
```

Để biến roadmap thành năng lực có thể trình bày khi xin việc, đọc thêm [`content/study-playbook.md`](content/study-playbook.md). File này quy định nhịp 12–15 giờ mỗi tuần, vòng lặp của một lesson, chuẩn evidence cho project, cách luyện phỏng vấn và cách dùng trợ lý AI mà vẫn tự làm chủ code.

## Backend thủ công

```powershell
python -m uvicorn apps.api.main:app --reload --port 8000
```

## Frontend thủ công

```powershell
npm run dev
```

Không đặt API key trong `.env` hoặc source. MVP không gọi model cloud; nút context export tạo Markdown để copy sang ChatGPT/Codex.
## Cách học với app

Mỗi tuần nên đi theo một vòng lặp cố định: mở lesson và đọc mục tiêu, tự làm ví dụ trong workspace, chạy test, đánh dấu tiến độ, trả lời review card bằng lời của mình, rồi ghi lại một insight trong Journal. Khi bị kẹt, hãy tự thử trước, ghi giả thuyết và lỗi đã thấy, sau đó dùng **Journal & Git → Context bridge** để tạo một gói context có lesson, progress và note. Gói này không chứa API key; bạn có thể copy sang ChatGPT/Codex để nhận gợi ý từng bước.

Dashboard theo dõi tổng tiến độ, thời gian học trong tuần, mục tiêu tuần, số lesson đã học và streak. Timestamp vẫn được lưu ở UTC, còn streak và ngày trên lịch học được quy đổi theo timezone local của máy để phiên học gần nửa đêm không bị tính sai ngày. Roadmap có bộ lọc theo phase, trạng thái và từ khóa. Review dùng bốn mức `again`, `hard`, `good`, `easy`, lưu lịch sử và chỉ ra chủ đề yếu. Exercises tạo workspace trong `.data/workspaces`, mở bằng VS Code, chạy command kiểm thử được khai báo trong exercise manifest và lưu lịch sử chạy.

## Hai nhịp học

- **Core 53 tuần:** nền tảng bắt buộc từ onboarding đến capstone/career, khoảng 12–15 giờ mỗi tuần.
- **Core + GenAI 68 tuần:** nhịp đầy đủ để đi từ nền tảng đến vận hành hệ thống GenAI production.
- **Tăng tốc 34 tuần:** học các lesson và project theo thứ tự ưu tiên, dùng khi cần chuẩn bị portfolio sớm.

Chọn nhịp trong **Settings**. Nội dung core vẫn đi qua onboarding và 7 phase chuyên môn; track mở rộng thêm 15 chặng GenAI. App lưu progress ở SQLite local nên có thể dừng, đổi nhịp và tiếp tục mà không mất dữ liệu.

## Content và kiểm tra chất lượng

`content/curriculum.json` là roadmap cấp phase/module. `content/lessons.json` là catalog song ngữ có objectives, prerequisites, key terms, concept notes, formulas, code examples, resources chính thức, exercise/review links, completion criteria, common mistakes và next lessons. Khi sửa roadmap, chạy:

```powershell
python scripts/build_lesson_catalog.py
python scripts/validate_content.py
```

`scripts/test.ps1` chạy validation nội dung, backend pytest và frontend build. Database local được migration additive khi khởi động để không làm mất progress, review history, notes hoặc settings. Startup cũng đồng bộ bổ sung phase/module/lesson/exercise/review mới từ curriculum mà không reset dữ liệu cũ; nội dung đã bỏ khỏi roadmap không bị xóa tự động để giữ liên kết với lịch sử học tập.

## GitHub journey

### Luồng bài tập → VS Code → artifact → GitHub

Trong **Practice Lab**, mỗi bài có workspace riêng tại `.data/workspaces/<exercise-slug>`. Chọn **Tạo & mở VS Code** để app tự trỏ VS Code vào đúng thư mục; sửa `starter.py`, lưu bằng `Ctrl+S`, rồi chọn **Chạy test** để xem output và lịch sử chạy. **Mở thư mục** mở Explorer khi cần kiểm tra file bằng mắt.

Workspace mới luôn có `starter.py`, `test_exercise.py` và README riêng. Test đầu tiên có thể **fail có chủ đích** vì `solve()` còn `NotImplementedError`; hãy implement để trả về `result` và `explanation`, chạy lại đến khi pass, rồi thêm một edge case trước khi xuất artifact. Cách này biến bài tập thành một vòng red → implement → green thay vì chỉ kiểm tra syntax.

Khi bài đã đạt checkpoint, chọn **Lưu artifact**. App copy các file an toàn sang `exercises/<exercise-slug>/`, bỏ qua `.venv`, `__pycache__`, `.env`, database và symlink, đồng thời từ chối export nếu phát hiện chuỗi có vẻ là API key, token, password hoặc private key. Đây là bước tạo bằng chứng có thể review, không phải push tự động.

Sau đó mở **Journal & Git**, xem diff và quay lại panel **Review rồi mới push**. Nhập commit message, tick xác nhận đã đọc diff rồi bấm **Xác nhận & push GitHub**. Backend chỉ cho phép publish dưới `exercises/`, `projects/` hoặc `journal/`, từ chối nếu Git index đã có staged change, scan secret lần nữa và giữ commit local nếu push thất bại. App không lưu credential và không push khi chưa có checkbox xác nhận.

Remote mặc định của project là repository private `Hzyl/JouneyAIEngineer`. Chỉ các artifact học tập mới nên được commit:

```text
content/       # curriculum và lesson notes đã chọn
exercises/     # bài làm có thể review
journal/       # weekly reflection và export
projects/      # portfolio, evaluation, architecture decision
```

`.data/`, `.venv/`, `node_modules/`, database, secret và API key đã nằm trong `.gitignore`. App chỉ gợi ý commit message và hiển thị diff đã redact secret; nó không tự commit hoặc push. Trước khi push, hãy review diff và dùng các dạng message như `learn(phase-03): explain precision recall` hoặc `journal(week-08): record debugging lessons`.
