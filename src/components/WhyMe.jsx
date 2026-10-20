import { why } from '../data/site'
import Icon from './ui/Icon'
import Reveal from './ui/Reveal'

export default function WhyMe() {
  return (
    <section id="why" aria-labelledby="why-title" className="py-[var(--section-y)]">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
            <Reveal y={14}>
              <p className="eyebrow">Why me</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                id="why-title"
                className="mt-4 text-navy"
                style={{ fontSize: 'clamp(2.2rem, 1.5rem + 2.6vw, 3.6rem)', lineHeight: 1.02 }}
              >
                Why{' '}
                <span className="u-serif-italic" style={{ color: 'var(--terracotta)' }}>
                  Valentina?
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="lede mt-6 max-w-[38ch]">
                Not adjectives — the five things that actually change what you get back.
              </p>
            </Reveal>
          </div>
        </div>

        <ul className="lg:col-span-8">
          {why.map((item, i) => (
            <Reveal key={item.id} as="li" delay={i * 0.05} y={22}>
              <div className="group flex gap-5 border-t border-navy/10 py-7 transition-colors duration-500 sm:gap-8 sm:py-8">
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full transition-all duration-500 ease-editorial group-hover:scale-105"
                  style={{ background: 'rgba(201,104,75,0.10)', color: 'var(--terracotta)' }}
                >
                  <Icon name={item.icon} className="h-[22px] w-[22px]" strokeWidth={1.35} />
                </span>
                <div>
                  <h3 className="text-[clamp(1.15rem,1rem+0.6vw,1.55rem)] leading-tight text-navy">
                    {item.title}
                  </h3>
                  <p className="lede mt-3 !text-[0.95rem]">{item.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
