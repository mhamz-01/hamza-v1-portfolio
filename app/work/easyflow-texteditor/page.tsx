import type { Metadata } from "next";
import Link from "next/link";
import BrowserShots from "@/components/BrowserShots";
import { ProjectCrumb, ProjectEnd } from "@/components/project/ProjectEnd";
import { libraries, isPlaceholder, projectHref } from "@/content/site";
import { projectGraph, toJsonLd } from "@/lib/structured-data";

const l = libraries.find((x) => x.slug === "easyflow-texteditor")!;

export const metadata: Metadata = {
  title: `${l.product}: a Tiptap 3 document editor for React`,
  description: `${l.tagline} ${l.description}`,
  alternates: { canonical: projectHref(l.slug) },
  openGraph: { title: `${l.product}, an open-source package by Muhammad Hamza`, description: l.tagline, images: l.images?.[0] ? [{ url: l.images[0].src, width: l.images[0].w, height: l.images[0].h, alt: l.images[0].alt }] : undefined },
};

// the page's own sidebar: tabs and subtabs, exactly like the package's
const tabs: { id: string; label: string; sub?: boolean }[] = [
  { id: "overview", label: "Overview" },
  { id: "why", label: "Why I built it" },
  { id: "screens", label: "Screens" },
  { id: "features", label: "Features" },
  { id: "specs", label: "Specs", sub: true },
  { id: "usage", label: "Usage", sub: true },
];

const tools = ["B", "I", "U", "S", "|", "H1", "H2", "|", "•", "1.", "|", "img", "tbl", "link"];

/** The whole page is a document open in the editor: sidebar, toolbar, save badge, blocks. */
export default function EditorPage() {
  return (
    <main id="main" className="pj ed-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(projectGraph(l.slug)) }} />
      <div className="wrap">
        <ProjectCrumb slug={l.slug} />
      </div>

      <div className="wrap ed">
        <nav className="ed-side" aria-label="On this page">
          <p className="label ed-side-title"><span className="ed-doc-ico" aria-hidden="true" />Documents</p>
          <ul>
            {tabs.map((t) => (
              <li key={t.id} className={t.sub ? "sub" : ""}><a href={`#${t.id}`}>{t.label}</a></li>
            ))}
          </ul>
          <p className="label ed-side-add" aria-hidden="true">+ New page</p>
        </nav>

        <div className="ed-doc">
          <div className="ed-toolbar" aria-hidden="true">
            <span className="ed-tools">
              {tools.map((t, i) => (t === "|" ? <i key={i} /> : <b key={i} className={t === "H1" ? "on" : ""}>{t}</b>))}
            </span>
            <span className="ed-save" data-state="saved"><span className="ed-save-dot" /><span className="ed-save-text">Saved</span></span>
          </div>

          <article className="ed-paper">
            <section id="overview" className="ed-sec" aria-labelledby="ed-title">
              <p className="label c-signal">npm package{l.version ? ` · ${l.version}` : ""} · MIT · {l.stack.join(" · ")}</p>
              <h1 id="ed-title" className="ed-title" data-type>{l.product}</h1>
              <p className="ed-lead">{l.tagline}</p>
              <p>{l.description}</p>
              <code className="oss-install"><span aria-hidden="true">$ </span>{l.install}</code>
              <div className="pj-actions">
                {l.playgroundUrl && <a className="btn btn-signal" href={l.playgroundUrl} rel="noopener">Open the playground ↗</a>}
                {l.docsUrl && <a className="btn" href={l.docsUrl} rel="noopener">Docs</a>}
                <a className="btn" href={l.npmUrl} rel="noopener">npm</a>
                {!isPlaceholder(l.repoUrl) && <a className="btn" href={l.repoUrl} rel="noopener">Source</a>}
              </div>
            </section>

            <section id="why" className="ed-sec" aria-labelledby="ed-why">
              <h2 id="ed-why">Why I built it</h2>
              <blockquote className="ed-quote"><p>{l.why}</p></blockquote>
              <p>
                Like its sibling, the <Link href={projectHref("easyflow-whiteboard")!}>EasyFlow Whiteboard</Link>, it comes from building{" "}
                <Link href={projectHref("easyflow")!}>EasyFlow</Link>, my project management tool.
              </p>
            </section>

            <section id="screens" className="ed-sec" aria-labelledby="ed-screens">
              <h2 id="ed-screens">Screens</h2>
              <figure className="ed-img">
                <i className="ed-grip g-tl" aria-hidden="true" /><i className="ed-grip g-tr" aria-hidden="true" />
                <i className="ed-grip g-bl" aria-hidden="true" /><i className="ed-grip g-br" aria-hidden="true" />
                {l.images && <BrowserShots shots={l.images} url={l.docsUrl || l.npmUrl} name={l.product} />}
                <figcaption className="label">The editor in both themes. Same component, one prop.</figcaption>
              </figure>
            </section>

            {l.points && (
              <section id="features" className="ed-sec" aria-labelledby="ed-feat">
                <h2 id="ed-feat">Features</h2>
                <ul className="ed-list">
                  {l.points.map((pt) => <li key={pt}>{pt}</li>)}
                </ul>
              </section>
            )}

            {l.facts && (
              <section id="specs" className="ed-sec" aria-labelledby="ed-specs">
                <h2 id="ed-specs">Specs</h2>
                <div className="ed-table-wrap">
                  <table className="ed-table">
                    <thead><tr><th scope="col">Spec</th><th scope="col">Value</th></tr></thead>
                    <tbody>{l.facts.map((x) => <tr key={x.k}><th scope="row">{x.k}</th><td>{x.v}</td></tr>)}</tbody>
                  </table>
                </div>
              </section>
            )}

            <section id="usage" className="ed-sec" aria-labelledby="ed-usage">
              <h2 id="ed-usage">Usage</h2>
              <p>Give it your tabs and a save function. The sidebar, autosave and the Saving / Saved badge come with it.</p>
              <pre className="pj-code" data-file="Docs.tsx" aria-label={`${l.product} usage`}><code>{l.usage}</code></pre>
            </section>
          </article>
        </div>
      </div>

      <ProjectEnd slug={l.slug} />
    </main>
  );
}
