---
lesson_id: phase-03-classical-ml-evaluation-2
phase_id: phase-03-classical-ml
module_id: evaluation
title_vi: Thước đo cho hồi quy
title_en: Regression metrics
summary_vi: MAE đo sai số tuyệt đối trung bình; MSE phạt sai số lớn mạnh hơn; RMSE đưa kết quả về đơn vị của biến
  mục tiêu.
summary_en: Learn Regression metrics through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- So sánh MAE và RMSE trên dữ liệu có một sai số lớn.
- Đối chiếu thước đo với loại sai lầm cần hạn chế.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain regression metrics with a concrete example.
- Write or adapt a small code example applying regression metrics.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-03-classical-ml-evaluation-1
- phase-02-math-ml-linear-algebra-1
key_terms:
- regression
- metrics
- dataset
- feature
- baseline
- evaluation
concept_notes_vi: MAE đo sai số tuyệt đối trung bình; MSE phạt sai số lớn mạnh hơn; RMSE đưa kết quả về đơn vị của
  biến mục tiêu. Cần đọc cả phân bố sai số và các nhóm dữ liệu quan trọng.
concept_notes_en: 'Regression metrics is a classical Machine Learning decision: define the label, baseline, split,
  and metric before choosing a model. Fit preprocessing on train only; error analysis should identify the groups
  where the model fails and how to retest the hypothesis.'
why_it_matters_vi: Chọn thước đo theo chi phí sai lầm và giữ tập kiểm tra ngoài quá trình lựa chọn mô hình.
why_it_matters_en: Choose metrics by error cost, use cross-validation, and tune without peeking at the test set.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Regression metrics” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- So sánh MAE và RMSE trên dữ liệu có một sai số lớn.
- Đối chiếu thước đo với loại sai lầm cần hạn chế. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Choose metrics by error cost, use cross-validation, and tune without peeking
  at the test set.'
- Open scikit-learn User Guide, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Write a metric decision table, run cross-validation, tune one hyperparameter, and
  record results in a table.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'So sánh MAE và RMSE trên dữ liệu có một sai số lớn.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Lập bảng chọn thước đo, chạy kiểm định
      chéo, điều chỉnh một siêu tham số và lưu kết quả so sánh.'
    deliverables:
    - Bảng thước đo, cách chia dữ liệu và lý do lựa chọn
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Đối chiếu thước đo với loại sai lầm cần hạn chế.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Write a metric decision table, run cross-validation, tune one hyperparameter, and record results in a
      table.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain when accuracy, F1, PR-AUC, MAE, or calibration is the right choice.
    stretch: Add a failure test for regression metrics and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Thước đo cho hồi quy” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain regression metrics to a new teammate?
  - Which assumption behind regression metrics could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- MSE = (1/n) Σ_i (y_i − ŷ_i)²
code_examples:
- language: python
  title: 'Regression metrics: inspect one complete path'
  code: "# Topic: Regression metrics (phase-03-classical-ml-evaluation-2)\ndef accuracy(y_true: list[int], y_pred:\
    \ list[int]) -> float:\n    if len(y_true) != len(y_pred) or not y_true:\n        raise ValueError('non-empty\
    \ aligned labels are required')\n    return sum(a == b for a, b in zip(y_true, y_pred)) / len(y_true)\n\nprint(accuracy([1,\
    \ 0, 1], [1, 1, 1]))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for regression metrics.
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
- exercise-3-evaluation
review_item_ids:
- phase-03-classical-ml-evaluation-2-recall
- phase-03-classical-ml-evaluation-2-application
- phase-03-classical-ml-evaluation-2-debug
- phase-03-classical-ml-evaluation-2-interview
estimated_minutes: 60
completion_checklist:
- So sánh MAE và RMSE trên dữ liệu có một sai số lớn.
- Đối chiếu thước đo với loại sai lầm cần hạn chế.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: So sánh MAE và RMSE trên dữ liệu có một sai số lớn.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Đối chiếu thước đo với loại sai lầm cần hạn chế.
common_mistakes:
- Dùng tập kiểm tra để liên tục chọn siêu tham số.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-03-classical-ml-evaluation-3
- phase-03-classical-ml-evaluation-4
review_question_vi: Nội dung cốt lõi của “Thước đo cho hồi quy” là gì?
review_question_en: Define regression metrics in your own words. What are the input, transformation and output?
review_answer_vi: MAE đo sai số tuyệt đối trung bình; MSE phạt sai số lớn mạnh hơn; RMSE đưa kết quả về đơn vị của
  biến mục tiêu. Cần đọc cả phân bố sai số và các nhóm dữ liệu quan trọng.
review_answer_en: A strong answer names the input, transformation, output and the context where regression metrics
  is used. Relate it specifically to regression metrics in lesson phase-03-classical-ml-evaluation-2.
review_cards:
- id: phase-03-classical-ml-evaluation-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Thước đo cho hồi quy” là gì?
  question_en: Define regression metrics in your own words. What are the input, transformation and output?
  answer_vi: MAE đo sai số tuyệt đối trung bình; MSE phạt sai số lớn mạnh hơn; RMSE đưa kết quả về đơn vị của biến
    mục tiêu. Cần đọc cả phân bố sai số và các nhóm dữ liệu quan trọng.
  answer_en: A strong answer names the input, transformation, output and the context where regression metrics is
    used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-03-classical-ml-evaluation-2-application
  type: application
  question_vi: So sánh MAE và RMSE trên dữ liệu có một sai số lớn.
  question_en: Write a small code example or design that applies regression metrics to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “So sánh MAE và RMSE trên dữ liệu có một sai số lớn”, cần lưu: bảng thước đo, cách chia
    dữ liệu và lý do lựa chọn. Đối chiếu thước đo với loại sai lầm cần hạn chế.'
  answer_en: The regression metrics example should have an explicit input, expected output and a way to run or verify
    it (phase-03-classical-ml-evaluation-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-03-classical-ml-evaluation-2-debug
  type: debug
  question_vi: Khi làm bài “Thước đo cho hồi quy”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If regression metrics produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Thước đo cho hồi quy”, lỗi cần tránh là: dùng tập kiểm tra để liên tục chọn siêu tham số.
    Đối chiếu thước đo với loại sai lầm cần hạn chế. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For regression metrics, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-03-classical-ml-evaluation-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-03-classical-ml-evaluation-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Thước đo cho hồi quy” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of regression metrics?
  answer_vi: Bắt đầu từ nhiệm vụ “So sánh MAE và RMSE trên dữ liệu có một sai số lớn”. Trình bày kết quả đã lưu,
    cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about regression metrics should cover assumptions, metrics/cost, limitations and how to
    reduce production risk (phase-03-classical-ml-evaluation-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Thước đo cho hồi quy / Regression metrics

MAE đo sai số tuyệt đối trung bình; MSE phạt sai số lớn mạnh hơn; RMSE đưa kết quả về đơn vị của biến mục tiêu. Cần đọc cả phân bố sai số và các nhóm dữ liệu quan trọng.

## Thực hành

So sánh MAE và RMSE trên dữ liệu có một sai số lớn.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Lập bảng chọn thước đo, chạy kiểm định chéo, điều chỉnh một siêu tham số và lưu kết quả so sánh.
