"use client";

import { LazyMotion, domAnimation } from "motion/react";

/**
 * Wraps the page once so every `m.*` component works.
 * `domAnimation` (animations + exit + hover/focus/tap + whileInView) is ~5 KB of
 * features against ~34 KB for the full `motion.*` bundle. We don't need layout
 * projection or drag, so don't load them.
 *
 * Server components can be passed through as children — this stays a thin shell.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
