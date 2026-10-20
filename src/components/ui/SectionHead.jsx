import Reveal from './Reveal'

/* Shared section opener: micro-label, editorial headline, optional subtitle.
   Alignment is left by default — the grid does the composing, not centring. */
export default function SectionHead({
  eyebrow,
  title,
  italic,
  subtitle,
  id,
  dark = false,
  className = '',
  size = 'lg'
}) {
  const scale =
    size === 'sm'
      ? 'text-[clamp(1.9rem,1.4rem+2vw,3rem)]'
      : 'text-[clamp(2.4rem,1.6rem+3.4vw,4.6rem)]'

  return (
    <div className={`max-w-[62ch] ${className}`}>
      {eyebrow ? (
        <Reveal y={14}>
          <p className={dark ? 'eyebrow-muted !text-sun' : 'eyebrow'}>{eyebrow}</p>
        </Reveal>
      ) : null}
      <Reveal delay={0.06}>
        <h2 id={id} className={`mt-4 ${scale} ${dark ? 'text-ivory' : 'text-navy'}`}>
          {title}
          {italic ? (
            <>
              {' '}
              <span className="u-serif-italic" style={{ color: 'var(--terracotta)' }}>
                {italic}
              </span>
            </>
          ) : null}
        </h2>
      </Reveal>
      {subtitle ? (
        <Reveal delay={0.12}>
          <p className={`lede mt-6 ${dark ? '!text-ivory/70' : ''}`}>{subtitle}</p>
        </Reveal>
      ) : null}
    </div>
  )
}
