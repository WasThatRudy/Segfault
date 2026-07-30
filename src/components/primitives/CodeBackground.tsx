"use client";

import { useState, type MouseEvent as ReactMouseEvent, type PointerEvent, type ReactNode } from "react";

const CODE_TOKENS = [
  "fn", "pass", "ir", "ssa", "cfg", "type", "match", "emit", "let", "llvm", "opt", "loop",
  "{", "}", "=>", "::", "[]", "()", "*", ";", "01", "10", "x", "y",
];

function codeField(length = 1700) {
  let field = "";

  while (field.length < length) {
    field += `${CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)]} `;
  }

  return field;
}

/**
 * A locally-scoped adaptation of Codrops' AnimatedCodeBackground hover effect.
 * It deliberately exposes only the site palette; the moving mask is handled by
 * CSS variables so pointer movement does not cause React renders.
 */
export function CodeBackground({ children }: { children: ReactNode }) {
  // Keep the server and first client render byte-for-byte identical. The field
  // is randomized only after a pointer enters the card.
  const [code, setCode] = useState(() => CODE_TOKENS.join(" ").repeat(80));
  const [active, setActive] = useState(false);
  const [blastId, setBlastId] = useState(0);

  function move(event: PointerEvent<HTMLDivElement> | ReactMouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--code-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--code-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <div
      className={`code-background ${active ? "code-background--active" : ""}`}
      onPointerEnter={(event) => {
        move(event);
        setCode(codeField());
        setActive(true);
      }}
      onPointerLeave={() => setActive(false)}
      onPointerMove={move}
      onClick={(event) => {
        move(event);
        setCode(codeField());
        setBlastId((id) => id + 1);
      }}
    >
      <div aria-hidden="true" className="code-background__interior">
        {code}
      </div>
      {blastId > 0 ? (
        <div key={blastId} aria-hidden="true" className="code-background__blast">
          {code}
        </div>
      ) : null}
      <div className="code-background__content">{children}</div>
    </div>
  );
}
