# Phản hồi khi thao tác

Nút, liên kết, checkbox và phần mở rộng dùng phản hồi nhấn ngắn theo màu teal của giao diện. Với nút và liên kết, hiệu ứng thu nhẹ xuống 98% rồi trở về trong 180 ms. Phản hồi này xác nhận cú bấm; thông báo thành công chỉ xuất hiện sau khi thao tác lưu hoàn tất.

- `InteractionFeedback` gắn một listener dùng chung, không chặn điều hướng hay thay đổi focus. Bấm nhanh liên tiếp thay thế hiệu ứng cũ; listener và animation được dọn khi unmount.
- Nút có `aria-busy="true"` hiển thị vòng chờ dùng màu chữ hiện tại. Nút làm mới quay biểu tượng sẵn có. Trạng thái chờ giữ chữ rõ thay vì giảm opacity như nút bị khóa thông thường.
- Ghi chú, tiến độ và cài đặt khóa thao tác gửi trong lúc chờ. Ghi chú và mục tiêu tuần giữ nội dung sau lỗi để thử lại. Thông báo lưu ghi chú/cài đặt giữ đến khi người dùng sửa hoặc lưu tiếp.
- Các nút đã có trạng thái chờ ở auth, review, phiên học, cloud journal, xuất dữ liệu và xóa tài khoản sử dụng chỉ báo chung.
- Bài tập có nhãn chờ VI/EN cho mở workspace, tạo thư mục, chạy, xuất artifact và xem lịch sử; khóa gửi trùng trong lúc xử lý. Kết quả chạy lỗi giữ nguyên output để xem và thử lại. Sửa nội dung commit yêu cầu xác nhận lại trước khi publish.
- `prefers-reduced-motion: reduce` tắt animation mới, giữ nhãn đang xử lý và phản hồi màu tĩnh. Tùy chọn thay đổi trong phiên được áp dụng ngay.
- Nút chính/phụ và điều hướng chỉ transition chuyển động/bóng; màu chữ và nền đổi ngay theo theme để tránh khoảng tương phản kém giữa hai bảng màu.

## Kiểm tra ngày 2026-10-07

Codex UI triển khai trong thiết kế hiện có, theo UI/UX Pro Max và Impeccable (animate). Không thêm thư viện animation hoặc thay đổi API/database.

- 28 unit tests đạt; review xác nhận chỉ nút chấm được chọn có trạng thái chờ và thoát chờ sau lỗi.
- 13 Playwright local và 6 hosted đạt. Sau chỉnh opacity nút chờ, chạy lại 4 bài interaction: đều đạt.
- E2E mới kiểm tra chuột, bàn phím, focus, giảm chuyển động, phản hồi chờ, chặn gửi trùng, lỗi/thử lại và xóa thông báo cũ khi sửa nội dung.
- Kiểm tra tương phản chữ và tràn ngang cho trạng thái lưu ghi chú ở màn hình 390px, cả sáng/tối. Nút đang xử lý được đo dù disabled; các nút disabled thông thường vẫn được bỏ qua.
- Production build đạt; lint không lỗi và còn 3 cảnh báo có sẵn. Build vẫn cảnh báo bundle lớn.

Ảnh kiểm tra nằm trong `.build/interaction-evidence/` và không đưa vào Git. Phạm vi trình duyệt là Chromium; auth hosted dùng giả lập. Chưa deploy hoặc đóng gói lại bản Windows cho thay đổi này.

Kiểm tra bổ sung sau Journal VI/EN: 31 unit, 58 Python, 15 local E2E và 6 hosted E2E đạt.
Sau sửa transition theme, chạy lại 6 interaction/Journal E2E và 6 hosted E2E: đều đạt.
Lint còn 2 cảnh báo Fast Refresh; build vẫn cảnh báo bundle lớn. Ảnh Journal mobile
sáng/tối đã được kiểm tra ở trạng thái ổn định trong `.build/journal-evidence/`.

Kiểm tra bổ sung sau màn hình bài tập VI/EN: 35 unit, 17 local E2E và 6 hosted E2E đạt;
build đạt, lint không lỗi và còn 2 cảnh báo có sẵn. Ảnh mobile sáng/tối trong
`.build/exercise-evidence/` đã được kiểm tra. Workspace/Git được giả lập trong E2E;
không chạy code của người học hoặc push Git thật. Chưa commit, push hay deploy thay đổi này.
