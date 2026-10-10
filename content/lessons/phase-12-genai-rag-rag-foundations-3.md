---
lesson_id: phase-12-genai-rag-rag-foundations-3
phase_id: phase-12-genai-rag
module_id: rag-foundations
title_vi: Embedding và cơ sở dữ liệu vector
title_en: Embeddings and vector databases
summary_vi: Embedding cung cấp biểu diễn để tìm kiếm; cơ sở dữ liệu vector lưu và truy vấn các biểu diễn cùng siêu
  dữ liệu.
summary_en: Learn Embeddings and vector databases through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Ghi phiên bản embedding và kiểm tra truy vấn trả về đúng nguồn.
- Lần từ câu trả lời về đúng đoạn nguồn và bản tài liệu.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain embeddings and vector databases with a concrete example.
- Write or adapt a small code example applying embeddings and vector databases.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-12-genai-rag-rag-foundations-2
- phase-11-llm-application-llm-application-1
key_terms:
- embedding
- vector
- database
- token
- retrieval
- evaluation
- rag-foundations
concept_notes_vi: Embedding cung cấp biểu diễn để tìm kiếm; cơ sở dữ liệu vector lưu và truy vấn các biểu diễn cùng
  siêu dữ liệu. Khi đổi mô hình embedding, cần kiểm tra tương thích của chỉ mục.
concept_notes_en: Embedding và vector database describes a boundary between data and a service. A sound request
  has a schema, validation, status code, timeout, and actionable errors; a sound query uses parameter binding, appropriate
  indexes, and tests empty or malformed data.
why_it_matters_vi: Tách truy xuất khỏi sinh câu trả lời để truy nguồn và xử lý thiếu bằng chứng.
why_it_matters_en: RAG separates retrieval from generation so answers can be sourced and can abstain without evidence.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Embeddings and vector databases” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- Ghi phiên bản embedding và kiểm tra truy vấn trả về đúng nguồn.
- Lần từ câu trả lời về đúng đoạn nguồn và bản tài liệu. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu chưa
  đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: RAG separates retrieval from generation so answers can be sourced and can
  abstain without evidence.'
- Open Qdrant Concepts, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Build an ingestion pipeline for Vietnamese documents, preserve metadata, benchmark
  top-k, and answer with evidence chunks.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Ghi phiên bản embedding và kiểm tra truy vấn trả về đúng nguồn.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Xây quy trình nhập tài liệu tiếng Việt,
      lưu siêu dữ liệu, đánh giá top-k và trả lời kèm đoạn nguồn.'
    deliverables:
    - Đoạn tài liệu, siêu dữ liệu và kết quả của từng bước RAG
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Lần từ câu trả lời về đúng đoạn nguồn và bản tài liệu.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Build an ingestion pipeline for Vietnamese documents, preserve metadata, benchmark top-k, and answer with
      evidence chunks.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can attribute a failure to parsing, chunking, retrieval, or generation with a concrete evaluation
      case.
    stretch: Add a failure test for embeddings and vector databases and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Embedding và cơ sở dữ liệu vector” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain embeddings and vector databases to a new teammate?
  - Which assumption behind embeddings and vector databases could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- similarity(a,b) = (a · b) / (||a||₂ ||b||₂)
code_examples:
- language: python
  title: 'Embeddings and vector databases: inspect one complete path'
  code: "# Topic: Embeddings and vector databases (phase-12-genai-rag-rag-foundations-3)\nfrom math import sqrt\n\
    \ndef dot(left: list[float], right: list[float]) -> float:\n    if len(left) != len(right):\n        raise ValueError('vectors\
    \ must have equal length')\n    return sum(a * b for a, b in zip(left, right))\n\nleft = [1.0, 2.0]\nright =\
    \ [0.5, 3.0]\nprint({'dot': dot(left, right), 'norm_left': sqrt(dot(left, left))})"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for embeddings and vector databases.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Qdrant Concepts
  url: https://qdrant.tech/documentation/concepts/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: FAISS Getting Started
  url: https://github.com/facebookresearch/faiss/wiki/Getting-started
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Hugging Face NLP Course
  url: https://huggingface.co/learn/nlp-course/chapter1/1
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: NumPy Quickstart
  url: https://numpy.org/doc/stable/user/quickstart.html
  language: en
  purpose_vi: Thực hành tạo mảng, kiểm tra kích thước và tính toán vector bằng NumPy.
  read_vi: Đọc về kích thước mảng, truy cập theo chỉ số và broadcasting; in kích thước sau mỗi bước.
  purpose_en: Practice arrays, shapes, and vector operations with NumPy.
  read_en: Read array shapes, indexing, and broadcasting; print every shape.
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
- exercise-12-rag-foundations
review_item_ids:
- phase-12-genai-rag-rag-foundations-3-recall
- phase-12-genai-rag-rag-foundations-3-application
- phase-12-genai-rag-rag-foundations-3-debug
- phase-12-genai-rag-rag-foundations-3-interview
estimated_minutes: 60
completion_checklist:
- Ghi phiên bản embedding và kiểm tra truy vấn trả về đúng nguồn.
- Lần từ câu trả lời về đúng đoạn nguồn và bản tài liệu.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Ghi phiên bản embedding và kiểm tra truy vấn trả về đúng nguồn.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Lần từ câu trả lời về đúng đoạn nguồn và bản tài liệu.
common_mistakes:
- Để lỗi trích xuất tài liệu lan sang truy xuất mà không kiểm tra.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-12-genai-rag-rag-foundations-4
- phase-13-genai-advanced-rag-advanced-rag-1
review_question_vi: Nội dung cốt lõi của “Embedding và cơ sở dữ liệu vector” là gì?
review_question_en: Define embeddings and vector databases in your own words. What are the input, transformation
  and output?
review_answer_vi: Embedding cung cấp biểu diễn để tìm kiếm; cơ sở dữ liệu vector lưu và truy vấn các biểu diễn cùng
  siêu dữ liệu. Khi đổi mô hình embedding, cần kiểm tra tương thích của chỉ mục.
review_answer_en: A strong answer names the input, transformation, output and the context where embeddings and vector
  databases is used. Relate it specifically to embeddings and vector databases in lesson phase-12-genai-rag-rag-foundations-3.
review_cards:
- id: phase-12-genai-rag-rag-foundations-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Embedding và cơ sở dữ liệu vector” là gì?
  question_en: Define embeddings and vector databases in your own words. What are the input, transformation and
    output?
  answer_vi: Embedding cung cấp biểu diễn để tìm kiếm; cơ sở dữ liệu vector lưu và truy vấn các biểu diễn cùng siêu
    dữ liệu. Khi đổi mô hình embedding, cần kiểm tra tương thích của chỉ mục.
  answer_en: A strong answer names the input, transformation, output and the context where embeddings and vector
    databases is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-12-genai-rag-rag-foundations-3-application
  type: application
  question_vi: Ghi phiên bản embedding và kiểm tra truy vấn trả về đúng nguồn.
  question_en: Write a small code example or design that applies embeddings and vector databases to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Ghi phiên bản embedding và kiểm tra truy vấn trả về đúng nguồn”, cần lưu: đoạn tài liệu,
    siêu dữ liệu và kết quả của từng bước RAG. Lần từ câu trả lời về đúng đoạn nguồn và bản tài liệu.'
  answer_en: The embeddings and vector databases example should have an explicit input, expected output and a way
    to run or verify it (phase-12-genai-rag-rag-foundations-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-12-genai-rag-rag-foundations-3-debug
  type: debug
  question_vi: Khi làm bài “Embedding và cơ sở dữ liệu vector”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If embeddings and vector databases produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Embedding và cơ sở dữ liệu vector”, lỗi cần tránh là: để lỗi trích xuất tài liệu lan sang
    truy xuất mà không kiểm tra. Lần từ câu trả lời về đúng đoạn nguồn và bản tài liệu. Dùng ví dụ nhỏ để tìm bước
    đầu tiên có kết quả khác dự kiến.'
  answer_en: For embeddings and vector databases, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-12-genai-rag-rag-foundations-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-12-genai-rag-rag-foundations-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Embedding và cơ sở dữ liệu vector” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of embeddings and vector databases?
  answer_vi: Bắt đầu từ nhiệm vụ “Ghi phiên bản embedding và kiểm tra truy vấn trả về đúng nguồn”. Trình bày kết
    quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about embeddings and vector databases should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-12-genai-rag-rag-foundations-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Embedding và cơ sở dữ liệu vector / Embeddings and vector databases

Embedding cung cấp biểu diễn để tìm kiếm; cơ sở dữ liệu vector lưu và truy vấn các biểu diễn cùng siêu dữ liệu. Khi đổi mô hình embedding, cần kiểm tra tương thích của chỉ mục.

## Thực hành

Ghi phiên bản embedding và kiểm tra truy vấn trả về đúng nguồn.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Xây quy trình nhập tài liệu tiếng Việt, lưu siêu dữ liệu, đánh giá top-k và trả lời kèm đoạn nguồn.
