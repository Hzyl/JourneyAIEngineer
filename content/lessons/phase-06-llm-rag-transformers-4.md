---
lesson_id: phase-06-llm-rag-transformers-4
phase_id: phase-06-llm-rag
module_id: transformers
title_vi: Structured output và function calling
title_en: Structured output and function calling
summary_vi: Học Structured output và function calling qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài
  tập có edge case.
summary_en: Learn Structured output and function calling through an input → transformation → output model, then verify it
  with an edge-case exercise.
learning_objectives:
- Giải thích structured output và function calling bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng structured output và function calling.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain structured output and function calling with a concrete example.
- Write or adapt a small code example applying structured output and function calling.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-transformers-3
- phase-05-mlops-api-1
key_terms:
- structured
- output
- function
- calling
- token
- embedding
- retrieval
- evaluation
- transformers
concept_notes_vi: Structured output và function calling là một kỹ năng Software Engineering dùng để biến ý tưởng thành code
  có thể đọc, kiểm tra và bảo trì. Hãy xác định input, output, invariant và lỗi có thể xảy ra trước khi viết implementation.
  Trong Python, giữ boundary nhỏ giúp test nhanh và traceback chỉ ra đúng lớp lỗi.
concept_notes_en: Structured output và function calling is a Software Engineering skill for turning an idea into code that
  can be read, tested, and maintained. Define the inputs, outputs, invariants, and failure modes before implementing. In Python,
  small boundaries make tests fast and tracebacks actionable.
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
    stretch: Viết thêm một failure test cho structured output và function calling và giải thích kết quả.
  en:
    task: Write a prompt with an input/output contract, test missing data, and validate JSON before downstream use.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can identify prompt ambiguity, invalid output, and injection in a concrete flow.
    stretch: Add a failure test for structured output and function calling and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích structured output và function calling cho một đồng đội mới như thế nào?
  - Một assumption nào của structured output và function calling có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain structured output and function calling to a new teammate?
  - Which assumption behind structured output and function calling could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Structured output and function calling: inspect one complete path'
  code: "# Topic: Structured output and function calling (phase-06-llm-rag-transformers-4)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của structured output và function calling.
  purpose_en: Illustrate the input-to-output path for structured output and function calling.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
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
- phase-06-llm-rag-transformers-4-recall
- phase-06-llm-rag-transformers-4-application
- phase-06-llm-rag-transformers-4-debug
- phase-06-llm-rag-transformers-4-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của structured output và function calling.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng structured output và function calling và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng structured output và function calling.
- Đánh giá structured output và function calling bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ structured output và function calling mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-06-llm-rag-retrieval-1
- phase-06-llm-rag-retrieval-2
review_question_vi: Định nghĩa structured output và function calling bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define structured output and function calling in your own words. What are the input, transformation and
  output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng structured output và function calling.
  Hãy liên hệ cụ thể với structured output và function calling trong lesson phase-06-llm-rag-transformers-4.
review_answer_en: A strong answer names the input, transformation, output and the context where structured output and function
  calling is used. Relate it specifically to structured output and function calling in lesson phase-06-llm-rag-transformers-4.
review_cards:
- id: phase-06-llm-rag-transformers-4-recall
  type: recall
  question_vi: Định nghĩa structured output và function calling bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define structured output and function calling in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng structured output và function calling.
  answer_en: A strong answer names the input, transformation, output and the context where structured output and function
    calling is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-transformers-4-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng structured output và function calling cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies structured output and function calling to an AI engineering
    problem.
  answer_vi: Ví dụ cho structured output và function calling cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm
    chứng (phase-06-llm-rag-transformers-4).
  answer_en: The structured output and function calling example should have an explicit input, expected output and a way to
    run or verify it (phase-06-llm-rag-transformers-4).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-transformers-4-debug
  type: debug
  question_vi: Nếu kết quả của structured output và function calling sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If structured output and function calling produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với structured output và function calling, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập
    lỗi bằng test nhỏ và error analysis (phase-06-llm-rag-transformers-4).
  answer_en: For structured output and function calling, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-06-llm-rag-transformers-4).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-transformers-4-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của structured output và function calling như
    thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of structured output and function calling?
  answer_vi: Câu trả lời về structured output và function calling cần nêu giả định, metric/chi phí, giới hạn và cách giảm
    rủi ro trong production (phase-06-llm-rag-transformers-4).
  answer_en: The answer about structured output and function calling should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-06-llm-rag-transformers-4).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Structured output và function calling / Structured output and function calling

Structured output và function calling là một kỹ năng Software Engineering dùng để biến ý tưởng thành code có thể đọc, kiểm tra và bảo trì. Hãy xác định input, output, invariant và lỗi có thể xảy ra trước khi viết implementation. Trong Python, giữ boundary nhỏ giúp test nhanh và traceback chỉ ra đúng lớp lỗi.

## Practice

Viết prompt có input/output contract, thử case thiếu dữ liệu và validate JSON trước khi dùng downstream.
