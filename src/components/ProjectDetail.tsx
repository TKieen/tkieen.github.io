import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { CANVAS, imageUrl, type GalleryImage, type Project } from '../data/projects'
import { useBodyLock } from '../lib/useBodyLock'
import { Icon } from './Icon'
import '../styles/detail.css'

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const DRAG_SLOP = 4
/** below this viewer width the canvas is cropped to its images so they are not shown tiny */
const COMPACT_VIEWER = 520

type View = { zoom: number; x: number; y: number }
type Size = { width: number; height: number }
type Frame = { x: number; y: number; width: number; height: number }

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/** Keeps keyboard focus inside a dialog element. */
function trapFocus(event: ReactKeyboardEvent<HTMLElement>) {
  if (event.key !== 'Tab') return
  const focusable = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')
  if (focusable.length === 0) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const current = document.activeElement
  if (event.shiftKey && (current === first || current === event.currentTarget)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && current === last) {
    event.preventDefault()
    first.focus()
  }
}

/* ---------- Lightbox: one image at a time ---------- */

type LightboxProps = {
  project: Project
  index: number
  onChange: (index: number) => void
  onClose: () => void
}

function Lightbox({ project, index, onChange, onClose }: LightboxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const swipeStart = useRef<number | null>(null)
  const count = project.images.length
  const image = project.images[index]

  useEffect(() => {
    ref.current?.focus()
  }, [])

  const step = (delta: number) => onChange((index + delta + count) % count)

  return (
    <div
      ref={ref}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — image ${index + 1} of ${count}`}
      tabIndex={-1}
      onKeyDown={trapFocus}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      onPointerDown={(event) => {
        swipeStart.current = event.pointerType === 'mouse' ? null : event.clientX
      }}
      onPointerUp={(event) => {
        if (swipeStart.current === null) return
        const delta = event.clientX - swipeStart.current
        swipeStart.current = null
        if (Math.abs(delta) > 50) step(delta < 0 ? 1 : -1)
      }}
    >
      <figure className="lightbox__figure">
        <img
          key={image.id}
          src={imageUrl(project.slug, image.id)}
          width={image.width}
          height={image.height}
          alt={image.caption}
          draggable={false}
        />
        <figcaption>
          <span className="mono">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
          {image.caption}
        </figcaption>
      </figure>

      <button type="button" className="lightbox__close" aria-label="Close image" onClick={onClose}>
        <Icon name="close" size={14} />
      </button>
      <button type="button" className="lightbox__nav lightbox__nav--prev" aria-label="Previous image" onClick={() => step(-1)}>
        <Icon name="chevron-left" />
      </button>
      <button type="button" className="lightbox__nav lightbox__nav--next" aria-label="Next image" onClick={() => step(1)}>
        <Icon name="chevron-right" />
      </button>
    </div>
  )
}

/* ---------- Project popup with a zoomable image canvas ---------- */

/** Region of the canvas that "100%" fits into the viewer. */
function fitFrame(images: GalleryImage[], compact: boolean): Frame {
  if (!compact) return { x: 0, y: 0, width: CANVAS.width, height: CANVAS.height }
  const pad = 12
  const left = Math.min(...images.map((image) => image.x)) - pad
  const top = Math.min(...images.map((image) => image.y)) - pad
  const right = Math.max(...images.map((image) => image.x + image.w)) + pad
  const bottom = Math.max(...images.map((image) => image.y + image.h)) + pad
  return { x: left, y: top, width: right - left, height: bottom - top }
}

type ProjectDetailProps = { project: Project; onClose: () => void }

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const popupRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef({ moved: false, distance: 0 })

  const [size, setSize] = useState<Size>({ width: 0, height: 0 })
  const [rawView, setRawView] = useState<View>({ zoom: 1, x: 0, y: 0 })
  const [sharp, setSharp] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)

  useBodyLock(true)

  const frame = useMemo(
    () => fitFrame(project.images, size.width > 0 && size.width < COMPACT_VIEWER),
    [project.images, size.width],
  )
  const fit = size.width ? Math.min(size.width / frame.width, size.height / frame.height) : 0

  /** Keeps the canvas inside the viewer: centred when it is smaller, edge-locked when larger. */
  const settle = useCallback(
    (next: View): View => {
      const zoom = clamp(next.zoom, MIN_ZOOM, MAX_ZOOM)
      const width = frame.width * fit * zoom
      const height = frame.height * fit * zoom
      return {
        zoom,
        x: width <= size.width ? (size.width - width) / 2 : clamp(next.x, size.width - width, 0),
        y: height <= size.height ? (size.height - height) / 2 : clamp(next.y, size.height - height, 0),
      }
    },
    [fit, frame, size],
  )

  // The stored view may predate a resize, so it is always read through settle().
  const view = settle(rawView)
  const updateView = useCallback(
    (change: (current: View) => View) => setRawView((raw) => settle(change(settle(raw)))),
    [settle],
  )
  if (view.zoom > 1.5 && !sharp) setSharp(true)

  /** Zooms while keeping the canvas point under (originX, originY) in place. */
  const zoomAt = useCallback(
    (zoom: number, originX: number, originY: number) =>
      updateView((current) => {
        const target = clamp(zoom, MIN_ZOOM, MAX_ZOOM)
        const ratio = target / current.zoom
        return {
          zoom: target,
          x: originX - (originX - current.x) * ratio,
          y: originY - (originY - current.y) * ratio,
        }
      }),
    [updateView],
  )

  const zoomBy = (direction: 1 | -1) => {
    const steps = view.zoom * 2
    const next = direction > 0 ? Math.floor(steps + 1.001) / 2 : Math.ceil(steps - 1.001) / 2
    zoomAt(next, size.width / 2, size.height / 2)
  }

  // Track the viewer size and re-fit whenever it changes.
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    observer.observe(viewer)
    return () => observer.disconnect()
  }, [])

  // Wheel zoom needs a non-passive listener so the page behind does not scroll.
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = viewer.getBoundingClientRect()
      updateView((current) => {
        const target = clamp(current.zoom * Math.exp(-event.deltaY * 0.0015), MIN_ZOOM, MAX_ZOOM)
        const ratio = target / current.zoom
        const originX = event.clientX - rect.left
        const originY = event.clientY - rect.top
        return {
          zoom: target,
          x: originX - (originX - current.x) * ratio,
          y: originY - (originY - current.y) * ratio,
        }
      })
    }
    viewer.addEventListener('wheel', onWheel, { passive: false })
    return () => viewer.removeEventListener('wheel', onWheel)
  }, [updateView])

  // Focus management + keyboard shortcuts for the whole dialog.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => previous?.focus?.()
  }, [])

  useEffect(() => {
    const count = project.images.length
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        if (lightbox !== null) setLightbox(null)
        else onClose()
      } else if (lightbox !== null) {
        if (event.key === 'ArrowLeft') setLightbox((lightbox - 1 + count) % count)
        if (event.key === 'ArrowRight') setLightbox((lightbox + 1) % count)
      } else if (event.key === '+' || event.key === '=') {
        zoomAt(view.zoom + 0.5, size.width / 2, size.height / 2)
      } else if (event.key === '-') {
        zoomAt(view.zoom - 0.5, size.width / 2, size.height / 2)
      } else if (event.key === '0') {
        zoomAt(1, size.width / 2, size.height / 2)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, onClose, project.images.length, size, view.zoom, zoomAt])

  // Return focus to the popup when the lightbox closes.
  const closeLightbox = () => {
    setLightbox(null)
    popupRef.current?.focus()
  }

  /* ----- drag to pan, pinch to zoom ----- */

  const pinchDistance = () => {
    const [a, b] = [...pointers.current.values()]
    return Math.hypot(a.x - b.x, a.y - b.y)
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if ((event.target as HTMLElement).closest('.zoom-controls')) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointers.current.size === 1) gesture.current.moved = false
    if (pointers.current.size === 2) {
      gesture.current.moved = true
      gesture.current.distance = pinchDistance()
    }
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const last = pointers.current.get(event.pointerId)
    if (!last) return
    const dx = event.clientX - last.x
    const dy = event.clientY - last.y

    if (pointers.current.size === 2) {
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
      const distance = pinchDistance()
      const rect = event.currentTarget.getBoundingClientRect()
      const [a, b] = [...pointers.current.values()]
      const ratio = distance / (gesture.current.distance || distance)
      gesture.current.distance = distance
      updateView((current) => {
        const target = clamp(current.zoom * ratio, MIN_ZOOM, MAX_ZOOM)
        const scale = target / current.zoom
        const originX = (a.x + b.x) / 2 - rect.left
        const originY = (a.y + b.y) / 2 - rect.top
        return {
          zoom: target,
          x: originX - (originX - current.x) * scale,
          y: originY - (originY - current.y) * scale,
        }
      })
      return
    }

    if (!gesture.current.moved) {
      if (Math.hypot(dx, dy) < DRAG_SLOP) return
      gesture.current.moved = true
      // from here on the viewer owns the gesture, so the image under the pointer is not "clicked"
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    updateView((current) => ({ ...current, x: current.x + dx, y: current.y + dy }))
  }

  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId)
  }

  const openImage = (index: number) => {
    if (gesture.current.moved) {
      gesture.current.moved = false
      return
    }
    setLightbox(index)
  }

  const scale = fit * view.zoom
  const contentWidth = frame.width * scale
  const contentHeight = frame.height * scale
  const zoomed = view.zoom > 1.001
  const canvasStyle: CSSProperties = {
    width: CANVAS.width,
    height: CANVAS.height,
    transform: `translate(${view.x - frame.x * scale}px, ${view.y - frame.y * scale}px) scale(${scale})`,
    visibility: fit ? 'visible' : 'hidden',
  }
  const thumbStyle = (viewport: number, content: number, offset: number, axis: 'x' | 'y'): CSSProperties => {
    const length = content > viewport ? (viewport / content) * 100 : 100
    const start = content > viewport ? (-offset / content) * 100 : 0
    return axis === 'x' ? { width: `${length}%`, left: `${start}%` } : { height: `${length}%`, top: `${start}%` }
  }

  return (
    <div className="detail" onPointerDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        ref={popupRef}
        className="detail__popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        tabIndex={-1}
        onKeyDown={trapFocus}
        // while the lightbox is open the popup behind it is out of reach
        inert={lightbox !== null}
      >
        <div
          ref={viewerRef}
          className={`detail__viewer${zoomed ? ' is-zoomed' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        >
          <div className="detail__canvas" style={canvasStyle}>
            {project.images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                className="detail__item"
                style={{ left: image.x, top: image.y, width: image.w, height: image.h }}
                aria-label={`View image ${index + 1}: ${image.caption}`}
                onClick={() => openImage(index)}
              >
                <img src={imageUrl(project.slug, image.id, sharp ? 'full' : 'thumb')} alt="" draggable={false} />
                <span className="detail__caption mono">{image.caption}</span>
              </button>
            ))}
          </div>

          <p className="detail__hint mono">
            <span className="detail__hint-mouse">SCROLL TO ZOOM · DRAG TO PAN</span>
            <span className="detail__hint-touch">PINCH TO ZOOM · DRAG TO PAN</span>
          </p>

          <div className="zoom-controls">
            <button type="button" aria-label="Zoom out" disabled={view.zoom <= MIN_ZOOM} onClick={() => zoomBy(-1)}>
              <Icon name="zoom-out" size={14} />
            </button>
            <output className="mono" aria-label="Zoom level">
              {Math.round(view.zoom * 100)}%
            </output>
            <button type="button" aria-label="Zoom in" disabled={view.zoom >= MAX_ZOOM} onClick={() => zoomBy(1)}>
              <Icon name="zoom-in" size={14} />
            </button>
            <span className="zoom-controls__divider" />
            <button type="button" aria-label="Fit to view" disabled={!zoomed} onClick={() => zoomAt(1, 0, 0)}>
              <Icon name="fit" size={14} />
            </button>
          </div>

          <span className="detail__scrollbar detail__scrollbar--y" aria-hidden="true">
            <span style={thumbStyle(size.height, contentHeight, view.y, 'y')} />
          </span>
          <span className="detail__scrollbar detail__scrollbar--x" aria-hidden="true">
            <span style={thumbStyle(size.width, contentWidth, view.x, 'x')} />
          </span>
        </div>

        <header className="detail__head">
          <div className="detail__tags">
            <span className="tag tag--blue">{project.role}</span>
            <span className="mono">{project.index}</span>
          </div>
          <button ref={closeRef} type="button" className="detail__close" aria-label="Close project" onClick={onClose}>
            <Icon name="close" size={14} />
          </button>
        </header>

        <div className="detail__body">
          <div className="detail__heading">
            <div className="detail__title">
              <h2 id="detail-title">{project.title}</h2>
              <p>{project.summary}</p>
            </div>
            <dl className="detail__facts">
              {[
                ['Role', project.role],
                ['Year', project.year],
                ['Scope', project.scope],
                ['Tools', project.tools],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="mono">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="detail__links">
            <p className="mono">VIEW THE PROJECT</p>
            <a className="button button--accent" href={project.primaryLink.href} target="_blank" rel="noreferrer">
              {project.primaryLink.label}
              <Icon name="arrow-up-right" />
            </a>
            <div className="detail__secondary">
              {project.secondaryLinks.map(({ label, href }) => (
                <a key={href} className="text-link" href={href} target="_blank" rel="noreferrer">
                  {label}
                  <Icon name="arrow-up-right" size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox project={project} index={lightbox} onChange={setLightbox} onClose={closeLightbox} />
      )}
    </div>
  )
}
