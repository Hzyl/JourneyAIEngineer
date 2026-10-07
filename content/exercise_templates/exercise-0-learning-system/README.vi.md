# Tính phút học không cộng trùng

Viết `total_study_minutes(sessions)`. Mỗi session là dictionary có `id` là chuỗi
không rỗng và `minutes` là số nguyên từ 1 đến 1440 (bool không được tính là phút).
Tổng của tuần rỗng bằng 0. ID trùng với cùng phút chỉ tính một lần; ID trùng nhưng
khác phút gây `ValueError`. Entry không hợp lệ cũng gây `ValueError`.

Ví dụ hai session 20 và 25 phút có tổng 45. Gửi lại session 20 phút không làm
tổng tăng. Đây là mô hình nhỏ để hiểu retry/idempotency, không thay thế database.

Làm được bài này cần list, dict, vòng lặp và kiểm tra điều kiện. Nếu chưa vững,
học nhánh Python nền tảng trước; không cần hoàn thành lab để đọc lesson về journal.
Chạy test trong app local hoặc `python -m unittest -v test_exercise.py` với template
tải riêng. Không cần Git, API key hoặc package ngoài. Web chỉ cung cấp nội dung.
