import { useEffect, useState } from 'react'

/* Tracks which section is currently in view so the nav can mark it. */
export default function useSectionSpy(ids, offset = 120) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!nodes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      {
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: [0.05, 0.25, 0.5]
      }
    )

    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [ids, offset])

  return active
}
