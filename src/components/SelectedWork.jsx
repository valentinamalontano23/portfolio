import { projects } from '../data/site'
import Icon from './ui/Icon'
import Media from './ui/Media'
import Reveal from './ui/Reveal'
import SectionHead from './ui/SectionHead'

/* Editorial index rather than a symmetrical grid: two wide pieces, two narrow,
   offset against each other so the eye moves down the page diagonally. */
const LAYOUT = [
  { span: 'lg:col-span-7', offset: '', ratio: '3 / 2', pos: 'center 52%' },
  { span: 'lg:col-span-5', offset: 'lg:mt-24', ratio: '4 / 5', pos: 'center 38%' },
  { span: 'lg:col-span-5', offset: 'lg:-mt-10', ratio: '4 / 5', pos: 'center 32%' },
  { span: 'lg:col-span-7', offset: 'lg:mt-14', ratio: '3 / 2', pos: 'center 46%' }
]

export default function SelectedWork({ focus, onOpen }) {
  return (
    <section id="work" aria-labelledby="work-title" className="relative py-[var(--section-y)]">
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHead
            id="work-title"
            eyebrow="Selected work"
            title="Stories built"
            italic="for social."
          />
          <Reveal delay={0.1} className="md:max-w-[36ch] md:pb-3">
            <p className="lede md:text-right">
              A collection of travel, hospitality and lifestyle stories designed for social.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-x-6 gap-y-14 lg:grid-cols-12">
          {projects.map((project, i) => {
            const layout = LAYOUT[i % LAYOUT.length]
            const match = !focus || project.tags.includes(focus)
            return (
              <Reveal
                key={project.id}
                y={36}
                delay={(i % 2) * 0.08}
                className={`${layout.span} ${layout.offset} ${match ? 'lit' : 'dimmed'}`}
              >
                <article className="group relative">
                  <div className="relative overflow-hidden rounded-card">
                    <Media
                      src={project.cover}
                      alt={project.coverAlt}
                      ratio={layout.ratio}
                      position={project.coverPosition || layout.pos}
                      className="w-full"
                    />

                    {/* hover reveal */}
                    <div
                      className="pointer-events-none absolute inset-0 flex items-end p-6 opacity-0 transition-opacity duration-500 ease-editorial group-hover:opacity-100 group-focus-within:opacity-100"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(15,28,38,0.78) 0%, rgba(15,28,38,0.18) 55%, transparent 80%)'
                      }}
                    >
                      <span className="inline-flex translate-y-2 items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-ivory transition-transform duration-500 ease-editorial group-hover:translate-y-0 group-focus-within:translate-y-0">
                        Watch the reel
                        <Icon name="arrow" className="h-4 w-4" strokeWidth={1.7} />
                      </span>
                    </div>

                    {/* Always on, not hover-only: it is the one hint that a video
                        sits behind the click, and touch devices never hover. */}
                    <span className="pointer-events-none absolute left-5 top-5 z-[2] grid h-10 w-10 place-items-center rounded-full glass-dark transition-transform duration-500 ease-editorial group-hover:scale-110">
                      <Icon name="play" className="h-4 w-4 text-ivory" strokeWidth={1.4} />
                    </span>

                    <span className="absolute right-5 top-5 z-[2] font-display text-[1.5rem] leading-none text-ivory/70">
                      {project.index}
                    </span>

                    <button
                      type="button"
                      onClick={() => onOpen(project)}
                      data-cursor="View"
                      aria-label={`Open case study: ${project.title}`}
                      className="absolute inset-0 z-[3] h-full w-full rounded-card"
                    />
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--terracotta)' }}>
                      {project.category}
                    </p>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h3 className="text-[clamp(1.7rem,1.3rem+1.4vw,2.5rem)] leading-none text-navy">
                        {project.title}
                      </h3>
                      <span className="text-[0.74rem] uppercase tracking-[0.14em]" style={{ color: 'var(--muted-soft)' }}>
                        {project.place}
                      </span>
                    </div>
                    <p className="u-serif-italic max-w-[34ch] text-[clamp(1.02rem,0.95rem+0.4vw,1.28rem)] leading-snug text-navy/75">
                      {project.phrase}
                    </p>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
