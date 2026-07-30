/* ============================================================================
   Hand-authored SVGs. No lucide, no react-icons, no heroicons, no icon fonts —
   Shivansh's rule. Everything strokes with `currentColor` so it inherits.

   Chalet has no ✓ ✕ →, so these carry those marks too.
   ========================================================================= */

type IconProps = { className?: string; size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 16 16",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 1.25,
  strokeLinecap: "square" as const,
  "aria-hidden": true,
});

export function Cross({ className, size = 12 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  );
}

export function Check({ className, size = 12 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M2.5 8.5l3.5 3.5L13.5 4" />
    </svg>
  );
}

export function Arrow({ className, size = 12 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}

export function Chevron({ className, size = 14 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3.5 6l4.5 4.5L12.5 6" />
    </svg>
  );
}

/** Brackets — carried over from the 2025 site's `{ } [ ] (` decoration. */
export function Brackets({ className, size = 14 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 2.5H3.5v11H6M10 2.5h2.5v11H10" />
    </svg>
  );
}

/** Terminal prompt — used on the "how it runs" chip. */
export function Prompt({ className, size = 12 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M2.5 4l3 4-3 4M8 12h5.5" />
    </svg>
  );
}

/** Globe with a severed link — the "fully online" mark. */
export function Globe({ className, size = 13 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="8" cy="8" r="5.75" />
      <path d="M2.4 6.2h11.2M2.4 9.8h11.2M8 2.25c-1.8 1.6-2.7 3.5-2.7 5.75S6.2 12.15 8 13.75c1.8-1.6 2.7-3.5 2.7-5.75S9.8 3.85 8 2.25z" />
    </svg>
  );
}

/** Layered stack — the tracks chip. */
export function Stack({ className, size = 13 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M8 2L14 5 8 8 2 5l6-3z" />
      <path d="M2 8.5L8 11.5l6-3M2 11.5L8 14.5l6-3" />
    </svg>
  );
}

/** Question mark — FAQ chip. */
export function Query({ className, size = 13 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5.5 5.25A2.5 2.5 0 018 3.5c1.4 0 2.5.95 2.5 2.25 0 1.5-2.2 1.85-2.4 3.4" />
      <path d="M8 12.4v.1" strokeWidth={1.6} />
    </svg>
  );
}

/** Trophy, drawn as a stack of blocks rather than a cup — prizes chip. */
export function Award({ className, size = 13 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4.5 2.5h7v4a3.5 3.5 0 01-7 0v-4z" />
      <path d="M4.5 3.75H2.5v1.5a2 2 0 002 2M11.5 3.75h2v1.5a2 2 0 01-2 2M6 13.5h4M8 10v3.5" />
    </svg>
  );
}

/** Calendar / timeline chip. */
export function Calendar({ className, size = 13 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="2.5" y="3.5" width="11" height="10" />
      <path d="M2.5 6.5h11M5.5 2v2.5M10.5 2v2.5" />
    </svg>
  );
}

/** Handshake reduced to two interlocking brackets — sponsors chip. */
export function Partners({ className, size = 13 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M2.5 6.5L5 4h3l2 2M13.5 6.5L11 4" />
      <path d="M2.5 6.5v3L6 13l2-2 2 2 3.5-3.5v-3" />
    </svg>
  );
}

/**
 * The CTA swatch — a dither/core-dump tile that sits inside the primary button,
 * the way primora.xyz puts a textured square in its nav CTA. Deterministic
 * pattern (no Math.random) so server and client markup match.
 */
export function DumpTile({ className, size = 16 }: { className?: string; size?: number }) {
  const n = 6;
  const cells: React.ReactElement[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      /* An even dither, not pseudo-random noise. A scattered fill at this size
         reads as a rendering artefact; a regular checker reads as a texture
         swatch, which is the point. */
      if ((x + y) % 2 !== 0) continue;
      cells.push(
        <rect key={`${x}-${y}`} x={x * 2} y={y * 2} width={2} height={2} fill="currentColor" />,
      );
    }
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      aria-hidden
      className={className}
      shapeRendering="crispEdges"
    >
      {cells}
    </svg>
  );
}

/** Wordmark: SEGFAULT's mark is an out-of-bounds memory cell — the one row of
 *  blocks where a single block sits outside the run. */
export function Mark({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden className={className} shapeRendering="crispEdges">
      <rect x="1" y="7" width="3" height="4" fill="currentColor" opacity="0.45" />
      <rect x="5.5" y="7" width="3" height="4" fill="currentColor" opacity="0.7" />
      <rect x="10" y="7" width="3" height="4" fill="currentColor" />
      <rect x="14.5" y="2" width="3" height="3" fill="currentColor" />
    </svg>
  );
}

/** The SEGFAULT wordmark, from the supplied SEGFAULT.svg. One path, drawn in
 *  `currentColor` instead of the file's hard-coded white so it inherits the
 *  text colour like every other glyph here. Height-driven: set the height and
 *  the width follows from the 822×118 aspect. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 822 118"
      fill="none"
      role="img"
      aria-label="SEGFAULT"
      className={className}
    >
      <path d="M46.5702 68.4856C25.7828 64.457 0.966762 59.3005 0.966762 33.5176C0.966762 9.66847 16.2753 -0.000104103 50.1153 -0.000104103C79.7656 -0.000104103 97.8136 9.99075 97.8136 38.3519H79.2822C79.2822 20.6262 64.9405 18.5313 48.5039 18.5313C28.0388 18.5313 21.1096 23.3656 21.1096 32.3896C21.1096 34.8068 21.7542 36.7405 23.2045 38.513C27.0719 43.5085 43.3473 45.7645 59.1393 48.3428C80.8936 51.7268 89.2731 56.7222 95.5576 68.4856C97.9748 72.6753 99.1028 77.8319 99.1028 84.1165C99.1028 113.444 73.6422 117.634 48.8262 117.634C21.1096 117.634 -9.53279e-05 109.255 -9.53279e-05 79.2822H18.5313C18.5313 98.297 36.0959 99.425 50.5988 99.425C60.4285 99.425 78.9599 98.7805 78.9599 85.2445C78.9599 71.8696 61.073 70.9028 46.5702 68.4856ZM115.186 2.41704H203.814V20.1428H134.523V49.793H192.534V67.5188H134.523V97.4913H205.426V115.217H115.186V2.41704ZM303.344 89.7565C293.675 104.582 280.784 117.634 261.769 117.634C224.706 117.634 210.848 92.1736 210.848 58.6559C210.848 21.7542 226.479 -0.000104103 266.764 -0.000104103C301.41 -0.000104103 321.069 11.6022 321.069 41.5748H302.538C302.538 21.7542 283.845 18.0479 266.12 18.0479C237.597 18.0479 230.991 34.001 230.991 58.4948C230.991 81.5382 239.37 99.425 265.959 99.425C282.073 99.425 292.225 86.0502 299.154 72.9976H266.281V55.2719H321.875V115.217H303.344V89.7565ZM339.59 2.41704H427.412V20.1428H358.927V49.9542H420.967V67.6799H358.927V115.217H339.59V2.41704ZM420.092 115.217L466.34 2.41704H487.288L533.536 115.217H512.588L505.336 97.4913H448.292L441.04 115.217H420.092ZM455.221 79.7656H498.407L476.814 27.233L455.221 79.7656ZM621.945 2.41704H641.282V68.1633C641.282 101.681 626.618 117.634 591.489 117.634C556.359 117.634 541.534 101.842 541.534 68.1633V2.41704H560.871V71.225C560.871 91.8513 572.957 99.425 591.489 99.425C610.02 99.425 621.945 91.8513 621.945 71.225V2.41704ZM659.043 2.41704H678.38V97.4913H740.42V115.217H659.043V2.41704ZM821.973 20.1428H785.716V115.217H766.379V20.1428H730.122V2.41704H821.973V20.1428Z" fill="currentColor" />
    </svg>
  );
}
