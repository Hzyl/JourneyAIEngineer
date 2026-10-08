// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test } from 'vitest'
import { ResourcesView } from '../components/ResourcesView'
import type { ReferenceResource } from '../api'

const resources: ReferenceResource[] = [{
  slug: 'math-book', title_vi: 'Sách toán', title_en: 'Math book', provider: 'Example Author',
  url: 'https://example.com/book', type: 'Book', language: 'en', level: 'beginner', official: false,
  phase_ids: ['phase-02'], description_vi: 'Học đại số', description_en: 'Learn algebra',
  how_to_use_vi: 'Đọc chương một.', how_to_use_en: 'Read chapter one.',
}, {
  slug: 'internal-docs', title_vi: 'Hướng dẫn Python', title_en: 'Python guide', provider: 'Example project',
  url: '', type: 'Official docs', language: 'vi', level: 'beginner', official: true,
  phase_ids: ['phase-01'], description_vi: 'Dữ liệu mẫu', description_en: 'Sample data',
  how_to_use_vi: 'Chạy ví dụ.', how_to_use_en: 'Run the example.',
}]
let host: HTMLDivElement
let root: Root
beforeEach(() => {
  window.history.replaceState({}, '', '/resources')
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
})
const render = (language: 'vi' | 'en') => act(async () => {
  root.render(<ResourcesView resources={resources} language={language} />)
})
const fill = (value: string) => act(async () => {
  const input = host.querySelector('input')!
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
})

test('resource language updates headings, source labels and phases without changing source URLs', async () => {
  await render('en')
  expect(host.querySelector('h2')!.textContent).toContain('Learn from sources')
  expect(host.textContent).toContain('Math & Machine Learning')
  expect(host.textContent).not.toContain('Toán &')
  expect(host.textContent).toContain('Community reference')
  expect(host.textContent).toContain('This content is available in the app.')
  expect(host.querySelector('a')!.href).toBe('https://example.com/book')
  await render('vi')
  expect(host.textContent).toContain('Học từ nguồn')
  expect(host.textContent).toContain('Nguồn chính thức')
  expect(host.textContent).toContain('Nguồn cộng đồng')
  expect(host.textContent).toContain('Tài liệu chính thức')
  expect(host.querySelector('a')!.href).toBe('https://example.com/book')
})

test('deep links and filters retain raw keys when language changes, with localized empty state', async () => {
  window.history.replaceState({}, '', '/resources?phase=phase-02&type=Book&extra=keep')
  await render('en')
  expect(host.querySelectorAll('.resource-card')).toHaveLength(1)
  await fill('Sách toán')
  expect(host.querySelectorAll('.resource-card')).toHaveLength(1)
  await render('vi')
  expect(host.querySelector<HTMLInputElement>('input')!.value).toBe('Sách toán')
  expect(host.querySelector<HTMLSelectElement>('#resource-type')!.value).toBe('Book')
  expect(new URLSearchParams(window.location.search).get('extra')).toBe('keep')
  await fill('not found')
  expect(host.querySelectorAll('.resource-card')).toHaveLength(0)
  expect(host.textContent).toContain('Không tìm thấy tài liệu')
  await render('en')
  expect(host.textContent).toContain('No resources found')
})

test('browser history restores filters without changing an unrelated route', async () => {
  await render('en')
  await act(async () => {
    window.history.pushState({}, '', '/resources?q=Python&type=Official+docs')
    window.dispatchEvent(new PopStateEvent('popstate'))
  })
  expect(host.querySelector<HTMLInputElement>('input')!.value).toBe('Python')
  expect(host.querySelectorAll('.resource-card')).toHaveLength(1)
  expect(host.querySelector('.resource-card')!.textContent).toContain('Python guide')
  window.history.replaceState({}, '', '/roadmap')
  await fill('Other')
  expect(window.location.pathname).toBe('/roadmap')
})
