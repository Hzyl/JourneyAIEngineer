import { expect, test } from 'vitest'
import { hostedCatalog } from '../platform/hosted/catalog'
import { searchCatalog } from '../platform/hosted/catalog-search'

test('hosted search includes every exercise and bilingual titles with stable IDs', () => {
  const result = searchCatalog(hostedCatalog, '', { type: 'exercises', limit: 100 })
  expect(result.total).toBe(hostedCatalog.exercises.length)
  expect(result.results.every((item) => item.type === 'exercise' && item.slug && item.title_en)).toBe(true)
  const found = searchCatalog(hostedCatalog, 'summarize_scores', { type: 'exercises' })
  expect(found.results.some((item) => item.slug === 'exercise-0-baseline')).toBe(true)
  for (const type of ['phases', 'modules', 'lessons', 'resources']) {
    const result = searchCatalog(hostedCatalog, '', { type, limit: 100 })
    expect(result.total).toBeGreaterThan(0)
    expect(result.results.every((item) => `${item.type}s` === type && item.title_en)).toBe(true)
  }
})

test('search covers English descriptions and unaccented Vietnamese including d stroke', () => {
  const exercise = hostedCatalog.exercises.find((item) => item.slug === 'exercise-0-baseline')!
  const en = searchCatalog(hostedCatalog, exercise.description_en.slice(0, 35), { type: 'exercises' })
  expect(en.results.some((item) => item.slug === exercise.slug)).toBe(true)
  expect(searchCatalog(hostedCatalog, 'danh gia dau vao', { type: 'phases' }).total).toBeGreaterThan(0)
})

test('phase, type and progress filters compose and limits preserve the untruncated count', () => {
  const lesson = hostedCatalog.lessons[0]
  const progress = new Map([[lesson.lesson_id, 'completed']])
  const result = searchCatalog(hostedCatalog, '', { type: 'lessons', status: 'completed', phase: lesson.phase_id }, progress)
  expect(result.results.map((item) => item.id)).toEqual([lesson.lesson_id])
  expect(searchCatalog(hostedCatalog, '', { type: 'exercises', status: 'completed' }, progress).total).toBe(0)
  expect(searchCatalog(hostedCatalog, '', { type: 'lessons', status: 'available' }, progress).total).toBe(0)
  const limited = searchCatalog(hostedCatalog, '', { limit: 3 })
  expect(limited.results).toHaveLength(3)
  expect(limited.count).toBe(3)
  expect(limited.total).toBeGreaterThan(3)
  expect(searchCatalog(hostedCatalog, '', { phase: 'missing-phase' }).total).toBe(0)
})

test('invalid filters fail explicitly instead of broadening the search', () => {
  for (const options of [{ type: 'secret' }, { status: 'wrong' }, { limit: 0 }, { limit: 1.5 }, { limit: 101 }]) {
    expect(() => searchCatalog(hostedCatalog, 'python', options)).toThrow('Invalid search filters')
  }
  expect(() => searchCatalog(hostedCatalog, 'x'.repeat(121))).toThrow('Invalid search filters')
})
