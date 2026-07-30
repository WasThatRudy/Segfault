"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EVENT, SCRAMBLE_WORDS } from "@/content/event";
import { NOISE, prefersReducedMotion } from "@/lib/scramble";

/* ============================================================================
   The loader. Technique from ikeryou's sketch491 — reimplemented from scratch,
   no GSAP / three.js / dependencies. Spec: .claude/reference/loader-sketch491.md

   Rows of monospace type out left-to-right as random noise, then a second wave
   dissolves the noise away, leaving only real words floating in place. Reads like
   a core dump resolving into strings. Two rows are pinned so the dump resolves
   into the wordmark and the tagline, then the whole thing fades into the hero.

   Differences from the original, all deliberate:
   - the original loops forever (it's an art sketch); a loader needs a terminal
     state, so this resolves once and exits
   - the original's invisible `<span>_</span>` spacers are just spaces here —
     identical width in a monospace face, far less DOM churn
   ========================================================================= */

const DUR_A = 600; // type-out wave
const DUR_B = 500; // dissolve wave
const B_OFFSET = 300; // dissolve starts before type-out finishes
const STAGGER = 30; // per row
const HOLD = 200; // beat on the resolved frame
const FADE = 350;
const CAP = 3000; // hard exit, whatever happens

const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const expoInOut = (t: number) =>
  t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;

type Word = { text: string; start: number };
type RowSpec = { words: Word[]; delay: number; pinned: boolean };

const WORDMARK = `${EVENT.name.toUpperCase()} ${EVENT.year}`;

function buildRows(cols: number, count: number): RowSpec[] {
  const mid = Math.floor(count / 2);
  const rows: RowSpec[] = [];

  for (let r = 0; r < count; r++) {
    const delay = r * STAGGER;

    if (r === mid) {
      rows.push({
        words: [{ text: WORDMARK, start: Math.max(0, Math.floor((cols - WORDMARK.length) / 2)) }],
        delay,
        pinned: true,
      });
      continue;
    }
    if (r === mid + 2 && cols > EVENT.tagline.length + 4) {
      rows.push({
        words: [
          { text: EVENT.tagline, start: Math.floor((cols - EVENT.tagline.length) / 2) },
        ],
        delay,
        pinned: true,
      });
      continue;
    }

    /* 1–4 words per row, each placed after the previous one — the original's
       `now += end` walk, so words drift rightwards down the row */
    const words: Word[] = [];
    let cursor = 0;
    const n = 1 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i++) {
      const text = SCRAMBLE_WORDS[Math.floor(Math.random() * SCRAMBLE_WORDS.length)];
      if (cursor + text.length >= cols - 3) break;
      const start = Math.floor(cursor + Math.random() * (cols - 3 - text.length - cursor));
      words.push({ text, start });
      cursor = start + text.length + 1;
    }
    rows.push({ words, delay, pinned: false });
  }
  return rows;
}

function renderRow(spec: RowSpec, cols: number, elapsed: number): string {
  const local = elapsed - spec.delay;
  if (local <= 0) return "";

  const typed = expoOut(Math.min(1, local / DUR_A)) * cols;
  const dissolved = expoInOut(Math.max(0, Math.min(1, (local - B_OFFSET) / DUR_B))) * cols;

  let out = "";
  for (let i = 0; i < typed; i++) {
    let ch = "";
    for (const w of spec.words) {
      if (i >= w.start && i < w.start + w.text.length) {
        ch = w.text.charAt(i - w.start);
        break;
      }
    }
    if (ch) out += ch;
    /* genuinely random per character per frame, like the original. An index-derived
       sweep looks wrong here: any multiplier sharing a factor with NOISE.length
       (62 = 2 x 31) degenerates into a short repeating pattern. */
    else if (i >= dissolved) out += NOISE.charAt((Math.random() * NOISE.length) | 0);
    else out += " ";
  }
  return out;
}

type Line = { text: string; pinned: boolean };

export function Loader() {
  const [rows, setRows] = useState<Line[]>([]);
  const [phase, setPhase] = useState<"idle" | "running" | "out" | "gone">("idle");
  const raf = useRef<number | null>(null);

  const finish = useCallback(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
    setPhase("out");
    window.setTimeout(() => {
      setPhase("gone");
      document.documentElement.removeAttribute("data-loading");
    }, FADE);
  }, []);

  useEffect(() => {
    /* Everything runs off the frame clock — an external system — rather than
       synchronously in the effect body, which would cascade renders. */
    const start = () => {
      /* first visit only; a loader that replays on every back-navigation is a bug */
      const seen = sessionStorage.getItem("sf26-loader");
      if (seen || prefersReducedMotion()) {
        setPhase("gone");
        document.documentElement.removeAttribute("data-loading");
        return;
      }
      sessionStorage.setItem("sf26-loader", "1");
      document.documentElement.setAttribute("data-loading", "true");
      setPhase("running");

      const narrow = window.matchMedia("(max-width: 768px)").matches;
      const cols = narrow ? 50 : 150;
      const specs = buildRows(cols, narrow ? 17 : 25);
      const total = specs[specs.length - 1].delay + B_OFFSET + DUR_B + HOLD;
      const startedAt = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startedAt;
        setRows(specs.map((s) => ({ text: renderRow(s, cols, elapsed), pinned: s.pinned })));
        if (elapsed >= total) {
          finish();
          return;
        }
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    };

    const boot = requestAnimationFrame(start);
    const cap = window.setTimeout(finish, CAP);
    const skip = () => finish();
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });

    return () => {
      cancelAnimationFrame(boot);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      window.clearTimeout(cap);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      document.documentElement.removeAttribute("data-loading");
    };
  }, [finish]);

  if (phase === "gone") return null;

  return (
    <>
      {/* content is server-rendered underneath; without JS the overlay must not
          be able to trap the page */}
      <noscript>
        <style>{`#sf-loader{display:none!important}`}</style>
      </noscript>
      <div
        id="sf-loader"
        aria-hidden
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink transition-opacity duration-[350ms] ${
          phase === "out" ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex flex-col items-start gap-[0.5em] font-mono text-[10px] leading-none text-muted">
          {rows.map((row, i) => (
            <pre key={i} className={`m-0 whitespace-pre ${row.pinned ? "text-bone" : ""}`}>
              {row.text}
            </pre>
          ))}
        </div>
        <p className="sr-only">Loading {WORDMARK}</p>
      </div>
    </>
  );
}
