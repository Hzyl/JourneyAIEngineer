---
lesson_id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2
phase_id: phase-09-genai-ml-fundamentals
module_id: genai-ml-fundamentals
title_vi: Embedding và similarity search
title_en: Embeddings and similarity search
summary_vi: Học Embedding và similarity search qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có
  edge case.
summary_en: Learn Embeddings and similarity search through an input → transformation → output model, then verify it with an
  edge-case exercise.
learning_objectives:
- Giải thích embedding và similarity search bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng embedding và similarity search.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain embeddings and similarity search with a concrete example.
- Write or adapt a small code example applying embeddings and similarity search.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1
- phase-08-genai-software-genai-software-foundations-1
key_terms:
- embedding
- similarity
- search
- dataset
- feature
- baseline
- evaluation
- genai-ml-fundamentals
concept_notes_vi: Embedding và similarity search là một mắt xích của RAG. Tách parsing, chunking, indexing, retrieval, reranking
  và generation để biết lỗi nằm ở đâu. Chunk cần giữ đủ ngữ cảnh; evaluation phải đo retrieval recall, groundedness và câu
  trả lời không có bằng chứng.
concept_notes_en: Embedding và similarity search is one link in a RAG system. Separate parsing, chunking, indexing, retrieval,
  reranking, and generation so failures are attributable. Chunks need enough context; evaluation should measure retrieval
  recall, groundedness, and abstention when evidence is missing.
why_it_matters_vi: Embedding và metric là cầu nối giữa dữ liệu của người dùng với retrieval, clustering và model quality.
why_it_matters_en: Embeddings and metrics connect user data to retrieval, clustering, and model quality.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Embedding và metric là cầu nối giữa dữ liệu của người dùng với retrieval, clustering
  và model quality.'
- Mở Google Machine Learning Crash Course, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Tạo một embedding benchmark nhỏ: split dữ liệu, đo cosine similarity, kiểm tra leakage và vẽ loss curve.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Embeddings and metrics connect user data to retrieval, clustering, and model quality.'
- Open Google Machine Learning Crash Course, read the section marked Read this lesson, and record one verified example or
  definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Build a small embedding benchmark: split data, measure cosine similarity, check leakage, and
  plot a loss curve.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Tạo một embedding benchmark nhỏ: split dữ liệu, đo cosine similarity, kiểm tra leakage và vẽ loss curve.'
    deliverables:
    - Một implementation nhỏ chạy được
    - Một test hoặc benchmark
    - Một note về failure mode và trade-off
    checkpoint: Bạn giải thích được một similarity score, một split hợp lệ và cách overfitting làm kết quả retrieval kém đi.
    stretch: Viết thêm một failure test cho embedding và similarity search và giải thích kết quả.
  en:
    task: 'Build a small embedding benchmark: split data, measure cosine similarity, check leakage, and plot a loss curve.'
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can explain a similarity score, a valid split, and how overfitting degrades retrieval.
    stretch: Add a failure test for embeddings and similarity search and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích embedding và similarity search cho một đồng đội mới như thế nào?
  - Một assumption nào của embedding và similarity search có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain embeddings and similarity search to a new teammate?
  - Which assumption behind embeddings and similarity search could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Embeddings and similarity search: inspect one complete path'
  code: "# Topic: Embeddings and similarity search (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2)\nfrom math import\
    \ sqrt\n\ndef dot(left: list[float], right: list[float]) -> float:\n    if len(left) != len(right):\n        raise ValueError('vectors\
    \ must have equal length')\n    return sum(a * b for a, b in zip(left, right))\n\nleft = [1.0, 2.0]\nright = [0.5, 3.0]\n\
    print({'dot': dot(left, right), 'norm_left': sqrt(dot(left, left))})"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của embedding và similarity search.
  purpose_en: Illustrate the input-to-output path for embeddings and similarity search.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Kiểm tra shape trước phép toán; ví dụ dùng dữ liệu nhỏ để kết quả có thể tính tay.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Google Machine Learning Crash Course
  url: https://developers.google.com/machine-learning/crash-course
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: scikit-learn User Guide
  url: https://scikit-learn.org/stable/user_guide.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Sentence Transformers
  url: https://www.sbert.net/
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
- exercise-9-genai-ml-fundamentals
review_item_ids:
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2-recall
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2-application
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2-debug
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của embedding và similarity search.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng embedding và similarity search và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng embedding và similarity search.
- Đánh giá embedding và similarity search bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ embedding và similarity search mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-3
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4
review_question_vi: Định nghĩa embedding và similarity search bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define embeddings and similarity search in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng embedding và similarity search.
  Hãy liên hệ cụ thể với embedding và similarity search trong lesson phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2.
review_answer_en: A strong answer names the input, transformation, output and the context where embeddings and similarity
  search is used. Relate it specifically to embeddings and similarity search in lesson phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2.
review_cards:
- id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2-recall
  type: recall
  question_vi: Định nghĩa embedding và similarity search bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define embeddings and similarity search in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng embedding và similarity search.
  answer_en: A strong answer names the input, transformation, output and the context where embeddings and similarity search
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng embedding và similarity search cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies embeddings and similarity search to an AI engineering problem.
  answer_vi: Ví dụ cho embedding và similarity search cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng
    (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2).
  answer_en: The embeddings and similarity search example should have an explicit input, expected output and a way to run
    or verify it (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2-debug
  type: debug
  question_vi: Nếu kết quả của embedding và similarity search sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If embeddings and similarity search produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với embedding và similarity search, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi
    bằng test nhỏ và error analysis (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2).
  answer_en: For embeddings and similarity search, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của embedding và similarity search như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of embeddings and similarity search?
  answer_vi: Câu trả lời về embedding và similarity search cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro
    trong production (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2).
  answer_en: The answer about embeddings and similarity search should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-09-genai-ml-fundamentals-genai-ml-fundamentals-2).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Embedding và similarity search / Embeddings and similarity search

Embedding và similarity search là một mắt xích của RAG. Tách parsing, chunking, indexing, retrieval, reranking và generation để biết lỗi nằm ở đâu. Chunk cần giữ đủ ngữ cảnh; evaluation phải đo retrieval recall, groundedness và câu trả lời không có bằng chứng.

## Practice

Tạo một embedding benchmark nhỏ: split dữ liệu, đo cosine similarity, kiểm tra leakage và vẽ loss curve.
