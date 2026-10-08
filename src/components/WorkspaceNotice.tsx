type Kind = 'lesson' | 'language' | 'load'

export function WorkspaceNotice({ kind, language, previous, pending, onRetry }: {
  kind: Kind | null
  language: 'vi' | 'en'
  previous: boolean
  pending: boolean
  onRetry: () => void
}) {
  if (!kind) return null
  const vi = language === 'vi'
  const titles: Record<Kind, string> = {
    lesson: vi ? 'Chưa tải được bài học.' : 'Could not load this lesson.',
    language: vi ? 'Chưa đổi được ngôn ngữ.' : 'Could not change the language.',
    load: vi ? 'Chưa tải được dữ liệu.' : 'Could not load your data.',
  }
  const details: Record<Kind, string> = {
    lesson: vi ? 'Kiểm tra kết nối rồi thử lại, hoặc chọn bài khác trong lộ trình.'
      : 'Check your connection and retry, or choose another lesson from the roadmap.',
    language: vi ? 'Ngôn ngữ hiện tại được giữ nguyên. Kiểm tra kết nối rồi thử lại.'
      : 'Your current language is unchanged. Check your connection and try again.',
    load: previous
      ? (vi ? 'Đang hiển thị dữ liệu lần trước. Kiểm tra kết nối rồi thử lại.'
        : 'Showing previously loaded data. Check your connection and try again.')
      : (vi ? 'Kiểm tra kết nối rồi thử lại để mở nội dung của bạn.'
        : 'Check your connection and try again to open your workspace.'),
  }
  return <div className="error-banner" role="alert">
    <strong>{titles[kind]}</strong>{' '}{details[kind]}{' '}
    <button className="text-button" onClick={onRetry} disabled={pending} aria-busy={pending}>
      {pending ? (vi ? 'Đang thử lại…' : 'Retrying…') : (vi ? 'Thử lại' : 'Retry')}
    </button>
  </div>
}
