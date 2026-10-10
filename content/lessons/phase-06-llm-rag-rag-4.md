---
lesson_id: phase-06-llm-rag-rag-4
phase_id: phase-06-llm-rag
module_id: rag
title_vi: Phân tích lỗi RAG
title_en: RAG failure analysis
summary_vi: Lỗi có thể đến từ đọc tài liệu, chia đoạn, truy xuất hoặc sinh câu trả lời.
summary_en: Learn RAG failure analysis through an input → transformation → output model, then verify it with an
  edge-case exercise.
learning_objectives:
- Phân loại câu trả lời sai theo bước gây lỗi và đề xuất cách kiểm tra lại.
- Kiểm tra nguồn có thực sự hỗ trợ từng phát biểu hay không.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain rag failure analysis with a concrete example.
- Write or adapt a small code example applying rag failure analysis.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-rag-3
- phase-05-mlops-api-1
key_terms:
- rag
- failure
- analysis
- token
- embedding
- retrieval
- evaluation
concept_notes_vi: Lỗi có thể đến từ đọc tài liệu, chia đoạn, truy xuất hoặc sinh câu trả lời. Ghi câu hỏi, ứng viên
  và đầu ra để phân loại rồi chọn đúng bước cần cải thiện.
concept_notes_en: RAG failure analysis is one link in a RAG system. Separate parsing, chunking, indexing, retrieval,
  reranking, and generation so failures are attributable. Chunks need enough context; evaluation should measure
  retrieval recall, groundedness, and abstention when evidence is missing.
why_it_matters_vi: Xây câu trả lời có nguồn và xử lý đúng trường hợp thiếu bằng chứng.
why_it_matters_en: Build RAG with citations, evidence-based refusal, and error analysis instead of only a polished
  demo.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “RAG failure analysis” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Phân loại câu trả lời sai theo bước gây lỗi và đề xuất cách kiểm tra lại.
- Kiểm tra nguồn có thực sự hỗ trợ từng phát biểu hay không. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu
  chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Build RAG with citations, evidence-based refusal, and error analysis instead
  of only a polished demo.'
- Open Hugging Face NLP Course, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Create a 30-question evaluation set, save retrieved chunks, verify citations, and
  label each failure.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Phân loại câu trả lời sai theo bước gây lỗi và đề xuất cách kiểm tra lại.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo bộ đánh giá 30 câu, lưu đoạn truy
      xuất, đối chiếu trích dẫn và phân loại lỗi.'
    deliverables:
    - Câu hỏi, đoạn nguồn và câu trả lời đã đối chiếu
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Kiểm tra nguồn có thực sự hỗ trợ từng phát biểu hay không.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Create a 30-question evaluation set, save retrieved chunks, verify citations, and label each failure.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can tell which answers are grounded, which must be refused, and why.
    stretch: Add a failure test for rag failure analysis and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Phân tích lỗi RAG” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain rag failure analysis to a new teammate?
  - Which assumption behind rag failure analysis could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'RAG failure analysis: inspect one complete path'
  code: "# Topic: RAG failure analysis (phase-06-llm-rag-rag-4)\ndef grounded_answer(answer: str, evidence: list[str])\
    \ -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return answer + '\\nSources: '\
    \ + '; '.join(evidence)\n\nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for rag failure analysis.
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
- exercise-6-rag
review_item_ids:
- phase-06-llm-rag-rag-4-recall
- phase-06-llm-rag-rag-4-application
- phase-06-llm-rag-rag-4-debug
- phase-06-llm-rag-rag-4-interview
estimated_minutes: 60
completion_checklist:
- Phân loại câu trả lời sai theo bước gây lỗi và đề xuất cách kiểm tra lại.
- Kiểm tra nguồn có thực sự hỗ trợ từng phát biểu hay không.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Phân loại câu trả lời sai theo bước gây lỗi và đề xuất cách kiểm tra lại.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Kiểm tra nguồn có thực sự hỗ trợ từng phát biểu hay không.
common_mistakes:
- Coi việc có liên kết trích dẫn là đủ chứng minh câu trả lời có căn cứ.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-06-llm-rag-quality-safety-1
- phase-06-llm-rag-quality-safety-2
review_question_vi: Nội dung cốt lõi của “Phân tích lỗi RAG” là gì?
review_question_en: Define rag failure analysis in your own words. What are the input, transformation and output?
review_answer_vi: Lỗi có thể đến từ đọc tài liệu, chia đoạn, truy xuất hoặc sinh câu trả lời. Ghi câu hỏi, ứng viên
  và đầu ra để phân loại rồi chọn đúng bước cần cải thiện.
review_answer_en: A strong answer names the input, transformation, output and the context where rag failure analysis
  is used. Relate it specifically to rag failure analysis in lesson phase-06-llm-rag-rag-4.
review_cards:
- id: phase-06-llm-rag-rag-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Phân tích lỗi RAG” là gì?
  question_en: Define rag failure analysis in your own words. What are the input, transformation and output?
  answer_vi: Lỗi có thể đến từ đọc tài liệu, chia đoạn, truy xuất hoặc sinh câu trả lời. Ghi câu hỏi, ứng viên và
    đầu ra để phân loại rồi chọn đúng bước cần cải thiện.
  answer_en: A strong answer names the input, transformation, output and the context where rag failure analysis
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-rag-4-application
  type: application
  question_vi: Phân loại câu trả lời sai theo bước gây lỗi và đề xuất cách kiểm tra lại.
  question_en: Write a small code example or design that applies rag failure analysis to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Phân loại câu trả lời sai theo bước gây lỗi và đề xuất cách kiểm tra lại”, cần lưu:
    câu hỏi, đoạn nguồn và câu trả lời đã đối chiếu. Kiểm tra nguồn có thực sự hỗ trợ từng phát biểu hay không.'
  answer_en: The rag failure analysis example should have an explicit input, expected output and a way to run or
    verify it (phase-06-llm-rag-rag-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-rag-4-debug
  type: debug
  question_vi: Khi làm bài “Phân tích lỗi RAG”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If rag failure analysis produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Phân tích lỗi RAG”, lỗi cần tránh là: coi việc có liên kết trích dẫn là đủ chứng minh câu
    trả lời có căn cứ. Kiểm tra nguồn có thực sự hỗ trợ từng phát biểu hay không. Dùng ví dụ nhỏ để tìm bước đầu
    tiên có kết quả khác dự kiến.'
  answer_en: For rag failure analysis, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-06-llm-rag-rag-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-rag-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Phân tích lỗi RAG” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of rag failure analysis?
  answer_vi: Bắt đầu từ nhiệm vụ “Phân loại câu trả lời sai theo bước gây lỗi và đề xuất cách kiểm tra lại”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about rag failure analysis should cover assumptions, metrics/cost, limitations and how to
    reduce production risk (phase-06-llm-rag-rag-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Phân tích lỗi RAG / RAG failure analysis

Lỗi có thể đến từ đọc tài liệu, chia đoạn, truy xuất hoặc sinh câu trả lời. Ghi câu hỏi, ứng viên và đầu ra để phân loại rồi chọn đúng bước cần cải thiện.

## Thực hành

Phân loại câu trả lời sai theo bước gây lỗi và đề xuất cách kiểm tra lại.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo bộ đánh giá 30 câu, lưu đoạn truy xuất, đối chiếu trích dẫn và phân loại lỗi.
