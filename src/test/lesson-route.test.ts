import { expect, test } from 'vitest'
import routes from '../../content/learning_routes.json'
import { learningRouteFromSearch, lessonRouteContinuation, roadmapRoutePath } from '../components/lesson-route'

const phaseIds = [...new Set(routes.routes.flatMap((route) => [...route.phase_ids, ...route.optional_phase_ids]))]
// Deliberately use catalog order, which differs from the route order.
const roadmap = { phases: phaseIds.sort().map((slug) => ({ slug, modules: [
  { lessons: [{ slug: `${slug}-first` }] },
  { lessons: [{ slug: `${slug}-last` }] },
] })) }
const continuation = (phase: string, route = 'application') =>
  lessonRouteContinuation(roadmap, `${phase}-last`, route)

test.each([
  ['phase-12-genai-rag', 'application', 'phase-17-genai-evaluation'],
  ['phase-19-genai-production', 'application', 'phase-07-capstone-career'],
  ['phase-03-classical-ml', 'foundation', 'phase-07-capstone-career'],
  ['phase-05-mlops', 'deep-ml', 'phase-07-capstone-career'],
])('next lessons follow %s in %s without forcing specializations', (phase, route, next) => {
  expect(continuation(phase, route)?.nextLessons).toEqual([`${next}-first`, `${next}-last`])
})

test.each(routes.routes.map((route) => route.id))('the end of %s does not loop into another path', (route) => {
  expect(continuation('phase-07-capstone-career', route)).toMatchObject({
    route: { id: route }, scope: 'core', end: true, nextLessons: [],
  })
})

test('an optional phase continues internally and stops before another specialization', () => {
  expect(lessonRouteContinuation(roadmap, 'phase-13-genai-advanced-rag-first', 'application')?.nextLessons)
    .toEqual(['phase-13-genai-advanced-rag-last'])
  expect(continuation('phase-13-genai-advanced-rag')).toMatchObject({
    scope: 'specialization', end: true, nextLessons: [],
  })
})

test('unknown routes, unrelated lessons and unavailable catalogs leave authored links in control', () => {
  expect(learningRouteFromSearch('?route=application&q=rag')?.id).toBe('application')
  for (const search of ['', '?route=all', '?route=invalid']) {
    expect(learningRouteFromSearch(search)).toBeNull()
  }
  expect(lessonRouteContinuation(roadmap, 'phase-12-genai-rag-last', null)).toBeUndefined()
  expect(lessonRouteContinuation(roadmap, 'phase-12-genai-rag-last', 'unknown')).toBeUndefined()
  expect(continuation('phase-12-genai-rag', 'foundation')).toBeUndefined()
  expect(lessonRouteContinuation(null, 'missing', 'application')).toBeUndefined()
  expect(lessonRouteContinuation(roadmap, 'missing', 'application')).toBeUndefined()
})

test('a partial catalog cannot incorrectly report a route as complete', () => {
  const partial = { phases: roadmap.phases.filter((phase) => phase.slug !== 'phase-07-capstone-career') }
  expect(lessonRouteContinuation(partial, 'phase-19-genai-production-last', 'application')).toBeUndefined()
})

test('return URLs only contain known route IDs', () => {
  expect(roadmapRoutePath('application')).toBe('/roadmap?route=application')
  expect(roadmapRoutePath(null)).toBe('/roadmap')
  expect(roadmapRoutePath('//example.test')).toBe('/roadmap')
})
