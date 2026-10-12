import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { featuredProjects, type FeaturedProject } from '../data/site'
import { Icon } from './Icon'
import '../styles/carousel.css'

const DRAG_THRESHOLD = 60

function ProjectCard({ project }: { project: FeaturedProject }) {
  const { key, index, tag, title, caption, description, tools, cover, href } = project
  const linkContent = (
    <>
      View project
      <Icon name="arrow-up-right" size={15} />
    </>
  )

  return (
    <article className={`project-card project-card--${key}`}>
      <div className="project-card__media">
        <div className="project-card__image">
          <img src={cover.src} width={cover.width} height={cover.height} alt="" loading="lazy" draggable={false} />
        </div>
        <p className="project-card__caption">{caption}</p>
      </div>
      <div className="project-card__details">
        <div className="project-card__heading">
          <div className="project-card__meta">
            <span className="tag">{tag}</span>
            <span className="mono">{index}</span>
          </div>
          <h3>
            {title.map(({ text, accent }) => (accent ? <em key={text}>{text}</em> : text))}
          </h3>
          <p>{description}</p>
        </div>
        <div className="project-card__footer">
          <span className="mono">{tools}</span>
          {href.startsWith('/') ? (
            <Link className="text-link" to={href} draggable={false}>
              {linkContent}
            </Link>
          ) : (
            <a className="text-link" href={href} target="_blank" rel="noreferrer" draggable={false}>
              {linkContent}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export function ProjectCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragStart = useRef<number | null>(null)
  const dragged = useRef(false)
  const [current, setCurrent] = useState(0)
  const count = featuredProjects.length

  const goTo = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const slide = track.children[(index + count) % count] as HTMLElement
    track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' })
  }

  // Keep the counter in sync with native (touch / trackpad) scrolling.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0
    const update = () => {
      frame = 0
      const slides = Array.from(track.children) as HTMLElement[]
      const distances = slides.map((slide) => Math.abs(slide.offsetLeft - track.scrollLeft))
      setCurrent(distances.indexOf(Math.min(...distances)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Mouse users can drag the card sideways; touch devices scroll natively.
  const onPointerDown = (event: PointerEvent) => {
    dragged.current = false
    dragStart.current = event.pointerType === 'mouse' ? event.clientX : null
  }

  const onPointerUp = (event: PointerEvent) => {
    if (dragStart.current === null) return
    const delta = event.clientX - dragStart.current
    dragStart.current = null
    if (Math.abs(delta) < DRAG_THRESHOLD) return
    dragged.current = true
    goTo(current + (delta < 0 ? 1 : -1))
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') goTo(current - 1)
    if (event.key === 'ArrowRight') goTo(current + 1)
  }

  return (
    <div className="carousel" role="region" aria-roledescription="carousel" aria-label="Selected projects">
      <div className="carousel__stage">
        <button type="button" className="carousel__arrow" aria-label="Previous project" onClick={() => goTo(current - 1)}>
          <Icon name="arrow-left" size={20} />
        </button>

        <div
          ref={trackRef}
          className="carousel__track"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onClickCapture={(event) => {
            if (!dragged.current) return
            dragged.current = false
            event.preventDefault()
            event.stopPropagation()
          }}
        >
          {featuredProjects.map((project, index) => (
            <div
              key={project.key}
              className="carousel__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        <button type="button" className="carousel__arrow" aria-label="Next project" onClick={() => goTo(current + 1)}>
          <Icon name="arrow-right" size={20} />
        </button>
      </div>

      <div className="carousel__pagination">
        <div className="carousel__dots">
          {featuredProjects.map((project, index) => (
            <button
              key={project.key}
              type="button"
              className={index === current ? 'is-active' : undefined}
              aria-label={`Show project ${index + 1}`}
              aria-current={index === current}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
        <p className="mono" aria-live="polite">
          {String(current + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </p>
      </div>
    </div>
  )
}
