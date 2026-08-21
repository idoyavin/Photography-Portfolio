# Ido Yavin — photography portfolio

Dark, cinematic gallery site built with [Astro](https://astro.build). Static
output, no server required.

## Running it

```bash
npm run dev
```

Then open http://localhost:4321.

```bash
npm run build     # static site into dist/
npm run preview   # serve the built site locally
```

## Two things to finish

1. **Contact form** — sign up free at [formspree.io](https://formspree.io),
   create a form, and paste its ID into `formspreeId` in
   [`src/data/site.ts`](src/data/site.ts). Until then the form is disabled and
   the page points visitors at the email address instead.
2. **Email address** — `src/data/site.ts` currently uses
   `idoyavin023@gmail.com`. Change it if you'd rather publish a different one.

## Photographs

Originals live in `Media/<Category>/` and are never modified. The build serves
web derivatives generated from them:

```bash
npm run images          # only processes what's missing
npm run images -- --force   # rebuild everything
```

This writes three WebP widths per photo (640 / 1280 / 2000) into
`public/media/<slug>/`, plus `src/data/manifest.json` with each frame's real
dimensions. It also strips EXIF — travel photos often carry GPS coordinates
that shouldn't be published alongside them.

The 48 originals total ~500 MB; the generated set is ~48 MB.

## Adding a gallery

1. Drop a folder of JPGs into `Media/` — the folder name becomes the category.
2. Run `npm run images`.
3. Add an entry to `galleries` in [`src/data/galleries.ts`](src/data/galleries.ts),
   using the lowercase-hyphenated folder name as `slug`, and pick a `cover`
   (the filename stem, e.g. `img-8076`).

`Videography` and `Avionics` are already listed as "coming soon" placeholders —
they show on the homepage but have no gallery page. Add photos and remove
`comingSoon: true` to activate them.

### Alt text

Photos currently get generated alt text (`"Italy — photograph 3 of 10"`). If you
want real descriptions, add an `alt` field per photo in `manifest.json` and read
it in `GalleryGrid.astro`.

## Structure

```
Media/                    originals (untouched)
public/media/             generated WebP
scripts/optimize-images.py
src/
  data/site.ts            email, socials, Formspree ID, hero slides
  data/galleries.ts       category definitions
  data/story.ts           homepage chapters: captions, statements, drift picks
  data/manifest.json      generated
  styles/global.css       design tokens
  scripts/motion.ts       GSAP + ScrollTrigger + Lenis foundation
  components/             Header, Footer, Hero, Chapter, DriftCluster,
                          GalleryGrid, Lightbox
  pages/                  index, about, contact, 404, work/[slug]
```

## Deploying

`npm run build` produces `dist/`, which is plain static files. Drag that folder
onto [Netlify Drop](https://app.netlify.com/drop), or connect the repo to
Netlify/Vercel/Cloudflare Pages with build command `npm run build` and publish
directory `dist`.

Set `site` in [`astro.config.mjs`](astro.config.mjs) to the real domain before
deploying — it's used for canonical URLs and social preview images.

## The scroll story

The homepage is a Porsche-Motorsport-style scroll narrative built with
GSAP ScrollTrigger + Lenis inertial scrolling:

- Each trip is a **pinned full-screen chapter**: the cover settles from a slow
  push-in, the title lifts word-by-word out of masks, then year, line and CTA
  follow in one quiet cascade — all scrubbed by scroll. Deliberately no
  odometer, no NN/NN counter, no counting totals: a photograph, a place, a
  year, one line.
- Between chapters, a **drift cluster** scatters **six** frames across a tall
  field, each drifting at its own parallax speed, with the statement line
  reading through the middle. The photographs sit bare with a small shadow
  behind them and the caption below — no mount, no border, no tilt, no hover
  movement. The only things that change are a plain fade as each comes into
  view and a slightly deeper shadow under the pointer. Clicking any frame
  opens it in the lightbox, so all 24 homepage frames are browsable.
- The cluster figure's transform belongs solely to the parallax tween; the
  arrival is a CSS opacity transition, so nothing competes for it.
- The **gallery grid** photos (on `/work/*`) keep their cursor-tracked tilt —
  that's separate from the homepage clusters and unchanged.
- Gallery pages give each frame its own slight parallax speed; the tilt
  hover and lightbox are unchanged.
- After the four trips the scroll continues into **About** (pinned split:
  portrait one side, bio cascading in the other) and **Contact** (a row of
  icon buttons). Both also exist as standalone pages — on the homepage the nav
  scrolls to the section, elsewhere it navigates to the page, so no link is
  ever dead.
- Jumping to a **pinned** section by anchor goes through `scrollToSection()`
  in [`src/scripts/motion.ts`](src/scripts/motion.ts), which lands 85% into
  the pin rather than at its top. A pinned section's top is where its scrubbed
  timeline sits at progress 0 — portrait invisible, title still parked below
  its mask — so a plain anchor jump drops you on a blank screen. The same
  helper runs once on load for people arriving at `/#about` directly.
- Chapter/cluster content lives in [`src/data/story.ts`](src/data/story.ts) —
  captions, statements, drift picks and speeds are all editable there.
- Everything gates on `prefers-reduced-motion`: reduced means no Lenis, no
  pinning, no rolls — chapters render as plain full-screen sections with the
  year already in place (the odometer's resting CSS state is the final digit).

## Design notes

- **Cool near-white ground (`#F7F7F6`), not cream.** Warm paper tones push the
  page toward stationery; a true neutral keeps snow reading as snow. The
  photographs are the only dark mass and the only colour on the page.
- **One typeface family.** Inter Tight for display, Inter for text. Hierarchy
  comes from size, weight and tracking — never from swapping in another voice.
  Large display sizes run tight (`-0.045em`); there is no monospace anywhere.
- **Two inks, two contexts.** `--fg` on the page, `--on-photo` for anything
  sitting over a full-bleed image (hero, chapters, grid badges). The header
  flips between them as it leaves the hero.
- Measured contrast on `--bg`: body 5.8:1, small labels 4.8:1, headings 16.6:1.
- **Nothing is cropped.** The collection is not one shape — Italy is entirely
  4:5, Israel mostly 2:3, Austria runs 9:16 through 4:5, and there's one 16:9
  panorama. Galleries use justified rows: each frame keeps its own proportions
  and the row is what gets squared off, the way a print wall is hung. Every
  photo renders within 0.13% of its native ratio (sub-pixel rounding).
- Aspect ratios come from `manifest.json`, so a photo of any shape drops in
  without special-casing. Covers read their ratio from the chosen file too.
- Images need `height: auto` in CSS wherever `aspect-ratio` is used — the HTML
  `height` attribute is a presentational hint, and `aspect-ratio` is ignored
  unless height is auto.
- `.w-mask` (the word-reveal clip) pads past the em box and pulls the padding
  back out with a negative margin. Display type runs at `line-height: 0.9`
  while the font's em box is ~1.21em, so a plain `overflow: hidden` shears
  descenders — the *y* of "Italy" loses its tail.
- That padding and `REVEAL_Y` in [`src/scripts/motion.ts`](src/scripts/motion.ts)
  are **coupled**: the parked word has to clear the *padded* clip box, not the
  line box. At 0.34em padding on a 0.9em line-height the clip edge sits at
  138% of the word's height, so `REVEAL_Y` is 160. Raise the padding without
  raising `REVEAL_Y` and a sliver of letter-tops shows before the reveal plays.
- `.w-mask` also pads **horizontally** (0.14em). Display type runs at
  `letter-spacing: -0.045em`, and the negative tracking is applied after the
  *final* glyph too, so the inline box ends up narrower than the painted ink
  and `overflow: hidden` shaves the last letter — "Italy" was losing 5.9px of
  its y off the right edge.
- The lightbox sets **explicit grid tracks** on both the dialog and the stage.
  With implicit `auto` rows the image's `max-height: 100%` resolves against an
  indefinite height and is silently ignored, rendering a 4088×5450 frame
  1621px tall in a 900px window.
- Drift-card `--tx`/`--ty` are **unitless numbers**, not angles: they feed both
  a `rotate()` and a `box-shadow` offset, and `calc()` cannot multiply a `deg`
  by a `px`. Each consumer applies its own unit.
- Reduced motion is respected throughout: the hero stops cross-fading, the
  Ken Burns drift stops, and scroll reveals render in their final state.
