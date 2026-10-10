# Journey AI Engineer

> **Ứng dụng học kỹ thuật AI, ưu tiên lưu dữ liệu trên máy cá nhân** — học theo lộ trình, làm bài trong VS Code, ôn tập theo lịch, ghi nhật ký và lưu kết quả dự án để kiểm chứng.

[![CI](https://github.com/Hzyl/JourneyAIEngineer/actions/workflows/ci.yml/badge.svg)](https://github.com/Hzyl/JourneyAIEngineer/actions/workflows/ci.yml)
[![Latest release](https://img.shields.io/github/v/release/Hzyl/JourneyAIEngineer?display_name=tag)](https://github.com/Hzyl/JourneyAIEngineer/releases/latest)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)

Journey AI Engineer tổ chức việc học kỹ thuật AI thành một vòng học có kết quả để bạn tự kiểm tra:

~~~text
Roadmap → Lesson → Practice Lab → Test → Review → Journal → Git evidence
~~~

Sản phẩm giúp bạn đi từ Python và kỹ thuật phần mềm đến học máy, học sâu, LLM/RAG, đánh giá mô hình, theo dõi hệ thống và thiết kế kiến trúc. Phần giải thích chính nằm ngay trong ứng dụng bằng tiếng Việt; thuật ngữ kỹ thuật giữ tên tiếng Anh khi cần và có tài liệu chính thức để đọc sâu.

> **Windows portable: v0.1.2. Web beta: đã triển khai.**
> Bản Windows dành cho một người dùng, lưu dữ liệu trên máy cá nhân; web beta chạy trên Cloudflare Pages với Supabase Auth/Postgres/RLS.
> Web hỗ trợ đăng nhập bằng email và mật khẩu, lưu dữ liệu học theo tài khoản và không có quyền dùng công cụ trên máy cá nhân.
> Xem [trạng thái web beta và cập nhật đăng nhập](docs/WEB-BETA.md). Không mở API của bản chạy trên máy cá nhân ra Internet.

---

## Thử một vòng học

Chọn hướng học → đọc một bài → tự làm bài tập → xem kết quả → ghi lại điều còn vướng.

![Today: một việc học tiếp theo và các chỉ số ôn tập riêng](docs/screenshots/today-desktop.jpg)

**Ảnh và các thay đổi dưới đây thuộc bản đang phát triển, chưa phải bản đã triển khai.**
Bản mới có trang xem thử không cần tài khoản, ba hướng học và 10 bài nhập môn đã biên tập
song ngữ; 198 bài còn lại được gắn nhãn nháp. Hoàn thành bài đọc không đồng nghĩa thành thạo.
Xem [tiến độ kiểm chứng](docs/PUBLIC-READINESS-IMPLEMENTATION.md).

Thử ví dụ không cần Git hay khóa API: [trợ lý tài liệu tiếng Việt](samples/vi-document-assistant/README.md).
Đây là phiên bản tìm kiếm và trích dẫn cơ bản, chưa dùng LLM; có bộ câu hỏi nhỏ để kiểm tra cách hoạt động.

## Chọn cách dùng

### Cách 1 — Bản chạy trực tiếp .exe: tải về và học ngay

Mở ứng dụng, đọc bài và ôn tập không cần Python, Node hay Git. Để chạy bài tập Python, bạn cần cài riêng Python 3.11+; VS Code là tùy chọn.

1. Mở [GitHub Releases](https://github.com/Hzyl/JourneyAIEngineer/releases/latest).
2. Tải **JourneyAIEngineer-v0.1.2-windows-x64.zip** và **SHA256SUMS.txt** từ cùng một bản phát hành.
3. Kiểm tra mã SHA-256 theo hướng dẫn bên dưới.
4. Giải nén ZIP vào một thư mục riêng, ví dụ `C:\Users\<you>\Documents\JourneyAIEngineer`.
5. Mở thư mục vừa giải nén và nhấp đúp vào **JourneyAIEngineer.exe**.

Ứng dụng tự khởi động máy chủ trên máy bạn rồi mở trình duyệt, không mở cửa sổ dòng lệnh. Khi tab cuối cùng đóng, máy chủ tự dừng sau một khoảng chờ ngắn.

Nếu Windows SmartScreen cảnh báo, hãy kiểm tra nguồn tải và mã SHA-256. Tệp thực thi beta chưa được ký số nên cảnh báo này có thể xuất hiện.

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

Bản chạy trực tiếp lưu tiến trình học tại:

~~~text
%LOCALAPPDATA%\JourneyAIEngineer
~~~

Thư mục này chứa cơ sở dữ liệu, lịch ôn tập, ghi chú, nhật ký và thư mục bài tập của **riêng người đang dùng máy**. Dữ liệu không được đưa vào commit hoặc tự công bố lên GitHub.

Bạn có thể đổi thư mục lưu dữ liệu trước khi mở ứng dụng:

~~~powershell
$env:JOURNEY_DATA_DIR = "$env:USERPROFILE\JourneyAIEngineerData"
.\JourneyAIEngineer.exe
~~~

### Cách 2 — Bản sao mã nguồn: dành cho người muốn sửa ứng dụng và chia sẻ bài làm

Dùng mã nguồn nếu muốn sửa chính ứng dụng. Bản chạy trực tiếp vẫn hỗ trợ làm bài trong VS Code khi bạn đã cài Python. Git chỉ cần cho việc lấy mã nguồn, xem thay đổi, lưu commit hoặc đẩy mã lên kho từ xa.

Bản sao mã nguồn **không tự xuất hiện trên Desktop**. Git tạo thư mục ngay tại vị trí hiện tại của PowerShell. Ví dụ, để lấy mã nguồn vào Desktop:

~~~powershell
Set-Location "$env:USERPROFILE\Desktop"
git clone https://github.com/Hzyl/JourneyAIEngineer.git
Set-Location .\JourneyAIEngineer
~~~

Nếu kho mã đang ở chế độ riêng tư, tài khoản GitHub của bạn phải được cấp quyền trước khi lấy mã. Khi kho mã công khai, mọi người có thể dùng lệnh trên.

Chuẩn bị môi trường:

- Windows 10/11
- Python 3.11+
- Node.js 20+
- Git
- VS Code (khuyến nghị khi làm bài tập)
- Docker **không bắt buộc** cho bản chạy trên máy cá nhân v0.1

Thiết lập và chạy:

~~~powershell
.\scripts\setup.ps1
.\scripts\dev.ps1
~~~

Mở [http://127.0.0.1:5173](http://127.0.0.1:5173). Dữ liệu phát sinh khi chạy từ mã nguồn nằm trong .data\; Git đã được cấu hình bỏ qua thư mục này.

Muốn dừng bản phát triển, quay lại cửa sổ PowerShell đang chạy dev.ps1 và nhấn **Ctrl+C**.

### Mở mã nguồn mà không cần Git

- **Mã bài tập:** mở đường dẫn thư mục bài tập hiển thị trong ứng dụng; bản chạy trực tiếp mặc định lưu dưới `%LOCALAPPDATA%\JourneyAIEngineer\workspaces`.
- **Mã nguồn toàn bộ ứng dụng:** giải nén gói mã nguồn ZIP rồi chọn VS Code → **File → Open Folder**. EXE không chứa thư mục React/TypeScript để mở và chỉnh sửa như mã nguồn.
- Bản đang phát triển bổ sung `JourneyAIEngineer-v<version>-source.zip` cùng mã kiểm tra và danh sách tệp. Gói chỉ được coi là bản phát hành khi người duy trì đã công bố. Bạn cũng có thể dùng gói mã nguồn ZIP từ GitHub theo tag mà không cần cài Git.
- Chạy từ mã nguồn cần Python 3.11+ và Node 20+. Việc chỉnh sửa, chạy ứng dụng hay làm bài không bắt buộc phải đẩy mã lên GitHub.

### Bản chạy trực tiếp và bản sao mã nguồn khác nhau thế nào?

| Bạn muốn làm gì? | Dùng | Dữ liệu | GitHub |
| --- | --- | --- | --- |
| Học ngay bằng cách nhấp đúp | ZIP + .exe chạy trực tiếp | `%LOCALAPPDATA%\JourneyAIEngineer` | Không tự đẩy mã lên |
| Sửa bài học, bài tập và mở VS Code | Bản sao mã nguồn | `.data\` trong thư mục mã nguồn | Có thể xem lại thay đổi rồi đẩy mã lên |
| Học và đồng bộ bằng trình duyệt | Web beta | Supabase Postgres, tách theo tài khoản | Không chạy mã hay dùng Git trên web |

Dùng địa chỉ web beta do người duy trì chia sẻ. Đăng ký bằng email và mật khẩu, rồi làm theo hướng dẫn xác nhận email.
Web không mở VS Code, chạy bài tập, truy cập Git hoặc hệ thống tệp trên máy cá nhân.
Dữ liệu web và SQLite trên máy cá nhân được lưu riêng; bản beta chưa tự đồng bộ hai chiều giữa chúng.

Bản chạy trực tiếp có thể dùng thư mục bài tập trên máy cá nhân. Nếu muốn xuất bài làm và dùng Git, hãy đặt biến môi trường trỏ tới bản sao mã nguồn của bạn **trước khi mở tệp thực thi**:

~~~powershell
$env:JOURNEY_PROJECT_ROOT = 'C:\src\JourneyAIEngineer'
.\JourneyAIEngineer.exe
~~~

Khi không có bản sao mã nguồn, bạn vẫn có thể học, ôn tập và chạy kiểm thử trên máy cá nhân. Các thao tác công bố lên GitHub sẽ bị tắt.

---

## Một vòng học mẫu trên máy cá nhân

1. Mở **Lộ trình**, chọn giai đoạn và bài học phù hợp với kiến thức bạn đã có.
2. Đọc phần giải thích, ví dụ, lỗi thường gặp và tiêu chí hoàn thành ngay trong ứng dụng.
3. Từ **Bài tập**, tạo thư mục bài tập; ứng dụng sẽ mở đúng thư mục bằng VS Code.
4. Tự làm trước, chạy kiểm thử theo tệp khai báo bài tập rồi lưu kết quả.
5. Đánh dấu bài học và trả lời thẻ ôn tập với mức nhớ tương ứng: again, hard, good, easy.
6. Ghi điều đã học vào **Nhật ký**. Khi còn vướng, xuất ngữ cảnh rồi tự dán sang ChatGPT/Codex.
7. Mở **Nhật ký & Git**, xem phần thay đổi và kiểm tra thông tin bí mật. Chỉ công bố bài làm sau khi xác nhận.

Ở v0.1, ứng dụng không gọi trực tiếp API AI và không cần khóa API. Chức năng xuất ngữ cảnh chỉ tạo nội dung Markdown để bạn kiểm soát nội dung, chi phí và dữ liệu gửi ra ngoài.

## Có gì trong sản phẩm?

- **23 giai đoạn / 208 bài học**, được sắp xếp theo kiến thức cần biết trước, từ kỹ thuật phần mềm đến thiết kế hệ thống AI.
- Nội dung Việt/Anh gồm mục tiêu, kiến thức cần biết trước, hướng dẫn từng bước, ví dụ mã, bài thực hành, tài liệu tham khảo và thẻ ôn tập.
- Bản đang phát triển: ba hướng **Nền tảng / Ứng dụng AI / Đào sâu ML**; giờ mỗi tuần là gợi ý, không cam kết thời gian hoàn thành hay có việc làm.
- Thư mục bài tập cùng quy định kiểm thử; có thể mở trực tiếp bằng VS Code.
- Ôn tập ngắt quãng, nhận diện chủ đề còn yếu, ghi chú, nhật ký và xuất ngữ cảnh.
- Xem trạng thái và thay đổi Git, che thông tin bí mật, gợi ý thông điệp commit và công bố sau khi xác nhận.
- Sao lưu, xuất tiến trình và dữ liệu học trên máy cá nhân.
- Thư viện tài liệu ưu tiên nguồn chính thức; nguồn cộng đồng có nhãn riêng để phân biệt.

Các dự án minh họa gồm LLM Chat API, Document Intelligence, Advanced RAG, AI Assistant kết nối cơ sở dữ liệu/API, Research Assistant Agent và End-to-End Production GenAI System.

---

## Dữ liệu, riêng tư và giới hạn

- Mã nguồn, bài học Markdown và tài liệu có thể đưa vào commit trên GitHub.
- .data\, cơ sở dữ liệu, .env, .venv\, nhật ký riêng, token và thông tin bí mật **không được đưa vào commit**.
- Bản chạy trực tiếp lưu dữ liệu tại %LOCALAPPDATA%\JourneyAIEngineer; xóa thư mục này có thể làm mất tiến trình chưa sao lưu.
- API trên máy cá nhân chỉ lắng nghe tại 127.0.0.1. Không chuyển tiếp cổng, không lắng nghe tại 0.0.0.0 và không dùng API này làm dịch vụ thực thi mã công khai.
- Bản chạy trực tiếp và bản sao mã nguồn lưu dữ liệu trên máy, chưa có đăng nhập hoặc đồng bộ đám mây.
- Web beta dùng Supabase Auth và Postgres/RLS để tách dữ liệu theo tài khoản.
  Web không truy cập công cụ trên máy cá nhân và không tự nhập dữ liệu SQLite từ bản Windows.
- Nếu kho mã còn riêng tư, người thử cần được cấp quyền GitHub để tải bản phát hành hoặc lấy mã nguồn. Trước khi chuyển kho mã sang công khai, kiểm tra thông tin bí mật trong mã và lịch sử Git.

Xem [SECURITY.md](SECURITY.md) để hiểu giới hạn truy cập của bản chạy trên máy cá nhân và cách báo cáo lỗ hổng.

Chương trình kiểm tra bảo mật trong kho mã chỉ **thống kê thụ động**: `scripts/security_audit.py` đọc định tuyến, cấu trúc dữ liệu và các mẫu mã nguồn; không gửi yêu cầu mạng, gọi hàm xử lý, tạo dữ liệu thử tấn công hoặc tự chạy RedAmon. Chỉ kiểm tra hệ thống của bạn hoặc hệ thống được ủy quyền trong môi trường thử nghiệm cô lập.

---

## Đóng góp và phản hồi

- Lỗi có thể tái hiện: dùng [Bug report](https://github.com/Hzyl/JourneyAIEngineer/issues/new?template=bug_report.yml).
- Ý tưởng về bài học hoặc trải nghiệm sử dụng: dùng [Feature request](https://github.com/Hzyl/JourneyAIEngineer/issues/new?template=feature_request.yml).
- Trao đổi trải nghiệm beta: dùng [GitHub Discussions](https://github.com/Hzyl/JourneyAIEngineer/discussions).
- Thay đổi mã hoặc nội dung: đọc [CONTRIBUTING.md](CONTRIBUTING.md), tạo nhánh rồi mở pull request.

Khi báo lỗi, ghi cách chạy (Portable, Source clone hoặc Web beta), phiên bản hoặc mã commit, hệ điều hành và trình duyệt,
các bước tái hiện, kết quả mong đợi và kết quả thực tế. Không gửi token, cơ sở dữ liệu, nhật ký riêng hoặc tệp .env.

---

## Kiểm tra trước khi đóng góp

Sau khi lấy mã nguồn và thiết lập môi trường:

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

Chương trình đóng gói sẽ chạy các bước kiểm tra chất lượng, tạo JourneyAIEngineer.exe, gói ZIP có số phiên bản và SHA256SUMS.txt tại:

~~~text
.build\releases\
~~~

Gói ZIP Windows chỉ chứa tệp thực thi và tài liệu cần thiết. Chương trình mới cũng tạo gói mã nguồn ZIP riêng kèm SHA-256; không chứa .data\, cơ sở dữ liệu, .venv\, node_modules, .env hoặc nhật ký phát sinh khi sử dụng.

---

## Kiến trúc bản chạy trên máy cá nhân

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

Markdown/YAML tạo danh mục nền `content/lessons.json`. Bài có cùng ID trong `content/curated/` được ưu tiên hiển thị; xem [chuẩn nội dung](docs/CURRICULUM-STANDARDS.md). Cơ sở dữ liệu phát sinh khi chạy không nằm trong mã nguồn công khai.

Web beta dùng giao diện React/Vite tĩnh trên Cloudflare Pages, kết nối trực tiếp tới Supabase Auth/Postgres/RLS.
Web dùng danh mục chương trình học tĩnh và không gọi FastAPI trên máy cá nhân. Xem sơ đồ trong [Kiến trúc](docs/ARCHITECTURE.md).

Đọc thêm:

- [Bắt đầu trên Windows](docs/QUICKSTART-WINDOWS.md)
- [Hướng dẫn thử bản beta](docs/PUBLIC-BETA.md)
- [Kiến trúc](docs/ARCHITECTURE.md)
- [Triển khai và giới hạn bản web beta](docs/WEB-BETA.md)
- [Quyền riêng tư trên web beta](docs/WEB-BETA-PRIVACY.md)
- [Đóng góp](CONTRIBUTING.md)
- [Chính sách bảo mật](SECURITY.md)
- [Hướng dẫn học](content/study-playbook.md)

## Hướng phát triển

- **v0.1:** bản một người dùng lưu dữ liệu trên máy cá nhân, bài học song ngữ, ôn tập, thư mục bài tập, nhật ký, xuất ngữ cảnh Git, bản sao mã nguồn và gói chạy trực tiếp trên Windows.
- **Web beta đã triển khai:** Supabase Auth/Postgres/RLS + Cloudflare Pages, đăng nhập bằng email và mật khẩu
  và lưu dữ liệu học theo tài khoản; xem [WEB-BETA.md](docs/WEB-BETA.md) để biết trạng thái cập nhật đăng nhập.
- **Sau beta:** cho phép người dùng tự xóa tài khoản, tăng cường kiểm thử đầu cuối và theo dõi bản web, bổ sung kết nối nhà cung cấp khi cần; vẫn giữ xuất/nhập dữ liệu trên máy cá nhân làm phương án dự phòng.

## Giấy phép

Mã nguồn của kho này dùng [Apache-2.0](LICENSE). Nội dung, tập dữ liệu, mô hình và mã của bên thứ ba giữ giấy phép riêng; hãy đọc thông tin ghi nhận nguồn trước khi tái sử dụng.
