---
lesson_id: phase-06-llm-rag-retrieval-4
phase_id: phase-06-llm-rag
module_id: retrieval
title_vi: Reranking và hybrid retrieval
title_en: Reranking and hybrid retrieval
summary_vi: Học Reranking và hybrid retrieval qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có
  edge case.
summary_en: Learn Reranking and hybrid retrieval through an input → transformation → output model, then verify it with an
  edge-case exercise.
learning_objectives:
- Giải thích reranking và hybrid retrieval bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng reranking và hybrid retrieval.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain reranking and hybrid retrieval with a concrete example.
- Write or adapt a small code example applying reranking and hybrid retrieval.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-retrieval-3
- phase-05-mlops-api-1
key_terms:
- reranking
- hybrid
- retrieval
- token
- embedding
- evaluation
concept_notes_vi: Reranking và hybrid retrieval là một mắt xích của RAG. Tách parsing, chunking, indexing, retrieval, reranking
  và generation để biết lỗi nằm ở đâu. Chunk cần giữ đủ ngữ cảnh; evaluation phải đo retrieval recall, groundedness và câu
  trả lời không có bằng chứng.
concept_notes_en: Reranking và hybrid retrieval is one link in a RAG system. Separate parsing, chunking, indexing, retrieval,
  reranking, and generation so failures are attributable. Chunks need enough context; evaluation should measure retrieval
  recall, groundedness, and abstention when evidence is missing.
why_it_matters_vi: Thiết kế retrieval có chunk, metadata, vector search và reranking để đo được recall trước generation.
why_it_matters_en: Design retrieval with chunks, metadata, vector search, and reranking so recall is measured before generation.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Thiết kế retrieval có chunk, metadata, vector search và reranking để đo được recall
  trước generation.'
- Mở Hugging Face NLP Course, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Tạo 10 document chunks, viết 10 query có đáp án biết trước, đo hit@k và đọc các false negative.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Design retrieval with chunks, metadata, vector search, and reranking so recall is measured
  before generation.'
- Open Hugging Face NLP Course, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Create ten document chunks and ten known-answer queries, measure hit@k, and inspect false negatives.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Tạo 10 document chunks, viết 10 query có đáp án biết trước, đo hit@k và đọc các false negative.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn biết RAG fail do retrieval hay generation và có evidence cho kết luận đó.
    stretch: Viết thêm một failure test cho reranking và hybrid retrieval và giải thích kết quả.
  en:
    task: Create ten document chunks and ten known-answer queries, measure hit@k, and inspect false negatives.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can tell whether RAG failed during retrieval or generation and show evidence for the conclusion.
    stretch: Add a failure test for reranking and hybrid retrieval and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích reranking và hybrid retrieval cho một đồng đội mới như thế nào?
  - Một assumption nào của reranking và hybrid retrieval có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain reranking and hybrid retrieval to a new teammate?
  - Which assumption behind reranking and hybrid retrieval could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- similarity(a,b) = (a · b) / (||a||₂ ||b||₂)
code_examples:
- language: python
  title: 'Reranking and hybrid retrieval: inspect one complete path'
  code: "# Topic: Reranking and hybrid retrieval (phase-06-llm-rag-retrieval-4)\ndef grounded_answer(answer: str, evidence:\
    \ list[str]) -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return answer + '\\nSources: '\
    \ + '; '.join(evidence)\n\nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của reranking và hybrid retrieval.
  purpose_en: Illustrate the input-to-output path for reranking and hybrid retrieval.
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
- exercise-6-retrieval
review_item_ids:
- phase-06-llm-rag-retrieval-4-recall
- phase-06-llm-rag-retrieval-4-application
- phase-06-llm-rag-retrieval-4-debug
- phase-06-llm-rag-retrieval-4-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của reranking và hybrid retrieval.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng reranking và hybrid retrieval và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng reranking và hybrid retrieval.
- Đánh giá reranking và hybrid retrieval bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ reranking và hybrid retrieval mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-06-llm-rag-rag-1
- phase-06-llm-rag-rag-2
review_question_vi: Định nghĩa reranking và hybrid retrieval bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define reranking and hybrid retrieval in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng reranking và hybrid retrieval.
  Hãy liên hệ cụ thể với reranking và hybrid retrieval trong lesson phase-06-llm-rag-retrieval-4.
review_answer_en: A strong answer names the input, transformation, output and the context where reranking and hybrid retrieval
  is used. Relate it specifically to reranking and hybrid retrieval in lesson phase-06-llm-rag-retrieval-4.
review_cards:
- id: phase-06-llm-rag-retrieval-4-recall
  type: recall
  question_vi: Định nghĩa reranking và hybrid retrieval bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define reranking and hybrid retrieval in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng reranking và hybrid retrieval.
  answer_en: A strong answer names the input, transformation, output and the context where reranking and hybrid retrieval
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-retrieval-4-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng reranking và hybrid retrieval cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies reranking and hybrid retrieval to an AI engineering problem.
  answer_vi: Ví dụ cho reranking và hybrid retrieval cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng
    (phase-06-llm-rag-retrieval-4).
  answer_en: The reranking and hybrid retrieval example should have an explicit input, expected output and a way to run or
    verify it (phase-06-llm-rag-retrieval-4).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-retrieval-4-debug
  type: debug
  question_vi: Nếu kết quả của reranking và hybrid retrieval sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If reranking and hybrid retrieval produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với reranking và hybrid retrieval, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-06-llm-rag-retrieval-4).
  answer_en: For reranking and hybrid retrieval, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-06-llm-rag-retrieval-4).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-retrieval-4-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của reranking và hybrid retrieval như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of reranking and hybrid retrieval?
  answer_vi: Câu trả lời về reranking và hybrid retrieval cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-06-llm-rag-retrieval-4).
  answer_en: The answer about reranking and hybrid retrieval should cover assumptions, metrics/cost, limitations and how to
    reduce production risk (phase-06-llm-rag-retrieval-4).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Reranking và hybrid retrieval / Reranking and hybrid retrieval

Reranking và hybrid retrieval là một mắt xích của RAG. Tách parsing, chunking, indexing, retrieval, reranking và generation để biết lỗi nằm ở đâu. Chunk cần giữ đủ ngữ cảnh; evaluation phải đo retrieval recall, groundedness và câu trả lời không có bằng chứng.

## Practice

Tạo 10 document chunks, viết 10 query có đáp án biết trước, đo hit@k và đọc các false negative.
