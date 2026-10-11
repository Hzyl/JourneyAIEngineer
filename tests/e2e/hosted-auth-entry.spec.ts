import { expect, test } from '@playwright/test'

for (const language of ['vi', 'en'] as const) {
  test(`${language} rejected login guides new users to signup with operation-specific errors`, async ({ page }) => {
    const vi = language === 'vi'
    const calls: string[] = []
    await page.addInitScript((value) => localStorage.setItem('journey-public-language', value), language)
    await page.route('https://example.supabase.co/**', async (route) => {
      const path = new URL(route.request().url()).pathname
      calls.push(path)
      if (path === '/auth/v1/token' || path === '/auth/v1/signup') {
        return route.fulfill({ status: 400, json: { code: 'invalid_credentials', msg: 'Invalid login credentials' } })
      }
      throw new Error(`Unexpected synthetic request: ${path}`)
    })
    await page.goto('/auth/sign-in?next=%2Froadmap')
    await page.getByLabel('Email', { exact: true }).fill('new-learner@example.test')
    await page.locator('input[autocomplete="current-password"]').fill('synthetic-password')
    await page.locator('.auth-submit').click()
    await expect(page.getByRole('alert')).toContainText(vi ? 'nếu bạn chưa đăng ký' : "if you haven't registered")
    await page.locator('.auth-create-account-link').click()
    await expect(page).toHaveURL(/\/auth\/sign-up\?next=%2Froadmap/)
    await page.reload()
    await expect(page.getByRole('heading', {
      name: vi ? 'Tạo tài khoản học tập' : 'Create your learning account',
    })).toBeVisible()
    await page.getByLabel('Email', { exact: true }).fill('new-learner@example.test')
    for (const input of await page.locator('input[autocomplete="new-password"]').all()) {
      await input.fill('synthetic-password')
    }
    await page.locator('.auth-submit').click()
    await expect(page.getByRole('alert')).toContainText(vi ? 'Chưa thể tạo tài khoản' : 'Your account could not be created')
    await expect(page.getByRole('alert')).not.toContainText(vi ? 'Không thể đăng nhập' : "We couldn't sign you in")
    expect(calls).toEqual(['/auth/v1/token', '/auth/v1/signup'])
  })

  for (const destination of ['/roadmap', '//outside.example/lesson/test']) {
  test(`${language} signup link in a new tab validates return destination ${destination}`, async ({ page, context }) => {
    const vi = language === 'vi'
    const user = { id: '00000000-0000-4000-8000-000000000026', aud: 'authenticated', role: 'authenticated',
      email: 'link@example.test', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01' }
    let deadlines = 0
    await context.addInitScript((value) => localStorage.setItem('journey-public-language', value), language)
    await context.route('https://example.supabase.co/**', async (route) => {
      const request = route.request()
      const path = new URL(request.url()).pathname
      if (path === '/auth/v1/signup') return route.fulfill({ json: user })
      if (path === '/auth/v1/user') return route.fulfill({ json: user })
      if (path === '/rest/v1/rpc/get_session_deadline') {
        deadlines += 1
        return route.fulfill({ json: {
          server_time: new Date().toISOString(), expires_at: new Date(Date.now() + 86_400_000).toISOString(),
        } })
      }
      if (path === '/rest/v1/user_settings') return route.fulfill({ json: {
        user_id: user.id, language, track: 'standard', weekly_goal_minutes: 720, show_completed_lessons: true,
        target_role: 'internship', experience_level: 'beginner', onboarding_complete: true,
      } })
      if (path.startsWith('/rest/v1/') && request.method() === 'GET') return route.fulfill({ json: [] })
      throw new Error(`Unexpected synthetic request: ${request.method()} ${path}`)
    })
    await page.goto(`/auth/sign-up?next=${encodeURIComponent(destination)}`)
    await page.getByLabel('Email', { exact: true }).fill(user.email)
    for (const input of await page.locator('input[autocomplete="new-password"]').all()) {
      await input.fill('synthetic-password')
    }
    await page.locator('.auth-submit').click()
    await expect(page.getByRole('heading', { name: vi ? 'Kiểm tra email của bạn' : 'Check your email' })).toBeVisible()
    await expect(page.locator('#signup-code')).toHaveCount(0)
    const exp = Math.floor(Date.now() / 1000) + 3600
    const token = `${btoa('{"alg":"HS256","typ":"JWT"}')}.${btoa(JSON.stringify({
      sub: user.id, aud: 'authenticated', role: 'authenticated', exp,
    }))}.synthetic-signature`
    const hash = new URLSearchParams({ access_token: token, refresh_token: 'synthetic-refresh',
      token_type: 'bearer', expires_in: '3600', type: 'signup' })
    // Simulate the browser destination after the email provider validates a link.
    // This does not prove inbox delivery or hosted token validation.
    const callback = await context.newPage()
    await callback.goto(`/auth/callback?lang=${language}#${hash}`)
    await expect(callback.locator('.app-shell')).toBeVisible()
    expect(deadlines).toBeGreaterThan(0)
    await expect(callback).toHaveURL(destination === '/roadmap' ? /\/roadmap$/ : /\/$/)
    expect(await callback.evaluate(() => localStorage.getItem('journey-confirmation-return'))).toBeNull()
  })
  }
}
