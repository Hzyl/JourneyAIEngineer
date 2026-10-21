---
lesson_id: phase-07-capstone-career-ship-1
phase_id: phase-07-capstone-career
module_id: ship
title_vi: Mô hình cơ sở và sản phẩm tối thiểu
title_en: Baseline and MVP
summary_vi: Mô hình cơ sở cung cấp mốc chất lượng; sản phẩm tối thiểu kiểm chứng một luồng sử dụng có giá trị.
summary_en: Learn Baseline and MVP through an input → transformation → output model, then verify it with an
  edge-case exercise.
learning_objectives:
- Chọn luồng nhỏ chạy được từ đầu tới cuối và xác định mốc so sánh.
- Để người khác làm theo hướng dẫn và ghi các bước còn thiếu.
- Giải thích kết quả và nêu một giới hạn của bài làm.
- Hoàn thành một lát cắt RAG từ dữ liệu đến HTTP, đánh giá và bằng chứng vận hành.
learning_objectives_en:
- Explain baseline and mvp with a concrete example.
- Write or adapt a small code example applying baseline and mvp.
- Recognize its assumptions, limits and one common failure mode.
- Deliver one RAG slice from source data through HTTP, evaluation and operational evidence.
prerequisites:
- phase-07-capstone-career-problem-4
- phase-06-llm-rag-nlp-foundations-1
key_terms:
- baseline
- mvp
- Python
- testing
- debugging
- maintainability
- ship
concept_notes_vi: |-
  Mô hình cơ sở cung cấp mốc chất lượng; sản phẩm tối thiểu kiểm chứng một luồng sử dụng có giá trị. Giới hạn phạm vi giúp đo phản hồi sớm và quyết định có nên đầu tư thêm.

  Baseline là cách giải đơn giản để so sánh; MVP là phiên bản sản phẩm đủ để thử một giả thuyết về nhu cầu. Chúng trả lời hai câu hỏi khác nhau: mô hình có cải thiện chất lượng và người dùng có nhận được lợi ích không.

  Ví dụ, tìm quy định bằng từ khóa là baseline cho hệ RAG; trang hỏi đáp chỉ dùng một bộ quy định là MVP. Tự kiểm tra: mô hình thắng baseline đã chứng minh sản phẩm hữu ích chưa? Chưa; cần quan sát người dùng hoàn thành nhiệm vụ và ghi cả lỗi, thời gian lẫn phản hồi.

  Chuẩn bị: Python/HTTP, RAG nền tảng, metric retrieval và môi trường Docker hoặc Python native. Dùng một trợ lý tài liệu xuyên suốt, không tạo thêm project portfolio trùng vietnamese-rag. Mục tiêu là người dùng hỏi nguồn công khai và nhận đoạn trích có vị trí nguồn, hoặc được yêu cầu làm rõ/từ chối khi chưa đủ bằng chứng.

  M1: kiểm tra corpus giả, document_id/version/line/ACL, rồi chạy bài nhập tài liệu và chunking phase 12. M2: lưu baseline lexical với hash, split và từng ca sai. M3: ablation hybrid/rerank và probe dev; chọn cách đơn giản nhất đủ tốt. M4: tùy chọn model Colab để so embedding và sinh câu trả lời, ghi rõ NOT RUN nếu chưa chạy. Không dùng metric retrieval để tuyên bố groundedness của LLM.

  M5: phục vụ cùng corpus qua capstone_api.py; /query trả action, answer, citations, latency và nhãn generation. M6: đóng gói Compose, probe DNS/readiness, restart counter và chạy benchmark 20 request ở concurrency 1 rồi 2. Báo cáo phải phân biệt HTTP đúng, câu trả lời đúng, trích dẫn đúng và tính bền state.

  Baseline chạy không cần model, API key hoặc Supabase và chỉ dùng dữ liệu giả. Nó trả đoạn nguyên văn, chưa là chatbot sinh ngôn ngữ tự do. Nếu thêm generation, giữ retriever cố định, lưu prompt/model/revision, chấm từng claim với citation và thử câu thiếu nguồn/prompt injection; nguồn là dữ liệu, không là lệnh.

  T24 M/H gợi ý chuỗi RAG → evaluation → vận hành; T17/T22 được gộp vào một project. Tiêu chí đạt là artifact kiểm chứng được, không phải xem hết bài hoặc dựng nhiều dịch vụ. LoRA và self-host GPU là nhánh tùy chọn khi có lỗi đo được, dữ liệu đủ và ngân sách phù hợp.
concept_notes_en: |-
  A baseline provides a quality reference; a minimum viable product tests one useful user workflow. Narrow scope helps collect feedback before larger investment.

  A baseline is a simple solution for comparison, while an MVP is a product version sufficient to test a need. Model improvement and user benefit are separate questions.

  Keyword search can be a RAG baseline; a question-answer page for one policy collection can be an MVP. Self-check: does beating the baseline prove usefulness? No: observe users completing tasks and record errors, time and feedback.

  Prerequisites: Python/HTTP, foundational RAG, retrieval metrics and either Docker or a native Python environment. Extend one document assistant instead of duplicating the vietnamese-rag portfolio project. Users receive cited source passages, clarification or abstention.

  M1 validates synthetic corpus, IDs/versions/lines/ACL and phase 12 ingestion/chunking. M2 saves lexical baseline, hashes, split and failures. M3 compares hybrid/reranking with separate dev probes and chooses the simplest adequate method. M4 optionally runs hosted Colab embedding/generation; record NOT RUN when unexecuted. Retrieval metrics do not prove LLM groundedness.

  M5 serves the same corpus through capstone_api.py. /query returns action, answer, citations, latency and generation status. M6 packages Compose, checks service DNS/readiness, counter restart and twenty requests at concurrency one and two. Distinguish HTTP success, answer correctness, exact citations and persistence.

  The baseline uses synthetic data without a model, API key or Supabase. It returns exact excerpts rather than free-form generation. A generator extension must freeze retrieval, save prompt/model/revision and assess each claim against evidence, including unsupported queries and injection. Retrieved content is data, not instructions.

  T24 M/H motivates RAG → evaluation → operation; overlapping T17/T22 ideas map to this single project. Completion requires reproducible artifacts, not just lessons watched or service count. LoRA and self-hosted GPUs remain optional, justified by measured failures, data and budget.
why_it_matters_vi: Hoàn thiện đồ án có thể chạy, đánh giá và trình bày rõ giới hạn.
why_it_matters_en: Turn the capstone into a product with a baseline, evaluation, demo, README, and explicit
  limitations.
study_steps_vi:
- Ghi scope, câu hỏi và quyền đọc.
- Làm M1–M3 trước khi thêm model.
- Chạy HTTP native hoặc Compose với dữ liệu giả.
- Lưu report và ghi rõ mốc nào chưa thực thi.
study_steps_en:
- Specify scope, questions and read permissions.
- Complete M1–M3 before adding a model.
- Run native HTTP or Compose with synthetic data.
- Save reports and mark unexecuted milestones.
practice_plan:
  vi:
    task: Làm capstone theo CAPSTONE.md. Mở API ở terminal thứ nhất, chạy HTTP counter ở terminal thứ hai;
      sau đó chạy ablation và benchmark. Mỗi mốc có một artifact, không dùng ảnh chụp màn hình làm bằng chứng
      duy nhất.
    deliverables:
    - Corpus manifest và baseline JSON
    - Bảng ablation và hai ca lỗi có phân tích
    - HTTP/load report, log trace an toàn và bằng chứng restart
    - Giới hạn generation và kế hoạch cải thiện tiếp theo
    checkpoint: Người khác tái chạy được từ README; quyền A/B không lẫn; không ghi ready cho bước chưa chạy.
    stretch: Thêm generation trong Colab trên cùng corpus rồi chấm claim-level groundedness; giữ bản baseline
      để rollback.
  en:
    task: Follow CAPSTONE.md. Start the API in one terminal and run the HTTP counter in another, then ablation
      and load probes. Save an artifact per milestone, not screenshots alone.
    deliverables:
    - Corpus manifest and baseline JSON
    - Ablation table and two explained failures
    - HTTP/load report, safe trace logs and restart evidence
    - Generation limits and next improvement
    checkpoint: Another learner can rerun the README; A/B permissions remain isolated; unexecuted steps are
      not marked ready.
    stretch: Add hosted Colab generation and claim-level grounding review, retaining the baseline for rollback.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Mô hình cơ sở và sản phẩm tối thiểu” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain baseline and mvp to a new teammate?
  - Which assumption behind baseline and mvp could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- title: Verify the MVP evidence and authorization boundary over HTTP
  code: |
    import json
    from urllib.error import HTTPError
    from urllib.request import Request, urlopen

    def query(document_id, key=None):
        data = json.dumps({"question": "Thư viện mở cửa lúc mấy giờ?", "document_id": document_id}).encode()
        headers = {"Content-Type": "application/json"}
        if key:
            headers["X-Lab-Key"] = key
        request = Request("http://127.0.0.1:8091/query", data=data, headers=headers)
        with urlopen(request, timeout=3) as response:
            assert response.headers.get("X-Trace-Id")
            return json.load(response)

    answer = query("library", "demo-A-public")
    assert "08:00" in answer["answer"]
    assert answer["citations"][0]["chunk_id"] == "library@1.0:L1"
    denied = query("assessment", "demo-A-public")
    assert denied["citations"] == [] and denied["action"] != "answer"
    try:
        query("library")
        raise AssertionError("Unauthenticated query unexpectedly passed")
    except HTTPError as error:
        assert error.code == 401
    print(json.dumps({"answer_supported": True, "forbidden_context_hidden": True, "anonymous_blocked": True}))
  language: python
  status: runnable
  purpose_vi: Đối chiếu câu trả lời, citation và trạng thái cuối qua HTTP thật.
  purpose_en: Verify answer, citation and final state through real HTTP.
  setup: Download repository ZIP; start the synthetic API using the native or Docker commands shown in this
    lesson/CAPSTONE.md. Run this Python cell in a second local terminal (not remote Colab). No credentials
    needed; demo keys are public fixtures.
  expected_output: '{"answer_supported": true, "forbidden_context_hidden": true, "anonymous_blocked": true}'
  edge_case_vi: Thử tình huống lỗi trong phần thực hành; không coi chương trình thoát thành công là đủ nghiệm
    thu.
  edge_case_en: Try the practice failure case; a zero exit code alone does not establish acceptance.
  explanation_vi: Đối chiếu câu trả lời, citation và trạng thái cuối qua HTTP thật.
  explanation_en: Verify answer, citation and final state through real HTTP.
  setup_en: Download repository ZIP; start the synthetic API using the native or Docker commands shown in this
    lesson/CAPSTONE.md. Run this Python cell in a second local terminal (not remote Colab). No credentials
    needed; demo keys are public fixtures.
  setup_vi: Tải ZIP repo; mở samples/vi-document-assistant và chạy API bằng lệnh trong bài hoặc CAPSTONE.md.
    Chạy ví dụ ở terminal Python thứ hai trên cùng máy; Colab ở xa không gọi được localhost của bạn. Chỉ dùng
    dữ liệu và khóa demo công khai.
resources:
- language: en
  title: GitHub Docs
  url: https://docs.github.com/en
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Google Engineering Practices
  url: https://google.github.io/eng-practices/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: The Twelve-Factor App
  url: https://12factor.net/
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
- title: 'Capstone RAG: source, commands and evidence rubric'
  url: https://github.com/Hzyl/JourneyAIEngineer/blob/main/samples/vi-document-assistant/CAPSTONE.md
  language: vi
  kind: external
  required: false
  purpose_vi: 'Mã nguồn và lệnh đầy đủ của lab dùng xuyên suốt các bài, không cần Git: có thể tải ZIP.'
  purpose_en: Complete shared lab commands and sources; download ZIP without using Git.
  read_vi: Đọc mốc M1–M6, chạy đúng môi trường và ghi phần chưa chạy.
  read_en: Follow milestones M1–M6 and record the environment and unexecuted steps.
- title: 'Sentence Transformers: retrieve and rerank'
  url: https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html
  language: en
  kind: official
  required: false
  purpose_vi: Phân biệt bi-encoder lấy ứng viên với cross-encoder chấm cặp query–passage.
  purpose_en: Distinguish candidate retrieval by bi-encoder from query–passage cross-encoding.
  read_vi: Phân biệt bi-encoder lấy ứng viên với cross-encoder chấm cặp query–passage.
  read_en: Distinguish candidate retrieval by bi-encoder from query–passage cross-encoding.
- title: FastAPI in containers
  url: https://fastapi.tiangolo.com/deployment/docker/
  language: en
  kind: official
  required: false
  purpose_vi: Đọc thứ tự COPY để tận dụng cache và cách chạy Uvicorn trong container.
  purpose_en: Read COPY ordering for caching and Uvicorn container deployment.
  read_vi: Đọc thứ tự COPY để tận dụng cache và cách chạy Uvicorn trong container.
  read_en: Read COPY ordering for caching and Uvicorn container deployment.
exercise_ids:
- exercise-7-ship
review_item_ids:
- phase-07-capstone-career-ship-1-recall
- phase-07-capstone-career-ship-1-application
- phase-07-capstone-career-ship-1-debug
- phase-07-capstone-career-ship-1-interview
estimated_minutes: 120
completion_checklist:
- Chọn luồng nhỏ chạy được từ đầu tới cuối và xác định mốc so sánh.
- Để người khác làm theo hướng dẫn và ghi các bước còn thiếu.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Chọn luồng nhỏ chạy được từ đầu tới cuối và xác định mốc so sánh.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Để người khác làm theo hướng dẫn và ghi các bước còn thiếu.
- Corpus manifest và baseline JSON
- Bảng ablation và hai ca lỗi có phân tích
- HTTP/load report, log trace an toàn và bằng chứng restart
- Giới hạn generation và kế hoạch cải thiện tiếp theo
- Người khác tái chạy được từ README; quyền A/B không lẫn; không ghi ready cho bước chưa chạy.
common_mistakes:
- Trình bày bản demo như sản phẩm hoàn chỉnh khi chưa kiểm chứng cách chạy lại.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
- Chuyển sang agent trước khi có baseline.
- Gọi native API là Docker deployment.
- Coi retrieval Recall=1 là toàn bộ sản phẩm đúng.
next_lessons:
- phase-07-capstone-career-ship-2
- phase-07-capstone-career-ship-3
review_question_vi: Nội dung cốt lõi của “Mô hình cơ sở và sản phẩm tối thiểu” là gì?
review_question_en: Define baseline and mvp in your own words. What are the input, transformation and output?
review_answer_vi: Mô hình cơ sở cung cấp mốc chất lượng; sản phẩm tối thiểu kiểm chứng một luồng sử dụng có
  giá trị. Giới hạn phạm vi giúp đo phản hồi sớm và quyết định có nên đầu tư thêm.
review_answer_en: A strong answer names the input, transformation, output and the context where baseline and
  mvp is used. Relate it specifically to baseline and mvp in lesson phase-07-capstone-career-ship-1.
review_cards:
- id: phase-07-capstone-career-ship-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Mô hình cơ sở và sản phẩm tối thiểu” là gì?
  question_en: Define baseline and mvp in your own words. What are the input, transformation and output?
  answer_vi: Mô hình cơ sở cung cấp mốc chất lượng; sản phẩm tối thiểu kiểm chứng một luồng sử dụng có giá
    trị. Giới hạn phạm vi giúp đo phản hồi sớm và quyết định có nên đầu tư thêm.
  answer_en: A strong answer names the input, transformation, output and the context where baseline and mvp
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-07-capstone-career-ship-1-application
  type: application
  question_vi: Chọn luồng nhỏ chạy được từ đầu tới cuối và xác định mốc so sánh.
  question_en: Write a small code example or design that applies baseline and mvp to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Chọn luồng nhỏ chạy được từ đầu tới cuối và xác định mốc so sánh”, cần lưu: luồng
    sử dụng hoặc báo cáo có kết quả kiểm tra và giới hạn. Để người khác làm theo hướng dẫn và ghi các bước
    còn thiếu.'
  answer_en: The baseline and mvp example should have an explicit input, expected output and a way to run or
    verify it (phase-07-capstone-career-ship-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-07-capstone-career-ship-1-debug
  type: debug
  question_vi: Khi làm bài “Mô hình cơ sở và sản phẩm tối thiểu”, bạn cần tránh lỗi nào và kiểm tra lại ra
    sao?
  question_en: If baseline and mvp produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Mô hình cơ sở và sản phẩm tối thiểu”, lỗi cần tránh là: trình bày bản demo như sản
    phẩm hoàn chỉnh khi chưa kiểm chứng cách chạy lại. Để người khác làm theo hướng dẫn và ghi các bước còn
    thiếu. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For baseline and mvp, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-07-capstone-career-ship-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-07-capstone-career-ship-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Mô hình cơ sở và sản phẩm tối thiểu” để giải thích cách làm và
    giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of baseline and mvp?
  answer_vi: Bắt đầu từ nhiệm vụ “Chọn luồng nhỏ chạy được từ đầu tới cuối và xác định mốc so sánh”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định
    nghĩa.
  answer_en: The answer about baseline and mvp should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-07-capstone-career-ship-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
completion_criteria_en:
- Corpus manifest and baseline JSON
- Ablation table and two explained failures
- HTTP/load report, safe trace logs and restart evidence
- Generation limits and next improvement
- Another learner can rerun the README; A/B permissions remain isolated; unexecuted steps are not marked ready.
common_mistakes_en:
- Adding an agent before a baseline.
- Calling native execution Docker deployment.
- Equating Recall=1 with product correctness.
---
# Mô hình cơ sở và sản phẩm tối thiểu / Baseline and MVP

Mô hình cơ sở cung cấp mốc chất lượng; sản phẩm tối thiểu kiểm chứng một luồng sử dụng có giá trị. Giới hạn phạm vi giúp đo phản hồi sớm và quyết định có nên đầu tư thêm.

Baseline là cách giải đơn giản để so sánh; MVP là phiên bản sản phẩm đủ để thử một giả thuyết về nhu cầu. Chúng trả lời hai câu hỏi khác nhau: mô hình có cải thiện chất lượng và người dùng có nhận được lợi ích không.

Ví dụ, tìm quy định bằng từ khóa là baseline cho hệ RAG; trang hỏi đáp chỉ dùng một bộ quy định là MVP. Tự kiểm tra: mô hình thắng baseline đã chứng minh sản phẩm hữu ích chưa? Chưa; cần quan sát người dùng hoàn thành nhiệm vụ và ghi cả lỗi, thời gian lẫn phản hồi.

## Thực hành

Chọn luồng nhỏ chạy được từ đầu tới cuối và xác định mốc so sánh.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Làm một luồng nhỏ chạy trọn trên máy, ghi kết quả kiểm thử, quay demo và ghi phần chưa hoàn thành.

## Lab nối tiếp · 21/10/2026 / Connected lab

### Tiếng Việt

Chuẩn bị: Python/HTTP, RAG nền tảng, metric retrieval và môi trường Docker hoặc Python native. Dùng một trợ lý tài liệu xuyên suốt, không tạo thêm project portfolio trùng vietnamese-rag. Mục tiêu là người dùng hỏi nguồn công khai và nhận đoạn trích có vị trí nguồn, hoặc được yêu cầu làm rõ/từ chối khi chưa đủ bằng chứng.

M1: kiểm tra corpus giả, document_id/version/line/ACL, rồi chạy bài nhập tài liệu và chunking phase 12. M2: lưu baseline lexical với hash, split và từng ca sai. M3: ablation hybrid/rerank và probe dev; chọn cách đơn giản nhất đủ tốt. M4: tùy chọn model Colab để so embedding và sinh câu trả lời, ghi rõ NOT RUN nếu chưa chạy. Không dùng metric retrieval để tuyên bố groundedness của LLM.

M5: phục vụ cùng corpus qua capstone_api.py; /query trả action, answer, citations, latency và nhãn generation. M6: đóng gói Compose, probe DNS/readiness, restart counter và chạy benchmark 20 request ở concurrency 1 rồi 2. Báo cáo phải phân biệt HTTP đúng, câu trả lời đúng, trích dẫn đúng và tính bền state.

Baseline chạy không cần model, API key hoặc Supabase và chỉ dùng dữ liệu giả. Nó trả đoạn nguyên văn, chưa là chatbot sinh ngôn ngữ tự do. Nếu thêm generation, giữ retriever cố định, lưu prompt/model/revision, chấm từng claim với citation và thử câu thiếu nguồn/prompt injection; nguồn là dữ liệu, không là lệnh.

T24 M/H gợi ý chuỗi RAG → evaluation → vận hành; T17/T22 được gộp vào một project. Tiêu chí đạt là artifact kiểm chứng được, không phải xem hết bài hoặc dựng nhiều dịch vụ. LoRA và self-host GPU là nhánh tùy chọn khi có lỗi đo được, dữ liệu đủ và ngân sách phù hợp.

Làm capstone theo CAPSTONE.md. Mở API ở terminal thứ nhất, chạy HTTP counter ở terminal thứ hai; sau đó chạy ablation và benchmark. Mỗi mốc có một artifact, không dùng ảnh chụp màn hình làm bằng chứng duy nhất.

Người khác tái chạy được từ README; quyền A/B không lẫn; không ghi ready cho bước chưa chạy.

### English

Prerequisites: Python/HTTP, foundational RAG, retrieval metrics and either Docker or a native Python environment. Extend one document assistant instead of duplicating the vietnamese-rag portfolio project. Users receive cited source passages, clarification or abstention.

M1 validates synthetic corpus, IDs/versions/lines/ACL and phase 12 ingestion/chunking. M2 saves lexical baseline, hashes, split and failures. M3 compares hybrid/reranking with separate dev probes and chooses the simplest adequate method. M4 optionally runs hosted Colab embedding/generation; record NOT RUN when unexecuted. Retrieval metrics do not prove LLM groundedness.

M5 serves the same corpus through capstone_api.py. /query returns action, answer, citations, latency and generation status. M6 packages Compose, checks service DNS/readiness, counter restart and twenty requests at concurrency one and two. Distinguish HTTP success, answer correctness, exact citations and persistence.

The baseline uses synthetic data without a model, API key or Supabase. It returns exact excerpts rather than free-form generation. A generator extension must freeze retrieval, save prompt/model/revision and assess each claim against evidence, including unsupported queries and injection. Retrieved content is data, not instructions.

T24 M/H motivates RAG → evaluation → operation; overlapping T17/T22 ideas map to this single project. Completion requires reproducible artifacts, not just lessons watched or service count. LoRA and self-hosted GPUs remain optional, justified by measured failures, data and budget.

Follow CAPSTONE.md. Start the API in one terminal and run the HTTP counter in another, then ablation and load probes. Save an artifact per milestone, not screenshots alone.

Another learner can rerun the README; A/B permissions remain isolated; unexecuted steps are not marked ready.
