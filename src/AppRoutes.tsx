import { Component, lazy, Suspense, useEffect, useSyncExternalStore, type ReactNode } from 'react'
import { useAuth } from './auth/AuthProvider'
import { AuthCallback } from './auth/AuthCallback'
import { SessionRecovery } from './auth/SessionRecovery'
import { runtimeConfig } from './platform/runtime-config'
import { authReturnPath, isAuthEntry } from './public/public-navigation'

const LearningApp = lazy(() => import('./App'))
const PublicExperience = lazy(() => import('./public/PublicExperience').then((module) => ({
  default: module.PublicExperience,
})))

function LoadingScreen() {
  return <main className="empty-state" role="status" aria-live="polite">
    <p>Đang tải… / Loading…</p>
  </main>
}

function subscribeLocation(change: () => void) {
  window.addEventListener('popstate', change)
  return () => window.removeEventListener('popstate', change)
}

function SignedInEntry() {
  const atEntry = useSyncExternalStore(subscribeLocation, isAuthEntry, () => false)
  useEffect(() => {
    if (atEntry) {
      window.history.replaceState({}, '', authReturnPath())
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }, [atEntry])
  return atEntry ? <LoadingScreen /> : <LearningApp />
}

class RouteBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return <main className="empty-state" role="alert">
      <h1>Không tải được giao diện / Could not load this page</h1>
      <p>Kiểm tra kết nối rồi tải lại trang. / Check your connection and reload the page.</p>
      <button className="primary-button" onClick={() => window.location.reload()}>
        Tải lại trang / Reload page
      </button>
    </main>
  }
}

export function AppRoutes() {
  const auth = useAuth()
  const hosted = runtimeConfig.mode === 'hosted'
  const callback = window.location.pathname === '/auth/callback'
  let content: ReactNode
  if (callback) content = <AuthCallback />
  else if (hosted && auth.state === 'loading') content = <LoadingScreen />
  else if (hosted && auth.state === 'error') content = <SessionRecovery />
  else if (hosted && auth.state !== 'signed_in') content = <PublicExperience />
  else content = hosted ? <SignedInEntry key={auth.session?.user.id} /> : <LearningApp key="local" />

  return <RouteBoundary>
    <Suspense fallback={<LoadingScreen />}>{content}</Suspense>
  </RouteBoundary>
}
