import type { Metadata } from "next";
import Link from "next/link";
import { person, writings } from "@/content/site";

export const metadata: Metadata = {
  title: "Writing",
  description: `Notes by ${person.name} on building for clients, shipping fast and working with AI.`,
  alternates: { canonical: "/writing/" },
};

export default function WritingIndex() {
  return (
    <main id="main" className="article">
      <div className="wrap">
        <Link className="back" href="/">← {person.name}</Link>
        <h1>Writing</h1>
        <ul className="posts">
          {writings.map((w) => (
            <li key={w.slug}>
              {w.published ? (
                <Link href={`/writing/${w.slug}/`} className="post">
                  <time className="label" dateTime={w.date}>{w.date}</time>
                  <span className="post-title">{w.title}</span>
                  <span className="post-sum">{w.summary}</span>
                  <span className="arrow" aria-hidden="true">→</span>
                </Link>
              ) : (
                <div className="post is-draft">
                  <span className="label">Draft</span>
                  <span className="post-title">{w.title}</span>
                  <span className="post-sum">{w.summary}</span>
                  <span className="label">Soon</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
