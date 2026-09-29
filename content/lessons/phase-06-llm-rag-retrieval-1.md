---
lesson_id: phase-06-llm-rag-retrieval-1
phase_id: phase-06-llm-rag
module_id: retrieval
title_vi: Vector search
title_en: Vector search
summary_vi: Học Vector search qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Vector search through an input → transformation → output model, then verify it with an edge-case exercise.
learning_objectives:
- Giải thích vector search bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng vector search.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain vector search with a concrete example.
- Write or adapt a small code example applying vector search.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-transformers-4
- phase-05-mlops-api-1
key_terms:
- vector
- search
- NumPy
- gradient
- optimization
- retrieval
concept_notes_vi: Vector search là nền tảng biểu diễn dữ liệu số. Luôn ghi shape, đơn vị và trục của tensor; kiểm tra phép
  nhân bằng một ví dụ nhỏ trước khi dùng batch lớn. Với similarity, chuẩn hóa cách đo để hai vector khác scale không làm sai
  kết luận.
concept_notes_en: Vector search is a foundation for numerical representations. Track tensor shapes, units, and axes; verify
  multiplication on a small example before using a large batch. For similarity, normalize the measure so scale differences
  do not change the conclusion.
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
    stretch: Viết thêm một failure test cho vector search và giải thích kết quả.
  en:
    task: Create ten document chunks and ten known-answer queries, measure hit@k, and inspect false negatives.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can tell whether RAG failed during retrieval or generation and show evidence for the conclusion.
    stretch: Add a failure test for vector search and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích vector search cho một đồng đội mới như thế nào?
  - Một assumption nào của vector search có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain vector search to a new teammate?
  - Which assumption behind vector search could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- x · y = Σ_i x_i y_i
- '||x||₂ = √(Σ_i x_i²)'
code_examples:
- language: python
  title: 'Vector search: inspect one complete path'
  code: "# Topic: Vector search (phase-06-llm-rag-retrieval-1)\nfrom math import sqrt\n\ndef dot(left: list[float], right:\
    \ list[float]) -> float:\n    if len(left) != len(right):\n        raise ValueError('vectors must have equal length')\n\
    \    return sum(a * b for a, b in zip(left, right))\n\nleft = [1.0, 2.0]\nright = [0.5, 3.0]\nprint({'dot': dot(left,\
    \ right), 'norm_left': sqrt(dot(left, left))})"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của vector search.
  purpose_en: Illustrate the input-to-output path for vector search.
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
- exercise-6-retrieval
review_item_ids:
- phase-06-llm-rag-retrieval-1-recall
- phase-06-llm-rag-retrieval-1-application
- phase-06-llm-rag-retrieval-1-debug
- phase-06-llm-rag-retrieval-1-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của vector search.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng vector search và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng vector search.
- Đánh giá vector search bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ vector search mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-06-llm-rag-retrieval-2
- phase-06-llm-rag-retrieval-3
review_question_vi: Định nghĩa vector search bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define vector search in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng vector search. Hãy liên hệ cụ thể
  với vector search trong lesson phase-06-llm-rag-retrieval-1.
review_answer_en: A strong answer names the input, transformation, output and the context where vector search is used. Relate
  it specifically to vector search in lesson phase-06-llm-rag-retrieval-1.
review_cards:
- id: phase-06-llm-rag-retrieval-1-recall
  type: recall
  question_vi: Định nghĩa vector search bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define vector search in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng vector search.
  answer_en: A strong answer names the input, transformation, output and the context where vector search is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-retrieval-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng vector search cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies vector search to an AI engineering problem.
  answer_vi: Ví dụ cho vector search cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-06-llm-rag-retrieval-1).
  answer_en: The vector search example should have an explicit input, expected output and a way to run or verify it (phase-06-llm-rag-retrieval-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-retrieval-1-debug
  type: debug
  question_vi: Nếu kết quả của vector search sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If vector search produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với vector search, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test nhỏ và
    error analysis (phase-06-llm-rag-retrieval-1).
  answer_en: For vector search, check inputs/shapes, preprocessing and the baseline first; then isolate the failure with a
    small test and error analysis (phase-06-llm-rag-retrieval-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-retrieval-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của vector search như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of vector search?
  answer_vi: Câu trả lời về vector search cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-06-llm-rag-retrieval-1).
  answer_en: The answer about vector search should cover assumptions, metrics/cost, limitations and how to reduce production
    risk (phase-06-llm-rag-retrieval-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Vector search / Vector search

Vector search là nền tảng biểu diễn dữ liệu số. Luôn ghi shape, đơn vị và trục của tensor; kiểm tra phép nhân bằng một ví dụ nhỏ trước khi dùng batch lớn. Với similarity, chuẩn hóa cách đo để hai vector khác scale không làm sai kết luận.

## Practice

Tạo 10 document chunks, viết 10 query có đáp án biết trước, đo hit@k và đọc các false negative.
