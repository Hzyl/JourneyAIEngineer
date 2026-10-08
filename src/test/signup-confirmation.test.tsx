// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { SignupConfirmation } from '../auth/SignupConfirmation'

const auth = vi.hoisted(() => ({ verifyOtp: vi.fn(), resend: vi.fn() }))
vi.mock('../platform/hosted/supabase-client', () => ({ requireSupabase: () => ({ auth }) }))
let host: HTMLDivElement
let root: Root
const back = vi.fn()
const render = (language: 'vi' | 'en' = 'en', justSent = false) => act(async () => {
  root.render(<SignupConfirmation email="learner@example.com" language={language}
    justSent={justSent} onChangeEmail={back} onBack={back} loading={false} />)
})
const fill = (value: string) => act(async () => {
  const input = host.querySelector('input')!
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
})
const submit = () => host.querySelector('form')!.dispatchEvent(new Event('submit', {
  bubbles: true, cancelable: true,
}))
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.useFakeTimers()
  vi.resetAllMocks()
  auth.verifyOtp.mockResolvedValue({ data: { session: { user: { id: 'synthetic' } } }, error: null })
  auth.resend.mockResolvedValue({ error: null })
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  vi.useRealTimers()
})

test('code entry accepts pasted spaces and calls the provider for the bound email only once', async () => {
  await render()
  let resolve!: (value: unknown) => void
  auth.verifyOtp.mockReturnValueOnce(new Promise((done) => { resolve = done }))
  await fill(' 123 456 ')
  await act(async () => { submit(); submit() })
  expect(auth.verifyOtp).toHaveBeenCalledExactlyOnceWith({
    email: 'learner@example.com', token: '123456', type: 'email',
  })
  expect([...host.querySelectorAll('button')].every((button) => button.disabled)).toBe(true)
  expect(host.querySelector('input')!.autocomplete).toBe('one-time-code')
  await act(async () => resolve({ data: { session: { user: { id: 'synthetic' } } }, error: null }))
  expect(host.querySelector('[role="status"]')!.textContent).toContain('confirmed')
})

test('blank and nonnumeric codes are rejected before contacting Auth', async () => {
  await render()
  await act(async () => { submit() })
  expect(auth.verifyOtp).not.toHaveBeenCalled()
  await fill('abcdef')
  await act(async () => { submit() })
  expect(auth.verifyOtp).not.toHaveBeenCalled()
  expect(host.querySelector('input')!.getAttribute('aria-invalid')).toBe('true')
})

test('expired code preserves input, translates feedback and allows a retry', async () => {
  auth.verifyOtp.mockResolvedValueOnce({ data: { session: null }, error: { code: 'otp_expired' } })
  await render()
  await fill('123456')
  await act(async () => { submit() })
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('expired')
  await render('vi')
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('hết hạn')
  expect(host.querySelector('input')!.value).toBe('123456')
  await act(async () => { submit() })
  expect(auth.verifyOtp).toHaveBeenCalledTimes(2)
})

test('an empty successful provider response is not treated as confirmed', async () => {
  auth.verifyOtp.mockResolvedValueOnce({ data: { session: null }, error: null })
  await render()
  await fill('123456')
  await act(async () => { submit() })
  expect(host.querySelector('[role="alert"]')).not.toBeNull()
  expect(host.querySelector('button[type="submit"]')!.hasAttribute('disabled')).toBe(false)
})

test('fresh signup cooldown expires and resend is guarded then starts a new cooldown', async () => {
  await render('en', true)
  const resend = () => host.querySelector<HTMLButtonElement>('[data-action="resend"]')!
  expect(resend().disabled).toBe(true)
  await act(async () => vi.advanceTimersByTime(60_000))
  expect(resend().disabled).toBe(false)
  await act(async () => { resend().click(); resend().click() })
  expect(auth.resend).toHaveBeenCalledTimes(1)
  expect(auth.resend.mock.calls[0][0]).toMatchObject({ type: 'signup', email: 'learner@example.com' })
  expect(resend().disabled).toBe(true)
  expect(host.querySelector('[role="status"]')!.textContent).toContain('If this address needs confirmation')
})

test('rate limiting gets distinct feedback and prevents immediate email retry', async () => {
  await render()
  auth.resend.mockResolvedValueOnce({ error: { code: 'over_email_send_rate_limit' } })
  await act(async () => host.querySelector<HTMLButtonElement>('[data-action="resend"]')!.click())
  expect(host.querySelector('[role="alert"]')!.textContent).toContain('Wait')
  expect(host.querySelector<HTMLButtonElement>('[data-action="resend"]')!.disabled).toBe(true)
})

test('email correction and back remain available before verification', async () => {
  await render()
  await act(async () => host.querySelector<HTMLButtonElement>('[data-action="change-email"]')!.click())
  expect(back).toHaveBeenCalledTimes(1)
  expect(host.querySelector('input')!.getAttribute('inputmode')).toBe('numeric')
})
