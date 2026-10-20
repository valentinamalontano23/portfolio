# Going live

Everything below is the part a host has to do, plus the blanks only you can fill.

---

## 1. The one blank left: the address

Everything else is filled in. The legal pages carry real values — controller,
contact email, hosting processor, retention periods, governing law — and no
highlighted placeholder is left on either page. The only thing still unknown
is where the site will live, because six places need it as an **absolute**
URL and none of them can be relative: a canonical tag, three sitemap entries,
the `Sitemap:` line in robots.txt, and `og:image` / `og:url`.

One command sets all six:

```bash
npm run set-domain -- https://username.github.io
```

It matches the current value rather than a placeholder, so changing to a real
domain later is the same command again. Rebuild afterwards: `npm run build`.

### Two things only you can confirm

- **VAT number.** The pages are written for an individual with no partita IVA.
  If you register one, add it to section 1 of both pages — there is a comment
  in `public/privacy.html` showing exactly where.
- **The mailbox.** `privacy.html` says plainly that enquiries land in a Gmail
  account and that Google is not a processor acting on your behalf, because
  for a free consumer account that is the truth. A mailbox on your own domain
  (Google Workspace, Fastmail, Proton) comes with a data processing agreement
  and lets that paragraph be shortened. It also reads better to a brand.

### The share image

`public/og-image.jpg` is the card people see when the link is pasted into
WhatsApp, LinkedIn or an email — 1200x630, centre-cropped from the hero photo,
106 KB. To change the photo, replace the file at the same size and name.

## 2. Force HTTPS

The page already carries `upgrade-insecure-requests`, which upgrades any
subresource that resolves to `http://`. **That is not a redirect.** A visitor
typing `http://yourdomain.com` still arrives over plain HTTP unless the server
sends them on. That part can only be done by the host:

**Netlify** — create `public/_headers`:

```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

HTTP→HTTPS redirect is automatic once the certificate is issued.

**Vercel** — `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains; preload" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

**Cloudflare Pages** — dashboard → SSL/TLS → set *Full (strict)*, turn on
*Always Use HTTPS*, then *Enable HSTS*.

**Apache** — `.htaccess`:

```apache
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
ErrorDocument 404 /404.html
```

**Nginx**:

```nginx
server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;
  return 301 https://$host$request_uri;
}
server {
  listen 443 ssl http2;
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
  error_page 404 /404.html;
}
```

> Add HSTS only once HTTPS definitely works. It tells browsers to refuse plain
> HTTP for a year, and that instruction cannot be taken back early.

---

## 3. The 404 page

`dist/404.html` is produced by every build. Netlify, Cloudflare Pages and
GitHub Pages pick it up automatically. Apache and Nginx need the
`ErrorDocument` / `error_page` line above.

---

## 3b. Looking at the build locally

```bash
npm run preview
```

That serves `dist/` over http and prints an address. Use it rather than
double-clicking `dist/index.html`, which shows a blank page and always will:
the app loads through `<script type="module">`, and a module fetched over
`file://` is blocked by CORS because the origin is `null`. No path can fix
that.

If you do want a copy that opens from a double-click — to email, or to show
someone with no internet — build it on purpose:

```bash
npm run standalone
```

It writes `standalone/valentina-portfolio.html`, the whole site inlined into one
file. It is kept out of `dist/` deliberately, so it is never deployed and never
competes with the real pages in search. The reels are not in it: they are far
too large to inline, so the project cards there have nothing to play.

---

## 3c. What makes the page fast

Worth knowing, because it is easy to undo by accident.

The build keeps photos and fonts as **separate files**. The browser gets the
first screen and starts painting while everything else is still arriving, and
the photos further down are fetched only when they are scrolled to. Measured
on the built site, the first screen costs about **430 KB over 9 requests**.

Two things carry most of that, and both are deliberate:

- `public/hero-coast.webp` sits in `public/` rather than being imported, so
  `index.html` can `preload` it. Otherwise the browser only learns the hero
  photo exists after `app.js` has run, which is the slowest thing on the page.
- The photographs are encoded at a quality that is visually identical to the
  originals but a fraction of the weight — the three largest went from 6.6 MB
  to 0.6 MB between them.

**Do not set `assetsInlineLimit` high in `vite.config.js`.** It was set to inline
every image, which produced a 13 MB JavaScript file that had to arrive in full
before anything at all appeared on screen. That setting belongs only in
`vite.standalone.config.js`, where a single self-contained file is the point.

When you add a photograph, give it roughly twice the size it will be displayed
at and no more, and keep it under ~300 KB.

## 4. After the first deploy

- Submit `https://yourdomain.com/sitemap.xml` in Google Search Console.
- Check the certificate and headers at https://www.ssllabs.com/ssltest/.
- Confirm `https://yourdomain.com/robots.txt` and `/sitemap.xml` load.

---

## 4b. The reels

The videos live with the site, in `public/videos/`. Files in `public/` are
copied as-is and are **not** inlined into the bundle, so the page stays light:
a reel is only fetched when someone presses play.

Hosting them yourself is what keeps the privacy section above true. A YouTube
or Vimeo embed is a third party, which means a consent click before playback
and a longer privacy policy. Your own `<video>` has no ads, no watermark and
nothing to consent to.

### Encode before uploading

Straight out of a phone or an editor a reel is far bigger than it needs to be.
Per file:

```bash
ffmpeg -i input.mov   -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920"   -c:v libx264 -profile:v high -crf 23 -preset slow -pix_fmt yuv420p   -c:a aac -b:a 128k -ac 2   -movflags +faststart   public/videos/reel-bubbleroom.mp4
```

`-movflags +faststart` is the one that matters most: it moves the index to the
front of the file so playback starts immediately instead of waiting for the
whole download. `-crf 23` is the quality dial — lower is better and bigger,
20 is visually lossless, 26 starts to show on flat gradients.

Expect roughly **20–25 MB per minute**. Four reels of 1–2 minutes lands around
120–180 MB in total.

A poster frame, so the card is not blank before play:

```bash
ffmpeg -i public/videos/reel-bubbleroom.mp4 -ss 00:00:01 -vframes 1 -q:v 2   src/assets/work-bubbleroom.webp
```

### Wire it up

In `src/data/site.js`, replace the placeholder on the matching project:

```js
video: 'videos/reel-bubbleroom.mp4',   // was '[VIDEO URL]'
```

Relative, not `/videos/...`, so it keeps working when the build is opened as a
file. The modal plays it inline, muted, looping, with controls.

### Bandwidth

Every full view of a 35 MB reel costs 35 MB of transfer. Check what your host
allows once you pick one: at a 100 GB monthly allowance that is roughly 2,800
complete views a month, which is far more than a portfolio normally sees.

If that ever becomes tight, or you add many more videos, move the files to a
video CDN rather than a bigger plan — **Bunny.net Stream** (around €1/month,
white-label) or **Cloudflare Stream** ($5/month). Both are unbranded, so the
privacy wording above would only need the consent gate switched on. Avoid free
YouTube/Vimeo tiers: branding, suggested videos at the end, and a consent click
before anything plays.

### Hosting the reels on GitHub Pages

If the site is published on GitHub Pages, **put the videos in the same repo**,
under `videos/`, and let Pages serve them. Measured against a real `.mp4` on a
`github.io` site:

| | |
| --- | --- |
| `content-type` | `video/mp4` — correct, so `<video>` will play it |
| Range requests | `206` supported, so seeking works and playback starts early |
| CDN | Fastly, with an edge node in Italy |

The numbers fit comfortably: a published Pages site may be up to 1 GB and four
reels come to roughly 150 MB; no single file may exceed 100 MiB and each reel
is around 35 MB; the soft bandwidth limit is 100 GB/month.

Two things to respect:

- **Get the encode right before the first push.** Git keeps every version of
  every file forever, so each re-upload leaves the previous copy in history and
  the repository only grows. Re-encoding a reel three times means three copies
  on disk for good.
- Add an empty `.nojekyll` file at the root of what you publish (this project
  ships one in `public/`) so Pages serves the folder as-is.

**What not to do: a second repo with `raw.githubusercontent.com` links.** That
host returns `.mp4` as `application/octet-stream` rather than `video/mp4`,
which browsers treat as a file to download rather than something to play, so
the `<video>` element may refuse it outright. It is also a different origin
from your site — which makes it a third party, and brings back the consent
question this setup was built to avoid.

---

## 5. What the site does with personal data

Worth knowing, because the privacy policy claims it and it has to stay true.

- **No cookies.** None are set.
- **No analytics**, no pixel, no session recording.
- **No forms** — contact is a `mailto:` link, so nothing is submitted here.
- **No third-party requests, at all.** Fonts are self-hosted and the reels are
  served from this site. Measured on the built page: zero requests leave the
  site's own origin.

### The browser enforces it

Every page carries a Content-Security-Policy that allows scripts, styles,
images, fonts and video **only from this site**. It is not a promise in a
document — a request to an outside host is refused by the browser. If a
tracking snippet were ever pasted in by accident, it would not run.

Two consequences to know about before they surprise you:

- `frame-src 'none'` blocks every iframe. **If you add a YouTube or Vimeo
  embed, it will not appear** until that one directive names the provider.
  At that point the consent gate in `ProjectModal.jsx` comes back into play and
  the privacy policy needs its third-party section again.
- `script-src 'self'` forbids inline script. The one-file `npm run standalone`
  copy inlines its script by definition, so the build strips the policy from
  that copy only. That copy makes no network requests at all, which is the
  guarantee the policy was there to give.

### What is in the image and video files

Photographs out of a phone normally carry EXIF: GPS coordinates, device model,
serial number, the owner name set on the camera. Those were checked and
stripped. What was actually found was mild — no coordinates, no serials, a
leftover "Picasa" tag — but the blocks are gone now rather than trusted.

The colour profiles (ICC) were kept on purpose: they hold no personal data and
removing them would shift the colours.

**This is per file, not automatic.** When you add a photograph, strip it first.
The quickest way without extra software:

```bash
# re-encode through ffmpeg, which writes no metadata of its own
ffmpeg -i original.jpg -map_metadata -1 -q:v 2 clean.webp
```

On Windows you can also right-click a file, Properties, Details, then
"Remove Properties and Personal Information". The reels you encoded with the
command in section 4b are already clean — that was checked too.

### The email address

Address harvesters crawl pages and pull out anything shaped like
`name@domain` with one regular expression. So the address is **never written
into the published files**. It is kept in two halves — `profile.emailUser` and
`profile.emailDomain` in `site.js`, and `data-user` / `data-domain` attributes on
the legal pages — and joined in the browser. Searching the whole built site
for the full address returns nothing.

Visitors see an ordinary clickable address. The legal pages also carry a
"name [at] domain" fallback in the markup, so the address stays legible
without JavaScript — which matters, because those are the pages where the law
requires you to be contactable.

**Be clear-eyed about what this buys.** It defeats the cheap automated sweep,
which is most of the volume. A harvester that runs JavaScript still sees the
address, and it is public on your social profiles anyway. If spam ever becomes
a real problem, the fix is a dedicated address for the site that you can
retire, not more obfuscation.

### If you ever add tracking

**Google Analytics, a Meta pixel, a hosted contact form, a newsletter embed —
any of these ends all of the above.** The CSP would block them until you
loosened it, and once loosened you need a real consent banner that holds those
scripts back until the visitor agrees, plus a cookie section in the privacy
policy. Say the word and it gets built properly; the consent plumbing is
already there.

---

## 6. The legal text is a draft

The two pages describe accurately what the site technically does — that part
was written from an audit of the code, not from a template. The legal framing
is a solid starting point, **not legal advice**. Before launch, have a
professional check it against your actual situation: business form, VAT
position, whether you work with clients outside the EU, and what your email
provider and host actually do with data.
