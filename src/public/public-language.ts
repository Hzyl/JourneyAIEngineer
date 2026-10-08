import { useEffect, useState } from 'react'

export type PublicLanguage = 'vi' | 'en'
const key = 'journey-public-language'

export function readPublicLanguage(): PublicLanguage {
  const requested = new URLSearchParams(window.location.search).get('lang')
  if (requested === 'en' || requested === 'vi') return requested
  try { return localStorage.getItem(key) === 'en' ? 'en' : 'vi' }
  catch { return 'vi' }
}

export function usePublicLanguage() {
  const [language, setLanguage] = useState<PublicLanguage>(readPublicLanguage)
  useEffect(() => {
    document.documentElement.lang = language
    try { localStorage.setItem(key, language) }
    catch { /* Reading and navigation still work when storage is unavailable. */ }
  }, [language])
  return [language, setLanguage] as const
}
