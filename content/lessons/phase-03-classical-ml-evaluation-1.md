---
lesson_id: phase-03-classical-ml-evaluation-1
phase_id: phase-03-classical-ml
module_id: evaluation
title_vi: Classification metrics
title_en: Classification metrics
summary_vi: Học Classification metrics qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Classification metrics through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích classification metrics bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng classification metrics.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain classification metrics with a concrete example.
- Write or adapt a small code example applying classification metrics.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-03-classical-ml-preprocessing-4
- phase-02-math-ml-linear-algebra-1
key_terms:
- classification
- metrics
- dataset
- feature
- baseline
- evaluation
concept_notes_vi: Classification metrics là một kỹ năng Software Engineering dùng để biến ý tưởng thành code có thể đọc, kiểm
  tra và bảo trì. Hãy xác định input, output, invariant và lỗi có thể xảy ra trước khi viết implementation. Trong Python,
  giữ boundary nhỏ giúp test nhanh và traceback chỉ ra đúng lớp lỗi.
concept_notes_en: Classification metrics is a Software Engineering skill for turning an idea into code that can be read, tested,
  and maintained. Define the inputs, outputs, invariants, and failure modes before implementing. In Python, small boundaries
  make tests fast and tracebacks actionable.
why_it_matters_vi: Chọn metric theo chi phí sai lầm, dùng cross-validation và tuning mà không nhìn trộm test set.
why_it_matters_en: Choose metrics by error cost, use cross-validation, and tune without peeking at the test set.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Chọn metric theo chi phí sai lầm, dùng cross-validation và tuning mà không nhìn trộm
  test set.'
- Mở scikit-learn User Guide, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Viết metric decision table, chạy cross-validation, tune một hyperparameter và lưu kết quả vào bảng.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Choose metrics by error cost, use cross-validation, and tune without peeking at the
  test set.'
- Open scikit-learn User Guide, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Write a metric decision table, run cross-validation, tune one hyperparameter, and record results
  in a table.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Viết metric decision table, chạy cross-validation, tune một hyperparameter và lưu kết quả vào bảng.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn giải thích được khi nào accuracy, F1, PR-AUC, MAE hoặc calibration là lựa chọn hợp lý.
    stretch: Viết thêm một failure test cho classification metrics và giải thích kết quả.
  en:
    task: Write a metric decision table, run cross-validation, tune one hyperparameter, and record results in a table.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain when accuracy, F1, PR-AUC, MAE, or calibration is the right choice.
    stretch: Add a failure test for classification metrics and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích classification metrics cho một đồng đội mới như thế nào?
  - Một assumption nào của classification metrics có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain classification metrics to a new teammate?
  - Which assumption behind classification metrics could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- σ(z) = 1 / (1 + e^(−z))
- precision = TP / (TP + FP)
code_examples:
- language: python
  title: 'Classification metrics: inspect one complete path'
  code: "# Topic: Classification metrics (phase-03-classical-ml-evaluation-1)\ndef accuracy(y_true: list[int], y_pred: list[int])\
    \ -> float:\n    if len(y_true) != len(y_pred) or not y_true:\n        raise ValueError('non-empty aligned labels are\
    \ required')\n    return sum(a == b for a, b in zip(y_true, y_pred)) / len(y_true)\n\nprint(accuracy([1, 0, 1], [1, 1,\
    \ 1]))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của classification metrics.
  purpose_en: Illustrate the input-to-output path for classification metrics.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ một baseline và kiểm tra định dạng label trước khi diễn giải metric.
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
- exercise-3-evaluation
review_item_ids:
- phase-03-classical-ml-evaluation-1-recall
- phase-03-classical-ml-evaluation-1-application
- phase-03-classical-ml-evaluation-1-debug
- phase-03-classical-ml-evaluation-1-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của classification metrics.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng classification metrics và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng classification metrics.
- Đánh giá classification metrics bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ classification metrics mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-03-classical-ml-evaluation-2
- phase-03-classical-ml-evaluation-3
review_question_vi: Định nghĩa classification metrics bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define classification metrics in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng classification metrics. Hãy liên
  hệ cụ thể với classification metrics trong lesson phase-03-classical-ml-evaluation-1.
review_answer_en: A strong answer names the input, transformation, output and the context where classification metrics is
  used. Relate it specifically to classification metrics in lesson phase-03-classical-ml-evaluation-1.
review_cards:
- id: phase-03-classical-ml-evaluation-1-recall
  type: recall
  question_vi: Định nghĩa classification metrics bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define classification metrics in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng classification metrics.
  answer_en: A strong answer names the input, transformation, output and the context where classification metrics is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-03-classical-ml-evaluation-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng classification metrics cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies classification metrics to an AI engineering problem.
  answer_vi: Ví dụ cho classification metrics cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-03-classical-ml-evaluation-1).
  answer_en: The classification metrics example should have an explicit input, expected output and a way to run or verify
    it (phase-03-classical-ml-evaluation-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-03-classical-ml-evaluation-1-debug
  type: debug
  question_vi: Nếu kết quả của classification metrics sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If classification metrics produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với classification metrics, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test
    nhỏ và error analysis (phase-03-classical-ml-evaluation-1).
  answer_en: For classification metrics, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-03-classical-ml-evaluation-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-03-classical-ml-evaluation-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của classification metrics như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of classification metrics?
  answer_vi: Câu trả lời về classification metrics cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-03-classical-ml-evaluation-1).
  answer_en: The answer about classification metrics should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-03-classical-ml-evaluation-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Classification metrics / Classification metrics

Classification metrics là một kỹ năng Software Engineering dùng để biến ý tưởng thành code có thể đọc, kiểm tra và bảo trì. Hãy xác định input, output, invariant và lỗi có thể xảy ra trước khi viết implementation. Trong Python, giữ boundary nhỏ giúp test nhanh và traceback chỉ ra đúng lớp lỗi.

## Practice

Viết metric decision table, chạy cross-validation, tune một hyperparameter và lưu kết quả vào bảng.
