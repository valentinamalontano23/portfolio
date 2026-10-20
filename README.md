# Valentina D'Ambrosio — Travel • Lifestyle • UGC Creator

A production-ready portfolio website built with **React 19 + Vite + Tailwind CSS + Framer Motion**.
Everything is componentised and all content lives in one data file.

---

## Run it

```bash
npm install
npm run dev        # local dev server
npm run build       # the site that goes online -> dist/
npm run preview     # serve dist/ and check the real build
npm run set-domain -- https://yourdomain.com
npm run standalone  # optional one-file offline copy -> standalone/
```

`npm run build` is the one that matters. Photos and fonts stay separate
files, so the first screen paints before the rest of the page has arrived and
below-the-fold photos are fetched only when they are scrolled to.

`npm run standalone` is a different thing: the whole site folded into one
HTML file with every image inlined, for double-clicking or emailing. It lands
in `standalone/`, outside `dist/`, and is never deployed — a second copy of the
site on the live host would compete with the real pages in search. The reels
are not part of it, being far too large to inline.

Neither build makes a third-party request: the fonts are self-hosted.

---

## The only file you normally need to edit

### `src/data/site.js`

| What to change | Where |
| --- | --- |
| Email address | `profile.emailUser` + `profile.emailDomain` — kept in two halves so the whole address never appears as plain text in the published files, where harvesters look for it |
| Instagram / TikTok links | `profile.instagram`, `profile.tiktok` (leave `[TIKTOK URL]` to hide the TikTok link) |
| Follower / view / reel numbers | `stats` — three values, plus `statsNote` for the "updated [MONTH YEAR]" line |
| Project copy, categories, deliverables | `projects` |
| Video for a case study | `projects[n].video` — replace `[VIDEO URL]` with an `.mp4`/`.webm` URL and the modal plays it inline instead of showing a poster |
| Services, spec-work concepts, "why me" points | `services`, `spec.items`, `why` |
| Hero and about copy | `hero`, `about` |

Anything written as `[LIKE THIS]` is a placeholder waiting for a real value. Nothing on the
site invents a brand, a partnership or a campaign result.

---

## Replacing the images

`src/assets/` currently holds **29 abstract, art-directed placeholder images**. They are
generated artwork, not photographs, and no image depicts a real person.

To swap in Valentina's real photography: **drop a real file into `src/assets/` with the same
filename** (`.webp`, `.jpg` and `.png` all work — update the import extension in
`src/data/site.js` if you change it). Keep roughly the same shape:

| File | Shape | Used for |
| --- | --- | --- |
| `hero-coast.webp` | wide 16:9-ish | full-screen hero |
| `portrait-arch.webp` | portrait 4:5 | About portrait |
| `about-hills.webp` | portrait 4:5 | small inset next to the portrait |
| `cat-*.webp` (4) | portrait 4:5 | "What I create" cards |
| `work-*.webp` (4) | landscape 10:7 | project covers |
| `bubbleroom-2/3`, `vegas-2/3`, … | portrait 4:5 | project gallery frames |
| `range-*.webp` (4) | portrait 3:4 | creative-range cards |
| `spec-*.webp` (5) | portrait 4:5 | spec-work rail |
| `contact-sunset.webp` | wide | final contact section |

When the real photos are in, set **`usingPlaceholderVisuals = false`** in `src/data/site.js`
and the small "Placeholder" badges disappear site-wide.

To regenerate the placeholder set: `python3 scripts/make_visuals.py` (needs `pillow` + `numpy`).

---

## Structure

```
src/
  data/site.js            all copy, links, projects, services — the content layer
  index.css               brand tokens (colour, glass, buttons, motion rules)
  App.jsx                 page composition + the two pieces of shared state
  components/
    Nav.jsx               sticky nav: transparent over the hero, glass after scroll
    Hero.jsx              full-screen hero, parallax, staggered load
    Discovery.jsx         the "What are you looking for?" bar
    About.jsx             layered portrait + editorial copy
    WhatICreate.jsx       four content categories
    Statement.jsx         "Content that feels like a story — not an ad."
    SelectedWork.jsx      asymmetric project index
    ProjectModal.jsx      case study: gallery, video, deliverables, CTA
    CreativeRange.jsx     cinematic / relatable / educational / aspirational
    WhyMe.jsx             five concrete reasons
    Stats.jsx             numbers strip
    SpecWork.jsx          clearly-labelled CONCEPT pieces
    Services.jsx          six collaboration types
    CtaBand.jsx           reusable conversion moment
    Contact.jsx           glass contact card over photography
    Footer.jsx
    Cursor.jsx            desktop "View" cursor
    ui/                   Button, Media, Reveal, SectionHead, Icon
  hooks/                  useScrolled, useSectionSpy
```

### How the discovery bar works

`App.jsx` holds one piece of state, `focus`. Clicking a category sets it and scrolls to the
work section; every tagged card in **What I Create**, **Selected Work**, **Creative Range**,
**Spec Work** and **Services** either stays lit or recedes. Tags live on each item in
`site.js` — add a tag to an item and it joins that category.

---

## Brand system

| Token | Value | Role |
| --- | --- | --- |
| Warm Ivory | `#F7F3EC` | primary background |
| Deep Navy | `#172A3A` | text and dark sections |
| Terracotta | `#C9684B` | main accent |
| Mediterranean Green | `#607A61` | secondary accent |
| Sun Yellow | `#E7B84B` | small energetic details |
| Soft Coral | `#E99A86` | subtle accent |

Type: **DM Serif Display** (headlines, italic for emotional phrases) + **Montserrat**
(body and UI). All defined once at the top of `src/index.css` — change them there and the
whole site follows.

---

## Built in

- **Accessibility** — skip link, one `<h1>`, logical heading order, labelled landmarks, alt
  text on every image, visible focus rings, keyboard-operable project modal (Enter opens,
  Escape closes, focus is trapped and then restored), and full `prefers-reduced-motion`
  support (animations off, custom cursor off).
- **Performance** — every image lazy-loaded except the hero, aspect-ratio boxes so nothing
  reflows, no runtime CSS-in-JS, animations limited to transform and opacity.
- **Responsive** — checked at 390 / 834 / 1440 / 1920 with no horizontal overflow; the mobile
  layout is restructured, not squashed, and hover-only reveals become always-visible on touch.
- **SEO** — title, meta description, Open Graph tags and Person JSON-LD in `index.html`.
  Fill in `[SITE URL]`, `[SOCIAL SHARE IMAGE URL]`, `[EMAIL]` and the social links there too.

---

## Before going live

1. `profile.emailUser` / `profile.emailDomain` and `profile.instagram` in `src/data/site.js`
2. The three `stats` values and `statsNote`
3. Real photography in `src/assets/`, then `usingPlaceholderVisuals = false`
4. Video URLs on the four projects
5. `[SITE URL]`, `[SOCIAL SHARE IMAGE URL]`, `[EMAIL]`, `[INSTAGRAM URL]`, `[TIKTOK URL]` in `index.html`
