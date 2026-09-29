---
lesson_id: phase-03-classical-ml-ml-framing-1
phase_id: phase-03-classical-ml
module_id: ml-framing
title_vi: Supervised và unsupervised
title_en: Supervised and unsupervised learning
summary_vi: Học Supervised và unsupervised qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge
  case.
summary_en: Learn Supervised and unsupervised learning through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Giải thích supervised và unsupervised bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng supervised và unsupervised.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain supervised and unsupervised learning with a concrete example.
- Write or adapt a small code example applying supervised and unsupervised learning.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-02-math-ml-optimization-4
- phase-02-math-ml-linear-algebra-1
key_terms:
- supervised
- unsupervised
- dataset
- feature
- baseline
- evaluation
- ml-framing
concept_notes_vi: 'Supervised và unsupervised là một quyết định trong classical Machine Learning: xác định label, baseline,
  split và metric trước khi chọn model. Preprocessing phải fit chỉ trên train; error analysis cần chỉ ra nhóm dữ liệu làm
  model sai và cách kiểm tra lại giả thuyết.'
concept_notes_en: 'Supervised và unsupervised is a classical Machine Learning decision: define the label, baseline, split,
  and metric before choosing a model. Fit preprocessing on train only; error analysis should identify the groups where the
  model fails and how to retest the hypothesis.'
why_it_matters_vi: 'Đặt đúng bài toán trước khi chọn model: user, label, split, baseline và rủi ro leakage.'
why_it_matters_en: 'Frame the problem before choosing a model: user, label, split, baseline, and leakage risks.'
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Đặt đúng bài toán trước khi chọn model: user, label, split, baseline và rủi ro leakage.'
- Mở scikit-learn User Guide, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Viết data dictionary, xác định target và baseline ngây thơ, sau đó lập bảng các điểm có thể leakage.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Frame the problem before choosing a model: user, label, split, baseline, and leakage
  risks.'
- Open scikit-learn User Guide, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Write a data dictionary, define the target and a naive baseline, then list every possible leakage
  point.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Viết data dictionary, xác định target và baseline ngây thơ, sau đó lập bảng các điểm có thể leakage.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn bảo vệ được cách split và metric trước một reviewer, kể cả khi score thấp.
    stretch: Viết thêm một failure test cho supervised và unsupervised và giải thích kết quả.
  en:
    task: Write a data dictionary, define the target and a naive baseline, then list every possible leakage point.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can defend the split and metric to a reviewer even when the score is low.
    stretch: Add a failure test for supervised and unsupervised learning and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích supervised và unsupervised cho một đồng đội mới như thế nào?
  - Một assumption nào của supervised và unsupervised có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain supervised and unsupervised learning to a new teammate?
  - Which assumption behind supervised and unsupervised learning could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Supervised and unsupervised learning: inspect one complete path'
  code: "# Topic: Supervised and unsupervised learning (phase-03-classical-ml-ml-framing-1)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của supervised và unsupervised.
  purpose_en: Illustrate the input-to-output path for supervised and unsupervised learning.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: scikit-learn User Guide
  url: https://scikit-learn.org/stable/user_guide.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: scikit-learn Model Evaluation
  url: https://scikit-learn.org/stable/modules/model_evaluation.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: scikit-learn Pipelines
  url: https://scikit-learn.org/stable/modules/compose.html
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
- exercise-3-ml-framing
review_item_ids:
- phase-03-classical-ml-ml-framing-1-recall
- phase-03-classical-ml-ml-framing-1-application
- phase-03-classical-ml-ml-framing-1-debug
- phase-03-classical-ml-ml-framing-1-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của supervised và unsupervised.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng supervised và unsupervised và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng supervised và unsupervised.
- Đánh giá supervised và unsupervised bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ supervised và unsupervised mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-03-classical-ml-ml-framing-2
- phase-03-classical-ml-ml-framing-3
review_question_vi: Định nghĩa supervised và unsupervised bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define supervised and unsupervised learning in your own words. What are the input, transformation and
  output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng supervised và unsupervised. Hãy
  liên hệ cụ thể với supervised và unsupervised trong lesson phase-03-classical-ml-ml-framing-1.
review_answer_en: A strong answer names the input, transformation, output and the context where supervised and unsupervised
  learning is used. Relate it specifically to supervised and unsupervised learning in lesson phase-03-classical-ml-ml-framing-1.
review_cards:
- id: phase-03-classical-ml-ml-framing-1-recall
  type: recall
  question_vi: Định nghĩa supervised và unsupervised bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define supervised and unsupervised learning in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng supervised và unsupervised.
  answer_en: A strong answer names the input, transformation, output and the context where supervised and unsupervised learning
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-03-classical-ml-ml-framing-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng supervised và unsupervised cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies supervised and unsupervised learning to an AI engineering
    problem.
  answer_vi: Ví dụ cho supervised và unsupervised cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-03-classical-ml-ml-framing-1).
  answer_en: The supervised and unsupervised learning example should have an explicit input, expected output and a way to
    run or verify it (phase-03-classical-ml-ml-framing-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-03-classical-ml-ml-framing-1-debug
  type: debug
  question_vi: Nếu kết quả của supervised và unsupervised sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If supervised and unsupervised learning produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với supervised và unsupervised, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-03-classical-ml-ml-framing-1).
  answer_en: For supervised and unsupervised learning, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-03-classical-ml-ml-framing-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-03-classical-ml-ml-framing-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của supervised và unsupervised như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of supervised and unsupervised learning?
  answer_vi: Câu trả lời về supervised và unsupervised cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-03-classical-ml-ml-framing-1).
  answer_en: The answer about supervised and unsupervised learning should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-03-classical-ml-ml-framing-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Supervised và unsupervised / Supervised and unsupervised learning

Supervised và unsupervised là một quyết định trong classical Machine Learning: xác định label, baseline, split và metric trước khi chọn model. Preprocessing phải fit chỉ trên train; error analysis cần chỉ ra nhóm dữ liệu làm model sai và cách kiểm tra lại giả thuyết.

## Practice

Viết data dictionary, xác định target và baseline ngây thơ, sau đó lập bảng các điểm có thể leakage.
