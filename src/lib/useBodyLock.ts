import { useEffect } from 'react'

let locks = 0

/** Prevents the page behind an overlay from scrolling while `locked` is true. */
export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    locks += 1
    if (locks === 1) {
      const scrollbar = window.innerWidth - document.documentElement.clientWidth
      document.body.style.setProperty('--scrollbar', `${scrollbar}px`)
    }
    document.body.classList.add('is-locked')
    return () => {
      locks -= 1
      if (locks === 0) document.body.classList.remove('is-locked')
    }
  }, [locked])
}
