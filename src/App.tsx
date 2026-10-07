import { ExercisesView } from './components/ExercisesView'
import { JournalView } from './components/JournalView'
/* oxlint-disable react(set-state-in-effect) */
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { type AppSettings, type BackupPayload, type Dashboard, type Exercise, type FeedbackItem, type FeedbackKind, type Lesson, type ReferenceResource, type SearchResult, type SecurityAuditReport, type SecurityFinding } from './api'
import { learningClient as api } from './platform/learning-client'
import { runtimeConfig } from './platform/runtime-config'
import { checklistKey, readChecklist } from './platform/checklist-storage'
import { AuthScreen } from './auth/AuthScreen'
import { useAuth } from './auth/AuthProvider'
import { TodayView } from './components/TodayView'
import { ReviewView } from './components/ReviewView'
import { RoadmapView } from './components/RoadmapView'
import { CloudDataSettings } from './components/CloudDataSettings'
import { ThemeToggle } from './theme/ThemeToggle'
import './App.css'
import './typography.css'
import './learning-workflow.css'
import './readability.css'

const PublicExperience = lazy(() => import('./public/PublicExperience').then((module) => ({
  default: module.PublicExperience,
})))

type View = 'dashboard' | 'roadmap' | 'lesson' | 'review' | 'exercises' | 'tools' | 'security' | 'resources' | 'community' | 'journal' | 'settings'
const viewIds = new Set<View>(['dashboard', 'roadmap', 'review', 'exercises', 'tools', 'security', 'resources', 'community', 'journal', 'settings'])
function locationState(): { view: View; lesson: string | null } {
  if (typeof window === 'undefined') return { view: 'dashboard', lesson: null }
  const parts = window.location.pathname.split('/').filter(Boolean)
  if (parts[0] === 'lesson' && parts[1]) return { view: 'lesson', lesson: decodeURIComponent(parts.slice(1).join('/')) }
  const candidate = parts[0] as View | undefined
  return { view: candidate && viewIds.has(candidate) && !(runtimeConfig.mode === 'hosted' && candidate === 'security') ? candidate : 'dashboard', lesson: null }
}
const baseNavItems: Array<{ id: View; label: string; icon: string; hint: string }> = [
  { id: 'dashboard', label: 'Tổng quan', icon: '◐', hint: 'Nhịp học hôm nay' },
  { id: 'roadmap', label: 'Lộ trình', icon: '◎', hint: '3 hướng học · tự chọn nhịp' },
  { id: 'review', label: 'Ôn tập', icon: '↻', hint: 'Nhớ lâu hơn' },
  { id: 'exercises', label: 'Bài tập', icon: '⌘', hint: 'Mở bằng VS Code' },
  { id: 'tools', label: 'Công cụ', icon: '◇', hint: 'Dùng đúng lúc' },
  { id: 'security', label: 'Security Lab', icon: '⌁', hint: 'Passive endpoint review' },
  { id: 'resources', label: 'Tài liệu', icon: '▤', hint: 'Sách · course · docs' },
  { id: 'community', label: 'Cộng đồng', icon: '✦', hint: 'Góp ý · cải thiện bài học' },
  { id: 'journal', label: 'Journal & Git', icon: '✎', hint: 'Ghi lại hành trình' },
  { id: 'settings', label: 'Cài đặt', icon: '⚙', hint: 'Nhịp học cá nhân' },
]

function App() {
  const auth = useAuth()
  const hosted = runtimeConfig.mode === 'hosted'
  const initialLocation = locationState()
  const [view, setView] = useState<View>(initialLocation.view)
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [roadmap, setRoadmap] = useState<any | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [tools, setTools] = useState<any[]>([])
  const [resources, setResources] = useState<ReferenceResource[]>([])
  const [settings, setSettings] = useState<AppSettings>({ language: 'vi', track: 'standard', weekly_goal_minutes: 720, show_completed_lessons: true, target_role: 'internship', experience_level: 'beginner', onboarding_complete: false })
  const vi = settings.language === 'vi'
  const englishNav: Record<string, [string, string]> = {
    dashboard: ['Today', 'Your next learning step'], roadmap: ['Roadmap', 'Three paths at your pace'],
    review: ['Review', 'Remember through recall'], exercises: ['Exercises', hosted ? 'Practice guides' : 'Practice in VS Code'],
    tools: ['Tools', 'Choose for the task'], security: ['Security Lab', 'Passive endpoint review'],
    resources: ['Resources', 'Books, courses and docs'], community: ['Community', 'Improve the lessons'],
    journal: [hosted ? 'Journal' : 'Journal & Git', 'Record your learning'], settings: ['Settings', 'Your learning rhythm'],
  }
  const navItems = baseNavItems.map((item) => ({ ...item,
    label: vi ? (hosted && item.id === 'journal' ? 'Journal' : item.label) : englishNav[item.id][0],
    hint: vi ? (hosted && item.id === 'exercises' ? 'Hướng dẫn thực hành' : item.hint) : englishNav[item.id][1],
  }))
  const [selectedLesson, setSelectedLesson] = useState<string | null>(initialLocation.lesson)
  const [lessonReturnView, setLessonReturnView] = useState<View>('roadmap')
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [lessonLoading, setLessonLoading] = useState(false)
  const [lessonRetry, setLessonRetry] = useState(0)
  const [error, setError] = useState('')
  const [gitPublishAvailable, setGitPublishAvailable] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [globalQuery, setGlobalQuery] = useState('')
  const [globalResults, setGlobalResults] = useState<SearchResult[]>([])
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false)
  const [globalSearchBusy, setGlobalSearchBusy] = useState(false)
  const globalSearchRef = useRef<HTMLInputElement>(null)

  const navigate = (nextView: View) => {
    setView(nextView)
    if (nextView !== 'lesson') setSelectedLesson(null)
    setMobileNavOpen(false)
  }

  useEffect(() => {
    const onPopState = () => {
      const next = locationState()
      setView(next.view)
      setSelectedLesson(next.lesson)
      setLesson(null)
      setLessonLoading(Boolean(next.lesson))
      setMobileNavOpen(false)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const nextPath = view === 'lesson' && selectedLesson ? `/lesson/${encodeURIComponent(selectedLesson)}` : view === 'dashboard' ? '/' : `/${view}`
    if (window.location.pathname !== nextPath) window.history.pushState({ view, lesson: selectedLesson }, '', nextPath)
  }, [view, selectedLesson])

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setGlobalSearchOpen(true)
        window.setTimeout(() => globalSearchRef.current?.focus(), 0)
      }
      if (event.key === 'Escape') setGlobalSearchOpen(false)
    }
    window.addEventListener('keydown', onShortcut)
    return () => window.removeEventListener('keydown', onShortcut)
  }, [])

  useEffect(() => {
    const query = globalQuery.trim()
    if (query.length < 2) {
      return
    }
    const timer = window.setTimeout(() => {
      setGlobalSearchBusy(true)
      void api.search(query, { limit: 12 }).then((result) => setGlobalResults(result.results ?? [])).catch(() => setGlobalResults([])).finally(() => setGlobalSearchBusy(false))
    }, 220)
    return () => window.clearTimeout(timer)
  }, [globalQuery])

  const refresh = async () => {
    if (hosted && auth.state !== 'signed_in') {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const [nextDashboard, nextRoadmap, nextReviews, nextExercises, nextTools, nextResources, nextSettings, health] = await Promise.all([api.dashboard(), api.roadmap(), api.reviews(), api.exercises(), api.tools(), api.resources(), api.settings(), api.health()])
      setDashboard(nextDashboard); setRoadmap(nextRoadmap); setReviews(nextReviews.items); setExercises(nextExercises.exercises); setTools(nextTools.tools); setResources(nextResources.resources); setSettings(nextSettings); setError('')
      setGitPublishAvailable(health.git_publish_available)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không kết nối được backend') } finally { setLoading(false) }
  }
  // The effect is the boundary that synchronizes server state into the local UI.
  // oxlint-disable-next-line
  useEffect(() => { void refresh() }, [auth.state, hosted])
  useEffect(() => {
    if (hosted) return
    let clientId = ''
    try { clientId = window.sessionStorage.getItem('journey-runtime-client-id') ?? '' } catch { /* Private browsing can reject sessionStorage. */ }
    if (!clientId) {
      const randomId = typeof window.crypto?.randomUUID === 'function' ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
      clientId = `journey-${randomId}`
      try { window.sessionStorage.setItem('journey-runtime-client-id', clientId) } catch { /* Heartbeat still works for this tab. */ }
    }
    const heartbeat = () => { void api.runtimeHeartbeat(clientId).catch(() => undefined) }
    heartbeat()
    const interval = window.setInterval(heartbeat, 4000)
    const disconnect = () => { void api.runtimeDisconnect(clientId).catch(() => undefined) }
    window.addEventListener('pagehide', disconnect)
    return () => { window.clearInterval(interval); window.removeEventListener('pagehide', disconnect) }
  }, [hosted])
  const lessonRequest = useRef(0)
  useEffect(() => {
    if (!selectedLesson || (hosted && auth.state !== 'signed_in')) return
    const requestId = ++lessonRequest.current
    void api.lesson(selectedLesson).then((nextLesson) => {
      if (requestId === lessonRequest.current) setLesson(nextLesson)
    }).catch((cause) => {
      if (requestId === lessonRequest.current) setError(cause instanceof Error ? cause.message : 'Không tải được lesson')
    }).finally(() => {
      if (requestId === lessonRequest.current) setLessonLoading(false)
    })
  }, [selectedLesson, lessonRetry, hosted, auth.state])
  const openLesson = (slug: string) => {
    if (view !== 'lesson') setLessonReturnView(view)
    setError('')
    setLesson(null)
    setLessonLoading(true)
    setLessonRetry((current) => current + 1)
    setSelectedLesson(slug)
    setView('lesson')
    setMobileNavOpen(false)
  }
  const closeLesson = () => navigate(lessonReturnView)
  const retry = () => { if (selectedLesson && !lesson) { setError(''); setLessonLoading(true); setLessonRetry((current) => current + 1) } else void refresh() }
  const changeLanguage = async () => {
    try {
      setSettings(await api.updateSettings({ language: settings.language === 'vi' ? 'en' : 'vi' }))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không đổi được ngôn ngữ giao diện')
    }
  }
  const updateProgress = async (slug: string, status: string, minutes = 0) => {
    await api.updateProgress(slug, status, minutes)
    await refresh()
    if (selectedLesson) {
      try { setLesson(await api.lesson(selectedLesson)) }
      catch { setError(settings.language === 'vi' ? 'Đã lưu. Chưa tải lại được bài học.' : 'Saved. Could not reload the lesson.') }
    }
  }

  const lessonTitleMap: Record<string, string> = {}
  roadmap?.phases?.forEach((phase: any) => phase.modules?.forEach((module: any) => module.lessons?.forEach((item: any) => { lessonTitleMap[item.slug] = settings.language === 'vi' ? item.title_vi : item.title_en })))
  const selectSearchResult = (result: SearchResult) => {
    setGlobalQuery('')
    setGlobalSearchOpen(false)
    if (result.type === 'lesson' && result.slug) openLesson(result.slug)
    else if (result.type === 'resource') navigate('resources')
    else if (result.type === 'exercise') navigate('exercises')
    else navigate('roadmap')
  }
  if (hosted && auth.state === 'loading') return <AuthScreen loading />
  if (hosted && auth.state === 'signed_out') return <Suspense fallback={<LoadingState />}><PublicExperience /></Suspense>
  return <div className="app-shell"><a className="skip-link" href="#main-content">{vi ? 'Bỏ qua đến nội dung chính' : 'Skip to main content'}</a>
    <div className={`mobile-nav-scrim ${mobileNavOpen ? 'open' : ''}`} aria-hidden="true" onClick={() => setMobileNavOpen(false)} />
    <aside className={`sidebar ${mobileNavOpen ? 'open' : ''}`}><div className="brand-lockup"><div className="brand-mark">J</div><div><strong>Journey</strong><span>AI Engineer</span></div><button className="mobile-nav-close" type="button" aria-label={vi ? 'Đóng menu điều hướng' : 'Close navigation'} onClick={() => setMobileNavOpen(false)}>×</button></div><div className="sidebar-intro">{vi ? 'Học đều, thực hành và ghi lại bằng chứng.' : 'Learn steadily, practise and keep evidence.'}</div><nav aria-label={vi ? 'Điều hướng chính' : 'Primary navigation'} className="nav-list">{navItems.filter((item) => !hosted || item.id !== 'security').map((item) => <button className={`nav-item ${(view === item.id || (view === 'lesson' && item.id === 'roadmap')) ? 'active' : ''}`} key={item.id} onClick={() => navigate(item.id)} aria-current={(view === item.id || (view === 'lesson' && item.id === 'roadmap')) ? 'page' : undefined}><span className="nav-icon" aria-hidden="true">{item.icon}</span><span><strong>{item.label}</strong><small>{item.hint}</small></span></button>)}</nav><div className="sidebar-footer"><div className="status-dot"><span /> {hosted ? 'Cloud sync' : 'Local workspace'}</div><small>{hosted ? (vi ? 'Dữ liệu được lưu riêng theo tài khoản' : 'Learning data is private to your account') : (vi ? 'Tiến trình được lưu trên máy của bạn' : 'Progress is saved on this device')}</small><small>{hosted ? (vi ? 'VS Code, Git và test chỉ chạy trên bản local.' : 'VS Code, Git and tests are available in local mode.') : (vi ? 'Bản portable tự dừng khi đóng tab cuối.' : 'The portable app stops after its last tab closes.')}</small></div></aside>
    <main className="main-area" id="main-content" aria-busy={loading || lessonLoading}><header className="topbar"><button className="mobile-nav-toggle" type="button" aria-label={vi ? 'Mở menu điều hướng' : 'Open navigation'} aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen(true)}><span aria-hidden="true">☰</span><span className="sr-only">{vi ? 'Mở menu' : 'Open menu'}</span></button><div><span className="eyebrow">PERSONAL LEARNING OS</span>{view === 'lesson' ? <div className="topbar-title">Lesson workspace</div> : <h1>{view === 'dashboard' ? (vi ? 'Hôm nay học gì?' : 'What will you learn today?') : navItems.find((item) => item.id === view)?.label}</h1>}</div><div className="topbar-actions"><ThemeToggle language={settings.language} /><div className={`global-search ${globalSearchOpen ? 'open' : ''}`}><label className="sr-only" htmlFor="global-search-input">{vi ? 'Tìm lesson, phase, tài liệu hoặc bài tập' : 'Search lessons, phases, resources or exercises'}</label><input id="global-search-input" ref={globalSearchRef} type="search" value={globalQuery} onFocus={() => setGlobalSearchOpen(true)} onChange={(event) => { const value = event.target.value; setGlobalQuery(value); setGlobalSearchOpen(true); setGlobalSearchBusy(value.trim().length >= 2) }} placeholder={vi ? 'Tìm kiếm…' : 'Search…'} /><kbd>Ctrl K</kbd>{globalQuery && <button type="button" className="global-search-clear" aria-label={vi ? 'Xóa tìm kiếm' : 'Clear search'} onClick={() => { setGlobalQuery(''); setGlobalSearchBusy(false); globalSearchRef.current?.focus() }}>×</button>}{globalSearchOpen && (globalQuery.trim().length >= 2 || globalSearchBusy) && <div className="global-search-results" role="listbox" aria-label={vi ? 'Kết quả tìm kiếm' : 'Search results'}>{globalSearchBusy ? <p className="global-search-status">{vi ? 'Đang tìm…' : 'Searching…'}</p> : globalResults.length ? globalResults.map((result) => <button type="button" role="option" className="global-search-result" key={`${result.type}-${result.id}`} onClick={() => selectSearchResult(result)}><strong>{result.title}</strong><small>{result.subtitle ?? result.type}</small></button>) : <p className="global-search-status">{vi ? 'Không tìm thấy kết quả. Thử từ khóa khác.' : 'No results. Try another search.'}</p>}</div>}</div><button className="language-chip" onClick={() => void changeLanguage()} aria-label={vi ? 'Đổi ngôn ngữ' : 'Change language'}>{settings.language === 'vi' ? 'VI' : 'EN'} <i>·</i> {settings.language === 'vi' ? 'EN' : 'VI'}</button>{hosted && <button className="text-button" onClick={() => void auth.signOut()}>{vi ? 'Đăng xuất' : 'Sign out'}</button>}<button className="refresh-button" onClick={retry} disabled={loading} aria-busy={loading} aria-label={loading ? (vi ? 'Đang làm mới dữ liệu' : 'Refreshing data') : (vi ? 'Làm mới dữ liệu' : 'Refresh data')}>↻</button></div></header>{error && <div className="error-banner" role="alert" aria-live="assertive"><strong>{vi ? 'Có lỗi khi tải dữ liệu.' : 'Could not reload data.'}</strong> {error} <button className="text-button" onClick={retry}>{vi ? 'Thử lại' : 'Retry'}</button></div>}{loading && !dashboard ? <LoadingState /> : <div className="page-content">{view === 'dashboard' && <TodayView dashboard={dashboard} language={settings.language} lessonTitle={dashboard?.current_lesson ? lessonTitleMap[dashboard.current_lesson.slug] : undefined} onOpenLesson={openLesson} onNavigate={navigate} onRecordSession={async (minutes, note) => { await api.createSession({ minutes, note }); await refresh() }} />}{view === 'roadmap' && <RoadmapView roadmap={roadmap} language={settings.language} showCompletedLessons={settings.show_completed_lessons} onOpenLesson={openLesson}>{roadmap && <PortfolioBoard program={roadmap.program} language={settings.language} />}</RoadmapView>}{view === 'lesson' && <LessonPage lesson={lesson} lessonLoading={lessonLoading} language={settings.language} onBack={closeLesson} onProgress={updateProgress} onOpenLesson={openLesson} nextLessonTitles={lessonTitleMap} onOpenExercises={() => navigate('exercises')} />}{view === 'review' && <ReviewView language={settings.language} reviews={reviews} onAnswer={async (id, rating, thoughtSeconds, answerText) => { await api.answerReview(id, rating, thoughtSeconds, answerText); setReviews((current) => current.filter((card) => card.id !== id)); await refresh() }} onOpenLesson={openLesson} />}{view === 'exercises' && <ExercisesView language={settings.language} exercises={exercises} gitPublishAvailable={gitPublishAvailable} hosted={hosted} onRefresh={refresh} />}{view === 'tools' && <ToolsView tools={tools} />}{view === 'security' && !hosted && <SecurityLabView />}{view === 'resources' && <ResourcesView resources={resources} language={settings.language} />}{view === 'community' && <CommunityView onOpenLesson={openLesson} />}{view === 'settings' && <SettingsView settings={settings} hosted={hosted} onSave={async (next) => setSettings(await api.updateSettings(next))} />}{view === 'journal' && <JournalView hosted={hosted} language={settings.language} onExportContext={(question) => api.exportContext({ lesson_slug: lesson?.slug, question })} />}</div>}</main>
  </div>
}

function LoadingState({ message = 'Đang nạp chương trình học...', compact = false }: { message?: string; compact?: boolean }) { return <div className={`loading-state ${compact ? 'compact' : ''}`} role="status" aria-live="polite"><div className="loading-orb" aria-hidden="true" /><p>{message}</p></div> }
function PortfolioBoard({ program, language }: { program: any; language: 'vi' | 'en' }) {
  const vi = language === 'vi'
  const projects = program.portfolio_projects ?? []
  const checklist = program.career_checklist ?? []
  return <section className="portfolio-board"><div className="section-heading"><div><span className="eyebrow accent">PORTFOLIO ARC</span><h3>{vi ? `${projects.length} gợi ý portfolio` : `${projects.length} portfolio ideas`}</h3></div><span className="tag">{projects.length} milestones</span></div><div className="portfolio-grid">{projects.map((project: any) => <article className={`portfolio-card ${project.track === 'genai-specialization' ? 'genai-portfolio-card' : ''}`} key={project.slug}><div className="portfolio-card-top"><span className="tag">{project.estimated_weeks} {vi ? 'tuần ước tính' : 'estimated weeks'}</span><code>{project.github_path}</code></div><h4>{vi ? project.title_vi : project.title_en}</h4><p>{vi ? project.problem_vi : project.problem_en}</p><div className="tag-list">{project.stack.map((item: string) => <span className="tag" key={item}>{item}</span>)}</div><strong>{vi ? 'Bằng chứng cần ship' : 'Evidence to ship'}</strong><ul>{project.deliverables.slice(0, 4).map((item: string) => <li key={item}>{item}</li>)}</ul></article>)}</div><details className="career-checklist"><summary>{vi ? 'Checklist sẵn sàng xin việc' : 'Job-readiness checklist'}</summary><ul>{checklist.map((item: string) => <li key={item}>{item}</li>)}</ul></details></section>
}

function LessonPage({ lesson, lessonLoading, language, onBack, onProgress, onOpenLesson, nextLessonTitles, onOpenExercises }: { lesson: Lesson | null; lessonLoading: boolean; language: 'vi' | 'en'; onBack: () => void; onProgress: (slug: string, status: string, minutes?: number) => Promise<void>; onOpenLesson: (slug: string) => void; nextLessonTitles: Record<string, string>; onOpenExercises: () => void }) {
  const { session } = useAuth()
  const vi = language === 'vi'
  return <section className="lesson-page" aria-label={vi ? 'Trang bài học' : 'Lesson page'}>
    <div className="lesson-page-toolbar">
      <button className="back-button" type="button" onClick={onBack} aria-label={vi ? 'Quay lại lộ trình' : 'Back to roadmap'}>← <span>{vi ? 'Quay lại lộ trình' : 'Back to roadmap'}</span></button>
      <div className="lesson-page-context"><span className="eyebrow accent">LESSON WORKSPACE</span>{lesson && <span>{vi ? lesson.module_title_vi : lesson.module_title_en}</span>}</div>
      {lesson && <span className="lesson-page-meta">{lesson.estimated_minutes} {vi ? 'phút học' : 'min study'}</span>}
    </div>
    {lessonLoading ? <div className="lesson-page-loading"><LoadingState compact message={vi ? 'Đang mở bài học…' : 'Loading lesson…'} /></div> : lesson ? <div className="lesson-page-shell"><LessonDetail key={`${session?.user.id ?? 'local'}:${lesson.slug}`} lesson={lesson} language={language} onProgress={onProgress} onOpenLesson={onOpenLesson} nextLessonTitles={nextLessonTitles} onOpenExercises={onOpenExercises} /></div> : <EmptyState title={vi ? 'Chưa tải được lesson' : 'Lesson unavailable'} description={vi ? 'Hãy dùng nút thử lại ở phía trên rồi mở lesson một lần nữa.' : 'Use the retry button above and open the lesson again.'} />}
  </section>
}

function StudyStepAccordion({ step, index, lesson, language }: { step: string; index: number; lesson: Lesson; language: 'vi' | 'en' }) {
  const [open, setOpen] = useState(false)
  const vi = language === 'vi'
  const stage = Math.min(index, 4)
  // A step may optionally carry explicit content references. The semantic fallback keeps
  // old catalogues useful without rotating unrelated resources into every step.
  const stepRef = lesson.study_step_refs?.[index]
  const resource = typeof stepRef?.resource_index === 'number' ? lesson.resources[stepRef.resource_index] : index === 1 ? lesson.resources[0] : undefined
  const codeExample = typeof stepRef?.code_example_index === 'number' ? lesson.code_examples[stepRef.code_example_index] : index === 2 ? lesson.code_examples[0] : undefined
  const review = typeof stepRef?.review_id === 'number' ? lesson.reviews.find((item) => item.id === stepRef.review_id) : index === 4 ? lesson.reviews[0] : undefined
  const panelId = `study-step-${lesson.slug}-${index}`
  const headingId = `${panelId}-heading`
  const titles = vi
    ? ['Nắm ý chính trước khi làm', 'Đọc tài liệu có mục tiêu', 'Biến lý thuyết thành code', 'Tạo bằng chứng có thể kiểm tra', 'Tự gọi lại và sửa lỗ hổng']
    : ['Understand the idea before doing', 'Read with a focused question', 'Turn the concept into code', 'Create verifiable evidence', 'Recall and close the gap']
  const explanations = vi
    ? ['Bắt đầu bằng concept notes và công thức liên quan. Hãy nói lại bằng lời của bạn trước khi mở tài liệu ngoài.', 'Đừng đọc lan man. Chọn tài liệu được gợi ý, ghi lại một định nghĩa hoặc ví dụ, rồi đối chiếu với mục tiêu của lesson.', 'Chạy ví dụ, thay đổi một giả định và quan sát output. Đây là bước biến kiến thức thành kỹ năng có thể chứng minh.', 'Lưu một file code, output hoặc test cùng một note ngắn về edge case. Bằng chứng này sẽ giúp bạn viết portfolio sau này.', 'Trả lời review card khi chưa nhìn gợi ý. Nếu sai, quay lại đúng phần nội dung thay vì học lại cả phase.']
    : ['Start with the concept notes and relevant formulas. Explain the idea in your own words before opening an external resource.', 'Read with a question in mind. Capture one definition or example, then compare it with this lesson’s outcomes.', 'Run the example, change one assumption and inspect the output. This turns knowledge into a skill you can prove.', 'Save code, output or a test together with a short edge-case note. This evidence can later support your portfolio.', 'Answer the review card before looking at the hint. If you miss it, return to the exact gap instead of restarting the whole phase.']
  const answerHint = vi
    ? [lesson.objectives[language].join(' '), lesson.completion_criteria.slice(0, 2).join(' '), codeExample?.explanation_vi ?? lesson.concept_notes_vi, lesson.checklist.slice(0, 3).join(' '), review?.answer_vi ?? lesson.completion_criteria.join(' ')][stage]
    : [lesson.objectives[language].join(' '), lesson.completion_criteria.slice(0, 2).join(' '), codeExample?.explanation_en ?? lesson.concept_notes_en, lesson.checklist.slice(0, 3).join(' '), review?.answer_en ?? lesson.completion_criteria.join(' ')][stage]
  const content = stage === 0 ? <>
    <div className="study-step-card"><span className="eyebrow">CONCEPT</span><p className="concept-notes">{vi ? lesson.concept_notes_vi : lesson.concept_notes_en}</p>{lesson.formulas.length > 0 && <div className="formula-list">{lesson.formulas.slice(0, 3).map((formula) => <code key={formula}>{formula}</code>)}</div>}</div>
    <div className="study-step-card"><h4>{vi ? 'Sau bước này bạn phải làm được' : 'By the end of this step'}</h4><ul>{lesson.objectives[language].map((item) => <li key={item}>{item}</li>)}</ul></div>
  </> : stage === 1 ? <>
    <div className="study-step-card"><span className="eyebrow">READ THIS</span>{resource ? <><strong>{resource.title}</strong><p>{vi ? resource.purpose_vi : resource.purpose_en}</p><small>{vi ? resource.read_vi : resource.read_en}</small>{resource.url && <a href={resource.url} target="_blank" rel="noreferrer">{vi ? 'Mở tài liệu' : 'Open resource'} ↗</a>}</> : <p>{vi ? 'Lesson này chưa có resource riêng.' : 'This lesson has no dedicated resource yet.'}</p>}</div>
    <div className="study-step-card"><h4>{vi ? 'Cách biết mình đọc đúng hướng' : 'How to know you are on track'}</h4><ul>{lesson.completion_criteria.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul></div>
  </> : stage === 2 ? <>
    <div className="study-step-card">{codeExample ? <><span className="eyebrow">EXAMPLE · {codeExample.status ?? 'runnable'}</span><strong>{codeExample.title}</strong>{(codeExample.purpose_vi || codeExample.purpose_en) && <p className="muted">{vi ? codeExample.purpose_vi : codeExample.purpose_en}</p>}<pre><code>{codeExample.code}</code></pre><p>{vi ? codeExample.explanation_vi : codeExample.explanation_en}</p><dl className="code-example-guide">{codeExample.setup && <><dt>{vi ? 'Chuẩn bị' : 'Setup'}</dt><dd>{codeExample.setup}</dd></>}{codeExample.expected_output && <><dt>{vi ? 'Kết quả mong đợi' : 'Expected output'}</dt><dd>{codeExample.expected_output}</dd></>}{(codeExample.edge_case_vi || codeExample.edge_case_en) && <><dt>{vi ? 'Edge case' : 'Edge case'}</dt><dd>{vi ? codeExample.edge_case_vi : codeExample.edge_case_en}</dd></>}</dl></> : <p>{vi ? 'Chưa có code example riêng; hãy dùng checklist để tạo một ví dụ tối thiểu.' : 'There is no dedicated code example; use the checklist to create a minimal example.'}</p>}</div>
    <div className="study-step-card"><h4>{vi ? 'Bài thực hành liên quan' : 'Related practice'}</h4>{lesson.exercises.length > 0 ? <ul>{lesson.exercises.slice(0, 3).map((exercise) => <li key={exercise.slug}>{vi ? exercise.title_vi : exercise.title_en} · {exercise.estimated_minutes}m</li>)}</ul> : <p>{vi ? 'Chưa có exercise riêng cho lesson này.' : 'No dedicated exercise is linked yet.'}</p>}</div>
  </> : stage === 3 ? <>
    <div className="study-step-card"><span className="eyebrow">EVIDENCE</span><h4>{vi ? 'Checklist nên hoàn thành' : 'Checklist to complete'}</h4><ul>{lesson.checklist.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul></div>
    <div className="study-step-card"><h4>{vi ? 'Tiêu chí đạt' : 'Definition of done'}</h4><ul>{lesson.completion_criteria.map((item) => <li key={item}>{item}</li>)}</ul></div>
  </> : <div className="study-step-card"><span className="eyebrow">RECALL</span>{review ? <><p><strong>{vi ? review.question_vi : review.question_en}</strong></p><details><summary>{vi ? 'Mở câu trả lời mẫu' : 'Show answer'}</summary><p>{vi ? review.answer_vi : review.answer_en}</p></details></> : <p>{vi ? 'Hãy tự giải thích lại lesson bằng một ví dụ và ghi phần còn chưa chắc vào Journal.' : 'Explain the lesson with one example and record any remaining uncertainty in your Journal.'}</p>}</div>
  return <li className={`study-step-item ${open ? 'open' : ''}`}>
    <button id={headingId} className="study-step-toggle" type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((current) => !current)}>
      <span className="study-step-number">{String(index + 1).padStart(2, '0')}</span><span className="study-step-copy"><strong>{step}</strong><small>{open ? (vi ? 'Đang mở nội dung chi tiết' : 'Details open') : (vi ? 'Bấm để xem giải thích, ví dụ và cách tự kiểm tra' : 'Open explanation, example and self-check')}</small></span><span className="study-step-chevron" aria-hidden="true">{open ? '−' : '+'}</span>
    </button>
    {open && <div className="study-step-detail" id={panelId} role="region" aria-labelledby={headingId}><h3>{titles[stage]}</h3><p className="study-step-explanation">{explanations[stage]}</p><div className="study-step-content">{content}</div><details className="study-step-answer"><summary>{vi ? 'Mở câu trả lời / dấu hiệu đã hiểu' : 'Show answer / understanding check'}</summary><p>{answerHint}</p></details></div>}
  </li>
}

function LessonAnchorNav({ language }: { language: 'vi' | 'en' }) {
  const vi = language === 'vi'
  const items = vi
    ? [['overview', 'Tổng quan'], ['concept', 'Khái niệm'], ['practice', 'Thực hành'], ['check', 'Kiểm tra hiểu'], ['resources', 'Tài liệu'], ['notes', 'Ghi chú & feedback']]
    : [['overview', 'Overview'], ['concept', 'Concept'], ['practice', 'Practice'], ['check', 'Check understanding'], ['resources', 'Resources'], ['notes', 'Notes & feedback']]
  const jumpTo = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    const target = document.getElementById(id)
    if (!target) return
    window.history.replaceState(window.history.state, '', `#${id}`)
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }
  return <nav className="lesson-anchor-nav" aria-label={vi ? 'Mục lục bài học' : 'Lesson contents'}><span className="lesson-anchor-label">{vi ? 'Trong bài này' : 'In this lesson'}</span>{items.map(([id, label]) => <a key={id} href={`#${id}`} onClick={(event) => jumpTo(event, id)}>{label}</a>)}</nav>
}

function LessonDetail({ lesson: originalLesson, language, onProgress, onOpenLesson, nextLessonTitles, onOpenExercises }: { lesson: Lesson; language: 'vi' | 'en'; onProgress: (slug: string, status: string, minutes?: number) => Promise<void>; onOpenLesson: (slug: string) => void; nextLessonTitles: Record<string, string>; onOpenExercises: () => void }) {
  const { session } = useAuth()
  const checklistStorageKey = checklistKey(originalLesson.slug, runtimeConfig.mode === 'hosted' ? (session?.user.id ?? 'signed-out') : null)
  const lesson = language === 'en' ? {
    ...originalLesson,
    checklist: originalLesson.completion_checklist_en ?? originalLesson.checklist,
    completion_criteria: originalLesson.completion_criteria_en ?? originalLesson.completion_criteria,
    common_mistakes: originalLesson.common_mistakes_en ?? originalLesson.common_mistakes,
  } : originalLesson
  const [noteBody, setNoteBody] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [noteError, setNoteError] = useState('')
  const [noteSaving, setNoteSaving] = useState(false)
  const noteSubmitting = useRef(false)
  const [sessionMinutes, setSessionMinutes] = useState(String(Math.max(15, Math.min(lesson.estimated_minutes, 120))))
  const [checked, setChecked] = useState<boolean[]>(() => readChecklist(checklistStorageKey, lesson.checklist.length))
  const [checklistNudge, setChecklistNudge] = useState(false)
  const [progressError, setProgressError] = useState('')
  const [progressSaving, setProgressSaving] = useState(false)
  const [progressSaved, setProgressSaved] = useState(false)
  const progressSubmitting = useRef(false)
  const vi = language === 'vi'
  const detailRef = useRef<HTMLDivElement>(null)
  const guide = lesson.guide ?? lesson
  const studySteps = vi ? guide.study_steps_vi : guide.study_steps_en
  const practicePlan = guide.practice_plan?.[vi ? 'vi' : 'en']
  const interviewQuestions = vi ? guide.interview_questions?.vi ?? [] : guide.interview_questions?.en ?? []
  const completedCount = checked.filter(Boolean).length
  const checklistComplete = completedCount === lesson.checklist.length
  const titleRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    titleRef.current?.focus({ preventScroll: true })
  }, [lesson.slug])
  useEffect(() => {
    try {
      window.localStorage.setItem(checklistStorageKey, JSON.stringify(checked))
    } catch {
      // Local storage may be disabled; lesson progress still works.
    }
  }, [checked, checklistStorageKey])
  const saveNote = async () => {
    if (!noteBody.trim() || noteSubmitting.current) return
    noteSubmitting.current = true
    setNoteSaving(true)
    setNoteSaved(false)
    setNoteError('')
    try {
      await api.createNote({ lesson_slug: lesson.slug, title: 'Insight: ' + (vi ? lesson.title_vi : lesson.title_en), body: noteBody.trim() })
      setNoteBody('')
      setNoteSaved(true)
    } catch (cause) {
      setNoteError(cause instanceof Error ? cause.message : (vi ? 'Chưa lưu được ghi chú.' : 'The note could not be saved.'))
    } finally {
      noteSubmitting.current = false
      setNoteSaving(false)
    }
  }
  const toggleChecklist = (index: number) => {
    setChecked((current) => current.map((value, currentIndex) => currentIndex === index ? !value : value))
    setChecklistNudge(false)
  }
  const markProgress = async () => {
    if (progressSubmitting.current) return
    const nextStatus = lesson.status === 'completed' ? 'needs_review' : 'completed'
    if (nextStatus === 'completed' && !checklistComplete) {
      setChecklistNudge(true)
      return
    }
    const minutes = Number(sessionMinutes)
    setProgressError('')
    setProgressSaved(false)
    progressSubmitting.current = true
    setProgressSaving(true)
    try {
      await onProgress(lesson.slug, nextStatus, Number.isInteger(minutes) && minutes > 0 ? minutes : 0)
      setProgressSaved(true)
    } catch {
      setProgressError(vi ? 'Chưa lưu được tiến độ. Hãy kiểm tra backend rồi thử lại.' : 'Progress was not saved. Check the backend and try again.')
    } finally {
      progressSubmitting.current = false
      setProgressSaving(false)
    }
  }
  return <div ref={detailRef} className="lesson-detail" tabIndex={-1}>
    <span className="eyebrow accent">{vi ? lesson.phase_title_vi : lesson.phase_title_en} · {vi ? lesson.module_title_vi : lesson.module_title_en}</span>
    <h1 ref={titleRef} id="lesson-page-title" tabIndex={-1}>{vi ? lesson.title_vi : lesson.title_en}</h1>
    <p className="tag">{lesson.quality_status === 'reviewed'
      ? (vi ? 'Nội dung đã rà soát' : 'Reviewed content')
      : (vi ? 'Bản nháp · nội dung đang được hoàn thiện' : 'Draft · content is being developed')}</p>
    <p className="muted">{vi
      ? 'Hoàn thành là tiến độ bạn tự ghi nhận; không phải chứng nhận năng lực.'
      : 'Completion records your own progress; it is not a skills certification.'}</p>
    <p className="lead">{vi ? lesson.summary_vi : lesson.summary_en}</p>
    <div className="tag-list">{lesson.keywords.slice(0, 6).map((keyword) => <span className="tag" key={keyword}>{keyword}</span>)}<span className="tag">{lesson.estimated_minutes} phút</span></div>
    <LessonAnchorNav language={language} />
    <div id="overview" className="lesson-evidence lesson-section-overview"><div className="section-heading"><div><span className="eyebrow">01 · OVERVIEW</span><strong>{vi ? 'Bằng chứng đã làm' : 'Evidence completed'}</strong></div><span>{completedCount}/{lesson.checklist.length}</span></div><div className="session-progress" role="progressbar" aria-label={vi ? 'Tiến độ checklist lesson' : 'Lesson checklist progress'} aria-valuemin={0} aria-valuemax={lesson.checklist.length} aria-valuenow={completedCount}><span style={{ width: String(lesson.checklist.length ? Math.round((completedCount / lesson.checklist.length) * 100) : 0) + '%' }} /></div><small>{vi ? 'Hoàn thiện checklist trước khi đánh dấu lesson để tránh học lướt.' : 'Finish the checklist before marking the lesson complete.'}</small></div>
    <section id="overview-objectives" className="detail-section lesson-section lesson-section-overview" aria-labelledby="lesson-overview-title"><h2 id="lesson-overview-title">{vi ? 'Mục tiêu đầu ra' : 'Learning outcomes'}</h2><ul>{lesson.objectives[language].map((item) => <li key={item}>{item}</li>)}</ul></section>
    <section id="concept" className="detail-section lesson-section lesson-section-concept" aria-labelledby="lesson-concept-title"><h2 id="lesson-concept-title">{vi ? 'Giải thích cốt lõi' : 'Concept notes'}</h2><p className="concept-notes">{vi ? lesson.concept_notes_vi : lesson.concept_notes_en}</p>{lesson.formulas.length > 0 && <div className="formula-list" aria-label={vi ? 'Công thức liên quan' : 'Related formulas'}>{lesson.formulas.map((formula) => <code key={formula}>{formula}</code>)}</div>}</section>
    <section id="practice" className="lesson-playbook lesson-section lesson-section-practice" aria-labelledby="lesson-playbook-title"><div className="playbook-intro"><span className="eyebrow accent">02 · PRACTICE PLAYBOOK</span><h2 id="lesson-playbook-title">{vi ? 'Học theo một quy trình có thể lặp lại' : 'Follow a repeatable study process'}</h2><p>{vi ? guide.why_it_matters_vi : guide.why_it_matters_en}</p></div><ol className="study-step-list">{studySteps.map((step, index) => <StudyStepAccordion key={`${step}-${index}`} step={step} index={index} lesson={lesson} language={language} />)}</ol><div className="practice-plan-grid"><article className="practice-plan"><span className="eyebrow">PRACTICE</span><strong>{practicePlan?.task}</strong><h3>{vi ? 'Bằng chứng cần lưu' : 'Evidence to save'}</h3><ul>{(practicePlan?.deliverables ?? []).map((item) => <li key={item}>{item}</li>)}</ul></article><article className="practice-plan checkpoint"><span className="eyebrow">CHECKPOINT</span><strong>{practicePlan?.checkpoint}</strong><h3>{vi ? 'Thử thách thêm' : 'Stretch task'}</h3><p>{practicePlan?.stretch}</p></article></div></section>
    <section className="detail-section lesson-section lesson-section-practice" aria-labelledby="lesson-code-title"><h2 id="lesson-code-title">{vi ? 'Ví dụ code' : 'Code examples'}</h2>{lesson.code_examples.map((example) => <div className="code-example" key={example.title}><strong>{example.title}</strong><pre><code>{example.code}</code></pre><p className="muted">{vi ? example.explanation_vi : example.explanation_en}</p></div>)}</section>
    <section id="check" className="detail-section lesson-section lesson-section-check" aria-labelledby="lesson-check-title"><h2 id="lesson-check-title">{vi ? 'Kiểm tra hiểu' : 'Check understanding'}</h2><div className="lesson-check-block"><h3>{vi ? 'Prerequisites và tiêu chí hoàn thành' : 'Prerequisites and completion criteria'}</h3>{lesson.prerequisites.length > 0 && <ul>{lesson.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul>}<ul>{lesson.completion_criteria.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="lesson-check-block"><h3>{vi ? 'Lỗi thường gặp' : 'Common mistakes'}</h3><ul>{lesson.common_mistakes.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
    <section className="detail-section lesson-section lesson-section-practice" aria-labelledby="lesson-exercise-title"><h2 id="lesson-exercise-title">{vi ? 'Bài tập liên quan' : 'Practice exercise'}</h2>{lesson.exercises.length > 0 ? <><p className="muted">{vi ? 'Viết code trong workspace để tạo bằng chứng có thể đưa vào GitHub.' : 'Use the workspace to create evidence you can show on GitHub.'}</p>{lesson.exercises.map((exercise) => <div className="linked-exercise" key={exercise.slug}><div><strong>{vi ? exercise.title_vi : exercise.title_en}</strong><small>{exercise.difficulty} · {exercise.estimated_minutes} phút</small></div><button className="secondary-button" onClick={onOpenExercises}>{vi ? 'Mở Practice Lab' : 'Open Practice Lab'}</button></div>)}</> : <p className="muted">{vi ? 'Chưa có exercise riêng cho lesson này.' : 'No dedicated exercise is linked yet.'}</p>}</section>
    <section className="detail-section lesson-section lesson-section-completion" aria-labelledby="lesson-next-title"><h2 id="lesson-next-title">{vi ? 'Bài tiếp theo' : 'Next lessons'}</h2><div className="next-lesson-list">{lesson.next_lessons.map((slug) => <button className="text-button" key={slug} onClick={() => onOpenLesson(slug)}>{nextLessonTitles[slug] ?? slug} <small>({slug})</small> →</button>)}</div></section>
    <section className="detail-section lesson-section lesson-section-check" aria-labelledby="lesson-checklist-title"><h2 id="lesson-checklist-title">{vi ? 'Checklist thực hành' : 'Practice checklist'}</h2><div className="checklist">{lesson.checklist.map((item, index) => <label key={item}><input type="checkbox" checked={checked[index] ?? false} onChange={() => toggleChecklist(index)} /> <span className={checked[index] ? 'checked-item' : ''}>{item}</span></label>)}</div>{checklistNudge && <p className="warning-note" role="status">{vi ? 'Hãy hoàn thiện các mục checklist trước khi đánh dấu hoàn thành.' : 'Finish every checklist item before marking this lesson complete.'}</p>}<div className="interview-questions"><h3>{vi ? 'Câu hỏi phỏng vấn cần tự trả lời' : 'Interview questions to answer aloud'}</h3><ul>{interviewQuestions.map((question) => <li key={question}>{question}</li>)}</ul></div>{lesson.reviews.length > 0 && <div className="lesson-review-list"><h3>{vi ? 'Câu hỏi tự kiểm tra' : 'Self-check questions'}</h3>{lesson.reviews.map((review) => <div className="review-prompt" key={review.id}><p>{vi ? review.question_vi : review.question_en}</p><details><summary>{vi ? 'Hiện gợi ý đáp án' : 'Show answer hint'}</summary><p>{vi ? review.answer_vi : review.answer_en}</p></details></div>)}</div>}</section>
    <section id="resources" className="detail-section rich-resources lesson-section lesson-section-resources" aria-labelledby="lesson-resources-title"><h2 id="lesson-resources-title">{vi ? 'Tài liệu có hướng dẫn đọc' : 'Guided resources'}</h2><div className="rich-resource-list">{lesson.resources.map((resource, index) => resource.kind === 'in_app' || !resource.url ? <article className="lesson-resource resource-internal" key={`${resource.title}-${index}`}><div className="resource-heading"><span className="resource-language">{resource.language === 'en' ? 'EN' : 'VI'}</span><strong>{resource.title}</strong><span className="resource-required">{vi ? 'Đọc trong app' : 'In-app'}</span></div><p>{vi ? resource.purpose_vi : resource.purpose_en}</p><small>{vi ? resource.read_vi : resource.read_en}</small></article> : <a className="lesson-resource resource-link" href={resource.url} target="_blank" rel="noreferrer" key={`${resource.url}-${index}`}><div className="resource-heading"><span className="resource-language">{resource.language === 'en' ? 'EN' : 'VI'}</span><strong>{resource.title}</strong>{resource.required && <span className="resource-required">{vi ? 'Bắt buộc' : 'Required'}</span>}</div><p>{vi ? resource.purpose_vi : resource.purpose_en}</p><small>{vi ? resource.read_vi : resource.read_en}</small><code className="resource-url">{resource.url}</code><b>Mở tài liệu ↗</b></a>)}</div></section>
    <section id="notes" className="detail-section note-editor lesson-section lesson-section-notes" aria-labelledby="lesson-notes-title"><h2 id="lesson-notes-title">{vi ? 'Ghi chú và feedback' : 'Notes and feedback'}</h2><div className="lesson-note-block"><h3>{vi ? 'Ghi chú của bạn' : 'Your note'}</h3><textarea aria-label={vi ? 'Ghi chú của bạn' : 'Your note'} value={noteBody} disabled={noteSaving} onChange={(event) => { setNoteBody(event.target.value); setNoteSaved(false) }} placeholder={vi ? 'Viết insight, lỗi gặp phải hoặc điều cần ôn lại...' : 'Write an insight, failure or topic to revisit...'} /><button className="secondary-button" disabled={!noteBody.trim() || noteSaving} aria-busy={noteSaving} onClick={() => void saveNote()}>{noteSaving ? (vi ? 'Đang lưu…' : 'Saving…') : (vi ? 'Lưu ghi chú' : 'Save note')}</button>{noteSaved && <p className="success-note" role="status">{vi ? 'Đã lưu vào Journal.' : 'Saved to Journal.'}</p>}{noteError && <p className="warning-note" role="alert">{noteError}</p>}</div>
    <FeedbackPanel lesson={lesson} language={language} />
    </section>
    <div className="detail-actions"><label className="session-minutes">Phút học<input type="number" min="1" max="1440" value={sessionMinutes} disabled={progressSaving} onChange={(event) => setSessionMinutes(event.target.value)} /></label><button className="primary-button" disabled={progressSaving} aria-busy={progressSaving} onClick={() => void markProgress()}>{progressSaving ? (vi ? 'Đang lưu…' : 'Saving…') : lesson.status === 'completed' ? (vi ? 'Đánh dấu cần ôn' : 'Mark for review') : (vi ? 'Đánh dấu hoàn thành' : 'Mark complete')} {!progressSaving && <span>✓</span>}</button></div>{progressSaved && <p className="success-note" role="status">{vi ? 'Đã lưu tiến độ.' : 'Progress saved.'}</p>}{progressError && <p className="warning-note" role="alert">{progressError}</p>}
    <div className="ask-box"><span className="eyebrow">ASK YOUR ASSISTANT</span><h4>{vi ? 'Đang vướng ở đâu?' : 'Where are you stuck?'}</h4><p>Context export ở Journal sẽ đưa lesson, mục tiêu và câu hỏi sang ChatGPT/Codex.</p></div>
  </div>
}

const feedbackKindLabels: Record<FeedbackKind, string> = {
  unclear: 'Chưa rõ / cần giải thích thêm',
  incorrect: 'Có vẻ chưa chính xác',
  missing_example: 'Thiếu ví dụ thực hành',
  missing_resource: 'Thiếu tài liệu tham khảo',
  broken_link: 'Liên kết bị hỏng',
  typo: 'Lỗi chính tả / hiển thị',
  exercise_problem: 'Bài tập có vấn đề',
  feature_request: 'Đề xuất tính năng',
}

function feedbackDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Mới cập nhật' : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(date)
}

const GITHUB_DISCUSSIONS_URL = 'https://github.com/Hzyl/JourneyAIEngineer/discussions'
const FEEDBACK_SECRET_PATTERNS = [
  /(?:sk|rk)-[A-Za-z0-9_-]{20,}/g,
  /gh[pousr]_[A-Za-z0-9_]{20,}/g,
  /AKIA[0-9A-Z]{16}/g,
  /-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+ PRIVATE KEY-----/g,
]

function redactFeedbackSecrets(value: string): string {
  return FEEDBACK_SECRET_PATTERNS.reduce((result, pattern) => result.replace(pattern, '[REDACTED]'), value)
}

function feedbackReportText(lesson: Lesson, kind: FeedbackKind, body: string, displayName: string, language: 'vi' | 'en'): string {
  const title = language === 'vi' ? lesson.title_vi : lesson.title_en
  const lines = [
    'Journey AI Engineer public beta feedback',
    '',
    'Version: v0.1.2',
    'Mode: Local app',
    `Lesson: ${title} (${lesson.slug})`,
    `Feedback type: ${feedbackKindLabels[kind]}`,
    displayName.trim() ? `Display name: ${redactFeedbackSecrets(displayName.trim())}` : '',
    '',
    'Feedback:',
    redactFeedbackSecrets(body.trim()),
    '',
    'I checked that this report does not contain credentials or private data.',
  ]
  return lines.filter((line, index) => line || (index > 0 && lines[index - 1])).join('\n')
}

function FeedbackReportActions({ lesson, language, kind, body, displayName }: { lesson: Lesson; language: 'vi' | 'en'; kind: FeedbackKind; body: string; displayName: string }) {
  const [report, setReport] = useState('')
  const [copied, setCopied] = useState(false)
  const vi = language === 'vi'

  const copyReport = async (value: string) => {
    setReport(value)
    setCopied(false)
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      // The preview remains available when clipboard permission is unavailable.
    }
  }

  const createReport = () => {
    if (body.trim().length < 5) return
    void copyReport(feedbackReportText(lesson, kind, body, displayName, language))
  }

  return <div className="feedback-report-actions"><button type="button" className="text-button" disabled={body.trim().length < 5} onClick={createReport}>{vi ? 'Tạo report để gửi GitHub' : 'Create GitHub report'}</button>{report && <div className="feedback-report" aria-live="polite"><div className="feedback-report-heading"><strong>{vi ? 'Report vừa tạo' : 'Report ready'}</strong><div><button type="button" className="text-button" onClick={() => void copyReport(report)}>{copied ? (vi ? 'Đã copy ✓' : 'Copied ✓') : (vi ? 'Copy lại' : 'Copy again')}</button><a className="text-button" href={GITHUB_DISCUSSIONS_URL} target="_blank" rel="noreferrer">{vi ? 'Mở Discussions ↗' : 'Open Discussions ↗'}</a></div></div><textarea className="feedback-report-preview" aria-label={vi ? 'Report feedback vừa tạo' : 'Generated feedback report'} readOnly value={report} onFocus={(event) => event.currentTarget.select()} /><small>{vi ? 'Report được hiển thị để bạn kiểm tra trước khi gửi. Các mẫu credential phổ biến đã được che.' : 'Review the report before sending. Common credential patterns are redacted.'}</small></div>}</div>
}

function FeedbackPanel({ lesson, language }: { lesson: Lesson; language: 'vi' | 'en' }) {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [kind, setKind] = useState<FeedbackKind>('unclear')
  const [body, setBody] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const vi = language === 'vi'

  useEffect(() => {
    let active = true
    void api.feedback(lesson.slug).then((result) => {
      if (active) setItems(result.items)
    }).catch((cause) => {
      if (active) setError(cause instanceof Error ? cause.message : (vi ? 'Chưa tải được góp ý.' : 'Feedback could not be loaded.'))
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [lesson.slug, vi])

  const submit = async () => {
    const trimmed = body.trim()
    if (trimmed.length < 5) {
      setError(vi ? 'Góp ý cần ít nhất 5 ký tự để người viết có thể kiểm tra.' : 'Feedback needs at least 5 characters.')
      return
    }
    setSubmitting(true)
    setError('')
    setMessage('')
    try {
      const result = await api.createFeedback({ lesson_slug: lesson.slug, kind, body: trimmed, display_name: displayName.trim() || undefined })
      setBody('')
      setMessage(result.message)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : (vi ? 'Chưa gửi được góp ý.' : 'Feedback could not be sent.'))
    } finally {
      setSubmitting(false)
    }
  }

  return <section className="feedback-panel" aria-labelledby="feedback-panel-title"><div className="section-heading"><div><span className="eyebrow accent">LEARNING FEEDBACK</span><h4 id="feedback-panel-title">{vi ? 'Giúp bài học tốt hơn' : 'Help improve this lesson'}</h4></div><span className="tag">{items.length} {vi ? 'đã duyệt' : 'approved'}</span></div><p className="muted">{vi ? 'Góp ý sẽ được xem trước khi xuất hiện công khai. Không nhập email, API key hoặc dữ liệu riêng tư.' : 'Suggestions are reviewed before they become public. Do not include email, API keys or private data.'}</p><form className="feedback-form" onSubmit={(event) => { event.preventDefault(); void submit() }}><label>{vi ? 'Loại góp ý' : 'Feedback type'}<select value={kind} onChange={(event) => setKind(event.target.value as FeedbackKind)}>{(Object.keys(feedbackKindLabels) as FeedbackKind[]).map((option) => <option key={option} value={option}>{feedbackKindLabels[option]}</option>)}</select></label><label>{vi ? 'Tên hiển thị (tuỳ chọn)' : 'Display name (optional)'}<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={80} placeholder={vi ? 'Ví dụ: Huy' : 'For example: Huy'} /></label><label className="feedback-body-field">{vi ? 'Góp ý cụ thể' : 'Specific feedback'}<textarea value={body} onChange={(event) => setBody(event.target.value)} minLength={5} maxLength={2000} required placeholder={vi ? 'Bạn bị vướng ở bước nào? Có thể đề xuất ví dụ, tài liệu hoặc cách sửa.' : 'Which step is unclear? Suggest an example, resource or fix.'} /><small>{body.length}/2000</small></label><button className="secondary-button" type="submit" disabled={submitting || body.trim().length < 5}>{submitting ? (vi ? 'Đang gửi…' : 'Sending…') : (vi ? 'Gửi góp ý để review' : 'Send for review')}</button></form><FeedbackReportActions lesson={lesson} language={language} kind={kind} body={body} displayName={displayName} />{message && <p className="success-note" role="status">{message}</p>}{error && <p className="warning-note" role="alert">{error}</p>}<div className="feedback-list" aria-live="polite">{loading ? <p className="muted">{vi ? 'Đang tải góp ý đã duyệt…' : 'Loading approved feedback…'}</p> : items.length === 0 ? <p className="muted">{vi ? 'Chưa có góp ý công khai cho lesson này.' : 'No public feedback for this lesson yet.'}</p> : items.map((item) => <article className="feedback-item" key={item.id}><div className="feedback-item-meta"><span className="tag">{feedbackKindLabels[item.kind]}</span><span>{feedbackDate(item.created_at)}{item.display_name ? ` · ${item.display_name}` : ''}</span></div><p>{item.body}</p>{item.status === 'implemented' && <small className="feedback-implemented">✓ {vi ? 'Đã phản ánh vào chương trình' : 'Reflected in the curriculum'}</small>}</article>)}</div></section>
}

function CommunityView({ onOpenLesson }: { onOpenLesson: (slug: string) => void }) {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [kind, setKind] = useState<FeedbackKind | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    void api.feedback().then((result) => {
      if (active) setItems(result.items)
    }).catch((cause) => {
      if (active) setError(cause instanceof Error ? cause.message : 'Chưa tải được cộng đồng góp ý.')
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [])
  const visible = kind === 'all' ? items : items.filter((item) => item.kind === kind)
  return <div className="community-layout"><section className="community-hero"><span className="eyebrow accent">LEARNING COMMUNITY</span><h2>Học cùng nhau,<br /><em>sửa bằng chứng.</em></h2><p>Đây là nơi các nhận xét đã được duyệt trở thành tín hiệu để cải thiện lesson, ví dụ và bài tập. Bạn có thể gửi góp ý ngay trong từng bài học.</p><div className="community-boundary"><strong>Public beta</strong><span>Chỉ hiển thị góp ý đã duyệt · không hiển thị email, tiến độ hay ghi chú riêng.</span></div></section><section className="section-card community-feed"><div className="section-heading"><div><span className="eyebrow">APPROVED FEEDBACK</span><h3>Nhận xét gần đây</h3></div><label className="community-filter"><span className="sr-only">Lọc loại góp ý</span><select value={kind} onChange={(event) => setKind(event.target.value as FeedbackKind | 'all')}><option value="all">Mọi loại</option>{(Object.keys(feedbackKindLabels) as FeedbackKind[]).map((option) => <option key={option} value={option}>{feedbackKindLabels[option]}</option>)}</select></label></div>{error && <p className="warning-note" role="alert">{error}</p>}{loading ? <LoadingState compact message="Đang tải góp ý đã duyệt…" /> : visible.length === 0 ? <EmptyState title="Chưa có nhận xét phù hợp" description="Mở một lesson để gửi góp ý đầu tiên cho chương trình." /> : <div className="community-feed-list">{visible.map((item) => <article className="community-feedback-card" key={item.id}><div className="feedback-item-meta"><span className="tag">{feedbackKindLabels[item.kind]}</span><span>{feedbackDate(item.created_at)}{item.display_name ? ` · ${item.display_name}` : ''}</span></div><p>{item.body}</p><button className="text-button" onClick={() => onOpenLesson(item.lesson_slug)}>Mở lesson: {item.lesson_title_vi} →</button>{item.status === 'implemented' && <small className="feedback-implemented">✓ Đã cập nhật</small>}</article>)}</div>}</section></div>
}

const securitySeverityLabels: Record<SecurityFinding['severity'], string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  info: 'Đã kiểm chứng',
}

const securityStatusLabels: Record<SecurityFinding['status'], string> = {
  candidate: 'Ứng viên cần xem',
  needs_human_review: 'Cần người kiểm tra',
  verified_control: 'Guardrail đã kiểm chứng',
}

function SecurityLabView() {
  const [report, setReport] = useState<SecurityAuditReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [severity, setSeverity] = useState<'all' | SecurityFinding['severity']>('all')
  const [status, setStatus] = useState<'all' | SecurityFinding['status']>('all')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setReport(await api.securityAudit())
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không chạy được passive security review.')
    } finally {
      setLoading(false)
    }
  }

  // The audit is read-only and intentionally runs only when this view opens or is refreshed.
  useEffect(() => { const timer = window.setTimeout(() => { void load() }, 0); return () => window.clearTimeout(timer) }, [])

  const visibleFindings = (report?.findings ?? []).filter((finding) => {
    const severityMatches = severity === 'all' || finding.severity === severity
    const statusMatches = status === 'all' || finding.status === status
    return severityMatches && statusMatches
  })

  return <div className="security-layout">
    <section className="security-hero">
      <div>
        <span className="eyebrow accent">PASSIVE SECURITY REVIEW</span>
        <h2>Tìm dấu hiệu rủi ro,<br /><em>không gửi payload.</em></h2>
        <p>Security Lab đọc route FastAPI, schema input và một số guardrail trong source để lập danh sách cần xem. Nó không gọi endpoint, không thử khai thác và không clone hoặc chạy RedAmon.</p>
      </div>
      <div className="security-safe-panel" aria-label="Trạng thái safe mode">
        <strong>SAFE MODE</strong>
        <span>0 network requests</span>
        <span>0 payloads sent</span>
        <span>0 external tools</span>
      </div>
    </section>

    {error && <div className="error-banner" role="alert"><strong>Review chưa chạy được.</strong> {error} <button className="text-button" onClick={() => void load()}>Thử lại</button></div>}
    {loading && !report ? <LoadingState message="Đang lập inventory endpoint an toàn…" /> : report && <>
      <section className="security-summary" aria-label="Tóm tắt security review">
        <div className="security-stat"><span>Endpoint đã lập inventory</span><strong>{report.route_count}</strong><small>Chỉ route /api trong app local</small></div>
        <div className="security-stat warning"><span>Cần human review</span><strong>{report.summary.needs_human_review}</strong><small>Không đồng nghĩa endpoint đã bị khai thác</small></div>
        <div className="security-stat safe"><span>Guardrail đã kiểm chứng</span><strong>{report.summary.verified_controls}</strong><small>Static check trong source hiện tại</small></div>
        <button className="secondary-button security-refresh" disabled={loading} onClick={() => void load()}>{loading ? 'Đang quét…' : 'Quét lại source'}</button>
      </section>

      <section className="security-method-card">
        <div><span className="eyebrow">QUY TRÌNH AN TOÀN</span><h3>Đọc → kiểm chứng → sửa → test</h3></div>
        <p>Finding chỉ là tín hiệu. Với mỗi endpoint, hãy đọc handler và model, viết test control ở local/staging có ủy quyền, xác nhận kết quả, rồi mới sửa và chạy lại test. App không tự biến finding thành exploit.</p>
        <div className="security-steps"><span><b>01</b> Inventory</span><span><b>02</b> Human review</span><span><b>03</b> Fix + regression test</span></div>
      </section>

      <section className="section-card security-findings-card">
        <div className="section-heading"><div><span className="eyebrow">REVIEW QUEUE</span><h3>Dấu hiệu cần đọc trong code</h3></div><span className="tag">{visibleFindings.length}/{report.findings.length}</span></div>
        <div className="security-filters"><label>Severity<select aria-label="Lọc severity" value={severity} onChange={(event) => setSeverity(event.target.value as 'all' | SecurityFinding['severity'])}><option value="all">Mọi mức</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option><option value="info">Đã kiểm chứng</option></select></label><label>Trạng thái<select aria-label="Lọc trạng thái" value={status} onChange={(event) => setStatus(event.target.value as 'all' | SecurityFinding['status'])}><option value="all">Mọi trạng thái</option><option value="needs_human_review">Cần người kiểm tra</option><option value="candidate">Ứng viên cần xem</option><option value="verified_control">Guardrail đã kiểm chứng</option></select></label></div>
        {visibleFindings.length === 0 ? <EmptyState title="Không có finding phù hợp" description="Thử bỏ bớt bộ lọc hoặc quét lại source." /> : <div className="security-finding-list">{visibleFindings.map((finding) => <article className={`security-finding security-${finding.status}`} key={finding.id}><div className="security-finding-top"><div className="security-finding-tags"><span className={`security-severity severity-${finding.severity}`}>{securitySeverityLabels[finding.severity]}</span><span className="security-status">{securityStatusLabels[finding.status]}</span></div>{finding.path && <code>{finding.methods.join(' / ')} {finding.path}</code>}</div><h4>{finding.title_vi}</h4><p className="security-evidence"><strong>Bằng chứng:</strong> {finding.evidence}</p><p className="security-remediation"><strong>Bước tiếp theo:</strong> {finding.remediation_vi}</p>{finding.source_file && <small className="security-source">{finding.source_file}{finding.source_line ? `:${finding.source_line}` : ''}</small>}</article>)}</div>}
      </section>

      <details className="security-details"><summary>Endpoint inventory ({report.route_count})</summary><p className="muted">Đây là metadata đọc từ FastAPI route table; handler không được gọi trong lúc lập inventory.</p><div className="security-route-list">{report.routes.map((route) => <div className="security-route" key={`${route.path}-${route.methods.join(',')}`}><div><code>{route.methods.join(' / ')} {route.path}</code><small>{route.name}{route.body_model ? ` · body ${route.body_model}` : ''}</small></div><span className={route.mutating ? 'security-route-write' : 'security-route-read'}>{route.mutating ? 'ghi dữ liệu' : 'read-only'}</span></div>)}</div></details>
      <details className="security-details"><summary>Giới hạn và cách đọc kết quả</summary><ul>{report.limitations_vi.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul><p className="muted">Source root: <code>{report.source_root}</code>. Đường dẫn source trong report là đường dẫn tương đối để không lộ profile máy.</p></details>
    </>}
  </div>
}

function ToolsView({ tools }: { tools: any[] }) {
  return <div><div className="page-intro"><div><span className="eyebrow accent">TOOLKIT</span><h2>Dùng công cụ<br /><em>đúng lúc.</em></h2></div><p>Công cụ không thay thế tư duy. Mỗi tool ở đây gắn với một tình huống cụ thể trong hành trình học.</p></div><div className="tools-grid">{tools.map((tool) => <article className="tool-card" key={tool.slug}><div className="tool-symbol">{tool.name.slice(0, 1)}</div><div><span className="eyebrow">{tool.category}</span><h3>{tool.name}</h3><p>{tool.when_vi}</p><strong>Cài đặt</strong><p>{tool.install_vi}</p><strong>Cách dùng</strong><p>{tool.how_vi}</p><strong>Không nên dùng khi</strong><p>{tool.when_not_vi}</p><strong>Khi gặp lỗi</strong><p>{tool.error_vi}</p><strong>Kết hợp với</strong><p>{tool.combine_vi}</p><strong>Rủi ro</strong><p>{tool.risks_vi}</p><div className="command-list">{tool.commands.map((command: string) => <code key={command}>{command}</code>)}</div></div></article>)}</div></div>
}

function ResourcesView({ resources, language }: { resources: ReferenceResource[]; language: 'vi' | 'en' }) {
  const vi = language === 'vi'
  const [query, setQuery] = useState(() => typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('q') ?? '')
  const [phase, setPhase] = useState(() => typeof window === 'undefined' ? 'all' : new URLSearchParams(window.location.search).get('phase') ?? 'all')
  const [type, setType] = useState(() => typeof window === 'undefined' ? 'all' : new URLSearchParams(window.location.search).get('type') ?? 'all')
  useEffect(() => {
    const restore = () => {
      const params = new URLSearchParams(window.location.search)
      setQuery(params.get('q') ?? '')
      setPhase(params.get('phase') ?? 'all')
      setType(params.get('type') ?? 'all')
    }
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])
  useEffect(() => {
    if (window.location.pathname !== '/resources') return
    const params = new URLSearchParams(window.location.search)
    if (query.trim()) params.set('q', query.trim()); else params.delete('q')
    if (phase !== 'all') params.set('phase', phase); else params.delete('phase')
    if (type !== 'all') params.set('type', type); else params.delete('type')
    const search = params.toString()
    const nextUrl = `/resources${search ? `?${search}` : ''}`
    if (`${window.location.pathname}${window.location.search}` !== nextUrl) window.history.replaceState(window.history.state, '', nextUrl)
  }, [query, phase, type])
  const visible = resources.filter((resource) => {
    const haystack = `${resource.title_vi} ${resource.title_en} ${resource.provider} ${resource.description_vi} ${resource.description_en}`.toLowerCase()
    return (!query.trim() || haystack.includes(query.trim().toLowerCase())) && (phase === 'all' || resource.phase_ids.includes(phase)) && (type === 'all' || resource.type === type)
  })
  const types = Array.from(new Set(resources.map((resource) => resource.type)))
  const phaseLabels: Record<string, string> = {
    'phase-00': 'Phase 0 · Onboarding',
    'phase-01': 'Phase 1 · Python & Software Engineering',
    'phase-02': 'Phase 2 · Toán & Machine Learning',
    'phase-03': 'Phase 3 · Classical Machine Learning',
    'phase-04': 'Phase 4 · Deep Learning với PyTorch',
    'phase-05': 'Phase 5 · Deployment & MLOps',
    'phase-06': 'Phase 6 · NLP, LLM & RAG',
    'phase-07': 'Phase 7 · Capstone & Career',
    'phase-08': 'GenAI 1 · Software Engineering',
    'phase-09': 'GenAI 2 · ML Fundamentals',
    'phase-10': 'GenAI 3 · Deep Learning & Transformer',
    'phase-11': 'GenAI 4 · LLM Application Engineering',
    'phase-12': 'GenAI 5 · RAG Foundations',
    'phase-13': 'GenAI 6 · Advanced RAG',
    'phase-14': 'GenAI 7 · Tool Calling',
    'phase-15': 'GenAI 8 · AI Agents',
    'phase-16': 'GenAI 9 · MCP',
    'phase-17': 'GenAI 10 · Evaluation',
    'phase-18': 'GenAI 11 · Observability',
    'phase-19': 'GenAI 12 · Production Engineering',
    'phase-20': 'GenAI 13 · Fine-tuning',
    'phase-21': 'GenAI 14 · Local LLM',
    'phase-22': 'GenAI 15 · AI System Design',
  }
  return <div><div className="page-intro resources-intro"><div><span className="eyebrow accent">REFERENCE LIBRARY</span><h2>Học từ nguồn<br /><em>có thể kiểm chứng.</em></h2></div><p>{vi ? 'Sách, course, documentation và repository được gắn với phase. Đọc theo mục tiêu của lesson, ghi lại điều đã kiểm chứng rồi quay về làm bài.' : 'Books, courses, documentation and repositories mapped to each phase. Read with a lesson goal, verify what you learn, then return to practice.'}</p></div><section className="resource-library-card"><div className="resource-library-header"><div><span className="eyebrow">{resources.length} SOURCES</span><h3>{vi ? 'Thư viện tài liệu AI Engineer' : 'AI Engineer reference library'}</h3></div><p>{vi ? 'Nguồn community như AI Engineering from Scratch được giữ lại để bạn tham khảo; nguồn official giúp kiểm tra API và chuẩn kỹ thuật.' : 'Community references such as AI Engineering from Scratch sit alongside official sources for API and engineering verification.'}</p></div><div className="filter-bar resource-filters"><label className="sr-only" htmlFor="resource-query">{vi ? 'Tìm tài liệu' : 'Search resources'}</label><input id="resource-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={vi ? 'Tìm theo tên, tác giả, chủ đề...' : 'Search by title, provider or topic...'} /><label className="sr-only" htmlFor="resource-phase">{vi ? 'Lọc theo phase' : 'Filter by phase'}</label><select id="resource-phase" aria-label={vi ? 'Lọc theo phase' : 'Filter by phase'} value={phase} onChange={(event) => setPhase(event.target.value)}><option value="all">{vi ? 'Tất cả phase' : 'All phases'}</option>{Object.entries(phaseLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><label className="sr-only" htmlFor="resource-type">{vi ? 'Lọc theo loại' : 'Filter by type'}</label><select id="resource-type" aria-label={vi ? 'Lọc theo loại' : 'Filter by type'} value={type} onChange={(event) => setType(event.target.value)}><option value="all">{vi ? 'Mọi loại nguồn' : 'All types'}</option>{types.map((item) => <option key={item} value={item}>{item}</option>)}</select><span className="muted" role="status">{visible.length}/{resources.length}</span></div><div className="resource-grid">{visible.map((resource) => <article className={`resource-card ${resource.featured ? 'featured' : ''}`} key={resource.slug}><div className="resource-card-top"><span className="tag">{resource.type}</span><span className="resource-language">{resource.language.toUpperCase()}</span></div><h4>{vi ? resource.title_vi : resource.title_en}</h4><p className="resource-provider">{resource.provider} {resource.official ? '· Official' : '· Community reference'}</p><p>{vi ? resource.description_vi : resource.description_en}</p><div className="resource-phases">{resource.phase_ids.map((phaseId) => <span key={phaseId}>{phaseLabels[phaseId]?.split(' · ')[0] ?? phaseId}</span>)}</div><div className="resource-how"><strong>{vi ? 'Cách dùng trong lộ trình' : 'How to use it'}</strong><p>{vi ? resource.how_to_use_vi : resource.how_to_use_en}</p></div>{resource.url ? <a className="resource-link" href={resource.url} target="_blank" rel="noreferrer">{vi ? 'Mở nguồn tham khảo' : 'Open reference'} <span>↗</span></a> : <p className="resource-internal-note">{vi ? 'Nội dung này có sẵn trong app.' : 'This content is available in the app.'}</p>}</article>)}</div>{visible.length === 0 && <EmptyState title={vi ? 'Không tìm thấy tài liệu' : 'No resources found'} description={vi ? 'Thử từ khóa khác hoặc bỏ bộ lọc phase.' : 'Try another keyword or clear the phase filter.'} />}</section></div>
}
function SettingsView({ settings, hosted, onSave }: { settings: AppSettings; hosted: boolean; onSave: (next: Partial<AppSettings>) => Promise<void> }) {
  const vi = settings.language === 'vi'
  const [goal, setGoal] = useState(String(settings.weekly_goal_minutes))
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const submitting = useRef(false)
  const save = async (next: Partial<AppSettings>): Promise<boolean> => {
    if (submitting.current) return false
    submitting.current = true
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      await onSave(next)
      setSaved(true)
      return true
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : (vi ? 'Không lưu được cài đặt.' : 'Could not save settings.'))
      return false
    } finally {
      submitting.current = false
      setSaving(false)
    }
  }
  const saveGoal = async () => {
    const value = Number(goal)
    if (!Number.isInteger(value) || value < 60 || value > 10080) {
      setError(vi ? 'Mục tiêu tuần phải là số nguyên từ 60 đến 10080 phút.' : 'Weekly goal must be a whole number from 60 to 10080 minutes.')
      return
    }
    await save({ weekly_goal_minutes: value })
  }
  return <div>
    <div className="page-intro"><div><span className="eyebrow accent">PERSONAL SETTINGS</span><h2>{vi ? 'Thiết kế nhịp học bền vững.' : 'Build a sustainable learning rhythm.'}</h2></div><p>{hosted ? (vi ? 'Cài đặt được lưu riêng theo tài khoản web.' : 'Settings are saved privately to your web account.') : (vi ? 'Cài đặt được lưu trong SQLite local.' : 'Settings are saved in local SQLite.')}</p></div>
    <section className="section-card settings-card">
      <label>{vi ? 'Ngôn ngữ giao diện' : 'Interface language'}<select disabled={saving} aria-label={vi ? 'Ngôn ngữ giao diện' : 'Interface language'} value={settings.language} onChange={(event) => void save({ language: event.target.value as AppSettings['language'] })}><option value="vi">Tiếng Việt + English terms</option><option value="en">English</option></select></label>
      <label>{vi ? 'Mục tiêu nghề nghiệp' : 'Career goal'}<select disabled={saving} aria-label={vi ? 'Mục tiêu nghề nghiệp' : 'Career goal'} value={settings.target_role} onChange={(event) => void save({ target_role: event.target.value as AppSettings['target_role'] })}><option value="internship">{vi ? 'Thực tập AI/ML Engineer' : 'AI/ML engineering internship'}</option><option value="junior">Junior AI Engineer</option><option value="career_switch">{vi ? 'Chuyển hướng sang AI Engineer' : 'Switching to AI engineering'}</option></select></label>
      <label>{vi ? 'Nền tảng hiện tại' : 'Current experience'}<select disabled={saving} aria-label={vi ? 'Nền tảng hiện tại' : 'Current experience'} value={settings.experience_level} onChange={(event) => void save({ experience_level: event.target.value as AppSettings['experience_level'] })}><option value="beginner">{vi ? 'Mới bắt đầu' : 'Beginner'}</option><option value="intermediate">{vi ? 'Đã có nền tảng' : 'Some experience'}</option><option value="advanced">{vi ? 'Đang cần portfolio sâu' : 'Building an advanced portfolio'}</option></select></label>
      <label>{vi ? 'Learning track' : 'Study rhythm'}<select disabled={saving} aria-label={vi ? 'Learning track' : 'Study rhythm'} value={settings.track} onChange={(event) => void save({ track: event.target.value as AppSettings['track'] })}><option value="standard">{vi ? 'Nhịp đều đặn' : 'Steady pace'}</option><option value="accelerated">{vi ? 'Nhịp tập trung' : 'Focused pace'}</option></select></label>
      <label>{vi ? 'Mục tiêu mỗi tuần (phút)' : 'Weekly goal (minutes)'}<input disabled={saving} aria-label={vi ? 'Mục tiêu mỗi tuần, tính bằng phút' : 'Weekly goal in minutes'} type="number" min="60" max="10080" value={goal} onChange={(event) => { setGoal(event.target.value); setSaved(false) }} /></label>
      <label className="setting-check"><input disabled={saving} type="checkbox" checked={settings.show_completed_lessons} onChange={(event) => void save({ show_completed_lessons: event.target.checked })} /> {vi ? 'Hiển thị lesson đã hoàn thành trên roadmap' : 'Show completed lessons on the roadmap'}</label>
      <label className="setting-check"><input disabled={saving} type="checkbox" checked={settings.onboarding_complete} onChange={(event) => void save({ onboarding_complete: event.target.checked })} /> {vi ? 'Đã hoàn thành onboarding và baseline assessment' : 'Completed onboarding and baseline assessment'}</label>
      <button className="primary-button" disabled={saving} aria-busy={saving} onClick={() => void saveGoal()}>{saving ? (vi ? 'Đang lưu…' : 'Saving…') : (vi ? 'Lưu mục tiêu tuần' : 'Save weekly goal')}</button>
      {error && <p className="warning-note" role="alert">{error}</p>}
      {saved && <p className="success-note" role="status">{vi ? 'Đã lưu cài đặt.' : 'Settings saved.'}</p>}
    </section>
    <BackupSettings hosted={hosted} language={settings.language} />
  </div>
}

function BackupSettings({ hosted, language }: { hosted: boolean; language: 'vi' | 'en' }) {
  const [backupText, setBackupText] = useState('')
  const [preview, setPreview] = useState<{ valid: boolean; errors: string[]; counts: Record<string, number>; warnings: string[]; replaces: Record<string, number> } | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const vi = language === 'vi'
  if (hosted) return <CloudDataSettings language={language} />
  const exportBackup = async () => {
    setBusy(true); setError(''); setMessage('')
    try {
      const result = await api.exportBackup()
      const text = JSON.stringify(result.payload, null, 2)
      setBackupText(text)
      const link = document.createElement('a')
      link.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
      link.download = 'journey-ai-engineer-backup.json'
      link.click()
      URL.revokeObjectURL(link.href)
      setMessage(vi ? `Đã tạo backup JSON và bản mô tả Markdown tại ${result.json_path}` : `Created a JSON backup and Markdown manifest at ${result.json_path}`)
    } catch (cause) { setError(cause instanceof Error ? cause.message : (vi ? 'Không xuất được bản sao lưu.' : 'Could not export the backup.')) } finally { setBusy(false) }
  }
  const previewBackup = async () => {
    setError(''); setMessage('')
    try {
      const parsed = JSON.parse(backupText) as BackupPayload
      setPreview(await api.previewBackup(parsed))
    } catch (cause) { setPreview(null); setError(cause instanceof Error ? `${vi ? 'Không thể kiểm tra bản sao lưu' : 'Could not validate backup'}: ${cause.message}` : (vi ? 'Không thể kiểm tra bản sao lưu.' : 'Could not validate backup.')) }
  }
  const importBackup = async () => {
    if (!preview?.valid || !window.confirm(vi ? 'Nhập sẽ thay thế tiến độ, lịch ôn, lịch sử ôn, ghi chú, phiên học và cài đặt. Journal trùng tên sẽ bị ghi đè. Ứng dụng sẽ tạo bản sao an toàn trước. Tiếp tục?' : 'Import replaces progress, review schedules and history, notes, study sessions and settings. Journal files with matching names are overwritten. A safety backup is created first. Continue?')) return
    setBusy(true); setError(''); setMessage('')
    try {
      const parsed = JSON.parse(backupText) as BackupPayload
      const result = await api.importBackup(parsed)
      setMessage(vi ? `Đã nhập. Bản sao an toàn: ${result.safety_backup_json}` : `Imported. Safety backup: ${result.safety_backup_json}`)
      setPreview(null)
    } catch (cause) { setError(cause instanceof Error ? cause.message : (vi ? 'Không nhập được bản sao lưu.' : 'Could not import the backup.')) } finally { setBusy(false) }
  }
  const tableLabel: Record<string, string> = vi
    ? { progress: 'tiến độ bài học', review_state: 'lịch ôn', review_history: 'lượt ôn', notes: 'ghi chú', study_sessions: 'phiên học' }
    : { progress: 'lesson progress records', review_state: 'review schedules', review_history: 'review history records', notes: 'notes', study_sessions: 'study sessions' }
  return <section className="section-card backup-card">
    <div className="section-heading"><div><span className="eyebrow">{vi ? 'SAO LƯU CÓ THỂ CHUYỂN MÁY' : 'PORTABLE BACKUP'}</span><h3>{vi ? 'Sao lưu và khôi phục' : 'Backup and restore'}</h3></div><span className="tag">JSON + Markdown</span></div>
    <p className="muted">{vi ? 'Chuyển tiến độ, lịch ôn, ghi chú, journal và cài đặt sang máy khác. File database và workspace bài tập không nằm trong bản sao lưu. Hãy kiểm tra nội dung riêng tư trước khi chia sẻ file.' : 'Move progress, review schedules, notes, journals and settings to another computer. The database file and exercise workspaces are excluded. Check for private content before sharing the file.'}</p>
    <div className="backup-actions">
      <button className="secondary-button" disabled={busy} onClick={() => void exportBackup()}>{busy ? (vi ? 'Đang xử lý…' : 'Working…') : (vi ? 'Xuất bản sao lưu' : 'Export backup')}</button>
      <button className="text-button" disabled={!backupText || busy} onClick={() => void previewBackup()}>{vi ? 'Kiểm tra bản sao lưu' : 'Preview backup'}</button>
      <button className="primary-button" disabled={!preview?.valid || busy} onClick={() => void importBackup()}>{vi ? 'Nhập bản đã kiểm tra' : 'Import reviewed backup'}</button>
    </div>
    <textarea className="backup-editor" aria-label={vi ? 'Nội dung backup JSON' : 'Backup JSON contents'} value={backupText} onChange={(event) => { setBackupText(event.target.value); setPreview(null) }} placeholder={vi ? 'Dán nội dung file journey-ai-engineer-backup.json vào đây để kiểm tra…' : 'Paste the contents of journey-ai-engineer-backup.json here to preview…'} />
    {preview && <p className={preview.valid ? 'success-note' : 'warning-note'} role="status">{preview.valid ? `${vi ? 'Bản sao lưu hợp lệ' : 'Valid backup'} · ${preview.counts.progress ?? 0} ${tableLabel.progress}, ${preview.counts.review_state ?? 0} ${tableLabel.review_state}, ${preview.counts.notes ?? 0} ${tableLabel.notes}.` : preview.errors.join(' ')}</p>}
    {preview && <div role="status"><p>{vi ? 'Dữ liệu hiện tại sẽ bị thay thế: ' : 'Current data to replace: '}{Object.entries(preview.replaces).map(([key, count]) => `${count} ${tableLabel[key] ?? key}`).join(', ')}. {vi ? 'Journal trùng tên sẽ bị ghi đè.' : 'Journal files with matching names will be overwritten.'}</p>{preview.warnings.map((warning) => <p className="warning-note" key={warning}>{warning}</p>)}</div>}
    {message && <p className="success-note" role="status">{message}</p>}
    {error && <p className="warning-note" role="alert">{error}</p>}
  </section>
}

function EmptyState({ title, description }: { title: string; description: string }) { return <div className="empty-state"><div className="detail-mark">✦</div><h3>{title}</h3><p>{description}</p></div> }
export default App
