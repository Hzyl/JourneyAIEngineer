---
lesson_id: phase-22-genai-system-design-genai-system-design-3
phase_id: phase-22-genai-system-design
module_id: genai-system-design
title_vi: Bảo mật, chi phí và lựa chọn mô hình
title_en: Security, cost optimization, and model selection
summary_vi: Loại phương án trái quyền trước khi tối ưu chi phí và lựa chọn mô hình.
summary_en: Exclude unauthorized data routes before optimizing cost and model selection.
learning_objectives:
- Loại phương án trái quyền trước khi tối ưu chi phí và lựa chọn mô hình.
- Chạy bộ chọn cho dữ liệu public và restricted; tắt license_checked và xác nhận model bị loại dù giá thấp.
- Dữ liệu restricted không được gửi tới route public dù route đó rẻ hơn.
learning_objectives_en:
- Exclude unauthorized data routes before optimizing cost and model selection.
- Run selection for public and restricted data; disable license_checked and verify rejection even at a low price.
- Restricted data cannot use a public route even when that route is cheaper.
prerequisites:
- phase-22-genai-system-design-genai-system-design-2
- phase-21-genai-local-llm-local-llm-1
key_terms:
- security
- cost
- optimization
- model
- selection
- inference
- observability
- reproducibility
- deployment
- genai-system-design
concept_notes_vi: 'Model routing chọn model theo nhu cầu, nhưng quyền dữ liệu phải là điều kiện bắt buộc trước khi
  so điểm hay giá. Cần xác định loại dữ liệu, vùng xử lý được phép, giấy phép, log/retention và hành động công cụ.
  Một model rẻ hoặc điểm cao không được tự mở rộng quyền gửi tài liệu.


  Ví dụ có model card giả lập gồm revision và license đã kiểm tra theo cờ dữ liệu mô phỏng; không mô tả nhà cung
  cấp thật. Chi phí tính theo tổng token input/output và giá giả định mỗi triệu token, không dùng giá hiện hành.
  Ước lượng ngân sách phải dự trù retry và giới hạn lượt; khi thực thi ghi token thực dùng và đối chiếu sai lệch.


  Tự kiểm tra: fallback có được gửi dữ liệu sang vùng khác khi model chính lỗi không? Không nếu chính sách không
  cho phép. Thiết kế fallback giữ cùng ranh giới quyền hoặc dừng với lỗi rõ ràng. Lab C minh họa prompt injection
  và gọi công cụ trái quyền trên dữ liệu tự tạo; đạt lab không đồng nghĩa hệ production được chứng nhận an toàn.'
concept_notes_en: 'Model routing selects a model for a task, but data authorization is a hard constraint before
  comparing quality or price. Define data classification, allowed processing regions, licensing, logging/retention
  and tool actions. A cheap or high-scoring model cannot expand document transmission permissions.


  The example uses synthetic model cards with revision and fixture flags for license review; no real provider is
  represented. Cost uses input/output tokens and assumed prices per million tokens rather than current prices. Budget
  estimates must reserve room for retries and call limits; record actual usage during execution and compare deviations.


  Self-check: may fallback send data to another region after the primary model fails? Not without policy permission.
  A fallback must preserve authorization boundaries or stop with an explicit error. Lab C demonstrates injection
  and unauthorized tool calls on synthetic data; passing it does not certify production safety.'
why_it_matters_vi: Loại phương án trái quyền trước khi tối ưu chi phí và lựa chọn mô hình.
why_it_matters_en: Exclude unauthorized data routes before optimizing cost and model selection.
study_steps_vi:
- Đọc phần giải thích và dự đoán đầu ra của ví dụ trước khi chạy.
- Chạy mã Python trong một ô Google Colab; ví dụ chỉ dùng thư viện chuẩn, không cần cài thêm.
- Chạy bộ chọn cho dữ liệu public và restricted; tắt license_checked và xác nhận model bị loại dù giá thấp.
- Dữ liệu restricted không được gửi tới route public dù route đó rẻ hơn.
- Lưu đầu ra, đối chiếu với kết quả mong đợi và ghi rõ giới hạn của dữ liệu mô phỏng.
study_steps_en:
- Read the explanation and predict the example output before running it.
- Run the Python code in a Google Colab cell; this example uses only the standard library.
- Run selection for public and restricted data; disable license_checked and verify rejection even at a low price.
- Restricted data cannot use a public route even when that route is cheaper.
- Save the output, compare it with the expected result and state the limits of the synthetic data.
practice_plan:
  vi:
    task: Chạy bộ chọn cho dữ liệu public và restricted; tắt license_checked và xác nhận model bị loại dù giá thấp.
    deliverables:
    - Bảng lựa chọn model với revision, giấy phép, quyền dữ liệu và ước lượng chi phí có đơn vị
    - Đầu ra gốc và kết quả sau khi đổi một điều kiện
    - Giải thích một lỗi và giới hạn của phép đo
    checkpoint: Dữ liệu restricted không được gửi tới route public dù route đó rẻ hơn.
    stretch: Mở notebook liên kết, chạy trong Colab và ghi cấu hình thực tế.
  en:
    task: Run selection for public and restricted data; disable license_checked and verify rejection even at a low
      price.
    deliverables:
    - A model decision table with revision, license, data authorization and unit-labeled cost estimates
    - Original output and output after changing one condition
    - An explanation of one failure and the measurement limits
    checkpoint: Restricted data cannot use a public route even when that route is cheaper.
    stretch: Open the linked notebook, run in Colab and record the actual configuration.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Bảo mật, chi phí và lựa chọn mô hình” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain security, cost optimization, and model selection to a new teammate?
  - Which assumption behind security, cost optimization, and model selection could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- Estimated cost = (input_tokens * input_rate + output_tokens * output_rate) / 1000000
code_examples:
- language: python
  title: Enforce data policy before selecting a budgeted model
  code: "import json\ncards = [\n    dict(id=\"fixture/public\", revision=\"v1\", license_checked=True,\n      \
    \   classifications={\"public\"}, input_rate=1, output_rate=2),\n    dict(id=\"fixture/restricted\", revision=\"\
    v1\", license_checked=True,\n         classifications={\"public\", \"restricted\"}, input_rate=2, output_rate=4),\n\
    ]\ndef estimated_cost(card, input_tokens, output_tokens):\n    if input_tokens < 0 or output_tokens < 0:\n \
    \       raise ValueError(\"negative token count\")\n    return (input_tokens * card[\"input_rate\"] + output_tokens\
    \ * card[\"output_rate\"]) / 1_000_000\ndef route(classification):\n    permitted = [c for c in cards if c[\"\
    license_checked\"] and c[\"revision\"]\n                 and classification in c[\"classifications\"]]\n   \
    \ if not permitted:\n        return None\n    chosen = min(permitted, key=lambda c: estimated_cost(c, 1000,\
    \ 500))\n    return {\"model\": chosen[\"id\"], \"assumed_cost\": estimated_cost(chosen, 1000, 500)}\nprint(json.dumps({\"\
    public\": route(\"public\"), \"restricted\": route(\"restricted\"),\n                  \"unknown\": route(\"\
    secret\")}))\n"
  status: runnable
  purpose_vi: Loại phương án trái quyền trước khi tối ưu chi phí và lựa chọn mô hình.
  purpose_en: Exclude unauthorized data routes before optimizing cost and model selection.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '{"public": {"model": "fixture/public", "assumed_cost": 0.002}, "restricted": {"model": "fixture/restricted",
    "assumed_cost": 0.004}, "unknown": null}'
  edge_case_vi: Dữ liệu restricted không được gửi tới route public dù route đó rẻ hơn.
  edge_case_en: Restricted data cannot use a public route even when that route is cheaper.
  explanation_vi: Mọi giá và model là dữ liệu minh họa; phép tính chi phí không xác nhận giá dịch vụ thực tế.
  explanation_en: All prices and models are illustrative fixtures; this arithmetic does not establish real service
    prices.
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
- title: SciPy Optimize Tutorial
  url: https://docs.scipy.org/doc/scipy/tutorial/optimize.html
  language: en
  purpose_vi: Liên hệ hàm mục tiêu, gradient và bộ tối ưu với bài toán tối ưu.
  read_vi: Đọc minimize và callback; ghi rõ hàm mục tiêu, điểm bắt đầu và điều kiện dừng.
  purpose_en: Connect objectives, gradients, and optimizers to optimization problems.
  read_en: Read minimize and callbacks; record the objective, start point, and stopping rule.
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
- title: Google Colab — Lab C
  language: vi/en
  url: https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-c-security-regression.ipynb
  kind: external
  required: false
  purpose_vi: Chạy trong Colab để mở rộng ví dụ bằng dữ liệu và báo cáo của lab.
  purpose_en: Run in Colab to extend this example with the lab dataset and reports.
  read_vi: Chọn môi trường CPU do Google lưu trữ, chạy từng ô và đối chiếu báo cáo. Lab dùng công cụ giả lập chỉ
    đọc, không tải model; tải báo cáo để lưu kết quả.
  read_en: Run in Colab on a Google-hosted CPU runtime and inspect each report. This lab uses read-only fake tools
    and downloads no model; download the report to retain results.
exercise_ids:
- exercise-22-genai-system-design
review_item_ids:
- phase-22-genai-system-design-genai-system-design-3-recall
- phase-22-genai-system-design-genai-system-design-3-application
- phase-22-genai-system-design-genai-system-design-3-debug
- phase-22-genai-system-design-genai-system-design-3-interview
estimated_minutes: 60
completion_checklist:
- Chạy bộ chọn cho dữ liệu public và restricted; tắt license_checked và xác nhận model bị loại dù giá thấp.
- Dữ liệu restricted không được gửi tới route public dù route đó rẻ hơn.
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Bảng lựa chọn model với revision, giấy phép, quyền dữ liệu và ước lượng chi phí có đơn vị
- Dữ liệu restricted không được gửi tới route public dù route đó rẻ hơn.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
common_mistakes:
- Vẽ nhiều thành phần nhưng thiếu căn cứ về tải, chi phí và yêu cầu dữ liệu.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-22-genai-system-design-genai-system-design-4
review_question_vi: Nội dung cốt lõi của “Bảo mật, chi phí và lựa chọn mô hình” là gì?
review_question_en: Define security, cost optimization, and model selection in your own words. What are the input,
  transformation and output?
review_answer_vi: Lựa chọn mô hình cần xét chất lượng cùng yêu cầu dữ liệu, chi phí và độ trễ. Phương án rẻ hơn
  chỉ phù hợp khi vẫn đáp ứng tiêu chí tối thiểu đã thống nhất.
review_answer_en: A strong answer names the input, transformation, output and the context where security, cost optimization,
  and model selection is used. Relate it specifically to security, cost optimization, and model selection in lesson
  phase-22-genai-system-design-genai-system-design-3.
review_cards:
- id: phase-22-genai-system-design-genai-system-design-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Bảo mật, chi phí và lựa chọn mô hình” là gì?
  question_en: Define security, cost optimization, and model selection in your own words. What are the input, transformation
    and output?
  answer_vi: Lựa chọn mô hình cần xét chất lượng cùng yêu cầu dữ liệu, chi phí và độ trễ. Phương án rẻ hơn chỉ phù
    hợp khi vẫn đáp ứng tiêu chí tối thiểu đã thống nhất.
  answer_en: A strong answer names the input, transformation, output and the context where security, cost optimization,
    and model selection is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-22-genai-system-design-genai-system-design-3-application
  type: application
  question_vi: So sánh hai phương án theo chất lượng, chi phí, độ trễ và phạm vi dữ liệu.
  question_en: Write a small code example or design that applies security, cost optimization, and model selection
    to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “So sánh hai phương án theo chất lượng, chi phí, độ trễ và phạm vi dữ liệu”, cần lưu:
    sơ đồ hoặc tài liệu quyết định có ràng buộc và cách kiểm chứng. Lần theo luồng dữ liệu và xét một tình huống
    lỗi cho mỗi thành phần chính.'
  answer_en: The security, cost optimization, and model selection example should have an explicit input, expected
    output and a way to run or verify it (phase-22-genai-system-design-genai-system-design-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-22-genai-system-design-genai-system-design-3-debug
  type: debug
  question_vi: Khi làm bài “Bảo mật, chi phí và lựa chọn mô hình”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If security, cost optimization, and model selection produces a wrong result or a metric drops, what
    would you debug first?
  answer_vi: 'Trong bài “Bảo mật, chi phí và lựa chọn mô hình”, lỗi cần tránh là: vẽ nhiều thành phần nhưng thiếu
    căn cứ về tải, chi phí và yêu cầu dữ liệu. Lần theo luồng dữ liệu và xét một tình huống lỗi cho mỗi thành phần
    chính. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For security, cost optimization, and model selection, check inputs/shapes, preprocessing and the baseline
    first; then isolate the failure with a small test and error analysis (phase-22-genai-system-design-genai-system-design-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-22-genai-system-design-genai-system-design-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Bảo mật, chi phí và lựa chọn mô hình” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of security, cost optimization,
    and model selection?
  answer_vi: Bắt đầu từ nhiệm vụ “So sánh hai phương án theo chất lượng, chi phí, độ trễ và phạm vi dữ liệu”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about security, cost optimization, and model selection should cover assumptions, metrics/cost,
    limitations and how to reduce production risk (phase-22-genai-system-design-genai-system-design-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Bảo mật, chi phí và lựa chọn mô hình / Security, cost optimization, and model selection

Model routing chọn model theo nhu cầu, nhưng quyền dữ liệu phải là điều kiện bắt buộc trước khi so điểm hay giá. Cần xác định loại dữ liệu, vùng xử lý được phép, giấy phép, log/retention và hành động công cụ. Một model rẻ hoặc điểm cao không được tự mở rộng quyền gửi tài liệu.

Ví dụ có model card giả lập gồm revision và license đã kiểm tra theo cờ dữ liệu mô phỏng; không mô tả nhà cung cấp thật. Chi phí tính theo tổng token input/output và giá giả định mỗi triệu token, không dùng giá hiện hành. Ước lượng ngân sách phải dự trù retry và giới hạn lượt; khi thực thi ghi token thực dùng và đối chiếu sai lệch.

Tự kiểm tra: fallback có được gửi dữ liệu sang vùng khác khi model chính lỗi không? Không nếu chính sách không cho phép. Thiết kế fallback giữ cùng ranh giới quyền hoặc dừng với lỗi rõ ràng. Lab C minh họa prompt injection và gọi công cụ trái quyền trên dữ liệu tự tạo; đạt lab không đồng nghĩa hệ production được chứng nhận an toàn.

## English

Model routing selects a model for a task, but data authorization is a hard constraint before comparing quality or price. Define data classification, allowed processing regions, licensing, logging/retention and tool actions. A cheap or high-scoring model cannot expand document transmission permissions.

The example uses synthetic model cards with revision and fixture flags for license review; no real provider is represented. Cost uses input/output tokens and assumed prices per million tokens rather than current prices. Budget estimates must reserve room for retries and call limits; record actual usage during execution and compare deviations.

Self-check: may fallback send data to another region after the primary model fails? Not without policy permission. A fallback must preserve authorization boundaries or stop with an explicit error. Lab C demonstrates injection and unauthorized tool calls on synthetic data; passing it does not certify production safety.

## Thực hành / Practice

Chạy bộ chọn cho dữ liệu public và restricted; tắt license_checked và xác nhận model bị loại dù giá thấp.

Run selection for public and restricted data; disable license_checked and verify rejection even at a low price.
