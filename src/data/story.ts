/**
 * Homepage scroll-story content: one chapter per gallery, plus the drifting
 * photo cluster and statement line that follows it.
 *
 * Drift picks deliberately avoid each gallery's cover (that frame already
 * carries the chapter above), so the homepage shows as much of the work as
 * possible. Six per cluster, each at its own parallax speed.
 */

export type DriftPhoto = {
  /** Filename stem inside the gallery's media folder */
  src: string;
  caption: string;
  /** yPercent the frame drifts over the cluster's scroll. More negative = faster. */
  speed: number;
};

export type ChapterStory = {
  /** The line that reveals between the cluster photos */
  statement: string;
  drift: DriftPhoto[];
};

export const STORY: Record<string, ChapterStory> = {
  austria: {
    statement: 'Shot through windscreens, low cloud and half-frozen fingers.',
    drift: [
      { src: 'mg-6698', caption: 'Roadside, first snow', speed: -6 },
      { src: 'mg-6757', caption: 'Behind the wheel', speed: -24 },
      { src: 'mg-6552', caption: 'Cloud in the pines', speed: -14 },
      { src: 'mg-6769', caption: 'High pass, passing classic', speed: -6 },
      { src: 'mg-6940', caption: 'Descending through trees', speed: -24 },
      { src: 'mg-6772', caption: 'The long way down', speed: -14 },
    ],
  },
  'tour-du-mont-blanc': {
    statement: 'Everything we needed, carried on our backs.',
    drift: [
      { src: 'img-5856', caption: 'Boots off, halfway up', speed: -14 },
      { src: 'img-6265', caption: 'On the trail', speed: -6 },
      { src: 'img-5961', caption: 'Valley in late light', speed: -24 },
      { src: 'img-5948', caption: 'Refuge at altitude', speed: -6 },
      { src: 'img-5796', caption: 'Cattle on the pasture', speed: -14 },
      { src: 'img-6057', caption: 'Ridge above the cloud', speed: -24 },
    ],
  },
  italy: {
    statement: 'Limestone above, turquoise below.',
    drift: [
      { src: 'img-7595', caption: 'Lakeside houses', speed: -24 },
      { src: 'img-8137', caption: 'Village under the Dolomites', speed: -6 },
      { src: 'img-8100', caption: 'Peaks in cloud', speed: -14 },
      { src: 'img-7651', caption: 'Turquoise water', speed: -24 },
      { src: 'img-8019', caption: 'Alpine lake', speed: -6 },
      { src: 'img-7587', caption: 'Castle walls', speed: -14 },
    ],
  },
  israel: {
    statement: 'Home ground. Always.',
    drift: [
      { src: 'img-5264', caption: 'Waterfall in the north', speed: -6 },
      { src: 'mg-7786', caption: 'Seafront by bicycle', speed: -14 },
      { src: 'img-5675', caption: 'One tree, dry grass', speed: -24 },
      { src: 'img-5629', caption: 'Basalt pool', speed: -6 },
      { src: 'mg-7926', caption: 'Old Jaffa across the water', speed: -24 },
      { src: 'img-5185', caption: 'Through a broken window', speed: -14 },
    ],
  },
};
