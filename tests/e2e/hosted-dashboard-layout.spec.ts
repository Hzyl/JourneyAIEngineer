import { expect, test } from '@playwright/test'

test.use({ isMobile: true, hasTouch: true, deviceScaleFactor: 2 })

for (const language of ['vi', 'en']) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${language}/${theme}: signed-in Today fits phone and intermediate widths`, async ({ page }) => {
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
      await page.goto('/')
      await expect(page.locator('.today-next')).toBeVisible()
      for (const width of [320, 390, 675, 800, 843, 850, 851, 900, 980, 1024, 1100, 1101, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        const trigger = page.locator('.mobile-nav-toggle')
        const menu = page.locator('.sidebar')
        if (width <= 1100) {
          await expect(trigger).toBeVisible()
          await expect(menu).not.toBeVisible()
          await trigger.click()
          await expect(menu).toHaveAttribute('aria-modal', 'true')
          await expect(page.locator('main')).toHaveAttribute('inert', '')
          await expect(menu.locator('.mobile-nav-close')).toBeFocused()
          await page.keyboard.press('Escape')
          await expect(menu).not.toBeVisible()
          await expect(trigger).toBeFocused()
          await expect(page.locator('main')).not.toHaveAttribute('inert', '')
        } else {
          await expect(trigger).not.toBeVisible()
          await expect(menu).toBeVisible()
          await expect(menu).not.toHaveAttribute('inert', '')
        }
        const result = await page.evaluate(() => {
          const header = document.querySelector('.topbar')!.getBoundingClientRect()
          const title = document.querySelector('.topbar > div:first-of-type')!.getBoundingClientRect()
          const actions = document.querySelector('.topbar-actions')!.getBoundingClientRect()
          return {
            overflow: document.documentElement.scrollWidth - innerWidth,
            titleWidth: title.width,
            overlap: title.left < actions.right && title.right > actions.left
              && title.top < actions.bottom && title.bottom > actions.top,
            controlsOutsideHeader: actions.bottom > header.bottom || actions.right > header.right,
          }
        })
        expect(result.overflow, `horizontal overflow at ${width}`).toBeLessThanOrEqual(1)
        expect(result.titleWidth, `cramped heading at ${width}`).toBeGreaterThanOrEqual(180)
        expect(result.overlap, `title/control overlap at ${width}`).toBe(false)
        expect(result.controlsOutsideHeader, `controls outside header at ${width}`).toBe(false)
        if ([390, 851, 1101].includes(width)) {
          await page.screenshot({ path: `.build/dashboard-layout/${language}-${theme}-${width}.png` })
        }
      }
    })
  }
}
