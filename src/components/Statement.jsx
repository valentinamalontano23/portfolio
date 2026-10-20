import { motion, useReducedMotion } from 'framer-motion'
import { statement } from '../data/site'
import Collaborations from './Collaborations'

/* The loudest moment on the page — one sentence, held on navy, and the only
   place the type is allowed to fill the screen. */
export default function Statement() {
  const reduce = useReducedMotion()
  const words = statement.line.split(' ')

  return (
    <section
      aria-label="Working principle"
      className="grain relative isolate overflow-hidden py-[var(--section-y-lg)]"
      style={{ background: 'var(--navy)' }}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(80% 60% at 82% 12%, rgba(201,104,75,0.42), transparent 62%), radial-gradient(60% 50% at 8% 92%, rgba(96,122,97,0.36), transparent 60%)'
        }}
      />

      <div className="shell relative">
        <div className="flex items-center gap-4">
          <span className="h-px w-10" style={{ background: 'var(--sun)' }} />
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.28em]" style={{ color: 'var(--sun)' }}>
            The whole idea
          </p>
        </div>

        <p
          className="mt-8 max-w-[16ch] font-display text-ivory sm:max-w-[18ch]"
          style={{ fontSize: 'clamp(2.6rem, 1.2rem + 6.4vw, 7rem)', lineHeight: 0.96 }}
        >
          {words.map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              className="inline-block"
              initial={reduce ? false : { opacity: 0, y: '0.5em', filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.75, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}&nbsp;
            </motion.span>
          ))}
          <motion.span
            className="u-serif-italic inline-block"
            style={{ color: 'var(--sun)' }}
            initial={reduce ? false : { opacity: 0, y: '0.5em', filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.9, delay: words.length * 0.07 + 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            — {statement.emphasis}
          </motion.span>
        </p>

        <motion.p
          className="mt-10 max-w-[46ch] text-[0.95rem] leading-relaxed text-ivory/60"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Nobody saves an advert. They save the trip they want to take, the room they want to
          wake up in, the thing that made them laugh on the way to work.
        </motion.p>

        <Collaborations />
      </div>
    </section>
  )
}
