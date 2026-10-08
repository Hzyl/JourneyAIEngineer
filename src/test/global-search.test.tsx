// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { GlobalSearch } from '../components/GlobalSearch'
import { searchDestination } from '../components/search-destination'
import type { SearchResult } from '../api'

const api = vi.hoisted(() => ({ search: vi.fn() }))
vi.mock('../platform/learning-client', () => ({ learningClient: api }))
const python: SearchResult = { type: 'lesson', id: 'python', title: 'Học Python', title_en: 'Learn Python' }
const sql: SearchResult = { type: 'exercise', id: 'sql', title: 'Bài tập SQL', title_en: 'SQL exercise' }
const select = vi.fn()
let host: HTMLDivElement
let root: Root
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.useFakeTimers()
  vi.resetAllMocks()
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  vi.useRealTimers()
})
const render = (language: 'vi' | 'en' = 'en') => act(async () => {
  root.render(<GlobalSearch language={language} onSelect={select} />)
})
const input = () => host.querySelector('input')!
const fill = (value: string) => act(async () => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input(), value)
  input().dispatchEvent(new Event('input', { bubbles: true }))
})
const tick = () => act(async () => { await vi.advanceTimersByTimeAsync(221) })
const key = (key: string) => act(async () => {
  input().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
})

test('out-of-order responses cannot replace the current query and clearing hides pending results', async () => {
  let resolveOld!: (value: { results: SearchResult[] }) => void
  let resolveNew!: (value: { results: SearchResult[] }) => void
  api.search.mockReturnValueOnce(new Promise((resolve) => { resolveOld = resolve }))
    .mockReturnValueOnce(new Promise((resolve) => { resolveNew = resolve }))
  await render()
  await fill('py')
  await tick()
  await fill('sql')
  await tick()
  await act(async () => resolveNew({ results: [sql] }))
  expect(host.textContent).toContain('SQL exercise')
  await act(async () => resolveOld({ results: [python] }))
  expect(host.textContent).not.toContain('Learn Python')
  expect(host.textContent).toContain('SQL exercise')
  await fill('')
  expect(host.querySelector('[role="listbox"]')).toBeNull()
  expect(input().getAttribute('aria-expanded')).toBe('false')
})

test('keyboard navigation keeps input focus, localizes results and opens the selected item once', async () => {
  api.search.mockResolvedValue({ results: [python, sql] })
  await render('vi')
  await fill('python')
  await tick()
  await act(async () => input().focus())
  expect(host.textContent).toContain('Học Python')
  await render('en')
  expect(host.textContent).toContain('Learn Python')
  expect(host.textContent).not.toContain('Học Python')
  expect(api.search).toHaveBeenCalledOnce()
  await key('ArrowDown')
  let option = document.getElementById(input().getAttribute('aria-activedescendant')!)!
  expect(option.textContent).toContain('Learn Python')
  expect(option.getAttribute('aria-selected')).toBe('true')
  expect(document.activeElement).toBe(input())
  await key('Escape')
  expect(host.querySelector('[role="listbox"]')).toBeNull()
  expect(input().value).toBe('python')
  await key('ArrowUp')
  option = document.getElementById(input().getAttribute('aria-activedescendant')!)!
  expect(option.textContent).toContain('SQL exercise')
  await key('Enter')
  await key('Enter')
  expect(select).toHaveBeenCalledExactlyOnceWith(sql)
  expect(input().value).toBe('')
})

test('search failures preserve input and retry instead of pretending there are no matches', async () => {
  api.search.mockRejectedValueOnce(new Error('private server details')).mockResolvedValueOnce({ results: [] })
  await render()
  await fill('example')
  await tick()
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('Search failed')
  expect(host.textContent).not.toContain('private server details')
  expect(host.textContent).not.toContain('No results')
  expect(input().value).toBe('example')
  await act(async () => host.querySelector<HTMLButtonElement>('[role="alert"] button')!.click())
  expect(host.textContent).toContain('Searching')
  await tick()
  expect(host.textContent).toContain('No results')
  expect(api.search).toHaveBeenCalledTimes(2)
})

test('shortcut focuses the search and short queries never call the service', async () => {
  await render()
  await act(async () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })))
  expect(document.activeElement).toBe(input())
  await fill('p')
  await tick()
  expect(api.search).not.toHaveBeenCalled()
  expect(input().maxLength).toBe(120)
})

test('destinations retain exact exercise identities and encode query values as data', () => {
  expect(searchDestination(sql, 'en')).toBe('/exercises?exercise=sql')
  expect(searchDestination(python, 'en')).toBe('/lesson/python')
  expect(searchDestination({ type: 'resource', id: 'r', title: 'A & B', title_en: 'C & D' }, 'en'))
    .toBe('/resources?q=C+%26+D')
  expect(searchDestination({ type: 'module', id: 'm', title: 'Python', phase: 'phase-01' }, 'vi'))
    .toBe('/roadmap?phase=phase-01&q=Python')
})
