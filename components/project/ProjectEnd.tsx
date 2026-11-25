import Link from "next/link";
import { person, projectPages } from "@/content/site";

/** Top of every project page: a way back and where this project sits in the set. */
export function ProjectCrumb({ slug }: { slug: string }) {
  const i = projectPages.findIndex((p) => p.slug === slug);
  return (
    <p className="pj-crumb label">
      <Link className="back" href="/#work">← All work</Link>
      <span aria-hidden="true">{String(i + 1).padStart(2, "0")} / {String(projectPages.length).padStart(2, "0")}</span>
    </p>
  );
}

/** Bottom of every project page: the next project, then a way to get in touch. */
export function ProjectEnd({ slug }: { slug: string }) {
  const i = projectPages.findIndex((p) => p.slug === slug);
  const next = projectPages[(i + 1) % projectPages.length];
  return (
    <footer className="pj-end">
      <div className="wrap">
        <Link href={next.href} className="pj-next">
          <span className="label">Next project · {next.kind}</span>
          <span className="pj-next-name">{next.name}</span>
          <span className="pj-next-line">{next.line}</span>
          <span className="pj-next-arrow" aria-hidden="true">→</span>
        </Link>
        <div className="pj-cta">
          <p>Need something like this built?</p>
          <div className="pj-cta-actions">
            <Link className="btn btn-signal" href="/#contact">Start a project</Link>
            <Link className="btn" href="/#work">All work</Link>
          </div>
        </div>
        <p className="label pj-copy">© {new Date().getFullYear()} {person.name}</p>
      </div>
    </footer>
  );
}
