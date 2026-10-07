# Tóm tắt điểm

Viết `summarize_scores(scores)` trả `count`, `total`, `mean`.
Điểm hợp lệ là số hữu hạn trong [0, 100]. Bỏ qua `None`; giữ số 0.
Nếu không còn quan sát, trả `count=0`, `total=0`, `mean=None`.
Giá trị khác, gồm bool và chuỗi số, phải gây `ValueError`. Không sửa list đầu vào.

Ví dụ `[0, None, 20]` trả `{"count": 2, "total": 20, "mean": 10}`.
Tự viết test dự đoán trước khi xem đáp án. Ghi riêng lỗi do return, vòng lặp,
điều kiện hoặc dữ liệu thiếu để chọn bài luyện tiếp.

Dùng Python 3.11+, không cần package ngoài/Git. Chạy test trong local app hoặc
`python -m unittest -v test_exercise.py` nếu tải template riêng.
Web không chạy code trên máy bạn. Pass chỉ xác nhận các trường hợp đã kiểm thử.
