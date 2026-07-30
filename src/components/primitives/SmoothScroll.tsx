"use client";

import { useEffect, useRef, useState } from "react";
import {
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { SCROLL_SPRING } from "@/lib/motion";

/* ============================================================================
   SmoothScroll — Lenis-feel scroll smoothing, native scroll untouched.

   The browser keeps owning the scroll (wheel, keys, scrollbar, anchors,
   find-in-page, scroll restoration all stay native); we only translate the
   page content by the gap between the real scroll position and a
   spring-smoothed copy of it. The gap settles to exactly 0 when scrolling
   stops, so at rest the page is untransformed and pixel-identical to flow.

   Because the document genuinely scrolls, everything positioned against it
   keeps working: the sticky nav, `scroll-mt` anchor targets, the Timeline's
   scroll-linked rail, the FAQ accordion growing the page. No spacer div, no
   ResizeObserver, no fixed wrapper.

   Off on coarse pointers (fighting native touch momentum feels broken) and
   under reduced motion (spec rule 8) — both fall back to plain native scroll.
   ========================================================================= */

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const enabled = finePointer && !reduce;
  const enabledRef = useRef(false);

  const { scrollY } = useScroll();
  const smooth = useSpring(scrollY, SCROLL_SPRING);
  /* Both .get()s must run unconditionally: useTransform discovers its
     dependencies by watching what the callback reads on its first call, and a
     short-circuit before the reads would leave it subscribed to nothing. */
  const y = useTransform(() => {
    const gap = scrollY.get() - smooth.get();
    return enabledRef.current ? gap : 0;
  });

  /* On any enable/disable flip, snap the spring to the live position so the
     delta collapses to 0, and nudge subscribers to re-read the gated transform. */
  useEffect(() => {
    enabledRef.current = enabled;
    smooth.jump(scrollY.get());
  }, [enabled, smooth, scrollY]);

  return (
    <m.div style={{ y, willChange: enabled ? "transform" : "auto" }}>
      {children}
    </m.div>
  );
}
