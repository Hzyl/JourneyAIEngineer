# Giao diện sáng và tối

Nút **Sáng / Tối** nằm trên thanh đầu trang của ứng dụng, trang học thử và màn hình tài khoản. Nút hỗ trợ bàn phím và có tên hành động cho trình đọc màn hình.

- Lần đầu mở, ứng dụng dùng giao diện của hệ điều hành và theo các thay đổi của hệ thống.
- Khi chọn thủ công, lựa chọn được lưu trong trình duyệt bằng khóa `journey.theme`, giữ sau khi tải lại và đồng bộ giữa các tab cùng origin.
- Khi trình duyệt chặn lưu trữ, vẫn đổi được giao diện trong tab hiện tại; lựa chọn có thể mất khi tải lại.
- Thiết lập này thuộc trình duyệt/máy hiện tại, không lưu lên Supabase.

## Quy tắc màu

`src/theme/tokens.css` định nghĩa riêng màu nền, chữ chính, chữ phụ, đường viền, liên kết, nút và thông báo cho mỗi giao diện. Dùng các biến này khi thêm giao diện mới; không gán chữ trắng lên mọi nút, vì nút màu sáng ở chế độ tối cần chữ tối.

Sidebar, phần giới thiệu tài khoản và khối code giữ nền tối với cặp màu chữ riêng. Ô nhập liệu, placeholder, focus, lỗi và thành công cũng có màu riêng. Script cùng origin `public/theme-init.js` chọn giao diện trước khi React khởi động; khi đổi khóa lưu trữ hoặc màu nền gốc, cập nhật đồng thời script này và `src/theme/theme-store.ts`.

## Kiểm tra hồi quy

- `npm run test:unit`: kiểm tra khởi tạo trước React, ưu tiên lựa chọn đã lưu và xử lý lưu trữ bị chặn.
- `npm run test:e2e`: kiểm tra đổi bằng bàn phím, lưu sau reload, tùy chọn hệ thống, các màn hình học và nút chấm mức nhớ.
- `npm run test:e2e:hosted`: kiểm tra trang công khai, lộ trình, bài học mẫu và trạng thái tài khoản trên desktop/mobile. Auth dùng dữ liệu giả lập, không tạo tài khoản thật.
- Khi chạy đồng thời hai bộ E2E, truyền `--output` khác nhau để tránh dùng chung tệp trace.

Kiểm tra màu chữ tự động yêu cầu ít nhất 4.5:1 cho chữ thường và 3:1 cho chữ lớn. Đây là kiểm tra hồi quy các trạng thái được phủ, không thay thế một cuộc kiểm tra accessibility toàn diện. Với gradient, công cụ hiện kiểm tra điểm màu đầu; vẫn cần xem ảnh thực tế.

Ảnh kiểm tra được tạo trong `.build/theme-evidence/` (không đưa vào Git). Bộ kiểm tra cũng phát hiện tràn ngang; ảnh mobile cần được xem để phát hiện chồng chữ. Nút quay lại từ màn hình tài khoản đã được đưa vào bố cục bình thường để không đè lên logo.

## Báo cáo chất lượng UI — 2026-10-07

**Phạm vi và hướng thiết kế:** Codex UI thực hiện yêu cầu sáng/tối trên app local, trang công khai và tài khoản. Giữ cấu trúc trang và typography hiện có; dùng nền trung tính sáng hoặc navy tối, màu nhấn teal, cặp màu cảnh báo/lỗi/thành công riêng. Không thêm animation. Bộ biến CSS ở `src/theme/tokens.css` là nguồn màu chung; không cần bản thiết kế hoặc bộ theme ngoài.

**Quality gates:** áp dụng hướng dẫn UI/UX Pro Max và Impeccable cho tương phản, trạng thái điều khiển và bố cục responsive. Không dùng thêm công cụ thiết kế, cài plugin hoặc dịch vụ trả phí. Node/npm và Chromium của Playwright có sẵn. Kiểm tra trình duyệt: đạt trong phạm vi bên dưới.

| Kiểm tra | Kết quả |
| --- | --- |
| Unit tests | 28 đạt |
| Playwright local | 9 đạt; hai theme trên 11 màn hình desktop và 4 màn hình mobile, cùng lưu lựa chọn/bàn phím/ôn tập |
| Playwright hosted | 6 đạt; học thử, lộ trình, bài mẫu, đăng ký, callback và khôi phục ở 1440px và 390px |
| Lint | Không lỗi; 3 cảnh báo có sẵn về Fast Refresh và dependency của hook |
| Production build | Đạt; vẫn có cảnh báo bundle lớn hơn 500 kB |
| Visual review | Đã xem ảnh Today sáng/tối, mobile và tài khoản/mobile; sửa nút quay lại đè logo và chữ phụ callback thiếu tương phản |

**Giới hạn:** kiểm tra bằng Chromium, chưa bao phủ mọi trình duyệt, mức zoom và mọi dữ liệu người dùng. Bộ đo tương phản bỏ qua điều khiển disabled, nội dung ẩn và chưa đo toàn bộ gradient; không phải chứng nhận WCAG. Chưa tạo lại bộ cài Windows, chưa deploy Cloudflare và chưa thay đổi Supabase cho tính năng này.

**Khuyến nghị:** thay đổi local sẵn sàng để review/publish. Cần xác nhận riêng trước khi commit/push hoặc triển khai; báo cáo này không xác nhận phiên bản public đã có theme mới.
