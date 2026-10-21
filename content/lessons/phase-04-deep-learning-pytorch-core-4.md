---
lesson_id: phase-04-deep-learning-pytorch-core-4
phase_id: phase-04-deep-learning
module_id: pytorch-core
title_vi: Autograd và đồ thị tính toán
title_en: Autograd and computational graphs
summary_vi: Tính gradient thật bằng autograd, đối chiếu đạo hàm tay, tái hiện cộng dồn gradient và phân biệt
  backward với optimizer.step.
summary_en: Compute real autograd gradients, compare hand derivatives, reproduce accumulation and distinguish
  backward from optimizer.step.
learning_objectives: &id001
- Bản gốc khớp gradient [−1,−2], bias −1; cộng dồn cho [−2,−4], −2.
- Với x=[2,1], tính đúng loss 0.04, gradient [−0.8,−0.4], bias −0.4, tham số [0.28,−0.06], bias 0.54; chấp
  nhận sai số số thực 1e−6.
- Giải thích riêng backward, step, zero_grad, detach và eval/no_grad; lưu cả ca gradient sai do cộng dồn.
learning_objectives_en: &id002
- The original matches gradient [−1,−2], bias −1, then accumulation [−2,−4], −2.
- For x=[2,1], obtain loss 0.04, gradient [−0.8,−0.4], bias −0.4, updated weights [0.28,−0.06], bias 0.54;
  allow 1e−6 floating-point error.
- Explain backward, step, zero_grad, detach and eval/no_grad separately, recording the accumulation failure.
prerequisites:
- phase-04-deep-learning-pytorch-core-3
- phase-03-classical-ml-ml-framing-1
key_terms:
- autograd
- computational
- graph
- PyTorch
- tensor
- loss
- training
- pytorch-core
concept_notes_vi: |-
  Autograd ghi lại các phép toán cần thiết để tính đạo hàm. Trong cách chạy eager thông thường của PyTorch, đồ thị được xây theo những phép toán thực sự diễn ra; gradient cho biết đầu ra nhạy thế nào với một thay đổi nhỏ ở đầu vào hoặc tham số.

  Ví dụ, y=x² tại x=3 có đạo hàm bằng 6. Gọi backward tính gradient, không làm x tự đổi thành giá trị khác. Gradient ở tensor lá có thể cộng dồn; chạy hai lượt tính y và backward mà không xóa gradient sẽ cho x.grad bằng 12.

  Tự kiểm tra: gọi detach rồi dùng kết quả đó có còn truyền gradient về x qua nhánh này không? Không; detach tách kết quả khỏi lịch sử đạo hàm. Chỉ dùng nó khi bạn chủ động muốn ngắt đường truyền gradient, chẳng hạn để lưu một giá trị phục vụ theo dõi.

  ## Theo dõi một bước học bằng số

  Xem `x=[1,2]` như hai đặc trưng của câu, `w=[0.2,-0.1]`, `b=0.5` và nhãn mục tiêu y=1. Lan truyền xuôi cho ŷ=x·w+b=0.5 và L=(ŷ−y)²=0.25. Theo quy tắc dây chuyền, ∂L/∂w=2(ŷ−y)x=[−1,−2] và ∂L/∂b=−1. Đây là hồi quy vô hướng để kiểm tra đạo hàm; bài huấn luyện kế tiếp mới dùng CrossEntropyLoss cho phân loại văn bản.

  `backward()` ghi các giá trị trên vào `.grad`, chưa thay đổi w hay b. Lần thứ hai trong ví dụ tính lại `loss()` để tạo đồ thị mới nhưng không xóa buffer gradient, nên `.grad` thành [−2,−4] và −2. Đây là một ca lỗi có chủ đích. Gọi lại backward trên cùng đồ thị đã giải phóng là lỗi khác; không chữa việc quên zero_grad bằng retain_graph=True.

  Sau `zero_grad(set_to_none=True)`, tính lại loss và backward một lần, SGD với η=0.1 cập nhật w thành [0.3,0.1], b thành 0.6. Dự đoán mới là 1.1 và loss 0.01. Dấu âm của gradient giải thích vì sao tham số tăng trong ví dụ này; không phải optimizer luôn tăng tham số.

  ## Nối với embedding và giới hạn

  Trong bộ phân loại, token ID nguyên không có gradient; gradient đi từ loss qua Linear và pooling về các dòng embedding được sử dụng. `padding_idx=0` loại gradient vào dòng PAD; mask pooling còn cần thiết để không chia cho số vị trí đệm. Không gọi `.item()` hoặc detach giữa embedding và loss nếu vẫn muốn học các tham số đó. Chỉ detach khi ghi log hoặc chủ động đóng băng một nhánh.

  `model.eval()` điều khiển hành vi như dropout, không tự tắt autograd. `torch.no_grad()` tắt việc ghi đồ thị trong khối lệnh; thường dùng cùng eval khi đánh giá. Hai việc này có mục đích khác nhau.

  Gợi ý nghiên cứu: T13, bằng chứng M + H (metadata và 6 ảnh, trong đó hai ảnh Tensor trùng nội dung). Chưa có transcript hoặc xác nhận xem toàn bộ video. Bài này dùng nguồn PyTorch chính thức và ví dụ tự kiểm thử; không tái sử dụng ảnh TikTok hay suy ra hiệu quả nghề nghiệp từ nội dung quảng bá.
concept_notes_en: |-
  Autograd records operations needed for differentiation. In ordinary PyTorch eager execution, the graph follows operations that actually run; a gradient describes how sensitive an output is to a small input or parameter change.

  For example, y=x² has derivative 6 at x=3. Calling backward computes gradients; it does not automatically change x. Leaf gradients can accumulate: computing y and calling backward twice without clearing gradients gives x.grad equal to 12.

  Self-check: if you call detach and use its result, does that branch still carry gradients back to x? No; detach removes the result from its differentiation history. Use it when you deliberately want to cut the gradient path, such as when saving a value for monitoring.

  ## Follow one learning step numerically

  Treat `x=[1,2]` as two sentence features, with `w=[0.2,-0.1]`, `b=0.5` and target y=1. The forward pass gives ŷ=x·w+b=0.5 and L=(ŷ−y)²=0.25. The chain rule gives ∂L/∂w=2(ŷ−y)x=[−1,−2] and ∂L/∂b=−1. This scalar regression is for checking derivatives; the next training lesson uses CrossEntropyLoss for text classification.

  `backward()` writes those values to `.grad` without changing w or b. The second call computes a fresh `loss()` graph but does not clear gradient buffers, so they become [−2,−4] and −2. This is an intentional failure. Reusing an already freed graph is a different error; retain_graph=True does not repair forgotten zero_grad.

  After `zero_grad(set_to_none=True)`, recomputing loss and backpropagating once, SGD with η=0.1 produces w=[0.3,0.1] and b=0.6. The new prediction is 1.1 and loss is 0.01. The negative gradient explains why parameters increase here; optimizers do not always increase weights.

  ## Connecting to embeddings and limits

  Integer token IDs do not receive gradients. In a classifier, the gradient travels from loss through Linear and pooling into used embedding rows. `padding_idx=0` prevents gradients into the PAD row; masked pooling is still needed to avoid dividing by padding positions. Do not insert `.item()` or detach between embeddings and loss if those parameters should learn. Detach for logging or a deliberately frozen branch.

  `model.eval()` controls behavior such as dropout and does not disable autograd. `torch.no_grad()` disables graph recording inside its block; evaluation commonly uses both for their separate purposes.

  Research prompt: T13, evidence M + H (metadata and six images, including two duplicate Tensor images). No full transcript or full-video verification. This lesson uses official PyTorch references and independently tested examples; it does not reuse TikTok images or infer career outcomes from promotional claims.
why_it_matters_vi: Hiểu kích thước tensor, cách lấy dữ liệu và gradient để tự viết vòng lặp huấn luyện.
why_it_matters_en: Read tensor shapes, datasets, and autograd well enough to write a small PyTorch training
  loop.
study_steps_vi:
- Đọc phần giải thích và dự đoán đầu ra trước khi chạy.
- Mở Colab Python CPU, kiểm tra phiên bản torch và dán toàn bộ ví dụ vào một cell.
- Chạy bản gốc, đối chiếu output; sau đó làm bài biến đổi và lưu ca lỗi.
- Đọc nguồn chính thức theo hướng dẫn, tự trả lời thẻ ôn tập và lưu báo cáo ngắn.
study_steps_en:
- Read the explanation and predict outputs before running.
- Open a Colab Python CPU notebook, inspect the torch version and paste the complete example into one cell.
- Run the original and compare outputs, then perform the mutation exercise and save failures.
- Read the named official sections, answer review cards and save a short report.
practice_plan:
  vi:
    task: Tự tính gradient trước khi chạy. Đổi x thành [2,1], giữ w,b,y ban đầu và η=0.1; tính dự đoán, loss,
      gradient và tham số sau đúng một bước. Sau đó cố ý bỏ zero_grad và giải thích khác biệt bằng số.
    deliverables: *id001
    checkpoint: Bản gốc khớp gradient [−1,−2], bias −1; cộng dồn cho [−2,−4], −2. Với x=[2,1], tính đúng loss
      0.04, gradient [−0.8,−0.4], bias −0.4, tham số [0.28,−0.06], bias 0.54; chấp nhận sai số số thực 1e−6.
      Giải thích riêng backward, step, zero_grad, detach và eval/no_grad; lưu cả ca gradient sai do cộng dồn.
    stretch: Dùng torch.autograd.gradcheck với float64 cho hàm nhỏ; đối chiếu thêm sai phân hữu hạn, không
      dùng số nguyên cho tham số cần học.
  en:
    task: Calculate gradients before running. Change x to [2,1], keeping initial w,b,y and η=0.1; compute prediction,
      loss, gradients and parameters after one step. Then deliberately omit zero_grad and explain the numerical
      difference.
    deliverables: *id002
    checkpoint: The original matches gradient [−1,−2], bias −1, then accumulation [−2,−4], −2. For x=[2,1],
      obtain loss 0.04, gradient [−0.8,−0.4], bias −0.4, updated weights [0.28,−0.06], bias 0.54; allow 1e−6
      floating-point error. Explain backward, step, zero_grad, detach and eval/no_grad separately, recording
      the accumulation failure.
    stretch: Use torch.autograd.gradcheck with float64 for the small function and compare finite differences;
      never use integer trainable parameters.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Autograd và đồ thị tính toán” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain autograd and computational graphs to a new teammate?
  - Which assumption behind autograd and computational graphs could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- z = Wx + b
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: autograd_bridge.py
  code: |
    """Compare a scalar loss gradient to hand calculation, then update once."""
    import torch


    def demo():
        torch.set_num_threads(1)
        x = torch.tensor([1.0, 2.0])
        w = torch.tensor([0.2, -0.1], requires_grad=True)
        b = torch.tensor(0.5, requires_grad=True)
        optimizer = torch.optim.SGD([w, b], lr=0.1)

        def loss():
            prediction = x @ w + b
            return (prediction - 1.0).square()

        before = float(loss().detach())
        loss().backward()
        print("gradient", w.grad.tolist(), float(b.grad))
        # A fresh graph, but the same .grad buffers: accumulation is deliberate here.
        loss().backward()
        print("accumulated", w.grad.tolist(), float(b.grad))
        optimizer.zero_grad(set_to_none=True)
        loss().backward()
        optimizer.step()
        print("weights", [round(float(v), 3) for v in w.detach()], round(float(b.detach()), 3))
        print("loss", round(before, 3), "->", round(float(loss().detach()), 3))
        detached = (x @ w + b).detach()
        print("detached_requires_grad", detached.requires_grad)
        return w, b


    if __name__ == "__main__":
        demo()
  status: runnable
  purpose_vi: Tính gradient thật bằng autograd, đối chiếu đạo hàm tay, tái hiện cộng dồn gradient và phân biệt
    backward với optimizer.step.
  purpose_en: Compute real autograd gradients, compare hand derivatives, reproduce accumulation and distinguish
    backward from optimizer.step.
  setup: 'Google Colab: tạo notebook Python mới, chọn CPU, dán toàn bộ ví dụ vào một cell rồi chạy; không cần
    clone repo, GPU, API key hay tải model. / Create a Python notebook in Google Colab, use a CPU runtime and
    paste the complete example into one cell. No clone, GPU, API key or model download is needed. Requires
    Python 3.11+ and PyTorch 2.x; the verification environment used torch 2.14.1+cpu. Run `import torch; print(torch.__version__)`
    first; if unavailable, choose a runtime with PyTorch instead of installing packages on a weak local machine.
    The learning website displays code; execution happens in Colab or your own Python environment.'
  expected_output: |-
    gradient [-1.0, -2.0] -1.0
    accumulated [-2.0, -4.0] -2.0
    weights [0.3, 0.1] 0.6
    loss 0.25 -> 0.01
    detached_requires_grad False
  edge_case_vi: Kiểm tra có detach/item giữa tham số và loss, gradient chưa xóa, hay đang backward lại cùng
    đồ thị đã giải phóng; ba lỗi cần cách sửa khác nhau.
  edge_case_en: Check for detach/item between parameters and loss, uncleared gradients, or backward on a freed
    graph; these three failures need different fixes.
  explanation_vi: Với x=[2,1], ŷ=0.8, sai số −0.2, nên gradient bằng −0.4x. Tham số mới cho ŷ=1.04 và loss=0.0016.
    Nếu dùng hai gradient cộng dồn, bước cập nhật lớn gấp đôi; loss giảm trong một ca không chứng minh cách
    đó đúng.
  explanation_en: For x=[2,1], ŷ=0.8 and error −0.2, so the gradient is −0.4x. Updated parameters give ŷ=1.04
    and loss=0.0016. Two accumulated gradients double the step; a lower loss in one case does not validate
    the mistake.
  setup_vi: 'Google Colab: tạo notebook Python mới, chọn hosted runtime CPU, dán toàn bộ ví dụ vào một ô và
    chạy. Không cần clone repo, GPU, API key hay tải model. Dùng Python 3.11+ và PyTorch 2.x; môi trường kiểm
    chứng dùng torch 2.14.1+cpu. Kiểm tra import torch; print(torch.__version__) trước. Nếu thiếu PyTorch,
    chọn runtime có sẵn thư viện thay vì cài lên máy cá nhân yếu. Web Journey chỉ hiển thị mã.'
  setup_en: Create a Python notebook in Google Colab, select a hosted CPU runtime, paste the complete example
    into one cell and run. No repository clone, GPU, API key or model download is needed. Use Python 3.11+
    and PyTorch 2.x; verification used torch 2.14.1+cpu. Check import torch; print(torch.__version__) first.
    If unavailable, choose a runtime with PyTorch instead of installing on a weak local PC. Journey displays
    code only.
resources:
- language: en
  title: PyTorch Tutorials
  url: https://pytorch.org/tutorials/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: PyTorch Data Loading
  url: https://pytorch.org/tutorials/beginner/basics/data_tutorial.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: PyTorch Optimization
  url: https://pytorch.org/docs/stable/optim.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: PyTorch Autograd
  url: https://pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html
  language: en
  purpose_vi: Đối chiếu gradient tính tay với kết quả từ đồ thị tính toán.
  read_vi: Đọc về requires_grad, backward và cơ chế cộng dồn gradient.
  purpose_en: Compare hand-computed gradients with the computational graph.
  read_en: Read requires_grad, backward, and gradient accumulation.
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
- title: PyTorch automatic differentiation
  url: https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html
  language: en
  kind: official
  required: true
  purpose_vi: Tính gradient thật bằng autograd, đối chiếu đạo hàm tay, tái hiện cộng dồn gradient và phân biệt
    backward với optimizer.step.
  purpose_en: Compute real autograd gradients, compare hand derivatives, reproduce accumulation and distinguish
    backward from optimizer.step.
  read_vi: Đọc Computing Gradients, Disabling Gradient Tracking và Gradient Accumulation.
  read_en: Read Computing Gradients, Disabling Gradient Tracking and Gradient Accumulation.
- title: Google Colab — new Python notebook
  url: https://colab.research.google.com/
  language: en
  kind: official
  required: false
  purpose_vi: Chạy ví dụ trên runtime CPU của Colab để máy cá nhân không phải cài torch.
  purpose_en: Run examples on a Colab CPU runtime without installing torch locally.
  read_vi: Tạo notebook mới, chọn CPU, dán code và lưu output; runtime và quota phụ thuộc tài khoản.
  read_en: Create a notebook, select CPU, paste code and save output; runtime availability and quota depend
    on your account.
exercise_ids:
- exercise-4-pytorch-core
review_item_ids:
- phase-04-deep-learning-pytorch-core-4-recall
- phase-04-deep-learning-pytorch-core-4-application
- phase-04-deep-learning-pytorch-core-4-debug
- phase-04-deep-learning-pytorch-core-4-interview
estimated_minutes: 75
completion_checklist: *id001
completion_criteria: *id001
common_mistakes:
- Kiểm tra có detach/item giữa tham số và loss, gradient chưa xóa, hay đang backward lại cùng đồ thị đã giải
  phóng; ba lỗi cần cách sửa khác nhau.
- Bỏ qua ca lỗi hoặc coi kết quả dữ liệu tổng hợp là điểm chất lượng thực tế.
- Đọc hướng dẫn trên web rồi tưởng code đã chạy trong trình duyệt; cần chạy ở Colab/Python và lưu output.
next_lessons:
- phase-04-deep-learning-training-1
- phase-04-deep-learning-training-2
review_question_vi: Nội dung cốt lõi của “Autograd và đồ thị tính toán” là gì?
review_question_en: Define autograd and computational graphs in your own words. What are the input, transformation
  and output?
review_answer_vi: Autograd áp dụng quy tắc dây chuyền và cộng gradient vào buffer của tham số lá. Backward
  không cập nhật tham số; optimizer.step mới dùng gradient, và zero_grad quản lý ranh giới tích lũy.
review_answer_en: Autograd applies the chain rule and accumulates gradients in leaf parameter buffers. Backward
  does not update weights; optimizer.step uses gradients, while zero_grad defines accumulation boundaries.
review_cards:
- id: phase-04-deep-learning-pytorch-core-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Autograd và đồ thị tính toán” là gì?
  question_en: Define autograd and computational graphs in your own words. What are the input, transformation
    and output?
  answer_vi: Autograd áp dụng quy tắc dây chuyền và cộng gradient vào buffer của tham số lá. Backward không
    cập nhật tham số; optimizer.step mới dùng gradient, và zero_grad quản lý ranh giới tích lũy.
  answer_en: Autograd applies the chain rule and accumulates gradients in leaf parameter buffers. Backward
    does not update weights; optimizer.step uses gradients, while zero_grad defines accumulation boundaries.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-04-deep-learning-pytorch-core-4-application
  type: application
  question_vi: Tự tính gradient trước khi chạy. Đổi x thành [2,1], giữ w,b,y ban đầu và η=0.1; tính dự đoán,
    loss, gradient và tham số sau đúng một bước. Sau đó cố ý bỏ zero_grad và giải thích khác biệt bằng số.
  question_en: Calculate gradients before running. Change x to [2,1], keeping initial w,b,y and η=0.1; compute
    prediction, loss, gradients and parameters after one step. Then deliberately omit zero_grad and explain
    the numerical difference.
  answer_vi: Với x=[2,1], ŷ=0.8, sai số −0.2, nên gradient bằng −0.4x. Tham số mới cho ŷ=1.04 và loss=0.0016.
    Nếu dùng hai gradient cộng dồn, bước cập nhật lớn gấp đôi; loss giảm trong một ca không chứng minh cách
    đó đúng.
  answer_en: For x=[2,1], ŷ=0.8 and error −0.2, so the gradient is −0.4x. Updated parameters give ŷ=1.04 and
    loss=0.0016. Two accumulated gradients double the step; a lower loss in one case does not validate the
    mistake.
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-04-deep-learning-pytorch-core-4-debug
  type: debug
  question_vi: Khi làm bài “Autograd và đồ thị tính toán”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If autograd and computational graphs produces a wrong result or a metric drops, what would you
    debug first?
  answer_vi: Kiểm tra có detach/item giữa tham số và loss, gradient chưa xóa, hay đang backward lại cùng đồ
    thị đã giải phóng; ba lỗi cần cách sửa khác nhau.
  answer_en: Check for detach/item between parameters and loss, uncleared gradients, or backward on a freed
    graph; these three failures need different fixes.
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-04-deep-learning-pytorch-core-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Autograd và đồ thị tính toán” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of autograd and computational
    graphs?
  answer_vi: Autograd áp dụng quy tắc dây chuyền và cộng gradient vào buffer của tham số lá. Backward không
    cập nhật tham số; optimizer.step mới dùng gradient, và zero_grad quản lý ranh giới tích lũy. Với x=[2,1],
    ŷ=0.8, sai số −0.2, nên gradient bằng −0.4x. Tham số mới cho ŷ=1.04 và loss=0.0016. Nếu dùng hai gradient
    cộng dồn, bước cập nhật lớn gấp đôi; loss giảm trong một ca không chứng minh cách đó đúng.
  answer_en: Autograd applies the chain rule and accumulates gradients in leaf parameter buffers. Backward
    does not update weights; optimizer.step uses gradients, while zero_grad defines accumulation boundaries.
    For x=[2,1], ŷ=0.8 and error −0.2, so the gradient is −0.4x. Updated parameters give ŷ=1.04 and loss=0.0016.
    Two accumulated gradients double the step; a lower loss in one case does not validate the mistake.
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Autograd và đồ thị tính toán / Autograd and computational graphs

## Tiếng Việt

Autograd ghi lại các phép toán cần thiết để tính đạo hàm. Trong cách chạy eager thông thường của PyTorch, đồ thị được xây theo những phép toán thực sự diễn ra; gradient cho biết đầu ra nhạy thế nào với một thay đổi nhỏ ở đầu vào hoặc tham số.

Ví dụ, y=x² tại x=3 có đạo hàm bằng 6. Gọi backward tính gradient, không làm x tự đổi thành giá trị khác. Gradient ở tensor lá có thể cộng dồn; chạy hai lượt tính y và backward mà không xóa gradient sẽ cho x.grad bằng 12.

Tự kiểm tra: gọi detach rồi dùng kết quả đó có còn truyền gradient về x qua nhánh này không? Không; detach tách kết quả khỏi lịch sử đạo hàm. Chỉ dùng nó khi bạn chủ động muốn ngắt đường truyền gradient, chẳng hạn để lưu một giá trị phục vụ theo dõi.

## Theo dõi một bước học bằng số

Xem `x=[1,2]` như hai đặc trưng của câu, `w=[0.2,-0.1]`, `b=0.5` và nhãn mục tiêu y=1. Lan truyền xuôi cho ŷ=x·w+b=0.5 và L=(ŷ−y)²=0.25. Theo quy tắc dây chuyền, ∂L/∂w=2(ŷ−y)x=[−1,−2] và ∂L/∂b=−1. Đây là hồi quy vô hướng để kiểm tra đạo hàm; bài huấn luyện kế tiếp mới dùng CrossEntropyLoss cho phân loại văn bản.

`backward()` ghi các giá trị trên vào `.grad`, chưa thay đổi w hay b. Lần thứ hai trong ví dụ tính lại `loss()` để tạo đồ thị mới nhưng không xóa buffer gradient, nên `.grad` thành [−2,−4] và −2. Đây là một ca lỗi có chủ đích. Gọi lại backward trên cùng đồ thị đã giải phóng là lỗi khác; không chữa việc quên zero_grad bằng retain_graph=True.

Sau `zero_grad(set_to_none=True)`, tính lại loss và backward một lần, SGD với η=0.1 cập nhật w thành [0.3,0.1], b thành 0.6. Dự đoán mới là 1.1 và loss 0.01. Dấu âm của gradient giải thích vì sao tham số tăng trong ví dụ này; không phải optimizer luôn tăng tham số.

## Nối với embedding và giới hạn

Trong bộ phân loại, token ID nguyên không có gradient; gradient đi từ loss qua Linear và pooling về các dòng embedding được sử dụng. `padding_idx=0` loại gradient vào dòng PAD; mask pooling còn cần thiết để không chia cho số vị trí đệm. Không gọi `.item()` hoặc detach giữa embedding và loss nếu vẫn muốn học các tham số đó. Chỉ detach khi ghi log hoặc chủ động đóng băng một nhánh.

`model.eval()` điều khiển hành vi như dropout, không tự tắt autograd. `torch.no_grad()` tắt việc ghi đồ thị trong khối lệnh; thường dùng cùng eval khi đánh giá. Hai việc này có mục đích khác nhau.

Gợi ý nghiên cứu: T13, bằng chứng M + H (metadata và 6 ảnh, trong đó hai ảnh Tensor trùng nội dung). Chưa có transcript hoặc xác nhận xem toàn bộ video. Bài này dùng nguồn PyTorch chính thức và ví dụ tự kiểm thử; không tái sử dụng ảnh TikTok hay suy ra hiệu quả nghề nghiệp từ nội dung quảng bá.

### Thực hành và nghiệm thu

Tự tính gradient trước khi chạy. Đổi x thành [2,1], giữ w,b,y ban đầu và η=0.1; tính dự đoán, loss, gradient và tham số sau đúng một bước. Sau đó cố ý bỏ zero_grad và giải thích khác biệt bằng số.

- Bản gốc khớp gradient [−1,−2], bias −1; cộng dồn cho [−2,−4], −2.
- Với x=[2,1], tính đúng loss 0.04, gradient [−0.8,−0.4], bias −0.4, tham số [0.28,−0.06], bias 0.54; chấp nhận sai số số thực 1e−6.
- Giải thích riêng backward, step, zero_grad, detach và eval/no_grad; lưu cả ca gradient sai do cộng dồn.

### Gợi ý đối chiếu sau khi làm

Với x=[2,1], ŷ=0.8, sai số −0.2, nên gradient bằng −0.4x. Tham số mới cho ŷ=1.04 và loss=0.0016. Nếu dùng hai gradient cộng dồn, bước cập nhật lớn gấp đôi; loss giảm trong một ca không chứng minh cách đó đúng.

## English

Autograd records operations needed for differentiation. In ordinary PyTorch eager execution, the graph follows operations that actually run; a gradient describes how sensitive an output is to a small input or parameter change.

For example, y=x² has derivative 6 at x=3. Calling backward computes gradients; it does not automatically change x. Leaf gradients can accumulate: computing y and calling backward twice without clearing gradients gives x.grad equal to 12.

Self-check: if you call detach and use its result, does that branch still carry gradients back to x? No; detach removes the result from its differentiation history. Use it when you deliberately want to cut the gradient path, such as when saving a value for monitoring.

## Follow one learning step numerically

Treat `x=[1,2]` as two sentence features, with `w=[0.2,-0.1]`, `b=0.5` and target y=1. The forward pass gives ŷ=x·w+b=0.5 and L=(ŷ−y)²=0.25. The chain rule gives ∂L/∂w=2(ŷ−y)x=[−1,−2] and ∂L/∂b=−1. This scalar regression is for checking derivatives; the next training lesson uses CrossEntropyLoss for text classification.

`backward()` writes those values to `.grad` without changing w or b. The second call computes a fresh `loss()` graph but does not clear gradient buffers, so they become [−2,−4] and −2. This is an intentional failure. Reusing an already freed graph is a different error; retain_graph=True does not repair forgotten zero_grad.

After `zero_grad(set_to_none=True)`, recomputing loss and backpropagating once, SGD with η=0.1 produces w=[0.3,0.1] and b=0.6. The new prediction is 1.1 and loss is 0.01. The negative gradient explains why parameters increase here; optimizers do not always increase weights.

## Connecting to embeddings and limits

Integer token IDs do not receive gradients. In a classifier, the gradient travels from loss through Linear and pooling into used embedding rows. `padding_idx=0` prevents gradients into the PAD row; masked pooling is still needed to avoid dividing by padding positions. Do not insert `.item()` or detach between embeddings and loss if those parameters should learn. Detach for logging or a deliberately frozen branch.

`model.eval()` controls behavior such as dropout and does not disable autograd. `torch.no_grad()` disables graph recording inside its block; evaluation commonly uses both for their separate purposes.

Research prompt: T13, evidence M + H (metadata and six images, including two duplicate Tensor images). No full transcript or full-video verification. This lesson uses official PyTorch references and independently tested examples; it does not reuse TikTok images or infer career outcomes from promotional claims.

### Practice and acceptance

Calculate gradients before running. Change x to [2,1], keeping initial w,b,y and η=0.1; compute prediction, loss, gradients and parameters after one step. Then deliberately omit zero_grad and explain the numerical difference.

- The original matches gradient [−1,−2], bias −1, then accumulation [−2,−4], −2.
- For x=[2,1], obtain loss 0.04, gradient [−0.8,−0.4], bias −0.4, updated weights [0.28,−0.06], bias 0.54; allow 1e−6 floating-point error.
- Explain backward, step, zero_grad, detach and eval/no_grad separately, recording the accumulation failure.

### Check after attempting

For x=[2,1], ŷ=0.8 and error −0.2, so the gradient is −0.4x. Updated parameters give ŷ=1.04 and loss=0.0016. Two accumulated gradients double the step; a lower loss in one case does not validate the mistake.
