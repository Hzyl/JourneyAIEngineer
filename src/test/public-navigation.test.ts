// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest'
import { authReturnPath, publicPage } from '../public/public-navigation'
import { readPublicLanguage } from '../public/public-language'

afterEach(() => { localStorage.clear(); window.history.replaceState({}, '', '/') })

test.each(['//evil.example/lesson/a', 'javascript:alert(1)', '/auth/callback', '/settings', '/\\evil.example/']) (
  'unsafe guest return path %s falls back to home', (path) => {
    window.history.replaceState({}, '', `/auth/sign-in?next=${encodeURIComponent(path)}`)
    expect(authReturnPath()).toBe('/')
    expect(publicPage()).toBe('auth')
  },
)

test('a malformed lesson URL gives the missing lesson screen instead of crashing', () => {
  window.history.replaceState({}, '', '/lesson/%E0%A4%A')
  expect(publicPage()).toBe('missing')
})

test('language survives reload and a validated email-link language takes precedence', () => {
  localStorage.setItem('journey-public-language', 'en')
  expect(readPublicLanguage()).toBe('en')
  window.history.replaceState({}, '', '/auth/callback?lang=vi')
  expect(readPublicLanguage()).toBe('vi')
  window.history.replaceState({}, '', '/auth/callback?lang=invalid')
  expect(readPublicLanguage()).toBe('en')
})
