---
lesson_id: phase-06-llm-rag-nlp-foundations-1
phase_id: phase-06-llm-rag
module_id: nlp-foundations
title_vi: Tách token
title_en: Tokenization
summary_vi: Tokenizer chuyển văn bản thành đơn vị mô hình xử lý.
summary_en: Learn Tokenization through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Tách câu tiếng Việt và đối chiếu số token với số từ.
- Ghi rõ mô hình, tokenizer và giới hạn ngữ cảnh đã dùng.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain tokenization with a concrete example.
- Write or adapt a small code example applying tokenization.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-05-mlops-security-4
- phase-05-mlops-api-1
key_terms:
- tokenization
- token
- embedding
- retrieval
- evaluation
- nlp-foundations
concept_notes_vi: Tokenizer chuyển văn bản thành đơn vị mô hình xử lý. Token không nhất thiết là từ; cùng một câu
  tiếng Việt có thể được tách khác nhau giữa các tokenizer.
concept_notes_en: 'Tokenization belongs to LLM Application Engineering: design the contract between the application
  and the model. Define instructions, inputs, output schema, timeout, retry, and token limits; parse model output
  as untrusted data and return actionable errors.'
why_it_matters_vi: Hiểu token, embedding, mô hình ngôn ngữ và giới hạn ngữ cảnh trước khi xây ứng dụng.
why_it_matters_en: Understand tokens, embeddings, language models, and context windows before building LLM applications.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Tokenization” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Tách câu tiếng Việt và đối chiếu số token với số từ.
- Ghi rõ mô hình, tokenizer và giới hạn ngữ cảnh đã dùng. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu chưa
  đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Understand tokens, embeddings, language models, and context windows before
  building LLM applications.'
- Open Hugging Face NLP Course, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Tokenize Vietnamese text, count tokens, compare near/far embeddings, and record context
  limits.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Tách câu tiếng Việt và đối chiếu số token với số từ.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tách token câu tiếng Việt, đếm token,
      so sánh embedding và ghi giới hạn ngữ cảnh.'
    deliverables:
    - Văn bản mẫu, kết quả tách token hoặc embedding và cấu hình
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Ghi rõ mô hình, tokenizer và giới hạn ngữ cảnh đã dùng.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Tokenize Vietnamese text, count tokens, compare near/far embeddings, and record context limits.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain that embeddings are not truth and how context windows affect cost and quality.
    stretch: Add a failure test for tokenization and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Tách token” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain tokenization to a new teammate?
  - Which assumption behind tokenization could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- tokens_total = tokens_input + tokens_output
code_examples:
- language: python
  title: 'Tokenization: inspect one complete path'
  code: "# Topic: Tokenization (phase-06-llm-rag-nlp-foundations-1)\ndef grounded_answer(answer: str, evidence:\
    \ list[str]) -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return answer + '\\\
    nSources: ' + '; '.join(evidence)\n\nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for tokenization.
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
- title: Hugging Face Tokenizers
  url: https://huggingface.co/docs/transformers/main/en/tokenizer_summary
  language: en
  purpose_vi: Đếm token thực tế để đánh giá dung lượng ngữ cảnh và chi phí.
  read_vi: Đọc về tokenizer, token đặc biệt, cắt bớt chuỗi và chèn phần đệm.
  purpose_en: Measure real tokens before reasoning about context and cost.
  read_en: Read tokenizers, special tokens, and truncation/padding.
  kind: official
  required: true
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
- exercise-6-nlp-foundations
review_item_ids:
- phase-06-llm-rag-nlp-foundations-1-recall
- phase-06-llm-rag-nlp-foundations-1-application
- phase-06-llm-rag-nlp-foundations-1-debug
- phase-06-llm-rag-nlp-foundations-1-interview
estimated_minutes: 60
completion_checklist:
- Tách câu tiếng Việt và đối chiếu số token với số từ.
- Ghi rõ mô hình, tokenizer và giới hạn ngữ cảnh đã dùng.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Tách câu tiếng Việt và đối chiếu số token với số từ.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Ghi rõ mô hình, tokenizer và giới hạn ngữ cảnh đã dùng.
common_mistakes:
- Coi số từ là số token hoặc độ tương đồng là bằng chứng tính đúng.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-06-llm-rag-nlp-foundations-2
- phase-06-llm-rag-nlp-foundations-3
review_question_vi: Nội dung cốt lõi của “Tách token” là gì?
review_question_en: Define tokenization in your own words. What are the input, transformation and output?
review_answer_vi: Tokenizer chuyển văn bản thành đơn vị mô hình xử lý. Token không nhất thiết là từ; cùng một câu
  tiếng Việt có thể được tách khác nhau giữa các tokenizer.
review_answer_en: A strong answer names the input, transformation, output and the context where tokenization is
  used. Relate it specifically to tokenization in lesson phase-06-llm-rag-nlp-foundations-1.
review_cards:
- id: phase-06-llm-rag-nlp-foundations-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Tách token” là gì?
  question_en: Define tokenization in your own words. What are the input, transformation and output?
  answer_vi: Tokenizer chuyển văn bản thành đơn vị mô hình xử lý. Token không nhất thiết là từ; cùng một câu tiếng
    Việt có thể được tách khác nhau giữa các tokenizer.
  answer_en: A strong answer names the input, transformation, output and the context where tokenization is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-nlp-foundations-1-application
  type: application
  question_vi: Tách câu tiếng Việt và đối chiếu số token với số từ.
  question_en: Write a small code example or design that applies tokenization to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Tách câu tiếng Việt và đối chiếu số token với số từ”, cần lưu: văn bản mẫu, kết quả
    tách token hoặc embedding và cấu hình. Ghi rõ mô hình, tokenizer và giới hạn ngữ cảnh đã dùng.'
  answer_en: The tokenization example should have an explicit input, expected output and a way to run or verify
    it (phase-06-llm-rag-nlp-foundations-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-nlp-foundations-1-debug
  type: debug
  question_vi: Khi làm bài “Tách token”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If tokenization produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Tách token”, lỗi cần tránh là: coi số từ là số token hoặc độ tương đồng là bằng chứng tính
    đúng. Ghi rõ mô hình, tokenizer và giới hạn ngữ cảnh đã dùng. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả
    khác dự kiến.'
  answer_en: For tokenization, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-06-llm-rag-nlp-foundations-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-nlp-foundations-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Tách token” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of tokenization?
  answer_vi: Bắt đầu từ nhiệm vụ “Tách câu tiếng Việt và đối chiếu số token với số từ”. Trình bày kết quả đã lưu,
    cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about tokenization should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-06-llm-rag-nlp-foundations-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Tách token / Tokenization

Tokenizer chuyển văn bản thành đơn vị mô hình xử lý. Token không nhất thiết là từ; cùng một câu tiếng Việt có thể được tách khác nhau giữa các tokenizer.

## Thực hành

Tách câu tiếng Việt và đối chiếu số token với số từ.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tách token câu tiếng Việt, đếm token, so sánh embedding và ghi giới hạn ngữ cảnh.
