import { TICKER } from "@/content/event";
import { Footer } from "@/components/chrome/Footer";
import { Loader } from "@/components/chrome/Loader";
import { Nav } from "@/components/chrome/Nav";
import { MotionProvider } from "@/components/primitives/MotionProvider";
import { SmoothScroll } from "@/components/primitives/SmoothScroll";
import { Ticker } from "@/components/primitives/Ticker";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Online } from "@/components/sections/Online";
import { Prizes } from "@/components/sections/Prizes";
import { Sponsors } from "@/components/sections/Sponsors";
// import { Thesis } from "@/components/sections/Thesis";
import { Timeline } from "@/components/sections/Timeline";
import { Tracks } from "@/components/sections/Tracks";

/* Sections are server components; MotionProvider is the one client shell that
   makes `m.*` work inside them. Order: hook → format → what to build → when →
   what you win → who's backing it → questions → register. */
export default function Home() {
  return (
    <MotionProvider>
      <Loader />
      <Nav />
      {/* Loader and Nav stay outside SmoothScroll: a transformed ancestor would
          turn the loader's `fixed` into `absolute`, and the nav's `sticky` only
          works against the real document scroll. */}
      <SmoothScroll>
        <main>
          <Hero />
          <Ticker items={TICKER} />
          <Online />
          {/* Parked 2026-07-30, not deleted. The statement band (ASCII-dragon
              specimen panel + draft "Why compilers" copy) is complete and builds;
              it is out because the copy needs Shivansh's pass, not because the
              section is wrong. To bring it back: uncomment the import above and
              this line. Everything it needs still ships —
              src/components/sections/Thesis.tsx, THESIS in src/content/event.ts,
              public/art/dragon-ascii.png. */}
          {/* <Thesis /> */}
          <Tracks />
          <Timeline />
          <Prizes />
          <Sponsors />
          <Faq />
        </main>
        <Footer />
      </SmoothScroll>
    </MotionProvider>
  );
}
