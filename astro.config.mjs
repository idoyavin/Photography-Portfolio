// @ts-check
import { defineConfig } from 'astro/config';

// Photographs are pre-optimized into public/media by scripts/optimize-images.py,
// so Astro's own image pipeline is not needed here — it would re-process ~500MB
// of originals on every build for no gain.
export default defineConfig({
  site: 'https://idoyavin.com',
  build: {
    inlineStylesheets: 'auto',
  },
});
