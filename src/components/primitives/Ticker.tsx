"use client";

import { useReducedMotion } from "motion/react";

/* ============================================================================
   The full-bleed band that sits at the hero boundary. Mono uppercase phrases,
   · separated, scrolling slowly and pausing on hover (a marquee that won't stop
   is on the banned list). Duplicated once and translated -50% for a seamless loop.
   ========================================================================= */

export function Ticker({ items }: { items: readonly string[] }) {
  const reduce = useReducedMotion();
  const row = [...items, ...items];

  return (
    <div className="group relative w-full overflow-hidden border-y border-rule bg-ink-panel py-3">
      <div
        className={`flex w-max ${reduce ? "" : "animate-[ticker_46s_linear_infinite] group-hover:[animation-play-state:paused]"}`}
      >
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex shrink-0 items-center">
            <span className="label whitespace-nowrap">{item}</span>
            <span className="px-6 text-faint" aria-hidden>
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
