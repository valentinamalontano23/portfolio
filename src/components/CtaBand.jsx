import Icon from './ui/Icon'
import Reveal from './ui/Reveal'

/* Reusable conversion moment. Used more than once, never with the same words. */
export default function CtaBand({ eyebrow, title, italic, label, href = '#contact', tone = 'warm' }) {
  const warm = tone === 'warm'
  return (
    <section aria-label={eyebrow} className="relative">
      <div className="shell">
        <Reveal y={24}>
          <div
            className="flex flex-col gap-8 rounded-card px-7 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-14"
            style={{
              background: warm
                ? 'linear-gradient(120deg, rgba(233,154,134,0.20) 0%, rgba(231,184,75,0.16) 48%, rgba(96,122,97,0.14) 100%)'
                : 'linear-gradient(120deg, rgba(23,42,58,0.06), rgba(23,42,58,0.02))'
            }}
          >
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <p
                className="mt-4 max-w-[22ch] font-display text-navy"
                style={{ fontSize: 'clamp(1.7rem, 1.2rem + 2vw, 2.9rem)', lineHeight: 1.05 }}
              >
                {title}{' '}
                {italic ? (
                  <span className="u-serif-italic" style={{ color: 'var(--terracotta)' }}>
                    {italic}
                  </span>
                ) : null}
              </p>
            </div>

            <a href={href} className="btn btn-ink shrink-0 self-start lg:self-auto">
              <span>{label}</span>
              <Icon name="arrow" className="btn-arrow h-4 w-4" strokeWidth={1.6} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
