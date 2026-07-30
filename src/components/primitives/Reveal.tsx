"use client";

import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { DUR, EASE, RISE, VIEWPORT } from "@/lib/motion";

/* ============================================================================
   The two entry primitives every section uses. Nothing hard-codes a duration.
   Spec: motion.md — once:true always, so nothing replays on scroll-up.
   ========================================================================= */

type RevealProps = {
  children: ReactNode;
  /** stagger index — multiplied by 0.05s */
  i?: number;
  delay?: number;
  y?: number;
  className?: string;
};

export function Reveal({ children, i = 0, delay = 0, y = RISE.cell, className }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.base, ease: EASE, delay: delay + i * 0.05 }}
    >
      {children}
    </m.div>
  );
}

/**
 * Headlines wipe upward out of nothing instead of fading in — reads as type being
 * emitted. Use for h1/h2 only; it's the one "creative" move per section header.
 */
/* renders a span so it stays valid inside <h1>/<h2> (phrasing content only) */
export function WipeUp({ children, delay = 0, className = "" }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={`block ${className}`}>{children}</span>;

  return (
    <m.span
      className={`block ${className}`}
      initial={{ clipPath: "inset(100% 0 0 0)", y: RISE.head }}
      whileInView={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.reveal, ease: EASE, delay }}
    >
      {children}
    </m.span>
  );
}

/**
 * The site's signature entry: a hairline that draws itself. Sections assemble
 * their grid first, then content appears inside it.
 */
export function DrawLine({
  dir = "h",
  delay = 0,
  className = "",
}: {
  dir?: "h" | "v";
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const base =
    dir === "h" ? "h-px w-full origin-left bg-rule" : "w-px h-full origin-top bg-rule";

  if (reduce) return <div className={`${base} ${className}`} />;

  return (
    <m.div
      className={`${base} ${className}`}
      initial={dir === "h" ? { scaleX: 0 } : { scaleY: 0 }}
      whileInView={dir === "h" ? { scaleX: 1 } : { scaleY: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE, delay }}
    />
  );
}
