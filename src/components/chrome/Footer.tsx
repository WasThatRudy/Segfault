import Link from "next/link";
import { EVENT, LAST_YEAR, NAV, REGISTRATION } from "@/content/event";
import { Arrow, Wordmark } from "@/components/icons";
import { CursorFieldBand } from "@/components/diagrams/CursorField";
import { Button } from "@/components/primitives/Button";
import { Frame, Section } from "@/components/primitives/Frame";
import { WipeUp } from "@/components/primitives/Reveal";

/* ============================================================================
   Closing CTA + the 2025 proof strip + footer. The `#register` anchor every
   Register button points at lives here, so the CTA lands somewhere that explains
   the actual state of registration rather than a dead link.
   ========================================================================= */

const ctaHeadline =
  REGISTRATION.state === "soon"
    ? [`Registrations open`, `${REGISTRATION.openDate}.`]
    : REGISTRATION.state === "closed"
      ? ["Registrations", "are closed."]
      : ["Registrations", "are open."];

/* Decorative backdrop for the 2025 proof cell: the 24 submissions drawn as a
   6×4 field of cells, the 6 finalists filled, the 3 solo finalists crossed. It
   is the same data the panel states in numbers, so it reads as a diagram rather
   than ornament — flat hairlines only, no glow, no gradient. */
const FINALISTS = new Set([2, 5, 9, 14, 18, 21]);
const SOLO = new Set([5, 14, 21]);

function ArchiveField() {
  const cells = Array.from({ length: LAST_YEAR.submissions }, (_, i) => ({
    i,
    x: (i % 6) * 48,
    y: Math.floor(i / 6) * 48,
  }));

  return (
    <svg
      viewBox="0 0 288 192"
      fill="none"
      aria-hidden
      /* anchored bottom-right and allowed to bleed past the cell, so the field
         reads as a large mark being cropped by the grid rather than a picture */
      className="pointer-events-none absolute -right-10 -bottom-12 h-auto w-[26rem] text-bone opacity-[0.012] sm:w-[34rem]"
    >
      <g stroke="currentColor" strokeWidth="1.25">
        {cells.map(({ i, x, y }) => (
          <g key={i}>
            <rect x={x} y={y} width={40} height={40} fill={FINALISTS.has(i) ? "currentColor" : "none"} />
            {/* solo finalists: an inset square knocked out of the filled cell,
                drawn in the page colour so it works without an extra opacity */}
            {SOLO.has(i) && (
              <rect x={x + 13} y={y + 13} width={14} height={14} fill="var(--color-ink)" stroke="none" />
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}

export function Footer() {
  return (
    <>
      {/* The band between the FAQ and the closing CTA. It used to be empty space
          in the grid; it now holds the core-dump field, cropped by the cell the
          way a page is cropped by a scanner bed. Still functions as the breath
          before the ending — it just carries the motif while it does it. */}
      <Section>
        <Frame>
          <CursorFieldBand className="relative h-32 overflow-hidden sm:h-56" />
        </Frame>
      </Section>

      <Section id="register">
        <Frame>
          <div className="grid lg:grid-cols-[1.15fr_1fr]">
            {/* both columns centre their own content, so neither half has a dead
                corner when the two are different heights */}
            <div className="flex flex-col justify-center border-rule px-7 py-14 sm:px-11 sm:py-20 lg:border-r">
              <h2 className="h-section">
                {ctaHeadline.map((line, i) => (
                  <WipeUp key={line} delay={0.06 * i}>
                    {line}
                  </WipeUp>
                ))}
              </h2>

              <p className="copy mt-6 max-w-md">
                Solo or in a team. There is nothing to build until the problem statements land, so
                get on the list first. {REGISTRATION.lateEntryNote}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button
                  href={REGISTRATION.state === "soon" ? "#timeline" : REGISTRATION.url}
                  variant="primary"
                  tile
                >
                  {REGISTRATION.state === "soon" ? "See the dates" : "Register"}
                </Button>
              </div>
            </div>

            {/* last year, in real numbers — every figure verified from the 2025 site */}
            <div className="relative flex flex-col justify-center overflow-hidden border-t border-rule px-7 py-14 sm:px-11 sm:py-20 lg:border-t-0">
              <ArchiveField />
              <p className="label relative">Last year</p>
              <div className="relative mt-6 grid grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <p className="font-mono text-2xl tabular-nums text-bone">
                    {LAST_YEAR.submissions}
                  </p>
                  <p className="label mt-1">Submissions</p>
                </div>
                <div>
                  <p className="font-mono text-2xl tabular-nums text-bone">
                    {LAST_YEAR.finalists}
                  </p>
                  <p className="label mt-1">Finalists</p>
                </div>
                <div>
                  <p className="font-mono text-2xl tabular-nums text-bone">
                    {LAST_YEAR.soloFinalists}
                  </p>
                  <p className="label mt-1">Solo finalists</p>
                </div>
              </div>

              <div className="relative mt-8 h-px w-full bg-rule" />

              {/* The 2025 site is still live with all 24 submissions, abstracts,
                  repos and demo videos. Reading them is the best calibration
                  there is for what a SegFault project looks like. */}
              <p className="copy relative mt-7 max-w-xs">{LAST_YEAR.archivePrompt}</p>
              <a
                href={LAST_YEAR.archiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative mt-4 inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-bone"
              >
                All {LAST_YEAR.submissions} ideas · {LAST_YEAR.archiveLabel}
                <Arrow size={11} />
              </a>
            </div>
          </div>
        </Frame>
      </Section>

      <footer className="border-t border-rule bg-ink-deep">
        <Frame>
          <div className="grid gap-12 px-7 py-14 sm:gap-10 sm:px-11 sm:py-16 lg:grid-cols-3">
            <div>
              {/* Same SVG wordmark as the nav, so the two ends of the page carry
                  one mark. The year stays mono beside it — the wordmark file has
                  no numerals, and setting the year in the display face would
                  read as part of the logo rather than as data. */}
              <div className="flex items-end gap-2.5">
                <Wordmark className="h-[0.9rem] w-auto text-bone" />
                <span className="font-mono text-[0.8125rem] leading-none tracking-[0.18em] text-muted">
                  {EVENT.year}
                </span>
              </div>
              <p className="copy mt-5 max-w-xs">
                {EVENT.tagline} Organised as part of the {EVENT.host.name} workshop.
              </p>

            </div>

            <div>
              <p className="label-faint">Sections</p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[0.9375rem] text-muted transition-colors hover:text-bone"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="label-faint">Contact</p>
              <ul className="mt-5 flex flex-col gap-2.5">
                <li>
                  <a
                    href={`mailto:${EVENT.contact.email}`}
                    className="text-[0.9375rem] text-muted transition-colors hover:text-bone"
                  >
                    {EVENT.contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={EVENT.contact.x.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.9375rem] text-muted transition-colors hover:text-bone"
                  >
                    {EVENT.contact.x.handle}
                  </a>
                </li>
                <li>
                  <a
                    href={EVENT.contact.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.9375rem] text-muted transition-colors hover:text-bone"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-rule px-7 py-6 font-mono text-[0.6875rem] text-faint sm:flex-row sm:items-center sm:justify-between sm:px-11">
            <p>
              © {EVENT.year} {EVENT.name.toUpperCase()} @ {EVENT.host.short}
            </p>
            <a
              href="https://www.kiksstudios.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-muted"
            >
              Made by Kiks Studios
            </a>
          </div>
        </Frame>
      </footer>
    </>
  );
}
