// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { Blob as NodeBlob } from 'node:buffer'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { CloudDataSettings } from '../components/CloudDataSettings'
import catalogVersion from '../../content/catalog-version.json'

const api = vi.hoisted(() => ({ user: vi.fn(), rpc: vi.fn(), subscribe: vi.fn(), unsubscribe: vi.fn() }))
vi.mock('../platform/hosted/supabase-client', () => ({
  requireHostedUser: api.user,
  requireSupabase: () => ({ rpc: api.rpc, auth: { onAuthStateChange: api.subscribe } }),
}))
vi.mock('../components/DeleteAccount', () => ({ DeleteAccount: () => null }))
const snapshot = { owner_id: 'owner-a', notes: [{ body: 'My learning note' }] }
let authChanged: (event: string, session: { user: { id: string } } | null) => void
let host: HTMLDivElement
let root: Root
let unmounted: boolean
beforeEach(async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.resetAllMocks()
  vi.useFakeTimers()
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  vi.stubGlobal('Blob', NodeBlob)
  vi.stubGlobal('URL', { createObjectURL: vi.fn().mockReturnValue('blob:export'), revokeObjectURL: vi.fn() })
  api.user.mockResolvedValue({ id: 'owner-a' })
  api.rpc.mockResolvedValue({ data: snapshot, error: null })
  api.subscribe.mockImplementation((callback) => {
    authChanged = callback
    callback('INITIAL_SESSION', { user: { id: 'owner-a' } })
    return { data: { subscription: { unsubscribe: api.unsubscribe } } }
  })
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  unmounted = false
  await act(async () => root.render(<CloudDataSettings language="en" />))
})
afterEach(async () => {
  if (!unmounted) await act(async () => root.unmount())
  host.remove()
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
const button = () => host.querySelector('button')!
const click = () => act(async () => button().click())
const pendingExport = () => {
  let resolve!: (value: { data: typeof snapshot; error: null }) => void
  api.rpc.mockReturnValueOnce(new Promise((done) => { resolve = done }))
  return () => resolve({ data: snapshot, error: null })
}

test('duplicate clicks export one full snapshot and release the download URL', async () => {
  const resolve = pendingExport()
  await act(async () => { button().click(); button().click() })
  expect(api.rpc).toHaveBeenCalledExactlyOnceWith('export_learning_snapshot')
  expect(button().disabled).toBe(true)
  expect(button().getAttribute('aria-busy')).toBe('true')
  await act(async () => resolve())
  expect(api.user).toHaveBeenCalledTimes(2)
  expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledOnce()
  const blob = vi.mocked(URL.createObjectURL).mock.calls[0][0] as Blob
  const text = await blob.text()
  expect(JSON.parse(text)).toEqual({ ...snapshot, catalog: catalogVersion })
  expect(host.querySelector('[role="status"]')!.textContent).toContain('Export created')
  expect(button().disabled).toBe(false)
  vi.advanceTimersByTime(1000)
  expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:export')
})

test('a snapshot for another owner is never downloaded', async () => {
  api.rpc.mockResolvedValueOnce({ data: { ...snapshot, owner_id: 'owner-b' }, error: null })
  await click()
  expect(URL.createObjectURL).not.toHaveBeenCalled()
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('account changed')
})

test('a different current account after the RPC prevents downloading the earlier snapshot', async () => {
  api.user.mockResolvedValueOnce({ id: 'owner-a' }).mockResolvedValueOnce({ id: 'owner-b' })
  await click()
  expect(URL.createObjectURL).not.toHaveBeenCalled()
  expect(host.textContent).toContain('No file was downloaded')
})

test('signing out and back into the same account invalidates a pending export', async () => {
  const resolve = pendingExport()
  await click()
  await act(async () => {
    authChanged('SIGNED_OUT', null)
    authChanged('SIGNED_IN', { user: { id: 'owner-a' } })
    resolve()
  })
  expect(URL.createObjectURL).not.toHaveBeenCalled()
  expect(host.textContent).toContain('account changed')
})

test('leaving the screen unsubscribes and discards an unfinished export', async () => {
  const resolve = pendingExport()
  await click()
  await act(async () => root.unmount())
  unmounted = true
  await act(async () => resolve())
  expect(api.unsubscribe).toHaveBeenCalledOnce()
  expect(URL.createObjectURL).not.toHaveBeenCalled()
})

test('RPC errors are localized without provider details and a successful retry clears the error', async () => {
  await act(async () => root.render(<CloudDataSettings language="vi" />))
  api.rpc.mockResolvedValueOnce({ data: null, error: { message: 'internal database details' } })
  await click()
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('Chưa xuất được dữ liệu')
  expect(host.textContent).not.toContain('internal database details')
  expect(HTMLAnchorElement.prototype.click).not.toHaveBeenCalled()
  await click()
  expect(host.querySelector('[role="alert"]')).toBeNull()
  expect(host.textContent).toContain('Đã tạo file xuất dữ liệu')
})

test('a normal token refresh for the same user does not cancel an export', async () => {
  const resolve = pendingExport()
  await click()
  await act(async () => {
    authChanged('TOKEN_REFRESHED', { user: { id: 'owner-a' } })
    resolve()
  })
  expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledOnce()
  await act(async () => authChanged('SIGNED_IN', { user: { id: 'owner-b' } }))
  expect(host.querySelector('[role="status"]')).toBeNull()
})
