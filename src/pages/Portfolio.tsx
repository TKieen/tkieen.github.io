import { useEffect, type CSSProperties } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { BackToTop } from '../components/BackToTop'
import { Icon } from '../components/Icon'
import { BackNavigation } from '../components/Navigation'
import { ProjectDetail } from '../components/ProjectDetail'
import { findProject, projects } from '../data/projects'
import { owner } from '../data/site'
import '../styles/portfolio.css'

/** Marks links that open a project from the gallery, so closing can simply go back. */
const FROM_GALLERY = { fromGallery: true }

export function Portfolio() {
  const { slug } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const project = findProject(slug)

  useEffect(() => {
    document.title = project ? `${project.title} — ${owner.name}` : `Portfolio — ${owner.name}`
  }, [project])

  if (slug && !project) return <Navigate to="/portfolio" replace />

  const closeProject = () => {
    if (state?.fromGallery) navigate(-1)
    else navigate('/portfolio', { replace: true })
  }

  return (
    <>
      <BackNavigation />

      <main className="gallery-page">
        <div className="container">
          <header className="gallery-intro">
            <h1 className="gallery-intro__title">
              <span className="mono">03</span>
              Portfolio
            </h1>
            <div className="gallery-intro__context mono">
              <p>{String(projects.length).padStart(2, '0')} PROJECTS</p>
              <p>Visual identities &amp; tournament systems. Built for play, designed to last.</p>
            </div>
          </header>

          <ul className="gallery">
            {projects.map(({ slug: projectSlug, cardTitle, cover, accent }, index) => (
              <li
                key={projectSlug}
                className="gallery-card"
                style={
                  {
                    '--accent-fill': accent.fill,
                    '--accent-stroke': accent.stroke,
                    '--accent-icon': accent.icon,
                  } as CSSProperties
                }
              >
                <Link
                  className="gallery-card__image"
                  to={`/portfolio/${projectSlug}`}
                  state={FROM_GALLERY}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <img
                    src={cover.src}
                    width={cover.width}
                    height={cover.height}
                    alt=""
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </Link>
                <div className="gallery-card__details">
                  <h2>{cardTitle}</h2>
                  <Link className="button button--accent" to={`/portfolio/${projectSlug}`} state={FROM_GALLERY}>
                    View detail
                    <Icon name="arrow-up-right" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <footer className="gallery-footer">
          <div className="container footer-row">
            <Link className="wordmark" to="/">
              {owner.name}
            </Link>
            <p className="footer-row__copyright">{owner.copyright}</p>
          </div>
        </footer>
      </main>

      <BackToTop />

      {project && <ProjectDetail key={project.slug} project={project} onClose={closeProject} />}
    </>
  )
}
