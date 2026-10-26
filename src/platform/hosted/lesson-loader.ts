import type { CatalogLesson, CatalogLessonIndex, LessonPhaseLoaders } from './catalog-types'

// Cache only public versioned lesson content, never a user's progress or session.
export function createLessonLoader(index: readonly CatalogLessonIndex[], loaders: LessonPhaseLoaders) {
  const bySlug = new Map(index.map((lesson) => [lesson.lesson_id, lesson]))
  const phases = new Map<string, Promise<Map<string, CatalogLesson>>>()

  async function loadLesson(slug: string): Promise<CatalogLesson | undefined> {
    const entry = bySlug.get(slug)
    if (!entry) return undefined
    const phaseId = entry.phase_id
    const loader = loaders[phaseId]
    if (!loader) throw new Error(`Missing lesson phase: ${phaseId}`)
    let pending = phases.get(phaseId)
    if (!pending) {
      pending = Promise.resolve().then(loader).then(({ default: lessons }) => {
        const expected = index.filter((lesson) => lesson.phase_id === phaseId)
        const loaded = new Map(lessons.map((lesson) => [lesson.lesson_id, lesson]))
        if (lessons.length !== expected.length || loaded.size !== expected.length
          || lessons.some((lesson) => lesson.phase_id !== phaseId)
          || expected.some((lesson) => !loaded.has(lesson.lesson_id))) {
          throw new Error(`Incomplete lesson phase: ${phaseId}`)
        }
        return loaded
      }).catch((error: unknown) => {
        phases.delete(phaseId)
        throw error
      })
      phases.set(phaseId, pending)
    }
    return (await pending).get(slug)
  }

  return loadLesson
}
