import { useEffect, useState } from 'react'
import type { FeedbackItem } from '../api'
import { learningClient as api } from '../platform/learning-client'

export function useFeedbackFeed(enabled: boolean, lessonSlug?: string) {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(enabled)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    if (!enabled) return
    let active = true
    void api.feedback(lessonSlug).then((result) => {
      if (active) {
        setItems(result.items.filter((item) => item.status === 'accepted' || item.status === 'implemented'))
        setFailed(false)
      }
    }).catch(() => {
      if (active) setFailed(true)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [enabled, lessonSlug, attempt])
  const retry = () => {
    if (loading) return
    setLoading(true)
    setFailed(false)
    setAttempt((value) => value + 1)
  }
  return { items, loading, failed, retry }
}
