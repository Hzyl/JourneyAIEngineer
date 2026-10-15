import { createClient } from 'npm:@supabase/supabase-js@2.117.2'
import { handleAdminUsers, type AdminDirectoryUser } from './handler.ts'

const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
const origins = new Set((Deno.env.get('ALLOWED_ORIGINS') ?? '').split(',').map((value) => value.trim()).filter(Boolean))

Deno.serve(async (request) => {
  const url = Deno.env.get('SUPABASE_URL')
  const publicKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !publicKey || !serviceKey) {
    return new Response(JSON.stringify({ code: 'server_not_configured' }), {
      status: 503, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  }
  const verifier = createClient(url, publicKey, options)
  const admin = createClient(url, serviceKey, options)
  const configuredOrigin = Deno.env.get('PUBLIC_SITE_URL')?.replace(/\/$/, '')
    ?? [...origins][0] ?? url
  const services = {
    async identify(token: string) {
      const { data, error } = await verifier.auth.getUser(token)
      return error || !data.user ? null : { id: data.user.id }
    },
    async isAdmin(id: string) {
      const scoped = createClient(url, publicKey, { ...options, global: { headers: { Authorization: `Bearer ${request.headers.get('Authorization') ?? ''}` } } })
      const { data, error } = await scoped.rpc('is_current_user_admin')
      return !error && data === true && id.length > 0
    },
    async listUsers({ page, perPage, q }: { page: number; perPage: number; q: string }) {
      const query = q.toLowerCase()
      const all: AdminDirectoryUser[] = []
      let currentPage = 1
      let nextPage: number | null = 1
      const maxPages = 100
      while (nextPage !== null && currentPage <= maxPages) {
        const { data, error } = await admin.auth.admin.listUsers({ page: currentPage, perPage: 1000 })
        if (error) throw error
        all.push(...(data.users ?? []).map((user): AdminDirectoryUser => ({
          id: user.id,
          email: user.email ?? null,
          created_at: user.created_at,
          confirmed_at: user.confirmed_at ?? null,
          last_sign_in_at: user.last_sign_in_at ?? null,
          banned_until: user.banned_until ?? null,
        })).filter((user) => !query || (user.email ?? '').toLowerCase().includes(query) || user.id.includes(query)))
        nextPage = data.nextPage ?? null
        if (nextPage !== null) currentPage = nextPage
      }
      if (nextPage !== null) throw new Error('admin_user_directory_too_large')
      const start = (page - 1) * perPage
      return { users: all.slice(start, start + perPage), total: all.length }
    },
    async getUser(id: string) {
      const { data, error } = await admin.auth.admin.getUserById(id)
      if (error || !data.user) return null
      const user = data.user
      return { id: user.id, email: user.email ?? null, created_at: user.created_at,
        confirmed_at: user.confirmed_at ?? null, last_sign_in_at: user.last_sign_in_at ?? null,
        banned_until: user.banned_until ?? null }
    },
    async isAdminTarget(id: string) {
      const { data, error } = await admin.from('admin_roles').select('user_id').eq('user_id', id).maybeSingle()
      return !error && Boolean(data)
    },
    async ban(id: string, duration: string) {
      const { error } = await admin.auth.admin.updateUserById(id, { ban_duration: duration })
      return !error
    },
    async unban(id: string) {
      const { error } = await admin.auth.admin.updateUserById(id, { ban_duration: 'none' })
      return !error
    },
    async sendReset(email: string, redirectTo: string) {
      const { error } = await verifier.auth.resetPasswordForEmail(email, { redirectTo })
      return !error
    },
    async audit(adminId: string, targetId: string, action: string, metadata: Record<string, string>) {
      const { error } = await admin.from('admin_audit_log').insert({ admin_id: adminId, target_user_id: targetId, action, metadata })
      return !error
    },
  }
  return handleAdminUsers(request, services, origins, configuredOrigin)
})
