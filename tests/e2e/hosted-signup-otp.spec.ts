import { expect, test, type BrowserContext, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { checkThemeContrast } from './theme-checks'

type Language = 'vi' | 'en'
type SyntheticUser = {
  id: string
  aud: string
  role: string
  email: string
  email_confirmed_at: string | null
  app_metadata: Record<string, unknown>
  user_metadata: Record<string, unknown>
  created_at: string
}

async function mockSignup(context: BrowserContext, language: Language, blockBroadcast = false) {
  const user: SyntheticUser = {
    id: '00000000-0000-4000-8000-000000000025',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'link@example.test',
    email_confirmed_at: null,
    app_metadata: {},
    user_metadata: {},
    created_at: '2026-01-01T00:00:00.000Z',
  }
  const tokens = new Map<string, SyntheticUser>()
  const admittedPages = new Set<Page>()
  const privateReads = new Map<Page, number>()
  const calls: string[] = []
  const prematureReads: string[] = []
  const errors: string[] = []
  let signups = 0
  let validatedCallbacks = 0
  await context.addInitScript(({ language, blockBroadcast }) => {
    // New tabs visit about:blank before the app; that opaque origin has no storage.
    if (location.origin === 'null') return
    localStorage.setItem('journey-public-language', language)
    if (blockBroadcast) {
      Object.defineProperty(window, 'BroadcastChannel', {
        configurable: true,
        value: class {
          constructor() {
            throw new DOMException('BroadcastChannel disabled by this test', 'SecurityError')
          }
        },
      })
    }
  }, { language, blockBroadcast })
  for (const page of context.pages()) {
    page.on('pageerror', (error) => errors.push(error.message))
  }
  context.on('page', (page) => page.on('pageerror', (error) => errors.push(error.message)))
  await context.route('https://example.supabase.co/**', async (route) => {
    const request = route.request()
    const path = new URL(request.url()).pathname
    const source = request.frame().page()
    calls.push(path)
    if (path === '/auth/v1/signup') {
      signups += 1
      expect(request.postDataJSON().email).toBe(user.email)
      return route.fulfill({ json: { ...user, email_confirmed_at: null } })
    }
    if (path === '/auth/v1/user') {
      const token = request.headers().authorization?.replace(/^Bearer /, '') ?? ''
      const account = tokens.get(token)
      if (!account) {
        return route.fulfill({ status: 401, json: { code: 'bad_jwt', msg: 'Invalid synthetic token' } })
      }
      if (new URL(source.url()).pathname === '/auth/callback') {
        account.email_confirmed_at = new Date().toISOString()
        validatedCallbacks += 1
      }
      return route.fulfill({ json: account })
    }
    if (path === '/rest/v1/rpc/get_session_deadline') {
      admittedPages.add(source)
      return route.fulfill({ json: {
        server_time: new Date().toISOString(),
        expires_at: new Date(Date.now() + 86_400_000).toISOString(),
      } })
    }
    if (path === '/rest/v1/rpc/is_current_user_admin') {
      return route.fulfill({ json: false })
    }
    if (path.startsWith('/rest/v1/') && request.method() === 'GET') {
      privateReads.set(source, (privateReads.get(source) ?? 0) + 1)
      if (!admittedPages.has(source)) prematureReads.push(path)
      if (path === '/rest/v1/user_settings') {
        return route.fulfill({ json: {
          user_id: user.id,
          language,
          track: 'standard',
          weekly_goal_minutes: 720,
          show_completed_lessons: true,
          target_role: 'internship',
          experience_level: 'beginner',
          onboarding_complete: true,
        } })
      }
      return route.fulfill({ json: [] })
    }
    throw new Error(`Unexpected synthetic request: ${request.method()} ${path}`)
  })
  const openCallback = async (differentAccount = false) => {
    const account = {
      ...user,
      id: differentAccount ? '00000000-0000-4000-8000-000000000099' : user.id,
      email: differentAccount ? 'different@example.test' : user.email,
    }
    const payload = {
      sub: account.id,
      aud: 'authenticated',
      role: 'authenticated',
      exp: Math.floor(Date.now() / 1000) + 3600,
    }
    const token = `${btoa('{"alg":"HS256","typ":"JWT"}')}.${btoa(JSON.stringify(payload))}.synthetic-signature`
    tokens.set(token, account)
    const hash = new URLSearchParams({
      access_token: token,
      refresh_token: 'synthetic-refresh',
      token_type: 'bearer',
      expires_in: '3600',
      type: 'signup',
    })
    // Synthetic provider boundary: no real email delivery or hosted validation.
    const callback = await context.newPage()
    await callback.goto(`/auth/callback?lang=${language}#${hash}`)
    return callback
  }
  return {
    user,
    calls,
    errors,
    prematureReads,
    openCallback,
    privateReads: (page: Page) => privateReads.get(page) ?? 0,
    signups: () => signups,
    validatedCallbacks: () => validatedCallbacks,
  }
}

async function startSignup(page: Page, language: Language, email: string) {
  await page.goto('/auth/sign-up?next=%2Fexercises')
  await page.getByLabel('Email', { exact: true }).fill(email)
  for (const input of await page.locator('input[autocomplete="new-password"]').all()) {
    await input.fill('synthetic-password')
  }
  await page.locator('.auth-submit').click()
  await expect(page.locator('#auth-title')).toHaveText(
    language === 'vi' ? 'Kiểm tra email của bạn' : 'Check your email',
  )
  await expect(page.locator('#auth-title')).toBeFocused()
  await expect(page.locator('.otp-destination')).toContainText(email)
  await expect(page.locator('#signup-code, [data-action="enter-code"], [autocomplete="one-time-code"]')).toHaveCount(0)
  await expect(page.locator('.password-control')).toHaveCount(0)
  await expect(page.locator('[data-action="resend"]')).toBeDisabled()
}

async function checkConfirmationLayout(page: Page, language: Language, state: 'pending' | 'confirmed') {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 950 })
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      await checkThemeContrast(page)
      const action = page.locator(`[data-action="${state === 'pending' ? 'check-confirmation' : 'continue'}"]`)
      expect(await action.evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16)
      expect((await action.boundingBox())!.height).toBeGreaterThanOrEqual(44)
      await page.locator('.auth-form-panel').screenshot({
        path: `.build/auth-email-link/${language}-${theme}-${width}-${state}.png`,
      })
    }
  }
}

for (const language of ['vi', 'en'] as const) {
  test(`${language} email link confirms the original tab until keyboard continuation`, async ({ page, context }) => {
    test.setTimeout(60_000)
    const vi = language === 'vi'
    const fixture = await mockSignup(context, language)
    await startSignup(page, language, fixture.user.email)
    expect(fixture.user.email_confirmed_at).toBeNull()
    expect(fixture.signups()).toBe(1)
    expect(fixture.privateReads(page)).toBe(0)
    await checkConfirmationLayout(page, language, 'pending')

    await page.reload()
    await expect(page.locator('.otp-destination')).toContainText(fixture.user.email)
    await expect(page.locator('[data-confirmation="confirmed"]')).toHaveCount(0)
    await expect(page.locator('[data-action="resend"]')).toBeDisabled()
    const pending = await page.evaluate(() => JSON.parse(sessionStorage.getItem('journey-pending-signup') ?? 'null'))
    expect(Object.keys(pending).sort()).toEqual(['email', 'expiresAt', 'resendAfter'])
    expect(pending.email).toBe(fixture.user.email)
    expect(fixture.signups()).toBe(1)

    const callback = await fixture.openCallback()
    await expect(callback).toHaveURL(/\/exercises$/)
    await expect(callback.locator('.app-shell')).toBeVisible()
    expect(fixture.validatedCallbacks()).toBeGreaterThan(0)
    const success = page.locator('[data-confirmation="confirmed"]')
    const continueButton = page.locator('[data-action="continue"]')
    await expect(success).toBeVisible()
    await expect(success).toHaveAttribute('role', 'status')
    await expect(page.locator('#auth-title')).toHaveText(vi ? 'Email đã được xác nhận' : 'Email confirmed')
    await expect(continueButton).toHaveAccessibleName(vi ? 'Tiếp tục học' : 'Continue learning')
    await expect(page).toHaveURL(/\/auth\/sign-up\?next=%2Fexercises$/)
    await expect(page.locator('.app-shell')).toHaveCount(0)
    expect(fixture.privateReads(page)).toBe(0)
    await checkConfirmationLayout(page, language, 'confirmed')

    await page.reload()
    await expect(success).toBeVisible()
    await page.bringToFront()
    await page.evaluate(() => window.dispatchEvent(new Event('focus')))
    await expect(success).toBeVisible()
    await expect(continueButton).toBeEnabled()
    await expect(page).toHaveURL(/\/auth\/sign-up\?next=%2Fexercises$/)
    expect(fixture.privateReads(page)).toBe(0)
    await continueButton.focus()
    await expect(continueButton).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/exercises$/)
    await expect(page.locator('.app-shell')).toBeVisible()
    expect(await page.evaluate(() => sessionStorage.getItem('journey-pending-signup'))).toBeNull()
    await expect.poll(() => fixture.privateReads(page)).toBeGreaterThan(0)
    expect(fixture.calls).not.toContain('/auth/v1/verify')
    expect(fixture.prematureReads).toEqual([])
    expect(fixture.errors).toEqual([])
  })

  test(`${language} expired callback leaves the original signup pending`, async ({ page, context }) => {
    const fixture = await mockSignup(context, language)
    await startSignup(page, language, fixture.user.email)
    const callback = await context.newPage()
    const errorHash = new URLSearchParams({
      error: 'access_denied',
      error_code: 'otp_expired',
      error_description: 'Email link is invalid or has expired',
    })
    await callback.goto(`/auth/callback?lang=${language}#${errorHash}`)
    await expect(callback.getByRole('alert')).toContainText(language === 'vi' ? 'hết hạn' : 'expired')
    await page.bringToFront()
    const check = page.locator('[data-action="check-confirmation"]')
    await expect(check).toBeEnabled()
    await check.focus()
    await expect(check).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('.signup-confirmation')).toHaveAttribute('aria-busy', 'false')
    await expect(page.locator('#auth-title')).toHaveText(
      language === 'vi' ? 'Kiểm tra email của bạn' : 'Check your email',
    )
    await expect(page.locator('[data-confirmation="confirmed"], [data-action="continue"]')).toHaveCount(0)
    await expect(page).toHaveURL(/\/auth\/sign-up\?next=%2Fexercises$/)
    await expect(callback).toHaveURL(/\/auth\/callback\?/)
    expect(fixture.validatedCallbacks()).toBe(0)
    expect(fixture.privateReads(page)).toBe(0)
    expect(fixture.privateReads(callback)).toBe(0)
    expect(fixture.signups()).toBe(1)
    expect(fixture.errors).toEqual([])
  })
}

test('a different confirmed account cannot confirm the original signup email', async ({ page, context }) => {
  const fixture = await mockSignup(context, 'en')
  await startSignup(page, 'en', fixture.user.email)
  const callback = await fixture.openCallback(true)
  await expect(callback).toHaveURL(/\/exercises$/)
  await expect(callback.locator('.app-shell')).toBeVisible()
  expect(fixture.validatedCallbacks()).toBeGreaterThan(0)
  await page.bringToFront()
  const checked = page.waitForResponse((response) => new URL(response.url()).pathname === '/auth/v1/user')
  await page.evaluate(() => window.dispatchEvent(new Event('focus')))
  await (await checked).finished()
  await expect(page.locator('.signup-confirmation')).toHaveAttribute('aria-busy', 'false')
  await expect(page.locator('#auth-title')).toHaveText('Check your email')
  await expect(page.locator('.otp-destination')).toContainText(fixture.user.email)
  await expect(page.locator('[data-confirmation="confirmed"], [data-action="continue"]')).toHaveCount(0)
  await expect(page).toHaveURL(/\/auth\/sign-up\?next=%2Fexercises$/)
  await page.reload()
  await expect(page.locator('.otp-destination')).toContainText(fixture.user.email)
  await expect(page.locator('.signup-confirmation')).toHaveAttribute('aria-busy', 'false')
  await expect(page.locator('[data-confirmation="confirmed"], [data-action="continue"]')).toHaveCount(0)
  expect(fixture.privateReads(page)).toBe(0)
  expect(fixture.prematureReads).toEqual([])
  expect(fixture.errors).toEqual([])
})

test('focus recovers confirmed email when BroadcastChannel is blocked', async ({ page, context }) => {
  const fixture = await mockSignup(context, 'en', true)
  await startSignup(page, 'en', fixture.user.email)
  const callback = await fixture.openCallback()
  await expect(callback).toHaveURL(/\/exercises$/)
  await expect(callback.locator('.app-shell')).toBeVisible()
  await page.bringToFront()
  await page.evaluate(() => window.dispatchEvent(new Event('focus')))
  await expect(page.locator('[data-confirmation="confirmed"]')).toBeVisible()
  await expect(page.locator('[data-action="continue"]')).toHaveAccessibleName('Continue learning')
  await expect(page).toHaveURL(/\/auth\/sign-up\?next=%2Fexercises$/)
  expect(fixture.privateReads(page)).toBe(0)
  await page.locator('[data-action="continue"]').click()
  await expect(page).toHaveURL(/\/exercises$/)
  await expect(page.locator('.app-shell')).toBeVisible()
  expect(fixture.prematureReads).toEqual([])
  expect(fixture.errors).toEqual([])
})

test('historical undeployed OTP email candidate remains readable at narrow widths', async ({ page }) => {
  const html = readFileSync('supabase/templates/confirm-signup.html', 'utf8').replace('{{ .Token }}', '123456')
  await page.setContent(html)
  await expect(page.getByText('123456', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Xác nhận email của bạn' })).toBeVisible()
  await expect(page.locator('a')).toHaveCount(1)
  await expect(page.locator('a')).toHaveAttribute('href', 'https://journeyaiengineer.pages.dev')
  for (const width of [600, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    await checkThemeContrast(page)
    await page.screenshot({ path: `.build/auth-email-link/historical-otp-email-${width}.png`, fullPage: true })
  }
})
