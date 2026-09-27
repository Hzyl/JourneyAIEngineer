# Curriculum content

## Lesson playbook và tài nguyên

`module_guides.json` chứa hướng dẫn riêng cho từng module: trọng tâm nghề nghiệp, bài thực hành và checkpoint. Script `build_lesson_catalog.py` dùng guide này để tạo `lessons.json`.

Mỗi lesson trong catalog có thêm `why_it_matters_vi/en`, `study_steps_vi/en`, `practice_plan` và `interview_questions`. `resources` không chỉ là tên link: mỗi tài nguyên có URL chính thức, ngôn ngữ, mục đích đọc (`purpose_*`), phần cần đọc (`read_*`) và cờ `required`. Resource `kind: in_app` trỏ về phần giải thích ngay trong lesson, còn resource external luôn là liên kết `https://` có thể mở trực tiếp.

Khi chỉnh nội dung, hãy chạy:

```powershell
python scripts/build_lesson_catalog.py
python scripts/validate_content.py
```

Validator sẽ chặn lesson thiếu playbook, tài nguyên không có hướng dẫn đọc, URL giả hoặc module chưa có guide.

Mỗi module cũng seed một exercise có task/checkpoint riêng từ `module_guides.json`. Workspace tạo mới gồm `starter.py`, `test_exercise.py` và README; test đầu tiên fail nếu learner chưa implement `solve()`, sau đó chuyển sang pass khi evidence có `result` và `explanation` hợp lệ.

`curriculum.json` là nguồn sự thật cho roadmap. Backend seed dữ liệu vào SQLite lần đầu khởi động.

Mỗi phase có module, lesson và tài liệu. Một module sinh ra một exercise workspace và mỗi lesson sinh ra một review card. Khi thay đổi curriculum sau khi database đã tồn tại, hãy xóa `.data/journey.db` trong môi trường local rồi chạy seed lại; không xóa database của người dùng nếu chưa export journal.

`tools.json` chứa hướng dẫn dùng công cụ theo tình huống. Nội dung lesson nên giữ ngắn, có mục tiêu, ví dụ, edge case và đường dẫn tới tài liệu chính thức để người học đọc sâu hơn.

`lessons.json` là catalog structured của từng lesson. Mỗi record có `lesson_id`, phase/module, tiêu đề song ngữ, objectives, prerequisites, key terms, concept notes, formulas, code examples, resources, exercise/review links, completion checklist, common mistakes và next lessons. Có thể chỉnh file này rồi chạy `python scripts/build_lesson_catalog.py` để tái tạo catalog từ roadmap.

Backend tự chạy migration additive cho database local hiện có và hydrate lại các trường lesson mới; không cần xóa `.data/journey.db` khi chỉ bổ sung nội dung. Trước khi thay đổi schema hoặc seed lớn, hãy export journal và tạo bản sao database.
`program.portfolio_projects` mô tả bốn mốc portfolio (tabular ML, deep learning, Vietnamese RAG và capstone); `program.career_checklist` là checklist kiểm tra trước khi xin thực tập hoặc junior role. Roadmap render hai phần này để mỗi phase luôn gắn với bằng chứng có thể ship lên GitHub.
