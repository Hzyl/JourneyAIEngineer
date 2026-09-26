# Journey AI Engineer

Một chương trình học AI Engineer chạy local: roadmap 53 tuần, lesson song ngữ, review cards, bài tập mở trong VS Code, journal và Git context bridge.

## Chạy nhanh trên Windows

```powershell
.\scripts\setup.ps1
.\scripts\dev.ps1
```

Sau đó mở frontend tại http://127.0.0.1:5173.

## Thành phần

- `apps/api`: FastAPI + SQLite, seed curriculum từ `content/curriculum.json`.
- `src`: React/Vite UI.
- `content`: chương trình học và hướng dẫn công cụ, được version-control.
- `.data`: database, workspace bài tập và output runtime; không commit.
- `journal`: weekly reflection và artifact có thể push lên GitHub.

## Các luồng chính

1. Mở **Lộ trình**, chọn lesson và đọc mục tiêu/checklist.
2. Đánh dấu lesson hoàn thành sau khi tự làm exercise.
3. Mở **Bài tập**, tạo workspace rồi mở bằng VS Code.
4. Chạy test trong app; runner chỉ chạy command do exercise manifest khai báo.
5. Ôn card trong **Ôn tập**.
6. Export journal hoặc context ở **Journal & Git**.
7. Review `git diff`, sau đó tự commit/push khi đã kiểm tra.

## Nội dung học

Curriculum gồm 8 phase từ onboarding đến capstone: Python/software engineering, toán ML, classical ML, PyTorch, MLOps, NLP/LLM/RAG và portfolio/career. Mỗi module có lesson, exercise và review item seed tự động.

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

Dashboard theo dõi tổng tiến độ, thời gian học trong tuần, mục tiêu tuần, số lesson đã học và streak. Roadmap có bộ lọc theo phase, trạng thái và từ khóa. Review dùng bốn mức `again`, `hard`, `good`, `easy`, lưu lịch sử và chỉ ra chủ đề yếu. Exercises tạo workspace trong `.data/workspaces`, mở bằng VS Code, chạy command kiểm thử được khai báo trong exercise manifest và lưu lịch sử chạy.

## Hai nhịp học

- **12–15 tháng / 53 tuần:** nhịp chuẩn cho sinh viên năm cuối, khoảng 12–15 giờ mỗi tuần.
- **6 tháng / 26 tuần:** nhịp tăng tốc, dùng khi cần chuẩn bị portfolio hoặc xin thực tập sớm.

Chọn nhịp trong **Settings**. Nội dung vẫn là cùng một curriculum bảy chặng chuyên môn cộng onboarding: Python/software engineering, toán và statistics cho ML, classical ML, PyTorch, deployment/MLOps, NLP/LLM/RAG, capstone và career.

## Content và kiểm tra chất lượng

`content/curriculum.json` là roadmap cấp phase/module. `content/lessons.json` là catalog song ngữ có objectives, prerequisites, key terms, concept notes, formulas, code examples, resources chính thức, exercise/review links, completion criteria, common mistakes và next lessons. Khi sửa roadmap, chạy:

```powershell
python scripts/build_lesson_catalog.py
python scripts/validate_content.py
```

`scripts/test.ps1` chạy validation nội dung, backend pytest và frontend build. Database local được migration additive khi khởi động để không làm mất progress, review history, notes hoặc settings.

## GitHub journey

Remote mặc định của project là repository private `Hzyl/JouneyAIEngineer`. Chỉ các artifact học tập mới nên được commit:

```text
content/       # curriculum và lesson notes đã chọn
exercises/     # bài làm có thể review
journal/       # weekly reflection và export
projects/      # portfolio, evaluation, architecture decision
```

`.data/`, `.venv/`, `node_modules/`, database, secret và API key đã nằm trong `.gitignore`. App chỉ gợi ý commit message và hiển thị diff đã redact secret; nó không tự commit hoặc push. Trước khi push, hãy review diff và dùng các dạng message như `learn(phase-03): explain precision recall` hoặc `journal(week-08): record debugging lessons`.
