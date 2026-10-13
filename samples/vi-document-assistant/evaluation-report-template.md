# Báo cáo đánh giá / Evaluation report

Điền từ JSON đo thật; ô trống không phải kết quả. / Fill from measured JSON;
blank fields are not results. This report does not complete the broader lab sequence.

## Lần chạy / Run

- Ngày giờ UTC / UTC timestamp:
- Lệnh chính xác / Exact command:
- Split được chọn / Selected split:
- Python, OS, phương pháp / Python, OS, method:
- Cấu hình retrieval / Retrieval configuration:
- Model, prompt: not_used (baseline offline)
- SHA-256 corpus, fixture, assistant, evaluator:
- Đã xem test trước khi chốt? / Was test inspected before freezing the method?
- Người viết nhãn, ngày, đã biết corpus chưa? / Label author, date, prior corpus knowledge:

## Kết quả / Results

| Nhóm / Category | Đạt / Passed | Tổng / Total | Tỉ lệ / Rate |
| --- | --- | --- | --- |
| Answerable | | | |
| Unanswerable | | | |
| Ambiguous | | | |
| Overall | | | |

Nhóm rỗng ghi null, không ghi 100%. / Empty category rates must be null, never 100%.

- Citation presence: số đạt / mẫu số / tỉ lệ:
- Citation exactness: số đạt / mẫu số / tỉ lệ:
- p50 / p95 / số mẫu latency (ms):
- Quy ước / Convention: nearest-rank ceil(p / 100 * n) - 1, measured solver wall time.
- Provider cost (USD): 0 for this offline baseline; hardware/time excluded.
- File JSON đính kèm / Attached JSON report:

## Lỗi quan sát được / Observed failures

Ghi tối đa ba ví dụ thực; nếu ít hơn, ghi đúng số có thật. Không xóa lỗi khỏi tổng.
Record up to three actual failures; state the actual count if fewer. Keep failures in totals.

| Case ID | Mong đợi / Expected | Thực tế / Actual | Lý do trượt / Failure reason |
| --- | --- | --- | --- |
| | | | |

## Giới hạn và bước tiếp theo / Limits and next step

- Trích dẫn đúng nguyên văn không chứng minh nó trả lời câu hỏi. Exact citation
  validity is separate from evidence-label agreement and semantic support.
- Chấm câu trả lời nguyên văn loại cả diễn đạt lại hợp lý; không phải chấm LLM.
  Exact extract matching rejects otherwise valid paraphrases; this is not LLM grading.
- Dữ liệu giả lập, ít mẫu, đã biết nguồn; không chứng minh khả năng tổng quát.
  Tiny synthetic known-source data does not establish generalization.
- Nếu đã xem test, ghi nhận leakage và chuẩn bị bộ test mới được giữ kín.
  If test was inspected, disclose leakage and prepare a fresh sealed evaluation set.
- Đề xuất thử trên dev / Next dev-only experiment:
- Điều kiện đánh giá độc lập tiếp theo / Conditions for the next independent evaluation:
