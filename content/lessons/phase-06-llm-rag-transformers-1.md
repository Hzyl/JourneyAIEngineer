---
lesson_id: phase-06-llm-rag-transformers-1
phase_id: phase-06-llm-rag
module_id: transformers
title_vi: Attention
title_en: Attention
summary_vi: Học Attention qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Attention through an input → transformation → output model, then verify it with an edge-case exercise.
learning_objectives:
- Giải thích attention bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng attention.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain attention with a concrete example.
- Write or adapt a small code example applying attention.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-nlp-foundations-4
- phase-05-mlops-api-1
key_terms:
- attention
- PyTorch
- tensor
- loss
- training
- transformers
concept_notes_vi: Attention giải thích cách Transformer phân bổ trọng số cho token liên quan. Theo dõi shape của Q, K, V,
  mask và context length; khi tối ưu inference, KV cache giảm việc tính lại key/value nhưng đổi lại dùng thêm memory.
concept_notes_en: Attention explains how a Transformer weights relevant tokens. Track the shapes of Q, K, V, masks, and context
  length; during inference, KV cache avoids recomputing keys and values at the cost of memory.
why_it_matters_vi: Đi từ attention tới prompt và structured output, luôn kiểm tra schema thay vì tin raw text.
why_it_matters_en: Move from attention to prompts and structured outputs while validating schemas instead of trusting raw
  text.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Đi từ attention tới prompt và structured output, luôn kiểm tra schema thay vì tin raw
  text.'
- Mở Hugging Face NLP Course, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Viết prompt có input/output contract, thử case thiếu dữ liệu và validate JSON trước khi dùng downstream.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Move from attention to prompts and structured outputs while validating schemas instead
  of trusting raw text.'
- Open Hugging Face NLP Course, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Write a prompt with an input/output contract, test missing data, and validate JSON before downstream
  use.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Viết prompt có input/output contract, thử case thiếu dữ liệu và validate JSON trước khi dùng downstream.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn nhận diện được prompt ambiguity, output invalid và injection trong một flow cụ thể.
    stretch: Viết thêm một failure test cho attention và giải thích kết quả.
  en:
    task: Write a prompt with an input/output contract, test missing data, and validate JSON before downstream use.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can identify prompt ambiguity, invalid output, and injection in a concrete flow.
    stretch: Add a failure test for attention and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích attention cho một đồng đội mới như thế nào?
  - Một assumption nào của attention có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain attention to a new teammate?
  - Which assumption behind attention could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- Attention(Q,K,V) = softmax(QKᵀ / √d_k)V
code_examples:
- language: python
  title: 'Attention: inspect one complete path'
  code: "# Topic: Attention (phase-06-llm-rag-transformers-1)\ndef linear(x: list[float], weights: list[float], bias: float\
    \ = 0.0) -> float:\n    if len(x) != len(weights):\n        raise ValueError('shape mismatch')\n    return sum(value *\
    \ weight for value, weight in zip(x, weights)) + bias\n\nprediction = linear([1.0, 2.0], [0.2, -0.1], 0.5)\nprint({'prediction':\
    \ prediction, 'loss': (prediction - 1.0) ** 2})"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của attention.
  purpose_en: Illustrate the input-to-output path for attention.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Làm rõ shape, forward output và loss trước khi thêm framework hoặc tối ưu hóa.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Hugging Face NLP Course
  url: https://huggingface.co/learn/nlp-course/chapter1/1
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Hugging Face Transformers Docs
  url: https://huggingface.co/docs/transformers/index
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: FAISS Documentation
  url: https://faiss.ai/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Giải thích tiếng Việt và checklist của lesson
  url: ''
  language: vi
  kind: in_app
  purpose_vi: Phần giải thích, code example, checklist và tiêu chí hoàn thành ngay trong app.
  purpose_en: The explanation, code example, checklist, and completion criteria inside the app.
  read_vi: Đọc theo thứ tự Study plan → Concept notes → Code example → Practice plan.
  read_en: Follow Study plan → Concept notes → Code example → Practice plan.
  required: true
exercise_ids:
- exercise-6-transformers
review_item_ids:
- phase-06-llm-rag-transformers-1-recall
- phase-06-llm-rag-transformers-1-application
- phase-06-llm-rag-transformers-1-debug
- phase-06-llm-rag-transformers-1-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của attention.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng attention và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng attention.
- Đánh giá attention bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ attention mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-06-llm-rag-transformers-2
- phase-06-llm-rag-transformers-3
review_question_vi: Định nghĩa attention bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define attention in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng attention. Hãy liên hệ cụ thể với
  attention trong lesson phase-06-llm-rag-transformers-1.
review_answer_en: A strong answer names the input, transformation, output and the context where attention is used. Relate
  it specifically to attention in lesson phase-06-llm-rag-transformers-1.
review_cards:
- id: phase-06-llm-rag-transformers-1-recall
  type: recall
  question_vi: Định nghĩa attention bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define attention in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng attention.
  answer_en: A strong answer names the input, transformation, output and the context where attention is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-transformers-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng attention cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies attention to an AI engineering problem.
  answer_vi: Ví dụ cho attention cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-06-llm-rag-transformers-1).
  answer_en: The attention example should have an explicit input, expected output and a way to run or verify it (phase-06-llm-rag-transformers-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-transformers-1-debug
  type: debug
  question_vi: Nếu kết quả của attention sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If attention produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với attention, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test nhỏ và error
    analysis (phase-06-llm-rag-transformers-1).
  answer_en: For attention, check inputs/shapes, preprocessing and the baseline first; then isolate the failure with a small
    test and error analysis (phase-06-llm-rag-transformers-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-transformers-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của attention như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of attention?
  answer_vi: Câu trả lời về attention cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production (phase-06-llm-rag-transformers-1).
  answer_en: The answer about attention should cover assumptions, metrics/cost, limitations and how to reduce production risk
    (phase-06-llm-rag-transformers-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Attention / Attention

Attention giải thích cách Transformer phân bổ trọng số cho token liên quan. Theo dõi shape của Q, K, V, mask và context length; khi tối ưu inference, KV cache giảm việc tính lại key/value nhưng đổi lại dùng thêm memory.

## Practice

Viết prompt có input/output contract, thử case thiếu dữ liệu và validate JSON trước khi dùng downstream.
