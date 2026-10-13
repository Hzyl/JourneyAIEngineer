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

## Đánh giá có nhãn dev/test / Labeled dev/test evaluation

`evaluate_lab.py` mở rộng phần thực hành đánh giá offline, không đổi `assistant.answer()`
hay sáu câu smoke. `evaluation_lab.json` gồm 12 câu giả lập khác nhau: mỗi split có
3 câu có đáp án, 2 câu không đủ bằng chứng và 1 câu mơ hồ cần hỏi lại. Nhãn có lý do
và trích dẫn chính xác; bộ chấm từ chối fixture sai trước khi gọi trợ lý.

Chạy từ thư mục mẫu này bằng Python 3.11+; không cần thư viện hay API:

```powershell
python evaluate_lab.py --split dev --output evaluation-dev.json
# Chỉ mở test sau khi chốt cách làm; không tự động chạy cả hai split.
python evaluate_lab.py --split test --output evaluation-test.json
```

API: `evaluate_lab(split, fixture=..., directory=...)` trả về dict. `--fixture` và
`--documents` cho phép dùng dữ liệu riêng. `--output` là tùy chọn, thư mục đích phải
có sẵn. JSON luôn được in ra màn hình và giữ mọi lỗi, câu trả lời thực tế, nhãn và
lý do trượt. Exit 0 nghĩa là đánh giá chạy hợp lệ, **không phải mọi câu đều đạt**.
Fixture/đường dẫn sai trả exit 2. Thêm `--require-all-pass` để trả exit 1 khi có câu trượt.

Quy tắc chấm có thể kiểm tra trực tiếp:

- Câu có đáp án phải trả đúng nguồn, số dòng **và nguyên văn** bằng chứng đã gán nhãn;
  câu trả lời phải bằng nguyên văn đó. Mọi trích dẫn trả về đều phải khớp corpus.
  Diễn đạt lại đúng ý vẫn có thể trượt: đây là hợp đồng dành cho baseline trích xuất.
- Câu không có đáp án hoặc mơ hồ phải có `abstained=true` và không có trích dẫn.
- `citation_presence` chỉ đo có trích dẫn; `citation_exactness` đo mọi trích dẫn có
  thật và đúng nguyên văn. Mẫu số của hai chỉ số là số kết quả đúng cấu trúc và không
  từ chối. Trích dẫn thật vẫn có thể không trả lời câu hỏi: xem `expected_evidence`,
  `answer_exact` và `failure_reasons` từng câu. Không chỉ số nào là chấm ngữ nghĩa/groundedness.
- Mỗi nhóm báo số đạt, tổng số và tỉ lệ; nhóm rỗng có `rate=null`. p50/p95 dùng
  nearest-rank: sắp tăng dần, lấy phần tử `ceil(p / 100 * n) - 1` (chỉ số từ 0).
  Sáu mẫu thì p95 chính là mẫu lớn nhất; không suy ra độ trễ production từ số này.
- Độ trễ đo bên ngoài lời gọi solver, gồm đọc corpus, không warmup; không dùng số
  latency solver tự khai. JSON ghi Python, OS, thời gian UTC, cấu hình, SHA-256
  fixture/corpus/mã, `model=not_used`, `prompt=not_used`, chi phí nhà cung cấp bằng 0.
  Corpus hash là SHA-256 của JSON manifest đã sắp tên file và chứa hash raw bytes.

Không chỉnh thuật toán để ép fixture đạt 100%. Dùng [mẫu báo cáo](evaluation-report-template.md)
ghi các lỗi quan sát được; nếu có ít hơn ba lỗi thì ghi đúng số thật, không bịa thêm.
Các câu test này được tác giả viết khi đã biết corpus và hiển thị công khai. Chúng
chỉ minh họa việc tách split, **không phải benchmark độc lập**. Kiểm thử phần mềm
trong repo cũng đọc/chạy fixture test. Khi đã xem kết quả hoặc sửa theo test, cần
viết và niêm phong bộ test mới trước thí nghiệm tiếp theo; không gọi bộ cũ là held-out nữa.

### English

Run one explicit split using the commands above. This adds a reproducible labeled
evaluation exercise, not an LLM judge. Answerable cases require the expected exact
source/line/quote, a matching extractive answer, and validity of every citation.
Ambiguous and unanswerable cases require abstention without citations. Presence,
exact citation validity and label matching are separate checks; none proves semantic
support. Each report includes visible failures, category denominators, measured
nearest-rank p50/p95, input/code hashes and run metadata. Empty category rates are null.

Exit 0 means a valid evaluation run; malformed inputs return 2. Opt in to exit 1 on
failed cases with `--require-all-pass`. There is no automatic tuning or combined
dev/test run. These twelve synthetic, known-source, public questions demonstrate a
split protocol; repository tests expose the test split too. Use a fresh sealed set
for independent evaluation after inspection. The offline provider cost is zero;
CPU time, hardware cost, semantic quality and production safety are not evaluated.

## Labs A/B/C trên Google Colab

Nếu máy yếu, mở notebook từ phần thực hành của bài học:

- [Lab A: truy xuất tài liệu](https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-a-evidence-retrieval.ipynb)
- [Lab B: workflow và agent](https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-b-workflow-agent.ipynb)
- [Lab C: phân quyền và hồi quy](https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-c-security-regression.ipynb)

Chọn runtime CPU của Google, không chọn local runtime. Notebook tải mã từ một
commit GitHub cố định cho mỗi lần chạy; ghi lại SHA trong báo cáo để tái lập.
Chỉ Lab A có ô tùy chọn cài thư viện và tải model lên Colab. Các liên kết cần
notebook/module đã được push lên GitHub. Không cần khóa API, GPU hoặc Supabase.

Phần mới dùng [research_lab](research_lab/README.md), không thay đổi mẫu trợ lý
hay bộ 12 ca cũ. Lab A có 12 tài liệu và 30 câu; B/C dùng agent theo kịch bản,
không phải model suy luận thật. Đọc cả lỗi và giới hạn trong báo cáo. Bước xem
test của notebook A được tách riêng; không chỉnh thuật toán theo test đã xem.

Kiểm tra baseline bằng Python thường, từ gốc repo (không cài thêm gói):

```powershell
python samples/vi-document-assistant/run_research_lab.py --lab all --output .build/research-labs.json
```

Không dùng `--embeddings` tại local: backend model thật từ chối chạy ngoài
Colab. Tải báo cáo cuối notebook và tự ghi tiến độ học; chưa có đồng bộ kết quả
notebook vào tài khoản Journey. Notebook hướng dẫn song ngữ Việt–Anh.
