/* ============================================================================
   Motion tokens. Spec: .claude/reference/motion.md
   One source of truth — if a component hard-codes a duration, that's a bug.
   Budget: max 2 motion ideas per section · once:true always · transform,
   opacity, clip-path and stroke-dashoffset only · no springs on entries.
   ========================================================================= */

/** expo-out — same curve family as sketch491's ExpoEaseOut, so the loader and
 *  the page feel like one system. */
export const EASE = [0.16, 1, 0.3, 1] as const;
/** only for reversible things: accordions, hover */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DUR = {
  micro: 0.2,
  base: 0.5,
  reveal: 0.7,
  draw: 0.9,
} as const;

export const RISE = { cell: 10, head: 16 } as const;
export const STAGGER = { cell: 0.05, line: 0.03 } as const;

/** Page-level scroll smoothing (SmoothScroll primitive). Overdamped on purpose —
 *  ζ ≈ 1.7, so the page settles with zero overshoot ("no springs" in the spec
 *  bans overshoot on entries; a critically-tracked lag has none). τ ≈ 180ms,
 *  the same weight as Lenis's default lerp. */
export const SCROLL_SPRING = {
  stiffness: 140,
  damping: 28,
  mass: 0.5,
  restDelta: 0.5,
  restSpeed: 10,
} as const;

/** Nothing re-animates on scroll back. This single rule does most of the work
 *  of not feeling over-animated. */
export const VIEWPORT = { once: true, margin: "-12% 0px" } as const;

export const fadeRise = (y: number = RISE.cell, delay = 0) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: VIEWPORT,
  transition: { duration: DUR.base, ease: EASE, delay },
});

/** Headlines wipe upward rather than fading — type being emitted, not appearing. */
export const wipeUp = (delay = 0) => ({
  initial: { clipPath: "inset(100% 0 0 0)", y: RISE.head },
  whileInView: { clipPath: "inset(0% 0 0 0)", y: 0 },
  viewport: VIEWPORT,
  transition: { duration: DUR.reveal, ease: EASE, delay },
});

/** The site's signature entry: the hairline grid draws itself, then content
 *  appears inside it. */
export const drawX = (delay = 0) => ({
  initial: { scaleX: 0 },
  whileInView: { scaleX: 1 },
  viewport: VIEWPORT,
  transition: { duration: 0.6, ease: EASE, delay },
});

export const drawY = (delay = 0) => ({
  initial: { scaleY: 0 },
  whileInView: { scaleY: 1 },
  viewport: VIEWPORT,
  transition: { duration: 0.6, ease: EASE, delay },
});
