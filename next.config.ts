import type { NextConfig } from "next";

// `npm run export` builds a static copy (used for the hosted preview).
// Deploying to Vercel or any Node host: just `npm run build`.
const isExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isExport ? { output: "export", trailingSlash: true, images: { unoptimized: true } } : {}),
};

export default nextConfig;
