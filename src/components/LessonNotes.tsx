import { useRef, useState } from 'react'
import type { Lesson } from '../api'
import { learningClient as api } from '../platform/learning-client'
import { runtimeConfig } from '../platform/runtime-config'
import { FeedbackPanel } from './FeedbackPanel'

export function LessonNotes({ lesson, language }: { lesson: Lesson; language: 'vi' | 'en' }) {
  const vi = language === 'vi'
  const [body, setBody] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const submitting = useRef(false)
  const save = async () => {
    if (!body.trim() || submitting.current) return
    submitting.current = true
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      await api.createNote({ lesson_slug: lesson.slug,
        title: (vi ? 'Ghi chú: ' : 'Insight: ') + (vi ? lesson.title_vi : lesson.title_en), body: body.trim() })
      setBody('')
      setSaved(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : (vi ? 'Chưa lưu được ghi chú.' : 'The note could not be saved.'))
    } finally {
      submitting.current = false
      setSaving(false)
    }
  }
  return <section id="notes" className="detail-section note-editor lesson-section lesson-section-notes"
    aria-labelledby="lesson-notes-title" tabIndex={-1}>
    <h2 id="lesson-notes-title">{vi ? 'Ghi chú và góp ý' : 'Notes and feedback'}</h2>
    <div className="lesson-note-block">
      <h3>{vi ? 'Ghi chú của bạn' : 'Your note'}</h3>
      <textarea aria-label={vi ? 'Ghi chú của bạn' : 'Your note'} value={body} disabled={saving}
        onChange={(event) => { setBody(event.target.value); setSaved(false) }}
        placeholder={vi ? 'Ghi điều bạn vừa hiểu, lỗi gặp phải hoặc nội dung cần ôn lại…'
          : 'Write an insight, failure or topic to revisit…'} />
      <button className="secondary-button" disabled={!body.trim() || saving} aria-busy={saving}
        onClick={() => void save()}>{saving ? (vi ? 'Đang lưu…' : 'Saving…') : (vi ? 'Lưu ghi chú' : 'Save note')}</button>
      {saved && <p className="success-note" role="status">{vi ? 'Đã lưu vào nhật ký.' : 'Saved to Journal.'}</p>}
      {error && <p className="warning-note" role="alert">{error}</p>}
    </div>
    <FeedbackPanel lesson={lesson} language={language} hosted={runtimeConfig.mode === 'hosted'} />
  </section>
}
