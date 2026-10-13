---
lesson_id: phase-22-genai-system-design-genai-system-design-1
phase_id: phase-22-genai-system-design
module_id: genai-system-design
title_vi: Kiến trúc toàn hệ thống cho sản phẩm AI
title_en: End-to-end architecture for an AI product
summary_vi: Chọn kiến trúc theo bài toán, quyền dữ liệu và tiêu chí chất lượng, độ trễ, chi phí.
summary_en: Choose architecture from task needs, data permissions and quality, latency and cost criteria.
learning_objectives:
- Chọn kiến trúc theo bài toán, quyền dữ liệu và tiêu chí chất lượng, độ trễ, chi phí.
- Đổi ngưỡng latency rồi chọn lại; vẽ luồng dữ liệu của phương án được chọn và đánh dấu nơi kiểm tra quyền, phiên
  bản và thiếu nguồn.
- Khi không có phương án đạt ngưỡng, trả None; không tự bỏ kiểm tra quyền để có kết quả.
learning_objectives_en:
- Choose architecture from task needs, data permissions and quality, latency and cost criteria.
- Change the latency threshold and reselect; diagram the chosen data flow and mark permission, version and missing-evidence
  checks.
- Return None when no option meets the thresholds; never remove permission checks to obtain a result.
prerequisites:
- phase-21-genai-local-llm-local-llm-4
- phase-21-genai-local-llm-local-llm-1
key_terms:
- architecture
- end
- cho
- product
- inference
- observability
- reproducibility
- deployment
- genai-system-design
concept_notes_vi: 'Bắt đầu từ nhiệm vụ và đường đi dữ liệu: nhận câu hỏi, xác định danh tính, truy xuất nguồn được
  phép, tạo câu trả lời, kiểm tra dẫn nguồn rồi trả kết quả. Nhu cầu tài liệu thay đổi có thể dùng RAG; workflow
  điều phối bước rõ; agent chỉ đáng thêm khi quyết định động có lợi ích được đo. Không xem LLM, RAG và agent là
  các cấp độ bắt buộc nối tiếp.


  Thiết kế cần chỉ ra nơi lưu phiên bản nguồn, lọc quyền, đặt timeout, ghi telemetry, chấm eval và xử lý câu thiếu
  đáp án. Ví dụ lọc ba ứng viên bằng ngưỡng chất lượng, latency, chi phí và quyền. Các con số là giả định bài tập,
  không phải kết quả model hay giá dịch vụ; khi làm thật thay bằng báo cáo đo cùng workload.


  Tự kiểm tra: phương án chất lượng cao nhất có luôn được chọn không? Không; vượt quyền dữ liệu là điều kiện loại,
  và latency/chi phí có thể vi phạm yêu cầu. Nếu không ứng viên nào đạt, báo không có phương án thay vì nới ngưỡng
  âm thầm. Có thể dùng Lab A làm nguồn bằng chứng truy xuất và Lab B cho quyết định workflow/agent.'
concept_notes_en: 'Start from the task and data flow: receive a question, establish identity, retrieve authorized
  sources, generate an answer, validate citations and return the result. Changing documents may justify RAG; workflows
  coordinate known steps; agents need measured benefits from dynamic choices. LLM, RAG and agents are not mandatory
  successive tiers.


  Identify where source versions, authorization, timeouts, telemetry, evaluations and unanswerable handling belong.
  This example filters three candidates by quality, latency, cost and permission criteria. Numbers are exercise
  assumptions, not model results or service prices; replace them with measurements from the same workload for a
  real decision.


  Self-check: must the highest-quality candidate win? No; unauthorized data flow is disqualifying, and latency/cost
  may violate requirements. If no candidate qualifies, report no option instead of silently weakening thresholds.
  Lab A can supply retrieval evidence and Lab B can inform workflow/agent selection.'
why_it_matters_vi: Chọn kiến trúc theo bài toán, quyền dữ liệu và tiêu chí chất lượng, độ trễ, chi phí.
why_it_matters_en: Choose architecture from task needs, data permissions and quality, latency and cost criteria.
study_steps_vi:
- Đọc phần giải thích và dự đoán đầu ra của ví dụ trước khi chạy.
- Chạy mã Python trong một ô Google Colab; ví dụ chỉ dùng thư viện chuẩn, không cần cài thêm.
- Đổi ngưỡng latency rồi chọn lại; vẽ luồng dữ liệu của phương án được chọn và đánh dấu nơi kiểm tra quyền, phiên
  bản và thiếu nguồn.
- Khi không có phương án đạt ngưỡng, trả None; không tự bỏ kiểm tra quyền để có kết quả.
- Lưu đầu ra, đối chiếu với kết quả mong đợi và ghi rõ giới hạn của dữ liệu mô phỏng.
study_steps_en:
- Read the explanation and predict the example output before running it.
- Run the Python code in a Google Colab cell; this example uses only the standard library.
- Change the latency threshold and reselect; diagram the chosen data flow and mark permission, version and missing-evidence
  checks.
- Return None when no option meets the thresholds; never remove permission checks to obtain a result.
- Save the output, compare it with the expected result and state the limits of the synthetic data.
practice_plan:
  vi:
    task: Đổi ngưỡng latency rồi chọn lại; vẽ luồng dữ liệu của phương án được chọn và đánh dấu nơi kiểm tra quyền,
      phiên bản và thiếu nguồn.
    deliverables:
    - Sơ đồ hệ thống và bảng quyết định kèm giả định, số đo cần có và phương án bị loại
    - Đầu ra gốc và kết quả sau khi đổi một điều kiện
    - Giải thích một lỗi và giới hạn của phép đo
    checkpoint: Khi không có phương án đạt ngưỡng, trả None; không tự bỏ kiểm tra quyền để có kết quả.
    stretch: Mở notebook liên kết, chạy trong Colab và ghi cấu hình thực tế.
  en:
    task: Change the latency threshold and reselect; diagram the chosen data flow and mark permission, version and
      missing-evidence checks.
    deliverables:
    - A system diagram and decision table with assumptions, required measurements and excluded candidates
    - Original output and output after changing one condition
    - An explanation of one failure and the measurement limits
    checkpoint: Return None when no option meets the thresholds; never remove permission checks to obtain a result.
    stretch: Open the linked notebook, run in Colab and record the actual configuration.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Kiến trúc toàn hệ thống cho sản phẩm AI” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain end-to-end architecture for an ai product to a new teammate?
  - Which assumption behind end-to-end architecture for an ai product could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: Choose an architecture using measured-criterion placeholders
  code: "import json\noptions = [\n    dict(name=\"workflow-rag\", quality=0.8, latency_ms=300, cost_units=2, authorized=True),\n\
    \    dict(name=\"agent-rag\", quality=0.9, latency_ms=900, cost_units=5, authorized=True),\n    dict(name=\"\
    unrestricted-search\", quality=0.95, latency_ms=200, cost_units=1, authorized=False),\n]\ndef choose(rows, latency_limit):\n\
    \    valid = [r for r in rows if r[\"authorized\"] and r[\"quality\"] >= 0.75\n             and r[\"latency_ms\"\
    ] <= latency_limit and r[\"cost_units\"] <= 5]\n    return min(valid, key=lambda r: (r[\"cost_units\"], -r[\"\
    quality\"]))[\"name\"] if valid else None\nprint(json.dumps({\"assumed_conditions\": choose(options, 500),\n\
    \                  \"strict_latency\": choose(options, 100),\n                  \"real_model_comparison\": False}))\n"
  status: runnable
  purpose_vi: Chọn kiến trúc theo bài toán, quyền dữ liệu và tiêu chí chất lượng, độ trễ, chi phí.
  purpose_en: Choose architecture from task needs, data permissions and quality, latency and cost criteria.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '{"assumed_conditions": "workflow-rag", "strict_latency": null, "real_model_comparison": false}'
  edge_case_vi: Khi không có phương án đạt ngưỡng, trả None; không tự bỏ kiểm tra quyền để có kết quả.
  edge_case_en: Return None when no option meets the thresholds; never remove permission checks to obtain a result.
  explanation_vi: Lựa chọn chỉ đúng với giả định đang nhập, không phải khuyến nghị một kiến trúc cho mọi sản phẩm.
  explanation_en: The selection holds only for the supplied assumptions, not every product architecture.
resources:
- language: en
  title: Google Rules of Machine Learning
  url: https://developers.google.com/machine-learning/guides/rules-of-ml
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Full Stack Deep Learning
  url: https://fullstackdeeplearning.com/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Machine Learning Systems Design
  url: https://github.com/chiphuyen/machine-learning-systems-design
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
- exercise-22-genai-system-design
review_item_ids:
- phase-22-genai-system-design-genai-system-design-1-recall
- phase-22-genai-system-design-genai-system-design-1-application
- phase-22-genai-system-design-genai-system-design-1-debug
- phase-22-genai-system-design-genai-system-design-1-interview
estimated_minutes: 60
completion_checklist:
- Đổi ngưỡng latency rồi chọn lại; vẽ luồng dữ liệu của phương án được chọn và đánh dấu nơi kiểm tra quyền, phiên
  bản và thiếu nguồn.
- Khi không có phương án đạt ngưỡng, trả None; không tự bỏ kiểm tra quyền để có kết quả.
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Sơ đồ hệ thống và bảng quyết định kèm giả định, số đo cần có và phương án bị loại
- Khi không có phương án đạt ngưỡng, trả None; không tự bỏ kiểm tra quyền để có kết quả.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
common_mistakes:
- Vẽ nhiều thành phần nhưng thiếu căn cứ về tải, chi phí và yêu cầu dữ liệu.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-22-genai-system-design-genai-system-design-2
- phase-22-genai-system-design-genai-system-design-3
review_question_vi: Nội dung cốt lõi của “Kiến trúc toàn hệ thống cho sản phẩm AI” là gì?
review_question_en: Define end-to-end architecture for an ai product in your own words. What are the input, transformation
  and output?
review_answer_vi: Thiết kế toàn hệ thống nối nhu cầu người dùng với dữ liệu, mô hình, API và vận hành. Mỗi thành
  phần cần trách nhiệm rõ và cách kiểm tra khi gặp lỗi.
review_answer_en: A strong answer names the input, transformation, output and the context where end-to-end architecture
  for an ai product is used. Relate it specifically to end-to-end architecture for an ai product in lesson phase-22-genai-system-design-genai-system-design-1.
review_cards:
- id: phase-22-genai-system-design-genai-system-design-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Kiến trúc toàn hệ thống cho sản phẩm AI” là gì?
  question_en: Define end-to-end architecture for an ai product in your own words. What are the input, transformation
    and output?
  answer_vi: Thiết kế toàn hệ thống nối nhu cầu người dùng với dữ liệu, mô hình, API và vận hành. Mỗi thành phần
    cần trách nhiệm rõ và cách kiểm tra khi gặp lỗi.
  answer_en: A strong answer names the input, transformation, output and the context where end-to-end architecture
    for an ai product is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-22-genai-system-design-genai-system-design-1-application
  type: application
  question_vi: Vẽ luồng dữ liệu từ người dùng tới kết quả và chỉ ra các điểm phụ thuộc.
  question_en: Write a small code example or design that applies end-to-end architecture for an ai product to an
    AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Vẽ luồng dữ liệu từ người dùng tới kết quả và chỉ ra các điểm phụ thuộc”, cần lưu: sơ
    đồ hoặc tài liệu quyết định có ràng buộc và cách kiểm chứng. Lần theo luồng dữ liệu và xét một tình huống lỗi
    cho mỗi thành phần chính.'
  answer_en: The end-to-end architecture for an ai product example should have an explicit input, expected output
    and a way to run or verify it (phase-22-genai-system-design-genai-system-design-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-22-genai-system-design-genai-system-design-1-debug
  type: debug
  question_vi: Khi làm bài “Kiến trúc toàn hệ thống cho sản phẩm AI”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If end-to-end architecture for an ai product produces a wrong result or a metric drops, what would
    you debug first?
  answer_vi: 'Trong bài “Kiến trúc toàn hệ thống cho sản phẩm AI”, lỗi cần tránh là: vẽ nhiều thành phần nhưng thiếu
    căn cứ về tải, chi phí và yêu cầu dữ liệu. Lần theo luồng dữ liệu và xét một tình huống lỗi cho mỗi thành phần
    chính. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For end-to-end architecture for an ai product, check inputs/shapes, preprocessing and the baseline
    first; then isolate the failure with a small test and error analysis (phase-22-genai-system-design-genai-system-design-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-22-genai-system-design-genai-system-design-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Kiến trúc toàn hệ thống cho sản phẩm AI” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of end-to-end architecture for
    an ai product?
  answer_vi: Bắt đầu từ nhiệm vụ “Vẽ luồng dữ liệu từ người dùng tới kết quả và chỉ ra các điểm phụ thuộc”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about end-to-end architecture for an ai product should cover assumptions, metrics/cost,
    limitations and how to reduce production risk (phase-22-genai-system-design-genai-system-design-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Kiến trúc toàn hệ thống cho sản phẩm AI / End-to-end architecture for an AI product

Bắt đầu từ nhiệm vụ và đường đi dữ liệu: nhận câu hỏi, xác định danh tính, truy xuất nguồn được phép, tạo câu trả lời, kiểm tra dẫn nguồn rồi trả kết quả. Nhu cầu tài liệu thay đổi có thể dùng RAG; workflow điều phối bước rõ; agent chỉ đáng thêm khi quyết định động có lợi ích được đo. Không xem LLM, RAG và agent là các cấp độ bắt buộc nối tiếp.

Thiết kế cần chỉ ra nơi lưu phiên bản nguồn, lọc quyền, đặt timeout, ghi telemetry, chấm eval và xử lý câu thiếu đáp án. Ví dụ lọc ba ứng viên bằng ngưỡng chất lượng, latency, chi phí và quyền. Các con số là giả định bài tập, không phải kết quả model hay giá dịch vụ; khi làm thật thay bằng báo cáo đo cùng workload.

Tự kiểm tra: phương án chất lượng cao nhất có luôn được chọn không? Không; vượt quyền dữ liệu là điều kiện loại, và latency/chi phí có thể vi phạm yêu cầu. Nếu không ứng viên nào đạt, báo không có phương án thay vì nới ngưỡng âm thầm. Có thể dùng Lab A làm nguồn bằng chứng truy xuất và Lab B cho quyết định workflow/agent.

## English

Start from the task and data flow: receive a question, establish identity, retrieve authorized sources, generate an answer, validate citations and return the result. Changing documents may justify RAG; workflows coordinate known steps; agents need measured benefits from dynamic choices. LLM, RAG and agents are not mandatory successive tiers.

Identify where source versions, authorization, timeouts, telemetry, evaluations and unanswerable handling belong. This example filters three candidates by quality, latency, cost and permission criteria. Numbers are exercise assumptions, not model results or service prices; replace them with measurements from the same workload for a real decision.

Self-check: must the highest-quality candidate win? No; unauthorized data flow is disqualifying, and latency/cost may violate requirements. If no candidate qualifies, report no option instead of silently weakening thresholds. Lab A can supply retrieval evidence and Lab B can inform workflow/agent selection.

## Thực hành / Practice

Đổi ngưỡng latency rồi chọn lại; vẽ luồng dữ liệu của phương án được chọn và đánh dấu nơi kiểm tra quyền, phiên bản và thiếu nguồn.

Change the latency threshold and reselect; diagram the chosen data flow and mark permission, version and missing-evidence checks.
