---
lesson_id: phase-07-capstone-career-portfolio-4
phase_id: phase-07-capstone-career
module_id: portfolio
title_vi: Sắp xếp hồ sơ GitHub
title_en: GitHub profiles
summary_vi: Hồ sơ giúp người xem tìm các dự án thể hiện năng lực.
summary_en: Learn GitHub profiles through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Chọn dự án tiêu biểu và kiểm tra README cùng đường dẫn demo.
- Kiểm tra các tuyên bố, lệnh chạy và liên kết trước khi chia sẻ.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain github profiles with a concrete example.
- Write or adapt a small code example applying github profiles.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-07-capstone-career-portfolio-3
- phase-06-llm-rag-nlp-foundations-1
key_terms:
- github
- profile
- Python
- testing
- debugging
- maintainability
- portfolio
concept_notes_vi: Hồ sơ giúp người xem tìm các dự án thể hiện năng lực. Mỗi dự án nổi bật cần đóng góp cụ thể, hướng
  dẫn chạy và bằng chứng đánh giá đọc được.
concept_notes_en: 'GitHub profile makes AI engineering work traceable: every change needs a diff, a reason, and
  a verification step. Practise in a small repository, introduce an intentional failure, read the terminal output,
  and fix it with a focused commit.'
why_it_matters_vi: Trình bày năng lực bằng dự án có bằng chứng kỹ thuật và đóng góp rõ.
why_it_matters_en: Tell the technical story through a README, architecture diagram, video, and a curated GitHub
  profile.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “GitHub profiles” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Chọn dự án tiêu biểu và kiểm tra README cùng đường dẫn demo.
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
    task: 'Chọn dự án tiêu biểu và kiểm tra README cùng đường dẫn demo.


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
    stretch: Add a failure test for github profiles and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Sắp xếp hồ sơ GitHub” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain github profiles to a new teammate?
  - Which assumption behind github profiles could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'GitHub profiles: inspect one complete path'
  code: "# Topic: GitHub profiles (phase-07-capstone-career-portfolio-4)\nfrom dataclasses import dataclass\n\n\
    @dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for github profiles.
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
- phase-07-capstone-career-portfolio-4-recall
- phase-07-capstone-career-portfolio-4-application
- phase-07-capstone-career-portfolio-4-debug
- phase-07-capstone-career-portfolio-4-interview
estimated_minutes: 60
completion_checklist:
- Chọn dự án tiêu biểu và kiểm tra README cùng đường dẫn demo.
- Kiểm tra các tuyên bố, lệnh chạy và liên kết trước khi chia sẻ.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Chọn dự án tiêu biểu và kiểm tra README cùng đường dẫn demo.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Kiểm tra các tuyên bố, lệnh chạy và liên kết trước khi chia sẻ.
common_mistakes:
- Nêu đóng góp hoặc hiệu quả mà không có kết quả để đối chiếu.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-07-capstone-career-career-1
- phase-07-capstone-career-career-2
review_question_vi: Nội dung cốt lõi của “Sắp xếp hồ sơ GitHub” là gì?
review_question_en: Define github profiles in your own words. What are the input, transformation and output?
review_answer_vi: Hồ sơ giúp người xem tìm các dự án thể hiện năng lực. Mỗi dự án nổi bật cần đóng góp cụ thể, hướng
  dẫn chạy và bằng chứng đánh giá đọc được.
review_answer_en: A strong answer names the input, transformation, output and the context where github profiles
  is used. Relate it specifically to github profiles in lesson phase-07-capstone-career-portfolio-4.
review_cards:
- id: phase-07-capstone-career-portfolio-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Sắp xếp hồ sơ GitHub” là gì?
  question_en: Define github profiles in your own words. What are the input, transformation and output?
  answer_vi: Hồ sơ giúp người xem tìm các dự án thể hiện năng lực. Mỗi dự án nổi bật cần đóng góp cụ thể, hướng
    dẫn chạy và bằng chứng đánh giá đọc được.
  answer_en: A strong answer names the input, transformation, output and the context where github profiles is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-07-capstone-career-portfolio-4-application
  type: application
  question_vi: Chọn dự án tiêu biểu và kiểm tra README cùng đường dẫn demo.
  question_en: Write a small code example or design that applies github profiles to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Chọn dự án tiêu biểu và kiểm tra README cùng đường dẫn demo”, cần lưu: nội dung hồ sơ
    dự án có đường dẫn tới bằng chứng kỹ thuật. Kiểm tra các tuyên bố, lệnh chạy và liên kết trước khi chia sẻ.'
  answer_en: The github profiles example should have an explicit input, expected output and a way to run or verify
    it (phase-07-capstone-career-portfolio-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-07-capstone-career-portfolio-4-debug
  type: debug
  question_vi: Khi làm bài “Sắp xếp hồ sơ GitHub”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If github profiles produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Sắp xếp hồ sơ GitHub”, lỗi cần tránh là: nêu đóng góp hoặc hiệu quả mà không có kết quả
    để đối chiếu. Kiểm tra các tuyên bố, lệnh chạy và liên kết trước khi chia sẻ. Dùng ví dụ nhỏ để tìm bước đầu
    tiên có kết quả khác dự kiến.'
  answer_en: For github profiles, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-07-capstone-career-portfolio-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-07-capstone-career-portfolio-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Sắp xếp hồ sơ GitHub” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of github profiles?
  answer_vi: Bắt đầu từ nhiệm vụ “Chọn dự án tiêu biểu và kiểm tra README cùng đường dẫn demo”. Trình bày kết quả
    đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about github profiles should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-07-capstone-career-portfolio-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Sắp xếp hồ sơ GitHub / GitHub profiles

Hồ sơ giúp người xem tìm các dự án thể hiện năng lực. Mỗi dự án nổi bật cần đóng góp cụ thể, hướng dẫn chạy và bằng chứng đánh giá đọc được.

## Thực hành

Chọn dự án tiêu biểu và kiểm tra README cùng đường dẫn demo.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết README theo vấn đề, dữ liệu, mô hình, đánh giá, triển khai, giới hạn; kèm sơ đồ và liên kết kết quả.
