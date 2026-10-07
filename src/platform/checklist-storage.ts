// Checklist ticks are a browser convenience, separate from saved lesson progress.
export function checklistKey(lesson: string, userId: string | null): string {
  // Preserve local-only legacy data. Hosted accounts never read that shared key.
  return userId === null ? `journey-checklist:${lesson}` : `journey-checklist:user:${userId}:${lesson}`
}

export function readChecklist(key: string, count: number): boolean[] {
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(key) ?? '[]')
    return Array.from({ length: count }, (_, index) => Array.isArray(saved) && saved[index] === true)
  } catch {
    return Array.from({ length: count }, () => false)
  }
}
