---
lesson_id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1
phase_id: phase-09-genai-ml-fundamentals
module_id: genai-ml-fundamentals
title_vi: Học có giám sát và không giám sát cho GenAI
title_en: Supervised and unsupervised learning
summary_vi: Nhiệm vụ phân loại có nhãn và nhiệm vụ tìm nhóm dữ liệu đòi hỏi cách đánh giá khác nhau.
summary_en: Learn Supervised and unsupervised learning through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Phân loại hai tình huống GenAI theo dữ liệu nhãn và mục tiêu đánh giá.
- Đối chiếu thước đo với mục tiêu và kiểm tra mẫu trùng giữa các tập.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain supervised and unsupervised learning with a concrete example.
- Write or adapt a small code example applying supervised and unsupervised learning.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-08-genai-software-genai-software-foundations-4
- phase-08-genai-software-genai-software-foundations-1
key_terms:
- supervised
- unsupervised
- learning
- dataset
- feature
- baseline
- evaluation
- genai-ml-fundamentals
concept_notes_vi: Nhiệm vụ phân loại có nhãn và nhiệm vụ tìm nhóm dữ liệu đòi hỏi cách đánh giá khác nhau. Xác định
  mục tiêu trước khi chọn biểu diễn hoặc thuật toán.
concept_notes_en: 'Supervised và unsupervised learning is a classical Machine Learning decision: define the label,
  baseline, split, and metric before choosing a model. Fit preprocessing on train only; error analysis should identify
  the groups where the model fails and how to retest the hypothesis.'
why_it_matters_vi: Liên hệ embedding và thước đo với truy xuất, phân nhóm và chất lượng mô hình.
why_it_matters_en: Embeddings and metrics connect user data to retrieval, clustering, and model quality.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Supervised and unsupervised learning” trong tài liệu tham khảo; đối chiếu với phần giải
  thích của bài.
- Phân loại hai tình huống GenAI theo dữ liệu nhãn và mục tiêu đánh giá.
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
    task: 'Phân loại hai tình huống GenAI theo dữ liệu nhãn và mục tiêu đánh giá.


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
    stretch: Add a failure test for supervised and unsupervised learning and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Học có giám sát và không giám sát cho GenAI” bằng ví dụ nào?
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
  code: "# Topic: Supervised and unsupervised learning (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1)\n\
    from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\
    \nresult = Result(value='ready', valid=True)\nprint(result)"
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
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1-recall
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1-application
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1-debug
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1-interview
estimated_minutes: 60
completion_checklist:
- Phân loại hai tình huống GenAI theo dữ liệu nhãn và mục tiêu đánh giá.
- Đối chiếu thước đo với mục tiêu và kiểm tra mẫu trùng giữa các tập.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Phân loại hai tình huống GenAI theo dữ liệu nhãn và mục tiêu đánh giá.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Đối chiếu thước đo với mục tiêu và kiểm tra mẫu trùng giữa các tập.
common_mistakes:
- Dùng tập đánh giá có bản sao của dữ liệu huấn luyện.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-3
review_question_vi: Nội dung cốt lõi của “Học có giám sát và không giám sát cho GenAI” là gì?
review_question_en: Define supervised and unsupervised learning in your own words. What are the input, transformation
  and output?
review_answer_vi: Nhiệm vụ phân loại có nhãn và nhiệm vụ tìm nhóm dữ liệu đòi hỏi cách đánh giá khác nhau. Xác định
  mục tiêu trước khi chọn biểu diễn hoặc thuật toán.
review_answer_en: A strong answer names the input, transformation, output and the context where supervised and unsupervised
  learning is used. Relate it specifically to supervised and unsupervised learning in lesson phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1.
review_cards:
- id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Học có giám sát và không giám sát cho GenAI” là gì?
  question_en: Define supervised and unsupervised learning in your own words. What are the input, transformation
    and output?
  answer_vi: Nhiệm vụ phân loại có nhãn và nhiệm vụ tìm nhóm dữ liệu đòi hỏi cách đánh giá khác nhau. Xác định mục
    tiêu trước khi chọn biểu diễn hoặc thuật toán.
  answer_en: A strong answer names the input, transformation, output and the context where supervised and unsupervised
    learning is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1-application
  type: application
  question_vi: Phân loại hai tình huống GenAI theo dữ liệu nhãn và mục tiêu đánh giá.
  question_en: Write a small code example or design that applies supervised and unsupervised learning to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Phân loại hai tình huống GenAI theo dữ liệu nhãn và mục tiêu đánh giá”, cần lưu: dữ
    liệu mẫu và bảng đánh giá có cách chia rõ ràng. Đối chiếu thước đo với mục tiêu và kiểm tra mẫu trùng giữa các
    tập.'
  answer_en: The supervised and unsupervised learning example should have an explicit input, expected output and
    a way to run or verify it (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1-debug
  type: debug
  question_vi: Khi làm bài “Học có giám sát và không giám sát cho GenAI”, bạn cần tránh lỗi nào và kiểm tra lại
    ra sao?
  question_en: If supervised and unsupervised learning produces a wrong result or a metric drops, what would you
    debug first?
  answer_vi: 'Trong bài “Học có giám sát và không giám sát cho GenAI”, lỗi cần tránh là: dùng tập đánh giá có bản
    sao của dữ liệu huấn luyện. Đối chiếu thước đo với mục tiêu và kiểm tra mẫu trùng giữa các tập. Dùng ví dụ nhỏ
    để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For supervised and unsupervised learning, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Học có giám sát và không giám sát cho GenAI” để giải thích cách làm
    và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of supervised and unsupervised
    learning?
  answer_vi: Bắt đầu từ nhiệm vụ “Phân loại hai tình huống GenAI theo dữ liệu nhãn và mục tiêu đánh giá”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about supervised and unsupervised learning should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Học có giám sát và không giám sát cho GenAI / Supervised and unsupervised learning

Nhiệm vụ phân loại có nhãn và nhiệm vụ tìm nhóm dữ liệu đòi hỏi cách đánh giá khác nhau. Xác định mục tiêu trước khi chọn biểu diễn hoặc thuật toán.

## Thực hành

Phân loại hai tình huống GenAI theo dữ liệu nhãn và mục tiêu đánh giá.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo phép đánh giá embedding nhỏ: chia dữ liệu, đo cosine similarity, kiểm tra rò rỉ và vẽ đồ thị mất mát.
