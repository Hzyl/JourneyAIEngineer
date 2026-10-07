# Public beta guide

Journey AI Engineer v0.1.2 là bản beta **local-first trên Windows**. Mục tiêu của beta là kiểm tra app có giúp một người mới đi qua vòng Roadmap → Lesson → Practice → Review → Journal hay không, đồng thời thu thập feedback để sửa nội dung và UX.

Web beta đã triển khai trên Cloudflare Pages, dùng Supabase Auth/Postgres/RLS với đăng nhập email/password
và dữ liệu học tách theo tài khoản. Dùng URL do maintainer chia sẻ.
Web không chạy exercise, mở VS Code, truy cập Git hoặc filesystem local.
Xem [WEB-BETA.md](WEB-BETA.md) để theo dõi deployment và các cải thiện auth đang chờ rollout.

> **Portable/source clone là bản local.** Mỗi người chạy app và lưu dữ liệu trên máy của mình,
> không có login hoặc cloud sync. Web beta là runtime riêng; không bản nào cung cấp public code-execution server.

## Trước khi mời người thử

- Nếu repository còn private, chỉ tài khoản được cấp quyền mới clone hoặc tải Release. Muốn ai cũng thử, maintainer cần đổi visibility sau khi scan secret/history và kiểm tra release.
- Nếu chưa muốn public source, chỉ chia sẻ ZIP Release với nhóm thử nghiệm tin cậy.
- Không đặt database, `.data\`, `.env`, token, journal riêng hoặc file build cá nhân vào ZIP/repository.
- Ghi rõ version đang thử; beta tester không nên dùng data quan trọng.

## Chọn bản cho người thử

| Mục tiêu | Bản dùng | Cách bắt đầu |
| --- | --- | --- |
| Chỉ muốn thử app | Portable `.exe` | Tải ZIP từ [Releases](https://github.com/Hzyl/JourneyAIEngineer/releases/latest), kiểm tra SHA-256, giải nén và mở `JourneyAIEngineer.exe` |
| Muốn học bằng VS Code hoặc sửa lesson | Source clone | Đọc [Windows quickstart](QUICKSTART-WINDOWS.md), clone, setup rồi chạy dev |
| Muốn đóng góp code/content | Fork + branch | Đọc [CONTRIBUTING.md](../CONTRIBUTING.md) trước khi mở PR |
| Muốn học bằng trình duyệt và tài khoản | Web beta | Mở URL maintainer chia sẻ; xem [hướng dẫn web](WEB-BETA.md) |

## Portable test flow

1. Tải `JourneyAIEngineer-v0.1.2-windows-x64.zip` và `SHA256SUMS.txt` từ cùng một release.
2. Kiểm tra checksum của **ZIP**; checksum không phải checksum riêng của `.exe` bên trong.
3. Giải nén vào thư mục có quyền ghi.
4. Double-click `JourneyAIEngineer.exe`; app sẽ mở browser ở loopback và không để lại terminal.
5. Đóng tab cuối cùng, chờ server local tự tắt.

PowerShell checksum:

~~~powershell
$zip = '.\JourneyAIEngineer-v0.1.2-windows-x64.zip'
$expected = ((Get-Content '.\SHA256SUMS.txt' -Raw).Trim() -split '\s+')[0].ToLowerInvariant()
$actual = (Get-FileHash $zip -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $expected) { throw 'Checksum không khớp.' }
'Checksum OK: ' + $actual
~~~

Portable data mặc định nằm ở `%LOCALAPPDATA%\JourneyAIEngineer`; xóa data root có thể mất progress. Không có source clone thì publish GitHub bị tắt là đúng behavior.

## Checklist thử bản local trong 15–30 phút

Với web beta, dùng [acceptance checklist của web](WEB-BETA.md#acceptance-checklist-for-each-deployment).

- [ ] App mở được từ portable ZIP hoặc source clone.
- [ ] Dashboard và Roadmap hiển thị phase/track; mở được một lesson.
- [ ] Lesson có thể cuộn; các phần overview, concept, practice, check và resource không bị cắt.
- [ ] Mục lục lesson nhảy đúng đến section; mobile khoảng 390px không có horizontal overflow.
- [ ] Resource ngoài mở đúng; resource in-app hiển thị trong app.
- [ ] Practice Lab tạo được workspace; nút mở VS Code trỏ đúng folder.
- [ ] Test runner chạy được manifest và output/error có giới hạn.
- [ ] Đánh dấu lesson và review card làm progress cập nhật.
- [ ] Journal lưu được; context export hiển thị nội dung trước khi copy.
- [ ] Feedback report hiển thị preview đã redact trước khi mở GitHub.
- [ ] Đóng rồi mở lại app; progress/review state vẫn còn.
- [ ] Journal & Git hiển thị status/diff; không mở một loạt terminal chớp tắt.
- [ ] Khi không có Git clone, UI nói rõ local learning mode và không hiện lỗi mơ hồ.

## Cách gửi feedback

### Bug có thể tái hiện

Dùng [Bug report form](https://github.com/Hzyl/JourneyAIEngineer/issues/new?template=bug_report.yml). Ghi:

- Version/tag hoặc commit.
- Mode: `Portable .exe`, `Source clone` hoặc `Web beta`.
- Windows version, browser và viewport nếu liên quan.
- Bước tái hiện tối thiểu.
- Expected behavior và actual behavior.
- Screenshot/log đã xóa path cá nhân, token và dữ liệu riêng.

Mẫu:

~~~text
Version: v0.1.2
Mode: Portable .exe
Environment: Windows 11, Chrome, viewport 390px
Steps: 1. Mở Roadmap 2. Chọn Phase 1 3. Mở lesson ...
Expected: ...
Actual: ...
Evidence: screenshot/log đã redact
~~~

### Ý tưởng lesson hoặc UX

Dùng [Feature request form](https://github.com/Hzyl/JourneyAIEngineer/issues/new?template=feature_request.yml). Hãy bắt đầu bằng vấn đề người học gặp, ví dụ thiếu prerequisite, ví dụ code không đủ, hoặc section khó tìm.

### Trao đổi chung

Dùng [GitHub Discussions](https://github.com/Hzyl/JourneyAIEngineer/discussions) để chia sẻ trải nghiệm, đề xuất tài liệu hoặc cách học. Không đăng secret, database, journal riêng hay exploit.

### Báo cáo bảo mật

Đọc [SECURITY.md](../SECURITY.md). Không công khai payload hoặc hướng dẫn tấn công trong issue/discussion.

## Ranh giới beta đã biết

- Chỉ portable Windows được đóng gói trong v0.1. Source clone cần môi trường phát triển.
- Portable/source clone giữ tiến trình local, không có account, sync hoặc recovery trên cloud.
  Web beta dùng account/cloud sync riêng, không tự merge dữ liệu SQLite local.
- App không gọi AI provider trực tiếp; context bridge chỉ tạo Markdown để người dùng tự gửi.
- Local workspace runner có allowlist, timeout và output cap; không phải dịch vụ chạy code công khai.
- Feedback public cần maintainer review; app không tự sửa hoặc push curriculum.

## Tiêu chí để maintainer phát hành bản beta mới

- Fresh clone và portable ZIP chạy được theo quickstart.
- CI pass content validation, backend tests, lint/build, browser smoke và secret scan.
- ZIP có version, `SHA256SUMS.txt` và không chứa `.data\`, database, `.env`, `.venv\`, `node_modules` hoặc journal runtime.
- Release notes ghi rõ thay đổi, giới hạn và cách quay lại bản trước.
- README/quickstart mô tả đúng portable, source clone, data root và security boundary.
