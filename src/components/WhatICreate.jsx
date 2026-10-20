import { creates } from '../data/site'
import Icon from './ui/Icon'
import Media from './ui/Media'
import Reveal from './ui/Reveal'
import SectionHead from './ui/SectionHead'

export default function WhatICreate({ focus }) {
  return (
    <section
      id="create"
      aria-labelledby="create-title"
      className="relative py-[var(--section-y-sm)]"
      style={{ background: 'var(--ivory-deep)' }}
    >
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHead
            id="create-title"
            eyebrow="What I create"
            title="Four ways to put a place"
            italic="on camera."
            size="sm"
          />
          <Reveal delay={0.1} className="md:pb-3">
            <p className="lede max-w-[34ch] md:text-right">
              Every brief lands in one of these — or moves between them.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {creates.map((card, i) => {
            const match = !focus || card.tags.includes(focus)
            return (
              <Reveal key={card.id} delay={i * 0.07} y={30}>
                <article
                  data-cursor="Explore"
                  /* opacity and filter have to be named HERE. .lit/.dimmed declare
                      their own transition, but this element's Tailwind utility
                      sits in @layer utilities and overrides the property list,
                      so the dim/light change snapped instead of fading. Per
                      property durations keep the hover lift at its 500ms while
                      the filter crossfade runs at 260ms. */
                  className={`group relative flex h-full flex-col overflow-hidden rounded-card bg-white transition-[transform,box-shadow,opacity,filter] duration-[500ms,500ms,260ms,260ms] ease-editorial hover:-translate-y-1.5 hover:shadow-lift ${
                    match ? 'lit' : 'dimmed'
                  }`}
                >
                  <Media
                    src={card.image}
                    alt={card.imageAlt}
                    ratio="4 / 5"
                    className="w-full"
                  >
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(15,28,38,0.62) 0%, rgba(15,28,38,0.06) 46%, transparent 70%)'
                      }}
                    />
                    <h3 className="absolute bottom-4 left-5 right-5 z-[2] text-[1.55rem] leading-none text-ivory">
                      {card.title}
                    </h3>
                  </Media>

                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <p className="text-[0.86rem] leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {card.description}
                    </p>

                    <ul className="mt-auto flex flex-col gap-1.5 border-t border-navy/10 pt-4">
                      {card.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-[0.74rem] tracking-[0.02em]"
                          style={{ color: 'var(--muted-soft)' }}
                        >
                          <span
                            className="h-1 w-1 shrink-0 rounded-full transition-colors duration-500"
                            style={{ background: 'var(--terracotta)' }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>

                    {/* The card already lifts, shadows and slides its arrow on
                        hover, so it has to actually go somewhere. The ::after
                        stretches the hit area over the whole card while the
                        link keeps the short phrase as its accessible name. */}
                    <a
                      href="#work"
                      aria-label={`See it in the work — ${card.title}`}
                      className="mt-1 inline-flex items-center gap-2 text-[0.63rem] font-semibold uppercase tracking-[0.2em] text-navy/45 transition-colors duration-500 after:absolute after:inset-0 after:z-[3] after:content-[''] group-hover:text-terracotta"
                    >
                      See it in the work
                      <Icon
                        name="arrow"
                        className="h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-1.5"
                        strokeWidth={1.7}
                      />
                    </a>
                  </div>

                  <span
                    className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-editorial group-hover:scale-x-100"
                    style={{ background: 'var(--terracotta)' }}
                  />
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
