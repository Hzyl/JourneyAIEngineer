---
lesson_id: phase-02-math-ml-probability-1
phase_id: phase-02-math-ml
module_id: probability
title_vi: Biến ngẫu nhiên và phân phối
title_en: Random variables and distributions
summary_vi: Học Biến ngẫu nhiên và phân phối qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có
  edge case.
summary_en: Learn Random variables and distributions through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Giải thích biến ngẫu nhiên và phân phối bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng biến ngẫu nhiên và phân phối.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain random variables and distributions with a concrete example.
- Write or adapt a small code example applying random variables and distributions.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-02-math-ml-calculus-4
- phase-01-python-software-python-core-1
key_terms:
- biến
- ngẫu
- nhiên
- phân
- phối
- NumPy
- vector
- gradient
- optimization
- probability
concept_notes_vi: Biến ngẫu nhiên và phân phối là khái niệm của module probability. Hãy xác định input, output, giả định,
  failure mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.
concept_notes_en: Biến ngẫu nhiên và phân phối is a concept in the probability module. Identify the inputs, outputs, assumptions,
  failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Dùng xác suất và thống kê để định lượng bất định, sampling và độ tin cậy của kết luận.
why_it_matters_en: Use probability and statistics to quantify uncertainty, sampling, and the reliability of conclusions.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Dùng xác suất và thống kê để định lượng bất định, sampling và độ tin cậy của kết luận.'
- Mở NumPy Linear Algebra, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Mô phỏng một phân phối, thay đổi kích thước mẫu, vẽ histogram và ghi rõ giả định trước khi kết luận.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Use probability and statistics to quantify uncertainty, sampling, and the reliability
  of conclusions.'
- Open NumPy Linear Algebra, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Simulate a distribution, vary sample size, plot a histogram, and state assumptions before drawing
  conclusions.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Mô phỏng một phân phối, thay đổi kích thước mẫu, vẽ histogram và ghi rõ giả định trước khi kết luận.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn phân biệt được xác suất có điều kiện, expectation, variance và sample noise trong một ví dụ ML.
    stretch: Viết thêm một failure test cho biến ngẫu nhiên và phân phối và giải thích kết quả.
  en:
    task: Simulate a distribution, vary sample size, plot a histogram, and state assumptions before drawing conclusions.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can distinguish conditional probability, expectation, variance, and sampling noise in an ML example.
    stretch: Add a failure test for random variables and distributions and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích biến ngẫu nhiên và phân phối cho một đồng đội mới như thế nào?
  - Một assumption nào của biến ngẫu nhiên và phân phối có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain random variables and distributions to a new teammate?
  - Which assumption behind random variables and distributions could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- x · y = Σ_i x_i y_i
- '||x||₂ = √(Σ_i x_i²)'
code_examples:
- language: python
  title: 'Random variables and distributions: inspect one complete path'
  code: "# Topic: Random variables and distributions (phase-02-math-ml-probability-1)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của biến ngẫu nhiên và phân phối.
  purpose_en: Illustrate the input-to-output path for random variables and distributions.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: NumPy Linear Algebra
  url: https://numpy.org/doc/stable/reference/routines.linalg.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: SciPy Optimize
  url: https://docs.scipy.org/doc/scipy/tutorial/optimize.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: scikit-learn Mathematical Foundations
  url: https://scikit-learn.org/stable/user_guide.html
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
- exercise-2-probability
review_item_ids:
- phase-02-math-ml-probability-1-recall
- phase-02-math-ml-probability-1-application
- phase-02-math-ml-probability-1-debug
- phase-02-math-ml-probability-1-interview
estimated_minutes: 45
completion_checklist:
- Giải thích được input, biến đổi và output của biến ngẫu nhiên và phân phối.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng biến ngẫu nhiên và phân phối và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng biến ngẫu nhiên và phân phối.
- Đánh giá biến ngẫu nhiên và phân phối bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ biến ngẫu nhiên và phân phối mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-02-math-ml-probability-2
- phase-02-math-ml-probability-3
review_question_vi: Định nghĩa biến ngẫu nhiên và phân phối bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define random variables and distributions in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng biến ngẫu nhiên và phân phối. Hãy
  liên hệ cụ thể với biến ngẫu nhiên và phân phối trong lesson phase-02-math-ml-probability-1.
review_answer_en: A strong answer names the input, transformation, output and the context where random variables and distributions
  is used. Relate it specifically to random variables and distributions in lesson phase-02-math-ml-probability-1.
review_cards:
- id: phase-02-math-ml-probability-1-recall
  type: recall
  question_vi: Định nghĩa biến ngẫu nhiên và phân phối bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define random variables and distributions in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng biến ngẫu nhiên và phân phối.
  answer_en: A strong answer names the input, transformation, output and the context where random variables and distributions
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-02-math-ml-probability-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng biến ngẫu nhiên và phân phối cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies random variables and distributions to an AI engineering problem.
  answer_vi: Ví dụ cho biến ngẫu nhiên và phân phối cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng
    (phase-02-math-ml-probability-1).
  answer_en: The random variables and distributions example should have an explicit input, expected output and a way to run
    or verify it (phase-02-math-ml-probability-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-02-math-ml-probability-1-debug
  type: debug
  question_vi: Nếu kết quả của biến ngẫu nhiên và phân phối sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If random variables and distributions produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với biến ngẫu nhiên và phân phối, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-02-math-ml-probability-1).
  answer_en: For random variables and distributions, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-02-math-ml-probability-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-02-math-ml-probability-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của biến ngẫu nhiên và phân phối như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of random variables and distributions?
  answer_vi: Câu trả lời về biến ngẫu nhiên và phân phối cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-02-math-ml-probability-1).
  answer_en: The answer about random variables and distributions should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-02-math-ml-probability-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Biến ngẫu nhiên và phân phối / Random variables and distributions

Biến ngẫu nhiên và phân phối là khái niệm của module probability. Hãy xác định input, output, giả định, failure mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.

## Practice

Mô phỏng một phân phối, thay đổi kích thước mẫu, vẽ histogram và ghi rõ giả định trước khi kết luận.
