import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The offline copy: one HTML file you can double-click, email or carry on a
// USB stick, with every image and font folded in as a data URI.
//
// It is NOT the build that goes online. Inlining makes a single ~5 MB file
// that must arrive in full before anything appears on screen — fine for a
// local file, badly wrong over a network. The site build is vite.config.js.
//
// It lands in standalone/, outside dist/, so it is never deployed: a second
// copy of the whole site sitting on the live host would compete with the real
// pages in search for nothing.
//
// Note the reels are not part of it. They live in public/videos/ and are far
// too large to inline, so the project cards in this copy have nothing to play.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'standalone',
    emptyOutDir: true,
    assetsInlineLimit: 100_000_000, // inline every image and font
    cssCodeSplit: false,
    chunkSizeWarningLimit: 8000,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        assetFileNames: 'assets/app.[ext]'
      }
    }
  }
})
