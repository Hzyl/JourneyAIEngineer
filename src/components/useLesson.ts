import { useCallback, useEffect, useState } from 'react'
import type { Lesson } from '../api'
import { learningClient as api } from '../platform/learning-client'

type Response = { slug: string | null; revision: number; lesson: Lesson | null; error: boolean }

export function useLesson(slug: string | null, enabled: boolean) {
  const [revision, setRevision] = useState(0)
  const [response, setResponse] = useState<Response>({ slug: null, revision: -1, lesson: null, error: false })
  const reload = useCallback(() => setRevision((current) => current + 1), [])
  useEffect(() => {
    if (!slug || !enabled) return
    let current = true
    void api.lesson(slug).then((lesson) => {
      if (current) setResponse({ slug, revision, lesson, error: false })
    }).catch(() => {
      if (current) setResponse((previous) => ({
        slug, revision, lesson: previous.slug === slug ? previous.lesson : null, error: true,
      }))
    })
    return () => { current = false }
  }, [slug, enabled, revision])

  const lesson = enabled && response.slug === slug ? response.lesson : null
  const pending = enabled && Boolean(slug) && (response.slug !== slug || response.revision !== revision)
  return {
    lesson, loading: pending && !lesson,
    error: enabled && !pending && response.slug === slug && response.error,
    reload,
  }
}
