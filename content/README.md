# Nội dung chương trình học

Nội dung được lưu riêng với tiến trình học của bạn. Khi biên tập, sửa đúng nguồn rồi
sinh lại danh mục; không xóa cơ sở dữ liệu để cập nhật bài học.

## Sửa ở đâu?

| Nội dung cần sửa | Nguồn cần đọc và chỉnh |
| --- | --- |
| Lộ trình, giai đoạn, mô-đun và thứ tự bài | `curriculum.json` |
| Hướng dẫn thực hành và cách tự kiểm tra của mô-đun | `module_guides.json` |
| Bài học nền | Markdown trong `lessons/`, cùng phần sinh nội dung trong `scripts/build_lesson_catalog.py` |
| Bài đã có bản biên tập riêng | `curated/<lesson_id>.json` |
| Công cụ, tài liệu và hướng học | `tools.json`, `resources.json`, `learning_routes.json` |
| Đề bài, mã khởi đầu và lời giải | `exercises.json`, `exercise_templates/`, `worked_solutions/` |

`lessons.json` là danh mục được sinh tự động. Không sửa trực tiếp tệp này: lần sinh
kế tiếp sẽ ghi đè thay đổi. Cả bản trên máy cá nhân và bản web đều ưu tiên bài trong
`curated/` khi ID trùng với danh mục nền. Vì vậy, sửa bài nền sẽ không thay đổi phần
người học thấy nếu bài đó đã có bản trong `curated/`.

Giữ nguyên ID bài học, giai đoạn, mô-đun, bài tập và thẻ ôn tập. Chỉ thay quan hệ bài
cần học trước khi đã kiểm tra ảnh hưởng. Đọc [chuẩn nội dung](../docs/CURRICULUM-STANDARDS.md),
[cách đóng góp bài học](../docs/LESSON-CONTRIBUTION.md) và
[hướng dẫn biên tập tiếng Việt](../docs/VIETNAMESE-EDITORIAL.md).

## Sinh lại và kiểm tra

Chạy từ thư mục gốc của kho mã sau khi sửa nguồn:

```powershell
python scripts/build_lesson_catalog.py
python scripts/catalog_version.py --write
python scripts/validate_content.py
```

Đọc phần thay đổi của danh mục và chạy các kiểm thử liên quan trước khi gửi đề xuất.
Bộ kiểm tra phát hiện bài thiếu hướng dẫn, tài nguyên thiếu cách đọc, liên kết không
hợp lệ và mô-đun thiếu hướng dẫn. Kết quả kiểm tra tự động không thay thế việc đọc bài,
chạy ví dụ và kiểm tra cách diễn đạt.

## Một bài học cần giúp bạn làm gì?

Mỗi bài có mục tiêu, kiến thức cần biết trước, giải thích, ví dụ, bài thực hành,
câu hỏi ôn tập, lỗi thường gặp và cách tự kiểm tra. Các trường `why_it_matters_vi/en`,
`study_steps_vi/en`, `practice_plan` và `interview_questions` bổ sung mục đích học và
hướng dẫn thực hành. Giữ phần giải thích chính trong ứng dụng; liên kết ngoài để đọc sâu.

Mỗi tài nguyên có mục đích (`purpose_*`), phần cần đọc (`read_*`), ngôn ngữ và cờ
`required`. Loại `kind: in_app` dẫn tới giải thích trong bài; tài nguyên bên ngoài
dùng URL `https://` mở được trực tiếp.

Thư mục bài tập thường có `starter.py`, `test_exercise.py` và README. Hãy đọc quy định
của từng bài: bài có kiểm thử hành vi khác với bài tự tổng kết. Việc có hai trường
`result` và `explanation` không đủ chứng minh đáp án đúng hoặc bạn đã thành thạo.

`program.portfolio_projects` mô tả bốn mốc dự án: học máy với dữ liệu bảng, học sâu,
RAG tiếng Việt và dự án tổng kết. `program.career_checklist` giúp bạn tự xem lại mức
sẵn sàng nghề nghiệp và chất lượng bài làm; đây không phải cam kết tuyển dụng.

## Giữ dữ liệu học khi cập nhật nội dung

Bản trên máy cá nhân khởi tạo nội dung trong SQLite và có cơ chế bổ sung cấu trúc,
cập nhật nội dung cho cơ sở dữ liệu hiện có. Không xóa `.data/journey.db` chỉ để làm mới
danh mục. Sau khi sinh lại nội dung, khởi động lại ứng dụng và kiểm tra bài vừa sửa,
tiến độ cùng lịch ôn đã có.

Trước thay đổi lớn về cấu trúc hoặc dữ liệu khởi tạo, tạo bản sao lưu đầy đủ bằng
chức năng sao lưu của ứng dụng. Xuất nhật ký để đọc là thao tác riêng, không thay thế
bản sao lưu tiến độ và lịch ôn. Nếu cập nhật lỗi, giữ nguyên dữ liệu để chẩn đoán;
không xóa cơ sở dữ liệu như một bước khắc phục mặc định.