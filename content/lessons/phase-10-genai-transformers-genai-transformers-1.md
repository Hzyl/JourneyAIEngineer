---
lesson_id: phase-10-genai-transformers-genai-transformers-1
phase_id: phase-10-genai-transformers
module_id: genai-transformers
title_vi: Mạng nơ-ron và lan truyền ngược
title_en: Neural networks and backpropagation
summary_vi: Mạng nơ-ron kết hợp các phép biến đổi có tham số.
summary_en: Learn Neural networks and backpropagation through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Theo dõi một phép tính qua lan truyền xuôi, ngược và cập nhật trọng số.
- Đối chiếu luồng thông tin, mặt nạ và bộ nhớ ở từng bước.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain neural networks and backpropagation with a concrete example.
- Write or adapt a small code example applying neural networks and backpropagation.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1
key_terms:
- neural
- network
- backpropagation
- PyTorch
- tensor
- loss
- training
- genai-transformers
concept_notes_vi: Mạng nơ-ron kết hợp các phép biến đổi có tham số. Lan truyền ngược tính gradient theo quy tắc
  dây chuyền; bộ tối ưu dùng gradient để cập nhật trọng số.
concept_notes_en: Neural network và backpropagation describes how an output changes when a parameter changes. Use
  finite differences on a small input to check a gradient, then trace the chain rule through each transformation;
  gradient sign and scale determine whether updates are stable.
why_it_matters_vi: Hiểu Transformer qua kích thước tensor, trọng số attention và chi phí suy luận.
why_it_matters_en: Transformers become understandable when you trace tensor shapes, attention weights, and inference
  cost.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Neural networks and backpropagation” trong tài liệu tham khảo; đối chiếu với phần giải
  thích của bài.
- Theo dõi một phép tính qua lan truyền xuôi, ngược và cập nhật trọng số.
- Đối chiếu luồng thông tin, mặt nạ và bộ nhớ ở từng bước. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu
  chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Transformers become understandable when you trace tensor shapes, attention
  weights, and inference cost.'
- Open PyTorch Tutorials, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Implement minimal attention with PyTorch/NumPy, inspect shapes, and compare inference
  with and without caching.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Theo dõi một phép tính qua lan truyền xuôi, ngược và cập nhật trọng số.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết attention tối giản bằng PyTorch/NumPy,
      kiểm tra kích thước và so sánh suy luận có, không dùng cache.'
    deliverables:
    - Ví dụ hoặc sơ đồ Q/K/V có kích thước và điều kiện đo
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Đối chiếu luồng thông tin, mặt nạ và bộ nhớ ở từng bước.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Implement minimal attention with PyTorch/NumPy, inspect shapes, and compare inference with and without
      caching.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can draw the Q/K/V flow, explain encoder/decoder roles, and quantify why KV cache reduces latency.
    stretch: Add a failure test for neural networks and backpropagation and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Mạng nơ-ron và lan truyền ngược” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain neural networks and backpropagation to a new teammate?
  - Which assumption behind neural networks and backpropagation could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- z = Wx + b
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: 'Neural networks and backpropagation: inspect one complete path'
  code: "# Topic: Neural networks and backpropagation (phase-10-genai-transformers-genai-transformers-1)\ndef linear(x:\
    \ list[float], weights: list[float], bias: float = 0.0) -> float:\n    if len(x) != len(weights):\n        raise\
    \ ValueError('shape mismatch')\n    return sum(value * weight for value, weight in zip(x, weights)) + bias\n\
    \nprediction = linear([1.0, 2.0], [0.2, -0.1], 0.5)\nprint({'prediction': prediction, 'loss': (prediction -\
    \ 1.0) ** 2})"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for neural networks and backpropagation.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: PyTorch Tutorials
  url: https://pytorch.org/tutorials/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: The Illustrated Transformer
  url: https://jalammar.github.io/illustrated-transformer/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Attention Is All You Need
  url: https://arxiv.org/abs/1706.03762
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
- exercise-10-genai-transformers
review_item_ids:
- phase-10-genai-transformers-genai-transformers-1-recall
- phase-10-genai-transformers-genai-transformers-1-application
- phase-10-genai-transformers-genai-transformers-1-debug
- phase-10-genai-transformers-genai-transformers-1-interview
estimated_minutes: 60
completion_checklist:
- Theo dõi một phép tính qua lan truyền xuôi, ngược và cập nhật trọng số.
- Đối chiếu luồng thông tin, mặt nạ và bộ nhớ ở từng bước.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Theo dõi một phép tính qua lan truyền xuôi, ngược và cập nhật trọng số.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Đối chiếu luồng thông tin, mặt nạ và bộ nhớ ở từng bước.
common_mistakes:
- So sánh hiệu năng với độ dài chuỗi hoặc cấu hình sinh khác nhau.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-10-genai-transformers-genai-transformers-2
- phase-10-genai-transformers-genai-transformers-3
review_question_vi: Nội dung cốt lõi của “Mạng nơ-ron và lan truyền ngược” là gì?
review_question_en: Define neural networks and backpropagation in your own words. What are the input, transformation
  and output?
review_answer_vi: Mạng nơ-ron kết hợp các phép biến đổi có tham số. Lan truyền ngược tính gradient theo quy tắc
  dây chuyền; bộ tối ưu dùng gradient để cập nhật trọng số.
review_answer_en: A strong answer names the input, transformation, output and the context where neural networks
  and backpropagation is used. Relate it specifically to neural networks and backpropagation in lesson phase-10-genai-transformers-genai-transformers-1.
review_cards:
- id: phase-10-genai-transformers-genai-transformers-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Mạng nơ-ron và lan truyền ngược” là gì?
  question_en: Define neural networks and backpropagation in your own words. What are the input, transformation
    and output?
  answer_vi: Mạng nơ-ron kết hợp các phép biến đổi có tham số. Lan truyền ngược tính gradient theo quy tắc dây chuyền;
    bộ tối ưu dùng gradient để cập nhật trọng số.
  answer_en: A strong answer names the input, transformation, output and the context where neural networks and backpropagation
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-10-genai-transformers-genai-transformers-1-application
  type: application
  question_vi: Theo dõi một phép tính qua lan truyền xuôi, ngược và cập nhật trọng số.
  question_en: Write a small code example or design that applies neural networks and backpropagation to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Theo dõi một phép tính qua lan truyền xuôi, ngược và cập nhật trọng số”, cần lưu: ví
    dụ hoặc sơ đồ Q/K/V có kích thước và điều kiện đo. Đối chiếu luồng thông tin, mặt nạ và bộ nhớ ở từng bước.'
  answer_en: The neural networks and backpropagation example should have an explicit input, expected output and
    a way to run or verify it (phase-10-genai-transformers-genai-transformers-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-10-genai-transformers-genai-transformers-1-debug
  type: debug
  question_vi: Khi làm bài “Mạng nơ-ron và lan truyền ngược”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If neural networks and backpropagation produces a wrong result or a metric drops, what would you
    debug first?
  answer_vi: 'Trong bài “Mạng nơ-ron và lan truyền ngược”, lỗi cần tránh là: so sánh hiệu năng với độ dài chuỗi
    hoặc cấu hình sinh khác nhau. Đối chiếu luồng thông tin, mặt nạ và bộ nhớ ở từng bước. Dùng ví dụ nhỏ để tìm
    bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For neural networks and backpropagation, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-10-genai-transformers-genai-transformers-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-10-genai-transformers-genai-transformers-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Mạng nơ-ron và lan truyền ngược” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of neural networks and backpropagation?
  answer_vi: Bắt đầu từ nhiệm vụ “Theo dõi một phép tính qua lan truyền xuôi, ngược và cập nhật trọng số”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about neural networks and backpropagation should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-10-genai-transformers-genai-transformers-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Mạng nơ-ron và lan truyền ngược / Neural networks and backpropagation

Mạng nơ-ron kết hợp các phép biến đổi có tham số. Lan truyền ngược tính gradient theo quy tắc dây chuyền; bộ tối ưu dùng gradient để cập nhật trọng số.

## Thực hành

Theo dõi một phép tính qua lan truyền xuôi, ngược và cập nhật trọng số.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết attention tối giản bằng PyTorch/NumPy, kiểm tra kích thước và so sánh suy luận có, không dùng cache.
