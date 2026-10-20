/* Writes the contact address into the legal pages at run time.

   Address harvesters crawl static HTML and pull out anything shaped like
   name@domain with a single regular expression. They do not, for the most
   part, run JavaScript. So the address is never written into the markup:
   the page ships the two halves in separate attributes, and this joins them.

   The markup still carries a readable fallback — "name [at] domain" — so the
   address is stated plainly for a human, a screen reader, or a browser with
   scripting turned off. That matters here: these are the pages where the law
   requires the controller to be contactable.

   This is a reduction, not a cure. A harvester that executes JavaScript still
   sees it, and the address is public on your social profiles anyway. What it
   removes is the cheap automated sweep, which is most of the volume. */
for (const el of document.querySelectorAll('[data-user][data-domain]')) {
  const address = el.dataset.user + String.fromCharCode(64) + el.dataset.domain
  const link = document.createElement('a')
  link.href = 'mailto:' + address
  link.textContent = address
  el.replaceWith(link)
}
