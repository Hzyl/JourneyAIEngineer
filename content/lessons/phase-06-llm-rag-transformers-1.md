---
lesson_id: phase-06-llm-rag-transformers-1
phase_id: phase-06-llm-rag
module_id: transformers
title_vi: Cơ chế attention
title_en: Attention
summary_vi: Attention tạo trọng số để kết hợp thông tin từ các vị trí.
summary_en: Learn Attention through an input → transformation → output model, then verify it with an edge-case exercise.
learning_objectives:
- Theo dõi kích thước Q, K, V qua một phép attention nhỏ.
- Kiểm tra kích thước, mặt nạ hoặc cấu trúc đầu ra theo nội dung bài.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain attention with a concrete example.
- Write or adapt a small code example applying attention.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-nlp-foundations-4
- phase-05-mlops-api-1
key_terms:
- attention
- PyTorch
- tensor
- loss
- training
- transformers
concept_notes_vi: Attention tạo trọng số để kết hợp thông tin từ các vị trí. Query được so với key để tính trọng
  số, rồi dùng trọng số tổng hợp value; kích thước và mặt nạ cần đúng.
concept_notes_en: Attention explains how a Transformer weights relevant tokens. Track the shapes of Q, K, V, masks,
  and context length; during inference, KV cache avoids recomputing keys and values at the cost of memory.
why_it_matters_vi: Liên hệ attention với cách cung cấp ngữ cảnh và kiểm tra đầu ra của ứng dụng LLM.
why_it_matters_en: Move from attention to prompts and structured outputs while validating schemas instead of trusting
  raw text.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Attention” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Theo dõi kích thước Q, K, V qua một phép attention nhỏ.
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
    task: 'Theo dõi kích thước Q, K, V qua một phép attention nhỏ.


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
    stretch: Add a failure test for attention and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Cơ chế attention” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain attention to a new teammate?
  - Which assumption behind attention could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- Attention(Q,K,V) = softmax(QKᵀ / √d_k)V
code_examples:
- language: python
  title: 'Attention: inspect one complete path'
  code: "# Topic: Attention (phase-06-llm-rag-transformers-1)\ndef linear(x: list[float], weights: list[float],\
    \ bias: float = 0.0) -> float:\n    if len(x) != len(weights):\n        raise ValueError('shape mismatch')\n\
    \    return sum(value * weight for value, weight in zip(x, weights)) + bias\n\nprediction = linear([1.0, 2.0],\
    \ [0.2, -0.1], 0.5)\nprint({'prediction': prediction, 'loss': (prediction - 1.0) ** 2})"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for attention.
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
- phase-06-llm-rag-transformers-1-recall
- phase-06-llm-rag-transformers-1-application
- phase-06-llm-rag-transformers-1-debug
- phase-06-llm-rag-transformers-1-interview
estimated_minutes: 60
completion_checklist:
- Theo dõi kích thước Q, K, V qua một phép attention nhỏ.
- Kiểm tra kích thước, mặt nạ hoặc cấu trúc đầu ra theo nội dung bài.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Theo dõi kích thước Q, K, V qua một phép attention nhỏ.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Kiểm tra kích thước, mặt nạ hoặc cấu trúc đầu ra theo nội dung bài.
common_mistakes:
- Coi đầu ra hợp lệ về cú pháp là đủ để kết luận nội dung đúng.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-06-llm-rag-transformers-2
- phase-06-llm-rag-transformers-3
review_question_vi: Nội dung cốt lõi của “Cơ chế attention” là gì?
review_question_en: Define attention in your own words. What are the input, transformation and output?
review_answer_vi: Attention tạo trọng số để kết hợp thông tin từ các vị trí. Query được so với key để tính trọng
  số, rồi dùng trọng số tổng hợp value; kích thước và mặt nạ cần đúng.
review_answer_en: A strong answer names the input, transformation, output and the context where attention is used.
  Relate it specifically to attention in lesson phase-06-llm-rag-transformers-1.
review_cards:
- id: phase-06-llm-rag-transformers-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Cơ chế attention” là gì?
  question_en: Define attention in your own words. What are the input, transformation and output?
  answer_vi: Attention tạo trọng số để kết hợp thông tin từ các vị trí. Query được so với key để tính trọng số,
    rồi dùng trọng số tổng hợp value; kích thước và mặt nạ cần đúng.
  answer_en: A strong answer names the input, transformation, output and the context where attention is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-transformers-1-application
  type: application
  question_vi: Theo dõi kích thước Q, K, V qua một phép attention nhỏ.
  question_en: Write a small code example or design that applies attention to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Theo dõi kích thước Q, K, V qua một phép attention nhỏ”, cần lưu: sơ đồ hoặc ví dụ nhỏ
    thể hiện luồng dữ liệu và yêu cầu đầu ra. Kiểm tra kích thước, mặt nạ hoặc cấu trúc đầu ra theo nội dung bài.'
  answer_en: The attention example should have an explicit input, expected output and a way to run or verify it
    (phase-06-llm-rag-transformers-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-transformers-1-debug
  type: debug
  question_vi: Khi làm bài “Cơ chế attention”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If attention produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Cơ chế attention”, lỗi cần tránh là: coi đầu ra hợp lệ về cú pháp là đủ để kết luận nội
    dung đúng. Kiểm tra kích thước, mặt nạ hoặc cấu trúc đầu ra theo nội dung bài. Dùng ví dụ nhỏ để tìm bước đầu
    tiên có kết quả khác dự kiến.'
  answer_en: For attention, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-06-llm-rag-transformers-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-transformers-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Cơ chế attention” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of attention?
  answer_vi: Bắt đầu từ nhiệm vụ “Theo dõi kích thước Q, K, V qua một phép attention nhỏ”. Trình bày kết quả đã
    lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about attention should cover assumptions, metrics/cost, limitations and how to reduce production
    risk (phase-06-llm-rag-transformers-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Cơ chế attention / Attention

Attention tạo trọng số để kết hợp thông tin từ các vị trí. Query được so với key để tính trọng số, rồi dùng trọng số tổng hợp value; kích thước và mặt nạ cần đúng.

## Thực hành

Theo dõi kích thước Q, K, V qua một phép attention nhỏ.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết prompt có yêu cầu đầu vào, đầu ra rõ; thử dữ liệu thiếu và kiểm tra JSON trước khi dùng ở bước tiếp.
