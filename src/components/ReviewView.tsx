import { useEffect, useRef, useState } from 'react'
import { learningClient as api } from '../platform/learning-client'

type Card = {
  id: number
  question_vi: string
  question_en: string
  answer_vi: string
  answer_en: string
  phase_title_vi: string
  phase_title_en: string
  queue_status?: 'new' | 'due'
}
type History = { id: number; rating: string; lesson_title_vi: string; lesson_title_en: string }
type Topic = { lesson_slug: string; title_vi: string; title_en: string; hard_attempts: number; attempts: number }
type Props = {
  reviews: Card[]
  language: 'vi' | 'en'
  onAnswer: (id: number, rating: string, seconds?: number, answer?: string) => Promise<void>
  onOpenLesson: (slug: string) => void
}

export function ReviewView({ reviews, language, onAnswer, onOpenLesson }: Props) {
  const vi = language === 'vi'
  const [answered, setAnswered] = useState<Set<number>>(() => new Set())
  const [answer, setAnswer] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<History[]>([])
  const [weak, setWeak] = useState<Topic[]>([])
  const startedAt = useRef<number | null>(null)
  const submitting = useRef(false)
  const attempted = useRef<{ id: number; rating: string; answer: string; seconds: number } | null>(null)
  const remaining = reviews.filter((card) => !answered.has(card.id))
  const item = remaining[0]

  useEffect(() => {
    let alive = true
    void Promise.all([api.reviewHistory(), api.weakTopics()]).then(([past, topics]) => {
      if (alive) {
        setHistory(past.items)
        setWeak(topics.items)
      }
    }).catch(() => {
      if (alive) setError(vi ? 'Chưa tải được lịch sử ôn tập.' : 'Review history could not be loaded.')
    })
    return () => { alive = false }
  }, [reviews, vi])

  const submit = async (rating: string, submittedAt: number) => {
    if (!item || submitting.current) return
    submitting.current = true
    setBusy(true)
    setError('')
    const previous = attempted.current
    const retry = previous?.id === item.id && previous.rating === rating && previous.answer === answer
    const elapsed = startedAt.current === null ? 0 : Math.round((submittedAt - startedAt.current) / 1000)
    const seconds = retry ? previous.seconds : Math.max(0, Math.min(7200, elapsed))
    attempted.current = { id: item.id, rating, answer, seconds }
    try {
      await onAnswer(item.id, rating, seconds, answer)
      setAnswered((current) => new Set([...current, item.id]))
      setAnswer('')
      startedAt.current = null
      attempted.current = null
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : (vi ? 'Chưa lưu được câu trả lời.' : 'Answer not saved.'))
    } finally {
      submitting.current = false
      setBusy(false)
    }
  }

  return <div className="review-layout">
    <header className="review-header">
      <span className="eyebrow accent">SPACED REVIEW</span>
      <h2>{vi ? 'Nhớ bằng cách tự gọi lại.' : 'Remember through active recall.'}</h2>
      <p>{remaining.filter((card) => card.queue_status !== 'new').length} {vi ? 'đến hạn' : 'due'} ·{' '}
        {remaining.filter((card) => card.queue_status === 'new').length} {vi ? 'thẻ mới' : 'new cards'}</p>
    </header>
    {error && <p className="error-banner" role="alert">{error}</p>}
    {item ? <section className="review-card" aria-busy={busy} key={item.id}>
      <div className="review-card-meta">
        <span>{item.queue_status === 'new' ? (vi ? 'Thẻ mới' : 'New card') : (vi ? 'Đến hạn' : 'Due')}</span>
        <span>{vi ? item.phase_title_vi : item.phase_title_en}</span>
      </div>
      <h3>{vi ? item.question_vi : item.question_en}</h3>
      <textarea aria-label={vi ? 'Câu trả lời review' : 'Your review answer'} value={answer} disabled={busy}
        onFocus={(event) => { startedAt.current ??= event.timeStamp }}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder={vi ? 'Thử trả lời trước khi xem đáp án…' : 'Try answering before revealing the answer…'} />
      <details>
        <summary>{vi ? 'Xem đáp án gợi ý' : 'Reveal suggested answer'}</summary>
        <p>{vi ? item.answer_vi : item.answer_en}</p>
      </details>
      <div className="rating-row">
        <span>{vi ? 'Bạn nhớ được bao nhiêu?' : 'How well did you recall it?'}</span>
        {['again', 'hard', 'good', 'easy'].map((rating, index) => <button key={rating}
          className={rating} disabled={busy} onClick={(event) => void submit(rating, event.timeStamp)}>
          {vi ? ['Chưa nhớ', 'Khó', 'Nhớ được', 'Dễ'][index] : rating}
        </button>)}
      </div>
    </section> : <section className="section-card" role="status">
      <h3>{vi ? 'Đã hết thẻ trong lượt này' : 'This review session is complete'}</h3>
      <p>{vi ? 'Hoàn thành bài học để mở thẻ mới. Thẻ đã ôn sẽ trở lại theo lịch.'
        : 'Complete a lesson to unlock new cards. Reviewed cards return when due.'}</p>
    </section>}
    {history.length > 0 && <section className="section-card review-history">
      <h3>{vi ? 'Lịch sử gần đây' : 'Recent reviews'}</h3>
      {history.slice(0, 5).map((row) => <p key={row.id}>
        <strong>{row.rating}</strong> · {vi ? row.lesson_title_vi : row.lesson_title_en}
      </p>)}
    </section>}
    {weak.length > 0 && <section className="section-card weak-topics">
      <h3>{vi ? 'Chủ đề cần quay lại' : 'Topics to revisit'}</h3>
      {weak.slice(0, 6).map((topic) => <p key={topic.lesson_slug}>
        <button className="text-button" onClick={() => onOpenLesson(topic.lesson_slug)}>
          {vi ? topic.title_vi : topic.title_en}
        </button> · {topic.hard_attempts}/{topic.attempts}
      </p>)}
    </section>}
  </div>
}
