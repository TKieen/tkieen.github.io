import { useCallback, useEffect, useRef, useState } from 'react'

type ScrambleTextProps = {
  text: string
  /** ms to keep scrambling before the first character settles */
  delay?: number
  /** ms taken to settle the whole text, left to right */
  duration?: number
}

const UPPER = 'ABCDEFGHKMNOPRSTUVXYZ'
const LOWER = 'abcdeghknopqsuvxyz'
const TICK = 45
/** ms a single character keeps flickering after the pointer enters it */
const HOVER = 360

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** A random letter of the same case, so it stays close to the width of the real one. */
function randomGlyph(char: string) {
  if (char === ' ') return null
  const pool = char === char.toUpperCase() ? UPPER : LOWER
  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * Decodes into `text` on mount: letters flicker at random, then lock in from the left.
 * Afterwards each letter flickers again on its own whenever the pointer enters it.
 */
export function ScrambleText({ text, delay = 0, duration = 600 }: ScrambleTextProps) {
  // per character: the random letter currently shown, or null once settled
  const [glyphs, setGlyphs] = useState<(string | null)[]>(() =>
    Array.from(text, (char) => (prefersReducedMotion() ? null : randomGlyph(char))),
  )
  // per character: the time until which it keeps flickering
  const until = useRef<number[]>([])
  const frame = useRef(0)

  const run = useCallback(() => {
    if (frame.current) return
    let lastTick = 0
    const step = (now: number) => {
      frame.current = 0
      const active = until.current.some((end) => end > now)
      if (!active || now - lastTick >= TICK) {
        lastTick = now
        setGlyphs(Array.from(text, (char, index) => (until.current[index] > now ? randomGlyph(char) : null)))
      }
      if (active) frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
  }, [text])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const now = performance.now()
    const count = Array.from(text).length
    until.current = Array.from(text, (_, index) => now + delay + (duration * (index + 1)) / count)
    run()
    return () => {
      cancelAnimationFrame(frame.current)
      frame.current = 0
    }
  }, [text, delay, duration, run])

  const scrambleChar = (index: number) => {
    if (prefersReducedMotion()) return
    until.current[index] = performance.now() + HOVER
    run()
  }

  // The real letter always holds the layout; the flickering one is laid over it.
  return (
    <span className="scramble">
      {Array.from(text, (char, index) => (
        <span
          key={index}
          className={`scramble__char${glyphs[index] ? ' is-scrambling' : ''}`}
          onMouseEnter={() => scrambleChar(index)}
        >
          <span className="scramble__text">{char}</span>
          {glyphs[index] && (
            <span className="scramble__overlay" aria-hidden="true">
              {glyphs[index]}
            </span>
          )}
        </span>
      ))}
    </span>
  )
}
