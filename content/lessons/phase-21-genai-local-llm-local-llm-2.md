---
lesson_id: phase-21-genai-local-llm-local-llm-2
phase_id: phase-21-genai-local-llm
module_id: local-llm
title_vi: vLLM và thông lượng phục vụ
title_en: vLLM and serving throughput
summary_vi: Phân biệt TTFT, latency và thông lượng token; ghi cấu hình CPU/GPU và workload trước khi so.
summary_en: Distinguish TTFT, latency and token throughput; record CPU/GPU configuration and workload before comparison.
learning_objectives:
- Phân biệt TTFT, latency và thông lượng token; ghi cấu hình CPU/GPU và workload trước khi so.
- Tính ba metric từ log giả lập rồi đổi thời điểm token đầu mà giữ token cuối; giải thích TTFT đổi nhưng throughput
  không đổi.
- Thời gian kết thúc bằng bắt đầu phải bị từ chối; không ghi hardware benchmark cho số liệu tự tạo.
learning_objectives_en:
- Distinguish TTFT, latency and token throughput; record CPU/GPU configuration and workload before comparison.
- Compute the three metrics from synthetic logs, then change first-token time while holding final-token time fixed;
  explain why TTFT changes but throughput does not.
- Equal start/end timestamps must be rejected; synthetic data must not be labeled a hardware benchmark.
prerequisites:
- phase-21-genai-local-llm-local-llm-1
- phase-20-genai-finetuning-fine-tuning-1
key_terms:
- vllm
- serving
- throughput
- token
- embedding
- retrieval
- evaluation
- local-llm
concept_notes_vi: 'Serving nhận request và chạy suy luận; vLLM là một lựa chọn phục vụ model, không phải thước đo
  chất lượng. TTFT là thời gian từ nhận yêu cầu đến token đầu; latency toàn yêu cầu đến token cuối; thông lượng
  token đầu ra của hệ là tổng token hoàn tất chia thời gian quan sát chung. Không cộng thông lượng từng request
  đồng thời để suy ra thông lượng hệ.


  Muốn so cấu hình, giữ model ID/revision, tokenizer, lượng tử hóa, độ dài input/output, batch, concurrency và cách
  warmup; ghi CPU/GPU, RAM/VRAM, phiên bản phần mềm và lỗi OOM. Đếm token bằng tokenizer của model, không bằng số
  từ. Ví dụ chỉ tính số học từ log tự tạo, không gọi vLLM, không tải model và không đo máy của bạn.


  Tự kiểm tra: hệ có token/s cao hơn có chắc tương tác tốt hơn không? Không; TTFT hoặc p95 latency có thể tăng.
  Lab A trong Colab dành cho embedding nhỏ; không thay cho benchmark vLLM hay chứng minh mọi GPU/CPU hỗ trợ một
  model. Kiểm tra yêu cầu chính thức theo phiên bản trước một thí nghiệm serving riêng.'
concept_notes_en: 'Serving accepts requests and runs inference; vLLM is one serving option, not a quality metric.
  TTFT measures request receipt to the first token, end-to-end latency runs through the final token, and system
  output throughput divides total completed tokens by one shared observation interval. Do not add concurrent per-request
  rates to infer system throughput.


  Compare configurations using fixed model ID/revision, tokenizer, quantization, input/output lengths, batch, concurrency
  and warmup. Record CPU/GPU, RAM/VRAM, software versions and OOM failures. Count tokens with the model tokenizer
  rather than word counts. This example computes arithmetic from synthetic logs; it calls no vLLM, downloads no
  model and benchmarks no hardware.


  Self-check: does higher tokens/s guarantee better interaction? No; TTFT or p95 latency can worsen. Colab Lab A
  uses a small embedding model, not a vLLM benchmark or proof of arbitrary CPU/GPU support. Check version-specific
  official requirements before a separate serving experiment.'
why_it_matters_vi: Phân biệt TTFT, latency và thông lượng token; ghi cấu hình CPU/GPU và workload trước khi so.
why_it_matters_en: Distinguish TTFT, latency and token throughput; record CPU/GPU configuration and workload before
  comparison.
study_steps_vi:
- Đọc phần giải thích và dự đoán đầu ra của ví dụ trước khi chạy.
- Chạy mã Python trong một ô Google Colab; ví dụ chỉ dùng thư viện chuẩn, không cần cài thêm.
- Tính ba metric từ log giả lập rồi đổi thời điểm token đầu mà giữ token cuối; giải thích TTFT đổi nhưng throughput
  không đổi.
- Thời gian kết thúc bằng bắt đầu phải bị từ chối; không ghi hardware benchmark cho số liệu tự tạo.
- Lưu đầu ra, đối chiếu với kết quả mong đợi và ghi rõ giới hạn của dữ liệu mô phỏng.
study_steps_en:
- Read the explanation and predict the example output before running it.
- Run the Python code in a Google Colab cell; this example uses only the standard library.
- Compute the three metrics from synthetic logs, then change first-token time while holding final-token time fixed;
  explain why TTFT changes but throughput does not.
- Equal start/end timestamps must be rejected; synthetic data must not be labeled a hardware benchmark.
- Save the output, compare it with the expected result and state the limits of the synthetic data.
practice_plan:
  vi:
    task: Tính ba metric từ log giả lập rồi đổi thời điểm token đầu mà giữ token cuối; giải thích TTFT đổi nhưng
      throughput không đổi.
    deliverables:
    - Bảng TTFT, latency, output tokens/s cùng nhãn synthetic và mẫu cấu hình phần cứng
    - Đầu ra gốc và kết quả sau khi đổi một điều kiện
    - Giải thích một lỗi và giới hạn của phép đo
    checkpoint: Thời gian kết thúc bằng bắt đầu phải bị từ chối; không ghi hardware benchmark cho số liệu tự tạo.
    stretch: Mở notebook liên kết, chạy trong Colab và ghi cấu hình thực tế.
  en:
    task: Compute the three metrics from synthetic logs, then change first-token time while holding final-token
      time fixed; explain why TTFT changes but throughput does not.
    deliverables:
    - A TTFT, latency and output tokens/s table labeled synthetic with a hardware configuration template
    - Original output and output after changing one condition
    - An explanation of one failure and the measurement limits
    checkpoint: Equal start/end timestamps must be rejected; synthetic data must not be labeled a hardware benchmark.
    stretch: Open the linked notebook, run in Colab and record the actual configuration.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “vLLM và thông lượng phục vụ” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain vllm and serving throughput to a new teammate?
  - Which assumption behind vllm and serving throughput could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- TTFT = first_token_time - request_start
- Latency = last_token_time - request_start
- Output throughput = total completed output tokens / shared observation seconds
code_examples:
- language: python
  title: Compute serving metrics from explicitly synthetic timing records
  code: "import json\ndef metrics(rows):\n    if not rows or any(not (r[\"start\"] <= r[\"first\"] <= r[\"end\"\
    ]) or\n                       r[\"end\"] <= r[\"start\"] or r[\"tokens\"] < 1 for r in rows):\n        raise\
    \ ValueError(\"invalid timing record\")\n    window = max(r[\"end\"] for r in rows) - min(r[\"start\"] for r\
    \ in rows)\n    return {\"mean_ttft_s\": sum(r[\"first\"] - r[\"start\"] for r in rows) / len(rows),\n     \
    \       \"mean_latency_s\": sum(r[\"end\"] - r[\"start\"] for r in rows) / len(rows),\n            \"output_tokens_per_s\"\
    : sum(r[\"tokens\"] for r in rows) / window}\nsynthetic = [dict(start=0, first=0.25, end=2, tokens=20),\n  \
    \           dict(start=0, first=0.5, end=1, tokens=10)]\ntry:\n    metrics([dict(start=1, first=1, end=1, tokens=1)])\n\
    except ValueError as error:\n    invalid = str(error)\nprint(json.dumps({\"synthetic_metrics\": metrics(synthetic),\
    \ \"invalid\": invalid,\n                  \"hardware_benchmarked\": False}))\n"
  status: runnable
  purpose_vi: Phân biệt TTFT, latency và thông lượng token; ghi cấu hình CPU/GPU và workload trước khi so.
  purpose_en: Distinguish TTFT, latency and token throughput; record CPU/GPU configuration and workload before comparison.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '{"synthetic_metrics": {"mean_ttft_s": 0.375, "mean_latency_s": 1.5, "output_tokens_per_s": 15.0},
    "invalid": "invalid timing record", "hardware_benchmarked": false}'
  edge_case_vi: Thời gian kết thúc bằng bắt đầu phải bị từ chối; không ghi hardware benchmark cho số liệu tự tạo.
  edge_case_en: Equal start/end timestamps must be rejected; synthetic data must not be labeled a hardware benchmark.
  explanation_vi: Hai request chồng thời gian nên dùng cửa sổ chung 0–2 giây; 30/2 cho thông lượng 15 token/s giả
    lập.
  explanation_en: The two requests overlap, so the shared interval is 0–2 seconds; 30/2 gives a synthetic throughput
    of 15 tokens/s.
resources:
- language: en
  title: vLLM Documentation
  url: https://docs.vllm.ai/en/latest/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Ollama Documentation
  url: https://docs.ollama.com/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: llama.cpp
  url: https://github.com/ggml-org/llama.cpp
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
- exercise-21-local-llm
review_item_ids:
- phase-21-genai-local-llm-local-llm-2-recall
- phase-21-genai-local-llm-local-llm-2-application
- phase-21-genai-local-llm-local-llm-2-debug
- phase-21-genai-local-llm-local-llm-2-interview
estimated_minutes: 60
completion_checklist:
- Tính ba metric từ log giả lập rồi đổi thời điểm token đầu mà giữ token cuối; giải thích TTFT đổi nhưng throughput
  không đổi.
- Thời gian kết thúc bằng bắt đầu phải bị từ chối; không ghi hardware benchmark cho số liệu tự tạo.
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Bảng TTFT, latency, output tokens/s cùng nhãn synthetic và mẫu cấu hình phần cứng
- Thời gian kết thúc bằng bắt đầu phải bị từ chối; không ghi hardware benchmark cho số liệu tự tạo.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
common_mistakes:
- So sánh token mỗi giây giữa các lần chạy khác tải hoặc khác độ dài chuỗi.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-21-genai-local-llm-local-llm-3
- phase-21-genai-local-llm-local-llm-4
review_question_vi: Nội dung cốt lõi của “vLLM và thông lượng phục vụ” là gì?
review_question_en: Define vllm and serving throughput in your own words. What are the input, transformation and
  output?
review_answer_vi: Thông lượng đo lượng công việc hoàn tất theo thời gian. Khi đánh giá hệ phục vụ, cần ghi số yêu
  cầu đồng thời, độ dài chuỗi và độ trễ để biết thông lượng tăng có làm chờ lâu hơn.
review_answer_en: A strong answer names the input, transformation, output and the context where vllm and serving
  throughput is used. Relate it specifically to vllm and serving throughput in lesson phase-21-genai-local-llm-local-llm-2.
review_cards:
- id: phase-21-genai-local-llm-local-llm-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “vLLM và thông lượng phục vụ” là gì?
  question_en: Define vllm and serving throughput in your own words. What are the input, transformation and output?
  answer_vi: Thông lượng đo lượng công việc hoàn tất theo thời gian. Khi đánh giá hệ phục vụ, cần ghi số yêu cầu
    đồng thời, độ dài chuỗi và độ trễ để biết thông lượng tăng có làm chờ lâu hơn.
  answer_en: A strong answer names the input, transformation, output and the context where vllm and serving throughput
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-21-genai-local-llm-local-llm-2-application
  type: application
  question_vi: Đo thông lượng cùng độ trễ dưới các mức đồng thời khác nhau.
  question_en: Write a small code example or design that applies vllm and serving throughput to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Đo thông lượng cùng độ trễ dưới các mức đồng thời khác nhau”, cần lưu: cấu hình phần
    cứng, mô hình và bảng đo hiệu năng. Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất
    quán.'
  answer_en: The vllm and serving throughput example should have an explicit input, expected output and a way to
    run or verify it (phase-21-genai-local-llm-local-llm-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-21-genai-local-llm-local-llm-2-debug
  type: debug
  question_vi: Khi làm bài “vLLM và thông lượng phục vụ”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If vllm and serving throughput produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “vLLM và thông lượng phục vụ”, lỗi cần tránh là: so sánh token mỗi giây giữa các lần chạy
    khác tải hoặc khác độ dài chuỗi. Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất quán.
    Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For vllm and serving throughput, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-21-genai-local-llm-local-llm-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-21-genai-local-llm-local-llm-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “vLLM và thông lượng phục vụ” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of vllm and serving throughput?
  answer_vi: Bắt đầu từ nhiệm vụ “Đo thông lượng cùng độ trễ dưới các mức đồng thời khác nhau”. Trình bày kết quả
    đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about vllm and serving throughput should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-21-genai-local-llm-local-llm-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# vLLM và thông lượng phục vụ / vLLM and serving throughput

Serving nhận request và chạy suy luận; vLLM là một lựa chọn phục vụ model, không phải thước đo chất lượng. TTFT là thời gian từ nhận yêu cầu đến token đầu; latency toàn yêu cầu đến token cuối; thông lượng token đầu ra của hệ là tổng token hoàn tất chia thời gian quan sát chung. Không cộng thông lượng từng request đồng thời để suy ra thông lượng hệ.

Muốn so cấu hình, giữ model ID/revision, tokenizer, lượng tử hóa, độ dài input/output, batch, concurrency và cách warmup; ghi CPU/GPU, RAM/VRAM, phiên bản phần mềm và lỗi OOM. Đếm token bằng tokenizer của model, không bằng số từ. Ví dụ chỉ tính số học từ log tự tạo, không gọi vLLM, không tải model và không đo máy của bạn.

Tự kiểm tra: hệ có token/s cao hơn có chắc tương tác tốt hơn không? Không; TTFT hoặc p95 latency có thể tăng. Lab A trong Colab dành cho embedding nhỏ; không thay cho benchmark vLLM hay chứng minh mọi GPU/CPU hỗ trợ một model. Kiểm tra yêu cầu chính thức theo phiên bản trước một thí nghiệm serving riêng.

## English

Serving accepts requests and runs inference; vLLM is one serving option, not a quality metric. TTFT measures request receipt to the first token, end-to-end latency runs through the final token, and system output throughput divides total completed tokens by one shared observation interval. Do not add concurrent per-request rates to infer system throughput.

Compare configurations using fixed model ID/revision, tokenizer, quantization, input/output lengths, batch, concurrency and warmup. Record CPU/GPU, RAM/VRAM, software versions and OOM failures. Count tokens with the model tokenizer rather than word counts. This example computes arithmetic from synthetic logs; it calls no vLLM, downloads no model and benchmarks no hardware.

Self-check: does higher tokens/s guarantee better interaction? No; TTFT or p95 latency can worsen. Colab Lab A uses a small embedding model, not a vLLM benchmark or proof of arbitrary CPU/GPU support. Check version-specific official requirements before a separate serving experiment.

## Thực hành / Practice

Tính ba metric từ log giả lập rồi đổi thời điểm token đầu mà giữ token cuối; giải thích TTFT đổi nhưng throughput không đổi.

Compute the three metrics from synthetic logs, then change first-token time while holding final-token time fixed; explain why TTFT changes but throughput does not.
