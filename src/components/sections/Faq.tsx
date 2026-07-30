"use client";

import { useId, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { Frame, Section } from "@/components/primitives/Frame";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Chevron, Query } from "@/components/icons";
import { FAQ } from "@/content/event";
import { DUR, EASE_IN_OUT } from "@/lib/motion";

/* ============================================================================
   FAQ — full-width hairline rows, not cards. Spec: design-language.md §3 block 7.
   Mono index · question in display type · chevron. Shared hairlines between rows,
   no fills, no radii, zero accent.

   Two motion ideas only (motion.md): staggered row reveals on entry, and the
   accordion expand — the one place on the site that animates height, with the
   chevron rotation counted as part of it.

   `confirm: true` on some FAQ entries is internal bookkeeping for Shivansh's
   sign-off. It is never rendered, and nothing is derived from it.
   ========================================================================= */

/** motion.md pegs the accordion at 0.35s — sits between DUR.micro and DUR.base. */
const PANEL_DUR = (DUR.micro + DUR.base) / 2;
const REVERSIBLE = `cubic-bezier(${EASE_IN_OUT.join(", ")})`;

/** Stagger cap: every row at 0.05s would push past the 0.4s choreography ceiling
 *  and read as waiting. Rows past the fifth all land together. */
const STAGGER_CAP = 4;

/* The question row and the answer body share the same column start, so the answer
   lines up under the question. No mono row index: with the numbers in, every row
   carried a second piece of type competing with the question itself. */
const ROW_PAD = "px-6 sm:px-9";
const GRID_Q = "grid grid-cols-[1fr_auto] gap-4 sm:gap-5";

export function Faq() {
  const reduce = useReducedMotion();
  const uid = useId();
  /* one row open at a time */
  const [openRow, setOpenRow] = useState<number | null>(null);

  return (
    <Section id="faq">
      <Frame>
        <SectionHeader
          chip="FAQ"
          icon={<Query />}
          lines={["Questions people ask."]}
        />

        <div className="border-t border-rule">
          {FAQ.map((item, i) => {
            const open = openRow === i;
            const qId = `${uid}-q-${i}`;
            const aId = `${uid}-a-${i}`;

            const answer = (
              <div className={`${ROW_PAD} pb-7 sm:pb-8`}>
                <p className="copy max-w-2xl">{item.a}</p>
              </div>
            );

            return (
              <Reveal
                key={item.q}
                i={Math.min(i, STAGGER_CAP)}
                className={i > 0 ? "border-t border-rule" : undefined}
              >
                <h3>
                  <button
                    type="button"
                    id={qId}
                    aria-expanded={open}
                    aria-controls={aId}
                    onClick={() => setOpenRow(open ? null : i)}
                    className={`group ${GRID_Q} ${ROW_PAD} w-full cursor-pointer items-start py-6 text-left sm:py-7`}
                  >
                    <span className="h-card min-w-0 text-bone">{item.q}</span>

                    {/* Tailwind v4 emits `rotate: 180deg` (the individual property),
                        not a `transform`, so the transition list has to name `rotate`
                        or the flip snaps instead of animating. */}
                    <span
                      aria-hidden
                      /* the open row's chevron is one of the small accent moments */
                      className={`mt-1 transition-[rotate,color] group-hover:text-bone sm:mt-1.5 ${
                        open ? "rotate-180 text-accent-text" : "rotate-0 text-faint"
                      }`}
                      style={{
                        transitionDuration: `${DUR.micro}s`,
                        transitionTimingFunction: REVERSIBLE,
                      }}
                    >
                      <Chevron size={14} />
                    </span>
                  </button>
                </h3>

                {reduce ? (
                  /* Keep the panel mounted either way: `aria-controls` must always
                     resolve to a real element, and the collapsed row still needs to
                     exist for the same DOM shape as the animated branch. */
                  <div id={aId} role="region" aria-labelledby={qId} hidden={!open}>
                    {answer}
                  </div>
                ) : (
                  <m.div
                    id={aId}
                    role="region"
                    aria-labelledby={qId}
                    aria-hidden={!open}
                    className="overflow-hidden"
                    initial={false}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: PANEL_DUR, ease: EASE_IN_OUT }}
                  >
                    {answer}
                  </m.div>
                )}
              </Reveal>
            );
          })}
        </div>
      </Frame>
    </Section>
  );
}
