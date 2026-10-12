import { useEffect, useState } from 'react'
import { scrollToTop } from '../lib/scroll'
import { Icon } from './Icon'

/** Floating pill pinned to the bottom-right of the viewport. */
export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      className={`back-to-top${visible ? ' is-visible' : ''}`}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      onClick={scrollToTop}
    >
      <span className="mono" aria-hidden="true">
        Back to top
      </span>
      <Icon name="arrow-up" />
    </button>
  )
}
