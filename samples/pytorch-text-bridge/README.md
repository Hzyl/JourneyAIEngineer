# PyTorch → text → attention bridge

## Tiếng Việt

Năm ví dụ CPU nhỏ tương ứng với năm bài hiện có, không tạo lộ trình mới:

| File | Bài | Điều cần kiểm chứng |
| --- | --- | --- |
| `tensor_shapes.py` | `pytorch-core-1` | IDs `[B,T]`, embedding `[B,T,D]`, pooling `[B,D]`, DataLoader |
| `autograd_bridge.py` | `pytorch-core-4` | Gradient tính tay, tích lũy, zero_grad và SGD |
| `train_classifier.py` | `training-1` | Train/eval, loss, checkpoint validation, confusion và lỗi thứ tự |
| `masked_pooling.py` | `vision-nlp-3` | Mẫu số chỉ đếm token thật; PAD không đổi vector hoặc gradient |
| `attention_mask.py` | `vision-nlp-4` | Causal/key padding/query padding và một TransformerEncoderLayer thật |

Trên web, mở bài tương ứng, dán **toàn bộ ví dụ** vào một cell của
[Google Colab](https://colab.research.google.com/), dùng runtime Python CPU có PyTorch.
Không cần clone repository, GPU, API key hay tải model. Website chỉ hiển thị bài;
Python chạy trong Colab. Nếu runtime chưa có torch, chọn runtime phù hợp, không cần
cài thêm trên máy cá nhân. Mỗi file độc lập, không cần chạy các bài theo cùng notebook.

Nếu đã có Python/PyTorch, chạy từ root repository:

```bash
python samples/pytorch-text-bridge/tensor_shapes.py
python samples/pytorch-text-bridge/autograd_bridge.py
python samples/pytorch-text-bridge/train_classifier.py
python samples/pytorch-text-bridge/masked_pooling.py
python samples/pytorch-text-bridge/attention_mask.py
python tests/test_pytorch_text_bridge.py
```

Không có lệnh cài đặt, gọi provider hoặc tải dữ liệu ẩn. Ví dụ chỉ dùng dữ liệu tổng
hợp trong mã, một luồng CPU và tối đa 80 epoch rất nhỏ. Python 3.11+, PyTorch 2.x;
lần kiểm chứng dùng torch 2.14.1+cpu. Lưu phiên bản thực tế của bạn khi so kết quả.

Kết quả tham chiếu: train loss `0.6866 → 0.0009`, validation loss `0.0008`, confusion
`[[2,0],[0,2]]` trên **bốn câu validation tổng hợp**. Hai câu có cùng token nhưng thứ tự
khác và nghĩa đối lập nhận cùng nhãn `[0,0]`, chỉ đúng `1/2`. Đây là giới hạn cấu trúc
của mean pooling. Validation đã chọn checkpoint, không phải test độc lập. Những số
này không đo năng lực NLP thực tế; không có benchmark semantic retrieval hay so sánh
pretrained model. Chữ số cuối có thể khác theo phiên bản PyTorch.

Kiểm thử dùng thư viện chuẩn `unittest`. Phần hành vi cần torch; phần đồng bộ code
nhúng trong bài cần PyYAML. Thiếu một dependency sẽ được báo `skipped`, không tự cài.
Trong môi trường repo hiện tại, chạy phần hành vi bằng Python của môi trường CPU
đã có và phần nguồn bằng `.venv`; không suy diễn một skip thành pass.

T13 chỉ là gợi ý chủ đề, nhãn **M + H** (metadata và sáu ảnh; hai ảnh Tensor trùng).
Không có transcript/video đầy đủ, không tái sử dụng ảnh đăng lại, không dùng tỷ lệ
quảng cáo làm kết luận. Giữ nguyên giải thích cũ còn đúng, IDs và dữ liệu học.

## English

These five standalone examples bridge existing tensor, autograd and training lessons
to text embeddings and attention. Paste a complete example into a CPU Python Colab
cell with PyTorch available; no repository clone, GPU, API key or model download is
required. The website displays the lesson; Colab executes Python. Local execution is
optional using an existing Python 3.11+/PyTorch 2.x environment and the commands above.

Tests ran on torch 2.14.1+cpu with one CPU thread. The tiny classifier trains for 80
epochs, selects an in-memory snapshot on validation loss and reports a confusion matrix.
Reference training loss falls from 0.6866 to 0.0009 and all four synthetic validation
sentences are classified correctly. However, two opposite-meaning sentences containing
the same token multiset receive identical predictions, so only one is correct. This
demonstrates mean pooling's order limitation, not real-world NLP quality. Validation
has been used for model selection; an independent held-out test is still needed.

The manually assigned embedding table, tiny task-trained classifier and random
Transformer encoder are explicitly not evaluated pretrained semantic encoders. The
labs test arithmetic, gradient flow and mask behavior; real pretrained retrieval,
GPU execution and live Colab runtime execution are separate verification work.

The standard-library unittest suite reports missing optional torch or PyYAML as skips.
Run behavior checks in an existing PyTorch environment and source synchronization checks
in the repository environment. Do not treat skipped checks as passed checks.

T13 retains evidence label **M + H**, with no full transcript/video verification.
Official sources below ground the implementation, not promotional TikTok claims.

## Official references

- [Tensor operations](https://docs.pytorch.org/tutorials/beginner/basics/tensorqs_tutorial.html)
- [Datasets and DataLoaders](https://docs.pytorch.org/tutorials/beginner/basics/data_tutorial.html)
- [Autograd](https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html)
- [Optimization loop](https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html)
- [Embedding padding and shapes](https://docs.pytorch.org/docs/stable/generated/torch.nn.Embedding.html)
- [Scaled dot-product attention](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html)
- [TransformerEncoderLayer](https://docs.pytorch.org/docs/stable/generated/torch.nn.TransformerEncoderLayer.html)

Official documentation pages returned HTTP 403 during the audit; the corresponding
PyTorch-maintained tutorial and implementation docstrings were read through
`raw.githubusercontent.com/pytorch/tutorials` and `raw.githubusercontent.com/pytorch/pytorch`.
No downloaded source was executed.
