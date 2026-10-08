import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} sign-out shows pending feedback and handles SDK local cleanup after a server error`, async ({ page }) => {
    const vi = language === 'vi'
    const user = {
      id: '00000000-0000-4000-8000-000000000001', aud: 'authenticated', role: 'authenticated',
      email: 'learner@example.test', app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: {}, created_at: '2026-01-01',
    }
    await page.addInitScript(({ user, language }) => {
      const exp = Math.floor(Date.now() / 1000) + 3600
      const token = `${btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))}.${btoa(JSON.stringify({
        sub: user.id, aud: 'authenticated', role: 'authenticated', exp,
      }))}.synthetic-test-signature`
      localStorage.setItem('journey-public-language', language)
      localStorage.setItem('sb-example-auth-token', JSON.stringify({
        access_token: token, refresh_token: 'synthetic-test-refresh', token_type: 'bearer',
        expires_at: exp, expires_in: 3600, user,
      }))
    }, { user, language })
    let requests = 0
    let release!: () => void
    const gate = new Promise<void>((resolve) => { release = resolve })
    const errors: string[] = []
    const unexpected: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.route('https://example.supabase.co/**', async (route) => {
      const url = new URL(route.request().url())
      if (url.pathname === '/rest/v1/rpc/get_session_deadline') return route.fulfill({ json: {
        server_time: new Date().toISOString(), expires_at: new Date(Date.now() + 86400000).toISOString(),
      } })
      if (url.pathname === '/auth/v1/user') return route.fulfill({ json: user })
      if (url.pathname === '/auth/v1/logout') {
        requests += 1
        // Preserve the existing provider logout scope; this change adds feedback only.
        expect(url.searchParams.get('scope')).toBe('global')
        await gate
        return route.fulfill({ status: 500, json: { message: 'Private provider error' } })
      }
      if (url.pathname === '/rest/v1/user_settings') return route.fulfill({ json: {
        user_id: user.id, language, track: 'standard', weekly_goal_minutes: 720,
        show_completed_lessons: true, target_role: 'internship', experience_level: 'beginner',
        onboarding_complete: true,
      } })
      if (url.pathname.startsWith('/rest/v1/') && route.request().method() === 'GET') {
        return route.fulfill({ json: [] })
      }
      unexpected.push(url.pathname)
      await route.abort()
    })
    try {
      await page.goto('/settings')
      const control = page.locator('.signout-control')
      await control.getByRole('button', { name: vi ? 'Đăng xuất' : 'Sign out', exact: true }).click()
      const pending = control.getByRole('button', { name: vi ? 'Đang đăng xuất…' : 'Signing out…' })
      await expect(pending).toBeDisabled()
      await expect(pending).toHaveAttribute('aria-busy', 'true')
      await expect.poll(() => requests).toBe(1)
      for (const width of [1440, 390, 320]) {
        await page.setViewportSize({ width, height: 900 })
        for (const theme of ['light', 'dark'] as const) {
          await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
          await checkThemeContrast(page)
          await page.locator('.topbar').screenshot({
            path: `.build/session-evidence/signout-${language}-${theme}-${width}.png`,
          })
        }
      }
      release()
      await expect(page.locator('.public-shell')).toBeVisible()
      await expect(page.locator('.app-shell')).toHaveCount(0)
      expect(await page.evaluate(() => localStorage.getItem('sb-example-auth-token'))).toBeNull()
      expect(requests).toBe(1)
      expect(errors).toEqual([])
      expect(unexpected).toEqual([])
      await expect(page.locator('body')).not.toContainText('Private provider error')
    } finally { release() }
  })
}
