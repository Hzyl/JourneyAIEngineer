---
lesson_id: phase-04-deep-learning-training-1
phase_id: phase-04-deep-learning
module_id: training
title_vi: Lan truyền xuôi và hàm mất mát
title_en: Forward passes and loss
summary_vi: Huấn luyện bộ phân loại văn bản CPU nhỏ bằng Embedding → masked pooling → Linear, ghi loss, chọn
  checkpoint và kiểm tra lỗi thứ tự từ.
summary_en: Train a tiny CPU text classifier with Embedding → masked pooling → Linear, recording losses, selecting
  a checkpoint and exposing word-order errors.
learning_objectives: &id001
- Logits [B,2], labels [B] long; gradient embedding khác 0 và dòng PAD có gradient 0.
- 80 epoch giảm train loss so với ban đầu; lưu loss thực tế và confusion 2×2, không suy ra khả năng tổng quát
  hóa từ 4 câu.
- Hai lần eval cho cùng logits; padding không đổi kết quả; cặp đảo thứ tự có cùng dự đoán và chỉ đúng 1/2.
- Giải thích validation chọn checkpoint và vì sao cần test riêng; code không tải model hoặc dữ liệu.
learning_objectives_en: &id002
- Logits are [B,2], labels [B] long; embedding gradients are nonzero and the PAD gradient is zero.
- 80 epochs reduce initial training loss; record actual losses and a 2×2 confusion matrix without generalizing
  from four sentences.
- Two eval calls match; added padding preserves outputs; the reversed pair has equal predictions and exactly
  1/2 correct.
- Explain validation checkpoint selection and the need for a separate test set; no model or data downloads.
prerequisites:
- phase-04-deep-learning-pytorch-core-4
- phase-03-classical-ml-ml-framing-1
key_terms:
- forward
- pass
- loss
- PyTorch
- tensor
- training
concept_notes_vi: |-
  Lan truyền xuôi biến đầu vào thành dự đoán qua các lớp của mô hình. Hàm mất mát đo mức không phù hợp giữa dự đoán và mục tiêu, tạo một đại lượng để tối ưu. Hàm mất mát không nhất thiết trùng thước đo mà người dùng quan tâm.

  Trong phân loại một nhãn với CrossEntropyLoss, đầu vào thường là logits, tức điểm số chưa qua softmax, và nhãn là chỉ số lớp. Với 4 mẫu và 3 lớp, logits có shape (4, 3), nhãn có shape (4,). Không thêm softmax theo thói quen vì hàm này đã xử lý phép chuẩn hóa cần thiết.

  Tự kiểm tra: loss giảm có bảo đảm accuracy tăng sau mỗi bước không? Không; độ tự tin có thể thay đổi trong khi lớp có điểm cao nhất vẫn giữ nguyên. Theo dõi cả loss và thước đo phù hợp trên dữ liệu kiểm định.

  ## Một vòng lặp thật từ dữ liệu đến kết quả

  Lab phân loại tám câu tổng hợp thành tích cực (1) hoặc tiêu cực (0), dùng bốn câu validation riêng. Từ vựng chỉ dựng từ TRAIN; 0 là PAD, 1 là UNK. `lower().split()` là bộ tách đơn vị theo khoảng trắng rất đơn giản: với tiếng Việt, đơn vị đó thường là tiếng, không phải từ hoàn chỉnh. Đây chưa phải tokenizer subword của Transformer.

  `TensorDataset` ghép ID và nhãn; `DataLoader` tạo hai minibatch mỗi epoch. Model tra Embedding `[B,T,8]`, bỏ PAD khi lấy trung bình thành `[B,8]`, qua Dropout và Linear thành logits `[B,2]`. Nhãn `[B]` kiểu long có giá trị 0 hoặc 1. CrossEntropyLoss nhận logits trực tiếp. Không softmax trước loss; chỉ cần argmax để chọn lớp khi tính confusion matrix.

  Mỗi minibatch chạy `zero_grad → forward → loss → backward → step`. Đầu epoch dùng `model.train()` để bật dropout. Validation dùng `model.eval()` và `torch.no_grad()`; không optimizer.step. Tính validation loss sau mỗi epoch và deepcopy state_dict khi tốt hơn, rồi nạp lại trạng thái tốt nhất. Chỉ giữ tham chiếu state_dict có thể khiến bản “tốt nhất” tiếp tục đổi cùng model. Lab giữ checkpoint trong RAM, không tự ghi file hoặc truy cập máy người học.

  ## Đọc kết quả có giới hạn

  Với seed 7, 80 epoch và torch 2.14.1+cpu, lần kiểm chứng cho train loss 0.6866 → 0.0009, validation loss 0.0008, đúng 4/4 câu và confusion [[2,0],[0,2]] (hàng là nhãn thật, cột là dự đoán). Khác phiên bản có thể khác chữ số cuối. Đây là kết quả chạy trên tập tổng hợp rất nhỏ, không phải benchmark NLP hay tỷ lệ quảng cáo.

  Hai câu kiểm tra ngoài validation “không tốt mà tệ” và “không tệ mà tốt” có cùng multiset token nhưng nhãn mong muốn đối lập. Mean pooling bỏ thứ tự nên model dự đoán giống nhau, đúng tối đa 1/2; lần chạy tham chiếu cho [0,0]. Bốn câu validation đã được dùng chọn checkpoint nên không phải test set độc lập. Trước khi tuyên bố chất lượng thực tế, cần tập test khóa trước, dữ liệu đa dạng, baseline đơn giản và phân tích lỗi phủ định/UNK/độ dài. Không sửa model dựa vào test rồi vẫn gọi điểm đó là đánh giá độc lập.

  Gợi ý nghiên cứu: T13, bằng chứng M + H (metadata và 6 ảnh, trong đó hai ảnh Tensor trùng nội dung). Chưa có transcript hoặc xác nhận xem toàn bộ video. Bài này dùng nguồn PyTorch chính thức và ví dụ tự kiểm thử; không tái sử dụng ảnh TikTok hay suy ra hiệu quả nghề nghiệp từ nội dung quảng bá.
concept_notes_en: |-
  A forward pass transforms inputs into predictions through the model's layers. A loss function measures how predictions differ from targets and supplies an optimization objective. The loss need not be the same metric that matters to users.

  For single-label classification with CrossEntropyLoss, inputs are commonly logits, meaning scores before softmax, and targets are class indices. With 4 examples and 3 classes, logits have shape (4, 3) and targets (4,). Do not add softmax by habit; this loss already handles the required normalization.

  Self-check: does decreasing loss guarantee accuracy improves at every step? No; confidence can change while the highest-scoring class remains the same. Track both loss and an appropriate metric on validation data.

  ## A real loop from data to results

  The lab classifies eight synthetic sentences as positive (1) or negative (0), with four separate validation sentences. Build vocabulary from TRAIN only: 0 is PAD and 1 is UNK. `lower().split()` separates whitespace units, which are often syllables rather than complete Vietnamese words. It is not a Transformer's subword tokenizer.

  `TensorDataset` pairs IDs and labels; `DataLoader` makes two minibatches per epoch. Embedding produces `[B,T,8]`, masked averaging produces `[B,8]`, and Dropout plus Linear produces logits `[B,2]`. Labels `[B]` are long integers 0 or 1. CrossEntropyLoss takes logits directly. Do not softmax before loss; argmax is sufficient for confusion-matrix predictions.

  Each minibatch follows `zero_grad → forward → loss → backward → step`. Call `model.train()` at the start of each epoch to activate dropout. Validation uses `model.eval()` and `torch.no_grad()`, without optimizer.step. Measure validation loss after each epoch, deepcopy an improved state_dict, then reload the best state. Merely retaining the state_dict reference can let the supposed best snapshot change with subsequent training. This lab stores the checkpoint in RAM and does not access the learner's filesystem.

  ## Read results within their limits

  With seed 7, 80 epochs and torch 2.14.1+cpu, verification produced train loss 0.6866 → 0.0009, validation loss 0.0008, 4/4 correct and confusion [[2,0],[0,2]] (rows actual, columns predicted). Last digits may vary across versions. These are measured results on a tiny synthetic fixture, not an NLP benchmark or promotional success rate.

  The challenge sentences “không tốt mà tệ” (not good but bad) and “không tệ mà tốt” (not bad but good) contain the same token multiset but opposite target labels. Mean pooling discards order, forcing equal predictions and at most 1/2 correct; the reference run predicts [0,0]. Validation selected the checkpoint and is therefore not an independent test set. Real quality claims require a precommitted test set, diverse data, a simple baseline and error analysis for negation, UNK and length. Do not tune on test examples and still present the result as independent evaluation.

  Research prompt: T13, evidence M + H (metadata and six images, including two duplicate Tensor images). No full transcript or full-video verification. This lesson uses official PyTorch references and independently tested examples; it does not reuse TikTok images or infer career outcomes from promotional claims.
why_it_matters_vi: Tách các bước dự đoán, tính mất mát, tính gradient, cập nhật và kiểm định để dễ tìm lỗi.
why_it_matters_en: Separate forward, loss, backward, optimizer, validation, and checkpoint into a debuggable
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
    task: Chạy nguyên ví dụ và lưu JSON kết quả, phiên bản torch, seed và số epoch. Giải thích từng ô confusion
      matrix. Thử thêm padding vào câu và xác nhận logits ở eval không đổi; đối chiếu cặp câu đảo thứ tự. Thay
      epoch từ 80 xuống 1, ghi lại cả train/validation loss thay vì chỉ chụp một điểm accuracy.
    deliverables: *id001
    checkpoint: Logits [B,2], labels [B] long; gradient embedding khác 0 và dòng PAD có gradient 0. 80 epoch
      giảm train loss so với ban đầu; lưu loss thực tế và confusion 2×2, không suy ra khả năng tổng quát hóa
      từ 4 câu. Hai lần eval cho cùng logits; padding không đổi kết quả; cặp đảo thứ tự có cùng dự đoán và
      chỉ đúng 1/2. Giải thích validation chọn checkpoint và vì sao cần test riêng; code không tải model hoặc
      dữ liệu.
    stretch: Thêm baseline luôn đoán lớp phổ biến, tập test riêng và báo lỗi theo phủ định/UNK; nếu thử transfer
      learning, ghi rõ model và chi phí trên Colab.
  en:
    task: Run the complete example and save the JSON report, torch version, seed and epoch count. Explain each
      confusion cell. Add padding and verify eval logits are unchanged; examine the reversed-order pair. Change
      80 epochs to 1 and record both train/validation loss instead of reporting accuracy alone.
    deliverables: *id002
    checkpoint: Logits are [B,2], labels [B] long; embedding gradients are nonzero and the PAD gradient is
      zero. 80 epochs reduce initial training loss; record actual losses and a 2×2 confusion matrix without
      generalizing from four sentences. Two eval calls match; added padding preserves outputs; the reversed
      pair has equal predictions and exactly 1/2 correct. Explain validation checkpoint selection and the need
      for a separate test set; no model or data downloads.
    stretch: Add a majority-class baseline, a separate test set and negation/UNK error slices; if trying transfer
      learning, record the model and Colab cost.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Lan truyền xuôi và hàm mất mát” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain forward passes and loss to a new teammate?
  - Which assumption behind forward passes and loss could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- z = Wx + b
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: train_classifier.py
  code: |
    """Tiny text classification with real autograd, validation and checkpoint selection."""
    from copy import deepcopy
    import json

    import torch
    from torch import nn
    from torch.utils.data import DataLoader, TensorDataset

    TRAIN = [
        ("bài hay", 1), ("học tốt", 1), ("bài dễ", 1), ("hay tốt", 1),
        ("bài tệ", 0), ("học khó", 0), ("bài chán", 0), ("tệ khó", 0),
    ]
    VALIDATION = [("học hay", 1), ("tốt dễ", 1), ("học chán", 0), ("khó chán", 0)]
    VOCAB = {"<PAD>": 0, "<UNK>": 1}
    for word in sorted({word for text, _ in TRAIN for word in text.split()}):
        VOCAB[word] = len(VOCAB)


    def encode(texts, width=4):
        if not texts or width < 1:
            raise ValueError("need texts and a positive width")
        rows = []
        for text in texts:
            words = text.lower().split()
            if not words:
                raise ValueError("empty sentence")
            if len(words) > width:
                raise ValueError("sentence exceeds width; choose a truncation policy explicitly")
            row = [VOCAB.get(word, 1) for word in words]
            rows.append(row + [0] * (width - len(row)))
        return torch.tensor(rows, dtype=torch.long)


    class TextClassifier(nn.Module):
        def __init__(self):
            super().__init__()
            self.embedding = nn.Embedding(len(VOCAB), 8, padding_idx=0)
            self.dropout = nn.Dropout(0.2)
            self.classifier = nn.Linear(8, 2)

        def forward(self, ids):
            if ids.ndim != 2 or ids.dtype != torch.long:
                raise ValueError("expected long token IDs [B,T]")
            valid = ids.ne(0)
            counts = valid.sum(1, keepdim=True)
            if ids.shape[0] == 0 or torch.any(counts == 0):
                raise ValueError("empty or all-padding sentence")
            vectors = self.embedding(ids)
            pooled = (vectors * valid.unsqueeze(-1)).sum(1) / counts
            return self.classifier(self.dropout(pooled))


    def evaluate(model, ids, labels):
        model.eval()
        with torch.no_grad():
            logits = model(ids)
            loss = float(nn.functional.cross_entropy(logits, labels))
            predictions = logits.argmax(1)
            confusion = torch.zeros(2, 2, dtype=torch.long)
            for actual, predicted in zip(labels, predictions):
                confusion[actual, predicted] += 1
        return loss, predictions, confusion


    def run(epochs=80):
        torch.set_num_threads(1)
        torch.manual_seed(7)
        train_ids = encode([text for text, _ in TRAIN])
        train_y = torch.tensor([label for _, label in TRAIN])
        val_ids = encode([text for text, _ in VALIDATION])
        val_y = torch.tensor([label for _, label in VALIDATION])
        loader = DataLoader(TensorDataset(train_ids, train_y), batch_size=4, shuffle=True,
                            generator=torch.Generator().manual_seed(7), num_workers=0)
        model = TextClassifier()
        optimizer = torch.optim.Adam(model.parameters(), lr=0.03)
        initial_loss, _, _ = evaluate(model, train_ids, train_y)
        best_loss = float("inf")
        best_state = deepcopy(model.state_dict())
        for _ in range(epochs):
            model.train()
            for ids, labels in loader:
                optimizer.zero_grad(set_to_none=True)
                logits = model(ids)
                loss = nn.functional.cross_entropy(logits, labels)
                loss.backward()
                optimizer.step()
            val_loss, _, _ = evaluate(model, val_ids, val_y)
            if val_loss < best_loss:
                best_loss = val_loss
                best_state = deepcopy(model.state_dict())
        model.load_state_dict(best_state)
        final_loss, _, _ = evaluate(model, train_ids, train_y)
        val_loss, predictions, confusion = evaluate(model, val_ids, val_y)
        # Held-out counterexample: same tokens, different order, opposite intended sentiment.
        challenge = encode(["không tốt mà tệ", "không tệ mà tốt"])
        _, challenge_predictions, _ = evaluate(model, challenge, torch.tensor([0, 1]))
        report = {
            "train_shape": list(train_ids.shape),
            "initial_train_loss": round(initial_loss, 4),
            "final_train_loss": round(final_loss, 4),
            "validation_loss": round(val_loss, 4),
            "validation_correct": int(predictions.eq(val_y).sum()),
            "validation_count": len(VALIDATION),
            "confusion_rows_actual": confusion.tolist(),
            "order_pair_predictions": challenge_predictions.tolist(),
            "order_pair_correct": int(challenge_predictions.eq(torch.tensor([0, 1])).sum()),
        }
        return model, report


    if __name__ == "__main__":
        _, result = run()
        print(json.dumps(result, ensure_ascii=False, indent=2))
  status: runnable
  purpose_vi: Huấn luyện bộ phân loại văn bản CPU nhỏ bằng Embedding → masked pooling → Linear, ghi loss, chọn
    checkpoint và kiểm tra lỗi thứ tự từ.
  purpose_en: Train a tiny CPU text classifier with Embedding → masked pooling → Linear, recording losses,
    selecting a checkpoint and exposing word-order errors.
  setup: 'Google Colab: tạo notebook Python mới, chọn CPU, dán toàn bộ ví dụ vào một cell rồi chạy; không cần
    clone repo, GPU, API key hay tải model. / Create a Python notebook in Google Colab, use a CPU runtime and
    paste the complete example into one cell. No clone, GPU, API key or model download is needed. Requires
    Python 3.11+ and PyTorch 2.x; the verification environment used torch 2.14.1+cpu. Run `import torch; print(torch.__version__)`
    first; if unavailable, choose a runtime with PyTorch instead of installing packages on a weak local machine.
    The learning website displays code; execution happens in Colab or your own Python environment.'
  expected_output: |-
    {
      "train_shape": [
        8,
        4
      ],
      "initial_train_loss": 0.6866,
      "final_train_loss": 0.0009,
      "validation_loss": 0.0008,
      "validation_correct": 4,
      "validation_count": 4,
      "confusion_rows_actual": [
        [
          2,
          0
        ],
        [
          0,
          2
        ]
      ],
      "order_pair_predictions": [
        0,
        0
      ],
      "order_pair_correct": 1
    }
  edge_case_vi: Loss giảm nhưng câu phủ định sai có thể do pooling bỏ thứ tự, không phải lỗi optimizer. Kiểm
    tra cả mask, train/eval và phân chia dữ liệu trước khi tăng epoch.
  edge_case_en: Falling loss with negation failures may reflect order-blind pooling rather than an optimizer
    bug. Check masking, train/eval and data splits before increasing epochs.
  explanation_vi: Mean pooling cộng vector rồi chia số token nên không biết vị trí. Thêm data nhưng giữ kiến
    trúc này vẫn không phân biệt được cặp cùng multiset. Muốn biểu diễn thứ tự cần thêm thông tin vị trí và
    cơ chế như Transformer; phải đo lại, không giả định tự tốt hơn. Mở rộng bài tổng hợp bằng cách lưu model/optimizer/epoch
    khi cần resume, tách khỏi snapshot chỉ dùng inference.
  explanation_en: Mean pooling sums vectors and divides by count, losing positions. More data cannot let this
    architecture distinguish equal token multisets. Order-sensitive representations need position information
    and a mechanism such as a Transformer, followed by measurement rather than assumed improvement. Extend
    the module project by saving model/optimizer/epoch for resume, separately from an inference-only snapshot.
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
- title: Giải thích và hướng dẫn thực hành trong bài
  url: ''
  language: vi
  kind: in_app
  purpose_vi: Đọc giải thích, thực hiện nhiệm vụ và đối chiếu tiêu chí hoàn thành.
  purpose_en: The explanation, code example, checklist, and completion criteria inside the app.
  read_vi: Đọc giải thích → xem ví dụ → thực hành → tự kiểm tra.
  read_en: Follow Study plan → Concept notes → Code example → Practice plan.
  required: true
- title: PyTorch optimization loop
  url: https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html
  language: en
  kind: official
  required: true
  purpose_vi: Huấn luyện bộ phân loại văn bản CPU nhỏ bằng Embedding → masked pooling → Linear, ghi loss, chọn
    checkpoint và kiểm tra lỗi thứ tự từ.
  purpose_en: Train a tiny CPU text classifier with Embedding → masked pooling → Linear, recording losses,
    selecting a checkpoint and exposing word-order errors.
  read_vi: Đọc Full Implementation, train/eval, zero_grad và bước optimizer.
  read_en: Read Full Implementation, train/eval, zero_grad and the optimizer step.
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
- exercise-4-training
review_item_ids:
- phase-04-deep-learning-training-1-recall
- phase-04-deep-learning-training-1-application
- phase-04-deep-learning-training-1-debug
- phase-04-deep-learning-training-1-interview
estimated_minutes: 90
completion_checklist: *id001
completion_criteria: *id001
common_mistakes:
- Loss giảm nhưng câu phủ định sai có thể do pooling bỏ thứ tự, không phải lỗi optimizer. Kiểm tra cả mask,
  train/eval và phân chia dữ liệu trước khi tăng epoch.
- Bỏ qua ca lỗi hoặc coi kết quả dữ liệu tổng hợp là điểm chất lượng thực tế.
- Đọc hướng dẫn trên web rồi tưởng code đã chạy trong trình duyệt; cần chạy ở Colab/Python và lưu output.
next_lessons:
- phase-04-deep-learning-training-2
- phase-04-deep-learning-training-3
review_question_vi: Nội dung cốt lõi của “Lan truyền xuôi và hàm mất mát” là gì?
review_question_en: Define forward passes and loss in your own words. What are the input, transformation and
  output?
review_answer_vi: Forward tạo logits, loss so với nhãn, backward tính gradient và step cập nhật tham số. Validation
  eval/no_grad không học; dùng loss để chọn snapshot tốt nhất rồi đánh giá lỗi trên dữ liệu khác.
review_answer_en: Forward produces logits, loss compares labels, backward computes gradients and step updates
  parameters. Validation uses eval/no_grad without learning, selects a snapshot by loss and leaves independent
  error evaluation to separate data.
review_cards:
- id: phase-04-deep-learning-training-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Lan truyền xuôi và hàm mất mát” là gì?
  question_en: Define forward passes and loss in your own words. What are the input, transformation and output?
  answer_vi: Forward tạo logits, loss so với nhãn, backward tính gradient và step cập nhật tham số. Validation
    eval/no_grad không học; dùng loss để chọn snapshot tốt nhất rồi đánh giá lỗi trên dữ liệu khác.
  answer_en: Forward produces logits, loss compares labels, backward computes gradients and step updates parameters.
    Validation uses eval/no_grad without learning, selects a snapshot by loss and leaves independent error
    evaluation to separate data.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-04-deep-learning-training-1-application
  type: application
  question_vi: Chạy nguyên ví dụ và lưu JSON kết quả, phiên bản torch, seed và số epoch. Giải thích từng ô
    confusion matrix. Thử thêm padding vào câu và xác nhận logits ở eval không đổi; đối chiếu cặp câu đảo thứ
    tự. Thay epoch từ 80 xuống 1, ghi lại cả train/validation loss thay vì chỉ chụp một điểm accuracy.
  question_en: Run the complete example and save the JSON report, torch version, seed and epoch count. Explain
    each confusion cell. Add padding and verify eval logits are unchanged; examine the reversed-order pair.
    Change 80 epochs to 1 and record both train/validation loss instead of reporting accuracy alone.
  answer_vi: Mean pooling cộng vector rồi chia số token nên không biết vị trí. Thêm data nhưng giữ kiến trúc
    này vẫn không phân biệt được cặp cùng multiset. Muốn biểu diễn thứ tự cần thêm thông tin vị trí và cơ chế
    như Transformer; phải đo lại, không giả định tự tốt hơn. Mở rộng bài tổng hợp bằng cách lưu model/optimizer/epoch
    khi cần resume, tách khỏi snapshot chỉ dùng inference.
  answer_en: Mean pooling sums vectors and divides by count, losing positions. More data cannot let this architecture
    distinguish equal token multisets. Order-sensitive representations need position information and a mechanism
    such as a Transformer, followed by measurement rather than assumed improvement. Extend the module project
    by saving model/optimizer/epoch for resume, separately from an inference-only snapshot.
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-04-deep-learning-training-1-debug
  type: debug
  question_vi: Khi làm bài “Lan truyền xuôi và hàm mất mát”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If forward passes and loss produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Loss giảm nhưng câu phủ định sai có thể do pooling bỏ thứ tự, không phải lỗi optimizer. Kiểm tra
    cả mask, train/eval và phân chia dữ liệu trước khi tăng epoch.
  answer_en: Falling loss with negation failures may reflect order-blind pooling rather than an optimizer bug.
    Check masking, train/eval and data splits before increasing epochs.
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-04-deep-learning-training-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Lan truyền xuôi và hàm mất mát” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of forward passes and loss?
  answer_vi: Forward tạo logits, loss so với nhãn, backward tính gradient và step cập nhật tham số. Validation
    eval/no_grad không học; dùng loss để chọn snapshot tốt nhất rồi đánh giá lỗi trên dữ liệu khác. Mean pooling
    cộng vector rồi chia số token nên không biết vị trí. Thêm data nhưng giữ kiến trúc này vẫn không phân biệt
    được cặp cùng multiset. Muốn biểu diễn thứ tự cần thêm thông tin vị trí và cơ chế như Transformer; phải
    đo lại, không giả định tự tốt hơn. Mở rộng bài tổng hợp bằng cách lưu model/optimizer/epoch khi cần resume,
    tách khỏi snapshot chỉ dùng inference.
  answer_en: Forward produces logits, loss compares labels, backward computes gradients and step updates parameters.
    Validation uses eval/no_grad without learning, selects a snapshot by loss and leaves independent error
    evaluation to separate data. Mean pooling sums vectors and divides by count, losing positions. More data
    cannot let this architecture distinguish equal token multisets. Order-sensitive representations need position
    information and a mechanism such as a Transformer, followed by measurement rather than assumed improvement.
    Extend the module project by saving model/optimizer/epoch for resume, separately from an inference-only
    snapshot.
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Lan truyền xuôi và hàm mất mát / Forward passes and loss

## Tiếng Việt

Lan truyền xuôi biến đầu vào thành dự đoán qua các lớp của mô hình. Hàm mất mát đo mức không phù hợp giữa dự đoán và mục tiêu, tạo một đại lượng để tối ưu. Hàm mất mát không nhất thiết trùng thước đo mà người dùng quan tâm.

Trong phân loại một nhãn với CrossEntropyLoss, đầu vào thường là logits, tức điểm số chưa qua softmax, và nhãn là chỉ số lớp. Với 4 mẫu và 3 lớp, logits có shape (4, 3), nhãn có shape (4,). Không thêm softmax theo thói quen vì hàm này đã xử lý phép chuẩn hóa cần thiết.

Tự kiểm tra: loss giảm có bảo đảm accuracy tăng sau mỗi bước không? Không; độ tự tin có thể thay đổi trong khi lớp có điểm cao nhất vẫn giữ nguyên. Theo dõi cả loss và thước đo phù hợp trên dữ liệu kiểm định.

## Một vòng lặp thật từ dữ liệu đến kết quả

Lab phân loại tám câu tổng hợp thành tích cực (1) hoặc tiêu cực (0), dùng bốn câu validation riêng. Từ vựng chỉ dựng từ TRAIN; 0 là PAD, 1 là UNK. `lower().split()` là bộ tách đơn vị theo khoảng trắng rất đơn giản: với tiếng Việt, đơn vị đó thường là tiếng, không phải từ hoàn chỉnh. Đây chưa phải tokenizer subword của Transformer.

`TensorDataset` ghép ID và nhãn; `DataLoader` tạo hai minibatch mỗi epoch. Model tra Embedding `[B,T,8]`, bỏ PAD khi lấy trung bình thành `[B,8]`, qua Dropout và Linear thành logits `[B,2]`. Nhãn `[B]` kiểu long có giá trị 0 hoặc 1. CrossEntropyLoss nhận logits trực tiếp. Không softmax trước loss; chỉ cần argmax để chọn lớp khi tính confusion matrix.

Mỗi minibatch chạy `zero_grad → forward → loss → backward → step`. Đầu epoch dùng `model.train()` để bật dropout. Validation dùng `model.eval()` và `torch.no_grad()`; không optimizer.step. Tính validation loss sau mỗi epoch và deepcopy state_dict khi tốt hơn, rồi nạp lại trạng thái tốt nhất. Chỉ giữ tham chiếu state_dict có thể khiến bản “tốt nhất” tiếp tục đổi cùng model. Lab giữ checkpoint trong RAM, không tự ghi file hoặc truy cập máy người học.

## Đọc kết quả có giới hạn

Với seed 7, 80 epoch và torch 2.14.1+cpu, lần kiểm chứng cho train loss 0.6866 → 0.0009, validation loss 0.0008, đúng 4/4 câu và confusion [[2,0],[0,2]] (hàng là nhãn thật, cột là dự đoán). Khác phiên bản có thể khác chữ số cuối. Đây là kết quả chạy trên tập tổng hợp rất nhỏ, không phải benchmark NLP hay tỷ lệ quảng cáo.

Hai câu kiểm tra ngoài validation “không tốt mà tệ” và “không tệ mà tốt” có cùng multiset token nhưng nhãn mong muốn đối lập. Mean pooling bỏ thứ tự nên model dự đoán giống nhau, đúng tối đa 1/2; lần chạy tham chiếu cho [0,0]. Bốn câu validation đã được dùng chọn checkpoint nên không phải test set độc lập. Trước khi tuyên bố chất lượng thực tế, cần tập test khóa trước, dữ liệu đa dạng, baseline đơn giản và phân tích lỗi phủ định/UNK/độ dài. Không sửa model dựa vào test rồi vẫn gọi điểm đó là đánh giá độc lập.

Gợi ý nghiên cứu: T13, bằng chứng M + H (metadata và 6 ảnh, trong đó hai ảnh Tensor trùng nội dung). Chưa có transcript hoặc xác nhận xem toàn bộ video. Bài này dùng nguồn PyTorch chính thức và ví dụ tự kiểm thử; không tái sử dụng ảnh TikTok hay suy ra hiệu quả nghề nghiệp từ nội dung quảng bá.

### Thực hành và nghiệm thu

Chạy nguyên ví dụ và lưu JSON kết quả, phiên bản torch, seed và số epoch. Giải thích từng ô confusion matrix. Thử thêm padding vào câu và xác nhận logits ở eval không đổi; đối chiếu cặp câu đảo thứ tự. Thay epoch từ 80 xuống 1, ghi lại cả train/validation loss thay vì chỉ chụp một điểm accuracy.

- Logits [B,2], labels [B] long; gradient embedding khác 0 và dòng PAD có gradient 0.
- 80 epoch giảm train loss so với ban đầu; lưu loss thực tế và confusion 2×2, không suy ra khả năng tổng quát hóa từ 4 câu.
- Hai lần eval cho cùng logits; padding không đổi kết quả; cặp đảo thứ tự có cùng dự đoán và chỉ đúng 1/2.
- Giải thích validation chọn checkpoint và vì sao cần test riêng; code không tải model hoặc dữ liệu.

### Gợi ý đối chiếu sau khi làm

Mean pooling cộng vector rồi chia số token nên không biết vị trí. Thêm data nhưng giữ kiến trúc này vẫn không phân biệt được cặp cùng multiset. Muốn biểu diễn thứ tự cần thêm thông tin vị trí và cơ chế như Transformer; phải đo lại, không giả định tự tốt hơn. Mở rộng bài tổng hợp bằng cách lưu model/optimizer/epoch khi cần resume, tách khỏi snapshot chỉ dùng inference.

## English

A forward pass transforms inputs into predictions through the model's layers. A loss function measures how predictions differ from targets and supplies an optimization objective. The loss need not be the same metric that matters to users.

For single-label classification with CrossEntropyLoss, inputs are commonly logits, meaning scores before softmax, and targets are class indices. With 4 examples and 3 classes, logits have shape (4, 3) and targets (4,). Do not add softmax by habit; this loss already handles the required normalization.

Self-check: does decreasing loss guarantee accuracy improves at every step? No; confidence can change while the highest-scoring class remains the same. Track both loss and an appropriate metric on validation data.

## A real loop from data to results

The lab classifies eight synthetic sentences as positive (1) or negative (0), with four separate validation sentences. Build vocabulary from TRAIN only: 0 is PAD and 1 is UNK. `lower().split()` separates whitespace units, which are often syllables rather than complete Vietnamese words. It is not a Transformer's subword tokenizer.

`TensorDataset` pairs IDs and labels; `DataLoader` makes two minibatches per epoch. Embedding produces `[B,T,8]`, masked averaging produces `[B,8]`, and Dropout plus Linear produces logits `[B,2]`. Labels `[B]` are long integers 0 or 1. CrossEntropyLoss takes logits directly. Do not softmax before loss; argmax is sufficient for confusion-matrix predictions.

Each minibatch follows `zero_grad → forward → loss → backward → step`. Call `model.train()` at the start of each epoch to activate dropout. Validation uses `model.eval()` and `torch.no_grad()`, without optimizer.step. Measure validation loss after each epoch, deepcopy an improved state_dict, then reload the best state. Merely retaining the state_dict reference can let the supposed best snapshot change with subsequent training. This lab stores the checkpoint in RAM and does not access the learner's filesystem.

## Read results within their limits

With seed 7, 80 epochs and torch 2.14.1+cpu, verification produced train loss 0.6866 → 0.0009, validation loss 0.0008, 4/4 correct and confusion [[2,0],[0,2]] (rows actual, columns predicted). Last digits may vary across versions. These are measured results on a tiny synthetic fixture, not an NLP benchmark or promotional success rate.

The challenge sentences “không tốt mà tệ” (not good but bad) and “không tệ mà tốt” (not bad but good) contain the same token multiset but opposite target labels. Mean pooling discards order, forcing equal predictions and at most 1/2 correct; the reference run predicts [0,0]. Validation selected the checkpoint and is therefore not an independent test set. Real quality claims require a precommitted test set, diverse data, a simple baseline and error analysis for negation, UNK and length. Do not tune on test examples and still present the result as independent evaluation.

Research prompt: T13, evidence M + H (metadata and six images, including two duplicate Tensor images). No full transcript or full-video verification. This lesson uses official PyTorch references and independently tested examples; it does not reuse TikTok images or infer career outcomes from promotional claims.

### Practice and acceptance

Run the complete example and save the JSON report, torch version, seed and epoch count. Explain each confusion cell. Add padding and verify eval logits are unchanged; examine the reversed-order pair. Change 80 epochs to 1 and record both train/validation loss instead of reporting accuracy alone.

- Logits are [B,2], labels [B] long; embedding gradients are nonzero and the PAD gradient is zero.
- 80 epochs reduce initial training loss; record actual losses and a 2×2 confusion matrix without generalizing from four sentences.
- Two eval calls match; added padding preserves outputs; the reversed pair has equal predictions and exactly 1/2 correct.
- Explain validation checkpoint selection and the need for a separate test set; no model or data downloads.

### Check after attempting

Mean pooling sums vectors and divides by count, losing positions. More data cannot let this architecture distinguish equal token multisets. Order-sensitive representations need position information and a mechanism such as a Transformer, followed by measurement rather than assumed improvement. Extend the module project by saving model/optimizer/epoch for resume, separately from an inference-only snapshot.
