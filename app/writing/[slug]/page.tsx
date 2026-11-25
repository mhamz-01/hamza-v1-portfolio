import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { person, writings } from "@/content/site";
import { articleGraph, toJsonLd } from "@/lib/structured-data";

// Only published posts get a page (drafts stay out of the index and the sitemap).
export const dynamicParams = false;

export function generateStaticParams() {
  const live = writings.filter((w) => w.published);
  // Static export needs at least one param; a draft placeholder page is noindexed below.
  return (live.length ? live : writings.slice(0, 1)).map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const w = writings.find((x) => x.slug === slug);
  if (!w) return {};
  return {
    title: w.title,
    description: w.summary,
    alternates: { canonical: `/writing/${w.slug}/` },
    openGraph: { type: "article", title: w.title, description: w.summary, publishedTime: w.date, authors: [person.name] },
    robots: w.published ? undefined : { index: false, follow: true },
  };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = writings.find((x) => x.slug === slug);
  if (!w) notFound();
  const ld = articleGraph(w.slug);
  return (
    <main id="main" className="article">
      {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(ld) }} />}
      <article className="wrap">
        <Link className="back" href="/writing/">← Writing</Link>
        <p className="label" style={{ marginTop: 24 }}>
          <time dateTime={w.date}>{w.date}</time> · {person.name}
        </p>
        <h1>{w.title}</h1>
        <div className="body">
          {w.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
