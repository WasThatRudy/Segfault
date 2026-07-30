"use client";

import Link from "next/link";
import { useScramble } from "@/lib/scramble";
import { DumpTile } from "@/components/icons";

/* ============================================================================
   The notched button. Shape comes from a clipped corner, not a border radius.
   Label resolves out of noise on hover/focus — the site's interaction signature.

   Two things the naive version got wrong:
   · a `clip-path` cuts a `border` along the diagonal, leaving the notched corner
     visibly open. So the outline is drawn as two clipped layers — outer in the
     rule colour, inner inset 1px carrying the fill.
   · the fill must be opaque. A transparent ghost button sitting on the hero's
     graph-paper field let a grid line run straight through the label.

   Accent budget item #1: `primary` is the ONE place #4e03ff is a large fill.
   Bone on it measures 6.15:1, so it passes AA. `ghost` stays bone on ink.
   ========================================================================= */

type Variant = "primary" | "ghost";

type Props = {
  children: string;
  href: string;
  variant?: Variant;
  /** the dither tile primora tucks inside its nav CTA */
  tile?: boolean;
  className?: string;
  disabled?: boolean;
};

export function Button({
  children,
  href,
  variant = "ghost",
  tile = false,
  className = "",
  disabled = false,
}: Props) {
  const { display, run, reset } = useScramble(children, { duration: 340 });
  const primary = variant === "primary";

  const shell = `notch group relative inline-flex items-center gap-3 px-5 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-200 ${
    primary ? "bg-accent text-bone hover:bg-accent-hi" : "bg-rule text-bone hover:bg-muted"
  } ${disabled ? "pointer-events-none opacity-40" : ""} ${className}`;

  const inner = (
    <>
      {/* the inset fill layer — this is what makes the 1px edge, notch included */}
      {primary ? null : (
        <span aria-hidden className="notch absolute inset-px bg-ink transition-colors duration-200" />
      )}
      <span aria-hidden className="relative tabular-nums">
        {display}
      </span>
      <span className="sr-only">{children}</span>
      {tile ? (
        <DumpTile size={16} className={`relative ${primary ? "text-bone/75" : "text-accent-text"}`} />
      ) : null}
    </>
  );

  if (disabled) {
    return (
      <span className={shell} aria-disabled>
        {inner}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={shell}
      onPointerEnter={run}
      onPointerLeave={reset}
      onFocus={run}
      onBlur={reset}
    >
      {inner}
    </Link>
  );
}
