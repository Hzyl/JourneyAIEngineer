# Kiến trúc

## Mục tiêu v0.1

Journey AI Engineer có bản chạy trên máy cá nhân và web beta.
Bản trên máy cá nhân v0.1 dành cho một người dùng, hỗ trợ thực hành, chạy lại bài làm và quản lý phiên bản kết quả.
Web beta lưu dữ liệu theo tài khoản trên Supabase; hai bản không tự đồng bộ dữ liệu với nhau.

```text
React 19 + Vite + TypeScript
        │ HTTP loopback (127.0.0.1)
        ▼
FastAPI + Pydantic + local capability guards
        │
        ├── SQLite (progress, review state, notes, journal metadata)
        ├── content/curriculum.json (phase/module roadmap)
        ├── content/lessons/*.md (source of truth)
        ├── content/lessons.json (generated runtime catalog)
        ├── .data/workspaces (exercise sandboxes)
        └── Git/VS Code adapters (explicit local actions)
```

## Quy trình tạo danh mục nội dung

Phần khai báo đầu tệp và nội dung Markdown là nguồn để người đóng góp đọc, sửa và so sánh. `scripts/build_lesson_catalog.py` chuyển chúng thành `content/lessons.json`, sau đó `scripts/validate_content.py` kiểm tra:

- 23 giai đoạn, 208 bài học và khả năng tìm đúng nội dung theo ID;
- quan hệ bài cần học trước và bài tiếp theo không tạo vòng lặp;
- mục tiêu, giải thích, bài thực hành, danh sách tự kiểm tra, hướng dẫn dùng tài liệu và thẻ ôn tập;
- đoạn Python gắn nhãn `runnable` biên dịch được;
- công thức, mã và đáp án ôn tập không bị sao chép máy móc cho nhiều bài;
- lịch học tăng tốc và khối lượng học tương ứng.

JSON được sinh tự động được lưu trong Git để bản sao mã nguồn mới có thể chạy ngay. Sửa nguồn nội dung rồi sinh lại JSON, không sửa trực tiếp để thay thế nguồn.

## Dữ liệu khi chạy và bản chạy trực tiếp

Bản chạy từ mã nguồn lưu dữ liệu trong `.data/` của dự án để thuận tiện sao lưu. Bản chạy trực tiếp lưu ở thư mục người dùng có quyền ghi (`%LOCALAPPDATA%\JourneyAIEngineer`); có thể đổi bằng `JOURNEY_DATA_DIR`. Khi cần xuất bài làm hoặc dùng Git, `JOURNEY_PROJECT_ROOT` trỏ tới bản sao kho mã. Cơ sở dữ liệu, `.env`, token và nhật ký riêng không được đưa vào gói mã nguồn.

## Giới hạn công cụ trên máy cá nhân

Các API đọc Git, mở thư mục/VS Code, tạo thư mục bài tập và chạy kiểm thử chỉ dành cho máy cá nhân. Chúng giới hạn đường dẫn, thời gian chạy và dung lượng kết quả; kiểm tra thông tin bí mật và yêu cầu xác nhận trước khi công bố. API chỉ lắng nghe tại địa chỉ nội bộ; phản hồi kiểm tra tình trạng dịch vụ không được lộ đường dẫn tuyệt đối hoặc thông tin đăng nhập. Có thể dùng `local_tools_enabled` để tắt các công cụ này.

Web beta tách phần kết nối công cụ trên máy cá nhân khỏi giao diện web, dùng Supabase Auth và Postgres/RLS.
Không cung cấp bản web bằng cách mở FastAPI hiện tại trên máy cá nhân ra Internet.

## Web beta

The deployed web beta uses a separate runtime:

```text
Cloudflare Pages (React/Vite static SPA)
        │ Supabase JS with the learner's JWT
        ▼
Supabase Auth + Postgres + RLS
        │
        └── per-user progress, reviews, notes, journal, settings and sessions

Desktop/local remains: React → FastAPI loopback → SQLite + workspace/Git adapters
```

The web runtime imports a static curriculum catalog and has no route to local filesystem, Git, VS Code, test runner, backup database or subprocess code. Web and desktop learning data are separate in beta; no automatic two-way migration is promised. See [WEB-BETA.md](WEB-BETA.md) for the deployment gate and [WEB-BETA-PRIVACY.md](WEB-BETA-PRIVACY.md) for data handling.

## Trạng thái học tập

Nội dung thẻ (`review_cards`) tách riêng với lịch ôn (`review_state`). Lịch ôn lưu hạn ôn, khoảng cách giữa các lần ôn, độ dễ, số lần lặp, số lần quên và trạng thái tạm dừng/thẻ hay quên. Cập nhật cơ sở dữ liệu theo cách bổ sung để giữ tiến độ và lịch sử cũ. Bộ lập lịch SM-2 nhận `again`, `hard`, `good`, `easy`; câu trả lời sai dẫn lại bài học hoặc chủ đề cần ôn.

## Quy trình phát hành

```text
Markdown edit → build/validate → Python tests → lint/build
             → build_exe.ps1 → package_release.ps1
             → versioned ZIP + SHA256SUMS → human review → GitHub Release
```

CI kiểm tra nội dung, chạy kiểm thử Python, `pip check`, `npm ci`, kiểm tra mã và tạo bản Vite. Gói phát hành không chứa `.data`, cơ sở dữ liệu, `.venv`, `node_modules`, `.env`, thông tin bí mật hoặc bộ nhớ đệm khi đóng gói. SmartScreen có thể cảnh báo vì tệp thực thi chưa được ký số. Mã kiểm tra SHA-256 giúp đối chiếu tệp tải về, không thay thế chữ ký xác minh nhà phát hành.

## Hướng phát triển sản phẩm

- **v0.1:** bản một người dùng trên máy cá nhân, mã nguồn và gói Windows chạy trực tiếp; có bài học song ngữ, thư mục bài tập, ôn tập, nhật ký, Git và xuất nội dung để hỏi trợ lý.
- **Web beta đã triển khai:** Cloudflare Pages + Supabase Auth/Postgres/RLS, đăng nhập bằng email và mật khẩu
  và lưu dữ liệu học theo tài khoản. Xem [WEB-BETA.md](WEB-BETA.md) để biết trạng thái triển khai đăng nhập.
- **Sau beta:** hoàn thiện trang học công khai và duyệt phản hồi, cho phép tự xóa tài khoản,
  tăng kiểm thử đầu cuối và theo dõi bản web, bổ sung kết nối nhà cung cấp khi cần; giữ xuất/nhập dữ liệu trên máy làm phương án dự phòng.
