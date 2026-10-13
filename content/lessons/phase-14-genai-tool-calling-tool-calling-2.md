---
lesson_id: phase-14-genai-tool-calling-tool-calling-2
phase_id: phase-14-genai-tool-calling
module_id: tool-calling
title_vi: Kiểm tra công cụ và chính sách tham số
title_en: Tool validation and argument policies
summary_vi: Kiểm tra cấu trúc tham số và quyền ứng dụng độc lập trước khi đọc tài liệu.
summary_en: Validate argument structure and application authorization independently before reading a document.
learning_objectives:
- Kiểm tra cấu trúc tham số và quyền ứng dụng độc lập trước khi đọc tài liệu.
- Thêm một người dùng và một tài liệu; kiểm tra quyền từ session, trường lạ và một ID sai kiểu.
- Lời gọi đúng schema vào private vẫn phải denied; user_id do model đưa vào phải invalid_arguments.
learning_objectives_en:
- Validate argument structure and application authorization independently before reading a document.
- Add one user and one document; test session-based authorization, unknown fields and an incorrectly typed ID.
- A schema-valid private request must still be denied; model-supplied user_id must yield invalid_arguments.
prerequisites:
- phase-14-genai-tool-calling-tool-calling-1
- phase-13-genai-advanced-rag-advanced-rag-1
key_terms:
- tool
- validation
- argument
- policy
- token
- embedding
- retrieval
- evaluation
- tool-calling
concept_notes_vi: 'Schema mô tả tham số được phép: tên trường, kiểu dữ liệu và giới hạn giá trị. Một JSON hợp schema
  vẫn có thể yêu cầu tài liệu của người khác. Vì vậy ứng dụng phải xác thực người gọi, kiểm tra quyền trên đối tượng
  rồi mới thực thi công cụ; không lấy user_id từ lời model làm danh tính tin cậy.


  Ví dụ giả lập công cụ chỉ đọc, danh tính lấy từ session riêng. Trường lạ, ID không phải chuỗi và truy cập ngoài
  quyền bị chặn trước khi trả nội dung. Nội dung truy xuất có thể chứa lệnh giả như ''bỏ qua quyền''; đó vẫn là
  dữ liệu, không thay đổi chính sách thực thi.


  Tự kiểm tra: thêm allowed_users vào prompt có đủ bảo vệ tài liệu không? Không; kiểm tra phải ở ứng dụng/hệ thống
  đích. Lab C kiểm tra các lời gọi trái quyền bằng dữ liệu mô phỏng, không chứng nhận an toàn của một dịch vụ production.'
concept_notes_en: 'A schema describes permitted argument names, types and value constraints. A schema-valid JSON
  request may still target someone else''s document. The application must therefore authenticate the caller and
  authorize the object before tool execution; model-supplied user_id is not a trusted identity.


  This fixture implements a read-only tool whose identity comes from a separate session. Unknown fields, non-string
  IDs and unauthorized access are rejected before returning content. Retrieved text may contain instructions such
  as ''ignore permissions''; that remains data and cannot alter execution policy.


  Self-check: does putting allowed_users in a prompt secure a document? No; enforcement belongs in the application
  or target system. Lab C tests unauthorized fixture requests and does not certify a production service.'
why_it_matters_vi: Kiểm tra cấu trúc tham số và quyền ứng dụng độc lập trước khi đọc tài liệu.
why_it_matters_en: Validate argument structure and application authorization independently before reading a document.
study_steps_vi:
- Đọc phần giải thích và dự đoán đầu ra của ví dụ trước khi chạy.
- Chạy mã Python trong một ô Google Colab; ví dụ chỉ dùng thư viện chuẩn, không cần cài thêm.
- Thêm một người dùng và một tài liệu; kiểm tra quyền từ session, trường lạ và một ID sai kiểu.
- Lời gọi đúng schema vào private vẫn phải denied; user_id do model đưa vào phải invalid_arguments.
- Lưu đầu ra, đối chiếu với kết quả mong đợi và ghi rõ giới hạn của dữ liệu mô phỏng.
study_steps_en:
- Read the explanation and predict the example output before running it.
- Run the Python code in a Google Colab cell; this example uses only the standard library.
- Add one user and one document; test session-based authorization, unknown fields and an incorrectly typed ID.
- A schema-valid private request must still be denied; model-supplied user_id must yield invalid_arguments.
- Save the output, compare it with the expected result and state the limits of the synthetic data.
practice_plan:
  vi:
    task: Thêm một người dùng và một tài liệu; kiểm tra quyền từ session, trường lạ và một ID sai kiểu.
    deliverables:
    - Ma trận lời gọi hợp lệ/sai schema/trái quyền và kết quả không lộ nội dung
    - Đầu ra gốc và kết quả sau khi đổi một điều kiện
    - Giải thích một lỗi và giới hạn của phép đo
    checkpoint: Lời gọi đúng schema vào private vẫn phải denied; user_id do model đưa vào phải invalid_arguments.
    stretch: Mở notebook liên kết, chạy trong Colab và ghi cấu hình thực tế.
  en:
    task: Add one user and one document; test session-based authorization, unknown fields and an incorrectly typed
      ID.
    deliverables:
    - A matrix of valid, schema-invalid and unauthorized calls with non-leaking outcomes
    - Original output and output after changing one condition
    - An explanation of one failure and the measurement limits
    checkpoint: A schema-valid private request must still be denied; model-supplied user_id must yield invalid_arguments.
    stretch: Open the linked notebook, run in Colab and record the actual configuration.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Kiểm tra công cụ và chính sách tham số” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain tool validation and argument policies to a new teammate?
  - Which assumption behind tool validation and argument policies could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: Validate tool arguments and authorize the caller
  code: "import json\ndocuments = {\n    \"public\": {\"text\": \"Public guide\", \"allowed_users\": [\"an\", \"\
    binh\"]},\n    \"private\": {\"text\": \"Private fixture\", \"allowed_users\": [\"an\"]},\n}\ndef read_document(arguments,\
    \ session_user):\n    if set(arguments) != {\"document_id\"} or not isinstance(arguments[\"document_id\"], str):\n\
    \        return {\"status\": \"invalid_arguments\"}\n    document = documents.get(arguments[\"document_id\"\
    ])\n    if document is None or session_user not in document[\"allowed_users\"]:\n        return {\"status\"\
    : \"denied\"}\n    return {\"status\": \"ok\", \"text\": document[\"text\"]}\ncalls = [\n    ({\"document_id\"\
    : \"public\"}, \"binh\"),\n    ({\"document_id\": \"private\"}, \"binh\"),\n    ({\"document_id\": \"private\"\
    , \"user_id\": \"an\"}, \"binh\"),\n    ({\"document_id\": 42}, \"an\"),\n]\nprint(json.dumps([read_document(args,\
    \ user)[\"status\"] for args, user in calls]))\n"
  status: runnable
  purpose_vi: Kiểm tra cấu trúc tham số và quyền ứng dụng độc lập trước khi đọc tài liệu.
  purpose_en: Validate argument structure and application authorization independently before reading a document.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '["ok", "denied", "invalid_arguments", "invalid_arguments"]'
  edge_case_vi: Lời gọi đúng schema vào private vẫn phải denied; user_id do model đưa vào phải invalid_arguments.
  edge_case_en: A schema-valid private request must still be denied; model-supplied user_id must yield invalid_arguments.
  explanation_vi: Schema kiểm tra hình dạng; allowed_users kiểm tra quyền. Không có request mạng hoặc thay đổi tài
    liệu.
  explanation_en: The schema checks shape; allowed_users checks authorization. No network request or document mutation
    occurs.
resources:
- language: en
  title: OpenAI Function Calling Guide
  url: https://platform.openai.com/docs/guides/function-calling
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: JSON Schema
  url: https://json-schema.org/learn/getting-started-step-by-step
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Tenacity Documentation
  url: https://tenacity.readthedocs.io/en/latest/
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
- exercise-14-tool-calling
review_item_ids:
- phase-14-genai-tool-calling-tool-calling-2-recall
- phase-14-genai-tool-calling-tool-calling-2-application
- phase-14-genai-tool-calling-tool-calling-2-debug
- phase-14-genai-tool-calling-tool-calling-2-interview
estimated_minutes: 60
completion_checklist:
- Thêm một người dùng và một tài liệu; kiểm tra quyền từ session, trường lạ và một ID sai kiểu.
- Lời gọi đúng schema vào private vẫn phải denied; user_id do model đưa vào phải invalid_arguments.
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Ma trận lời gọi hợp lệ/sai schema/trái quyền và kết quả không lộ nội dung
- Lời gọi đúng schema vào private vẫn phải denied; user_id do model đưa vào phải invalid_arguments.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
common_mistakes:
- Coi đề xuất của mô hình là quyền tự động thực thi công cụ.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-14-genai-tool-calling-tool-calling-3
- phase-14-genai-tool-calling-tool-calling-4
review_question_vi: Nội dung cốt lõi của “Kiểm tra công cụ và chính sách tham số” là gì?
review_question_en: Define tool validation and argument policies in your own words. What are the input, transformation
  and output?
review_answer_vi: Tham số đúng kiểu vẫn có thể vượt phạm vi được phép, chẳng hạn đường dẫn ngoài thư mục cho phép.
  Cần kiểm tra cả cấu trúc lẫn ràng buộc nghiệp vụ trước thực thi.
review_answer_en: A strong answer names the input, transformation, output and the context where tool validation
  and argument policies is used. Relate it specifically to tool validation and argument policies in lesson phase-14-genai-tool-calling-tool-calling-2.
review_cards:
- id: phase-14-genai-tool-calling-tool-calling-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Kiểm tra công cụ và chính sách tham số” là gì?
  question_en: Define tool validation and argument policies in your own words. What are the input, transformation
    and output?
  answer_vi: Tham số đúng kiểu vẫn có thể vượt phạm vi được phép, chẳng hạn đường dẫn ngoài thư mục cho phép. Cần
    kiểm tra cả cấu trúc lẫn ràng buộc nghiệp vụ trước thực thi.
  answer_en: A strong answer names the input, transformation, output and the context where tool validation and argument
    policies is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-14-genai-tool-calling-tool-calling-2-application
  type: application
  question_vi: Thử tham số đúng kiểu nhưng ngoài phạm vi cho phép và xác nhận bị chặn.
  question_en: Write a small code example or design that applies tool validation and argument policies to an AI
    engineering problem.
  answer_vi: 'Với nhiệm vụ “Thử tham số đúng kiểu nhưng ngoài phạm vi cho phép và xác nhận bị chặn”, cần lưu: lời
    gọi công cụ mẫu và kết quả kiểm tra quyền, tham số hoặc lỗi. Xác nhận lời gọi sai bị chặn và việc thử lại không
    tạo tác dụng phụ lặp.'
  answer_en: The tool validation and argument policies example should have an explicit input, expected output and
    a way to run or verify it (phase-14-genai-tool-calling-tool-calling-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-14-genai-tool-calling-tool-calling-2-debug
  type: debug
  question_vi: Khi làm bài “Kiểm tra công cụ và chính sách tham số”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If tool validation and argument policies produces a wrong result or a metric drops, what would you
    debug first?
  answer_vi: 'Trong bài “Kiểm tra công cụ và chính sách tham số”, lỗi cần tránh là: coi đề xuất của mô hình là quyền
    tự động thực thi công cụ. Xác nhận lời gọi sai bị chặn và việc thử lại không tạo tác dụng phụ lặp. Dùng ví dụ
    nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For tool validation and argument policies, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-14-genai-tool-calling-tool-calling-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-14-genai-tool-calling-tool-calling-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Kiểm tra công cụ và chính sách tham số” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of tool validation and argument
    policies?
  answer_vi: Bắt đầu từ nhiệm vụ “Thử tham số đúng kiểu nhưng ngoài phạm vi cho phép và xác nhận bị chặn”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about tool validation and argument policies should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-14-genai-tool-calling-tool-calling-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Kiểm tra công cụ và chính sách tham số / Tool validation and argument policies

Schema mô tả tham số được phép: tên trường, kiểu dữ liệu và giới hạn giá trị. Một JSON hợp schema vẫn có thể yêu cầu tài liệu của người khác. Vì vậy ứng dụng phải xác thực người gọi, kiểm tra quyền trên đối tượng rồi mới thực thi công cụ; không lấy user_id từ lời model làm danh tính tin cậy.

Ví dụ giả lập công cụ chỉ đọc, danh tính lấy từ session riêng. Trường lạ, ID không phải chuỗi và truy cập ngoài quyền bị chặn trước khi trả nội dung. Nội dung truy xuất có thể chứa lệnh giả như 'bỏ qua quyền'; đó vẫn là dữ liệu, không thay đổi chính sách thực thi.

Tự kiểm tra: thêm allowed_users vào prompt có đủ bảo vệ tài liệu không? Không; kiểm tra phải ở ứng dụng/hệ thống đích. Lab C kiểm tra các lời gọi trái quyền bằng dữ liệu mô phỏng, không chứng nhận an toàn của một dịch vụ production.

## English

A schema describes permitted argument names, types and value constraints. A schema-valid JSON request may still target someone else's document. The application must therefore authenticate the caller and authorize the object before tool execution; model-supplied user_id is not a trusted identity.

This fixture implements a read-only tool whose identity comes from a separate session. Unknown fields, non-string IDs and unauthorized access are rejected before returning content. Retrieved text may contain instructions such as 'ignore permissions'; that remains data and cannot alter execution policy.

Self-check: does putting allowed_users in a prompt secure a document? No; enforcement belongs in the application or target system. Lab C tests unauthorized fixture requests and does not certify a production service.

## Thực hành / Practice

Thêm một người dùng và một tài liệu; kiểm tra quyền từ session, trường lạ và một ID sai kiểu.

Add one user and one document; test session-based authorization, unknown fields and an incorrectly typed ID.
