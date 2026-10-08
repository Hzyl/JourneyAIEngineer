import type { GuideText } from './exercise-guides'

export const framingGuide: Record<'vi' | 'en', GuideText> = {
  vi: {
    summary: 'Xác định thời điểm dự đoán, loại dữ liệu tương lai và bảo vệ cách chia train/validation/test.',
    steps: [
      'Chọn bài toán giả lập: tại lúc mua hàng, dự đoán đơn có hoàn trả trong 30 ngày không. Một dòng là một đơn; target 1 là có hoàn trả. Trước khi xem điểm, chọn recall để theo dõi đơn bị bỏ sót, đồng thời báo precision và khối lượng cần kiểm tra.',
      'Viết data dictionary: kiểu, ý nghĩa, thời điểm biết và vai trò của từng cột. Chỉ items_at_purchase và prior_orders_at_purchase là feature. ID dùng kiểm tra/split; returned_30d là nhãn; refund_issued là thông tin tương lai phải loại.',
      'Chốt mốc 01/03/2026 cho train, 01/06 cho validation và quan sát test đến 01/08. Chia theo ngày mua, rồi chỉ giữ nhãn đã đủ 30 ngày tại mốc tương ứng. Đơn mua trước cutoff nhưng nhãn chưa sẵn sàng vẫn bị loại, không gán nhãn 0.',
      'Fit baseline lớp đa số chỉ trên train; nếu hòa, luôn chọn 0 theo quy tắc đã định. In confusion matrix, accuracy, precision, recall của train/validation. Precision không xác định phải hiện null, không giả thành 1.',
      'Lập bảng leakage và giải thích khách hàng lặp lại phù hợp với dự đoán đơn tương lai từ cùng tập khách hàng. Nếu muốn phục vụ khách hàng hoàn toàn mới, cần đánh giá giữ riêng theo khách hàng. Chỉ chạy --include-test sau khi đã chốt lựa chọn và ghi giới hạn dữ liệu giả.',
    ],
    checks: [
      'Data dictionary phân biệt feature, ID, nhãn và dữ liệu xuất hiện sau thời điểm dự đoán.',
      'Có 8 dòng train, 4 validation, 4 test và 3 dòng chưa đủ thời gian quan sát bị loại.',
      'Baseline chọn 0: train accuracy=0.75, validation accuracy=0.5, recall=0 và precision=null.',
      'Thay nhãn validation/test không làm thay đổi baseline; báo cáo mặc định không có metric test.',
    ],
    hints: ['label_ready_on = ordered_on + 30 ngày; kiểm tra label_ready_on <= cutoff, không chỉ ordered_on < cutoff.',
      'Recall = TP/(TP+FN). Accuracy cao vẫn có thể bỏ sót toàn bộ lớp cần phát hiện.'],
    example: 'prediction_time: ordered_on\ntarget: returned_30d\nfeatures: items_at_purchase, prior_orders_at_purchase\nforbidden feature: refund_issued',
  },
  en: {
    summary: 'Define prediction time, exclude future information and defend the train/validation/test split.',
    steps: [
      'Frame a synthetic task: at purchase time, predict a return within 30 days. One row is one order; target 1 means a return. Before inspecting scores, choose recall to track missed returns, while also reporting precision and review workload.',
      'Write a data dictionary with type, meaning, availability and role. Only items_at_purchase and prior_orders_at_purchase are features. IDs support auditing/splits; returned_30d is the label; refund_issued is forbidden future information.',
      'Fix March 1, 2026 as the training cutoff, June 1 as the validation cutoff, and observe test outcomes through August 1. Partition by purchase date, then require 30 days of label maturity at each cutoff. Exclude immature labels rather than calling them negative.',
      'Fit a majority-class baseline on training labels only, with a predeclared tie policy of 0. Report confusion counts, accuracy, precision and recall for train/validation. Undefined precision is null, not an invented perfect score.',
      'List leakage risks and explain why repeated customers fit a future-order deployment within the same customer population. For entirely new customers, add a customer-held-out evaluation. Run --include-test only after freezing choices, and document the synthetic-data limits.',
    ],
    checks: [
      'The dictionary distinguishes features, identifiers, labels and information that arrives after prediction.',
      'There are 8 training, 4 validation and 4 test rows; 3 immature observations are excluded.',
      'The baseline chooses 0: training accuracy=0.75, validation accuracy=0.5, recall=0 and precision=null.',
      'Changing validation/test labels cannot change the baseline; the default report omits test metrics.',
    ],
    hints: ['label_ready_on = ordered_on + 30 days; require label_ready_on <= cutoff, not merely ordered_on < cutoff.',
      'Recall = TP/(TP+FN). High accuracy can still miss every positive outcome.'],
    example: 'prediction_time: ordered_on\ntarget: returned_30d\nfeatures: items_at_purchase, prior_orders_at_purchase\nforbidden feature: refund_issued',
  },
}
