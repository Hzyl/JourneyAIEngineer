import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} expired restored login stays private and reload cannot restore it`, async ({ page }) => {
    const vi = language === 'vi'
    const user = { id: '00000000-0000-4000-8000-000000000024', aud: 'authenticated',
      role: 'authenticated', email: 'session@example.test', app_metadata: {}, user_metadata: {} }
    await page.addInitScript(({ user, language }) => {
      if (localStorage.getItem('session-fixture-seeded')) return
      localStorage.setItem('session-fixture-seeded', 'yes')
      localStorage.setItem('journey-public-language', language)
      const exp = Math.floor(Date.now() / 1000) + 3600
      const token = `${btoa('{"alg":"HS256","typ":"JWT"}')}.${btoa(JSON.stringify({
        sub: user.id, aud: 'authenticated', role: 'authenticated', exp,
      }))}.synthetic-signature`
      localStorage.setItem('sb-example-auth-token', JSON.stringify({ user, access_token: token,
        refresh_token: 'synthetic-refresh', expires_at: exp, expires_in: 3600, token_type: 'bearer' }))
    }, { user, language })
    let privateRequests = 0
    let logouts = 0
    await page.route('https://example.supabase.co/**', async (route) => {
      const url = new URL(route.request().url())
      if (url.pathname === '/rest/v1/rpc/get_session_deadline') return route.fulfill({ json: {
        server_time: '2026-10-09T00:00:00Z', expires_at: '2026-10-09T00:00:00Z',
      } })
      if (url.pathname === '/auth/v1/user') return route.fulfill({ json: user })
      if (url.pathname === '/auth/v1/logout') {
        expect(url.searchParams.get('scope')).toBe('local')
        logouts += 1
        return route.fulfill({ status: 204 })
      }
      privateRequests += 1
      await route.abort()
    })
    await page.goto('/settings')
    await expect(page.getByRole('status')).toContainText(vi ? 'Phiên đăng nhập đã hết hạn' : 'Your session has expired')
    await expect(page.locator('.app-shell')).toHaveCount(0)
    await expect(page.getByRole('button', { name: vi ? 'Đăng nhập' : 'Sign in', exact: true }).last()).toBeEnabled()
    await expect.poll(() => page.evaluate(() => localStorage.getItem('sb-example-auth-token'))).toBeNull()
    expect(privateRequests).toBe(0)
    expect(logouts).toBe(1)
    for (const theme of ['light', 'dark'] as const) {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
      await checkThemeContrast(page)
      const copy = await page.locator('.auth-notice-copy').boundingBox()
      expect(copy?.width).toBeGreaterThan(200)
      expect(copy?.height).toBeLessThan(250)
      await page.screenshot({ path: `.build/session-expiry-evidence/${language}-${theme}.png`, fullPage: true })
    }
    await page.reload()
    await expect(page.locator('.public-shell')).toBeVisible()
    await expect(page.locator('.app-shell')).toHaveCount(0)
    expect(logouts).toBe(1)
    expect(privateRequests).toBe(0)
  })
}
