import { useCallback, useEffect, useRef, useState } from 'react'

// Keep aligned with the drawer styles in shell-responsive.css and app-navigation.css.
const mobileQuery = '(max-width: 1100px)'

export function useMobileNavigation() {
  const [mobile, setMobile] = useState(() => window.matchMedia(mobileQuery).matches)
  const [open, setOpen] = useState(false)
  const panel = useRef<HTMLElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const main = useRef<HTMLElement>(null)
  const returnToContent = useRef(false)
  const active = mobile && open
  const close = useCallback((content = false) => {
    returnToContent.current = content
    setOpen(false)
  }, [])
  const show = () => {
    returnToContent.current = false
    setOpen(true)
  }

  useEffect(() => {
    const query = window.matchMedia(mobileQuery)
    const resize = () => {
      const focusWasInPanel = panel.current?.contains(document.activeElement)
      setMobile(query.matches)
      setOpen(false)
      if (query.matches && focusWasInPanel) requestAnimationFrame(() => trigger.current?.focus())
    }
    query.addEventListener('change', resize)
    return () => query.removeEventListener('change', resize)
  }, [])

  useEffect(() => {
    if (!active) return
    const menu = panel.current!
    const content = main.current
    const toggle = trigger.current
    const buttons = () => [...menu.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')]
      .filter((button) => button.getClientRects().length > 0)
    const bodyOverflow = document.body.style.overflow
    const htmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    buttons()[0]?.focus()
    menu.scrollTop = 0
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        close()
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        // The background search shortcut must not open underneath the modal drawer.
        event.preventDefault()
        event.stopPropagation()
      } else if (event.key === 'Tab') {
        const controls = buttons()
        const first = controls[0]
        const last = controls.at(-1)
        if (!menu.contains(document.activeElement) || (event.shiftKey && document.activeElement === first)) {
          event.preventDefault()
          const target = event.shiftKey ? last : first
          target?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', keyboard, true)
    return () => {
      document.removeEventListener('keydown', keyboard, true)
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = htmlOverflow
      if (returnToContent.current) content?.focus()
      else if (window.matchMedia(mobileQuery).matches) toggle?.focus()
      else menu.querySelector<HTMLButtonElement>('[aria-current="page"]')?.focus()
    }
  }, [active, close])

  return { mobile, active, panel, trigger, main, show, close }
}
