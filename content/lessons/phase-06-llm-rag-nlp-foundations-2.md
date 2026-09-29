---
lesson_id: phase-06-llm-rag-nlp-foundations-2
phase_id: phase-06-llm-rag
module_id: nlp-foundations
title_vi: Word và sentence embedding
title_en: Word and sentence embeddings
summary_vi: Học Word và sentence embedding qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge
  case.
summary_en: Learn Word and sentence embeddings through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích word và sentence embedding bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng word và sentence embedding.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain word and sentence embeddings with a concrete example.
- Write or adapt a small code example applying word and sentence embeddings.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-nlp-foundations-1
- phase-05-mlops-api-1
key_terms:
- word
- sentence
- embedding
- PyTorch
- tensor
- loss
- training
- nlp-foundations
concept_notes_vi: Word và sentence embedding là một mắt xích của RAG. Tách parsing, chunking, indexing, retrieval, reranking
  và generation để biết lỗi nằm ở đâu. Chunk cần giữ đủ ngữ cảnh; evaluation phải đo retrieval recall, groundedness và câu
  trả lời không có bằng chứng.
concept_notes_en: Word và sentence embedding is one link in a RAG system. Separate parsing, chunking, indexing, retrieval,
  reranking, and generation so failures are attributable. Chunks need enough context; evaluation should measure retrieval
  recall, groundedness, and abstention when evidence is missing.
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
    stretch: Viết thêm một failure test cho word và sentence embedding và giải thích kết quả.
  en:
    task: Tokenize Vietnamese text, count tokens, compare near/far embeddings, and record context limits.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain that embeddings are not truth and how context windows affect cost and quality.
    stretch: Add a failure test for word and sentence embeddings and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích word và sentence embedding cho một đồng đội mới như thế nào?
  - Một assumption nào của word và sentence embedding có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain word and sentence embeddings to a new teammate?
  - Which assumption behind word and sentence embeddings could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- z = Wx + b
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: 'Word and sentence embeddings: inspect one complete path'
  code: "# Topic: Word and sentence embeddings (phase-06-llm-rag-nlp-foundations-2)\nfrom math import sqrt\n\ndef dot(left:\
    \ list[float], right: list[float]) -> float:\n    if len(left) != len(right):\n        raise ValueError('vectors must\
    \ have equal length')\n    return sum(a * b for a, b in zip(left, right))\n\nleft = [1.0, 2.0]\nright = [0.5, 3.0]\nprint({'dot':\
    \ dot(left, right), 'norm_left': sqrt(dot(left, left))})"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của word và sentence embedding.
  purpose_en: Illustrate the input-to-output path for word and sentence embeddings.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Kiểm tra shape trước phép toán; ví dụ dùng dữ liệu nhỏ để kết quả có thể tính tay.
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
- title: Sentence Transformers
  url: https://www.sbert.net/
  language: en
  purpose_vi: Tạo sentence embedding và đánh giá similarity trên câu tiếng Việt.
  read_vi: Đọc semantic search và similarity; ghi rõ model embedding đã chọn.
  purpose_en: Create sentence embeddings and evaluate similarity on Vietnamese text.
  read_en: Read semantic search and similarity; record the embedding model.
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
- phase-06-llm-rag-nlp-foundations-2-recall
- phase-06-llm-rag-nlp-foundations-2-application
- phase-06-llm-rag-nlp-foundations-2-debug
- phase-06-llm-rag-nlp-foundations-2-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của word và sentence embedding.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng word và sentence embedding và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng word và sentence embedding.
- Đánh giá word và sentence embedding bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ word và sentence embedding mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-06-llm-rag-nlp-foundations-3
- phase-06-llm-rag-nlp-foundations-4
review_question_vi: Định nghĩa word và sentence embedding bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define word and sentence embeddings in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng word và sentence embedding. Hãy
  liên hệ cụ thể với word và sentence embedding trong lesson phase-06-llm-rag-nlp-foundations-2.
review_answer_en: A strong answer names the input, transformation, output and the context where word and sentence embeddings
  is used. Relate it specifically to word and sentence embeddings in lesson phase-06-llm-rag-nlp-foundations-2.
review_cards:
- id: phase-06-llm-rag-nlp-foundations-2-recall
  type: recall
  question_vi: Định nghĩa word và sentence embedding bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define word and sentence embeddings in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng word và sentence embedding.
  answer_en: A strong answer names the input, transformation, output and the context where word and sentence embeddings is
    used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-nlp-foundations-2-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng word và sentence embedding cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies word and sentence embeddings to an AI engineering problem.
  answer_vi: Ví dụ cho word và sentence embedding cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-06-llm-rag-nlp-foundations-2).
  answer_en: The word and sentence embeddings example should have an explicit input, expected output and a way to run or verify
    it (phase-06-llm-rag-nlp-foundations-2).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-nlp-foundations-2-debug
  type: debug
  question_vi: Nếu kết quả của word và sentence embedding sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If word and sentence embeddings produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với word và sentence embedding, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-06-llm-rag-nlp-foundations-2).
  answer_en: For word and sentence embeddings, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-06-llm-rag-nlp-foundations-2).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-nlp-foundations-2-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của word và sentence embedding như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of word and sentence embeddings?
  answer_vi: Câu trả lời về word và sentence embedding cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-06-llm-rag-nlp-foundations-2).
  answer_en: The answer about word and sentence embeddings should cover assumptions, metrics/cost, limitations and how to
    reduce production risk (phase-06-llm-rag-nlp-foundations-2).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Word và sentence embedding / Word and sentence embeddings

Word và sentence embedding là một mắt xích của RAG. Tách parsing, chunking, indexing, retrieval, reranking và generation để biết lỗi nằm ở đâu. Chunk cần giữ đủ ngữ cảnh; evaluation phải đo retrieval recall, groundedness và câu trả lời không có bằng chứng.

## Practice

Tokenize câu tiếng Việt, đếm token, so sánh embedding gần/xa và ghi giới hạn context.
