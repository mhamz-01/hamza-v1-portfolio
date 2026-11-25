import Link from "next/link";
import DotField from "@/components/DotField";
import ScrollFX from "@/components/ScrollFX";
import StreamLine from "@/components/StreamLine";
import {
  ossStory,
  projectHref,
  person,
  manifesto,
  whyHire,
  stack,
  products,
  libraries,
  mobileApps,
  experience,
  writings,
  faqs,
  sections,
  certifications,
  isPlaceholder,
  type Phase,
} from "@/content/site";
import { homeGraph, toJsonLd } from "@/lib/structured-data";

const phaseLabel: Record<Phase, string> = { discover: "01 Discover", design: "02 Design", build: "03 Build", ship: "04 Ship" };

// phrases in the manifesto that pick up a phase colour as they light up
const highlights: [string, string][] = [
  ["real client projects", "c-discover"],
  ["client’s chair", "c-design"],
  ["ship what they need fast,", "c-build"],
  ["better v2.", "c-ship"],
];

function Words({ text }: { text: string }) {
  const marks: string[] = new Array(text.split(" ").length).fill("");
  const words = text.split(" ");
  highlights.forEach(([phrase, cls]) => {
    const p = phrase.split(" ");
    for (let i = 0; i <= words.length - p.length; i++) {
      if (p.every((w, j) => words[i + j] === w)) p.forEach((_, j) => (marks[i + j] = cls));
    }
  });
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className={`w ${marks[i]}`}>
          {w}{" "}
        </span>
      ))}
    </>
  );
}

/** A small animated diagram per reason (CSS-driven, plays when the card becomes active). */
function ReasonVisual({ i }: { i: number }) {
  const common = { className: `rv rv-${i}`, viewBox: "0 0 240 200", focusable: "false" as const };
  if (i === 0) {
    // what is written vs what is actually needed
    return (
      <svg {...common}>
        <circle className="rv-needed" cx="120" cy="100" r="82" fill="none" stroke="var(--signal)" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" />
        <circle className="rv-needed-fill" cx="120" cy="100" r="82" fill="var(--signal)" fillOpacity="0.07" />
        <circle className="rv-written" cx="120" cy="100" r="34" fill="var(--text)" fillOpacity="0.1" stroke="var(--text)" strokeWidth="2" />
        <text className="rv-t" x="120" y="104" textAnchor="middle">WRITTEN</text>
        <text className="rv-t rv-needed-label" x="120" y="9" textAnchor="middle" fill="var(--signal)">WHAT YOU NEED</text>
      </svg>
    );
  }
  if (i === 1) {
    // v1 -> feedback -> v2, an orbit
    return (
      <svg {...common}>
        <circle cx="120" cy="100" r="72" fill="none" stroke="var(--hair-2)" strokeWidth="2" />
        <g className="rv-orbit"><circle cx="120" cy="28" r="9" fill="var(--signal)" /></g>
        <text className="rv-t rv-big rv-v1" x="120" y="108" textAnchor="middle">v1</text>
        <text className="rv-t rv-big rv-v2" x="120" y="108" textAnchor="middle" fill="var(--signal)">v2</text>
        <text className="rv-t" x="120" y="192" textAnchor="middle">LIVE FROM WEEK 1. THEN BETTER.</text>
      </svg>
    );
  }
  if (i === 2) {
    // AI, with a hand on the switch
    return (
      <svg {...common}>
        <rect x="46" y="74" width="148" height="52" rx="26" fill="var(--surface-2)" stroke="var(--text-2)" strokeWidth="2" />
        <circle className="rv-knob" cx="72" cy="100" r="19" fill="var(--build)" />
        <text className="rv-t" x="72" y="156" textAnchor="middle">USE AI</text>
        <text className="rv-t" x="168" y="156" textAnchor="middle">USE JUDGMENT</text>
        <text className="rv-t" x="120" y="44" textAnchor="middle" fill="var(--text-3)">KNOWS WHEN</text>
      </svg>
    );
  }
  // criticism -> growth: steps
  const bars = [
    { x: 34, h: 36, c: "var(--discover)" },
    { x: 80, h: 68, c: "var(--design)" },
    { x: 126, h: 100, c: "var(--build)" },
    { x: 172, h: 132, c: "var(--signal)" },
  ];
  return (
    <svg {...common}>
      {bars.map((b, k) => (
        <rect key={k} className={`rv-bar b${k}`} x={b.x} y={170 - b.h} width="34" height={b.h} rx="3" fill={b.c} />
      ))}
      <line x1="20" y1="172" x2="220" y2="172" stroke="var(--hair-2)" strokeWidth="2" />
      <text className="rv-t" x="120" y="192" textAnchor="middle">UNLEARN. LEARN. REPEAT.</text>
    </svg>
  );
}

/** A screenshot in a small browser frame, for the overview cards. */
function MiniShot({ src, alt, w, h }: { src: string; alt: string; w: number; h: number }) {
  return (
    <div className="mini-shot">
      <span className="mini-bar" aria-hidden="true"><i /><i /><i /></span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={w} height={h} loading="lazy" decoding="async" />
    </div>
  );
}

export default function Home() {
  const published = writings.filter((w) => w.published);
  const featuredProducts = products.filter((p) => p.featured);
  const otherProducts = products.filter((p) => !p.featured);
  const email = isPlaceholder(person.email) ? null : person.email;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(homeGraph()) }} />
      <DotField />
      <ScrollFX />

      <header className="topbar">
        <a href="#top" className="wordmark" aria-label={`${person.name}, home`}>HAMZA</a>
        <nav aria-label="Primary" className="topnav">
          <a href="#why">Why hire</a>
          <a href="#work">Products</a>
          <a href="#oss">Open source</a>
          <a href="#experience">Experience</a>
          <Link href="/writing/">Writing</Link>
        </nav>
        <a href="#contact" className="btn btn-signal">Start a project</a>
      </header>

      <nav className="rail" aria-label="Sections">
        <div className="rail-track" aria-hidden="true"><span className="rail-fill" /></div>
        <ol>
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`}><span className="rail-n">{s.n}</span><span className="rail-label">{s.label}</span></a>
            </li>
          ))}
        </ol>
      </nav>

      <main id="main">
        {/* 00 HERO */}
        <section id="top" className="hero" data-scene="0" aria-labelledby="hero-title">
          <div className="wrap">
            <p className="label" data-hero-in>{person.jobTitle}{isPlaceholder(person.location) ? "" : ` / ${person.location}`}</p>
            <h1 id="hero-title" className="hero-name">
              <span className="line">Muhammad</span>
              <span className="line">Hamza</span>
            </h1>
            <p className="hero-lede" data-hero-in>{person.tagline}</p>
            <div className="hero-meta" data-hero-in>
              <p className="pill"><span className="dot dot-live" aria-hidden="true" />{person.jobTitle} at {person.employer.name}</p>
              <StreamLine lines={["sitting in the client’s chair", "separating needs from wants", "shipping v1", "pushing v2: needs + wants"]} />
            </div>
          </div>
          <a href="#why" className="scroll-cue" data-hero-in>Scroll</a>
        </section>

        {/* 01 WHY HIRE */}
        <section id="why" className="why" data-scene="1" aria-labelledby="why-title">
          <div className="story-pin">
            <div className="wrap story-inner">
              <h2 id="why-title" className="label">01 / Why hire Hamza</h2>
              <div className="story-text">
                {manifesto.map((m, i) => (
                  <p key={i}><Words text={m} /></p>
                ))}
              </div>
              <div className="story-progress" aria-hidden="true"><span /></div>
            </div>
          </div>
          {/* one reason at a time: each card owns the screen, scroll brings the next */}
          <div className="reasons-pin">
            <div className="wrap reasons-inner">
              <div className="reasons-top" aria-hidden="true">
                <p className="label"><span className="rc-now">01</span> / {String(whyHire.length).padStart(2, "0")}</p>
                <div className="rc-bar">{whyHire.map((r) => <span key={r.k} />)}</div>
              </div>
              <ul className="reasons">
                {whyHire.map((r, i) => (
                  <li key={r.k} className={`reason card${i === 0 ? " is-active" : ""}`}>
                    <div className="reason-text">
                      <span className="reason-n label c-signal" data-r>{r.k}</span>
                      <h3 data-r>{r.title}</h3>
                      <p data-r>{r.body}</p>
                    </div>
                    <div className="reason-visual" aria-hidden="true"><ReasonVisual i={i} /></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 02 STACK */}
        <section id="stack" className="stack" data-scene="2" aria-labelledby="stack-title">
          <div className="wrap">
            <p className="label">02 / Stack</p>
            <h2 id="stack-title" className="h2" data-reveal>Frontend to backend to AI, and the judgment to pick the right tool.</h2>
          </div>
          <div className="marquee" aria-hidden="true">
            {[0, 1].map((r) => (
              <div className="marquee-row" key={r}>
                {[...stack, ...stack].map((g, i) =>
                  g.items.filter((it) => !isPlaceholder(it)).map((it) => (
                    <span key={`${r}-${i}-${it}`} className={r ? "outline" : ""}>{it}</span>
                  ))
                )}
              </div>
            ))}
          </div>
          <div className="wrap">
            <dl className="stack-grid">
              {stack.map((g, i) => (
                <div key={g.group} className="stack-group" data-reveal data-delay={i * 0.05}>
                  <dt className="label">{g.group}</dt>
                  {g.items.map((it) => (
                    <dd key={it} className={isPlaceholder(it) ? "placeholder" : ""}>{it}</dd>
                  ))}
                </div>
              ))}
            </dl>
            <p className="certs" data-reveal>
              <span className="label">Certified</span>
              {certifications.map((c) => (
                <span key={c.name} className="chip">{c.name}</span>
              ))}
            </p>
          </div>
        </section>

        {/* 03 PRODUCTS: a short overview; each project has its own page */}
        <section id="work" className="work" data-scene="3" aria-labelledby="work-title">
          <div className="wrap">
            <p className="label">03 / Products</p>
            <h2 id="work-title" className="h2" data-reveal>Products with real users, taken from first call to launch.</h2>

            {featuredProducts.map((p, i) => {
              const f = p.featured!;
              const href = projectHref(p.slug);
              return (
                <article key={p.slug} className="ov-feature" aria-labelledby={`ov-${p.slug}`} data-reveal>
                  <MiniShot {...f.images[0]} />
                  <div className="ov-feature-body">
                    <p className="label ov-meta">
                      <span className="c-signal">CASE_{String(i + 1).padStart(2, "0")}</span>
                      <span className="users"><span className="dot dot-live" aria-hidden="true" />{p.users}</span>
                    </p>
                    <h3 id={`ov-${p.slug}`} className="ov-name">{p.name}</h3>
                    <p className="ov-tag">{f.tagline}</p>
                    <p className="ov-sum">{f.audience}</p>
                    <p className="label ov-stack">{p.stack.join(" · ")}</p>
                    <div className="ov-actions">
                      {href && <Link className="btn btn-signal" href={href}>Read the case study →</Link>}
                      {p.url && <a className="btn" href={p.url} rel="noopener">Visit site ↗</a>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {otherProducts.length > 0 && (
          <div className="work-pin">
            <div className="wrap work-head">
              <p className="label">More products</p>
            </div>
            <div className="work-track">
              {otherProducts.map((p, i) => (
                <article key={p.slug} className="product card" aria-labelledby={`p-${p.slug}`}>
                  <div className="product-top">
                    <span className="label">CASE_{String(i + 1 + featuredProducts.length).padStart(2, "0")}</span>
                    <span className="label">{p.stack.join(" · ")}</span>
                  </div>
                  <p className="users label"><span className="dot dot-live" aria-hidden="true" />{p.users}</p>
                  <p className="product-name label c-signal">{p.name}</p>
                  <h3 id={`p-${p.slug}`}>{p.problem}</h3>
                  <p className="product-sum">{p.summary}</p>
                  <ul className="phases" aria-label="Phases owned">
                    {p.phases.map((ph) => (
                      <li key={ph} className={`phase c-${ph}`}><span className="sq" aria-hidden="true" />{phaseLabel[ph]}</li>
                    ))}
                  </ul>
                  <p className="outcome">{p.outcome}</p>
                </article>
              ))}
              <div className="product product-end" aria-hidden="true">
                <span className="big-n">{String(products.length).padStart(2, "0")}</span>
                <p className="label">and counting</p>
              </div>
            </div>
          </div>
          )}
        </section>

        {/* 04 OPEN SOURCE: one card per package; the full story is on each package's page */}
        <section id="oss" className="oss" aria-labelledby="oss-title">
          <div className="wrap">
            <p className="label">04 / Open source</p>
            <h2 id="oss-title" className="h2 ov-h2" data-reveal>{ossStory.title}</h2>
            <p className="ov-lede" data-reveal>Both came out of building EasyFlow. Both are free under MIT.</p>
            <ul className="ov-pkgs">
              {libraries.map((l, i) => (
                <li key={l.slug} className="ov-pkg" data-reveal data-delay={i * 0.08}>
                  {l.images?.[0] && <MiniShot {...l.images[0]} />}
                  <p className="label ov-meta"><span className="c-signal">npm package</span><span>{l.stack.slice(0, 3).join(" · ")}</span></p>
                  <h3><Link className="ov-link" href={projectHref(l.slug) || l.npmUrl}>{l.product}</Link></h3>
                  <p className="ov-tag">{l.tagline}</p>
                  <code className="oss-install"><span aria-hidden="true">$ </span>{l.install}</code>
                  <span className="ov-go label" aria-hidden="true">See the package →</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 05 MOBILE APPS */}
        <section id="apps" className="apps" aria-labelledby="apps-title">
          <div className="wrap">
            <p className="label">05 / Mobile apps</p>
            <h2 id="apps-title" className="h2" data-reveal>Two of my own ideas, built and ready to launch.</h2>
            <ul className="oss-grid">
              {mobileApps.map((a, i) => (
                <li key={a.slug} className="oss-card card" data-reveal data-delay={i * 0.08}>
                  <div className="product-top">
                    <span className="label c-signal">{a.platforms}</span>
                    <span className="label">{a.stack.join(" · ")}</span>
                  </div>
                  <h3>{a.name}</h3>
                  <p className="oss-tag">{a.idea}</p>
                  <p className="product-sum">{a.summary}</p>
                  <p className="label app-status"><span className="dot" aria-hidden="true" />{a.status}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 06 EXPERIENCE */}
        <section id="experience" className="experience" data-scene="4" aria-labelledby="exp-title">
          <div className="wrap">
            <p className="label">06 / Experience</p>
            <h2 id="exp-title" className="h2" data-reveal>From intern to full-stack engineer in two years.</h2>
            <div className="timeline">
            <span className="timeline-line" aria-hidden="true"><span className="timeline-fill" /></span>
            <ol>
              {experience.map((e, i) => (
                <li key={e.start} className={i === 0 ? "current" : ""}>
                  <span className="node" aria-hidden="true" />
                  <p className="label"><time dateTime={e.start}>{e.when}</time></p>
                  <h3>{e.role}</h3>
                  <p className="org">{e.org}</p>
                  <p className="note">{e.note}</p>
                </li>
              ))}
            </ol>
            </div>
          </div>
        </section>

        {/* 07 WRITING */}
        <section id="writing" className="writing" data-scene="5" aria-labelledby="writing-title">
          <div className="wrap">
            <p className="label">07 / Writing</p>
            <h2 id="writing-title" className="h2" data-reveal>Notes on building for clients, shipping fast and working with AI.</h2>
            <ul className="posts">
              {writings.map((w) => (
                <li key={w.slug} data-reveal>
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
            {published.length > 0 && <Link className="btn" href="/writing/">All writing</Link>}
          </div>
        </section>

        {/* 08 CONTACT + ANSWERS */}
        <section id="contact" className="contact" data-scene="6" aria-labelledby="contact-title">
          <div className="wrap">
            <p className="label">08 / Contact</p>
            <h2 id="contact-title" className="cta-big">Let’s build<br />your v1.</h2>
            <p className="contact-lede">{isPlaceholder(person.availability) ? "Tell me what you need. I’ll tell you honestly what it takes." : person.availability}</p>
            <div className="contact-actions">
              <a className="btn btn-signal" href={email ? `mailto:${email}` : "#contact"}>{email ? "Email Hamza" : "[Add email]"}</a>
              {!isPlaceholder(person.links.linkedin) && <a className="btn" href={person.links.linkedin} rel="me">LinkedIn</a>}
              {!isPlaceholder(person.links.github) && <a className="btn" href={person.links.github} rel="me">GitHub</a>}
            </div>

            <div className="faq" aria-labelledby="faq-title">
              <h2 id="faq-title" className="label">Quick answers</h2>
              <dl>
                {faqs.map((f) => (
                  <div key={f.q} className="faq-item" data-reveal>
                    <dt>{f.q}</dt>
                    <dd>{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <footer className="footer wrap">
            <p className="label">© {new Date().getFullYear()} {person.name}</p>
            <p className="label"><a href="/llms.txt">llms.txt</a> · <a href="/sitemap.xml">Sitemap</a></p>
          </footer>
        </section>
      </main>
    </>
  );
}
