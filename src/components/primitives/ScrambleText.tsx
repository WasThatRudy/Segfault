"use client";

import { useEffect, useRef, useState } from "react";
import { useScramble } from "@/lib/scramble";

/* ============================================================================
   Standalone scramble label — for card indices, stat values, ticker words.
   Buttons drive `useScramble` directly instead (they own their own hover).

   Accessibility: the animating text is aria-hidden and the real string is kept
   in a visually hidden span, so a screen reader never announces "X8fq2z".
   ========================================================================= */

type Props = {
  text: string;
  className?: string;
  /** 'view' fires once when scrolled into view · 'hover' on pointer/focus */
  trigger?: "view" | "hover";
  duration?: number;
  delay?: number;
  /** purely ornamental strings (a `[ 01 ]` card index) — hidden from assistive
   *  tech entirely instead of being announced before the content they decorate */
  decorative?: boolean;
};

export function ScrambleText({
  text,
  className = "",
  trigger = "view",
  duration = 380,
  delay = 0,
  decorative = false,
}: Props) {
  const { display, run } = useScramble(text, { duration });
  const ref = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (trigger !== "view" || done) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setDone(true);
        io.disconnect();
        timer.current = window.setTimeout(run, delay);
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      /* the observer callback's timeout outlives the observer — clear it here or
         it fires into an unmounted component */
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [trigger, run, delay, done]);

  const handlers =
    trigger === "hover" ? { onPointerEnter: run, onFocus: run } : undefined;

  if (decorative) {
    return (
      <span ref={ref} className={className} aria-hidden {...handlers}>
        {display}
      </span>
    );
  }

  return (
    <span ref={ref} className={className} {...handlers}>
      <span aria-hidden>{display}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
