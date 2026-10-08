// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import type { AppSettings } from '../api'
import { SettingsView } from '../components/SettingsView'

vi.mock('../components/BackupSettings', () => ({ BackupSettings: () => <aside>Local backup</aside> }))
vi.mock('../components/CloudDataSettings', () => ({ CloudDataSettings: () => <aside>Cloud data</aside> }))
const settings: AppSettings = {
  language: 'en', track: 'standard', weekly_goal_minutes: 720, target_role: 'internship',
  experience_level: 'beginner', show_completed_lessons: true, onboarding_complete: false,
}
let host: HTMLDivElement
let root: Root
const save = vi.fn()
const render = (value = settings, hosted = false, externalSaving = false) => root.render(
  <SettingsView settings={value} hosted={hosted} externalSaving={externalSaving}
    onSave={save} onRestored={vi.fn()} />,
)
const fill = (value: string) => act(async () => {
  const input = host.querySelector<HTMLInputElement>('input[type="number"]')!
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
  await act(async () => render())
})
afterEach(async () => { await act(async () => root.unmount()); host.remove() })

test.each(['', '0', '59', '60.5', '10081'])('rejects invalid weekly minutes %s without writing', async (value) => {
  await fill(value)
  await act(async () => { submit() })
  expect(save).not.toHaveBeenCalled()
  expect(host.querySelector('input[type="number"]')!.getAttribute('aria-invalid')).toBe('true')
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('60 to 10080')
  await fill('60')
  expect(host.querySelector('[role="alert"]')).toBeNull()
})

test('pending goal locks duplicates and failed work survives retry; successful goals track later refreshes', async () => {
  let reject!: (reason: Error) => void
  save.mockReturnValueOnce(new Promise((_, fail) => { reject = fail }))
  save.mockImplementationOnce(async () => render({ ...settings, weekly_goal_minutes: 480 }))
  await fill('480')
  await act(async () => { submit(); submit() })
  expect(save).toHaveBeenCalledExactlyOnceWith({ weekly_goal_minutes: 480 })
  expect([...host.querySelectorAll('input, select, button')]
    .every((control) => (control as HTMLInputElement).disabled)).toBe(true)
  await act(async () => reject(new Error('Offline')))
  expect(host.querySelector<HTMLInputElement>('input[type="number"]')!.value).toBe('480')
  await act(async () => { submit() })
  expect(host.textContent).toContain('Weekly goal saved.')
  await act(async () => render({ ...settings, weekly_goal_minutes: 600 }))
  expect(host.querySelector<HTMLInputElement>('input[type="number"]')!.value).toBe('600')
})

test('auto-save does not save the edited weekly goal or falsely claim it was saved', async () => {
  await fill('480')
  await act(async () => {
    const select = host.querySelectorAll('select')[3]
    select.value = 'accelerated'
    select.dispatchEvent(new Event('change', { bubbles: true }))
  })
  expect(save).toHaveBeenCalledExactlyOnceWith({ track: 'accelerated' })
  expect(host.querySelector('[role="status"]')!.textContent).toBe('Saved: Study rhythm.')
  expect(host.textContent).toContain('weekly goal has not been saved yet')
  expect(host.querySelector<HTMLInputElement>('input[type="number"]')!.value).toBe('480')
})

test('labels and data controls follow language and local or hosted mode', async () => {
  expect(host.textContent).toContain('Local backup')
  await act(async () => render({ ...settings, language: 'vi' }, true))
  expect(host.textContent).toContain('Các lựa chọn dưới đây tự lưu')
  expect(host.textContent).toContain('Nhịp học')
  expect(host.textContent).toContain('Cloud data')
  expect(host.textContent).not.toContain('Local backup')
})

test('saving a preference cannot erase validation for an invalid weekly goal', async () => {
  await fill('30')
  await act(async () => { submit() })
  await act(async () => {
    const select = host.querySelectorAll('select')[3]
    select.value = 'accelerated'
    select.dispatchEvent(new Event('change', { bubbles: true }))
  })
  expect(host.querySelector('[role="alert"]')?.textContent).toContain('60 to 10080')
  expect(host.querySelector('input[type="number"]')!.getAttribute('aria-invalid')).toBe('true')
  expect(save).toHaveBeenCalledExactlyOnceWith({ track: 'accelerated' })
})

test('save errors follow the active language and never render provider details', async () => {
  save.mockRejectedValueOnce(new Error('Private provider detail'))
  await fill('480')
  await act(async () => { submit() })
  expect(host.querySelector('[role="alert"]')?.textContent).toBe('Could not save settings.')
  expect(host.textContent).not.toContain('Private provider detail')
  await act(async () => render({ ...settings, language: 'vi' }))
  expect(host.querySelector('[role="alert"]')?.textContent).toBe('Không lưu được cài đặt.')
  expect(host.querySelector<HTMLInputElement>('input[type="number"]')!.value).toBe('480')
})

test('an external preference write locks the form without discarding its draft', async () => {
  await fill('480')
  await act(async () => render(settings, false, true))
  expect([...host.querySelectorAll<HTMLInputElement>('input, select, button')]
    .every((control) => control.disabled)).toBe(true)
  await act(async () => { submit() })
  expect(save).not.toHaveBeenCalled()
  await act(async () => render({ ...settings, language: 'vi' }))
  expect(host.querySelector<HTMLInputElement>('input[type="number"]')!.value).toBe('480')
  expect(host.querySelector<HTMLButtonElement>('button')!.disabled).toBe(false)
})
