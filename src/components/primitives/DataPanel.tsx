"use client";

import { m, useReducedMotion } from "motion/react";
import { DUR, EASE, VIEWPORT } from "@/lib/motion";

/* ============================================================================
   The terminal data panel: bordered box, mono throughout, a small label header,
   a hairline rule, then rows of `label ████░░░░ value`. Bars fill from the left.
   Positive values are the only place the green shows up.
   Spec: design-language.md §3, block 6.
   ========================================================================= */

export type Row = {
  label: string;
  value: string;
  /** 0–1, how much of the track the bar fills */
  fill: number;
  tone?: "ok" | "muted" | "accent";
};

const toneText: Record<NonNullable<Row["tone"]>, string> = {
  ok: "text-ok",
  muted: "text-muted",
  accent: "text-bone",
};

export function DataPanel({
  title,
  rows,
  note,
  className = "",
}: {
  title: string;
  rows: Row[];
  note?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div className={`border border-rule bg-ink-panel p-6 sm:p-8 ${className}`}>
      <p className="label-faint">{title}</p>
      <div className="mt-5 h-px w-full bg-rule" />

      <dl className="mt-6 flex flex-col gap-4">
        {rows.map((row, i) => (
          <div key={row.label} className="flex items-baseline gap-4">
            <dt className="w-28 shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted sm:w-32">
              {row.label}
            </dt>

            <div className="relative h-2 min-w-0 flex-1 overflow-hidden bg-rule-soft">
              <m.div
                className={`h-full origin-left ${
                  row.tone === "ok" ? "bg-ok/70" : row.tone === "accent" ? "bg-accent" : "bg-faint"
                }`}
                style={{ width: `${Math.round(Math.min(1, Math.max(0, row.fill)) * 100)}%` }}
                initial={reduce ? undefined : { scaleX: 0 }}
                whileInView={reduce ? undefined : { scaleX: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: DUR.base, ease: EASE, delay: 0.06 * i }}
              />
            </div>

            <dd
              className={`shrink-0 font-mono text-xs tabular-nums ${toneText[row.tone ?? "muted"]}`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {note ? <p className="mt-7 font-mono text-[0.6875rem] leading-relaxed text-faint">{note}</p> : null}
    </div>
  );
}
