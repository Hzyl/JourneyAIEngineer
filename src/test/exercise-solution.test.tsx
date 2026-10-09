// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test } from 'vitest'
import { ExerciseSolution } from '../components/ExerciseSolution'

let host: HTMLDivElement
let root: Root
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
})
const render = (slug: string, language: 'vi' | 'en' = 'vi') => act(async () => {
  root.render(<ExerciseSolution key={slug} slug={slug} language={language} />)
})

test('solutions are absent from the DOM until opened and can be hidden again', async () => {
  await render('exercise-0-baseline')
  const button = host.querySelector('button')!
  expect(button.textContent).toContain('Xem bài giải')
  expect(button.getAttribute('aria-expanded')).toBe('false')
  expect(host.querySelector('pre')).toBeNull()
  const panel = document.getElementById(button.getAttribute('aria-controls')!)!
  expect(panel.hidden).toBe(true)
  await act(async () => button.click())
  expect(button.getAttribute('aria-expanded')).toBe('true')
  expect(panel.hidden).toBe(false)
  expect(host.querySelector('pre')?.textContent).toContain('def summarize_scores(scores):')
  expect(host.textContent).toContain('Vì sao cách này đúng?')
  await act(async () => button.click())
  expect(panel.hidden).toBe(true)
  expect(host.querySelector('pre')).toBeNull()
})

test('switching language preserves an open answer but selecting another exercise resets it', async () => {
  await render('exercise-0-baseline')
  await act(async () => host.querySelector('button')!.click())
  await render('exercise-0-baseline', 'en')
  expect(host.textContent).toContain('Hide solution')
  expect(host.textContent).toContain('Why this works')
  expect(host.textContent).not.toContain('Vì sao cách này đúng?')
  await render('exercise-0-environment', 'en')
  expect(host.querySelector('button')?.getAttribute('aria-expanded')).toBe('false')
  expect(host.querySelector('pre')).toBeNull()
})

test('a lab without an authored solution shows an honest state without a dead button', async () => {
  await render('exercise-3-preprocessing')
  expect(host.textContent).toContain('chưa có bài giải mẫu')
  expect(host.querySelector('button')).toBeNull()
  await render('exercise-3-preprocessing', 'en')
  expect(host.textContent).toContain('no worked solution yet')
  expect(host.querySelector('pre')).toBeNull()
})

test('worked labs reveal matching filenames and their own setup, not starter instructions', async () => {
  await render('exercise-1-python-core')
  expect(host.querySelector('a[download]')).toBeNull()
  await act(async () => host.querySelector('button')!.click())
  expect(host.textContent).toContain('study_scores/__init__.py')
  expect(host.textContent).toContain('python -m unittest -v test_solution.py')
  expect(host.textContent).not.toContain('test_exercise.py')
  const links = host.querySelectorAll<HTMLAnchorElement>('a[download]')
  expect([...links].map((link) => link.download)).toEqual(['__init__.py', 'test_solution.py'])
  expect(decodeURIComponent(links[0].href)).toContain('def weighted_score')
})

test('framing tables are opt-in, semantic and translated alongside the downloadable solution', async () => {
  await render('exercise-3-ml-framing')
  expect(host.querySelector('table')).toBeNull()
  await act(async () => host.querySelector('button')!.click())
  expect(host.querySelectorAll('table')).toHaveLength(2)
  expect(host.querySelectorAll('th[scope="col"]')).toHaveLength(6)
  expect(host.querySelectorAll('th[scope="row"]')).toHaveLength(14)
  expect(host.textContent).toContain('Bảng nguy cơ leakage')
  expect(host.textContent).toContain('precision=null')
  await render('exercise-3-ml-framing', 'en')
  expect(host.textContent).toContain('Leakage risk table')
  expect(host.textContent).not.toContain('Bảng nguy cơ leakage')
  const links = [...host.querySelectorAll<HTMLAnchorElement>('a[download]')]
  expect(links.map((link) => link.download)).toEqual(['framing.py', 'test_solution.py'])
  expect(decodeURIComponent(links[0].href)).toContain('def split_orders')
  expect(decodeURIComponent(links[1].href)).toContain('test_label_maturity_boundaries')
})

test('core models has an opt-in bilingual comparison and all runnable source files', async () => {
  await render('exercise-3-models')
  expect(host.querySelector('table')).toBeNull()
  expect(host.querySelector('a[download]')).toBeNull()
  await act(async () => host.querySelector('button')!.click())
  expect(host.querySelectorAll('table')).toHaveLength(2)
  expect(host.textContent).toContain('Kết quả seed 42')
  expect(host.textContent).toContain('11 tests, OK')
  expect(host.textContent).toContain('40 / 3 / 1 / 36')
  await render('exercise-3-models', 'en')
  expect(host.textContent).toContain('Model selection tradeoffs')
  expect(host.textContent).not.toContain('Kết quả seed 42')
  const links = [...host.querySelectorAll<HTMLAnchorElement>('a[download]')]
  expect(links.map((link) => link.download)).toEqual(['compare.py', 'models.py', 'test_solution.py'])
  expect(decodeURIComponent(links[0].href)).toContain('include_test=False')
  expect(decodeURIComponent(links[1].href)).toContain('def fit_boost')
  expect(decodeURIComponent(links[2].href)).toContain('test_logistic_gradient_and_linear_boundary')
})
