import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Icon from './ui/Icon'
import Media from './ui/Media'

const isPlaceholder = (v) => !v || String(v).trim().startsWith('[')

/* The `video` field accepts three things and each renders differently:
   - a file path or .mp4 URL  -> native player, muted autoplay + loop
   - a YouTube link           -> privacy-friendly embed, muted autoplay + loop
   - a Vimeo link             -> embed, muted autoplay + loop
   Autoplay is always muted: every browser blocks it otherwise. */
const YOUTUBE = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
const VIMEO = /vimeo\.com\/(?:video\/)?(\d+)/

/* The reel is the reason to open a project, so every branch renders into the
   same phone-shaped stage rather than a 16:9 slot. 25rem wide is ~44rem tall,
   which still clears a laptop viewport once the panel padding is counted. */
/* YouTube and Vimeo are the only third parties this site can ever contact —
   everything else, fonts included, is served from our own origin. So consent
   is asked here, on the thing that actually opens the connection, rather than
   through a site-wide cookie banner for cookies that do not exist. Nothing is
   requested from the provider until this is accepted.

   The answer lives in localStorage, on the visitor's own device: it is never
   sent anywhere, and it exists only so the question is not asked twice. */
const CONSENT_KEY = 'vda:embed-consent'
const readConsent = () => {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'granted'
  } catch {
    return false // private mode, blocked storage — fall back to asking
  }
}

const STAGE = 'mx-auto w-full max-w-[25rem] overflow-hidden rounded-[22px]'
const PORTRAIT = { aspectRatio: '9 / 16' }

export default function ProjectModal({ project, onClose }) {
  const reduce = useReducedMotion()
  const hasVideo = project && !isPlaceholder(project.video)
  const hasReel = project && !isPlaceholder(project.instagram)
  const youtubeId = hasVideo ? (String(project.video).match(YOUTUBE) || [])[1] : null
  const vimeoId = hasVideo ? (String(project.video).match(VIMEO) || [])[1] : null
  const autoplay = reduce ? 0 : 1
  const [embedsAllowed, setEmbedsAllowed] = useState(readConsent)
  const panel = useRef(null)
  const closeBtn = useRef(null)
  const restoreTo = useRef(null)

  useEffect(() => {
    if (!project) return
    restoreTo.current = document.activeElement
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => closeBtn.current?.focus(), 60)

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panel.current) return
      const focusables = panel.current.querySelectorAll(
        'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])'
      )
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(t)
      document.body.style.overflow = prev
      if (restoreTo.current instanceof HTMLElement) restoreTo.current.focus()
    }
  }, [project, onClose])

  return (
    <>
      {project ? (
        /* Deliberately not wrapped in AnimatePresence. With framer-motion 13 on
           React 19 the exiting child is reset to its `initial` values and never
           unmounted, so this fixed inset-0 panel stayed over the page at
           opacity 0 — invisible, but swallowing every click on the site. The
           exit animation never actually ran, so dropping it costs nothing. */
        <motion.div
          /* the overlay itself no longer scrolls — the panel is centred and
             capped, and any overflow scrolls inside it, so the card never
             drifts off centre once it is open */
          className="fixed inset-0 z-[150]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 h-full w-full cursor-default"
            style={{ background: 'rgba(11,20,28,0.72)', backdropFilter: 'blur(10px)' }}
          />

          <div className="relative flex h-full items-center justify-center p-3 sm:p-6 lg:p-10">
            <motion.div
              ref={panel}
              initial={reduce ? false : { opacity: 0, y: 40, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-[26px] shadow-lift sm:rounded-[34px]"
              style={{ background: 'var(--ivory)' }}
            >
              {/* No cover image: the card opens straight into the story and the
                  reel. The close button gets its own row so it can never land
                  on top of the video. */}
              <div className="flex shrink-0 justify-end px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
                <button
                  ref={closeBtn}
                  type="button"
                  onClick={onClose}
                  aria-label="Close case study"
                  className="grid h-11 w-11 place-items-center rounded-full border border-navy/15 bg-ivory-deep text-navy transition-colors duration-300 hover:bg-navy hover:text-ivory"
                >
                  <Icon name="close" className="h-5 w-5" strokeWidth={1.6} />
                </button>
              </div>

              {/* min-h-0 lets this flex child actually shrink, which is what
                  allows it to scroll instead of pushing the panel taller */}
              <div className="grid min-h-0 gap-10 overflow-y-auto overscroll-contain px-6 pb-8 pt-4 sm:px-9 sm:pb-10 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:pb-12 lg:pt-6">
                {/* story */}
                <div className="lg:col-span-7">
                  <p
                    className="text-[0.6rem] font-semibold uppercase tracking-[0.24em]"
                    style={{ color: 'var(--terracotta)' }}
                  >
                    {project.index} · {project.category}
                  </p>
                  <h2
                    id="modal-title"
                    className="mt-4 text-navy"
                    style={{ fontSize: 'clamp(1.9rem, 1.4rem + 2vw, 3rem)', lineHeight: 1 }}
                  >
                    {project.title}
                  </h2>
                  <p
                    className="mt-3 text-[0.78rem] uppercase tracking-[0.16em]"
                    style={{ color: 'var(--muted-soft)' }}
                  >
                    {project.place}
                  </p>

                  <p className="u-serif-italic mt-8 text-[clamp(1.3rem,1.1rem+0.9vw,1.9rem)] leading-snug text-navy">
                    {project.phrase}
                  </p>
                  <p className="lede mt-6">{project.summary}</p>

                  {project.note ? (
                    <p
                      className="mt-5 text-[0.74rem] uppercase tracking-[0.16em]"
                      style={{ color: 'var(--muted-soft)' }}
                    >
                      {project.note}
                    </p>
                  ) : null}

                  <div className="mt-9">
                    <p className="eyebrow-muted">Content created</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {project.deliverables.map((d) => (
                        <li
                          key={d}
                          className="rounded-pill border px-4 py-2 text-[0.68rem] font-medium tracking-[0.04em]"
                          style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
                        >
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a href="#contact" onClick={onClose} className="btn btn-solid mt-9">
                    <span>Let&apos;s create your next story</span>
                    <Icon name="arrow" className="btn-arrow h-4 w-4" strokeWidth={1.6} />
                  </a>
                </div>

                {/* the reel */}
                <div className="lg:col-span-5">
                  {(youtubeId || vimeoId) && !embedsAllowed ? (
                    <div className={`relative ${STAGE}`} style={{ ...PORTRAIT, background: 'var(--navy)' }}>
                      <Media src={project.cover} alt="" ratio="9 / 16" badge={false} className="w-full opacity-45" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                        <Icon name="play" className="h-9 w-9 text-ivory/70" strokeWidth={1.2} />
                        <p className="text-[0.74rem] leading-relaxed text-ivory/80">
                          This video is hosted by {youtubeId ? 'YouTube' : 'Vimeo'}. Playing it
                          connects you to them and shares your IP address.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            try {
                              localStorage.setItem(CONSENT_KEY, 'granted')
                            } catch {
                              /* blocked storage: allow for this visit only */
                            }
                            setEmbedsAllowed(true)
                          }}
                          className="btn btn-solid !px-5 !py-3 !text-[0.62rem]"
                        >
                          <span>Load the video</span>
                        </button>
                        <a
                          href="privacy.html"
                          className="text-[0.6rem] uppercase tracking-[0.18em] text-ivory/55 underline underline-offset-4"
                        >
                          Privacy policy
                        </a>
                      </div>
                    </div>
                  ) : youtubeId ? (
                    <div className={STAGE} style={PORTRAIT}>
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=${autoplay}&mute=1&loop=1&playlist=${youtubeId}&rel=0&modestbranding=1&playsinline=1`}
                        title={`${project.title} — video`}
                        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                        allowFullScreen
                        loading="lazy"
                        className="h-full w-full border-0"
                      />
                    </div>
                  ) : vimeoId ? (
                    <div className={STAGE} style={PORTRAIT}>
                      <iframe
                        src={`https://player.vimeo.com/video/${vimeoId}?autoplay=${autoplay}&muted=1&loop=1&title=0&byline=0&portrait=0&dnt=1`}
                        title={`${project.title} — video`}
                        allow="autoplay; picture-in-picture; fullscreen"
                        allowFullScreen
                        loading="lazy"
                        className="h-full w-full border-0"
                      />
                    </div>
                  ) : hasVideo ? (
                    /* object-contain rather than cover: a vertical file fills the
                       frame either way, and a stray landscape one letterboxes
                       instead of being cropped through the middle. */
                    <div className={STAGE} style={{ ...PORTRAIT, background: 'var(--navy)' }}>
                      <video
                        controls
                        playsInline
                        muted
                        loop
                        autoPlay={!reduce}
                        preload="metadata"
                        poster={project.cover}
                        className="h-full w-full object-contain"
                      >
                        <source src={project.video} />
                        Your browser does not support embedded video.
                      </video>
                    </div>
                  ) : hasReel ? (
                    <a
                      href={project.instagram}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`Watch the ${project.title} reel on Instagram`}
                      className={`group relative block ${STAGE}`}
                    >
                      <Media src={project.cover} alt="" ratio="9 / 16" badge={false} className="w-full" />
                      <span
                        className="absolute inset-0 grid place-items-center"
                        style={{ background: 'rgba(15,28,38,0.42)' }}
                      >
                        <span className="glass-dark grid h-16 w-16 place-items-center rounded-full transition-transform duration-500 ease-editorial group-hover:scale-110">
                          <Icon name="play" className="h-7 w-7 text-ivory" strokeWidth={1.3} />
                        </span>
                      </span>
                      <span
                        className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-pill px-3 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-ivory"
                        style={{ background: 'rgba(11,22,30,0.58)' }}
                      >
                        <Icon name="instagram" className="h-3.5 w-3.5" strokeWidth={1.5} />
                        Watch on Instagram
                      </span>
                    </a>
                  ) : (
                    <div className={`relative ${STAGE}`}>
                      <Media src={project.cover} alt="" ratio="9 / 16" badge={false} className="w-full" />
                      <div
                        className="absolute inset-0 grid place-items-center"
                        style={{ background: 'rgba(15,28,38,0.42)' }}
                      >
                        <div className="glass-dark grid h-16 w-16 place-items-center rounded-full">
                          <Icon name="play" className="h-7 w-7 text-ivory" strokeWidth={1.3} />
                        </div>
                      </div>
                      <span className="ph-chip">Video placeholder</span>
                    </div>
                  )}

                  <div className="mx-auto mt-3 flex w-full max-w-[25rem] flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <p className="text-[0.7rem] leading-relaxed" style={{ color: 'var(--muted-soft)' }}>
                      {hasVideo
                        ? 'Muted by default — turn the sound on with the player controls.'
                        : hasReel
                          ? 'Opens the original reel on Instagram.'
                          : 'Add a vertical video file or an Instagram link for this project in src/data/site.js.'}
                    </p>
                    {hasVideo && hasReel ? (
                      <a
                        href={project.instagram}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-2 text-[0.64rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 hover:text-terracotta"
                        style={{ color: 'var(--muted)' }}
                      >
                        <Icon name="instagram" className="h-3.5 w-3.5" strokeWidth={1.5} />
                        Watch on Instagram
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </>
  )
}
