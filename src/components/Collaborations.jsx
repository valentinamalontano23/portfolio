import { collabs } from '../data/site'
import Reveal from './ui/Reveal'

/* The logo row that closes the navy statement section.

   No tiles: every mark sits straight on the navy. Three of the five already
   read there in their own colours. The other two are dark-inked — Stratford
   is not even transparent, it is a white plate with black type — so they get
   `reverse`: grayscale + invert flips the ink from dark to light, and the
   `screen` blend drops whatever is behind it. Screen leaves black untouched
   over any backdrop, so the inverted white plate resolves to exactly the navy
   behind it and disappears, with no new asset needed.

   Screen blends against the nearest stacking context, so nothing between
   these images and the section may create one — that means no transform,
   opacity or filter on the wrappers. Hence the row carries no Reveal: the
   entrance animation would introduce exactly that, and the plate would flash
   black on the way in. */
/* contrast+brightness are not decoration: inverting mid-tones yields mid-tones,
   which sit dim on navy. Pushing them takes Stratford's surviving ink from 35%
   to 75% legible, and drives its plate further to black so more of it dissolves
   (70% vs 65%). Brightness multiplies, so true black stays black and the plate
   never comes back. */
const REVERSE = {
  filter: 'grayscale(1) invert(1) contrast(1.25) brightness(1.5)',
  mixBlendMode: 'screen'
}

export default function Collaborations() {
  const danglesOnMobile = collabs.logos.length % 2 === 1

  return (
    <div
      className="mt-[clamp(3.5rem,7vw,5.5rem)] border-t pt-[clamp(2.5rem,5vw,4rem)]"
      style={{ borderColor: 'rgba(247,243,236,0.14)' }}
    >
      <Reveal y={14}>
        <p
          className="text-center text-[0.6rem] font-semibold uppercase tracking-[0.28em]"
          style={{ color: 'var(--sun)' }}
        >
          {collabs.eyebrow}
        </p>
      </Reveal>

      <ul
        aria-label="Brands I have collaborated with"
        className="mt-10 grid grid-cols-2 items-start justify-items-center gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-8"
      >
        {collabs.logos.map((brand, i) => (
          <li
            key={brand.id}
            /* Two columns on a phone, so an odd number of logos leaves the
               last one alone in the left column with a hole beside it. Let it
               span the row instead — justify-items-center then centres it.
               Worked out from the count rather than hard-coded, so adding a
               sixth logo fills the pair and this switches itself off. */
            className={`flex w-full flex-col items-center ${
              danglesOnMobile && i === collabs.logos.length - 1
                ? 'col-span-2 sm:col-span-1'
                : ''
            }`}
          >
            <span className="flex h-[clamp(3.5rem,6vw,4.75rem)] items-center justify-center">
              <img
                src={brand.logo}
                /* a captioned mark is labelled by its caption, so the image
                   itself is decorative — otherwise the name is read twice */
                alt={brand.caption ? '' : brand.name}
                width={brand.w}
                height={brand.h}
                loading="lazy"
                decoding="async"
                style={{ maxHeight: brand.height, ...(brand.reverse ? REVERSE : null) }}
                className="h-auto w-auto max-w-full"
              />
            </span>
            {brand.caption ? (
              <p className="mt-3 text-center text-[0.56rem] font-semibold uppercase tracking-[0.22em] text-ivory/70">
                {brand.caption}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
