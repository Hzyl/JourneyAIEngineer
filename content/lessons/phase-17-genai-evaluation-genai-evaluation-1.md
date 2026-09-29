---
lesson_id: phase-17-genai-evaluation-genai-evaluation-1
phase_id: phase-17-genai-evaluation
module_id: genai-evaluation
title_vi: LLM evaluation và test set
title_en: LLM evaluation and test sets
summary_vi: Học LLM evaluation và test set qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge
  case.
summary_en: Learn LLM evaluation and test sets through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích llm evaluation và test set bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng llm evaluation và test set.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain llm evaluation and test sets with a concrete example.
- Write or adapt a small code example applying llm evaluation and test sets.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-16-genai-mcp-mcp-4
- phase-16-genai-mcp-mcp-1
key_terms:
- llm
- evaluation
- test
- set
- token
- embedding
- retrieval
- genai-evaluation
concept_notes_vi: LLM evaluation và test set biến một demo AI thành hệ thống có thể tin cậy. Định nghĩa metric và dataset
  kiểm thử trước, ghi prompt/model/version/token/latency, rồi phân tích failure theo retrieval, generation, data hoặc infrastructure
  thay vì chỉ nhìn một điểm số.
concept_notes_en: LLM evaluation và test set turns an AI demo into a system that can be trusted. Define metrics and an evaluation
  set first, record prompt/model/version/tokens/latency, and attribute failures to retrieval, generation, data, or infrastructure
  instead of relying on one score.
why_it_matters_vi: Evaluation là cách phân biệt demo nghe hay với hệ thống đáng tin và có thể cải thiện.
why_it_matters_en: Evaluation distinguishes a fluent demo from a trustworthy system that can improve.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Evaluation là cách phân biệt demo nghe hay với hệ thống đáng tin và có thể cải thiện.'
- Mở OpenAI Evals, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Tạo golden set, rubric và regression suite cho RAG/agent; lưu cả lỗi và chi phí mỗi run.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Evaluation distinguishes a fluent demo from a trustworthy system that can improve.'
- Open OpenAI Evals, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Create a golden set, rubric, and regression suite for RAG/agents, recording failures and cost
  for every run.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Tạo golden set, rubric và regression suite cho RAG/agent; lưu cả lỗi và chi phí mỗi run.
    deliverables:
    - Một implementation nhỏ chạy được
    - Một test hoặc benchmark
    - Một note về failure mode và trade-off
    checkpoint: Bạn biết metric nào đo retrieval, metric nào đo grounded answer và khi nào human review bắt buộc.
    stretch: Viết thêm một failure test cho llm evaluation và test set và giải thích kết quả.
  en:
    task: Create a golden set, rubric, and regression suite for RAG/agents, recording failures and cost for every run.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can identify retrieval metrics, grounded-answer metrics, and when human review is required.
    stretch: Add a failure test for llm evaluation and test sets and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích llm evaluation và test set cho một đồng đội mới như thế nào?
  - Một assumption nào của llm evaluation và test set có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain llm evaluation and test sets to a new teammate?
  - Which assumption behind llm evaluation and test sets could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'LLM evaluation and test sets: inspect one complete path'
  code: "# Topic: LLM evaluation and test sets (phase-17-genai-evaluation-genai-evaluation-1)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của llm evaluation và test set.
  purpose_en: Illustrate the input-to-output path for llm evaluation and test sets.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: OpenAI Evals
  url: https://github.com/openai/evals
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
  title: DeepEval Documentation
  url: https://deepeval.com/docs/getting-started
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
- exercise-17-genai-evaluation
review_item_ids:
- phase-17-genai-evaluation-genai-evaluation-1-recall
- phase-17-genai-evaluation-genai-evaluation-1-application
- phase-17-genai-evaluation-genai-evaluation-1-debug
- phase-17-genai-evaluation-genai-evaluation-1-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của llm evaluation và test set.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng llm evaluation và test set và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng llm evaluation và test set.
- Đánh giá llm evaluation và test set bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ llm evaluation và test set mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-17-genai-evaluation-genai-evaluation-2
- phase-17-genai-evaluation-genai-evaluation-3
review_question_vi: Định nghĩa llm evaluation và test set bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define llm evaluation and test sets in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng llm evaluation và test set. Hãy
  liên hệ cụ thể với llm evaluation và test set trong lesson phase-17-genai-evaluation-genai-evaluation-1.
review_answer_en: A strong answer names the input, transformation, output and the context where llm evaluation and test sets
  is used. Relate it specifically to llm evaluation and test sets in lesson phase-17-genai-evaluation-genai-evaluation-1.
review_cards:
- id: phase-17-genai-evaluation-genai-evaluation-1-recall
  type: recall
  question_vi: Định nghĩa llm evaluation và test set bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define llm evaluation and test sets in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng llm evaluation và test set.
  answer_en: A strong answer names the input, transformation, output and the context where llm evaluation and test sets is
    used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-17-genai-evaluation-genai-evaluation-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng llm evaluation và test set cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies llm evaluation and test sets to an AI engineering problem.
  answer_vi: Ví dụ cho llm evaluation và test set cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-17-genai-evaluation-genai-evaluation-1).
  answer_en: The llm evaluation and test sets example should have an explicit input, expected output and a way to run or verify
    it (phase-17-genai-evaluation-genai-evaluation-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-17-genai-evaluation-genai-evaluation-1-debug
  type: debug
  question_vi: Nếu kết quả của llm evaluation và test set sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If llm evaluation and test sets produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với llm evaluation và test set, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-17-genai-evaluation-genai-evaluation-1).
  answer_en: For llm evaluation and test sets, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-17-genai-evaluation-genai-evaluation-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-17-genai-evaluation-genai-evaluation-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của llm evaluation và test set như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of llm evaluation and test sets?
  answer_vi: Câu trả lời về llm evaluation và test set cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-17-genai-evaluation-genai-evaluation-1).
  answer_en: The answer about llm evaluation and test sets should cover assumptions, metrics/cost, limitations and how to
    reduce production risk (phase-17-genai-evaluation-genai-evaluation-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# LLM evaluation và test set / LLM evaluation and test sets

LLM evaluation và test set biến một demo AI thành hệ thống có thể tin cậy. Định nghĩa metric và dataset kiểm thử trước, ghi prompt/model/version/token/latency, rồi phân tích failure theo retrieval, generation, data hoặc infrastructure thay vì chỉ nhìn một điểm số.

## Practice

Tạo golden set, rubric và regression suite cho RAG/agent; lưu cả lỗi và chi phí mỗi run.
