import routes from '../../content/learning_routes.json'

type Roadmap = {
  phases: Array<{ slug: string; modules: Array<{ lessons: Array<{ slug: string }> }> }>
}

export type LessonContinuation = {
  route: { id: string; title_vi: string; title_en: string }
  scope: 'core' | 'specialization'
  nextLessons: string[]
  end: boolean
}

export function learningRouteFromSearch(search: string) {
  const id = new URLSearchParams(search).get('route')
  return routes.routes.find((route) => route.id === id) ?? null
}

export function roadmapRoutePath(routeId: string | null) {
  const route = routes.routes.find((item) => item.id === routeId)
  return route ? `/roadmap?route=${encodeURIComponent(route.id)}` : '/roadmap'
}

/** Use the same phase order as the selected roadmap, independent of catalog order. */
export function lessonRouteContinuation(
  roadmap: Roadmap | null,
  lessonSlug: string,
  routeId: string | null,
): LessonContinuation | undefined {
  const route = routes.routes.find((item) => item.id === routeId)
  if (!route || !roadmap) return undefined
  const phase = roadmap.phases.find((item) => item.modules.some((module) =>
    module.lessons.some((lesson) => lesson.slug === lessonSlug)))
  if (!phase) return undefined

  const core = route.phase_ids.includes(phase.slug)
  if (!core && !route.optional_phase_ids.includes(phase.slug)) return undefined
  // Choosing one specialization must not silently enroll the learner in all of them.
  const phaseIds = core ? route.phase_ids : [phase.slug]
  const phases = phaseIds.map((id) => roadmap.phases.find((item) => item.slug === id))
  // Incomplete data cannot establish that the learner has reached the route's end.
  if (phases.some((item) => !item || !item.modules.some((module) => module.lessons.length))) {
    return undefined
  }
  const lessonSlugs = phases.flatMap((item) =>
    item!.modules.flatMap((module) => module.lessons.map((lesson) => lesson.slug)))
  const index = lessonSlugs.indexOf(lessonSlug)
  if (index < 0) return undefined
  const nextLessons = lessonSlugs.slice(index + 1, index + 3)
  return { route, scope: core ? 'core' : 'specialization', nextLessons, end: nextLessons.length === 0 }
}
