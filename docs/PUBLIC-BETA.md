# Public beta guide

Journey AI Engineer v0.1.2 là bản beta công khai hiện tại, bổ sung browser smoke test, hướng dẫn feedback và report bridge đầy đủ. Mục tiêu của beta là kiểm tra ba điều với người dùng thật:

1. Người mới có thể cài và bắt đầu một lesson mà không cần maintainer hướng dẫn riêng.
2. Vòng `lesson → practice → test → review → journal` giúp tạo bằng chứng học tập có thể kiểm tra.
3. Những lỗi về nội dung, UX, workspace và dữ liệu local được báo cáo đủ thông tin để sửa.

Beta chạy **local-first trên Windows**. Mỗi người dùng có dữ liệu progress riêng trên máy của họ; repository public chỉ chứa source curriculum, code và tài liệu. Không có đăng nhập, đồng bộ cloud, API AI trả phí hoặc public execution server trong v0.1.

## Chọn bản phù hợp

| Bạn muốn làm gì? | Dùng bản nào? | Bắt đầu ở đâu? |
| --- | --- | --- |
| Học thử nhanh, không sửa source | Portable `.exe` | [Release mới nhất](https://github.com/Hzyl/JourneyAIEngineer/releases/latest) |
| Học bằng VS Code, sửa lesson/exercise, lưu artifact và dùng Git | Source clone | [Windows quickstart](QUICKSTART-WINDOWS.md) |
| Đóng góp nội dung hoặc code | Fork rồi tạo branch | [CONTRIBUTING.md](../CONTRIBUTING.md) |

### Portable release

1. Tải `JourneyAIEngineer-v0.1.2-windows-x64.zip` từ [GitHub Release](https://github.com/Hzyl/JourneyAIEngineer/releases/tag/v0.1.2).
2. Tải `SHA256SUMS.txt` cùng release và kiểm tra checksum trước khi chạy.
3. Giải nén vào thư mục có quyền ghi rồi mở `JourneyAIEngineer.exe`.
4. Nếu Windows SmartScreen cảnh báo, hãy kiểm tra nguồn tải và checksum. Binary v0.1 chưa được code-sign nên cảnh báo này có thể xuất hiện.

Checksum trong release áp dụng cho **file ZIP**:

```powershell
Get-FileHash .\JourneyAIEngineer-v0.1.2-windows-x64.zip -Algorithm SHA256
Get-Content .\SHA256SUMS.txt
```

Portable mode lưu dữ liệu trong `%LOCALAPPDATA%\JourneyAIEngineer` và không tự push lên GitHub. Muốn làm bài và publish artifact, hãy dùng source clone hoặc trỏ `JOURNEY_PROJECT_ROOT` tới một clone mà bạn sở hữu.

### Source clone

```powershell
git clone https://github.com/Hzyl/JourneyAIEngineer.git
Set-Location JourneyAIEngineer
.\scripts\setup.ps1
.\scripts\dev.ps1
```

Mở `http://127.0.0.1:5173`. Không bind app ra `0.0.0.0`, không forward port và không dùng local API như public endpoint.

## Bài kiểm tra beta trong 15–30 phút

Hãy dùng dữ liệu giả, không đưa token hoặc journal riêng vào issue/discussion.

- [ ] Dashboard mở được sau khi cài hoặc chạy portable.
- [ ] Roadmap lọc được phase/track và mở được một lesson.
- [ ] Lesson cuộn được trong một vùng nội dung, không bị cắt phần concept, practice hoặc completion criteria.
- [ ] Resource ngoài mở đúng URL; phần `in_app` vẫn hiển thị nội dung trong app.
- [ ] Tạo được workspace cho một exercise, mở đúng thư mục bằng VS Code và lưu file.
- [ ] Chạy được test theo manifest và nhìn thấy output/error có giới hạn.
- [ ] Đánh dấu lesson, trả lời review card và thấy progress cập nhật.
- [ ] Ghi journal hoặc tạo context export; context được hiển thị để xem lại trước khi copy.
- [ ] Trong lesson, thử tạo feedback report; kiểm tra nội dung trước khi copy và mở GitHub Discussions.
- [ ] Đóng rồi mở lại app; progress và review state vẫn còn.
- [ ] Ở màn hình rộng khoảng 390px, không có horizontal overflow và menu vẫn truy cập được bằng bàn phím.
- [ ] Journal & Git không mở một loạt terminal chớp tắt; nếu Git không khả dụng, app báo nguyên nhân có thể xử lý.

Nếu một mục không đạt, hãy ghi lại mode (`Source clone` hoặc `Portable .exe`), version/commit, Windows/browser và bước tái hiện tối thiểu.

## Gửi feedback có ích

- **Bug có thể tái hiện:** dùng [Bug report form](https://github.com/Hzyl/JourneyAIEngineer/issues/new?template=bug_report.yml). Ghi behavior mong đợi, behavior thực tế, bước tái hiện và môi trường.
- **Ý tưởng lesson/UX:** dùng [Feature request form](https://github.com/Hzyl/JourneyAIEngineer/issues/new?template=feature_request.yml), bắt đầu bằng vấn đề của người học.
- **Trao đổi trải nghiệm beta:** dùng [GitHub Discussions](https://github.com/Hzyl/JourneyAIEngineer/discussions). Có thể chia sẻ screenshot hoặc video ngắn nếu chúng không chứa dữ liệu cá nhân.
- **Lỗ hổng bảo mật:** xem [SECURITY.md](../SECURITY.md); không đăng exploit, token hoặc dữ liệu riêng công khai.

Một feedback tốt có dạng:

```text
Version: v0.1.2
Mode: Portable .exe
Environment: Windows 11 24H2, Chrome 131, viewport 390px
Steps: 1. Mở Roadmap 2. Chọn Phase 1 3. Mở lesson ...
Expected: ...
Actual: ...
Evidence: screenshot/log đã redact (nếu có)
```

## Ranh giới đã biết của beta

- Chỉ hỗ trợ Windows 10/11 trong release portable hiện tại.
- Progress, notes, journal và review state nằm local; xóa data root có thể làm mất dữ liệu chưa backup.
- Chưa có account, password recovery, public progress sync, hosted multi-user API hoặc moderation tự động.
- Không có API AI trực tiếp; context bridge chỉ tạo Markdown để người học tự kiểm soát việc gửi sang ChatGPT/Codex.
- Local workspace runner chỉ dành cho máy của người học, với command manifest, timeout và output cap. Không expose thành dịch vụ chạy code trên Internet.
- Một số tính năng nâng cao vẫn đang hoàn thiện; hãy xem issue/discussion và [roadmap trong README](../README.md#roadmap) trước khi kỳ vọng behavior của v0.2/v0.3.

## Tiêu chí maintainer dùng để chốt beta

Mỗi bản public beta cần có:

- source clone chạy được từ quickstart trên máy sạch;
- release ZIP versioned kèm SHA-256 checksum;
- CI pass cho content validation, backend tests, frontend lint/build, browser smoke test và secret scan;
- README mô tả đúng phạm vi local-first, data root và security boundary;
- issue form để thu thập bug/feature có môi trường và bước tái hiện;
- không chứa `.data`, database runtime, `.env`, `.venv`, `node_modules` hoặc secret trong source/release;
- release notes ghi rõ thay đổi, giới hạn và cách rollback về bản trước.

## Demo evidence

Repository chưa nhúng screenshot giả hoặc ảnh chứa dữ liệu cá nhân. Khi chia sẻ beta, maintainer/contributor nên tạo evidence thật từ bản đang chạy:

1. Mở app từ source clone hoặc release ZIP.
2. Ghi lại một luồng ngắn: Roadmap → Lesson → Practice → Review → Journal.
3. Cắt thông tin cá nhân, đường dẫn máy và token khỏi ảnh/video.
4. Đính kèm vào GitHub Discussion hoặc release note, ghi version và mode chạy.

Evidence này giúp người xem đánh giá behavior thật thay vì dựa vào mockup. Ảnh/video không thay thế được test và checksum.
