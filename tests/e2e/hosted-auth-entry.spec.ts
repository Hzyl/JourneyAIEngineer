import { expect, test } from '@playwright/test'

for (const language of ['vi', 'en'] as const) {
  test(`${language} rejected login guides new users to signup with operation-specific errors`, async ({ page, context }) => {
    const vi = language === 'vi'
    const calls: string[] = []
    await context.addInitScript((value) => {
      if (location.origin !== 'null') localStorage.setItem('journey-public-language', value)
    }, language)
    await context.route('https://example.supabase.co/**', async (route) => {
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

  for (const destination of ['/roadmap', '//outside.example/lesson/test', 'https://outside.example/lesson/test', '/settings']) {
    test(`${language} signup callback and original tab allowlist destination ${destination}`, async ({ page, context }) => {
      const vi = language === 'vi'
      const user = {
        id: '00000000-0000-4000-8000-000000000026',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'link@example.test',
        email_confirmed_at: null as string | null,
        app_metadata: {},
        user_metadata: {},
        created_at: '2026-01-01T00:00:00.000Z',
      }
      const payload = {
        sub: user.id,
        aud: 'authenticated',
        role: 'authenticated',
        exp: Math.floor(Date.now() / 1000) + 3600,
      }
      const token = `${btoa('{"alg":"HS256","typ":"JWT"}')}.${btoa(JSON.stringify(payload))}.synthetic-signature`
      let confirmedAt: string | null = null
      let deadlines = 0
      let originalPrivateReads = 0
      let prematureReads = 0
      const admittedPages = new Set<string>()
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      context.on('page', (created) => created.on('pageerror', (error) => errors.push(error.message)))
      await context.addInitScript((value) => {
        // A newly created callback tab starts on about:blank without storage.
        if (location.origin !== 'null') localStorage.setItem('journey-public-language', value)
      }, language)
      await context.route('https://example.supabase.co/**', async (route) => {
        const request = route.request()
        const path = new URL(request.url()).pathname
        const source = request.frame().page()
        if (path === '/auth/v1/signup') {
          expect(request.postDataJSON().email).toBe(user.email)
          return route.fulfill({ json: user })
        }
        if (path === '/auth/v1/user') {
          expect(request.headers().authorization).toBe(`Bearer ${token}`)
          if (new URL(source.url()).pathname === '/auth/callback') {
            confirmedAt = new Date().toISOString()
          }
          return route.fulfill({ json: { ...user, email_confirmed_at: confirmedAt } })
        }
        if (path === '/rest/v1/rpc/get_session_deadline') {
          deadlines += 1
          admittedPages.add(source === page ? 'original' : 'callback')
          return route.fulfill({ json: {
            server_time: new Date().toISOString(),
            expires_at: new Date(Date.now() + 86_400_000).toISOString(),
          } })
        }
        if (path === '/rest/v1/rpc/is_current_user_admin') {
          return route.fulfill({ json: false })
        }
        if (path.startsWith('/rest/v1/') && request.method() === 'GET') {
          if (source === page) originalPrivateReads += 1
          if (!admittedPages.has(source === page ? 'original' : 'callback')) prematureReads += 1
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
      await page.goto(`/auth/sign-up?next=${encodeURIComponent(destination)}`)
      await page.getByLabel('Email', { exact: true }).fill(user.email)
      for (const input of await page.locator('input[autocomplete="new-password"]').all()) {
        await input.fill('synthetic-password')
      }
      await page.locator('.auth-submit').click()
      await expect(page.getByRole('heading', { name: vi ? 'Kiểm tra email của bạn' : 'Check your email' })).toBeVisible()
      await expect(page.locator('#signup-code, [data-action="enter-code"], [autocomplete="one-time-code"]')).toHaveCount(0)
      expect(confirmedAt).toBeNull()
      expect(originalPrivateReads).toBe(0)
      const hash = new URLSearchParams({
        access_token: token,
        refresh_token: 'synthetic-refresh',
        token_type: 'bearer',
        expires_in: '3600',
        type: 'signup',
      })
      // Synthetic provider boundary: /user validates this callback token.
      // This does not prove inbox delivery or hosted token validation.
      const callback = await context.newPage()
      await callback.goto(`/auth/callback?lang=${language}#${hash}`)
      const expectedRoute = destination === '/roadmap' ? /\/roadmap$/ : /\/$/
      await expect(callback).toHaveURL(expectedRoute)
      await expect(callback.locator('.app-shell')).toBeVisible()
      expect(confirmedAt).not.toBeNull()
      expect(deadlines).toBeGreaterThan(0)
      expect(await callback.evaluate(() => localStorage.getItem('journey-confirmation-return'))).toBeNull()
      await expect(page.locator('[data-confirmation="confirmed"]')).toBeVisible()
      await expect(page.locator('[data-confirmation="confirmed"]')).toHaveAttribute('role', 'status')
      const continueButton = page.locator('[data-action="continue"]')
      await expect(continueButton).toHaveAccessibleName(vi ? 'Tiếp tục học' : 'Continue learning')
      expect(new URL(page.url()).pathname).toBe('/auth/sign-up')
      expect(new URL(page.url()).searchParams.get('next')).toBe(destination)
      expect(originalPrivateReads).toBe(0)
      await continueButton.click()
      await expect(page).toHaveURL(expectedRoute)
      await expect(page.locator('.app-shell')).toBeVisible()
      expect(await page.evaluate(() => sessionStorage.getItem('journey-pending-signup'))).toBeNull()
      expect(prematureReads).toBe(0)
      expect(errors).toEqual([])
    })
  }
}
