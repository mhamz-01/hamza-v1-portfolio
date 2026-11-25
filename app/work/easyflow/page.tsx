import type { Metadata } from "next";
import Link from "next/link";
import BrowserShots from "@/components/BrowserShots";
import { ProjectCrumb, ProjectEnd } from "@/components/project/ProjectEnd";
import { products, isPlaceholder, projectHref, type Phase } from "@/content/site";
import { projectGraph, toJsonLd } from "@/lib/structured-data";

const p = products.find((x) => x.slug === "easyflow")!;
const f = p.featured!;

export const metadata: Metadata = {
  title: `${p.name}: ${f.tagline.replace(/\.$/, "")}`,
  description: `${p.summary} Built with ${p.stack.join(", ")}.`,
  alternates: { canonical: projectHref(p.slug) },
  openGraph: { title: `${p.name}, a product by Muhammad Hamza`, description: p.summary, images: [{ url: f.images[0].src, width: f.images[0].w, height: f.images[0].h, alt: f.images[0].alt }] },
};

const phaseLabel: Record<Phase, string> = { discover: "Discover", design: "Design", build: "Build", ship: "Ship" };

// What a "do everything" tool puts in front of a new teammate (decorative, it scatters on scroll)
const clutter = [
  "Custom fields", "Automations ▾", "Sprint settings", "Views ▾", "Filters", "Integrations", "Permission schemes",
  "Workflows", "Dashboards", "Reports", "Epics", "Swimlanes", "Templates ▾", "Story points", "Admin", "Labels",
];
const core = ["Projects", "Tasks", "Docs", "Whiteboards", "Chat"];

export default function EasyFlowPage() {
  return (
    <main id="main" className="pj ef-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(projectGraph(p.slug)) }} />

      {/* HERO: the name, the promise, the product rising off the desk */}
      <section className="ef-hero" aria-labelledby="ef-title">
        <div className="wrap">
          <ProjectCrumb slug={p.slug} />
          <p className="label ef-meta">
            <span className="c-signal">Product · case study</span>
            <span className="users"><span className="dot dot-live" aria-hidden="true" />{p.users}</span>
          </p>
          <h1 id="ef-title" className="ef-name">{p.name}</h1>
          <p className="ef-tag">{f.tagline}</p>
          <div className="pj-actions">
            {p.url && <a className="btn btn-signal" href={p.url} rel="noopener">Visit {p.url.replace(/^https?:\/\//, "")} ↗</a>}
            <a className="btn" href="#ef-build">How it’s built</a>
          </div>
        </div>
        <div className="wrap ef-shot" data-tilt>
          <BrowserShots shots={f.images} url={p.url || ""} name={p.name} />
        </div>
      </section>

      {/* BRIEF: four facts in one strip */}
      <section className="wrap ef-brief" aria-label="Project brief">
        <dl>
          <div data-reveal><dt className="label">Built for</dt><dd>{f.audience}</dd></div>
          <div data-reveal data-delay={0.06}><dt className="label">What it is</dt><dd>{p.summary}</dd></div>
          <div data-reveal data-delay={0.12}><dt className="label">Stack</dt><dd>{p.stack.join(" · ")}</dd></div>
          <div data-reveal data-delay={0.18}>
            <dt className="label">My part</dt>
            <dd><ul className="ef-phases">{p.phases.map((ph) => <li key={ph} className={`c-${ph}`}><span className="sq" aria-hidden="true" />{phaseLabel[ph]}</li>)}</ul></dd>
          </div>
        </dl>
      </section>

      {/* THE PROBLEM: clutter on screen, scattered by scroll, leaving only what a team needs */}
      <section className="ef-declutter" aria-labelledby="ef-problem">
        <div className="wrap ef-declutter-in">
          <div className="ef-problem-text">
            <p className="label c-signal">The problem</p>
            <h2 id="ef-problem" className="ef-h2">Most tools can do everything. That’s the problem.</h2>
            <p className="ef-lead">{f.pain}</p>
            <p className="ef-answer">EasyFlow keeps only what a team uses every day, and puts it one click away.</p>
          </div>
          <div className="ef-stage" aria-hidden="true">
            <div className="ef-noise">
              {clutter.map((c, i) => <span key={c} style={{ ["--i" as string]: i }}>{c}</span>)}
            </div>
            <div className="ef-clean">
              <p className="label">Your workspace</p>
              <ul>{core.map((c) => <li key={c}><span className="sq" />{c}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* THE APPROACH: told as a board, because it's a project tool. Each ticket moves to Done as you scroll */}
      <section className="wrap ef-approach" aria-labelledby="ef-approach-title">
        <p className="label">The approach</p>
        <h2 id="ef-approach-title" className="ef-h2">How I made it simpler</h2>
        <div className="ef-lanes">
          <div className="ef-lane-heads" aria-hidden="true">
            <span className="label">To do</span><span className="label">Doing</span><span className="label">Done</span>
          </div>
          <ol>
            {f.approach.map((a, i) => (
              <li key={a.k} className="ef-row">
                <article className="ef-ticket" data-state="done">
                  <div className="ef-card">
                    <p className="ef-ticket-top label">
                      <span>EF-{String(i + 1).padStart(2, "0")}</span>
                      <span className="ef-status">Done</span>
                    </p>
                    <h3>{a.k}</h3>
                    <p>{a.v}</p>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* INSIDE + BUILT: a checklist that ticks itself, and the architecture with data moving through it */}
      <section className="wrap ef-inside" id="ef-build" aria-label="Features and architecture">
        <div>
          <p className="label">What’s inside</p>
          <h2 className="ef-h2 ef-h2-sm">One workspace, nothing extra</h2>
          <ul className="ef-checks">
            {f.features.map((x) => <li key={x}><span className="ef-box" aria-hidden="true" />{x}</li>)}
          </ul>
        </div>
        <figure className="arch" data-reveal aria-labelledby="ef-arch">
          <figcaption id="ef-arch" className="label">How it’s built</figcaption>
          <ol className="arch-flow">
            {f.architecture.map((a, i) => (
              <li key={a.layer} className={`arch-node c-${(["discover", "build", "ship"] as const)[i % 3]}`}>
                <span className="label">{a.layer}</span>
                <strong>{a.tech}</strong>
                <span className="arch-role">{a.role}</span>
              </li>
            ))}
          </ol>
          <p className="arch-rt"><span className="dot dot-live" aria-hidden="true" />{f.realtime}</p>
        </figure>
      </section>

      {!isPlaceholder(p.outcome) && (
        <section className="wrap ef-outcome" aria-label="Outcome"><p className="label">Outcome</p><p>{p.outcome}</p></section>
      )}

      {/* the thread to the open-source work */}
      <section className="wrap" aria-label="Related">
        <Link href={projectHref("easyflow-whiteboard")!} className="ef-spinoff" data-reveal>
          <span className="label c-signal">Spin-off</span>
          <span className="ef-spinoff-t">{f.note}</span>
          <span className="ef-spinoff-go">See the package →</span>
        </Link>
      </section>

      <ProjectEnd slug={p.slug} />
    </main>
  );
}
