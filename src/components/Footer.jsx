import { contactEmail, profile } from '../data/site'
import Icon from './ui/Icon'

const isSet = (v) => v && !v.trim().startsWith('[')

export default function Footer() {
  const links = [
    { label: 'Instagram', href: profile.instagram, icon: 'instagram', external: true },
    { label: 'Email', href: 'mailto:' + contactEmail(), icon: 'mail', external: false },
    isSet(profile.tiktok)
      ? { label: 'TikTok', href: profile.tiktok, icon: 'tiktok', external: true }
      : null
  ].filter(Boolean)

  return (
    <footer style={{ background: 'var(--navy)' }}>
      <div className="shell py-14">
        <div className="flex flex-col gap-10 border-b border-white/10 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)] leading-none text-ivory">
              {profile.name}
            </p>
            <p className="mt-3 text-[0.66rem] uppercase tracking-[0.24em] text-ivory/50">
              {profile.role}
            </p>
          </div>

          <nav aria-label="Elsewhere" className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? '_blank' : undefined}
                rel={l.external ? 'noreferrer noopener' : undefined}
                className="group inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-ivory/70 transition-colors duration-300 hover:text-sun"
              >
                <Icon name={l.icon} className="h-4 w-4" strokeWidth={1.4} />
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 pt-7 sm:flex-row sm:items-center sm:justify-between">
          {/* a privacy policy nobody can reach is not a privacy policy */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="text-[0.66rem] tracking-[0.06em] text-ivory/40">
              © {profile.year} {profile.name}. All rights reserved.
            </p>
            <a
              href="privacy.html"
              className="text-[0.66rem] uppercase tracking-[0.18em] text-ivory/50 transition-colors duration-300 hover:text-sun"
            >
              Privacy
            </a>
            <a
              href="terms.html"
              className="text-[0.66rem] uppercase tracking-[0.18em] text-ivory/50 transition-colors duration-300 hover:text-sun"
            >
              Terms
            </a>
          </div>
          <a
            href="#home"
            className="inline-flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.18em] text-ivory/50 transition-colors duration-300 hover:text-sun"
          >
            Back to top
            <Icon name="arrowDown" className="h-3.5 w-3.5 rotate-180" strokeWidth={1.6} />
          </a>
        </div>
      </div>
    </footer>
  )
}
