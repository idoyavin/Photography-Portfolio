/**
 * Single place for the details that appear across the site.
 * Edit here rather than hunting through components.
 */
export const SITE = {
  name: 'Ido Yavin',
  role: 'Israel-based photographer',
  tagline: 'Landscape, wildlife and the outdoors.',

  // NOTE: taken from the Claude Code account this project was built under.
  // Change it if you'd rather publish a different address.
  email: 'idoyavin023@gmail.com',

  /**
   * Formspree connects the contact form to your inbox.
   *   1. Sign up free at https://formspree.io
   *   2. Create a form, copy the ID from the endpoint it gives you
   *      (the "xdorwkbv" part of https://formspree.io/f/xdorwkbv)
   *   3. Paste it below.
   * Until this is filled in, the form shows a friendly notice and points
   * visitors at the email address instead of silently failing.
   */
  formspreeId: 'xvkoqqoa',

  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/ido_yavin/' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@ido_yavin' },
  ],
} as const;

/**
 * Photographs that cross-fade behind the homepage hero.
 * Chosen to span all four locations and to hold up with text over them.
 */
export const HERO_SLIDES = [
  { gallery: 'israel', src: 'img-8722', alt: 'Warm evening light across a desert canyon in Israel' },
  { gallery: 'italy', src: 'img-8076', alt: 'A jagged Dolomite peak wreathed in low cloud above golden grass' },
  { gallery: 'austria', src: 'mg-6927', alt: 'Snow-covered Austrian peaks under heavy cloud' },
  { gallery: 'tour-du-mont-blanc', src: 'img-5959', alt: 'Layered mountain ridges fading into haze at sunset on the Tour du Mont Blanc' },
] as const;
