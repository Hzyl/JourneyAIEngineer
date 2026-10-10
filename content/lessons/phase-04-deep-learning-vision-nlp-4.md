---
lesson_id: phase-04-deep-learning-vision-nlp-4
phase_id: phase-04-deep-learning
module_id: vision-nlp
title_vi: Tổng quan attention và Transformer
title_en: Attention and a Transformer overview
summary_vi: Attention kết hợp thông tin từ các vị trí theo trọng số phụ thuộc đầu vào.
summary_en: Learn Attention and a Transformer overview through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Vẽ luồng dữ liệu của khối attention và giải thích vai trò mặt nạ.
- Kiểm tra kích thước, nhãn và các trường hợp dự đoán sai.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain attention and a transformer overview with a concrete example.
- Write or adapt a small code example applying attention and a transformer overview.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-04-deep-learning-vision-nlp-3
- phase-03-classical-ml-ml-framing-1
key_terms:
- attention
- transformer
- overview
- PyTorch
- tensor
- loss
- training
- vision-nlp
concept_notes_vi: Attention kết hợp thông tin từ các vị trí theo trọng số phụ thuộc đầu vào. Transformer tổ chức
  attention cùng các lớp biến đổi; mặt nạ quy định vị trí nào được phép nhìn thấy.
concept_notes_en: Attention và Transformer overview explains how a Transformer weights relevant tokens. Track the
  shapes of Q, K, V, masks, and context length; during inference, KV cache avoids recomputing keys and values at
  the cost of memory.
why_it_matters_vi: Hiểu CNN, học chuyển giao, embedding và attention để chọn cách biểu diễn phù hợp.
why_it_matters_en: Understand CNNs, transfer learning, embeddings, and attention well enough to choose a CV or NLP
  path.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Attention and a Transformer overview” trong tài liệu tham khảo; đối chiếu với phần giải
  thích của bài.
- Vẽ luồng dữ liệu của khối attention và giải thích vai trò mặt nạ.
- Kiểm tra kích thước, nhãn và các trường hợp dự đoán sai. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu
  chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Understand CNNs, transfer learning, embeddings, and attention well enough
  to choose a CV or NLP path.'
- Open PyTorch Tutorials, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Choose a small dataset, train a baseline, try transfer learning or embeddings, and
  inspect a confusion matrix.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Vẽ luồng dữ liệu của khối attention và giải thích vai trò mặt nạ.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Chọn tập dữ liệu nhỏ, huấn luyện mô
      hình cơ sở, thử học chuyển giao hoặc embedding và đọc ma trận nhầm lẫn.'
    deliverables:
    - Luồng biến đổi dữ liệu và kết quả mô hình trên ví dụ nhỏ
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Kiểm tra kích thước, nhãn và các trường hợp dự đoán sai.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Choose a small dataset, train a baseline, try transfer learning or embeddings, and inspect a confusion
      matrix.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain which representation is learned and which errors still come from the data.
    stretch: Add a failure test for attention and a transformer overview and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Tổng quan attention và Transformer” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain attention and a transformer overview to a new teammate?
  - Which assumption behind attention and a transformer overview could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- Attention(Q,K,V) = softmax(QKᵀ / √d_k)V
code_examples:
- language: python
  title: 'Attention and a Transformer overview: inspect one complete path'
  code: "# Topic: Attention and a Transformer overview (phase-04-deep-learning-vision-nlp-4)\ndef linear(x: list[float],\
    \ weights: list[float], bias: float = 0.0) -> float:\n    if len(x) != len(weights):\n        raise ValueError('shape\
    \ mismatch')\n    return sum(value * weight for value, weight in zip(x, weights)) + bias\n\nprediction = linear([1.0,\
    \ 2.0], [0.2, -0.1], 0.5)\nprint({'prediction': prediction, 'loss': (prediction - 1.0) ** 2})"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for attention and a transformer overview.
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
  title: PyTorch Data Loading
  url: https://pytorch.org/tutorials/beginner/basics/data_tutorial.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: PyTorch Optimization
  url: https://pytorch.org/docs/stable/optim.html
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
- exercise-4-vision-nlp
review_item_ids:
- phase-04-deep-learning-vision-nlp-4-recall
- phase-04-deep-learning-vision-nlp-4-application
- phase-04-deep-learning-vision-nlp-4-debug
- phase-04-deep-learning-vision-nlp-4-interview
estimated_minutes: 60
completion_checklist:
- Vẽ luồng dữ liệu của khối attention và giải thích vai trò mặt nạ.
- Kiểm tra kích thước, nhãn và các trường hợp dự đoán sai.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Vẽ luồng dữ liệu của khối attention và giải thích vai trò mặt nạ.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Kiểm tra kích thước, nhãn và các trường hợp dự đoán sai.
common_mistakes:
- Thay cách biểu diễn dữ liệu mà không kiểm tra đầu vào mô hình.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-04-deep-learning-debugging-1
- phase-04-deep-learning-debugging-2
review_question_vi: Nội dung cốt lõi của “Tổng quan attention và Transformer” là gì?
review_question_en: Define attention and a transformer overview in your own words. What are the input, transformation
  and output?
review_answer_vi: Attention kết hợp thông tin từ các vị trí theo trọng số phụ thuộc đầu vào. Transformer tổ chức
  attention cùng các lớp biến đổi; mặt nạ quy định vị trí nào được phép nhìn thấy.
review_answer_en: A strong answer names the input, transformation, output and the context where attention and a
  transformer overview is used. Relate it specifically to attention and a transformer overview in lesson phase-04-deep-learning-vision-nlp-4.
review_cards:
- id: phase-04-deep-learning-vision-nlp-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Tổng quan attention và Transformer” là gì?
  question_en: Define attention and a transformer overview in your own words. What are the input, transformation
    and output?
  answer_vi: Attention kết hợp thông tin từ các vị trí theo trọng số phụ thuộc đầu vào. Transformer tổ chức attention
    cùng các lớp biến đổi; mặt nạ quy định vị trí nào được phép nhìn thấy.
  answer_en: A strong answer names the input, transformation, output and the context where attention and a transformer
    overview is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-04-deep-learning-vision-nlp-4-application
  type: application
  question_vi: Vẽ luồng dữ liệu của khối attention và giải thích vai trò mặt nạ.
  question_en: Write a small code example or design that applies attention and a transformer overview to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Vẽ luồng dữ liệu của khối attention và giải thích vai trò mặt nạ”, cần lưu: luồng biến
    đổi dữ liệu và kết quả mô hình trên ví dụ nhỏ. Kiểm tra kích thước, nhãn và các trường hợp dự đoán sai.'
  answer_en: The attention and a transformer overview example should have an explicit input, expected output and
    a way to run or verify it (phase-04-deep-learning-vision-nlp-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-04-deep-learning-vision-nlp-4-debug
  type: debug
  question_vi: Khi làm bài “Tổng quan attention và Transformer”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If attention and a transformer overview produces a wrong result or a metric drops, what would you
    debug first?
  answer_vi: 'Trong bài “Tổng quan attention và Transformer”, lỗi cần tránh là: thay cách biểu diễn dữ liệu mà không
    kiểm tra đầu vào mô hình. Kiểm tra kích thước, nhãn và các trường hợp dự đoán sai. Dùng ví dụ nhỏ để tìm bước
    đầu tiên có kết quả khác dự kiến.'
  answer_en: For attention and a transformer overview, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-04-deep-learning-vision-nlp-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-04-deep-learning-vision-nlp-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Tổng quan attention và Transformer” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of attention and a transformer
    overview?
  answer_vi: Bắt đầu từ nhiệm vụ “Vẽ luồng dữ liệu của khối attention và giải thích vai trò mặt nạ”. Trình bày kết
    quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about attention and a transformer overview should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-04-deep-learning-vision-nlp-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Tổng quan attention và Transformer / Attention and a Transformer overview

Attention kết hợp thông tin từ các vị trí theo trọng số phụ thuộc đầu vào. Transformer tổ chức attention cùng các lớp biến đổi; mặt nạ quy định vị trí nào được phép nhìn thấy.

## Thực hành

Vẽ luồng dữ liệu của khối attention và giải thích vai trò mặt nạ.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Chọn tập dữ liệu nhỏ, huấn luyện mô hình cơ sở, thử học chuyển giao hoặc embedding và đọc ma trận nhầm lẫn.
