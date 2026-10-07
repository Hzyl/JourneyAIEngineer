import { useState } from 'react'
import type { Dashboard } from '../api'
import './today.css'

type Props = {
  dashboard: Dashboard | null
  language: 'vi' | 'en'
  lessonTitle?: string
  onOpenLesson: (slug: string) => void
  onNavigate: (view: 'roadmap' | 'review' | 'exercises' | 'journal') => void
  onRecordSession: (minutes: number, note: string) => Promise<void>
}

export function TodayView({ dashboard, language, lessonTitle, onOpenLesson, onNavigate, onRecordSession }: Props) {
  const vi = language === 'vi'
  const [minutes, setMinutes] = useState('25')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  if (!dashboard) return <p role="status">{vi ? 'Chưa tải được dữ liệu học.' : 'Learning data is not available yet.'}</p>
  const next = dashboard.current_lesson
  const record = async (event: React.FormEvent) => {
    event.preventDefault()
    if (busy) return
    setError('')
    setMessage('')
    const amount = Number(minutes)
    if (!Number.isInteger(amount) || amount < 1 || amount > 1440) {
      setError(vi ? 'Nhập số phút từ 1 đến 1440.' : 'Enter between 1 and 1440 whole minutes.')
      return
    }
    setBusy(true)
    try {
      await onRecordSession(amount, note.trim())
      setNote('')
      setMessage(vi ? 'Đã ghi phiên học.' : 'Study session saved.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : (vi ? 'Chưa lưu được phiên học.' : 'Session not saved.'))
    } finally {
      setBusy(false)
    }
  }

  return <div className="today-view">
    <section className="today-next" aria-labelledby="today-next-title">
      <div>
        <span className="eyebrow">{vi ? 'BƯỚC TIẾP THEO' : 'YOUR NEXT STEP'}</span>
        <h2 id="today-next-title">{lessonTitle ?? next?.title_vi
          ?? (vi ? 'Chọn thử thách tiếp theo' : 'Choose your next challenge')}</h2>
        <p>{vi ? 'Đọc một ý chính, chạy một ví dụ và lưu lại điều bạn vừa làm được.'
          : 'Read one concept, run an example and save what you can now demonstrate.'}</p>
        <button className="primary-button" onClick={() => next ? onOpenLesson(next.slug) : onNavigate('roadmap')}>
          {next ? (vi ? 'Tiếp tục lesson' : 'Continue lesson') : (vi ? 'Xem lộ trình' : 'Explore the roadmap')} →
        </button>
      </div>
      <div className="today-rhythm">
        <span>{vi ? 'TUẦN NÀY' : 'THIS WEEK'}</span>
        <strong>{dashboard.weekly_minutes}<small> {vi ? 'phút' : 'min'}</small></strong>
        <p>{vi ? 'Mục tiêu riêng của bạn: ' : 'Your personal goal: '}{dashboard.weekly_goal_minutes} {vi ? 'phút' : 'min'}</p>
        <p>{vi ? 'Một phiên ngắn cũng là tiến bộ.' : 'A short session still counts.'}</p>
      </div>
    </section>
    <section className="today-stats" aria-label={vi ? 'Thống kê học tập' : 'Learning statistics'}>
      <div><span>{vi ? 'Bài đã tự đánh dấu hoàn thành' : 'Self-reported completed lessons'}</span>
        <strong>{dashboard.completed_lessons}<small> / {dashboard.total_lessons}</small></strong></div>
      <button onClick={() => onNavigate('review')}><span>{vi ? 'Ôn tập đến hạn' : 'Reviews due'}</span>
        <strong>{dashboard.due_reviews}<small> · {dashboard.new_reviews ?? 0} {vi ? 'thẻ mới' : 'new cards'}</small></strong></button>
      <div><span>{vi ? 'Nhịp học liên tục' : 'Learning streak'}</span>
        <strong>{dashboard.streak_days}<small> {vi ? 'ngày' : 'days'}</small></strong></div>
    </section>
    <p className="today-evidence-note">{vi
      ? 'Tiến độ do bạn tự ghi nhận. Test bài tập kiểm tra từng hành vi; năng lực cần được chứng minh qua sản phẩm và đánh giá.'
      : 'Progress is self-reported. Exercise tests check specific behavior; demonstrate broader skills through projects and evaluation.'}</p>
    <section className="today-session section-card">
      <h3>{vi ? 'Ghi lại một phiên học' : 'Record a study session'}</h3>
      <p>{vi ? 'Chỉ ghi thời gian tập trung thực tế. Không cộng lại thời gian đã lưu khi hoàn thành bài.'
        : 'Record actual focused time. Do not repeat minutes already saved when completing a lesson.'}</p>
      <form onSubmit={(event) => void record(event)}>
        <label>{vi ? 'Phút' : 'Minutes'}<input type="number" min="1" max="1440" value={minutes}
          onChange={(event) => setMinutes(event.target.value)} required /></label>
        <label>{vi ? 'Ghi chú' : 'Note'}<input value={note} onChange={(event) => setNote(event.target.value)}
          placeholder={vi ? 'Đã làm được gì? Còn vướng ở đâu?' : 'What worked? What is still unclear?'} /></label>
        <button className="secondary-button" disabled={busy} type="submit">
          {busy ? (vi ? 'Đang lưu…' : 'Saving…') : (vi ? 'Lưu phiên học' : 'Save session')}
        </button>
      </form>
      {message && <p className="success-note" role="status">{message}</p>}
      {error && <p className="error-banner" role="alert">{error}</p>}
    </section>
    <nav className="today-links" aria-label={vi ? 'Hoạt động tiếp theo' : 'More learning activities'}>
      <button onClick={() => onNavigate('exercises')}>{vi ? 'Làm bài tập →' : 'Practise →'}</button>
      <button onClick={() => onNavigate('journal')}>{vi ? 'Viết journal →' : 'Write in your journal →'}</button>
      <button onClick={() => onNavigate('roadmap')}>{vi ? 'Xem toàn bộ lộ trình →' : 'View the full roadmap →'}</button>
    </nav>
  </div>
}
