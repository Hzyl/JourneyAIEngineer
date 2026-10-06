# Security policy

## Phạm vi của v0.1

Journey AI Engineer v0.1 là ứng dụng **local-first, single-user**. FastAPI chỉ bind loopback (`127.0.0.1`), SQLite lưu trên máy người dùng, và các route mở VS Code/chạy exercise/đọc Git được thiết kế cho desktop owner. Đây không phải public multi-user API. Không expose port của app lên Internet hoặc reverse proxy ra ngoài.

`.exe` cũng giữ ranh giới này. Nó không cấp tài khoản, không đồng bộ progress lên cloud, không nhận API key AI và không chạy arbitrary learner code trên server. Workspace/test runner chỉ chạy command do manifest cho phép với timeout/output cap.

## Báo cáo lỗ hổng

Vui lòng không đăng secret, exploit đang hoạt động hoặc dữ liệu cá nhân vào issue công khai. Gửi báo cáo riêng cho maintainer qua kênh liên hệ trong GitHub profile, kèm:

- phiên bản/commit và hệ điều hành;
- bước tái hiện tối thiểu, không có credential thật;
- impact quan sát được và điều kiện cần để xảy ra;
- log đã redact path cá nhân, token, cookie và nội dung journal.

Nếu vấn đề chỉ tái hiện với một target ngoài quyền kiểm soát, dừng kiểm thử và không tiếp tục quét.

## Security testing được phép

Repository có `scripts/security_audit.py` ở chế độ passive. Script chỉ đọc route table, schema và pattern source; không gửi network request, không tạo payload, không clone/cài/chạy RedAmon và không khẳng định endpoint đã bị khai thác. RedAmon là tài liệu/tham khảo cho security lab có ủy quyền, không phải dependency runtime của Journey.

Luồng an toàn: passive inventory → dependency/SAST → unit/integration test → staging cô lập với dữ liệu giả và văn bản ủy quyền → triage → sửa → regression test. Không chạy RedAmon hoặc scanner vào production/public target hay hệ thống của người khác; không commit report chứa credential.

## Chính sách secret và dữ liệu

- Không commit `.env`, API key, private key, password, database hoặc `.data`.
- Trước khi export artifact, app loại `.env`, `.db`, `.venv`, symlink và pattern secret; vẫn phải review diff bằng mắt.
- `JOURNEY_FEEDBACK_ADMIN_TOKEN` chỉ tồn tại trong process backend local, không đặt trong frontend bundle hoặc query string.
- Nếu phát hiện secret đã lọt vào history, rotate/revoke secret trước, sau đó liên hệ maintainer để xử lý history rewrite.

## Ranh giới hosted tương lai

Nếu sau này có public web, phải tách public API khỏi filesystem/Git/subprocess, thêm authentication, per-user isolation, Postgres/RLS, rate limit, audit log, CSRF/origin policy và secret management. Không bật hosted mode bằng cách chỉ đổi CORS hoặc bind `0.0.0.0` trên code local hiện tại.

## Web beta boundary

The hosted candidate uses a static React/Vite frontend with Supabase Auth and Postgres RLS. The Supabase **publishable** key is allowed in the browser bundle; it is not a credential that bypasses RLS. Its safety depends on all user-data tables having RLS enabled and policies requiring `user_id = auth.uid()`.

Never expose a Supabase `service_role`/`sb_secret_` key, database password, personal access token or local `.env` through Vite, Cloudflare Pages variables intended for the browser, Git history, screenshots or issue reports. The hosted build rejects the known secret-key prefix and generates CSP `connect-src` from the configured Supabase origin.

Remote Supabase migrations must be additive and tested locally first. A future incident is repaired by a new migration and/or frontend rollback; do not rewrite applied production migration history or expose the local FastAPI service as a workaround.
