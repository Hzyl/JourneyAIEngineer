// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { AuthScreen } from '../auth/AuthScreen'

const auth = vi.hoisted(() => ({
  signInWithPassword: vi.fn(), signUp: vi.fn(), resend: vi.fn(), resetPasswordForEmail: vi.fn(),
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
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.resetAllMocks()
  for (const call of Object.values(auth)) call.mockResolvedValue({ error: null })
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
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('Email hoặc mật khẩu chưa đúng')
  expect(host.querySelector<HTMLInputElement>('.password-control input')!.value).toBe('example-password')
  await act(async () => { submit() })
  expect(auth.signInWithPassword).toHaveBeenCalledTimes(2)
})

test('unconfirmed-email resend keeps the same address, language and duplicate guard', async () => {
  auth.signInWithPassword.mockResolvedValueOnce({ error: { code: 'email_not_confirmed' } })
  await act(async () => { submit() })
  expect(host.querySelector('[role="status"]')!.textContent).toContain('not confirmed')
  let resolve!: (result: unknown) => void
  auth.resend.mockReturnValueOnce(new Promise((done) => { resolve = done }))
  await act(async () => {
    host.querySelector<HTMLButtonElement>('.auth-notice button')!.click()
    host.querySelector<HTMLButtonElement>('.auth-notice button')!.click()
  })
  expect(auth.resend).toHaveBeenCalledTimes(1)
  expect(auth.resend.mock.calls[0][0].email).toBe('learner@example.com')
  expect(auth.resend.mock.calls[0][0].options.emailRedirectTo).toContain('/auth/callback?lang=en')
  await render('vi')
  await act(async () => resolve({ error: null }))
  expect(host.querySelector('[role="status"]')!.textContent).toContain('Đã gửi lại email xác nhận')
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
