import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'
import { runtimeConfig } from '../runtime-config'

export const supabase: SupabaseClient | null = runtimeConfig.mode === 'hosted'
  ? createClient(runtimeConfig.supabaseUrl, runtimeConfig.publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new Error('Supabase is only available in hosted mode.')
  return supabase
}

export async function requireHostedUser(): Promise<User> {
  const client = requireSupabase()
  const { data, error } = await client.auth.getUser()
  if (error || !data.user) throw new Error('Bạn cần đăng nhập để đồng bộ dữ liệu học.')
  return data.user
}
