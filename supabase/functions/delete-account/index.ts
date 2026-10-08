import { createClient } from 'npm:@supabase/supabase-js@2.117.2'
import { handleDeletion } from './handler.ts'

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
  return handleDeletion(request, {
    async identify(token) {
      const { data, error } = await verifier.auth.getUser(token)
      if (error || !data.user) return null
      const scoped = createClient(url, publicKey, {
        ...options, global: { headers: { Authorization: `Bearer ${token}` } },
      })
      const { data: deadline, error: deadlineError } = await scoped.rpc('get_session_deadline')
      if (deadlineError || !deadline?.expires_at || !deadline?.server_time) return null
      if (!(Date.parse(deadline.expires_at) > Date.parse(deadline.server_time))) return null
      return data.user
    },
    async reauthenticate(email, password) {
      const client = createClient(url, publicKey, options)
      const { data, error } = await client.auth.signInWithPassword({ email, password })
      if (error) return null
      const id = data.user?.id ?? null
      // This verification session should not outlive a failed deletion.
      await client.auth.signOut({ scope: 'local' })
      return id
    },
    async remove(id) {
      const { error } = await admin.auth.admin.deleteUser(id)
      return !error
    },
  }, origins)
})
