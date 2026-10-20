import { useEffect, useRef, useState } from 'react'

/* Desktop-only cursor companion. Any element with data-cursor="View" shows
   that word next to the pointer. Never rendered on touch or with reduced
   motion — there the plain pointer is the better experience. */
export default function Cursor() {
  const dot = useRef(null)
  const current = useRef(null)
  const [label, setLabel] = useState(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let cx = tx
    let cy = ty
    let frame

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      const hit = e.target instanceof Element ? e.target.closest('[data-cursor]') : null
      const next = hit ? hit.getAttribute('data-cursor') : null
      if (next !== current.current) {
        current.current = next
        setLabel(next)
      }
    }

    const loop = () => {
      cx += (tx - cx) * 0.17
      cy += (ty - cy) * 0.17
      if (dot.current) {
        dot.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
      }
      frame = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    frame = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={dot} className="cursor-dot" aria-hidden="true">
      <div
        className="flex h-[84px] w-[84px] items-center justify-center rounded-full transition-[opacity,transform] duration-500 ease-editorial"
        style={{
          background: 'rgba(201, 104, 75, 0.94)',
          boxShadow: '0 18px 40px -18px rgba(201,104,75,0.9)',
          opacity: label ? 1 : 0,
          transform: label ? 'scale(1)' : 'scale(0.6)'
        }}
      >
        <span className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-ivory">
          {label}
        </span>
      </div>
    </div>
  )
}
