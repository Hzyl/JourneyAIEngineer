// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { RoadmapView } from '../components/RoadmapView'

const roadmap = { phases: [
  { slug: 'phase-01-python-software', title_vi: 'Lập trình', title_en: 'Programming', modules: [
    { slug: 'python', title_vi: 'Nền tảng', title_en: 'Basics', lessons: [
      { slug: 'loops', title_vi: 'Vòng lặp', title_en: 'Loops', status: 'completed', estimated_minutes: 20 },
      { slug: 'functions', title_vi: 'Hàm', title_en: 'Functions', status: 'not_started', estimated_minutes: 25 },
    ] },
  ] },
  { slug: 'phase-00-onboarding', title_vi: 'Khởi đầu', title_en: 'Start here', modules: [
    { slug: 'setup', title_vi: 'Cài đặt', title_en: 'Setup', lessons: [
      { slug: 'intro', title_vi: 'Giới thiệu', title_en: 'Introduction', status: 'in_progress', estimated_minutes: 10 },
    ] },
  ] },
] }
let host: HTMLDivElement
let root: Root
const open = vi.fn()
const render = (showCompletedLessons = false, language: 'vi' | 'en' = 'en') => act(async () => {
  root.render(<RoadmapView roadmap={roadmap} language={language}
    showCompletedLessons={showCompletedLessons} onOpenLesson={open} />)
})
const restore = (url: string) => act(async () => {
  window.history.replaceState({}, '', url)
  window.dispatchEvent(new PopStateEvent('popstate'))
})
beforeEach(() => {
  window.history.replaceState({}, '', '/roadmap')
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.resetAllMocks()
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => { await act(async () => root.unmount()); host.remove() })

test('explicit completed filter overrides hide preference; clearing restores the explained preference', async () => {
  await render()
  expect(host.querySelectorAll('.lesson-row')).toHaveLength(2)
  expect(host.textContent).toContain('Completed lessons are hidden')
  await restore('/roadmap?status=completed')
  expect(host.querySelectorAll('.lesson-row')).toHaveLength(1)
  expect(host.querySelector('.lesson-row')!.textContent).toContain('Loops')
  expect(host.textContent).not.toContain('Completed lessons are hidden')
  await act(async () => host.querySelector<HTMLButtonElement>('.filter-bar button')!.click())
  expect(window.location.search).toBe('')
  expect(host.querySelectorAll('.lesson-row')).toHaveLength(2)
})

test('route ordering and bilingual search survive URL restoration and language changes', async () => {
  await restore('/roadmap?route=foundation')
  await render(true)
  expect(host.querySelector('.phase-header h3')!.textContent).toBe('Start here')
  await restore('/roadmap?route=foundation&q=Vòng+lặp')
  expect(host.querySelectorAll('.lesson-row')).toHaveLength(1)
  await act(async () => host.querySelector<HTMLButtonElement>('.lesson-row')!.click())
  expect(open).toHaveBeenCalledWith('loops')
  await render(true, 'vi')
  expect(host.querySelector('.lesson-row')!.textContent).toContain('Vòng lặp')
  expect(host.querySelector('input')!.value).toBe('Vòng lặp')
  await restore('/roadmap?q=not-found')
  expect(host.querySelectorAll('.lesson-row')).toHaveLength(0)
  expect(host.textContent).toContain('Không có bài phù hợp')
})
