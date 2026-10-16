// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { AuthScreen } from '../auth/AuthScreen'
import { clearPendingSignup, readPendingSignup } from '../auth/pending-signup'

const auth = vi.hoisted(() => ({
  signInWithPassword: vi.fn(), signUp: vi.fn(), resend: vi.fn(), resetPasswordForEmail: vi.fn(),
  getUser: vi.fn(), onAuthStateChange: vi.fn(),
}))
vi.mock('../platform/hosted/supabase-client', () => ({ requireSupabase: () => ({ auth }) }))
vi.mock('../theme/ThemeToggle', () => ({ ThemeToggle: () => <button>Theme</button> }))
let host: HTMLDivElement
let root: Root
const render = (language: 'vi' | 'en' = 'en') => act(async () => {
  root.render(<AuthScreen loading={false} language={language} />)
})
const fill = (selector: string, value: string) => act(async () => {
  const input = host.querySelector<HTMLInputElement>(selector)!
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
})
const click = (selector: string) => act(async () => host.querySelector<HTMLButtonElement>(selector)!.click())
const submit = () => host.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
beforeEach(async () => {
  localStorage.clear()
  sessionStorage.clear()
  clearPendingSignup()
  window.history.replaceState({}, '', '/auth/sign-in')
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.resetAllMocks()
  for (const call of Object.values(auth)) call.mockResolvedValue({ error: null })
  auth.getUser.mockResolvedValue({ data: { user: null }, error: null })
  auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  await render()
  await fill('input[type="email"]', 'learner@example.com')
  await fill('.password-control input', 'example-password')
})
afterEach(async () => { await act(async () => root.unmount()); host.remove() })

test('translated validation and password visibility preserve input across language changes', async () => {
  await click('.auth-mode-switch button:last-child')
  const confirmation = [...host.querySelectorAll('label')].find((label) => label.textContent === 'Confirm password')!
  await fill(`input[id="${confirmation.htmlFor}"]`, 'different-password')
  await act(async () => { submit() })
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('do not match')
  expect(auth.signUp).not.toHaveBeenCalled()
  await click('.password-toggle')
  expect(host.querySelector('.password-control input')!.getAttribute('type')).toBe('text')
  await render('vi')
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('chưa trùng khớp')
  expect(host.querySelector<HTMLInputElement>('.password-control input')!.value).toBe('example-password')
  expect(host.querySelector('.password-toggle')!.getAttribute('aria-label')).toBe('Ẩn mật khẩu')
})

test('one sign-in stays pending across duplicate submits and mode controls then preserves a failed attempt', async () => {
  let resolve!: (result: unknown) => void
  auth.signInWithPassword.mockReturnValueOnce(new Promise((done) => { resolve = done }))
  await act(async () => { submit(); submit() })
  expect(auth.signInWithPassword).toHaveBeenCalledTimes(1)
  expect([...host.querySelectorAll<HTMLButtonElement>('.auth-mode-switch button, .auth-secondary-actions button')]
    .every((button) => button.disabled)).toBe(true)
  await render('vi')
  await act(async () => resolve({ error: { code: 'invalid_credentials' } }))
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('Không thể đăng nhập bằng thông tin này')
  expect(host.querySelector<HTMLInputElement>('.password-control input')!.value).toBe('example-password')
  await act(async () => { submit() })
  expect(auth.signInWithPassword).toHaveBeenCalledTimes(2)
})

test('unconfirmed-email resend keeps the same address, language and duplicate guard', async () => {
  window.history.replaceState({}, '', '/auth/sign-in?next=%2Froadmap')
  auth.signInWithPassword.mockResolvedValueOnce({ error: { code: 'email_not_confirmed' } })
  await act(async () => { submit() })
  expect(host.querySelector('#signup-code')).toBeNull()
  expect(host.textContent).toContain('confirmation link')
  expect(host.querySelector('.password-control')).toBeNull()
  let resolve!: (result: unknown) => void
  auth.resend.mockReturnValueOnce(new Promise((done) => { resolve = done }))
  await act(async () => {
    host.querySelector<HTMLButtonElement>('[data-action="resend"]')!.click()
    host.querySelector<HTMLButtonElement>('[data-action="resend"]')!.click()
  })
  expect(auth.resend).toHaveBeenCalledTimes(1)
  expect(auth.resend.mock.calls[0][0].email).toBe('learner@example.com')
  expect(auth.resend.mock.calls[0][0].options.emailRedirectTo).toContain('/auth/callback?lang=en')
  await render('vi')
  await act(async () => resolve({ error: null }))
  expect(host.querySelector('[role="status"]')!.textContent).toContain('Nếu địa chỉ này cần xác nhận')
  expect(auth.resend.mock.calls[0][0].options.emailRedirectTo).toBe(`${window.location.origin}/auth/callback?lang=en`)
  expect(JSON.parse(localStorage.getItem('journey-confirmation-return') ?? 'null')).toMatchObject({ path: '/roadmap' })
})

test('signup explains the email link and correcting the address clears password fields', async () => {
  await click('.auth-mode-switch button:last-child')
  await fill('input[autocomplete="new-password"]', 'example-password')
  const inputs = host.querySelectorAll<HTMLInputElement>('input[autocomplete="new-password"]')
  await fill(`#${inputs[1].id}`, 'example-password')
  await act(async () => { submit() })
  expect(auth.signUp).toHaveBeenCalledTimes(1)
  expect(host.querySelector('#signup-code')).toBeNull()
  expect(host.textContent).toContain('confirmation link')
  expect(host.querySelector('.otp-destination')!.textContent).toContain('learner@example.com')
  expect(readPendingSignup()?.email).toBe('learner@example.com')
  await click('[data-action="change-email"]')
  expect(host.querySelector<HTMLInputElement>('input[type="email"]')!.value).toBe('learner@example.com')
  expect([...host.querySelectorAll<HTMLInputElement>('input[autocomplete="new-password"]')]
    .every((input) => input.value === '')).toBe(true)
  expect(readPendingSignup()).toBeNull()
})

test('a direct signup route opens account creation and never sends a password login', async () => {
  window.history.replaceState({}, '', '/auth/sign-up?next=%2Froadmap')
  await act(async () => root.unmount())
  root = createRoot(host)
  await render()
  expect(host.querySelector('#auth-title')!.textContent).toBe('Create your learning account')
  await fill('input[type="email"]', 'new-learner@example.test')
  const inputs = host.querySelectorAll<HTMLInputElement>('input[autocomplete="new-password"]')
  await fill(`#${inputs[0].id}`, 'example-password')
  await fill(`#${inputs[1].id}`, 'example-password')
  await act(async () => { submit() })
  expect(auth.signUp).toHaveBeenCalledTimes(1)
  expect(auth.signInWithPassword).not.toHaveBeenCalled()
  expect(auth.signUp.mock.calls[0][0].options.emailRedirectTo).toBe(`${window.location.origin}/auth/callback?lang=en`)
  expect(JSON.parse(localStorage.getItem('journey-confirmation-return') ?? 'null')).toMatchObject({ path: '/roadmap' })
})

test('signup errors never describe an invalid password login', async () => {
  auth.signUp.mockResolvedValueOnce({ error: { code: 'invalid_credentials' } })
  await click('.auth-mode-switch button:last-child')
  const inputs = host.querySelectorAll<HTMLInputElement>('input[autocomplete="new-password"]')
  await fill(`#${inputs[1].id}`, 'example-password')
  await act(async () => { submit() })
  expect(host.querySelector('[role="alert"]')!.textContent).not.toContain("We couldn't sign you in")
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('account')
})

test('invalid sign-in stays generic and directs new learners to create an account', async () => {
  auth.signInWithPassword.mockResolvedValueOnce({ error: { code: 'invalid_credentials' } })
  await act(async () => { submit() })
  expect(host.querySelector('[role="alert"]')!.textContent).toContain("We couldn't sign you in with these details")
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('create an account')
  await click('.auth-create-account-link')
  expect(host.querySelector('#auth-title')!.textContent).toBe('Create your learning account')
  expect(window.location.pathname).toBe('/auth/sign-up')
})

test('recovery notice stays generic about account existence and retains the email-link language', async () => {
  await click('.auth-secondary-actions button')
  await act(async () => { submit() })
  expect(auth.resetPasswordForEmail).toHaveBeenCalledTimes(1)
  expect(auth.resetPasswordForEmail.mock.calls[0][1].redirectTo).toContain('lang=en&mode=recovery')
  expect(host.querySelector('[role="status"]')!.textContent).toContain('If this email has an account')
  await render('vi')
  expect(host.querySelector('[role="status"]')!.textContent).toContain('Nếu email có tài khoản')
})

test('remount restores the pending email without storing passwords or repeating signup', async () => {
  await click('.auth-mode-switch button:last-child')
  const inputs = host.querySelectorAll<HTMLInputElement>('input[autocomplete="new-password"]')
  await fill(`#${inputs[1].id}`, 'example-password')
  await act(async () => { submit() })
  const stored = readPendingSignup()
  expect(stored?.resendAfter).toBeGreaterThan(Date.now())
  expect(Object.keys(stored!).sort()).toEqual(['email', 'expiresAt', 'resendAfter'])
  await act(async () => root.unmount())
  root = createRoot(host)
  await render()
  expect(host.querySelector('.otp-destination')!.textContent).toContain('learner@example.com')
  expect(host.querySelector('[data-confirmation="confirmed"]')).toBeNull()
  expect(host.querySelector('form, input[type="password"]')).toBeNull()
  expect(auth.signUp).toHaveBeenCalledTimes(1)
  expect(readPendingSignup()).toEqual(stored)
  await click('[data-action="change-email"]')
  expect(host.querySelector<HTMLInputElement>('input[type="email"]')!.value).toBe('learner@example.com')
  expect(readPendingSignup()).toBeNull()
})
