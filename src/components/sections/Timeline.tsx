"use client";

import { useRef } from "react";
import { m, useReducedMotion, useScroll } from "motion/react";
import { Section, Frame } from "@/components/primitives/Frame";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { Calendar } from "@/components/icons";
import { EVENT, TIMELINE } from "@/content/event";

/* ============================================================================
   Timeline — the event drawn as a pipeline running down a single rail.

   Two things the 2025 site could not say, and this section has to:
     1. shortlisting is ROLLING — that entry's own `date` field reads "Rolling",
        so the date column prints it verbatim like any other; nothing is restated
     2. registration OVERLAPS hacking — two entries share Aug 15, and the second
        is marked "same day"

   Motion budget (exactly two ideas):
     1. scroll-linked progress rail — the one place the spec allows useScroll
     2. staggered row reveals via <Reveal>
   Accent budget item #2: that progress rail is the ONLY #4e03ff in the section.
   Everything else is bone / muted / faint. Reduced motion → a static hairline
   and no transforms at all.
   ========================================================================= */

/** Local readonly view of TIMELINE — the source tuple is a union of literal
 *  shapes, so `soft` / `terminal` are only reachable through a widened type. */
type Entry = {
  readonly id: string;
  readonly date: string;
  readonly title: string;
  readonly body: string;
  readonly kind: "point" | "range" | "rolling";
  readonly soft?: boolean;
  readonly terminal?: boolean;
};

const ENTRIES: readonly Entry[] = TIMELINE;

/* The rail sits in the gutter between the date column and the content column.
   These two offsets are the same number expressed twice — keep them in step:
   mobile  = pl-14 (56px) rows, rail at 28px
   sm      = pl-9 (36px) + 7.5rem date col + half of gap-x-10 → 176px = 11rem */
const RAIL_X = "left-7 sm:left-[11rem]";

export function Timeline() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 80%", "end 60%"],
  });

  return (
    <Section id="timeline">
      <Frame>
        <SectionHeader
          chip="Timeline"
          icon={<Calendar />}
          lines={["Two months, end to end.", "Here is how it runs."]}
          sub={`${EVENT.window}. ${EVENT.mode} until the finale in ${EVENT.finale.city}.`}
        />

        <div ref={listRef} className="relative">
          {/* the pipeline rail — progress follows scroll, or holds still */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-y-0 z-10 w-[2px] ${RAIL_X}`}
          >
            {reduce ? (
              <div className="h-full w-full bg-rule" />
            ) : (
              <>
                <div className="absolute inset-0 bg-rule-soft" />
                <m.div
                  className="absolute inset-0 origin-top bg-accent"
                  style={{ scaleY: scrollYProgress }}
                />
              </>
            )}
          </div>

          {ENTRIES.map((entry, i) => {
            const rolling = entry.kind === "rolling";
            const sameDay = i > 0 && ENTRIES[i - 1].date === entry.date;

            const notes: string[] = [];
            if (rolling) notes.push("continuous");
            if (sameDay) notes.push("same day");

            return (
              <Reveal
                key={entry.id}
                i={i}
                className={`border-t border-rule ${entry.terminal ? "bg-ink-panel" : ""}`}
              >
                <div className="grid grid-cols-1 gap-y-3 py-8 pl-14 pr-7 sm:grid-cols-[7.5rem_1fr] sm:gap-x-10 sm:gap-y-0 sm:py-10 sm:pl-9 sm:pr-9">
                  <div className="flex flex-col gap-2 sm:pt-1">
                    <span
                      className={`font-mono text-[0.8125rem] tabular-nums tracking-[0.04em] ${
                        rolling ? "text-muted" : "text-bone"
                      }`}
                    >
                      {entry.date}
                    </span>

                    {/* these carry real information ("same day" appears nowhere
                        else), so they stay on muted — 6.20:1. text-faint is
                        2.63:1 on ink: indices and decoration only. */}
                    {notes.map((note) => (
                      <span key={note} className="label">
                        {note}
                      </span>
                    ))}
                  </div>

                  <div>
                    <h3 className="h-card">{entry.title}</h3>
                    <p className="copy mt-3 max-w-[46ch]">{entry.body}</p>

                    {entry.terminal ? (
                      <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-rule pt-4">
                        <span className="label-faint">Venue</span>
                        <span className="font-mono text-xs leading-relaxed text-muted">
                          {EVENT.finale.venue}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Frame>
    </Section>
  );
}
