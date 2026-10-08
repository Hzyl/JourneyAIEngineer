import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import type { Lesson } from '../api'
import { useAuth } from '../auth/AuthProvider'
import { runtimeConfig } from '../platform/runtime-config'
import { checklistKey, readChecklist } from '../platform/checklist-storage'
import { LessonReading, LessonChecks, LessonRelated, LessonResources } from './LessonContent'
import { LessonNotes } from './LessonNotes'
import { LessonProgress, type ProgressAction } from './LessonProgress'
import './lesson-reading.css'

type Actions = {
  onProgress: ProgressAction
  onOpenLesson: (slug: string) => void
  nextLessonTitles: Record<string, string>
  onOpenExercise: (slug: string) => void
}
type Props = Actions & {
  lesson: Lesson | null; lessonLoading: boolean; language: 'vi' | 'en'; onBack: () => void
}

export function LessonPage({ lesson, lessonLoading, language, onBack, ...actions }: Props) {
  const { session } = useAuth()
  const vi = language === 'vi'
  return <section className="lesson-page" aria-label={vi ? 'Trang bài học' : 'Lesson page'}>
    <div className="lesson-page-toolbar">
      <button className="back-button" type="button" onClick={onBack}
        aria-label={vi ? 'Quay lại' : 'Back'}>
        ← <span>{vi ? 'Quay lại' : 'Back'}</span>
      </button>
      <div className="lesson-page-context">
        <span className="eyebrow accent">{vi ? 'KHÔNG GIAN BÀI HỌC' : 'LESSON WORKSPACE'}</span>
        {lesson && <span>{vi ? lesson.module_title_vi : lesson.module_title_en}</span>}
      </div>
      {lesson && <span className="lesson-page-meta">{lesson.estimated_minutes} {vi ? 'phút học' : 'min study'}</span>}
    </div>
    {lessonLoading ? <div className="lesson-page-loading">
      <div className="loading-state compact" role="status" aria-live="polite">
        <div className="loading-orb" aria-hidden="true" />
        <p>{vi ? 'Đang mở bài học…' : 'Loading lesson…'}</p>
      </div>
    </div> : lesson ? <div className="lesson-page-shell">
      <LessonDetail key={`${session?.user.id ?? 'local'}:${lesson.slug}`}
        lesson={lesson} language={language} {...actions} />
    </div> : <div className="empty-state" role="status">
      <h3>{vi ? 'Chưa tải được bài học' : 'Lesson unavailable'}</h3>
      <p>{vi ? 'Dùng nút thử lại phía trên để tải lại bài học.' : 'Use the retry button above to load the lesson again.'}</p>
    </div>}
  </section>
}

function focusSection(id: string, smooth = false) {
  const target = document.getElementById(id)
  if (!target) return false
  target.focus({ preventScroll: true })
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: smooth && !reduceMotion ? 'smooth' : 'auto', block: 'start' })
  return true
}

function LessonAnchorNav({ language }: { language: 'vi' | 'en' }) {
  const vi = language === 'vi'
  const items = vi
    ? [['overview', 'Tổng quan'], ['concept', 'Khái niệm'], ['practice', 'Thực hành'],
      ['check', 'Kiểm tra hiểu'], ['resources', 'Tài liệu'], ['notes', 'Ghi chú & feedback']]
    : [['overview', 'Overview'], ['concept', 'Concept'], ['practice', 'Practice'],
      ['check', 'Check understanding'], ['resources', 'Resources'], ['notes', 'Notes & feedback']]
  const jumpTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    if (focusSection(id, true)) window.history.replaceState(window.history.state, '', `#${id}`)
  }
  return <nav className="lesson-anchor-nav" aria-label={vi ? 'Mục lục bài học' : 'Lesson contents'}>
    <span className="lesson-anchor-label">{vi ? 'Trong bài này' : 'In this lesson'}</span>
    {items.map(([id, label]) => <a key={id} href={`#${id}`} onClick={(event) => jumpTo(event, id)}>{label}</a>)}
  </nav>
}

function LessonDetail({ lesson: original, language, onProgress, ...navigation }:
  Actions & { lesson: Lesson; language: 'vi' | 'en' }) {
  const { session } = useAuth()
  const vi = language === 'vi'
  const lesson = vi ? original : { ...original,
    checklist: original.completion_checklist_en ?? original.checklist,
    completion_criteria: original.completion_criteria_en ?? original.completion_criteria,
    common_mistakes: original.common_mistakes_en ?? original.common_mistakes,
  }
  const storageKey = checklistKey(lesson.slug, runtimeConfig.mode === 'hosted' ? session?.user.id ?? 'signed-out' : null)
  const [checked, setChecked] = useState(() => readChecklist(storageKey, lesson.checklist.length))
  const [nudge, setNudge] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const completedCount = checked.slice(0, lesson.checklist.length).filter(Boolean).length
  useEffect(() => {
    if (focusSection(window.location.hash.slice(1))) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    titleRef.current?.focus({ preventScroll: true })
  }, [lesson.slug])
  useEffect(() => {
    try { window.localStorage.setItem(storageKey, JSON.stringify(checked)) }
    catch { /* A blocked browser store must not prevent learning. */ }
  }, [checked, storageKey])
  const toggle = (index: number) => {
    setChecked((current) => Array.from({ length: lesson.checklist.length }, (_, i) =>
      i === index ? !current[i] : Boolean(current[i])))
    setNudge(false)
  }
  return <div className="lesson-detail" tabIndex={-1}>
    <span className="eyebrow accent">{vi ? lesson.phase_title_vi : lesson.phase_title_en}
      {' · '}{vi ? lesson.module_title_vi : lesson.module_title_en}</span>
    <h1 ref={titleRef} id="lesson-page-title" tabIndex={-1}>{vi ? lesson.title_vi : lesson.title_en}</h1>
    <p className="tag">{lesson.quality_status === 'reviewed'
      ? (vi ? 'Nội dung đã rà soát' : 'Reviewed content')
      : (vi ? 'Bản nháp · nội dung đang được hoàn thiện' : 'Draft · content is being developed')}</p>
    <p className="muted">{vi ? 'Hoàn thành là tiến độ bạn tự ghi nhận; không phải chứng nhận năng lực.'
      : 'Completion records your own progress; it is not a skills certification.'}</p>
    <p className="lead">{vi ? lesson.summary_vi : lesson.summary_en}</p>
    <div className="tag-list">
      {lesson.keywords.slice(0, 6).map((keyword) => <span className="tag" key={keyword}>{keyword}</span>)}
      <span className="tag">{lesson.estimated_minutes} {vi ? 'phút' : 'min'}</span>
    </div>
    <LessonAnchorNav language={language} />
    <div id="overview" className="lesson-evidence lesson-section-overview" tabIndex={-1}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">01 · {vi ? 'TỔNG QUAN' : 'OVERVIEW'}</span>
          <strong>{vi ? 'Bằng chứng đã làm' : 'Evidence completed'}</strong>
        </div>
        <span>{completedCount}/{lesson.checklist.length}</span>
      </div>
      <div className="session-progress" role="progressbar"
        aria-label={vi ? 'Tiến độ checklist bài học' : 'Lesson checklist progress'}
        aria-valuemin={0} aria-valuemax={lesson.checklist.length || 1} aria-valuenow={completedCount}>
        <span style={{ width: `${lesson.checklist.length ? completedCount / lesson.checklist.length * 100 : 0}%` }} />
      </div>
      <small>{vi ? 'Hoàn thiện checklist trước khi đánh dấu hoàn thành để tự kiểm tra mức độ hiểu.'
        : 'Finish the checklist before marking the lesson complete.'}</small>
    </div>
    <LessonReading lesson={lesson} language={language} />
    <LessonRelated lesson={lesson} language={language} {...navigation} />
    <LessonChecks lesson={lesson} language={language} {...navigation} checked={checked} nudge={nudge} onToggle={toggle} />
    <LessonResources lesson={lesson} language={language} />
    <LessonNotes lesson={lesson} language={language} />
    <LessonProgress lesson={lesson} language={language} checklistComplete={completedCount === lesson.checklist.length}
      onProgress={onProgress} onChecklistNudge={() => {
        setNudge(true)
        focusSection('check', true)
      }} />
    <div className="ask-box">
      <span className="eyebrow">{vi ? 'HỎI TRỢ LÝ CỦA BẠN' : 'ASK YOUR ASSISTANT'}</span>
      <h4>{vi ? 'Đang vướng ở đâu?' : 'Where are you stuck?'}</h4>
      <p>{vi ? 'Mở Journal để tạo bản tóm tắt bài học, mục tiêu và câu hỏi rồi chuyển sang ChatGPT/Codex.'
        : 'Open Journal to prepare a summary of the lesson, goals and your question for ChatGPT/Codex.'}</p>
    </div>
  </div>
}
