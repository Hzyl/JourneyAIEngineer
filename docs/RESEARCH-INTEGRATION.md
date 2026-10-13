# Ghi chú tích hợp nghiên cứu — 2026-10-13

## Phạm vi đã tích hợp

- Chương trình hiện có phần mở rộng ghi chú khái niệm song ngữ cho cả 208 bài học chuẩn, cùng 10 bản bài học tuyển chọn song ngữ. Đây là mức độ bao phủ nội dung, không phải kết quả duyệt biên tập độc lập cho từng bài.
- Hai ví dụ ưu tiên đã được nâng cấp ở phase 12 (nhập tài liệu RAG và bằng chứng) và phase 15 (lập kế hoạch cho agent). Đợt tiếp theo bổ sung baseline chat tại phase 11 và bài chấm bằng chứng/từ chối tại phase 17, với ví dụ Python chạy độc lập, song ngữ và chạy ngoại tuyến.
- Bộ đánh giá 12 ca ban đầu được giữ nguyên. Phần mở rộng nằm riêng trong `samples/vi-document-assistant/research_lab`: Lab A có 12 tài liệu giả và 30 câu hỏi; Lab B so sánh workflow với agent theo kịch bản; Lab C kiểm tra phân quyền và hồi quy trên cùng fixture. Đây là các lab học tập, không phải backend mới của Journey.
- Bổ sung 16 bài ưu tiên trong handoff: kiến trúc/model card, embedding, hybrid/reranking, xác thực tham số và quyền, context/state/checkpoint, MCP, đánh giá retrieval/agent, trace, retry, đánh giá fine-tuning, serving và thiết kế hệ thống. Ví dụ là chương trình Python nhỏ theo đúng chủ đề; mô phỏng được ghi rõ. Không thay bằng một roadmap trùng lặp.
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

Các trang nguồn và những mục được chọn đã được đọc để xác định phạm vi và cách gắn vào bài. Đợt này không hoàn thành khóa học, không xem hết recordings, không chạy mã nguồn của các khóa học/framework bên ngoài, không so sánh model trả phí với model local, và không xác minh độc lập mọi liên kết ngoài trong mọi môi trường. Stanford CS336 và Berkeley Fall 2024 là các khóa học đã qua; bootcamp FSDL cũng là tài liệu lịch sử. Bài báo RAG là tài liệu nền tảng, không phải hướng dẫn triển khai hiện đại.

Người dùng chọn notebook Google Colab để máy cá nhân không phải cài thư viện hay tải model. Phần model thật của Lab A chỉ được phép khởi tạo trong runtime Colab. Labs B/C dùng stdlib và quyết định lập trình sẵn; không gọi LLM. Các tùy chọn cần chi phí, huấn luyện model, GPU serving hoặc tích hợp production chưa được thực hiện và không bị coi là điều kiện học bắt buộc.

## Thực hành đánh giá được bổ sung

- Phase 11 giữ chủ đề vòng đời tin nhắn, thêm ca kiểm tra định trước và phản hồi giả lập. Bản gốc đạt 2/3: cắt lịch sử làm mất ngày đã sửa và phải được ghi là lỗi trước khi tối ưu.
- Phase 17 thay ví dụ khung bằng bộ chấm sáu đầu ra cố định. Bản gốc đạt 2/6, tỷ lệ từ chối đúng là 1/2; báo cáo tách sai nguồn, đúng tệp sai dòng, đáp án không được câu trích hỗ trợ và câu ngoài dữ liệu. So khớp chính xác và kiểm tra vị trí trích dẫn không thay thế đánh giá ngữ nghĩa.
- Người học web đọc toàn bộ giải thích và mã trong bài, rồi chạy bằng Python riêng. Không bắt buộc VS Code hoặc Git. Tạo thư mục .build tại gốc repo nếu chưa có trước khi chạy. Lệnh mẫu từ gốc repo: `python samples/vi-document-assistant/evaluate_lab.py --split dev --output .build/evaluation-dev.json`; chỉ chạy `--split test` sau khi chốt cấu hình/tiêu chí, với tệp đầu ra riêng.
- Báo cáo mẫu lưu kết quả từng ca/nhóm, mã băm corpus/fixture, p50/p95 đo bằng nearest-rank và `provider_cost=0`. Thời gian đo chỉ phản ánh baseline ngoại tuyến và điều kiện máy chạy; không phải độ trễ, số token hoặc giá dịch vụ LLM. Không tự dùng điểm để tối ưu cấu hình.
- Đã thực thi riêng hai ví dụ nhúng trong thư mục tạm và đối chiếu đầu ra nêu trên; đã đối chiếu ID, prerequisites, liên kết bài tập và thẻ ôn với bản nguồn trước sửa.

## Ba notebook chạy trên Colab

- [Lab A — truy xuất có bằng chứng](../notebooks/lab-a-evidence-retrieval.ipynb): 20 câu có đáp án, 5 câu thiếu bằng chứng, 5 câu mơ hồ. So sánh từ khóa và embedding trên cùng corpus, split và top-k; không sinh câu trả lời bằng LLM. Chạy dev trước; ô test yêu cầu người học bật riêng sau khi chốt cách làm.
- [Lab B — workflow và agent](../notebooks/lab-b-workflow-agent.ipynb): cùng nhiệm vụ với công cụ chỉ đọc, giới hạn lời gọi/thời gian, trace, lỗi công cụ và khôi phục checkpoint. Quyết định của agent là kịch bản, approval là giả lập.
- [Lab C — phân quyền và regression](../notebooks/lab-c-security-regression.ipynb): hai danh tính giả, bản cố ý bỏ qua ACL để đối chiếu với bản kiểm tra quyền trước truy xuất/đọc; fixture injection an toàn, trace không chứa nội dung nhạy cảm và báo cáo trước/sau.

Liên kết Colab xuất hiện ngay trong phần thực hành của các bài liên quan, cùng danh mục tài liệu. Các notebook tải module nhỏ từ một commit GitHub duy nhất cho mỗi lần chạy và lưu commit đó trong báo cáo; không mount Google Drive hay đọc dữ liệu Supabase. Đường dẫn GitHub/Colab chỉ dùng được khi mã mới đã được duyệt push. Báo cáo không tự cập nhật tiến độ học.

Model tham chiếu: [multilingual MiniLM](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2), revision `e8f8c211226b894fcb81acc59f3b34ba3efd5f42`, Apache-2.0, mean pooling, 384 chiều, tối đa 128 token. Đây là thông tin model card, không phải benchmark tiếng Việt. Notebook ghim Sentence Transformers 5.1.2 và Transformers 4.57.1; báo cáo ghi phiên bản thư viện thực tế và thiết bị. Phải đánh giá riêng nếu đổi model hoặc môi trường.

[Colab FAQ](https://research.google.com/colaboratory/faq.html) giải thích mã chạy trên máy ảo của tài khoản Google, hạn mức miễn phí có thể thay đổi và runtime có thể bị xóa khi không hoạt động. Dùng CPU hosted runtime; không dùng local runtime khi muốn giữ máy nhẹ.

## Kiểm chứng và giới hạn kết luận

- Notebook được kiểm tra bằng cách thực thi setup, baseline và export với HTTP fixture lấy từ module thật trong working tree. Đây là kiểm thử local; không phải bằng chứng đã chạy model trên máy chủ Google.
- Kiểm tra chặn runtime local diễn ra trước import thư viện ML và tải model. Không cài thêm dependency hoặc tải model xuống máy người dùng trong đợt này.
- Chưa có số đo embedding thật từ Colab; chưa chạy sinh câu trả lời bằng LLM, fine-tuning hoặc GPU serving. Không suy ra chất lượng model từ kết quả mock.
- Corpus/test công khai, do tác giả tự tạo, chỉ giúp học quy trình. Khi đã đọc test hoặc sửa theo lỗi test, cần bộ mới cho đánh giá độc lập.
- Hybrid/RRF, reranking và trade-off triển khai có ví dụ theo chủ đề trong bài; không khẳng định đã benchmark một dịch vụ retrieval production. Fixture injection chỉ kiểm tra ranh giới của controller giả lập, không chứng minh khả năng chống mọi tấn công.
- Giữ nguyên ID, prerequisites, liên kết bài tập, review cards và nhãn chất lượng. Không coi đợt này là duyệt độc lập toàn bộ 208 bài.

### Kết quả kiểm tra bản tích hợp ngày 13/10/2026

- `npm test`: 251 kiểm thử Python và 247 kiểm thử frontend đạt; fingerprint,
  validator nội dung, lint, TypeScript và Vite production build đều qua.
- 16 ví dụ của nhóm bài ưu tiên đã chạy và khớp đầu ra ghi trong bài;
  các ca biên kiểm tra riêng quyền truy cập, chỉ số, trạng thái và ngân sách.
- Đối chiếu với Git HEAD xác nhận giữ nguyên định danh, prerequisites, liên kết
  bài tập và thẻ ôn của catalog 208 bài cùng 16 tệp bài học được nâng cấp.
- 24 kiểm tra Playwright đạt trên bản production local: ba bài gắn Labs A/B/C,
  tiếng Việt/Anh, rộng 320/1440 px, giao diện sáng/tối. Đã kiểm tra tràn ngang,
  cỡ chữ, tương phản, kích thước nút, focus bàn phím và đích liên kết.
  Đã xem thêm ảnh chụp VI 320 px sáng/tối và EN desktop tối.
- Tám kiểm thử notebook đạt, gồm chạy lại phiên không dùng nhầm model cũ,
  test chỉ chạy khi bật riêng và chặn runtime local trước khi tải thư viện.
  Phép thử đột biến trong bộ nhớ xác nhận bỏ guard runtime sẽ làm test thất bại.
- Cảnh báo hiện có: Fast Refresh trong AuthProvider, bundle lớn và 32 mục
  cần review từ audit bảo mật tĩnh. Audit không phải kiểm thử xâm nhập và
  không kết luận các mục đó là lỗ hổng đã xác nhận.
- HTTP/Supabase trong kiểm thử giao diện được giả lập; chưa nghiệm thu dịch vụ
  thật, cài model trên Colab hoặc triển khai web. Các kết quả trên được ghi nhận
  trước khi commit/push và không xác nhận trạng thái triển khai sau đó.
