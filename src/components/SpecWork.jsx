import { spec } from '../data/site'
import Media from './ui/Media'
import Reveal from './ui/Reveal'
import SectionHead from './ui/SectionHead'

/* Concept pieces. Every card carries the CONCEPT label — these are never
   presented as client campaigns. */
export default function SpecWork({ focus }) {
  return (
    <section aria-labelledby="spec-title" className="overflow-hidden py-[var(--section-y-sm)]">
      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead id="spec-title" eyebrow={spec.eyebrow} title="Spec" italic="work." size="sm" />
          <Reveal delay={0.1} className="lg:max-w-[46ch] lg:pb-2">
            <p className="lede lg:text-right">{spec.subtitle}</p>
          </Reveal>
        </div>
      </div>

      {/* full-bleed rail so the row visibly continues past the edge */}
      <div className="mt-12 w-full overflow-x-auto pb-4 rail">
        <div
          className="flex gap-5"
          style={{
            paddingInline: 'max(1.5rem, calc((100vw - var(--shell)) / 2))',
            width: 'max-content'
          }}
        >
          {spec.items.map((item, i) => {
            const match = !focus || item.tags.includes(focus)
            return (
              <Reveal
                key={item.id}
                delay={i * 0.05}
                y={26}
                className={`w-[74vw] max-w-[320px] shrink-0 sm:w-[46vw] lg:w-[300px] ${
                  match ? 'lit' : 'dimmed'
                }`}
              >
                <article className="group h-full">
                  <div className="relative overflow-hidden rounded-card">
                    <Media
                      src={item.image}
                      alt={item.imageAlt || `${item.title} concept`}
                      ratio="4 / 5"
                      className="w-full"
                      badge={false}
                    />
                    <span
                      className="absolute left-4 top-4 rounded-pill px-3 py-1.5 text-[0.52rem] font-semibold uppercase tracking-[0.2em]"
                      style={{ background: 'rgba(247,243,236,0.92)', color: 'var(--terracotta)' }}
                    >
                      Concept
                    </span>
                  </div>
                  <h3 className="mt-5 text-[1.35rem] leading-none text-navy">{item.title}</h3>
                  <p className="mt-3 text-[0.84rem] leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {item.body}
                  </p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>

      <div className="shell">
        <p className="mt-4 text-[0.66rem] uppercase tracking-[0.18em]" style={{ color: 'var(--muted-soft)' }}>
          Scroll for more concepts →
        </p>
      </div>
    </section>
  )
}
