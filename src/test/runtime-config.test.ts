import { describe, expect, it } from 'vitest'
import { readRuntimeConfig } from '../platform/runtime-config'

describe('readRuntimeConfig', () => {
  it('defaults to the local runtime without Supabase variables', () => {
    expect(readRuntimeConfig({})).toEqual({ mode: 'local' })
  })

  it('requires a URL and publishable key for hosted mode', () => {
    expect(() => readRuntimeConfig({ VITE_APP_MODE: 'hosted' })).toThrow('Hosted mode requires Supabase URL and publishable key.')
  })

  it('accepts a local development Supabase URL and publishable key', () => {
    expect(readRuntimeConfig({
      VITE_APP_MODE: 'hosted',
      VITE_SUPABASE_URL: 'http://127.0.0.1:54321/',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_local_test',
    })).toEqual({
      mode: 'hosted',
      supabaseUrl: 'http://127.0.0.1:54321',
      publishableKey: 'sb_publishable_local_test',
    })
  })

  it('rejects a Supabase secret key in browser configuration', () => {
    expect(() => readRuntimeConfig({
      VITE_APP_MODE: 'hosted',
      VITE_SUPABASE_URL: 'https://project.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_never_ship_this',
    })).toThrow('A service-role/secret key must never be used in the browser.')
  })
})
