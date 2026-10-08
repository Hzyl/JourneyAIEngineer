// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import type { Dashboard } from '../api'
import { TodayView } from '../components/TodayView'

const dashboard: Dashboard = {
  total_lessons: 2, completed_lessons: 0, in_progress_lessons: 0, progress_percent: 0,
  due_reviews: 0, study_minutes: 0, weekly_minutes: 0, weekly_goal_minutes: 120,
  lessons_this_week: 0, streak_days: 0, phases: [],
  current_lesson: { slug: 'intro', title_vi: 'Bắt đầu', module_title: '', phase_title: '' },
}
let host: HTMLDivElement
let root: Root
const save = vi.fn()
const open = vi.fn()
const navigate = vi.fn()
const render = (data: Dashboard | null = dashboard, language: 'vi' | 'en' = 'en') => act(async () => {
  root.render(<TodayView dashboard={data} language={language} onOpenLesson={open}
    onNavigate={navigate} onRecordSession={save} />)
})
const fill = (selector: string, value: string) => act(async () => {
  const input = host.querySelector<HTMLInputElement>(selector)!
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
})
const submit = () => host.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
beforeEach(async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.resetAllMocks()
  save.mockResolvedValue(undefined)
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  await render()
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
})

test('same-frame submits save once, lock fields, preserve failed work and allow retry', async () => {
  let reject!: (reason: Error) => void
  save.mockReturnValueOnce(new Promise((_, fail) => { reject = fail }))
  await fill('input[type="number"]', '30')
  await fill('input:not([type])', '  Practised loops  ')
  await act(async () => { submit(); submit() })
  expect(save).toHaveBeenCalledExactlyOnceWith(30, 'Practised loops')
  expect([...host.querySelectorAll('input')].every((input) => input.disabled)).toBe(true)
  await act(async () => reject(new Error('Offline')))
  expect(host.querySelector<HTMLInputElement>('input:not([type])')!.value).toBe('  Practised loops  ')
  expect(host.querySelector('[role="alert"]')!.textContent).toBe('Offline')
  await act(async () => { submit() })
  expect(save).toHaveBeenCalledTimes(2)
  expect(host.querySelector<HTMLInputElement>('input:not([type])')!.value).toBe('')
  expect(host.textContent).toContain('Study session saved.')
  await fill('input:not([type])', 'Next session')
  expect(host.textContent).not.toContain('Study session saved.')
})

test.each(['', '0', '-1', '1.5', '1441'])('invalid minutes %s never write a session', async (minutes) => {
  await fill('input[type="number"]', minutes)
  await act(async () => { submit() })
  expect(save).not.toHaveBeenCalled()
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('whole minutes')
})

test('next lesson, completed roadmap and unavailable data have appropriate navigation', async () => {
  expect(host.querySelector('h2')!.textContent).toBe('Continue your next lesson')
  await act(async () => host.querySelector<HTMLButtonElement>('.primary-button')!.click())
  expect(open).toHaveBeenCalledWith('intro')
  await render({ ...dashboard, current_lesson: null }, 'vi')
  expect(host.querySelector('h2')!.textContent).toBe('Chọn thử thách tiếp theo')
  await act(async () => host.querySelector<HTMLButtonElement>('.primary-button')!.click())
  expect(navigate).toHaveBeenCalledWith('roadmap')
  await render(null)
  expect(host.querySelector('[role="status"]')!.textContent).toContain('not available')
})
