import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} signup verifies a code in the page with themed retry feedback`, async ({ page }) => {
    const vi = language === 'vi'
    const user = { id: '00000000-0000-4000-8000-000000000025', aud: 'authenticated', role: 'authenticated',
      email: 'otp@example.test', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01' }
    await page.addInitScript((language) => localStorage.setItem('journey-public-language', language), language)
    let verifies = 0
    let signups = 0
    let deadlines = 0
    let privateReads = 0
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.route('https://example.supabase.co/**', async (route) => {
      const request = route.request()
      const path = new URL(request.url()).pathname
      if (path === '/auth/v1/signup') {
        signups += 1
        expect(request.postDataJSON().email).toBe(user.email)
        return route.fulfill({ json: user })
      }
      if (path === '/auth/v1/verify') {
        verifies += 1
        expect(request.postDataJSON()).toMatchObject({ email: user.email, type: 'email', token: '123456' })
        if (verifies === 1) return route.fulfill({ status: 403,
          headers: {
            'x-supabase-api-version': '2024-01-01',
            'access-control-expose-headers': 'x-supabase-api-version',
          }, json: {
          code: 'otp_expired', msg: 'Token expired (synthetic)',
        } })
        const exp = Math.floor(Date.now() / 1000) + 3600
        const token = `${btoa('{"alg":"HS256","typ":"JWT"}')}.${btoa(JSON.stringify({
          sub: user.id, aud: 'authenticated', role: 'authenticated', exp,
        }))}.synthetic-signature`
        return route.fulfill({ json: { access_token: token, refresh_token: 'synthetic-refresh',
          token_type: 'bearer', expires_in: 3600, user } })
      }
      if (path === '/auth/v1/user') return route.fulfill({ json: user })
      if (path === '/rest/v1/rpc/get_session_deadline') {
        deadlines += 1
        return route.fulfill({ json: {
          server_time: new Date().toISOString(), expires_at: new Date(Date.now() + 86_400_000).toISOString(),
        } })
      }
      if (path === '/rest/v1/user_settings') {
        privateReads += 1
        return route.fulfill({ json: { user_id: user.id, language, track: 'standard', weekly_goal_minutes: 720,
          show_completed_lessons: true, target_role: 'internship', experience_level: 'beginner',
          onboarding_complete: true } })
      }
      if (path.startsWith('/rest/v1/') && request.method() === 'GET') {
        privateReads += 1
        return route.fulfill({ json: [] })
      }
      throw new Error(`Unexpected synthetic request: ${request.method()} ${path}`)
    })
    await page.goto('/auth/sign-in?next=%2Fsettings')
    await page.locator('.auth-mode-switch button').last().click()
    await page.getByLabel('Email', { exact: true }).fill(user.email)
    await page.locator('input[autocomplete="new-password"]').nth(0).fill('synthetic-password')
    await page.locator('input[autocomplete="new-password"]').nth(1).fill('synthetic-password')
    await page.locator('.auth-submit').click()
    const code = page.locator('#signup-code')
    await expect(code).toBeFocused()
    await expect(page.locator('.password-control')).toHaveCount(0)
    await expect(page.locator('[data-action="resend"]')).toBeDisabled()
    expect(signups).toBe(1)
    expect(privateReads).toBe(0)
    await code.fill('123 456')
    await page.locator('.auth-submit').click()
    await expect(page.getByRole('alert')).toContainText(vi ? 'hết hạn' : 'expired')
    await expect(code).toBeFocused()
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 950 })
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
        await checkThemeContrast(page)
        await page.locator('.auth-form-panel').screenshot({
          path: `.build/signup-otp-evidence/${language}-${theme}-${width}.png`,
        })
      }
    }
    expect(privateReads).toBe(0)
    await page.locator('.auth-submit').click()
    await expect(page.locator('.app-shell')).toBeVisible()
    expect(verifies).toBe(2)
    expect(deadlines).toBeGreaterThan(0)
    await expect.poll(() => privateReads).toBeGreaterThan(0)
    expect(errors).toEqual([])
  })
}

test('branded signup email shows a copyable code on desktop and narrow screens', async ({ page }) => {
  const html = readFileSync('supabase/templates/confirm-signup.html', 'utf8').replace('{{ .Token }}', '123456')
  await page.setContent(html)
  await expect(page.getByText('123456', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Xác nhận email của bạn' })).toBeVisible()
  await expect(page.locator('a')).toHaveCount(1)
  await expect(page.locator('a')).toHaveAttribute('href', 'https://journeyaiengineer.pages.dev')
  for (const width of [600, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    await checkThemeContrast(page)
    await page.screenshot({ path: `.build/signup-otp-evidence/email-${width}.png`, fullPage: true })
  }
})
