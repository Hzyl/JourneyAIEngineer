import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { Plugin } from 'vite'

export const lessonIndexId = 'virtual:journey-lesson-index'
export const lessonPhasePrefix = 'virtual:journey-lesson-phase/'

type LessonRecord = {
  lesson_id: string
  phase_id: string
  review_cards: Array<{ id: string; type: string }>
  [key: string]: unknown
}

const indexFields = [
  'lesson_id', 'phase_id', 'module_id', 'title_vi', 'title_en',
  'summary_vi', 'summary_en', 'estimated_minutes', 'key_terms',
] as const

// Read the same generated catalog and whole-record curated overrides as the API.
// Nothing is written to content/: phase modules exist only in Vite's build graph.
export function readLessonCatalog(root: string) {
  const catalogPath = join(root, 'content', 'lessons.json')
  const curatedDirectory = join(root, 'content', 'curated')
  const files = readdirSync(curatedDirectory).filter((name) => name.endsWith('.json')).sort()
    .map((name) => join(curatedDirectory, name))
  const source = JSON.parse(readFileSync(catalogPath, 'utf8')) as { lessons: LessonRecord[] }
  const overlays = new Map<string, LessonRecord>()
  for (const path of files) {
    const lesson = JSON.parse(readFileSync(path, 'utf8')) as LessonRecord
    if (overlays.has(lesson.lesson_id)) throw new Error(`Duplicate curated lesson: ${lesson.lesson_id}`)
    overlays.set(lesson.lesson_id, lesson)
  }
  const ids = new Set(source.lessons.map((lesson) => lesson.lesson_id))
  if (ids.size !== source.lessons.length) throw new Error('Duplicate catalog lesson ID')
  for (const id of overlays.keys()) {
    if (!ids.has(id)) throw new Error(`Curated lesson is absent from catalog: ${id}`)
  }
  const lessons = source.lessons.map((lesson) => (
    overlays.get(lesson.lesson_id) ?? { ...lesson, quality_status: 'draft' }
  ))
  const phases = new Map<string, LessonRecord[]>()
  for (const lesson of lessons) {
    if (!/^phase-[a-z0-9-]+$/.test(lesson.phase_id)) throw new Error('Invalid catalog phase ID')
    const phase = phases.get(lesson.phase_id) ?? []
    phase.push(lesson)
    phases.set(lesson.phase_id, phase)
  }
  const index = lessons.map((lesson) => ({
    ...Object.fromEntries(indexFields.map((field) => [field, lesson[field]])),
    review_cards: lesson.review_cards.map(({ id, type }) => ({ id, type })),
  }))
  return { index, phases, sourcePaths: [catalogPath, curatedDirectory, ...files] }
}

export function lessonCatalogPlugin(): Plugin {
  let root = process.cwd()
  let snapshot: ReturnType<typeof readLessonCatalog> | undefined
  const current = () => snapshot ??= readLessonCatalog(root)
  const isSource = (file: string) => {
    const path = resolve(file)
    return path === join(root, 'content', 'lessons.json')
      || (path.startsWith(join(root, 'content', 'curated') + '/') && path.endsWith('.json'))
      || (path.startsWith(join(root, 'content', 'curated') + '\\') && path.endsWith('.json'))
  }
  return {
    name: 'journey-lesson-catalog',
    configResolved(config) { root = resolve(config.root) },
    buildStart() { snapshot = undefined },
    watchChange(file) { if (isSource(file)) snapshot = undefined },
    resolveId(id) {
      if (id === lessonIndexId || id.startsWith(lessonPhasePrefix)) return String.fromCharCode(0) + id
    },
    load(id) {
      const resolvedIndex = String.fromCharCode(0) + lessonIndexId
      const resolvedPhase = String.fromCharCode(0) + lessonPhasePrefix
      if (id !== resolvedIndex && !id.startsWith(resolvedPhase)) return
      const catalog = current()
      for (const path of catalog.sourcePaths) this.addWatchFile(path)
      if (id === resolvedIndex) {
        const loaders = [...catalog.phases.keys()].map((phase) => (
          `${JSON.stringify(phase)}: () => import(${JSON.stringify(lessonPhasePrefix + phase)})`
        ))
        return [
          `export const lessonIndex = ${JSON.stringify(catalog.index)};`,
          `export const phaseLoaders = {${loaders.join(',')}};`,
        ].join('\n')
      }
      const phaseId = id.slice(resolvedPhase.length)
      const lessons = catalog.phases.get(phaseId)
      if (!lessons) throw new Error(`Unknown lesson phase: ${phaseId}`)
      return `export default ${JSON.stringify(lessons)};`
    },
    configureServer(server) {
      const invalidate = (file: string) => {
        if (!isSource(file)) return
        snapshot = undefined
        // Full reload also clears already imported phase promises in the browser.
        server.moduleGraph.invalidateAll()
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.add([join(root, 'content', 'lessons.json'), join(root, 'content', 'curated')])
      for (const event of ['add', 'change', 'unlink'] as const) server.watcher.on(event, invalidate)
      server.httpServer?.once('close', () => {
        for (const event of ['add', 'change', 'unlink'] as const) server.watcher.off(event, invalidate)
      })
    },
  }
}
