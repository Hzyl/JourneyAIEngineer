// @vitest-environment jsdom
import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { useLesson } from '../components/useLesson'
import { lessonFixture } from './lesson-fixture'
import type { Lesson } from '../api'

const api = vi.hoisted(() => ({ lesson: vi.fn() }))
vi.mock('../platform/learning-client', () => ({ learningClient: api }))
let host: HTMLDivElement
let root: Root
beforeEach(() => {
  vi.resetAllMocks()
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
})
function Content({ lesson }: { lesson: Lesson }) {
  const [draft, setDraft] = useState('')
  return <><p>{lesson.title_en}</p><textarea value={draft} onChange={(event) => setDraft(event.target.value)} /></>
}
function Harness({ slug, enabled }: { slug: string | null; enabled: boolean }) {
  const result = useLesson(slug, enabled)
  return <>
    {result.loading && <span role="status">Loading</span>}
    {result.error && <span role="alert">Failed</span>}
    {result.lesson && <Content key={result.lesson.slug} lesson={result.lesson} />}
    <button onClick={result.reload}>Reload</button>
  </>
}
const render = (slug: string | null, enabled = true) => act(async () => {
  root.render(<Harness slug={slug} enabled={enabled} />)
})
const pending = () => {
  let resolve!: (value: Lesson) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<Lesson>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}

test('a late response cannot replace the lesson selected more recently', async () => {
  const first = pending()
  const second = pending()
  api.lesson.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise)
  await render('first')
  expect(host.querySelector('[role="status"]')).not.toBeNull()
  await render('second')
  await act(async () => second.resolve({ ...lessonFixture, slug: 'second', title_en: 'Current lesson' }))
  expect(host.textContent).toContain('Current lesson')
  await act(async () => first.resolve({ ...lessonFixture, slug: 'first', title_en: 'Old lesson' }))
  expect(host.textContent).not.toContain('Old lesson')
  expect(host.querySelector('[role="status"]')).toBeNull()
})

test.each([true, false])('leaving or disabling a lesson discards late errors, enabled=%s', async (enabled) => {
  const first = pending()
  api.lesson.mockReturnValue(first.promise)
  await render('first')
  await render(enabled ? null : 'first', enabled)
  await act(async () => first.reject(new Error('Old request failed')))
  expect(host.querySelector('[role="alert"]')).toBeNull()
  expect(host.querySelector('[role="status"]')).toBeNull()
  expect(host.querySelector('textarea')).toBeNull()
})

test('retry clears a failure and same-lesson refresh preserves an unsaved draft', async () => {
  api.lesson.mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce(lessonFixture)
  await render(lessonFixture.slug)
  expect(host.querySelector('[role="alert"]')).not.toBeNull()
  await act(async () => host.querySelector('button')!.click())
  expect(host.querySelector('[role="alert"]')).toBeNull()
  const input = host.querySelector('textarea')!
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(input, 'Keep my draft')
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
  const refresh = pending()
  api.lesson.mockReturnValueOnce(refresh.promise)
  await act(async () => host.querySelector('button')!.click())
  expect(host.querySelector('textarea')).toBe(input)
  expect(host.querySelector('[role="status"]')).toBeNull()
  await act(async () => refresh.resolve({ ...lessonFixture, status: 'completed' }))
  expect(host.querySelector('textarea')?.value).toBe('Keep my draft')
  const failedRefresh = pending()
  api.lesson.mockReturnValueOnce(failedRefresh.promise)
  await act(async () => host.querySelector('button')!.click())
  await act(async () => failedRefresh.reject(new Error('Offline again')))
  expect(host.querySelector('[role="alert"]')).not.toBeNull()
  expect(host.querySelector('textarea')?.value).toBe('Keep my draft')
})
