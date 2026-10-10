import { illustrationForLesson } from './learning-illustrations'
import { LearningIllustration } from './LearningIllustration'
import { useEffect, useState, type ReactNode } from 'react'
import routes from '../../content/learning_routes.json'
import './roadmap-routes.css'

type LessonRow = { slug: string; title_vi: string; title_en: string; status: string; estimated_minutes: number }
type Module = { slug: string; title_vi: string; title_en: string; lessons: LessonRow[] }
type Phase = { slug: string; title_vi: string; title_en: string; modules: Module[] }
type Props = {
  roadmap: { phases: Phase[] } | null
  language: 'vi' | 'en'
  showCompletedLessons: boolean
  onOpenLesson: (slug: string) => void
  children?: ReactNode
}

function filtersFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return { q: params.get('q') ?? '', route: params.get('route') ?? 'all',
    phase: params.get('phase') ?? 'all', status: params.get('status') ?? 'all' }
}

export function RoadmapView({ roadmap, language, showCompletedLessons, onOpenLesson, children }: Props) {
  const vi = language === 'vi'
  const [filters, setFilters] = useState(filtersFromUrl)
  const route = routes.routes.find((item) => item.id === filters.route)
  useEffect(() => {
    const restore = () => setFilters(filtersFromUrl())
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])
  const change = (next: Partial<typeof filters>) => {
    const values = { ...filters, ...next }
    setFilters(values)
    const params = new URLSearchParams()
    Object.entries(values).forEach(([key, value]) => { if (value && value !== 'all') params.set(key, value) })
    window.history.replaceState(window.history.state, '', `/roadmap${params.size ? `?${params}` : ''}`)
  }
  if (!roadmap) return <p role="status">{vi ? 'Chưa tải được lộ trình.' : 'Roadmap unavailable.'}</p>
  const ordered = route ? route.phase_ids.flatMap((id) => roadmap.phases.filter((phase) => phase.slug === id))
    : roadmap.phases
  const phases = ordered.filter((phase) => filters.phase === 'all' || phase.slug === filters.phase)
    .map((phase) => ({ ...phase, modules: phase.modules.map((module) => ({
      ...module, lessons: module.lessons.filter((lesson) => {
        if (!showCompletedLessons && filters.status !== 'completed' && lesson.status === 'completed') return false
        if (filters.status !== 'all' && lesson.status !== filters.status) return false
        const text = `${phase.title_vi} ${phase.title_en} ${module.title_vi} ${module.title_en} ${lesson.title_vi} ${lesson.title_en}`
        return text.toLocaleLowerCase().includes(filters.q.trim().toLocaleLowerCase())
      }),
    })).filter((module) => module.lessons.length) })).filter((phase) => phase.modules.length)
  const count = phases.reduce((total, phase) => total + phase.modules.reduce((sum, module) => sum + module.lessons.length, 0), 0)
  return <div className="roadmap-layout"><div className="roadmap-list">
    <header className="roadmap-intro">
      <span className="eyebrow accent">LEARNING PATHS</span>
      <h2>{vi ? 'Chọn hướng học. Làm ra sản phẩm.' : 'Choose a path. Build something real.'}</h2>
      <p>{vi ? routes.workload_note_vi : routes.workload_note_en}</p>
    </header>
    <section className="route-choices" aria-label={vi ? 'Chọn hướng học' : 'Choose a learning path'}>
      {routes.routes.map((item) => <button key={item.id} className="route-choice"
        aria-pressed={route?.id === item.id} onClick={() => change({ route: item.id, phase: 'all' })}>
        <strong>{vi ? item.title_vi : item.title_en}</strong>
        <span>{vi ? item.audience_vi : item.audience_en}</span>
        <small>{item.weekly_hours.join('–')} {vi ? 'giờ/tuần gợi ý' : 'suggested hours/week'}</small>
      </button>)}
    </section>
    {route && <section className="section-card">
      <h3>{vi ? 'Sản phẩm để tự đánh giá' : 'Your practical checkpoint'}</h3>
      <p>{vi ? route.outcome_vi : route.outcome_en}</p>
      <p>{vi ? route.next_vi : route.next_en}</p>
    </section>}
    <div className="filter-bar" role="search">
      <input type="search" aria-label={vi ? 'Tìm bài học hoặc học phần' : 'Search lessons or modules'} value={filters.q}
        placeholder={vi ? 'Tìm bài học…' : 'Find a lesson…'} onChange={(event) => change({ q: event.target.value })} />
      <select aria-label={vi ? 'Lọc theo chặng' : 'Filter by phase'} value={filters.phase}
        onChange={(event) => change({ phase: event.target.value })}>
        <option value="all">{vi ? 'Tất cả chặng' : 'All phases'}</option>
        {ordered.map((phase) => <option key={phase.slug} value={phase.slug}>
          {vi ? phase.title_vi : phase.title_en}</option>)}
      </select>
      <select aria-label={vi ? 'Lọc theo trạng thái' : 'Filter by status'} value={filters.status}
        onChange={(event) => change({ status: event.target.value })}>
        <option value="all">{vi ? 'Mọi trạng thái' : 'All statuses'}</option>
        <option value="not_started">{vi ? 'Chưa bắt đầu' : 'Not started'}</option>
        <option value="in_progress">{vi ? 'Đang học' : 'In progress'}</option>
        <option value="completed">{vi ? 'Hoàn thành' : 'Completed'}</option>
        <option value="needs_review">{vi ? 'Cần ôn' : 'Needs review'}</option>
      </select>
      <button className="text-button" onClick={() => change({ route: 'all', phase: 'all', q: '', status: 'all' })}>
        {vi ? 'Xóa bộ lọc' : 'Clear filters'}</button>
    </div>
    <p role="status">{count} {vi ? 'bài học' : 'lessons'} · {vi ? 'Thời lượng là thời gian đọc ước tính.'
      : 'Durations estimate reading time.'}</p>
    {!showCompletedLessons && filters.status !== 'completed' && <p className="muted">{vi
      ? 'Bài hoàn thành đang được ẩn theo cài đặt. Chọn trạng thái “Hoàn thành” để xem lại.'
      : 'Completed lessons are hidden by your settings. Choose “Completed” to revisit them.'}</p>}
    {!count && <p>{vi ? 'Không có bài phù hợp bộ lọc này.' : 'No lessons match these filters.'}</p>}
    {phases.map((phase, index) => <section className="phase-block" key={phase.slug}>
      <header className="phase-header"><span className="phase-index">{String(index + 1).padStart(2, '0')}</span>
        <LearningIllustration name={illustrationForLesson(phase.slug)} variant="thumbnail" />
    <h3>{vi ? phase.title_vi : phase.title_en}</h3></header>
      {phase.modules.map((module) => <div className="module-block" key={module.slug}>
        <h4 className="module-title">{vi ? module.title_vi : module.title_en}</h4>
        {module.lessons.map((lesson) => <button className={`lesson-row ${lesson.status === 'completed' ? 'done' : ''}`}
          key={lesson.slug} onClick={() => onOpenLesson(lesson.slug)}>
          <span className="lesson-check" aria-hidden="true">{lesson.status === 'completed' ? '✓' : '○'}</span>
          <span>{vi ? lesson.title_vi : lesson.title_en}</span><small>{lesson.estimated_minutes}m</small>
        </button>)}
      </div>)}
    </section>)}
    {children}
  </div></div>
}
