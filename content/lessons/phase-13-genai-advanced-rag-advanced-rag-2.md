---
lesson_id: phase-13-genai-advanced-rag-advanced-rag-2
phase_id: phase-13-genai-advanced-rag
module_id: advanced-rag
title_vi: Reranking và top-k selection
title_en: Reranking and top-k selection
summary_vi: Học Reranking và top-k selection qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có
  edge case.
summary_en: Learn Reranking and top-k selection through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích reranking và top-k selection bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng reranking và top-k selection.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain reranking and top-k selection with a concrete example.
- Write or adapt a small code example applying reranking and top-k selection.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-13-genai-advanced-rag-advanced-rag-1
- phase-12-genai-rag-rag-foundations-1
key_terms:
- reranking
- top
- selection
- token
- embedding
- retrieval
- evaluation
- advanced-rag
concept_notes_vi: Reranking và top-k selection là một mắt xích của RAG. Tách parsing, chunking, indexing, retrieval, reranking
  và generation để biết lỗi nằm ở đâu. Chunk cần giữ đủ ngữ cảnh; evaluation phải đo retrieval recall, groundedness và câu
  trả lời không có bằng chứng.
concept_notes_en: Reranking và top-k selection is one link in a RAG system. Separate parsing, chunking, indexing, retrieval,
  reranking, and generation so failures are attributable. Chunks need enough context; evaluation should measure retrieval
  recall, groundedness, and abstention when evidence is missing.
why_it_matters_vi: Advanced RAG phải cải thiện retrieval bằng số liệu chứ không chỉ thêm nhiều component.
why_it_matters_en: Advanced RAG should improve retrieval with measurements rather than simply adding components.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Advanced RAG phải cải thiện retrieval bằng số liệu chứ không chỉ thêm nhiều component.'
- Mở Elasticsearch Reference, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Tạo evaluation set 30 câu, so sánh vector/BM25/hybrid, thêm reranker và phân tích failure theo query
  type.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Advanced RAG should improve retrieval with measurements rather than simply adding components.'
- Open Elasticsearch Reference, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Create a 30-question evaluation set, compare vector/BM25/hybrid retrieval, add a reranker,
  and slice failures by query type.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Tạo evaluation set 30 câu, so sánh vector/BM25/hybrid, thêm reranker và phân tích failure theo query type.
    deliverables:
    - Một implementation nhỏ chạy được
    - Một test hoặc benchmark
    - Một note về failure mode và trade-off
    checkpoint: Bạn biết retrieval fail ở recall hay ranking, citation có đủ evidence không và thay đổi nào đáng giữ.
    stretch: Viết thêm một failure test cho reranking và top-k selection và giải thích kết quả.
  en:
    task: Create a 30-question evaluation set, compare vector/BM25/hybrid retrieval, add a reranker, and slice failures by
      query type.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can tell whether retrieval failed on recall or ranking, whether citations support claims, and which change
      is worth keeping.
    stretch: Add a failure test for reranking and top-k selection and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích reranking và top-k selection cho một đồng đội mới như thế nào?
  - Một assumption nào của reranking và top-k selection có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain reranking and top-k selection to a new teammate?
  - Which assumption behind reranking and top-k selection could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- similarity(a,b) = (a · b) / (||a||₂ ||b||₂)
code_examples:
- language: python
  title: 'Reranking and top-k selection: inspect one complete path'
  code: "# Topic: Reranking and top-k selection (phase-13-genai-advanced-rag-advanced-rag-2)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của reranking và top-k selection.
  purpose_en: Illustrate the input-to-output path for reranking and top-k selection.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Elasticsearch Reference
  url: https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Ragas Documentation
  url: https://docs.ragas.io/en/stable/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Qdrant Hybrid Search
  url: https://qdrant.tech/documentation/concepts/hybrid-queries/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: FAISS Documentation
  url: https://faiss.ai/
  language: en
  purpose_vi: Thử index và top-k retrieval trước khi thêm generation.
  read_vi: Đọc index, distance metric và kiểm tra hit@k.
  purpose_en: Try indexing and top-k retrieval before adding generation.
  read_en: Read indexes, distance metrics, and hit@k evaluation.
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
- exercise-13-advanced-rag
review_item_ids:
- phase-13-genai-advanced-rag-advanced-rag-2-recall
- phase-13-genai-advanced-rag-advanced-rag-2-application
- phase-13-genai-advanced-rag-advanced-rag-2-debug
- phase-13-genai-advanced-rag-advanced-rag-2-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của reranking và top-k selection.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng reranking và top-k selection và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng reranking và top-k selection.
- Đánh giá reranking và top-k selection bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ reranking và top-k selection mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-13-genai-advanced-rag-advanced-rag-3
- phase-13-genai-advanced-rag-advanced-rag-4
review_question_vi: Định nghĩa reranking và top-k selection bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define reranking and top-k selection in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng reranking và top-k selection. Hãy
  liên hệ cụ thể với reranking và top-k selection trong lesson phase-13-genai-advanced-rag-advanced-rag-2.
review_answer_en: A strong answer names the input, transformation, output and the context where reranking and top-k selection
  is used. Relate it specifically to reranking and top-k selection in lesson phase-13-genai-advanced-rag-advanced-rag-2.
review_cards:
- id: phase-13-genai-advanced-rag-advanced-rag-2-recall
  type: recall
  question_vi: Định nghĩa reranking và top-k selection bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define reranking and top-k selection in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng reranking và top-k selection.
  answer_en: A strong answer names the input, transformation, output and the context where reranking and top-k selection is
    used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-13-genai-advanced-rag-advanced-rag-2-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng reranking và top-k selection cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies reranking and top-k selection to an AI engineering problem.
  answer_vi: Ví dụ cho reranking và top-k selection cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng
    (phase-13-genai-advanced-rag-advanced-rag-2).
  answer_en: The reranking and top-k selection example should have an explicit input, expected output and a way to run or
    verify it (phase-13-genai-advanced-rag-advanced-rag-2).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-13-genai-advanced-rag-advanced-rag-2-debug
  type: debug
  question_vi: Nếu kết quả của reranking và top-k selection sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If reranking and top-k selection produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với reranking và top-k selection, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-13-genai-advanced-rag-advanced-rag-2).
  answer_en: For reranking and top-k selection, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-13-genai-advanced-rag-advanced-rag-2).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-13-genai-advanced-rag-advanced-rag-2-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của reranking và top-k selection như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of reranking and top-k selection?
  answer_vi: Câu trả lời về reranking và top-k selection cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-13-genai-advanced-rag-advanced-rag-2).
  answer_en: The answer about reranking and top-k selection should cover assumptions, metrics/cost, limitations and how to
    reduce production risk (phase-13-genai-advanced-rag-advanced-rag-2).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Reranking và top-k selection / Reranking and top-k selection

Reranking và top-k selection là một mắt xích của RAG. Tách parsing, chunking, indexing, retrieval, reranking và generation để biết lỗi nằm ở đâu. Chunk cần giữ đủ ngữ cảnh; evaluation phải đo retrieval recall, groundedness và câu trả lời không có bằng chứng.

## Practice

Tạo evaluation set 30 câu, so sánh vector/BM25/hybrid, thêm reranker và phân tích failure theo query type.
