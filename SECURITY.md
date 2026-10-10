# Chính sách bảo mật

## Phạm vi của bản chạy trên máy cá nhân

Journey AI Engineer v0.1 là ứng dụng dành cho **một người dùng, ưu tiên lưu dữ liệu trên máy cá nhân**. FastAPI chỉ lắng nghe tại địa chỉ nội bộ (`127.0.0.1`); SQLite lưu trên máy người dùng. Các API mở VS Code, chạy bài tập và đọc Git dành cho người sử dụng máy đó. Không mở cổng ứng dụng ra Internet hoặc dùng máy chủ trung gian để cung cấp API này ra ngoài.

`.exe` cũng giữ giới hạn này. Bản chạy trực tiếp không cấp tài khoản, đồng bộ tiến trình lên đám mây, nhận khóa API AI hoặc cung cấp máy chủ chạy mã tùy ý của người học. Bộ chạy bài tập chỉ thực thi lệnh được tệp khai báo cho phép, với giới hạn thời gian và dung lượng kết quả.

## Báo cáo lỗ hổng

Không đăng thông tin bí mật, mã khai thác đang hoạt động hoặc dữ liệu cá nhân trong mục báo lỗi công khai. Gửi riêng cho người duy trì qua kênh liên hệ trên hồ sơ GitHub, kèm:

- phiên bản/commit và hệ điều hành;
- các bước tái hiện tối thiểu, không dùng thông tin đăng nhập thật;
- tác động đã quan sát và điều kiện để lỗi xảy ra;
- nhật ký đã che đường dẫn cá nhân, token, cookie và nội dung nhật ký học tập.

Nếu vấn đề chỉ tái hiện trên hệ thống ngoài quyền kiểm soát của bạn, dừng kiểm thử và không tiếp tục quét.

## Phạm vi kiểm thử bảo mật được phép

Kho mã có `scripts/security_audit.py` để kiểm tra thụ động. Chương trình chỉ đọc bảng định tuyến, cấu trúc dữ liệu và các mẫu mã nguồn; không gửi yêu cầu mạng, tạo dữ liệu thử tấn công, tải/cài/chạy RedAmon hoặc khẳng định API đã bị khai thác. RedAmon chỉ là tài liệu tham khảo cho bài thực hành bảo mật được ủy quyền, không phải thư viện cần để chạy Journey.

Quy trình kiểm tra: thống kê thụ động → kiểm tra thư viện phụ thuộc và phân tích mã tĩnh (SAST) → kiểm thử đơn vị/tích hợp → thử trên môi trường cô lập có dữ liệu giả và văn bản ủy quyền → phân loại phát hiện → sửa lỗi → kiểm thử hồi quy. Không chạy RedAmon hoặc công cụ quét vào hệ thống đang phục vụ người dùng, mục tiêu công khai hay hệ thống của người khác. Không đưa báo cáo chứa thông tin đăng nhập vào commit.

## Thông tin bí mật và dữ liệu

- Không đưa `.env`, khóa API, khóa riêng, mật khẩu, cơ sở dữ liệu hoặc `.data` vào commit.
- Trước khi xuất bài làm, ứng dụng loại `.env`, `.db`, `.venv`, liên kết tượng trưng và các mẫu chứa thông tin bí mật; bạn vẫn phải tự đọc lại phần thay đổi.
- `JOURNEY_FEEDBACK_ADMIN_TOKEN` chỉ tồn tại trong tiến trình máy chủ trên máy cá nhân; không đặt trong gói giao diện hoặc chuỗi truy vấn URL.
- Nếu thông tin bí mật đã lọt vào lịch sử Git, hãy thay hoặc thu hồi thông tin đó trước, rồi liên hệ người duy trì để xử lý lịch sử.

## Ranh giới web beta

Web beta dùng giao diện React/Vite tĩnh trên Cloudflare Pages, kết nối Supabase Auth và
Postgres/RLS để tách dữ liệu theo tài khoản. Trình duyệt không có quyền gọi máy chủ trên
máy cá nhân để mở VS Code, chạy bài tập, đọc Git hoặc hệ thống tệp. Người học đọc đề, hướng
dẫn và bài giải trên web, rồi thực hành mã trong môi trường của mình.

Không mở FastAPI trên máy cá nhân ra ngoài bằng cách đổi CORS, lắng nghe tại `0.0.0.0` hay thêm máy chủ trung gian
để thay thế kiến trúc web. Không đưa khóa dịch vụ hoặc mật khẩu cơ sở dữ liệu vào gói giao diện.
Đọc [trạng thái triển khai](docs/RELEASE-READINESS.md) để phân biệt tính năng đã có
trên máy chủ và thay đổi đang chờ triển khai; mã trong kho không chứng minh rằng thay đổi đã được triển khai.

## Web beta boundary

The deployed web beta uses a static React/Vite frontend with Supabase Auth and
Postgres RLS. The Supabase **publishable** key is allowed in the browser bundle;
it is not a credential that bypasses RLS. Its safety depends on all user-data tables
having RLS enabled and policies requiring `user_id = auth.uid()`.

Never expose a Supabase `service_role`/`sb_secret_` key, database password, personal access token or local `.env` through Vite, Cloudflare Pages variables intended for the browser, Git history, screenshots or issue reports. The hosted build rejects the known secret-key prefix and generates CSP `connect-src` from the configured Supabase origin.

Remote Supabase migrations must be additive and tested locally first. A future incident is repaired by a new migration and/or frontend rollback; do not rewrite applied production migration history or expose the local FastAPI service as a workaround.
