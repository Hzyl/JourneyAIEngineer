// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { JournalView } from '../components/JournalView'
import { HostedJournalEditor } from '../components/HostedJournalEditor'

const api = vi.hoisted(() => ({
  notes: vi.fn(async () => ({ notes: [] })),
  journalEntries: vi.fn(async () => ({ entries: [] })),
  upsertJournalEntry: vi.fn(),
  gitStatus: vi.fn(), gitDiff: vi.fn(), suggestedCommit: vi.fn(), exportJournal: vi.fn(),
}))
vi.mock('../platform/learning-client', () => ({ learningClient: api }))

let host: HTMLDivElement
let root: Root
beforeEach(() => {
  vi.useFakeTimers()
  vi.clearAllMocks()
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  vi.useRealTimers()
})
const fill = async (selector: string, value: string) => {
  const element = host.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector)!
  const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  await act(async () => {
    Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(element, value)
    element.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

test('English cloud journal validates fields before writing', async () => {
  const save = vi.fn()
  await act(async () => root.render(<HostedJournalEditor entries={[]} language="en" onSaved={save} />))
  await act(async () => host.querySelector<HTMLButtonElement>('button')!.click())
  expect(save).not.toHaveBeenCalled()
  expect(host.querySelector('[role="alert"]')!.textContent).toBe('Enter a title and reflection before saving.')
})

test('cloud journal locks pending edits, retains failed drafts and clears stale success', async () => {
  let fail: (cause: Error) => void = () => {}
  const save = vi.fn().mockImplementationOnce(() => new Promise<void>((_resolve, reject) => { fail = reject }))
    .mockResolvedValue(undefined)
  const render = (language: 'vi' | 'en') => root.render(
    <HostedJournalEditor entries={[]} language={language} onSaved={save} />,
  )
  await act(async () => render('en'))
  await fill('input[maxlength]', 'My title')
  await fill('textarea', 'Giữ nguyên nội dung.')
  await act(async () => {
    host.querySelector<HTMLButtonElement>('button')!.click()
    host.querySelector<HTMLButtonElement>('button')!.click()
  })
  expect(save).toHaveBeenCalledTimes(1)
  expect(host.querySelector('button')!.getAttribute('aria-busy')).toBe('true')
  expect([...host.querySelectorAll('input, textarea')].every((input) => input.hasAttribute('disabled'))).toBe(true)
  await act(async () => fail(new Error('Offline')))
  expect(host.querySelector<HTMLTextAreaElement>('textarea')!.value).toBe('Giữ nguyên nội dung.')
  expect(host.querySelector('[role="alert"]')!.textContent).toBe('Offline')
  await act(async () => render('vi'))
  expect(host.querySelector<HTMLInputElement>('input[maxlength]')!.value).toBe('My title')
  expect(host.querySelector<HTMLTextAreaElement>('textarea')!.value).toBe('Giữ nguyên nội dung.')
  await act(async () => host.querySelector<HTMLButtonElement>('button')!.click())
  expect(save).toHaveBeenCalledTimes(2)
  expect(host.querySelector('[role="status"]')!.textContent).toBe('Đã đồng bộ journal.')
  await fill('textarea', 'Draft update')
  expect(host.querySelector('[role="status"]')).toBeNull()
})

test('hosted journal reads cloud data without invoking Git and uses an English default question', async () => {
  const exportContext = vi.fn(async () => ({ path: 'context.md', content: 'My context' }))
  await act(async () => root.render(
    <JournalView hosted language="en" onExportContext={exportContext} />,
  ))
  await act(async () => vi.runOnlyPendingTimersAsync())
  expect(api.notes).toHaveBeenCalledTimes(1)
  expect(api.journalEntries).toHaveBeenCalledTimes(1)
  expect(api.gitStatus).not.toHaveBeenCalled()
  expect(api.gitDiff).not.toHaveBeenCalled()
  expect(api.suggestedCommit).not.toHaveBeenCalled()
  expect(host.querySelector('.git-card')).toBeNull()
  expect(host.textContent).toContain('No notes yet.')
  await act(async () => host.querySelector<HTMLButtonElement>('.ask-card > button')!.click())
  expect(exportContext).toHaveBeenCalledWith('Help me understand this topic with step-by-step hints.')
  expect(host.querySelector<HTMLTextAreaElement>('.context-preview')!.value).toBe('My context')
})
