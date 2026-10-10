---
lesson_id: phase-06-llm-rag-adaptation-4
phase_id: phase-06-llm-rag
module_id: adaptation
title_vi: Agent dùng công cụ và điều kiện dừng
title_en: Tool-using agents with stop conditions
summary_vi: Agent dùng công cụ trong vòng lặp quan sát, quyết định, thực hiện.
summary_en: Learn Tool-using agents with stop conditions through an input → transformation → output model, then
  verify it with an edge-case exercise.
learning_objectives:
- Định nghĩa điều kiện dừng và thử tình huống công cụ liên tục trả lỗi.
- Liên hệ phương án đã chọn với lỗi cụ thể cần khắc phục.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain tool-using agents with stop conditions with a concrete example.
- Write or adapt a small code example applying tool-using agents with stop conditions.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-adaptation-3
- phase-05-mlops-api-1
key_terms:
- tool
- using
- agent
- điều
- kiện
- dừng
- token
- embedding
- retrieval
- evaluation
concept_notes_vi: Agent dùng công cụ trong vòng lặp quan sát, quyết định, thực hiện. Giới hạn bước, thời gian, chi
  phí và quyền giúp dừng có kiểm soát khi đạt mục tiêu hoặc gặp lỗi.
concept_notes_en: Tool-using agent có điều kiện dừng extends a model with controlled actions. Tool schemas must
  validate inputs, limit permissions, and define timeout and retry; an agent loop needs stopping conditions, step
  logs, and human approval for side effects.
why_it_matters_vi: Chọn prompt, RAG, tinh chỉnh hoặc lượng tử hóa theo vấn đề cần giải quyết; giới hạn agent bằng
  điều kiện dừng.
why_it_matters_en: Know when RAG is enough, when fine-tuning/LoRA/quantization is justified, and why agents need
  stop conditions.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Tool-using agents with stop conditions” trong tài liệu tham khảo; đối chiếu với phần giải
  thích của bài.
- Định nghĩa điều kiện dừng và thử tình huống công cụ liên tục trả lỗi.
- Liên hệ phương án đã chọn với lỗi cụ thể cần khắc phục. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu chưa
  đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Know when RAG is enough, when fine-tuning/LoRA/quantization is justified,
  and why agents need stop conditions.'
- Open Hugging Face NLP Course, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Write a decision record comparing RAG, prompting, fine-tuning, and small models by
  data, cost, latency, and risk.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Định nghĩa điều kiện dừng và thử tình huống công cụ liên tục trả lỗi.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết bản ghi so sánh các phương án theo
      dữ liệu, chi phí, độ trễ và rủi ro.'
    deliverables:
    - Bảng so sánh phương án với dữ liệu, chi phí và rủi ro
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Liên hệ phương án đã chọn với lỗi cụ thể cần khắc phục.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Write a decision record comparing RAG, prompting, fine-tuning, and small models by data, cost, latency,
      and risk.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You do not fine-tune before debugging the prompt, and your agent cannot run forever.
    stretch: Add a failure test for tool-using agents with stop conditions and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Agent dùng công cụ và điều kiện dừng” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain tool-using agents with stop conditions to a new teammate?
  - Which assumption behind tool-using agents with stop conditions could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Tool-using agents with stop conditions: inspect one complete path'
  code: "# Topic: Tool-using agents with stop conditions (phase-06-llm-rag-adaptation-4)\ndef grounded_answer(answer:\
    \ str, evidence: list[str]) -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return\
    \ answer + '\\nSources: ' + '; '.join(evidence)\n\nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for tool-using agents with stop conditions.
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
- exercise-6-adaptation
review_item_ids:
- phase-06-llm-rag-adaptation-4-recall
- phase-06-llm-rag-adaptation-4-application
- phase-06-llm-rag-adaptation-4-debug
- phase-06-llm-rag-adaptation-4-interview
estimated_minutes: 60
completion_checklist:
- Định nghĩa điều kiện dừng và thử tình huống công cụ liên tục trả lỗi.
- Liên hệ phương án đã chọn với lỗi cụ thể cần khắc phục.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Định nghĩa điều kiện dừng và thử tình huống công cụ liên tục trả lỗi.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Liên hệ phương án đã chọn với lỗi cụ thể cần khắc phục.
common_mistakes:
- Chọn tinh chỉnh hoặc agent khi chưa xác định được nhu cầu.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-07-capstone-career-problem-1
- phase-07-capstone-career-problem-2
review_question_vi: Nội dung cốt lõi của “Agent dùng công cụ và điều kiện dừng” là gì?
review_question_en: Define tool-using agents with stop conditions in your own words. What are the input, transformation
  and output?
review_answer_vi: Agent dùng công cụ trong vòng lặp quan sát, quyết định, thực hiện. Giới hạn bước, thời gian, chi
  phí và quyền giúp dừng có kiểm soát khi đạt mục tiêu hoặc gặp lỗi.
review_answer_en: A strong answer names the input, transformation, output and the context where tool-using agents
  with stop conditions is used. Relate it specifically to tool-using agents with stop conditions in lesson phase-06-llm-rag-adaptation-4.
review_cards:
- id: phase-06-llm-rag-adaptation-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Agent dùng công cụ và điều kiện dừng” là gì?
  question_en: Define tool-using agents with stop conditions in your own words. What are the input, transformation
    and output?
  answer_vi: Agent dùng công cụ trong vòng lặp quan sát, quyết định, thực hiện. Giới hạn bước, thời gian, chi phí
    và quyền giúp dừng có kiểm soát khi đạt mục tiêu hoặc gặp lỗi.
  answer_en: A strong answer names the input, transformation, output and the context where tool-using agents with
    stop conditions is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-adaptation-4-application
  type: application
  question_vi: Định nghĩa điều kiện dừng và thử tình huống công cụ liên tục trả lỗi.
  question_en: Write a small code example or design that applies tool-using agents with stop conditions to an AI
    engineering problem.
  answer_vi: 'Với nhiệm vụ “Định nghĩa điều kiện dừng và thử tình huống công cụ liên tục trả lỗi”, cần lưu: bảng
    so sánh phương án với dữ liệu, chi phí và rủi ro. Liên hệ phương án đã chọn với lỗi cụ thể cần khắc phục.'
  answer_en: The tool-using agents with stop conditions example should have an explicit input, expected output and
    a way to run or verify it (phase-06-llm-rag-adaptation-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-adaptation-4-debug
  type: debug
  question_vi: Khi làm bài “Agent dùng công cụ và điều kiện dừng”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If tool-using agents with stop conditions produces a wrong result or a metric drops, what would you
    debug first?
  answer_vi: 'Trong bài “Agent dùng công cụ và điều kiện dừng”, lỗi cần tránh là: chọn tinh chỉnh hoặc agent khi
    chưa xác định được nhu cầu. Liên hệ phương án đã chọn với lỗi cụ thể cần khắc phục. Dùng ví dụ nhỏ để tìm bước
    đầu tiên có kết quả khác dự kiến.'
  answer_en: For tool-using agents with stop conditions, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-06-llm-rag-adaptation-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-adaptation-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Agent dùng công cụ và điều kiện dừng” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of tool-using agents with stop
    conditions?
  answer_vi: Bắt đầu từ nhiệm vụ “Định nghĩa điều kiện dừng và thử tình huống công cụ liên tục trả lỗi”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about tool-using agents with stop conditions should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-06-llm-rag-adaptation-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Agent dùng công cụ và điều kiện dừng / Tool-using agents with stop conditions

Agent dùng công cụ trong vòng lặp quan sát, quyết định, thực hiện. Giới hạn bước, thời gian, chi phí và quyền giúp dừng có kiểm soát khi đạt mục tiêu hoặc gặp lỗi.

## Thực hành

Định nghĩa điều kiện dừng và thử tình huống công cụ liên tục trả lỗi.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết bản ghi so sánh các phương án theo dữ liệu, chi phí, độ trễ và rủi ro.
