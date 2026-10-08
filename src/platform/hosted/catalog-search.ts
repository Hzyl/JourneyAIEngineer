import type { SearchResult } from '../../api'
import type { hostedCatalog } from './catalog'

export type SearchOptions = { type?: string; phase?: string; status?: string; limit?: number }
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/đ/g, 'd')
const types = ['all', 'phases', 'modules', 'lessons', 'resources', 'exercises']
const statuses = ['all', 'not_started', 'in_progress', 'blocked', 'completed', 'needs_review', 'available']

export function searchCatalog(catalog: typeof hostedCatalog, query: string, options: SearchOptions = {},
  progress: ReadonlyMap<string, string> = new Map()) {
  const q = query.trim()
  const type = options.type?.trim().toLowerCase() || 'all'
  const phase = options.phase?.trim().toLowerCase() || 'all'
  const status = options.status?.trim().toLowerCase() || 'all'
  const limit = options.limit ?? 50
  if (q.length > 120 || phase.length > 80 || !types.includes(type) || !statuses.includes(status)
    || !Number.isInteger(limit) || limit < 1 || limit > 100) throw new Error('Invalid search filters.')
  const needle = normalize(q)
  const results: SearchResult[] = []
  const add = (item: SearchResult, text: string[], itemStatus = 'available') => {
    if (type !== 'all' && type !== `${item.type}s`) return
    if (status !== 'all' && status !== itemStatus) return
    const phases = Array.isArray(item.phase) ? item.phase : [item.phase]
    if (phase !== 'all' && !phases.includes(phase)) return
    if (!normalize([item.id, item.title, item.title_en ?? '', ...text].join(' ')).includes(needle)) return
    results.push(item)
  }
  for (const phase of catalog.phases) {
    add({ type: 'phase', id: phase.slug, slug: phase.slug, title: phase.title_vi,
      title_en: phase.title_en, phase: phase.slug }, [phase.summary_vi, phase.summary_en])
    for (const module of phase.modules) {
      add({ type: 'module', id: `${phase.slug}-${module.slug}`, slug: module.slug,
        title: module.title_vi, title_en: module.title_en, phase: phase.slug }, [phase.slug])
    }
  }
  for (const lesson of catalog.lessons) {
    add({ type: 'lesson', id: lesson.lesson_id, slug: lesson.lesson_id, title: lesson.title_vi,
      title_en: lesson.title_en, phase: lesson.phase_id },
    [lesson.summary_vi, lesson.summary_en, ...lesson.key_terms], progress.get(lesson.lesson_id) ?? 'not_started')
  }
  for (const resource of catalog.resources) {
    add({ type: 'resource', id: resource.slug, slug: resource.slug, title: resource.title_vi,
      title_en: resource.title_en, phase: resource.phase_ids, url: resource.url },
    [resource.provider, resource.description_vi, resource.description_en, resource.type])
  }
  for (const exercise of catalog.exercises) {
    add({ type: 'exercise', id: exercise.slug, slug: exercise.slug, title: exercise.title_vi,
      title_en: exercise.title_en, phase: exercise.phase_id }, [exercise.description_vi, exercise.description_en])
  }
  const order: Record<string, number> = { phase: 0, module: 1, lesson: 2, resource: 3, exercise: 4 }
  results.sort((a, b) => order[a.type] - order[b.type] || a.id.localeCompare(b.id))
  return { query: q, type, phase, status, results: results.slice(0, limit),
    count: Math.min(results.length, limit), total: results.length }
}
