import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} cloud export recovers from errors and downloads only the account snapshot`, async ({ page }) => {
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
    let release!: () => void
    const gate = new Promise<void>((resolve) => { release = resolve })
    const unexpected: string[] = []
    const localRequests: string[] = []
    const snapshot = { owner_id: owner, schema_version: 1, notes: [{ content: 'Synthetic study note' }] }
    page.on('request', (request) => {
      if (new URL(request.url()).pathname.startsWith('/api/')) localRequests.push(request.url())
    })
    await page.route('https://example.supabase.co/**', async (route) => {
      const path = new URL(route.request().url()).pathname
      if (path === '/rest/v1/rpc/get_session_deadline') return route.fulfill({ json: {
        server_time: new Date().toISOString(), expires_at: new Date(Date.now() + 86400000).toISOString(),
      } })
      if (path === '/auth/v1/user') return route.fulfill({ json: user })
      if (path === '/rest/v1/rpc/export_learning_snapshot') {
        attempts += 1
        if (attempts === 1) return route.fulfill({ status: 503, json: { message: 'Private provider detail' } })
        await gate
        return route.fulfill({ json: snapshot })
      }
      if (path === '/rest/v1/user_settings') return route.fulfill({ json: {
        user_id: owner, language, track: 'standard', weekly_goal_minutes: 720,
        show_completed_lessons: true, target_role: 'internship', experience_level: 'beginner',
        onboarding_complete: true,
      } })
      if (path.startsWith('/rest/v1/') && route.request().method() === 'GET') {
        return route.fulfill({ json: [] })
      }
      unexpected.push(path)
      await route.abort()
    })
    try {
      await page.goto('/settings')
      const card = page.locator('.backup-card')
      const downloadButton = card.getByRole('button', { name: vi ? 'Tải dữ liệu JSON' : 'Download JSON export' })
      await downloadButton.click()
      await expect(card.getByRole('alert')).toContainText(vi ? 'Chưa xuất được dữ liệu' : 'Could not export data')
      await expect(card).not.toContainText('Private provider detail')
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 900 })
        for (const theme of ['light', 'dark'] as const) {
          await page.emulateMedia({ colorScheme: theme })
          await checkThemeContrast(page)
          await card.screenshot({ path: `.build/cloud-export-evidence/${language}-${theme}-${width}.png` })
        }
      }
      await downloadButton.click()
      await expect(card.getByRole('button')).toBeDisabled()
      await expect(card.getByRole('button')).toHaveAttribute('aria-busy', 'true')
      const downloadPromise = page.waitForEvent('download')
      release()
      const download = await downloadPromise
      expect(download.suggestedFilename()).toMatch(/^journey-cloud-\d{4}-\d{2}-\d{2}\.json$/)
      const payload = JSON.parse(await readFile((await download.path())!, 'utf8'))
      expect(payload).toMatchObject(snapshot)
      expect(payload.catalog.content_sha256).toMatch(/^[a-f0-9]{64}$/)
      await expect(card.getByRole('status')).toContainText(vi ? 'Đã tạo tệp xuất dữ liệu' : 'Export created')
      await expect(downloadButton).toBeEnabled()
      expect(attempts).toBe(2)
      expect(unexpected).toEqual([])
      expect(localRequests).toEqual([])
    } finally { release() }
  })
}
