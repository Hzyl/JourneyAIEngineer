---
lesson_id: phase-04-deep-learning-pytorch-core-1
phase_id: phase-04-deep-learning
module_id: pytorch-core
title_vi: Tensor và kích thước các chiều
title_en: Tensors and shapes
summary_vi: Theo dõi tensor từ một batch token đến vector câu; kiểm tra shape, dtype, device và padding bằng
  PyTorch thật.
summary_en: Trace a batch of token IDs into sentence vectors, checking shape, dtype, device and padding with
  real PyTorch.
learning_objectives: &id001
- Bản gốc in IDs (2,3), token vectors (2,3,4), sentence vectors (2,4) và lengths [2,1].
- Bản ba câu cho (3,3), (3,3,4), (3,4); giải thích riêng B/T/D và không trộn batch khi pooling.
- Lưu kết quả ba ca lỗi và giải thích vì sao reshape không sửa được ID sai hoặc câu rỗng.
learning_objectives_en: &id002
- The original prints IDs (2,3), tokens (2,3,4), sentences (2,4), and lengths [2,1].
- Three sentences give (3,3), (3,3,4), (3,4); explain B/T/D without pooling across the batch.
- Save the three rejected cases and explain why reshaping cannot repair invalid IDs or empty text.
prerequisites:
- phase-03-classical-ml-analysis-4
- phase-03-classical-ml-ml-framing-1
key_terms:
- tensor
- shape
- PyTorch
- loss
- training
- pytorch-core
concept_notes_vi: |-
  Tensor biểu diễn dữ liệu nhiều chiều. Hãy ghi ý nghĩa của từng chiều cùng kích thước, kiểu dữ liệu và thiết bị: một lô 8 ảnh RGB cao 32, rộng 32 thường có shape (8, 3, 32, 32) trong PyTorch.

  Số chiều khác số phần tử: tensor trên có 4 chiều nhưng chứa 24.576 giá trị. Một tensor có shape đúng vẫn có thể sai ý nghĩa nếu tráo kênh màu với chiều rộng; việc đổi cách nhìn bằng reshape không tự hoán vị các trục.

  Tự kiểm tra: có thể nhân ma trận (8, 3) với (4, 2) không? Không, vì hai chiều trong 3 và 4 không bằng nhau. Trước khi sửa kích thước cho phép toán chạy được, hãy xác định mỗi trục đang đại diện cho điều gì.

  ## Cầu nối từ tensor sang văn bản

  Với văn bản, B là số câu trong batch, T là độ dài sau padding và D là số chiều embedding. `ids` có shape `[B,T]` và kiểu `torch.long`: mỗi số chỉ là khóa tra từ vựng. `nn.Embedding(V,D)` chứa một bảng tham số `[V,D]`; tra bảng tạo tensor số thực `[B,T,D]`. Đừng đưa ID trực tiếp vào Linear rồi hiểu khoảng cách giữa các số ID là quan hệ ngữ nghĩa.

  Ví dụ có hai câu dài 2 và 1 token, được đệm thành 3 vị trí. `DataLoader` trả một batch ID `[2,3]` và nhãn `[2]`. `ids.ne(0)` tạo mask `[2,3]`; `unsqueeze(-1)` thành `[2,3,1]` để nhân với mọi tọa độ của token vector. Cộng theo chiều token rồi chia số token thật tạo `[2,4]`, không làm mất chiều batch. Kỹ thuật gom này sẽ được giải thích sâu hơn trong bài Embedding và phân loại văn bản.

  Mọi tensor ở đây nằm trên CPU. Nếu chuyển sang GPU, cả model, đầu vào và nhãn phải cùng thiết bị. Token ID/nhãn chỉ số lớp vẫn là số nguyên; embedding và logits là số thực. `reshape` đổi cách nhóm phần tử; `transpose` hoặc `permute` mới hoán vị trục. Một shape hợp lệ về số học chưa chứng minh trục mang ý nghĩa đúng.

  ## Lỗi có thể tái hiện

  `flatten()` phá hợp đồng `[B,T]` nên ví dụ chủ động báo lỗi, thay vì âm thầm coi hai câu là một. ID ngoài `[0,V)` không có dòng embedding; câu toàn PAD không có mẫu số hợp lệ. Kiểm tra sớm ba trường hợp đó giúp tìm lỗi ở dữ liệu thay vì đổi mô hình tùy tiện.

  Gợi ý nghiên cứu: T13, bằng chứng M + H (metadata và 6 ảnh, trong đó hai ảnh Tensor trùng nội dung). Chưa có transcript hoặc xác nhận xem toàn bộ video. Bài này dùng nguồn PyTorch chính thức và ví dụ tự kiểm thử; không tái sử dụng ảnh TikTok hay suy ra hiệu quả nghề nghiệp từ nội dung quảng bá.
concept_notes_en: |-
  A tensor represents multidimensional data. Record each axis meaning alongside shape, dtype and device: a batch of 8 RGB images, each 32 pixels high and wide, commonly has shape (8, 3, 32, 32) in PyTorch.

  The number of axes differs from the number of elements: this tensor has 4 axes but contains 24,576 values. A plausible shape can still have the wrong meaning if color channels and width are mixed up; reshaping does not automatically permute axes.

  Self-check: can matrices shaped (8, 3) and (4, 2) be multiplied? No, because the inner dimensions 3 and 4 differ. Before changing shapes merely to make an operation run, identify what every axis represents.

  ## From tensors to text

  For text, B is the number of sentences, T the padded sequence length and D the embedding dimension. `ids` has shape `[B,T]` and dtype `torch.long`: each number is a vocabulary lookup key. `nn.Embedding(V,D)` contains a trainable table `[V,D]`; lookup returns floating-point vectors `[B,T,D]`. Feeding raw IDs to Linear does not make their numeric distances semantic distances.

  The example contains sentences with two and one real tokens, padded to three positions. `DataLoader` returns IDs `[2,3]` and labels `[2]`. `ids.ne(0)` makes a `[2,3]` mask; `unsqueeze(-1)` turns it into `[2,3,1]` for broadcasting across vector coordinates. Summing over tokens and dividing by real-token counts gives `[2,4]` without mixing sentences. The embeddings lesson explains this pooling operation in more detail.

  Everything runs on CPU. Moving to GPU requires moving the model, inputs and labels together. Token IDs and class-index labels remain integers; embeddings and logits are floating point. `reshape` regroups elements, while `transpose` or `permute` changes axis order. A numerically valid shape does not prove that axis meanings are correct.

  ## A reproducible failure

  `flatten()` breaks the `[B,T]` contract, so this example rejects it instead of silently treating two sentences as one. IDs outside `[0,V)` have no embedding row; an all-PAD sentence has no valid denominator. Check these data failures before changing a model.

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
    task: Chạy ví dụ, rồi thêm câu thứ ba `[1,2,3]` và nhãn 1, đặt batch_size=3. Dự đoán shape trước khi chạy.
      Sau đó thử ID 6, tensor float và câu `[0,0,0]`; mỗi đầu vào phải bị từ chối với lý do cụ thể.
    deliverables: *id001
    checkpoint: Bản gốc in IDs (2,3), token vectors (2,3,4), sentence vectors (2,4) và lengths [2,1]. Bản ba
      câu cho (3,3), (3,3,4), (3,4); giải thích riêng B/T/D và không trộn batch khi pooling. Lưu kết quả ba
      ca lỗi và giải thích vì sao reshape không sửa được ID sai hoặc câu rỗng.
    stretch: Dùng Dataset/DataLoader cho batch cuối chỉ có một câu, giữ chiều batch và kiểm tra gradient ở
      bài kế tiếp.
  en:
    task: Run the example, add a third sentence `[1,2,3]` with label 1 and set batch_size=3. Predict shapes
      before running. Then try ID 6, float IDs and `[0,0,0]`; each input must be rejected with a specific reason.
    deliverables: *id002
    checkpoint: The original prints IDs (2,3), tokens (2,3,4), sentences (2,4), and lengths [2,1]. Three sentences
      give (3,3), (3,3,4), (3,4); explain B/T/D without pooling across the batch. Save the three rejected cases
      and explain why reshaping cannot repair invalid IDs or empty text.
    stretch: Use Dataset/DataLoader with a one-sentence final batch, retain its batch axis and inspect gradients
      in the next lesson.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Tensor và kích thước các chiều” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain tensors and shapes to a new teammate?
  - Which assumption behind tensors and shapes could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- z = Wx + b
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: tensor_shapes.py
  code: |
    """CPU tensor-to-token bridge; no downloaded data or model."""
    import torch
    from torch import nn
    from torch.utils.data import DataLoader, TensorDataset


    def validate_ids(ids, vocabulary_size):
        if ids.ndim != 2 or ids.shape[0] == 0 or ids.shape[1] == 0:
            raise ValueError("ids must have nonempty shape [batch, tokens]")
        if ids.dtype != torch.long:
            raise ValueError("token IDs must use torch.long")
        if torch.any(ids < 0) or torch.any(ids >= vocabulary_size):
            raise ValueError("token ID outside vocabulary")
        if torch.any(ids.ne(0).sum(dim=1) == 0):
            raise ValueError("each sentence needs at least one non-padding token")


    def demo():
        torch.set_num_threads(1)
        # 0 = PAD; the other numbers are vocabulary IDs, not word meanings.
        ids = torch.tensor([[2, 3, 0], [4, 0, 0]], dtype=torch.long)
        labels = torch.tensor([1, 0], dtype=torch.long)
        loader = DataLoader(TensorDataset(ids, labels), batch_size=2, shuffle=False)
        batch_ids, batch_labels = next(iter(loader))
        validate_ids(batch_ids, vocabulary_size=6)
        embedding = nn.Embedding(6, 4, padding_idx=0)
        token_vectors = embedding(batch_ids)
        mask = batch_ids.ne(0)
        lengths = mask.sum(dim=1, keepdim=True)
        sentence_vectors = (token_vectors * mask.unsqueeze(-1)).sum(dim=1) / lengths
        print("ids", tuple(batch_ids.shape), str(batch_ids.dtype), str(batch_ids.device))
        print("tokens", tuple(token_vectors.shape), "sentences", tuple(sentence_vectors.shape))
        print("labels", tuple(batch_labels.shape), "lengths", lengths.squeeze(1).tolist())
        try:
            validate_ids(batch_ids.flatten(), vocabulary_size=6)
        except ValueError as error:
            print("rejected:", error)


    if __name__ == "__main__":
        demo()
  status: runnable
  purpose_vi: Theo dõi tensor từ một batch token đến vector câu; kiểm tra shape, dtype, device và padding bằng
    PyTorch thật.
  purpose_en: Trace a batch of token IDs into sentence vectors, checking shape, dtype, device and padding with
    real PyTorch.
  setup: 'Google Colab: tạo notebook Python mới, chọn CPU, dán toàn bộ ví dụ vào một cell rồi chạy; không cần
    clone repo, GPU, API key hay tải model. / Create a Python notebook in Google Colab, use a CPU runtime and
    paste the complete example into one cell. No clone, GPU, API key or model download is needed. Requires
    Python 3.11+ and PyTorch 2.x; the verification environment used torch 2.14.1+cpu. Run `import torch; print(torch.__version__)`
    first; if unavailable, choose a runtime with PyTorch instead of installing packages on a weak local machine.
    The learning website displays code; execution happens in Colab or your own Python environment.'
  expected_output: |-
    ids (2, 3) torch.int64 cpu
    tokens (2, 3, 4) sentences (2, 4)
    labels (2,) lengths [2, 1]
    rejected: ids must have nonempty shape [batch, tokens]
  edge_case_vi: Flatten làm mất ranh giới câu; kiểm tra ndim, dtype, miền ID và số token thật trước embedding.
  edge_case_en: Flatten removes sentence boundaries; validate ndim, dtype, ID range and real-token counts before
    embedding.
  explanation_vi: 'Gợi ý kiểm tra: đổi cả ids và labels để TensorDataset có cùng số mẫu. Ba câu có lengths
    [2,1,3]. Với vocabulary_size=6, ID tối đa là 5. Dùng torch.long cho ID; không làm tròn dữ liệu bất kỳ để
    che lỗi. Câu rỗng cần bị từ chối hoặc có chính sách riêng được công bố.'
  explanation_en: 'Check: update both ids and labels so TensorDataset lengths match. The three lengths are
    [2,1,3]. With vocabulary_size=6 the largest ID is 5. Use torch.long for IDs, not arbitrary rounding to
    hide bad data. Reject empty text or document an explicit separate policy.'
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
- title: PyTorch Fundamentals
  url: https://pytorch.org/tutorials/beginner/basics/intro.html
  language: en
  purpose_vi: Học tensor, Dataset, DataLoader và vòng lặp huấn luyện theo luồng xử lý chính thức.
  read_vi: Lần lượt đọc phần dữ liệu, mô hình, autograd và tối ưu hóa.
  purpose_en: Learn tensors, datasets, dataloaders, and loops from the official flow.
  read_en: Read data, models, autograd, and optimization in that order.
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
- title: PyTorch tensor attributes and operations
  url: https://docs.pytorch.org/tutorials/beginner/basics/tensorqs_tutorial.html
  language: en
  kind: official
  required: true
  purpose_vi: Theo dõi tensor từ một batch token đến vector câu; kiểm tra shape, dtype, device và padding bằng
    PyTorch thật.
  purpose_en: Trace a batch of token IDs into sentence vectors, checking shape, dtype, device and padding with
    real PyTorch.
  read_vi: Đọc Attributes và Operations; đối chiếu dtype/device và nhân ma trận.
  read_en: Read Attributes and Operations; verify dtype/device and matrix multiplication.
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
- phase-04-deep-learning-pytorch-core-1-recall
- phase-04-deep-learning-pytorch-core-1-application
- phase-04-deep-learning-pytorch-core-1-debug
- phase-04-deep-learning-pytorch-core-1-interview
estimated_minutes: 75
completion_checklist: *id001
completion_criteria: *id001
common_mistakes:
- Flatten làm mất ranh giới câu; kiểm tra ndim, dtype, miền ID và số token thật trước embedding.
- Bỏ qua ca lỗi hoặc coi kết quả dữ liệu tổng hợp là điểm chất lượng thực tế.
- Đọc hướng dẫn trên web rồi tưởng code đã chạy trong trình duyệt; cần chạy ở Colab/Python và lưu output.
next_lessons:
- phase-04-deep-learning-pytorch-core-2
- phase-04-deep-learning-pytorch-core-3
review_question_vi: Nội dung cốt lõi của “Tensor và kích thước các chiều” là gì?
review_question_en: Define tensors and shapes in your own words. What are the input, transformation and output?
review_answer_vi: ID [B,T] kiểu long tra bảng Embedding thành [B,T,D]. Mask loại PAD và tổng theo T tạo [B,D];
  nhãn [B] giữ cùng thứ tự câu. Shape, dtype và device đều phải đúng hợp đồng.
review_answer_en: Long IDs [B,T] index an Embedding table to produce [B,T,D]. Mask PAD and reduce T to get
  [B,D]; labels [B] preserve sentence order. Shape, dtype and device must all match the contract.
review_cards:
- id: phase-04-deep-learning-pytorch-core-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Tensor và kích thước các chiều” là gì?
  question_en: Define tensors and shapes in your own words. What are the input, transformation and output?
  answer_vi: ID [B,T] kiểu long tra bảng Embedding thành [B,T,D]. Mask loại PAD và tổng theo T tạo [B,D]; nhãn
    [B] giữ cùng thứ tự câu. Shape, dtype và device đều phải đúng hợp đồng.
  answer_en: Long IDs [B,T] index an Embedding table to produce [B,T,D]. Mask PAD and reduce T to get [B,D];
    labels [B] preserve sentence order. Shape, dtype and device must all match the contract.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-04-deep-learning-pytorch-core-1-application
  type: application
  question_vi: Chạy ví dụ, rồi thêm câu thứ ba `[1,2,3]` và nhãn 1, đặt batch_size=3. Dự đoán shape trước khi
    chạy. Sau đó thử ID 6, tensor float và câu `[0,0,0]`; mỗi đầu vào phải bị từ chối với lý do cụ thể.
  question_en: Run the example, add a third sentence `[1,2,3]` with label 1 and set batch_size=3. Predict shapes
    before running. Then try ID 6, float IDs and `[0,0,0]`; each input must be rejected with a specific reason.
  answer_vi: 'Gợi ý kiểm tra: đổi cả ids và labels để TensorDataset có cùng số mẫu. Ba câu có lengths [2,1,3].
    Với vocabulary_size=6, ID tối đa là 5. Dùng torch.long cho ID; không làm tròn dữ liệu bất kỳ để che lỗi.
    Câu rỗng cần bị từ chối hoặc có chính sách riêng được công bố.'
  answer_en: 'Check: update both ids and labels so TensorDataset lengths match. The three lengths are [2,1,3].
    With vocabulary_size=6 the largest ID is 5. Use torch.long for IDs, not arbitrary rounding to hide bad
    data. Reject empty text or document an explicit separate policy.'
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-04-deep-learning-pytorch-core-1-debug
  type: debug
  question_vi: Khi làm bài “Tensor và kích thước các chiều”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If tensors and shapes produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Flatten làm mất ranh giới câu; kiểm tra ndim, dtype, miền ID và số token thật trước embedding.
  answer_en: Flatten removes sentence boundaries; validate ndim, dtype, ID range and real-token counts before
    embedding.
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-04-deep-learning-pytorch-core-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Tensor và kích thước các chiều” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of tensors and shapes?
  answer_vi: 'ID [B,T] kiểu long tra bảng Embedding thành [B,T,D]. Mask loại PAD và tổng theo T tạo [B,D];
    nhãn [B] giữ cùng thứ tự câu. Shape, dtype và device đều phải đúng hợp đồng. Gợi ý kiểm tra: đổi cả ids
    và labels để TensorDataset có cùng số mẫu. Ba câu có lengths [2,1,3]. Với vocabulary_size=6, ID tối đa
    là 5. Dùng torch.long cho ID; không làm tròn dữ liệu bất kỳ để che lỗi. Câu rỗng cần bị từ chối hoặc có
    chính sách riêng được công bố.'
  answer_en: 'Long IDs [B,T] index an Embedding table to produce [B,T,D]. Mask PAD and reduce T to get [B,D];
    labels [B] preserve sentence order. Shape, dtype and device must all match the contract. Check: update
    both ids and labels so TensorDataset lengths match. The three lengths are [2,1,3]. With vocabulary_size=6
    the largest ID is 5. Use torch.long for IDs, not arbitrary rounding to hide bad data. Reject empty text
    or document an explicit separate policy.'
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Tensor và kích thước các chiều / Tensors and shapes

## Tiếng Việt

Tensor biểu diễn dữ liệu nhiều chiều. Hãy ghi ý nghĩa của từng chiều cùng kích thước, kiểu dữ liệu và thiết bị: một lô 8 ảnh RGB cao 32, rộng 32 thường có shape (8, 3, 32, 32) trong PyTorch.

Số chiều khác số phần tử: tensor trên có 4 chiều nhưng chứa 24.576 giá trị. Một tensor có shape đúng vẫn có thể sai ý nghĩa nếu tráo kênh màu với chiều rộng; việc đổi cách nhìn bằng reshape không tự hoán vị các trục.

Tự kiểm tra: có thể nhân ma trận (8, 3) với (4, 2) không? Không, vì hai chiều trong 3 và 4 không bằng nhau. Trước khi sửa kích thước cho phép toán chạy được, hãy xác định mỗi trục đang đại diện cho điều gì.

## Cầu nối từ tensor sang văn bản

Với văn bản, B là số câu trong batch, T là độ dài sau padding và D là số chiều embedding. `ids` có shape `[B,T]` và kiểu `torch.long`: mỗi số chỉ là khóa tra từ vựng. `nn.Embedding(V,D)` chứa một bảng tham số `[V,D]`; tra bảng tạo tensor số thực `[B,T,D]`. Đừng đưa ID trực tiếp vào Linear rồi hiểu khoảng cách giữa các số ID là quan hệ ngữ nghĩa.

Ví dụ có hai câu dài 2 và 1 token, được đệm thành 3 vị trí. `DataLoader` trả một batch ID `[2,3]` và nhãn `[2]`. `ids.ne(0)` tạo mask `[2,3]`; `unsqueeze(-1)` thành `[2,3,1]` để nhân với mọi tọa độ của token vector. Cộng theo chiều token rồi chia số token thật tạo `[2,4]`, không làm mất chiều batch. Kỹ thuật gom này sẽ được giải thích sâu hơn trong bài Embedding và phân loại văn bản.

Mọi tensor ở đây nằm trên CPU. Nếu chuyển sang GPU, cả model, đầu vào và nhãn phải cùng thiết bị. Token ID/nhãn chỉ số lớp vẫn là số nguyên; embedding và logits là số thực. `reshape` đổi cách nhóm phần tử; `transpose` hoặc `permute` mới hoán vị trục. Một shape hợp lệ về số học chưa chứng minh trục mang ý nghĩa đúng.

## Lỗi có thể tái hiện

`flatten()` phá hợp đồng `[B,T]` nên ví dụ chủ động báo lỗi, thay vì âm thầm coi hai câu là một. ID ngoài `[0,V)` không có dòng embedding; câu toàn PAD không có mẫu số hợp lệ. Kiểm tra sớm ba trường hợp đó giúp tìm lỗi ở dữ liệu thay vì đổi mô hình tùy tiện.

Gợi ý nghiên cứu: T13, bằng chứng M + H (metadata và 6 ảnh, trong đó hai ảnh Tensor trùng nội dung). Chưa có transcript hoặc xác nhận xem toàn bộ video. Bài này dùng nguồn PyTorch chính thức và ví dụ tự kiểm thử; không tái sử dụng ảnh TikTok hay suy ra hiệu quả nghề nghiệp từ nội dung quảng bá.

### Thực hành và nghiệm thu

Chạy ví dụ, rồi thêm câu thứ ba `[1,2,3]` và nhãn 1, đặt batch_size=3. Dự đoán shape trước khi chạy. Sau đó thử ID 6, tensor float và câu `[0,0,0]`; mỗi đầu vào phải bị từ chối với lý do cụ thể.

- Bản gốc in IDs (2,3), token vectors (2,3,4), sentence vectors (2,4) và lengths [2,1].
- Bản ba câu cho (3,3), (3,3,4), (3,4); giải thích riêng B/T/D và không trộn batch khi pooling.
- Lưu kết quả ba ca lỗi và giải thích vì sao reshape không sửa được ID sai hoặc câu rỗng.

### Gợi ý đối chiếu sau khi làm

Gợi ý kiểm tra: đổi cả ids và labels để TensorDataset có cùng số mẫu. Ba câu có lengths [2,1,3]. Với vocabulary_size=6, ID tối đa là 5. Dùng torch.long cho ID; không làm tròn dữ liệu bất kỳ để che lỗi. Câu rỗng cần bị từ chối hoặc có chính sách riêng được công bố.

## English

A tensor represents multidimensional data. Record each axis meaning alongside shape, dtype and device: a batch of 8 RGB images, each 32 pixels high and wide, commonly has shape (8, 3, 32, 32) in PyTorch.

The number of axes differs from the number of elements: this tensor has 4 axes but contains 24,576 values. A plausible shape can still have the wrong meaning if color channels and width are mixed up; reshaping does not automatically permute axes.

Self-check: can matrices shaped (8, 3) and (4, 2) be multiplied? No, because the inner dimensions 3 and 4 differ. Before changing shapes merely to make an operation run, identify what every axis represents.

## From tensors to text

For text, B is the number of sentences, T the padded sequence length and D the embedding dimension. `ids` has shape `[B,T]` and dtype `torch.long`: each number is a vocabulary lookup key. `nn.Embedding(V,D)` contains a trainable table `[V,D]`; lookup returns floating-point vectors `[B,T,D]`. Feeding raw IDs to Linear does not make their numeric distances semantic distances.

The example contains sentences with two and one real tokens, padded to three positions. `DataLoader` returns IDs `[2,3]` and labels `[2]`. `ids.ne(0)` makes a `[2,3]` mask; `unsqueeze(-1)` turns it into `[2,3,1]` for broadcasting across vector coordinates. Summing over tokens and dividing by real-token counts gives `[2,4]` without mixing sentences. The embeddings lesson explains this pooling operation in more detail.

Everything runs on CPU. Moving to GPU requires moving the model, inputs and labels together. Token IDs and class-index labels remain integers; embeddings and logits are floating point. `reshape` regroups elements, while `transpose` or `permute` changes axis order. A numerically valid shape does not prove that axis meanings are correct.

## A reproducible failure

`flatten()` breaks the `[B,T]` contract, so this example rejects it instead of silently treating two sentences as one. IDs outside `[0,V)` have no embedding row; an all-PAD sentence has no valid denominator. Check these data failures before changing a model.

Research prompt: T13, evidence M + H (metadata and six images, including two duplicate Tensor images). No full transcript or full-video verification. This lesson uses official PyTorch references and independently tested examples; it does not reuse TikTok images or infer career outcomes from promotional claims.

### Practice and acceptance

Run the example, add a third sentence `[1,2,3]` with label 1 and set batch_size=3. Predict shapes before running. Then try ID 6, float IDs and `[0,0,0]`; each input must be rejected with a specific reason.

- The original prints IDs (2,3), tokens (2,3,4), sentences (2,4), and lengths [2,1].
- Three sentences give (3,3), (3,3,4), (3,4); explain B/T/D without pooling across the batch.
- Save the three rejected cases and explain why reshaping cannot repair invalid IDs or empty text.

### Check after attempting

Check: update both ids and labels so TensorDataset lengths match. The three lengths are [2,1,3]. With vocabulary_size=6 the largest ID is 5. Use torch.long for IDs, not arbitrary rounding to hide bad data. Reject empty text or document an explicit separate policy.
