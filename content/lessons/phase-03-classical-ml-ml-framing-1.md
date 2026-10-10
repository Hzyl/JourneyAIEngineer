---
lesson_id: phase-03-classical-ml-ml-framing-1
phase_id: phase-03-classical-ml
module_id: ml-framing
title_vi: Học có giám sát và không giám sát
title_en: Supervised and unsupervised learning
summary_vi: Học có giám sát dùng nhãn mục tiêu để học quan hệ dự đoán.
summary_en: Learn Supervised and unsupervised learning through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Phân biệt hai loại bài toán qua dữ liệu và cách đánh giá.
- Kiểm tra thời điểm có sẵn của dữ liệu và nguy cơ rò rỉ giữa các tập.
- Giải thích kết quả và nêu một giới hạn của bài làm.
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
concept_notes_vi: Học có giám sát dùng nhãn mục tiêu để học quan hệ dự đoán. Học không giám sát tìm cấu trúc trong
  dữ liệu khi không có nhãn tương ứng.
concept_notes_en: 'Supervised và unsupervised is a classical Machine Learning decision: define the label, baseline,
  split, and metric before choosing a model. Fit preprocessing on train only; error analysis should identify the
  groups where the model fails and how to retest the hypothesis.'
why_it_matters_vi: Làm rõ người dùng, nhãn, cách chia dữ liệu và mốc so sánh trước khi chọn mô hình.
why_it_matters_en: 'Frame the problem before choosing a model: user, label, split, baseline, and leakage risks.'
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Supervised and unsupervised learning” trong tài liệu tham khảo; đối chiếu với phần giải
  thích của bài.
- Phân biệt hai loại bài toán qua dữ liệu và cách đánh giá.
- Kiểm tra thời điểm có sẵn của dữ liệu và nguy cơ rò rỉ giữa các tập. Ghi kết quả đối chiếu và điều bạn đã sửa
  nếu lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Frame the problem before choosing a model: user, label, split, baseline, and
  leakage risks.'
- Open scikit-learn User Guide, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Write a data dictionary, define the target and a naive baseline, then list every
  possible leakage point.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Phân biệt hai loại bài toán qua dữ liệu và cách đánh giá.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết từ điển dữ liệu, xác định mục tiêu,
      chọn dự đoán đơn giản làm mốc và liệt kê nguy cơ rò rỉ dữ liệu.'
    deliverables:
    - Mô tả mục tiêu, dữ liệu và cách đánh giá đã chọn
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Kiểm tra thời điểm có sẵn của dữ liệu và nguy cơ rò rỉ giữa các tập.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
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
  - Bạn sẽ giải thích nội dung “Học có giám sát và không giám sát” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain supervised and unsupervised learning to a new teammate?
  - Which assumption behind supervised and unsupervised learning could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Supervised and unsupervised learning: inspect one complete path'
  code: "# Topic: Supervised and unsupervised learning (phase-03-classical-ml-ml-framing-1)\nfrom dataclasses import\
    \ dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for supervised and unsupervised learning.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: scikit-learn User Guide
  url: https://scikit-learn.org/stable/user_guide.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: scikit-learn Model Evaluation
  url: https://scikit-learn.org/stable/modules/model_evaluation.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: scikit-learn Pipelines
  url: https://scikit-learn.org/stable/modules/compose.html
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
- exercise-3-ml-framing
review_item_ids:
- phase-03-classical-ml-ml-framing-1-recall
- phase-03-classical-ml-ml-framing-1-application
- phase-03-classical-ml-ml-framing-1-debug
- phase-03-classical-ml-ml-framing-1-interview
estimated_minutes: 60
completion_checklist:
- Phân biệt hai loại bài toán qua dữ liệu và cách đánh giá.
- Kiểm tra thời điểm có sẵn của dữ liệu và nguy cơ rò rỉ giữa các tập.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Phân biệt hai loại bài toán qua dữ liệu và cách đánh giá.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Kiểm tra thời điểm có sẵn của dữ liệu và nguy cơ rò rỉ giữa các tập.
common_mistakes:
- Dùng thông tin chỉ có sau thời điểm dự đoán làm đặc trưng đầu vào.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-03-classical-ml-ml-framing-2
- phase-03-classical-ml-ml-framing-3
review_question_vi: Nội dung cốt lõi của “Học có giám sát và không giám sát” là gì?
review_question_en: Define supervised and unsupervised learning in your own words. What are the input, transformation
  and output?
review_answer_vi: Học có giám sát dùng nhãn mục tiêu để học quan hệ dự đoán. Học không giám sát tìm cấu trúc trong
  dữ liệu khi không có nhãn tương ứng.
review_answer_en: A strong answer names the input, transformation, output and the context where supervised and unsupervised
  learning is used. Relate it specifically to supervised and unsupervised learning in lesson phase-03-classical-ml-ml-framing-1.
review_cards:
- id: phase-03-classical-ml-ml-framing-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Học có giám sát và không giám sát” là gì?
  question_en: Define supervised and unsupervised learning in your own words. What are the input, transformation
    and output?
  answer_vi: Học có giám sát dùng nhãn mục tiêu để học quan hệ dự đoán. Học không giám sát tìm cấu trúc trong dữ
    liệu khi không có nhãn tương ứng.
  answer_en: A strong answer names the input, transformation, output and the context where supervised and unsupervised
    learning is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-03-classical-ml-ml-framing-1-application
  type: application
  question_vi: Phân biệt hai loại bài toán qua dữ liệu và cách đánh giá.
  question_en: Write a small code example or design that applies supervised and unsupervised learning to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Phân biệt hai loại bài toán qua dữ liệu và cách đánh giá”, cần lưu: mô tả mục tiêu,
    dữ liệu và cách đánh giá đã chọn. Kiểm tra thời điểm có sẵn của dữ liệu và nguy cơ rò rỉ giữa các tập.'
  answer_en: The supervised and unsupervised learning example should have an explicit input, expected output and
    a way to run or verify it (phase-03-classical-ml-ml-framing-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-03-classical-ml-ml-framing-1-debug
  type: debug
  question_vi: Khi làm bài “Học có giám sát và không giám sát”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If supervised and unsupervised learning produces a wrong result or a metric drops, what would you
    debug first?
  answer_vi: 'Trong bài “Học có giám sát và không giám sát”, lỗi cần tránh là: dùng thông tin chỉ có sau thời điểm
    dự đoán làm đặc trưng đầu vào. Kiểm tra thời điểm có sẵn của dữ liệu và nguy cơ rò rỉ giữa các tập. Dùng ví
    dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For supervised and unsupervised learning, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-03-classical-ml-ml-framing-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-03-classical-ml-ml-framing-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Học có giám sát và không giám sát” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of supervised and unsupervised
    learning?
  answer_vi: Bắt đầu từ nhiệm vụ “Phân biệt hai loại bài toán qua dữ liệu và cách đánh giá”. Trình bày kết quả đã
    lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about supervised and unsupervised learning should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-03-classical-ml-ml-framing-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Học có giám sát và không giám sát / Supervised and unsupervised learning

Học có giám sát dùng nhãn mục tiêu để học quan hệ dự đoán. Học không giám sát tìm cấu trúc trong dữ liệu khi không có nhãn tương ứng.

## Thực hành

Phân biệt hai loại bài toán qua dữ liệu và cách đánh giá.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết từ điển dữ liệu, xác định mục tiêu, chọn dự đoán đơn giản làm mốc và liệt kê nguy cơ rò rỉ dữ liệu.
