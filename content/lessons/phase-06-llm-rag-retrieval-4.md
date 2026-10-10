---
lesson_id: phase-06-llm-rag-retrieval-4
phase_id: phase-06-llm-rag
module_id: retrieval
title_vi: Xếp hạng lại và truy xuất kết hợp
title_en: Reranking and hybrid retrieval
summary_vi: Truy xuất kết hợp tận dụng tìm theo từ khóa và vector; xếp hạng lại đánh giá tập ứng viên kỹ hơn.
summary_en: Learn Reranking and hybrid retrieval through an input → transformation → output model, then verify it
  with an edge-case exercise.
learning_objectives:
- So sánh kết quả trước, sau xếp hạng lại trên cùng tập câu hỏi.
- Đọc kết quả bỏ sót hoặc sai thứ hạng trước khi thay cấu hình.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain reranking and hybrid retrieval with a concrete example.
- Write or adapt a small code example applying reranking and hybrid retrieval.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-retrieval-3
- phase-05-mlops-api-1
key_terms:
- reranking
- hybrid
- retrieval
- token
- embedding
- evaluation
concept_notes_vi: Truy xuất kết hợp tận dụng tìm theo từ khóa và vector; xếp hạng lại đánh giá tập ứng viên kỹ hơn.
  Đo chất lượng cùng chi phí và độ trễ tăng thêm.
concept_notes_en: Reranking và hybrid retrieval is one link in a RAG system. Separate parsing, chunking, indexing,
  retrieval, reranking, and generation so failures are attributable. Chunks need enough context; evaluation should
  measure retrieval recall, groundedness, and abstention when evidence is missing.
why_it_matters_vi: Thiết kế cách chia đoạn, lưu siêu dữ liệu và tìm kiếm để đo chất lượng truy xuất trước khi sinh
  câu trả lời.
why_it_matters_en: Design retrieval with chunks, metadata, vector search, and reranking so recall is measured before
  generation.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Reranking and hybrid retrieval” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- So sánh kết quả trước, sau xếp hạng lại trên cùng tập câu hỏi.
- Đọc kết quả bỏ sót hoặc sai thứ hạng trước khi thay cấu hình. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần
  đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Design retrieval with chunks, metadata, vector search, and reranking so recall
  is measured before generation.'
- Open Hugging Face NLP Course, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Create ten document chunks and ten known-answer queries, measure hit@k, and inspect
  false negatives.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'So sánh kết quả trước, sau xếp hạng lại trên cùng tập câu hỏi.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo 10 đoạn tài liệu và 10 câu hỏi có
      bằng chứng biết trước; đo hit@k rồi đọc các trường hợp bỏ sót.'
    deliverables:
    - Câu hỏi, bằng chứng cần tìm và danh sách kết quả truy xuất
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Đọc kết quả bỏ sót hoặc sai thứ hạng trước khi thay cấu hình.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Create ten document chunks and ten known-answer queries, measure hit@k, and inspect false negatives.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can tell whether RAG failed during retrieval or generation and show evidence for the conclusion.
    stretch: Add a failure test for reranking and hybrid retrieval and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Xếp hạng lại và truy xuất kết hợp” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain reranking and hybrid retrieval to a new teammate?
  - Which assumption behind reranking and hybrid retrieval could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- similarity(a,b) = (a · b) / (||a||₂ ||b||₂)
code_examples:
- language: python
  title: 'Reranking and hybrid retrieval: inspect one complete path'
  code: "# Topic: Reranking and hybrid retrieval (phase-06-llm-rag-retrieval-4)\ndef grounded_answer(answer: str,\
    \ evidence: list[str]) -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return answer\
    \ + '\\nSources: ' + '; '.join(evidence)\n\nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for reranking and hybrid retrieval.
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
- exercise-6-retrieval
review_item_ids:
- phase-06-llm-rag-retrieval-4-recall
- phase-06-llm-rag-retrieval-4-application
- phase-06-llm-rag-retrieval-4-debug
- phase-06-llm-rag-retrieval-4-interview
estimated_minutes: 60
completion_checklist:
- So sánh kết quả trước, sau xếp hạng lại trên cùng tập câu hỏi.
- Đọc kết quả bỏ sót hoặc sai thứ hạng trước khi thay cấu hình.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: So sánh kết quả trước, sau xếp hạng lại trên cùng tập câu hỏi.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Đọc kết quả bỏ sót hoặc sai thứ hạng trước khi thay cấu hình.
common_mistakes:
- Đánh giá tìm kiếm chỉ bằng cảm giác từ một câu hỏi thuận lợi.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-06-llm-rag-rag-1
- phase-06-llm-rag-rag-2
review_question_vi: Nội dung cốt lõi của “Xếp hạng lại và truy xuất kết hợp” là gì?
review_question_en: Define reranking and hybrid retrieval in your own words. What are the input, transformation
  and output?
review_answer_vi: Truy xuất kết hợp tận dụng tìm theo từ khóa và vector; xếp hạng lại đánh giá tập ứng viên kỹ hơn.
  Đo chất lượng cùng chi phí và độ trễ tăng thêm.
review_answer_en: A strong answer names the input, transformation, output and the context where reranking and hybrid
  retrieval is used. Relate it specifically to reranking and hybrid retrieval in lesson phase-06-llm-rag-retrieval-4.
review_cards:
- id: phase-06-llm-rag-retrieval-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Xếp hạng lại và truy xuất kết hợp” là gì?
  question_en: Define reranking and hybrid retrieval in your own words. What are the input, transformation and output?
  answer_vi: Truy xuất kết hợp tận dụng tìm theo từ khóa và vector; xếp hạng lại đánh giá tập ứng viên kỹ hơn. Đo
    chất lượng cùng chi phí và độ trễ tăng thêm.
  answer_en: A strong answer names the input, transformation, output and the context where reranking and hybrid
    retrieval is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-retrieval-4-application
  type: application
  question_vi: So sánh kết quả trước, sau xếp hạng lại trên cùng tập câu hỏi.
  question_en: Write a small code example or design that applies reranking and hybrid retrieval to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “So sánh kết quả trước, sau xếp hạng lại trên cùng tập câu hỏi”, cần lưu: câu hỏi, bằng
    chứng cần tìm và danh sách kết quả truy xuất. Đọc kết quả bỏ sót hoặc sai thứ hạng trước khi thay cấu hình.'
  answer_en: The reranking and hybrid retrieval example should have an explicit input, expected output and a way
    to run or verify it (phase-06-llm-rag-retrieval-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-retrieval-4-debug
  type: debug
  question_vi: Khi làm bài “Xếp hạng lại và truy xuất kết hợp”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If reranking and hybrid retrieval produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Xếp hạng lại và truy xuất kết hợp”, lỗi cần tránh là: đánh giá tìm kiếm chỉ bằng cảm giác
    từ một câu hỏi thuận lợi. Đọc kết quả bỏ sót hoặc sai thứ hạng trước khi thay cấu hình. Dùng ví dụ nhỏ để tìm
    bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For reranking and hybrid retrieval, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-06-llm-rag-retrieval-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-retrieval-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Xếp hạng lại và truy xuất kết hợp” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of reranking and hybrid retrieval?
  answer_vi: Bắt đầu từ nhiệm vụ “So sánh kết quả trước, sau xếp hạng lại trên cùng tập câu hỏi”. Trình bày kết
    quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about reranking and hybrid retrieval should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-06-llm-rag-retrieval-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Xếp hạng lại và truy xuất kết hợp / Reranking and hybrid retrieval

Truy xuất kết hợp tận dụng tìm theo từ khóa và vector; xếp hạng lại đánh giá tập ứng viên kỹ hơn. Đo chất lượng cùng chi phí và độ trễ tăng thêm.

## Thực hành

So sánh kết quả trước, sau xếp hạng lại trên cùng tập câu hỏi.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo 10 đoạn tài liệu và 10 câu hỏi có bằng chứng biết trước; đo hit@k rồi đọc các trường hợp bỏ sót.
