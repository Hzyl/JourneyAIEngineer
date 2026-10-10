---
lesson_id: phase-03-classical-ml-analysis-1
phase_id: phase-03-classical-ml
module_id: analysis
title_vi: Dữ liệu mất cân bằng lớp
title_en: Imbalanced data
summary_vi: Khi số mẫu giữa các lớp chênh lệch lớn, accuracy có thể che giấu khả năng nhận diện lớp hiếm.
summary_en: Learn Imbalanced data through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Đọc precision, recall của lớp hiếm và so sánh với mô hình luôn chọn lớp phổ biến.
- Kiểm tra theo nhóm dữ liệu và nêu giới hạn của kết luận.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain imbalanced data with a concrete example.
- Write or adapt a small code example applying imbalanced data.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-03-classical-ml-evaluation-4
- phase-02-math-ml-linear-algebra-1
key_terms:
- imbalanced
- data
- dataset
- feature
- baseline
- evaluation
- analysis
concept_notes_vi: Khi số mẫu giữa các lớp chênh lệch lớn, accuracy có thể che giấu khả năng nhận diện lớp hiếm.
  Cân nhắc thước đo, ngưỡng và cách lấy mẫu trong phạm vi tập huấn luyện.
concept_notes_en: Imbalanced data is a concept in the analysis module. Identify the inputs, outputs, assumptions,
  failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Phân tích lỗi theo nhóm để hiểu giới hạn trước khi lưu và chia sẻ mô hình.
why_it_matters_en: Move from one aggregate score to error analysis, calibration, a model card, and reloadable artifacts.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Imbalanced data” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Đọc precision, recall của lớp hiếm và so sánh với mô hình luôn chọn lớp phổ biến.
- Kiểm tra theo nhóm dữ liệu và nêu giới hạn của kết luận. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu
  chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Move from one aggregate score to error analysis, calibration, a model card,
  and reloadable artifacts.'
- Open scikit-learn User Guide, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Slice errors by group, inspect a confusion matrix, save the model/pipeline, and write
  a model card with limits.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Đọc precision, recall của lớp hiếm và so sánh với mô hình luôn chọn lớp phổ biến.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Đọc ma trận nhầm lẫn, chia lỗi theo
      nhóm, lưu mô hình cùng quy trình và viết thẻ mô tả giới hạn.'
    deliverables:
    - Bảng phân tích kết quả hoặc bản lưu mô hình có cách nạp lại
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Kiểm tra theo nhóm dữ liệu và nêu giới hạn của kết luận.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Slice errors by group, inspect a confusion matrix, save the model/pipeline, and write a model card with
      limits.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You know where and for whom the model fails and do not use a high score to hide limitations.
    stretch: Add a failure test for imbalanced data and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Dữ liệu mất cân bằng lớp” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain imbalanced data to a new teammate?
  - Which assumption behind imbalanced data could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Imbalanced data: inspect one complete path'
  code: "# Topic: Imbalanced data (phase-03-classical-ml-analysis-1)\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\n\
    class Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for imbalanced data.
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
- exercise-3-analysis
review_item_ids:
- phase-03-classical-ml-analysis-1-recall
- phase-03-classical-ml-analysis-1-application
- phase-03-classical-ml-analysis-1-debug
- phase-03-classical-ml-analysis-1-interview
estimated_minutes: 60
completion_checklist:
- Đọc precision, recall của lớp hiếm và so sánh với mô hình luôn chọn lớp phổ biến.
- Kiểm tra theo nhóm dữ liệu và nêu giới hạn của kết luận.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Đọc precision, recall của lớp hiếm và so sánh với mô hình luôn chọn lớp phổ biến.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Kiểm tra theo nhóm dữ liệu và nêu giới hạn của kết luận.
common_mistakes:
- Dùng điểm tổng hợp để che khuất nhóm dự đoán kém.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-03-classical-ml-analysis-2
- phase-03-classical-ml-analysis-3
review_question_vi: Nội dung cốt lõi của “Dữ liệu mất cân bằng lớp” là gì?
review_question_en: Define imbalanced data in your own words. What are the input, transformation and output?
review_answer_vi: Khi số mẫu giữa các lớp chênh lệch lớn, accuracy có thể che giấu khả năng nhận diện lớp hiếm.
  Cân nhắc thước đo, ngưỡng và cách lấy mẫu trong phạm vi tập huấn luyện.
review_answer_en: A strong answer names the input, transformation, output and the context where imbalanced data
  is used. Relate it specifically to imbalanced data in lesson phase-03-classical-ml-analysis-1.
review_cards:
- id: phase-03-classical-ml-analysis-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Dữ liệu mất cân bằng lớp” là gì?
  question_en: Define imbalanced data in your own words. What are the input, transformation and output?
  answer_vi: Khi số mẫu giữa các lớp chênh lệch lớn, accuracy có thể che giấu khả năng nhận diện lớp hiếm. Cân nhắc
    thước đo, ngưỡng và cách lấy mẫu trong phạm vi tập huấn luyện.
  answer_en: A strong answer names the input, transformation, output and the context where imbalanced data is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-03-classical-ml-analysis-1-application
  type: application
  question_vi: Đọc precision, recall của lớp hiếm và so sánh với mô hình luôn chọn lớp phổ biến.
  question_en: Write a small code example or design that applies imbalanced data to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Đọc precision, recall của lớp hiếm và so sánh với mô hình luôn chọn lớp phổ biến”, cần
    lưu: bảng phân tích kết quả hoặc bản lưu mô hình có cách nạp lại. Kiểm tra theo nhóm dữ liệu và nêu giới hạn
    của kết luận.'
  answer_en: The imbalanced data example should have an explicit input, expected output and a way to run or verify
    it (phase-03-classical-ml-analysis-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-03-classical-ml-analysis-1-debug
  type: debug
  question_vi: Khi làm bài “Dữ liệu mất cân bằng lớp”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If imbalanced data produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Dữ liệu mất cân bằng lớp”, lỗi cần tránh là: dùng điểm tổng hợp để che khuất nhóm dự đoán
    kém. Kiểm tra theo nhóm dữ liệu và nêu giới hạn của kết luận. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả
    khác dự kiến.'
  answer_en: For imbalanced data, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-03-classical-ml-analysis-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-03-classical-ml-analysis-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Dữ liệu mất cân bằng lớp” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of imbalanced data?
  answer_vi: Bắt đầu từ nhiệm vụ “Đọc precision, recall của lớp hiếm và so sánh với mô hình luôn chọn lớp phổ biến”.
    Trình bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại
    định nghĩa.
  answer_en: The answer about imbalanced data should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-03-classical-ml-analysis-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Dữ liệu mất cân bằng lớp / Imbalanced data

Khi số mẫu giữa các lớp chênh lệch lớn, accuracy có thể che giấu khả năng nhận diện lớp hiếm. Cân nhắc thước đo, ngưỡng và cách lấy mẫu trong phạm vi tập huấn luyện.

## Thực hành

Đọc precision, recall của lớp hiếm và so sánh với mô hình luôn chọn lớp phổ biến.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Đọc ma trận nhầm lẫn, chia lỗi theo nhóm, lưu mô hình cùng quy trình và viết thẻ mô tả giới hạn.
