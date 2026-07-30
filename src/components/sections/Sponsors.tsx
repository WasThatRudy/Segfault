import Image from "next/image";
import { Cell, Frame, Section } from "@/components/primitives/Frame";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Arrow, Partners } from "@/components/icons";
import { EVENT, HOST_NOTE, SPONSORS } from "@/content/event";

/* ============================================================================
   Sponsors. Motion spec: "nothing clever here" — one staggered fade + rise and
   that is the entire choreography. Zero accent.

   Each sponsor gets its logo on a bone plate, in its real brand colours. Neither
   sponsor publishes a reversed/dark variant and FP Launchpad's wordmark is black,
   so recolouring or hand-tracing would either break the mark or invent it — a
   light plate is the honest treatment and reads as deliberate. Provenance and the
   assets still to request are noted in `event.ts`.

   The grid is two columns, so 2, 3 or 4 sponsors all sit correctly and another can
   be added to `SPONSORS` without touching this file.
   ========================================================================= */

const COLS = 2;

/** Strip scheme, www and trailing slash — the visible line on a linked cell. */
function domain(url: string) {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
}

/**
 * Shared hairlines, computed from position rather than hard-coded, so the grid
 * stays correct at any sponsor count. The container owns the top rule; the
 * following host cell closes the bottom.
 */
function dividers(i: number) {
  const parts = ["min-w-0"];
  if (i > 0) {
    /* stacked on mobile, so every cell after the first needs a top rule; on
       md that rule belongs only to cells in the second row onward */
    parts.push(i >= COLS ? "border-t border-rule" : "border-t border-rule md:border-t-0");
  }
  if (i % COLS !== 0) parts.push("md:border-l md:border-rule");
  return parts.join(" ");
}

export function Sponsors() {
  return (
    <Section id="sponsors">
      <Frame>
        <SectionHeader
          chip="Sponsors"
          icon={<Partners />}
          lines={["Who backs SegFault.", "And who runs it."]}
          sub="The organisations backing the 2026 hackathon, plus the IICT workshop it is held as part of."
        />

        <div className="grid border-t border-rule md:grid-cols-2">
          {SPONSORS.map((sponsor, i) => {
            const inner = (
              <Cell className="flex h-full min-h-[15rem] flex-col sm:min-h-[18rem]">
                <p className="label">Sponsor {String(sponsor.rank).padStart(2, "0")}</p>

                {/* the plate: square-cornered like everything else, sized so both
                    a tall Devanagari lockup and a wide wordmark sit comfortably */}
                <div className="mt-7 flex h-24 w-fit max-w-full items-center bg-bone px-5 py-4">
                  <Image
                    src={sponsor.logo.src}
                    alt={`${sponsor.name} logo`}
                    width={sponsor.logo.width}
                    height={sponsor.logo.height}
                    className="h-full w-auto object-contain"
                    sizes="(max-width: 768px) 60vw, 320px"
                  />
                </div>

                <h3 className="mt-7 text-[clamp(1.5rem,2.6vw,2rem)]">{sponsor.name}</h3>

                <p className="copy mt-3 max-w-sm">{sponsor.full}</p>

                <p className="mt-auto pt-9 font-mono text-[0.6875rem] tracking-[0.08em]">
                  {sponsor.url ? (
                    <span className="inline-flex items-center gap-2 text-muted transition-colors duration-200 group-hover:text-bone">
                      {domain(sponsor.url)}
                      <Arrow size={12} />
                    </span>
                  ) : (
                    /* no URL in the content file yet. A data-panel style em-dash
                       states "no value" without promising one — and being purely
                       decorative it is the one legitimate use of text-faint. */
                    <span aria-hidden className="text-faint">
                      &mdash;
                    </span>
                  )}
                </p>
              </Cell>
            );

            return (
              <Reveal key={sponsor.name} i={i} className={dividers(i)}>
                {sponsor.url ? (
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="h-full">{inner}</div>
                )}
              </Reveal>
            );
          })}
        </div>

        <Cell className="border-t border-rule">
          <Reveal i={SPONSORS.length}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-12">
              <div className="max-w-xl">
                <p className="label">Host</p>
                <p className="copy mt-4">{HOST_NOTE}</p>
              </div>

              <a
                href={EVENT.host.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex shrink-0 items-center gap-2 text-[0.9375rem] text-muted transition-colors duration-200 hover:text-bone"
              >
                <span className="underline-offset-4 group-hover:underline">{EVENT.host.name}</span>
                <Arrow size={12} className="shrink-0" />
              </a>
            </div>
          </Reveal>
        </Cell>
      </Frame>
    </Section>
  );
}
