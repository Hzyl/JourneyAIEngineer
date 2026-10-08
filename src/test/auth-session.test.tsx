// @vitest-environment jsdom
import { act, useEffect } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { AuthProvider, useAuth } from '../auth/AuthProvider'
import { SignOutButton } from '../auth/SignOutButton'
import { SessionRecovery } from '../auth/SessionRecovery'

const api = vi.hoisted(() => ({
  getSession: vi.fn(), signOut: vi.fn(), subscribe: vi.fn(), unsubscribe: vi.fn(), mode: 'hosted',
}))
vi.mock('../platform/runtime-config', () => ({ runtimeConfig: { get mode() { return api.mode } } }))
vi.mock('../platform/hosted/supabase-client', () => ({ supabase: { auth: {
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
