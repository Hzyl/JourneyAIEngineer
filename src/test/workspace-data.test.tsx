// @vitest-environment jsdom
import { act, useEffect } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { useWorkspaceData } from '../components/useWorkspaceData'

const api = vi.hoisted(() => ({
  dashboard: vi.fn(), roadmap: vi.fn(), reviews: vi.fn(), exercises: vi.fn(), tools: vi.fn(),
  resources: vi.fn(), settings: vi.fn(), health: vi.fn(), updateSettings: vi.fn(),
}))
vi.mock('../platform/learning-client', () => ({ learningClient: api }))
const preferences = {
  language: 'vi', track: 'standard', weekly_goal_minutes: 720, show_completed_lessons: true,
  target_role: 'internship', experience_level: 'beginner', onboarding_complete: false,
}
const pending = () => {
  let resolve!: (value: unknown) => void
  let reject!: (value: unknown) => void
  const promise = new Promise((done, fail) => { resolve = done; reject = fail })
  return { promise, resolve, reject }
}
let model: ReturnType<typeof useWorkspaceData>
function Probe() {
  const workspace = useWorkspaceData()
  useEffect(() => { model = workspace }, [workspace])
  return <output>{JSON.stringify({ language: workspace.settings.language, dashboard: workspace.dashboard })}</output>
}
let root: Root
let host: HTMLDivElement
let unmounted: boolean
beforeEach(() => {
  vi.resetAllMocks()
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  api.dashboard.mockResolvedValue({ marker: 'initial' })
  api.roadmap.mockResolvedValue({ phases: [] })
  api.reviews.mockResolvedValue({ items: [{ id: 'card-a' }] })
  api.exercises.mockResolvedValue({ exercises: [] })
  api.tools.mockResolvedValue({ tools: [] })
  api.resources.mockResolvedValue({ resources: [] })
  api.settings.mockResolvedValue(preferences)
  api.health.mockResolvedValue({ git_publish_available: false })
  api.updateSettings.mockImplementation(async (patch) => ({ ...preferences, ...patch }))
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  unmounted = false
})
afterEach(async () => {
  if (!unmounted) await act(async () => root.unmount())
  host.remove()
})
const render = () => act(async () => root.render(<Probe />))

test('initial load and explicit retry recover without storing raw provider errors', async () => {
  api.dashboard.mockRejectedValueOnce(new Error('Private database detail'))
  await render()
  expect(model.loaded).toBe(false)
  expect(model.failed).toBe(true)
  expect(model.loading).toBe(false)
  expect(host.textContent).not.toContain('Private database detail')
  await act(async () => model.reload())
  expect(model.loaded).toBe(true)
  expect(model.failed).toBe(false)
})

test.each(['success', 'failure'])('an old read ending in %s cannot replace a newer snapshot', async (outcome) => {
  await render()
  const old = pending()
  api.dashboard.mockReturnValueOnce(old.promise)
  let first!: Promise<void>
  await act(async () => { first = model.refresh() })
  api.dashboard.mockResolvedValueOnce({ marker: 'new snapshot' })
  await act(async () => model.refresh())
  await act(async () => {
    if (outcome === 'success') old.resolve({ marker: 'obsolete snapshot' })
    else old.reject(new Error('Old failure'))
    await first
  })
  expect(host.textContent).toContain('new snapshot')
  expect(model.failed).toBe(false)
  expect(model.loading).toBe(false)
})

test('an old settings read cannot overwrite a newer successful language save', async () => {
  await render()
  const old = pending()
  api.settings.mockReturnValueOnce(old.promise)
  let reading!: Promise<void>
  await act(async () => { reading = model.refresh() })
  await act(async () => model.changeLanguage())
  expect(model.settings.language).toBe('en')
  await act(async () => { old.resolve(preferences); await reading })
  expect(model.settings.language).toBe('en')
})

test('manual reloads in one event make only one new request batch', async () => {
  await render()
  const response = pending()
  api.dashboard.mockReturnValueOnce(response.promise)
  let reading!: Promise<void>
  await act(async () => { reading = model.reload(); void model.reload() })
  expect(api.dashboard).toHaveBeenCalledTimes(2)
  expect(api.settings).toHaveBeenCalledTimes(2)
  await act(async () => { response.resolve({ marker: 'reloaded' }); await reading })
})

test('failed refresh preserves loaded content and can recover', async () => {
  await render()
  api.dashboard.mockRejectedValueOnce(new Error('Offline'))
  await act(async () => model.refresh())
  expect(model.failed).toBe(true)
  expect(model.loaded).toBe(true)
  expect(host.textContent).toContain('initial')
  await act(async () => model.reload())
  expect(model.failed).toBe(false)
})

test('preference writes share a lock and do not silently accept a conflicting write', async () => {
  await render()
  const response = pending()
  api.updateSettings.mockReturnValueOnce(response.promise)
  let saving!: Promise<void>
  await act(async () => { saving = model.saveSettings({ weekly_goal_minutes: 480 }) })
  expect(model.settingsSaving).toBe(true)
  await act(async () => model.changeLanguage())
  await expect(model.saveSettings({ track: 'accelerated' })).rejects.toThrow('đang được lưu')
  expect(api.updateSettings).toHaveBeenCalledOnce()
  await act(async () => { response.resolve({ ...preferences, weekly_goal_minutes: 480 }); await saving })
  expect(model.settingsSaving).toBe(false)
  expect(model.settings.weekly_goal_minutes).toBe(480)
})

test('language retry writes the intended language and does not substitute a data reload', async () => {
  await render()
  api.updateSettings.mockRejectedValueOnce(new Error('Private settings detail'))
  await act(async () => model.changeLanguage())
  expect(model.languageFailed).toBe(true)
  expect(model.settings.language).toBe('vi')
  expect(model.settingsSaving).toBe(false)
  await act(async () => model.changeLanguage())
  expect(model.languageFailed).toBe(false)
  expect(model.settings.language).toBe('en')
  expect(api.updateSettings).toHaveBeenNthCalledWith(2, { language: 'en' })
  expect(api.dashboard).toHaveBeenCalledOnce()
})

test('a late snapshot cannot repopulate a removed view', async () => {
  const response = pending()
  api.dashboard.mockReturnValueOnce(response.promise)
  await render()
  await act(async () => root.unmount())
  unmounted = true
  await act(async () => response.resolve({ marker: 'private old data' }))
  expect(host.textContent).toBe('')
})
