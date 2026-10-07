export type ReviewCardRef = { id: string; lesson_slug: string }
export type ReviewSchedule = {
  card_id: string
  due_at: string
  last_reviewed_at: string | null
  suspended: boolean
}
export type LessonProgressRef = { lesson_slug: string; status: string }
export type QueuedCard<T> = T & { queue_status: 'due' | 'new' }

/** A card becomes new only after learning its lesson. Existing review history
 * remains active when progress is later reset; the scheduler owns its due date. */
export function buildReviewQueue<T extends ReviewCardRef>(
  cards: readonly T[],
  schedules: readonly ReviewSchedule[],
  progress: readonly LessonProgressRef[],
  options: { now?: Date; limit?: number; newCardLimit?: number } = {},
) {
  const now = options.now ?? new Date()
  const limit = Math.max(0, Math.min(30, options.limit ?? 30))
  const newLimit = Math.max(0, Math.min(limit, options.newCardLimit ?? 8))
  const states = new Map(schedules.map((state) => [state.card_id, state]))
  const learned = new Set(progress.filter((row) => row.status === 'completed').map((row) => row.lesson_slug))
  const due: QueuedCard<T>[] = []
  const fresh: QueuedCard<T>[] = []

  for (const card of cards) {
    const state = states.get(card.id)
    if (state?.suspended) continue
    if (state?.last_reviewed_at) {
      if (new Date(state.due_at) <= now) due.push({ ...card, queue_status: 'due' })
    } else if (learned.has(card.lesson_slug)) {
      fresh.push({ ...card, queue_status: 'new' })
    }
  }

  due.sort((a, b) => {
    const difference = Date.parse(states.get(a.id)!.due_at) - Date.parse(states.get(b.id)!.due_at)
    return difference || a.id.localeCompare(b.id)
  })
  const dueItems = due.slice(0, limit)
  return {
    items: [...dueItems, ...fresh.slice(0, Math.min(newLimit, limit - dueItems.length))],
    dueCount: due.length,
    newCount: fresh.length,
    totalCount: due.length + fresh.length,
  }
}
