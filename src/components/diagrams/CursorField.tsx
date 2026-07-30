"use client";

import { useState, type PointerEvent } from "react";

/* ============================================================================
   CursorField — a printed core dump with a cursor sitting on it, after the
   reference photo Shivansh supplied (IMG_0563): dense columns of tiny glyphs,
   one solid pointer, nothing else. No glow, no gradient, no blur.

   The field is generated from a seeded LCG rather than Math.random, so the
   server render and the client render are byte-identical and React never warns
   about a hydration mismatch. Same reason the glyph set is fixed.
   ========================================================================= */

const GLYPHS = "01·;{}[]()=><*&|+-_/\\%$#fnirssacfgtypeemitoptllvmpassloop";

/** Numerical Recipes' LCG constants. Deterministic, and enough spread for text. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const ROWS = 58;
const ROW_H = 8;
const CHARS = 150;

/* Each row is one <text>: 58 nodes instead of 8700, and the browser tracks the
   monospace advance for us. The line lengths vary slightly so the right edge
   frays the way the photographed page does. */
function field() {
  const rand = seeded(0x5eaf);

  return Array.from({ length: ROWS }, (_, row) => {
    const len = CHARS - Math.floor(rand() * 14);
    let line = "";

    for (let i = 0; i < len; i += 1) {
      /* an occasional space is what breaks the field into the uneven vertical
         columns that make the reference read as text rather than as noise */
      line += rand() > 0.11 ? GLYPHS[Math.floor(rand() * GLYPHS.length)] : " ";
    }

    return { y: 10 + row * ROW_H, line, dim: rand() > 0.72 };
  });
}

const LINES = field();

export function CursorField({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 480" fill="none" aria-hidden className={className}>
      <g className="font-mono" fill="currentColor" fontSize="6.5" letterSpacing="0.42">
        {LINES.map(({ y, line, dim }) => (
          /* two tiers of opacity: the photographed page has passages that took
             more ink than others, and a flat field looks printed by a machine */
          <text key={y} x="6" y={y} opacity={dim ? 0.34 : 0.55}>
            {line}
          </text>
        ))}
      </g>

      {/* The pointer. Solid, hard-edged, sitting ON the field — the one shape in
          the drawing that is not type. Slight asymmetry in the tail keeps it
          from reading as a stock triangle. */}
      <path
        d="M196 188l88 46-38 8-14 40-36-94z"
        fill="var(--color-ink)"
        stroke="var(--color-ink)"
        strokeWidth="10"
        strokeLinejoin="miter"
      />
      <path d="M196 188l88 46-38 8-14 40-36-94z" fill="currentColor" />
    </svg>
  );
}

/* The footer band wrapper. A second copy of the field sits on top in the
   accent text tint, masked to a radius around the pointer (CSS vars, so
   tracking never re-renders React) — hover reads as the dump re-inking under
   the cursor. */
export function CursorFieldBand({ className = "" }: { className?: string }) {
  const [active, setActive] = useState(false);

  function move(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--field-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--field-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <div
      className={`cursor-field ${active ? "cursor-field--active" : ""} ${className}`}
      onPointerEnter={(event) => {
        move(event);
        setActive(true);
      }}
      onPointerLeave={() => setActive(false)}
      onPointerMove={move}
    >
      <CursorField className="pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2 text-bone opacity-[0.16]" />
      {/* the masked layer must be exactly band-sized: --field-x/y are measured
          from the band, and the mask resolves against this element's own box */}
      <div aria-hidden className="cursor-field__tint absolute inset-0">
        <CursorField className="pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2 text-accent-text" />
      </div>
    </div>
  );
}
