import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import '../styles/page-loader.css'

/** ms the loading screen stays up, then ms it takes to fade away */
const HOLD = 800
const EXIT = 400

/** A circle whose outline ripples like the wave lines of the site: radius 22 ± 2, seven crests. */
const WAVE_RING = Array.from({ length: 181 }, (_, step) => {
  const angle = (step / 180) * Math.PI * 2
  const radius = 22 + Math.sin(angle * 7) * 2
  return `${step ? 'L' : 'M'}${(Math.cos(angle) * radius).toFixed(2)} ${(Math.sin(angle) * radius).toFixed(2)}`
}).join('')

const pages = {
  home: { index: '00', label: 'Home' },
  portfolio: { index: '03', label: 'Portfolio' },
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Loading screen shown when moving between the home page and the portfolio page.
 * It covers the new page from its first frame, holds while the wave ring draws itself, then fades away.
 */
export function PageLoader() {
  const { pathname } = useLocation()
  // the project popup lives on /portfolio/:slug and belongs to the portfolio page
  const page = pathname.startsWith('/portfolio') ? 'portfolio' : 'home'
  const [current, setCurrent] = useState<keyof typeof pages>(page)
  const [phase, setPhase] = useState<'idle' | 'loading' | 'leaving'>('idle')

  // set during render so the cover is up in the same paint as the new page
  if (page !== current) {
    setCurrent(page)
    if (!prefersReducedMotion()) setPhase('loading')
  }

  useEffect(() => {
    if (phase === 'idle') return
    const timer = setTimeout(() => setPhase(phase === 'loading' ? 'leaving' : 'idle'), phase === 'loading' ? HOLD : EXIT)
    return () => clearTimeout(timer)
  }, [phase, current])

  if (phase === 'idle') return null

  const { index, label } = pages[current]
  return (
    <div key={current} className={`page-loader${phase === 'leaving' ? ' is-leaving' : ''}`} role="status">
      <svg className="page-loader__ring" viewBox="-28 -28 56 56" aria-hidden="true">
        <circle className="page-loader__track" r="22" />
        <path
          className="page-loader__wave"
          d={WAVE_RING}
          pathLength={100}
          style={{ animationDuration: `${HOLD}ms` }}
        />
        <rect className="page-loader__mark" x="-4" y="-4" width="8" height="8" rx="1.4" />
      </svg>
      <p className="page-loader__label mono">
        <span>{index}</span>
        {label}
      </p>
      <span className="visually-hidden">Loading</span>
    </div>
  )
}
