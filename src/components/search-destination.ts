import type { SearchResult } from '../api'

export function searchDestination(result: SearchResult, language: 'vi' | 'en') {
  const slug = result.slug || result.id
  const title = language === 'en' ? result.title_en || result.title : result.title
  if (result.type === 'lesson') return `/lesson/${encodeURIComponent(slug)}`
  if (result.type === 'exercise') return `/exercises?${new URLSearchParams({ exercise: slug })}`
  if (result.type === 'resource') return `/resources?${new URLSearchParams({ q: title })}`
  const params = new URLSearchParams()
  const phase = Array.isArray(result.phase) ? result.phase[0] : result.phase
  if (phase) params.set('phase', phase)
  if (result.type === 'module') params.set('q', title)
  return `/roadmap${params.size ? `?${params}` : ''}`
}
