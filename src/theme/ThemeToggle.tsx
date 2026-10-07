import { setTheme, useTheme } from './theme-store'

export function ThemeToggle({ language = 'vi' }: { language?: 'vi' | 'en' }) {
  const theme = useTheme()
  const dark = theme === 'dark'
  const vi = language === 'vi'
  const action = dark
    ? (vi ? 'Chuyển sang giao diện sáng' : 'Switch to light theme')
    : (vi ? 'Chuyển sang giao diện tối' : 'Switch to dark theme')

  return <button
    type="button"
    className="theme-toggle"
    aria-label={action}
    title={action}
    onClick={() => setTheme(dark ? 'light' : 'dark')}
  >
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      {dark ? <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" /> : <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </>}
    </svg>
    <span>{dark ? (vi ? 'Tối' : 'Dark') : (vi ? 'Sáng' : 'Light')}</span>
  </button>
}
