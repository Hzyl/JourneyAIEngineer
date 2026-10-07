// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { ExercisesView } from '../components/ExercisesView'
import type { Exercise } from '../api'

const api = vi.hoisted(() => ({
  createWorkspace: vi.fn(), openWorkspace: vi.fn(), openFolder: vi.fn(), runWorkspace: vi.fn(),
  workspaceRuns: vi.fn(), exportWorkspace: vi.fn(), publishGit: vi.fn(),
}))
vi.mock('../platform/learning-client', () => ({ learningClient: api }))
const exercise: Exercise = {
  id: 1, slug: 'python-practice', title_vi: 'Thực hành Python', title_en: 'Python practice',
  description_vi: 'Đọc dữ liệu', description_en: 'Read synthetic records', assessment_kind: 'reflection',
  difficulty: 'easy', estimated_minutes: 30, test_command: 'python -m unittest', hints: [],
}
let host: HTMLDivElement
let root: Root
const refresh = vi.fn(async () => {})
beforeEach(() => {
  vi.resetAllMocks()
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  api.createWorkspace.mockResolvedValue({ workspace: { id: 7, path: 'workspaces/python' }, created: true })
  api.workspaceRuns.mockResolvedValue({ runs: [], count: 0 })
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
})
const render = (hosted = false, language: 'vi' | 'en' = 'en', git = true) => act(async () => {
  root.render(<ExercisesView exercises={[exercise]} hosted={hosted} language={language}
    gitPublishAvailable={git} onRefresh={refresh} />)
})
const button = (name: string) => [...host.querySelectorAll('button')].find((b) => b.textContent === name)!
const click = (name: string) => act(async () => button(name).click())
const fill = (element: HTMLInputElement, value: string) => act(async () => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(element, value)
  element.dispatchEvent(new Event('input', { bubbles: true }))
})

test('hosted practice localizes and filters both languages without local API actions', async () => {
  await render(true)
  expect(host.textContent).toContain('Python practice')
  expect(host.textContent).toContain('Read synthetic records')
  expect(host.querySelectorAll('button')).toHaveLength(0)
  await fill(host.querySelector('input')!, 'synthetic')
  expect(host.querySelectorAll('.exercise-card')).toHaveLength(1)
  await render(true, 'vi')
  expect(host.textContent).toContain('Thực hành Python')
  await fill(host.querySelector('input')!, 'unmatched')
  expect(host.textContent).toContain('Không có bài tập phù hợp.')
  for (const method of Object.values(api)) expect(method).not.toHaveBeenCalled()
})

test('running blocks duplicate and conflicting actions, retains workspace and retries without recreating', async () => {
  let fail: (reason: unknown) => void = () => {}
  api.runWorkspace.mockImplementationOnce(() => new Promise((_resolve, reject) => { fail = reject }))
    .mockResolvedValue({ status: 'passed', output: 'User output kept', duration_ms: 12, assessment_kind: 'reflection' })
  await render()
  await act(async () => { button('Run tests').click(); button('Run tests').click() })
  expect(api.createWorkspace).toHaveBeenCalledTimes(1)
  expect(api.runWorkspace).toHaveBeenCalledTimes(1)
  expect(button('Running…').getAttribute('aria-busy')).toBe('true')
  expect([...host.querySelectorAll('.workspace-actions button')].every((b) => b.hasAttribute('disabled'))).toBe(true)
  await act(async () => fail('network failure'))
  expect(host.querySelector('[role="alert"]')!.textContent).toBe('Could not run the exercise.')
  await click('Run tests')
  expect(api.createWorkspace).toHaveBeenCalledTimes(1)
  expect(api.runWorkspace).toHaveBeenCalledTimes(2)
  expect(host.querySelector('.run-output')!.textContent).toContain('skills not verified')
  expect(host.querySelector('.run-output')!.textContent).toContain('User output kept')
  expect(host.textContent).toContain('No runs yet.')
  await render(false, 'vi')
  expect(host.querySelector('.run-output')!.textContent).toContain('chưa xác minh kỹ năng')
})

test('empty history is explicit and does not create a workspace; local-only export stays disabled', async () => {
  await render(false, 'en', false)
  await click('History')
  expect(host.textContent).toContain('No runs yet.')
  expect(api.createWorkspace).not.toHaveBeenCalled()
  expect(api.workspaceRuns).not.toHaveBeenCalled()
  expect(button('Save artifact').disabled).toBe(true)
})

test('publish requires review, resets consent on message edits and prevents duplicate submission', async () => {
  api.exportWorkspace.mockResolvedValue({ artifact_path: 'exercises/python', files: [], skipped: [], secret_files: [] })
  let rejectPush: (reason: unknown) => void = () => {}
  api.publishGit.mockImplementationOnce(() => new Promise((_resolve, reject) => { rejectPush = reject }))
  await render()
  await click('Save artifact')
  const confirm = host.querySelector<HTMLInputElement>('[type="checkbox"]')!
  expect(button('Confirm & push to GitHub').disabled).toBe(true)
  await act(async () => confirm.click())
  expect(button('Confirm & push to GitHub').disabled).toBe(false)
  await fill(host.querySelector('.publish-panel input[maxlength]')!, 'learn: updated evidence')
  expect(confirm.checked).toBe(false)
  expect(button('Confirm & push to GitHub').disabled).toBe(true)
  await act(async () => confirm.click())
  await act(async () => {
    button('Confirm & push to GitHub').click()
    button('Confirm & push to GitHub').click()
  })
  expect(api.publishGit).toHaveBeenCalledExactlyOnceWith({
    paths: ['exercises/python'], message: 'learn: updated evidence', confirm: true,
  })
  expect(button('Cancel').disabled).toBe(true)
  expect(button('Pushing…').getAttribute('aria-busy')).toBe('true')
  await act(async () => rejectPush(new Error('Offline')))
  expect(host.querySelector('[role="alert"]')!.textContent).toBe('Offline')
  expect(host.querySelector<HTMLInputElement>('.publish-panel input[maxlength]')!.value)
    .toBe('learn: updated evidence')
  expect(button('Confirm & push to GitHub').disabled).toBe(false)
})
