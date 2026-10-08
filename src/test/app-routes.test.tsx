// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { AppRoutes } from '../AppRoutes'

const state = vi.hoisted(() => ({ auth: 'loading', mode: 'hosted', userId: 'owner-a', retry: vi.fn() }))
vi.mock('../auth/AuthProvider', () => ({
  useAuth: () => ({ state: state.auth, session: { user: { id: state.userId } }, retrySession: state.retry }),
}))
vi.mock('../platform/runtime-config', () => ({ runtimeConfig: { get mode() { return state.mode } } }))
vi.mock('../auth/AuthCallback', () => ({ AuthCallback: () => <p>Account callback</p> }))
vi.mock('../App', () => ({ default: () => <>
  <p>Personal learning app</p><input aria-label="Private draft" defaultValue="" />
</> }))
vi.mock('../public/PublicExperience', () => ({ PublicExperience: () => <p>Public learning</p> }))

let host: HTMLDivElement
let root: Root
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  state.auth = 'loading'
  state.mode = 'hosted'
  state.userId = 'owner-a'
  state.retry.mockReset()
  window.history.replaceState({}, '', '/')
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
})
const render = () => act(async () => { root.render(<AppRoutes />) })

test('hosted auth transitions mount only the appropriate learning surface', async () => {
  await render()
  expect(host.querySelector('[role="status"]')?.textContent).toContain('Loading')
  expect(host.textContent).not.toContain('Personal learning app')
  state.auth = 'signed_out'
  await render()
  expect(host.textContent).toBe('Public learning')
  state.auth = 'signed_in'
  await render()
  expect(host.textContent).toBe('Personal learning app')
  state.auth = 'signed_out'
  await render()
  expect(host.textContent).toBe('Public learning')
})

test('the local app opens without waiting for hosted auth', async () => {
  state.mode = 'local'
  await render()
  expect(host.textContent).toBe('Personal learning app')
})

test('a session error shows recovery instead of silently opening the guest or personal app', async () => {
  state.auth = 'error'
  window.history.replaceState({}, '', '/lesson/example?lang=en')
  await render()
  expect(host.textContent).toContain('Could not read your sign-in session')
  expect(host.textContent).not.toContain('Public learning')
  expect(host.textContent).not.toContain('Personal learning app')
  await act(async () => host.querySelector('button')!.click())
  expect(state.retry).toHaveBeenCalledOnce()
  expect(window.location.pathname).toBe('/lesson/example')
})

test.each(['/lesson/phase-00-onboarding-environment-1#example', '/exercises?exercise=python-core']) (
  'sign-in restores the public destination %s before mounting the personal app', async (next) => {
    window.history.replaceState({}, '', `/auth/sign-in?next=${encodeURIComponent(next)}`)
    state.auth = 'signed_in'
    await render()
    expect(window.location.pathname + window.location.search + window.location.hash).toBe(next)
    expect(host.textContent).toBe('Personal learning app')
  },
)

test('sign-in does not follow an external return URL', async () => {
  window.history.replaceState({}, '', '/auth/sign-in?next=https%3A%2F%2Fexample.net%2Flesson%2Fsecret')
  state.auth = 'signed_in'
  await render()
  expect(window.location.pathname).toBe('/')
  expect(host.textContent).toBe('Personal learning app')
})

test('recovery callback remains available before auth finishes and keeps its URL', async () => {
  window.history.replaceState({}, '', '/auth/callback?mode=recovery')
  await render()
  expect(host.textContent).toBe('Account callback')
  expect(window.location.search).toBe('?mode=recovery')
})

test('changing accounts discards the previous learning screen while a same-user refresh preserves it', async () => {
  state.auth = 'signed_in'
  await render()
  const draft = host.querySelector('input')!
  draft.value = 'Private note from owner A'
  await render()
  expect(host.querySelector('input')).toBe(draft)
  expect(host.querySelector('input')!.value).toBe('Private note from owner A')
  state.userId = 'owner-b'
  await render()
  expect(host.querySelector('input')).not.toBe(draft)
  expect(host.querySelector('input')!.value).toBe('')
})
