// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { LessonProgress } from '../components/LessonProgress'
import { lessonFixture } from './lesson-fixture'

let host: HTMLDivElement
let root: Root
const save = vi.fn()
const nudge = vi.fn()
const render = (complete = true, status = 'not_started', language: 'vi' | 'en' = 'en') => act(async () => {
  root.render(<LessonProgress lesson={{ ...lessonFixture, status }} language={language}
    checklistComplete={complete} onChecklistNudge={nudge} onProgress={save} />)
})
const fill = (value: string) => act(async () => {
  const input = host.querySelector('input')!
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
})
const click = () => act(async () => host.querySelector('button')!.click())
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

test.each(['', '0', '-1', '1.5', '1441'])('rejects invalid study minutes %s without saving progress', async (value) => {
  await fill(value)
  await click()
  expect(save).not.toHaveBeenCalled()
  expect(host.querySelector('input')!.getAttribute('aria-invalid')).toBe('true')
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('whole number of minutes from 1 to 1440')
})

test('the checklist is required for completion but not for marking completed work for review', async () => {
  await render(false)
  await click()
  expect(nudge).toHaveBeenCalledOnce()
  expect(save).not.toHaveBeenCalled()
  await render(false, 'completed')
  await fill('1')
  await click()
  expect(save).toHaveBeenCalledExactlyOnceWith('lesson-one', 'needs_review', 1)
})

test('pending progress locks duplicate clicks and errors preserve minutes for a successful retry', async () => {
  let reject!: (reason: Error) => void
  save.mockReturnValueOnce(new Promise((_, fail) => { reject = fail }))
  await fill('1440')
  await act(async () => { host.querySelector('button')!.click(); host.querySelector('button')!.click() })
  expect(save).toHaveBeenCalledExactlyOnceWith('lesson-one', 'completed', 1440)
  expect(host.querySelector('button')!.disabled).toBe(true)
  expect(host.querySelector('input')!.disabled).toBe(true)
  await act(async () => reject(new Error('Offline')))
  expect(host.querySelector('input')!.value).toBe('1440')
  expect(host.textContent).toContain('Progress was not saved')
  await click()
  expect(save).toHaveBeenCalledTimes(2)
  expect(host.querySelector('[role="alert"]')).toBeNull()
  expect(host.textContent).toContain('Progress saved.')
})

test('minute labels and errors are available in Vietnamese', async () => {
  await render(true, 'not_started', 'vi')
  await fill('0')
  await click()
  expect(host.querySelector('label')!.textContent).toBe('Phút học')
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('Nhập số phút nguyên từ 1 đến 1440')
})
