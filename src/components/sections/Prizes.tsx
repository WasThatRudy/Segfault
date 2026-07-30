"use client";

import { m, useReducedMotion } from "motion/react";
import { Cell, Frame, Section } from "@/components/primitives/Frame";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { Award } from "@/components/icons";
import { PRIZES } from "@/content/event";
import { DUR, EASE, VIEWPORT } from "@/lib/motion";

/* ============================================================================
   Prizes — cash is stated directly. The custom SVG is decorative support, not
   a duplicate presentation of the payout data.
   ========================================================================== */

function PrizeIllustration() {
  const reduce = useReducedMotion();

  /* The cup draws itself in stroke order when the row scrolls into view —
     stroke-dashoffset is inside the motion budget's permitted property set.
     Under reduced motion it renders complete. */
  const draw = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: VIEWPORT,
          transition: {
            pathLength: { duration: DUR.draw, ease: EASE, delay },
            opacity: { duration: DUR.micro, delay },
          },
        };

  return (
    /* The viewBox is cropped to the drawing: no outer rect (the cell's own
       hairline already frames this) and no rule across the top, so there is no
       empty band above the podium to pad the section out. */
    <svg viewBox="0 70 480 240" fill="none" aria-hidden className="w-full">
      <path className="text-rule" d="M30 271.5h420" stroke="currentColor" />
      <g className="text-rule" stroke="currentColor" strokeWidth="1">
        <path d="M75 82v153M405 82v153M107 106h266M107 138h266" strokeDasharray="3 5" />
        <path d="M150 235V182h72M258 235V154h72M150 182l36-36M330 154l-36-36" />
        <circle cx="150" cy="182" r="4" />
        <circle cx="330" cy="154" r="4" />
      </g>

      {/* Three architectural podium blocks, resolved into one winner mark. */}
      <rect className="text-muted" x="84" y="208" width="96" height="63" fill="currentColor" />
      <rect className="text-accent" x="192" y="152" width="96" height="119" fill="currentColor" />
      <rect className="text-rule-soft" x="300" y="226" width="96" height="45" fill="currentColor" />

      <g className="text-bone" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
        <m.path {...draw(0.15)} d="M214 176h52v25a26 26 0 01-52 0v-25z" />
        <m.path {...draw(0.35)} d="M214 181h-12v10a13 13 0 0012 13M266 181h12v10a13 13 0 01-12 13M240 227v18M224 245h32" />
      </g>
      {/* the badge: a small dragon-head silhouette engraved on the cup, filled
          so it stays legible at this size; the eye is knocked out in the accent
          colour, the same trick as the footer's solo-finalist cells. It fades
          in after the cup finishes drawing. */}
      <m.g
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0 },
              whileInView: { opacity: 1 },
              viewport: VIEWPORT,
              transition: { duration: DUR.base, ease: EASE, delay: 0.85 },
            })}
      >
        {/* dragon-face badge — Shivansh's supplied SVG (dragon-face-svgrepo-com,
            Twemoji), geometry untouched. Recoloured from the emoji greens to a
            single bone fill; the eye, teeth, nostril and the mouth/whisker
            detail lines take the accent so they knock out of the face instead
            of disappearing into it. Scaled from its 36×36 box into the cup. */}
        <g transform="translate(226.6 185) scale(0.752)">
          <path
            className="text-bone"
            fill="currentColor"
            d="M35.125 13.344c0-1 .771-2.327.771-2.635c0-.656-1.553-.421-1.626-1.046c-.209-1.794 1.887-3.318-1.745-3.312c-1.352.002-.274-1.768-.274-2.725c0-.957-2.596-.145-3.552-.145c-.957 0-.957-2.87-1.913-2.87c-2.87 0-3.827 2.87-4.783 2.87c-.957 0-1.744-3.621-2.87-2.87c-2.87 1.913-3.826 7.653-3.826 7.653s4.783-3.826 10.522-2.87c5.345.891 4.79 10.821 5.641 16.888L24.609 36h3.359c.344-1.5 1.939-.529 2.375-1.688c.381-1.016-.67-1.966-.094-2.969s.978-.755 2.094-1.375c1.184-.657 0-2.199 0-3.156c0-.956 2.312-1.574 2.312-2.531c0-.63-1.068-1.292-.812-2.356c.257-1.064 1.586-1.186 1.749-2.184c.138-.847-.921-1.455-.796-2.393s1.174-1.378 1.174-2.097c.002-.718-.845-1.001-.845-1.907z"
          />
          <path
            className="text-bone"
            fill="currentColor"
            d="M34.438 13.458c0-4.038-2.87-9.085-9.566-9.085c-6.695 0-17.265 10.024-20.088 10.096C2.87 12.521 0 14.523 0 16.486c0 3.028 5.373 4.61 5.646 4.899c1.088 1.149 3.92 8.083 8.704 1.945c.803-1.03 1.302-.422 3.483.542C25.069 27.729 16 36 16 36h9.566c4.782-4.783 8.871-13.844 8.871-21.997l-.021.008c.007-.185.022-.369.022-.553z"
          />
          <path
            fill="var(--color-accent)"
            d="M23.915 12.09a1.913 1.913 0 1 1-3.826 0a1.913 1.913 0 0 1 3.826 0z"
          />
          <path
            fill="var(--color-accent)"
            d="M4.783 17.351c0 .793-.643.479-1.435.479s-1.435.315-1.435-.479a1.436 1.436 0 0 1 2.87 0z"
          />
          <path
            fill="var(--color-accent)"
            d="M18.176 18.782c0 1.058-.643.956-1.436.956c-.792 0-1.434.101-1.434-.956c0-1.056.642-3.826 1.434-3.826c.793 0 1.436 2.771 1.436 3.826zm-3.827.956c0 1.058-.643.957-1.435.957s-1.435.101-1.435-.957c0-1.056.643-3.826 1.435-3.826c.792.001 1.435 2.771 1.435 3.826z"
          />
          <path
            fill="var(--color-accent)"
            d="M18.04 18.795c-5.076.726-10.192 2.007-12.394 2.59c.275.29.661.95 1.162 1.674c2.415-.624 6.975-1.724 11.503-2.369a.957.957 0 1 0-.271-1.895zm.549-6.186a.999.999 0 0 1-.708-1.705c.129-.129 3.222-3.163 8.36-3.163a1 1 0 1 1 0 2c-4.281 0-6.923 2.554-6.949 2.58a.997.997 0 0 1-.703.288z"
          />
        </g>
      </m.g>

      <g className="font-mono text-faint" fill="currentColor" fontSize="10" letterSpacing="1.8" textAnchor="middle">
        <text x="132" y="294">BUILD</text>
        <text x="240" y="294">SHIP</text>
        <text x="348" y="294">WIN</text>
      </g>
    </svg>
  );
}

/* Shared hairlines for the perk strip: 1 column, then 2, then 4. Each cell owns
   the rule on its own top/left edge, so the dividers are single shared lines. */
const PERK_EDGES = [
  "",
  "border-t border-rule sm:border-t-0 sm:border-l",
  "border-t border-rule lg:border-t-0 lg:border-l",
  "border-t border-rule sm:border-l lg:border-t-0",
] as const;

/* Same idea for the podium row: 1 column, then 3. */
const PLACE_EDGES = [
  "",
  "border-t border-rule sm:border-l sm:border-t-0",
  "border-t border-rule sm:border-l sm:border-t-0",
] as const;

export function Prizes() {
  return (
    <Section id="prizes">
      <Frame>
        <SectionHeader
          chip="Prizes"
          icon={<Award />}
          lines={["Cash for the top three teams."]}
          sub={`${PRIZES.total} in total, plus certificates and mentorship for everyone who takes part.`}
        />

        {/* Three full-width bands on shared hairlines: the pool, the podium, the
            perks. Every band is the same flat row of cells, so the section reads
            as one block. The illustration sits inside the pool row rather than in
            a cell of its own, which is what made the old layout feel like four
            separate panels with dead space between them. */}
        <div className="border-t border-rule">
          {/* Both halves are vertically centred against each other, so the row has
              no dead corner: the figure no longer floats at the top while the
              number sits at the bottom. */}
          <Cell className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
            <div>
              <p className="label">Total prize pool</p>
              <p className="mt-4 font-mono text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-[-0.05em] text-bone">
                {PRIZES.total}
              </p>
            </div>

            {/* no max-width below lg: a fixed width is wider than the cell's
                content box on a 375px viewport and pushes past the right rail */}
            <div className="w-full lg:max-w-[30rem] lg:shrink-0">
              <PrizeIllustration />
            </div>
          </Cell>

          {/* the podium: same gapless cell rhythm as every other row here */}
          <div className="grid border-t border-rule sm:grid-cols-3">
            {PRIZES.places.map((place, index) => (
              <Reveal key={place.place} i={index} className={PLACE_EDGES[index]}>
                <Cell className={index === 0 ? "bg-accent" : ""}>
                  <p className={`label ${index === 0 ? "text-bone" : ""}`}>{place.note}</p>
                  <p className="mt-4 font-mono text-[1.75rem] leading-none tabular-nums tracking-[-0.04em] text-bone">
                    {place.amount}
                  </p>
                </Cell>
              </Reveal>
            ))}
          </div>

          <div className="grid border-t border-rule sm:grid-cols-2 lg:grid-cols-4">
            {PRIZES.perks.map((perk, i) => (
              <Reveal key={perk.label} i={i} className={PERK_EDGES[i]}>
                <Cell>
                  <p className="label">{perk.label}</p>
                  <p className="copy mt-4">{perk.body}</p>
                </Cell>
              </Reveal>
            ))}
          </div>
        </div>
      </Frame>
    </Section>
  );
}
