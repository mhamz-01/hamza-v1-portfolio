import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVars } from "./fonts";
import { SITE_URL, person } from "@/content/site";

const title = `${person.name} — ${person.jobTitle}`;
const description = `${person.name} is a full-stack software engineer at ${person.employer.name} who builds what clients actually need, ships it fast, then ships a better v2 shaped by feedback. AI-first, client-first.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s — ${person.name}` },
  description,
  applicationName: `${person.name} portfolio`,
  authors: [{ name: person.name, url: SITE_URL }],
  creator: person.name,
  keywords: [
    person.name,
    "Muhammad Hamza software engineer",
    "full-stack engineer",
    "full-stack developer for hire",
    "AI-first engineer",
    "React developer",
    "Python developer",
    "agentic AI",
  ],
  alternates: {
    canonical: "/",
    types: { "text/plain": [{ url: "/llms.txt", title: "LLM-readable profile" }] },
  },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: person.name,
    title,
    description,
    locale: "en_US",
    firstName: "Muhammad",
    lastName: "Hamza",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

const introBoot = `(function(){try{var d=document.documentElement;if(location.pathname!=="/"||location.hash||matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.dataset.introPlan="1";d.classList.add("intro");setTimeout(function(){if(!window.__introAlive){d.classList.remove("intro","intro-reveal");d.dataset.introPlan="0"}},10000)}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        {/* Plans the landing intro before first paint (home page only, never with reduced motion).
            If the intro never starts, a failsafe unlocks the page so content can never stay hidden. */}
        <script dangerouslySetInnerHTML={{ __html: introBoot }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
