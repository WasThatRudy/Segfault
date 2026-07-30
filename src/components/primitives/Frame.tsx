import type { ReactNode } from "react";

/* ============================================================================
   The visible hairline grid. Spec: design-language.md §3

   `Section` is a full-bleed band with a top hairline. `Frame` is the content
   column whose left and right rails are DRAWN, so every section reads as a cell
   in one continuous grid running down the page. Cells inside share their borders
   — no gaps, no radii.
   ========================================================================= */

export function Section({
  id,
  children,
  className = "",
  hairline = true,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  hairline?: boolean;
}) {
  return (
    <section
      id={id}
      /* scroll-mt clears the 64px sticky nav. The nav is one row at every width
         now — the links are in a collapsed menu — so one value covers it. */
      className={`relative w-full scroll-mt-16 ${
        hairline ? "border-t border-rule" : ""
      } ${className}`}
    >
      {children}
    </section>
  );
}

export function Frame({
  children,
  className = "",
  rails = true,
}: {
  children: ReactNode;
  className?: string;
  rails?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[var(--container-frame)] ${
        rails ? "border-x border-rule" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** A gapless bordered cell. Padding lives inside; borders are shared. */
export function Cell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`p-7 sm:p-9 ${className}`}>{children}</div>;
}
