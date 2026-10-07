import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'
export const themeStorageKey = 'journey.theme'
const themeEvent = 'journey-theme-change'

function readPreference(): Theme | null {
  try {
    const value = window.localStorage.getItem(themeStorageKey)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

let preference = readPreference()

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content', theme === 'dark' ? '#101923' : '#f7f8fa',
  )
}

export function initializeTheme() {
  applyTheme(preference ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
}

export function setTheme(theme: Theme) {
  preference = theme
  try {
    window.localStorage.setItem(themeStorageKey, theme)
  } catch {
    // Preserve the choice in memory for this tab when storage is blocked.
  }
  applyTheme(theme)
  window.dispatchEvent(new Event(themeEvent))
}

function subscribe(notify: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const followSystem = () => {
    if (preference === null) {
      applyTheme(media.matches ? 'dark' : 'light')
      notify()
    }
  }
  const syncStorage = (event: StorageEvent) => {
    if (event.key !== themeStorageKey && event.key !== null) return
    preference = readPreference()
    initializeTheme()
    notify()
  }
  window.addEventListener(themeEvent, notify)
  window.addEventListener('storage', syncStorage)
  media.addEventListener('change', followSystem)
  return () => {
    window.removeEventListener(themeEvent, notify)
    window.removeEventListener('storage', syncStorage)
    media.removeEventListener('change', followSystem)
  }
}

function snapshot(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function useTheme() {
  return useSyncExternalStore(subscribe, snapshot, () => 'light' as Theme)
}
