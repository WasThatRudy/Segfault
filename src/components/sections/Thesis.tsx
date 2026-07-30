import Image from "next/image";
import { Cell, Frame, Section } from "@/components/primitives/Frame";
import { Chip } from "@/components/primitives/SectionHeader";
import { Reveal, WipeUp } from "@/components/primitives/Reveal";
import { Prompt } from "@/components/icons";
import { THESIS } from "@/content/event";

/* ============================================================================
   Thesis — the statement band, after the reference Shivansh supplied: a two-part
   split with the claim on the left and a framed specimen panel on the right,
   then a thin strip of data cells under both.

   Two deviations from the reference, both deliberate:
   · it puts an accent left-edge rule beside the headline. That treatment is
     reserved for the active timeline step (design-language.md), so the headline
     here is unadorned and the split's own hairline does the dividing.
   · its panel has a soft radius and a glow-ish vignette. Ours is a hairline box
     with radius 0, and the depth comes from the `.field` grid behind the art.

   The specimen is Shivansh's ASCII rendering of the SegFault dragon. The source
   was dark glyphs on white; it is pre-processed to bone-on-transparent so the
   page's own ink shows through and nothing here needs a CSS filter (banned).

   Motion: one idea, the site's signature — the grid is static, the contents rise
   and the headline wipes up inside it.
   ========================================================================= */

export function Thesis() {
  return (
    <Section id="thesis">
      <Frame>
        <div className="grid lg:grid-cols-[1fr_1.05fr]">
          <Cell className="flex flex-col justify-center gap-7 py-16 sm:py-20">
            <Reveal>
              <Chip icon={<Prompt />}>{THESIS.chip}</Chip>
            </Reveal>

            <h2 className="h-section max-w-xl">
              {THESIS.lines.map((line, i) => (
                <WipeUp key={line} delay={0.06 * i}>
                  <span className="block">{line}</span>
                </WipeUp>
              ))}
            </h2>

            <Reveal delay={0.1}>
              <p className="copy max-w-md">{THESIS.body}</p>
            </Reveal>
          </Cell>

          {/* The specimen panel. `.field` supplies the graph paper and its sparse
              accent dots — the same texture as the hero, so this reads as another
              window onto the same surface rather than a new decoration. */}
          <div className="border-t border-rule lg:border-l lg:border-t-0">
            <Cell className="py-16 sm:py-20">
              <Reveal delay={0.08}>
                <div className="field relative aspect-[7/5] w-full overflow-hidden border border-rule bg-ink">
                  {/* scaled past 100% and centred so the drawing is cropped by
                      the frame instead of floating inside it with dead margins */}
                  <Image
                    src="/art/dragon-ascii.png"
                    alt=""
                    aria-hidden
                    width={832}
                    height={572}
                    sizes="(min-width: 1024px) 36rem, 92vw"
                    className="absolute left-1/2 top-1/2 w-[112%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.55]"
                  />

                  {/* L-shaped crop marks, the same registration motif the Online
                      figure uses — it frames the specimen without a second box. */}
                  <svg
                    viewBox="0 0 100 72"
                    fill="none"
                    aria-hidden
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full text-rule"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="0.4"
                      vectorEffect="non-scaling-stroke"
                      d="M4 10V4h8M88 4h8v6M96 62v6h-8M12 68H4v-6"
                    />
                  </svg>
                </div>
              </Reveal>
            </Cell>
          </div>
        </div>

        {/* the data strip: one shared hairline row, gapless cells, no fills */}
        <div className="grid border-t border-rule sm:grid-cols-3">
          {THESIS.stats.map((stat, i) => (
            <Reveal
              key={stat.value}
              i={i}
              className={i > 0 ? "border-t border-rule sm:border-l sm:border-t-0" : undefined}
            >
              <Cell>
                <p className="font-mono text-[1.5rem] leading-none tabular-nums tracking-[-0.03em] text-bone">
                  {stat.value}
                </p>
                <p className="label mt-3">{stat.label}</p>
              </Cell>
            </Reveal>
          ))}
        </div>
      </Frame>
    </Section>
  );
}
