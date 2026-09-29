---
lesson_id: phase-12-genai-rag-rag-foundations-4
phase_id: phase-12-genai-rag
module_id: rag-foundations
title_vi: Retriever, context và LLM
title_en: Retrievers, context, and the LLM
summary_vi: Học Retriever, context và LLM qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge
  case.
summary_en: Learn Retrievers, context, and the LLM through an input → transformation → output model, then verify it with an
  edge-case exercise.
learning_objectives:
- Giải thích retriever, context và llm bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng retriever, context và llm.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain retrievers, context, and the llm with a concrete example.
- Write or adapt a small code example applying retrievers, context, and the llm.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-12-genai-rag-rag-foundations-3
- phase-11-llm-application-llm-application-1
key_terms:
- retriever
- context
- llm
- token
- embedding
- retrieval
- evaluation
- rag-foundations
concept_notes_vi: Retriever, context và LLM là khái niệm của module rag-foundations. Hãy xác định input, output, giả định,
  failure mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.
concept_notes_en: Retriever, context và LLM is a concept in the rag-foundations module. Identify the inputs, outputs, assumptions,
  failure modes, and verification method with a small example before scaling to a project.
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
    stretch: Viết thêm một failure test cho retriever, context và llm và giải thích kết quả.
  en:
    task: Build an ingestion pipeline for Vietnamese documents, preserve metadata, benchmark top-k, and answer with evidence
      chunks.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can attribute a failure to parsing, chunking, retrieval, or generation with a concrete evaluation case.
    stretch: Add a failure test for retrievers, context, and the llm and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích retriever, context và llm cho một đồng đội mới như thế nào?
  - Một assumption nào của retriever, context và llm có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain retrievers, context, and the llm to a new teammate?
  - Which assumption behind retrievers, context, and the llm could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Retrievers, context, and the LLM: inspect one complete path'
  code: "# Topic: Retrievers, context, and the LLM (phase-12-genai-rag-rag-foundations-4)\ndef grounded_answer(answer: str,\
    \ evidence: list[str]) -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return answer + '\\\
    nSources: ' + '; '.join(evidence)\n\nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của retriever, context và llm.
  purpose_en: Illustrate the input-to-output path for retrievers, context, and the llm.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Tách evidence khỏi generation và từ chối khi không có bằng chứng đủ dùng.
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
- phase-12-genai-rag-rag-foundations-4-recall
- phase-12-genai-rag-rag-foundations-4-application
- phase-12-genai-rag-rag-foundations-4-debug
- phase-12-genai-rag-rag-foundations-4-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của retriever, context và llm.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng retriever, context và llm và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng retriever, context và llm.
- Đánh giá retriever, context và llm bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ retriever, context và llm mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-13-genai-advanced-rag-advanced-rag-1
- phase-13-genai-advanced-rag-advanced-rag-2
review_question_vi: Định nghĩa retriever, context và llm bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define retrievers, context, and the llm in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng retriever, context và llm. Hãy
  liên hệ cụ thể với retriever, context và llm trong lesson phase-12-genai-rag-rag-foundations-4.
review_answer_en: A strong answer names the input, transformation, output and the context where retrievers, context, and the
  llm is used. Relate it specifically to retrievers, context, and the llm in lesson phase-12-genai-rag-rag-foundations-4.
review_cards:
- id: phase-12-genai-rag-rag-foundations-4-recall
  type: recall
  question_vi: Định nghĩa retriever, context và llm bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define retrievers, context, and the llm in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng retriever, context và llm.
  answer_en: A strong answer names the input, transformation, output and the context where retrievers, context, and the llm
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-12-genai-rag-rag-foundations-4-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng retriever, context và llm cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies retrievers, context, and the llm to an AI engineering problem.
  answer_vi: Ví dụ cho retriever, context và llm cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-12-genai-rag-rag-foundations-4).
  answer_en: The retrievers, context, and the llm example should have an explicit input, expected output and a way to run
    or verify it (phase-12-genai-rag-rag-foundations-4).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-12-genai-rag-rag-foundations-4-debug
  type: debug
  question_vi: Nếu kết quả của retriever, context và llm sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If retrievers, context, and the llm produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với retriever, context và llm, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-12-genai-rag-rag-foundations-4).
  answer_en: For retrievers, context, and the llm, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-12-genai-rag-rag-foundations-4).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-12-genai-rag-rag-foundations-4-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của retriever, context và llm như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of retrievers, context, and the llm?
  answer_vi: Câu trả lời về retriever, context và llm cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-12-genai-rag-rag-foundations-4).
  answer_en: The answer about retrievers, context, and the llm should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-12-genai-rag-rag-foundations-4).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Retriever, context và LLM / Retrievers, context, and the LLM

Retriever, context và LLM là khái niệm của module rag-foundations. Hãy xác định input, output, giả định, failure mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.

## Practice

Xây ingestion pipeline cho tài liệu tiếng Việt, lưu metadata, benchmark top-k và trả lời kèm các chunk evidence.
