// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { BackupSettings } from '../components/BackupSettings'
import type { BackupPayload } from '../api'

const api = vi.hoisted(() => ({ exportBackup: vi.fn(), previewBackup: vi.fn(), importBackup: vi.fn() }))
vi.mock('../platform/learning-client', () => ({ learningClient: api }))
const payload: BackupPayload = {
  schema_version: 1, app_version: '0.1.2', exported_at: '2026-10-08T00:00:00Z',
  settings: { language: 'vi' }, progress: [], review_state: [], review_history: [],
  study_sessions: [], notes: [], journal_files: [],
}
const preview = { valid: true, errors: [], counts: { progress: 0, notes: 0, journal_files: 1 },
  replaces: { progress: 2, notes: 3 }, warnings: [], journal_conflicts: ['first.md'] }
const reload = vi.fn()
let host: HTMLDivElement
let root: Root
beforeEach(async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.resetAllMocks()
  vi.useFakeTimers()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  vi.stubGlobal('URL', { createObjectURL: vi.fn().mockReturnValue('blob:backup'), revokeObjectURL: vi.fn() })
  api.previewBackup.mockResolvedValue(preview)
  api.importBackup.mockResolvedValue({ imported: true, safety_backup_json: 'safety.json' })
  reload.mockResolvedValue(undefined)
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  await act(async () => root.render(<BackupSettings language="en" onRestored={reload} />))
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
const field = () => host.querySelector('textarea')!
const button = (index: number) => host.querySelectorAll<HTMLButtonElement>('.backup-actions button')[index]
const fill = (value: string) => act(async () => {
  Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(field(), value)
  field().dispatchEvent(new Event('input', { bubbles: true }))
})
const click = (index: number) => act(async () => button(index).click())

test('pending preview locks editing and all actions and never permits duplicate requests', async () => {
  let resolve!: (value: typeof preview) => void
  api.previewBackup.mockReturnValueOnce(new Promise((done) => { resolve = done }))
  await fill(JSON.stringify(payload))
  await act(async () => { button(1).click(); button(1).click() })
  expect(api.previewBackup).toHaveBeenCalledTimes(1)
  expect(field().disabled).toBe(true)
  expect([...host.querySelectorAll('button')].every((item) => item.disabled)).toBe(true)
  expect(button(1).getAttribute('aria-busy')).toBe('true')
  await act(async () => resolve(preview))
  expect(field().disabled).toBe(false)
  expect(button(2).disabled).toBe(false)
  expect(host.textContent).toContain('first.md')
  expect(host.textContent).toContain('2 existing, replaced')
})

test('editing invalidates the reviewed source and importing uses exactly the newly reviewed payload', async () => {
  await fill(JSON.stringify(payload))
  await click(1)
  const changed = { ...payload, settings: { language: 'en' } }
  await fill(JSON.stringify(changed))
  expect(button(2).disabled).toBe(true)
  await click(2)
  expect(api.importBackup).not.toHaveBeenCalled()
  await click(1)
  await act(async () => { button(2).click(); button(2).click() })
  expect(api.importBackup).toHaveBeenCalledExactlyOnceWith(changed)
  expect(reload).toHaveBeenCalledOnce()
  expect(host.textContent).toContain('Safety backup: safety.json')
  expect(button(2).disabled).toBe(true)
})

test('exporting replaces the text and invalidates any earlier preview', async () => {
  await fill(JSON.stringify(payload))
  await click(1)
  const exported = { ...payload, settings: { language: 'en' } }
  api.exportBackup.mockResolvedValue({ payload: exported, json_path: 'backup.json' })
  await click(0)
  expect(JSON.parse(field().value)).toEqual(exported)
  expect(button(2).disabled).toBe(true)
  expect(host.querySelector('.backup-preview')).toBeNull()
  expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledOnce()
})

test('invalid JSON and network failures preserve text without enabling restore', async () => {
  await fill('{bad json')
  await click(1)
  expect(api.previewBackup).not.toHaveBeenCalled()
  expect(field().value).toBe('{bad json')
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('Check the JSON')
  api.previewBackup.mockRejectedValueOnce(new Error('network'))
  await fill(JSON.stringify(payload))
  await click(1)
  expect(button(2).disabled).toBe(true)
  expect(JSON.parse(field().value)).toEqual(payload)
  await click(1)
  expect(button(2).disabled).toBe(false)
})

test('canceling restore does not write, while a failed import requires a new preview', async () => {
  await fill(JSON.stringify(payload))
  await click(1)
  vi.mocked(window.confirm).mockReturnValueOnce(false)
  await click(2)
  expect(api.importBackup).not.toHaveBeenCalled()
  expect(button(2).disabled).toBe(false)
  api.importBackup.mockRejectedValueOnce(new Error('disk'))
  await click(2)
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('Could not import')
  expect(button(2).disabled).toBe(true)
  expect(JSON.parse(field().value)).toEqual(payload)
  expect(reload).not.toHaveBeenCalled()
})

test('a refresh failure after successful import keeps its receipt and does not suggest importing again', async () => {
  reload.mockRejectedValueOnce(new Error('reload failed'))
  await fill(JSON.stringify(payload))
  await click(1)
  await click(2)
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('do not import again')
  expect(host.textContent).toContain('safety.json')
  expect(button(2).disabled).toBe(true)
})
