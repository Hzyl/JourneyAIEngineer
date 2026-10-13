# Ghi chú tích hợp nghiên cứu — 2026-10-13

## Phạm vi đã tích hợp

- Chương trình hiện có phần mở rộng ghi chú khái niệm song ngữ cho cả 208 bài học chuẩn, cùng 10 bản bài học tuyển chọn song ngữ. Đây là mức độ bao phủ nội dung, không phải kết quả duyệt biên tập độc lập cho từng bài.
- Hai ví dụ ưu tiên đã được nâng cấp ở phase 12 (nhập tài liệu RAG và bằng chứng) và phase 15 (lập kế hoạch cho agent). Các Lab A–C trong handoff vẫn là đề xuất; chưa triển khai đầy đủ bộ đánh giá, fixture bảo mật và tiêu chí nghiệm thu đầu-cuối.
- Danh mục tài nguyên giữ 50 mục cũ và bổ sung 9 nguồn đã xác minh (tổng cộng 59). Liên kết trong bài là tùy chọn, dẫn người học tới phần phù hợp và không hàm ý đã hoàn thành khóa học.
- Nhãn xuất bản hiện giữ nguyên: 10 reviewed / 198 draft. Đợt nghiên cứu này không nâng nhãn và không duyệt toàn bộ ví dụ mã.

## Nguồn gắn với bài học

- Phase 10, bộ mã hóa/giải mã Transformer: [Stanford CS336](https://cs336.stanford.edu/), khóa học nâng cao về toàn bộ vòng đời mô hình ngôn ngữ. Học kỳ Spring 2026 đã qua; khóa học có yêu cầu nền tảng đáng kể.
- Phase 12, retriever/ngữ cảnh/LLM: [bài báo RAG của Lewis và cộng sự](https://arxiv.org/abs/2005.11401), mô hình nền tảng kết hợp bộ nhớ tham số với chỉ mục dày đặc có thể truy xuất; không mô tả mọi hệ thống RAG hiện đại.
- Phase 13, xếp hạng lại/top-k: [Sentence Transformers retrieve/rerank](https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html), truy xuất ứng viên và tùy chọn xếp hạng lại bằng CrossEncoder. Không mặc định điểm số là xác suất đã hiệu chuẩn.
- Phase 15, lập kế hoạch/phân rã nhiệm vụ: [Berkeley LLM Agents Fall 2024](https://rdi.berkeley.edu/llm-agents/f24), đề cương lưu trữ để chọn chủ đề tự học.
- Phase 15, bộ nhớ/lịch sử: [Anthropic về thiết kế ngữ cảnh](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), tuyển chọn ngữ cảnh hữu hạn, truy xuất đúng lúc và quản lý tác vụ dài hạn.
- Phase 15, vòng lặp agent: [LangGraph Thinking in LangGraph](https://docs.langchain.com/oss/javascript/langgraph/thinking-in-langgraph), hướng dẫn về đồ thị, trạng thái và xử lý lỗi; ví dụ dùng JavaScript/TypeScript.
- Phase 15, giám sát bởi con người/guardrails: [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/unit0/introduction), kiến thức nền, công cụ, Agentic RAG và phần đánh giá/quan sát tùy chọn.
- Phase 16, bảo mật MCP: [OWASP Top 10 for LLM Applications 2025](https://genai.owasp.org/llm-top-10/), các nhóm rủi ro để chuyển thành kiểm thử phù hợp với từng ứng dụng.
- Phase 17, đánh giá/tập kiểm thử: [UK AISI Inspect Tasks](https://inspect.aisi.org.uk/tasks.html), cấu trúc tác vụ gồm dataset, solver và scorer.
- Phase 11, vòng đời chat completion/tin nhắn: [FSDL LLM Bootcamp (tháng 4/2023)](https://fullstackdeeplearning.com/llm-bootcamp/), tài liệu lịch sử tùy chọn về vòng đời ứng dụng. Cần kiểm tra riêng API và công cụ hiện hành.

## Giới hạn và việc còn lại

Các trang nguồn và những mục được chọn đã được đọc để xác định phạm vi và cách gắn vào bài. Đợt này không hoàn thành khóa học, không xem hết recordings, không chạy mã nguồn, không so sánh model trả phí với model local, và không xác minh độc lập mọi liên kết ngoài trong mọi môi trường. Stanford CS336 và Berkeley Fall 2024 là các khóa học đã qua; bootcamp FSDL cũng là tài liệu lịch sử. Bài báo RAG là tài liệu nền tảng, không phải hướng dẫn triển khai hiện đại.

Cần có nhu cầu sản phẩm hoặc học tập cụ thể để xác định nhiệm vụ, ngân sách, phần cứng và tiêu chí đo trước khi mở rộng các tập đánh giá có chú giải hoặc so sánh model trả phí/local. Không khẳng định Labs A–C đã được triển khai đầy đủ, mọi đoạn mã đã được duyệt, hay nghiên cứu này chứng minh an toàn hệ thống hoặc chất lượng model.
