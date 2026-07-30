"use client";

import Link from "next/link";
import { useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { EVENT, NAV } from "@/content/event";
import { Button } from "@/components/primitives/Button";
import { Wordmark } from "@/components/icons";
import { DUR, EASE_IN_OUT } from "@/lib/motion";

/* ============================================================================
   Two-zone nav — wordmark left, Register + menu right. The container rails are
   drawn, so the bar reads as the top cell of the same grid the whole page is
   built from. No blur, no translucency, no shrink-on-scroll.

   The section links live in the collapsible menu at every width, not just below
   lg: one bar with two ends stays readable, and the CTA is the only thing that
   competes with the wordmark.
   ========================================================================= */

/* The menu is reversible, so it takes EASE_IN_OUT and the accordion's timing —
   same curve and duration as the FAQ rows, which is the site's one other
   open/close. The burger morphs into a cross on the same 0.2s. */
const MENU_DUR = (DUR.micro + DUR.base) / 2;
const REVERSIBLE = `cubic-bezier(${EASE_IN_OUT.join(", ")})`;

/* Absolute bars rather than a flex column: morphing to a cross needs each bar to
   rotate about a fixed point, which a flex track can't give it. 3 bars, 4.5px
   apart, so the outer two travel 4.5px to meet in the middle. */
const BAR = "absolute left-0 h-px w-full bg-current";

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rule bg-ink/95">
      <div className="mx-auto w-full max-w-[var(--container-frame)] border-x border-rule">
        <div className="flex h-16 items-center justify-between px-4 sm:px-7">
          <Link
            href="/"
            className="flex items-center"
            aria-label={`${EVENT.name} ${EVENT.year} home`}
          >
            {/* height-driven: the 822×118 wordmark keeps its aspect from `w-auto`.
                At 320px the 0.9rem size is 100px wide, which put the wordmark's
                right edge exactly on the CTA's left edge — the extra step down
                below 360px buys the gap back. */}
            {/* pixel-glitch on hover: the base mark stays put for legibility;
                two clipped ghost copies snap between slices (globals.css). */}
            <span className="wordmark-glitch">
              <Wordmark className="h-3 w-auto text-bone min-[360px]:h-[0.9rem] sm:h-4" />
              <span aria-hidden className="wordmark-glitch__ghost wordmark-glitch__ghost--a">
                <Wordmark className="h-3 w-auto text-bone min-[360px]:h-[0.9rem] sm:h-4" />
              </span>
              <span aria-hidden className="wordmark-glitch__ghost wordmark-glitch__ghost--b">
                <Wordmark className="h-3 w-auto text-bone min-[360px]:h-[0.9rem] sm:h-4" />
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Button href="#register" variant="ghost" tile>
              Register
            </Button>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-sections"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center border border-rule text-muted transition-colors hover:text-bone"
            >
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              <span aria-hidden className="relative block h-[9px] w-4">
                <span
                  className={`${BAR} top-0 transition-[translate,rotate]`}
                  style={{
                    transitionDuration: `${DUR.micro}s`,
                    transitionTimingFunction: REVERSIBLE,
                    translate: menuOpen ? "0 4.5px" : "0 0",
                    rotate: menuOpen ? "45deg" : "0deg",
                  }}
                />
                <span
                  className={`${BAR} top-[4.5px] transition-opacity`}
                  style={{
                    transitionDuration: `${DUR.micro}s`,
                    transitionTimingFunction: REVERSIBLE,
                    opacity: menuOpen ? 0 : 1,
                  }}
                />
                <span
                  className={`${BAR} top-[9px] transition-[translate,rotate]`}
                  style={{
                    transitionDuration: `${DUR.micro}s`,
                    transitionTimingFunction: REVERSIBLE,
                    translate: menuOpen ? "0 -4.5px" : "0 0",
                    rotate: menuOpen ? "-45deg" : "0deg",
                  }}
                />
              </span>
            </button>
          </div>
        </div>

        {/* The panel stays mounted so `aria-controls` always resolves and the
            close direction animates too. `inert` while collapsed keeps the links
            out of the tab order and off assistive tech, which a plain height:0
            would not. The top hairline lives on the inner element so it wipes in
            with the panel instead of sitting under the bar when closed.
            `id`/`aria-controls` pair with the button above at every width now. */}
        <m.nav
          id="mobile-sections"
          aria-label="Sections"
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          className="overflow-hidden"
          initial={false}
          animate={
            reduce
              ? { height: menuOpen ? "auto" : 0 }
              : { height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }
          }
          transition={reduce ? { duration: 0 } : { duration: MENU_DUR, ease: EASE_IN_OUT }}
        >
          <ul className="flex flex-col border-t border-rule px-5 py-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-sm text-muted transition-colors hover:text-bone"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </m.nav>
      </div>
    </header>
  );
}
