import type { GuideText } from './exercise-guides'

export const modelsGuide: Record<'vi' | 'en', GuideText> = {
  vi: {
    summary: 'So sánh mô hình cơ sở (baseline), hồi quy logistic (logistic regression), cây quyết định (decision tree) và boosting trên cùng dữ liệu, rồi giải thích lựa chọn.',
    steps: [
      'Sau bài xác định bài toán học máy, tạo 400 dòng dữ liệu giả độc lập với hai đặc trưng signal và distractor trong [-1, 1]. Nhãn dương nằm trong một khoảng của signal, với xác suất đảo nhãn 8%. Chốt seed 42 và ba tập huấn luyện/kiểm định/kiểm tra có 240/80/80 dòng. ID chỉ để truy vết, không dùng làm đặc trưng.',
      'Trước khi chạy, chọn độ chính xác cân bằng (balanced accuracy) trên tập kiểm định làm tiêu chí chính. Báo thêm accuracy, precision, recall và ma trận nhầm lẫn. Khi hòa, ưu tiên theo thứ tự majority, logistic, tree, AdaBoost đã định trước. Không xem điểm tập kiểm tra để chọn mô hình.',
      'Chỉ huấn luyện trên tập train: mô hình cơ sở chọn lớp đa số; logistic chạy 500 bước gradient descent với tốc độ học 0.3; cây quyết định sâu tối đa 2; AdaBoost dùng tối đa 20 cây sâu 1. Dùng cùng hai đặc trưng và cùng tập đánh giá. Đặc trưng đã nằm trong [-1, 1] nên ví dụ này chưa cần học bộ chuẩn hóa thang đo (scaler).',
      'Lập bảng chỉ số huấn luyện/kiểm định, số tham số/nút/cây, thời gian huấn luyện và thời gian dự đoán mỗi dòng. Ghi một lỗi dự đoán thực sự của từng mô hình, gồm ID, đặc trưng, nhãn và dự đoán. Nếu không có, ghi rõ chưa quan sát thấy lỗi trong tập đó.',
      'Viết quyết định kèm giới hạn: vì sao mô hình đơn giản hơn có thể đã đủ, và vì sao chỉ số hoặc độ trễ đo trên 80 dòng chưa bảo đảm kết quả khi dùng thật. Lưu báo cáo JSON cùng lời giải thích. Chốt lựa chọn trước khi dùng --include-test để xem điểm tập kiểm tra của mô hình đã chọn.',
    ],
    checks: [
      'Có 240/80/80 dòng, ID không trùng giữa các tập; chỉ tập huấn luyện được đưa vào hàm fit.',
      'Bảng so sánh có đủ bốn mô hình, ma trận nhầm lẫn và ví dụ lỗi thực sự; precision không xác định phải là null.',
      'Có số đo thời gian trên máy của bạn, cấu hình mô hình và nhận xét về khả năng diễn giải, độ trễ, lượng dữ liệu và chất lượng.',
      'Báo cáo mặc định không có chỉ số của tập kiểm tra. Bài vẫn dùng hình thức tự đánh giá; xem lời giải hoặc chạy kiểm thử không tự đánh dấu hoàn thành.',
    ],
    hints: [
      'Balanced accuracy = (recall lớp 1 + recall lớp 0)/2. Mô hình cơ sở chỉ đoán lớp đa số có thể đạt accuracy khá nhưng bỏ sót toàn bộ lớp 1.',
      'Một đường thẳng khó bao quanh một khoảng nằm giữa trục signal. Cây quyết định có thể tách hai biên; thêm nhiều cây không tự bảo đảm kết quả tốt hơn.',
    ],
    example: 'artifact: model-comparison.json + decision.md\ncolumns: model, train/validation metrics, complexity, timing, error example\nselection: validation balanced accuracy\ntest: reveal after freezing the decision',
  },
  en: {
    summary: 'Compare a baseline, logistic regression, a decision tree and boosting on the same data, then defend a choice.',
    steps: [
      'After ML framing, generate 400 independent synthetic rows with signal and distractor features in [-1, 1]. The positive label occupies an interval of signal, with an 8% label-flip probability. Fix seed 42 and train/validation/test sizes of 240/80/80. IDs are audit keys, not features.',
      'Before running, choose validation balanced accuracy as the primary metric; also report accuracy, precision, recall and confusion counts. Predeclare the tie order: majority, logistic, tree, AdaBoost. Do not inspect test scores to choose a model.',
      'Fit on train: a majority baseline; logistic regression with 500 gradient steps and learning rate 0.3; a depth-2 tree; and up to 20 depth-1 AdaBoost trees. Use the same two features and evaluation sets. Features are already bounded in [-1, 1], so this example does not fit a scaler.',
      'Build a train/validation metric table with parameter/node/tree counts, fit time and prediction time per row. Record one actual error per model with ID, features, label and prediction; explicitly report no observed errors if there are none in that set.',
      'Write the decision and limitations: why a simpler model may suffice, and why metrics or latency on 80 rows do not establish production readiness. Save a JSON report and a short explanation. Only then use --include-test to reveal the selected model on test.',
    ],
    checks: [
      'There are 240/80/80 rows with disjoint IDs; only training rows reach the fitting function.',
      'All four models have confusion counts and real error examples; undefined precision is null.',
      'Record timings from your machine, model settings and interpretability, latency, data size and quality tradeoffs.',
      'Default output contains no test metrics. The lab remains self-assessed; reading the solution or passing tests does not complete it.',
    ],
    hints: [
      'Balanced accuracy = (class-1 recall + class-0 recall)/2. A majority baseline can have decent accuracy while missing every positive.',
      'One linear boundary cannot enclose a middle interval of signal. A tree can split both edges; adding trees does not guarantee improvement.',
    ],
    example: 'artifact: model-comparison.json + decision.md\ncolumns: model, train/validation metrics, complexity, timing, error example\nselection: validation balanced accuracy\ntest: reveal after freezing the decision',
  },
}
