// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { DeleteAccount } from '../components/DeleteAccount'

const api = vi.hoisted(() => ({
  invoke: vi.fn(), getSession: vi.fn(), signOut: vi.fn(), subscribe: vi.fn(), unsubscribe: vi.fn(),
  session: { user: { id: 'owner-a' }, access_token: 'synthetic-token-a' },
}))
vi.mock('../auth/AuthProvider', () => ({ useAuth: () => ({ session: api.session }) }))
vi.mock('../platform/hosted/supabase-client', () => ({ requireSupabase: () => ({
  functions: { invoke: api.invoke }, auth: {
    getSession: api.getSession, signOut: api.signOut, onAuthStateChange: api.subscribe,
  },
}) }))
let authChanged: (event: string, session: typeof api.session | null) => void
let host: HTMLDivElement
let root: Root
let unmounted: boolean
beforeEach(async () => {
  vi.resetAllMocks()
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  api.getSession.mockResolvedValue({ data: { session: api.session }, error: null })
  api.invoke.mockResolvedValue({ data: { code: 'account_deleted' }, error: null })
  api.signOut.mockResolvedValue({ error: null })
  api.subscribe.mockImplementation((callback) => {
    authChanged = callback
    return { data: { subscription: { unsubscribe: api.unsubscribe } } }
  })
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  unmounted = false
  await render()
})
afterEach(async () => {
  if (!unmounted) await act(async () => root.unmount())
  host.remove()
})
const render = (language: 'vi' | 'en' = 'en') => act(async () => root.render(<DeleteAccount language={language} />))
const fill = (input: HTMLInputElement, text: string) => act(async () => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, text)
  input.dispatchEvent(new Event('input', { bubbles: true }))
})
const prepare = async (confirmation = 'DELETE') => {
  await act(async () => host.querySelector('button')!.click())
  await fill(host.querySelector('input[type="password"]')!, 'synthetic-password')
  await fill(host.querySelector('input[autocomplete="off"]')!, confirmation)
}
const submit = () => act(async () => host.querySelector('form')!
  .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })))
const pending = () => {
  let resolve!: (value: unknown) => void
  const promise = new Promise((done) => { resolve = done })
  return { promise, resolve }
}

test('exact confirmation is required and the invocation is pinned to the confirmed session', async () => {
  await prepare('delete')
  await submit()
  expect(api.invoke).not.toHaveBeenCalled()
  await fill(host.querySelector('input[autocomplete="off"]')!, 'DELETE')
  await submit()
  expect(api.invoke).toHaveBeenCalledExactlyOnceWith('delete-account', {
    body: { confirmation: 'DELETE', password: 'synthetic-password' },
    headers: { Authorization: 'Bearer synthetic-token-a' },
  })
  expect(api.signOut).toHaveBeenCalledExactlyOnceWith({ scope: 'local' })
  expect(host.textContent).toContain('Account deleted.')
  expect(host.querySelector('input')).toBeNull()
})

test('same-tick submissions are locked and failure copy follows the current language', async () => {
  const reply = pending()
  api.invoke.mockReturnValueOnce(reply.promise)
  await prepare()
  await act(async () => {
    for (let i = 0; i < 2; i++) host.querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  })
  expect(api.invoke).toHaveBeenCalledOnce()
  expect([...host.querySelectorAll('form input, form button')].every((item) => item.hasAttribute('disabled'))).toBe(true)
  await render('vi')
  await act(async () => reply.resolve({ data: null, error: new Error('Private provider detail') }))
  expect(host.querySelector('[role="alert"]')?.textContent).toContain('Chưa xác nhận được')
  expect(host.textContent).not.toContain('Private provider detail')
  await render('en')
  expect(host.querySelector('[role="alert"]')?.textContent).toContain('could not be confirmed')
  await submit()
  expect(api.invoke).toHaveBeenCalledTimes(2)
  expect(host.textContent).toContain('Account deleted.')
})

test.each(['SIGNED_IN', 'SIGNED_OUT'])('late deletion after %s never signs out a replacement session', async (event) => {
  const reply = pending()
  api.invoke.mockReturnValueOnce(reply.promise)
  await prepare()
  await submit()
  await act(async () => {
    authChanged(event, event === 'SIGNED_OUT' ? null : {
      user: { id: 'owner-b' }, access_token: 'synthetic-token-b',
    })
    reply.resolve({ data: { code: 'account_deleted' }, error: null })
  })
  expect(api.signOut).not.toHaveBeenCalled()
  expect(host.textContent).not.toContain('Account deleted.')
  expect(host.querySelector('input')).toBeNull()
})

test('account mismatch before sending never invokes the deletion function', async () => {
  api.getSession.mockResolvedValue({ data: { session: { user: { id: 'owner-b' } } }, error: null })
  await prepare()
  await submit()
  expect(api.invoke).not.toHaveBeenCalled()
  expect(host.textContent).toContain('account session changed')
})

test('account mismatch after deletion never signs out the new account', async () => {
  api.getSession.mockResolvedValueOnce({ data: { session: api.session }, error: null })
    .mockResolvedValueOnce({ data: { session: { user: { id: 'owner-b' } } }, error: null })
  await prepare()
  await submit()
  expect(api.invoke).toHaveBeenCalledOnce()
  expect(api.signOut).not.toHaveBeenCalled()
})

test('unmount discards a pending response and removes the auth subscription', async () => {
  const reply = pending()
  api.invoke.mockReturnValueOnce(reply.promise)
  await prepare()
  await submit()
  await act(async () => root.unmount())
  unmounted = true
  await act(async () => reply.resolve({ data: { code: 'account_deleted' }, error: null }))
  expect(api.signOut).not.toHaveBeenCalled()
  expect(api.unsubscribe).toHaveBeenCalledOnce()
})

test('a failed sign-out after confirmed deletion retries only sign-out', async () => {
  api.signOut.mockResolvedValueOnce({ error: new Error('Private signout detail') })
  await prepare()
  await submit()
  expect(host.textContent).toContain('Account deleted.')
  expect(host.textContent).toContain('could not sign out')
  expect(host.textContent).not.toContain('Private signout detail')
  expect(host.querySelector('input')).toBeNull()
  await act(async () => host.querySelector('button')!.click())
  expect(api.invoke).toHaveBeenCalledOnce()
  expect(api.signOut).toHaveBeenCalledTimes(2)
  expect(host.querySelector('[role="alert"]')).toBeNull()
})

test('cancelling clears both sensitive fields and previous failure feedback', async () => {
  api.invoke.mockRejectedValueOnce(new Error('Private details'))
  await prepare()
  await submit()
  await act(async () => host.querySelector<HTMLButtonElement>('button[type="button"]')!.click())
  expect(host.querySelector('[role="alert"]')).toBeNull()
  await act(async () => host.querySelector('button')!.click())
  expect([...host.querySelectorAll('input')].every((input) => input.value === '')).toBe(true)
  expect(document.activeElement).toBe(host.querySelector('input[type="password"]'))
})

test('token refresh for the same owner preserves the attempt and uses the current verified session token', async () => {
  const refreshed = { ...api.session, access_token: 'synthetic-refreshed-token' }
  api.getSession.mockResolvedValue({ data: { session: refreshed }, error: null })
  const reply = pending()
  api.invoke.mockReturnValueOnce(reply.promise)
  await prepare()
  await submit()
  expect(api.invoke.mock.calls[0][1].headers.Authorization).toBe('Bearer synthetic-refreshed-token')
  await act(async () => {
    authChanged('TOKEN_REFRESHED', refreshed)
    reply.resolve({ data: { code: 'account_deleted' }, error: null })
  })
  expect(api.signOut).toHaveBeenCalledOnce()
  expect(host.textContent).toContain('Account deleted.')
})
