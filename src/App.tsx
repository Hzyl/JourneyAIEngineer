/* oxlint-disable react(set-state-in-effect) */
import { useEffect, useRef, useState } from 'react'
import { api, type AppSettings, type Dashboard, type Exercise, type Lesson } from './api'
import './App.css'

type View = 'dashboard' | 'roadmap' | 'review' | 'exercises' | 'tools' | 'journal' | 'settings'
const navItems: Array<{ id: View; label: string; icon: string; hint: string }> = [
  { id: 'dashboard', label: 'Tổng quan', icon: '◐', hint: 'Nhịp học hôm nay' },
  { id: 'roadmap', label: 'Lộ trình', icon: '◎', hint: '8 phase · 53 tuần' },
  { id: 'review', label: 'Ôn tập', icon: '↻', hint: 'Nhớ lâu hơn' },
  { id: 'exercises', label: 'Bài tập', icon: '⌘', hint: 'Mở bằng VS Code' },
  { id: 'tools', label: 'Công cụ', icon: '◇', hint: 'Dùng đúng lúc' },
  { id: 'journal', label: 'Journal & Git', icon: '✎', hint: 'Ghi lại hành trình' },
  { id: 'settings', label: 'Cài đặt', icon: '⚙', hint: 'Nhịp học cá nhân' },
]

function App() {
  const [view, setView] = useState<View>('dashboard')
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [roadmap, setRoadmap] = useState<any | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [tools, setTools] = useState<any[]>([])
  const [settings, setSettings] = useState<AppSettings>({ language: 'vi', track: 'standard', weekly_goal_minutes: 720, show_completed_lessons: true, target_role: 'internship', experience_level: 'beginner', onboarding_complete: false })
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = async () => {
    setLoading(true)
    try {
      const [nextDashboard, nextRoadmap, nextReviews, nextExercises, nextTools, nextSettings] = await Promise.all([api.dashboard(), api.roadmap(), api.reviews(), api.exercises(), api.tools(), api.settings()])
      setDashboard(nextDashboard); setRoadmap(nextRoadmap); setReviews(nextReviews.items); setExercises(nextExercises.exercises); setTools(nextTools.tools); setSettings(nextSettings); setError('')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không kết nối được backend') } finally { setLoading(false) }
  }
  // The effect is the boundary that synchronizes server state into the local UI.
  // oxlint-disable-next-line
  useEffect(() => { void refresh() }, [])
  useEffect(() => { if (!selectedLesson) return; void api.lesson(selectedLesson).then(setLesson).catch((cause) => setError(cause instanceof Error ? cause.message : 'Không tải được lesson')) }, [selectedLesson])
  const openLesson = (slug: string) => { setSelectedLesson(slug); setView('roadmap') }
  const changeLanguage = async () => setSettings(await api.updateSettings({ language: settings.language === 'vi' ? 'en' : 'vi' }))
  const changeTrack = async (value: AppSettings['track']) => setSettings(await api.updateSettings({ track: value }))
  const updateProgress = async (slug: string, status: string, minutes = 0) => { await api.updateProgress(slug, status, minutes); await refresh(); if (selectedLesson) setLesson(await api.lesson(selectedLesson)) }

  return <div className="app-shell"><a className="skip-link" href="#main-content">Bỏ qua đến nội dung chính</a>
    <aside className="sidebar"><div className="brand-lockup"><div className="brand-mark">J</div><div><strong>Journey</strong><span>AI Engineer</span></div></div><div className="sidebar-intro">Một chương trình học có nhịp, có bằng chứng và có sản phẩm.</div><nav aria-label="Điều hướng chính" className="nav-list">{navItems.map((item) => <button className={`nav-item ${view === item.id ? 'active' : ''}`} key={item.id} onClick={() => setView(item.id)} aria-current={view === item.id ? 'page' : undefined}><span className="nav-icon" aria-hidden="true">{item.icon}</span><span><strong>{item.label}</strong><small>{item.hint}</small></span></button>)}</nav><div className="sidebar-footer"><div className="status-dot"><span /> Local workspace</div><small>Progress được lưu trên máy của bạn</small></div></aside>
    <main className="main-area" id="main-content"><header className="topbar"><div><span className="eyebrow">PERSONAL LEARNING OS</span><h1>{view === 'dashboard' ? 'Hôm nay học gì?' : navItems.find((item) => item.id === view)?.label}</h1></div><div className="topbar-actions"><button className="language-chip" onClick={() => void changeLanguage()} aria-label="Đổi ngôn ngữ">{settings.language === 'vi' ? 'VI' : 'EN'} <i>·</i> {settings.language === 'vi' ? 'EN' : 'VI'}</button><button className="refresh-button" onClick={() => void refresh()} aria-label="Làm mới dữ liệu">↻</button></div></header>{error && <div className="error-banner" role="alert"><strong>Backend chưa sẵn sàng.</strong> {error} <span>Chạy <code>scripts/dev.ps1</code> rồi bấm ↻.</span></div>}{loading && !dashboard ? <LoadingState /> : <div className="page-content">{view === 'dashboard' && <DashboardView dashboard={dashboard} program={roadmap?.program} onOpenLesson={openLesson} onNavigate={setView} onRecordSession={async (minutes, note) => { await api.createSession({ minutes, note }); await refresh() }} />}{view === 'roadmap' && <RoadmapView roadmap={roadmap} selectedLesson={lesson} language={settings.language} track={settings.track} onTrackChange={(value) => void changeTrack(value)} onOpenLesson={openLesson} onProgress={updateProgress} onOpenExercises={() => setView('exercises')} />}{view === 'review' && <ReviewView reviews={reviews} onAnswer={async (id, rating, thoughtSeconds, answerText) => { await api.answerReview(id, rating, thoughtSeconds, answerText); const next = await api.reviews(); setReviews(next.items); await refresh() }} />}{view === 'exercises' && <ExercisesView exercises={exercises} onRefresh={refresh} />}{view === 'tools' && <ToolsView tools={tools} />}{view === 'settings' && <SettingsView settings={settings} onSave={async (next) => setSettings(await api.updateSettings(next))} />}{view === 'journal' && <JournalView onExportContext={async (question) => { const result = await api.exportContext({ lesson_slug: lesson?.slug, question }); await navigator.clipboard?.writeText(result.content); window.alert(`Đã tạo context và copy vào clipboard:\n${result.path}`) }} />}</div>}</main>
  </div>
}

function LoadingState() { return <div className="loading-state"><div className="loading-orb" /><p>Đang nạp chương trình học...</p></div> }
function Metric({ label, value, detail, tone, action }: { label: string; value: string; detail: string; tone: string; action?: () => void }) { return <button className={`metric-card ${tone}`} onClick={action}><span>{label}</span><strong>{value}</strong><small>{detail}</small></button> }

function DashboardView({ dashboard, program, onOpenLesson, onNavigate, onRecordSession }: { dashboard: Dashboard | null; program?: any; onOpenLesson: (slug: string) => void; onNavigate: (view: View) => void; onRecordSession: (minutes: number, note: string) => Promise<void> }) {
  if (!dashboard) return <EmptyState title="Chưa có dashboard" description="Khởi động backend để nạp curriculum." />
  return <><section className="hero-panel"><div className="hero-copy"><span className="eyebrow accent">WEEKLY PRACTICE LOOP</span><h2>Tiến từng bước,<br /><em>ship từng project.</em></h2><p>Học lý thuyết vừa đủ, làm bài trong VS Code, ôn lại đúng lúc và lưu lại bằng chứng trên GitHub.</p><button className="primary-button" onClick={() => dashboard.current_lesson ? onOpenLesson(dashboard.current_lesson.slug) : onNavigate('roadmap')}>{dashboard.current_lesson ? 'Tiếp tục lesson' : 'Xem lộ trình'} <span>→</span></button></div><div className="hero-progress"><div className="progress-ring" style={{ '--progress': `${dashboard.progress_percent * 3.6}deg` } as React.CSSProperties}><div><strong>{Math.round(dashboard.progress_percent)}%</strong><span>đã đi</span></div></div><p>12–15 tháng<br /><strong>AI Engineer track</strong></p></div></section><section className="metric-grid" aria-label="Thống kê học tập"><Metric label="Lessons hoàn thành" value={`${dashboard.completed_lessons}/${dashboard.total_lessons}`} detail={`${dashboard.in_progress_lessons} đang học`} tone="teal" /><Metric label="Ôn tập đến hạn" value={String(dashboard.due_reviews)} detail="review cards" tone="orange" action={() => onNavigate('review')} /><Metric label="Thời gian tuần này" value={`${dashboard.weekly_minutes}m`} detail={`${dashboard.weekly_goal_minutes}m mục tiêu`} tone="blue" /><Metric label="Streak" value={`${dashboard.streak_days} ngày`} detail={`${dashboard.lessons_this_week} lesson tuần này`} tone="ink" /><Metric label="Phases" value={`${dashboard.phases.filter((phase) => phase.completed === phase.lessons && phase.lessons > 0).length}/${dashboard.phases.length}`} detail="đã hoàn tất" tone="ink" action={() => onNavigate('roadmap')} /></section><StudySessionCard onRecord={onRecordSession} weeklyMinutes={dashboard.weekly_minutes} weeklyGoal={dashboard.weekly_goal_minutes} />{dashboard.completed_lessons === 0 && <GettingStartedCard onNavigate={onNavigate} />}<section className="content-grid dashboard-grid"><div className="section-card current-card"><div className="section-heading"><div><span className="eyebrow">NEXT UP</span><h3>{dashboard.current_lesson?.title_vi ?? 'Bạn đã hoàn thành roadmap'}</h3></div><span className="tag">45–60 phút</span></div>{dashboard.current_lesson ? <><p className="muted">{dashboard.current_lesson.phase_title} · {dashboard.current_lesson.module_title}</p><div className="lesson-strip"><div className="strip-number">01</div><div><strong>Học bằng hành động</strong><p>Đọc mục tiêu, chạy ví dụ và tạo một bằng chứng nhỏ trong workspace.</p></div><button className="icon-button" onClick={() => onOpenLesson(dashboard.current_lesson!.slug)}>→</button></div></> : <p className="muted">Mở Journal để ghi lại capstone tiếp theo.</p>}</div><div className="section-card phases-card"><div className="section-heading"><div><span className="eyebrow">YOUR ARC</span><h3>Nhịp theo phase</h3></div><button className="text-button" onClick={() => onNavigate('roadmap')}>Mở roadmap →</button></div>{dashboard.phases.slice(0, 5).map((phase) => <div className="phase-row" key={phase.slug}><div className="phase-label"><span>{String(phase.slug.split('-')[1]).padStart(2, '0')}</span><strong>{phase.title_vi}</strong></div><div className="mini-progress"><span style={{ width: `${phase.lessons ? (phase.completed / phase.lessons) * 100 : 0}%` }} /></div><small>{phase.completed}/{phase.lessons}</small></div>)}</div><HiringReadinessCard dashboard={dashboard} program={program} /></section></>
}

function StudySessionCard({ onRecord, weeklyMinutes, weeklyGoal }: { onRecord: (minutes: number, note: string) => Promise<void>; weeklyMinutes: number; weeklyGoal: number }) {
  const [minutes, setMinutes] = useState('45')
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const submit = async () => {
    const value = Number(minutes)
    if (!Number.isInteger(value) || value < 1 || value > 1440) return
    setSaving(true)
    setSaveError('')
    try {
      await onRecord(value, note.trim())
      setNote('')
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2200)
    } catch {
      setSaveError('Không lưu được phiên học. Hãy kiểm tra backend rồi thử lại.')
    } finally {
      setSaving(false)
    }
  }
  const goalPercent = weeklyGoal > 0 ? Math.min(100, Math.round((weeklyMinutes / weeklyGoal) * 100)) : 0
  return <section className="section-card session-card"><div className="section-heading"><div><span className="eyebrow">STUDY SESSION</span><h3>Ghi lại một phiên học</h3></div><span className="tag">local only</span></div><p className="muted">Ghi thời gian thật sau mỗi phiên để Dashboard tính weekly goal và streak.</p><div className="session-progress" role="progressbar" aria-label="Tiến độ mục tiêu tuần" aria-valuemin={0} aria-valuemax={100} aria-valuenow={goalPercent}><span style={{ width: String(goalPercent) + '%' }} /></div><p className="session-goal"><strong>{weeklyMinutes} / {weeklyGoal} phút</strong> · {goalPercent}% mục tiêu tuần</p><div className="session-form"><label>Phút<input type="number" min="1" max="1440" value={minutes} onChange={(event) => setMinutes(event.target.value)} /></label><label>Ghi chú<input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ví dụ: hoàn thành gradient descent lab" /></label><button className="secondary-button" disabled={saving} onClick={() => void submit()}>{saving ? 'Đang lưu…' : 'Lưu phiên học'}</button></div>{saved && <p className="success-note" role="status">Đã ghi phiên học.</p>}{saveError && <p className="warning-note" role="alert">{saveError}</p>}</section>
}

function GettingStartedCard({ onNavigate }: { onNavigate: (view: View) => void }) {
  return <section className="section-card getting-started"><div className="section-heading"><div><span className="eyebrow accent">FIRST WEEK</span><h3>Bắt đầu đúng cách</h3></div><span className="tag">3 bước</span></div><p className="muted">Đừng cố học hết ngay. Hãy tạo nhịp học nhỏ, có code và có bằng chứng từ tuần đầu.</p><div className="start-steps"><button onClick={() => onNavigate('roadmap')}><span>01</span><strong>Đánh giá đầu vào</strong><small>Chọn lesson Phase 0 và xác định lỗ hổng.</small></button><button onClick={() => onNavigate('exercises')}><span>02</span><strong>Chạy bài tập đầu tiên</strong><small>Mở workspace, sửa code và chạy test.</small></button><button onClick={() => onNavigate('journal')}><span>03</span><strong>Ghi journal</strong><small>Lưu điều đã hiểu và câu hỏi còn vướng.</small></button></div></section>
}

function HiringReadinessCard({ dashboard, program }: { dashboard: Dashboard; program?: any }) {
  const projects = program?.portfolio_projects ?? []
  const completedLessons = dashboard.completed_lessons
  const totalLessons = Math.max(1, dashboard.total_lessons)
  const score = Math.round((completedLessons / totalLessons) * 100)
  return <section className="section-card hiring-card"><div className="section-heading"><div><span className="eyebrow accent">HIRING READINESS</span><h3>Bằng chứng để được nhận</h3></div><span className="tag">{score}% nền tảng</span></div><p className="muted">Nhà tuyển dụng cần thấy bạn biến kiến thức thành hệ thống có thể chạy, đo lường và giải thích.</p><div className="readiness-bar" role="progressbar" aria-label="Hiring readiness" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}><span style={{ width: String(score) + '%' }} /></div><div className="readiness-projects">{projects.map((project: any) => { const phase = dashboard.phases.find((item) => item.slug === project.phase_id); const ratio = phase && phase.lessons > 0 ? phase.completed / phase.lessons : 0; const status = ratio >= 1 ? 'Ready to publish' : ratio > 0 ? 'In progress' : 'Upcoming'; return <div className="readiness-project" key={project.slug}><div><strong>{project.title_vi}</strong><small>{project.github_path}</small></div><span className={ratio >= 1 ? 'ready' : ratio > 0 ? 'progress' : ''}>{status}</span></div>})}</div></section>
}

function RoadmapView({ roadmap, selectedLesson, language, track, onTrackChange, onOpenLesson, onProgress, onOpenExercises }: { roadmap: any; selectedLesson: Lesson | null; language: 'vi' | 'en'; track: 'standard' | 'accelerated'; onTrackChange: (track: 'standard' | 'accelerated') => void; onOpenLesson: (slug: string) => void; onProgress: (slug: string, status: string, minutes?: number) => Promise<void>; onOpenExercises: () => void }) {
  const vi = language === 'vi'
  const [query, setQuery] = useState('')
  const [phaseFilter, setPhaseFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  if (!roadmap) return <EmptyState title="Chưa có roadmap" description="Khởi động backend để nạp curriculum." />
  const visiblePhase = (phase: any) => {
    if (phaseFilter !== 'all' && phase.slug !== phaseFilter) return false
    const haystack = JSON.stringify(phase).toLowerCase()
    if (query.trim() && !haystack.includes(query.trim().toLowerCase())) return false
    if (statusFilter !== 'all' && !phase.modules.some((module: any) => module.lessons.some((item: any) => item.status === statusFilter))) return false
    return true
  }
  return <div className="roadmap-layout"><div className="roadmap-list"><div className="roadmap-intro"><span className="eyebrow accent">THE FULL ARC</span><h2>{vi ? <>{track === 'standard' ? '53 tuần để xây nền' : '26 tuần tăng tốc'}<br /><em>và ship thật.</em></> : <>{track === 'standard' ? '53 weeks to build' : '26 accelerated weeks'}<br /><em>and ship for real.</em></>}</h2><p>{vi ? roadmap.program.description_vi : roadmap.program.description_en}</p><div className="track-pills"><button className={track === 'standard' ? 'selected' : ''} onClick={() => onTrackChange('standard')}>12–15 tháng</button><button className={track === 'accelerated' ? 'selected' : ''} onClick={() => onTrackChange('accelerated')}>6 tháng cấp tốc</button><span>Việt · English</span></div><div className="filter-bar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm lesson, module..." /><select value={phaseFilter} onChange={(event) => setPhaseFilter(event.target.value)}><option value="all">Tất cả phase</option>{roadmap.phases.map((phase: any) => <option key={phase.slug} value={phase.slug}>{phase.order}. {phase.title_vi}</option>)}</select><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">Mọi trạng thái</option><option value="not_started">Chưa bắt đầu</option><option value="in_progress">Đang học</option><option value="completed">Hoàn thành</option><option value="needs_review">Cần ôn</option></select></div></div><PortfolioBoard program={roadmap.program} language={language} />{roadmap.phases.filter((phase: any) => visiblePhase(phase)).map((phase: any) => <div className="phase-block" key={phase.slug}><div className="phase-header"><div className="phase-index">{String(phase.order).padStart(2, '0')}</div><div><h3>{vi ? phase.title_vi : phase.title_en}</h3><p>{phase.duration_weeks} {vi ? 'tuần' : 'weeks'} · {phase.modules.reduce((sum: number, module: any) => sum + module.lessons.length, 0)} lessons</p></div></div>{phase.modules.map((module: any) => <div className="module-block" key={module.slug}><span className="module-title">{vi ? module.title_vi : module.title_en}</span>{module.lessons.map((item: any) => <button className={`lesson-row ${item.status === 'completed' ? 'done' : ''} ${selectedLesson?.slug === item.slug ? 'selected' : ''}`} key={item.slug} onClick={() => onOpenLesson(item.slug)}><span className="lesson-check">{item.status === 'completed' ? '✓' : item.status === 'in_progress' ? '◐' : '○'}</span><span>{vi ? item.title_vi : item.title_en}</span><small>{item.estimated_minutes}m</small></button>)}</div>)}</div>)}</div><div className="lesson-detail-pane">{selectedLesson ? <LessonDetail key={selectedLesson.slug} lesson={selectedLesson} language={language} onProgress={onProgress} onOpenLesson={onOpenLesson} onOpenExercises={onOpenExercises} /> : <div className="detail-empty"><div className="detail-mark">✦</div><h3>{vi ? 'Chọn một lesson' : 'Choose a lesson'}</h3><p>{vi ? 'Mỗi lesson có mục tiêu, tài liệu, bài tập và câu hỏi để bạn biết chính xác thế nào là “đã hiểu”.' : 'Each lesson has objectives, resources, exercises and review prompts so you can define “understood”.'}</p></div>}</div></div>
}

function PortfolioBoard({ program, language }: { program: any; language: 'vi' | 'en' }) {
  const vi = language === 'vi'
  const projects = program.portfolio_projects ?? []
  const checklist = program.career_checklist ?? []
  return <section className="portfolio-board"><div className="section-heading"><div><span className="eyebrow accent">PORTFOLIO ARC</span><h3>{vi ? 'Bốn project để đi làm' : 'Four projects to become hireable'}</h3></div><span className="tag">{projects.length} milestones</span></div><div className="portfolio-grid">{projects.map((project: any) => <article className="portfolio-card" key={project.slug}><div className="portfolio-card-top"><span className="tag">{project.estimated_weeks} tuần</span><code>{project.github_path}</code></div><h4>{vi ? project.title_vi : project.title_en}</h4><p>{vi ? project.problem_vi : project.problem_en}</p><div className="tag-list">{project.stack.map((item: string) => <span className="tag" key={item}>{item}</span>)}</div><strong>{vi ? 'Bằng chứng cần ship' : 'Evidence to ship'}</strong><ul>{project.deliverables.slice(0, 4).map((item: string) => <li key={item}>{item}</li>)}</ul></article>)}</div><details className="career-checklist"><summary>{vi ? 'Checklist sẵn sàng xin việc' : 'Job-readiness checklist'}</summary><ul>{checklist.map((item: string) => <li key={item}>{item}</li>)}</ul></details></section>
}

function readChecklist(slug: string, count: number): boolean[] {
  try {
    const raw = window.localStorage.getItem('journey-checklist:' + slug)
    const saved = raw ? JSON.parse(raw) : []
    return Array.from({ length: count }, (_, index) => saved[index] === true)
  } catch {
    return Array.from({ length: count }, () => false)
  }
}

function LessonDetail({ lesson, language, onProgress, onOpenLesson, onOpenExercises }: { lesson: Lesson; language: 'vi' | 'en'; onProgress: (slug: string, status: string, minutes?: number) => Promise<void>; onOpenLesson: (slug: string) => void; onOpenExercises: () => void }) {
  const [noteBody, setNoteBody] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [sessionMinutes, setSessionMinutes] = useState(String(Math.max(15, Math.min(lesson.estimated_minutes, 120))))
  const [checked, setChecked] = useState<boolean[]>(() => readChecklist(lesson.slug, lesson.checklist.length))
  const [checklistNudge, setChecklistNudge] = useState(false)
  const [progressError, setProgressError] = useState('')
  const vi = language === 'vi'
  const completedCount = checked.filter(Boolean).length
  const checklistComplete = completedCount === lesson.checklist.length
  useEffect(() => {
    try {
      window.localStorage.setItem('journey-checklist:' + lesson.slug, JSON.stringify(checked))
    } catch {
      // Local storage may be disabled; lesson progress still works.
    }
  }, [checked, lesson.slug])
  const saveNote = async () => {
    if (!noteBody.trim()) return
    await api.createNote({ lesson_slug: lesson.slug, title: 'Insight: ' + (vi ? lesson.title_vi : lesson.title_en), body: noteBody.trim() })
    setNoteBody('')
    setNoteSaved(true)
    window.setTimeout(() => setNoteSaved(false), 2500)
  }
  const toggleChecklist = (index: number) => {
    setChecked((current) => current.map((value, currentIndex) => currentIndex === index ? !value : value))
    setChecklistNudge(false)
  }
  const markProgress = async () => {
    const nextStatus = lesson.status === 'completed' ? 'needs_review' : 'completed'
    if (nextStatus === 'completed' && !checklistComplete) {
      setChecklistNudge(true)
      return
    }
    const minutes = Number(sessionMinutes)
    setProgressError('')
    try {
      await onProgress(lesson.slug, nextStatus, Number.isInteger(minutes) && minutes > 0 ? minutes : 0)
    } catch {
      setProgressError(vi ? 'Chưa lưu được tiến độ. Hãy kiểm tra backend rồi thử lại.' : 'Progress was not saved. Check the backend and try again.')
    }
  }
  return <div className="lesson-detail">
    <span className="eyebrow accent">{vi ? lesson.phase_title_vi : lesson.phase_title_en} · {vi ? lesson.module_title_vi : lesson.module_title_en}</span>
    <h2>{vi ? lesson.title_vi : lesson.title_en}</h2>
    <p className="lead">{vi ? lesson.summary_vi : lesson.summary_en}</p>
    <div className="tag-list">{lesson.keywords.slice(0, 6).map((keyword) => <span className="tag" key={keyword}>{keyword}</span>)}<span className="tag">{lesson.estimated_minutes} phút</span></div>
    <div className="lesson-evidence"><div className="section-heading"><strong>{vi ? 'Bằng chứng đã làm' : 'Evidence completed'}</strong><span>{completedCount}/{lesson.checklist.length}</span></div><div className="session-progress" role="progressbar" aria-label={vi ? 'Tiến độ checklist lesson' : 'Lesson checklist progress'} aria-valuemin={0} aria-valuemax={lesson.checklist.length} aria-valuenow={completedCount}><span style={{ width: String(lesson.checklist.length ? Math.round((completedCount / lesson.checklist.length) * 100) : 0) + '%' }} /></div><small>{vi ? 'Hoàn thiện checklist trước khi đánh dấu lesson để tránh học lướt.' : 'Finish the checklist before marking the lesson complete.'}</small></div>
    <div className="detail-section"><h4>{vi ? 'Mục tiêu đầu ra' : 'Learning outcomes'}</h4><ul>{lesson.objectives[language].map((item) => <li key={item}>{item}</li>)}</ul></div>
    <div className="detail-section"><h4>{vi ? 'Giải thích cốt lõi' : 'Concept notes'}</h4><p className="concept-notes">{vi ? lesson.concept_notes_vi : lesson.concept_notes_en}</p>{lesson.formulas.length > 0 && <div className="formula-list">{lesson.formulas.map((formula) => <code key={formula}>{formula}</code>)}</div>}</div>
    <div className="detail-section"><h4>Code example</h4>{lesson.code_examples.map((example) => <div className="code-example" key={example.title}><strong>{example.title}</strong><pre><code>{example.code}</code></pre><p className="muted">{vi ? example.explanation_vi : example.explanation_en}</p></div>)}</div>
    <div className="detail-section"><h4>{vi ? 'Prerequisites và tiêu chí hoàn thành' : 'Prerequisites and completion criteria'}</h4>{lesson.prerequisites.length > 0 && <ul>{lesson.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul>}<ul>{lesson.completion_criteria.map((item) => <li key={item}>{item}</li>)}</ul></div>
    <div className="detail-section"><h4>{vi ? 'Lỗi thường gặp' : 'Common mistakes'}</h4><ul>{lesson.common_mistakes.map((item) => <li key={item}>{item}</li>)}</ul></div>
    <div className="detail-section"><h4>{vi ? 'Bài tập liên quan' : 'Practice exercise'}</h4>{lesson.exercises.length > 0 ? <><p className="muted">{vi ? 'Viết code trong workspace để tạo bằng chứng có thể đưa vào GitHub.' : 'Use the workspace to create evidence you can show on GitHub.'}</p>{lesson.exercises.map((exercise) => <div className="linked-exercise" key={exercise.slug}><div><strong>{vi ? exercise.title_vi : exercise.title_en}</strong><small>{exercise.difficulty} · {exercise.estimated_minutes} phút</small></div><button className="secondary-button" onClick={onOpenExercises}>{vi ? 'Mở Practice Lab' : 'Open Practice Lab'}</button></div>)}</> : <p className="muted">{vi ? 'Chưa có exercise riêng cho lesson này.' : 'No dedicated exercise is linked yet.'}</p>}</div>
    <div className="detail-section"><h4>{vi ? 'Bài tiếp theo' : 'Next lessons'}</h4><div className="next-lesson-list">{lesson.next_lessons.map((slug) => <button className="text-button" key={slug} onClick={() => onOpenLesson(slug)}>{slug} →</button>)}</div></div>
    <div className="detail-section"><h4>{vi ? 'Checklist thực hành' : 'Practice checklist'}</h4><div className="checklist">{lesson.checklist.map((item, index) => <label key={item}><input type="checkbox" checked={checked[index] ?? false} onChange={() => toggleChecklist(index)} /> <span className={checked[index] ? 'checked-item' : ''}>{item}</span></label>)}</div>{checklistNudge && <p className="warning-note" role="status">{vi ? 'Hãy hoàn thiện các mục checklist trước khi đánh dấu hoàn thành.' : 'Finish every checklist item before marking this lesson complete.'}</p>}</div>
    <div className="detail-section"><h4>{vi ? 'Tài liệu song song' : 'Resources'}</h4><div className="resource-list">{lesson.resources.map((resource) => <a href={resource.url} target="_blank" rel="noreferrer" key={resource.url}><span>{resource.language === 'en' ? 'EN' : 'VI'}</span>{resource.title}<b>↗</b></a>)}</div></div>
    <div className="detail-section"><h4>{vi ? 'Tự kiểm tra' : 'Self-check'}</h4>{lesson.reviews.map((review) => <div className="review-prompt" key={review.id}><p>{vi ? review.question_vi : review.question_en}</p><details><summary>{vi ? 'Hiện gợi ý đáp án' : 'Show answer hint'}</summary><p>{vi ? review.answer_vi : review.answer_en}</p></details></div>)}</div>
    <div className="detail-section note-editor"><h4>{vi ? 'Ghi chú của bạn' : 'Your note'}</h4><textarea value={noteBody} onChange={(event) => setNoteBody(event.target.value)} placeholder={vi ? 'Viết insight, lỗi gặp phải hoặc điều cần ôn lại...' : 'Write an insight, failure or topic to revisit...'} /><button className="secondary-button" onClick={() => void saveNote()}>{vi ? 'Lưu ghi chú' : 'Save note'}</button>{noteSaved && <p className="success-note" role="status">{vi ? 'Đã lưu vào Journal.' : 'Saved to Journal.'}</p>}</div>
    <div className="detail-actions"><label className="session-minutes">Phút học<input type="number" min="1" max="1440" value={sessionMinutes} onChange={(event) => setSessionMinutes(event.target.value)} /></label><button className="primary-button" onClick={() => void markProgress()}>{lesson.status === 'completed' ? (vi ? 'Đánh dấu cần ôn' : 'Mark for review') : (vi ? 'Đánh dấu hoàn thành' : 'Mark complete')} <span>✓</span></button></div>{progressError && <p className="warning-note" role="alert">{progressError}</p>}
    <div className="ask-box"><span className="eyebrow">ASK YOUR ASSISTANT</span><h4>{vi ? 'Đang vướng ở đâu?' : 'Where are you stuck?'}</h4><p>Context export ở Journal sẽ đưa lesson, mục tiêu và câu hỏi sang ChatGPT/Codex.</p></div>
  </div>
}

function ReviewView({ reviews, onAnswer }: { reviews: any[]; onAnswer: (id: number, rating: string, thoughtSeconds?: number, answerText?: string) => Promise<void> }) {
  const [active, setActive] = useState(0)
  const [answer, setAnswer] = useState('')
  const startedAt = useRef<number | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [weak, setWeak] = useState<any[]>([])
  const item = reviews[active]
  useEffect(() => { void Promise.all([api.reviewHistory(), api.weakTopics()]).then(([historyResult, weakResult]) => { setHistory(historyResult.items); setWeak(weakResult.items) }) }, [reviews.length])
  if (!item) return <><EmptyState title="Hộp nhớ đang trống" description="Không có review đến hạn. Tiếp tục học lesson mới, các card sẽ quay lại đúng lúc." />{weak.length > 0 && <WeakTopics topics={weak} />}</>
  const submit = async (rating: string, submittedAt: number) => { const thoughtSeconds = startedAt.current ? Math.max(0, Math.round((submittedAt - startedAt.current) / 1000)) : 0; await onAnswer(item.id, rating, thoughtSeconds, answer); startedAt.current = null; setAnswer(''); setActive((value) => Math.min(value + 1, reviews.length)) }
  return <div className="review-layout"><div className="review-header"><span className="eyebrow accent">SPACED REVIEW</span><h2>Nhớ bằng cách<br /><em>tự gọi lại.</em></h2><p>{reviews.length} card đang đến hạn · trả lời bằng lời của bạn trước khi mở gợi ý.</p></div><div className="review-card"><div className="review-card-meta"><span>{active + 1} / {reviews.length}</span><span>{item.phase_title_vi}</span></div><h3>{item.question_vi}</h3><textarea aria-label="Câu trả lời review" value={answer} onFocus={(event) => { startedAt.current = event.timeStamp }} onChange={(event) => setAnswer(event.target.value)} placeholder="Viết câu trả lời trước khi xem gợi ý..." /><details><summary>Hiện gợi ý</summary><p>{item.answer_vi}</p></details><div className="rating-row"><span>Độ nhớ hiện tại?</span>{['again', 'hard', 'good', 'easy'].map((rating) => <button className={rating === 'good' ? 'good' : rating === 'easy' ? 'easy' : ''} key={rating} onClick={(event) => void submit(rating, event.timeStamp)}>{rating[0].toUpperCase() + rating.slice(1)}</button>)}</div></div>{history.length > 0 && <section className="section-card review-history"><div className="section-heading"><h3>Lịch sử review</h3><span className="tag">{history.length} lần gần nhất</span></div>{history.slice(0, 5).map((row) => <p key={row.id}><strong>{row.rating}</strong> · {row.lesson_title_vi} · {row.thought_seconds}s</p>)}</section>}{weak.length > 0 && <WeakTopics topics={weak} />}</div>
}

function WeakTopics({ topics }: { topics: any[] }) { return <section className="section-card weak-topics"><div className="section-heading"><h3>Chủ đề cần quay lại</h3><span className="tag">Weak topics</span></div>{topics.slice(0, 6).map((topic) => <p key={topic.lesson_slug}><strong>{topic.title_vi}</strong> · {topic.hard_attempts}/{topic.attempts} lần hard/again</p>)}</section> }
function ExercisesView({ exercises, onRefresh }: { exercises: Exercise[]; onRefresh: () => Promise<void> }) {
  const [running, setRunning] = useState<number | null>(null)
  const [output, setOutput] = useState('')
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState('all')
  const [history, setHistory] = useState<Record<number, any[]>>({})
  const [historyFor, setHistoryFor] = useState<number | null>(null)
  const visibleExercises = exercises.filter((exercise) => {
    const matchesQuery = `${exercise.title_vi} ${exercise.title_en} ${exercise.description_vi}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (difficulty === 'all' || exercise.difficulty.toLowerCase() === difficulty)
  })
  const prepare = async (exercise: Exercise) => { const result = await api.createWorkspace(exercise.slug); const open = await api.openWorkspace(result.workspace.id); if (!open.opened) window.alert(`${open.message ?? 'Mở VS Code thủ công'}\n${open.path}`); await onRefresh() }
  const loadHistory = async (exercise: Exercise) => { if (!exercise.workspace_id) return; const result = await api.workspaceRuns(exercise.workspace_id); setHistory((current) => ({ ...current, [exercise.id]: result.runs })); setHistoryFor(exercise.id) }
  const run = async (exercise: Exercise) => { if (!exercise.workspace_id) { await prepare(exercise); return }; setRunning(exercise.id); try { const result = await api.runWorkspace(exercise.workspace_id); setOutput(`${result.status.toUpperCase()} · ${result.duration_ms}ms\n\n${result.output}`); await loadHistory(exercise) } finally { setRunning(null) } }
  return <div><div className="page-intro"><div><span className="eyebrow accent">PRACTICE LAB</span><h2>Bài tập để biến<br /><em>kiến thức thành cơ.</em></h2></div><p>Mỗi module có một workspace riêng. Viết code, chạy test và để Git ghi lại quá trình trưởng thành của bạn.</p></div><div className="filter-bar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm bài tập..." /><select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option value="all">Mọi độ khó</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select><span className="muted">{visibleExercises.length}/{exercises.length} bài</span></div><div className="exercise-grid">{visibleExercises.map((exercise) => <article className="exercise-card" key={exercise.slug}><div className="exercise-top"><span className="tag">{exercise.difficulty}</span><span>{exercise.estimated_minutes} phút</span></div><h3>{exercise.title_vi}</h3><p>{exercise.description_vi}</p><div className="exercise-actions"><button className="secondary-button" onClick={() => void prepare(exercise)}>{exercise.workspace_id ? 'Mở workspace' : 'Tạo workspace'}</button><button className="icon-button" aria-label="Chạy bài tập" onClick={() => void run(exercise)}>{running === exercise.id ? '…' : '▶'}</button><button className="text-button" onClick={() => void loadHistory(exercise)}>Lịch sử</button></div>{exercise.workspace_path && <small className="path-label">{exercise.workspace_path}</small>}{historyFor === exercise.id && <div className="run-history">{history[exercise.id]?.length ? history[exercise.id].slice(0, 5).map((runItem) => <p key={runItem.id}><strong>{runItem.status}</strong> · {runItem.duration_ms}ms · {new Date(runItem.created_at).toLocaleString()}</p>) : <p className="muted">Chưa có lần chạy.</p>}</div>}</article>)}</div>{output && <pre className="run-output">{output}</pre>}</div>
}

function ToolsView({ tools }: { tools: any[] }) {
  return <div><div className="page-intro"><div><span className="eyebrow accent">TOOLKIT</span><h2>Dùng công cụ<br /><em>đúng lúc.</em></h2></div><p>Công cụ không thay thế tư duy. Mỗi tool ở đây gắn với một tình huống cụ thể trong hành trình học.</p></div><div className="tools-grid">{tools.map((tool) => <article className="tool-card" key={tool.slug}><div className="tool-symbol">{tool.name.slice(0, 1)}</div><div><span className="eyebrow">{tool.category}</span><h3>{tool.name}</h3><p>{tool.when_vi}</p><strong>Cài đặt</strong><p>{tool.install_vi}</p><strong>Cách dùng</strong><p>{tool.how_vi}</p><strong>Không nên dùng khi</strong><p>{tool.when_not_vi}</p><strong>Khi gặp lỗi</strong><p>{tool.error_vi}</p><strong>Kết hợp với</strong><p>{tool.combine_vi}</p><strong>Rủi ro</strong><p>{tool.risks_vi}</p><div className="command-list">{tool.commands.map((command: string) => <code key={command}>{command}</code>)}</div></div></article>)}</div></div>
}
function JournalView({ onExportContext }: { onExportContext: (question: string) => Promise<void> }) {
  const [question, setQuestion] = useState('')
  const [git, setGit] = useState<any>(null)
  const [diff, setDiff] = useState('')
  const [suggested, setSuggested] = useState('')
  const [notes, setNotes] = useState<any[]>([])
  const [journalPath, setJournalPath] = useState('')
  const load = async () => {
    const [nextGit, nextNotes, nextDiff, nextSuggested] = await Promise.all([api.gitStatus(), api.notes(), api.gitDiff(), api.suggestedCommit()])
    setGit(nextGit); setNotes(nextNotes.notes); setDiff(nextDiff.diff); setSuggested(nextSuggested.message)
  }
  // oxlint-disable-next-line react(set-state-in-effect)
  useEffect(() => { const timer = window.setTimeout(() => { void load() }, 0); return () => window.clearTimeout(timer) }, [])
  return <div>
    <div className="page-intro"><div><span className="eyebrow accent">EVIDENCE LOG</span><h2>Hành trình của bạn<br /><em>nằm trong Git.</em></h2></div><p>Export journal mỗi tuần, review diff trước khi commit, và để README kể được câu chuyện kỹ thuật của bạn.</p></div>
    <div className="journal-grid"><section className="section-card journal-card"><div className="section-heading"><div><span className="eyebrow">WEEKLY REFLECTION</span><h3>Journal tuần</h3></div><span className="tag">Markdown</span></div><p>File journal được ghi vào thư mục journal/weekly, sẵn sàng để bạn review và push lên GitHub.</p><button className="primary-button" onClick={async () => { const result = await api.exportJournal(); setJournalPath(result.path) }}>Export tuần này →</button>{journalPath && <p className="success-note">Đã tạo {journalPath}</p>}</section>
    <section className="section-card ask-card"><div className="section-heading"><div><span className="eyebrow">CONTEXT BRIDGE</span><h3>Hỏi ChatGPT / Codex</h3></div><span className="tag">No API key</span></div><p>App tạo context có lesson, progress, note và nguyên tắc học để bạn dán sang trợ lý.</p><textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ví dụ: Vì sao validation loss của tôi tăng?" /><button className="secondary-button" onClick={() => void onExportContext(question || 'Hãy giúp tôi hiểu phần này bằng gợi ý từng bước.')}>Tạo context & copy</button></section></div>
    <section className="section-card notes-card"><div className="section-heading"><div><span className="eyebrow">YOUR NOTES</span><h3>Insight đã lưu</h3></div><button className="text-button" onClick={() => void load()}>Refresh</button></div>{notes.length ? <div className="saved-notes">{notes.slice(0, 12).map((note) => <article className="saved-note" key={note.id}><strong>{note.title}</strong><p>{note.body}</p><small>{note.lesson_title_vi ?? 'General note'} · {new Date(note.updated_at).toLocaleDateString()}</small></article>)}</div> : <p className="muted">Chưa có note. Mở một lesson và ghi lại điều bạn tự phát hiện.</p>}</section>
    <section className="section-card git-card"><div className="section-heading"><div><span className="eyebrow">LOCAL REPOSITORY</span><h3>Git snapshot</h3></div><button className="text-button" onClick={() => void load()}>Refresh</button></div>{git ? <div className="git-details"><div><span>Branch</span><strong>{git.branch || 'chưa init'}</strong></div><div><span>Last commit</span><strong>{git.last_commit || 'chưa có commit'}</strong></div><div><span>Remote</span><strong>{git.remote || 'chưa cấu hình'}</strong></div></div> : <p className="muted">Đang đọc trạng thái Git...</p>}<p className="muted">Suggested commit: <code>{suggested}</code></p><pre className="git-output">{git?.status || 'Working tree sạch hoặc chưa được khởi tạo.'}</pre><details><summary>Xem diff đã redact secret</summary><pre className="git-output">{diff || 'Chưa có diff.'}</pre></details></section>
  </div>
}
function SettingsView({ settings, onSave }: { settings: AppSettings; onSave: (next: Partial<AppSettings>) => Promise<void> }) {
  const [goal, setGoal] = useState(String(settings.weekly_goal_minutes))
  const [saved, setSaved] = useState(false)
  return <div>
    <div className="page-intro"><div><span className="eyebrow accent">PERSONAL SETTINGS</span><h2>Thiết kế nhịp<br /><em>học bền vững.</em></h2></div><p>Cài đặt được lưu trong SQLite local. App không lưu API key, token hoặc credential.</p></div>
    <section className="section-card settings-card">
      <label>Ngôn ngữ giao diện<select value={settings.language} onChange={(event) => void onSave({ language: event.target.value as AppSettings['language'] })}><option value="vi">Tiếng Việt + English terms</option><option value="en">English</option></select></label>
      <label>Mục tiêu nghề nghiệp<select value={settings.target_role} onChange={(event) => void onSave({ target_role: event.target.value as AppSettings['target_role'] })}><option value="internship">Thực tập AI/ML Engineer</option><option value="junior">Junior AI Engineer</option><option value="career_switch">Chuyển hướng sang AI Engineer</option></select></label>
      <label>Nền tảng hiện tại<select value={settings.experience_level} onChange={(event) => void onSave({ experience_level: event.target.value as AppSettings['experience_level'] })}><option value="beginner">Mới bắt đầu</option><option value="intermediate">Đã có nền tảng</option><option value="advanced">Đang cần portfolio sâu</option></select></label>
      <label>Learning track<select value={settings.track} onChange={(event) => void onSave({ track: event.target.value as AppSettings['track'] })}><option value="standard">12–15 tháng · 53 tuần</option><option value="accelerated">6 tháng · 26 tuần</option></select></label>
      <label>Mục tiêu mỗi tuần (phút)<input type="number" min="60" max="10080" value={goal} onChange={(event) => setGoal(event.target.value)} /></label>
      <label className="setting-check"><input type="checkbox" checked={settings.show_completed_lessons} onChange={(event) => void onSave({ show_completed_lessons: event.target.checked })} /> Hiển thị lesson đã hoàn thành trên roadmap</label>
      <label className="setting-check"><input type="checkbox" checked={settings.onboarding_complete} onChange={(event) => void onSave({ onboarding_complete: event.target.checked })} /> Đã hoàn thành onboarding và baseline assessment</label>
      <button className="primary-button" onClick={async () => { const value = Number(goal); if (!Number.isFinite(value) || value < 60) return; await onSave({ weekly_goal_minutes: value }); setSaved(true); window.setTimeout(() => setSaved(false), 2500) }}>Lưu mục tiêu tuần</button>
      {saved && <p className="success-note">Đã lưu cài đặt.</p>}
    </section>
  </div>
}

function EmptyState({ title, description }: { title: string; description: string }) { return <div className="empty-state"><div className="detail-mark">✦</div><h3>{title}</h3><p>{description}</p></div> }
export default App
