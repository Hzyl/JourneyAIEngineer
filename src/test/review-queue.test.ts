import { describe, expect, it } from 'vitest'
import { buildReviewQueue } from '../platform/review-queue'

const now = new Date('2026-10-07T10:00:00Z')
const cards = [
  { id: 'new-a', lesson_slug: 'learned' },
  { id: 'due-b', lesson_slug: 'learned' },
  { id: 'future-c', lesson_slug: 'unlearned' },
]
const progress = [{ lesson_slug: 'learned', status: 'completed' }]

describe('learning-aware review queue', () => {
  it('has no cards before any lesson has been learned', () => {
    expect(buildReviewQueue(cards, [], [], { now }).items).toEqual([])
  })

  it('activates completed lessons and separates new from due cards', () => {
    const queue = buildReviewQueue(cards, [], progress, { now })
    expect(queue.newCount).toBe(2)
    expect(queue.dueCount).toBe(0)
    expect(queue.items.map((card) => card.id)).toEqual(['new-a', 'due-b'])
    expect(queue.items.every((card) => card.queue_status === 'new')).toBe(true)
  })

  it('prioritizes overdue cards and preserves previously learned cards after a progress reset', () => {
    const state = [{
      card_id: 'due-b',
      due_at: '2026-10-05T10:00:00Z',
      last_reviewed_at: '2026-10-01T10:00:00Z',
      suspended: false,
    }]
    const queue = buildReviewQueue(cards, state, progress, { now })
    expect(queue.items.map((card) => card.queue_status)).toEqual(['due', 'new'])
    expect(queue.items[0].id).toBe('due-b')
    expect(buildReviewQueue(cards, state, [], { now }).items.map((card) => card.id)).toEqual(['due-b'])
  })

  it('excludes suspended and future reviews, and bounds new cards separately', () => {
    const state = [
      { card_id: 'new-a', due_at: now.toISOString(), last_reviewed_at: null, suspended: true },
      {
        card_id: 'due-b', due_at: '2026-10-09T10:00:00Z',
        last_reviewed_at: '2026-10-06T10:00:00Z', suspended: false,
      },
    ]
    expect(buildReviewQueue(cards, state, progress, { now }).items).toEqual([])
    const many = Array.from({ length: 12 }, (_, i) => ({ id: String(i), lesson_slug: 'learned' }))
    const queue = buildReviewQueue(many, [], progress, { now, newCardLimit: 4 })
    expect(queue.items).toHaveLength(4)
    expect(queue.newCount).toBe(12)
  })
})
