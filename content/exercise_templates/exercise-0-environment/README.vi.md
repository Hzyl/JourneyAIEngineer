# Kiểm tra Python đang chạy

Viết `inspect_environment()` trong `starter.py`, trả dictionary gồm `major`,
`minor`, `executable`, `in_venv` từ interpreter thực tế. Không hardcode phiên bản
hoặc đường dẫn. `in_venv` là bool so sánh `sys.prefix` và `sys.base_prefix`.

1. Dùng Python 3.11+, không cần package ngoài hay Git.
2. Chạy starter và xác nhận TODO chưa hoàn thành.
3. Viết hàm rồi chạy test. Test kiểm tra cả có và không có virtual environment.
4. Tạo `.venv`, chạy lại bằng Python trong `.venv`, lưu hai output và giải thích.

Trong app local, bấm Chạy test. Nếu tải template riêng, chạy
`python -m unittest -v test_exercise.py`. Web chỉ cung cấp nội dung; chạy test
trong môi trường của bạn. Output environment report là artifact đầu tiên.

Pass chứng minh hàm báo môi trường đúng trong các ca kiểm tra, không chứng minh
đã cài mọi công cụ AI. Tự đọc lại `reference.py` chỉ sau khi đã thử và ghi điểm vướng.
