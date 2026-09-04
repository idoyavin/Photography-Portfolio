// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Photographs are pre-optimized into public/media by scripts/optimize-images.py,
// so Astro's own image pipeline is not needed here — it would re-process ~500MB
// of originals on every build for no gain.
export default defineConfig({
  // Used for canonical links, Open Graph image URLs and the sitemap.
  // MUST be the real deployed origin or social previews break.
  site: 'https://idoyavin.netlify.app',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});
