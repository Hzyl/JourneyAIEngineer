---
lesson_id: phase-06-llm-rag-transformers-3
phase_id: phase-06-llm-rag
module_id: transformers
title_vi: Thiết kế prompt
title_en: Prompt design
summary_vi: Prompt cần nêu nhiệm vụ, dữ liệu và yêu cầu đầu ra rõ.
summary_en: Learn Prompt design through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Viết prompt có yêu cầu đầu ra cụ thể và thử với dữ liệu thiếu.
- Kiểm tra kích thước, mặt nạ hoặc cấu trúc đầu ra theo nội dung bài.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain prompt design with a concrete example.
- Write or adapt a small code example applying prompt design.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-transformers-2
- phase-05-mlops-api-1
key_terms:
- prompt
- design
- token
- embedding
- retrieval
- evaluation
- transformers
concept_notes_vi: Prompt cần nêu nhiệm vụ, dữ liệu và yêu cầu đầu ra rõ. Tách chỉ dẫn khỏi dữ liệu không đáng tin,
  rồi thử trường hợp thiếu thông tin để kiểm tra cách xử lý.
concept_notes_en: 'Prompt design belongs to LLM Application Engineering: design the contract between the application
  and the model. Define instructions, inputs, output schema, timeout, retry, and token limits; parse model output
  as untrusted data and return actionable errors.'
why_it_matters_vi: Liên hệ attention với cách cung cấp ngữ cảnh và kiểm tra đầu ra của ứng dụng LLM.
why_it_matters_en: Move from attention to prompts and structured outputs while validating schemas instead of trusting
  raw text.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Prompt design” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Viết prompt có yêu cầu đầu ra cụ thể và thử với dữ liệu thiếu.
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
    task: 'Viết prompt có yêu cầu đầu ra cụ thể và thử với dữ liệu thiếu.


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
    stretch: Add a failure test for prompt design and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Thiết kế prompt” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain prompt design to a new teammate?
  - Which assumption behind prompt design could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Prompt design: inspect one complete path'
  code: "# Topic: Prompt design (phase-06-llm-rag-transformers-3)\ndef grounded_answer(answer: str, evidence: list[str])\
    \ -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return answer + '\\nSources: '\
    \ + '; '.join(evidence)\n\nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for prompt design.
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
- phase-06-llm-rag-transformers-3-recall
- phase-06-llm-rag-transformers-3-application
- phase-06-llm-rag-transformers-3-debug
- phase-06-llm-rag-transformers-3-interview
estimated_minutes: 60
completion_checklist:
- Viết prompt có yêu cầu đầu ra cụ thể và thử với dữ liệu thiếu.
- Kiểm tra kích thước, mặt nạ hoặc cấu trúc đầu ra theo nội dung bài.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Viết prompt có yêu cầu đầu ra cụ thể và thử với dữ liệu thiếu.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Kiểm tra kích thước, mặt nạ hoặc cấu trúc đầu ra theo nội dung bài.
common_mistakes:
- Coi đầu ra hợp lệ về cú pháp là đủ để kết luận nội dung đúng.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-06-llm-rag-transformers-4
- phase-06-llm-rag-retrieval-1
review_question_vi: Nội dung cốt lõi của “Thiết kế prompt” là gì?
review_question_en: Define prompt design in your own words. What are the input, transformation and output?
review_answer_vi: Prompt cần nêu nhiệm vụ, dữ liệu và yêu cầu đầu ra rõ. Tách chỉ dẫn khỏi dữ liệu không đáng tin,
  rồi thử trường hợp thiếu thông tin để kiểm tra cách xử lý.
review_answer_en: A strong answer names the input, transformation, output and the context where prompt design is
  used. Relate it specifically to prompt design in lesson phase-06-llm-rag-transformers-3.
review_cards:
- id: phase-06-llm-rag-transformers-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Thiết kế prompt” là gì?
  question_en: Define prompt design in your own words. What are the input, transformation and output?
  answer_vi: Prompt cần nêu nhiệm vụ, dữ liệu và yêu cầu đầu ra rõ. Tách chỉ dẫn khỏi dữ liệu không đáng tin, rồi
    thử trường hợp thiếu thông tin để kiểm tra cách xử lý.
  answer_en: A strong answer names the input, transformation, output and the context where prompt design is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-transformers-3-application
  type: application
  question_vi: Viết prompt có yêu cầu đầu ra cụ thể và thử với dữ liệu thiếu.
  question_en: Write a small code example or design that applies prompt design to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Viết prompt có yêu cầu đầu ra cụ thể và thử với dữ liệu thiếu”, cần lưu: sơ đồ hoặc
    ví dụ nhỏ thể hiện luồng dữ liệu và yêu cầu đầu ra. Kiểm tra kích thước, mặt nạ hoặc cấu trúc đầu ra theo nội
    dung bài.'
  answer_en: The prompt design example should have an explicit input, expected output and a way to run or verify
    it (phase-06-llm-rag-transformers-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-transformers-3-debug
  type: debug
  question_vi: Khi làm bài “Thiết kế prompt”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If prompt design produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Thiết kế prompt”, lỗi cần tránh là: coi đầu ra hợp lệ về cú pháp là đủ để kết luận nội
    dung đúng. Kiểm tra kích thước, mặt nạ hoặc cấu trúc đầu ra theo nội dung bài. Dùng ví dụ nhỏ để tìm bước đầu
    tiên có kết quả khác dự kiến.'
  answer_en: For prompt design, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-06-llm-rag-transformers-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-transformers-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Thiết kế prompt” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of prompt design?
  answer_vi: Bắt đầu từ nhiệm vụ “Viết prompt có yêu cầu đầu ra cụ thể và thử với dữ liệu thiếu”. Trình bày kết
    quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about prompt design should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-06-llm-rag-transformers-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Thiết kế prompt / Prompt design

Prompt cần nêu nhiệm vụ, dữ liệu và yêu cầu đầu ra rõ. Tách chỉ dẫn khỏi dữ liệu không đáng tin, rồi thử trường hợp thiếu thông tin để kiểm tra cách xử lý.

## Thực hành

Viết prompt có yêu cầu đầu ra cụ thể và thử với dữ liệu thiếu.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết prompt có yêu cầu đầu vào, đầu ra rõ; thử dữ liệu thiếu và kiểm tra JSON trước khi dùng ở bước tiếp.
