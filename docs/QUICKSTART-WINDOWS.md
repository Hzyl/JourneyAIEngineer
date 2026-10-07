# Windows quickstart

Journey AI Engineer v0.1 có hai cách chạy. Nếu chỉ muốn thử app, dùng portable ZIP. Nếu muốn sửa lesson, làm bài trong VS Code và push artifact, dùng source clone.

> **Lưu ý:** Nếu repository đang private, bạn phải được cấp quyền GitHub mới tải Release hoặc clone được. Khi repo public, các link trong tài liệu hoạt động cho mọi người.

## 1. Dùng portable ZIP (không cần cài môi trường phát triển)

Portable là cách nhanh nhất cho người thử beta. ZIP đã có executable: mở app, đọc bài và ôn tập không cần Python, Node.js, Git hay Docker. Runner bài tập cần Python 3.11+ cài riêng; mở bằng VS Code cần VS Code.

1. Mở [GitHub Releases](https://github.com/Hzyl/JourneyAIEngineer/releases/latest).
2. Tải hai file trong cùng một release: **JourneyAIEngineer-v0.1.2-windows-x64.zip** và **SHA256SUMS.txt**.
3. Kiểm tra checksum trước khi giải nén:

~~~powershell
$zip = '.\JourneyAIEngineer-v0.1.2-windows-x64.zip'
$expected = ((Get-Content '.\SHA256SUMS.txt' -Raw).Trim() -split '\s+')[0].ToLowerInvariant()
$actual = (Get-FileHash $zip -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $expected) { throw 'Checksum không khớp; hãy tải lại ZIP.' }
'Checksum OK: ' + $actual
~~~

4. Giải nén ZIP vào thư mục có quyền ghi, ví dụ `C:\Users\<you>\Documents\JourneyAIEngineer`.
5. Mở thư mục đó và double-click **JourneyAIEngineer.exe**.

App tự chọn một loopback port, mở trình duyệt và không để lại terminal. Chỉ truy cập app bằng địa chỉ 127.0.0.1 do app mở. Khi tab cuối cùng rời đi, server sẽ tự dừng sau grace period.

### Portable lưu dữ liệu ở đâu?

Mặc định:

~~~text
%LOCALAPPDATA%\JourneyAIEngineer
~~~

Progress, review, notes, journal và workspace nằm ở data root này; mỗi máy có dữ liệu riêng. Đừng xóa thư mục nếu chưa backup. Có thể đổi vị trí trước khi mở app:

~~~powershell
$env:JOURNEY_DATA_DIR = "$env:USERPROFILE\JourneyAIEngineerData"
.\JourneyAIEngineer.exe
~~~

Portable không tự push GitHub. Nếu muốn export artifact/Git, đặt source clone của bạn vào `JOURNEY_PROJECT_ROOT` trước khi chạy executable:

~~~powershell
$env:JOURNEY_PROJECT_ROOT = 'C:\src\JourneyAIEngineer'
.\JourneyAIEngineer.exe
~~~

Không có source clone, app vẫn học/ôn tập và tạo workspace; chạy test cần Python riêng. Nút publish sẽ bị tắt.

### Xem và sửa code mà không dùng Git

Trong bài tập, mở đường dẫn workspace hiển thị bởi app bằng **File → Open Folder** trong VS Code.
Mặc định portable đặt workspace dưới `%LOCALAPPDATA%\JourneyAIEngineer\workspaces`.
Nếu muốn sửa cả app, tải source ZIP của đúng tag/version, giải nén rồi mở folder chứa `package.json`.
Chạy `scripts/setup.ps1` và `scripts/dev.ps1` như bên dưới; không cần Git cho việc đọc/sửa/chạy code.
Git chỉ phục vụ lịch sử thay đổi và chia sẻ lên repository.

EXE là bản chạy đã đóng gói, không thay thế source ZIP. Source ZIP mới có `SOURCE-MANIFEST.json`
liệt kê SHA-256 từng file; dòng `working-tree snapshot` không chứng minh đã phát hành.

## 2. Dùng source clone (học, sửa code và đóng góp)

### Yêu cầu

- Windows 10/11
- Python 3.11 trở lên
- Node.js 20 trở lên
- Git
- VS Code (khuyến nghị)
- Docker không bắt buộc cho local v0.1

### Clone vào một vị trí bạn biết rõ

Git tạo folder trong thư mục PowerShell hiện tại. Để clone vào Desktop:

~~~powershell
Set-Location "$env:USERPROFILE\Desktop"
git clone https://github.com/Hzyl/JourneyAIEngineer.git
Set-Location .\JourneyAIEngineer
~~~

Sau lệnh trên, source nằm ở `C:\Users\<you>\Desktop\JourneyAIEngineer`. Mở folder này bằng VS Code:

~~~powershell
code .
~~~

Nếu `code` chưa có trong PATH, mở VS Code → **File → Open Folder** và chọn folder clone.

### Cài và chạy

Trong root của clone:

~~~powershell
.\scripts\setup.ps1
.\scripts\dev.ps1
~~~

`setup.ps1` tạo virtual environment, cài backend/frontend dependency, tạo `.data\` và khởi tạo SQLite. `dev.ps1` chạy FastAPI ở loopback và Vite dev server.

Mở [http://127.0.0.1:5173](http://127.0.0.1:5173). Dừng bằng **Ctrl+C** trong cửa sổ chạy `dev.ps1`.

Nếu muốn chạy riêng:

~~~powershell
.\.venv\Scripts\python.exe -m uvicorn apps.api.main:app --reload --host 127.0.0.1 --port 8000
npm run dev -- --host 127.0.0.1
~~~

Runtime source clone nằm trong `.data\`; thư mục này đã được ignore. Không commit `.data\`, `.env`, `.venv\`, database hoặc journal private.

## 3. Vòng học đầu tiên (15–30 phút)

1. Mở **Roadmap** và chọn Phase 0 hoặc lesson có prerequisite phù hợp.
2. Đọc mục tiêu, concept, ví dụ và completion criteria trong lesson.
3. Mở **Practice Lab**, tạo workspace rồi bấm mở bằng VS Code.
4. Tự làm trước, lưu bằng Ctrl+S và chạy test theo manifest.
5. Ghi kết quả hoặc lỗi vào Journal; trả lời review card.
6. Nếu cần hỏi trợ lý, tạo context export và xem nội dung trước khi copy.
7. Với source clone, mở **Journal & Git**, đọc diff và chỉ publish artifact đã review.

## 4. Troubleshooting

### SmartScreen chặn executable

Binary beta chưa code-sign nên SmartScreen có thể cảnh báo. Kiểm tra bạn tải đúng từ GitHub Release và SHA-256 khớp. Chỉ tiếp tục nếu bạn tin nguồn tải.

### Bấm EXE nhưng trình duyệt không mở

Chờ vài giây rồi mở địa chỉ loopback do launcher chọn; nếu vẫn lỗi, xem file:

~~~text
%LOCALAPPDATA%\JourneyAIEngineer\launcher-error.log
~~~

Đảm bảo Windows Firewall không chặn loopback và không còn process cũ giữ port. Launcher sẽ thử một dải port local khác nếu port mặc định bận.

### Không thấy progress cũ

Kiểm tra bạn đang chạy đúng mode và đúng data root. Portable dùng `%LOCALAPPDATA%\JourneyAIEngineer`; source clone dùng `.data\` trong clone. Nếu từng đặt `JOURNEY_DATA_DIR`, bỏ hoặc đặt lại biến đó.

### Nút publish bị tắt

Đây là behavior an toàn khi portable không biết source clone. Trỏ `JOURNEY_PROJECT_ROOT` tới clone repo của bạn, khởi động lại app và kiểm tra lại Git status.

### Source setup lỗi

Chạy lại PowerShell trong root repo, kiểm tra Python/Node/Git có trong PATH và xem output của `scripts/setup.ps1`. Không xóa `.data\` nếu muốn giữ progress.

## 5. Kiểm tra trước khi gửi PR

~~~powershell
python scripts/build_lesson_catalog.py
python scripts/validate_content.py
python -m pytest -q --basetemp .build\pytest -o cache_dir=.build\pytest-cache
npm ci
npm run lint
npm run build
npm run test:e2e
~~~

Đọc thêm: [README](../README.md), [Public beta guide](PUBLIC-BETA.md), [Contributing](../CONTRIBUTING.md), [Security policy](../SECURITY.md).
