import manifest from './manifest.json';

export type Photo = {
  src: string;
  width: number;
  height: number;
};

export type Gallery = {
  /** URL segment and the folder name under public/media */
  slug: string;
  title: string;
  /** Shown in the small mono metadata line. Omit where the work spans years. */
  year?: string;
  /** One line of context, used on the gallery page and for SEO */
  blurb: string;
  /** Filename stem of the photo used as the category cover */
  cover?: string;
  photos: Photo[];
  comingSoon?: boolean;
};

const photosFor = (slug: string): Photo[] =>
  (manifest as Record<string, Photo[]>)[slug] ?? [];

/**
 * Order here is the order shown on the homepage.
 *
 * To add a category: drop a folder of JPGs into Media/, run `npm run images`,
 * then add an entry below using the lowercase-hyphenated folder name as slug.
 */
export const galleries: Gallery[] = [
  {
    slug: 'israel',
    title: 'Israel',
    blurb:
      'Home ground. Desert, coastline and the landscapes I return to between everywhere else.',
    cover: 'img-8722',
    photos: photosFor('israel'),
  },
  {
    slug: 'austria',
    title: 'Austria',
    year: '2025',
    blurb:
      'Alpine light through the Austrian ranges — long ridgelines, low cloud, and the quiet hours either side of the day.',
    cover: 'mg-6927',
    photos: photosFor('austria'),
  },
  {
    slug: 'tour-du-mont-blanc',
    title: 'Mont Blanc',
    year: '2022',
    blurb:
      'Eleven days walking the Tour du Mont Blanc through France, Italy and Switzerland, carrying everything on foot.',
    cover: 'img-5959',
    photos: photosFor('tour-du-mont-blanc'),
  },
  {
    slug: 'italy',
    title: 'Italy',
    year: '2022',
    blurb:
      'The Dolomites and the country around them — jagged limestone, warm stone towns, and the light between them.',
    cover: 'img-8076',
    photos: photosFor('italy'),
  },
  {
    slug: 'videography',
    title: 'Videography',
    blurb: 'Motion work — currently being cut together.',
    photos: [],
    comingSoon: true,
  },
  {
    slug: 'avionics',
    title: 'Avionics',
    blurb: 'Aviation and aerial photography. Gallery in progress.',
    photos: [],
    comingSoon: true,
  },
];

export const liveGalleries = galleries.filter((g) => !g.comingSoon);

/** Path to a generated WebP derivative. Widths must match scripts/optimize-images.py */
export const photoUrl = (
  slug: string,
  src: string,
  width: 640 | 1280 | 2000,
) => `/media/${slug}/${src}-${width}.webp`;

/** srcset covering all three generated widths */
export const photoSrcSet = (slug: string, src: string) =>
  [640, 1280, 2000]
    .map((w) => `${photoUrl(slug, src, w as 640 | 1280 | 2000)} ${w}w`)
    .join(', ');
