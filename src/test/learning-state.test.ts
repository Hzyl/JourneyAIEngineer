import { describe, expect, it } from 'vitest'
import { countLocalStreak } from '../platform/hosted/learning-state'

describe('countLocalStreak', () => {
  it('uses local calendar days and stops at a missed day', () => {
    const now = new Date(2026, 9, 6, 0, 10)
    const sessions = [
      { studied_at: new Date(2026, 9, 6, 0, 1).toISOString() },
      { studied_at: new Date(2026, 9, 5, 23, 59).toISOString() },
      { studied_at: new Date(2026, 9, 3, 18, 0).toISOString() },
    ]
    expect(countLocalStreak(sessions, now)).toBe(2)
  })

  it('returns zero when there is no session today', () => {
    const now = new Date(2026, 9, 6, 10)
    expect(countLocalStreak([{ studied_at: new Date(2026, 9, 5, 10).toISOString() }], now)).toBe(0)
  })
})
