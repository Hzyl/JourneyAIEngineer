---
lesson_id: phase-07-capstone-career-problem-1
phase_id: phase-07-capstone-career
module_id: problem
title_vi: Chọn domain
title_en: Choose a domain
summary_vi: Học Chọn domain qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Choose a domain through an input → transformation → output model, then verify it with an edge-case exercise.
learning_objectives:
- Giải thích chọn domain bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng chọn domain.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
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
concept_notes_vi: Chọn domain là khái niệm của module problem. Hãy xác định input, output, giả định, failure mode và cách
  kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.
concept_notes_en: Chọn domain is a concept in the problem module. Identify the inputs, outputs, assumptions, failure modes,
  and verification method with a small example before scaling to a project.
why_it_matters_vi: Chọn vấn đề có người dùng thật, metric đo được và architecture giải thích được trong phỏng vấn.
why_it_matters_en: Choose a real user problem with measurable metrics and an architecture you can defend in an interview.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Chọn vấn đề có người dùng thật, metric đo được và architecture giải thích được trong
  phỏng vấn.'
- Mở GitHub Docs, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Viết problem statement một trang, user journey, non-goals, constraints và architecture diagram.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Choose a real user problem with measurable metrics and an architecture you can defend
  in an interview.'
- Open GitHub Docs, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Write a one-page problem statement, user journey, non-goals, constraints, and architecture
  diagram.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Viết problem statement một trang, user journey, non-goals, constraints và architecture diagram.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Reviewer hiểu bạn xây gì, cho ai và thế nào là thành công trong chưa đầy hai phút.
    stretch: Viết thêm một failure test cho chọn domain và giải thích kết quả.
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
  - Bạn sẽ giải thích chọn domain cho một đồng đội mới như thế nào?
  - Một assumption nào của chọn domain có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
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
  purpose_vi: Minh họa đường đi input → output của chọn domain.
  purpose_en: Illustrate the input-to-output path for choose a domain.
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
- exercise-7-problem
review_item_ids:
- phase-07-capstone-career-problem-1-recall
- phase-07-capstone-career-problem-1-application
- phase-07-capstone-career-problem-1-debug
- phase-07-capstone-career-problem-1-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của chọn domain.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng chọn domain và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng chọn domain.
- Đánh giá chọn domain bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ chọn domain mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-07-capstone-career-problem-2
- phase-07-capstone-career-problem-3
review_question_vi: Định nghĩa chọn domain bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define choose a domain in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng chọn domain. Hãy liên hệ cụ thể
  với chọn domain trong lesson phase-07-capstone-career-problem-1.
review_answer_en: A strong answer names the input, transformation, output and the context where choose a domain is used. Relate
  it specifically to choose a domain in lesson phase-07-capstone-career-problem-1.
review_cards:
- id: phase-07-capstone-career-problem-1-recall
  type: recall
  question_vi: Định nghĩa chọn domain bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define choose a domain in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng chọn domain.
  answer_en: A strong answer names the input, transformation, output and the context where choose a domain is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-07-capstone-career-problem-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng chọn domain cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies choose a domain to an AI engineering problem.
  answer_vi: Ví dụ cho chọn domain cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-07-capstone-career-problem-1).
  answer_en: The choose a domain example should have an explicit input, expected output and a way to run or verify it (phase-07-capstone-career-problem-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-07-capstone-career-problem-1-debug
  type: debug
  question_vi: Nếu kết quả của chọn domain sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If choose a domain produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với chọn domain, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test nhỏ và error
    analysis (phase-07-capstone-career-problem-1).
  answer_en: For choose a domain, check inputs/shapes, preprocessing and the baseline first; then isolate the failure with
    a small test and error analysis (phase-07-capstone-career-problem-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-07-capstone-career-problem-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của chọn domain như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of choose a domain?
  answer_vi: Câu trả lời về chọn domain cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production (phase-07-capstone-career-problem-1).
  answer_en: The answer about choose a domain should cover assumptions, metrics/cost, limitations and how to reduce production
    risk (phase-07-capstone-career-problem-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Chọn domain / Choose a domain

Chọn domain là khái niệm của module problem. Hãy xác định input, output, giả định, failure mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.

## Practice

Viết problem statement một trang, user journey, non-goals, constraints và architecture diagram.
