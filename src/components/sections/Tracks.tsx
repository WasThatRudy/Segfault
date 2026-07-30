import { Arrow, Stack } from "@/components/icons";
import { Cell, Frame, Section } from "@/components/primitives/Frame";
import { CodeBackground } from "@/components/primitives/CodeBackground";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { LAST_YEAR, TIMELINE, TRACKS, TRACKS_ARE_INDICATIVE } from "@/content/event";

/* ============================================================================
   Tracks — a 3×2 grid of gapless hairline cells (design-language.md §3, block 3).

   Two deviations from the reference, both deliberate:
   · rig.ai renders its `[ 01 ]` indices in the accent colour. Ours are the dim
     index of §3 block 2 (faint), with the informative eyebrow on muted — the
     accent budget spends nothing in this section.
   · the "indicative" note is a plain mono line, not a callout box and not a card
     with a coloured left edge.

   Motion: exactly two ideas — the cells rise in on a 0.05s stagger, and each
   index resolves out of noise via the shared scramble engine. Nothing else.
   ========================================================================= */

/** Vertical dividers, computed per index so the outer rails never double up.
 *  md = 2 columns (left border on odd indices), lg = 3 columns (left border on
 *  everything but 3n). `lg:` wins over `md:` at ≥1024px, which is the whole
 *  trick — index 3 is column 2 at md and column 1 at lg. */
function divider(index: number) {
  const md = index % 2 === 1 ? "md:border-l" : "";
  const lg = index % 3 === 0 ? "lg:border-l-0" : "lg:border-l";
  return `${md} ${lg}`;
}

export function Tracks() {
  /* the date is the timeline's, not this section's — read it, don't restate it */
  const announced = TIMELINE.find((step) => step.id === "tracks");

  return (
    <Section id="tracks">
      <Frame>
        <SectionHeader
          chip="Tracks"
          icon={<Stack />}
          lines={["Six tracks.", "Or bring your own problem."]}
          sub="Anything in compilers, programming languages, program analysis or tooling counts."
        />

        {/* The disclaimer sits ABOVE the grid and states plainly that these are
            not the 2026 tracks — read after the cards it arrives too late to stop
            anyone building against the wrong list. Smaller than the card type so
            it reads as a note on the grid, not a seventh track. */}
        {TRACKS_ARE_INDICATIVE ? (
          <div className="flex flex-col gap-4 border-t border-rule px-7 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-9 sm:py-6">
            <div>
              {/* One step down from `h-card`: this is a note on the grid, so it
                  should not sit at the same size as the track titles under it. */}
              <h3 className="text-[1.0625rem] leading-tight text-bone">
                Sample tracks from last year.
              </h3>
              <p className="copy mt-1.5 max-w-xl text-[0.875rem]">
                {announced
                  ? `The 2026 tracks and the full problem statements land ${announced.date}.`
                  : "The 2026 tracks and the full problem statements are still to come."}
              </p>
            </div>

            {/* href intentionally empty until Shivansh confirms the URL to point at */}
            <a
              href=""
              className="inline-flex shrink-0 items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-bone"
            >
              Visit the {LAST_YEAR.archiveLabel}
              <Arrow size={11} />
            </a>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {TRACKS.map((track, index) => (
            /* the hairlines sit on a STATIC wrapper: if the borders ride the
               animated element, the shared grid visibly unzips during the
               stagger. Grid assembles first, content moves inside it. */
            <div
              key={track.id}
              className={`flex border-t border-rule ${divider(index)}`}
            >
              <Reveal i={index} className="flex w-full">
                <CodeBackground>
                  <Cell className="flex h-full w-full flex-col">
                    {/* Every card reserves the same height for each band, so
                        titles, bodies, examples and tags line up across the whole
                        grid no matter how long any one string is. The values are
                        in `em` — 2 title lines at 1.1, 3 copy lines at 1.55,
                        3 example lines at 1.7 — so they track the type, not a
                        hard-coded pixel guess. */}
                    <h3 className="h-card min-h-[2.2em]">{track.title}</h3>
                    <p className="copy mt-3 min-h-[4.65em] max-w-[34ch]">{track.body}</p>

                    <div className="mt-9 flex flex-1 flex-col">
                      <p className="min-h-[5.1em] font-mono text-[0.75rem] leading-[1.7] tracking-[0.02em] text-muted">
                        {track.examples}
                      </p>

                      {/* mt-auto keeps the chips on the cell's bottom edge if a
                          row ever stretches past the reserved heights. */}
                      <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
                        {track.tags.map((tag) => (
                          <li
                            key={tag}
                            className="border border-rule px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-faint"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Cell>
                </CodeBackground>
              </Reveal>
            </div>
          ))}
        </div>

      </Frame>
    </Section>
  );
}
