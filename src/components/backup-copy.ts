const englishWarnings: Record<string, string> = {
  'Backup cũ chưa có fingerprint nội dung; chỉ các lesson/card hợp lệ mới được khôi phục.':
    'This older backup has no content fingerprint; only valid lessons and cards can be restored.',
  'Bộ nội dung khác phiên bản hiện tại. Lịch ôn giữ nguyên; hãy kiểm tra lại các bài đã hoàn thành.':
    'The content version differs. Review schedules are preserved; check completed lessons after restoring.',
}

export function backupWarning(warning: string, language: 'vi' | 'en') {
  return language === 'en' ? englishWarnings[warning] ?? warning : warning
}
