import type { GuideText } from './exercise-guides'

export const modelsGuide: Record<'vi' | 'en', GuideText> = {
  vi: {
    summary: 'So sánh baseline, logistic regression, decision tree và boosting bằng cùng dữ liệu, rồi giải thích lựa chọn.',
    steps: [
      'Sau bài ML framing, tạo 400 dòng dữ liệu giả độc lập với hai feature signal và distractor trong [-1, 1]. Nhãn dương nằm trong một khoảng của signal, với xác suất đảo nhãn 8%. Chốt seed 42 và ba tập train/validation/test có 240/80/80 dòng. ID chỉ để truy vết, không phải feature.',
      'Trước khi chạy, chọn balanced accuracy trên validation làm tiêu chí chính và báo thêm accuracy, precision, recall, confusion matrix. Khi hòa, ưu tiên theo thứ tự majority, logistic, tree, AdaBoost đã định trước. Không mở điểm test để chọn model.',
      'Fit trên train: baseline lớp đa số; logistic 500 bước gradient descent với learning rate 0.3; tree sâu tối đa 2; AdaBoost tối đa 20 cây sâu 1. Dùng cùng hai feature và cùng tập đánh giá. Các feature đã bị chặn trong [-1, 1], chưa cần fit scaler trong ví dụ này.',
      'Lập bảng metric train/validation, số tham số/nút/cây, thời gian fit và thời gian dự đoán mỗi dòng. Ghi một dự đoán sai thật của từng model gồm ID, feature, nhãn và dự đoán; nếu không có, ghi rõ không quan sát thấy lỗi trong tập đó.',
      'Viết quyết định và giới hạn: vì sao model đơn giản hơn có thể đủ, vì sao metric hoặc latency trên 80 dòng chưa bảo đảm sản phẩm thật. Lưu báo cáo JSON và một đoạn giải thích. Sau khi chốt lựa chọn, mới dùng --include-test để xem điểm test của model đã chọn.',
    ],
    checks: [
      'Có 240/80/80 dòng, ID không trùng giữa các tập; chỉ train được đưa vào hàm fit.',
      'Bảng so sánh có đủ bốn model, confusion matrix và ví dụ lỗi thật; precision không xác định phải là null.',
      'Có số đo thời gian trên máy của bạn, cấu hình model và nhận xét về interpretability, latency, data size, quality.',
      'Báo cáo mặc định không có metric test. Bài vẫn tự đánh giá; xem lời giải hoặc chạy test không tự hoàn thành bài.',
    ],
    hints: [
      'Balanced accuracy = (recall lớp 1 + recall lớp 0)/2; baseline chỉ đoán lớp đa số có thể có accuracy khá nhưng bỏ sót toàn bộ lớp 1.',
      'Một đường thẳng khó bao quanh một khoảng nằm giữa trục signal. Tree có thể tách hai biên; nhiều cây hơn không tự bảo đảm tốt hơn.',
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
