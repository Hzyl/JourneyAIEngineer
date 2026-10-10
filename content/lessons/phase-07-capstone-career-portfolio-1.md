---
lesson_id: phase-07-capstone-career-portfolio-1
phase_id: phase-07-capstone-career
module_id: portfolio
title_vi: Viết README cho dự án
title_en: Project READMEs
summary_vi: README giúp người đọc hiểu vấn đề, cách chạy, kết quả và giới hạn.
summary_en: Learn Project READMEs through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Viết README có mục đích, lệnh chạy, kết quả đánh giá và giới hạn.
- Kiểm tra các tuyên bố, lệnh chạy và liên kết trước khi chia sẻ.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain project readmes with a concrete example.
- Write or adapt a small code example applying project readmes.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-07-capstone-career-ship-4
- phase-06-llm-rag-nlp-foundations-1
key_terms:
- project
- readme
- Python
- testing
- debugging
- maintainability
- portfolio
concept_notes_vi: README giúp người đọc hiểu vấn đề, cách chạy, kết quả và giới hạn. Dẫn tới báo cáo, kiểm thử hoặc
  demo để các tuyên bố có thể kiểm tra.
concept_notes_en: Project README is a concept in the portfolio module. Identify the inputs, outputs, assumptions,
  failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Trình bày năng lực bằng dự án có bằng chứng kỹ thuật và đóng góp rõ.
why_it_matters_en: Tell the technical story through a README, architecture diagram, video, and a curated GitHub
  profile.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Project READMEs” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Viết README có mục đích, lệnh chạy, kết quả đánh giá và giới hạn.
- Kiểm tra các tuyên bố, lệnh chạy và liên kết trước khi chia sẻ. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần
  đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Tell the technical story through a README, architecture diagram, video, and
  a curated GitHub profile.'
- Open GitHub Docs, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Standardize the README around problem→data→model→evaluation→deployment→limitations
  and link evidence.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Viết README có mục đích, lệnh chạy, kết quả đánh giá và giới hạn.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết README theo vấn đề, dữ liệu, mô
      hình, đánh giá, triển khai, giới hạn; kèm sơ đồ và liên kết kết quả.'
    deliverables:
    - Nội dung hồ sơ dự án có đường dẫn tới bằng chứng kỹ thuật
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Kiểm tra các tuyên bố, lệnh chạy và liên kết trước khi chia sẻ.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Standardize the README around problem→data→model→evaluation→deployment→limitations and link evidence.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: Each project has a distinct contribution, clear metrics, and a trade-off you can defend.
    stretch: Add a failure test for project readmes and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Viết README cho dự án” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain project readmes to a new teammate?
  - Which assumption behind project readmes could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Project READMEs: inspect one complete path'
  code: "# Topic: Project READMEs (phase-07-capstone-career-portfolio-1)\nfrom dataclasses import dataclass\n\n\
    @dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for project readmes.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
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
exercise_ids:
- exercise-7-portfolio
review_item_ids:
- phase-07-capstone-career-portfolio-1-recall
- phase-07-capstone-career-portfolio-1-application
- phase-07-capstone-career-portfolio-1-debug
- phase-07-capstone-career-portfolio-1-interview
estimated_minutes: 60
completion_checklist:
- Viết README có mục đích, lệnh chạy, kết quả đánh giá và giới hạn.
- Kiểm tra các tuyên bố, lệnh chạy và liên kết trước khi chia sẻ.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Viết README có mục đích, lệnh chạy, kết quả đánh giá và giới hạn.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Kiểm tra các tuyên bố, lệnh chạy và liên kết trước khi chia sẻ.
common_mistakes:
- Nêu đóng góp hoặc hiệu quả mà không có kết quả để đối chiếu.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-07-capstone-career-portfolio-2
- phase-07-capstone-career-portfolio-3
review_question_vi: Nội dung cốt lõi của “Viết README cho dự án” là gì?
review_question_en: Define project readmes in your own words. What are the input, transformation and output?
review_answer_vi: README giúp người đọc hiểu vấn đề, cách chạy, kết quả và giới hạn. Dẫn tới báo cáo, kiểm thử hoặc
  demo để các tuyên bố có thể kiểm tra.
review_answer_en: A strong answer names the input, transformation, output and the context where project readmes
  is used. Relate it specifically to project readmes in lesson phase-07-capstone-career-portfolio-1.
review_cards:
- id: phase-07-capstone-career-portfolio-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Viết README cho dự án” là gì?
  question_en: Define project readmes in your own words. What are the input, transformation and output?
  answer_vi: README giúp người đọc hiểu vấn đề, cách chạy, kết quả và giới hạn. Dẫn tới báo cáo, kiểm thử hoặc demo
    để các tuyên bố có thể kiểm tra.
  answer_en: A strong answer names the input, transformation, output and the context where project readmes is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-07-capstone-career-portfolio-1-application
  type: application
  question_vi: Viết README có mục đích, lệnh chạy, kết quả đánh giá và giới hạn.
  question_en: Write a small code example or design that applies project readmes to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Viết README có mục đích, lệnh chạy, kết quả đánh giá và giới hạn”, cần lưu: nội dung
    hồ sơ dự án có đường dẫn tới bằng chứng kỹ thuật. Kiểm tra các tuyên bố, lệnh chạy và liên kết trước khi chia
    sẻ.'
  answer_en: The project readmes example should have an explicit input, expected output and a way to run or verify
    it (phase-07-capstone-career-portfolio-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-07-capstone-career-portfolio-1-debug
  type: debug
  question_vi: Khi làm bài “Viết README cho dự án”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If project readmes produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Viết README cho dự án”, lỗi cần tránh là: nêu đóng góp hoặc hiệu quả mà không có kết quả
    để đối chiếu. Kiểm tra các tuyên bố, lệnh chạy và liên kết trước khi chia sẻ. Dùng ví dụ nhỏ để tìm bước đầu
    tiên có kết quả khác dự kiến.'
  answer_en: For project readmes, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-07-capstone-career-portfolio-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-07-capstone-career-portfolio-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Viết README cho dự án” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of project readmes?
  answer_vi: Bắt đầu từ nhiệm vụ “Viết README có mục đích, lệnh chạy, kết quả đánh giá và giới hạn”. Trình bày kết
    quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about project readmes should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-07-capstone-career-portfolio-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Viết README cho dự án / Project READMEs

README giúp người đọc hiểu vấn đề, cách chạy, kết quả và giới hạn. Dẫn tới báo cáo, kiểm thử hoặc demo để các tuyên bố có thể kiểm tra.

## Thực hành

Viết README có mục đích, lệnh chạy, kết quả đánh giá và giới hạn.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết README theo vấn đề, dữ liệu, mô hình, đánh giá, triển khai, giới hạn; kèm sơ đồ và liên kết kết quả.
