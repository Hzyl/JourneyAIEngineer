---
lesson_id: phase-06-llm-rag-transformers-4
phase_id: phase-06-llm-rag
module_id: transformers
title_vi: Đầu ra có cấu trúc và gọi hàm
title_en: Structured output and function calling
summary_vi: Đầu ra có cấu trúc giúp đọc kết quả theo schema; gọi hàm để mô hình đề xuất thao tác có tên và tham
  số.
summary_en: Learn Structured output and function calling through an input → transformation → output model, then
  verify it with an edge-case exercise.
learning_objectives:
- Kiểm tra đầu ra JSON và từ chối lời gọi có tham số không hợp lệ.
- Kiểm tra kích thước, mặt nạ hoặc cấu trúc đầu ra theo nội dung bài.
- Giải thích kết quả và nêu một giới hạn của bài làm.
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
concept_notes_vi: Đầu ra có cấu trúc giúp đọc kết quả theo schema; gọi hàm để mô hình đề xuất thao tác có tên và
  tham số. Ứng dụng vẫn phải kiểm tra dữ liệu và quyền trước khi thực thi.
concept_notes_en: Structured output và function calling is a Software Engineering skill for turning an idea into
  code that can be read, tested, and maintained. Define the inputs, outputs, invariants, and failure modes before
  implementing. In Python, small boundaries make tests fast and tracebacks actionable.
why_it_matters_vi: Liên hệ attention với cách cung cấp ngữ cảnh và kiểm tra đầu ra của ứng dụng LLM.
why_it_matters_en: Move from attention to prompts and structured outputs while validating schemas instead of trusting
  raw text.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Structured output and function calling” trong tài liệu tham khảo; đối chiếu với phần giải
  thích của bài.
- Kiểm tra đầu ra JSON và từ chối lời gọi có tham số không hợp lệ.
- Kiểm tra kích thước, mặt nạ hoặc cấu trúc đầu ra theo nội dung bài. Ghi kết quả đối chiếu và điều bạn đã sửa nếu
  lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Move from attention to prompts and structured outputs while validating schemas
  instead of trusting raw text.'
- Open Hugging Face NLP Course, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Write a prompt with an input/output contract, test missing data, and validate JSON
  before downstream use.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Kiểm tra đầu ra JSON và từ chối lời gọi có tham số không hợp lệ.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết prompt có yêu cầu đầu vào, đầu
      ra rõ; thử dữ liệu thiếu và kiểm tra JSON trước khi dùng ở bước tiếp.'
    deliverables:
    - Sơ đồ hoặc ví dụ nhỏ thể hiện luồng dữ liệu và yêu cầu đầu ra
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Kiểm tra kích thước, mặt nạ hoặc cấu trúc đầu ra theo nội dung bài.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
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
  - Bạn sẽ giải thích nội dung “Đầu ra có cấu trúc và gọi hàm” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain structured output and function calling to a new teammate?
  - Which assumption behind structured output and function calling could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Structured output and function calling: inspect one complete path'
  code: "# Topic: Structured output and function calling (phase-06-llm-rag-transformers-4)\nfrom dataclasses import\
    \ dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for structured output and function calling.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Hugging Face NLP Course
  url: https://huggingface.co/learn/nlp-course/chapter1/1
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Hugging Face Transformers Docs
  url: https://huggingface.co/docs/transformers/index
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: FAISS Documentation
  url: https://faiss.ai/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Giải thích và hướng dẫn thực hành trong bài
  url: ''
  language: vi
  kind: in_app
  purpose_vi: Đọc giải thích, thực hiện nhiệm vụ và đối chiếu tiêu chí hoàn thành.
  purpose_en: The explanation, code example, checklist, and completion criteria inside the app.
  read_vi: Đọc giải thích → xem ví dụ → thực hành → tự kiểm tra.
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
- Kiểm tra đầu ra JSON và từ chối lời gọi có tham số không hợp lệ.
- Kiểm tra kích thước, mặt nạ hoặc cấu trúc đầu ra theo nội dung bài.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Kiểm tra đầu ra JSON và từ chối lời gọi có tham số không hợp lệ.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Kiểm tra kích thước, mặt nạ hoặc cấu trúc đầu ra theo nội dung bài.
common_mistakes:
- Coi đầu ra hợp lệ về cú pháp là đủ để kết luận nội dung đúng.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-06-llm-rag-retrieval-1
- phase-06-llm-rag-retrieval-2
review_question_vi: Nội dung cốt lõi của “Đầu ra có cấu trúc và gọi hàm” là gì?
review_question_en: Define structured output and function calling in your own words. What are the input, transformation
  and output?
review_answer_vi: Đầu ra có cấu trúc giúp đọc kết quả theo schema; gọi hàm để mô hình đề xuất thao tác có tên và
  tham số. Ứng dụng vẫn phải kiểm tra dữ liệu và quyền trước khi thực thi.
review_answer_en: A strong answer names the input, transformation, output and the context where structured output
  and function calling is used. Relate it specifically to structured output and function calling in lesson phase-06-llm-rag-transformers-4.
review_cards:
- id: phase-06-llm-rag-transformers-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Đầu ra có cấu trúc và gọi hàm” là gì?
  question_en: Define structured output and function calling in your own words. What are the input, transformation
    and output?
  answer_vi: Đầu ra có cấu trúc giúp đọc kết quả theo schema; gọi hàm để mô hình đề xuất thao tác có tên và tham
    số. Ứng dụng vẫn phải kiểm tra dữ liệu và quyền trước khi thực thi.
  answer_en: A strong answer names the input, transformation, output and the context where structured output and
    function calling is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-transformers-4-application
  type: application
  question_vi: Kiểm tra đầu ra JSON và từ chối lời gọi có tham số không hợp lệ.
  question_en: Write a small code example or design that applies structured output and function calling to an AI
    engineering problem.
  answer_vi: 'Với nhiệm vụ “Kiểm tra đầu ra JSON và từ chối lời gọi có tham số không hợp lệ”, cần lưu: sơ đồ hoặc
    ví dụ nhỏ thể hiện luồng dữ liệu và yêu cầu đầu ra. Kiểm tra kích thước, mặt nạ hoặc cấu trúc đầu ra theo nội
    dung bài.'
  answer_en: The structured output and function calling example should have an explicit input, expected output and
    a way to run or verify it (phase-06-llm-rag-transformers-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-transformers-4-debug
  type: debug
  question_vi: Khi làm bài “Đầu ra có cấu trúc và gọi hàm”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If structured output and function calling produces a wrong result or a metric drops, what would you
    debug first?
  answer_vi: 'Trong bài “Đầu ra có cấu trúc và gọi hàm”, lỗi cần tránh là: coi đầu ra hợp lệ về cú pháp là đủ để
    kết luận nội dung đúng. Kiểm tra kích thước, mặt nạ hoặc cấu trúc đầu ra theo nội dung bài. Dùng ví dụ nhỏ để
    tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For structured output and function calling, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-06-llm-rag-transformers-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-transformers-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Đầu ra có cấu trúc và gọi hàm” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of structured output and function
    calling?
  answer_vi: Bắt đầu từ nhiệm vụ “Kiểm tra đầu ra JSON và từ chối lời gọi có tham số không hợp lệ”. Trình bày kết
    quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about structured output and function calling should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-06-llm-rag-transformers-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Đầu ra có cấu trúc và gọi hàm / Structured output and function calling

Đầu ra có cấu trúc giúp đọc kết quả theo schema; gọi hàm để mô hình đề xuất thao tác có tên và tham số. Ứng dụng vẫn phải kiểm tra dữ liệu và quyền trước khi thực thi.

## Thực hành

Kiểm tra đầu ra JSON và từ chối lời gọi có tham số không hợp lệ.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết prompt có yêu cầu đầu vào, đầu ra rõ; thử dữ liệu thiếu và kiểm tra JSON trước khi dùng ở bước tiếp.
