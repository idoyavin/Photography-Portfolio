import type { APIRoute } from 'astro';

/**
 * Generated rather than kept as a static file in public/, so the sitemap
 * URL is derived from `site` in astro.config.mjs. A hardcoded copy would
 * silently point at the old domain the next time that changes.
 */
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`,
    { headers: { 'Content-Type': 'text/plain' } },
  );
