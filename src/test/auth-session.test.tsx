// @vitest-environment jsdom
import { act, useEffect } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { AuthProvider, useAuth } from '../auth/AuthProvider'
import { SignOutButton } from '../auth/SignOutButton'
import { SessionRecovery } from '../auth/SessionRecovery'

const api = vi.hoisted(() => ({
  getSession: vi.fn(), signOut: vi.fn(), subscribe: vi.fn(), unsubscribe: vi.fn(), rpc: vi.fn(), mode: 'hosted',
}))
vi.mock('../platform/runtime-config', () => ({ runtimeConfig: { get mode() { return api.mode } } }))
vi.mock('../platform/hosted/supabase-client', () => ({ supabase: { rpc: api.rpc, auth: {
  getSession: api.getSession, signOut: api.signOut, onAuthStateChange: api.subscribe,
} } }))

const owner = (id: string) => ({ user: { id }, access_token: `synthetic-${id}` })
const reply = (id: string | null) => ({ data: { session: id ? owner(id) : null }, error: null })
const pending = () => {
  let resolve!: (value: unknown) => void
  let reject!: (reason: Error) => void
  const promise = new Promise((done, fail) => { resolve = done; reject = fail })
  return { promise, resolve, reject }
}
let changed: (event: string, session: ReturnType<typeof owner> | null) => void
let host: HTMLDivElement
let root: Root
let unmounted: boolean
let context: ReturnType<typeof useAuth>
function Probe({ language }: { language: 'vi' | 'en' }) {
  const auth = useAuth()
  useEffect(() => { context = auth }, [auth])
  return <>
    <output>{auth.state}:{auth.session?.user.id}</output>
    {auth.state === 'error' && <SessionRecovery />}
    {auth.state === 'signed_in' && <SignOutButton key={auth.session?.user.id} language={language} />}
  </>
}
const render = (language: 'vi' | 'en' = 'en') => act(async () => {
  root.render(<AuthProvider><Probe language={language} /></AuthProvider>)
})
beforeEach(() => {
  vi.resetAllMocks()
  api.mode = 'hosted'
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  api.getSession.mockResolvedValue(reply('owner-a'))
  api.signOut.mockResolvedValue({ error: null })
  api.rpc.mockImplementation(async () => ({ data: {
    server_time: new Date().toISOString(), expires_at: new Date(Date.now() + 86400000).toISOString(),
  }, error: null }))
  api.subscribe.mockImplementation((callback) => {
    changed = callback
    return { data: { subscription: { unsubscribe: api.unsubscribe } } }
  })
  window.history.replaceState({}, '', '/?lang=en')
  localStorage.clear()
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  unmounted = false
})
afterEach(async () => {
  if (!unmounted) await act(async () => root.unmount())
  host.remove()
  vi.useRealTimers()
})

test.each(['returned', 'rejected'])('a %s startup error has a focused recovery view and a working retry', async (kind) => {
  const detail = new Error('Private provider detail')
  if (kind === 'returned') api.getSession.mockResolvedValueOnce({ data: { session: null }, error: detail })
  else api.getSession.mockRejectedValueOnce(detail)
  await render()
  expect(host.querySelector('output')?.textContent).toBe('error:')
  expect(host.querySelector('h1')?.textContent).toContain('Could not read')
  expect(document.activeElement).toBe(host.querySelector('h1'))
  expect(host.textContent).not.toContain(detail.message)
  const next = pending()
  api.getSession.mockReturnValueOnce(next.promise)
  await act(async () => { context.retrySession(); context.retrySession() })
  expect(api.getSession).toHaveBeenCalledTimes(2)
  expect(host.querySelector('output')?.textContent).toBe('loading:')
  await act(async () => next.resolve(reply('owner-a')))
  expect(host.querySelector('output')?.textContent).toBe('signed_in:owner-a')
  expect(api.unsubscribe).toHaveBeenCalledOnce()
})

test.each(['resolved', 'rejected'])('a late %s startup result cannot overwrite a newer auth event', async (kind) => {
  const initial = pending()
  api.getSession.mockReturnValueOnce(initial.promise)
  await render()
  await act(async () => changed('SIGNED_IN', owner('owner-b')))
  await act(async () => {
    if (kind === 'resolved') initial.resolve(reply('owner-a'))
    else initial.reject(new Error('Old failure'))
  })
  expect(host.querySelector('output')?.textContent).toBe('signed_in:owner-b')
})

test('sign-out during startup is not reversed by an old session snapshot', async () => {
  const initial = pending()
  api.getSession.mockReturnValueOnce(initial.promise)
  await render()
  await act(async () => changed('SIGNED_OUT', null))
  await act(async () => initial.resolve(reply('owner-a')))
  expect(host.querySelector('output')?.textContent).toBe('signed_out:')
})

test('unmount retires the pending startup read and unsubscribes', async () => {
  const initial = pending()
  api.getSession.mockReturnValueOnce(initial.promise)
  await render()
  await act(async () => root.unmount())
  unmounted = true
  await act(async () => initial.reject(new Error('Late failure')))
  expect(api.unsubscribe).toHaveBeenCalledOnce()
  expect(host.textContent).toBe('')
})

test('local mode never reads a hosted session', async () => {
  api.mode = 'local'
  await render()
  expect(host.querySelector('output')?.textContent).toBe('local:')
  expect(api.getSession).not.toHaveBeenCalled()
  expect(api.subscribe).not.toHaveBeenCalled()
})

test.each(['returned', 'rejected'])('a %s logout failure is localized, prevents duplicate calls and can retry', async (kind) => {
  const request = pending()
  api.signOut.mockReturnValueOnce(request.promise)
  await render()
  const button = host.querySelector('button')!
  await act(async () => { button.click(); button.click() })
  expect(api.signOut).toHaveBeenCalledOnce()
  expect(button.disabled).toBe(true)
  expect(button.textContent).toBe('Signing out…')
  await act(async () => {
    if (kind === 'returned') request.resolve({ error: new Error('Private provider detail') })
    else request.reject(new Error('Private provider detail'))
  })
  expect(host.querySelector('[role="alert"]')?.textContent).toContain('Could not sign out')
  expect(host.textContent).not.toContain('Private provider detail')
  await render('vi')
  expect(host.querySelector('[role="alert"]')?.textContent).toContain('Chưa đăng xuất được')
  api.signOut.mockImplementationOnce(async () => {
    changed('SIGNED_OUT', null)
    return { error: null }
  })
  await act(async () => host.querySelector('button')!.click())
  expect(api.signOut).toHaveBeenCalledTimes(2)
  expect(host.querySelector('output')?.textContent).toBe('signed_out:')
  expect(host.querySelector('[role="alert"]')).toBeNull()
})

test('a logout error after session removal cannot bring back the personal controls', async () => {
  const request = pending()
  api.signOut.mockReturnValueOnce(request.promise)
  await render()
  await act(async () => host.querySelector('button')!.click())
  await act(async () => changed('SIGNED_OUT', null))
  await act(async () => request.resolve({ error: new Error('Server error after local cleanup') }))
  expect(host.querySelector('output')?.textContent).toBe('signed_out:')
  expect(host.querySelector('button')).toBeNull()
})

test('recovery copy respects Vietnamese and updates the document language', async () => {
  window.history.replaceState({}, '', '/?lang=vi')
  api.getSession.mockRejectedValueOnce(new Error('Storage failure'))
  await render()
  expect(host.querySelector('h1')?.textContent).toContain('Chưa đọc được phiên')
  expect(host.querySelector('button')?.textContent).toBe('Thử lại')
  expect(document.documentElement.lang).toBe('vi')
})

test('a logout reply for a previous owner leaves the replacement owner controls unchanged', async () => {
  const request = pending()
  api.signOut.mockReturnValueOnce(request.promise)
  await render()
  await act(async () => host.querySelector('button')!.click())
  await act(async () => changed('SIGNED_IN', owner('owner-b')))
  await act(async () => request.resolve({ error: new Error('Old failure') }))
  expect(host.querySelector('output')?.textContent).toBe('signed_in:owner-b')
  expect(host.querySelector('button')?.disabled).toBe(false)
  expect(host.querySelector('[role="alert"]')).toBeNull()
})

test('private content waits for the server session deadline', async () => {
  const check = pending()
  api.rpc.mockReturnValueOnce(check.promise)
  await render()
  expect(host.querySelector('output')?.textContent).toBe('loading:')
  await act(async () => check.resolve({ data: {
    server_time: new Date().toISOString(), expires_at: new Date(Date.now() + 86400000).toISOString(),
  }, error: null }))
  expect(host.querySelector('output')?.textContent).toBe('signed_in:owner-a')
})

test('a restored expired session never exposes private content and signs out only this session', async () => {
  api.rpc.mockResolvedValueOnce({ data: {
    server_time: '2026-10-09T00:00:00Z', expires_at: '2026-10-09T00:00:00Z',
  }, error: null })
  await render()
  expect(host.querySelector('output')?.textContent).toBe('expired:')
  expect(api.signOut).toHaveBeenCalledWith({ scope: 'local' })
})

test('refreshing the access token does not extend the original 24 hour deadline', async () => {
  vi.useFakeTimers()
  const start = Date.parse('2026-10-08T00:00:00Z')
  vi.setSystemTime(start)
  api.rpc.mockImplementation(async () => ({ data: {
    server_time: new Date().toISOString(), expires_at: new Date(start + 86400000).toISOString(),
  }, error: null }))
  await render()
  await act(async () => vi.advanceTimersByTimeAsync(23 * 3600000))
  await act(async () => changed('TOKEN_REFRESHED', owner('owner-a')))
  expect(host.querySelector('output')?.textContent).toBe('signed_in:owner-a')
  await act(async () => vi.advanceTimersByTimeAsync(3600000))
  expect(host.querySelector('output')?.textContent).toBe('expired:')
  expect(api.signOut).toHaveBeenCalledOnce()
})

test('a failed deadline lookup keeps personal content closed and permits retry', async () => {
  api.rpc.mockResolvedValueOnce({ data: null, error: new Error('Private database error') })
  await render()
  expect(host.querySelector('output')?.textContent).toBe('error:')
  expect(host.textContent).not.toContain('Private database error')
  await act(async () => context.retrySession())
  expect(host.querySelector('output')?.textContent).toBe('signed_in:owner-a')
})

test('a late deadline result cannot restore an account after sign-out', async () => {
  const check = pending()
  api.rpc.mockReturnValueOnce(check.promise)
  await render()
  await act(async () => changed('SIGNED_OUT', null))
  await act(async () => check.resolve({ data: {
    server_time: new Date().toISOString(), expires_at: new Date(Date.now() + 86400000).toISOString(),
  }, error: null }))
  expect(host.querySelector('output')?.textContent).toBe('signed_out:')
})

test('a sleeping tab expires on focus even when its timeout has not run', async () => {
  vi.useFakeTimers()
  const start = Date.parse('2026-10-08T00:00:00Z')
  vi.setSystemTime(start)
  await render()
  vi.setSystemTime(start + 25 * 3600000)
  await act(async () => window.dispatchEvent(new Event('focus')))
  expect(host.querySelector('output')?.textContent).toBe('expired:')
})

test('server time determines lifetime when the device clock is wrong', async () => {
  vi.useFakeTimers()
  vi.setSystemTime('2030-01-01T00:00:00Z')
  api.rpc.mockResolvedValueOnce({ data: {
    server_time: '2026-10-08T23:00:00Z', expires_at: '2026-10-09T00:00:00Z',
  }, error: null })
  await render()
  expect(host.querySelector('output')?.textContent).toBe('signed_in:owner-a')
  await act(async () => vi.advanceTimersByTimeAsync(3600000))
  expect(host.querySelector('output')?.textContent).toBe('expired:')
})

test('a missing server session expires and a stalled check offers retry', async () => {
  api.rpc.mockResolvedValueOnce({ data: { server_time: new Date().toISOString(), expires_at: null }, error: null })
  await render()
  expect(host.querySelector('output')?.textContent).toBe('expired:')
  vi.useFakeTimers()
  api.rpc.mockReturnValueOnce(new Promise(() => undefined))
  await act(async () => changed('SIGNED_IN', owner('owner-b')))
  await act(async () => vi.advanceTimersByTimeAsync(10000))
  expect(host.querySelector('output')?.textContent).toBe('error:')
})
