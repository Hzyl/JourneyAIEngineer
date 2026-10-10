---
lesson_id: phase-13-genai-advanced-rag-advanced-rag-2
phase_id: phase-13-genai-advanced-rag
module_id: advanced-rag
title_vi: Xếp hạng lại và chọn top-k
title_en: Reranking and top-k selection
summary_vi: Xếp hạng lại sắp lại tập ứng viên theo mức liên quan.
summary_en: Learn Reranking and top-k selection through an input → transformation → output model, then verify it
  with an edge-case exercise.
learning_objectives:
- Thử hai giá trị k và đọc các bằng chứng được thêm hoặc bị bỏ.
- Đọc riêng các trường hợp bỏ sót, sai thứ hạng và sai trích dẫn.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain reranking and top-k selection with a concrete example.
- Write or adapt a small code example applying reranking and top-k selection.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-13-genai-advanced-rag-advanced-rag-1
- phase-12-genai-rag-rag-foundations-1
key_terms:
- reranking
- top
- selection
- token
- embedding
- retrieval
- evaluation
- advanced-rag
concept_notes_vi: Xếp hạng lại sắp lại tập ứng viên theo mức liên quan. Chọn số kết quả cần cân bằng độ bao phủ,
  nhiễu trong ngữ cảnh và chi phí xử lý.
concept_notes_en: Reranking và top-k selection is one link in a RAG system. Separate parsing, chunking, indexing,
  retrieval, reranking, and generation so failures are attributable. Chunks need enough context; evaluation should
  measure retrieval recall, groundedness, and abstention when evidence is missing.
why_it_matters_vi: Đánh giá cải tiến truy xuất bằng số liệu để biết thành phần nào đáng giữ.
why_it_matters_en: Advanced RAG should improve retrieval with measurements rather than simply adding components.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Reranking and top-k selection” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- Thử hai giá trị k và đọc các bằng chứng được thêm hoặc bị bỏ.
- Đọc riêng các trường hợp bỏ sót, sai thứ hạng và sai trích dẫn. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần
  đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Advanced RAG should improve retrieval with measurements rather than simply
  adding components.'
- Open Elasticsearch Reference, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Create a 30-question evaluation set, compare vector/BM25/hybrid retrieval, add a
  reranker, and slice failures by query type.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Thử hai giá trị k và đọc các bằng chứng được thêm hoặc bị bỏ.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo 30 câu đánh giá, so sánh vector,
      BM25, tìm kiếm kết hợp và xếp hạng lại; phân tích lỗi theo loại câu hỏi.'
    deliverables:
    - Bảng so sánh truy xuất trên cùng bộ câu hỏi có nguồn chuẩn
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Đọc riêng các trường hợp bỏ sót, sai thứ hạng và sai trích dẫn.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Create a 30-question evaluation set, compare vector/BM25/hybrid retrieval, add a reranker, and slice failures
      by query type.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can tell whether retrieval failed on recall or ranking, whether citations support claims, and
      which change is worth keeping.
    stretch: Add a failure test for reranking and top-k selection and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Xếp hạng lại và chọn top-k” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain reranking and top-k selection to a new teammate?
  - Which assumption behind reranking and top-k selection could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- similarity(a,b) = (a · b) / (||a||₂ ||b||₂)
code_examples:
- language: python
  title: 'Reranking and top-k selection: inspect one complete path'
  code: "# Topic: Reranking and top-k selection (phase-13-genai-advanced-rag-advanced-rag-2)\nfrom dataclasses import\
    \ dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for reranking and top-k selection.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Elasticsearch Reference
  url: https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Ragas Documentation
  url: https://docs.ragas.io/en/stable/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Qdrant Hybrid Search
  url: https://qdrant.tech/documentation/concepts/hybrid-queries/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: FAISS Documentation
  url: https://faiss.ai/
  language: en
  purpose_vi: Thử lập chỉ mục và truy xuất top-k trước khi thêm bước sinh câu trả lời.
  read_vi: Đọc về chỉ mục, thước đo khoảng cách và cách kiểm tra hit@k.
  purpose_en: Try indexing and top-k retrieval before adding generation.
  read_en: Read indexes, distance metrics, and hit@k evaluation.
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
- exercise-13-advanced-rag
review_item_ids:
- phase-13-genai-advanced-rag-advanced-rag-2-recall
- phase-13-genai-advanced-rag-advanced-rag-2-application
- phase-13-genai-advanced-rag-advanced-rag-2-debug
- phase-13-genai-advanced-rag-advanced-rag-2-interview
estimated_minutes: 60
completion_checklist:
- Thử hai giá trị k và đọc các bằng chứng được thêm hoặc bị bỏ.
- Đọc riêng các trường hợp bỏ sót, sai thứ hạng và sai trích dẫn.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Thử hai giá trị k và đọc các bằng chứng được thêm hoặc bị bỏ.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Đọc riêng các trường hợp bỏ sót, sai thứ hạng và sai trích dẫn.
common_mistakes:
- Gộp điểm BM25 với điểm vector mà chưa xét thang đo.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-13-genai-advanced-rag-advanced-rag-3
- phase-13-genai-advanced-rag-advanced-rag-4
review_question_vi: Nội dung cốt lõi của “Xếp hạng lại và chọn top-k” là gì?
review_question_en: Define reranking and top-k selection in your own words. What are the input, transformation and
  output?
review_answer_vi: Xếp hạng lại sắp lại tập ứng viên theo mức liên quan. Chọn số kết quả cần cân bằng độ bao phủ,
  nhiễu trong ngữ cảnh và chi phí xử lý.
review_answer_en: A strong answer names the input, transformation, output and the context where reranking and top-k
  selection is used. Relate it specifically to reranking and top-k selection in lesson phase-13-genai-advanced-rag-advanced-rag-2.
review_cards:
- id: phase-13-genai-advanced-rag-advanced-rag-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Xếp hạng lại và chọn top-k” là gì?
  question_en: Define reranking and top-k selection in your own words. What are the input, transformation and output?
  answer_vi: Xếp hạng lại sắp lại tập ứng viên theo mức liên quan. Chọn số kết quả cần cân bằng độ bao phủ, nhiễu
    trong ngữ cảnh và chi phí xử lý.
  answer_en: A strong answer names the input, transformation, output and the context where reranking and top-k selection
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-13-genai-advanced-rag-advanced-rag-2-application
  type: application
  question_vi: Thử hai giá trị k và đọc các bằng chứng được thêm hoặc bị bỏ.
  question_en: Write a small code example or design that applies reranking and top-k selection to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Thử hai giá trị k và đọc các bằng chứng được thêm hoặc bị bỏ”, cần lưu: bảng so sánh
    truy xuất trên cùng bộ câu hỏi có nguồn chuẩn. Đọc riêng các trường hợp bỏ sót, sai thứ hạng và sai trích dẫn.'
  answer_en: The reranking and top-k selection example should have an explicit input, expected output and a way
    to run or verify it (phase-13-genai-advanced-rag-advanced-rag-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-13-genai-advanced-rag-advanced-rag-2-debug
  type: debug
  question_vi: Khi làm bài “Xếp hạng lại và chọn top-k”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If reranking and top-k selection produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Xếp hạng lại và chọn top-k”, lỗi cần tránh là: gộp điểm BM25 với điểm vector mà chưa xét
    thang đo. Đọc riêng các trường hợp bỏ sót, sai thứ hạng và sai trích dẫn. Dùng ví dụ nhỏ để tìm bước đầu tiên
    có kết quả khác dự kiến.'
  answer_en: For reranking and top-k selection, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-13-genai-advanced-rag-advanced-rag-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-13-genai-advanced-rag-advanced-rag-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Xếp hạng lại và chọn top-k” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of reranking and top-k selection?
  answer_vi: Bắt đầu từ nhiệm vụ “Thử hai giá trị k và đọc các bằng chứng được thêm hoặc bị bỏ”. Trình bày kết quả
    đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about reranking and top-k selection should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-13-genai-advanced-rag-advanced-rag-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Xếp hạng lại và chọn top-k / Reranking and top-k selection

Xếp hạng lại sắp lại tập ứng viên theo mức liên quan. Chọn số kết quả cần cân bằng độ bao phủ, nhiễu trong ngữ cảnh và chi phí xử lý.

## Thực hành

Thử hai giá trị k và đọc các bằng chứng được thêm hoặc bị bỏ.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo 30 câu đánh giá, so sánh vector, BM25, tìm kiếm kết hợp và xếp hạng lại; phân tích lỗi theo loại câu hỏi.
