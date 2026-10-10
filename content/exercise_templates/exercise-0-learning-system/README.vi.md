# Tính phút học mà không cộng trùng

Bài này giúp bạn hiểu cách xử lý một bản ghi được gửi lại mà không cộng thời gian hai lần.
Bạn sẽ viết `total_study_minutes(sessions)` để tính tổng thời gian học.

## Yêu cầu

- Mỗi buổi học là một từ điển có `id` là chuỗi không rỗng và `minutes` là số nguyên từ 1 đến 1440. Không chấp nhận giá trị bool cho số phút.
- Danh sách buổi học rỗng có tổng bằng 0.
- Nếu một ID xuất hiện nhiều lần với cùng số phút, chỉ tính một lần.
- Nếu một ID xuất hiện với số phút khác nhau, hoặc bản ghi không hợp lệ, phải gây `ValueError`.

Ví dụ, hai buổi học 20 và 25 phút có tổng 45 phút. Gửi lại bản ghi của buổi học 20 phút
không làm tổng tăng lên. Đây là ví dụ nhỏ về tính lũy đẳng khi thử lại một thao tác;
nó không thay thế cơ sở dữ liệu.

## Chuẩn bị và chạy kiểm thử

Bạn cần biết danh sách, từ điển, vòng lặp và câu lệnh điều kiện. Nếu chưa vững,
hãy học phần Python nền tảng trước. Bạn vẫn có thể đọc bài về nhật ký học tập mà chưa
cần hoàn thành bài thực hành này.

Chạy kiểm thử trong ứng dụng trên máy cá nhân. Nếu tải riêng bộ tệp bài tập,
chạy `python -m unittest -v test_exercise.py` trong thư mục chứa bài.
Không cần Git, khóa API hoặc thư viện ngoài. Trang web chỉ cung cấp nội dung.

## Tự kiểm tra

Giải thích vì sao gửi lại cùng một bản ghi không làm tăng tổng, còn cùng ID nhưng khác
số phút phải báo lỗi. Đối chiếu kết quả với các quy tắc trên.
