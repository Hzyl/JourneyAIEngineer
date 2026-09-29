---
lesson_id: phase-00-onboarding-baseline-3
phase_id: phase-00-onboarding
module_id: baseline
title_vi: Bài kiểm tra Git và terminal
title_en: Git and terminal baseline assessment
summary_vi: Học Bài kiểm tra Git và terminal qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có
  edge case.
summary_en: Learn Git and terminal baseline assessment through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Giải thích bài kiểm tra git và terminal bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng bài kiểm tra git và terminal.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain git and terminal baseline assessment with a concrete example.
- Write or adapt a small code example applying git and terminal baseline assessment.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-00-onboarding-baseline-2
key_terms:
- bài
- kiểm
- tra
- git
- terminal
- Python
- testing
- debugging
- maintainability
- baseline
concept_notes_vi: 'Bài kiểm tra Git và terminal giúp một AI Engineer làm việc có thể truy vết: mỗi thay đổi cần có diff, lý
  do và cách kiểm chứng. Thực hành bằng một repository nhỏ, tạo một lỗi có chủ ý, đọc output của terminal rồi sửa bằng commit
  rõ nghĩa.'
concept_notes_en: 'Bài kiểm tra Git và terminal makes AI engineering work traceable: every change needs a diff, a reason,
  and a verification step. Practise in a small repository, introduce an intentional failure, read the terminal output, and
  fix it with a focused commit.'
why_it_matters_vi: Đo nền tảng hiện tại một cách trung thực để chọn nhịp học, không biến bài đánh giá thành bài học thuộc
  lòng.
why_it_matters_en: Measure your current baseline honestly so the learning pace follows evidence rather than confidence.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Đo nền tảng hiện tại một cách trung thực để chọn nhịp học, không biến bài đánh giá thành
  bài học thuộc lòng.'
- Mở Python Tutorial, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Làm bài kiểm tra không xem tài liệu, chấm theo checklist, sau đó ghi ba lỗ hổng và một kế hoạch bù.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Measure your current baseline honestly so the learning pace follows evidence rather
  than confidence.'
- Open Python Tutorial, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Take the assessment without references, score it with the checklist, then record three gaps
  and a recovery plan.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Làm bài kiểm tra không xem tài liệu, chấm theo checklist, sau đó ghi ba lỗ hổng và một kế hoạch bù.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn giải thích được vì sao mình chọn track 6 tháng hoặc 12–15 tháng bằng dữ liệu của chính mình.
    stretch: Viết thêm một failure test cho bài kiểm tra git và terminal và giải thích kết quả.
  en:
    task: Take the assessment without references, score it with the checklist, then record three gaps and a recovery plan.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can justify the six-month or 12–15-month track using your own evidence.
    stretch: Add a failure test for git and terminal baseline assessment and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích bài kiểm tra git và terminal cho một đồng đội mới như thế nào?
  - Một assumption nào của bài kiểm tra git và terminal có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain git and terminal baseline assessment to a new teammate?
  - Which assumption behind git and terminal baseline assessment could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Git and terminal baseline assessment: inspect one complete path'
  code: "# Topic: Git and terminal baseline assessment (phase-00-onboarding-baseline-3)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của bài kiểm tra git và terminal.
  purpose_en: Illustrate the input-to-output path for git and terminal baseline assessment.
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
- title: VS Code Getting Started
  url: https://code.visualstudio.com/docs/getstarted/getting-started
  language: en
  purpose_vi: Hướng dẫn chính thức để mở folder, terminal và workspace.
  read_vi: Đọc phần mở folder và integrated terminal trước khi làm exercise.
  purpose_en: Official guide for folders, terminals, and workspaces.
  read_en: Read the folder and integrated-terminal sections before the exercise.
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
- exercise-0-baseline
review_item_ids:
- phase-00-onboarding-baseline-3-recall
- phase-00-onboarding-baseline-3-application
- phase-00-onboarding-baseline-3-debug
- phase-00-onboarding-baseline-3-interview
estimated_minutes: 45
completion_checklist:
- Giải thích được input, biến đổi và output của bài kiểm tra git và terminal.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng bài kiểm tra git và terminal và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng bài kiểm tra git và terminal.
- Đánh giá bài kiểm tra git và terminal bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ bài kiểm tra git và terminal mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-00-onboarding-baseline-4
- phase-00-onboarding-learning-system-1
review_question_vi: Định nghĩa bài kiểm tra git và terminal bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define git and terminal baseline assessment in your own words. What are the input, transformation and
  output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng bài kiểm tra git và terminal. Hãy
  liên hệ cụ thể với bài kiểm tra git và terminal trong lesson phase-00-onboarding-baseline-3.
review_answer_en: A strong answer names the input, transformation, output and the context where git and terminal baseline
  assessment is used. Relate it specifically to git and terminal baseline assessment in lesson phase-00-onboarding-baseline-3.
review_cards:
- id: phase-00-onboarding-baseline-3-recall
  type: recall
  question_vi: Định nghĩa bài kiểm tra git và terminal bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define git and terminal baseline assessment in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng bài kiểm tra git và terminal.
  answer_en: A strong answer names the input, transformation, output and the context where git and terminal baseline assessment
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-00-onboarding-baseline-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng bài kiểm tra git và terminal cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies git and terminal baseline assessment to an AI engineering
    problem.
  answer_vi: Ví dụ cho bài kiểm tra git và terminal cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng
    (phase-00-onboarding-baseline-3).
  answer_en: The git and terminal baseline assessment example should have an explicit input, expected output and a way to
    run or verify it (phase-00-onboarding-baseline-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-00-onboarding-baseline-3-debug
  type: debug
  question_vi: Nếu kết quả của bài kiểm tra git và terminal sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If git and terminal baseline assessment produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với bài kiểm tra git và terminal, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-00-onboarding-baseline-3).
  answer_en: For git and terminal baseline assessment, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-00-onboarding-baseline-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-00-onboarding-baseline-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của bài kiểm tra git và terminal như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of git and terminal baseline assessment?
  answer_vi: Câu trả lời về bài kiểm tra git và terminal cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-00-onboarding-baseline-3).
  answer_en: The answer about git and terminal baseline assessment should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-00-onboarding-baseline-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Bài kiểm tra Git và terminal / Git and terminal baseline assessment

Bài kiểm tra Git và terminal giúp một AI Engineer làm việc có thể truy vết: mỗi thay đổi cần có diff, lý do và cách kiểm chứng. Thực hành bằng một repository nhỏ, tạo một lỗi có chủ ý, đọc output của terminal rồi sửa bằng commit rõ nghĩa.

## Practice

Làm bài kiểm tra không xem tài liệu, chấm theo checklist, sau đó ghi ba lỗ hổng và một kế hoạch bù.
