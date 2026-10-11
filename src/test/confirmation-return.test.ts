// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { consumeConfirmationReturn, rememberConfirmationReturn } from '../auth/confirmation-return'

beforeEach(() => {
  localStorage.clear()
  window.history.replaceState({}, '', '/auth/sign-up?next=%2Flesson%2Fexample%3Fview%3Dnotes%23practice')
})
afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); localStorage.clear() })

test('confirmation in another tab can consume the safe path once without a changed email URL', () => {
  rememberConfirmationReturn()
  window.history.replaceState({}, '', '/auth/callback?lang=en')
  expect(consumeConfirmationReturn()).toBe('/lesson/example?view=notes#practice')
  expect(consumeConfirmationReturn()).toBe('/')
})

test.each(['https://evil.example/lesson/a', '//evil.example/lesson/a', '/auth/callback', '/settings'])(
  'confirmation rejects unsafe destination %s from both stored and explicit paths', (path) => {
    window.history.replaceState({}, '', `/auth/sign-up?next=${encodeURIComponent(path)}`)
    rememberConfirmationReturn()
    window.history.replaceState({}, '', '/auth/callback?lang=en')
    expect(consumeConfirmationReturn()).toBe('/')
    window.history.replaceState({}, '', `/auth/callback?next=${encodeURIComponent(path)}`)
    expect(consumeConfirmationReturn()).toBe('/')
  },
)

test('an explicit safe destination is honored and clears a previous pending destination', () => {
  rememberConfirmationReturn()
  window.history.replaceState({}, '', '/auth/callback?next=%2Froadmap')
  expect(consumeConfirmationReturn()).toBe('/roadmap')
  window.history.replaceState({}, '', '/auth/callback')
  expect(consumeConfirmationReturn()).toBe('/')
})

test('stale confirmation destinations expire without blocking the callback', () => {
  vi.useFakeTimers()
  rememberConfirmationReturn()
  vi.advanceTimersByTime(60 * 60 * 1000)
  window.history.replaceState({}, '', '/auth/callback')
  expect(consumeConfirmationReturn()).toBe('/')
})

test.each(['not-json', '{"path":"//evil.example/lesson/a","expiresAt":9999999999999}', '{"path":"/roadmap"}'])(
  'corrupt or unsafe stored destination falls back safely: %s', (value) => {
    localStorage.setItem('journey-confirmation-return', value)
    window.history.replaceState({}, '', '/auth/callback')
    expect(consumeConfirmationReturn()).toBe('/')
  },
)

test('blocked storage does not block confirmation or weaken explicit destination validation', () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('blocked') })
  expect(rememberConfirmationReturn).not.toThrow()
  window.history.replaceState({}, '', '/auth/callback')
  expect(consumeConfirmationReturn()).toBe('/')
  window.history.replaceState({}, '', '/auth/callback?next=%2Froadmap')
  expect(consumeConfirmationReturn()).toBe('/roadmap')
})
