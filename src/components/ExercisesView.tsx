import { useEffect, useRef, useState } from 'react'
import type { Exercise } from '../api'
import { exerciseCopy } from './exercise-copy'
import { exerciseLevel, exerciseMaterial } from './exercise-materials'
import { ExerciseDetail } from './ExerciseDetail'
import './exercises.css'

type Props = {
  exercises: Exercise[]
  gitPublishAvailable: boolean
  hosted: boolean
  language: 'vi' | 'en'
  onRefresh: () => Promise<void>
}

const selectedSlug = () => new URLSearchParams(window.location.search).get('exercise')

export function ExercisesView({ exercises, gitPublishAvailable, hosted, language, onRefresh }: Props) {
  const t = exerciseCopy[language]
  const vi = language === 'vi'
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState('all')
  const [limit, setLimit] = useState(12)
  const [slug, setSlug] = useState(selectedSlug)
  const lastOpened = useRef<string | null>(null)
  const openButtons = useRef(new Map<string, HTMLButtonElement>())
  const selected = exercises.find((exercise) => exercise.slug === slug)
  useEffect(() => {
    const restore = () => setSlug(selectedSlug())
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])
  useEffect(() => {
    if (!slug && lastOpened.current) openButtons.current.get(lastOpened.current)?.focus()
  }, [slug])

  const select = (next: string | null) => {
    if (next) lastOpened.current = next
    const url = new URL(window.location.href)
    url.hash = ''
    if (next) url.searchParams.set('exercise', next)
    else url.searchParams.delete('exercise')
    window.history.pushState({}, '', url)
    setSlug(next)
  }
  const visible = exercises.filter((exercise) => {
    const text = [exercise.title_vi, exercise.title_en, exercise.description_vi, exercise.description_en].join(' ')
    return text.toLowerCase().includes(query.trim().toLowerCase())
      && (difficulty === 'all' || exerciseLevel(exercise.difficulty) === difficulty)
  })

  return <div className="practice-page">
    {selected ? <ExerciseDetail key={selected.slug} exercise={selected} hosted={hosted}
      gitPublishAvailable={gitPublishAvailable} language={language} onBack={() => select(null)} onRefresh={onRefresh} /> : <>
      <header className="practice-intro">
        <span className="eyebrow accent">{vi ? 'HỌC BẰNG CÁCH LÀM' : 'LEARN BY DOING'}</span>
        <h2>{vi ? 'Từng bài nhỏ. Kỹ năng thật.' : 'Small exercises. Real skills.'}</h2>
        <p>{vi ? 'Chọn một bài, đọc hướng dẫn và tự làm. Đề bài, gợi ý và cách kiểm tra đều ở đây.'
          : 'Pick an exercise, follow the guide and try it yourself. Requirements, hints and checks are all here.'}</p>
      </header>
      {slug && <p role="status">{vi ? 'Không tìm thấy bài này. Hãy chọn một bài bên dưới.'
        : 'Exercise not found. Choose one below.'}</p>}
      <div className="practice-filters">
        <input type="search" aria-label={t.search} value={query} placeholder={`${t.search}…`}
          onChange={(event) => { setQuery(event.target.value); setLimit(12) }} />
        <select aria-label={t.difficulty} value={difficulty}
          onChange={(event) => { setDifficulty(event.target.value); setLimit(12) }}>
          <option value="all">{t.all}</option>
          <option value="easy">{t.easy}</option>
          <option value="medium">{t.medium}</option>
          <option value="hard">{t.hard}</option>
        </select>
        <span className="muted" role="status">{visible.length} {t.count}</span>
      </div>
      {!visible.length && <p className="muted" role="status">{t.empty}</p>}
      <div className="practice-list">
        {visible.slice(0, limit).map((exercise, index) => <article className="exercise-card" key={exercise.slug}>
          <div className="exercise-meta">
            <span>{String(index + 1).padStart(2, '0')} · {exercise.assessment_kind === 'verified' ? t.verified : t.reflection}</span>
            <span>{exercise.estimated_minutes} {t.minutes}</span>
          </div>
          <h3>{vi ? exercise.title_vi : exercise.title_en}</h3>
          <p>{exerciseMaterial(exercise, language).summary}</p>
          <button className="exercise-open" onClick={() => select(exercise.slug)}
            aria-label={`${vi ? 'Mở bài' : 'Open exercise'}: ${vi ? exercise.title_vi : exercise.title_en}`}
            ref={(element) => {
              if (element) openButtons.current.set(exercise.slug, element)
              else openButtons.current.delete(exercise.slug)
            }}>
            {vi ? 'Xem đề & hướng dẫn' : 'Read task & guide'} <span aria-hidden="true">→</span>
          </button>
        </article>)}
      </div>
      {visible.length > limit && <button className="secondary-button exercise-more" onClick={() => setLimit(limit + 12)}>
        {vi ? 'Xem thêm bài tập' : 'Show more exercises'}
      </button>}
    </>}
  </div>
}
