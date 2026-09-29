---
lesson_id: phase-08-genai-software-genai-software-foundations-1
phase_id: phase-08-genai-software
module_id: genai-software-foundations
title_vi: Python cho AI service và typed contract
title_en: Python for AI services and typed contracts
summary_vi: Học Python cho AI service và typed contract qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng
  bài tập có edge case.
summary_en: Learn Python for AI services and typed contracts through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Giải thích python cho ai service và typed contract bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng python cho ai service và typed contract.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain python for ai services and typed contracts with a concrete example.
- Write or adapt a small code example applying python for ai services and typed contracts.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-07-capstone-career-career-4
- phase-07-capstone-career-problem-1
key_terms:
- python
- cho
- service
- typed
- contract
- Python
- testing
- debugging
- maintainability
- genai-software-foundations
concept_notes_vi: Python cho AI service và typed contract là một kỹ năng Software Engineering dùng để biến ý tưởng thành code
  có thể đọc, kiểm tra và bảo trì. Hãy xác định input, output, invariant và lỗi có thể xảy ra trước khi viết implementation.
  Trong Python, giữ boundary nhỏ giúp test nhanh và traceback chỉ ra đúng lớp lỗi.
concept_notes_en: Python cho AI service và typed contract is a Software Engineering skill for turning an idea into code that
  can be read, tested, and maintained. Define the inputs, outputs, invariants, and failure modes before implementing. In Python,
  small boundaries make tests fast and tracebacks actionable.
why_it_matters_vi: Một AI Engineer phải kiểm soát boundary của service, dependency và release trước khi tối ưu model.
why_it_matters_en: An AI Engineer must control service boundaries, dependencies, and releases before optimizing a model.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Một AI Engineer phải kiểm soát boundary của service, dependency và release trước khi
  tối ưu model.'
- Mở FastAPI Documentation, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Đóng gói một endpoint AI giả lập bằng FastAPI, Docker và GitHub Actions; ghi lại contract, health check
  và lệnh rollback.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: An AI Engineer must control service boundaries, dependencies, and releases before optimizing
  a model.'
- Open FastAPI Documentation, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Package a stub AI endpoint with FastAPI, Docker, and GitHub Actions; document its contract,
  health check, and rollback command.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Đóng gói một endpoint AI giả lập bằng FastAPI, Docker và GitHub Actions; ghi lại contract, health check và lệnh
      rollback.
    deliverables:
    - Một implementation nhỏ chạy được
    - Một test hoặc benchmark
    - Một note về failure mode và trade-off
    checkpoint: Clone trên máy sạch, chạy test và container bằng một chuỗi lệnh; giải thích được lỗi thuộc code, môi trường
      hay deployment.
    stretch: Viết thêm một failure test cho python cho ai service và typed contract và giải thích kết quả.
  en:
    task: Package a stub AI endpoint with FastAPI, Docker, and GitHub Actions; document its contract, health check, and rollback
      command.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: From a clean clone, run tests and the container with one command sequence and distinguish code, environment,
      and deployment failures.
    stretch: Add a failure test for python for ai services and typed contracts and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích python cho ai service và typed contract cho một đồng đội mới như thế nào?
  - Một assumption nào của python cho ai service và typed contract có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain python for ai services and typed contracts to a new teammate?
  - Which assumption behind python for ai services and typed contracts could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Python for AI services and typed contracts: inspect one complete path'
  code: "# Topic: Python for AI services and typed contracts (phase-08-genai-software-genai-software-foundations-1)\nfrom\
    \ dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult =\
    \ Result(value='ready', valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của python cho ai service và typed contract.
  purpose_en: Illustrate the input-to-output path for python for ai services and typed contracts.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: FastAPI Documentation
  url: https://fastapi.tiangolo.com/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: GitHub Actions Documentation
  url: https://docs.github.com/en/actions
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Docker Get Started
  url: https://docs.docker.com/get-started/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Python downloads
  url: https://www.python.org/downloads/
  language: en
  purpose_vi: Trang tải Python chính thức; dùng để cài đúng bản stable.
  read_vi: Chọn Windows installer 64-bit, kiểm tra Add Python to PATH và xác nhận bằng python --version.
  purpose_en: Official Python downloads; use it to install a stable release.
  read_en: Choose the 64-bit Windows installer, enable PATH, and verify with python --version.
  kind: official
  required: true
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
- exercise-8-genai-software-foundations
review_item_ids:
- phase-08-genai-software-genai-software-foundations-1-recall
- phase-08-genai-software-genai-software-foundations-1-application
- phase-08-genai-software-genai-software-foundations-1-debug
- phase-08-genai-software-genai-software-foundations-1-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của python cho ai service và typed contract.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng python cho ai service và typed contract và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng python cho ai service và typed contract.
- Đánh giá python cho ai service và typed contract bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ python cho ai service và typed contract mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-08-genai-software-genai-software-foundations-2
- phase-08-genai-software-genai-software-foundations-3
review_question_vi: Định nghĩa python cho ai service và typed contract bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define python for ai services and typed contracts in your own words. What are the input, transformation
  and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng python cho ai service và typed
  contract. Hãy liên hệ cụ thể với python cho ai service và typed contract trong lesson phase-08-genai-software-genai-software-foundations-1.
review_answer_en: A strong answer names the input, transformation, output and the context where python for ai services and
  typed contracts is used. Relate it specifically to python for ai services and typed contracts in lesson phase-08-genai-software-genai-software-foundations-1.
review_cards:
- id: phase-08-genai-software-genai-software-foundations-1-recall
  type: recall
  question_vi: Định nghĩa python cho ai service và typed contract bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define python for ai services and typed contracts in your own words. What are the input, transformation and
    output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng python cho ai service và typed contract.
  answer_en: A strong answer names the input, transformation, output and the context where python for ai services and typed
    contracts is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-08-genai-software-genai-software-foundations-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng python cho ai service và typed contract cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies python for ai services and typed contracts to an AI engineering
    problem.
  answer_vi: Ví dụ cho python cho ai service và typed contract cần có input rõ ràng, output mong đợi và một cách chạy hoặc
    kiểm chứng (phase-08-genai-software-genai-software-foundations-1).
  answer_en: The python for ai services and typed contracts example should have an explicit input, expected output and a way
    to run or verify it (phase-08-genai-software-genai-software-foundations-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-08-genai-software-genai-software-foundations-1-debug
  type: debug
  question_vi: Nếu kết quả của python cho ai service và typed contract sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If python for ai services and typed contracts produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: Với python cho ai service và typed contract, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô
    lập lỗi bằng test nhỏ và error analysis (phase-08-genai-software-genai-software-foundations-1).
  answer_en: For python for ai services and typed contracts, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-08-genai-software-genai-software-foundations-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-08-genai-software-genai-software-foundations-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của python cho ai service và typed contract như
    thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of python for ai services and typed contracts?
  answer_vi: Câu trả lời về python cho ai service và typed contract cần nêu giả định, metric/chi phí, giới hạn và cách giảm
    rủi ro trong production (phase-08-genai-software-genai-software-foundations-1).
  answer_en: The answer about python for ai services and typed contracts should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-08-genai-software-genai-software-foundations-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Python cho AI service và typed contract / Python for AI services and typed contracts

Python cho AI service và typed contract là một kỹ năng Software Engineering dùng để biến ý tưởng thành code có thể đọc, kiểm tra và bảo trì. Hãy xác định input, output, invariant và lỗi có thể xảy ra trước khi viết implementation. Trong Python, giữ boundary nhỏ giúp test nhanh và traceback chỉ ra đúng lớp lỗi.

## Practice

Đóng gói một endpoint AI giả lập bằng FastAPI, Docker và GitHub Actions; ghi lại contract, health check và lệnh rollback.
