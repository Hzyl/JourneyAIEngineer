import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} deletion confirms intent, retries failures and never repeats a confirmed deletion`, async ({ page }) => {
    const vi = language === 'vi'
    const owner = '00000000-0000-4000-8000-000000000001'
    const user = { id: owner, aud: 'authenticated', role: 'authenticated', email: 'learner@example.test',
      app_metadata: { provider: 'email', providers: ['email'] }, user_metadata: {}, created_at: '2026-01-01' }
    await page.addInitScript(({ user }) => {
      const expires = Math.floor(Date.now() / 1000) + 3600
      const token = `${btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))}.${btoa(JSON.stringify({
        sub: user.id, aud: 'authenticated', role: 'authenticated', exp: expires,
      }))}.synthetic-test-signature`
      localStorage.setItem('sb-example-auth-token', JSON.stringify({
        access_token: token, refresh_token: 'synthetic-test-refresh', token_type: 'bearer',
        expires_at: expires, expires_in: 3600, user,
      }))
    }, { user })
    let attempts = 0
    let signouts = 0
    let release!: () => void
    const gate = new Promise<void>((resolve) => { release = resolve })
    let releaseLogout!: () => void
    const logoutGate = new Promise<void>((resolve) => { releaseLogout = resolve })
    const unexpected: string[] = []
    const localRequests: string[] = []
    page.on('request', (request) => {
      if (new URL(request.url()).pathname.startsWith('/api/')) localRequests.push(request.url())
    })
    await page.route('https://example.supabase.co/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      if (url.pathname === '/rest/v1/rpc/get_session_deadline') return route.fulfill({ json: {
        server_time: new Date().toISOString(), expires_at: new Date(Date.now() + 86400000).toISOString(),
      } })
      if (url.pathname === '/auth/v1/user') return route.fulfill({ json: user })
      if (url.pathname === '/functions/v1/delete-account') {
        attempts += 1
        expect(request.postDataJSON()).toEqual({ confirmation: 'DELETE', password: 'synthetic-password' })
        expect(request.headers().authorization).toMatch(/^Bearer .+synthetic-test-signature$/)
        if (attempts === 1) return route.fulfill({ status: 503, json: { message: 'Private provider detail' } })
        await gate
        return route.fulfill({ json: { code: 'account_deleted' } })
      }
      if (url.pathname === '/auth/v1/logout') {
        signouts += 1
        expect(url.searchParams.get('scope')).toBe('local')
        await logoutGate
        return route.fulfill({ status: 500, json: { message: 'Private signout detail' } })
      }
      if (url.pathname === '/rest/v1/user_settings') return route.fulfill({ json: {
        user_id: owner, language, track: 'standard', weekly_goal_minutes: 720,
        show_completed_lessons: true, target_role: 'internship', experience_level: 'beginner',
        onboarding_complete: true,
      } })
      if (url.pathname.startsWith('/rest/v1/') && request.method() === 'GET') return route.fulfill({ json: [] })
      unexpected.push(url.pathname)
      await route.abort()
    })
    try {
      await page.goto('/settings')
      const card = page.locator('.delete-account')
      const open = card.getByRole('button', { name: vi ? 'Mở bước xác nhận xóa' : 'Open deletion confirmation' })
      await open.click()
      const password = card.getByLabel(vi ? 'Nhập lại mật khẩu' : 'Re-enter password')
      const confirmation = card.getByLabel(vi ? 'Nhập DELETE để xác nhận' : 'Type DELETE to confirm')
      await expect(password).toBeFocused()
      await password.fill('synthetic-password')
      await confirmation.fill('delete')
      const remove = card.getByRole('button', { name: vi ? 'Xóa vĩnh viễn' : 'Delete permanently' })
      await expect(remove).toBeDisabled()
      expect(attempts).toBe(0)
      await card.getByRole('button', { name: vi ? 'Hủy' : 'Cancel', exact: true }).click()
      await expect(open).toBeFocused()
      await open.click()
      await expect(password).toHaveValue('')
      await expect(confirmation).toHaveValue('')
      await password.fill('synthetic-password')
      await confirmation.fill('DELETE')
      await remove.click()
      await expect(card.getByRole('alert')).toContainText(vi ? 'Chưa xác nhận được' : 'could not be confirmed')
      await expect(card).not.toContainText('Private provider detail')
      await remove.click()
      await expect(password).toBeDisabled()
      await expect(confirmation).toBeDisabled()
      await expect(card.locator('.danger-button')).toHaveAttribute('aria-busy', 'true')
      for (const width of [1440, 390, 320]) {
        await page.setViewportSize({ width, height: 900 })
        for (const theme of ['light', 'dark'] as const) {
          await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
          await checkThemeContrast(page)
          await card.screenshot({ path: `.build/delete-account-evidence/${language}-${theme}-${width}.png` })
        }
      }
      release()
      await expect(card.getByRole('status')).toContainText(vi ? 'Tài khoản đã được xóa.' : 'Account deleted.')
      await expect(card.locator('input')).toHaveCount(0)
      // The installed Auth SDK clears the local session even when logout returns HTTP 500.
      releaseLogout()
      await expect(page.locator('.public-shell')).toBeVisible()
      await expect(page.locator('body')).not.toContainText('Private signout detail')
      expect(attempts).toBe(2)
      expect(signouts).toBe(1)
      expect(unexpected).toEqual([])
      expect(localRequests).toEqual([])
    } finally { release(); releaseLogout() }
  })
}
