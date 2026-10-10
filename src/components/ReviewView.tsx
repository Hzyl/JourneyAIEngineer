import { LearningIllustration } from './LearningIllustration'
import { useEffect, useRef, useState } from 'react'
import { ReviewCard, type ReviewItem, type ReviewRating } from './ReviewCard'
import { ReviewActivity } from './ReviewActivity'
import './review-ui.css'

type Props = {
  reviews: ReviewItem[]
  language: 'vi' | 'en'
  onAnswer: (id: number | string, rating: string, seconds?: number, answer?: string) => Promise<void>
  onOpenLesson: (slug: string) => void
}

export function ReviewView({ reviews, language, onAnswer, onOpenLesson }: Props) {
  const vi = language === 'vi'
  const [answered, setAnswered] = useState<Set<number | string>>(() => new Set())
  const [pending, setPending] = useState<{ card: ReviewItem; rating: ReviewRating } | null>(null)
  const [error, setError] = useState('')
  const submitting = useRef(false)
  const emptyHeading = useRef<HTMLHeadingElement>(null)
  const remaining = reviews.filter((card) => !answered.has(card.id))
  const item = pending?.card ?? remaining[0]
  const itemId = item?.id

  useEffect(() => {
    if (itemId === undefined) emptyHeading.current?.focus()
  }, [itemId])

  const submit = async (rating: ReviewRating, seconds: number, answer: string) => {
    if (!item || submitting.current) return false
    submitting.current = true
    setPending({ card: item, rating })
    setError('')
    try {
      await onAnswer(item.id, rating, seconds, answer)
      setAnswered((current) => new Set([...current, item.id]))
      return true
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : (vi ? 'Chưa lưu được câu trả lời.' : 'Answer not saved.'))
      return false
    } finally {
      submitting.current = false
      setPending(null)
    }
  }

  return <div className="review-layout">
    <LearningIllustration name="review" />
    <header className="review-header">
      <span className="eyebrow accent">{vi ? 'ÔN TẬP CÁCH QUÃNG' : 'SPACED REVIEW'}</span>
      <h2>{vi ? 'Tự nhớ lại để hiểu và nhớ lâu hơn.' : 'Remember through active recall.'}</h2>
      <p role="status">{remaining.filter((card) => card.queue_status !== 'new').length} {vi ? 'đến hạn' : 'due'} ·{' '}
        {remaining.filter((card) => card.queue_status === 'new').length} {vi ? 'thẻ mới' : 'new cards'}</p>
    </header>
    {error && <p className="error-banner" role="alert">{error}</p>}
    {item ? <ReviewCard key={`${typeof item.id}:${item.id}`} item={item} language={language}
      pendingRating={pending?.rating ?? null} onSubmit={submit} onEdit={() => setError('')} />
      : <section className="section-card review-empty" role="status">
        <h3 ref={emptyHeading} tabIndex={-1}>{vi ? 'Đã hết thẻ trong lượt này' : 'This review session is complete'}</h3>
        <p>{vi ? 'Hoàn thành bài học để mở thẻ mới. Thẻ đã ôn sẽ trở lại theo lịch.'
          : 'Complete a lesson to unlock new cards. Reviewed cards return when due.'}</p>
      </section>}
    <ReviewActivity version={reviews} language={language} onOpenLesson={onOpenLesson} />
  </div>
}
