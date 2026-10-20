/* Writes the site's own address into the six places that need it as an
   absolute URL, because they cannot be relative:
   a canonical tag has to be absolute to mean anything, a sitemap <loc> must be,
   robots.txt's Sitemap: line must be, and an og:image that is not absolute
   shows no preview card at all.

   Run it once, as soon as the address is known:

     npm run set-domain -- https://username.github.io

   It is safe to run again with a different address later — it matches the
   current value rather than a placeholder, so changing domain is one command.
*/
import { readFileSync, writeFileSync } from 'node:fs'

const raw = process.argv[2]

if (!raw) {
  console.error(`
Missing address.

  npm run set-domain -- https://username.github.io
  npm run set-domain -- https://valentinadambrosio.com
`)
  process.exit(1)
}

let base
try {
  const u = new URL(raw)
  if (u.protocol !== 'https:') throw new Error('must be https')
  base = (u.origin + u.pathname).replace(/\/+$/, '')
} catch {
  console.error(`Not a usable https address: ${raw}`)
  process.exit(1)
}

const today = new Date().toISOString().slice(0, 10)
const problems = []

const patch = (file, label, pattern, replacement) => {
  const text = readFileSync(file, 'utf8')
  const next = text.replace(pattern, replacement)
  if (next === text) {
    problems.push(`${file} — ${label}`)
    return text
  }
  return next
}

/* robots.txt — the Sitemap: line */
writeFileSync(
  'public/robots.txt',
  patch('public/robots.txt', 'Sitemap line', /^Sitemap:.*$/m, `Sitemap: ${base}/sitemap.xml`)
)

/* sitemap.xml — every <loc>, keeping each path, plus a fresh lastmod */
{
  let s = patch(
    'public/sitemap.xml',
    '<loc> entries',
    /<loc>https?:\/\/[^/<]+(\/[^<]*)<\/loc>/g,
    (_, path) => `<loc>${base}${path}</loc>`
  )
  s = s.replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${today}</lastmod>`)
  writeFileSync('public/sitemap.xml', s)
}

/* the two legal pages — their canonical tag */
for (const page of ['public/privacy.html', 'public/terms.html']) {
  writeFileSync(
    page,
    patch(
      page,
      'canonical tag',
      /(<link rel="canonical" href=")https?:\/\/[^/"]+(\/[^"]*)(")/,
      (_, open, path, close) => `${open}${base}${path}${close}`
    )
  )
}

/* 404.html — its paths start from the site root, because it is served AT the
   address that was not found and so cannot use relative ones. That root is
   the domain for a user site and the repository folder for a project site,
   which is why it is rewritten here from whatever address you gave rather
   than assumed. */
{
  const path = new URL(base).pathname.replace(/\/+$/, '') // '' or '/repo-name'
  let h = readFileSync('public/404.html', 'utf8')
  const before = h

  for (const file of ['favicon.ico', 'favicon-32.png', 'apple-touch-icon.png', 'legal.css']) {
    h = h.replace(
      new RegExp(`(href=")[^"]*${file.replace('.', '\\.')}(")`, 'g'),
      `$1${path}/${file}$2`
    )
  }
  for (const hash of ['work', 'contact']) {
    h = h.replace(new RegExp(`(href=")[^"]*#${hash}(")`, 'g'), `$1${path}/#${hash}$2`)
  }
  h = h.replace(/(<a class="btn btn-solid" href=")[^"]*(")/, `$1${path}/$2`)

  if (h === before) problems.push('public/404.html — root-relative paths')
  writeFileSync('public/404.html', h)
}

/* index.html — canonical, og:url and og:image */
{
  let h = readFileSync('index.html', 'utf8')
  const before = h

  h = h.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${base}/$2`)
  h = h.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${base}/$2`)
  h = h.replace(
    /(<meta property="og:image" content=")[^"]*(")/,
    `$1${base}/og-image.jpg$2`
  )

  if (h === before) problems.push('index.html — canonical / og tags')
  writeFileSync('index.html', h)
}

if (problems.length) {
  console.error('\nThese were left untouched — check them by hand:')
  for (const p of problems) console.error('  ' + p)
  process.exit(1)
}

console.log(`
Address set to ${base} in:
  public/robots.txt      Sitemap: line
  public/sitemap.xml     3 <loc> entries, lastmod ${today}
  public/privacy.html    canonical
  public/terms.html      canonical
  public/404.html        paths rebased on ${new URL(base).pathname.replace(/\/+$/, '') || '/'}
  index.html             canonical, og:url, og:image

Now rebuild:  npm run build
`)
