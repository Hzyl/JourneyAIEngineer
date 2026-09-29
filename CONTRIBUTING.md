# Contributing to Journey AI Engineer

Cảm ơn bạn đã muốn cải thiện Journey AI Engineer. Repository này là một learning product local-first: nội dung, code mẫu và bài làm đều cần dễ đọc, chạy lại được và có thể kiểm chứng. Một pull request tốt giúp người học hiểu **vì sao** thay đổi đúng, không chỉ làm UI hoặc thêm một đoạn code chạy được.

## Bắt đầu trong 5 phút

Windows PowerShell:

```powershell
git clone https://github.com/Hzyl/JourneyAIEngineer.git
Set-Location JourneyAIEngineer
.scriptssetup.ps1
.scriptsdev.ps1
```

`setup.ps1` tạo `.venv`, cài dependency backend/frontend và thư mục dữ liệu local. Database runtime, progress cá nhân, `.env` và workspace bài tập không được commit.

## Các nguyên tắc của repository

- **Markdown là nguồn nội dung chuẩn.** Sửa lesson trong `content/lessons/*.md`; `content/lessons.json` là catalog generated và phải được build lại.
- Lesson phải có giải thích đủ trong app. Link ngoài chỉ là đọc sâu hoặc đối chiếu, không thay thế concept notes.
- Code example phải ghi rõ `runnable` hay `conceptual`, setup, output mong đợi và edge case.
- Không thêm API key, token, database binary, `.venv`, `node_modules`, file `.env` hoặc journal riêng vào pull request.
- Local routes được phép mở VS Code, chạy exercise và đọc Git chỉ trên máy người học. Không thiết kế chúng thành public API.
- Không thêm framework giao diện lớn chỉ để làm repo có nhiều dependency. Ưu tiên component rõ, accessibility và CSS design token hiện có.

## Sửa nội dung lesson

Mỗi lesson cần có frontmatter hợp lệ:

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

Nội dung phải trả lời được: học xong làm được gì, kiến thức dùng ở đâu, ví dụ nào có thể chạy, bằng chứng hoàn thành là gì, lỗi thường gặp và bài tiếp theo. Review cards nên có đủ recall/explain, application/code, debug/metric và interview; không copy một đáp án cho hàng loạt bài.

Chạy các gate sau khi sửa:

```powershell
python scripts/build_lesson_catalog.py
python scripts/validate_content.py
python -m pytest -q tests/test_content_foundation.py --basetemp .buildpytest-content -o cache_dir=.buildpytest-cache
```

Nếu sửa curriculum cấp phase/module, kiểm tra cả `content/curriculum.json` và catalog generated trong cùng pull request. Validator sẽ kiểm tra ID, prerequisite graph, code Python runnable, resource/exercise/review reference và duplicate content.

## Sửa backend/frontend

Backend:

```powershell
..venvScriptspython.exe -m pytest -q --basetemp .buildpytest-api -o cache_dir=.buildpytest-cache
```

Frontend:

```powershell
npm ci
npm run lint
npm run build
```

Kiểm tra keyboard navigation, màn hình rộng 390px, focus state, text tiếng Việt có dấu và không để absolute path/credential lọt vào response. Thay đổi route local phải giữ loopback binding, path allowlist, timeout, secret redaction và confirmation trước Git publish.

## Branch, commit và pull request

- Tạo branch ngắn, mô tả được mục tiêu: `content/phase-03-metrics`, `fix/mobile-drawer`, `docs/release-guide`.
- Commit nhỏ, dùng dạng `learn(phase-03): explain precision recall`, `fix(ui): preserve lesson deep link`, `docs: add Windows release guide`.
- Pull request cần nêu problem, behavior sau thay đổi, test đã chạy và ảnh/screencast nếu thay đổi UI.
- Không squash mất các thông tin kiểm chứng cần thiết nếu reviewer đang cần trace lỗi.
- Chỉ maintainer thực hiện release hoặc thay đổi visibility của repository.

## Checklist trước khi gửi PR

- [ ] Không còn secret, `.data`, database, `.venv`, `node_modules` hoặc output build trong diff.
- [ ] `python scripts/validate_content.py` pass nếu có sửa nội dung.
- [ ] Backend test và `npm run lint`/`npm run build` pass nếu có sửa code.
- [ ] Có test cho behavior mới hoặc giải thích vì sao test hiện có đủ.
- [ ] README/docs được cập nhật nếu command, data root hoặc security boundary thay đổi.
- [ ] Không mô tả local SQLite/executable như hosted multi-user production service.

## Giấy phép và nội dung bên thứ ba

Source code của repository phát hành theo Apache-2.0. Tài liệu ngoài, model, dataset và code snippet của bên thứ ba vẫn chịu license riêng; hãy liên kết nguồn, giữ attribution và không sao chép nguyên văn tài liệu có bản quyền vào lesson.
