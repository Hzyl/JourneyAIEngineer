---
lesson_id: phase-15-genai-agents-ai-agents-4
phase_id: phase-15-genai-agents
module_id: ai-agents
title_vi: Người duyệt và giới hạn an toàn
title_en: Human in the loop and guardrails
summary_vi: Lưu điểm chờ duyệt vào đĩa, phục hồi ở tiến trình mới và kiểm tra lại quyền khi tiếp tục.
summary_en: Persist a review checkpoint to disk, recover it in a new process and recheck authorization on resume.
learning_objectives:
- Lưu điểm chờ duyệt vào đĩa, phục hồi ở tiến trình mới và kiểm tra lại quyền khi tiếp tục.
- Chạy ví dụ để thấy tiến trình mới phục hồi waiting_review; đổi approved hoặc can_read thành False và kiểm tra
  denied.
- Duyệt nhưng mất quyền đọc vẫn phải denied; không dùng RAM để tuyên bố phục hồi sau restart.
learning_objectives_en:
- Persist a review checkpoint to disk, recover it in a new process and recheck authorization on resume.
- Run the example to recover waiting_review in a new process; change approved or can_read to False and check for
  denied.
- Approval with revoked read access must still be denied; RAM state cannot establish restart recovery.
prerequisites:
- phase-15-genai-agents-ai-agents-3
- phase-14-genai-tool-calling-tool-calling-1
key_terms:
- human
- the
- loop
- guardrails
- token
- embedding
- retrieval
- evaluation
- ai-agents
concept_notes_vi: 'Người duyệt là điểm kiểm soát trước hành động có tác động, không phải cách cho model thêm quyền.
  Quyết định duyệt cần gắn với yêu cầu, đối tượng và thời hạn; khi tiếp tục vẫn phải kiểm tra lại quyền vì quyền
  có thể đã thay đổi trong lúc chờ.


  Checkpoint lưu trạng thái để tiếp tục một luồng; store dùng chung có thể lưu dữ liệu xuyên nhiều luồng. Một dict
  hay InMemorySaver trong RAM không tồn tại sau khi tiến trình dừng. Ví dụ dùng tệp JSON tạm và thực sự mở tiến
  trình Python mới để đọc lại điểm chờ. Đây là mô hình lưu đĩa tối thiểu; production cần kiểm soát truy cập, tính
  nguyên tử, version schema và chống thực thi lặp.


  Tự kiểm tra: đã lưu checkpoint có nghĩa hành động chỉ chạy một lần không? Không; retry sau lỗi có thể lặp tác
  động. Dùng idempotency key và trạng thái hoàn tất thích hợp ở hệ thống đích. Ví dụ chỉ đọc, mô phỏng người duyệt
  và không gửi dữ liệu ra ngoài.'
concept_notes_en: 'Human review is a control before consequential actions, not a way to grant the model extra authority.
  Approval must bind to a request, target and expiry; authorization still needs rechecking on resume because permissions
  may change while waiting.


  A checkpoint stores progress for one execution thread; a shared store may hold data across threads. A dictionary
  or InMemorySaver in RAM does not survive process termination. This example uses a temporary JSON file and actually
  starts a fresh Python process to read the pending checkpoint. It is a minimal disk-persistence model; production
  needs access controls, atomicity, schema versions and duplicate-execution protection.


  Self-check: does saving a checkpoint imply an action runs exactly once? No; retry after failure can duplicate
  effects. Use an idempotency key and completion state at the target system. This read-only fixture simulates approval
  and sends no external data.'
why_it_matters_vi: Lưu điểm chờ duyệt vào đĩa, phục hồi ở tiến trình mới và kiểm tra lại quyền khi tiếp tục.
why_it_matters_en: Persist a review checkpoint to disk, recover it in a new process and recheck authorization on
  resume.
study_steps_vi:
- Đọc phần giải thích và dự đoán đầu ra của ví dụ trước khi chạy.
- Chạy mã Python trong một ô Google Colab; ví dụ chỉ dùng thư viện chuẩn, không cần cài thêm.
- Chạy ví dụ để thấy tiến trình mới phục hồi waiting_review; đổi approved hoặc can_read thành False và kiểm tra
  denied.
- Duyệt nhưng mất quyền đọc vẫn phải denied; không dùng RAM để tuyên bố phục hồi sau restart.
- Lưu đầu ra, đối chiếu với kết quả mong đợi và ghi rõ giới hạn của dữ liệu mô phỏng.
study_steps_en:
- Read the explanation and predict the example output before running it.
- Run the Python code in a Google Colab cell; this example uses only the standard library.
- Run the example to recover waiting_review in a new process; change approved or can_read to False and check for
  denied.
- Approval with revoked read access must still be denied; RAM state cannot establish restart recovery.
- Save the output, compare it with the expected result and state the limits of the synthetic data.
practice_plan:
  vi:
    task: Chạy ví dụ để thấy tiến trình mới phục hồi waiting_review; đổi approved hoặc can_read thành False và kiểm
      tra denied.
    deliverables:
    - Checkpoint có thread_id, yêu cầu, trạng thái và kết quả phục hồi từ tiến trình mới
    - Đầu ra gốc và kết quả sau khi đổi một điều kiện
    - Giải thích một lỗi và giới hạn của phép đo
    checkpoint: Duyệt nhưng mất quyền đọc vẫn phải denied; không dùng RAM để tuyên bố phục hồi sau restart.
    stretch: Mở notebook liên kết, chạy trong Colab và ghi cấu hình thực tế.
  en:
    task: Run the example to recover waiting_review in a new process; change approved or can_read to False and check
      for denied.
    deliverables:
    - A checkpoint containing thread_id, request, state and recovery output from a new process
    - Original output and output after changing one condition
    - An explanation of one failure and the measurement limits
    checkpoint: Approval with revoked read access must still be denied; RAM state cannot establish restart recovery.
    stretch: Open the linked notebook, run in Colab and record the actual configuration.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Người duyệt và giới hạn an toàn” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain human in the loop and guardrails to a new teammate?
  - Which assumption behind human in the loop and guardrails could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: Persist a review checkpoint and resume in a new process
  code: "import json\nfrom pathlib import Path\nimport subprocess\nimport sys\nfrom tempfile import TemporaryDirectory\n\
    def resume(state, approved, can_read):\n    if state[\"status\"] != \"waiting_review\":\n        raise ValueError(\"\
    checkpoint is not waiting\")\n    return \"read_only_complete\" if approved and can_read else \"denied\"\nwith\
    \ TemporaryDirectory() as folder:\n    path = Path(folder) / \"checkpoint.json\"\n    path.write_text(json.dumps({\"\
    schema_version\": 1, \"thread_id\": \"case-1\",\n                               \"request\": \"read:guide\"\
    , \"status\": \"waiting_review\"}), encoding=\"utf-8\")\n    child = \"import json,sys; print(json.load(open(sys.argv[1],\
    \ encoding='utf-8'))['status'])\"\n    fresh = subprocess.check_output([sys.executable, \"-c\", child, str(path)],\
    \ text=True).strip()\n    restored = json.loads(path.read_text(encoding=\"utf-8\"))\n    print(json.dumps({\"\
    fresh_process_state\": fresh,\n                      \"approved\": resume(restored, True, True),\n         \
    \             \"permission_revoked\": resume(restored, True, False)}))\n"
  status: runnable
  purpose_vi: Lưu điểm chờ duyệt vào đĩa, phục hồi ở tiến trình mới và kiểm tra lại quyền khi tiếp tục.
  purpose_en: Persist a review checkpoint to disk, recover it in a new process and recheck authorization on resume.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '{"fresh_process_state": "waiting_review", "approved": "read_only_complete", "permission_revoked":
    "denied"}'
  edge_case_vi: Duyệt nhưng mất quyền đọc vẫn phải denied; không dùng RAM để tuyên bố phục hồi sau restart.
  edge_case_en: Approval with revoked read access must still be denied; RAM state cannot establish restart recovery.
  explanation_vi: TemporaryDirectory giữ file đủ lâu để tiến trình con đọc, rồi dọn file do ví dụ tạo; không thay
    đổi tài liệu thật.
  explanation_en: TemporaryDirectory retains the file for the child process and then cleans up only fixture files;
    no real document changes.
resources:
- language: en
  title: Building Effective Agents
  url: https://www.anthropic.com/research/building-effective-agents
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: LangGraph Documentation
  url: https://langchain-ai.github.io/langgraph/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: OpenAI Cookbook
  url: https://cookbook.openai.com/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Hugging Face Agents Course
  url: https://huggingface.co/learn/agents-course/unit0/introduction
  kind: official
  required: false
  purpose_vi: Lộ trình tác nhân gồm nền tảng, công cụ và vòng lặp hành động/quan sát; có Agentic RAG cùng phần đánh
    giá/quan sát tùy chọn.
  purpose_en: Agent learning path covering fundamentals, tools, and action/observation loops, with Agentic RAG and
    optional evaluation/observability.
  read_vi: Đọc Unit 1 để ôn nền tảng, Unit 3 về Agentic RAG; chỉ mở phần Observability/Evaluation khi cần.
  read_en: Use Unit 1 to review foundations and Unit 3 for Agentic RAG; consult Observability/Evaluation only when
    relevant.
- title: Giải thích và hướng dẫn thực hành trong bài
  url: ''
  language: vi
  kind: in_app
  purpose_vi: Đọc giải thích, thực hiện nhiệm vụ và đối chiếu tiêu chí hoàn thành.
  purpose_en: The explanation, code example, checklist, and completion criteria inside the app.
  read_vi: Đọc giải thích → xem ví dụ → thực hành → tự kiểm tra.
  read_en: Follow Study plan → Concept notes → Code example → Practice plan.
  required: true
- title: Google Colab — Lab B
  language: vi/en
  url: https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-b-workflow-agent.ipynb
  kind: external
  required: false
  purpose_vi: Chạy trong Colab để mở rộng ví dụ bằng dữ liệu và báo cáo của lab.
  purpose_en: Run in Colab to extend this example with the lab dataset and reports.
  read_vi: Chọn môi trường CPU do Google lưu trữ, chạy từng ô và đối chiếu báo cáo. Lab dùng công cụ giả lập chỉ
    đọc, không tải model; tải báo cáo để lưu kết quả.
  read_en: Run in Colab on a Google-hosted CPU runtime and inspect each report. This lab uses read-only fake tools
    and downloads no model; download the report to retain results.
- title: LangGraph — Persistence
  url: https://docs.langchain.com/oss/python/langgraph/persistence
  purpose_vi: Phân biệt checkpoint theo thread, store và backend lưu bền.
  purpose_en: Distinguish per-thread checkpoints, stores and durable backends.
  read_vi: Đọc Checkpoints, Threads và Checkpointer libraries; phân biệt InMemorySaver với backend lưu đĩa.
  read_en: Read Checkpoints, Threads and Checkpointer libraries; distinguish InMemorySaver from disk-backed persistence.
  language: en
  kind: official
  required: false
exercise_ids:
- exercise-15-ai-agents
review_item_ids:
- phase-15-genai-agents-ai-agents-4-recall
- phase-15-genai-agents-ai-agents-4-application
- phase-15-genai-agents-ai-agents-4-debug
- phase-15-genai-agents-ai-agents-4-interview
estimated_minutes: 60
completion_checklist:
- Chạy ví dụ để thấy tiến trình mới phục hồi waiting_review; đổi approved hoặc can_read thành False và kiểm tra
  denied.
- Duyệt nhưng mất quyền đọc vẫn phải denied; không dùng RAM để tuyên bố phục hồi sau restart.
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Checkpoint có thread_id, yêu cầu, trạng thái và kết quả phục hồi từ tiến trình mới
- Duyệt nhưng mất quyền đọc vẫn phải denied; không dùng RAM để tuyên bố phục hồi sau restart.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
common_mistakes:
- Cho agent tiếp tục vô hạn hoặc bỏ qua yêu cầu người duyệt.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-16-genai-mcp-mcp-1
- phase-16-genai-mcp-mcp-2
review_question_vi: Nội dung cốt lõi của “Người duyệt và giới hạn an toàn” là gì?
review_question_en: Define human in the loop and guardrails in your own words. What are the input, transformation
  and output?
review_answer_vi: Bước người duyệt cho phép kiểm tra thao tác có ảnh hưởng trước khi thực hiện. Yêu cầu duyệt cần
  nêu hành động, dữ liệu liên quan và tác dụng dự kiến để người dùng quyết định rõ ràng.
review_answer_en: A strong answer names the input, transformation, output and the context where human in the loop
  and guardrails is used. Relate it specifically to human in the loop and guardrails in lesson phase-15-genai-agents-ai-agents-4.
review_cards:
- id: phase-15-genai-agents-ai-agents-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Người duyệt và giới hạn an toàn” là gì?
  question_en: Define human in the loop and guardrails in your own words. What are the input, transformation and
    output?
  answer_vi: Bước người duyệt cho phép kiểm tra thao tác có ảnh hưởng trước khi thực hiện. Yêu cầu duyệt cần nêu
    hành động, dữ liệu liên quan và tác dụng dự kiến để người dùng quyết định rõ ràng.
  answer_en: A strong answer names the input, transformation, output and the context where human in the loop and
    guardrails is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-15-genai-agents-ai-agents-4-application
  type: application
  question_vi: Thiết kế yêu cầu duyệt cho một thao tác ghi và thử trường hợp bị từ chối.
  question_en: Write a small code example or design that applies human in the loop and guardrails to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Thiết kế yêu cầu duyệt cho một thao tác ghi và thử trường hợp bị từ chối”, cần lưu:
    kế hoạch hoặc chuỗi hành động có trạng thái và giới hạn. Thử tình huống không đạt mục tiêu và xác nhận điều
    kiện dừng.'
  answer_en: The human in the loop and guardrails example should have an explicit input, expected output and a way
    to run or verify it (phase-15-genai-agents-ai-agents-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-15-genai-agents-ai-agents-4-debug
  type: debug
  question_vi: Khi làm bài “Người duyệt và giới hạn an toàn”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If human in the loop and guardrails produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Người duyệt và giới hạn an toàn”, lỗi cần tránh là: cho agent tiếp tục vô hạn hoặc bỏ qua
    yêu cầu người duyệt. Thử tình huống không đạt mục tiêu và xác nhận điều kiện dừng. Dùng ví dụ nhỏ để tìm bước
    đầu tiên có kết quả khác dự kiến.'
  answer_en: For human in the loop and guardrails, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-15-genai-agents-ai-agents-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-15-genai-agents-ai-agents-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Người duyệt và giới hạn an toàn” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of human in the loop and guardrails?
  answer_vi: Bắt đầu từ nhiệm vụ “Thiết kế yêu cầu duyệt cho một thao tác ghi và thử trường hợp bị từ chối”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about human in the loop and guardrails should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-15-genai-agents-ai-agents-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Người duyệt và giới hạn an toàn / Human in the loop and guardrails

Người duyệt là điểm kiểm soát trước hành động có tác động, không phải cách cho model thêm quyền. Quyết định duyệt cần gắn với yêu cầu, đối tượng và thời hạn; khi tiếp tục vẫn phải kiểm tra lại quyền vì quyền có thể đã thay đổi trong lúc chờ.

Checkpoint lưu trạng thái để tiếp tục một luồng; store dùng chung có thể lưu dữ liệu xuyên nhiều luồng. Một dict hay InMemorySaver trong RAM không tồn tại sau khi tiến trình dừng. Ví dụ dùng tệp JSON tạm và thực sự mở tiến trình Python mới để đọc lại điểm chờ. Đây là mô hình lưu đĩa tối thiểu; production cần kiểm soát truy cập, tính nguyên tử, version schema và chống thực thi lặp.

Tự kiểm tra: đã lưu checkpoint có nghĩa hành động chỉ chạy một lần không? Không; retry sau lỗi có thể lặp tác động. Dùng idempotency key và trạng thái hoàn tất thích hợp ở hệ thống đích. Ví dụ chỉ đọc, mô phỏng người duyệt và không gửi dữ liệu ra ngoài.

## English

Human review is a control before consequential actions, not a way to grant the model extra authority. Approval must bind to a request, target and expiry; authorization still needs rechecking on resume because permissions may change while waiting.

A checkpoint stores progress for one execution thread; a shared store may hold data across threads. A dictionary or InMemorySaver in RAM does not survive process termination. This example uses a temporary JSON file and actually starts a fresh Python process to read the pending checkpoint. It is a minimal disk-persistence model; production needs access controls, atomicity, schema versions and duplicate-execution protection.

Self-check: does saving a checkpoint imply an action runs exactly once? No; retry after failure can duplicate effects. Use an idempotency key and completion state at the target system. This read-only fixture simulates approval and sends no external data.

## Thực hành / Practice

Chạy ví dụ để thấy tiến trình mới phục hồi waiting_review; đổi approved hoặc can_read thành False và kiểm tra denied.

Run the example to recover waiting_review in a new process; change approved or can_read to False and check for denied.
