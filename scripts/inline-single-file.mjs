/**
 * Folds the standalone build into self-contained HTML.
 *
 *  standalone/valentina-portfolio.html  — a complete page you can double-click,
 *                                         email, or carry on a USB stick.
 *  standalone/artifact-page.html        — the same page as body-level markup
 *                                         only, for hosts that supply <head>.
 *
 * Run through `npm run standalone`, which builds with vite.standalone.config.js
 * first. That config inlines every image and font as a data URI, so the output
 * makes no network requests at all — fonts included, which is also why there is
 * no Google Fonts link here: handing a visitor's IP to Google is exactly what
 * the privacy policy says this site does not do.
 *
 * This output is deliberately NOT in dist/ and never deployed.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = resolve(root, 'standalone')

if (!existsSync(resolve(out, 'index.html'))) {
  console.error('!! standalone/index.html is missing — run `npm run standalone`')
  process.exit(1)
}

const html = readFileSync(resolve(out, 'index.html'), 'utf8')
const css = readFileSync(resolve(out, 'assets/app.css'), 'utf8')
let js = readFileSync(resolve(out, 'assets/app.js'), 'utf8')

/* The hero photograph lives in public/ so the real build can preload it, which
   means Vite copies it rather than inlining it. For a file that has to work on
   its own, fold it in here instead — it is referenced both by the preload tag
   and by the component. */
const heroFile = resolve(out, 'hero-coast.webp')
if (!existsSync(heroFile)) {
  console.error('!! standalone/hero-coast.webp is missing')
  process.exit(1)
}
const heroUri = `data:image/webp;base64,${readFileSync(heroFile).toString('base64')}`
js = js.split('./hero-coast.webp').join(heroUri)

// A literal </script> inside a string would close the tag early.
const safeJs = js.replace(/<\/script/gi, '<\\/script')

/* ---------------------------------------------------- 1. standalone page */
/* Replacer functions, not strings: bundled code contains $` and $& sequences
   that String.replace would otherwise treat as substitution patterns. */
let page = html
  .replace(/<link rel="stylesheet"[^>]*href="[^"]*app\.css"[^>]*>/i, () => `<style>\n${css}\n</style>`)
  .replace(
    /<script[^>]*src="[^"]*app\.js"[^>]*><\/script>/i,
    () => `<script type="module">\n${safeJs}\n</script>`
  )

/* Check the tags are gone, not the bare names: the head carries a comment that
   mentions app.js, and matching on that alone reports a failure that is not one. */
if (/<link[^>]+app\.css/i.test(page) || /<script[^>]+src=[^>]*app\.js/i.test(page)) {
  console.error('!! Could not inline one of the assets — check the tag names in standalone/index.html')
  process.exit(1)
}

/* This copy is not the canonical site and must never be indexed if it ever
   ends up somewhere public, nor should it claim the live site's address. */
page = page
  /* The site's Content-Security-Policy says script-src 'self', which forbids
     inline script. This copy's whole point is that its script IS inline, so
     the policy would blank the page. It is also pointless here: a file opened
     from disk has no origin for 'self' to mean anything. Out it goes — and
     this copy makes no network requests at all, which is the guarantee the
     policy existed to give. */
  .replace(/<meta http-equiv="Content-Security-Policy"[^>]*>\s*/i, '')
  .replace(/<!--[\s\S]*?browser now enforces[\s\S]*?-->\s*/i, '')
  .replace(/<link rel="preload"[^>]*hero-coast[^>]*>\s*/i, '')
  .replace(/<link rel="canonical"[^>]*>\s*/i, '')
  .replace(/<meta property="og:[^>]*>\s*/gi, '')
  .replace(/<meta name="twitter:[^>]*>\s*/gi, '')
  .replace(/<\/title>/i, '</title>\n    <meta name="robots" content="noindex, nofollow" />')

writeFileSync(resolve(out, 'valentina-portfolio.html'), page)

/* ------------------------------------------- 2. body-only artifact page */
const artifact = `<title>Valentina D'Ambrosio</title>
<style>
${css}
</style>
<div id="root"></div>
<script type="module">
${safeJs}
</script>
`
writeFileSync(resolve(out, 'artifact-page.html'), artifact)

const mb = (s) => `${(Buffer.byteLength(s) / 1024 / 1024).toFixed(2)} MB`
console.log(`  standalone/valentina-portfolio.html  ${mb(page)}`)
console.log(`  standalone/artifact-page.html        ${mb(artifact)}`)
console.log('  (not deployed — the site build is `npm run build` into dist/)')
