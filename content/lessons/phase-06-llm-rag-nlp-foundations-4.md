---
lesson_id: phase-06-llm-rag-nlp-foundations-4
phase_id: phase-06-llm-rag
module_id: nlp-foundations
title_vi: Context window
title_en: Context windows
summary_vi: Học Context window qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Context windows through an input → transformation → output model, then verify it with an edge-case exercise.
learning_objectives:
- Giải thích context window bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng context window.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain context windows with a concrete example.
- Write or adapt a small code example applying context windows.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-nlp-foundations-3
- phase-05-mlops-api-1
key_terms:
- context
- window
- token
- embedding
- retrieval
- evaluation
- nlp-foundations
concept_notes_vi: Context window là khái niệm của module nlp-foundations. Hãy xác định input, output, giả định, failure mode
  và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.
concept_notes_en: Context window is a concept in the nlp-foundations module. Identify the inputs, outputs, assumptions, failure
  modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Hiểu token, embedding, language model và context window trước khi xây ứng dụng LLM.
why_it_matters_en: Understand tokens, embeddings, language models, and context windows before building LLM applications.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Hiểu token, embedding, language model và context window trước khi xây ứng dụng LLM.'
- Mở Hugging Face NLP Course, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Tokenize câu tiếng Việt, đếm token, so sánh embedding gần/xa và ghi giới hạn context.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Understand tokens, embeddings, language models, and context windows before building
  LLM applications.'
- Open Hugging Face NLP Course, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Tokenize Vietnamese text, count tokens, compare near/far embeddings, and record context limits.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Tokenize câu tiếng Việt, đếm token, so sánh embedding gần/xa và ghi giới hạn context.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn giải thích được embedding không phải là sự thật, và context window ảnh hưởng cost/quality ra sao.
    stretch: Viết thêm một failure test cho context window và giải thích kết quả.
  en:
    task: Tokenize Vietnamese text, count tokens, compare near/far embeddings, and record context limits.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain that embeddings are not truth and how context windows affect cost and quality.
    stretch: Add a failure test for context windows and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích context window cho một đồng đội mới như thế nào?
  - Một assumption nào của context window có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain context windows to a new teammate?
  - Which assumption behind context windows could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- tokens_total = tokens_input + tokens_output
code_examples:
- language: python
  title: 'Context windows: inspect one complete path'
  code: "# Topic: Context windows (phase-06-llm-rag-nlp-foundations-4)\ndef grounded_answer(answer: str, evidence: list[str])\
    \ -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return answer + '\\nSources: ' + '; '.join(evidence)\n\
    \nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của context window.
  purpose_en: Illustrate the input-to-output path for context windows.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Tách evidence khỏi generation và từ chối khi không có bằng chứng đủ dùng.
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
- title: Hugging Face Tokenizers
  url: https://huggingface.co/docs/transformers/main/en/tokenizer_summary
  language: en
  purpose_vi: Đo token thật trước khi nói về context và cost.
  read_vi: Đọc tokenizer, special tokens và truncation/padding.
  purpose_en: Measure real tokens before reasoning about context and cost.
  read_en: Read tokenizers, special tokens, and truncation/padding.
  kind: official
  required: true
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
- exercise-6-nlp-foundations
review_item_ids:
- phase-06-llm-rag-nlp-foundations-4-recall
- phase-06-llm-rag-nlp-foundations-4-application
- phase-06-llm-rag-nlp-foundations-4-debug
- phase-06-llm-rag-nlp-foundations-4-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của context window.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng context window và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng context window.
- Đánh giá context window bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ context window mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-06-llm-rag-transformers-1
- phase-06-llm-rag-transformers-2
review_question_vi: Định nghĩa context window bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define context windows in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng context window. Hãy liên hệ cụ
  thể với context window trong lesson phase-06-llm-rag-nlp-foundations-4.
review_answer_en: A strong answer names the input, transformation, output and the context where context windows is used. Relate
  it specifically to context windows in lesson phase-06-llm-rag-nlp-foundations-4.
review_cards:
- id: phase-06-llm-rag-nlp-foundations-4-recall
  type: recall
  question_vi: Định nghĩa context window bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define context windows in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng context window.
  answer_en: A strong answer names the input, transformation, output and the context where context windows is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-nlp-foundations-4-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng context window cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies context windows to an AI engineering problem.
  answer_vi: Ví dụ cho context window cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-06-llm-rag-nlp-foundations-4).
  answer_en: The context windows example should have an explicit input, expected output and a way to run or verify it (phase-06-llm-rag-nlp-foundations-4).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-nlp-foundations-4-debug
  type: debug
  question_vi: Nếu kết quả của context window sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If context windows produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với context window, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test nhỏ và
    error analysis (phase-06-llm-rag-nlp-foundations-4).
  answer_en: For context windows, check inputs/shapes, preprocessing and the baseline first; then isolate the failure with
    a small test and error analysis (phase-06-llm-rag-nlp-foundations-4).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-nlp-foundations-4-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của context window như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of context windows?
  answer_vi: Câu trả lời về context window cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-06-llm-rag-nlp-foundations-4).
  answer_en: The answer about context windows should cover assumptions, metrics/cost, limitations and how to reduce production
    risk (phase-06-llm-rag-nlp-foundations-4).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Context window / Context windows

Context window là khái niệm của module nlp-foundations. Hãy xác định input, output, giả định, failure mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.

## Practice

Tokenize câu tiếng Việt, đếm token, so sánh embedding gần/xa và ghi giới hạn context.
