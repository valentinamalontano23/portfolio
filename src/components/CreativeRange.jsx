import { range } from '../data/site'
import Media from './ui/Media'
import Reveal from './ui/Reveal'
import SectionHead from './ui/SectionHead'

/* Text sits *on* the image here — deliberately different from the white cards
   further up, so the two sections never read as the same module twice. */
export default function CreativeRange({ focus }) {
  return (
    <section
      aria-labelledby="range-title"
      className="py-[var(--section-y-sm)]"
      style={{ background: 'var(--ivory-deep)' }}
    >
      <div className="shell">
        <SectionHead
          id="range-title"
          eyebrow="Creative range"
          title="One creator. Multiple ways"
          italic="to tell a story."
          subtitle="The same eye, four registers — chosen to fit the brief rather than the feed."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {range.map((item, i) => {
            const match = !focus || item.tags.includes(focus)
            return (
              <Reveal key={item.id} delay={i * 0.07} y={30} className={match ? 'lit' : 'dimmed'}>
                <article
                  data-cursor="Explore"
                  className="group relative overflow-hidden rounded-card transition-transform duration-500 ease-editorial hover:-translate-y-1.5"
                >
                  <Media
                    src={item.image}
                    alt={item.imageAlt || `${item.title} content style`}
                    ratio="3 / 4"
                    className="w-full"
                    badge={false}
                  />

                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(15,28,38,0.88) 4%, rgba(15,28,38,0.42) 42%, rgba(15,28,38,0.06) 78%)'
                    }}
                  />

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[0.56rem] font-semibold uppercase tracking-[0.24em]" style={{ color: 'var(--sun)' }}>
                      {item.caption}
                    </p>
                    <h3 className="mt-2 text-[1.7rem] leading-none text-ivory">{item.title}</h3>

                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[600ms] ease-editorial group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr] max-sm:grid-rows-[1fr]">
                      <p className="overflow-hidden text-[0.8rem] leading-relaxed text-ivory/75">
                        <span className="block pt-3">{item.body}</span>
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
