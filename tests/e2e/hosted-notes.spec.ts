import { expect, test } from '@playwright/test'

for (const language of ['vi', 'en'] as const) {
  test(`${language} note save survives a lost commit response and page reload without duplicates`, async ({ page }) => {
    const vi = language === 'vi'
    // Reuse the synthetic authenticated session used by hosted-cloud-export.
    const user = { id: '00000000-0000-4000-8000-000000000001', aud: 'authenticated', role: 'authenticated',
      email: 'learner@example.test', app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: {}, created_at: '2026-01-01' }
    await page.addInitScript((user) => {
      const exp = Math.floor(Date.now() / 1000) + 3600
      const token = `${btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))}.${btoa(JSON.stringify({
        sub: user.id, aud: 'authenticated', role: 'authenticated', exp,
      }))}.synthetic-test-signature`
      localStorage.setItem('sb-example-auth-token', JSON.stringify({ access_token: token,
        refresh_token: 'synthetic-test-refresh', token_type: 'bearer', expires_at: exp, expires_in: 3600, user }))
    }, user)
    type Note = { id: string; user_id: string; lesson_slug: string; title: string; body: string }
    const rows = new Map<string, Note>()
    const attempts: Note[] = []
    const retryReads: string[][] = []
    const unexpected: string[] = []
    let release!: () => void
    const gate = new Promise<void>((resolve) => { release = resolve })
    await page.route('https://example.supabase.co/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      if (url.pathname === '/auth/v1/user') return route.fulfill({ json: user })
      if (url.pathname === '/rest/v1/rpc/get_session_deadline') return route.fulfill({ json: {
        server_time: new Date().toISOString(), expires_at: new Date(Date.now() + 86400000).toISOString(),
      } })
      if (url.pathname === '/rest/v1/rpc/is_current_user_admin') return route.fulfill({ json: false })
      if (url.pathname === '/rest/v1/user_settings') return route.fulfill({ json: {
        user_id: user.id, language, track: 'standard', weekly_goal_minutes: 720,
        show_completed_lessons: true, target_role: 'internship', experience_level: 'beginner',
        onboarding_complete: true,
      } })
      if (url.pathname === '/rest/v1/notes') {
        if (request.method() === 'POST') {
          const note = request.postDataJSON() as Note
          attempts.push(note)
          if (rows.has(note.id)) {
            await gate
            return route.fulfill({ status: 409, json: { code: '23505', message: 'duplicate key' } })
          }
          rows.set(note.id, note)
          if (attempts.length === 1) return route.fulfill({ status: 503, json: { message: 'response lost' } })
          return route.fulfill({ status: 201, json: note })
        }
        if (request.method() === 'GET') {
          const id = url.searchParams.get('id')
          const owner = url.searchParams.get('user_id')
          if (id) {
            retryReads.push([id, owner ?? ''])
            const note = rows.get(id.replace(/^eq\./, ''))
            if (note && owner === `eq.${note.user_id}`) return route.fulfill({ json: note })
            return route.fulfill({ status: 406, json: { message: 'row not found' } })
          }
          return route.fulfill({ json: [...rows.values()] })
        }
      }
      if (url.pathname.startsWith('/rest/v1/') && request.method() === 'GET') return route.fulfill({ json: [] })
      unexpected.push(`${request.method()} ${url.pathname}`)
      return route.abort()
    })
    try {
      await page.goto('/lesson/phase-00-onboarding-environment-1')
      const editor = page.locator('#notes')
      const body = editor.getByRole('textbox', { name: vi ? 'Ghi chú của bạn' : 'Your note', exact: true })
      const save = editor.getByRole('button', { name: vi ? 'Lưu ghi chú' : 'Save note', exact: true })
      await body.fill('One synthetic note after a lost response')
      await save.click()
      await expect(editor.getByRole('alert')).toHaveText('response lost')
      await expect(body).toHaveValue('One synthetic note after a lost response')
      await expect(save).toBeEnabled()
      await editor.screenshot({ path: `.build/audit-20261014/notes/${language}-save-error.png` })
      expect(rows.size).toBe(1)
      await page.reload()
      await body.fill('One synthetic note after a lost response')
      await save.click()
      await expect(editor.getByRole('button', { name: vi ? 'Đang lưu…' : 'Saving…', exact: true })).toBeDisabled()
      await expect(body).toBeDisabled()
      release()
      await expect(editor.getByRole('status')).toHaveText(vi ? 'Đã lưu vào nhật ký.' : 'Saved to Journal.')
      await expect(body).toHaveValue('')
      await expect(editor.getByRole('alert')).toHaveCount(0)
      expect(rows.size).toBe(1)
      expect(attempts[1].id).toBe(attempts[0].id)
      expect(retryReads).toEqual([[`eq.${attempts[0].id}`, `eq.${user.id}`]])
      await editor.screenshot({ path: `.build/audit-20261014/notes/${language}-save-recovered.png` })
      await body.fill('One synthetic note after a lost response')
      await save.click()
      await expect(editor.getByRole('status')).toBeVisible()
      expect(rows.size).toBe(2)
      expect(attempts[2].id).not.toBe(attempts[0].id)
      expect(unexpected).toEqual([])
    } finally { release() }
  })
}
