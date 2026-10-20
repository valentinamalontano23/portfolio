import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The build that goes online. Images and fonts stay separate files, which is
// what makes the page appear quickly: the browser can show the first screen
// while the rest arrives, fetch below-the-fold photos only when they are
// scrolled to, and keep all of it in cache on the next visit.
//
// There is a second config, vite.standalone.config.js, for the one-file
// offline copy. That one inlines everything on purpose.
/* The Content-Security-Policy in index.html guards the published site. The dev
   server is a different situation: Vite injects its own inline script and opens
   a websocket for hot reload, both of which a policy written for production
   forbids — and the failure mode is a blank page with nothing to go on.
   So the meta tag is dropped while developing and kept in the build, which is
   the only copy anyone else ever loads. */
const cspInBuildOnly = () => ({
  name: 'csp-in-build-only',
  apply: 'serve',
  transformIndexHtml: (html) =>
    html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>\s*/i, '')
})

export default defineConfig({
  // Relative asset paths, not root-absolute. With the default '/', dist/index.html
  // asks for /assets/app.js, which under file:// resolves to the drive root and
  // renders a blank page — and it also prevents hosting the site in a subfolder.
  // './' works in both cases and costs nothing when served from the root.
  base: './',
  plugins: [react(), cspInBuildOnly()],
  build: {
    // Vite's default. Only a handful of tiny SVG icons end up inline; every
    // photo becomes its own cacheable file with a content hash in the name.
    assetsInlineLimit: 4096,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name]-[hash].js',
        // app.css keeps its stable name; photos and fonts get a hash so a new
        // version is never served from a stale cache.
        assetFileNames: (info) =>
          info.name && info.name.endsWith('.css')
            ? 'assets/app.css'
            : 'assets/[name]-[hash][extname]'
      }
    }
  }
})
