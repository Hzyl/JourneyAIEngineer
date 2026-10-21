---
lesson_id: phase-04-deep-learning-vision-nlp-4
phase_id: phase-04-deep-learning
module_id: vision-nlp
title_vi: Tổng quan attention và Transformer
title_en: Attention and a Transformer overview
summary_vi: Tính scaled dot-product attention thật, kiểm tra causal/padding mask, rồi nối shape với một TransformerEncoderLayer
  có thông tin vị trí.
summary_en: Compute scaled dot-product attention, test causal/padding masks and connect shapes to a position-aware
  TransformerEncoderLayer.
learning_objectives: &id001
- Bản gốc causal [1,2,0], bidirectional [2,2,0]; attention vào PAD bằng 0.
- Bản V thứ hai=9 cho causal [1,5,0], bidirectional [5,5,0]; token đầu không đọc được tương lai.
- Giải thích hai quy ước mask, kiểm tra đầu ra encoder [1,3,4] hữu hạn và nói rõ model chưa huấn luyện.
learning_objectives_en: &id002
- Original causal output [1,2,0], bidirectional [2,2,0]; PAD attention is zero.
- With second V=9, causal gives [1,5,0], bidirectional [5,5,0]; the first token cannot read the future.
- Explain both mask conventions, check finite encoder output [1,3,4] and explicitly identify its untrained
  state.
prerequisites:
- phase-04-deep-learning-vision-nlp-3
- phase-03-classical-ml-ml-framing-1
key_terms:
- attention
- transformer
- overview
- PyTorch
- tensor
- loss
- training
- vision-nlp
concept_notes_vi: |-
  Attention tạo trọng số để kết hợp thông tin từ các vị trí. Trong scaled dot-product attention, query được so với key, rồi các trọng số chuẩn hóa được dùng để tổng hợp value. Query, key và value là các biểu diễn được tính từ dữ liệu, không phải ba kho văn bản riêng.

  Self-attention lấy các biểu diễn từ cùng chuỗi; cross-attention cho một chuỗi truy vấn thông tin của chuỗi khác. Transformer kết hợp attention với các lớp biến đổi, kết nối residual và thông tin vị trí; attention không phải toàn bộ kiến trúc.

  Tự kiểm tra: mô hình dự đoán token tiếp theo có được nhìn token tương lai khi huấn luyện không? Không trong cơ chế causal chuẩn; mặt nạ phải chặn thông tin tương lai. Trọng số attention cao cũng không tự chứng minh quan hệ nhân quả hay giải thích đầy đủ quyết định của mô hình.

  ## Nhìn phép attention qua một ca tính được bằng tay

  Hàm attention của lab nhận Q,K,V `[B,T,D]` cùng shape để giữ bài nhỏ; API tổng quát có thể có độ dài query/key và chiều value khác nhau. Trong model học thật, Q=XWq, K=XWk, V=XWv là các phép chiếu học được. Điểm QKᵀ/√D có shape `[B,T,T]`: hàng là vị trí đang hỏi, cột là vị trí được đọc. Softmax chạy trên cột key, không phải trên batch.

  Đặt Q=K=0 để mọi vị trí được phép đọc có cùng trọng số. V chứa [1,0], [3,0] và PAD giả [100,100]. Với causal mask, token đầu chỉ đọc chính nó nên ra 1; token thứ hai đọc hai giá trị nên ra 2. Không causal thì cả hai token thật đều ra 2. Giá trị PAD 100 không được lọt vào tổng. Padding query cũng được đặt đầu ra bằng 0; chặn key PAD thôi chưa tự loại đầu ra query PAD.

  Hợp đồng lab dùng mask True nghĩa là vị trí thật và chỉ chấp nhận right padding, câu không rỗng. Nhờ token đầu thật, mỗi query causal hợp lệ có ít nhất một key để đọc; không softmax một hàng toàn −∞. Đừng bê nguyên ý nghĩa boolean giữa API: `scaled_dot_product_attention` dùng True cho vị trí được đọc, còn `TransformerEncoderLayer.src_key_padding_mask` dùng True cho PAD cần chặn, nên truyền `~valid`.

  ## Từ một head đến Transformer

  Đoạn cuối dùng token embedding cộng position embedding rồi đưa qua `nn.TransformerEncoderLayer(d_model=4,nhead=2,batch_first=True)`. Khối thật có multi-head self-attention, feed-forward, residual và layer normalization. Nó giữ shape `[1,3,4]`, nhưng các tham số và vị trí đều ngẫu nhiên chưa huấn luyện; không dùng vector này làm bằng chứng semantic retrieval. Encoder trong đoạn cuối là bidirectional, khác nhánh causal tính tay. Chọn causal cho dự đoán token kế tiếp; encoder phân loại/tìm kiếm thường được phép dùng ngữ cảnh hai phía theo thiết kế model.

  `eval()` tắt dropout của module; `no_grad()` tránh dựng đồ thị. Với API functional scaled_dot_product_attention, phải tự truyền dropout_p=0 khi eval. Seed chỉ hỗ trợ tái lập môi trường thử, không bảo đảm mọi kernel/thiết bị cho số giống tuyệt đối. Attention score cao không tự chứng minh quan hệ nhân quả.

  Gợi ý nghiên cứu: T13, bằng chứng M + H (metadata và 6 ảnh, trong đó hai ảnh Tensor trùng nội dung). Chưa có transcript hoặc xác nhận xem toàn bộ video. Bài này dùng nguồn PyTorch chính thức và ví dụ tự kiểm thử; không tái sử dụng ảnh TikTok hay suy ra hiệu quả nghề nghiệp từ nội dung quảng bá.
concept_notes_en: |-
  Attention assigns weights for combining information across positions. In scaled dot-product attention, queries are compared with keys, and normalized weights combine values. Queries, keys and values are representations computed from data, not three separate text repositories.

  Self-attention draws representations from the same sequence; cross-attention lets one sequence query another. Transformers combine attention with transformations, residual connections and positional information; attention alone is not the entire architecture.

  Self-check: may a next-token model see future tokens during training? Not under standard causal attention; a mask must block future information. A high attention weight also does not establish causality or fully explain a model decision.

  ## Inspect attention with hand-checkable numbers

  This lab accepts equal-shape Q,K,V `[B,T,D]` to keep the example small; general APIs can support different query/key lengths and value dimensions. In a trained model, Q=XWq, K=XWk and V=XWv are learned projections. QKᵀ/√D has shape `[B,T,T]`: rows are query positions and columns are readable keys. Softmax normalizes the key axis, never the batch.

  Set Q=K=0 so every allowed key gets equal weight. V contains [1,0], [3,0] and a dummy PAD [100,100]. Causal attention lets the first token read only itself, producing 1; the second reads both values and produces 2. Without causality, both real tokens produce 2. PAD's value 100 must not enter the sum. We explicitly zero padded-query outputs; blocking PAD keys alone does not eliminate padded-query output.

  The lab contract uses True for real positions and accepts only nonempty right-padded sentences. A real first token ensures every valid causal query has a readable key, avoiding softmax over an all−∞ row. Boolean mask conventions differ: `scaled_dot_product_attention` uses True for participation, whereas `TransformerEncoderLayer.src_key_padding_mask` uses True for excluded PAD positions, hence `~valid`.

  ## From one head to a Transformer

  The final section adds token and position embeddings and runs `nn.TransformerEncoderLayer(d_model=4,nhead=2,batch_first=True)`. This real block includes multi-head self-attention, feed-forward layers, residual connections and layer normalization. Its shape remains `[1,3,4]`, but all parameters and positions are untrained random values, not evidence of semantic retrieval quality. This encoder section is bidirectional, unlike the hand-calculated causal branch. Causality belongs to next-token prediction; classification/retrieval encoders often use both sides of context according to their design.

  `eval()` disables module dropout; `no_grad()` avoids building a graph. Functional scaled_dot_product_attention requires explicitly setting dropout_p=0 for evaluation. A seed helps reproduce the test environment but does not guarantee bitwise equality across devices and kernels. High attention scores alone do not establish causality.

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
    task: Chạy ví dụ rồi đổi V của token thứ hai từ [3,0] thành [9,0]. Dự đoán đầu ra causal và bidirectional.
      Đổi PAD từ 100 thành 999 và xác nhận hai token thật không đổi. Thử câu toàn PAD, left padding và mask
      sai shape; phải bị từ chối.
    deliverables: *id001
    checkpoint: Bản gốc causal [1,2,0], bidirectional [2,2,0]; attention vào PAD bằng 0. Bản V thứ hai=9 cho
      causal [1,5,0], bidirectional [5,5,0]; token đầu không đọc được tương lai. Giải thích hai quy ước mask,
      kiểm tra đầu ra encoder [1,3,4] hữu hạn và nói rõ model chưa huấn luyện.
    stretch: So kết quả tự tính với torch.nn.functional.scaled_dot_product_attention dùng mask allowed và dropout_p=0;
      kiểm tra gradient Q/K/V hữu hạn trên dữ liệu không đồng nhất.
  en:
    task: Run the example, then change the second value from [3,0] to [9,0]. Predict causal and bidirectional
      outputs. Change PAD from 100 to 999 and verify real-token outputs are unchanged. Reject all-PAD, left-padded
      and wrong-shape masks.
    deliverables: *id002
    checkpoint: Original causal output [1,2,0], bidirectional [2,2,0]; PAD attention is zero. With second V=9,
      causal gives [1,5,0], bidirectional [5,5,0]; the first token cannot read the future. Explain both mask
      conventions, check finite encoder output [1,3,4] and explicitly identify its untrained state.
    stretch: Compare the manual implementation with torch.nn.functional.scaled_dot_product_attention using
      an allowed mask and dropout_p=0; verify finite Q/K/V gradients on nonuniform inputs.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Tổng quan attention và Transformer” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain attention and a transformer overview to a new teammate?
  - Which assumption behind attention and a transformer overview could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- Attention(Q,K,V) = softmax(QKᵀ / √d_k)V
code_examples:
- language: python
  title: attention_mask.py
  code: |
    """Single-head attention arithmetic, then an untrained Transformer encoder block."""
    import math

    import torch
    from torch import nn


    def attention(q, k, v, valid, causal=True):
        if q.ndim != 3 or q.shape != k.shape or q.shape != v.shape:
            raise ValueError("this lab expects Q,K,V with equal shape [B,T,D]")
        if q.shape[0] == 0 or q.shape[1] == 0 or q.shape[2] == 0:
            raise ValueError("Q,K,V must be nonempty")
        if valid.shape != q.shape[:2] or valid.dtype != torch.bool:
            raise ValueError("valid must be boolean [B,T]")
        if not torch.all(valid[:, 0]) or torch.any(valid[:, 1:] & ~valid[:, :-1]):
            raise ValueError("use nonempty sentences with right padding")
        if not (q.device == k.device == v.device == valid.device):
            raise ValueError("all inputs must be on the same device")
        scores = q @ k.transpose(-2, -1) / math.sqrt(q.shape[-1])
        allowed = valid.unsqueeze(1).expand(-1, q.shape[1], -1)
        if causal:
            allowed = allowed & torch.ones(q.shape[1], q.shape[1], dtype=torch.bool,
                                           device=q.device).tril()
        weights = torch.softmax(scores.masked_fill(~allowed, float("-inf")), dim=-1)
        # Padding keys cannot be read; padding queries are explicitly zeroed afterwards.
        weights = weights * valid.unsqueeze(-1)
        return weights @ v, weights


    def demo():
        torch.set_num_threads(1)
        torch.manual_seed(7)
        q = torch.zeros(1, 3, 2)
        k = torch.zeros_like(q)
        v = torch.tensor([[[1.0, 0.0], [3.0, 0.0], [100.0, 100.0]]])
        valid = torch.tensor([[True, True, False]])
        causal_output, weights = attention(q, k, v, valid)
        full_output, _ = attention(q, k, v, valid, causal=False)
        print("causal", causal_output[0, :, 0].tolist())
        print("bidirectional", full_output[0, :, 0].tolist())
        print("weights", weights[0].tolist())

        # A real encoder layer includes multi-head attention, FFN, residuals and norms.
        # The positional table and encoder here are random, NOT pretrained NLP embeddings.
        ids = torch.tensor([[1, 2, 0]])
        token_embedding = nn.Embedding(3, 4, padding_idx=0)
        position_embedding = nn.Embedding(3, 4)
        x = token_embedding(ids) + position_embedding(torch.arange(3)).unsqueeze(0)
        layer = nn.TransformerEncoderLayer(4, 2, dim_feedforward=8, dropout=0.1, batch_first=True)
        layer.eval()
        with torch.no_grad():
            output = layer(x, src_key_padding_mask=~valid)
            output = output.masked_fill(~valid.unsqueeze(-1), 0.0)
        print("encoder_shape", tuple(output.shape), "finite", bool(torch.isfinite(output).all()))


    if __name__ == "__main__":
        demo()
  status: runnable
  purpose_vi: Tính scaled dot-product attention thật, kiểm tra causal/padding mask, rồi nối shape với một TransformerEncoderLayer
    có thông tin vị trí.
  purpose_en: Compute scaled dot-product attention, test causal/padding masks and connect shapes to a position-aware
    TransformerEncoderLayer.
  setup: 'Google Colab: tạo notebook Python mới, chọn CPU, dán toàn bộ ví dụ vào một cell rồi chạy; không cần
    clone repo, GPU, API key hay tải model. / Create a Python notebook in Google Colab, use a CPU runtime and
    paste the complete example into one cell. No clone, GPU, API key or model download is needed. Requires
    Python 3.11+ and PyTorch 2.x; the verification environment used torch 2.14.1+cpu. Run `import torch; print(torch.__version__)`
    first; if unavailable, choose a runtime with PyTorch instead of installing packages on a weak local machine.
    The learning website displays code; execution happens in Colab or your own Python environment.'
  expected_output: |-
    causal [1.0, 2.0, 0.0]
    bidirectional [2.0, 2.0, 0.0]
    weights [[1.0, 0.0, 0.0], [0.5, 0.5, 0.0], [0.0, 0.0, 0.0]]
    encoder_shape (1, 3, 4) finite True
  edge_case_vi: Nếu token đầu causal đổi khi sửa token sau, kiểm tra tam giác mask, trục softmax và quy ước
    True. Nếu NaN, tìm hàng toàn bị che; nếu PAD ảnh hưởng kết quả, kiểm tra cả key và query mask.
  edge_case_en: If the first causal output changes when a later token changes, inspect mask triangle, softmax
    axis and True convention. For NaNs, look for fully masked rows; for PAD leakage, check both key and query
    masking.
  explanation_vi: 'QKᵀ=0 nên softmax đều trên key hợp lệ. Hàng đầu causal chỉ có một key; hàng thứ hai lấy
    trung bình 1 và 9. Giữ PAD bị chặn dù giá trị lớn hơn, và zero riêng hàng query PAD. Khi bỏ causal, thay
    đổi token tương lai ảnh hưởng token đầu: đây là kiểm tra hành vi, không chỉ kiểm tra shape.'
  explanation_en: 'QKᵀ=0 makes softmax uniform over valid keys. The first causal row has one key; the second
    averages 1 and 9. Keep PAD blocked regardless of magnitude and zero padded-query rows separately. Without
    causality, changing a future token affects the first output: this checks behavior, not just shape.'
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
- title: PyTorch scaled dot-product attention
  url: https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html
  language: en
  kind: official
  required: true
  purpose_vi: Tính scaled dot-product attention thật, kiểm tra causal/padding mask, rồi nối shape với một TransformerEncoderLayer
    có thông tin vị trí.
  purpose_en: Compute scaled dot-product attention, test causal/padding masks and connect shapes to a position-aware
    TransformerEncoderLayer.
  read_vi: Đọc công thức tương đương, boolean mask và cảnh báo dropout_p khi eval.
  read_en: Read the equivalent formula, boolean mask convention and dropout_p evaluation warning.
- title: PyTorch TransformerEncoderLayer
  url: https://docs.pytorch.org/docs/stable/generated/torch.nn.TransformerEncoderLayer.html
  language: en
  kind: official
  required: true
  purpose_vi: Đối chiếu thành phần khối Transformer với attention đơn head.
  purpose_en: Compare Transformer block components with single-head attention.
  read_vi: Đọc d_model, nhead, batch_first và src_key_padding_mask.
  read_en: Read d_model, nhead, batch_first and src_key_padding_mask.
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
- phase-04-deep-learning-vision-nlp-4-recall
- phase-04-deep-learning-vision-nlp-4-application
- phase-04-deep-learning-vision-nlp-4-debug
- phase-04-deep-learning-vision-nlp-4-interview
estimated_minutes: 75
completion_checklist: *id001
completion_criteria: *id001
common_mistakes:
- Nếu token đầu causal đổi khi sửa token sau, kiểm tra tam giác mask, trục softmax và quy ước True. Nếu NaN,
  tìm hàng toàn bị che; nếu PAD ảnh hưởng kết quả, kiểm tra cả key và query mask.
- Bỏ qua ca lỗi hoặc coi kết quả dữ liệu tổng hợp là điểm chất lượng thực tế.
- Đọc hướng dẫn trên web rồi tưởng code đã chạy trong trình duyệt; cần chạy ở Colab/Python và lưu output.
next_lessons:
- phase-04-deep-learning-debugging-1
- phase-04-deep-learning-debugging-2
review_question_vi: Nội dung cốt lõi của “Tổng quan attention và Transformer” là gì?
review_question_en: Define attention and a transformer overview in your own words. What are the input, transformation
  and output?
review_answer_vi: Attention tính softmax(QKᵀ/√D)V trên key được phép. Padding mask loại token đệm; causal mask
  chặn tương lai. Transformer còn có vị trí, nhiều head, FFN, residual và normalization; một khối ngẫu nhiên
  chưa có năng lực ngôn ngữ.
review_answer_en: Attention computes softmax(QKᵀ/√D)V over allowed keys. Padding masks exclude PAD; causal
  masks block future tokens. Transformers additionally use positions, multiple heads, FFNs, residuals and normalization;
  a random block has no established language ability.
review_cards:
- id: phase-04-deep-learning-vision-nlp-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Tổng quan attention và Transformer” là gì?
  question_en: Define attention and a transformer overview in your own words. What are the input, transformation
    and output?
  answer_vi: Attention tính softmax(QKᵀ/√D)V trên key được phép. Padding mask loại token đệm; causal mask chặn
    tương lai. Transformer còn có vị trí, nhiều head, FFN, residual và normalization; một khối ngẫu nhiên chưa
    có năng lực ngôn ngữ.
  answer_en: Attention computes softmax(QKᵀ/√D)V over allowed keys. Padding masks exclude PAD; causal masks
    block future tokens. Transformers additionally use positions, multiple heads, FFNs, residuals and normalization;
    a random block has no established language ability.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-04-deep-learning-vision-nlp-4-application
  type: application
  question_vi: Chạy ví dụ rồi đổi V của token thứ hai từ [3,0] thành [9,0]. Dự đoán đầu ra causal và bidirectional.
    Đổi PAD từ 100 thành 999 và xác nhận hai token thật không đổi. Thử câu toàn PAD, left padding và mask sai
    shape; phải bị từ chối.
  question_en: Run the example, then change the second value from [3,0] to [9,0]. Predict causal and bidirectional
    outputs. Change PAD from 100 to 999 and verify real-token outputs are unchanged. Reject all-PAD, left-padded
    and wrong-shape masks.
  answer_vi: 'QKᵀ=0 nên softmax đều trên key hợp lệ. Hàng đầu causal chỉ có một key; hàng thứ hai lấy trung
    bình 1 và 9. Giữ PAD bị chặn dù giá trị lớn hơn, và zero riêng hàng query PAD. Khi bỏ causal, thay đổi
    token tương lai ảnh hưởng token đầu: đây là kiểm tra hành vi, không chỉ kiểm tra shape.'
  answer_en: 'QKᵀ=0 makes softmax uniform over valid keys. The first causal row has one key; the second averages
    1 and 9. Keep PAD blocked regardless of magnitude and zero padded-query rows separately. Without causality,
    changing a future token affects the first output: this checks behavior, not just shape.'
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-04-deep-learning-vision-nlp-4-debug
  type: debug
  question_vi: Khi làm bài “Tổng quan attention và Transformer”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If attention and a transformer overview produces a wrong result or a metric drops, what would
    you debug first?
  answer_vi: Nếu token đầu causal đổi khi sửa token sau, kiểm tra tam giác mask, trục softmax và quy ước True.
    Nếu NaN, tìm hàng toàn bị che; nếu PAD ảnh hưởng kết quả, kiểm tra cả key và query mask.
  answer_en: If the first causal output changes when a later token changes, inspect mask triangle, softmax
    axis and True convention. For NaNs, look for fully masked rows; for PAD leakage, check both key and query
    masking.
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-04-deep-learning-vision-nlp-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Tổng quan attention và Transformer” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of attention and a transformer
    overview?
  answer_vi: 'Attention tính softmax(QKᵀ/√D)V trên key được phép. Padding mask loại token đệm; causal mask
    chặn tương lai. Transformer còn có vị trí, nhiều head, FFN, residual và normalization; một khối ngẫu nhiên
    chưa có năng lực ngôn ngữ. QKᵀ=0 nên softmax đều trên key hợp lệ. Hàng đầu causal chỉ có một key; hàng
    thứ hai lấy trung bình 1 và 9. Giữ PAD bị chặn dù giá trị lớn hơn, và zero riêng hàng query PAD. Khi bỏ
    causal, thay đổi token tương lai ảnh hưởng token đầu: đây là kiểm tra hành vi, không chỉ kiểm tra shape.'
  answer_en: 'Attention computes softmax(QKᵀ/√D)V over allowed keys. Padding masks exclude PAD; causal masks
    block future tokens. Transformers additionally use positions, multiple heads, FFNs, residuals and normalization;
    a random block has no established language ability. QKᵀ=0 makes softmax uniform over valid keys. The first
    causal row has one key; the second averages 1 and 9. Keep PAD blocked regardless of magnitude and zero
    padded-query rows separately. Without causality, changing a future token affects the first output: this
    checks behavior, not just shape.'
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Tổng quan attention và Transformer / Attention and a Transformer overview

## Tiếng Việt

Attention tạo trọng số để kết hợp thông tin từ các vị trí. Trong scaled dot-product attention, query được so với key, rồi các trọng số chuẩn hóa được dùng để tổng hợp value. Query, key và value là các biểu diễn được tính từ dữ liệu, không phải ba kho văn bản riêng.

Self-attention lấy các biểu diễn từ cùng chuỗi; cross-attention cho một chuỗi truy vấn thông tin của chuỗi khác. Transformer kết hợp attention với các lớp biến đổi, kết nối residual và thông tin vị trí; attention không phải toàn bộ kiến trúc.

Tự kiểm tra: mô hình dự đoán token tiếp theo có được nhìn token tương lai khi huấn luyện không? Không trong cơ chế causal chuẩn; mặt nạ phải chặn thông tin tương lai. Trọng số attention cao cũng không tự chứng minh quan hệ nhân quả hay giải thích đầy đủ quyết định của mô hình.

## Nhìn phép attention qua một ca tính được bằng tay

Hàm attention của lab nhận Q,K,V `[B,T,D]` cùng shape để giữ bài nhỏ; API tổng quát có thể có độ dài query/key và chiều value khác nhau. Trong model học thật, Q=XWq, K=XWk, V=XWv là các phép chiếu học được. Điểm QKᵀ/√D có shape `[B,T,T]`: hàng là vị trí đang hỏi, cột là vị trí được đọc. Softmax chạy trên cột key, không phải trên batch.

Đặt Q=K=0 để mọi vị trí được phép đọc có cùng trọng số. V chứa [1,0], [3,0] và PAD giả [100,100]. Với causal mask, token đầu chỉ đọc chính nó nên ra 1; token thứ hai đọc hai giá trị nên ra 2. Không causal thì cả hai token thật đều ra 2. Giá trị PAD 100 không được lọt vào tổng. Padding query cũng được đặt đầu ra bằng 0; chặn key PAD thôi chưa tự loại đầu ra query PAD.

Hợp đồng lab dùng mask True nghĩa là vị trí thật và chỉ chấp nhận right padding, câu không rỗng. Nhờ token đầu thật, mỗi query causal hợp lệ có ít nhất một key để đọc; không softmax một hàng toàn −∞. Đừng bê nguyên ý nghĩa boolean giữa API: `scaled_dot_product_attention` dùng True cho vị trí được đọc, còn `TransformerEncoderLayer.src_key_padding_mask` dùng True cho PAD cần chặn, nên truyền `~valid`.

## Từ một head đến Transformer

Đoạn cuối dùng token embedding cộng position embedding rồi đưa qua `nn.TransformerEncoderLayer(d_model=4,nhead=2,batch_first=True)`. Khối thật có multi-head self-attention, feed-forward, residual và layer normalization. Nó giữ shape `[1,3,4]`, nhưng các tham số và vị trí đều ngẫu nhiên chưa huấn luyện; không dùng vector này làm bằng chứng semantic retrieval. Encoder trong đoạn cuối là bidirectional, khác nhánh causal tính tay. Chọn causal cho dự đoán token kế tiếp; encoder phân loại/tìm kiếm thường được phép dùng ngữ cảnh hai phía theo thiết kế model.

`eval()` tắt dropout của module; `no_grad()` tránh dựng đồ thị. Với API functional scaled_dot_product_attention, phải tự truyền dropout_p=0 khi eval. Seed chỉ hỗ trợ tái lập môi trường thử, không bảo đảm mọi kernel/thiết bị cho số giống tuyệt đối. Attention score cao không tự chứng minh quan hệ nhân quả.

Gợi ý nghiên cứu: T13, bằng chứng M + H (metadata và 6 ảnh, trong đó hai ảnh Tensor trùng nội dung). Chưa có transcript hoặc xác nhận xem toàn bộ video. Bài này dùng nguồn PyTorch chính thức và ví dụ tự kiểm thử; không tái sử dụng ảnh TikTok hay suy ra hiệu quả nghề nghiệp từ nội dung quảng bá.

### Thực hành và nghiệm thu

Chạy ví dụ rồi đổi V của token thứ hai từ [3,0] thành [9,0]. Dự đoán đầu ra causal và bidirectional. Đổi PAD từ 100 thành 999 và xác nhận hai token thật không đổi. Thử câu toàn PAD, left padding và mask sai shape; phải bị từ chối.

- Bản gốc causal [1,2,0], bidirectional [2,2,0]; attention vào PAD bằng 0.
- Bản V thứ hai=9 cho causal [1,5,0], bidirectional [5,5,0]; token đầu không đọc được tương lai.
- Giải thích hai quy ước mask, kiểm tra đầu ra encoder [1,3,4] hữu hạn và nói rõ model chưa huấn luyện.

### Gợi ý đối chiếu sau khi làm

QKᵀ=0 nên softmax đều trên key hợp lệ. Hàng đầu causal chỉ có một key; hàng thứ hai lấy trung bình 1 và 9. Giữ PAD bị chặn dù giá trị lớn hơn, và zero riêng hàng query PAD. Khi bỏ causal, thay đổi token tương lai ảnh hưởng token đầu: đây là kiểm tra hành vi, không chỉ kiểm tra shape.

## English

Attention assigns weights for combining information across positions. In scaled dot-product attention, queries are compared with keys, and normalized weights combine values. Queries, keys and values are representations computed from data, not three separate text repositories.

Self-attention draws representations from the same sequence; cross-attention lets one sequence query another. Transformers combine attention with transformations, residual connections and positional information; attention alone is not the entire architecture.

Self-check: may a next-token model see future tokens during training? Not under standard causal attention; a mask must block future information. A high attention weight also does not establish causality or fully explain a model decision.

## Inspect attention with hand-checkable numbers

This lab accepts equal-shape Q,K,V `[B,T,D]` to keep the example small; general APIs can support different query/key lengths and value dimensions. In a trained model, Q=XWq, K=XWk and V=XWv are learned projections. QKᵀ/√D has shape `[B,T,T]`: rows are query positions and columns are readable keys. Softmax normalizes the key axis, never the batch.

Set Q=K=0 so every allowed key gets equal weight. V contains [1,0], [3,0] and a dummy PAD [100,100]. Causal attention lets the first token read only itself, producing 1; the second reads both values and produces 2. Without causality, both real tokens produce 2. PAD's value 100 must not enter the sum. We explicitly zero padded-query outputs; blocking PAD keys alone does not eliminate padded-query output.

The lab contract uses True for real positions and accepts only nonempty right-padded sentences. A real first token ensures every valid causal query has a readable key, avoiding softmax over an all−∞ row. Boolean mask conventions differ: `scaled_dot_product_attention` uses True for participation, whereas `TransformerEncoderLayer.src_key_padding_mask` uses True for excluded PAD positions, hence `~valid`.

## From one head to a Transformer

The final section adds token and position embeddings and runs `nn.TransformerEncoderLayer(d_model=4,nhead=2,batch_first=True)`. This real block includes multi-head self-attention, feed-forward layers, residual connections and layer normalization. Its shape remains `[1,3,4]`, but all parameters and positions are untrained random values, not evidence of semantic retrieval quality. This encoder section is bidirectional, unlike the hand-calculated causal branch. Causality belongs to next-token prediction; classification/retrieval encoders often use both sides of context according to their design.

`eval()` disables module dropout; `no_grad()` avoids building a graph. Functional scaled_dot_product_attention requires explicitly setting dropout_p=0 for evaluation. A seed helps reproduce the test environment but does not guarantee bitwise equality across devices and kernels. High attention scores alone do not establish causality.

Research prompt: T13, evidence M + H (metadata and six images, including two duplicate Tensor images). No full transcript or full-video verification. This lesson uses official PyTorch references and independently tested examples; it does not reuse TikTok images or infer career outcomes from promotional claims.

### Practice and acceptance

Run the example, then change the second value from [3,0] to [9,0]. Predict causal and bidirectional outputs. Change PAD from 100 to 999 and verify real-token outputs are unchanged. Reject all-PAD, left-padded and wrong-shape masks.

- Original causal output [1,2,0], bidirectional [2,2,0]; PAD attention is zero.
- With second V=9, causal gives [1,5,0], bidirectional [5,5,0]; the first token cannot read the future.
- Explain both mask conventions, check finite encoder output [1,3,4] and explicitly identify its untrained state.

### Check after attempting

QKᵀ=0 makes softmax uniform over valid keys. The first causal row has one key; the second averages 1 and 9. Keep PAD blocked regardless of magnitude and zero padded-query rows separately. Without causality, changing a future token affects the first output: this checks behavior, not just shape.
