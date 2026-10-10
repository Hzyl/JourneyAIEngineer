import { useEffect, useId, useRef, useState } from 'react'
import { reviewRatings } from './review-copy'

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy'
export type ReviewItem = {
  id: number | string
  question_vi: string
  question_en: string
  answer_vi: string
  answer_en: string
  phase_title_vi: string
  phase_title_en: string
  queue_status?: 'new' | 'due'
}
type Props = {
  item: ReviewItem
  language: 'vi' | 'en'
  pendingRating: ReviewRating | null
  onSubmit: (rating: ReviewRating, seconds: number, answer: string) => Promise<boolean>
  onEdit: () => void
}

export function ReviewCard({ item, language, pendingRating, onSubmit, onEdit }: Props) {
  const vi = language === 'vi'
  const [answer, setAnswer] = useState('')
  const startedAt = useRef<number | null>(null)
  const submitting = useRef(false)
  const attempted = useRef<{ rating: ReviewRating; answer: string; seconds: number } | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const labelId = useId()
  const busy = pendingRating !== null
  useEffect(() => { heading.current?.focus() }, [])

  const submit = async (rating: ReviewRating, submittedAt: number) => {
    if (submitting.current || busy) return
    submitting.current = true
    const previous = attempted.current
    const retry = previous?.rating === rating && previous.answer === answer
    const elapsed = startedAt.current === null ? 0 : Math.round((submittedAt - startedAt.current) / 1000)
    const seconds = retry ? previous.seconds : Math.max(0, Math.min(7200, elapsed))
    attempted.current = { rating, answer, seconds }
    try {
      if (await onSubmit(rating, seconds, answer)) {
        setAnswer('')
        startedAt.current = null
        attempted.current = null
      }
    } finally { submitting.current = false }
  }

  return <section className="review-card" aria-busy={busy} aria-labelledby={`${labelId}-question`}>
    <div className="review-card-meta">
      <span>{item.queue_status === 'new' ? (vi ? 'Thẻ mới' : 'New card') : (vi ? 'Đến hạn' : 'Due')}</span>
      <span>{vi ? item.phase_title_vi : item.phase_title_en}</span>
    </div>
    <h3 ref={heading} id={`${labelId}-question`} tabIndex={-1}>{vi ? item.question_vi : item.question_en}</h3>
    <label className="review-answer-label">
      {vi ? 'Câu trả lời của bạn' : 'Your review answer'}
      <textarea value={answer} disabled={busy}
        onFocus={(event) => { startedAt.current ??= event.timeStamp }}
        onChange={(event) => { setAnswer(event.target.value); onEdit() }}
        placeholder={vi ? 'Thử trả lời trước khi xem đáp án…' : 'Try answering before revealing the answer…'} />
    </label>
    <details>
      <summary>{vi ? 'Xem đáp án gợi ý' : 'Reveal suggested answer'}</summary>
      <p>{vi ? item.answer_vi : item.answer_en}</p>
    </details>
    <div className="rating-row" role="group" aria-labelledby={`${labelId}-rating`}>
      <span id={`${labelId}-rating`}>{vi ? 'Bạn nhớ được bao nhiêu?' : 'How well did you recall it?'}</span>
      {reviewRatings(language).map(({ rating, label, description }) => <button key={rating}
        className={rating} disabled={busy} aria-busy={pendingRating === rating} aria-label={label}
        aria-describedby={`${labelId}-${rating}`} onClick={(event) => void submit(rating, event.timeStamp)}>
        <strong>{pendingRating === rating ? (vi ? 'Đang lưu…' : 'Saving…') : label}</strong>
        <small id={`${labelId}-${rating}`}>{description}</small>
      </button>)}
    </div>
    <p className="review-rating-note">{vi
      ? 'Tự đánh giá theo câu trả lời trước khi xem gợi ý. Xem đáp án chưa ghi nhận một lượt ôn; chọn mức nhớ để lưu.'
      : 'Rate what you recalled before viewing the hint. Revealing the answer does not record a review; choose a rating to save.'}</p>
  </section>
}
