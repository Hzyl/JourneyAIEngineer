import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const mode = process.env.VITE_APP_MODE === 'hosted' ? 'hosted' : 'local'
let connectSources = "'self'"

if (mode === 'hosted') {
  const rawUrl = (process.env.VITE_SUPABASE_URL ?? '').trim()
  const key = (process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '').trim()
  if (!rawUrl || !key) throw new Error('Hosted builds require VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.')
  if (key.startsWith('sb_secret_')) throw new Error('A Supabase secret key must never be provided to a browser build.')
  const origin = new URL(rawUrl)
  const localHost = origin.hostname === '127.0.0.1' || origin.hostname === 'localhost'
  if (origin.protocol !== 'https:' && !localHost) throw new Error('Cloudflare hosted builds require an HTTPS Supabase URL.')
  const socketOrigin = new URL(origin)
  socketOrigin.protocol = origin.protocol === 'https:' ? 'wss:' : 'ws:'
  connectSources = `'self' ${origin.origin} ${socketOrigin.origin}`
}

const headers = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src ${connectSources}; upgrade-insecure-requests

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/index.html
  Cache-Control: no-store
`

const output = resolve(process.cwd(), 'dist', '_headers')
await mkdir(resolve(process.cwd(), 'dist'), { recursive: true })
await writeFile(output, headers, 'utf8')
