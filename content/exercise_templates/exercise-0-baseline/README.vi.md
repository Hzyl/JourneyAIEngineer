# Tóm tắt điểm và xử lý dữ liệu thiếu

Bài này giúp bạn kiểm tra cách dùng vòng lặp, điều kiện và giá trị trả về trong Python.
Bạn sẽ viết `summarize_scores(scores)` để trả về ba giá trị `count`, `total`, `mean`.

## Yêu cầu

- Chỉ nhận điểm là số hữu hạn trong [0, 100]. Bỏ qua `None` nhưng giữ số 0.
- Nếu không còn điểm hợp lệ sau khi bỏ qua `None`, trả về `count=0`, `total=0`, `mean=None`.
- Các giá trị khác, gồm giá trị bool và chuỗi chứa số, phải gây `ValueError`.
- Không thay đổi danh sách đầu vào.

Ví dụ, `[0, None, 20]` phải trả về `{"count": 2, "total": 20, "mean": 10}`.

## Cách làm

1. Dùng Python 3.11+; bài này không cần thư viện ngoài hoặc Git.
2. Viết hàm theo yêu cầu và tự dự đoán kết quả cho các trường hợp cần kiểm thử.
3. Chạy kiểm thử trước khi xem lời giải tham khảo.
4. Ghi lại lỗi liên quan đến giá trị trả về, vòng lặp, điều kiện hay dữ liệu thiếu để chọn phần cần luyện tiếp.

## Chạy và tự kiểm tra

Trong ứng dụng trên máy cá nhân, dùng chức năng chạy kiểm thử. Nếu tải riêng bộ tệp bài tập,
chạy `python -m unittest -v test_exercise.py` trong thư mục chứa bài.

Trang web cung cấp nội dung; bạn cần chạy mã trong môi trường của mình.
Kết quả đạt chỉ xác nhận chương trình xử lý đúng các trường hợp đã kiểm thử.
