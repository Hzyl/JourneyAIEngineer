---
lesson_id: phase-12-genai-rag-rag-foundations-3
phase_id: phase-12-genai-rag
module_id: rag-foundations
title_vi: Embedding và vector database
title_en: Embeddings and vector databases
summary_vi: Học Embedding và vector database qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có
  edge case.
summary_en: Learn Embeddings and vector databases through an input → transformation → output model, then verify it with an
  edge-case exercise.
learning_objectives:
- Giải thích embedding và vector database bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng embedding và vector database.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain embeddings and vector databases with a concrete example.
- Write or adapt a small code example applying embeddings and vector databases.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-12-genai-rag-rag-foundations-2
- phase-11-llm-application-llm-application-1
key_terms:
- embedding
- vector
- database
- token
- retrieval
- evaluation
- rag-foundations
concept_notes_vi: Embedding và vector database mô tả một boundary giữa dữ liệu và service. Một request tốt có schema, validation,
  status code, timeout và thông tin lỗi có thể hành động; query tốt có parameter binding, index phù hợp và test cho dữ liệu
  rỗng hoặc sai kiểu.
concept_notes_en: Embedding và vector database describes a boundary between data and a service. A sound request has a schema,
  validation, status code, timeout, and actionable errors; a sound query uses parameter binding, appropriate indexes, and
  tests empty or malformed data.
why_it_matters_vi: RAG tách retrieval khỏi generation để câu trả lời có thể truy nguồn và từ chối khi không có bằng chứng.
why_it_matters_en: RAG separates retrieval from generation so answers can be sourced and can abstain without evidence.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: RAG tách retrieval khỏi generation để câu trả lời có thể truy nguồn và từ chối khi không
  có bằng chứng.'
- Mở Qdrant Concepts, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Xây ingestion pipeline cho tài liệu tiếng Việt, lưu metadata, benchmark top-k và trả lời kèm các chunk
  evidence.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: RAG separates retrieval from generation so answers can be sourced and can abstain without
  evidence.'
- Open Qdrant Concepts, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Build an ingestion pipeline for Vietnamese documents, preserve metadata, benchmark top-k, and
  answer with evidence chunks.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Xây ingestion pipeline cho tài liệu tiếng Việt, lưu metadata, benchmark top-k và trả lời kèm các chunk evidence.
    deliverables:
    - Một implementation nhỏ chạy được
    - Một test hoặc benchmark
    - Một note về failure mode và trade-off
    checkpoint: Bạn chỉ ra được lỗi do parsing, chunking, retrieval hay generation bằng một evaluation case cụ thể.
    stretch: Viết thêm một failure test cho embedding và vector database và giải thích kết quả.
  en:
    task: Build an ingestion pipeline for Vietnamese documents, preserve metadata, benchmark top-k, and answer with evidence
      chunks.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can attribute a failure to parsing, chunking, retrieval, or generation with a concrete evaluation case.
    stretch: Add a failure test for embeddings and vector databases and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích embedding và vector database cho một đồng đội mới như thế nào?
  - Một assumption nào của embedding và vector database có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain embeddings and vector databases to a new teammate?
  - Which assumption behind embeddings and vector databases could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- similarity(a,b) = (a · b) / (||a||₂ ||b||₂)
code_examples:
- language: python
  title: 'Embeddings and vector databases: inspect one complete path'
  code: "# Topic: Embeddings and vector databases (phase-12-genai-rag-rag-foundations-3)\nfrom math import sqrt\n\ndef dot(left:\
    \ list[float], right: list[float]) -> float:\n    if len(left) != len(right):\n        raise ValueError('vectors must\
    \ have equal length')\n    return sum(a * b for a, b in zip(left, right))\n\nleft = [1.0, 2.0]\nright = [0.5, 3.0]\nprint({'dot':\
    \ dot(left, right), 'norm_left': sqrt(dot(left, left))})"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của embedding và vector database.
  purpose_en: Illustrate the input-to-output path for embeddings and vector databases.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Kiểm tra shape trước phép toán; ví dụ dùng dữ liệu nhỏ để kết quả có thể tính tay.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Qdrant Concepts
  url: https://qdrant.tech/documentation/concepts/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: FAISS Getting Started
  url: https://github.com/facebookresearch/faiss/wiki/Getting-started
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Hugging Face NLP Course
  url: https://huggingface.co/learn/nlp-course/chapter1/1
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: NumPy Quickstart
  url: https://numpy.org/doc/stable/user/quickstart.html
  language: en
  purpose_vi: Thực hành array, shape và phép toán vector bằng NumPy.
  read_vi: Đọc array shape, indexing và broadcasting rồi in shape ở mỗi bước.
  purpose_en: Practice arrays, shapes, and vector operations with NumPy.
  read_en: Read array shapes, indexing, and broadcasting; print every shape.
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
- exercise-12-rag-foundations
review_item_ids:
- phase-12-genai-rag-rag-foundations-3-recall
- phase-12-genai-rag-rag-foundations-3-application
- phase-12-genai-rag-rag-foundations-3-debug
- phase-12-genai-rag-rag-foundations-3-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của embedding và vector database.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng embedding và vector database và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng embedding và vector database.
- Đánh giá embedding và vector database bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ embedding và vector database mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-12-genai-rag-rag-foundations-4
- phase-13-genai-advanced-rag-advanced-rag-1
review_question_vi: Định nghĩa embedding và vector database bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define embeddings and vector databases in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng embedding và vector database. Hãy
  liên hệ cụ thể với embedding và vector database trong lesson phase-12-genai-rag-rag-foundations-3.
review_answer_en: A strong answer names the input, transformation, output and the context where embeddings and vector databases
  is used. Relate it specifically to embeddings and vector databases in lesson phase-12-genai-rag-rag-foundations-3.
review_cards:
- id: phase-12-genai-rag-rag-foundations-3-recall
  type: recall
  question_vi: Định nghĩa embedding và vector database bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define embeddings and vector databases in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng embedding và vector database.
  answer_en: A strong answer names the input, transformation, output and the context where embeddings and vector databases
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-12-genai-rag-rag-foundations-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng embedding và vector database cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies embeddings and vector databases to an AI engineering problem.
  answer_vi: Ví dụ cho embedding và vector database cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng
    (phase-12-genai-rag-rag-foundations-3).
  answer_en: The embeddings and vector databases example should have an explicit input, expected output and a way to run or
    verify it (phase-12-genai-rag-rag-foundations-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-12-genai-rag-rag-foundations-3-debug
  type: debug
  question_vi: Nếu kết quả của embedding và vector database sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If embeddings and vector databases produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với embedding và vector database, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-12-genai-rag-rag-foundations-3).
  answer_en: For embeddings and vector databases, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-12-genai-rag-rag-foundations-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-12-genai-rag-rag-foundations-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của embedding và vector database như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of embeddings and vector databases?
  answer_vi: Câu trả lời về embedding và vector database cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-12-genai-rag-rag-foundations-3).
  answer_en: The answer about embeddings and vector databases should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-12-genai-rag-rag-foundations-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Embedding và vector database / Embeddings and vector databases

Embedding và vector database mô tả một boundary giữa dữ liệu và service. Một request tốt có schema, validation, status code, timeout và thông tin lỗi có thể hành động; query tốt có parameter binding, index phù hợp và test cho dữ liệu rỗng hoặc sai kiểu.

## Practice

Xây ingestion pipeline cho tài liệu tiếng Việt, lưu metadata, benchmark top-k và trả lời kèm các chunk evidence.
