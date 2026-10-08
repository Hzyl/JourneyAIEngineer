import { appLocation, appPath, type View } from './app-location'
import { useLesson } from './components/useLesson'
import { useWorkspaceData } from './components/useWorkspaceData'
import { WorkspaceNotice } from './components/WorkspaceNotice'
import { MissingPage } from './components/MissingPage'
import './components/app-recovery.css'
import { AppNavigation } from './components/AppNavigation'
import { useMobileNavigation } from './components/useMobileNavigation'
import { SecurityLabView } from './components/SecurityLabView'
import { PortfolioBoard } from './components/PortfolioBoard'
import { SettingsView } from './components/SettingsView'
import { GlobalSearch } from './components/GlobalSearch'
import { searchDestination } from './components/search-destination'
import { CommunityView } from './components/CommunityView'
import { LessonPage } from './components/LessonPage'
import { ToolsView } from './components/ToolsView'
import { ResourcesView } from './components/ResourcesView'
import { ExercisesView } from './components/ExercisesView'
import { JournalView } from './components/JournalView'
/* oxlint-disable react(set-state-in-effect) */
import { useEffect, useRef, useState } from 'react'
import { type SearchResult } from './api'
import { learningClient as api } from './platform/learning-client'
import { runtimeConfig } from './platform/runtime-config'
import { useAuth } from './auth/AuthProvider'
import { SignOutButton } from './auth/SignOutButton'
import { TodayView } from './components/TodayView'
import { ReviewView } from './components/ReviewView'
import { RoadmapView } from './components/RoadmapView'
import { ThemeToggle } from './theme/ThemeToggle'

const locationState = () => appLocation(window.location.pathname, runtimeConfig.mode === 'hosted')
const baseNavItems: Array<{ id: View; label: string; icon: string; hint: string }> = [
  { id: 'dashboard', label: 'Tổng quan', icon: '◐', hint: 'Nhịp học hôm nay' },
  { id: 'roadmap', label: 'Lộ trình', icon: '◎', hint: '3 hướng học · tự chọn nhịp' },
  { id: 'review', label: 'Ôn tập', icon: '↻', hint: 'Nhớ lâu hơn' },
  { id: 'exercises', label: 'Bài tập', icon: '⌘', hint: 'Mở bằng VS Code' },
  { id: 'tools', label: 'Công cụ', icon: '◇', hint: 'Dùng đúng lúc' },
  { id: 'security', label: 'Security Lab', icon: '⌁', hint: 'Kiểm tra source thụ động' },
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
  const {
    dashboard, roadmap, reviews, exercises, tools, resources, settings, loaded, loading,
    gitPublishAvailable, failed: workspaceFailed, settingsSaving, languageFailed,
    refresh, reload, saveSettings, changeLanguage, removeReview,
  } = useWorkspaceData()
  const vi = settings.language === 'vi'
  useEffect(() => { document.documentElement.lang = settings.language }, [settings.language])
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
  const lessonReturn = useRef<{ view: View; url: string }>({ view: 'roadmap', url: '/roadmap' })
  const { lesson, loading: lessonLoading, error: lessonFailed, reload: reloadLesson } =
    useLesson(selectedLesson, !hosted || auth.state === 'signed_in')
  const {
    mobile: mobileNav, active: mobileNavOpen, panel: navPanelRef, trigger: navTriggerRef,
    main: mainRef, show: openNavigation, close: closeNavigation,
  } = useMobileNavigation()

  const navigate = (nextView: View) => {
    setView(nextView)
    if (nextView !== 'lesson') setSelectedLesson(null)
    closeNavigation(true)
  }

  useEffect(() => {
    const onPopState = () => {
      const next = locationState()
      closeNavigation(true)
      if (next.view === view && next.lesson === selectedLesson) return
      setView(next.view)
      setSelectedLesson(next.lesson)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [closeNavigation, view, selectedLesson])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const nextPath = appPath(view, selectedLesson)
    if (nextPath && window.location.pathname !== nextPath) window.history.pushState({ view, lesson: selectedLesson }, '', nextPath)
  }, [view, selectedLesson])

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
  const openLesson = (slug: string) => {
    if (view !== 'lesson') {
      lessonReturn.current = { view, url: window.location.pathname + window.location.search + window.location.hash }
    }
    setSelectedLesson(slug)
    setView('lesson')
    closeNavigation(true)
  }
  const closeLesson = () => {
    const destination = lessonReturn.current
    window.history.pushState({ view: destination.view }, '', destination.url)
    navigate(destination.view)
  }
  const noticeKind = lessonFailed ? 'lesson' : languageFailed ? 'language' : workspaceFailed ? 'load' : null
  const retryNotice = () => {
    if (noticeKind === 'lesson') reloadLesson()
    else if (noticeKind === 'language') void changeLanguage()
    else void reload()
  }
  const reloadPage = () => {
    void reload()
    if (selectedLesson) reloadLesson()
  }
  const updateProgress = async (slug: string, status: string, minutes = 0) => {
    await api.updateProgress(slug, status, minutes)
    await refresh()
    reloadLesson()
  }

  const lessonTitleMap: Record<string, string> = {}
  roadmap?.phases?.forEach((phase: any) => phase.modules?.forEach((module: any) => module.lessons?.forEach((item: any) => { lessonTitleMap[item.slug] = settings.language === 'vi' ? item.title_vi : item.title_en })))
  const selectSearchResult = (result: SearchResult) => {
    if (result.type === 'lesson') {
      openLesson(result.slug || result.id)
      return
    }
    window.history.pushState({}, '', searchDestination(result, settings.language))
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
  return <div className="app-shell">
    <a className="skip-link" href="#main-content" inert={mobileNavOpen}>
      {vi ? 'Bỏ qua đến nội dung chính' : 'Skip to main content'}
    </a>
    <AppNavigation items={navItems} view={view} hosted={hosted} language={settings.language}
      mobile={mobileNav} open={mobileNavOpen} panel={navPanelRef}
      onClose={() => closeNavigation()} onSelect={(id) => navigate(id as View)} />
    <main ref={mainRef} tabIndex={-1} inert={mobileNavOpen} className="main-area" id="main-content"
      aria-busy={loading || lessonLoading}>
      <header className="topbar">
        <button className="mobile-nav-toggle" type="button"
          aria-label={vi ? 'Mở menu điều hướng' : 'Open navigation'} ref={navTriggerRef}
          aria-controls="app-navigation" aria-haspopup="dialog" aria-expanded={mobileNavOpen} onClick={openNavigation}>
          <span aria-hidden="true">☰</span><span className="sr-only">{vi ? 'Mở menu' : 'Open menu'}</span>
        </button>
        <div>
          <span className="eyebrow">PERSONAL LEARNING OS</span>
          {view === 'lesson' ? <div className="topbar-title">{vi ? 'Bài học' : 'Lesson workspace'}</div>
            : <h1>{view === 'dashboard' ? (vi ? 'Hôm nay học gì?' : 'What will you learn today?')
              : view === 'missing' ? (vi ? 'Không tìm thấy trang' : 'Page not found')
                : navItems.find((item) => item.id === view)?.label}</h1>}
        </div>
        <div className="topbar-actions">
          <ThemeToggle language={settings.language} />
          <GlobalSearch language={settings.language} onSelect={selectSearchResult} />
          <button className="language-chip" disabled={!loaded || settingsSaving} aria-busy={settingsSaving}
            onClick={() => void changeLanguage()}
            aria-label={settingsSaving ? (vi ? 'Đang lưu cài đặt' : 'Saving settings')
              : (vi ? 'Đổi ngôn ngữ' : 'Change language')}>
            {settingsSaving ? (vi ? 'Đang lưu…' : 'Saving…')
              : <>{vi ? 'VI' : 'EN'} <i>·</i> {vi ? 'EN' : 'VI'}</>}
          </button>
          {hosted && <SignOutButton language={settings.language} />}
          <button className="refresh-button" onClick={reloadPage} disabled={loading || lessonLoading}
            aria-busy={loading || lessonLoading}
            aria-label={loading || lessonLoading ? (vi ? 'Đang làm mới dữ liệu' : 'Refreshing data')
              : (vi ? 'Làm mới dữ liệu' : 'Refresh data')}>↻</button>
        </div>
      </header>
      <WorkspaceNotice kind={noticeKind} language={settings.language} previous={loaded}
        pending={loading || lessonLoading || settingsSaving} onRetry={retryNotice} />
      {loading && !loaded ? <LoadingState
        message={vi ? 'Đang nạp chương trình học…' : 'Loading your learning workspace…'} />
        : !loaded && workspaceFailed && view !== 'lesson' && view !== 'missing'
          ? <p className="workspace-unavailable">{vi ? 'Nội dung sẽ hiển thị khi tải dữ liệu thành công.'
            : 'Your content will appear once the data loads successfully.'}</p>
          : <div className="page-content">
            {view === 'missing' && <MissingPage language={settings.language} onRoadmap={() => navigate('roadmap')} />}
            {view === 'dashboard' && <TodayView dashboard={dashboard} language={settings.language}
              lessonTitle={dashboard?.current_lesson ? lessonTitleMap[dashboard.current_lesson.slug] : undefined}
              onOpenLesson={openLesson} onNavigate={navigate} onRecordSession={async (minutes, note) => {
                await api.createSession({ minutes, note })
                await refresh()
              }} />}
            {view === 'roadmap' && <RoadmapView roadmap={roadmap} language={settings.language}
              showCompletedLessons={settings.show_completed_lessons} onOpenLesson={openLesson}>
              {roadmap && <PortfolioBoard program={roadmap.program} language={settings.language} />}
            </RoadmapView>}
            {view === 'lesson' && <LessonPage lesson={lesson} lessonLoading={lessonLoading} language={settings.language}
              onBack={closeLesson} onProgress={updateProgress} onOpenLesson={openLesson} nextLessonTitles={lessonTitleMap}
              onOpenExercise={(slug) => selectSearchResult({ type: 'exercise', id: slug, title: slug })} />}
            {view === 'review' && <ReviewView language={settings.language} reviews={reviews}
              onAnswer={async (id, rating, thoughtSeconds, answerText) => {
                await api.answerReview(id, rating, thoughtSeconds, answerText)
                removeReview(id)
                await refresh()
              }} onOpenLesson={openLesson} />}
            {view === 'exercises' && <ExercisesView language={settings.language} exercises={exercises}
              gitPublishAvailable={gitPublishAvailable} hosted={hosted} onRefresh={refresh} />}
            {view === 'tools' && <ToolsView tools={tools} language={settings.language} />}
            {view === 'security' && !hosted && <SecurityLabView language={settings.language} />}
            {view === 'resources' && <ResourcesView resources={resources} language={settings.language} />}
            {view === 'community' && <CommunityView language={settings.language} hosted={hosted}
              onOpenLesson={openLesson} onOpenRoadmap={() => navigate('roadmap')} />}
            {view === 'settings' && <SettingsView settings={settings} hosted={hosted} externalSaving={settingsSaving}
              onRestored={refresh} onSave={saveSettings} />}
            {view === 'journal' && <JournalView hosted={hosted} language={settings.language}
              onExportContext={(question) => api.exportContext({ lesson_slug: lesson?.slug, question })} />}
          </div>}
    </main>
  </div>
}

function LoadingState({ message = 'Đang nạp chương trình học...', compact = false }: { message?: string; compact?: boolean }) { return <div className={`loading-state ${compact ? 'compact' : ''}`} role="status" aria-live="polite"><div className="loading-orb" aria-hidden="true" /><p>{message}</p></div> }

export default App
