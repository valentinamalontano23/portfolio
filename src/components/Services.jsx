import { services } from '../data/site'
import Icon from './ui/Icon'
import Reveal from './ui/Reveal'
import SectionHead from './ui/SectionHead'

export default function Services({ focus }) {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="py-[var(--section-y)]"
      style={{ background: 'var(--ivory-deep)' }}
    >
      <div className="shell">
        <SectionHead
          id="services-title"
          eyebrow="Services"
          title="How we can"
          italic="work together."
          subtitle="Pick the closest fit — most projects end up as a mix of two."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((s, i) => {
            const match = !focus || s.tags.includes(focus)
            return (
              <Reveal key={s.id} delay={i * 0.05} y={26} className={match ? 'lit' : 'dimmed'}>
                <a
                  href="#contact"
                  className="group flex h-full flex-col rounded-card bg-white p-7 transition-[transform,box-shadow] duration-500 ease-editorial hover:-translate-y-1.5 hover:shadow-lift"
                >
                  <span
                    className="grid h-12 w-12 place-items-center rounded-full transition-colors duration-500"
                    style={{ background: 'rgba(96,122,97,0.12)', color: 'var(--olive)' }}
                  >
                    <Icon name={s.icon} className="h-[22px] w-[22px]" strokeWidth={1.35} />
                  </span>

                  <h3 className="mt-6 text-[1.45rem] leading-tight text-navy">{s.title}</h3>
                  <p className="mt-3 text-[0.88rem] leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {s.body}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-[0.63rem] font-semibold uppercase tracking-[0.2em] text-navy/45 transition-colors duration-500 group-hover:text-terracotta">
                    Start here
                    <Icon
                      name="arrow"
                      className="h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-1.5"
                      strokeWidth={1.7}
                    />
                  </span>
                </a>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
