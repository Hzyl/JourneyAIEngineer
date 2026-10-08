export function authReturnPath(): string {
  const value = new URLSearchParams(window.location.search).get('next') ?? '/'
  try {
    const url = new URL(value, window.location.origin)
    const allowed = ['/', '/roadmap', '/exercises'].includes(url.pathname) || url.pathname.startsWith('/lesson/')
    return url.origin === window.location.origin && allowed ? url.pathname + url.search + url.hash : '/'
  } catch { return '/' }
}

export function isAuthEntry(): boolean {
  return window.location.pathname.startsWith('/auth/') && window.location.pathname !== '/auth/callback'
}

export function publicPage(): string {
  const path = window.location.pathname
  if (isAuthEntry()) return 'auth'
  if (path.startsWith('/lesson/')) {
    try { return decodeURIComponent(path.slice(8)) }
    catch { return 'missing' }
  }
  return path === '/roadmap' ? 'roadmap' : path === '/exercises' ? 'exercises' : 'home'
}
