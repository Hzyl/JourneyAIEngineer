export type StudiedSession = { studied_at: string }

function localDayKey(value: Date): string {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function startOfLocalDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate())
}

/** Counts consecutive local calendar days ending today. UTC conversion is never
 * used so a learner in Vietnam does not lose a streak near midnight. */
export function countLocalStreak(sessions: StudiedSession[], now = new Date()): number {
  const days = new Set(sessions.map((item) => localDayKey(new Date(item.studied_at))))
  let cursor = startOfLocalDay(now)
  let streak = 0
  while (days.has(localDayKey(cursor))) {
    streak += 1
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1)
  }
  return streak
}
