export type View = 'dashboard' | 'roadmap' | 'lesson' | 'review' | 'exercises' | 'tools'
  | 'security' | 'resources' | 'community' | 'journal' | 'settings' | 'missing'

const viewIds = new Set<View>(['dashboard', 'roadmap', 'review', 'exercises', 'tools',
  'security', 'resources', 'community', 'journal', 'settings'])

export function appLocation(pathname: string, hosted: boolean): { view: View; lesson: string | null } {
  const parts = pathname.split('/').filter(Boolean)
  if (!parts.length) return { view: 'dashboard', lesson: null }
  if (parts.length === 2 && parts[0] === 'lesson') {
    try {
      const lesson = decodeURIComponent(parts[1])
      if (/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(lesson)) return { view: 'lesson', lesson }
    } catch { /* Malformed URI text is an unavailable route, not a render exception. */ }
  }
  const candidate = parts[0] as View
  if (parts.length === 1 && viewIds.has(candidate) && !(hosted && candidate === 'security')) {
    return { view: candidate, lesson: null }
  }
  return { view: 'missing', lesson: null }
}

export function appPath(view: View, lesson: string | null): string | null {
  if (view === 'missing') return null
  if (view === 'lesson') return lesson ? `/lesson/${encodeURIComponent(lesson)}` : null
  return view === 'dashboard' ? '/' : `/${view}`
}
