import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { owner, sections, type SectionId } from '../data/site'
import { scrollToSection } from '../lib/scroll'
import { useBodyLock } from '../lib/useBodyLock'
import { Icon } from './Icon'
import '../styles/navigation.css'

type NavigationProps = {
  /** section currently in view on the home page */
  active: SectionId
}

const DESKTOP_QUERY = '(min-width: 960px)'

/** True once the page has left the top, which is when the bar collapses into a pill. */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return scrolled
}

/** Navigation of the home page: one link per section. */
export function Navigation({ active }: NavigationProps) {
  const scrolled = useScrolled()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    const desktop = window.matchMedia(DESKTOP_QUERY)
    const onResize = () => desktop.matches && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onResize)
    }
  }, [menuOpen])

  useBodyLock(menuOpen)

  // One underline that slides between the links instead of fading in under each of them.
  const linksRef = useRef<HTMLElement>(null)
  const [marker, setMarker] = useState<{ x: number; width: number } | null>(null)
  const [markerReady, setMarkerReady] = useState(false)

  useLayoutEffect(() => {
    const links = linksRef.current
    if (!links) return
    const measure = () => {
      const link = links.querySelector<HTMLElement>('.nav__link.is-active')
      setMarker(link ? { x: link.offsetLeft, width: link.offsetWidth } : null)
    }
    measure()
    // Link widths change when the web font arrives or the bar is resized.
    const sizes = new ResizeObserver(measure)
    sizes.observe(links)
    return () => sizes.disconnect()
  }, [active])

  // The first position is placed without a slide from the left edge.
  useEffect(() => {
    if (!marker || markerReady) return
    const frame = requestAnimationFrame(() => setMarkerReady(true))
    return () => cancelAnimationFrame(frame)
  }, [marker, markerReady])

  // Every link scrolls to its section of the home page.
  const linkProps = (id: SectionId) => ({
    to: id === 'home' ? '/' : `/#${id}`,
    onClick: (event: MouseEvent) => {
      setMenuOpen(false)
      event.preventDefault()
      scrollToSection(id)
    },
  })

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-open' : ''}`}>
      <div className="nav__bar">
        <Link className="wordmark" {...linkProps('home')}>
          {owner.name}
        </Link>

        <nav className="nav__links" aria-label="Primary" ref={linksRef}>
          {sections.map(({ id, label }) =>
            id === 'portfolio' ? (
              <Link
                key={id}
                className={`nav__link nav__link--portfolio${active === id ? ' is-active' : ''}`}
                aria-current={active === id ? 'location' : undefined}
                {...linkProps(id)}
              >
                {label}
                <span className="nav__star nav__star--lg" />
                <span className="nav__star nav__star--sm" />
              </Link>
            ) : (
              <Link
                key={id}
                className={`nav__link${active === id ? ' is-active' : ''}`}
                aria-current={active === id ? 'location' : undefined}
                {...linkProps(id)}
              >
                {label}
              </Link>
            ),
          )}
          <span
            className={`nav__marker${marker ? ' is-visible' : ''}${markerReady ? ' is-ready' : ''}${active === 'portfolio' ? ' nav__marker--portfolio' : ''}`}
            style={marker ? { width: marker.width, translate: `${marker.x}px 0` } : undefined}
            aria-hidden="true"
          />
        </nav>

        <p className="nav__availability">{owner.availability}</p>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? 'close-menu' : 'menu'} size={18} />
        </button>
      </div>

      <div className="nav__menu" id="mobile-menu" hidden={!menuOpen}>
        <nav aria-label="Mobile">
          <ul className="nav__menu-list">
            {sections.map(({ id, label, index }) => (
              <li key={id}>
                <Link className={`nav__menu-link${active === id ? ' is-active' : ''}`} {...linkProps(id)}>
                  {label}
                  <span className="mono">{index}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="nav__availability nav__availability--menu">{owner.availability}</p>
      </div>
    </header>
  )
}

/** Navigation of the portfolio page: a single link back to the home page. */
export function BackNavigation() {
  const scrolled = useScrolled()

  return (
    <header className={`nav nav--back${scrolled ? ' is-scrolled' : ''}`}>
      <div className="nav__bar">
        <Link className="nav__back" to="/#portfolio">
          <Icon name="arrow-left" size={14} />
          Go back
        </Link>
      </div>
    </header>
  )
}
