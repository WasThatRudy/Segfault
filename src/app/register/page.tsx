import type { Metadata } from "next";
import { EVENT, REGISTRATION, TIMELINE } from "@/content/event";
import { Arrow } from "@/components/icons";
import { Button } from "@/components/primitives/Button";
import { Frame, Section } from "@/components/primitives/Frame";
import { MotionProvider } from "@/components/primitives/MotionProvider";
import { Nav } from "@/components/chrome/Nav";
import { WipeUp } from "@/components/primitives/Reveal";
import { RegisterForm } from "@/components/register/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description: `Registration for ${EVENT.name} ${EVENT.year}, a fully online hackathon on compiler technology.`,
};

/* Gated on REGISTRATION.state: while 'soon'/'closed' this is the stated-fact
   placeholder; at 'open'/'extended' the form renders and posts to
   /api/teamRegistration. Flip the state in content/event.ts to launch. */
export default function RegisterPage() {
  const open = REGISTRATION.state === "open" || REGISTRATION.state === "extended";
  const first = TIMELINE[0];

  return (
    <MotionProvider>
      <Nav />
      <main>
        <Section hairline={false} className="field">
          <Frame>
            {open ? (
              <RegisterForm />
            ) : (
              <div className="px-6 py-24 sm:px-11 sm:py-32">
                <h1 className="h-section mt-7 max-w-3xl">
                  <WipeUp>Not open yet.</WipeUp>
                  <WipeUp delay={0.06}>{`Opens ${REGISTRATION.openDate}.`}</WipeUp>
                </h1>

                <p className="copy mt-8 max-w-lg">
                  {`${first.title} on ${first.date}. ${first.body} Nothing is required from you before then.`}
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Button href="/#timeline" variant="primary" tile>
                    See the timeline
                  </Button>
                  <a
                    href={`mailto:${EVENT.contact.email}`}
                    className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-bone"
                  >
                    {EVENT.contact.email}
                    <Arrow size={11} />
                  </a>
                </div>
              </div>
            )}
          </Frame>
        </Section>
      </main>
    </MotionProvider>
  );
}
