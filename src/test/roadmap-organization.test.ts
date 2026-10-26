import { expect, test } from 'vitest'
import curriculum from '../../content/curriculum.json'
import routes from '../../content/learning_routes.json'
import overview from '../../content/roadmap_overview.json'
import { groupRoadmap } from '../components/roadmap-organization'

const phases = curriculum.phases.map((phase) => ({ ...phase, modules: phase.modules.map((module) => ({
  ...module,
  lessons: module.lessons.map((title, index) => ({
    slug: `${phase.slug}-${module.slug}-${index + 1}`, title_vi: title, title_en: title,
    status: index === 0 ? 'completed' : 'not_started', estimated_minutes: 20,
  })),
})) }))
const allLessons = phases.flatMap((phase) => phase.modules.flatMap((module) => module.lessons))

test('every existing lesson appears once, with unchanged progress, in the topic overview', () => {
  const groups = groupRoadmap(phases)
  const actual = groups.flatMap((group) => group.sections.flatMap((section) =>
    section.phase.modules.flatMap((module) => module.lessons)))
  expect(actual).toHaveLength(208)
  expect(new Set(actual.map((lesson) => lesson.slug)).size).toBe(208)
  expect(actual.toSorted((a, b) => a.slug.localeCompare(b.slug)))
    .toEqual(allLessons.toSorted((a, b) => a.slug.localeCompare(b.slug)))
  expect(groups.at(-1)?.stage.id).toBe('portfolio')
  expect(groups.findIndex((group) => group.stage.id === 'production'))
    .toBeLessThan(groups.findIndex((group) => group.stage.id === 'agents'))
})

test('RAG survey lessons are optional review beside RAG foundations, not an earlier separate phase', () => {
  const groups = groupRoadmap(phases)
  const rag = groups.find((group) => group.stage.id === 'rag')!
  expect(rag.sections.map((section) => section.phase.slug)).toContain('phase-12-genai-rag')
  const survey = rag.sections.find((section) => section.kind === 'review')!
  expect(survey.phase.modules.map((module) => module.slug)).toEqual(['retrieval', 'rag'])
  expect(groups.flatMap((group) => group.sections).filter((section) =>
    section.phase.slug === 'phase-06-llm-rag').every((section) => section.kind === 'review')).toBe(true)
})

test.each(routes.routes)('$id preserves core order, makes bridges explicit and finishes with the capstone', (route) => {
  const groups = groupRoadmap(phases, route.id)
  const sections = groups.flatMap((group) => group.sections)
  expect(sections.filter((section) => route.core_phase_ids.includes(section.phase.slug))
    .map((section) => section.phase.slug)).toEqual(route.core_phase_ids)
  expect(groups.at(-1)?.stage.id).toBe('portfolio')
  expect(sections.filter((section) => section.kind === 'bridge').map((section) => section.phase.slug))
    .toEqual(route.bridge_phase_ids ?? [])
})

test('required stage labels only name routes that actually require their phases', () => {
  for (const stage of overview.stages) {
    for (const routeId of stage.required_for_routes) {
      const route = routes.routes.find((candidate) => candidate.id === routeId)!
      expect(stage.phase_ids.every((id) => route.core_phase_ids.includes(id)), stage.id).toBe(true)
    }
  }
})
