# Hướng dẫn thử bản beta

Journey AI Engineer có bản beta **ưu tiên lưu dữ liệu trên máy Windows**. Khi thử,
bạn sẽ chọn bài từ lộ trình, đọc, thực hành, ôn tập rồi ghi nhật ký. Mục tiêu là kiểm tra
người mới có thực hiện được vòng học này hay không và tìm những chỗ cần sửa.

Bản ứng viên tiếp theo cho máy cá nhân là **0.1.3**, chưa phải GitHub Release đã phát hành.
Khi tải bản công khai, đối chiếu đúng phiên bản và mã kiểm tra trên trang phát hành.

Web beta đã triển khai trên Cloudflare Pages, dùng Supabase Auth/Postgres/RLS với đăng nhập
bằng email và mật khẩu, lưu dữ liệu học theo tài khoản. Mở https://journeyaiengineer.pages.dev.
Web không chạy bài tập, mở VS Code, truy cập Git hoặc hệ thống tệp trên máy cá nhân.
Xem [WEB-BETA.md](WEB-BETA.md) để theo dõi việc triển khai và phạm vi kiểm thử tài khoản.

> **Bản chạy trực tiếp và bản mã nguồn lưu dữ liệu trên máy cá nhân.** Mỗi người chạy ứng dụng
> trên máy của mình, không có đăng nhập hoặc đồng bộ đám mây. Web beta hoạt động riêng;
> cả hai cách dùng đều không cung cấp dịch vụ chạy mã công khai.

## Trước khi mời người thử

- Nếu kho mã còn riêng tư, chỉ tài khoản được cấp quyền mới lấy mã nguồn hoặc tải bản phát hành.
  Trước khi mở công khai, người duy trì cần kiểm tra thông tin bí mật trong mã, lịch sử Git và gói phát hành.
- Nếu chưa muốn công khai mã nguồn, chỉ chia sẻ gói ZIP đã phát hành với nhóm thử nghiệm tin cậy.
- Không đưa cơ sở dữ liệu, `.data\`, `.env`, token, nhật ký riêng hoặc tệp đóng gói cá nhân vào ZIP/kho mã.
- Ghi rõ phiên bản đang thử; dùng dữ liệu thử nghiệm thay cho dữ liệu quan trọng.

## Chọn cách dùng

| Mục tiêu | Bản dùng | Cách bắt đầu |
| --- | --- | --- |
| Chỉ muốn thử ứng dụng | Bản chạy trực tiếp `.exe` | Tải ZIP từ [Releases](https://github.com/Hzyl/JourneyAIEngineer/releases/latest), kiểm tra SHA-256, giải nén và mở `JourneyAIEngineer.exe` |
| Muốn sửa ứng dụng hoặc bài học | Bản sao mã nguồn | Đọc [hướng dẫn Windows](QUICKSTART-WINDOWS.md), lấy mã nguồn, thiết lập rồi chạy |
| Muốn đóng góp mã hoặc nội dung | Fork và tạo nhánh | Đọc [CONTRIBUTING.md](../CONTRIBUTING.md) trước khi mở PR |
| Muốn học bằng trình duyệt và tài khoản | Web beta | Mở địa chỉ người duy trì chia sẻ; xem [hướng dẫn web](WEB-BETA.md) |

Bản chạy trực tiếp cũng hỗ trợ bài tập khi bạn đã cài Python; VS Code là tùy chọn.

## Thử gói Windows chạy trực tiếp

1. Tải `JourneyAIEngineer-v<version>-windows-x64.zip` và `SHA256SUMS.txt` từ cùng một bản phát hành.
2. Kiểm tra mã SHA-256 của **ZIP**, không dùng mã này để đối chiếu riêng tệp `.exe` bên trong.
3. Giải nén vào thư mục có quyền ghi.
4. Nhấp đúp vào `JourneyAIEngineer.exe`; ứng dụng mở trình duyệt tại địa chỉ nội bộ, không mở cửa sổ dòng lệnh.
5. Đóng tab cuối cùng rồi chờ máy chủ trên máy tự tắt.

Kiểm tra bằng PowerShell (ví dụ cho gói ứng viên 0.1.3; đổi tên ZIP theo bản đang thử):

~~~powershell
$zip = '.\JourneyAIEngineer-v0.1.3-windows-x64.zip'
$zipName = Split-Path -Leaf $zip
$checksumRows = @(Get-Content '.\SHA256SUMS.txt' | Where-Object {
    ($_ -split '\s+', 2)[-1].TrimStart('*') -eq $zipName
})
if ($checksumRows.Count -ne 1) { throw 'Không tìm thấy đúng một checksum cho ZIP này.' }
$expected = ($checksumRows[0] -split '\s+', 2)[0].ToLowerInvariant()
$actual = (Get-FileHash $zip -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $expected) { throw 'Checksum không khớp.' }
'Checksum OK: ' + $actual
~~~

Bản chạy trực tiếp mặc định lưu dữ liệu ở `%LOCALAPPDATA%\JourneyAIEngineer`.
Xóa thư mục này có thể làm mất tiến độ. Khi chưa có bản sao kho mã, chức năng công bố lên GitHub bị tắt.

## Tự kiểm tra bản trên máy trong 15–30 phút

Với web beta, dùng [danh sách kiểm tra bản web](WEB-BETA.md#acceptance-checklist-for-each-deployment).

- [ ] Mở được ứng dụng từ gói ZIP chạy trực tiếp hoặc bản mã nguồn.
- [ ] Trang tổng quan và lộ trình hiển thị giai đoạn/hướng học; mở được một bài.
- [ ] Cuộn được bài học; các phần tổng quan, giải thích, thực hành, tự kiểm tra và tài liệu không bị cắt.
- [ ] Mục lục dẫn tới đúng phần; màn hình rộng khoảng 390px không tràn ngang.
- [ ] Liên kết ngoài mở đúng; tài liệu nội bộ hiển thị trong ứng dụng.
- [ ] Trang bài tập tạo được thư mục; nút mở VS Code trỏ đúng thư mục đó.
- [ ] Bộ chạy kiểm thử dùng đúng lệnh trong tệp khai báo và giới hạn dung lượng kết quả/lỗi.
- [ ] Đánh dấu bài học và trả lời thẻ ôn làm cập nhật tiến độ.
- [ ] Lưu được nhật ký; nội dung gửi cho trợ lý hiển thị để bạn đọc lại trước khi gửi.
- [ ] Báo cáo phản hồi cho xem trước nội dung đã che thông tin riêng trước khi mở GitHub.
- [ ] Đóng rồi mở lại ứng dụng; tiến độ và lịch ôn vẫn còn.
- [ ] Nhật ký & Git hiển thị trạng thái và phần thay đổi; không mở nhiều cửa sổ dòng lệnh chớp tắt.
- [ ] Khi chưa có bản sao kho mã, giao diện giải thích rõ vẫn học được trên máy và thao tác nào cần Git.

## Gửi phản hồi

### Lỗi có thể tái hiện

Dùng [Bug report form](https://github.com/Hzyl/JourneyAIEngineer/issues/new?template=bug_report.yml) và ghi:

- Phiên bản/tag hoặc commit.
- Cách chạy: `Portable .exe`, `Source clone` hoặc `Web beta`.
- Phiên bản Windows, trình duyệt và kích thước màn hình nếu liên quan.
- Các bước tối thiểu để gặp lại lỗi.
- Kết quả mong đợi và kết quả thực tế.
- Ảnh hoặc nhật ký lỗi đã che đường dẫn cá nhân, token và dữ liệu riêng.

Mẫu sau giữ tên trường tiếng Anh để điền vào biểu mẫu:

~~~text
Version: <version hoặc commit đang thử>
Mode: Portable .exe
Environment: Windows 11, Chrome, viewport 390px
Steps: 1. Mở Roadmap 2. Chọn Phase 1 3. Mở lesson ...
Expected: ...
Actual: ...
Evidence: screenshot/log đã redact
~~~

### Ý tưởng về bài học hoặc cách sử dụng

Dùng [Feature request form](https://github.com/Hzyl/JourneyAIEngineer/issues/new?template=feature_request.yml).
Hãy bắt đầu bằng vấn đề người học gặp, chẳng hạn chưa giải thích kiến thức cần biết trước,
ví dụ mã chưa đủ hoặc một phần nội dung khó tìm.

### Trao đổi chung và báo cáo bảo mật

Dùng [GitHub Discussions](https://github.com/Hzyl/JourneyAIEngineer/discussions) để chia sẻ trải nghiệm,
đề xuất tài liệu hoặc cách học. Không đăng thông tin bí mật, cơ sở dữ liệu, nhật ký riêng hoặc mã khai thác lỗ hổng.

Với vấn đề bảo mật, đọc [SECURITY.md](../SECURITY.md). Không đăng dữ liệu thử tấn công hoặc
hướng dẫn khai thác trong mục báo lỗi/thảo luận công khai.

## Giới hạn của bản beta

- v0.1 chỉ có gói chạy trực tiếp cho Windows. Chạy từ mã nguồn cần môi trường phát triển.
- Bản chạy trực tiếp và bản mã nguồn giữ tiến độ trên máy, không có tài khoản, đồng bộ hoặc khôi phục đám mây.
  Web beta lưu dữ liệu theo tài khoản riêng, không tự gộp dữ liệu SQLite trên máy.
- Ứng dụng không gọi nhà cung cấp AI trực tiếp; chức năng chuẩn bị câu hỏi chỉ tạo Markdown để bạn tự gửi.
- Bộ chạy bài tập trên máy giới hạn lệnh được phép, thời gian chạy và dung lượng kết quả;
  không phải dịch vụ chạy mã công khai.
- Phản hồi công khai cần người duy trì xem xét; ứng dụng không tự sửa hoặc đẩy nội dung chương trình học lên kho mã.

## Tiêu chí để phát hành bản beta mới

- Bản sao mã nguồn mới và gói ZIP chạy trực tiếp hoạt động theo hướng dẫn bắt đầu.
- CI đạt kiểm tra nội dung, kiểm thử máy chủ, kiểm tra mã/đóng gói, kiểm tra nhanh trên trình duyệt
  và quét thông tin bí mật.
- ZIP có phiên bản, `SHA256SUMS.txt` và không chứa `.data\`, cơ sở dữ liệu, `.env`, `.venv\`,
  `node_modules` hoặc nhật ký phát sinh khi dùng.
- Ghi chú phát hành nêu rõ thay đổi, giới hạn và cách quay lại bản trước.
- README/hướng dẫn bắt đầu mô tả đúng bản chạy trực tiếp, bản mã nguồn, thư mục dữ liệu và giới hạn bảo mật.
