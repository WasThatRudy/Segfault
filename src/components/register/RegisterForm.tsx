"use client";

import { useRef, useState } from "react";
import { useScramble } from "@/lib/scramble";

/* ============================================================================
   The registration form. Same hairline-grid language as everything else:
   numbered fieldsets, mono labels, notched submit. One request at the end —
   multipart POST to /api/teamRegistration — and the validation rules mirror
   the API's exactly so nothing passes here that the server would bounce.

   Colour discipline: field errors are mono text in --color-err, the confirmed
   state is mono in --color-ok. The accent appears once, on the submit fill.
   ========================================================================= */

type Member = {
  name: string;
  email: string;
  age: string;
  phone: string;
  studentOrProfessional: "student" | "professional";
  collegeOrCompanyName: string;
  githubLink: string;
  linkedinLink: string;
  devfolioLink: string;
};

const emptyMember = (): Member => ({
  name: "",
  email: "",
  age: "",
  phone: "",
  studentOrProfessional: "student",
  collegeOrCompanyName: "",
  githubLink: "",
  linkedinLink: "",
  devfolioLink: "",
});

/* Mirrors of the server-side rules in /api/teamRegistration. */
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v: string) => /^[6-9]\d{9}$/.test(v);
const isAge = (v: string) => {
  const n = parseInt(v);
  return !isNaN(n) && n > 0 && n < 120;
};
const isUsername = (v: string) => /^[a-zA-Z0-9_-]+$/.test(v);

const MAX_MEMBERS = 4;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

function validateMember(p: Member): string[] {
  const errors: string[] = [];
  if (!p.name.trim()) errors.push("Name is required");
  if (!p.email.trim()) errors.push("Email is required");
  else if (!isEmail(p.email)) errors.push("Invalid email format");
  if (!p.age.trim()) errors.push("Age is required");
  else if (!isAge(p.age)) errors.push("Invalid age");
  if (!p.phone.trim()) errors.push("Phone number is required");
  else if (!isPhone(p.phone))
    errors.push("Phone must be a 10-digit Indian mobile number (starts 6–9)");
  if (!p.collegeOrCompanyName.trim())
    errors.push(
      p.studentOrProfessional === "professional"
        ? "Company name is required"
        : "College / university is required"
    );
  for (const [label, v] of [
    ["GitHub", p.githubLink],
    ["LinkedIn", p.linkedinLink],
    ["Devfolio", p.devfolioLink],
  ] as const) {
    if (v.trim() && !isUsername(v.trim()))
      errors.push(`${label} should be the username only — no URL, no spaces`);
  }
  return errors;
}

/* --------------------------------------------------------------- atoms --- */

const inputCls =
  "w-full border border-rule bg-ink-panel px-4 py-3 font-mono text-sm text-bone placeholder:text-faint";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label mb-2 block">{label}</span>
      {children}
    </label>
  );
}

function ErrorLines({ errors }: { errors: string[] }) {
  if (!errors.length) return null;
  return (
    <ul className="mt-4 space-y-1">
      {errors.map((e) => (
        <li key={e} className="font-mono text-xs text-err">
          ✕ {e}
        </li>
      ))}
    </ul>
  );
}

/* The notched submit — the Button primitive is link-only, so this carries the
   same shell as its `primary` variant on a real <button type="submit">. */
function SubmitButton({ busy }: { busy: boolean }) {
  const label = busy ? "Submitting…" : "Submit registration";
  const { display, run, reset } = useScramble(label, { duration: 340 });
  return (
    <button
      type="submit"
      disabled={busy}
      onPointerEnter={run}
      onPointerLeave={reset}
      onFocus={run}
      onBlur={reset}
      className={`notch group relative inline-flex items-center gap-3 bg-accent px-5 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-bone transition-colors duration-200 hover:bg-accent-hi ${
        busy ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <span aria-hidden className="relative tabular-nums">
        {display}
      </span>
      <span className="sr-only">{label}</span>
    </button>
  );
}

/* ---------------------------------------------------------------- form --- */

type Submitted = {
  team_id: string;
  team_name: string;
  participants_count: number;
};

export function RegisterForm() {
  const [teamName, setTeamName] = useState("");
  const [teamNameStatus, setTeamNameStatus] = useState<
    "unknown" | "checking" | "available" | "taken"
  >("unknown");
  const [members, setMembers] = useState<Member[]>([emptyMember()]);
  const [ideaTitle, setIdeaTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const [teamErrors, setTeamErrors] = useState<string[]>([]);
  const [memberErrors, setMemberErrors] = useState<string[][]>([[]]);
  const [ideaErrors, setIdeaErrors] = useState<string[]>([]);
  const [globalError, setGlobalError] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState<Submitted | null>(null);

  const setMember = (i: number, patch: Partial<Member>) =>
    setMembers((ms) => ms.map((m, j) => (j === i ? { ...m, ...patch } : m)));

  async function checkTeamName() {
    const name = teamName.trim();
    if (!name) return;
    setTeamNameStatus("checking");
    try {
      const res = await fetch(
        `/api/teamRegistration?team_name=${encodeURIComponent(name)}`
      );
      const data = await res.json();
      setTeamNameStatus(res.ok ? (data.available ? "available" : "taken") : "unknown");
    } catch {
      setTeamNameStatus("unknown");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError("");

    /* client pass first — identical rules to the API */
    const tErr: string[] = [];
    if (!teamName.trim()) tErr.push("Team name is required");
    if (teamNameStatus === "taken") tErr.push("Team name is already taken");
    const mErr = members.map(validateMember);
    const dupEmails = new Set<string>();
    const seen = new Set<string>();
    for (const m of members) {
      const em = m.email.trim().toLowerCase();
      if (em && seen.has(em)) dupEmails.add(em);
      seen.add(em);
    }
    if (dupEmails.size)
      tErr.push("Each member needs a distinct email address");
    const iErr: string[] = [];
    if (!ideaTitle.trim()) iErr.push("Idea title is required");
    if (!file) iErr.push("Idea document (PDF/DOC) is required");
    else if (file.size > MAX_FILE_BYTES) iErr.push("Document must be under 5 MB");

    setTeamErrors(tErr);
    setMemberErrors(mErr);
    setIdeaErrors(iErr);
    if (tErr.length || iErr.length || mErr.some((e) => e.length)) return;

    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("team_name", teamName.trim());
      fd.append("team_size", String(members.length));
      fd.append("idea_title", ideaTitle.trim());
      fd.append(
        "participants",
        JSON.stringify(
          members.map((m) => ({
            ...m,
            stdCode: "+91",
            githubLink: m.githubLink.trim(),
            linkedinLink: m.linkedinLink.trim(),
            devfolioLink: m.devfolioLink.trim(),
          }))
        )
      );
      fd.append("idea_document", file as File);

      const res = await fetch("/api/teamRegistration", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      if (res.status === 201) {
        setSubmitted(data as Submitted);
        return;
      }

      /* map the API's error shapes back onto the form */
      if (data.participant_errors) {
        setMemberErrors(
          members.map(
            (_, i) => (data.participant_errors[`participant_${i}`] as string[]) ?? []
          )
        );
      }
      if (data.duplicate_emails) {
        setGlobalError(
          `Already registered in another team: ${data.duplicate_emails.join(", ")}`
        );
      } else {
        setGlobalError(data.message || "Registration failed. Please try again.");
      }
    } catch {
      setGlobalError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  /* ------------------------------------------------------------ done --- */

  if (submitted) {
    return (
      <div className="px-6 py-24 sm:px-11 sm:py-32">
        <p className="font-mono text-xs text-ok">✓ REGISTERED</p>
        <h1 className="h-section mt-7 max-w-3xl">You&rsquo;re in.</h1>
        <div className="mt-10 max-w-lg border-t border-rule">
          {[
            ["Team", submitted.team_name],
            ["Members", String(submitted.participants_count)],
            ["Reference ID", submitted.team_id],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex items-baseline justify-between gap-6 border-b border-rule py-3"
            >
              <span className="label">{k}</span>
              <span className="font-mono text-sm text-bone">{v}</span>
            </div>
          ))}
        </div>
        <p className="copy mt-8 max-w-lg">
          Keep the reference ID. Everything else — shortlists, next steps —
          lands in your inbox.
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------ form --- */

  return (
    <form onSubmit={onSubmit} noValidate className="px-6 py-24 sm:px-11 sm:py-32">
      <h1 className="h-section max-w-3xl">Register your team.</h1>
      <p className="copy mt-6 max-w-lg">
        Solo or up to four. One idea, one document, one submission — you can
        refine everything after the shortlist.
      </p>

      {/* 01 — team ------------------------------------------------------- */}
      <section className="mt-16 max-w-2xl border-t border-rule pt-8">
        <p className="label-faint">01 — Team</p>
        <div className="mt-6 space-y-6">
          <Field label="Team name">
            <input
              className={inputCls}
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value);
                setTeamNameStatus("unknown");
              }}
              onBlur={checkTeamName}
              placeholder="e.g. dangling_pointers"
              maxLength={60}
            />
          </Field>
          {teamNameStatus === "checking" && (
            <p className="font-mono text-xs text-muted">… checking</p>
          )}
          {teamNameStatus === "available" && (
            <p className="font-mono text-xs text-ok">✓ available</p>
          )}
          {teamNameStatus === "taken" && (
            <p className="font-mono text-xs text-err">✕ already taken</p>
          )}
        </div>
        <ErrorLines errors={teamErrors} />
      </section>

      {/* 02 — members ---------------------------------------------------- */}
      <section className="mt-16 max-w-2xl border-t border-rule pt-8">
        <p className="label-faint">02 — Members · {members.length} of {MAX_MEMBERS}</p>

        {members.map((m, i) => (
          <fieldset key={i} className="mt-8 border border-rule p-6">
            <div className="flex items-center justify-between">
              <legend className="label float-left">
                Member {String(i + 1).padStart(2, "0")}
                {i === 0 ? " · Lead" : ""}
              </legend>
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setMembers((ms) => ms.filter((_, j) => j !== i));
                    setMemberErrors((es) => es.filter((_, j) => j !== i));
                  }}
                  className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-err"
                >
                  ✕ Remove
                </button>
              )}
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Field label="Full name">
                <input
                  className={inputCls}
                  value={m.name}
                  onChange={(e) => setMember(i, { name: e.target.value })}
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  className={inputCls}
                  value={m.email}
                  onChange={(e) => setMember(i, { email: e.target.value })}
                />
              </Field>
              <Field label="Age">
                <input
                  type="number"
                  min={1}
                  max={119}
                  className={inputCls}
                  value={m.age}
                  onChange={(e) => setMember(i, { age: e.target.value })}
                />
              </Field>
              <Field label="Phone">
                <div className="flex">
                  <span className="inline-flex items-center border border-r-0 border-rule bg-ink-deep px-3 font-mono text-sm text-muted">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    className={inputCls}
                    value={m.phone}
                    onChange={(e) =>
                      setMember(i, { phone: e.target.value.replace(/\D/g, "") })
                    }
                  />
                </div>
              </Field>
            </div>

            <div className="mt-6">
              <span className="label mb-2 block">Status</span>
              <div className="flex">
                {(["student", "professional"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setMember(i, { studentOrProfessional: s })}
                    className={`border border-rule px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors first:border-r-0 ${
                      m.studentOrProfessional === s
                        ? "bg-rule text-bone"
                        : "bg-transparent text-muted hover:text-bone"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Field
                label={
                  m.studentOrProfessional === "professional"
                    ? "Company"
                    : "College / university"
                }
              >
                <input
                  className={inputCls}
                  value={m.collegeOrCompanyName}
                  onChange={(e) =>
                    setMember(i, { collegeOrCompanyName: e.target.value })
                  }
                />
              </Field>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <Field label="GitHub · optional">
                <input
                  className={inputCls}
                  placeholder="username"
                  value={m.githubLink}
                  onChange={(e) => setMember(i, { githubLink: e.target.value })}
                />
              </Field>
              <Field label="LinkedIn · optional">
                <input
                  className={inputCls}
                  placeholder="username"
                  value={m.linkedinLink}
                  onChange={(e) => setMember(i, { linkedinLink: e.target.value })}
                />
              </Field>
              <Field label="Devfolio · optional">
                <input
                  className={inputCls}
                  placeholder="username"
                  value={m.devfolioLink}
                  onChange={(e) => setMember(i, { devfolioLink: e.target.value })}
                />
              </Field>
            </div>

            <ErrorLines errors={memberErrors[i] ?? []} />
          </fieldset>
        ))}

        {members.length < MAX_MEMBERS && (
          <button
            type="button"
            onClick={() => {
              setMembers((ms) => [...ms, emptyMember()]);
              setMemberErrors((es) => [...es, []]);
            }}
            className="mt-6 w-full border border-dashed border-rule py-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-muted hover:text-bone"
          >
            + Add member
          </button>
        )}
      </section>

      {/* 03 — idea ------------------------------------------------------- */}
      <section className="mt-16 max-w-2xl border-t border-rule pt-8">
        <p className="label-faint">03 — Idea</p>
        <div className="mt-6 space-y-6">
          <Field label="Idea title">
            <input
              className={inputCls}
              value={ideaTitle}
              onChange={(e) => setIdeaTitle(e.target.value)}
              placeholder="What are you building?"
            />
          </Field>

          <div>
            <span className="label mb-2 block">Idea document · PDF or DOC · max 5 MB</span>
            <input
              ref={fileInput}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="w-full border border-dashed border-rule px-4 py-6 text-left font-mono text-sm text-muted transition-colors hover:border-muted hover:text-bone"
            >
              {file ? `→ ${file.name}` : "Attach the one-pager"}
            </button>
          </div>
        </div>
        <ErrorLines errors={ideaErrors} />
      </section>

      {/* submit ---------------------------------------------------------- */}
      <div className="mt-16 max-w-2xl border-t border-rule pt-8">
        {globalError && (
          <p className="mb-6 font-mono text-xs text-err">✕ {globalError}</p>
        )}
        <SubmitButton busy={busy} />
        <p className="copy mt-6 text-sm">
          One registration per person — emails and phone numbers are checked
          across teams.
        </p>
      </div>
    </form>
  );
}
