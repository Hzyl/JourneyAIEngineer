import { useRef, useState } from 'react'
import type { Lesson } from '../api'

export type ProgressAction = (slug: string, status: string, minutes?: number) => Promise<void>

export function LessonProgress({ lesson, language, checklistComplete, onChecklistNudge, onProgress }: {
  lesson: Lesson; language: 'vi' | 'en'; checklistComplete: boolean
  onChecklistNudge: () => void; onProgress: ProgressAction
}) {
  const vi = language === 'vi'
  const [minutes, setMinutes] = useState(String(Math.max(15, Math.min(lesson.estimated_minutes, 120))))
  const [error, setError] = useState<'minutes' | 'save' | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const submitting = useRef(false)
  const markProgress = async () => {
    if (submitting.current) return
    setError(null)
    setSaved(false)
    const nextStatus = lesson.status === 'completed' ? 'needs_review' : 'completed'
    if (nextStatus === 'completed' && !checklistComplete) {
      onChecklistNudge()
      return
    }
    const count = Number(minutes)
    if (!Number.isInteger(count) || count < 1 || count > 1440) {
      setError('minutes')
      return
    }
    submitting.current = true
    setSaving(true)
    try {
      await onProgress(lesson.slug, nextStatus, count)
      setSaved(true)
    } catch {
      setError('save')
    } finally {
      submitting.current = false
      setSaving(false)
    }
  }
  return <>
    <div className="detail-actions">
      <label className="session-minutes">{vi ? 'Phút học' : 'Study minutes'}
        <input type="number" min="1" max="1440" step="1" value={minutes} disabled={saving}
          aria-invalid={error === 'minutes'} aria-describedby={error === 'minutes' ? 'lesson-progress-error' : undefined}
          onChange={(event) => { setMinutes(event.target.value); setError(null); setSaved(false) }} />
      </label>
      <button className="primary-button" disabled={saving} aria-busy={saving} onClick={() => void markProgress()}>
        {saving ? (vi ? 'Đang lưu…' : 'Saving…') : lesson.status === 'completed'
          ? (vi ? 'Đánh dấu cần ôn' : 'Mark for review') : (vi ? 'Đánh dấu hoàn thành' : 'Mark complete')}
        {!saving && <span aria-hidden="true"> ✓</span>}
      </button>
    </div>
    {saved && <p className="success-note" role="status">{vi ? 'Đã lưu tiến độ.' : 'Progress saved.'}</p>}
    {error && <p className="warning-note" role="alert" id="lesson-progress-error">{error === 'minutes'
      ? (vi ? 'Nhập số phút nguyên từ 1 đến 1440.' : 'Enter a whole number of minutes from 1 to 1440.')
      : (vi ? 'Chưa lưu được tiến độ. Kiểm tra kết nối và thử lại.' : 'Progress was not saved. Check your connection and retry.')}
    </p>}
  </>
}
