---
lesson_id: phase-21-genai-local-llm-local-llm-1
phase_id: phase-21-genai-local-llm
module_id: local-llm
title_vi: Suy luận với Transformers và PyTorch
title_en: Transformers and PyTorch inference
summary_vi: Suy luận cục bộ cần mô hình, tokenizer và thiết bị phù hợp.
summary_en: Learn Transformers and PyTorch inference through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Nạp mô hình nhỏ và ghi thiết bị, cấu hình sinh cùng kết quả.
- Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất quán.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain transformers and pytorch inference with a concrete example.
- Write or adapt a small code example applying transformers and pytorch inference.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-20-genai-finetuning-fine-tuning-4
- phase-20-genai-finetuning-fine-tuning-1
key_terms:
- transformers
- pytorch
- inference
- token
- embedding
- retrieval
- evaluation
- local-llm
concept_notes_vi: Suy luận cục bộ cần mô hình, tokenizer và thiết bị phù hợp. Chế độ đánh giá cùng cách quản lý
  gradient ảnh hưởng bộ nhớ và hành vi của lần chạy.
concept_notes_en: 'Transformers và PyTorch inference is one part of a Deep Learning pipeline: tensors flow through
  a forward pass, loss creates a signal, backprop computes gradients, and the optimizer updates parameters. Separate
  train/eval modes, save checkpoints, and track validation to distinguish overfitting from data errors.'
why_it_matters_vi: Đo tài nguyên và chất lượng để chọn mô hình cục bộ phù hợp phần cứng, nhu cầu riêng tư.
why_it_matters_en: Local LLMs expose the trade-offs among memory, throughput, model size, quality, and privacy.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Transformers and PyTorch inference” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- Nạp mô hình nhỏ và ghi thiết bị, cấu hình sinh cùng kết quả.
- Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất quán. Ghi kết quả đối chiếu và điều bạn
  đã sửa nếu lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Local LLMs expose the trade-offs among memory, throughput, model size, quality,
  and privacy.'
- Open vLLM Documentation, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Run a small local model, measure cold/warm latency, tokens/sec, VRAM, and compare
  quantized with full precision.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Nạp mô hình nhỏ và ghi thiết bị, cấu hình sinh cùng kết quả.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Chạy mô hình nhỏ, đo thời gian trước
      và sau khi nạp, token/giây, VRAM; so sánh bản lượng tử hóa với bản đầy đủ.'
    deliverables:
    - Cấu hình phần cứng, mô hình và bảng đo hiệu năng
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất quán.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Run a small local model, measure cold/warm latency, tokens/sec, VRAM, and compare quantized with full
      precision.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can choose a runtime from hardware, workload, and privacy requirements rather than hype.
    stretch: Add a failure test for transformers and pytorch inference and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Suy luận với Transformers và PyTorch” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain transformers and pytorch inference to a new teammate?
  - Which assumption behind transformers and pytorch inference could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- Attention(Q,K,V) = softmax(QKᵀ / √d_k)V
code_examples:
- language: python
  title: 'Transformers and PyTorch inference: inspect one complete path'
  code: "# Topic: Transformers and PyTorch inference (phase-21-genai-local-llm-local-llm-1)\ndef grounded_answer(answer:\
    \ str, evidence: list[str]) -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return\
    \ answer + '\\nSources: ' + '; '.join(evidence)\n\nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for transformers and pytorch inference.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: vLLM Documentation
  url: https://docs.vllm.ai/en/latest/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Ollama Documentation
  url: https://docs.ollama.com/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: llama.cpp
  url: https://github.com/ggml-org/llama.cpp
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: PyTorch Fundamentals
  url: https://pytorch.org/tutorials/beginner/basics/intro.html
  language: en
  purpose_vi: Học tensor, Dataset, DataLoader và vòng lặp huấn luyện theo luồng xử lý chính thức.
  read_vi: Lần lượt đọc phần dữ liệu, mô hình, autograd và tối ưu hóa.
  purpose_en: Learn tensors, datasets, dataloaders, and loops from the official flow.
  read_en: Read data, models, autograd, and optimization in that order.
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
- exercise-21-local-llm
review_item_ids:
- phase-21-genai-local-llm-local-llm-1-recall
- phase-21-genai-local-llm-local-llm-1-application
- phase-21-genai-local-llm-local-llm-1-debug
- phase-21-genai-local-llm-local-llm-1-interview
estimated_minutes: 60
completion_checklist:
- Nạp mô hình nhỏ và ghi thiết bị, cấu hình sinh cùng kết quả.
- Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất quán.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Nạp mô hình nhỏ và ghi thiết bị, cấu hình sinh cùng kết quả.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất quán.
common_mistakes:
- So sánh token mỗi giây giữa các lần chạy khác tải hoặc khác độ dài chuỗi.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-21-genai-local-llm-local-llm-2
- phase-21-genai-local-llm-local-llm-3
review_question_vi: Nội dung cốt lõi của “Suy luận với Transformers và PyTorch” là gì?
review_question_en: Define transformers and pytorch inference in your own words. What are the input, transformation
  and output?
review_answer_vi: Suy luận cục bộ cần mô hình, tokenizer và thiết bị phù hợp. Chế độ đánh giá cùng cách quản lý
  gradient ảnh hưởng bộ nhớ và hành vi của lần chạy.
review_answer_en: A strong answer names the input, transformation, output and the context where transformers and
  pytorch inference is used. Relate it specifically to transformers and pytorch inference in lesson phase-21-genai-local-llm-local-llm-1.
review_cards:
- id: phase-21-genai-local-llm-local-llm-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Suy luận với Transformers và PyTorch” là gì?
  question_en: Define transformers and pytorch inference in your own words. What are the input, transformation and
    output?
  answer_vi: Suy luận cục bộ cần mô hình, tokenizer và thiết bị phù hợp. Chế độ đánh giá cùng cách quản lý gradient
    ảnh hưởng bộ nhớ và hành vi của lần chạy.
  answer_en: A strong answer names the input, transformation, output and the context where transformers and pytorch
    inference is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-21-genai-local-llm-local-llm-1-application
  type: application
  question_vi: Nạp mô hình nhỏ và ghi thiết bị, cấu hình sinh cùng kết quả.
  question_en: Write a small code example or design that applies transformers and pytorch inference to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Nạp mô hình nhỏ và ghi thiết bị, cấu hình sinh cùng kết quả”, cần lưu: cấu hình phần
    cứng, mô hình và bảng đo hiệu năng. Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất
    quán.'
  answer_en: The transformers and pytorch inference example should have an explicit input, expected output and a
    way to run or verify it (phase-21-genai-local-llm-local-llm-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-21-genai-local-llm-local-llm-1-debug
  type: debug
  question_vi: Khi làm bài “Suy luận với Transformers và PyTorch”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If transformers and pytorch inference produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Suy luận với Transformers và PyTorch”, lỗi cần tránh là: so sánh token mỗi giây giữa các
    lần chạy khác tải hoặc khác độ dài chuỗi. Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo
    nhất quán. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For transformers and pytorch inference, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-21-genai-local-llm-local-llm-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-21-genai-local-llm-local-llm-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Suy luận với Transformers và PyTorch” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of transformers and pytorch
    inference?
  answer_vi: Bắt đầu từ nhiệm vụ “Nạp mô hình nhỏ và ghi thiết bị, cấu hình sinh cùng kết quả”. Trình bày kết quả
    đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about transformers and pytorch inference should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-21-genai-local-llm-local-llm-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Suy luận với Transformers và PyTorch / Transformers and PyTorch inference

Suy luận cục bộ cần mô hình, tokenizer và thiết bị phù hợp. Chế độ đánh giá cùng cách quản lý gradient ảnh hưởng bộ nhớ và hành vi của lần chạy.

## Thực hành

Nạp mô hình nhỏ và ghi thiết bị, cấu hình sinh cùng kết quả.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Chạy mô hình nhỏ, đo thời gian trước và sau khi nạp, token/giây, VRAM; so sánh bản lượng tử hóa với bản đầy đủ.
