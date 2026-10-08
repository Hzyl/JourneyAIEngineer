import { useEffect, useState } from 'react'
import { learningClient as api } from '../platform/learning-client'
import { reviewRatingLabel } from './review-copy'

type History = { id: number | string; rating: string; lesson_title_vi: string; lesson_title_en: string }
type Topic = { lesson_slug: string; title_vi: string; title_en: string; hard_attempts: number; attempts: number }
type Props = { version: unknown; language: 'vi' | 'en'; onOpenLesson: (slug: string) => void }

export function ReviewActivity({ version, language, onOpenLesson }: Props) {
  const vi = language === 'vi'
  const [revision, setRevision] = useState(0)
  const [settled, setSettled] = useState<{ version: unknown; revision: number } | null>(null)
  const loading = !settled || settled.version !== version || settled.revision !== revision
  const [history, setHistory] = useState<History[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [failed, setFailed] = useState({ history: false, topics: false })

  useEffect(() => {
    let alive = true
    void Promise.allSettled([api.reviewHistory(), api.weakTopics()]).then(([past, weak]) => {
      if (!alive) return
      setHistory(past.status === 'fulfilled' ? past.value.items : [])
      setTopics(weak.status === 'fulfilled' ? weak.value.items : [])
      setFailed({ history: past.status === 'rejected', topics: weak.status === 'rejected' })
      setSettled({ version, revision })
    })
    return () => { alive = false }
  }, [version, revision])

  return <div className="review-activity" aria-busy={loading}>
    {loading && <p role="status">{vi ? 'Đang tải hoạt động ôn tập…' : 'Loading review activity…'}</p>}
    <section className="section-card review-history">
      <h3>{vi ? 'Lịch sử gần đây' : 'Recent reviews'}</h3>
      {failed.history && <p role="alert">{vi ? 'Chưa tải được lịch sử ôn tập.' : 'Review history could not be loaded.'}</p>}
      {!loading && !failed.history && !history.length && <p>{vi
        ? 'Chưa có lượt ôn nào được ghi nhận.' : 'No reviews have been recorded yet.'}</p>}
      {history.slice(0, 5).map((row) => <p key={row.id}>
        <strong>{reviewRatingLabel(row.rating, language)}</strong> · {vi ? row.lesson_title_vi : row.lesson_title_en}
      </p>)}
    </section>
    <section className="section-card weak-topics">
      <h3>{vi ? 'Chủ đề cần quay lại' : 'Topics to revisit'}</h3>
      {failed.topics && <p role="alert">{vi ? 'Chưa tải được gợi ý ôn tập.' : 'Review suggestions could not be loaded.'}</p>}
      {!loading && !failed.topics && !topics.length && <p>{vi
        ? 'Chưa có chủ đề nào để gợi ý.' : 'No topics to suggest yet.'}</p>}
      {topics.slice(0, 6).map((topic) => <p key={topic.lesson_slug}>
        <button className="text-button" onClick={() => onOpenLesson(topic.lesson_slug)}>
          {vi ? topic.title_vi : topic.title_en}
        </button>
        <span>{vi ? 'Chưa nhớ hoặc khó: ' : 'Again or Hard: '}{topic.hard_attempts}/{topic.attempts}
          {' '}{vi ? 'lượt ôn' : 'reviews'}</span>
      </p>)}
    </section>
    {(failed.history || failed.topics) && <button className="secondary-button" disabled={loading}
      aria-busy={loading} onClick={() => setRevision((value) => value + 1)}>
      {vi ? 'Thử tải lại hoạt động' : 'Retry activity'}
    </button>}
  </div>
}
