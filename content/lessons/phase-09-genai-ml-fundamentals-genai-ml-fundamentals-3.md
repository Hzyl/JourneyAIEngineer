---
lesson_id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-3
phase_id: phase-09-genai-ml-fundamentals
module_id: genai-ml-fundamentals
title_vi: Chia dữ liệu và ngăn rò rỉ
title_en: Train, validation, test, and leakage
summary_vi: Dữ liệu gần trùng hoặc cùng nguồn có thể làm kết quả đánh giá quá lạc quan nếu nằm ở nhiều tập.
summary_en: Learn Train, validation, test, and leakage through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Kiểm tra mẫu trùng và quan hệ nguồn trước khi chia ba tập dữ liệu.
- Đối chiếu thước đo với mục tiêu và kiểm tra mẫu trùng giữa các tập.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain train, validation, test, and leakage with a concrete example.
- Write or adapt a small code example applying train, validation, test, and leakage.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2
- phase-08-genai-software-genai-software-foundations-1
key_terms:
- train
- validation
- test
- leakage
- dataset
- feature
- baseline
- evaluation
- genai-ml-fundamentals
concept_notes_vi: Dữ liệu gần trùng hoặc cùng nguồn có thể làm kết quả đánh giá quá lạc quan nếu nằm ở nhiều tập.
  Chia dữ liệu theo đơn vị phù hợp với cách hệ thống sẽ được sử dụng.
concept_notes_en: 'Train, validation, test và leakage is a classical Machine Learning decision: define the label,
  baseline, split, and metric before choosing a model. Fit preprocessing on train only; error analysis should identify
  the groups where the model fails and how to retest the hypothesis.'
why_it_matters_vi: Liên hệ embedding và thước đo với truy xuất, phân nhóm và chất lượng mô hình.
why_it_matters_en: Embeddings and metrics connect user data to retrieval, clustering, and model quality.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Train, validation, test, and leakage” trong tài liệu tham khảo; đối chiếu với phần giải
  thích của bài.
- Kiểm tra mẫu trùng và quan hệ nguồn trước khi chia ba tập dữ liệu.
- Đối chiếu thước đo với mục tiêu và kiểm tra mẫu trùng giữa các tập. Ghi kết quả đối chiếu và điều bạn đã sửa nếu
  lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Embeddings and metrics connect user data to retrieval, clustering, and model
  quality.'
- Open Google Machine Learning Crash Course, read the section marked Read this lesson, and record one verified example
  or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Build a small embedding benchmark: split data, measure cosine similarity, check leakage,
  and plot a loss curve.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Kiểm tra mẫu trùng và quan hệ nguồn trước khi chia ba tập dữ liệu.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo phép đánh giá embedding nhỏ: chia
      dữ liệu, đo cosine similarity, kiểm tra rò rỉ và vẽ đồ thị mất mát.'
    deliverables:
    - Dữ liệu mẫu và bảng đánh giá có cách chia rõ ràng
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Đối chiếu thước đo với mục tiêu và kiểm tra mẫu trùng giữa các tập.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: 'Build a small embedding benchmark: split data, measure cosine similarity, check leakage, and plot a loss
      curve.'
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can explain a similarity score, a valid split, and how overfitting degrades retrieval.
    stretch: Add a failure test for train, validation, test, and leakage and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Chia dữ liệu và ngăn rò rỉ” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain train, validation, test, and leakage to a new teammate?
  - Which assumption behind train, validation, test, and leakage could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Train, validation, test, and leakage: inspect one complete path'
  code: "# Topic: Train, validation, test, and leakage (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-3)\n\
    def accuracy(y_true: list[int], y_pred: list[int]) -> float:\n    if len(y_true) != len(y_pred) or not y_true:\n\
    \        raise ValueError('non-empty aligned labels are required')\n    return sum(a == b for a, b in zip(y_true,\
    \ y_pred)) / len(y_true)\n\nprint(accuracy([1, 0, 1], [1, 1, 1]))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for train, validation, test, and leakage.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Google Machine Learning Crash Course
  url: https://developers.google.com/machine-learning/crash-course
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
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
  title: Sentence Transformers
  url: https://www.sbert.net/
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
- exercise-9-genai-ml-fundamentals
review_item_ids:
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-3-recall
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-3-application
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-3-debug
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-3-interview
estimated_minutes: 60
completion_checklist:
- Kiểm tra mẫu trùng và quan hệ nguồn trước khi chia ba tập dữ liệu.
- Đối chiếu thước đo với mục tiêu và kiểm tra mẫu trùng giữa các tập.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Kiểm tra mẫu trùng và quan hệ nguồn trước khi chia ba tập dữ liệu.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Đối chiếu thước đo với mục tiêu và kiểm tra mẫu trùng giữa các tập.
common_mistakes:
- Dùng tập đánh giá có bản sao của dữ liệu huấn luyện.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4
- phase-10-genai-transformers-genai-transformers-1
review_question_vi: Nội dung cốt lõi của “Chia dữ liệu và ngăn rò rỉ” là gì?
review_question_en: Define train, validation, test, and leakage in your own words. What are the input, transformation
  and output?
review_answer_vi: Dữ liệu gần trùng hoặc cùng nguồn có thể làm kết quả đánh giá quá lạc quan nếu nằm ở nhiều tập.
  Chia dữ liệu theo đơn vị phù hợp với cách hệ thống sẽ được sử dụng.
review_answer_en: A strong answer names the input, transformation, output and the context where train, validation,
  test, and leakage is used. Relate it specifically to train, validation, test, and leakage in lesson phase-09-genai-ml-fundamentals-genai-ml-fundamentals-3.
review_cards:
- id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Chia dữ liệu và ngăn rò rỉ” là gì?
  question_en: Define train, validation, test, and leakage in your own words. What are the input, transformation
    and output?
  answer_vi: Dữ liệu gần trùng hoặc cùng nguồn có thể làm kết quả đánh giá quá lạc quan nếu nằm ở nhiều tập. Chia
    dữ liệu theo đơn vị phù hợp với cách hệ thống sẽ được sử dụng.
  answer_en: A strong answer names the input, transformation, output and the context where train, validation, test,
    and leakage is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-3-application
  type: application
  question_vi: Kiểm tra mẫu trùng và quan hệ nguồn trước khi chia ba tập dữ liệu.
  question_en: Write a small code example or design that applies train, validation, test, and leakage to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Kiểm tra mẫu trùng và quan hệ nguồn trước khi chia ba tập dữ liệu”, cần lưu: dữ liệu
    mẫu và bảng đánh giá có cách chia rõ ràng. Đối chiếu thước đo với mục tiêu và kiểm tra mẫu trùng giữa các tập.'
  answer_en: The train, validation, test, and leakage example should have an explicit input, expected output and
    a way to run or verify it (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-3-debug
  type: debug
  question_vi: Khi làm bài “Chia dữ liệu và ngăn rò rỉ”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If train, validation, test, and leakage produces a wrong result or a metric drops, what would you
    debug first?
  answer_vi: 'Trong bài “Chia dữ liệu và ngăn rò rỉ”, lỗi cần tránh là: dùng tập đánh giá có bản sao của dữ liệu
    huấn luyện. Đối chiếu thước đo với mục tiêu và kiểm tra mẫu trùng giữa các tập. Dùng ví dụ nhỏ để tìm bước đầu
    tiên có kết quả khác dự kiến.'
  answer_en: For train, validation, test, and leakage, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Chia dữ liệu và ngăn rò rỉ” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of train, validation, test,
    and leakage?
  answer_vi: Bắt đầu từ nhiệm vụ “Kiểm tra mẫu trùng và quan hệ nguồn trước khi chia ba tập dữ liệu”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about train, validation, test, and leakage should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Chia dữ liệu và ngăn rò rỉ / Train, validation, test, and leakage

Dữ liệu gần trùng hoặc cùng nguồn có thể làm kết quả đánh giá quá lạc quan nếu nằm ở nhiều tập. Chia dữ liệu theo đơn vị phù hợp với cách hệ thống sẽ được sử dụng.

## Thực hành

Kiểm tra mẫu trùng và quan hệ nguồn trước khi chia ba tập dữ liệu.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo phép đánh giá embedding nhỏ: chia dữ liệu, đo cosine similarity, kiểm tra rò rỉ và vẽ đồ thị mất mát.
