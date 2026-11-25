import type { MetadataRoute } from "next";
import { SITE_URL, writings, projectPages } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/writing/`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/llms.txt`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...projectPages.map((p) => ({ url: `${SITE_URL}${p.href}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...writings
      .filter((w) => w.published)
      .map((w) => ({ url: `${SITE_URL}/writing/${w.slug}/`, lastModified: new Date(w.date), changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
