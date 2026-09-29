---
lesson_id: phase-03-classical-ml-ml-framing-2
phase_id: phase-03-classical-ml
module_id: ml-framing
title_vi: Dataset, feature và label
title_en: Datasets, features and labels
summary_vi: Học Dataset, feature và label qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge
  case.
summary_en: Learn Datasets, features and labels through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích dataset, feature và label bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng dataset, feature và label.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain datasets, features and labels with a concrete example.
- Write or adapt a small code example applying datasets, features and labels.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-03-classical-ml-ml-framing-1
- phase-02-math-ml-linear-algebra-1
key_terms:
- dataset
- feature
- label
- baseline
- evaluation
- ml-framing
concept_notes_vi: 'Dataset, feature và label là một quyết định trong classical Machine Learning: xác định label, baseline,
  split và metric trước khi chọn model. Preprocessing phải fit chỉ trên train; error analysis cần chỉ ra nhóm dữ liệu làm
  model sai và cách kiểm tra lại giả thuyết.'
concept_notes_en: 'Dataset, feature và label is a classical Machine Learning decision: define the label, baseline, split,
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
    stretch: Viết thêm một failure test cho dataset, feature và label và giải thích kết quả.
  en:
    task: Write a data dictionary, define the target and a naive baseline, then list every possible leakage point.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can defend the split and metric to a reviewer even when the score is low.
    stretch: Add a failure test for datasets, features and labels and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích dataset, feature và label cho một đồng đội mới như thế nào?
  - Một assumption nào của dataset, feature và label có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain datasets, features and labels to a new teammate?
  - Which assumption behind datasets, features and labels could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Datasets, features and labels: inspect one complete path'
  code: "# Topic: Datasets, features and labels (phase-03-classical-ml-ml-framing-2)\ndef accuracy(y_true: list[int], y_pred:\
    \ list[int]) -> float:\n    if len(y_true) != len(y_pred) or not y_true:\n        raise ValueError('non-empty aligned\
    \ labels are required')\n    return sum(a == b for a, b in zip(y_true, y_pred)) / len(y_true)\n\nprint(accuracy([1, 0,\
    \ 1], [1, 1, 1]))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của dataset, feature và label.
  purpose_en: Illustrate the input-to-output path for datasets, features and labels.
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
- exercise-3-ml-framing
review_item_ids:
- phase-03-classical-ml-ml-framing-2-recall
- phase-03-classical-ml-ml-framing-2-application
- phase-03-classical-ml-ml-framing-2-debug
- phase-03-classical-ml-ml-framing-2-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của dataset, feature và label.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng dataset, feature và label và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng dataset, feature và label.
- Đánh giá dataset, feature và label bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ dataset, feature và label mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-03-classical-ml-ml-framing-3
- phase-03-classical-ml-ml-framing-4
review_question_vi: Định nghĩa dataset, feature và label bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define datasets, features and labels in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng dataset, feature và label. Hãy
  liên hệ cụ thể với dataset, feature và label trong lesson phase-03-classical-ml-ml-framing-2.
review_answer_en: A strong answer names the input, transformation, output and the context where datasets, features and labels
  is used. Relate it specifically to datasets, features and labels in lesson phase-03-classical-ml-ml-framing-2.
review_cards:
- id: phase-03-classical-ml-ml-framing-2-recall
  type: recall
  question_vi: Định nghĩa dataset, feature và label bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define datasets, features and labels in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng dataset, feature và label.
  answer_en: A strong answer names the input, transformation, output and the context where datasets, features and labels is
    used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-03-classical-ml-ml-framing-2-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng dataset, feature và label cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies datasets, features and labels to an AI engineering problem.
  answer_vi: Ví dụ cho dataset, feature và label cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-03-classical-ml-ml-framing-2).
  answer_en: The datasets, features and labels example should have an explicit input, expected output and a way to run or
    verify it (phase-03-classical-ml-ml-framing-2).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-03-classical-ml-ml-framing-2-debug
  type: debug
  question_vi: Nếu kết quả của dataset, feature và label sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If datasets, features and labels produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với dataset, feature và label, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-03-classical-ml-ml-framing-2).
  answer_en: For datasets, features and labels, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-03-classical-ml-ml-framing-2).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-03-classical-ml-ml-framing-2-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của dataset, feature và label như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of datasets, features and labels?
  answer_vi: Câu trả lời về dataset, feature và label cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-03-classical-ml-ml-framing-2).
  answer_en: The answer about datasets, features and labels should cover assumptions, metrics/cost, limitations and how to
    reduce production risk (phase-03-classical-ml-ml-framing-2).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Dataset, feature và label / Datasets, features and labels

Dataset, feature và label là một quyết định trong classical Machine Learning: xác định label, baseline, split và metric trước khi chọn model. Preprocessing phải fit chỉ trên train; error analysis cần chỉ ra nhóm dữ liệu làm model sai và cách kiểm tra lại giả thuyết.

## Practice

Viết data dictionary, xác định target và baseline ngây thơ, sau đó lập bảng các điểm có thể leakage.
