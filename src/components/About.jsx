import { about } from '../data/site'
import Icon from './ui/Icon'
import Media from './ui/Media'
import Reveal from './ui/Reveal'

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-[var(--section-y)]">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
        {/* imagery — layered, deliberately off-grid */}
        <div className="relative lg:col-span-5">
          <Reveal x={-24} y={34} duration={1}>
            <Media
              src={about.portrait}
              alt={about.portraitAlt}
              ratio="4 / 5"
              className="rounded-[26px] shadow-lift"
            />
          </Reveal>

          <Reveal
            delay={0.18}
            y={40}
            className="absolute -bottom-12 -right-2 w-[42%] max-w-[220px] sm:-right-5 sm:w-[38%] lg:-right-14"
          >
            <div className="rounded-[20px] bg-white p-2 shadow-lift">
              <Media
                src={about.secondary}
                alt={about.secondaryAlt}
                ratio="4 / 5"
                className="rounded-[14px]"
                badge={false}
              />
            </div>
          </Reveal>

          <Reveal delay={0.3} className="absolute -left-2 top-8 hidden xl:block">
            <div className="glass rounded-pill px-4 py-2.5">
              <span className="text-[0.56rem] font-semibold uppercase tracking-[0.24em] text-navy/80">
                {about.facts[0].value}
              </span>
            </div>
          </Reveal>
        </div>

        {/* copy */}
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal y={14}>
            <p className="eyebrow">{about.eyebrow}</p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2
              id="about-title"
              className="mt-4 text-navy"
              style={{ fontSize: 'clamp(2.1rem, 1.4rem + 2.9vw, 3.9rem)', lineHeight: 1.02 }}
            >
              {about.titleTop}
              <br />
              <span className="u-serif-italic" style={{ color: 'var(--terracotta)' }}>
                {about.titleBottom}
              </span>
            </h2>
          </Reveal>

          <div className="mt-8 flex flex-col gap-5">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.08 + i * 0.06}>
                <p className="lede">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.28}>
            <blockquote
              className="mt-10 border-l-2 pl-6 font-display text-[clamp(1.25rem,1rem+1.1vw,1.85rem)] italic leading-snug text-navy"
              style={{ borderColor: 'var(--terracotta)' }}
            >
              {about.pull}
            </blockquote>
          </Reveal>

          <Reveal delay={0.34}>
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-navy/10 pt-7 sm:grid-cols-3">
              {about.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[0.58rem] uppercase tracking-[0.22em]" style={{ color: 'var(--muted-soft)' }}>
                    {f.label}
                  </dt>
                  <dd className="mt-2 text-[0.92rem] font-medium text-navy">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.4}>
            <a href="#contact" className="btn btn-outline mt-9">
              <span>{about.cta}</span>
              <Icon name="arrow" className="btn-arrow h-4 w-4" strokeWidth={1.6} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
