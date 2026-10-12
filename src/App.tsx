import { useLayoutEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import { PageLoader } from './components/PageLoader'
import { Home } from './pages/Home'
import { Portfolio } from './pages/Portfolio'

/** Starts each page at the top; back/forward keeps the browser's own scroll restoration. */
function ScrollReset() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  // the project popup lives on /portfolio/:slug and must not move the page behind it
  const page = pathname.startsWith('/portfolio') ? '/portfolio' : pathname

  useLayoutEffect(() => {
    if (navigationType === 'POP' || hash) return
    window.scrollTo({ top: 0, behavior: 'instant' })
    // only a change of page resets the scroll position
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollReset />
      <PageLoader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<Portfolio />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
