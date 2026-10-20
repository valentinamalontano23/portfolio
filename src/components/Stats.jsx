import { stats, statsNote } from '../data/site'
import Reveal from './ui/Reveal'

/* Deliberately a thin strip, not a headline act — the numbers support the
   work rather than standing in for it. */
export default function Stats() {
  return (
    <section aria-label="Audience numbers" className="grain relative isolate overflow-hidden" style={{ background: 'var(--navy)' }}>
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(70% 120% at 20% 0%, rgba(96,122,97,0.35), transparent 60%)' }}
      />
      <div className="shell py-12 sm:py-14">
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} y={18}>
              <div className="flex flex-col gap-1 border-l pl-5" style={{ borderColor: 'rgba(231,184,75,0.5)' }}>
                <span className="tabular font-display text-[clamp(2.1rem,1.5rem+2.2vw,3.1rem)] leading-none text-ivory">
                  {s.value}
                </span>
                <span className="text-[0.68rem] uppercase tracking-[0.18em] text-ivory/55">{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.25}>
          <p className="mt-9 text-[0.66rem] uppercase tracking-[0.16em] text-ivory/35">{statsNote}</p>
        </Reveal>
      </div>
    </section>
  )
}
