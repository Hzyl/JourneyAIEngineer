import type { Page } from '@playwright/test'

export type Language = 'vi' | 'en'

export async function mockAuthenticatedLearner(page: Page, origin: string, language: Language) {
  const user = {
    id: '00000000-0000-4000-8000-000000000001',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'learner@example.test',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {},
    created_at: '2026-01-01',
  }
  await page.addInitScript((account) => {
    const expiresAt = Math.floor(Date.now() / 1000) + 3600
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(JSON.stringify({
      sub: account.id, aud: 'authenticated', role: 'authenticated', exp: expiresAt,
    }))
    localStorage.setItem('sb-example-auth-token', JSON.stringify({
      access_token: `${header}.${payload}.synthetic-test-signature`,
      refresh_token: 'synthetic-test-refresh',
      token_type: 'bearer',
      expires_at: expiresAt,
      expires_in: 3600,
      user: account,
    }))
  }, user)

  const unexpected: string[] = []
  await page.route('**/*', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const method = request.method()
    if (url.pathname.startsWith('/api/')) {
      unexpected.push(`Local API: ${method} ${url.pathname}`)
      return route.abort()
    }
    if (url.origin === origin && ['GET', 'HEAD'].includes(method)) return route.continue()
    if (url.origin === 'https://example.supabase.co') {
      if (method === 'GET' && url.pathname === '/auth/v1/user') return route.fulfill({ json: user })
      if (method === 'POST' && url.pathname === '/rest/v1/rpc/get_session_deadline') {
        return route.fulfill({ json: {
          server_time: new Date().toISOString(),
          expires_at: new Date(Date.now() + 86400000).toISOString(),
        } })
      }
      if (method === 'POST' && url.pathname === '/rest/v1/rpc/is_current_user_admin') {
        return route.fulfill({ json: false })
      }
      if (method === 'GET' && url.pathname === '/rest/v1/user_settings') {
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
      if (method === 'GET' && /^\/rest\/v1\/[^/]+$/.test(url.pathname)) {
        return route.fulfill({ json: [] })
      }
    }
    unexpected.push(`${method} ${url.origin}${url.pathname}`)
    return route.abort()
  })
  return unexpected
}
