// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { FeedbackPanel } from '../components/FeedbackPanel'
import { CommunityView } from '../components/CommunityView'
import { version } from '../../package.json'

const api = vi.hoisted(() => ({ feedback: vi.fn(), createFeedback: vi.fn() }))
vi.mock('../platform/learning-client', () => ({ learningClient: api }))
const lesson = { slug: 'sample-lesson', title_vi: 'Bài mẫu', title_en: 'Sample lesson' }
const item = {
  id: 1, lesson_slug: lesson.slug, lesson_title_vi: lesson.title_vi, lesson_title_en: lesson.title_en,
  kind: 'unclear', body: 'Nội dung gốc của người học', status: 'accepted', display_name: null,
  created_at: '2026-10-07T10:00:00Z', updated_at: '2026-10-07T10:00:00Z',
}
let host: HTMLDivElement
let root: Root
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.resetAllMocks()
  api.feedback.mockResolvedValue({ items: [], count: 0 })
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  vi.unstubAllGlobals()
})
const renderPanel = (hosted: boolean, language: 'vi' | 'en' = 'en') => act(async () => {
  root.render(<FeedbackPanel lesson={lesson} language={language} hosted={hosted} />)
})
const fill = (value: string) => act(async () => {
  const input = host.querySelector<HTMLTextAreaElement>('textarea')!
  Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
})
const submit = () => act(async () => {
  host.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
})

test('hosted feedback creates an unsent draft without a request or clearing input', async () => {
  await renderPanel(true)
  const body = 'Please explain this example. sk-' + 'a'.repeat(24)
  await fill(body)
  await submit()
  expect(api.feedback).not.toHaveBeenCalled()
  expect(api.createFeedback).not.toHaveBeenCalled()
  expect(host.querySelector('textarea')!.value).toBe(body)
  const report = host.querySelector<HTMLTextAreaElement>('textarea[readonly]')!.value
  expect(report).toContain(`Version: v${version}`)
  expect(report).toContain('Mode: Web beta')
  expect(report).toContain('Status: Draft, not submitted')
  expect(report).toContain('Sample lesson (sample-lesson)')
  expect(report).toContain('[REDACTED]')
  expect(report).not.toContain('a'.repeat(24))
  expect(host.querySelector('.success-note')).toBeNull()
  await renderPanel(true, 'vi')
  expect(host.textContent).toContain('Bản nháp chưa gửi')
  expect(host.querySelector('textarea')!.value).toBe(body)
})

test('clipboard failures preserve a selectable report and the original input', async () => {
  const writeText = vi.fn().mockRejectedValue(new Error('denied'))
  vi.stubGlobal('navigator', { clipboard: { writeText } })
  await renderPanel(true)
  await fill('Please add a worked example.')
  await submit()
  const report = host.querySelector<HTMLTextAreaElement>('textarea[readonly]')!.value
  await act(async () => host.querySelector<HTMLButtonElement>('.feedback-report button')!.click())
  expect(writeText).toHaveBeenCalledWith(report)
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('Could not copy')
  expect(host.querySelector<HTMLTextAreaElement>('textarea[readonly]')!.value).toBe(report)
  expect(host.querySelector('textarea')!.value).toBe('Please add a worked example.')
})

test('local saves resist duplicate submission, retain failed input and allow a successful retry', async () => {
  let rejectSave!: (error: Error) => void
  api.createFeedback.mockReturnValueOnce(new Promise((_, reject) => { rejectSave = reject }))
  await renderPanel(false)
  await fill('Please explain this loop.')
  await act(async () => {
    const form = host.querySelector('form')!
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  })
  expect(api.createFeedback).toHaveBeenCalledTimes(1)
  expect(host.querySelector('textarea')!.disabled).toBe(true)
  expect(host.querySelector('select')!.disabled).toBe(true)
  await act(async () => rejectSave(new Error('network')))
  expect(host.querySelector('textarea')!.value).toBe('Please explain this loop.')
  expect(host.querySelector('textarea')!.disabled).toBe(false)
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('Your text is preserved')
  api.createFeedback.mockResolvedValueOnce({})
  await submit()
  expect(api.createFeedback).toHaveBeenCalledTimes(2)
  expect(host.querySelector('textarea')!.value).toBe('')
  expect(host.querySelector('[role="status"]')!.textContent).toContain('saved on this computer')
})

test('community retries errors and only shows approved feedback with localized lesson links', async () => {
  const openLesson = vi.fn()
  const openRoadmap = vi.fn()
  api.feedback.mockRejectedValueOnce(new Error('internal details'))
  const render = (language: 'vi' | 'en') => act(async () => {
    root.render(<CommunityView language={language} hosted={false}
      onOpenLesson={openLesson} onOpenRoadmap={openRoadmap} />)
  })
  await render('en')
  expect(host.textContent).toContain('Could not load feedback')
  expect(host.textContent).not.toContain('internal details')
  api.feedback.mockResolvedValueOnce({ items: [item, { ...item, id: 2, status: 'pending', body: 'Private draft' }] })
  await act(async () => host.querySelector<HTMLButtonElement>('[role="alert"] button')!.click())
  expect(host.querySelectorAll('.community-feedback-card')).toHaveLength(1)
  expect(host.textContent).not.toContain('Private draft')
  expect(host.textContent).toContain(item.body)
  expect(host.textContent).toContain('Open lesson: Sample lesson')
  await act(async () => host.querySelector<HTMLButtonElement>('.community-feedback-card button')!.click())
  expect(openLesson).toHaveBeenCalledWith(lesson.slug)
  await render('vi')
  expect(host.textContent).toContain('Mở bài học: Bài mẫu')
  expect(api.feedback).toHaveBeenCalledTimes(2)
  await act(async () => {
    const select = host.querySelector('select')!
    select.value = 'typo'
    select.dispatchEvent(new Event('change', { bubbles: true }))
  })
  expect(host.textContent).toContain('Chưa có nhận xét phù hợp')
  await act(async () => host.querySelector<HTMLButtonElement>('.empty-state button')!.click())
  expect(openRoadmap).toHaveBeenCalledOnce()
})

test('hosted community explains feed availability without fetching local feedback', async () => {
  const openRoadmap = vi.fn()
  await act(async () => root.render(<CommunityView language="en" hosted
    onOpenLesson={vi.fn()} onOpenRoadmap={openRoadmap} />))
  expect(api.feedback).not.toHaveBeenCalled()
  expect(host.textContent).toContain('public feedback feed is not available yet')
  expect(host.querySelector('select')).toBeNull()
  await act(async () => host.querySelector('button')!.click())
  expect(openRoadmap).toHaveBeenCalledOnce()
})
