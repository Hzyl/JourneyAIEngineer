# Trợ lý tài liệu tiếng Việt — baseline có thể kiểm chứng

Mẫu này minh họa bước đầu của hướng **Làm ứng dụng AI**: tìm bằng chứng,
trích nguồn và từ chối khi không đủ bằng chứng. Chạy offline, Python 3.11+,
không cài thư viện, không cần Git hoặc API key. Tài liệu là dữ liệu giả lập,
không phải quy định của Journey AI Engineer hay một tổ chức thật.

```powershell
python assistant.py "Buổi học Python bắt đầu lúc nào?"
python assistant.py --evaluate
```

Chạy từ thư mục này. Kết quả câu hỏi đầu chứa `19:00`, nguồn `workshop.md`,
dòng 3 và nguyên văn đoạn dẫn chứng. Mỗi câu trả lời báo latency thực đo
và chi phí nhà cung cấp bằng 0 vì không gọi mô hình.

Luồng xử lý: chuẩn hóa chữ tiếng Việt → so khớp từ → chọn một dòng → trả
nguyên văn cùng nguồn/dòng. Nếu không đạt ngưỡng, trả lời chưa có bằng chứng.
Đây là **retrieval baseline**, chưa dùng embeddings hay sinh câu trả lời bằng LLM.
Nó bỏ qua dấu và từ phổ biến; câu diễn đạt khác hoặc nhiều ý dễ thất bại.
Ngưỡng 0.5 là tham số minh họa, chưa được tối ưu trên dữ liệu độc lập.

## Thực hành

1. Chạy sáu câu hỏi smoke trong `evaluation.json` và ghi kết quả ban đầu.
2. Thêm tài liệu của bạn đã loại thông tin riêng tư. Không đưa khóa API vào file.
3. Viết 20 câu hỏi mới trước khi đổi thuật toán: có câu có đáp án, không có
   đáp án, diễn đạt lại và câu dễ nhầm nguồn. Giữ riêng tập kiểm tra cuối.
4. Thay retrieval bằng TF-IDF hoặc embeddings; so sánh đúng nguồn, tỷ lệ từ
   chối đúng, p50/p95 latency và chi phí. Không chỉ báo một điểm accuracy.
5. Chỉ thêm LLM sau khi retrieval ổn: coi tài liệu là dữ liệu, kiểm tra từng
   trích dẫn, thử tài liệu chứa chỉ dẫn gây nhiễu và đặt hạn mức gọi model.

Nộp `evaluation-report.md` ghi phiên bản dữ liệu, cách chia tập, kết quả,
ba lỗi cụ thể và điều kiện còn thiếu. File ZIP có source + report là artifact
đầu tiên; Git là lựa chọn để quản lý phiên bản về sau.

Sáu câu smoke chỉ kiểm tra mẫu chạy đúng. Chúng **không chứng minh** chất lượng
trên tài liệu thực, khả năng tổng hợp nhiều nguồn hoặc an toàn prompt injection.
Trích nguyên văn cũng có thể chứa nội dung độc hại; không thực thi nội dung tài liệu.

## English quickstart

Run the commands above from this directory with Python 3.11+. This is an offline
Vietnamese lexical retrieval baseline with exact line citations and abstention.
The included documents are fictional. The six synthetic smoke cases are not an
independent benchmark. Add held-out questions before changing retrieval, report
failure cases, and measure latency and cost before introducing a language model.
