---
lesson_id: phase-07-capstone-career-problem-2
phase_id: phase-07-capstone-career
module_id: problem
title_vi: Viết bản mô tả vấn đề
title_en: Write a problem statement
summary_vi: Bản mô tả nêu ai gặp khó khăn, quy trình hiện tại và kết quả mong muốn.
summary_en: Learn Write a problem statement through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Viết một trang nêu vấn đề, phạm vi và tiêu chí thành công.
- Lần theo một tình huống sử dụng và xác định cách đo giá trị.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain write a problem statement with a concrete example.
- Write or adapt a small code example applying write a problem statement.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-07-capstone-career-problem-1
- phase-06-llm-rag-nlp-foundations-1
key_terms:
- viết
- problem
- statement
- Python
- testing
- debugging
- maintainability
concept_notes_vi: Bản mô tả nêu ai gặp khó khăn, quy trình hiện tại và kết quả mong muốn. Phân biệt nhu cầu với
  giải pháp để việc chọn mô hình không quyết định trước cách hiểu bài toán.
concept_notes_en: Viết problem statement is a concept in the problem module. Identify the inputs, outputs, assumptions,
  failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Chọn vấn đề có người dùng, tiêu chí đánh giá và kiến trúc giải thích được.
why_it_matters_en: Choose a real user problem with measurable metrics and an architecture you can defend in an interview.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Write a problem statement” trong tài liệu tham khảo; đối chiếu với phần giải thích của
  bài.
- Viết một trang nêu vấn đề, phạm vi và tiêu chí thành công.
- Lần theo một tình huống sử dụng và xác định cách đo giá trị. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần
  đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Choose a real user problem with measurable metrics and an architecture you
  can defend in an interview.'
- Open GitHub Docs, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Write a one-page problem statement, user journey, non-goals, constraints, and architecture
  diagram.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Viết một trang nêu vấn đề, phạm vi và tiêu chí thành công.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết bản mô tả một trang gồm vấn đề,
      hành trình người dùng, phạm vi, ràng buộc và sơ đồ kiến trúc.'
    deliverables:
    - Bản mô tả hoặc sơ đồ gắn với người dùng và tiêu chí thành công
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Lần theo một tình huống sử dụng và xác định cách đo giá trị.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Write a one-page problem statement, user journey, non-goals, constraints, and architecture diagram.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: A reviewer understands what you build, for whom, and what success means in under two minutes.
    stretch: Add a failure test for write a problem statement and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Viết bản mô tả vấn đề” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain write a problem statement to a new teammate?
  - Which assumption behind write a problem statement could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Write a problem statement: inspect one complete path'
  code: "# Topic: Write a problem statement (phase-07-capstone-career-problem-2)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for write a problem statement.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: GitHub Docs
  url: https://docs.github.com/en
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Google Engineering Practices
  url: https://google.github.io/eng-practices/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: The Twelve-Factor App
  url: https://12factor.net/
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
exercise_ids:
- exercise-7-problem
review_item_ids:
- phase-07-capstone-career-problem-2-recall
- phase-07-capstone-career-problem-2-application
- phase-07-capstone-career-problem-2-debug
- phase-07-capstone-career-problem-2-interview
estimated_minutes: 60
completion_checklist:
- Viết một trang nêu vấn đề, phạm vi và tiêu chí thành công.
- Lần theo một tình huống sử dụng và xác định cách đo giá trị.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Viết một trang nêu vấn đề, phạm vi và tiêu chí thành công.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Lần theo một tình huống sử dụng và xác định cách đo giá trị.
common_mistakes:
- Đặt tên công nghệ thay cho việc mô tả vấn đề của người dùng.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-07-capstone-career-problem-3
- phase-07-capstone-career-problem-4
review_question_vi: Nội dung cốt lõi của “Viết bản mô tả vấn đề” là gì?
review_question_en: Define write a problem statement in your own words. What are the input, transformation and output?
review_answer_vi: Bản mô tả nêu ai gặp khó khăn, quy trình hiện tại và kết quả mong muốn. Phân biệt nhu cầu với
  giải pháp để việc chọn mô hình không quyết định trước cách hiểu bài toán.
review_answer_en: A strong answer names the input, transformation, output and the context where write a problem
  statement is used. Relate it specifically to write a problem statement in lesson phase-07-capstone-career-problem-2.
review_cards:
- id: phase-07-capstone-career-problem-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Viết bản mô tả vấn đề” là gì?
  question_en: Define write a problem statement in your own words. What are the input, transformation and output?
  answer_vi: Bản mô tả nêu ai gặp khó khăn, quy trình hiện tại và kết quả mong muốn. Phân biệt nhu cầu với giải
    pháp để việc chọn mô hình không quyết định trước cách hiểu bài toán.
  answer_en: A strong answer names the input, transformation, output and the context where write a problem statement
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-07-capstone-career-problem-2-application
  type: application
  question_vi: Viết một trang nêu vấn đề, phạm vi và tiêu chí thành công.
  question_en: Write a small code example or design that applies write a problem statement to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Viết một trang nêu vấn đề, phạm vi và tiêu chí thành công”, cần lưu: bản mô tả hoặc
    sơ đồ gắn với người dùng và tiêu chí thành công. Lần theo một tình huống sử dụng và xác định cách đo giá trị.'
  answer_en: The write a problem statement example should have an explicit input, expected output and a way to run
    or verify it (phase-07-capstone-career-problem-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-07-capstone-career-problem-2-debug
  type: debug
  question_vi: Khi làm bài “Viết bản mô tả vấn đề”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If write a problem statement produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Viết bản mô tả vấn đề”, lỗi cần tránh là: đặt tên công nghệ thay cho việc mô tả vấn đề
    của người dùng. Lần theo một tình huống sử dụng và xác định cách đo giá trị. Dùng ví dụ nhỏ để tìm bước đầu
    tiên có kết quả khác dự kiến.'
  answer_en: For write a problem statement, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-07-capstone-career-problem-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-07-capstone-career-problem-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Viết bản mô tả vấn đề” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of write a problem statement?
  answer_vi: Bắt đầu từ nhiệm vụ “Viết một trang nêu vấn đề, phạm vi và tiêu chí thành công”. Trình bày kết quả
    đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about write a problem statement should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-07-capstone-career-problem-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Viết bản mô tả vấn đề / Write a problem statement

Bản mô tả nêu ai gặp khó khăn, quy trình hiện tại và kết quả mong muốn. Phân biệt nhu cầu với giải pháp để việc chọn mô hình không quyết định trước cách hiểu bài toán.

## Thực hành

Viết một trang nêu vấn đề, phạm vi và tiêu chí thành công.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết bản mô tả một trang gồm vấn đề, hành trình người dùng, phạm vi, ràng buộc và sơ đồ kiến trúc.
