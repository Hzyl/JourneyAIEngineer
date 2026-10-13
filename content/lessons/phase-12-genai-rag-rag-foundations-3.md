---
lesson_id: phase-12-genai-rag-rag-foundations-3
phase_id: phase-12-genai-rag
module_id: rag-foundations
title_vi: Embedding và cơ sở dữ liệu vector
title_en: Embeddings and vector databases
summary_vi: Tính cosine trên vector minh họa và giữ ID, phiên bản, vị trí nguồn khi truy xuất.
summary_en: Compute cosine on illustrative vectors while preserving source IDs, versions and locations.
learning_objectives:
- Tính cosine trên vector minh họa và giữ ID, phiên bản, vị trí nguồn khi truy xuất.
- Đổi vector truy vấn rồi so thứ hạng; giữ nguyên ID nguồn. Chạy lexical baseline và embedding tùy chọn trong Colab
  Lab A, lưu riêng cấu hình và lỗi từng cách.
- Thử vector [0, 0] và sai số chiều; cả hai phải bị từ chối bằng ValueError.
learning_objectives_en:
- Compute cosine on illustrative vectors while preserving source IDs, versions and locations.
- Change the query vector and compare ranking while preserving source IDs. Run the lexical baseline and optional
  embeddings in Colab Lab A; save each configuration and its failures separately.
- Try [0, 0] and a dimension mismatch; both must raise ValueError.
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
concept_notes_vi: 'Embedding model biến truy vấn và đoạn văn thành vector trong không gian tương thích. Kho vector
  lưu vector cùng metadata; một chỉ mục tìm kiếm không tự kiểm tra quyền hay độ đúng của câu trả lời. Khi đổi model
  hoặc revision, thường phải tạo lại embedding tài liệu để không trộn hai không gian biểu diễn.


  Ví dụ dùng vector viết tay, không phải embedding học được. Mỗi kết quả giữ document_id, version, chunk_id và line
  để người đọc lần ngược về đoạn nguồn. Lọc quyền trước khi đưa dữ liệu vào context; kiểm tra nguồn còn đúng phiên
  bản khi mở trích dẫn. Vector rỗng, sai số chiều hoặc có norm bằng 0 phải được xử lý rõ.


  Tự kiểm tra: cosine bằng 1 có nghĩa câu trả lời chắc chắn đúng không? Không; nó chỉ mô tả góc giữa hai vector.
  Lab A cho phép chạy embedding thật trong Colab, so cùng corpus và câu hỏi với lexical baseline; không cần tải
  model vào máy cá nhân.'
concept_notes_en: 'An embedding model maps queries and passages into a compatible vector space. A vector store keeps
  vectors and metadata; an index does not automatically establish authorization or answer correctness. Changing
  a model or revision generally requires re-embedding documents to avoid mixing representation spaces.


  The example uses hand-written vectors, not learned embeddings. Each result retains document_id, version, chunk_id
  and line so readers can locate the source. Filter permissions before placing data in context and verify source
  versions when resolving citations. Empty vectors, dimension mismatches and zero norms require explicit handling.


  Self-check: does cosine 1 guarantee a correct answer? No; it only describes the angle between vectors. Lab A optionally
  runs real embeddings in Colab against the same corpus and questions as the lexical baseline, without downloading
  a model to your personal computer.'
why_it_matters_vi: Tính cosine trên vector minh họa và giữ ID, phiên bản, vị trí nguồn khi truy xuất.
why_it_matters_en: Compute cosine on illustrative vectors while preserving source IDs, versions and locations.
study_steps_vi:
- Đọc phần giải thích và dự đoán đầu ra của ví dụ trước khi chạy.
- Chạy mã Python trong một ô Google Colab; ví dụ chỉ dùng thư viện chuẩn, không cần cài thêm.
- Đổi vector truy vấn rồi so thứ hạng; giữ nguyên ID nguồn. Chạy lexical baseline và embedding tùy chọn trong Colab
  Lab A, lưu riêng cấu hình và lỗi từng cách.
- Thử vector [0, 0] và sai số chiều; cả hai phải bị từ chối bằng ValueError.
- Lưu đầu ra, đối chiếu với kết quả mong đợi và ghi rõ giới hạn của dữ liệu mô phỏng.
study_steps_en:
- Read the explanation and predict the example output before running it.
- Run the Python code in a Google Colab cell; this example uses only the standard library.
- Change the query vector and compare ranking while preserving source IDs. Run the lexical baseline and optional
  embeddings in Colab Lab A; save each configuration and its failures separately.
- Try [0, 0] and a dimension mismatch; both must raise ValueError.
- Save the output, compare it with the expected result and state the limits of the synthetic data.
practice_plan:
  vi:
    task: Đổi vector truy vấn rồi so thứ hạng; giữ nguyên ID nguồn. Chạy lexical baseline và embedding tùy chọn
      trong Colab Lab A, lưu riêng cấu hình và lỗi từng cách.
    deliverables:
    - Danh sách xếp hạng có document_id/version/chunk_id/line và cấu hình retriever
    - Đầu ra gốc và kết quả sau khi đổi một điều kiện
    - Giải thích một lỗi và giới hạn của phép đo
    checkpoint: Thử vector [0, 0] và sai số chiều; cả hai phải bị từ chối bằng ValueError.
    stretch: Mở notebook liên kết, chạy trong Colab và ghi cấu hình thực tế.
  en:
    task: Change the query vector and compare ranking while preserving source IDs. Run the lexical baseline and
      optional embeddings in Colab Lab A; save each configuration and its failures separately.
    deliverables:
    - A ranking with document_id/version/chunk_id/line and retriever configuration
    - Original output and output after changing one condition
    - An explanation of one failure and the measurement limits
    checkpoint: Try [0, 0] and a dimension mismatch; both must raise ValueError.
    stretch: Open the linked notebook, run in Colab and record the actual configuration.
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
- cosine(a,b) = (a dot b) / (norm(a) * norm(b)); nonzero equal-length vectors
code_examples:
- language: python
  title: Rank hand-written vectors and preserve source identity
  code: "import json\nfrom math import sqrt\ndef cosine(a, b):\n    if not a or len(a) != len(b):\n        raise\
    \ ValueError(\"dimension mismatch\")\n    scale = sqrt(sum(x*x for x in a) * sum(x*x for x in b))\n    if scale\
    \ == 0:\n        raise ValueError(\"zero norm\")\n    return sum(x*y for x, y in zip(a, b)) / scale\nchunks\
    \ = [\n    dict(document_id=\"guide\", version=\"v1\", chunk_id=\"guide:1\", line=1, vector=[1, 0]),\n    dict(document_id=\"\
    faq\", version=\"v2\", chunk_id=\"faq:3\", line=3, vector=[0, 1]),\n]\nranked = sorted(chunks, key=lambda c:\
    \ -cosine([1, 0], c[\"vector\"]))\nerrors = []\nfor bad in ([0, 0], [1]):\n    try:\n        cosine([1, 0],\
    \ bad)\n    except ValueError as error:\n        errors.append(str(error))\nprint(json.dumps({\"top\": ranked[0][\"\
    chunk_id\"], \"version\": ranked[0][\"version\"],\n                  \"score\": cosine([1, 0], ranked[0][\"\
    vector\"]), \"errors\": errors}))\n"
  status: runnable
  purpose_vi: Tính cosine trên vector minh họa và giữ ID, phiên bản, vị trí nguồn khi truy xuất.
  purpose_en: Compute cosine on illustrative vectors while preserving source IDs, versions and locations.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '{"top": "guide:1", "version": "v1", "score": 1.0, "errors": ["zero norm", "dimension mismatch"]}'
  edge_case_vi: Thử vector [0, 0] và sai số chiều; cả hai phải bị từ chối bằng ValueError.
  edge_case_en: Try [0, 0] and a dimension mismatch; both must raise ValueError.
  explanation_vi: Điểm số được tính thật trên vector viết tay; không dùng nó để tuyên bố chất lượng embedding tiếng
    Việt.
  explanation_en: Scores are computed from hand-written vectors; they do not measure Vietnamese embedding quality.
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
  required: false
- title: Giải thích và hướng dẫn thực hành trong bài
  url: ''
  language: vi
  kind: in_app
  purpose_vi: Đọc giải thích, thực hiện nhiệm vụ và đối chiếu tiêu chí hoàn thành.
  purpose_en: The explanation, code example, checklist, and completion criteria inside the app.
  read_vi: Đọc giải thích → xem ví dụ → thực hành → tự kiểm tra.
  read_en: Follow Study plan → Concept notes → Code example → Practice plan.
  required: true
- title: Google Colab — Lab A
  language: vi/en
  url: https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-a-evidence-retrieval.ipynb
  kind: external
  required: false
  purpose_vi: Chạy trong Colab để mở rộng ví dụ bằng dữ liệu và báo cáo của lab.
  purpose_en: Run in Colab to extend this example with the lab dataset and reports.
  read_vi: Chọn môi trường CPU do Google lưu trữ, chạy baseline rồi phần embedding tùy chọn. Dùng tập dev trước
    khi đánh giá test và tải báo cáo về.
  read_en: 'Run in Colab on a Google-hosted CPU runtime: baseline first, then optional embeddings. Use dev before
    evaluating test and download the report.'
exercise_ids:
- exercise-12-rag-foundations
review_item_ids:
- phase-12-genai-rag-rag-foundations-3-recall
- phase-12-genai-rag-rag-foundations-3-application
- phase-12-genai-rag-rag-foundations-3-debug
- phase-12-genai-rag-rag-foundations-3-interview
estimated_minutes: 60
completion_checklist:
- Đổi vector truy vấn rồi so thứ hạng; giữ nguyên ID nguồn. Chạy lexical baseline và embedding tùy chọn trong Colab
  Lab A, lưu riêng cấu hình và lỗi từng cách.
- Thử vector [0, 0] và sai số chiều; cả hai phải bị từ chối bằng ValueError.
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Danh sách xếp hạng có document_id/version/chunk_id/line và cấu hình retriever
- Thử vector [0, 0] và sai số chiều; cả hai phải bị từ chối bằng ValueError.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
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

Embedding model biến truy vấn và đoạn văn thành vector trong không gian tương thích. Kho vector lưu vector cùng metadata; một chỉ mục tìm kiếm không tự kiểm tra quyền hay độ đúng của câu trả lời. Khi đổi model hoặc revision, thường phải tạo lại embedding tài liệu để không trộn hai không gian biểu diễn.

Ví dụ dùng vector viết tay, không phải embedding học được. Mỗi kết quả giữ document_id, version, chunk_id và line để người đọc lần ngược về đoạn nguồn. Lọc quyền trước khi đưa dữ liệu vào context; kiểm tra nguồn còn đúng phiên bản khi mở trích dẫn. Vector rỗng, sai số chiều hoặc có norm bằng 0 phải được xử lý rõ.

Tự kiểm tra: cosine bằng 1 có nghĩa câu trả lời chắc chắn đúng không? Không; nó chỉ mô tả góc giữa hai vector. Lab A cho phép chạy embedding thật trong Colab, so cùng corpus và câu hỏi với lexical baseline; không cần tải model vào máy cá nhân.

## English

An embedding model maps queries and passages into a compatible vector space. A vector store keeps vectors and metadata; an index does not automatically establish authorization or answer correctness. Changing a model or revision generally requires re-embedding documents to avoid mixing representation spaces.

The example uses hand-written vectors, not learned embeddings. Each result retains document_id, version, chunk_id and line so readers can locate the source. Filter permissions before placing data in context and verify source versions when resolving citations. Empty vectors, dimension mismatches and zero norms require explicit handling.

Self-check: does cosine 1 guarantee a correct answer? No; it only describes the angle between vectors. Lab A optionally runs real embeddings in Colab against the same corpus and questions as the lexical baseline, without downloading a model to your personal computer.

## Thực hành / Practice

Đổi vector truy vấn rồi so thứ hạng; giữ nguyên ID nguồn. Chạy lexical baseline và embedding tùy chọn trong Colab Lab A, lưu riêng cấu hình và lỗi từng cách.

Change the query vector and compare ranking while preserving source IDs. Run the lexical baseline and optional embeddings in Colab Lab A; save each configuration and its failures separately.
