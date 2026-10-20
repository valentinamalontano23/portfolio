import { contact, contactEmail, profile, usingPlaceholderVisuals } from '../data/site'
import Icon from './ui/Icon'
import Reveal from './ui/Reveal'

export default function Contact() {
  const email = contactEmail()

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="grain relative isolate overflow-hidden py-[var(--section-y)]"
    >
      <img
        src={contact.image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        /* Same photograph, same reason as the hero: anchored right so the
           narrow crop keeps her rather than the empty half of the lake. This box is
           taller than the hero, so the slice is narrower and the anchor has to
           sit a little further left to avoid clipping her. */
        style={{ objectPosition: '87% 55%' }}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(13,24,32,0.82) 0%, rgba(13,24,32,0.62) 40%, rgba(13,24,32,0.88) 100%)'
        }}
      />
      {usingPlaceholderVisuals ? (
        <span className="ph-chip">Placeholder image</span>
      ) : null}

      <div className="shell relative grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16 [&>*]:min-w-0">
        <div className="lg:col-span-7">
          <Reveal y={14}>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.26em]" style={{ color: 'var(--sun)' }}>
              {contact.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              id="contact-title"
              className="mt-5 text-ivory"
              style={{ fontSize: 'clamp(2.3rem, 1.4rem + 3.6vw, 4.4rem)', lineHeight: 1 }}
            >
              Let&apos;s create something people{' '}
              <span className="u-serif-italic" style={{ color: 'var(--sun)' }}>
                want to experience.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-[52ch] text-[1rem] leading-relaxed text-ivory/70">{contact.body}</p>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={0.16} y={30}>
            <div className="glass-dark rounded-[28px] p-7 sm:p-9">
              <p className="font-display text-[1.8rem] leading-none text-ivory">{profile.name}</p>
              <p className="mt-3 text-[0.72rem] uppercase tracking-[0.2em] text-ivory/60">
                {profile.role}
              </p>

              <hr className="my-7 border-0" style={{ height: 1, background: 'rgba(255,255,255,0.18)' }} />

              <dl className="flex flex-col gap-5">
                <div>
                  <dt className="text-[0.56rem] uppercase tracking-[0.24em] text-ivory/45">Instagram</dt>
                  <dd className="mt-1.5">
                    <a
                      href={profile.instagram}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-[0.98rem] text-ivory transition-colors duration-300 hover:text-sun"
                    >
                      {profile.handle}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.56rem] uppercase tracking-[0.24em] text-ivory/45">Email</dt>
                  <dd className="mt-1.5">
                    <a
                      href={'mailto:' + email}
                      className="text-[0.98rem] text-ivory transition-colors duration-300 hover:text-sun"
                    >
                      {email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.56rem] uppercase tracking-[0.24em] text-ivory/45">Based</dt>
                  <dd className="mt-1.5 text-[0.98rem] text-ivory/85">{profile.base}</dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href={'mailto:' + email} className="btn btn-solid !px-6">
                  <Icon name="mail" className="h-4 w-4" strokeWidth={1.5} />
                  <span>Email me</span>
                </a>
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-glass !px-6"
                >
                  <Icon name="instagram" className="h-4 w-4" strokeWidth={1.5} />
                  <span>Instagram</span>
                </a>
              </div>

              <p className="mt-6 text-[0.68rem] uppercase tracking-[0.16em] text-ivory/40">
                {contact.responseNote}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
