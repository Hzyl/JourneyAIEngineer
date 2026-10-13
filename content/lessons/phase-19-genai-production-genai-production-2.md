---
lesson_id: phase-19-genai-production-genai-production-2
phase_id: phase-19-genai-production
module_id: genai-production
title_vi: Thử lại, phương án dự phòng và giới hạn tần suất
title_en: Retries, fallbacks, and rate limits
summary_vi: Chỉ thử lại lỗi tạm thời trong số lần và ngân sách thời gian cho phép.
summary_en: Retry only transient failures within explicit attempt and time budgets.
learning_objectives:
- Chỉ thử lại lỗi tạm thời trong số lần và ngân sách thời gian cho phép.
- Chạy ba chuỗi kết quả; giảm deadline và kiểm tra số lần gọi giảm. Đánh dấu forbidden là lỗi không được retry.
- Forbidden phải dừng sau một lần; không được thực hiện lần gọi mới vượt deadline.
learning_objectives_en:
- Retry only transient failures within explicit attempt and time budgets.
- Run the three outcome sequences; reduce the deadline and check that calls decrease. Treat forbidden as non-retryable.
- Forbidden must stop after one attempt; no new attempt may exceed the deadline.
prerequisites:
- phase-19-genai-production-genai-production-1
- phase-18-genai-observability-genai-observability-1
key_terms:
- retry
- fallback
- rate
- limit
- inference
- observability
- reproducibility
- deployment
- genai-production
concept_notes_vi: 'Retry phù hợp khi lỗi có thể hết, như timeout hoặc giới hạn tần suất; lỗi quyền hay tham số cần
  sửa nguyên nhân, không lặp vô hạn. Backoff tăng khoảng chờ, jitter giảm việc nhiều client gọi lại cùng lúc. Hệ
  thật cần timeout cho mỗi lần gọi và deadline toàn yêu cầu; nếu server có Retry-After thì phải cân nhắc hướng dẫn
  đó trong deadline.


  Ví dụ dùng đồng hồ logic và kết quả giả lập, không sleep hay gọi mạng. Ngân sách tính cả thời gian chạy và chờ;
  kiểm tra trước lần gọi tiếp theo. Fallback chỉ đọc cache đã kiểm tra quyền/phiên bản hoặc báo thiếu dữ liệu, không
  lặng lẽ bịa đáp án. Khi có tác động ghi, dùng idempotency để tránh lặp tác động do retry.


  Tự kiểm tra: tăng max_attempts luôn tăng độ tin cậy không? Không; có thể tăng tải và độ trễ. So tỷ lệ phục hồi,
  lỗi cuối cùng và ngân sách; mô phỏng ở đây kiểm tra chính sách, không đo độ tin cậy mạng thực.'
concept_notes_en: 'Retries fit failures that may resolve, such as timeouts or rate limiting; permission and argument
  failures need correction rather than endless repetition. Backoff increases waiting intervals and jitter spreads
  retries across clients. Real systems need per-call timeouts and a request deadline; account for Retry-After guidance
  within that deadline when provided.


  The example uses a logical clock and simulated outcomes, with no sleeping or networking. The budget includes execution
  and waiting, checked before another attempt. A fallback should read an authorized, version-checked cache or report
  missing evidence rather than silently invent an answer. For writes, idempotency prevents retries from duplicating
  effects.


  Self-check: do more attempts always increase reliability? No; they can amplify load and latency. Compare recovery
  rates, terminal errors and budgets; this simulation tests policy, not actual network reliability.'
why_it_matters_vi: Chỉ thử lại lỗi tạm thời trong số lần và ngân sách thời gian cho phép.
why_it_matters_en: Retry only transient failures within explicit attempt and time budgets.
study_steps_vi:
- Đọc phần giải thích và dự đoán đầu ra của ví dụ trước khi chạy.
- Chạy mã Python trong một ô Google Colab; ví dụ chỉ dùng thư viện chuẩn, không cần cài thêm.
- Chạy ba chuỗi kết quả; giảm deadline và kiểm tra số lần gọi giảm. Đánh dấu forbidden là lỗi không được retry.
- Forbidden phải dừng sau một lần; không được thực hiện lần gọi mới vượt deadline.
- Lưu đầu ra, đối chiếu với kết quả mong đợi và ghi rõ giới hạn của dữ liệu mô phỏng.
study_steps_en:
- Read the explanation and predict the example output before running it.
- Run the Python code in a Google Colab cell; this example uses only the standard library.
- Run the three outcome sequences; reduce the deadline and check that calls decrease. Treat forbidden as non-retryable.
- Forbidden must stop after one attempt; no new attempt may exceed the deadline.
- Save the output, compare it with the expected result and state the limits of the synthetic data.
practice_plan:
  vi:
    task: Chạy ba chuỗi kết quả; giảm deadline và kiểm tra số lần gọi giảm. Đánh dấu forbidden là lỗi không được
      retry.
    deliverables:
    - Bảng attempts, elapsed giả lập và lý do dừng cho từng chuỗi lỗi
    - Đầu ra gốc và kết quả sau khi đổi một điều kiện
    - Giải thích một lỗi và giới hạn của phép đo
    checkpoint: Forbidden phải dừng sau một lần; không được thực hiện lần gọi mới vượt deadline.
    stretch: Mở notebook liên kết, chạy trong Colab và ghi cấu hình thực tế.
  en:
    task: Run the three outcome sequences; reduce the deadline and check that calls decrease. Treat forbidden as
      non-retryable.
    deliverables:
    - A table of attempts, simulated elapsed time and stop reasons for each outcome sequence
    - Original output and output after changing one condition
    - An explanation of one failure and the measurement limits
    checkpoint: Forbidden must stop after one attempt; no new attempt may exceed the deadline.
    stretch: Open the linked notebook, run in Colab and record the actual configuration.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Thử lại, phương án dự phòng và giới hạn tần suất” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain retries, fallbacks, and rate limits to a new teammate?
  - Which assumption behind retries, fallbacks, and rate limits could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: Bound retries using a deterministic clock
  code: "import json\ndef bounded_retry(outcomes, max_attempts=3, deadline_ms=100):\n    elapsed, calls = 0, 0\n\
    \    for outcome in outcomes:\n        if calls >= max_attempts or elapsed + 10 > deadline_ms:\n           \
    \ return {\"status\": \"budget_exhausted\", \"calls\": calls, \"elapsed_ms\": elapsed}\n        elapsed += 10\n\
    \        calls += 1\n        if outcome == \"ok\":\n            return {\"status\": \"ok\", \"calls\": calls,\
    \ \"elapsed_ms\": elapsed}\n        if outcome not in {\"timeout\", \"rate_limited\"}:\n            return {\"\
    status\": outcome, \"calls\": calls, \"elapsed_ms\": elapsed}\n        wait = 10 * 2 ** (calls - 1)\n      \
    \  if calls == max_attempts or elapsed + wait + 10 > deadline_ms:\n            return {\"status\": \"budget_exhausted\"\
    , \"calls\": calls, \"elapsed_ms\": elapsed}\n        elapsed += wait\n    return {\"status\": \"no_more_fixture_outcomes\"\
    , \"calls\": calls, \"elapsed_ms\": elapsed}\nprint(json.dumps([bounded_retry([\"timeout\", \"ok\"]), bounded_retry([\"\
    forbidden\", \"ok\"]),\n                  bounded_retry([\"timeout\"] * 5, deadline_ms=25)]))\n"
  status: runnable
  purpose_vi: Chỉ thử lại lỗi tạm thời trong số lần và ngân sách thời gian cho phép.
  purpose_en: Retry only transient failures within explicit attempt and time budgets.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '[{"status": "ok", "calls": 2, "elapsed_ms": 30}, {"status": "forbidden", "calls": 1, "elapsed_ms":
    10}, {"status": "budget_exhausted", "calls": 1, "elapsed_ms": 10}]'
  edge_case_vi: Forbidden phải dừng sau một lần; không được thực hiện lần gọi mới vượt deadline.
  edge_case_en: Forbidden must stop after one attempt; no new attempt may exceed the deadline.
  explanation_vi: elapsed_ms là đồng hồ logic; cần đo đồng hồ monotonic và timeout thật khi triển khai dịch vụ.
  explanation_en: elapsed_ms is a logical clock; real services require monotonic timing and enforced timeouts.
resources:
- language: en
  title: Redis Documentation
  url: https://redis.io/docs/latest/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Celery Documentation
  url: https://docs.celeryq.dev/en/stable/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Kubernetes Basics
  url: https://kubernetes.io/docs/tutorials/kubernetes-basics/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Giải thích và hướng dẫn thực hành trong bài
  url: ''
  language: vi
  kind: in_app
  purpose_vi: Đọc giải thích, thực hiện nhiệm vụ và đối chiếu tiêu chí hoàn thành.
  purpose_en: The explanation, code example, checklist, and completion criteria inside the app.
  read_vi: Đọc giải thích → xem ví dụ → thực hành → tự kiểm tra.
  read_en: Follow Study plan → Concept notes → Code example → Practice plan.
  required: true
- title: Google Colab — Lab B
  language: vi/en
  url: https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-b-workflow-agent.ipynb
  kind: external
  required: false
  purpose_vi: Chạy trong Colab để mở rộng ví dụ bằng dữ liệu và báo cáo của lab.
  purpose_en: Run in Colab to extend this example with the lab dataset and reports.
  read_vi: Chọn môi trường CPU do Google lưu trữ, chạy từng ô và đối chiếu báo cáo. Lab dùng công cụ giả lập chỉ
    đọc, không tải model; tải báo cáo để lưu kết quả.
  read_en: Run in Colab on a Google-hosted CPU runtime and inspect each report. This lab uses read-only fake tools
    and downloads no model; download the report to retain results.
exercise_ids:
- exercise-19-genai-production
review_item_ids:
- phase-19-genai-production-genai-production-2-recall
- phase-19-genai-production-genai-production-2-application
- phase-19-genai-production-genai-production-2-debug
- phase-19-genai-production-genai-production-2-interview
estimated_minutes: 60
completion_checklist:
- Chạy ba chuỗi kết quả; giảm deadline và kiểm tra số lần gọi giảm. Đánh dấu forbidden là lỗi không được retry.
- Forbidden phải dừng sau một lần; không được thực hiện lần gọi mới vượt deadline.
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Bảng attempts, elapsed giả lập và lý do dừng cho từng chuỗi lỗi
- Forbidden phải dừng sau một lần; không được thực hiện lần gọi mới vượt deadline.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
common_mistakes:
- Dùng bộ nhớ đệm chung mà không xét quyền và ngữ cảnh của người dùng.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-19-genai-production-genai-production-3
- phase-19-genai-production-genai-production-4
review_question_vi: Nội dung cốt lõi của “Thử lại, phương án dự phòng và giới hạn tần suất” là gì?
review_question_en: Define retries, fallbacks, and rate limits in your own words. What are the input, transformation
  and output?
review_answer_vi: Khi nhà cung cấp chậm hoặc lỗi, thử lại cần giới hạn và khoảng chờ phù hợp. Phương án dự phòng
  phải giữ yêu cầu tối thiểu về chất lượng, cấu trúc và quyền dữ liệu.
review_answer_en: A strong answer names the input, transformation, output and the context where retries, fallbacks,
  and rate limits is used. Relate it specifically to retries, fallbacks, and rate limits in lesson phase-19-genai-production-genai-production-2.
review_cards:
- id: phase-19-genai-production-genai-production-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Thử lại, phương án dự phòng và giới hạn tần suất” là gì?
  question_en: Define retries, fallbacks, and rate limits in your own words. What are the input, transformation
    and output?
  answer_vi: Khi nhà cung cấp chậm hoặc lỗi, thử lại cần giới hạn và khoảng chờ phù hợp. Phương án dự phòng phải
    giữ yêu cầu tối thiểu về chất lượng, cấu trúc và quyền dữ liệu.
  answer_en: A strong answer names the input, transformation, output and the context where retries, fallbacks, and
    rate limits is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-19-genai-production-genai-production-2-application
  type: application
  question_vi: Mô phỏng nhà cung cấp lỗi và xác nhận số lần thử cùng điều kiện chuyển dự phòng.
  question_en: Write a small code example or design that applies retries, fallbacks, and rate limits to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Mô phỏng nhà cung cấp lỗi và xác nhận số lần thử cùng điều kiện chuyển dự phòng”, cần
    lưu: cấu hình dịch vụ và kết quả thử tình huống chậm, lỗi hoặc quá tải. Kiểm tra giới hạn thử lại, cách chuyển
    dự phòng và ảnh hưởng tới người dùng.'
  answer_en: The retries, fallbacks, and rate limits example should have an explicit input, expected output and
    a way to run or verify it (phase-19-genai-production-genai-production-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-19-genai-production-genai-production-2-debug
  type: debug
  question_vi: Khi làm bài “Thử lại, phương án dự phòng và giới hạn tần suất”, bạn cần tránh lỗi nào và kiểm tra
    lại ra sao?
  question_en: If retries, fallbacks, and rate limits produces a wrong result or a metric drops, what would you
    debug first?
  answer_vi: 'Trong bài “Thử lại, phương án dự phòng và giới hạn tần suất”, lỗi cần tránh là: dùng bộ nhớ đệm chung
    mà không xét quyền và ngữ cảnh của người dùng. Kiểm tra giới hạn thử lại, cách chuyển dự phòng và ảnh hưởng
    tới người dùng. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For retries, fallbacks, and rate limits, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-19-genai-production-genai-production-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-19-genai-production-genai-production-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Thử lại, phương án dự phòng và giới hạn tần suất” để giải thích cách
    làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of retries, fallbacks, and rate
    limits?
  answer_vi: Bắt đầu từ nhiệm vụ “Mô phỏng nhà cung cấp lỗi và xác nhận số lần thử cùng điều kiện chuyển dự phòng”.
    Trình bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại
    định nghĩa.
  answer_en: The answer about retries, fallbacks, and rate limits should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-19-genai-production-genai-production-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Thử lại, phương án dự phòng và giới hạn tần suất / Retries, fallbacks, and rate limits

Retry phù hợp khi lỗi có thể hết, như timeout hoặc giới hạn tần suất; lỗi quyền hay tham số cần sửa nguyên nhân, không lặp vô hạn. Backoff tăng khoảng chờ, jitter giảm việc nhiều client gọi lại cùng lúc. Hệ thật cần timeout cho mỗi lần gọi và deadline toàn yêu cầu; nếu server có Retry-After thì phải cân nhắc hướng dẫn đó trong deadline.

Ví dụ dùng đồng hồ logic và kết quả giả lập, không sleep hay gọi mạng. Ngân sách tính cả thời gian chạy và chờ; kiểm tra trước lần gọi tiếp theo. Fallback chỉ đọc cache đã kiểm tra quyền/phiên bản hoặc báo thiếu dữ liệu, không lặng lẽ bịa đáp án. Khi có tác động ghi, dùng idempotency để tránh lặp tác động do retry.

Tự kiểm tra: tăng max_attempts luôn tăng độ tin cậy không? Không; có thể tăng tải và độ trễ. So tỷ lệ phục hồi, lỗi cuối cùng và ngân sách; mô phỏng ở đây kiểm tra chính sách, không đo độ tin cậy mạng thực.

## English

Retries fit failures that may resolve, such as timeouts or rate limiting; permission and argument failures need correction rather than endless repetition. Backoff increases waiting intervals and jitter spreads retries across clients. Real systems need per-call timeouts and a request deadline; account for Retry-After guidance within that deadline when provided.

The example uses a logical clock and simulated outcomes, with no sleeping or networking. The budget includes execution and waiting, checked before another attempt. A fallback should read an authorized, version-checked cache or report missing evidence rather than silently invent an answer. For writes, idempotency prevents retries from duplicating effects.

Self-check: do more attempts always increase reliability? No; they can amplify load and latency. Compare recovery rates, terminal errors and budgets; this simulation tests policy, not actual network reliability.

## Thực hành / Practice

Chạy ba chuỗi kết quả; giảm deadline và kiểm tra số lần gọi giảm. Đánh dấu forbidden là lỗi không được retry.

Run the three outcome sequences; reduce the deadline and check that calls decrease. Treat forbidden as non-retryable.
