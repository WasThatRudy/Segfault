import { EVENT, REGISTRATION } from "@/content/event";
import { Button } from "@/components/primitives/Button";
import { Frame, Section } from "@/components/primitives/Frame";

/* ============================================================================
   Hero. Deliberately NOT animated on entry: the headline is the LCP element, so
   it paints immediately rather than waiting out a clip-path wipe. The hero keeps
   the event abstract; the detailed schedule lives in the Timeline section.

   Background is the `.field` graph-paper grid with sparse accent dots at the
   intersections — accent budget item #3, after primora.xyz.
   ========================================================================= */

const registrationLine = () => {
  switch (REGISTRATION.state) {
    case "soon":
      return `Registrations open ${REGISTRATION.openDate}.`;
    case "open":
      return `Registrations close ${REGISTRATION.closeDate}.`;
    case "extended":
      return `Registrations extended. ${REGISTRATION.lateEntryNote}`;
    case "closed":
      return "Registrations are closed.";
  }
};

export function Hero() {
  return (
    <Section hairline={false} className="field relative overflow-hidden">
      {/* Cropped wordmark watermark, the way rig.ai lets its logo run off the
          panel. Kept far below the headline's weight — at 0.9% it is felt rather
          than read, which is the only way it doesn't fight the h1. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-6 select-none text-[26vw] leading-none tracking-tighter text-bone/[0.009] sm:-top-10"
      >
        {EVENT.name.toUpperCase()}
      </span>

      <Frame className="relative">
        {/* On a phone the hero takes 60% of the viewport, so the section below it
            is already peeking in at the fold and the page reads as continuing.
            `svh`, not `vh`, so mobile browser UI can't change the figure as it
            collapses on scroll.

            Desktop stays a full viewport band minus the 4rem nav, the ~2.5rem
            ticker and 3rem of slack. Content is bottom-aligned at every width, so
            the headline sits on the fold rather than floating in the middle of
            the band. */}
        <div className="flex min-h-[60svh] flex-col justify-end px-6 pb-14 pt-14 sm:min-h-[calc(100svh-9.5rem)] sm:px-9 sm:pb-24 sm:pt-36">
          <h1 className="h-hero max-w-5xl">
            <span className="block">Where impossible</span>
            <span className="block">is just an error code.</span>
          </h1>

          <div className="mt-8 max-w-xl">
            <p className="copy text-[1.0625rem]">
              A hackathon on compilers, programming languages and program analysis, run entirely
              online. Five weeks to build, from wherever you are. Finalists present in person at{" "}
              {EVENT.finale.venueShort} on {EVENT.finale.dates}.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="#register" variant="primary" tile>
              Register
            </Button>
            <Button href="#tracks" variant="ghost">
              See tracks
            </Button>
          </div>

          <p className="label mt-6">{registrationLine()}</p>
        </div>
      </Frame>
    </Section>
  );
}
