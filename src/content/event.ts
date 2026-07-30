/* ============================================================================
   SegFault 2026 — single source of truth for every string and date on the site.
   No component hard-codes content. Confirmed facts live in
   .claude/reference/segfault-2026-brief.md

   Entries marked `confirm: true` are carried over from 2025 or inferred, and
   need Shivansh's sign-off before launch.
   ========================================================================= */

export const EVENT = {
  name: "SegFault",
  year: "2026",
  tagline: "Where impossible is just an error code.",
  /* 2026 is online-first. This must be unmissable, not buried in the FAQ. */
  mode: "Fully online",
  modeNote: "Build from anywhere. Only the finale is in person.",
  window: "Aug 1 – Oct 3, 2026",
  host: {
    name: "Innovations In Compiler Technology",
    short: "IICT",
    edition: "3rd edition",
    url: "https://compilertech.org/",
  },
  finale: {
    dates: "Oct 2–3, 2026",
    venue: "A V Rama Rao Auditorium, Indian Institute of Science",
    venueShort: "IISc, Bengaluru",
    city: "Bengaluru",
  },
  contact: {
    email: "ashutosh@compilertech.org",
    person: "Ashutosh Pandey",
    x: { handle: "X", url: "https://x.com/compiler_tech" },
    linkedin: {
      label: "Compiler Technology",
      url: "https://www.linkedin.com/company/compilertech/",
    },
  },
} as const;

/* Registration gate. Flip `state` as things move; every CTA reads from here.
   'soon' → opens on openDate · 'open' → live · 'extended' → past the original
   close date but still accepting · 'closed' → done. */
export const REGISTRATION = {
  state: "soon" as "soon" | "open" | "extended" | "closed",
  openDate: "Aug 1, 2026",
  closeDate: "Aug 15, 2026",
  /* Internal only — Shivansh's note that the close date might move. Never
     rendered: the site states one close date and nothing about it slipping. */
  mayExtend: true,
  url: "/register",
  /* Registrations stay open after hacking begins — late teams can still join. */
  lateEntryNote: "Late registrations accepted after hacking begins.",
} as const;

export const NAV = [
  { label: "Tracks", href: "#tracks" },
  { label: "Timeline", href: "#timeline" },
  { label: "Prizes", href: "#prizes" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "FAQ", href: "#faq" },
] as const;

/* Ticker strip at the hero boundary. Mono, uppercase, · separated. */
export const TICKER = [
  "Fully online",
  "Compilers",
  "Programming languages",
  "Program analysis",
  "LLVM · MLIR",
  "Open to students & industry",
  "Rolling shortlists",
  "Finale at IISc Bengaluru",
] as const;

/* ---------------------------------------------------------------- timeline
   Confirmed by Shivansh 2026-07-29. Note two things the 2025 site couldn't
   express: shortlisting is *rolling*, and registration overlaps hacking. */
export const TIMELINE = [
  {
    id: "open",
    date: "Aug 1",
    time: "",
    title: "Registrations open",
    body: "Sign up as a team or solo. Nothing to build yet, just get on the list.",
    kind: "point" as const,
  },
  {
    id: "tracks",
    date: "Aug 7",
    time: "",
    title: "Problem statements and tracks announced",
    body: "The real track list and problem statements land a week after sign-ups open.",
    kind: "point" as const,
  },
  {
    id: "close",
    date: "Aug 15",
    time: "",
    title: "Registrations close",
    body: "Late entries are still accepted once hacking is underway.",
    kind: "point" as const,
    soft: true,
  },
  {
    id: "hack",
    date: "Aug 15",
    time: "",
    title: "Hacking begins",
    body: "Five weeks, fully remote. Everything runs on your own machine.",
    kind: "range" as const,
  },
  {
    id: "shortlist",
    date: "Rolling",
    time: "",
    title: "Shortlists announced",
    body: "Teams get shortlisted as submissions come in, instead of all at once on one date.",
    kind: "rolling" as const,
  },
  {
    id: "eval",
    date: "Sept 19–20",
    time: "",
    title: "Final evaluation",
    body: "Online judging across both days. The finalist list is locked by the end of it.",
    kind: "point" as const,
  },
  {
    id: "finale",
    date: "Oct 2–3",
    time: "",
    title: "Grand finale at IICT",
    body: "Finalists present in person at IISc Bengaluru, alongside the IICT workshop.",
    kind: "point" as const,
    terminal: true,
  },
] as const;

/* ------------------------------------------------------------------- thesis
   The statement band: why a compiler hackathon exists at all. DRAFT COPY —
   Shivansh writes the final version. `stats` are pulled from facts stated
   elsewhere in this file, so nothing here can drift out of step with them. */
export const THESIS = {
  chip: "Why compilers",
  lines: ["Every program you use", "runs on someone's compiler."],
  body: "Compilers, IRs and analysis tooling are the layer everything else stands on, and the layer almost nobody gets to touch. SegFault is five weeks inside it.",
  stats: [
    { value: "5 weeks", label: "To build, fully remote" },
    { value: "6 tracks", label: "Or bring your own problem" },
    { value: "2 days", label: "In person, at the finale" },
  ],
  confirm: true,
} as const;

/* ------------------------------------------------------------------ tracks
   Carried from 2025 and still indicative — the real problem statements land
   Aug 7. `confirm: true` on the set as a whole. */
export const TRACKS_ARE_INDICATIVE = true;

export const TRACKS = [
  {
    id: 1,
    label: "DSLs",
    title: "Domain specific compilers and languages",
    body: "Design and implement compilers and languages for a specific application or a specific piece of hardware.",
    examples: "Halide for computational photography · a language for drones · theorem prover languages",
    tags: ["Compilers", "Programming languages", "eDSLs"],
  },
  {
    id: 2,
    label: "Frameworks",
    title: "Compiler frameworks and tools",
    body: "Work on the infrastructure itself: intermediate representations, program analysis, transformation tooling.",
    examples: "static analysers · debuggers · formatters and review tools · coverage and profiling",
    tags: ["Tools", "Static analysis", "Debugging"],
  },
  {
    id: 3,
    label: "AI/ML",
    title: "Compilers and AI/ML",
    body: "Use AI/ML to make compilers better, or compiler technology to make AI/ML workflows better.",
    examples: "LLM support for CFGs · AI-assisted review · model-guided pass selection",
    tags: ["Machine learning", "Codegen", "Tooling"],
  },
  {
    id: 4,
    label: "Optimization",
    title: "Optimizing for the real world",
    body: "Take software that already exists and make it run faster or leaner with compiler techniques.",
    examples: "auto-tuning heterogeneous systems · energy-efficient codegen · edge instruction selection",
    tags: ["Auto-tuning", "Energy", "Edge"],
  },
  {
    id: 5,
    label: "Explainability",
    title: "Explainable compilers",
    body: "Modern compilers are enormous black boxes. Make their decisions legible to the people using them.",
    examples: "IR to ASM visualisation · showing why a pass fired · interactive teaching tools",
    tags: ["Visualisation", "Teaching", "Debugging"],
  },
  {
    id: 6,
    label: "New paradigms",
    title: "Compilers for new paradigms",
    body: "Build compilers or tooling for places compilers are only just arriving.",
    examples: "eBPF and secure enclaves · quantum IR to gates · attack-surface reduction",
    tags: ["Quantum", "eBPF", "Security"],
  },
] as const;

/* ------------------------------------------------------------------ prizes */
export const PRIZES = {
  total: "₹1,50,000",
  places: [
    { place: "1st", amount: "₹75,000", note: "Winner" },
    { place: "2nd", amount: "₹50,000", note: "Runner-up" },
    { place: "3rd", amount: "₹25,000", note: "Third place" },
  ],
  perks: [
    { label: "Certificates", body: "Every participant gets a certificate." },
    { label: "Mentorship", body: "Sessions with compiler engineers working in industry." },
    { label: "Travel", body: "Finalists' IICT workshop attendance is covered." },
    { label: "Hiring", body: "Internship and job conversations with the sponsors." },
  ],
} as const;

/* --------------------------------------------------------------- sponsors
   2026 lineup per Shivansh: CDAC first, FPLaunchpad second. 2025's NVIDIA /
   Google / Qualcomm / Quadric are NOT confirmed for 2026 — do not display them.
   FPLaunchpad needs a logo asset, canonical URL and exact capitalisation. */
/* Logo provenance, because neither asset came from the sponsor directly:
   · cdac.svg — from Wikimedia Commons, monochrome #05186A, viewBox normalised and
     precision trimmed here. Confirm it is CDAC's current mark before launch.
   · fp-launchpad.png — FP Launchpad's own asset from fplaunchpad.org. They publish
     no SVG and no dark variant, and the wordmark is black, so both logos are set on
     a light plate in their true colours rather than recoloured or traced by hand.
   Ask both sponsors for official SVGs (and a reversed variant) before launch. */
export const SPONSORS = [
  {
    rank: 1,
    name: "CDAC",
    full: "Centre for Development of Advanced Computing",
    url: "https://www.cdac.in/",
    logo: { src: "/sponsors/cdac.svg", width: 3450, height: 2470 },
  },
  {
    rank: 2,
    name: "FP Launchpad",
    full: "Centre for Functional Systems Research and Education, IIT Madras",
    url: "https://fplaunchpad.org/",
    logo: { src: "/sponsors/fp-launchpad.png", width: 1588, height: 972 },
  },
] as const;

export const HOST_NOTE =
  "SegFault is organised as part of the Innovations In Compiler Technology workshop.";

/* --------------------------------------------------------------------- faq
   Answers without `confirm` are verbatim-equivalent to 2025's published answers
   or come from Shivansh's 2026 brief. The rest need sign-off. */
export const FAQ = [
  {
    q: "Is SegFault 2026 actually online?",
    a: "Yes. Registration, hacking, submissions and final evaluation all happen remotely, so you never have to travel to take part. The only in-person part is the grand finale on Oct 2–3, and that's for finalists.",
  },
  {
    q: "What does it cost, and who can take part?",
    a: "Registration is free, and you don't have to be a student. In 2025 teams came from IITs and other colleges alongside working engineers, and solo entries did fine — three of the six finalists were teams of one.",
    confirm: true,
  },
  {
    q: "Can I still join after Aug 15?",
    a: "Yes. Late registrations are accepted after hacking begins — you just get less time to build. All IP in what you build stays with your team.",
  },
  {
    q: "How does shortlisting work?",
    a: "On a rolling basis. Teams are shortlisted as their submissions come in, rather than all at once on a single announcement date. Submit early and you hear back early.",
  },
  {
    q: "What happens at the finale?",
    a: "Five minutes to pitch in front of the jury, then two to three minutes of questions. Finalists attend the IICT workshop free. Travel can't be guaranteed, but reimbursements are offered to student attendees — reach out to the organisers. Accommodation at IISc isn't confirmed yet.",
  },
  {
    q: "My question isn't here.",
    a: `Email ${EVENT.contact.person} at ${EVENT.contact.email}, or reach the IICT workshop on LinkedIn or X.`,
  },
] as const;

/* ------------------------------------------------------------- the pipeline
   The event, drawn as a compiler pipeline. Used by the hero diagram and as the
   spine of the "how it runs" section. */
export const PIPELINE = [
  { stage: "source", label: "Register", detail: "Aug 1" },
  { stage: "frontend", label: "Pick a track", detail: "Aug 7" },
  { stage: "ir", label: "Hack", detail: "Aug 15 →" },
  { stage: "passes", label: "Submit", detail: "rolling" },
  { stage: "codegen", label: "Evaluate", detail: "Sept 19–20" },
  { stage: "link", label: "Finale", detail: "Oct 2–3" },
] as const;

/* ------------------------------------------------------- last year, in short
   Real 2025 outcomes — social proof, all verified from the 2025 site's
   finalists.json. See .claude/reference/segfault-2025.md */
export const LAST_YEAR = {
  submissions: 24,
  finalists: 6,
  soloFinalists: 3,
  /* The 2025 site is still live and holds all 24 submissions with abstracts,
     repos and demo videos. Point people at it — reading last year's ideas is the
     fastest way to calibrate what a good SegFault project looks like. */
  archiveUrl: "https://segfault.compilertech.org/",
  archiveLabel: "2025 archive",
  archivePrompt: "Read what got built last year before you pick an idea.",
  examples: [
    { team: "FutureForge", project: "IR2Vec++" },
    { team: "UBqitous", project: "LLVM-powered deobfuscator" },
    { team: "we dont know llvm", project: "Reduced Python frontend for eBPF" },
    { team: "Q", project: "Debug dialect for MLIR" },
    { team: "Blank Point", project: "EdgeFlow, a DSL for edge AI pipelines" },
    { team: "CaptainIRS", project: "DSPLang" },
  ],
} as const;

/* Words the loader and ticker resolve to. Compiler + core-dump vocabulary so the
   scramble reads like a real dump of this event. See loader-sketch491.md §3. */
export const SCRAMBLE_WORDS = [
  "SEGFAULT", "2026", "IICT", "IISc", "online", "Register", "Tracks", "Timeline",
  "SIGSEGV", "core dumped", "0xDEADBEEF", "nullptr", "stack", "heap", "malloc",
  "LLVM", "MLIR", "IR", "AST", "CFG", "SSA", "lexer", "parser", "codegen",
  "lower", "inline", "fold", "vectorize", "regalloc", "pass", "clang", "emit",
  "DSL", "eBPF", "quantum", "Oct 2", "Bengaluru", "hack", "submit", "bounds",
] as const;
