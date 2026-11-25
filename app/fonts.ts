import localFont from "next/font/local";

// All four families are SIL Open Font License and bundled locally (no build-time network).
export const doto = localFont({
  src: "./fonts/Doto-Variable.woff2",
  weight: "100 900",
  variable: "--font-doto",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const funnelDisplay = localFont({
  src: "./fonts/FunnelDisplay-Variable.woff2",
  weight: "300 800",
  variable: "--font-funnel-display",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const funnelSans = localFont({
  src: [
    { path: "./fonts/FunnelSans-Variable.woff2", weight: "300 800", style: "normal" },
    { path: "./fonts/FunnelSans-Italic-Variable.woff2", weight: "300 800", style: "italic" },
  ],
  variable: "--font-funnel-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const departureMono = localFont({
  src: "./fonts/DepartureMono-Regular.woff2",
  weight: "400",
  variable: "--font-departure",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

export const fontVars = [doto, funnelDisplay, funnelSans, departureMono].map((f) => f.variable).join(" ");
