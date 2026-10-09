import type { WorkedLab } from './foundation-solutions'

const metricRows = [
  ['Majority', '0.6292 / 0.5375', '0.5000', '43 / 0 / 37 / 0', 'validation-001: 1 → 0'],
  ['Logistic', '0.6292 / 0.5375', '0.5000', '43 / 0 / 37 / 0', 'validation-001: 1 → 0'],
  ['Tree', '0.9417 / 0.9500', '0.9516', '40 / 3 / 1 / 36', 'validation-002: 0 → 1'],
  ['AdaBoost', '0.9417 / 0.9500', '0.9516', '40 / 3 / 1 / 36', 'validation-002: 0 → 1'],
]

export const modelsSolution: WorkedLab = {
  files: ['compare.py', 'models.py', 'test_solution.py'],
  command: 'python -m unittest -v test_solution.py\npython compare.py --output model-comparison.json',
  vi: {
    approach: 'So sánh bốn lựa chọn trên cùng dữ liệu giả. Kết quả seed 42 cho thấy tree và AdaBoost hòa nhau trên validation; quy tắc hòa chọn tree. Một model phức tạp hơn chưa chắc mang lại thêm giá trị.',
    setup: 'Python 3.11+, không cần package ngoài, Docker hay tài khoản. Lưu cả ba file cùng thư mục. Test phải báo 11 tests, OK. compare.py in JSON nếu không có --output; --output tạo file mới và từ chối ghi đè. Sau khi chốt quyết định, chạy python compare.py --include-test --output model-test.json. Web chỉ cho đọc/tải file; chạy Python trong môi trường của bạn.',
    tables: [
      { title: 'Kết quả seed 42', columns: ['Model', 'Accuracy train / val', 'Balanced acc. val', 'TN / FP / FN / TP val', 'Lỗi đầu tiên: thật → dự đoán'], rows: metricRows },
      { title: 'Đánh đổi khi chọn model', columns: ['Model', 'Độ phức tạp thực tế', 'Cách diễn giải và giới hạn'], rows: [
        ['Majority', '1 lớp cố định: 0', 'Dễ hiểu và nhanh; bỏ sót cả 37 nhãn dương ở validation.'],
        ['Logistic', '3 hệ số gồm bias', 'Biên tuyến tính với feature gốc chưa mô tả được khoảng ở giữa; thêm feature phi tuyến là thí nghiệm riêng.'],
        ['Tree', '7 nút, sâu tối đa 2', 'Có thể đọc từng nhánh quyết định; dataset nhỏ hoặc đổi seed có thể làm cây thay đổi.'],
        ['AdaBoost', '20 stump, tổng 60 nút', 'Cộng phiếu có trọng số; khó giải thích hơn và cần gọi nhiều cây, nhưng validation ở đây không tốt hơn tree.'],
      ] },
    ],
    explanation: [
      'Dữ liệu được sinh độc lập cùng phân phối: signal, distractor trong [-1, 1]; target ban đầu là -0.35 < signal < 0.4, rồi đảo nhãn với xác suất 8%. Tỷ lệ đảo quan sát được không bắt buộc đúng 8%. Mã sinh nhãn chỉ dùng tạo dữ liệu, không dùng để dự đoán. Không đưa ID hay cờ nhiễu vào feature.',
      'Baseline chỉ đọc nhãn train. Logistic tối ưu binary cross entropy bằng gradient descent không regularization: gradient là trung bình (sigmoid(z) - y) × feature, có bias. Threshold cố định 0.5. Đây là mã học thuật nhỏ, không tương đương mọi mặc định của thư viện scikit-learn.',
      'Tree thử các trung điểm giữa giá trị feature và chọn giảm weighted Gini lớn nhất. Độ sâu giới hạn giúp đọc đường đi quyết định. Binary AdaBoost tăng trọng số các dòng bị đoán sai, dùng alpha = 0.5 × ln((1-error)/error), rồi kết hợp dự đoán ±1; dừng nếu stump hoàn hảo hoặc error ≥ 0.5.',
      'Train có 151 nhãn 0 và 89 nhãn 1. Majority và logistic đều đoán 0 trong lần chạy này: precision=null, recall=0 trên validation. Tree và AdaBoost có precision=36/39 và recall=36/37. Balanced accuracy trung bình recall hai lớp; confusion matrix vẫn cần để hiểu loại lỗi.',
      'validation-001 có signal≈0.1504, distractor≈0.9016, nhãn 1: baseline và logistic bỏ sót. validation-002 có signal≈0.3446, distractor≈-0.4610, nhãn 0 nhưng tree và AdaBoost đoán 1. Báo cáo giữ feature đầy đủ; một ví dụ không chứng minh toàn bộ lỗi do nhiễu.',
      'Tree được chọn vì hòa balanced accuracy với AdaBoost và đứng trước trong quy tắc đã định. JSON đo fit_ms và prediction_us_per_row sau warmup/100 lượt, kèm số nút/hệ số. Đây là thời gian Python trên máy bạn, gồm overhead; không phải p95 của API, không có mạng, tải đồng thời hay bộ nhớ.',
      'Cỡ mẫu 240 dòng train và 80 validation nhỏ, chưa có khoảng bất định hay đánh giá nhiều seed. Không suy ra model nào tốt nhất cho mọi data size. Với dữ liệu người dùng lặp hoặc theo thời gian, cần cách split phù hợp như bài framing. Test chỉ được in cho model đã chọn khi có --include-test; đây là thói quen đánh giá, không phải khóa bảo mật.',
    ],
    pitfall: 'Không đổi model hoặc hyperparameter sau khi xem test rồi gọi đó là đánh giá độc lập. Không xem tốc độ của mã Python minh họa là tốc độ thư viện tối ưu. Mã dự đoán giả định đúng hai feature hữu hạn trong miền đã mô tả.',
    practice: 'Ẩn bài giải. Viết decision.md so sánh tree với AdaBoost trên cả chất lượng, độ phức tạp và timing bạn đo. Với một thí nghiệm mới và test mới, thử thêm signal² cho logistic hoặc đổi độ sâu tree; ghi giả thuyết trước khi chạy và chỉ chọn bằng validation.',
  },
  en: {
    approach: 'Compare four choices on identical synthetic data. At seed 42, tree and AdaBoost tie on validation, so the predeclared policy chooses tree. Extra complexity does not automatically add value.',
    setup: 'Python 3.11+, without third-party packages, Docker or an account. Save all three files together. Tests should report 11 tests, OK. compare.py prints JSON without --output; --output creates a new file and refuses to overwrite. After freezing the choice, run python compare.py --include-test --output model-test.json. The web app only reads/downloads files; run Python in your own environment.',
    tables: [
      { title: 'Seed 42 results', columns: ['Model', 'Accuracy train / val', 'Balanced acc. val', 'TN / FP / FN / TP val', 'First error: actual → predicted'], rows: metricRows },
      { title: 'Model selection tradeoffs', columns: ['Model', 'Observed complexity', 'Interpretation and limits'], rows: [
        ['Majority', '1 constant class: 0', 'Simple and fast; misses all 37 validation positives.'],
        ['Logistic', '3 coefficients including bias', 'A linear boundary on raw features does not capture the middle interval; nonlinear features require a separate experiment.'],
        ['Tree', '7 nodes, maximum depth 2', 'Individual decision paths are readable; small datasets or another seed can change the tree.'],
        ['AdaBoost', '20 stumps, 60 total nodes', 'Weighted votes are harder to explain and require more tree calls, with no validation gain over tree here.'],
      ] },
    ],
    explanation: [
      'Rows are independent draws from one distribution: signal and distractor in [-1, 1]; the initial target is -0.35 < signal < 0.4, then flipped with probability 8%. The realized flip rate need not equal 8%. The generating rule creates labels, never predictions. Neither IDs nor noise flags are features.',
      'The baseline reads training labels only. Logistic minimizes unregularized binary cross entropy with gradient descent: average (sigmoid(z) - y) × feature, including a bias. The threshold is fixed at 0.5. These small teaching implementations do not replicate every scikit-learn default.',
      'The tree tries midpoints between feature values and greedily minimizes weighted Gini impurity. Limited depth keeps decision paths readable. Binary AdaBoost increases the weights of misclassified rows, uses alpha = 0.5 × ln((1-error)/error), and combines signed predictions; it stops for a perfect stump or error ≥ 0.5.',
      'Train contains 151 zeros and 89 ones. Majority and logistic predict zero throughout this run: validation precision=null and recall=0. Tree and AdaBoost have precision=36/39 and recall=36/37. Balanced accuracy averages both class recalls; confusion counts still explain error types.',
      'validation-001 has signal≈0.1504, distractor≈0.9016 and label 1: baseline and logistic miss it. validation-002 has signal≈0.3446, distractor≈-0.4610 and label 0, but tree and AdaBoost predict 1. Reports retain full features; one example cannot establish that all errors are noise.',
      'Tree wins the predeclared tie order at equal validation balanced accuracy. JSON measures fit_ms and prediction_us_per_row after warmup/100 batches, plus nodes/coefficients. This is Python timing on your machine including overhead, not API p95 latency; it excludes network, concurrency and memory measurements.',
      'The 240 training and 80 validation rows are small samples without uncertainty intervals or multiple-seed evaluation. Do not infer a universal winner across data sizes. Repeated users or temporal data require suitable splits as in the framing lab. --include-test reveals only the selected model: an evaluation practice, not access control.',
    ],
    pitfall: 'Do not change models or hyperparameters after seeing test and still call it independent evaluation. Tutorial Python timings do not represent optimized libraries. Prediction code assumes the specified two finite, bounded features.',
    practice: 'Hide the solution. Write decision.md comparing tree and AdaBoost on quality, complexity and measured timing. In a new experiment with a new test set, add signal² for logistic or vary tree depth; write a hypothesis first and select using validation only.',
  },
}
