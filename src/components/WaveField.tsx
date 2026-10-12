import { useEffect, useRef } from 'react'
import '../styles/wave-field.css'

type WaveFieldProps = {
  /** Number of wave lines. */
  lines?: number
  /** Share of the height the waves spread over, measured from the bottom (0–1). */
  spread?: number
}

const BLUE = '120, 171, 229' // --blue

/**
 * Decorative wave lines for a dark surface. The waves drift slowly on their own; scrolling
 * speeds them up and raises them, in the direction of the scroll, then they settle again.
 * Fills its nearest positioned ancestor.
 */
export function WaveField({ lines = 6, spread = 0.7 }: WaveFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let frame = 0
    let visible = false
    let previous = 0
    let lastScroll = window.scrollY
    let energy = 0 // smoothed scroll speed, signed, about -1…1
    let phase = 0

    const draw = () => {
      context.clearRect(0, 0, width, height)
      const lift = Math.min(Math.abs(energy), 1)
      const top = height * (1 - spread)
      for (let index = 0; index < lines; index += 1) {
        const depth = lines > 1 ? index / (lines - 1) : 0 // 0 = back, 1 = front
        const base = top + (height - top) * (0.12 + depth * 0.8)
        const amplitude = height * (0.035 + depth * 0.03) * (1 + lift * 1.6)
        const length = width * (0.9 - depth * 0.35)
        const offset = phase * (0.6 + depth * 0.9) + index * 1.7
        context.beginPath()
        for (let x = 0; x <= width + 8; x += 8) {
          const angle = (x / length) * Math.PI * 2
          const y =
            base +
            Math.sin(angle + offset) * amplitude +
            Math.sin(angle * 2.3 - offset * 0.7) * amplitude * 0.35
          if (x === 0) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        context.strokeStyle = `rgba(${BLUE}, ${0.1 + depth * 0.22 + lift * 0.12})`
        context.lineWidth = 1 + depth * 0.6
        context.stroke()
      }
    }

    const tick = (now: number) => {
      frame = 0
      const elapsed = Math.min(now - previous, 64)
      previous = now
      // px per ms → signed energy; fast flicks saturate near ±1
      const scroll = window.scrollY
      const speed = elapsed > 0 ? (scroll - lastScroll) / elapsed : 0
      lastScroll = scroll
      const target = Math.max(-1, Math.min(1, speed / 2.5))
      const ease = 1 - Math.exp(-elapsed / (Math.abs(target) > Math.abs(energy) ? 90 : 520))
      energy += (target - energy) * ease
      phase += elapsed * 0.00045 + energy * elapsed * 0.006
      draw()
      if (visible) frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (frame || still.matches || !visible) return
      previous = performance.now()
      lastScroll = window.scrollY
      frame = requestAnimationFrame(tick)
    }

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = bounds.width
      height = bounds.height
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      draw()
    }

    const sizes = new ResizeObserver(resize)
    sizes.observe(canvas)
    const view = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    view.observe(canvas)
    const onMotionChange = () => {
      if (still.matches) {
        cancelAnimationFrame(frame)
        frame = 0
        energy = 0
        draw()
      } else start()
    }
    still.addEventListener('change', onMotionChange)

    return () => {
      cancelAnimationFrame(frame)
      sizes.disconnect()
      view.disconnect()
      still.removeEventListener('change', onMotionChange)
    }
  }, [lines, spread])

  return <canvas ref={ref} className="wave-field" aria-hidden="true" />
}
