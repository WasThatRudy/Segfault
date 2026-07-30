"use client";

/* ============================================================================
   The character-scramble engine — the site's interaction signature.
   Technique from ikeryou's sketch491 (https://github.com/ikeryou/sketch491),
   reimplemented from scratch: no GSAP, no three.js, no dependencies.

   One engine, two jobs: the page loader (two-wave, see components/chrome/Loader)
   and every button / CTA label (single resolve wave, below).
   Spec: .claude/reference/loader-sketch491.md
   ========================================================================= */

import { useCallback, useEffect, useRef, useState } from "react";

/** Same character set as the original — no symbol soup. */
export const NOISE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const randChar = () => NOISE.charAt(Math.floor(Math.random() * NOISE.length));

/** expo-out, matching EASE in lib/motion.ts */
export const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type Options = {
  /** ms for the resolve wave to cross the string */
  duration?: number;
};

/**
 * Resolves `text` left-to-right out of noise. Character count never changes, so
 * nothing reflows mid-animation.
 *
 * Returns the string to render this frame plus `run` / `reset` controls.
 * The caller is responsible for accessibility — render the returned value in an
 * `aria-hidden` span and keep the real text in a visually hidden one.
 */
export function useScramble(text: string, { duration = 380 }: Options = {}) {
  const [display, setDisplay] = useState(text);
  const raf = useRef<number | null>(null);
  const start = useRef(0);

  const stop = useCallback(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
  }, []);

  const run = useCallback(() => {
    if (prefersReducedMotion()) {
      setDisplay(text);
      return;
    }
    stop();
    start.current = performance.now();

    const tick = (now: number) => {
      const p = Math.min(1, (now - start.current) / duration);
      const resolved = expoOut(p) * text.length;

      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        /* whitespace and the resolved head are never scrambled */
        if (ch === " " || i < resolved) out += ch;
        else out += randChar();
      }
      setDisplay(out);

      if (p < 1) raf.current = requestAnimationFrame(tick);
      else {
        setDisplay(text);
        raf.current = null;
      }
    };

    raf.current = requestAnimationFrame(tick);
  }, [text, duration, stop]);

  const reset = useCallback(() => {
    stop();
    setDisplay(text);
  }, [stop, text]);

  /* If the label itself changes, snap to it. Adjusted during render rather than
     in an effect — the effect version cascades an extra render.
     https://react.dev/learn/you-might-not-need-an-effect */
  const [lastText, setLastText] = useState(text);
  if (lastText !== text) {
    setLastText(text);
    setDisplay(text);
  }

  useEffect(() => stop, [stop]);

  return { display, run, reset };
}
