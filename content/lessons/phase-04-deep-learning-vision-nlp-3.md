---
lesson_id: phase-04-deep-learning-vision-nlp-3
phase_id: phase-04-deep-learning
module_id: vision-nlp
title_vi: Embedding và phân loại văn bản
title_en: Embeddings and text classifiers
summary_vi: Phân biệt token embedding, vector câu và embedding semantic pretrained; kiểm chứng masked mean,
  bất biến padding và gradient bằng ví dụ số.
summary_en: Distinguish token lookup, sentence pooling and pretrained semantic embeddings; test masked means,
  padding invariance and gradients numerically.
learning_objectives: &id001
- Pooled đúng [[1,2],[2,0]], padding_invariant=True nhưng naive_mean_invariant=False.
- Gradient PAD [0,0], token 1 [1.5,1.5], token 2 [0.5,0.5]; ba ca mask sai bị từ chối.
- Giải thích mất thứ tự và không gọi bảng vector số tay là pretrained semantic embedding.
learning_objectives_en: &id002
- Pooling equals [[1,2],[2,0]], padding_invariant=True, but naive_mean_invariant=False.
- PAD gradient is [0,0], token 1 [1.5,1.5], token 2 [0.5,0.5]; reject the three invalid-mask cases.
- Explain order loss and do not label hand-assigned vectors as pretrained semantic embeddings.
prerequisites:
- phase-04-deep-learning-vision-nlp-2
- phase-03-classical-ml-ml-framing-1
key_terms:
- embedding
- text
- classifier
- PyTorch
- tensor
- loss
- training
- vision-nlp
concept_notes_vi: |-
  Tokenization chia văn bản thành đơn vị mà mô hình xử lý; token có thể là một phần từ, không nhất thiết là một từ hoàn chỉnh. Embedding ánh xạ các đơn vị đó thành vector để mô hình tính toán, không trực tiếp cho biết câu đúng hay sai.

  Embedding tĩnh gán một vector cho mỗi ID trong bảng tra. Biểu diễn theo ngữ cảnh còn phụ thuộc các token xung quanh. Muốn phân loại cả câu, cần cách gom biểu diễn và xử lý padding để phần đệm không vô tình chi phối kết quả.

  Tự kiểm tra: trung bình mọi vector trong lô đã cho một vector đúng cho mỗi câu chưa? Chưa; phải gom theo chiều token của từng câu và loại vị trí đệm theo mask. Giữ tokenizer, giới hạn độ dài và quy tắc gom nhất quán khi huấn luyện và dự đoán.

  ## Padding bằng 0 vẫn có thể làm sai vector câu

  Giả sử token 1 có vector [2,0], token 2 có [0,4], PAD có [0,0]. Câu `[1,2,0]` phải được gom thành ([2,0]+[0,4])/2=[1,2], không phải chia 3. Câu `[1,0,0]` cho [2,0]. Thêm hai PAD không được làm thay đổi nội dung câu hay vector gom. `padding_idx=0` giữ gradient của dòng PAD bằng 0, nhưng không tự sửa mẫu số của `.mean(dim=1)`.

  `masked_mean` nhận vectors `[B,T,D]` và mask boolean `[B,T]`. Mẫu số là số vị trí True của từng câu. Hàm chủ động từ chối sai shape và câu toàn PAD, thay vì biến đầu vào rỗng thành một vector trông có vẻ hợp lệ bằng clamp. Trong hệ thống thật, có thể chọn trả trạng thái empty thay vì exception, nhưng phải giữ chính sách đó nhất quán giữa indexing và query.

  Khi cộng các thành phần của pooled vectors làm loss và backward, token 1 xuất hiện trong hai câu nên gradient bằng [1.5,1.5]: mỗi thành phần nhận 1/2 từ câu hai token và 1 từ câu một token. Dòng PAD nhận [0,0]. Điều này nối trực tiếp phép gom với autograd và mô hình phân loại ở bài trước.

  ## Embedding nào dùng cho tìm kiếm?

  Bảng `nn.Embedding` trong ví dụ được gán số bằng tay để kiểm tra phép tính. Bảng được học trên tám câu phân loại ở bài training cũng chỉ tối ưu cho nhiệm vụ đó. Cả hai chưa phải sentence embedding pretrained có chất lượng semantic được đánh giá. Transformer tạo biểu diễn token theo ngữ cảnh; sentence encoder còn cần pooling, mục tiêu huấn luyện và quy tắc chuẩn hóa phù hợp. Cosine similarity giữa hai vector bất kỳ không tự trở thành thước đo đúng nghĩa.

  Khi nối sang RAG, dùng đúng tokenizer/model/version/giới hạn độ dài/pooling cho cả tài liệu và câu hỏi. Kiểm tra model card về tiếng Việt và nhiệm vụ retrieval, đo recall trên bộ truy vấn có nhãn và so với baseline từ khóa. Nếu thử model thật, dùng nhánh Colab đã có của lab retrieval; bài này không yêu cầu tải model về máy và không gán kết quả semantic cho vector đồ chơi.

  Gợi ý nghiên cứu: T13, bằng chứng M + H (metadata và 6 ảnh, trong đó hai ảnh Tensor trùng nội dung). Chưa có transcript hoặc xác nhận xem toàn bộ video. Bài này dùng nguồn PyTorch chính thức và ví dụ tự kiểm thử; không tái sử dụng ảnh TikTok hay suy ra hiệu quả nghề nghiệp từ nội dung quảng bá.
concept_notes_en: |-
  Tokenization divides text into units a model processes; a token may be part of a word rather than a whole word. Embeddings map these units to vectors for computation, not directly to judgments of factual truth.

  A static embedding table associates each ID with a vector. Contextual representations also depend on surrounding tokens. Sentence classification requires a pooling rule and padding handling so padded positions do not unintentionally dominate the result.

  Self-check: does averaging every vector in a batch produce one correct vector per sentence? No; pool over each sentence's token axis and exclude padding positions with a mask. Keep tokenizer, length limits and pooling consistent between training and prediction.

  ## Zero padding can still distort sentence vectors

  Let token 1 be [2,0], token 2 [0,4], and PAD [0,0]. Sentence `[1,2,0]` should pool to ([2,0]+[0,4])/2=[1,2], not divide by 3. Sentence `[1,0,0]` becomes [2,0]. Adding two PAD tokens must preserve its content and pooled representation. `padding_idx=0` suppresses the PAD row gradient but does not repair the denominator in `.mean(dim=1)`.

  `masked_mean` accepts vectors `[B,T,D]` and a boolean mask `[B,T]`. Each denominator counts True positions in its sentence. It rejects shape mismatches and all-PAD sentences instead of using clamp to turn empty text into an apparently valid representation. A real system may return an explicit empty status instead of raising, but indexing and querying must use the same policy.

  If we sum pooled-vector components as a loss and backpropagate, token 1 receives gradient [1.5,1.5]: each coordinate receives 1/2 from the two-token sentence and 1 from the one-token sentence. PAD receives [0,0]. This connects pooling directly to autograd and the preceding classifier.

  ## Which embeddings belong in search?

  This `nn.Embedding` table is hand-assigned to expose arithmetic. The table trained on eight classifier sentences optimizes only that tiny task. Neither is an evaluated pretrained semantic sentence encoder. Transformers produce contextual token representations; sentence encoders additionally depend on pooling, training objectives and appropriate normalization. Cosine similarity between arbitrary vectors is not automatically a meaningful semantic score.

  For RAG, use the same tokenizer/model/version/length limit/pooling contract for documents and queries. Check model-card coverage of Vietnamese and retrieval, measure recall on labeled queries and compare with a lexical baseline. Use the existing retrieval lab's Colab branch when trying a real model. This lesson requires no local model download and makes no semantic-quality claim about toy vectors.

  Research prompt: T13, evidence M + H (metadata and six images, including two duplicate Tensor images). No full transcript or full-video verification. This lesson uses official PyTorch references and independently tested examples; it does not reuse TikTok images or infer career outcomes from promotional claims.
why_it_matters_vi: Hiểu CNN, học chuyển giao, embedding và attention để chọn cách biểu diễn phù hợp.
why_it_matters_en: Understand CNNs, transfer learning, embeddings, and attention well enough to choose a CV
  or NLP path.
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
    task: Chạy ví dụ, thêm ba PAD và xác nhận pooled không đổi. Viết ca sai mask shape, mask float và câu toàn
      PAD. Tính tay gradient token 2, rồi so với autograd. Đảo `[1,2]` thành `[2,1]` và giải thích vì sao pooling
      vẫn bằng nhau.
    deliverables: *id001
    checkpoint: Pooled đúng [[1,2],[2,0]], padding_invariant=True nhưng naive_mean_invariant=False. Gradient
      PAD [0,0], token 1 [1.5,1.5], token 2 [0.5,0.5]; ba ca mask sai bị từ chối. Giải thích mất thứ tự và
      không gọi bảng vector số tay là pretrained semantic embedding.
    stretch: Thay PAD vector bằng giá trị khác 0 và chứng minh mask vẫn loại nó; thử masked max với chính sách
      rõ cho câu rỗng.
  en:
    task: Run the example, add three PAD tokens and check unchanged pooling. Test a wrong mask shape, float
      mask and all-PAD sentence. Calculate token 2's gradient by hand and compare autograd. Reverse `[1,2]`
      to `[2,1]` and explain the unchanged mean.
    deliverables: *id002
    checkpoint: Pooling equals [[1,2],[2,0]], padding_invariant=True, but naive_mean_invariant=False. PAD gradient
      is [0,0], token 1 [1.5,1.5], token 2 [0.5,0.5]; reject the three invalid-mask cases. Explain order loss
      and do not label hand-assigned vectors as pretrained semantic embeddings.
    stretch: Set the PAD vector to a nonzero value and prove masking still excludes it; try masked max with
      an explicit empty-text policy.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Embedding và phân loại văn bản” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain embeddings and text classifiers to a new teammate?
  - Which assumption behind embeddings and text classifiers could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- z = Wx + b
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: masked_pooling.py
  code: |
    """Show why PAD=0 still needs a denominator mask for sentence pooling."""
    import torch
    from torch import nn


    def masked_mean(vectors, valid):
        if vectors.ndim != 3 or valid.shape != vectors.shape[:2]:
            raise ValueError("expected vectors [B,T,D] and mask [B,T]")
        if valid.dtype != torch.bool or vectors.device != valid.device:
            raise ValueError("mask must be boolean and on the same device")
        counts = valid.sum(dim=1, keepdim=True)
        if vectors.shape[0] == 0 or torch.any(counts == 0):
            raise ValueError("empty or all-padding sentence")
        return (vectors * valid.unsqueeze(-1)).sum(dim=1) / counts


    def demo():
        torch.set_num_threads(1)
        # Hand-picked vectors expose arithmetic, not pretrained semantic quality.
        weights = torch.tensor([[0.0, 0.0], [2.0, 0.0], [0.0, 4.0]])
        embedding = nn.Embedding.from_pretrained(weights, freeze=False, padding_idx=0)
        ids = torch.tensor([[1, 2, 0], [1, 0, 0]])
        vectors = embedding(ids)
        pooled = masked_mean(vectors, ids.ne(0))
        padded_ids = torch.nn.functional.pad(ids, (0, 2), value=0)
        padded = masked_mean(embedding(padded_ids), padded_ids.ne(0))
        print("pooled", pooled.tolist())
        print("padding_invariant", torch.allclose(pooled, padded))
        print("naive_mean_invariant", torch.allclose(vectors.mean(1), embedding(padded_ids).mean(1)))
        pooled.sum().backward()
        print("pad_gradient", embedding.weight.grad[0].tolist())
        print("token_1_gradient", embedding.weight.grad[1].tolist())
        try:
            masked_mean(torch.zeros(1, 3, 2), torch.zeros(1, 3, dtype=torch.bool))
        except ValueError as error:
            print("rejected:", error)


    if __name__ == "__main__":
        demo()
  status: runnable
  purpose_vi: Phân biệt token embedding, vector câu và embedding semantic pretrained; kiểm chứng masked mean,
    bất biến padding và gradient bằng ví dụ số.
  purpose_en: Distinguish token lookup, sentence pooling and pretrained semantic embeddings; test masked means,
    padding invariance and gradients numerically.
  setup: 'Google Colab: tạo notebook Python mới, chọn CPU, dán toàn bộ ví dụ vào một cell rồi chạy; không cần
    clone repo, GPU, API key hay tải model. / Create a Python notebook in Google Colab, use a CPU runtime and
    paste the complete example into one cell. No clone, GPU, API key or model download is needed. Requires
    Python 3.11+ and PyTorch 2.x; the verification environment used torch 2.14.1+cpu. Run `import torch; print(torch.__version__)`
    first; if unavailable, choose a runtime with PyTorch instead of installing packages on a weak local machine.
    The learning website displays code; execution happens in Colab or your own Python environment.'
  expected_output: |-
    pooled [[1.0, 2.0], [2.0, 0.0]]
    padding_invariant True
    naive_mean_invariant False
    pad_gradient [0.0, 0.0]
    token_1_gradient [1.5, 1.5]
    rejected: empty or all-padding sentence
  edge_case_vi: Nếu thêm PAD làm đổi vector, kiểm tra mẫu số và trục pooling. Nếu vector không đổi khi đảo
    từ, đó là thuộc tính mean pooling, không phải bằng chứng hiểu thứ tự.
  edge_case_en: If added PAD changes vectors, inspect the denominator and pooling axis. If word reversal changes
    nothing, that is mean pooling's order invariance, not evidence of order understanding.
  explanation_vi: Token 2 chỉ ở câu đầu và mẫu số bằng 2 nên mỗi thành phần nhận 0.5. Đảo thứ tự không đổi
    tổng vector. Không dùng tính bất biến đó để kết luận model hiểu phủ định; đó chính là giới hạn mà ví dụ
    training đã phơi bày.
  explanation_en: Token 2 appears only in the first sentence with denominator 2, so each coordinate gets 0.5.
    Reversing order preserves the sum. This invariance does not imply understanding negation; it exposes the
    training example's limitation.
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
- title: Sentence Transformers
  url: https://www.sbert.net/
  language: en
  purpose_vi: Tạo embedding cho câu và đánh giá độ tương đồng trên văn bản tiếng Việt.
  read_vi: Đọc về tìm kiếm ngữ nghĩa và độ tương đồng; ghi rõ mô hình embedding đã chọn.
  purpose_en: Create sentence embeddings and evaluate similarity on Vietnamese text.
  read_en: Read semantic search and similarity; record the embedding model.
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
- title: PyTorch Embedding and padding_idx
  url: https://docs.pytorch.org/docs/stable/generated/torch.nn.Embedding.html
  language: en
  kind: official
  required: true
  purpose_vi: Phân biệt token embedding, vector câu và embedding semantic pretrained; kiểm chứng masked mean,
    bất biến padding và gradient bằng ví dụ số.
  purpose_en: Distinguish token lookup, sentence pooling and pretrained semantic embeddings; test masked means,
    padding invariance and gradients numerically.
  read_vi: Đọc Shape và padding_idx; phân biệt loại gradient với việc gom vector câu.
  read_en: Read Shape and padding_idx; separate gradient suppression from sentence pooling.
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
- exercise-4-vision-nlp
review_item_ids:
- phase-04-deep-learning-vision-nlp-3-recall
- phase-04-deep-learning-vision-nlp-3-application
- phase-04-deep-learning-vision-nlp-3-debug
- phase-04-deep-learning-vision-nlp-3-interview
estimated_minutes: 75
completion_checklist: *id001
completion_criteria: *id001
common_mistakes:
- Nếu thêm PAD làm đổi vector, kiểm tra mẫu số và trục pooling. Nếu vector không đổi khi đảo từ, đó là thuộc
  tính mean pooling, không phải bằng chứng hiểu thứ tự.
- Bỏ qua ca lỗi hoặc coi kết quả dữ liệu tổng hợp là điểm chất lượng thực tế.
- Đọc hướng dẫn trên web rồi tưởng code đã chạy trong trình duyệt; cần chạy ở Colab/Python và lưu output.
next_lessons:
- phase-04-deep-learning-vision-nlp-4
- phase-04-deep-learning-debugging-1
review_question_vi: Nội dung cốt lõi của “Embedding và phân loại văn bản” là gì?
review_question_en: Define embeddings and text classifiers in your own words. What are the input, transformation
  and output?
review_answer_vi: Embedding tra ID thành vector; masked pooling gom đúng token của từng câu. PAD=0 chưa đủ
  vì mẫu số cần số token thật. Chất lượng semantic còn phụ thuộc model, dữ liệu và mục tiêu huấn luyện, phải
  đo bằng retrieval có nhãn.
review_answer_en: Embedding looks up vectors by ID; masked pooling aggregates each sentence's real tokens.
  PAD=0 is insufficient because the denominator must count valid tokens. Semantic quality depends on the model,
  data and objective and needs labeled retrieval evaluation.
review_cards:
- id: phase-04-deep-learning-vision-nlp-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Embedding và phân loại văn bản” là gì?
  question_en: Define embeddings and text classifiers in your own words. What are the input, transformation
    and output?
  answer_vi: Embedding tra ID thành vector; masked pooling gom đúng token của từng câu. PAD=0 chưa đủ vì mẫu
    số cần số token thật. Chất lượng semantic còn phụ thuộc model, dữ liệu và mục tiêu huấn luyện, phải đo
    bằng retrieval có nhãn.
  answer_en: Embedding looks up vectors by ID; masked pooling aggregates each sentence's real tokens. PAD=0
    is insufficient because the denominator must count valid tokens. Semantic quality depends on the model,
    data and objective and needs labeled retrieval evaluation.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-04-deep-learning-vision-nlp-3-application
  type: application
  question_vi: Chạy ví dụ, thêm ba PAD và xác nhận pooled không đổi. Viết ca sai mask shape, mask float và
    câu toàn PAD. Tính tay gradient token 2, rồi so với autograd. Đảo `[1,2]` thành `[2,1]` và giải thích vì
    sao pooling vẫn bằng nhau.
  question_en: Run the example, add three PAD tokens and check unchanged pooling. Test a wrong mask shape,
    float mask and all-PAD sentence. Calculate token 2's gradient by hand and compare autograd. Reverse `[1,2]`
    to `[2,1]` and explain the unchanged mean.
  answer_vi: Token 2 chỉ ở câu đầu và mẫu số bằng 2 nên mỗi thành phần nhận 0.5. Đảo thứ tự không đổi tổng
    vector. Không dùng tính bất biến đó để kết luận model hiểu phủ định; đó chính là giới hạn mà ví dụ training
    đã phơi bày.
  answer_en: Token 2 appears only in the first sentence with denominator 2, so each coordinate gets 0.5. Reversing
    order preserves the sum. This invariance does not imply understanding negation; it exposes the training
    example's limitation.
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-04-deep-learning-vision-nlp-3-debug
  type: debug
  question_vi: Khi làm bài “Embedding và phân loại văn bản”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If embeddings and text classifiers produces a wrong result or a metric drops, what would you
    debug first?
  answer_vi: Nếu thêm PAD làm đổi vector, kiểm tra mẫu số và trục pooling. Nếu vector không đổi khi đảo từ,
    đó là thuộc tính mean pooling, không phải bằng chứng hiểu thứ tự.
  answer_en: If added PAD changes vectors, inspect the denominator and pooling axis. If word reversal changes
    nothing, that is mean pooling's order invariance, not evidence of order understanding.
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-04-deep-learning-vision-nlp-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Embedding và phân loại văn bản” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of embeddings and text
    classifiers?
  answer_vi: Embedding tra ID thành vector; masked pooling gom đúng token của từng câu. PAD=0 chưa đủ vì mẫu
    số cần số token thật. Chất lượng semantic còn phụ thuộc model, dữ liệu và mục tiêu huấn luyện, phải đo
    bằng retrieval có nhãn. Token 2 chỉ ở câu đầu và mẫu số bằng 2 nên mỗi thành phần nhận 0.5. Đảo thứ tự
    không đổi tổng vector. Không dùng tính bất biến đó để kết luận model hiểu phủ định; đó chính là giới hạn
    mà ví dụ training đã phơi bày.
  answer_en: Embedding looks up vectors by ID; masked pooling aggregates each sentence's real tokens. PAD=0
    is insufficient because the denominator must count valid tokens. Semantic quality depends on the model,
    data and objective and needs labeled retrieval evaluation. Token 2 appears only in the first sentence with
    denominator 2, so each coordinate gets 0.5. Reversing order preserves the sum. This invariance does not
    imply understanding negation; it exposes the training example's limitation.
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Embedding và phân loại văn bản / Embeddings and text classifiers

## Tiếng Việt

Tokenization chia văn bản thành đơn vị mà mô hình xử lý; token có thể là một phần từ, không nhất thiết là một từ hoàn chỉnh. Embedding ánh xạ các đơn vị đó thành vector để mô hình tính toán, không trực tiếp cho biết câu đúng hay sai.

Embedding tĩnh gán một vector cho mỗi ID trong bảng tra. Biểu diễn theo ngữ cảnh còn phụ thuộc các token xung quanh. Muốn phân loại cả câu, cần cách gom biểu diễn và xử lý padding để phần đệm không vô tình chi phối kết quả.

Tự kiểm tra: trung bình mọi vector trong lô đã cho một vector đúng cho mỗi câu chưa? Chưa; phải gom theo chiều token của từng câu và loại vị trí đệm theo mask. Giữ tokenizer, giới hạn độ dài và quy tắc gom nhất quán khi huấn luyện và dự đoán.

## Padding bằng 0 vẫn có thể làm sai vector câu

Giả sử token 1 có vector [2,0], token 2 có [0,4], PAD có [0,0]. Câu `[1,2,0]` phải được gom thành ([2,0]+[0,4])/2=[1,2], không phải chia 3. Câu `[1,0,0]` cho [2,0]. Thêm hai PAD không được làm thay đổi nội dung câu hay vector gom. `padding_idx=0` giữ gradient của dòng PAD bằng 0, nhưng không tự sửa mẫu số của `.mean(dim=1)`.

`masked_mean` nhận vectors `[B,T,D]` và mask boolean `[B,T]`. Mẫu số là số vị trí True của từng câu. Hàm chủ động từ chối sai shape và câu toàn PAD, thay vì biến đầu vào rỗng thành một vector trông có vẻ hợp lệ bằng clamp. Trong hệ thống thật, có thể chọn trả trạng thái empty thay vì exception, nhưng phải giữ chính sách đó nhất quán giữa indexing và query.

Khi cộng các thành phần của pooled vectors làm loss và backward, token 1 xuất hiện trong hai câu nên gradient bằng [1.5,1.5]: mỗi thành phần nhận 1/2 từ câu hai token và 1 từ câu một token. Dòng PAD nhận [0,0]. Điều này nối trực tiếp phép gom với autograd và mô hình phân loại ở bài trước.

## Embedding nào dùng cho tìm kiếm?

Bảng `nn.Embedding` trong ví dụ được gán số bằng tay để kiểm tra phép tính. Bảng được học trên tám câu phân loại ở bài training cũng chỉ tối ưu cho nhiệm vụ đó. Cả hai chưa phải sentence embedding pretrained có chất lượng semantic được đánh giá. Transformer tạo biểu diễn token theo ngữ cảnh; sentence encoder còn cần pooling, mục tiêu huấn luyện và quy tắc chuẩn hóa phù hợp. Cosine similarity giữa hai vector bất kỳ không tự trở thành thước đo đúng nghĩa.

Khi nối sang RAG, dùng đúng tokenizer/model/version/giới hạn độ dài/pooling cho cả tài liệu và câu hỏi. Kiểm tra model card về tiếng Việt và nhiệm vụ retrieval, đo recall trên bộ truy vấn có nhãn và so với baseline từ khóa. Nếu thử model thật, dùng nhánh Colab đã có của lab retrieval; bài này không yêu cầu tải model về máy và không gán kết quả semantic cho vector đồ chơi.

Gợi ý nghiên cứu: T13, bằng chứng M + H (metadata và 6 ảnh, trong đó hai ảnh Tensor trùng nội dung). Chưa có transcript hoặc xác nhận xem toàn bộ video. Bài này dùng nguồn PyTorch chính thức và ví dụ tự kiểm thử; không tái sử dụng ảnh TikTok hay suy ra hiệu quả nghề nghiệp từ nội dung quảng bá.

### Thực hành và nghiệm thu

Chạy ví dụ, thêm ba PAD và xác nhận pooled không đổi. Viết ca sai mask shape, mask float và câu toàn PAD. Tính tay gradient token 2, rồi so với autograd. Đảo `[1,2]` thành `[2,1]` và giải thích vì sao pooling vẫn bằng nhau.

- Pooled đúng [[1,2],[2,0]], padding_invariant=True nhưng naive_mean_invariant=False.
- Gradient PAD [0,0], token 1 [1.5,1.5], token 2 [0.5,0.5]; ba ca mask sai bị từ chối.
- Giải thích mất thứ tự và không gọi bảng vector số tay là pretrained semantic embedding.

### Gợi ý đối chiếu sau khi làm

Token 2 chỉ ở câu đầu và mẫu số bằng 2 nên mỗi thành phần nhận 0.5. Đảo thứ tự không đổi tổng vector. Không dùng tính bất biến đó để kết luận model hiểu phủ định; đó chính là giới hạn mà ví dụ training đã phơi bày.

## English

Tokenization divides text into units a model processes; a token may be part of a word rather than a whole word. Embeddings map these units to vectors for computation, not directly to judgments of factual truth.

A static embedding table associates each ID with a vector. Contextual representations also depend on surrounding tokens. Sentence classification requires a pooling rule and padding handling so padded positions do not unintentionally dominate the result.

Self-check: does averaging every vector in a batch produce one correct vector per sentence? No; pool over each sentence's token axis and exclude padding positions with a mask. Keep tokenizer, length limits and pooling consistent between training and prediction.

## Zero padding can still distort sentence vectors

Let token 1 be [2,0], token 2 [0,4], and PAD [0,0]. Sentence `[1,2,0]` should pool to ([2,0]+[0,4])/2=[1,2], not divide by 3. Sentence `[1,0,0]` becomes [2,0]. Adding two PAD tokens must preserve its content and pooled representation. `padding_idx=0` suppresses the PAD row gradient but does not repair the denominator in `.mean(dim=1)`.

`masked_mean` accepts vectors `[B,T,D]` and a boolean mask `[B,T]`. Each denominator counts True positions in its sentence. It rejects shape mismatches and all-PAD sentences instead of using clamp to turn empty text into an apparently valid representation. A real system may return an explicit empty status instead of raising, but indexing and querying must use the same policy.

If we sum pooled-vector components as a loss and backpropagate, token 1 receives gradient [1.5,1.5]: each coordinate receives 1/2 from the two-token sentence and 1 from the one-token sentence. PAD receives [0,0]. This connects pooling directly to autograd and the preceding classifier.

## Which embeddings belong in search?

This `nn.Embedding` table is hand-assigned to expose arithmetic. The table trained on eight classifier sentences optimizes only that tiny task. Neither is an evaluated pretrained semantic sentence encoder. Transformers produce contextual token representations; sentence encoders additionally depend on pooling, training objectives and appropriate normalization. Cosine similarity between arbitrary vectors is not automatically a meaningful semantic score.

For RAG, use the same tokenizer/model/version/length limit/pooling contract for documents and queries. Check model-card coverage of Vietnamese and retrieval, measure recall on labeled queries and compare with a lexical baseline. Use the existing retrieval lab's Colab branch when trying a real model. This lesson requires no local model download and makes no semantic-quality claim about toy vectors.

Research prompt: T13, evidence M + H (metadata and six images, including two duplicate Tensor images). No full transcript or full-video verification. This lesson uses official PyTorch references and independently tested examples; it does not reuse TikTok images or infer career outcomes from promotional claims.

### Practice and acceptance

Run the example, add three PAD tokens and check unchanged pooling. Test a wrong mask shape, float mask and all-PAD sentence. Calculate token 2's gradient by hand and compare autograd. Reverse `[1,2]` to `[2,1]` and explain the unchanged mean.

- Pooling equals [[1,2],[2,0]], padding_invariant=True, but naive_mean_invariant=False.
- PAD gradient is [0,0], token 1 [1.5,1.5], token 2 [0.5,0.5]; reject the three invalid-mask cases.
- Explain order loss and do not label hand-assigned vectors as pretrained semantic embeddings.

### Check after attempting

Token 2 appears only in the first sentence with denominator 2, so each coordinate gets 0.5. Reversing order preserves the sum. This invariance does not imply understanding negation; it exposes the training example's limitation.
