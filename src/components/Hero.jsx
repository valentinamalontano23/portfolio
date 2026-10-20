import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { hero, profile, usingPlaceholderVisuals } from '../data/site'
/* Served from public/ at a fixed path rather than imported, so index.html
   can preload it. It is the largest element on the first screen: starting
   its download while the JavaScript is still arriving is what makes the
   hero appear early instead of only after React has mounted. */
const heroImage = './hero-coast.webp'
import Icon from './ui/Icon'

const EASE = [0.22, 1, 0.36, 1]

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-6%'])
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  const stagger = (i) => ({
    initial: reduce ? false : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay: 0.15 + i * 0.11, ease: EASE }
  })

  return (
    <section
      id="home"
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-[clamp(7rem,17vh,11rem)] pt-[var(--nav-h)]"
      aria-label="Introduction"
    >
      {/* photography */}
      <motion.div className="absolute inset-0 -z-20" style={{ y: reduce ? 0 : imageY }}>
        <img
          src={heroImage}
          alt={hero.imageAlt}
          className={`h-full w-full object-cover ${reduce ? '' : 'animate-slow-zoom'}`}
          /* Anchored right, not centred. Valentina stands at about 82% across
             a 16:9 frame, so on a narrow screen a centred crop shows the lake
             and cuts her out entirely. 94% keeps her in the middle of what is
             left and clips nothing, down to 320px wide.
             On a desktop the crop is shallow — at 1440x900 it trims 11% off
             one side, and she is nowhere near that edge — and once the frame
             is wider than 16:9 the image is cropped vertically instead, so
             the horizontal value stops doing anything at all. */
          style={{ objectPosition: '94% 46%' }}
          fetchPriority="high"
          decoding="async"
        />
      </motion.div>

      {/* legibility scrims — warm, never a flat black wash */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(to top, rgba(15,28,38,0.86) 0%, rgba(15,28,38,0.52) 30%, rgba(15,28,38,0.14) 58%, rgba(15,28,38,0.42) 100%)'
        }}
      />
      <div
        className="absolute inset-0 -z-10 mix-blend-soft-light"
        style={{ background: 'radial-gradient(120% 80% at 74% 40%, rgba(231,184,75,0.5), transparent 60%)' }}
      />

      <motion.div
        className="shell relative z-10 w-full"
        style={{ y: reduce ? 0 : contentY, opacity: reduce ? 1 : fade }}
      >
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 xl:col-span-7">
            <motion.p {...stagger(0)} className="hero-nameplate">
              {profile.name}
            </motion.p>

            <motion.p
              {...stagger(1)}
              className="mt-2 text-[0.78rem] uppercase leading-none tracking-[0.24em] text-ivory/80"
            >
              {profile.role}
            </motion.p>

            <motion.h1
              {...stagger(2)}
              className="mt-7 text-ivory"
              style={{ fontSize: 'clamp(2.15rem, 1.1rem + 3.5vw, 4.6rem)', lineHeight: 1.0 }}
            >
              {hero.headlineTop}
              <br className="hidden sm:block" />{' '}
              <span className="u-serif-italic" style={{ color: 'var(--sun)' }}>
                {hero.headlineBottom}
              </span>{' '}
              <span className="text-ivory/90">{hero.headlineTail}</span>
            </motion.h1>

            <motion.p
              {...stagger(3)}
              className="mt-7 max-w-[52ch] text-[clamp(0.94rem,0.9rem+0.2vw,1.06rem)] leading-relaxed text-ivory/80"
            >
              {hero.micro}
            </motion.p>

            <motion.div {...stagger(4)} className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#contact" className="btn btn-solid">
                <span>{hero.primaryCta}</span>
                <Icon name="arrow" className="btn-arrow h-4 w-4" strokeWidth={1.6} />
              </a>
              <a href="#work" className="btn btn-glass">
                <span>{hero.secondaryCta}</span>
                <Icon name="arrow" className="btn-arrow h-4 w-4" strokeWidth={1.6} />
              </a>
            </motion.div>
          </div>

          {/* scroll cue, then the floating label beneath it — both parked in the
              bottom-right corner so neither sits over the subject's face */}
          <div className="lg:col-span-4 xl:col-span-5">
            <motion.div
              {...stagger(5)}
              className="flex flex-col items-end justify-end gap-6"
            >
              <a
                href="#about"
                className="group hidden items-center gap-3 lg:flex"
                aria-label="Scroll to about"
              >
                <span className="text-[0.56rem] uppercase tracking-[0.3em] text-ivory/65">
                  Scroll
                </span>
                <span className="relative block h-14 w-px overflow-hidden bg-ivory/25">
                  <span
                    className={`absolute left-0 top-0 block h-4 w-px bg-sun ${reduce ? '' : 'animate-scroll-dot'
                      }`}
                  />
                </span>
              </a>

              <div
                className={`glass-dark inline-flex items-center gap-3 rounded-pill px-5 py-3 ${reduce ? '' : 'animate-float'
                  }`}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--sun)' }} />
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.26em] text-ivory">
                  {hero.kicker}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* mobile scroll cue */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 lg:hidden">
        <Icon name="arrowDown" className={`h-5 w-5 text-ivory/50 ${reduce ? '' : 'animate-float'}`} />
      </div>

      {usingPlaceholderVisuals ? (
        <span className="ph-chip" style={{ top: 'calc(var(--nav-h) + 0.75rem)' }}>
          Placeholder image
        </span>
      ) : null}
    </section>
  )
}
