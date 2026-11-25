import type { Metadata } from "next";
import Link from "next/link";
import BrowserShots from "@/components/BrowserShots";
import DragBoard from "@/components/project/DragBoard";
import { ProjectCrumb, ProjectEnd } from "@/components/project/ProjectEnd";
import { libraries, ossStory, isPlaceholder, projectHref } from "@/content/site";
import { projectGraph, toJsonLd } from "@/lib/structured-data";

const l = libraries.find((x) => x.slug === "easyflow-whiteboard")!;

export const metadata: Metadata = {
  title: `${l.product}: an embeddable React whiteboard on npm`,
  description: `${l.tagline} ${l.description}`,
  alternates: { canonical: projectHref(l.slug) },
  openGraph: { title: `${l.product}, an open-source package by Muhammad Hamza`, description: l.tagline, images: l.images?.[0] ? [{ url: l.images[0].src, width: l.images[0].w, height: l.images[0].h, alt: l.images[0].alt }] : undefined },
};

const noteColor = ["discover", "design", "build", "signal"];
const tilt = [-2.5, 1.8, -1.2, 2.2];

/** The whole page sits on a whiteboard: a dotted canvas, sticky notes, nodes with handles, connectors. */
export default function WhiteboardPage() {
  return (
    <main id="main" className="pj wb-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(projectGraph(l.slug)) }} />

      <section className="wb-hero" aria-labelledby="wb-title">
        <div className="wrap">
          <ProjectCrumb slug={l.slug} />
          <div className="wb-hero-head">
            <div>
              <p className="label c-signal">npm package{l.version ? ` · ${l.version}` : ""} · MIT</p>
              <h1 id="wb-title" className="wb-name">{l.product.split(" ").map((w, i) => <span key={w}>{i > 0 && <br />}{w}</span>)}</h1>
              <p className="wb-tag">{l.tagline}</p>
            </div>
            <div className="wb-hero-side">
              <code className="oss-install"><span aria-hidden="true">$ </span>{l.install}</code>
              <div className="pj-actions">
                {l.playgroundUrl && <a className="btn btn-signal" href={l.playgroundUrl} rel="noopener">Try the playground ↗</a>}
                {l.docsUrl && <a className="btn" href={l.docsUrl} rel="noopener">Docs</a>}
                <a className="btn" href={l.npmUrl} rel="noopener">npm</a>
                {!isPlaceholder(l.repoUrl) && <a className="btn" href={l.repoUrl} rel="noopener">Source</a>}
              </div>
            </div>
          </div>
          <DragBoard />
        </div>
      </section>

      {/* WHY: the origin story as sticky notes joined by connectors */}
      <section className="wrap wb-why" aria-labelledby="wb-why-title">
        <p className="label">Why it exists</p>
        <h2 id="wb-why-title" className="pj-h2">{l.why}</h2>
        <ol className="wb-notes">
          {ossStory.steps.map((s, i) => (
            <li key={s.k} className={`wb-note n-${noteColor[i]}`} data-tilt={tilt[i]} style={{ ["--tilt" as string]: `${tilt[i]}deg` }}>
              <span className="label">{String(i + 1).padStart(2, "0")} · {s.k}</span>
              <p>{s.text}</p>
              {i < ossStory.steps.length - 1 && <span className="wb-wire" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </section>

      {/* THE REAL THING */}
      <section className="wrap wb-shots" aria-labelledby="wb-shots-title">
        <div className="wb-frame-label">
          <p className="label">The real package</p>
          <h2 id="wb-shots-title" className="pj-h2">Everything a board needs, already wired</h2>
          <p className="pj-lead">{l.description}</p>
        </div>
        <div data-tilt>{l.images && <BrowserShots shots={l.images} url={l.docsUrl || l.npmUrl} name={l.product} />}</div>
      </section>

      {/* FEATURES: each one is a node, with connection handles like on the board */}
      {l.points && (
        <section className="wrap wb-features" aria-labelledby="wb-feat-title">
          <p className="label">What you get</p>
          <h2 id="wb-feat-title" className="pj-h2">Built for the board you actually need</h2>
          <ul className="wb-nodes">
            {l.points.map((pt, i) => (
              <li key={pt} className="wb-node" data-reveal data-delay={i * 0.06}>
                <i className="wb-h wb-h-t" /><i className="wb-h wb-h-r" /><i className="wb-h wb-h-b" /><i className="wb-h wb-h-l" />
                <span className="label">Node {String(i + 1).padStart(2, "0")}</span>
                <p>{pt}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* DROP IN: the code, the install, the specs */}
      <section className="wrap wb-code" aria-labelledby="wb-code-title">
        <div>
          <p className="label">Drop it in</p>
          <h2 id="wb-code-title" className="pj-h2">One component. Your nodes. Your storage.</h2>
          {l.facts && (
            <dl className="oss-facts">
              {l.facts.map((x) => <div key={x.k}><dt className="label">{x.k}</dt><dd>{x.v}</dd></div>)}
            </dl>
          )}
        </div>
        <pre className="pj-code" data-file="Board.tsx" aria-label={`${l.product} usage`}><code>{l.usage}</code></pre>
      </section>

      <section className="wrap" aria-label="Related">
        <Link href={projectHref("easyflow")!} className="ef-spinoff" data-reveal>
          <span className="label c-signal">Where it came from</span>
          <span className="ef-spinoff-t">It started as the whiteboard inside EasyFlow, my project management tool.</span>
          <span className="ef-spinoff-go">See EasyFlow →</span>
        </Link>
      </section>

      <ProjectEnd slug={l.slug} />
    </main>
  );
}
