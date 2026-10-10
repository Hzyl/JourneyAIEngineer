---
lesson_id: phase-03-classical-ml-preprocessing-1
phase_id: phase-03-classical-ml
module_id: preprocessing
title_vi: Xử lý dữ liệu thiếu
title_en: Missing data
summary_vi: Dữ liệu thiếu có thể phản ánh lỗi thu thập hoặc đặc điểm của quy trình thực tế.
summary_en: Learn Missing data through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- So sánh cách điền dữ liệu thiếu với phương án cơ sở và ghi giả định.
- Xác nhận tham số biến đổi chỉ được học từ tập huấn luyện.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain missing data with a concrete example.
- Write or adapt a small code example applying missing data.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-03-classical-ml-models-4
- phase-02-math-ml-linear-algebra-1
key_terms:
- missing
- data
- dataset
- feature
- baseline
- evaluation
- preprocessing
concept_notes_vi: Dữ liệu thiếu có thể phản ánh lỗi thu thập hoặc đặc điểm của quy trình thực tế. Trước khi điền
  giá trị, kiểm tra nơi xuất hiện và nguyên nhân; chỉ học thống kê điền từ tập huấn luyện.
concept_notes_en: Missing data is a concept in the preprocessing module. Identify the inputs, outputs, assumptions,
  failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Giữ cách xử lý dữ liệu nhất quán giữa huấn luyện và dự đoán để tránh rò rỉ hoặc sai lệch.
why_it_matters_en: Build consistent, leakage-safe preprocessing that turns messy data into reproducible features.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Missing data” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- So sánh cách điền dữ liệu thiếu với phương án cơ sở và ghi giả định.
- Xác nhận tham số biến đổi chỉ được học từ tập huấn luyện. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu
  chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Build consistent, leakage-safe preprocessing that turns messy data into reproducible
  features.'
- Open scikit-learn User Guide, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Put imputation, encoding, and scaling in a Pipeline, fit only on train, and test
  a missing-data case.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'So sánh cách điền dữ liệu thiếu với phương án cơ sở và ghi giả định.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Đặt bước điền giá trị thiếu, mã hóa
      và chuẩn hóa trong Pipeline; chỉ học tham số từ tập huấn luyện rồi thử dữ liệu thiếu.'
    deliverables:
    - Quy trình biến đổi và ví dụ dữ liệu chưa từng thấy
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Xác nhận tham số biến đổi chỉ được học từ tập huấn luyện.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Put imputation, encoding, and scaling in a Pipeline, fit only on train, and test a missing-data case.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can serialize the pipeline and reuse identical preprocessing during training and inference.
    stretch: Add a failure test for missing data and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Xử lý dữ liệu thiếu” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain missing data to a new teammate?
  - Which assumption behind missing data could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Missing data: inspect one complete path'
  code: "# Topic: Missing data (phase-03-classical-ml-preprocessing-1)\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\n\
    class Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for missing data.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: scikit-learn User Guide
  url: https://scikit-learn.org/stable/user_guide.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: scikit-learn Model Evaluation
  url: https://scikit-learn.org/stable/modules/model_evaluation.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: scikit-learn Pipelines
  url: https://scikit-learn.org/stable/modules/compose.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: scikit-learn Preprocessing
  url: https://scikit-learn.org/stable/modules/preprocessing.html
  language: en
  purpose_vi: Đưa bước điền giá trị thiếu, mã hóa và chuẩn hóa vào quy trình ngăn rò rỉ dữ liệu.
  read_vi: Đọc về bộ biến đổi, ColumnTransformer và sự khác nhau giữa fit với transform.
  purpose_en: Use leakage-safe imputation, encoding, and scaling in pipelines.
  read_en: Read transformers, ColumnTransformer, and the fit/transform boundary.
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
- exercise-3-preprocessing
review_item_ids:
- phase-03-classical-ml-preprocessing-1-recall
- phase-03-classical-ml-preprocessing-1-application
- phase-03-classical-ml-preprocessing-1-debug
- phase-03-classical-ml-preprocessing-1-interview
estimated_minutes: 60
completion_checklist:
- So sánh cách điền dữ liệu thiếu với phương án cơ sở và ghi giả định.
- Xác nhận tham số biến đổi chỉ được học từ tập huấn luyện.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: So sánh cách điền dữ liệu thiếu với phương án cơ sở và ghi giả định.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Xác nhận tham số biến đổi chỉ được học từ tập huấn luyện.
common_mistakes:
- Học thống kê tiền xử lý trên toàn bộ dữ liệu trước khi chia tập.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-03-classical-ml-preprocessing-2
- phase-03-classical-ml-preprocessing-3
review_question_vi: Nội dung cốt lõi của “Xử lý dữ liệu thiếu” là gì?
review_question_en: Define missing data in your own words. What are the input, transformation and output?
review_answer_vi: Dữ liệu thiếu có thể phản ánh lỗi thu thập hoặc đặc điểm của quy trình thực tế. Trước khi điền
  giá trị, kiểm tra nơi xuất hiện và nguyên nhân; chỉ học thống kê điền từ tập huấn luyện.
review_answer_en: A strong answer names the input, transformation, output and the context where missing data is
  used. Relate it specifically to missing data in lesson phase-03-classical-ml-preprocessing-1.
review_cards:
- id: phase-03-classical-ml-preprocessing-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Xử lý dữ liệu thiếu” là gì?
  question_en: Define missing data in your own words. What are the input, transformation and output?
  answer_vi: Dữ liệu thiếu có thể phản ánh lỗi thu thập hoặc đặc điểm của quy trình thực tế. Trước khi điền giá
    trị, kiểm tra nơi xuất hiện và nguyên nhân; chỉ học thống kê điền từ tập huấn luyện.
  answer_en: A strong answer names the input, transformation, output and the context where missing data is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-03-classical-ml-preprocessing-1-application
  type: application
  question_vi: So sánh cách điền dữ liệu thiếu với phương án cơ sở và ghi giả định.
  question_en: Write a small code example or design that applies missing data to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “So sánh cách điền dữ liệu thiếu với phương án cơ sở và ghi giả định”, cần lưu: quy trình
    biến đổi và ví dụ dữ liệu chưa từng thấy. Xác nhận tham số biến đổi chỉ được học từ tập huấn luyện.'
  answer_en: The missing data example should have an explicit input, expected output and a way to run or verify
    it (phase-03-classical-ml-preprocessing-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-03-classical-ml-preprocessing-1-debug
  type: debug
  question_vi: Khi làm bài “Xử lý dữ liệu thiếu”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If missing data produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Xử lý dữ liệu thiếu”, lỗi cần tránh là: học thống kê tiền xử lý trên toàn bộ dữ liệu trước
    khi chia tập. Xác nhận tham số biến đổi chỉ được học từ tập huấn luyện. Dùng ví dụ nhỏ để tìm bước đầu tiên
    có kết quả khác dự kiến.'
  answer_en: For missing data, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-03-classical-ml-preprocessing-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-03-classical-ml-preprocessing-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Xử lý dữ liệu thiếu” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of missing data?
  answer_vi: Bắt đầu từ nhiệm vụ “So sánh cách điền dữ liệu thiếu với phương án cơ sở và ghi giả định”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about missing data should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-03-classical-ml-preprocessing-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Xử lý dữ liệu thiếu / Missing data

Dữ liệu thiếu có thể phản ánh lỗi thu thập hoặc đặc điểm của quy trình thực tế. Trước khi điền giá trị, kiểm tra nơi xuất hiện và nguyên nhân; chỉ học thống kê điền từ tập huấn luyện.

## Thực hành

So sánh cách điền dữ liệu thiếu với phương án cơ sở và ghi giả định.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Đặt bước điền giá trị thiếu, mã hóa và chuẩn hóa trong Pipeline; chỉ học tham số từ tập huấn luyện rồi thử dữ liệu thiếu.
