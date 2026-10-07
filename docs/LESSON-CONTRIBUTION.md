# Đóng góp một bài học

Chọn một bài đang gắn nhãn nháp. Đọc `CURRICULUM-STANDARDS.md` và bài curated gần nhất
trước khi chỉnh sửa. Giữ nguyên ID bài, module, phase, prerequisites và bốn review card
để không làm mất liên kết với tiến trình học đã lưu.

## Nội dung cần có trong đề xuất

- Bài được sửa và đối tượng học; kiến thức cần biết trước.
- Một việc cụ thể người học làm được sau bài, có đầu ra quan sát được.
- Giải thích Việt/Anh, ví dụ chạy được hoặc nhãn conceptual rõ ràng.
- Setup, lệnh chạy, output mong đợi và một trường hợp lỗi để tự sửa.
- Câu hỏi ôn tập có đáp án riêng theo nội dung; không chép cùng câu trả lời cho nhiều bài.
- Nguồn chính thức, ghi rõ giới hạn và license nếu có trích nội dung bên ngoài.

## Quy trình

1. Nếu có `content/curated/<lesson_id>.json`, sửa file đó. Nếu chưa có, tạo overlay
   từ lesson cùng ID trong catalog và biên tập đủ cả hai ngôn ngữ.
2. Chỉ đặt `quality_status: reviewed` và ngày review sau khi kiểm tra nội dung;
   nhãn này là review nội bộ dự án, không phải chứng nhận chuyên môn.
3. Với bài tập verified: starter phải thất bại, reference phải pass; thêm một
   đáp án sai có vẻ hợp lý để chứng minh test phát hiện được lỗi.
4. Chạy `python scripts/catalog_version.py --write`, `python scripts/validate_content.py`
   và test nội dung phù hợp. Không dùng fingerprint mới để bỏ qua một lỗi validator.
5. Xem bài trong app ở cả VI/EN, desktop và mobile; ghi kết quả trong PR.

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

Không gửi journal, `.env`, output chứa token, database hoặc thông tin cá nhân.
