import { useCallback, useEffect, useRef, useState } from 'react'
import type { AppSettings } from '../api'
import { learningClient as api } from '../platform/learning-client'

const initialSettings: AppSettings = {
  language: 'vi', track: 'standard', weekly_goal_minutes: 720, show_completed_lessons: true,
  target_role: 'internship', experience_level: 'beginner', onboarding_complete: false,
}

async function readWorkspace() {
  const [dashboard, roadmap, reviews, exercises, tools, resources, settings, health] = await Promise.all([
    api.dashboard(), api.roadmap(), api.reviews(), api.exercises(), api.tools(), api.resources(),
    api.settings(), api.health(),
  ])
  return { dashboard, roadmap, reviews: reviews.items, exercises: exercises.exercises,
    tools: tools.tools, resources: resources.resources, settings, gitPublishAvailable: health.git_publish_available }
}
type Workspace = Omit<Awaited<ReturnType<typeof readWorkspace>>, 'settings'>

export function useWorkspaceData() {
  const [data, setData] = useState<Workspace | null>(null)
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [languageFailed, setLanguageFailed] = useState(false)
  const mounted = useRef(true)
  const readVersion = useRef(0)
  const settingsVersion = useRef(0)
  const writeVersion = useRef(0)
  const reading = useRef(false)
  const writing = useRef(false)

  // A post-write refresh must supersede a read that began before the write.
  const loadWorkspace = useCallback(() => {
    if (!mounted.current) return
    const version = ++readVersion.current
    const preferences = settingsVersion.current
    reading.current = true
    return readWorkspace().then(({ settings: nextSettings, ...nextData }) => {
      if (!mounted.current || version !== readVersion.current) return
      setData(nextData)
      if (preferences === settingsVersion.current && !writing.current) setSettings(nextSettings)
    }).catch(() => {
      if (mounted.current && version === readVersion.current) setFailed(true)
    }).finally(() => {
      if (mounted.current && version === readVersion.current) {
        reading.current = false
        setLoading(false)
      }
    })
  }, [])

  const refresh = useCallback(async () => {
    if (!mounted.current) return
    setLoading(true)
    setFailed(false)
    await loadWorkspace()
  }, [loadWorkspace])

  useEffect(() => {
    mounted.current = true
    void loadWorkspace()
    return () => {
      mounted.current = false
      readVersion.current += 1
      writeVersion.current += 1
    }
  }, [loadWorkspace])

  const reload = useCallback(async () => {
    if (reading.current) return
    await refresh()
  }, [refresh])

  const saveSettings = async (next: Partial<AppSettings>) => {
    if (!mounted.current) return
    if (writing.current) throw new Error(settings.language === 'vi'
      ? 'Một cài đặt khác đang được lưu.' : 'Another setting is still being saved.')
    const version = ++writeVersion.current
    writing.current = true
    settingsVersion.current += 1
    setSettingsSaving(true)
    if (next.language) setLanguageFailed(false)
    try {
      const saved = await api.updateSettings(next)
      if (mounted.current && version === writeVersion.current) {
        settingsVersion.current += 1
        setSettings(saved)
      }
    } catch {
      throw new Error(settings.language === 'vi' ? 'Không lưu được cài đặt.' : 'Could not save settings.')
    } finally {
      if (mounted.current && version === writeVersion.current) {
        writing.current = false
        setSettingsSaving(false)
      }
    }
  }

  const changeLanguage = async () => {
    if (writing.current || !data) return
    try {
      await saveSettings({ language: settings.language === 'vi' ? 'en' : 'vi' })
    } catch {
      if (mounted.current) setLanguageFailed(true)
    }
  }
  const removeReview = (id: number | string) => {
    setData((current) => current ? { ...current, reviews: current.reviews.filter((card) => card.id !== id) } : null)
  }
  return {
    dashboard: data?.dashboard ?? null, roadmap: data?.roadmap ?? null, reviews: data?.reviews ?? [],
    exercises: data?.exercises ?? [], tools: data?.tools ?? [], resources: data?.resources ?? [],
    gitPublishAvailable: data?.gitPublishAvailable ?? false, loaded: data !== null,
    settings, loading, failed, settingsSaving, languageFailed,
    refresh, reload, saveSettings, changeLanguage, removeReview,
  }
}
