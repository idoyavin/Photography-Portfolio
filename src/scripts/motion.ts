/**
 * Shared motion foundation: Lenis inertial scrolling wired into GSAP's
 * ScrollTrigger. Imported once per page from Base.astro.
 *
 * Contract:
 *  - Reduced motion  -> no Lenis, and callers must gate their own effects
 *    through `prefersReducedMotion()` or gsap.matchMedia.
 *  - Touch devices   -> Lenis leaves native touch scrolling alone
 *    (syncTouch: false); ScrollTrigger works either way.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis: Lenis | null = null;

/**
 * How far into a pinned section's scroll distance to land when jumping to
 * it by anchor. A pinned section's top is where its scrubbed timeline sits
 * at progress 0 — portrait invisible, title still parked below its mask —
 * so landing there shows a blank screen until you scroll. The About
 * timeline finishes its reveal at roughly 76% and then holds, so 85% lands
 * on the finished composition with some hold still in front of it.
 */
const PINNED_ANCHOR_AT = 0.85;

/**
 * Scroll to a section, accounting for the fact that a pinned section's
 * anchor point is the start of its timeline rather than its finished state.
 */
export function scrollToSection(target: HTMLElement) {
  // Only ever reached with Lenis running: the anchor handlers are bound
  // inside initSmoothScroll (which early-returns under reduced motion) and
  // resolveInitialHash is called from inside the same guard.
  const pin = ScrollTrigger.getAll().find((t) => t.pin && t.trigger === target);
  if (pin) {
    lenis!.scrollTo(pin.start + (pin.end - pin.start) * PINNED_ANCHOR_AT);
    return;
  }

  // Measure the header rather than hardcoding its height: it is set in rem,
  // so it changes with the root font size.
  const header = document.querySelector<HTMLElement>('[data-header]');
  lenis!.scrollTo(target, { offset: -(header?.offsetHeight ?? 0) });
}

/**
 * Landing on /#about directly would drop the reader at the same blank
 * progress-0 frame. Call once after the page's ScrollTriggers exist.
 */
export function resolveInitialHash() {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return;
  const target = document.querySelector<HTMLElement>(hash);
  if (target) scrollToSection(target);
}

export function initSmoothScroll(): Lenis | null {
  if (lenis || prefersReducedMotion()) return lenis;

  lenis = new Lenis({
    // Slightly floatier than default — the "expensive glide" both
    // reference sites share. Higher = snappier, lower = more coast.
    lerp: 0.09,
    smoothWheel: true,
    // Native touch scrolling already has physics; don't fight it.
    syncTouch: false,
  });

  // Single clock: GSAP's ticker drives Lenis, Lenis reports into
  // ScrollTrigger, and lag smoothing is off so the two never drift.
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Anchor jumps (e.g. the hero's "Scroll" cue) go through Lenis so
  // they glide instead of teleporting.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (event) => {
      const target = document.querySelector<HTMLElement>(
        a.getAttribute('href') ?? '',
      );
      if (!target) return;
      event.preventDefault();
      scrollToSection(target);
    });
  });

  // Debug/test handle: lets tooling (and the occasional curious dev)
  // pump the ticker manually in environments where rAF is throttled.
  (window as unknown as Record<string, unknown>).__motion = {
    gsap,
    ScrollTrigger,
    lenis,
  };

  return lenis;
}

/**
 * How far a masked word is parked below its resting position, as a
 * percentage of its own height.
 *
 * It must clear the mask's *padded* clip box, not just the line box.
 * .w-mask pads 0.34em past a 0.9em line-height so descenders survive, so
 * the clip edge sits at (0.9 + 0.34) / 0.9 = 138% of the word's height —
 * anything less leaves a sliver of the letter tops on show before the
 * reveal plays. 160% keeps a margin across every size on the site.
 */
export const REVEAL_Y = 160;

/** Split text into per-word spans for staggered reveals. Idempotent. */
export function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === 'true') {
    return Array.from(el.querySelectorAll<HTMLElement>('.w'));
  }
  const words = (el.textContent ?? '').trim().split(/\s+/);
  el.textContent = '';
  const spans = words.map((word) => {
    // Outer span clips, inner span travels — the classic masked reveal.
    const mask = document.createElement('span');
    mask.className = 'w-mask';
    const span = document.createElement('span');
    span.className = 'w';
    span.textContent = word;
    mask.appendChild(span);
    el.appendChild(mask);
    el.appendChild(document.createTextNode(' '));
    return span;
  });
  el.dataset.split = 'true';
  return spans;
}
