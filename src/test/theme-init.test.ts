/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { describe, expect, it } from 'vitest'

const bootstrap = readFileSync('public/theme-init.js', 'utf8')

function boot(preference: string | null, systemDark: boolean, blocked = false) {
  const root = { dataset: {} as Record<string, string>, style: {} as Record<string, string> }
  runInNewContext(bootstrap, {
    localStorage: { getItem() { if (blocked) throw new Error('Storage blocked'); return preference } },
    window: { matchMedia: () => ({ matches: systemDark }) },
    document: { documentElement: root, querySelector: () => null },
  })
  return root
}

describe('theme before React mounts', () => {
  it('uses the saved choice before the OS preference', () => {
    expect(boot('light', true).dataset.theme).toBe('light')
    expect(boot('dark', false).style.colorScheme).toBe('dark')
  })
  it('follows the OS for a missing or invalid saved choice', () => {
    expect(boot(null, true).dataset.theme).toBe('dark')
    expect(boot('invalid', false).dataset.theme).toBe('light')
  })
  it('still initializes when browser storage is blocked', () => {
    expect(boot(null, true, true).dataset.theme).toBe('dark')
  })
})
