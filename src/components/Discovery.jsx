import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { discovery } from '../data/site'
import Icon from './ui/Icon'
import Reveal from './ui/Reveal'

/* The discovery bar is the site's front door for brands: pick the thing you
   came for and the whole page reorders itself around it. */
export default function Discovery({ focus, onFocus, matchCount }) {
  const reduce = useReducedMotion()
  const activeLabel = discovery.categories.find((c) => c.id === focus)?.label

  const choose = (id) => onFocus(focus === id ? null : id)

  /* Scrolls to "What I create", not "Selected work": with the Travel filter
     none of the four projects dim and with Fashion all four do, so that
     section either looks untouched or looks broken. These four cards always
     change 2-3 of 4.

     And it runs after the commit rather than inside the click. The status row
     below adds 56px to this card; scrollIntoView fired in the same tick locks
     onto the target's pre-growth position, so the page landed 56px short and
     the first click read as doing nothing. One frame later the layout is
     final. */
  useEffect(() => {
    if (!focus) return
    const target = document.getElementById('create')
    if (!target) return
    const frame = requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [focus, reduce])

  return (
    <div className="relative z-30 -mt-10 sm:-mt-12 lg:-mt-16">
      <div className="shell">
        <Reveal y={34} duration={1}>
          <div className="panel-raised rounded-[26px] p-5 sm:rounded-[32px] sm:p-7 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="flex items-start gap-4">
                <span
                  className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full"
                  style={{ background: 'rgba(201,104,75,0.12)', color: 'var(--terracotta)' }}
                >
                  <Icon name="search" className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-display text-[clamp(1.28rem,1.1rem+0.7vw,1.7rem)] leading-tight text-navy">
                    {discovery.prompt}
                  </p>
                  <p className="mt-1.5 text-[0.78rem] leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {discovery.hint}
                  </p>
                </div>
              </div>

              <div
                className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:justify-end lg:overflow-visible"
                role="group"
                aria-label="Filter the work by interest"
              >
                {discovery.categories.map((cat) => {
                  const on = focus === cat.id
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => choose(cat.id)}
                      aria-pressed={on}
                      title={cat.note}
                      /* named properties, not `all`, and 200ms: this is press
                         feedback on the thing being clicked, 500ms felt dead */
                      className={`group shrink-0 rounded-pill border px-4 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-editorial sm:px-5 ${
                        on
                          ? 'border-transparent text-ivory shadow-[0_14px_30px_-16px_rgba(201,104,75,0.9)]'
                          : 'border-navy/10 bg-white/55 text-navy/75 hover:-translate-y-0.5 hover:border-terracotta/45 hover:text-terracotta'
                      }`}
                      style={on ? { background: 'var(--terracotta)' } : undefined}
                    >
                      {cat.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* No height animation, and no AnimatePresence. Animating height
                moved the scroll target mid-flight, and AnimatePresence on this
                framer/React pair never unmounts its exiting child — which used
                to leave a harmless 0-height div, but would now strand a 56px
                ghost row once the filter is cleared. */}
            {focus ? (
                <motion.div
                  key={focus}
                  initial={reduce ? false : { opacity: 0, transform: 'translateY(-6px)' }}
                  animate={{ opacity: 1, transform: 'translateY(0px)' }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-navy/10 pt-4">
                    <p className="text-[0.72rem] uppercase tracking-[0.18em]" style={{ color: 'var(--muted)' }}>
                      Highlighting{' '}
                      <span style={{ color: 'var(--terracotta)', fontWeight: 600 }}>{activeLabel}</span>
                      {typeof matchCount === 'number' ? (
                        <span className="tabular"> · {matchCount} project{matchCount === 1 ? '' : 's'}</span>
                      ) : null}
                    </p>
                    <button
                      type="button"
                      onClick={() => onFocus(null)}
                      className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-navy/60 transition-colors duration-300 hover:text-terracotta"
                    >
                      <Icon name="close" className="h-3.5 w-3.5" strokeWidth={1.7} />
                      Show everything
                    </button>
                  </div>
                </motion.div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
