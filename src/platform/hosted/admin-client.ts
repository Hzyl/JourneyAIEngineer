import type { User } from '@supabase/supabase-js'
import { requireSupabase } from './supabase-client'
import { runtimeConfig } from '../runtime-config'

export type AdminDirectoryUser = Pick<User, 'id' | 'email' | 'created_at' | 'confirmed_at' | 'last_sign_in_at' | 'banned_until'>
export type AdminDirectoryPage = {
  users: AdminDirectoryUser[]
  total: number
  page: number
  per_page: number
  pages: number
}

async function errorMessage(error: { message?: string; context?: unknown } | null, fallback: string): Promise<never> {
  const context = error?.context as { clone?: () => Response } | undefined
  if (context?.clone) {
    const response = context.clone()
    const body = await response.json().catch(() => null) as { code?: unknown } | null
    if (typeof body?.code === 'string') throw new Error(body.code)
  }
  throw new Error(error?.message || fallback)
}

async function invoke<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await requireSupabase().functions.invoke('admin-users', {
    body,
  })
  if (error) await errorMessage(error, 'Không thể kết nối tới khu vực quản trị.')
  if (!data) throw new Error('Phản hồi quản trị trống.')
  return data as T
}

export async function readAdminUsers(page = 1, perPage = 25, q = ''): Promise<AdminDirectoryPage> {
  const client = requireSupabase()
  // Ask Auth for the current user first so an expired access token can be
  // refreshed before the function request is assembled.
  const { data: currentUser, error: userError } = await client.auth.getUser()
  if (userError || !currentUser.user) throw new Error('authentication_required')
  const { data: session } = await client.auth.getSession()
  const token = session.session?.access_token
  if (!token) throw new Error('Bạn cần đăng nhập để mở khu vực quản trị.')
  if (runtimeConfig.mode !== 'hosted') throw new Error('Quản trị chỉ có trong hosted mode.')
  const url = new URL(`${runtimeConfig.supabaseUrl}/functions/v1/admin-users`)
  url.searchParams.set('page', String(page))
  url.searchParams.set('per_page', String(perPage))
  if (q.trim()) url.searchParams.set('q', q.trim())
  const response = await fetch(url, { headers: {
    Authorization: `Bearer ${token}`,
    apikey: runtimeConfig.mode === 'hosted' ? runtimeConfig.publishableKey : '',
  } })
  const data = await response.json().catch(() => null) as (AdminDirectoryPage & { code?: string }) | null
  if (!response.ok) throw new Error(data?.code || 'Không thể tải danh sách người dùng.')
  return data as AdminDirectoryPage
}

export async function mutateAdminUser(action: 'ban' | 'unban' | 'send_reset', userId: string, duration?: string) {
  return invoke<{ code: string; action: string; user_id: string }>({ action, user_id: userId, ...(duration ? { duration } : {}) })
}
