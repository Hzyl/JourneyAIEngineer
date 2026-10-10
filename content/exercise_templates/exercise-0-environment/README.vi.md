# Kiểm tra Python đang chạy

Bài này giúp bạn xác định chính xác trình thông dịch Python đang thực thi chương trình.
Bạn sẽ viết `inspect_environment()` trong `starter.py` để trả về một từ điển gồm
`major`, `minor`, `executable`, `in_venv`.

## Yêu cầu

Lấy phiên bản và đường dẫn từ trình thông dịch thực tế, không ghi cố định các giá trị này
trong mã. `in_venv` là giá trị bool cho biết chương trình có chạy trong môi trường ảo
hay không, dựa trên việc so sánh `sys.prefix` với `sys.base_prefix`.

## Cách làm

1. Dùng Python 3.11+; không cần thư viện ngoài hoặc Git.
2. Chạy chương trình mẫu và xác nhận phần TODO chưa hoàn thành.
3. Viết hàm rồi chạy kiểm thử cho cả trường hợp có và không có môi trường ảo.
4. Tạo `.venv`, chạy lại bằng Python trong môi trường đó, rồi lưu hai kết quả để so sánh.

## Chạy và tự kiểm tra

Trong ứng dụng trên máy cá nhân, bấm nút chạy kiểm thử. Nếu tải riêng bộ tệp bài tập,
chạy `python -m unittest -v test_exercise.py` trong thư mục chứa bài.
Trang web chỉ cung cấp nội dung; bạn cần chạy kiểm thử trong môi trường của mình.

Lưu báo cáo môi trường làm kết quả bài thực hành. Giải thích điều gì thay đổi giữa hai lần chạy.
Kết quả đạt xác nhận hàm báo đúng môi trường trong các trường hợp đã kiểm tra;
nó không xác nhận bạn đã cài đủ mọi công cụ AI.

Chỉ đọc `reference.py` sau khi đã tự thử và ghi lại phần còn vướng.
