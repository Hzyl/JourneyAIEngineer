---
lesson_id: phase-07-capstone-career-career-1
phase_id: phase-07-capstone-career
module_id: career
title_vi: Viết CV cho vị trí AI Engineer
title_en: AI Engineer CVs
summary_vi: CV nên mô tả đóng góp và kết quả kiểm chứng được, kèm bối cảnh đo.
summary_en: Learn AI Engineer CVs through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Viết mục dự án nêu trách nhiệm, quyết định kỹ thuật và kết quả có căn cứ.
- Giải thích lựa chọn và trả lời được câu hỏi tiếp theo mà không học thuộc.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain ai engineer cvs with a concrete example.
- Write or adapt a small code example applying ai engineer cvs.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-07-capstone-career-portfolio-4
- phase-06-llm-rag-nlp-foundations-1
key_terms:
- engineer
- Python
- testing
- debugging
- maintainability
- career
concept_notes_vi: CV nên mô tả đóng góp và kết quả kiểm chứng được, kèm bối cảnh đo. Không biến thước đo trên một
  bộ dữ liệu thành cam kết hiệu quả trong mọi môi trường.
concept_notes_en: CV AI Engineer is a concept in the career module. Identify the inputs, outputs, assumptions, failure
  modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Chuyển kinh nghiệm thực hành thành CV và câu chuyện phỏng vấn có căn cứ.
why_it_matters_en: Turn your skills into a focused CV, interview stories, and structured AI system design answers.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “AI Engineer CVs” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Viết mục dự án nêu trách nhiệm, quyết định kỹ thuật và kết quả có căn cứ.
- Giải thích lựa chọn và trả lời được câu hỏi tiếp theo mà không học thuộc. Ghi kết quả đối chiếu và điều bạn đã
  sửa nếu lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Turn your skills into a focused CV, interview stories, and structured AI system
  design answers.'
- Open GitHub Docs, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Practice a 90-second project pitch, write a STAR story for a bug, and design an inference
  system.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Viết mục dự án nêu trách nhiệm, quyết định kỹ thuật và kết quả có căn cứ.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Luyện giới thiệu dự án 90 giây, kể một
      lần sửa lỗi theo STAR và phác thảo hệ thống suy luận.'
    deliverables:
    - Phần trình bày có bối cảnh, quyết định và kết quả thực tế
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Giải thích lựa chọn và trả lời được câu hỏi tiếp theo mà không học thuộc.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Practice a 90-second project pitch, write a STAR story for a bug, and design an inference system.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain your decisions, measurements, failures, and lessons from every project.
    stretch: Add a failure test for ai engineer cvs and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Viết CV cho vị trí AI Engineer” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain ai engineer cvs to a new teammate?
  - Which assumption behind ai engineer cvs could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'AI Engineer CVs: inspect one complete path'
  code: "# Topic: AI Engineer CVs (phase-07-capstone-career-career-1)\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\n\
    class Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for ai engineer cvs.
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
- exercise-7-career
review_item_ids:
- phase-07-capstone-career-career-1-recall
- phase-07-capstone-career-career-1-application
- phase-07-capstone-career-career-1-debug
- phase-07-capstone-career-career-1-interview
estimated_minutes: 60
completion_checklist:
- Viết mục dự án nêu trách nhiệm, quyết định kỹ thuật và kết quả có căn cứ.
- Giải thích lựa chọn và trả lời được câu hỏi tiếp theo mà không học thuộc.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Viết mục dự án nêu trách nhiệm, quyết định kỹ thuật và kết quả có căn cứ.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Giải thích lựa chọn và trả lời được câu hỏi tiếp theo mà không học thuộc.
common_mistakes:
- Liệt kê công nghệ nhưng không giải thích vai trò và đóng góp của mình.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-07-capstone-career-career-2
- phase-07-capstone-career-career-3
review_question_vi: Nội dung cốt lõi của “Viết CV cho vị trí AI Engineer” là gì?
review_question_en: Define ai engineer cvs in your own words. What are the input, transformation and output?
review_answer_vi: CV nên mô tả đóng góp và kết quả kiểm chứng được, kèm bối cảnh đo. Không biến thước đo trên một
  bộ dữ liệu thành cam kết hiệu quả trong mọi môi trường.
review_answer_en: A strong answer names the input, transformation, output and the context where ai engineer cvs
  is used. Relate it specifically to ai engineer cvs in lesson phase-07-capstone-career-career-1.
review_cards:
- id: phase-07-capstone-career-career-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Viết CV cho vị trí AI Engineer” là gì?
  question_en: Define ai engineer cvs in your own words. What are the input, transformation and output?
  answer_vi: CV nên mô tả đóng góp và kết quả kiểm chứng được, kèm bối cảnh đo. Không biến thước đo trên một bộ
    dữ liệu thành cam kết hiệu quả trong mọi môi trường.
  answer_en: A strong answer names the input, transformation, output and the context where ai engineer cvs is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-07-capstone-career-career-1-application
  type: application
  question_vi: Viết mục dự án nêu trách nhiệm, quyết định kỹ thuật và kết quả có căn cứ.
  question_en: Write a small code example or design that applies ai engineer cvs to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Viết mục dự án nêu trách nhiệm, quyết định kỹ thuật và kết quả có căn cứ”, cần lưu:
    phần trình bày có bối cảnh, quyết định và kết quả thực tế. Giải thích lựa chọn và trả lời được câu hỏi tiếp
    theo mà không học thuộc.'
  answer_en: The ai engineer cvs example should have an explicit input, expected output and a way to run or verify
    it (phase-07-capstone-career-career-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-07-capstone-career-career-1-debug
  type: debug
  question_vi: Khi làm bài “Viết CV cho vị trí AI Engineer”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If ai engineer cvs produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Viết CV cho vị trí AI Engineer”, lỗi cần tránh là: liệt kê công nghệ nhưng không giải thích
    vai trò và đóng góp của mình. Giải thích lựa chọn và trả lời được câu hỏi tiếp theo mà không học thuộc. Dùng
    ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For ai engineer cvs, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-07-capstone-career-career-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-07-capstone-career-career-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Viết CV cho vị trí AI Engineer” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of ai engineer cvs?
  answer_vi: Bắt đầu từ nhiệm vụ “Viết mục dự án nêu trách nhiệm, quyết định kỹ thuật và kết quả có căn cứ”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about ai engineer cvs should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-07-capstone-career-career-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Viết CV cho vị trí AI Engineer / AI Engineer CVs

CV nên mô tả đóng góp và kết quả kiểm chứng được, kèm bối cảnh đo. Không biến thước đo trên một bộ dữ liệu thành cam kết hiệu quả trong mọi môi trường.

## Thực hành

Viết mục dự án nêu trách nhiệm, quyết định kỹ thuật và kết quả có căn cứ.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Luyện giới thiệu dự án 90 giây, kể một lần sửa lỗi theo STAR và phác thảo hệ thống suy luận.
