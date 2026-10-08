import type { FeedbackKind } from '../api'

export const feedbackLabels: Record<'vi' | 'en', Record<FeedbackKind, string>> = {
  vi: {
    unclear: 'Chưa rõ / cần giải thích thêm', incorrect: 'Có vẻ chưa chính xác',
    missing_example: 'Thiếu ví dụ thực hành', missing_resource: 'Thiếu tài liệu tham khảo',
    broken_link: 'Liên kết bị hỏng', typo: 'Lỗi chính tả / hiển thị',
    exercise_problem: 'Bài tập có vấn đề', feature_request: 'Đề xuất tính năng',
  },
  en: {
    unclear: 'Unclear / needs explanation', incorrect: 'Possibly incorrect',
    missing_example: 'Missing practical example', missing_resource: 'Missing reference',
    broken_link: 'Broken link', typo: 'Typo / display issue',
    exercise_problem: 'Exercise problem', feature_request: 'Feature request',
  },
}

export function feedbackDate(value: string, language: 'vi' | 'en') {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? (language === 'vi' ? 'Mới cập nhật' : 'Recently updated')
    : new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', { dateStyle: 'medium' }).format(date)
}
