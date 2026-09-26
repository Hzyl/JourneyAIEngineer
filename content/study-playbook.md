# Study playbook — Journey AI Engineer

Tài liệu này là cách dùng curriculum để biến thời gian học thành năng lực có thể chứng minh khi xin thực tập hoặc junior role.

## Nhịp một tuần

Với track chuẩn, dùng khoảng 12–15 giờ:

- 2 giờ đọc concept notes, xem tài liệu chính thức và viết lại bằng lời của mình.
- 5–6 giờ code trong workspace, tự tạo test và xử lý ít nhất một edge case.
- 2 giờ làm review card theo spaced repetition, không mở gợi ý trước khi tự trả lời.
- 2 giờ viết journal, xem Git diff và ghi lại một quyết định kỹ thuật.
- 1–3 giờ cho project portfolio hoặc luyện phỏng vấn.

Nếu chỉ có 6–8 giờ, giữ thứ tự: code → review → journal → đọc sâu. Không đánh dấu hoàn thành khi chưa có một output chạy được.

## Vòng lặp của một lesson

1. Đọc mục tiêu và prerequisites.
2. Tự dự đoán kết quả trước khi chạy code.
3. Chạy ví dụ nhỏ trong workspace.
4. Thay đổi một giả định hoặc input để quan sát edge case.
5. Viết test hoặc kiểm tra thủ công có thể lặp lại.
6. Trả lời review card bằng lời của mình.
7. Ghi một note: đã hiểu gì, sai ở đâu, lần sau kiểm tra thế nào.

## Chuẩn evidence cho project

Mỗi project cần có:

- Problem statement và người dùng mục tiêu.
- Data dictionary hoặc data contract.
- Baseline trước khi tối ưu.
- Metric gắn với chi phí lỗi.
- Reproducible command để chạy từ đầu.
- Error analysis có ví dụ cụ thể.
- README có architecture, trade-off và giới hạn.
- Test cho phần quan trọng.
- Một demo hoặc ảnh chụp output.

Một model có điểm số cao nhưng không giải thích được dữ liệu, failure mode và cách rollback chưa phải một project AI Engineer hoàn chỉnh.

## Chuẩn sẵn sàng phỏng vấn

Mỗi tuần chọn một câu hỏi và trả lời trong journal bằng cấu trúc:

1. Định nghĩa ngắn.
2. Trực giác hoặc hình minh họa.
3. Ví dụ code hoặc dữ liệu.
4. Trade-off và failure mode.
5. Cách test trong production.

Các nhóm câu hỏi cần luyện xuyên suốt: Python/SQL, data leakage, metric selection, gradient/training loop, serving/latency, monitoring/drift, retrieval/RAG, prompt injection và system design.

## Cách dùng trợ lý AI

Luôn làm theo thứ tự: tự thử → ghi lỗi và giả thuyết → export context → yêu cầu gợi ý từng bước → tự sửa → chạy test → ghi lại bài học. Không dán secret hoặc giao toàn bộ bài cho trợ lý. Mục tiêu là hiểu được vì sao bản sửa đúng và biết tự kiểm tra lần sau.
