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
    approach: 'So sánh bốn lựa chọn trên cùng dữ liệu giả. Với seed 42, cây quyết định và AdaBoost bằng điểm trên tập kiểm định; quy tắc xử lý hòa chọn cây quyết định. Mô hình phức tạp hơn chưa chắc đem lại kết quả tốt hơn.',
    setup: 'Cần Python 3.11+, không cần thư viện ngoài, Docker hoặc tài khoản. Lưu cả ba tệp vào cùng thư mục. Kiểm thử phải báo 11 tests, OK. compare.py in JSON nếu không có --output; --output tạo tệp mới và từ chối ghi đè. Chốt quyết định rồi mới chạy python compare.py --include-test --output model-test.json. Web chỉ cho đọc/tải tệp; chạy Python trong môi trường của bạn.',
    tables: [
      { title: 'Kết quả seed 42', columns: ['Mô hình', 'Accuracy huấn luyện / kiểm định', 'Balanced accuracy kiểm định', 'TN / FP / FN / TP kiểm định', 'Lỗi đầu tiên: thật → dự đoán'], rows: metricRows },
      { title: 'Cân nhắc khi chọn mô hình', columns: ['Mô hình', 'Độ phức tạp thực tế', 'Cách diễn giải và giới hạn'], rows: [
        ['Majority', '1 lớp cố định: 0', 'Dễ hiểu và nhanh, nhưng bỏ sót cả 37 nhãn dương trong tập kiểm định.'],
        ['Logistic', '3 hệ số, gồm hệ số chệch (bias)', 'Biên tuyến tính với đặc trưng gốc chưa mô tả được khoảng ở giữa. Thêm đặc trưng phi tuyến là một thí nghiệm riêng.'],
        ['Tree', '7 nút, sâu tối đa 2', 'Có thể đọc từng nhánh quyết định; dữ liệu ít hoặc seed khác có thể làm thay đổi cây.'],
        ['AdaBoost', '20 cây chỉ tách một lần (stump), tổng 60 nút', 'Cộng phiếu có trọng số, khó giải thích hơn và cần gọi nhiều cây; kết quả kiểm định ở đây vẫn không tốt hơn cây quyết định.'],
      ] },
    ],
    explanation: [
      'Dữ liệu được sinh độc lập cùng phân phối: signal, distractor trong [-1, 1]; nhãn gốc dựa trên điều kiện -0.35 < signal < 0.4, sau đó bị đảo với xác suất 8%. Tỷ lệ đảo quan sát được không bắt buộc đúng 8%. Chỉ dùng quy tắc sinh nhãn để tạo dữ liệu, không dùng để dự đoán. Không đưa ID hoặc cờ nhiễu vào đặc trưng.',
      'Mô hình cơ sở chỉ đọc nhãn của tập huấn luyện. Logistic tối ưu binary cross entropy bằng gradient descent, không thêm thành phần điều chuẩn (regularization). Gradient là trung bình (sigmoid(z) - y) × feature, có hệ số bias. Ngưỡng dự đoán cố định là 0.5. Đây là mã nhỏ để học, không tương đương mọi thiết lập mặc định của scikit-learn.',
      'Cây quyết định thử trung điểm giữa các giá trị đặc trưng, chọn điểm giảm Gini có trọng số nhiều nhất. Giới hạn độ sâu giúp bạn đọc đường đi quyết định. AdaBoost nhị phân tăng trọng số các dòng dự đoán sai, dùng alpha = 0.5 × ln((1-error)/error), rồi kết hợp dự đoán ±1. Dừng nếu cây chỉ tách một lần (stump) dự đoán hoàn hảo hoặc error ≥ 0.5.',
      'Tập huấn luyện có 151 nhãn 0 và 89 nhãn 1. Majority và logistic đều đoán 0 trong lần chạy này: precision=null, recall=0 trên tập kiểm định. Cây quyết định và AdaBoost có precision=36/39, recall=36/37. Balanced accuracy là trung bình recall của hai lớp; vẫn cần ma trận nhầm lẫn để hiểu từng loại lỗi.',
      'validation-001 có signal≈0.1504, distractor≈0.9016, nhãn 1: mô hình cơ sở và logistic bỏ sót. validation-002 có signal≈0.3446, distractor≈-0.4610, nhãn 0 nhưng cây quyết định và AdaBoost đoán 1. Báo cáo giữ đầy đủ đặc trưng; một ví dụ chưa chứng minh mọi lỗi đều do nhiễu.',
      'Cây quyết định được chọn vì bằng balanced accuracy với AdaBoost và đứng trước trong thứ tự ưu tiên đã định. JSON đo fit_ms và prediction_us_per_row sau bước chạy khởi động và 100 lượt, kèm số nút/hệ số. Đây là thời gian chạy Python trên máy bạn, gồm cả chi phí phụ. Phép đo không phải p95 của API và chưa tính mạng, tải đồng thời hoặc bộ nhớ.',
      'Cỡ mẫu gồm 240 dòng huấn luyện và 80 dòng kiểm định còn nhỏ, chưa có khoảng bất định hoặc đánh giá với nhiều seed. Không suy ra mô hình nào tốt nhất cho mọi lượng dữ liệu. Nếu người dùng lặp lại hoặc dữ liệu theo thời gian, cần cách chia tập phù hợp như bài xác định bài toán. Chỉ in điểm tập kiểm tra của mô hình đã chọn khi có --include-test; đây là quy tắc đánh giá, không phải khóa bảo mật.',
    ],
    pitfall: 'Không đổi mô hình hoặc siêu tham số sau khi xem tập kiểm tra rồi gọi đó là đánh giá độc lập. Không coi tốc độ mã Python minh họa là tốc độ thư viện đã tối ưu. Mã dự đoán giả định có đúng hai đặc trưng hữu hạn trong miền đã mô tả.',
    practice: 'Ẩn bài giải. Viết decision.md so sánh cây quyết định với AdaBoost về chất lượng, độ phức tạp và thời gian bạn đo. Trong thí nghiệm mới với tập kiểm tra mới, thử thêm signal² cho logistic hoặc đổi độ sâu cây. Ghi giả thuyết trước khi chạy và chỉ dùng tập kiểm định để lựa chọn.',
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
