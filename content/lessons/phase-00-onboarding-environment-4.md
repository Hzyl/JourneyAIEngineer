---
lesson_id: phase-00-onboarding-environment-4
phase_id: phase-00-onboarding
module_id: environment
title_vi: Jupyter, Colab và khi nào dùng chúng
title_en: Jupyter, Colab and when to use them
summary_vi: Học Jupyter, Colab và khi nào dùng chúng qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài
  tập có edge case.
summary_en: Learn Jupyter, Colab and when to use them through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Giải thích jupyter, colab và khi nào dùng chúng bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng jupyter, colab và khi nào dùng chúng.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain jupyter, colab and when to use them with a concrete example.
- Write or adapt a small code example applying jupyter, colab and when to use them.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-00-onboarding-environment-3
key_terms:
- jupyter
- colab
- khi
- nào
- dùng
- chúng
- Python
- testing
- debugging
- maintainability
concept_notes_vi: Jupyter, Colab và khi nào dùng chúng là khái niệm của module environment. Hãy xác định input, output, giả
  định, failure mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.
concept_notes_en: Jupyter, Colab và khi nào dùng chúng is a concept in the environment module. Identify the inputs, outputs,
  assumptions, failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Biến Windows thành một môi trường Python có thể lặp lại, biết kiểm tra phiên bản và biết tìm lỗi từ terminal.
why_it_matters_en: Turn Windows into a reproducible Python environment and learn to verify tools from the terminal.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Biến Windows thành một môi trường Python có thể lặp lại, biết kiểm tra phiên bản và
  biết tìm lỗi từ terminal.'
- Mở Python Tutorial, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Tạo một thư mục repository, tạo .venv, chạy một script Python từ VS Code và ghi lại kết quả kiểm tra
  phiên bản.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Turn Windows into a reproducible Python environment and learn to verify tools from the
  terminal.'
- Open Python Tutorial, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Create a repository folder, create a .venv, run a Python script from VS Code, and record the
  version checks.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Tạo một thư mục repository, tạo .venv, chạy một script Python từ VS Code và ghi lại kết quả kiểm tra phiên bản.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn có thể clone lại project, tạo môi trường mới và chạy script mà không cần đoán lệnh.
    stretch: Viết thêm một failure test cho jupyter, colab và khi nào dùng chúng và giải thích kết quả.
  en:
    task: Create a repository folder, create a .venv, run a Python script from VS Code, and record the version checks.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can recreate the environment from a clean clone and run the script without guessing commands.
    stretch: Add a failure test for jupyter, colab and when to use them and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích jupyter, colab và khi nào dùng chúng cho một đồng đội mới như thế nào?
  - Một assumption nào của jupyter, colab và khi nào dùng chúng có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain jupyter, colab and when to use them to a new teammate?
  - Which assumption behind jupyter, colab and when to use them could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Jupyter, Colab and when to use them: inspect one complete path'
  code: "# Topic: Jupyter, Colab and when to use them (phase-00-onboarding-environment-4)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của jupyter, colab và khi nào dùng chúng.
  purpose_en: Illustrate the input-to-output path for jupyter, colab and when to use them.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Python Tutorial
  url: https://docs.python.org/3/tutorial/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: VS Code Python
  url: https://code.visualstudio.com/docs/languages/python
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Git Reference
  url: https://git-scm.com/docs
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Jupyter Documentation
  url: https://docs.jupyter.org/en/latest/
  language: en
  purpose_vi: Hiểu notebook, kernel và lúc nào notebook phù hợp.
  read_vi: Đọc phần bắt đầu rồi so sánh notebook với package Python trong workspace.
  purpose_en: Understand notebooks, kernels, and when notebooks fit.
  read_en: Read the getting-started section and compare notebooks with a Python package.
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
- exercise-0-environment
review_item_ids:
- phase-00-onboarding-environment-4-recall
- phase-00-onboarding-environment-4-application
- phase-00-onboarding-environment-4-debug
- phase-00-onboarding-environment-4-interview
estimated_minutes: 45
completion_checklist:
- Giải thích được input, biến đổi và output của jupyter, colab và khi nào dùng chúng.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng jupyter, colab và khi nào dùng chúng và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng jupyter, colab và khi nào dùng chúng.
- Đánh giá jupyter, colab và khi nào dùng chúng bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ jupyter, colab và khi nào dùng chúng mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-00-onboarding-baseline-1
- phase-00-onboarding-baseline-2
review_question_vi: Định nghĩa jupyter, colab và khi nào dùng chúng bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define jupyter, colab and when to use them in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng jupyter, colab và khi nào dùng
  chúng. Hãy liên hệ cụ thể với jupyter, colab và khi nào dùng chúng trong lesson phase-00-onboarding-environment-4.
review_answer_en: A strong answer names the input, transformation, output and the context where jupyter, colab and when to
  use them is used. Relate it specifically to jupyter, colab and when to use them in lesson phase-00-onboarding-environment-4.
review_cards:
- id: phase-00-onboarding-environment-4-recall
  type: recall
  question_vi: Định nghĩa jupyter, colab và khi nào dùng chúng bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define jupyter, colab and when to use them in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng jupyter, colab và khi nào dùng chúng.
  answer_en: A strong answer names the input, transformation, output and the context where jupyter, colab and when to use
    them is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-00-onboarding-environment-4-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng jupyter, colab và khi nào dùng chúng cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies jupyter, colab and when to use them to an AI engineering
    problem.
  answer_vi: Ví dụ cho jupyter, colab và khi nào dùng chúng cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm
    chứng (phase-00-onboarding-environment-4).
  answer_en: The jupyter, colab and when to use them example should have an explicit input, expected output and a way to run
    or verify it (phase-00-onboarding-environment-4).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-00-onboarding-environment-4-debug
  type: debug
  question_vi: Nếu kết quả của jupyter, colab và khi nào dùng chúng sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If jupyter, colab and when to use them produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với jupyter, colab và khi nào dùng chúng, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập
    lỗi bằng test nhỏ và error analysis (phase-00-onboarding-environment-4).
  answer_en: For jupyter, colab and when to use them, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-00-onboarding-environment-4).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-00-onboarding-environment-4-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của jupyter, colab và khi nào dùng chúng như
    thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of jupyter, colab and when to use them?
  answer_vi: Câu trả lời về jupyter, colab và khi nào dùng chúng cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi
    ro trong production (phase-00-onboarding-environment-4).
  answer_en: The answer about jupyter, colab and when to use them should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-00-onboarding-environment-4).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Jupyter, Colab và khi nào dùng chúng / Jupyter, Colab and when to use them

Jupyter, Colab và khi nào dùng chúng là khái niệm của module environment. Hãy xác định input, output, giả định, failure mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.

## Practice

Tạo một thư mục repository, tạo .venv, chạy một script Python từ VS Code và ghi lại kết quả kiểm tra phiên bản.
