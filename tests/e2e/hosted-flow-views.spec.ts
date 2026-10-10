import { expect, test } from '@playwright/test'
for (const language of ['vi', 'en']) {
 for (const theme of ['light', 'dark'] as const) {
test(`signed-in illustrations ${language}/${theme}`, async ({ page }) => {
      const user = { id: '00000000-0000-4000-8000-000000000001', aud: 'authenticated', role: 'authenticated',
        email: 'layout@example.test', app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: {}, created_at: '2026-01-01' }
      await page.addInitScript((user) => {
        const exp = Math.floor(Date.now() / 1000) + 3600
        const token = `${btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))}.${btoa(JSON.stringify({
          sub: user.id, aud: 'authenticated', role: 'authenticated', exp,
        }))}.synthetic-test-signature`
        localStorage.setItem('sb-example-auth-token', JSON.stringify({ access_token: token,
          refresh_token: 'synthetic-test-refresh', token_type: 'bearer', expires_at: exp, expires_in: 3600, user }))
      }, user)
      await page.route('https://example.supabase.co/**', (route) => {
        const path = new URL(route.request().url()).pathname
        if (path === '/auth/v1/user') return route.fulfill({ json: user })
        if (path === '/rest/v1/rpc/get_session_deadline') return route.fulfill({ json: {
          server_time: new Date().toISOString(), expires_at: new Date(Date.now() + 86400000).toISOString(),
        } })
        if (path === '/rest/v1/user_settings') return route.fulfill({ json: {
          user_id: user.id, language, track: 'standard', weekly_goal_minutes: 720,
          show_completed_lessons: true, target_role: 'internship', experience_level: 'beginner',
          onboarding_complete: true,
        } })
        if (path.startsWith('/rest/v1/') && route.request().method() === 'GET') return route.fulfill({ json: [] })
        return route.abort()
      })
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })

  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ['/', '/tools', '/roadmap', '/review', '/resources',
      '/community', '/journal', '/settings', '/exercises']) {
      await page.goto(path)
      const img = page.locator('.flow-art').first()
      await expect(img).toBeAttached()
      await img.scrollIntoViewIfNeeded()
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0)
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
      if (path === '/tools') {
        for (const selector of ['.tool-content p', '.tool-content strong', '.command-list code']) {
          const font = await page.locator(selector).first().evaluate(el => parseFloat(getComputedStyle(el).fontSize))
          expect(font).toBeGreaterThanOrEqual(16)
        }
        await page.screenshot({ path: `.build/flow-ui/tools-${language}-${theme}-${width}.png` })
      }
    }
  }
})
}}
