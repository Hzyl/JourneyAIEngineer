import { useEffect } from 'react'
import './interaction-feedback.css'

/** A click acknowledgement only; success feedback belongs to each action. */
export function InteractionFeedback() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const active = new Map<HTMLElement, Animation>()
    const stop = () => {
      active.forEach((animation) => animation.cancel())
      active.clear()
    }
    const acknowledge = (event: MouseEvent) => {
      if (reducedMotion.matches || event.button !== 0 || !(event.target instanceof Element)) return
      const control = event.target.closest(
        'button, a[href], summary, input[type="checkbox"], input[type="radio"]',
      )
      if (!(control instanceof HTMLElement) || !control.animate
        || control.matches(':disabled, [aria-disabled="true"], [aria-busy="true"]')) return

      active.get(control)?.cancel()
      const animation = control.animate([
        { scale: '0.98', boxShadow: '0 0 0 3px var(--feedback-ring)' },
        { scale: '1', boxShadow: getComputedStyle(control).boxShadow },
      ], { duration: 180, easing: 'ease-out', id: 'journey-press' })
      active.set(control, animation)
      const clear = () => {
        if (active.get(control) === animation) active.delete(control)
      }
      void animation.finished.then(clear, clear)
    }
    const preferenceChanged = () => { if (reducedMotion.matches) stop() }
    document.addEventListener('click', acknowledge, true)
    reducedMotion.addEventListener('change', preferenceChanged)
    return () => {
      document.removeEventListener('click', acknowledge, true)
      reducedMotion.removeEventListener('change', preferenceChanged)
      stop()
    }
  }, [])
  return null
}
