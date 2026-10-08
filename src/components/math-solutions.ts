import type { WorkedLab } from './foundation-solutions'

const setupVi = 'Cần Python 3.11+. Lưu tất cả file trong một thư mục lab riêng. Tạo venv bằng python -m venv .venv và kích hoạt nó (Windows PowerShell: .venv\\Scripts\\Activate.ps1; macOS/Linux: source .venv/bin/activate). Cài thư viện bằng python -m pip install -r requirements.txt. Nếu đã có môi trường học phù hợp thì dùng môi trường đó. Mỗi bộ test mong đợi 5 tests, OK. Script tạo ảnh PNG trong thư mục hiện tại; chạy lại ghi đè ảnh cùng tên.'
const setupEn = 'Requires Python 3.11+. Save all files in a dedicated lab folder. Create a venv with python -m venv .venv and activate it (Windows PowerShell: .venv\\Scripts\\Activate.ps1; macOS/Linux: source .venv/bin/activate). Install packages with python -m pip install -r requirements.txt. An existing suitable learning environment also works. Each test suite expects 5 tests, OK. Scripts write PNG plots in the current folder; rerunning overwrites matching image filenames.'

export const mathSolutions: Record<string, WorkedLab> = {
  'exercise-2-linear-algebra': {
    files: ['pca_demo.py', 'test_solution.py', 'requirements.txt'],
    command: 'python -m unittest -v test_solution.py\npython pca_demo.py',
    vi: {
      approach: 'Tính Xw+b bằng NumPy rồi dùng SVD trên dữ liệu đã trừ trung bình để giữ một thành phần PCA. Quan sát các điểm bị chiếu lên trục ngang.',
      setup: setupVi + ' Mở pca.png sau khi chạy script. NumPy và Matplotlib là hai thư viện cần cài.',
      explanation: [
        'X có shape (4,2), w là (2,), nên X @ w có shape (4,). Với w=[2,-1], b=1: hàng [-2,-1] cho -4+1+1=-2; bốn dự đoán là [-2,-4,6,4]. Đây là tích ma trận-vector, không phải nhân từng phần tử X*w.',
        'Trừ mean theo cột để đặt tâm dữ liệu tại gốc. SVD của X-centered trả các trục trực chuẩn trong Vt, đã sắp theo singular value giảm dần. axes có shape (1,2); scores=centered @ axes.T có shape (4,1).',
        'Dữ liệu ví dụ có biến thiên ngang lớn hơn dọc. Một thành phần giữ 80% tổng phương sai, tái tạo thành [(-2,0),(-2,0),(2,0),(2,0)]; tổng bình phương sai số là 4. Chi tiết trên/dưới trục ngang bị mất.',
        'SVD có thể đổi dấu của trục và scores mà phép tái tạo không đổi. Vì vậy test reconstruction và retained variance, không bắt buộc một dấu cụ thể. Khi các singular value bằng nhau, trục PCA không duy nhất.',
        'PCA ưu tiên phương sai, không biết nhãn hay mức quan trọng của feature. 80% phương sai không có nghĩa 80% độ chính xác. Ví dụ dùng cùng thang đo; trong pipeline thực, cân nhắc scaling và chỉ fit mean/trục trên tập train.',
      ],
      pitfall: 'Dùng w shape (2,1) cho kết quả (4,1); cộng vector shape (4,) có thể broadcast thành (4,4). In shape trước mỗi phép tính và giữ hợp đồng rõ ràng.',
      practice: 'Ẩn lời giải. Nhân feature thứ hai với 10 rồi chạy PCA; dự đoán trục được giữ trước khi xem ảnh. Sau đó giữ hai thành phần và kiểm tra sai số tái tạo gần 0.',
    },
    en: {
      approach: 'Compute Xw+b with NumPy, then use SVD of centered data to retain one PCA component. Inspect the projection onto the horizontal axis.',
      setup: setupEn + ' Open pca.png after running the script. NumPy and Matplotlib are required.',
      explanation: [
        'X has shape (4,2), w has shape (2,), so X @ w has shape (4,). With w=[2,-1] and b=1, row [-2,-1] gives -4+1+1=-2; all predictions are [-2,-4,6,4]. This is matrix-vector multiplication, not elementwise X*w.',
        'Subtract column means to center the data. SVD returns orthonormal directions in Vt ordered by decreasing singular value. axes has shape (1,2); scores=centered @ axes.T has shape (4,1).',
        'The example varies more horizontally than vertically. One component retains 80% of total variance and reconstructs [(-2,0),(-2,0),(2,0),(2,0)], with squared reconstruction error 4. Above/below-axis information is lost.',
        'SVD may flip an axis and its scores without changing reconstruction. Test reconstruction and explained variance instead of requiring a particular sign. Equal singular values make PCA directions non-unique.',
        'PCA favors variance, without knowledge of labels or feature importance. Retaining 80% variance does not imply 80% accuracy. These features share a scale; in a real pipeline, consider scaling and fit the mean/directions on training data only.',
      ],
      pitfall: 'A (2,1) weight matrix produces (4,1) predictions; adding a (4,) vector may broadcast into (4,4). Inspect shapes and keep the contract explicit.',
      practice: 'Hide the solution. Multiply the second feature by 10 and predict the retained direction before inspecting the plot. Retain both components and check reconstruction error is near zero.',
    },
  },
  'exercise-2-calculus': {
    files: ['gradient_demo.py', 'test_solution.py', 'requirements.txt'],
    command: 'python -m unittest -v test_solution.py\npython gradient_demo.py',
    vi: {
      approach: 'Dùng L(w)=(w−3)² để đối chiếu đạo hàm tay, sai phân trung tâm và PyTorch autograd, rồi quan sát ảnh hưởng của learning rate.',
      setup: setupVi + ' Cần PyTorch và Matplotlib; ví dụ chỉ dùng CPU. Mở gradient.png để xem loss và bốn đường cập nhật.',
      explanation: [
        'Chain rule cho dL/dw=2(w−3). Tại w=0 gradient=-6, tại w=3 gradient=0, tại w=5 gradient=4. Cập nhật w←w−η·gradient đi theo chiều giảm loss nếu bước đủ nhỏ.',
        'Sai phân trung tâm [L(w+ε)−L(w−ε)]/(2ε) với ε=1e−5 kiểm tra độc lập đạo hàm. ε quá nhỏ có thể gây mất chính xác do trừ hai số gần bằng nhau; không so sánh float bằng dấu bằng tuyệt đối.',
        'PyTorch tạo tensor float64 với requires_grad=True. torch.autograd.grad lấy đạo hàm của cùng biểu thức. Mỗi lần tạo graph mới, không tích lũy .grad giữa các bước; test so sánh cả ba cách.',
        'Đặt e=w−3 thì e ở bước sau bằng (1−2η)e. Với hàm này: 0<η<1 hội tụ; η=0.5 tới nghiệm trong một bước; η=1 dao động giữa 0 và 6 khi bắt đầu từ 0; η=1.1 làm sai số tăng.',
        'Các ngưỡng trên chỉ đúng cho quadratic này. Trong model nhiều tham số, curvature và scale làm ngưỡng learning rate khác đi. Đồ thị dùng symlog để hiển thị cả loss bằng 0 và loss lớn.',
      ],
      pitfall: 'Gradient sai dấu biến bước giảm thành bước tăng; loss tăng không nhất thiết là lỗi dữ liệu. Autograd cũng chỉ đạo hàm biểu thức bạn đã viết, không xác nhận biểu thức loss đúng yêu cầu.',
      practice: 'Ẩn lời giải. Đổi loss thành 4(w−3)², tự tính gradient và khoảng learning rate hội tụ rồi kiểm chứng lại bằng cả ba cách.',
    },
    en: {
      approach: 'Use L(w)=(w−3)² to compare a hand derivative, central finite differences and PyTorch autograd, then inspect learning-rate effects.',
      setup: setupEn + ' Requires PyTorch and Matplotlib; this example uses CPU only. Open gradient.png for the loss and four update trajectories.',
      explanation: [
        'The chain rule gives dL/dw=2(w−3). The gradient is -6 at w=0, zero at w=3 and 4 at w=5. Updating w←w−η·gradient reduces loss when the step is small enough.',
        'Central differences [L(w+ε)−L(w−ε)]/(2ε), with ε=1e−5, independently check the derivative. Tiny ε can lose precision when subtracting nearly equal values; compare with a tolerance.',
        'PyTorch creates a float64 tensor with requires_grad=True. torch.autograd.grad differentiates the same expression. Each call builds a fresh graph without accumulating .grad across steps; tests compare all three methods.',
        'Let e=w−3. The next error is (1−2η)e. For this function, 0<η<1 converges; η=0.5 reaches the optimum in one step; η=1 oscillates between 0 and 6 from a zero start; η=1.1 grows the error.',
        'Those thresholds apply only to this quadratic. Curvature and feature scales alter learning-rate limits in larger models. The symlog plot displays both zero and large loss values.',
      ],
      pitfall: 'A wrong gradient sign turns descent into ascent; increasing loss is not necessarily a data failure. Autograd differentiates the expression you wrote, without checking that your loss matches the task.',
      practice: 'Hide the solution. Change the loss to 4(w−3)², derive its gradient and convergence interval, then verify them with all three methods.',
    },
  },
  'exercise-2-probability': {
    files: ['probability_demo.py', 'test_solution.py', 'requirements.txt'],
    command: 'python -m unittest -v test_solution.py\npython probability_demo.py',
    vi: {
      approach: 'Mô phỏng Bernoulli(p=0.2) với ba kích thước mẫu, rồi dùng bảng nhầm lẫn giả lập để phân biệt precision với recall.',
      setup: setupVi + ' Cần NumPy và Matplotlib. Mở histogram.png; ba biểu đồ dùng tần suất tương đối và cùng thang trục để so sánh được.',
      explanation: [
        'Giả định mỗi lần thử độc lập, cùng xác suất p=0.2 và giá trị chỉ là 0 hoặc 1. E[X]=p=0.2, Var(X)=p(1−p)=0.16. Đây là dữ liệu mô phỏng, không phải kết luận về người học thực.',
        'default_rng(seed) giúp tái lập trong cùng môi trường. Chạy n=20, 200 và 20000; trung bình mẫu không nhất thiết tiến gần p một cách đơn điệu ở từng lần tăng n. Với IID, phương sai của trung bình là p(1−p)/n.',
        'Histogram có hai bin quanh 0 và 1; weights=1/n biến chiều cao thành tỷ lệ thay vì số đếm. samples.var(ddof=0) là phương sai thực nghiệm với mẫu số n; không gọi nó là ước lượng phương sai không chệch.',
        'Ví dụ phân loại có 100 dương thực, 900 âm thực; TP=80, FN=20, FP=90, TN=810. Recall=P(dự đoán dương | thực dương)=80/100=0.8; precision=P(thực dương | dự đoán dương)=80/170≈0.471.',
        'Đổi điều kiện làm đổi mẫu số. Nếu không có dương thực hoặc không có dự đoán dương, tỷ lệ tương ứng không xác định; code trả None. Không thay None bằng 0 rồi diễn giải như một quan sát.',
      ],
      pitfall: 'Nhiều mẫu hơn không sửa được sampling bias hay dữ liệu phụ thuộc. Seed cố định phục vụ tái lập, không chứng minh một estimator tốt trên mọi mẫu.',
      practice: 'Ẩn lời giải. Giữ recall và false-positive rate nhưng giảm tỷ lệ dương thực từ 10% xuống 1%; lập bảng mới và tính precision. Giải thích tác động của base rate.',
    },
    en: {
      approach: 'Simulate Bernoulli(p=0.2) at three sample sizes, then use a synthetic confusion table to distinguish precision from recall.',
      setup: setupEn + ' Requires NumPy and Matplotlib. Open histogram.png; the plots use relative frequencies and a shared axis scale.',
      explanation: [
        'Assume independent trials with the same p=0.2 and binary outcomes. E[X]=p=0.2 and Var(X)=p(1−p)=0.16. These are simulations, not claims about actual learners.',
        'default_rng(seed) supports repeatability in the same environment. Compare n=20, 200 and 20000; the sample mean need not move monotonically closer to p as n increases. Under IID assumptions its variance is p(1−p)/n.',
        'Two histogram bins surround 0 and 1; weights=1/n makes heights fractions instead of counts. samples.var(ddof=0) is empirical variance with denominator n, not the unbiased variance estimate.',
        'The classifier example has 100 actual positives and 900 negatives: TP=80, FN=20, FP=90, TN=810. Recall=P(predicted positive | actual positive)=80/100=0.8; precision=P(actual positive | predicted positive)=80/170≈0.471.',
        'Reversing the condition changes the denominator. No actual positives or no predicted positives makes the respective conditional undefined; return None instead of treating zero as an observed rate.',
      ],
      pitfall: 'Larger samples do not fix sampling bias or dependent observations. A fixed seed supports repeatability, not proof of estimator quality across every sample.',
      practice: 'Hide the solution. Keep recall and false-positive rate fixed while reducing prevalence from 10% to 1%. Build the new table, calculate precision and explain the base-rate effect.',
    },
  },
  'exercise-2-optimization': {
    files: ['optimizers.py', 'test_solution.py', 'requirements.txt'],
    command: 'python -m unittest -v test_solution.py\npython optimizers.py',
    vi: {
      approach: 'Cài linear regression y≈wx+b từ đầu, tối ưu từng mẫu bằng SGD, momentum và Adam; vẽ train/validation MSE trên cùng dữ liệu giả lập.',
      setup: setupVi + ' Cần NumPy và Matplotlib. Mở loss-curves.png. Run learning rate quá lớn được dừng và in thông báo; đây là tình huống cố ý trong bài.',
      explanation: [
        'Sinh y=2x+1+noise, tách 120 mẫu train và 40 validation trước khi fit. Khởi tạo w=b=0; gradient từng mẫu là 2(wx+b−y)[x,1]. Validation chỉ được đo, không tham gia cập nhật tham số.',
        'SGD cập nhật sau từng mẫu đã shuffle, không phải một gradient trung bình cả epoch. Momentum dùng v←0.9v+g rồi θ←θ−ηv; biến v được giữ qua các bước.',
        'Adam giữ EMA của gradient và bình phương gradient, hiệu chỉnh bias bằng 1−β^t, rồi chia cho căn moment thứ hai cộng epsilon. t tăng theo mỗi cập nhật mẫu, không theo epoch.',
        'So sánh SGD η=0.03, momentum η=0.003, Adam η=0.003, thêm SGD η=1e−5 và η=2. Cùng seed/shuffle/init giúp đọc kết quả, nhưng rate khác nhau nên đây không phải benchmark xếp hạng optimizer. Rate rất nhỏ chưa học đủ sau 40 epoch; rate lớn bị chặn khi tham số nổ.',
        'MSE phù hợp target liên tục này. Train và validation đều cao gợi ý underfit hoặc tối ưu chưa đủ; train thấp mà validation cao gợi ý overfit hoặc lệch phân phối. Dữ liệu tuyến tính nhỏ này không chứng minh overfit, và validation không thay thế test set cuối cùng.',
      ],
      pitfall: 'Không reset hoặc tính lại momentum mỗi mẫu. Không chọn loss curve đẹp rồi kết luận model tổng quát tốt; xem validation và giữ test riêng nếu dùng kết quả để quyết định model.',
      practice: 'Ẩn lời giải. Giảm số mẫu train, thêm feature đa thức rồi quan sát train/validation. Giữ seed và ghi cấu hình; giải thích tín hiệu nào là overfit và tín hiệu nào chỉ là learning rate chưa phù hợp.',
    },
    en: {
      approach: 'Implement linear regression y≈wx+b from scratch using sample-wise SGD, momentum and Adam, then plot training and validation MSE on synthetic data.',
      setup: setupEn + ' Requires NumPy and Matplotlib. Open loss-curves.png. The deliberately excessive-rate run stops with a diagnostic message.',
      explanation: [
        'Generate y=2x+1+noise and split 120 training and 40 validation samples before fitting. Start at w=b=0; each sample gradient is 2(wx+b−y)[x,1]. Validation is measured without affecting parameter updates.',
        'SGD updates after each shuffled sample rather than using a full-epoch average gradient. Momentum uses v←0.9v+g and θ←θ−ηv, retaining v across steps.',
        'Adam keeps exponential moving averages of gradients and squared gradients, corrects bias with 1−β^t and divides by the square-root second moment plus epsilon. t counts sample updates, not epochs.',
        'Compare SGD η=0.03, momentum η=0.003 and Adam η=0.003, plus SGD η=1e−5 and η=2. Seeds, shuffles and initialization match, but different rates make this an illustration, not an optimizer ranking. The tiny rate undertrains in 40 epochs; exploding parameters stop the large-rate run.',
        'MSE suits this continuous target. High train and validation errors suggest underfitting or insufficient optimization; low train but high validation error suggests overfitting or distribution shift. This small linear example does not demonstrate overfitting, and validation is not a final test set.',
      ],
      pitfall: 'Do not reset momentum at each sample. A smooth training loss does not establish generalization; inspect validation and reserve a test set when selecting a model.',
      practice: 'Hide the solution. Reduce training data and add polynomial features, then inspect train/validation curves. Record seeds and configuration; distinguish overfitting from an unsuitable learning rate.',
    },
  },
}
