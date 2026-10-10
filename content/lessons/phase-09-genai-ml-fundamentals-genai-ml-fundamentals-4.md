---
lesson_id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4
phase_id: phase-09-genai-ml-fundamentals
module_id: genai-ml-fundamentals
title_vi: Hàm mất mát, bộ tối ưu và quá khớp
title_en: Loss functions, optimizers, and overfitting
summary_vi: Hàm mất mát quy định mục tiêu học; bộ tối ưu cập nhật tham số để giảm mục tiêu đó.
summary_en: Learn Loss functions, optimizers, and overfitting through an input → transformation → output model,
  then verify it with an edge-case exercise.
learning_objectives:
- Đối chiếu đồ thị mất mát huấn luyện, kiểm định và nhận diện dấu hiệu quá khớp.
- Đối chiếu thước đo với mục tiêu và kiểm tra mẫu trùng giữa các tập.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain loss functions, optimizers, and overfitting with a concrete example.
- Write or adapt a small code example applying loss functions, optimizers, and overfitting.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-3
- phase-08-genai-software-genai-software-foundations-1
key_terms:
- loss
- function
- optimizer
- overfitting
- dataset
- feature
- baseline
- evaluation
- genai-ml-fundamentals
concept_notes_vi: Hàm mất mát quy định mục tiêu học; bộ tối ưu cập nhật tham số để giảm mục tiêu đó. Mất mát huấn
  luyện giảm chưa đủ chứng minh chất lượng trên dữ liệu mới.
concept_notes_en: Loss function, optimizer và overfitting is a Software Engineering skill for turning an idea into
  code that can be read, tested, and maintained. Define the inputs, outputs, invariants, and failure modes before
  implementing. In Python, small boundaries make tests fast and tracebacks actionable.
why_it_matters_vi: Liên hệ embedding và thước đo với truy xuất, phân nhóm và chất lượng mô hình.
why_it_matters_en: Embeddings and metrics connect user data to retrieval, clustering, and model quality.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Loss functions, optimizers, and overfitting” trong tài liệu tham khảo; đối chiếu với phần
  giải thích của bài.
- Đối chiếu đồ thị mất mát huấn luyện, kiểm định và nhận diện dấu hiệu quá khớp.
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
    task: 'Đối chiếu đồ thị mất mát huấn luyện, kiểm định và nhận diện dấu hiệu quá khớp.


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
    stretch: Add a failure test for loss functions, optimizers, and overfitting and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Hàm mất mát, bộ tối ưu và quá khớp” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain loss functions, optimizers, and overfitting to a new teammate?
  - Which assumption behind loss functions, optimizers, and overfitting could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Loss functions, optimizers, and overfitting: inspect one complete path'
  code: "# Topic: Loss functions, optimizers, and overfitting (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4)\n\
    def linear(x: list[float], weights: list[float], bias: float = 0.0) -> float:\n    if len(x) != len(weights):\n\
    \        raise ValueError('shape mismatch')\n    return sum(value * weight for value, weight in zip(x, weights))\
    \ + bias\n\nprediction = linear([1.0, 2.0], [0.2, -0.1], 0.5)\nprint({'prediction': prediction, 'loss': (prediction\
    \ - 1.0) ** 2})"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for loss functions, optimizers, and overfitting.
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
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4-recall
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4-application
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4-debug
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4-interview
estimated_minutes: 60
completion_checklist:
- Đối chiếu đồ thị mất mát huấn luyện, kiểm định và nhận diện dấu hiệu quá khớp.
- Đối chiếu thước đo với mục tiêu và kiểm tra mẫu trùng giữa các tập.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Đối chiếu đồ thị mất mát huấn luyện, kiểm định và nhận diện dấu hiệu quá khớp.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Đối chiếu thước đo với mục tiêu và kiểm tra mẫu trùng giữa các tập.
common_mistakes:
- Dùng tập đánh giá có bản sao của dữ liệu huấn luyện.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-10-genai-transformers-genai-transformers-1
- phase-10-genai-transformers-genai-transformers-2
review_question_vi: Nội dung cốt lõi của “Hàm mất mát, bộ tối ưu và quá khớp” là gì?
review_question_en: Define loss functions, optimizers, and overfitting in your own words. What are the input, transformation
  and output?
review_answer_vi: Hàm mất mát quy định mục tiêu học; bộ tối ưu cập nhật tham số để giảm mục tiêu đó. Mất mát huấn
  luyện giảm chưa đủ chứng minh chất lượng trên dữ liệu mới.
review_answer_en: A strong answer names the input, transformation, output and the context where loss functions,
  optimizers, and overfitting is used. Relate it specifically to loss functions, optimizers, and overfitting in
  lesson phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4.
review_cards:
- id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Hàm mất mát, bộ tối ưu và quá khớp” là gì?
  question_en: Define loss functions, optimizers, and overfitting in your own words. What are the input, transformation
    and output?
  answer_vi: Hàm mất mát quy định mục tiêu học; bộ tối ưu cập nhật tham số để giảm mục tiêu đó. Mất mát huấn luyện
    giảm chưa đủ chứng minh chất lượng trên dữ liệu mới.
  answer_en: A strong answer names the input, transformation, output and the context where loss functions, optimizers,
    and overfitting is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4-application
  type: application
  question_vi: Đối chiếu đồ thị mất mát huấn luyện, kiểm định và nhận diện dấu hiệu quá khớp.
  question_en: Write a small code example or design that applies loss functions, optimizers, and overfitting to
    an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Đối chiếu đồ thị mất mát huấn luyện, kiểm định và nhận diện dấu hiệu quá khớp”, cần
    lưu: dữ liệu mẫu và bảng đánh giá có cách chia rõ ràng. Đối chiếu thước đo với mục tiêu và kiểm tra mẫu trùng
    giữa các tập.'
  answer_en: The loss functions, optimizers, and overfitting example should have an explicit input, expected output
    and a way to run or verify it (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4-debug
  type: debug
  question_vi: Khi làm bài “Hàm mất mát, bộ tối ưu và quá khớp”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If loss functions, optimizers, and overfitting produces a wrong result or a metric drops, what would
    you debug first?
  answer_vi: 'Trong bài “Hàm mất mát, bộ tối ưu và quá khớp”, lỗi cần tránh là: dùng tập đánh giá có bản sao của
    dữ liệu huấn luyện. Đối chiếu thước đo với mục tiêu và kiểm tra mẫu trùng giữa các tập. Dùng ví dụ nhỏ để tìm
    bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For loss functions, optimizers, and overfitting, check inputs/shapes, preprocessing and the baseline
    first; then isolate the failure with a small test and error analysis (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Hàm mất mát, bộ tối ưu và quá khớp” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of loss functions, optimizers,
    and overfitting?
  answer_vi: Bắt đầu từ nhiệm vụ “Đối chiếu đồ thị mất mát huấn luyện, kiểm định và nhận diện dấu hiệu quá khớp”.
    Trình bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại
    định nghĩa.
  answer_en: The answer about loss functions, optimizers, and overfitting should cover assumptions, metrics/cost,
    limitations and how to reduce production risk (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Hàm mất mát, bộ tối ưu và quá khớp / Loss functions, optimizers, and overfitting

Hàm mất mát quy định mục tiêu học; bộ tối ưu cập nhật tham số để giảm mục tiêu đó. Mất mát huấn luyện giảm chưa đủ chứng minh chất lượng trên dữ liệu mới.

## Thực hành

Đối chiếu đồ thị mất mát huấn luyện, kiểm định và nhận diện dấu hiệu quá khớp.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo phép đánh giá embedding nhỏ: chia dữ liệu, đo cosine similarity, kiểm tra rò rỉ và vẽ đồ thị mất mát.
