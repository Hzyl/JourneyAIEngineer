# Đóng góp cho Journey AI Engineer

Journey AI Engineer là ứng dụng học tập ưu tiên lưu dữ liệu trên máy cá nhân. Nội dung, mã mẫu và bài làm cần dễ đọc, chạy lại được và có kết quả để kiểm chứng. Khi đóng góp, hãy giải thích thay đổi giúp người học hiểu hoặc thực hành tốt hơn như thế nào.

## Bắt đầu trong 5 phút

Windows PowerShell:

```powershell
git clone https://github.com/Hzyl/JourneyAIEngineer.git
Set-Location JourneyAIEngineer
.\scripts\setup.ps1
.\scripts\dev.ps1
```

`setup.ps1` tạo `.venv`, cài thư viện cho phần máy chủ và giao diện, rồi chuẩn bị thư mục dữ liệu trên máy. Không đưa cơ sở dữ liệu đang sử dụng, tiến trình học cá nhân, `.env` hoặc thư mục bài tập vào commit.

## Nguyên tắc của kho mã

- **Nội dung có hai lớp.** Markdown trong `content/lessons/` tạo danh mục nền `content/lessons.json`; `content/curated/<lesson_id>.json` thay thế bài cùng ID ở cả bản trên máy cá nhân và bản web. Nếu đã có tệp trong `curated/`, sửa tệp đó. Giữ nguyên ID, quan hệ bài cần học trước và thẻ ôn tập; xem [chuẩn nội dung](docs/CURRICULUM-STANDARDS.md), [cách biên tập tiếng Việt](docs/VIETNAMESE-EDITORIAL.md) và [mẫu đóng góp](docs/LESSON-CONTRIBUTION.md).
- Bài học phải có đủ phần giải thích trong ứng dụng. Liên kết ngoài dùng để đọc sâu hoặc đối chiếu, không thay thế phần giải thích khái niệm.
- Ví dụ mã phải ghi rõ `runnable` hay `conceptual`, cách chuẩn bị, kết quả mong đợi và trường hợp biên.
- Không đưa khóa API, token, tệp cơ sở dữ liệu, `.venv`, `node_modules`, tệp `.env` hoặc nhật ký riêng vào pull request.
- Các đường dẫn API mở VS Code, chạy bài tập và đọc Git chỉ hoạt động trên máy người học. Không biến chúng thành API công khai.
- Ưu tiên các thành phần giao diện dễ hiểu, hỗ trợ người dùng có nhu cầu tiếp cận khác nhau và dùng các biến thiết kế CSS hiện có. Chỉ thêm bộ thư viện giao diện lớn khi có nhu cầu cụ thể.

## Sửa nội dung bài học

Mỗi bài Markdown cần có phần khai báo đầu tệp (frontmatter) hợp lệ:

```yaml
slug: phase-01-python-software-functions
phase_id: phase-01-python-software
module_id: phase-01-python-software-functions
order: 2
title_vi: Hàm và luồng dữ liệu
title_en: Functions and data flow
estimated_minutes: 75
difficulty: beginner
prerequisites: [phase-01-python-software-syntax]
next_lessons: [phase-01-python-software-testing]
```

Nội dung cần nêu rõ bạn sẽ làm được gì, kiến thức dùng ở đâu, ví dụ nào chạy được, cách tự kiểm tra, lỗi thường gặp và bài nên học tiếp. Thẻ ôn tập cần có câu hỏi nhớ lại/giải thích, vận dụng/viết mã, sửa lỗi/đọc chỉ số và phỏng vấn. Mỗi đáp án phải gắn với nội dung bài; không chép một đáp án cho hàng loạt bài.

Sau khi sửa, sinh lại danh mục và chạy các bước kiểm tra:

```powershell
python scripts/build_lesson_catalog.py
python scripts/catalog_version.py --write
python scripts/validate_content.py
python -m pytest -q tests/test_content_foundation.py --basetemp .build\pytest-content -o cache_dir=.build\pytest-cache
```

Nếu sửa lộ trình ở cấp giai đoạn hoặc mô-đun, kiểm tra cả `content/curriculum.json` và danh mục được sinh lại trong cùng pull request. Bộ kiểm tra sẽ kiểm tra ID, quan hệ bài cần học trước, mã Python gắn nhãn `runnable`, liên kết tài liệu/bài tập/thẻ ôn và nội dung trùng lặp.

## Sửa phần máy chủ hoặc giao diện

Backend:

```powershell
.\.venv\Scripts\python.exe -m pytest -q --basetemp .build\pytest-api -o cache_dir=.build\pytest-cache
```

Frontend:

```powershell
npm ci
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

`test:e2e` starts a loopback FastAPI process and Vite dev server through
`playwright.config.ts`, then checks the dashboard, primary navigation and a
lesson deep link in Chromium. It does not call an external AI API. CI installs
the browser before running the same command.

Kiểm tra thao tác bằng bàn phím, màn hình rộng 390px, dấu hiệu phần tử đang được chọn và chữ tiếng Việt có dấu. Phản hồi API không được lộ đường dẫn tuyệt đối hoặc thông tin đăng nhập. Khi sửa API trên máy cá nhân, giữ giới hạn địa chỉ nội bộ, danh sách đường dẫn được phép, thời gian chờ, cơ chế che thông tin bí mật và bước xác nhận trước khi công bố qua Git.

Xem [các đề xuất đóng góp ban đầu](docs/STARTER-ISSUES.md) để chọn việc có tiêu chí hoàn thành cụ thể. Người duy trì sẽ chọn và mở mục công việc trên GitHub; danh sách chưa được đăng tự động.

## Nhánh, commit và pull request

- Đặt tên nhánh ngắn, mô tả được mục tiêu: `content/phase-03-metrics`, `fix/mobile-drawer`, `docs/release-guide`.
- Commit nhỏ, dùng dạng `learn(phase-03): explain precision recall`, `fix(ui): preserve lesson deep link`, `docs: add Windows release guide`.
- Pull request cần nêu vấn đề, cách ứng dụng hoạt động sau thay đổi, kiểm thử đã chạy và ảnh hoặc video nếu sửa giao diện.
- Khi gộp commit, giữ lại thông tin kiểm chứng mà người đánh giá cần để tìm nguyên nhân lỗi.
- Chỉ người duy trì phát hành phiên bản hoặc đổi chế độ công khai/riêng tư của kho mã.

## Tự kiểm tra trước khi gửi PR

- [ ] Phần thay đổi không có thông tin bí mật, `.data`, cơ sở dữ liệu, `.venv`, `node_modules` hoặc kết quả đóng gói.
- [ ] `python scripts/validate_content.py` đạt nếu có sửa nội dung.
- [ ] Kiểm thử máy chủ và `npm run lint`/`npm run build` đạt nếu có sửa mã.
- [ ] Có kiểm thử cho hành vi mới hoặc giải thích vì sao kiểm thử hiện có đã đủ.
- [ ] Cập nhật README/tài liệu nếu lệnh, thư mục dữ liệu hoặc giới hạn bảo mật thay đổi.
- [ ] Không mô tả SQLite hoặc tệp thực thi trên máy cá nhân như dịch vụ trực tuyến dành cho nhiều người dùng.

## Giấy phép và nội dung bên thứ ba

Mã nguồn của kho này phát hành theo Apache-2.0. Tài liệu, mô hình, tập dữ liệu và đoạn mã của bên thứ ba vẫn có giấy phép riêng. Hãy liên kết, ghi nhận nguồn và không sao chép nguyên văn tài liệu có bản quyền vào bài học.
