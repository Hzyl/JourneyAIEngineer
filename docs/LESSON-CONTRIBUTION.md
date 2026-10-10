# Đóng góp một bài học

Chọn một bài đang gắn nhãn nháp. Đọc [chuẩn nội dung](CURRICULUM-STANDARDS.md),
[cách biên tập tiếng Việt](VIETNAMESE-EDITORIAL.md) và bài đã biên tập gần nhất
trước khi sửa. Giữ nguyên ID bài, mô-đun, giai đoạn, kiến thức cần biết trước và bốn thẻ ôn tập
để không làm mất liên kết với tiến trình học đã lưu.

## Nội dung cần có trong đề xuất

- Bài được sửa và đối tượng học; kiến thức cần biết trước.
- Một việc cụ thể người học làm được sau bài, có đầu ra quan sát được.
- Giải thích Việt/Anh, ví dụ chạy được hoặc được ghi rõ là minh họa khái niệm.
- Cách chuẩn bị, lệnh chạy, kết quả mong đợi và một trường hợp lỗi để người học tự sửa.
- Câu hỏi ôn tập có đáp án riêng theo nội dung; không chép cùng câu trả lời cho nhiều bài.
- Nguồn chính thức, giới hạn của nội dung và giấy phép nếu có trích tài liệu bên ngoài.

## Quy trình

1. Nếu có `content/curated/<lesson_id>.json`, sửa tệp đó. Nếu chưa có, tạo bản nội dung ghi đè
   từ bài cùng ID trong danh mục và biên tập đủ cả hai ngôn ngữ.
2. Chỉ đặt `quality_status: reviewed` và ngày kiểm tra sau khi đã rà nội dung;
   nhãn này thể hiện việc kiểm tra nội bộ dự án, không phải chứng nhận chuyên môn.
3. Với bài tập có trạng thái `verified`, mã khởi đầu phải không đạt còn lời giải tham khảo phải đạt kiểm thử. Thêm một
   đáp án sai có vẻ hợp lý để chứng minh kiểm thử phát hiện được lỗi.
4. Chạy `python scripts/catalog_version.py --write`, `python scripts/validate_content.py`
   và các kiểm thử nội dung phù hợp. Không cập nhật mã nhận diện nội dung chỉ để bỏ qua lỗi của bộ kiểm tra.
5. Xem bài ở cả hai ngôn ngữ trên máy tính và điện thoại; ghi kết quả trong pull request.

## Mẫu mô tả PR

```text
Bài / ID:
Vướng mắc hiện tại:
Người học sẽ làm được:
Prerequisites giữ nguyên / lý do cần đổi:
Nguồn tham khảo:
Ví dụ và test đã chạy:
Ảnh VI/EN và mobile:
Giới hạn còn lại:
```

Không gửi nhật ký, `.env`, kết quả chứa token, cơ sở dữ liệu hoặc thông tin cá nhân.
