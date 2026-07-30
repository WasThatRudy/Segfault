import type { ReactNode } from "react";
import { Reveal, WipeUp } from "./Reveal";

/* ============================================================================
   Every section opens the same way: a small bordered chip with a hand-drawn mark
   and a mono label, then a display headline of one or two lines ending in a
   period, then an optional muted subhead on a narrow measure.

   The chip label is MUTED, not accent — rig.ai puts its accent on every chip;
   our accent budget doesn't allow it. Spec: design-language.md §1.
   ========================================================================= */

export function Chip({ icon, children }: { icon?: ReactNode; children: string }) {
  return (
    <span className="inline-flex items-center gap-2 border border-rule px-3 py-1.5 text-muted">
      {/* The chip mark is one of the few accent moments — a hairline glyph, so it
          takes the lighter tint (#8a5cff, 4.52:1) rather than #4e03ff, which at
          2.49:1 would be all but invisible at 13px. The label stays muted. */}
      {icon ? <span className="text-accent-text">{icon}</span> : null}
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em]">{children}</span>
    </span>
  );
}

export function SectionHeader({
  chip,
  icon,
  lines,
  sub,
  align = "center",
}: {
  chip: string;
  icon?: ReactNode;
  /** one or two lines — the break is deliberate, not automatic */
  lines: string[];
  sub?: string;
  align?: "center" | "left";
}) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col ${alignment} gap-7 px-6 py-16 sm:py-24`}>
      <Reveal>
        <Chip icon={icon}>{chip}</Chip>
      </Reveal>

      <h2 className="h-section max-w-4xl">
        {lines.map((line, i) => (
          <WipeUp key={line} delay={0.06 * i}>
            <span className="block">{line}</span>
          </WipeUp>
        ))}
      </h2>

      {sub ? (
        <Reveal delay={0.1}>
          <p className="copy max-w-md">{sub}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
