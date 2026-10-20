import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { navItems, profile } from '../data/site'
import useScrolled from '../hooks/useScrolled'
import useSectionSpy from '../hooks/useSectionSpy'
import Icon from './ui/Icon'

const IDS = navItems.map((n) => n.id)

export default function Nav() {
  const scrolled = useScrolled(60)
  const active = useSectionSpy(IDS)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const solid = scrolled || open

  const linkBase =
    'relative text-[0.68rem] font-medium uppercase tracking-[0.19em] transition-colors duration-300'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[90] transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-editorial ${
          scrolled ? 'nav-glass' : ''
        }`}
        style={{ height: 'var(--nav-h)' }}
      >
        <nav
          aria-label="Primary"
          className="shell flex h-full items-center justify-between gap-6"
        >
          <a
            href="#home"
            className="group flex flex-col leading-none"
            onClick={() => setOpen(false)}
          >
            <span
              className={`font-display text-[1.02rem] tracking-[0.01em] transition-colors duration-500 sm:text-[1.15rem] ${
                solid ? 'text-navy' : 'text-ivory'
              }`}
            >
              {profile.name}
            </span>
            <span
              /* over the glass this sits at 0.53rem, so --muted only reached
                 4.28:1. Navy at 70% clears 4.73:1 and the extra weight is the
                 usual vibrancy trick for small text on a translucent surface. */
              className={`mt-1 hidden text-[0.53rem] uppercase tracking-[0.28em] transition-colors duration-500 sm:block ${
                solid ? 'font-medium' : 'text-ivory/70'
              }`}
              style={{ color: solid ? 'rgba(23,42,58,0.7)' : undefined }}
            >
              Travel · Lifestyle · UGC
            </span>
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`${linkBase} ${
                    scrolled
                      ? isActive
                        ? 'text-terracotta-deep'
                        : 'text-navy/70 hover:text-terracotta-deep'
                      : isActive
                        ? 'text-sun'
                        : 'text-ivory/80 hover:text-ivory'
                  }`}
                >
                  {item.label}
                  <span
                    className="absolute -bottom-2 left-0 h-px origin-left transition-transform duration-500 ease-editorial"
                    style={{
                      width: '100%',
                      background: scrolled ? 'var(--terracotta-deep)' : 'var(--sun)',
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)'
                    }}
                  />
                </a>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className={`btn hidden !py-3 !px-6 !text-[0.63rem] md:inline-flex ${
                scrolled ? 'btn-solid' : 'btn-glass'
              }`}
            >
              <span>Work with me</span>
              <Icon name="arrow" className="btn-arrow h-3.5 w-3.5" strokeWidth={1.7} />
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className={`grid h-11 w-11 place-items-center rounded-full border transition-colors duration-500 lg:hidden ${
                scrolled || open
                  ? 'border-navy/15 bg-white/70 text-navy'
                  : 'border-white/40 bg-white/10 text-ivory'
              }`}
            >
              <Icon name={open ? 'close' : 'menu'} className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </header>

      {/* Same framer-motion 13 / React 19 exit bug as ProjectModal: wrapped in
          AnimatePresence this fixed inset-0 overlay was never unmounted, so one
          open-and-close of the menu left the whole mobile site unclickable. */}
      {open ? (
        <motion.div
          id="mobile-menu"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[85] lg:hidden"
        >
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(247,243,236,0.86)', backdropFilter: 'blur(24px)' }}
            onClick={() => setOpen(false)}
          />
          <div className="shell relative flex h-full flex-col justify-center gap-1 pb-16 pt-24">
            {navItems.map((item, i) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="border-b border-navy/10 py-5 font-display text-[2.2rem] text-navy"
              >
                {item.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={() => setOpen(false)}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="btn btn-solid mt-8 self-start"
            >
              <span>Work with me</span>
              <Icon name="arrow" className="btn-arrow h-4 w-4" strokeWidth={1.6} />
            </motion.a>
          </div>
        </motion.div>
      ) : null}
    </>
  )
}
