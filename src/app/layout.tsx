import type { Metadata } from "next";
import { Source_Code_Pro } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { EVENT } from "@/content/event";

/* Chalet — House Industries. Single weight (550) per cut; the two files are two
   different designs, not two weights. London is the display face; New York is
   loaded unpreloaded so the cut can be swapped from globals.css in one line.
   NOTE: commercial face, fsType 260 (preview/print, no subsetting). Web licence
   still to be confirmed — see .claude/reference/design-language.md §2. */
const chaletLondon = localFont({
  src: "../fonts/ChaletLondonNineteenSixty.ttf",
  variable: "--font-chalet-london",
  weight: "500",
  display: "swap",
});

const chaletNewYork = localFont({
  src: "../fonts/ChaletNewYorkNineteenSixty.ttf",
  variable: "--font-chalet-ny",
  weight: "500",
  display: "swap",
  preload: false,
});

/* Source Code Pro carries every label, index, ticker word and data row — and the
   loader, where it's the face the original sketch uses. Also supplies ₹ █ ░ ✓ →,
   which Chalet lacks. */
const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://segfault.compilertech.org"),
  title: {
    default: `${EVENT.name} ${EVENT.year} — ${EVENT.tagline}`,
    template: `%s — ${EVENT.name} ${EVENT.year}`,
  },
  description: `${EVENT.name} ${EVENT.year} is a fully online hackathon on compilers, programming languages and program analysis, co-located with the ${EVENT.host.short} workshop. Grand finale ${EVENT.finale.dates} at ${EVENT.finale.venueShort}.`,
  keywords: [
    "compilers",
    "hackathon",
    "LLVM",
    "MLIR",
    "programming languages",
    "program analysis",
    "IICT",
    "IISc",
    "online hackathon",
  ],
  openGraph: {
    title: `${EVENT.name} ${EVENT.year} — ${EVENT.tagline}`,
    description: `A fully online hackathon on compiler technology. Finale ${EVENT.finale.dates} at ${EVENT.finale.venueShort}.`,
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", site: "@compiler_tech" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${chaletLondon.variable} ${chaletNewYork.variable} ${sourceCodePro.variable} antialiased`}
    >
      <body className="grain min-h-dvh overflow-x-hidden">{children}</body>
    </html>
  );
}
