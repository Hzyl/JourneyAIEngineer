// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { SecurityLabView } from '../components/SecurityLabView'
import { securityReport } from './security-fixture'

const api = vi.hoisted(() => ({ securityAudit: vi.fn() }))
vi.mock('../platform/learning-client', () => ({ learningClient: api }))
let host: HTMLDivElement
let root: Root
let unmounted: boolean
const render = (language: 'vi' | 'en' = 'en') => act(async () => {
  root.render(<SecurityLabView language={language} />)
})
const change = (select: HTMLSelectElement, value: string) => act(async () => {
  select.value = value
  select.dispatchEvent(new Event('change', { bubbles: true }))
})
const pending = () => {
  let resolve!: (value: unknown) => void
  const promise = new Promise((done) => { resolve = done })
  return { promise, resolve }
}
beforeEach(() => {
  vi.resetAllMocks()
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  api.securityAudit.mockResolvedValue(securityReport)
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  unmounted = false
})
afterEach(async () => {
  if (!unmounted) await act(async () => root.unmount())
  host.remove()
})

test('language switches translate evidence, limitations and filters without rescanning', async () => {
  await render()
  expect(host.textContent).toContain('SQL query is built with an f-string')
  expect(host.textContent).toContain('Review dynamic values.')
  expect(host.textContent).toContain('Does not certify application security.')
  await change(host.querySelectorAll('select')[1], 'needs_human_review')
  expect(host.querySelectorAll('article')).toHaveLength(1)
  await render('vi')
  expect(host.textContent).toContain('Kiểm tra giá trị động.')
  expect(host.textContent).toContain('Không chứng nhận ứng dụng an toàn.')
  expect(host.querySelectorAll('select')[1].value).toBe('needs_human_review')
  expect(host.querySelectorAll('article')).toHaveLength(1)
  expect(api.securityAudit).toHaveBeenCalledOnce()
})

test('an empty filter can be cleared without making another request', async () => {
  await render()
  await change(host.querySelector('select')!, 'critical')
  expect(host.querySelector('.security-empty')?.textContent).toContain('No matching findings')
  await act(async () => host.querySelector<HTMLButtonElement>('.security-empty button')!.click())
  expect(host.querySelectorAll('article')).toHaveLength(2)
  expect(host.querySelector('select')!.value).toBe('all')
  expect(api.securityAudit).toHaveBeenCalledOnce()
})

test('initial failure offers localized retry without leaking server details', async () => {
  api.securityAudit.mockRejectedValueOnce(new Error('Private filesystem path'))
  await render()
  expect(host.querySelector('[role="alert"]')?.textContent).toContain('Could not load the report')
  expect(host.textContent).not.toContain('Private filesystem path')
  await render('vi')
  expect(host.querySelector('[role="alert"]')?.textContent).toContain('Chưa tải được báo cáo')
  await act(async () => host.querySelector<HTMLButtonElement>('[role="alert"] button')!.click())
  expect(host.querySelector('[role="alert"]')).toBeNull()
  expect(host.querySelectorAll('article')).toHaveLength(2)
})

test('failed refresh keeps visible findings and labels them as previous results', async () => {
  await render()
  api.securityAudit.mockRejectedValueOnce(new Error('Disconnected'))
  await act(async () => host.querySelector<HTMLButtonElement>('.security-refresh')!.click())
  expect(host.querySelectorAll('article')).toHaveLength(2)
  expect(host.querySelector('[role="alert"]')?.textContent).toContain('Previous results are still shown')
})

test('pending refresh rejects duplicate clicks and keeps findings until the result arrives', async () => {
  await render()
  const next = pending()
  api.securityAudit.mockReturnValueOnce(next.promise)
  const button = host.querySelector<HTMLButtonElement>('.security-refresh')!
  await act(async () => { button.click(); button.click() })
  expect(api.securityAudit).toHaveBeenCalledTimes(2)
  expect(button.disabled).toBe(true)
  expect(button.getAttribute('aria-busy')).toBe('true')
  expect(host.querySelectorAll('article')).toHaveLength(2)
  await act(async () => next.resolve({ ...securityReport, findings: [] }))
  expect(host.querySelector('.security-empty')).not.toBeNull()
  expect(button.disabled).toBe(false)
})

test('leaving the view retires a delayed audit response', async () => {
  const next = pending()
  api.securityAudit.mockReturnValueOnce(next.promise)
  await render()
  expect(host.querySelector('[role="status"]')?.textContent).toContain('Reading source')
  await act(async () => root.unmount())
  unmounted = true
  await act(async () => next.resolve(securityReport))
  expect(host.textContent).toBe('')
})
