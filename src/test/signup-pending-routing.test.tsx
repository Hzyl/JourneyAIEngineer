// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { AppRoutes } from '../AppRoutes'

const auth = vi.hoisted(() => ({ state: 'signed_in' }))
vi.mock('../auth/AuthProvider', () => ({
  useAuth: () => ({ state: auth.state, session: { user: { id: 'learner' } } }),
}))
vi.mock('../platform/runtime-config', () => ({ runtimeConfig: { mode: 'hosted' } }))
vi.mock('../App', () => ({ default: () => <p>Personal app</p> }))
vi.mock('../public/PublicExperience', () => ({ PublicExperience: () => <p>Signup confirmation</p> }))
vi.mock('../auth/AuthCallback', () => ({ AuthCallback: () => <p>Email callback</p> }))

let host: HTMLDivElement
let root: Root
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  sessionStorage.clear()
  auth.state = 'signed_in'
  window.history.replaceState({}, '', '/auth/sign-up?next=%2Froadmap')
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  sessionStorage.clear()
})

function pending(expiresAt = Date.now() + 3600000) {
  sessionStorage.setItem('journey-pending-signup', JSON.stringify({
    email: 'learner@example.com', resendAfter: 0, expiresAt,
  }))
}

test('a signup tab keeps its confirmation view when another tab establishes a session', async () => {
  pending()
  auth.state = 'signed_out'
  await act(async () => root.render(<AppRoutes />))
  expect(host.textContent).toBe('Signup confirmation')
  auth.state = 'signed_in'
  await act(async () => root.render(<AppRoutes />))
  expect(host.textContent).toBe('Signup confirmation')
  expect(window.location.pathname).toBe('/auth/sign-up')
})

test('the callback tab is not captured by a copied pending-signup entry', async () => {
  pending()
  window.history.replaceState({}, '', '/auth/callback')
  await act(async () => root.render(<AppRoutes />))
  expect(host.textContent).toBe('Email callback')
})

test('expired pending metadata does not trap an authenticated user at signup', async () => {
  pending(Date.now() - 1)
  await act(async () => root.render(<AppRoutes />))
  expect(host.textContent).toBe('Personal app')
  expect(window.location.pathname).toBe('/roadmap')
})

test('pending metadata cannot admit a signed-out visitor to private learning data', async () => {
  pending()
  auth.state = 'signed_out'
  window.history.replaceState({}, '', '/roadmap')
  await act(async () => root.render(<AppRoutes />))
  expect(host.textContent).toBe('Signup confirmation')
  expect(host.textContent).not.toContain('Personal app')
})
