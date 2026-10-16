// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { SignupConfirmation } from '../auth/SignupConfirmation'
import { clearPendingSignup } from '../auth/pending-signup'

type TestUser = {
  id: string
  email?: string
  email_confirmed_at?: string | null
}
type UserResponse = {
  data: { user: TestUser | null }
  error: { code: string; message?: string } | null
}
type AuthListener = (event: string, session: { user: TestUser } | null) => unknown

const auth = vi.hoisted(() => ({
  getUser: vi.fn(),
  onAuthStateChange: vi.fn(),
  resend: vi.fn(),
}))
vi.mock('../platform/hosted/supabase-client', () => ({
  requireSupabase: () => ({ auth }),
}))

const email = 'learner@example.com'
const changeEmail = vi.fn()
const back = vi.fn()
const continueLearning = vi.fn()
const unsubscribe = vi.fn()
let host: HTMLDivElement
let root: Root
let mounted: boolean
let listener: AuthListener | undefined
let serverResponse: UserResponse

function verifiedUser(address = email): TestUser {
  return {
    id: 'synthetic-learner',
    email: address,
    email_confirmed_at: '2026-10-16T00:00:00.000Z',
  }
}

function response(user: TestUser | null = null): UserResponse {
  return { data: { user }, error: null }
}

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

function button(action: string): HTMLButtonElement {
  const element = host.querySelector<HTMLButtonElement>(`[data-action="${action}"]`)
  expect(element, `Missing ${action} button`).not.toBeNull()
  return element!
}

function expectWaiting() {
  expect(host.querySelector('[data-confirmation="confirmed"]')).toBeNull()
  expect(host.querySelector('[data-action="continue"]')).toBeNull()
  expect(continueLearning).not.toHaveBeenCalled()
}

async function render(language: 'vi' | 'en' = 'en', justSent = false, loading = false) {
  await act(async () => {
    root.render(
      <SignupConfirmation
        email={email}
        language={language}
        justSent={justSent}
        loading={loading}
        onChangeEmail={changeEmail}
        onBack={back}
        onContinue={continueLearning}
      />,
    )
    await vi.advanceTimersByTimeAsync(0)
  })
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0)
  })
}

async function click(action: string) {
  await act(async () => {
    button(action).click()
    await vi.advanceTimersByTimeAsync(0)
  })
}

async function emitAuth(event = 'SIGNED_IN', user: TestUser | null = verifiedUser()) {
  await act(async () => {
    expect(listener).toBeTypeOf('function')
    const callsBeforeCallback = auth.getUser.mock.calls.length
    const callbackResult = listener!(event, user ? { user } : null)
    expect(callbackResult).not.toBeInstanceOf(Promise)
    expect(auth.getUser).toHaveBeenCalledTimes(callsBeforeCallback)
    await vi.advanceTimersByTimeAsync(0)
  })
}

async function dispatchResume(event: 'focus' | 'pageshow' | 'visibilitychange') {
  await act(async () => {
    const target = event === 'visibilitychange' ? document : window
    target.dispatchEvent(new Event(event))
    await vi.advanceTimersByTimeAsync(0)
  })
}

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.useFakeTimers()
  vi.resetAllMocks()
  localStorage.clear()
  sessionStorage.clear()
  clearPendingSignup()
  window.history.replaceState({}, '', '/auth/sign-up?next=%2Froadmap')
  listener = undefined
  serverResponse = response()
  auth.getUser.mockImplementation(() => Promise.resolve(serverResponse))
  auth.onAuthStateChange.mockImplementation((callback: AuthListener) => {
    listener = callback
    return { data: { subscription: { unsubscribe } } }
  })
  auth.resend.mockResolvedValue({ error: null })
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  mounted = true
})

afterEach(async () => {
  if (mounted) {
    await act(async () => {
      root.unmount()
    })
  }
  host.remove()
  clearPendingSignup()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

test.each(['vi', 'en'] as const)('the %s screen offers only email-link confirmation', async (language) => {
  await render(language)
  expect(host.querySelector('.signup-confirmation')).not.toBeNull()
  expect(host.querySelector('.otp-destination')?.textContent).toContain(email)
  expect(host.textContent).toMatch(language === 'vi' ? /liên kết/ : /confirmation link/i)
  expect(host.textContent).not.toMatch(/\bOTP\b|one.time.code|verification code|mã (xác nhận|xác thực)/i)
  expect(host.querySelector('#signup-code, [data-action="enter-code"]')).toBeNull()
  expect(host.querySelector('input[autocomplete="one-time-code"], form')).toBeNull()
  expect(button('check-confirmation').disabled).toBe(false)
  expectWaiting()
})

test('an auth event is only a signal and verification runs outside the SDK callback', async () => {
  await render()
  auth.getUser.mockClear()
  await emitAuth()
  expect(auth.getUser).toHaveBeenCalledTimes(1)
  expectWaiting()
  serverResponse = response(verifiedUser())
  await emitAuth('USER_UPDATED')
  expect(auth.getUser).toHaveBeenCalledTimes(2)
  expect(host.querySelector('[data-confirmation="confirmed"]')?.getAttribute('role')).toBe('status')
})

test.each(['vi', 'en'] as const)('verified same-email success in %s waits for explicit continue', async (language) => {
  await render(language)
  const originalLocation = window.location.href
  serverResponse = response(verifiedUser(' LEARNER@EXAMPLE.COM '))
  await emitAuth()
  expect(host.querySelector('#auth-title')?.textContent).toBe(
    language === 'vi' ? 'Email đã được xác nhận' : 'Email confirmed',
  )
  expect(button('continue').textContent).toBe(
    language === 'vi' ? 'Tiếp tục học' : 'Continue learning',
  )
  expect(continueLearning).not.toHaveBeenCalled()
  expect(window.location.href).toBe(originalLocation)
  serverResponse = response()
  await dispatchResume('focus')
  expect(host.querySelector('[data-confirmation="confirmed"]')).not.toBeNull()
  await click('continue')
  expect(continueLearning).toHaveBeenCalledTimes(1)
  expect(changeEmail).not.toHaveBeenCalled()
  expect(back).not.toHaveBeenCalled()
})

test.each<{ label: string; result: UserResponse }>([
  { label: 'a different confirmed email', result: response(verifiedUser('other@example.com')) },
  {
    label: 'the matching email without confirmation',
    result: response({ ...verifiedUser(), email_confirmed_at: null }),
  },
  {
    label: 'a user without an email',
    result: response({ id: 'synthetic', email_confirmed_at: '2026-10-16T00:00:00Z' }),
  },
  { label: 'no authenticated user', result: response() },
  {
    label: 'a provider error even when user data is present',
    result: { data: { user: verifiedUser() }, error: { code: 'invalid_session' } },
  },
])('a signed-in event cannot confirm $label', async ({ result }) => {
  await render()
  serverResponse = result
  await emitAuth()
  expectWaiting()
})

test('a rejected server verification remains pending and a manual recheck can recover', async () => {
  await render()
  auth.getUser.mockRejectedValueOnce(new Error('Synthetic network failure'))
  await emitAuth()
  expectWaiting()
  serverResponse = response(verifiedUser())
  const previousCalls = auth.getUser.mock.calls.length
  await click('check-confirmation')
  expect(auth.getUser).toHaveBeenCalledTimes(previousCalls + 1)
  expect(host.querySelector('[data-confirmation="confirmed"]')).not.toBeNull()
  expect(continueLearning).not.toHaveBeenCalled()
})

test.each(['focus', 'pageshow', 'visibilitychange'] as const)(
  '%s recovers a confirmation completed while the original tab was inactive',
  async (event) => {
    if (event === 'visibilitychange') {
      vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible')
    }
    await render()
    auth.getUser.mockClear()
    serverResponse = response(verifiedUser())
    await dispatchResume(event)
    expect(auth.getUser).toHaveBeenCalledTimes(1)
    expect(host.querySelector('[data-confirmation="confirmed"]')).not.toBeNull()
    expect(continueLearning).not.toHaveBeenCalled()
  },
)

test('hidden visibility changes do not trigger verification and time alone does not poll', async () => {
  await render()
  auth.getUser.mockClear()
  vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
  await dispatchResume('visibilitychange')
  await act(async () => {
    await vi.advanceTimersByTimeAsync(120_000)
  })
  expect(auth.getUser).not.toHaveBeenCalled()
  expectWaiting()
})

test('concurrent auth and resume signals share one outstanding server verification', async () => {
  await render()
  auth.getUser.mockClear()
  const pending = deferred<UserResponse>()
  auth.getUser.mockReturnValueOnce(pending.promise)
  await emitAuth()
  await emitAuth('TOKEN_REFRESHED')
  await dispatchResume('focus')
  await dispatchResume('pageshow')
  expect(auth.getUser).toHaveBeenCalledTimes(1)
  expectWaiting()
  await act(async () => {
    pending.resolve(response(verifiedUser()))
  })
  expect(host.querySelector('[data-confirmation="confirmed"]')).not.toBeNull()
})

test('SIGNED_OUT invalidates a successful verification response still in flight', async () => {
  await render()
  const pending = deferred<UserResponse>()
  auth.getUser.mockReturnValueOnce(pending.promise)
  await emitAuth()
  await emitAuth('SIGNED_OUT', null)
  await act(async () => {
    pending.resolve(response(verifiedUser()))
    await vi.advanceTimersByTimeAsync(0)
  })
  expectWaiting()
  serverResponse = response(verifiedUser())
  await emitAuth()
  expect(host.querySelector('[data-confirmation="confirmed"]')).not.toBeNull()
})

test('unmount unsubscribes and discards late verification responses and resume signals', async () => {
  await render('en', true)
  const pending = deferred<UserResponse>()
  auth.getUser.mockReturnValueOnce(pending.promise)
  await emitAuth()
  await act(async () => {
    root.unmount()
  })
  mounted = false
  expect(unsubscribe).toHaveBeenCalledTimes(1)
  auth.getUser.mockClear()
  await act(async () => {
    pending.resolve(response(verifiedUser()))
    window.dispatchEvent(new Event('focus'))
    window.dispatchEvent(new Event('pageshow'))
    document.dispatchEvent(new Event('visibilitychange'))
    await vi.advanceTimersByTimeAsync(60_000)
  })
  expect(host.childElementCount).toBe(0)
  expect(auth.getUser).not.toHaveBeenCalled()
  expect(continueLearning).not.toHaveBeenCalled()
  expect(vi.getTimerCount()).toBe(0)
})

test('a fresh signup cannot resend until the full 60-second cooldown expires', async () => {
  await render('en', true)
  expect(button('resend').disabled).toBe(true)
  await click('resend')
  expect(auth.resend).not.toHaveBeenCalled()
  await act(async () => {
    await vi.advanceTimersByTimeAsync(59_000)
  })
  expect(button('resend').disabled).toBe(true)
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1_000)
  })
  expect(button('resend').disabled).toBe(false)
})

test('duplicate resends use one signup request for the bound email and callback language', async () => {
  await render()
  const pending = deferred<{ error: null }>()
  auth.resend.mockReturnValueOnce(pending.promise)
  await act(async () => {
    button('resend').click()
    button('resend').click()
  })
  expect(auth.resend).toHaveBeenCalledExactlyOnceWith({
    type: 'signup',
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback?lang=en` },
  })
  expect(button('resend').disabled).toBe(true)
  await render('vi')
  await act(async () => {
    pending.resolve({ error: null })
  })
  expect(host.querySelector('[role="status"]')?.textContent).toContain('Nếu địa chỉ này cần xác nhận')
  expectWaiting()
  expect(button('resend').disabled).toBe(true)
  await act(async () => {
    await vi.advanceTimersByTimeAsync(60_000)
  })
  await click('resend')
  expect(auth.resend).toHaveBeenCalledTimes(2)
  expect(auth.resend.mock.calls[1][0]).toMatchObject({
    type: 'signup',
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback?lang=vi` },
  })
})

test('provider rate limiting has distinct feedback and prevents immediate resend retries', async () => {
  await render()
  auth.resend.mockResolvedValueOnce({ error: { code: 'over_email_send_rate_limit' } })
  await click('resend')
  expect(host.querySelector('[role="alert"]')?.textContent).toMatch(/wait|too many/i)
  expect(button('resend').disabled).toBe(true)
  await click('resend')
  expect(auth.resend).toHaveBeenCalledTimes(1)
  expectWaiting()
  await render('vi')
  expect(host.querySelector('[role="alert"]')?.textContent).toMatch(/chờ|quá nhiều/i)
  await act(async () => {
    await vi.advanceTimersByTimeAsync(60_000)
  })
  expect(button('resend').disabled).toBe(false)
})

test.each(['response', 'rejection'] as const)(
  'a resend %s failure is visible, cannot confirm the account and allows a later retry',
  async (failure) => {
    await render()
    if (failure === 'response') {
      auth.resend.mockResolvedValueOnce({
        error: { code: 'unexpected_failure', message: 'Synthetic provider internals' },
      })
    } else {
      auth.resend.mockRejectedValueOnce(new Error('Synthetic provider internals'))
    }
    await click('resend')
    expect(host.querySelector('[role="alert"]')?.textContent?.trim()).toBeTruthy()
    expect(host.textContent).not.toContain('Synthetic provider internals')
    expectWaiting()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000)
    })
    await click('resend')
    expect(auth.resend).toHaveBeenCalledTimes(2)
    expect(host.querySelector('[role="alert"]')).toBeNull()
    expect(host.querySelector('[role="status"]')?.textContent).toContain('If this address needs confirmation')
    expectWaiting()
  },
)

test('correcting the address and returning remain separate actions before verification', async () => {
  await render()
  await click('change-email')
  expect(changeEmail).toHaveBeenCalledTimes(1)
  expect(back).not.toHaveBeenCalled()
  const backButton = [...host.querySelectorAll<HTMLButtonElement>('.auth-secondary-actions button')]
    .find((element) => /back/i.test(element.textContent ?? ''))
  expect(backButton).toBeDefined()
  await act(async () => {
    backButton!.click()
  })
  expect(back).toHaveBeenCalledTimes(1)
  expect(continueLearning).not.toHaveBeenCalled()
})

test('external loading prevents duplicate resend and email correction actions', async () => {
  await render('en', false, true)
  expect(button('resend').disabled).toBe(true)
  expect(button('change-email').disabled).toBe(true)
  await click('resend')
  await click('change-email')
  expect(auth.resend).not.toHaveBeenCalled()
  expect(changeEmail).not.toHaveBeenCalled()
})
