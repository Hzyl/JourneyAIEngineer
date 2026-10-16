import { expect, test } from '@playwright/test'
import { mockAuthenticatedLearner } from './hosted-learner'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} admin directory remains readable and sends only confirmed synthetic actions`,
    async ({ page, baseURL }) => {
      if (!baseURL) throw new Error('Hosted admin tests require the preview baseURL')
      const unexpected = await mockAuthenticatedLearner(page, new URL(baseURL).origin, language, { admin: true })
      const errors: string[] = []
      const mutations: Array<Record<string, string>> = []
      page.on('pageerror', (error) => errors.push(error.message))
      const user = {
        id: '11111111-1111-4111-8111-111111111111',
        email: 'long.learner.address.for.readability@example.test',
        created_at: '2026-10-01T09:30:00Z',
        confirmed_at: '2026-10-01T09:35:00Z',
        last_sign_in_at: '2026-10-15T09:30:00Z',
        banned_until: null as string | null,
      }
      await page.route('https://example.supabase.co/functions/v1/admin-users*', async (route) => {
        if (route.request().method() === 'GET') {
          return route.fulfill({ json: { users: [user], total: 1, page: 1, pages: 1, per_page: 25 } })
        }
        const body = route.request().postDataJSON() as Record<string, string>
        mutations.push(body)
        if (body.action === 'ban') user.banned_until = new Date(Date.now() + 86400000).toISOString()
        if (body.action === 'unban') user.banned_until = null
        return route.fulfill({ json: { code: 'ok', action: body.action, user_id: body.user_id } })
      })
      await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
      await page.goto('/admin/users')
      const directory = page.locator('.admin-users-view')
      await expect(directory.getByText(user.email, { exact: true })).toBeVisible()

      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 1000 })
        for (const theme of ['light', 'dark'] as const) {
          await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
          await checkThemeContrast(page)
          const smallText = await directory.locator(
            '.page-intro p, .eyebrow, .admin-stats span, .admin-search label, .admin-table td, .admin-table code, '
            + '.admin-table th, .admin-badge, button, .admin-pagination span',
          ).evaluateAll((elements) => elements.filter((element) => {
            const box = element.getBoundingClientRect()
            return box.width > 0 && box.height > 0 && parseFloat(getComputedStyle(element).fontSize) < 16
          }).map((element) => `${element.tagName} ${element.textContent?.trim().slice(0, 50)}`))
          expect(smallText, 'Admin text must be at least 16px').toEqual([])
          await expect(directory.locator('.admin-badge')).toHaveCSS('white-space', 'nowrap')
          if (width === 390) {
            const labelSize = await directory.locator('.admin-table td').first()
              .evaluate((element) => parseFloat(getComputedStyle(element, '::before').fontSize))
            expect(labelSize).toBeGreaterThanOrEqual(16)
          }
          await directory.screenshot({
            path: `.build/admin-directory-evidence/${language}-${theme}-${width}.png`,
            animations: 'disabled',
          })
        }
      }

      const ban = directory.getByRole('button', { name: language === 'vi' ? 'Khoá 24h' : 'Ban 24h' })
      page.once('dialog', (dialog) => dialog.dismiss())
      await ban.click()
      expect(mutations).toEqual([])
      page.once('dialog', (dialog) => dialog.accept())
      await ban.click()
      const unban = directory.getByRole('button', { name: language === 'vi' ? 'Mở khoá' : 'Unban' })
      await expect(unban).toBeVisible()
      expect(mutations).toEqual([{ action: 'ban', user_id: user.id, duration: '24h' }])
      page.once('dialog', (dialog) => dialog.accept())
      await unban.click()
      await expect(ban).toBeVisible()
      expect(mutations[1]).toMatchObject({ action: 'unban', user_id: user.id })
      page.once('dialog', (dialog) => dialog.accept())
      await directory.getByRole('button', {
        name: language === 'vi' ? 'Đặt lại mật khẩu' : 'Reset password',
      }).click()
      await expect.poll(() => mutations.length).toBe(3)
      expect(mutations[2]).toMatchObject({ action: 'send_reset', user_id: user.id })
      expect(unexpected).toEqual([])
      expect(errors).toEqual([])
    })
}

test('ordinary account has no admin navigation or directory request', async ({ page, baseURL }) => {
  if (!baseURL) throw new Error('Hosted admin tests require the preview baseURL')
  const unexpected = await mockAuthenticatedLearner(page, new URL(baseURL).origin, 'vi')
  await page.goto('/admin/users')
  await expect(page.locator('.app-shell')).toBeVisible()
  await expect(page.locator('.admin-users-view')).toHaveCount(0)
  await expect(page.getByRole('button', { name: /Quản trị.*Người dùng beta/ })).toHaveCount(0)
  expect(unexpected).toEqual([])
})
