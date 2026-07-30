import { Section, Frame, Cell } from "@/components/primitives/Frame";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { Globe } from "@/components/icons";
import { EVENT, REGISTRATION } from "@/content/event";

/* ============================================================================
   The format. 2026 is an online hackathon and the 2025 site buried that, so it
   gets its own band directly under the hero: one diagram, four flat statements.

   Asymmetric split — 1/3 figure, 2/3 quadrant — divided by shared hairlines.
   Zero accent in this section; the whole thing is bone, muted, faint and rule.

   Motion: the hairlines are STATIC and only the contents rise inside them
   (motion.md — "the grid assembles, then content appears inside it"). So the
   borders live on plain wrappers and `Reveal` sits inside them; animating a
   bordered grid item would slide the shared hairlines out of alignment for the
   length of the stagger.
   ========================================================================= */

/* -------------------------------------------------------------- the figure
   Node-flow graph, hand-authored. A dashed boundary marked YOUR MACHINE with
   hairline connectors out to the four remote stages, and one line dropping to
   the single in-person node. L-shaped crop marks frame it. Decorative only.

   `stroke`/`fill: currentColor` is declared on the same element that carries the
   colour class, never on an ancestor — engines differ on whether an inherited
   `currentColor` re-resolves against a descendant's own `color`. */
function Topology({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 260" fill="none" aria-hidden className={className}>
      <g strokeWidth={1} strokeLinecap="square">
        {/* crop marks */}
        <path
          className="text-rule"
          stroke="currentColor"
          d="M6 20V6h14M220 6h14v14M234 240v14h-14M20 254H6v-14"
        />

        <g className="text-faint" stroke="currentColor">
          {/* the boundary — everything inside it is yours */}
          <rect x="72" y="76" width="96" height="68" strokeDasharray="3 4" />
          {/* wireframe globe */}
          <circle cx="120" cy="110" r="21" />
          <ellipse cx="120" cy="110" rx="8.5" ry="21" />
          <path d="M101.5 103h37M101.5 117h37" />
          {/* connectors to the remote stages */}
          <path d="M43 44v26h53v6M197 44v26h-53v6M43 176v-26h53v-6M197 176v-26h-53v-6" />
          {/* the one physical hop */}
          <path d="M120 144v72" />
          {/* remote stage nodes */}
          <rect x="14" y="28" width="58" height="16" />
          <rect x="168" y="28" width="58" height="16" />
          <rect x="14" y="176" width="58" height="16" />
          <rect x="168" y="176" width="58" height="16" />
        </g>

        {/* flow pulses — each path is redrawn in its travel direction (in through
            the top, out through the bottom) and normalised with pathLength so one
            dasharray/keyframe serves all five. Hidden under reduced motion. */}
        <g className="text-muted" stroke="currentColor">
          <path className="topology-flow" pathLength={100} d="M43 44v26h53v6" />
          <path className="topology-flow" pathLength={100} style={{ animationDelay: "-2.6s" }} d="M197 44v26h-53v6" />
          <path className="topology-flow" pathLength={100} style={{ animationDelay: "-1.3s" }} d="M96 144v6H43v26" />
          <path className="topology-flow" pathLength={100} style={{ animationDelay: "-3.4s" }} d="M144 144v6h53v26" />
          <path className="topology-flow" pathLength={100} style={{ animationDelay: "-0.7s" }} d="M120 144v72" />
        </g>

        <rect className="text-accent" fill="currentColor" x="74" y="216" width="92" height="18" />
      </g>

      <g className="font-mono" fontSize={7.5} letterSpacing={0.5}>
        <g className="text-faint" fill="currentColor" textAnchor="middle">
          <text x="43" y="39.5">REGISTER</text>
          <text x="197" y="39.5">TRACKS</text>
          <text x="43" y="187.5">SUBMIT</text>
          <text x="197" y="187.5">REVIEW</text>
        </g>

        {/* Centred over the boundary, with an ink patch behind it so the label
            breaks the connector run instead of colliding with it. */}
        <rect className="text-ink" fill="currentColor" x="84" y="64.5" width="72" height="9" />
        <text
          className="text-muted"
          fill="currentColor"
          x="120"
          y="71.5"
          textAnchor="middle"
        >
          YOUR MACHINE
        </text>

        <g className="text-bone" fill="currentColor">
          <text x="91" y="228.5">FINALE · IISc</text>
        </g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------ the quadrant
   Typed rather than `as const`: mapping over a union of readonly tuples makes
   `.map` resolve against four incompatible generic signatures. */
type QuadCell = {
  eyebrow: string;
  title: string;
  lines: readonly string[];
};

const CELLS: readonly QuadCell[] = [
  {
    eyebrow: "Anywhere",
    title: "No travel to take part.",
    lines: [
      "Register, build and submit from your own machine.",
      "Any city, any timezone. Nothing to book.",
    ],
  },
  {
    eyebrow: "Entry",
    title: "Late teams still get in.",
    lines: [
      `Sign-ups close ${REGISTRATION.closeDate}, the day hacking begins.`,
      `${REGISTRATION.lateEntryNote} You just build with less runway.`,
    ],
  },
  {
    eyebrow: "Shortlists",
    title: "Announced as they land.",
    lines: [
      "Teams are shortlisted as submissions come in, all through the five weeks.",
      "Submit early, hear back early.",
    ],
  },
  {
    eyebrow: "The finale",
    title: "One trip, at the end.",
    lines: [
      `Finalists present in person at ${EVENT.finale.venueShort} on ${EVENT.finale.dates}.`,
      "Their IICT workshop attendance is covered. Nothing before it needs a flight.",

    ],
  },
];

/* shared hairlines: the quadrant's dividers are borders on the cells themselves,
   so a 2x2 reads as four cells cut apart by one line each, never as four cards */
function quadEdge(i: number) {
  return [
    "border-rule",
    i > 0 ? "border-t" : "",
    i === 1 ? "sm:border-t-0" : "",
    i % 2 === 1 ? "sm:border-l" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function Online() {
  return (
    <Section id="online">
      <Frame>
        <SectionHeader
          chip="The format"
          icon={<Globe />}
          lines={["Everything is online.", "Except the finale."]}
          sub={EVENT.modeNote}
        />

        <div className="grid grid-cols-1 border-t border-rule lg:grid-cols-3">
          <div className="border-b border-rule lg:border-b-0 lg:border-r">
            <Reveal className="h-full">
              <Cell className="flex h-full flex-col justify-center gap-8">
                <Topology className="mx-auto w-full max-w-[19rem]" />
                <div className="flex items-baseline justify-between gap-4 border-t border-rule pt-4">
                  <span className="label">{EVENT.mode}</span>
                  {/* essential dates — muted (6.20:1), never `faint` (2.6:1) */}
                  <span className="label tabular-nums">{EVENT.window}</span>
                </div>
              </Cell>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:col-span-2">
            {CELLS.map((cell, i) => (
              <div key={cell.eyebrow} className={quadEdge(i)}>
                <Reveal i={i + 1} className="h-full">
                  <Cell className="flex h-full flex-col">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="label">{cell.eyebrow}</span>
                      <span className="label-faint tabular-nums">
                        {String(i + 1).padStart(3, "0")}
                      </span>
                    </div>

                    <h3 className="h-card mt-7">{cell.title}</h3>

                    <div className="mt-4 space-y-2">
                      {cell.lines.map((line) => (
                        <p key={line} className="copy">
                          {line}
                        </p>
                      ))}
                    </div>
                  </Cell>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </Frame>
    </Section>
  );
}
