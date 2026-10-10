---
lesson_id: phase-07-capstone-career-problem-1
phase_id: phase-07-capstone-career
module_id: problem
title_vi: Chọn lĩnh vực cho đồ án
title_en: Choose a domain
summary_vi: Lĩnh vực phù hợp có người dùng cụ thể, dữ liệu tiếp cận hợp lệ và vấn đề đủ nhỏ để kiểm chứng.
summary_en: Learn Choose a domain through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Mô tả người dùng, dữ liệu và một vấn đề có thể kiểm chứng.
- Lần theo một tình huống sử dụng và xác định cách đo giá trị.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain choose a domain with a concrete example.
- Write or adapt a small code example applying choose a domain.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-adaptation-4
- phase-06-llm-rag-nlp-foundations-1
key_terms:
- chọn
- domain
- Python
- testing
- debugging
- maintainability
- problem
concept_notes_vi: Lĩnh vực phù hợp có người dùng cụ thể, dữ liệu tiếp cận hợp lệ và vấn đề đủ nhỏ để kiểm chứng.
  Chọn theo khả năng giải quyết và đánh giá, không chỉ theo độ phổ biến công nghệ.
concept_notes_en: Chọn domain is a concept in the problem module. Identify the inputs, outputs, assumptions, failure
  modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Chọn vấn đề có người dùng, tiêu chí đánh giá và kiến trúc giải thích được.
why_it_matters_en: Choose a real user problem with measurable metrics and an architecture you can defend in an interview.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Choose a domain” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Mô tả người dùng, dữ liệu và một vấn đề có thể kiểm chứng.
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
    task: 'Mô tả người dùng, dữ liệu và một vấn đề có thể kiểm chứng.


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
    stretch: Add a failure test for choose a domain and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Chọn lĩnh vực cho đồ án” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain choose a domain to a new teammate?
  - Which assumption behind choose a domain could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Choose a domain: inspect one complete path'
  code: "# Topic: Choose a domain (phase-07-capstone-career-problem-1)\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\n\
    class Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for choose a domain.
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
- phase-07-capstone-career-problem-1-recall
- phase-07-capstone-career-problem-1-application
- phase-07-capstone-career-problem-1-debug
- phase-07-capstone-career-problem-1-interview
estimated_minutes: 60
completion_checklist:
- Mô tả người dùng, dữ liệu và một vấn đề có thể kiểm chứng.
- Lần theo một tình huống sử dụng và xác định cách đo giá trị.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Mô tả người dùng, dữ liệu và một vấn đề có thể kiểm chứng.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Lần theo một tình huống sử dụng và xác định cách đo giá trị.
common_mistakes:
- Đặt tên công nghệ thay cho việc mô tả vấn đề của người dùng.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-07-capstone-career-problem-2
- phase-07-capstone-career-problem-3
review_question_vi: Nội dung cốt lõi của “Chọn lĩnh vực cho đồ án” là gì?
review_question_en: Define choose a domain in your own words. What are the input, transformation and output?
review_answer_vi: Lĩnh vực phù hợp có người dùng cụ thể, dữ liệu tiếp cận hợp lệ và vấn đề đủ nhỏ để kiểm chứng.
  Chọn theo khả năng giải quyết và đánh giá, không chỉ theo độ phổ biến công nghệ.
review_answer_en: A strong answer names the input, transformation, output and the context where choose a domain
  is used. Relate it specifically to choose a domain in lesson phase-07-capstone-career-problem-1.
review_cards:
- id: phase-07-capstone-career-problem-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Chọn lĩnh vực cho đồ án” là gì?
  question_en: Define choose a domain in your own words. What are the input, transformation and output?
  answer_vi: Lĩnh vực phù hợp có người dùng cụ thể, dữ liệu tiếp cận hợp lệ và vấn đề đủ nhỏ để kiểm chứng. Chọn
    theo khả năng giải quyết và đánh giá, không chỉ theo độ phổ biến công nghệ.
  answer_en: A strong answer names the input, transformation, output and the context where choose a domain is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-07-capstone-career-problem-1-application
  type: application
  question_vi: Mô tả người dùng, dữ liệu và một vấn đề có thể kiểm chứng.
  question_en: Write a small code example or design that applies choose a domain to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Mô tả người dùng, dữ liệu và một vấn đề có thể kiểm chứng”, cần lưu: bản mô tả hoặc
    sơ đồ gắn với người dùng và tiêu chí thành công. Lần theo một tình huống sử dụng và xác định cách đo giá trị.'
  answer_en: The choose a domain example should have an explicit input, expected output and a way to run or verify
    it (phase-07-capstone-career-problem-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-07-capstone-career-problem-1-debug
  type: debug
  question_vi: Khi làm bài “Chọn lĩnh vực cho đồ án”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If choose a domain produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Chọn lĩnh vực cho đồ án”, lỗi cần tránh là: đặt tên công nghệ thay cho việc mô tả vấn đề
    của người dùng. Lần theo một tình huống sử dụng và xác định cách đo giá trị. Dùng ví dụ nhỏ để tìm bước đầu
    tiên có kết quả khác dự kiến.'
  answer_en: For choose a domain, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-07-capstone-career-problem-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-07-capstone-career-problem-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Chọn lĩnh vực cho đồ án” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of choose a domain?
  answer_vi: Bắt đầu từ nhiệm vụ “Mô tả người dùng, dữ liệu và một vấn đề có thể kiểm chứng”. Trình bày kết quả
    đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about choose a domain should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-07-capstone-career-problem-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Chọn lĩnh vực cho đồ án / Choose a domain

Lĩnh vực phù hợp có người dùng cụ thể, dữ liệu tiếp cận hợp lệ và vấn đề đủ nhỏ để kiểm chứng. Chọn theo khả năng giải quyết và đánh giá, không chỉ theo độ phổ biến công nghệ.

## Thực hành

Mô tả người dùng, dữ liệu và một vấn đề có thể kiểm chứng.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết bản mô tả một trang gồm vấn đề, hành trình người dùng, phạm vi, ràng buộc và sơ đồ kiến trúc.
