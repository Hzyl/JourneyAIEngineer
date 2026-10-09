// @vitest-environment jsdom
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { catalogExercises } from '../platform/hosted/exercise-catalog'
import { exerciseLevel, exerciseMaterial } from '../components/exercise-materials'
import { ExerciseProse } from '../components/ExerciseProse'
import { exerciseSolution } from '../components/exercise-solutions'
import { foundationSolutions } from '../components/foundation-solutions'
import { workflowSolutions } from '../components/workflow-solutions'
import { mathSolutions } from '../components/math-solutions'

test('reference solutions have bilingual explanations and stay separate from starter downloads', () => {
  for (const exercise of catalogExercises) {
    for (const language of ['vi', 'en'] as const) {
      const solution = exerciseSolution(exercise.slug, language)
      if (exercise.assessment_kind === 'verified'
        || exercise.slug in foundationSolutions || exercise.slug in workflowSolutions || exercise.slug in mathSolutions
        || ['exercise-3-ml-framing', 'exercise-3-models'].includes(exercise.slug)) {
        expect(solution?.code).toContain('def ')
        expect(solution?.code).not.toContain('TODO')
        expect(solution?.explanation.length).toBeGreaterThanOrEqual(4)
        expect(solution?.practice).toBeTruthy()
        expect(solution?.setup).toBeTruthy()
        expect(solution?.files.every((file) => file.content.length > (file.name.endsWith('.py') ? 100 : 0))).toBe(true)
        expect(exerciseMaterial(exercise, language).files.map((file) => file.name)).not.toContain('reference.py')
      } else {
        expect(solution).toBeNull()
      }
    }
  }
  expect(exerciseSolution('unknown-exercise', 'vi')).toBeNull()
})

test('every exercise has bilingual instructions and only tested templates expose starter downloads', () => {
  for (const exercise of catalogExercises) {
    for (const language of ['vi', 'en'] as const) {
      const material = exerciseMaterial(exercise, language)
      expect(material.description.length).toBeGreaterThan(20)
      expect(material.summary.length).toBeLessThanOrEqual(160)
      expect(material.steps.length).toBeGreaterThanOrEqual(4)
      expect(material.checks.length).toBeGreaterThan(0)
      expect(material.files.map((file) => file.name)).toEqual(exercise.assessment_kind === 'verified'
        ? ['starter.py', 'test_exercise.py'] : [])
      for (const file of material.files) expect(file.content.length).toBeGreaterThan(100)
    }
  }
})

test('all software foundation labs offer specific guides and solutions without changing assessment kind', () => {
  const labs = catalogExercises.filter((exercise) => exercise.slug.startsWith('exercise-1-'))
  expect(labs).toHaveLength(5)
  for (const lab of labs) {
    expect(lab.assessment_kind).toBe('reflection')
    for (const language of ['vi', 'en'] as const) {
      expect(exerciseMaterial(lab, language).steps).toHaveLength(5)
      expect(exerciseSolution(lab.slug, language)?.files.length).toBeGreaterThanOrEqual(2)
    }
  }
})

test('local difficulty names map to the same filters as the web catalog', () => {
  expect(exerciseLevel('starter')).toBe('easy')
  expect(exerciseLevel('intermediate')).toBe('medium')
  expect(exerciseLevel('advanced')).toBe('hard')
  expect(exerciseLevel('easy')).toBe('easy')
})

test('the framing walkthrough remains self-assessed with a complete bilingual dictionary and risk table', () => {
  const lab = catalogExercises.find((exercise) => exercise.slug === 'exercise-3-ml-framing')!
  expect(lab.assessment_kind).toBe('reflection')
  for (const language of ['vi', 'en'] as const) {
    const guide = exerciseMaterial(lab, language)
    expect(guide.steps).toHaveLength(5)
    expect(guide.files).toEqual([])
    const solution = exerciseSolution(lab.slug, language)!
    expect(solution.tables).toHaveLength(2)
    expect(solution.tables[0].rows).toHaveLength(8)
    expect(solution.tables[1].rows).toHaveLength(6)
    expect(solution.tables.every((table) => table.rows.every((row) => row.length === table.columns.length))).toBe(true)
  }
})

test('briefs preserve paragraphs and inline code without interpreting HTML or executable links', () => {
  const html = renderToStaticMarkup(<ExerciseProse text={
    '# Title\n\nUse `count` here.\n\n1. Read the input.\n2. Check the result.\n\n<img src=x onerror=alert(1)> [link](javascript:alert(1))'
  } />)
  expect(html).toContain('<code>count</code>')
  expect(html).toContain('<ol><li>Read the input.</li><li>Check the result.</li></ol>')
  expect(html).not.toContain('<img')
  expect(html).not.toContain('<a')
  expect(html).toContain('&lt;img')
  expect(html).not.toContain('# Title')
})
