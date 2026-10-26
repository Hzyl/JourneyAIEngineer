import overview from '../../content/roadmap_overview.json'
import routes from '../../content/learning_routes.json'

export type RoadmapLesson = {
  slug: string
  title_vi: string
  title_en: string
  status: string
  estimated_minutes: number
}
export type RoadmapPhase = {
  slug: string
  title_vi: string
  title_en: string
  modules: { slug: string; title_vi: string; title_en: string; lessons: RoadmapLesson[] }[]
}
export type RoadmapStage = typeof overview.stages[number]
export type RoadmapSection = { phase: RoadmapPhase; kind: 'main' | 'bridge' | 'extension' | 'review' }
export type RoadmapGroup = { stage: RoadmapStage; sections: RoadmapSection[] }

/** Presentation only: original lesson objects, IDs and progress remain untouched. */
export function groupRoadmap(phases: RoadmapPhase[], routeId?: string): RoadmapGroup[] {
  const route = routes.routes.find((item) => item.id === routeId)
  const allowed = route ? new Set([...route.phase_ids, ...route.optional_phase_ids]) : null
  const byId = new Map(phases.map((phase) => [phase.slug, phase]))
  const groups = overview.stages.map((stage): RoadmapGroup => {
    const sections: RoadmapSection[] = []
    const add = (ids: string[], kind: RoadmapSection['kind']) => {
      for (const id of ids) {
        const phase = byId.get(id)
        if (phase && (!allowed || allowed.has(id))) sections.push({ phase,
          kind: route?.optional_phase_ids.includes(id) ? 'extension' : kind,
        })
      }
    }
    add(stage.phase_ids, stage.track === 'core' ? 'main' : 'extension')
    add(stage.bridge_phase_ids ?? [], 'bridge')
    add(stage.optional_phase_ids ?? [], 'extension')
    // Review is attached to its topic, never introduced as a second required phase.
    if (!route || sections.length) {
      const reviewIds = new Set(stage.review_lesson_ids)
      for (const phase of phases) {
        const modules = phase.modules.map((module) => ({ ...module,
          lessons: module.lessons.filter((lesson) => reviewIds.has(lesson.slug)),
        })).filter((module) => module.lessons.length)
        if (modules.length) sections.push({ kind: 'review', phase: { ...phase, modules } })
      }
    }
    return { stage, sections }
  }).filter((group) => group.sections.length)

  if (route) {
    // The application route starts with its software bridge before ML/Transformers.
    // Optional-only groups follow core learning; the capstone remains the final group.
    const rank = (group: RoadmapGroup) => {
      if (group.stage.id === 'portfolio') return Number.MAX_SAFE_INTEGER
      const indices = group.sections.map(({ phase }) => route.core_phase_ids.indexOf(phase.slug))
        .filter((index) => index >= 0)
      return indices.length ? Math.min(...indices) : route.core_phase_ids.length
    }
    groups.sort((a, b) => rank(a) - rank(b))
  }
  return groups
}
