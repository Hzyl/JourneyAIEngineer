// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { LessonPage } from '../components/LessonPage'
import { lessonFixture } from './lesson-fixture'

const state = vi.hoisted(() => ({ owner: 'owner-a' }))
vi.mock('../auth/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: state.owner } } }) }))
vi.mock('../platform/runtime-config', () => ({ runtimeConfig: { mode: 'hosted' } }))
vi.mock('../platform/learning-client', () => ({ learningClient: { createNote: vi.fn() } }))
vi.mock('../components/FeedbackPanel', () => ({ FeedbackPanel: () => null }))
let host: HTMLDivElement
let root: Root
const onExercise = vi.fn()
const onLesson = vi.fn()
const onProgress = vi.fn()
const render = (language: 'vi' | 'en' = 'en', lesson = lessonFixture) => act(async () => {
  root.render(<LessonPage lesson={lesson} lessonLoading={false} language={language} onBack={() => {}}
    onProgress={onProgress} onOpenLesson={onLesson} onOpenExercise={onExercise}
    nextLessonTitles={{ 'earlier-lesson': 'Earlier lesson', 'next-lesson': 'Next topic' }} />)
})
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.resetAllMocks()
  state.owner = 'owner-a'
  window.localStorage.clear()
  window.history.replaceState({}, '', '/lesson/lesson-one')
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  HTMLElement.prototype.scrollIntoView = vi.fn()
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test('English lesson controls use localized labels and open the exact exercise and prerequisite', async () => {
  await render()
  expect(host.querySelector('.session-minutes')!.textContent).toBe('Study minutes')
  expect(host.querySelector('.resource-link b')!.textContent).toContain('Open resource')
  expect(host.querySelector('.ask-box p')!.textContent).toContain('Open Journal')
  await act(async () => host.querySelector<HTMLButtonElement>('.linked-exercise button')!.click())
  expect(onExercise).toHaveBeenCalledExactlyOnceWith('exercise-0-environment')
  await act(async () => host.querySelector<HTMLButtonElement>('.lesson-check-block button')!.click())
  expect(onLesson).toHaveBeenCalledExactlyOnceWith('earlier-lesson')
  expect(onProgress).not.toHaveBeenCalled()
})

test('anchor navigation moves keyboard focus and direct fragment URLs restore the reading position', async () => {
  window.history.replaceState({}, '', '/lesson/lesson-one#notes')
  await render()
  expect(document.activeElement).toBe(host.querySelector('#notes'))
  await act(async () => host.querySelector<HTMLAnchorElement>('a[href="#concept"]')!.click())
  expect(document.activeElement).toBe(host.querySelector('#concept'))
  expect(window.location.hash).toBe('#concept')
  expect(HTMLElement.prototype.scrollIntoView).toHaveBeenLastCalledWith({ behavior: 'auto', block: 'start' })
})

test('changing language preserves checklist ticks while changing accounts clears them', async () => {
  await render()
  await act(async () => host.querySelector<HTMLInputElement>('.checklist input')!.click())
  expect(JSON.parse(localStorage.getItem('journey-checklist:user:owner-a:lesson-one')!)).toEqual([true, false])
  await render('vi')
  expect(host.querySelector<HTMLInputElement>('.checklist input')!.checked).toBe(true)
  expect(host.querySelector('.checklist label')!.textContent).toBe('Chạy Python')
  state.owner = 'owner-b'
  await render('vi')
  expect(host.querySelector<HTMLInputElement>('.checklist input')!.checked).toBe(false)
  expect(JSON.parse(localStorage.getItem('journey-checklist:user:owner-a:lesson-one')!)).toEqual([true, false])
})

test('checklist reminders focus the check section and opening answers never completes a lesson', async () => {
  await render()
  await act(async () => host.querySelector<HTMLButtonElement>('.detail-actions button')!.click())
  expect(document.activeElement).toBe(host.querySelector('#check'))
  expect(host.textContent).toContain('Finish every checklist item')
  await act(async () => host.querySelector<HTMLButtonElement>('.study-step-toggle')!.click())
  await act(async () => host.querySelector<HTMLElement>('.study-step-answer summary')!.click())
  expect(onProgress).not.toHaveBeenCalled()
})

test.each(['vi', 'en'] as const)('%s concept notes render separate paragraphs and escape markup', async (language) => {
  const paragraphs = [
    language === 'vi' ? 'Đoạn đầu giải thích khái niệm.' : 'The first paragraph explains the concept.',
    '<img src=x onerror="alert(1)"> & <script>alert(2)</script>',
    language === 'vi' ? 'Đoạn cuối nêu cách tự kiểm tra.' : 'The last paragraph explains the self-check.',
  ]
  const concept = `\n${paragraphs[0]}\n\n${paragraphs[1]}\n${paragraphs[2]}\n`
  await render(language, { ...lessonFixture,
    concept_notes_vi: language === 'vi' ? concept : 'Không hiển thị câu này.',
    concept_notes_en: language === 'en' ? concept : 'This sentence must not be shown.',
  })
  const container = host.querySelector('.concept-notes')!
  expect([...container.querySelectorAll(':scope > p')].map((node) => node.textContent)).toEqual(paragraphs)
  expect(container.children).toHaveLength(3)
  expect(container.querySelector('img, script')).toBeNull()
  expect(container.innerHTML).toContain('&lt;img')
  expect(container.innerHTML).toContain('&lt;script&gt;')
  expect(onProgress).not.toHaveBeenCalled()
})
