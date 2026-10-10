# Bắt đầu trên Windows

Journey AI Engineer v0.1 có hai cách chạy. Dùng gói Windows chạy trực tiếp nếu muốn học ngay. Dùng bản sao mã nguồn nếu muốn sửa ứng dụng hoặc nội dung bài học. Cả hai cách đều hỗ trợ làm bài tập khi đã cài Python; bạn có thể dùng VS Code để sửa mã.

> **Lưu ý:** Nếu kho mã đang riêng tư, bạn cần quyền GitHub để tải bản phát hành hoặc lấy mã nguồn. Khi kho mã công khai, mọi người có thể dùng các liên kết trong hướng dẫn.

## 1. Dùng gói ZIP chạy trực tiếp

Gói ZIP có sẵn tệp thực thi. Bạn có thể mở ứng dụng, đọc bài và ôn tập mà không cần Python, Node.js, Git hay Docker. Để chạy bài tập, cài riêng Python 3.11+; để sửa mã bằng VS Code, cài thêm VS Code.

1. Mở [GitHub Releases](https://github.com/Hzyl/JourneyAIEngineer/releases/latest).
2. Tải hai tệp từ cùng một bản phát hành: **JourneyAIEngineer-v0.1.2-windows-x64.zip** và **SHA256SUMS.txt**.
3. Kiểm tra mã SHA-256 trước khi giải nén:

~~~powershell
$zip = '.\JourneyAIEngineer-v0.1.2-windows-x64.zip'
$expected = ((Get-Content '.\SHA256SUMS.txt' -Raw).Trim() -split '\s+')[0].ToLowerInvariant()
$actual = (Get-FileHash $zip -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $expected) { throw 'Checksum không khớp; hãy tải lại ZIP.' }
'Checksum OK: ' + $actual
~~~

4. Giải nén ZIP vào thư mục có quyền ghi, ví dụ `C:\Users\<you>\Documents\JourneyAIEngineer`.
5. Mở thư mục đó và nhấp đúp vào **JourneyAIEngineer.exe**.

Ứng dụng tự chọn một cổng nội bộ và mở trình duyệt, không mở cửa sổ dòng lệnh. Chỉ dùng địa chỉ 127.0.0.1 mà ứng dụng mở. Khi tab cuối cùng đóng hoặc rời trang, máy chủ tự dừng sau một khoảng chờ ngắn.

### Dữ liệu được lưu ở đâu?

Mặc định:

~~~text
%LOCALAPPDATA%\JourneyAIEngineer
~~~

Tiến độ, lịch ôn, ghi chú, nhật ký và thư mục bài tập được lưu tại đây; mỗi máy có dữ liệu riêng. Không xóa thư mục khi chưa sao lưu. Bạn có thể đổi vị trí trước khi mở ứng dụng:

~~~powershell
$env:JOURNEY_DATA_DIR = "$env:USERPROFILE\JourneyAIEngineerData"
.\JourneyAIEngineer.exe
~~~

Ứng dụng không tự đẩy dữ liệu lên GitHub. Nếu muốn xuất bài làm và dùng Git, đặt `JOURNEY_PROJECT_ROOT` trỏ tới bản sao kho mã trước khi mở tệp thực thi:

~~~powershell
$env:JOURNEY_PROJECT_ROOT = 'C:\src\JourneyAIEngineer'
.\JourneyAIEngineer.exe
~~~

Khi chưa có bản sao kho mã, bạn vẫn có thể học, ôn tập và tạo thư mục bài tập. Chạy kiểm thử cần Python cài riêng. Chức năng công bố qua Git bị tắt.

### Xem và sửa mã mà không dùng Git

Trong VS Code, chọn **File → Open Folder** rồi mở đường dẫn bài tập hiển thị trong ứng dụng.
Bản chạy trực tiếp mặc định lưu bài tập dưới `%LOCALAPPDATA%\JourneyAIEngineer\workspaces`.
Nếu muốn sửa cả ứng dụng, tải gói mã nguồn ZIP của đúng phiên bản, giải nén rồi mở thư mục chứa `package.json`.
Chạy `scripts/setup.ps1` và `scripts/dev.ps1` như hướng dẫn bên dưới. Đọc, sửa và chạy mã không bắt buộc có Git;
Git giúp quản lý lịch sử thay đổi và chia sẻ lên kho mã.

EXE là bản thực thi đã đóng gói. Muốn chỉnh sửa ứng dụng, bạn cần gói mã nguồn ZIP.
Gói mã nguồn mới có `SOURCE-MANIFEST.json` liệt kê SHA-256 của từng tệp;
dòng `working-tree snapshot` chỉ mô tả bản chụp mã trên máy, không xác nhận đã phát hành.

## 2. Chạy từ mã nguồn để học, chỉnh sửa và đóng góp

### Yêu cầu

- Windows 10/11
- Python 3.11 trở lên
- Node.js 20 trở lên
- Git
- VS Code (khuyến nghị)
- Docker không bắt buộc cho bản trên máy cá nhân v0.1

### Lấy mã nguồn vào thư mục bạn chọn

Git tạo thư mục mới tại vị trí hiện tại của PowerShell. Ví dụ, để lấy mã nguồn vào Desktop:

~~~powershell
Set-Location "$env:USERPROFILE\Desktop"
git clone https://github.com/Hzyl/JourneyAIEngineer.git
Set-Location .\JourneyAIEngineer
~~~

Sau lệnh trên, mã nguồn nằm ở `C:\Users\<you>\Desktop\JourneyAIEngineer`. Mở thư mục này bằng VS Code:

~~~powershell
code .
~~~

Nếu `code` chưa có trong PATH, mở VS Code → **File → Open Folder** và chọn thư mục mã nguồn.

### Cài và chạy

Chạy từ thư mục gốc của bản sao mã nguồn:

~~~powershell
.\scripts\setup.ps1
.\scripts\dev.ps1
~~~

`setup.ps1` tạo môi trường ảo, cài thư viện cho máy chủ và giao diện, tạo `.data\` rồi khởi tạo SQLite. `dev.ps1` chạy FastAPI tại địa chỉ nội bộ và máy chủ phát triển Vite.

Mở [http://127.0.0.1:5173](http://127.0.0.1:5173). Dừng bằng **Ctrl+C** trong cửa sổ chạy `dev.ps1`.

Nếu muốn chạy riêng:

~~~powershell
.\.venv\Scripts\python.exe -m uvicorn apps.api.main:app --reload --host 127.0.0.1 --port 8000
npm run dev -- --host 127.0.0.1
~~~

Dữ liệu khi chạy từ mã nguồn nằm trong `.data\`; Git đã bỏ qua thư mục này. Không đưa `.data\`, `.env`, `.venv\`, cơ sở dữ liệu hoặc nhật ký riêng vào commit.

## 3. Vòng học đầu tiên (15–30 phút)

1. Mở **Lộ trình**, chọn Giai đoạn 0 hoặc bài phù hợp với kiến thức bạn đã có.
2. Đọc mục tiêu, phần giải thích, ví dụ và tiêu chí hoàn thành.
3. Mở **Bài tập**, tạo thư mục bài tập rồi mở bằng VS Code.
4. Tự làm trước, lưu bằng Ctrl+S và chạy kiểm thử theo tệp khai báo của bài.
5. Ghi kết quả hoặc lỗi vào **Nhật ký** và trả lời thẻ ôn tập.
6. Nếu cần hỏi trợ lý, tạo nội dung gửi cho trợ lý và đọc lại trước khi gửi.
7. Khi chạy từ mã nguồn, mở **Nhật ký & Git**, xem phần thay đổi và chỉ công bố bài làm sau khi đã kiểm tra.

## 4. Xử lý lỗi thường gặp

### SmartScreen chặn tệp thực thi

Tệp thực thi beta chưa được ký số nên SmartScreen có thể cảnh báo. Kiểm tra nguồn tải trên GitHub Releases và đối chiếu SHA-256. Chỉ tiếp tục nếu bạn tin nguồn tải.

### Bấm EXE nhưng trình duyệt không mở

Chờ vài giây rồi mở địa chỉ nội bộ do chương trình khởi động chọn. Nếu vẫn lỗi, xem tệp:

~~~text
%LOCALAPPDATA%\JourneyAIEngineer\launcher-error.log
~~~

Kiểm tra Windows Firewall có chặn kết nối nội bộ hay một tiến trình khác đang dùng cổng hay không. Chương trình khởi động sẽ thử các cổng nội bộ khác nếu cổng mặc định bận.

### Không thấy tiến độ đã lưu

Kiểm tra cách chạy và thư mục dữ liệu đang dùng. Bản chạy trực tiếp dùng `%LOCALAPPDATA%\JourneyAIEngineer`; bản mã nguồn dùng `.data\` trong thư mục kho mã. Nếu từng đặt `JOURNEY_DATA_DIR`, kiểm tra và trỏ lại đúng vị trí dữ liệu cũ.

### Nút công bố qua Git bị tắt

Chức năng này bị tắt khi bản chạy trực tiếp chưa có đường dẫn tới kho mã. Trỏ `JOURNEY_PROJECT_ROOT` tới bản sao kho mã của bạn, khởi động lại ứng dụng và kiểm tra trạng thái Git.

### Thiết lập môi trường từ mã nguồn bị lỗi

Mở PowerShell tại thư mục gốc của kho mã, kiểm tra Python/Node/Git có trong PATH và đọc kết quả của `scripts/setup.ps1`. Giữ nguyên `.data\` để bảo toàn tiến độ.

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

Đọc thêm: [README](../README.md), [Hướng dẫn thử bản beta](PUBLIC-BETA.md), [Đóng góp](../CONTRIBUTING.md), [Chính sách bảo mật](../SECURITY.md).
