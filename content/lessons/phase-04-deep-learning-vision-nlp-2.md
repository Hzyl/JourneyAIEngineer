---
lesson_id: phase-04-deep-learning-vision-nlp-2
phase_id: phase-04-deep-learning
module_id: vision-nlp
title_vi: Học chuyển giao
title_en: Transfer learning
summary_vi: Học chuyển giao sử dụng biểu diễn từ mô hình đã huấn luyện cho bài toán mới.
summary_en: Learn Transfer learning through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- So sánh huấn luyện lớp đầu ra với tinh chỉnh thêm một phần mô hình.
- Kiểm tra kích thước, nhãn và các trường hợp dự đoán sai.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain transfer learning with a concrete example.
- Write or adapt a small code example applying transfer learning.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-04-deep-learning-vision-nlp-1
- phase-03-classical-ml-ml-framing-1
key_terms:
- transfer
- learning
- PyTorch
- tensor
- loss
- training
- vision-nlp
concept_notes_vi: Học chuyển giao sử dụng biểu diễn từ mô hình đã huấn luyện cho bài toán mới. Đóng băng hay cập
  nhật từng phần phụ thuộc dữ liệu, độ khác biệt của nhiệm vụ và ngân sách tính toán.
concept_notes_en: 'Transfer learning is one part of a Deep Learning pipeline: tensors flow through a forward pass,
  loss creates a signal, backprop computes gradients, and the optimizer updates parameters. Separate train/eval
  modes, save checkpoints, and track validation to distinguish overfitting from data errors.'
why_it_matters_vi: Hiểu CNN, học chuyển giao, embedding và attention để chọn cách biểu diễn phù hợp.
why_it_matters_en: Understand CNNs, transfer learning, embeddings, and attention well enough to choose a CV or NLP
  path.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Transfer learning” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- So sánh huấn luyện lớp đầu ra với tinh chỉnh thêm một phần mô hình.
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
    task: 'So sánh huấn luyện lớp đầu ra với tinh chỉnh thêm một phần mô hình.


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
    stretch: Add a failure test for transfer learning and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Học chuyển giao” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain transfer learning to a new teammate?
  - Which assumption behind transfer learning could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- z = Wx + b
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: 'Transfer learning: inspect one complete path'
  code: "# Topic: Transfer learning (phase-04-deep-learning-vision-nlp-2)\nfrom dataclasses import dataclass\n\n\
    @dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for transfer learning.
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
- title: PyTorch Transfer Learning
  url: https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html
  language: en
  purpose_vi: Xây bộ phân loại ảnh và cân nhắc học chuyển giao trước khi huấn luyện từ đầu.
  read_vi: Đọc về tăng cường dữ liệu, mô hình đã huấn luyện sẵn và đánh giá trên tập kiểm định.
  purpose_en: Build a practical image classifier without blindly training from scratch.
  read_en: Read augmentation, pretrained models, and validation evaluation.
  kind: official
  required: true
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
- phase-04-deep-learning-vision-nlp-2-recall
- phase-04-deep-learning-vision-nlp-2-application
- phase-04-deep-learning-vision-nlp-2-debug
- phase-04-deep-learning-vision-nlp-2-interview
estimated_minutes: 60
completion_checklist:
- So sánh huấn luyện lớp đầu ra với tinh chỉnh thêm một phần mô hình.
- Kiểm tra kích thước, nhãn và các trường hợp dự đoán sai.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: So sánh huấn luyện lớp đầu ra với tinh chỉnh thêm một phần mô hình.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Kiểm tra kích thước, nhãn và các trường hợp dự đoán sai.
common_mistakes:
- Thay cách biểu diễn dữ liệu mà không kiểm tra đầu vào mô hình.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-04-deep-learning-vision-nlp-3
- phase-04-deep-learning-vision-nlp-4
review_question_vi: Nội dung cốt lõi của “Học chuyển giao” là gì?
review_question_en: Define transfer learning in your own words. What are the input, transformation and output?
review_answer_vi: Học chuyển giao sử dụng biểu diễn từ mô hình đã huấn luyện cho bài toán mới. Đóng băng hay cập
  nhật từng phần phụ thuộc dữ liệu, độ khác biệt của nhiệm vụ và ngân sách tính toán.
review_answer_en: A strong answer names the input, transformation, output and the context where transfer learning
  is used. Relate it specifically to transfer learning in lesson phase-04-deep-learning-vision-nlp-2.
review_cards:
- id: phase-04-deep-learning-vision-nlp-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Học chuyển giao” là gì?
  question_en: Define transfer learning in your own words. What are the input, transformation and output?
  answer_vi: Học chuyển giao sử dụng biểu diễn từ mô hình đã huấn luyện cho bài toán mới. Đóng băng hay cập nhật
    từng phần phụ thuộc dữ liệu, độ khác biệt của nhiệm vụ và ngân sách tính toán.
  answer_en: A strong answer names the input, transformation, output and the context where transfer learning is
    used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-04-deep-learning-vision-nlp-2-application
  type: application
  question_vi: So sánh huấn luyện lớp đầu ra với tinh chỉnh thêm một phần mô hình.
  question_en: Write a small code example or design that applies transfer learning to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “So sánh huấn luyện lớp đầu ra với tinh chỉnh thêm một phần mô hình”, cần lưu: luồng
    biến đổi dữ liệu và kết quả mô hình trên ví dụ nhỏ. Kiểm tra kích thước, nhãn và các trường hợp dự đoán sai.'
  answer_en: The transfer learning example should have an explicit input, expected output and a way to run or verify
    it (phase-04-deep-learning-vision-nlp-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-04-deep-learning-vision-nlp-2-debug
  type: debug
  question_vi: Khi làm bài “Học chuyển giao”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If transfer learning produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Học chuyển giao”, lỗi cần tránh là: thay cách biểu diễn dữ liệu mà không kiểm tra đầu vào
    mô hình. Kiểm tra kích thước, nhãn và các trường hợp dự đoán sai. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết
    quả khác dự kiến.'
  answer_en: For transfer learning, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-04-deep-learning-vision-nlp-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-04-deep-learning-vision-nlp-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Học chuyển giao” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of transfer learning?
  answer_vi: Bắt đầu từ nhiệm vụ “So sánh huấn luyện lớp đầu ra với tinh chỉnh thêm một phần mô hình”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about transfer learning should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-04-deep-learning-vision-nlp-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Học chuyển giao / Transfer learning

Học chuyển giao sử dụng biểu diễn từ mô hình đã huấn luyện cho bài toán mới. Đóng băng hay cập nhật từng phần phụ thuộc dữ liệu, độ khác biệt của nhiệm vụ và ngân sách tính toán.

## Thực hành

So sánh huấn luyện lớp đầu ra với tinh chỉnh thêm một phần mô hình.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Chọn tập dữ liệu nhỏ, huấn luyện mô hình cơ sở, thử học chuyển giao hoặc embedding và đọc ma trận nhầm lẫn.
