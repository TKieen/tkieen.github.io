import type { SectionId } from '../data/site'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

/** Scrolls the home page to a section and keeps the URL hash in sync without adding history entries. */
export function scrollToSection(id: SectionId) {
  if (id === 'home') {
    scrollToTop()
    history.replaceState(null, '', location.pathname)
    return
  }
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  history.replaceState(null, '', `#${id}`)
}
