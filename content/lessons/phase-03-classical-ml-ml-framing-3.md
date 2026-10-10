---
lesson_id: phase-03-classical-ml-ml-framing-3
phase_id: phase-03-classical-ml
module_id: ml-framing
title_vi: Chia tập huấn luyện, kiểm định và kiểm tra
title_en: Train, validation and test splits
summary_vi: Tập huấn luyện dùng để học tham số, tập kiểm định giúp chọn mô hình, tập kiểm tra dùng cho đánh giá
  cuối.
summary_en: Learn Train, validation and test splits through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Đề xuất cách chia dữ liệu và giải thích cách ngăn thông tin lọt giữa các tập.
- Kiểm tra thời điểm có sẵn của dữ liệu và nguy cơ rò rỉ giữa các tập.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain train, validation and test splits with a concrete example.
- Write or adapt a small code example applying train, validation and test splits.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-03-classical-ml-ml-framing-2
- phase-02-math-ml-linear-algebra-1
key_terms:
- train
- validation
- test
- split
- dataset
- feature
- baseline
- evaluation
- ml-framing
concept_notes_vi: Tập huấn luyện dùng để học tham số, tập kiểm định giúp chọn mô hình, tập kiểm tra dùng cho đánh
  giá cuối. Cách chia cần tôn trọng thời gian và các nhóm mẫu liên quan.
concept_notes_en: Train validation test split is a concept in the ml-framing module. Identify the inputs, outputs,
  assumptions, failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Làm rõ người dùng, nhãn, cách chia dữ liệu và mốc so sánh trước khi chọn mô hình.
why_it_matters_en: 'Frame the problem before choosing a model: user, label, split, baseline, and leakage risks.'
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Train, validation and test splits” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- Đề xuất cách chia dữ liệu và giải thích cách ngăn thông tin lọt giữa các tập.
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
    task: 'Đề xuất cách chia dữ liệu và giải thích cách ngăn thông tin lọt giữa các tập.


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
    stretch: Add a failure test for train, validation and test splits and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Chia tập huấn luyện, kiểm định và kiểm tra” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain train, validation and test splits to a new teammate?
  - Which assumption behind train, validation and test splits could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Train, validation and test splits: inspect one complete path'
  code: "# Topic: Train, validation and test splits (phase-03-classical-ml-ml-framing-3)\nfrom dataclasses import\
    \ dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for train, validation and test splits.
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
- phase-03-classical-ml-ml-framing-3-recall
- phase-03-classical-ml-ml-framing-3-application
- phase-03-classical-ml-ml-framing-3-debug
- phase-03-classical-ml-ml-framing-3-interview
estimated_minutes: 60
completion_checklist:
- Đề xuất cách chia dữ liệu và giải thích cách ngăn thông tin lọt giữa các tập.
- Kiểm tra thời điểm có sẵn của dữ liệu và nguy cơ rò rỉ giữa các tập.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Đề xuất cách chia dữ liệu và giải thích cách ngăn thông tin lọt giữa các tập.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Kiểm tra thời điểm có sẵn của dữ liệu và nguy cơ rò rỉ giữa các tập.
common_mistakes:
- Dùng thông tin chỉ có sau thời điểm dự đoán làm đặc trưng đầu vào.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-03-classical-ml-ml-framing-4
- phase-03-classical-ml-models-1
review_question_vi: Nội dung cốt lõi của “Chia tập huấn luyện, kiểm định và kiểm tra” là gì?
review_question_en: Define train, validation and test splits in your own words. What are the input, transformation
  and output?
review_answer_vi: Tập huấn luyện dùng để học tham số, tập kiểm định giúp chọn mô hình, tập kiểm tra dùng cho đánh
  giá cuối. Cách chia cần tôn trọng thời gian và các nhóm mẫu liên quan.
review_answer_en: A strong answer names the input, transformation, output and the context where train, validation
  and test splits is used. Relate it specifically to train, validation and test splits in lesson phase-03-classical-ml-ml-framing-3.
review_cards:
- id: phase-03-classical-ml-ml-framing-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Chia tập huấn luyện, kiểm định và kiểm tra” là gì?
  question_en: Define train, validation and test splits in your own words. What are the input, transformation and
    output?
  answer_vi: Tập huấn luyện dùng để học tham số, tập kiểm định giúp chọn mô hình, tập kiểm tra dùng cho đánh giá
    cuối. Cách chia cần tôn trọng thời gian và các nhóm mẫu liên quan.
  answer_en: A strong answer names the input, transformation, output and the context where train, validation and
    test splits is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-03-classical-ml-ml-framing-3-application
  type: application
  question_vi: Đề xuất cách chia dữ liệu và giải thích cách ngăn thông tin lọt giữa các tập.
  question_en: Write a small code example or design that applies train, validation and test splits to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Đề xuất cách chia dữ liệu và giải thích cách ngăn thông tin lọt giữa các tập”, cần lưu:
    mô tả mục tiêu, dữ liệu và cách đánh giá đã chọn. Kiểm tra thời điểm có sẵn của dữ liệu và nguy cơ rò rỉ giữa
    các tập.'
  answer_en: The train, validation and test splits example should have an explicit input, expected output and a
    way to run or verify it (phase-03-classical-ml-ml-framing-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-03-classical-ml-ml-framing-3-debug
  type: debug
  question_vi: Khi làm bài “Chia tập huấn luyện, kiểm định và kiểm tra”, bạn cần tránh lỗi nào và kiểm tra lại ra
    sao?
  question_en: If train, validation and test splits produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Chia tập huấn luyện, kiểm định và kiểm tra”, lỗi cần tránh là: dùng thông tin chỉ có sau
    thời điểm dự đoán làm đặc trưng đầu vào. Kiểm tra thời điểm có sẵn của dữ liệu và nguy cơ rò rỉ giữa các tập.
    Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For train, validation and test splits, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-03-classical-ml-ml-framing-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-03-classical-ml-ml-framing-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Chia tập huấn luyện, kiểm định và kiểm tra” để giải thích cách làm và
    giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of train, validation and test
    splits?
  answer_vi: Bắt đầu từ nhiệm vụ “Đề xuất cách chia dữ liệu và giải thích cách ngăn thông tin lọt giữa các tập”.
    Trình bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại
    định nghĩa.
  answer_en: The answer about train, validation and test splits should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-03-classical-ml-ml-framing-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Chia tập huấn luyện, kiểm định và kiểm tra / Train, validation and test splits

Tập huấn luyện dùng để học tham số, tập kiểm định giúp chọn mô hình, tập kiểm tra dùng cho đánh giá cuối. Cách chia cần tôn trọng thời gian và các nhóm mẫu liên quan.

## Thực hành

Đề xuất cách chia dữ liệu và giải thích cách ngăn thông tin lọt giữa các tập.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết từ điển dữ liệu, xác định mục tiêu, chọn dự đoán đơn giản làm mốc và liệt kê nguy cơ rò rỉ dữ liệu.
