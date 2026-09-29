# Windows quickstart

Journey AI Engineer v0.1 có hai cách chạy. Chọn **source clone** nếu bạn muốn sửa lesson, làm bài, lưu artifact và push những gì đã review lên GitHub. Chọn **portable `.exe`** nếu chỉ muốn học local bằng double-click trên một máy Windows.

## A. Source clone (khuyến nghị khi làm portfolio)

Yêu cầu: Windows 10/11, Python 3.11+, Node.js 20+, Git và VS Code. Docker không bắt buộc cho local v0.1.

```powershell
git clone https://github.com/Hzyl/JourneyAIEngineer.git
Set-Location JourneyAIEngineer
.scriptssetup.ps1
.scriptsdev.ps1
```

Mở `http://127.0.0.1:5173`. `dev.ps1` chạy API và Vite local. Nếu muốn chạy từng phần:

```powershell
python -m uvicorn apps.api.main:app --reload --host 127.0.0.1 --port 8000
npm run dev
```

Dữ liệu runtime ở `.data/` (được ignore). Content source ở `content/lessons/*.md`; không sửa trực tiếp `content/lessons.json` rồi quên build lại.

## B. Portable executable

Tải file ZIP từ GitHub Release, giải nén vào một thư mục bạn có quyền ghi và chạy `JourneyAIEngineer.exe`. App tự chọn loopback port, khởi động API, mở browser và tắt nền sau khi tab cuối cùng rời đi. SmartScreen có thể cảnh báo vì binary chưa được code-sign; kiểm tra `SHA256SUMS.txt` trước khi chạy.

```powershell
Get-FileHash .JourneyAIEngineer.exe -Algorithm SHA256
Get-Content .SHA256SUMS.txt
```

Portable mode lưu progress mặc định trong `%LOCALAPPDATA%JourneyAIEngineer`. Có thể đổi data root:

```powershell
$env:JOURNEY_DATA_DIR = "$env:USERPROFILEJourneyAIEngineerData"
.JourneyAIEngineer.exe
```

Nếu muốn export artifact/Git, trỏ tới source clone trước khi mở app:

```powershell
$env:JOURNEY_PROJECT_ROOT = "C:srcJourneyAIEngineer"
```

Không có source clone thì app vẫn học và chạy workspace local, nhưng phải hiển thị local learning mode và tắt publish GitHub. Không copy `.data`, database hoặc journal riêng vào repository public.

## Vòng học một lesson

1. Mở **Roadmap**, đọc mục tiêu, concept notes và tiêu chí hoàn thành.
2. Mở Practice Lab để tạo workspace; làm code trong VS Code và chạy test theo manifest.
3. Đọc lỗi, ghi giả thuyết rồi sửa code; lưu evidence có thể review.
4. Trả lời review card bằng lời của bạn (`again`, `hard`, `good`, `easy`).
5. Ghi một insight trong Journal và tạo context export nếu cần hỏi trợ lý AI.
6. Review Git diff, redact secret và chỉ export/push artifact được allowlist.

## Kiểm tra trước khi gửi thay đổi

```powershell
python scripts/build_lesson_catalog.py
python scripts/validate_content.py
python -m pytest -q --basetemp .buildpytest -o cache_dir=.buildpytest-cache
npm ci
npm run lint
npm run build
```

## Khôi phục dữ liệu

Progress, notes, journal và review state là dữ liệu local. Hãy dùng chức năng backup/export trong app (khi có) hoặc sao lưu thư mục data đã được app chỉ định; không tự copy database đang mở vào Git. Khi chuyển máy, import archive qua UI để app validate schema và tạo backup trước khi ghi đè.

## Giới hạn bảo mật

App chỉ dành cho máy cá nhân và bind `127.0.0.1`. Không forward port, không bind `0.0.0.0`, không đặt secret trong frontend và không dùng endpoint local để phục vụ người dùng Internet. Xem [SECURITY.md](../SECURITY.md) trước khi chạy security lab.
