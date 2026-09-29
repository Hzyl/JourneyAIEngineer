---
lesson_id: phase-07-capstone-career-ship-2
phase_id: phase-07-capstone-career
module_id: ship
title_vi: Evaluation report
title_en: Evaluation reports
summary_vi: Học Evaluation report qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Evaluation reports through an input → transformation → output model, then verify it with an edge-case exercise.
learning_objectives:
- Giải thích evaluation report bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng evaluation report.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain evaluation reports with a concrete example.
- Write or adapt a small code example applying evaluation reports.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-07-capstone-career-ship-1
- phase-06-llm-rag-nlp-foundations-1
key_terms:
- evaluation
- report
- Python
- testing
- debugging
- maintainability
- ship
concept_notes_vi: Evaluation report biến một demo AI thành hệ thống có thể tin cậy. Định nghĩa metric và dataset kiểm thử
  trước, ghi prompt/model/version/token/latency, rồi phân tích failure theo retrieval, generation, data hoặc infrastructure
  thay vì chỉ nhìn một điểm số.
concept_notes_en: Evaluation report turns an AI demo into a system that can be trusted. Define metrics and an evaluation set
  first, record prompt/model/version/tokens/latency, and attribute failures to retrieval, generation, data, or infrastructure
  instead of relying on one score.
why_it_matters_vi: Biến capstone thành sản phẩm có baseline, evaluation, demo, README và giới hạn được nói rõ.
why_it_matters_en: Turn the capstone into a product with a baseline, evaluation, demo, README, and explicit limitations.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Biến capstone thành sản phẩm có baseline, evaluation, demo, README và giới hạn được
  nói rõ.'
- Mở GitHub Docs, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Ship một vertical slice chạy local, ghi test/evaluation, quay demo ngắn và mở issue cho phần chưa làm.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Turn the capstone into a product with a baseline, evaluation, demo, README, and explicit
  limitations.'
- Open GitHub Docs, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Ship one local vertical slice, record tests/evaluation, make a short demo, and open issues
  for unfinished work.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Ship một vertical slice chạy local, ghi test/evaluation, quay demo ngắn và mở issue cho phần chưa làm.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Người khác clone repo và chạy demo theo README mà không cần bạn hướng dẫn trực tiếp.
    stretch: Viết thêm một failure test cho evaluation report và giải thích kết quả.
  en:
    task: Ship one local vertical slice, record tests/evaluation, make a short demo, and open issues for unfinished work.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: Another person can clone the repo and run the demo from the README without your help.
    stretch: Add a failure test for evaluation reports and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích evaluation report cho một đồng đội mới như thế nào?
  - Một assumption nào của evaluation report có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain evaluation reports to a new teammate?
  - Which assumption behind evaluation reports could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Evaluation reports: inspect one complete path'
  code: "# Topic: Evaluation reports (phase-07-capstone-career-ship-2)\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\n\
    class Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của evaluation report.
  purpose_en: Illustrate the input-to-output path for evaluation reports.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: GitHub Docs
  url: https://docs.github.com/en
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Google Engineering Practices
  url: https://google.github.io/eng-practices/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: The Twelve-Factor App
  url: https://12factor.net/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Giải thích tiếng Việt và checklist của lesson
  url: ''
  language: vi
  kind: in_app
  purpose_vi: Phần giải thích, code example, checklist và tiêu chí hoàn thành ngay trong app.
  purpose_en: The explanation, code example, checklist, and completion criteria inside the app.
  read_vi: Đọc theo thứ tự Study plan → Concept notes → Code example → Practice plan.
  read_en: Follow Study plan → Concept notes → Code example → Practice plan.
  required: true
exercise_ids:
- exercise-7-ship
review_item_ids:
- phase-07-capstone-career-ship-2-recall
- phase-07-capstone-career-ship-2-application
- phase-07-capstone-career-ship-2-debug
- phase-07-capstone-career-ship-2-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của evaluation report.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng evaluation report và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng evaluation report.
- Đánh giá evaluation report bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ evaluation report mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-07-capstone-career-ship-3
- phase-07-capstone-career-ship-4
review_question_vi: Định nghĩa evaluation report bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define evaluation reports in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng evaluation report. Hãy liên hệ
  cụ thể với evaluation report trong lesson phase-07-capstone-career-ship-2.
review_answer_en: A strong answer names the input, transformation, output and the context where evaluation reports is used.
  Relate it specifically to evaluation reports in lesson phase-07-capstone-career-ship-2.
review_cards:
- id: phase-07-capstone-career-ship-2-recall
  type: recall
  question_vi: Định nghĩa evaluation report bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define evaluation reports in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng evaluation report.
  answer_en: A strong answer names the input, transformation, output and the context where evaluation reports is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-07-capstone-career-ship-2-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng evaluation report cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies evaluation reports to an AI engineering problem.
  answer_vi: Ví dụ cho evaluation report cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-07-capstone-career-ship-2).
  answer_en: The evaluation reports example should have an explicit input, expected output and a way to run or verify it (phase-07-capstone-career-ship-2).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-07-capstone-career-ship-2-debug
  type: debug
  question_vi: Nếu kết quả của evaluation report sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If evaluation reports produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với evaluation report, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test nhỏ
    và error analysis (phase-07-capstone-career-ship-2).
  answer_en: For evaluation reports, check inputs/shapes, preprocessing and the baseline first; then isolate the failure with
    a small test and error analysis (phase-07-capstone-career-ship-2).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-07-capstone-career-ship-2-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của evaluation report như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of evaluation reports?
  answer_vi: Câu trả lời về evaluation report cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-07-capstone-career-ship-2).
  answer_en: The answer about evaluation reports should cover assumptions, metrics/cost, limitations and how to reduce production
    risk (phase-07-capstone-career-ship-2).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Evaluation report / Evaluation reports

Evaluation report biến một demo AI thành hệ thống có thể tin cậy. Định nghĩa metric và dataset kiểm thử trước, ghi prompt/model/version/token/latency, rồi phân tích failure theo retrieval, generation, data hoặc infrastructure thay vì chỉ nhìn một điểm số.

## Practice

Ship một vertical slice chạy local, ghi test/evaluation, quay demo ngắn và mở issue cho phần chưa làm.
