export type AppMode = 'local' | 'hosted'

export type RuntimeConfig =
  | { mode: 'local' }
  | { mode: 'hosted'; supabaseUrl: string; publishableKey: string }

type RuntimeEnvironment = Record<string, string | boolean | undefined>

function jwtRole(value: string): string | null {
  const [, payload] = value.split('.')
  if (!payload) return null
  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const decoded = atob(padded)
    const parsed = JSON.parse(decoded) as { role?: unknown }
    return typeof parsed.role === 'string' ? parsed.role : null
  } catch {
    return null
  }
}

export function readRuntimeConfig(env: RuntimeEnvironment): RuntimeConfig {
  const mode = env.VITE_APP_MODE === 'hosted' ? 'hosted' : 'local'
  if (mode === 'local') return { mode }

  const rawUrl = String(env.VITE_SUPABASE_URL ?? '').trim()
  const publishableKey = String(env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '').trim()
  if (!rawUrl || !publishableKey) {
    throw new Error('Hosted mode requires Supabase URL and publishable key.')
  }

  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    throw new Error('Hosted Supabase URL must be a valid URL.')
  }
  const localHost = parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost'
  if (parsed.protocol !== 'https:' && !localHost) {
    throw new Error('Hosted Supabase URL must use HTTPS.')
  }
  if (publishableKey.startsWith('sb_secret_') || jwtRole(publishableKey) === 'service_role') {
    throw new Error('A service-role/secret key must never be used in the browser.')
  }

  return { mode, supabaseUrl: parsed.origin, publishableKey }
}

export const runtimeConfig = readRuntimeConfig(import.meta.env)
