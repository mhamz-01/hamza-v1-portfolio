import {
  SITE_URL,
  person,
  products,
  libraries,
  mobileApps,
  experience,
  certifications,
  faqs,
  stack,
  writings,
  isPlaceholder,
  projectPages,
} from "@/content/site";

const clean = <T,>(arr: (T | false | null | undefined)[]) => arr.filter(Boolean) as T[];

export const personId = `${SITE_URL}/#person`;

export function personNode() {
  const sameAs = clean<string>([
    !isPlaceholder(person.links.linkedin) && person.links.linkedin,
    !isPlaceholder(person.links.github) && person.links.github,
    person.links.x || null,
  ]);
  return {
    "@type": "Person",
    "@id": personId,
    name: person.name,
    alternateName: person.shortName,
    url: SITE_URL,
    jobTitle: person.jobTitle,
    description: person.summary,
    ...(isPlaceholder(person.email) ? {} : { email: `mailto:${person.email}` }),
    ...(isPlaceholder(person.location) ? {} : { address: { "@type": "PostalAddress", addressLocality: person.location } }),
    worksFor: {
      "@type": "Organization",
      name: person.employer.name,
      ...(person.employer.url ? { url: person.employer.url } : {}),
    },
    hasOccupation: {
      "@type": "Occupation",
      name: person.jobTitle,
      skills: stack.flatMap((g) => g.items).filter((s) => !isPlaceholder(s)).join(", "),
    },
    knowsAbout: stack.flatMap((g) => g.items).filter((s) => !isPlaceholder(s)),
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: person.degree,
      },
      ...certifications.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certificate",
        name: c.name,
        ...(isPlaceholder(c.issuer) ? {} : { recognizedBy: { "@type": "Organization", name: c.issuer } }),
      })),
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function homeGraph() {
  const realProducts = products.filter((p) => !isPlaceholder(p.name));
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: `${person.name} — ${person.jobTitle}`,
      inLanguage: "en",
      publisher: { "@id": personId },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profile`,
      url: SITE_URL,
      name: `${person.name}, ${person.jobTitle}`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": personId },
      about: { "@id": personId },
      dateModified: new Date().toISOString().slice(0, 10),
    },
    personNode(),
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#experience`,
      name: `${person.name}: experience`,
      itemListElement: experience.map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "OrganizationRole",
          roleName: e.role,
          startDate: e.start,
          ...(e.end ? { endDate: e.end } : {}),
          description: `${e.role} at ${e.org}. ${e.note}`,
        },
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
  if (realProducts.length) {
    graph.push({
      "@type": "ItemList",
      "@id": `${SITE_URL}/#products`,
      name: `Products built by ${person.name}`,
      itemListElement: realProducts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "CreativeWork",
          name: p.name,
          description: [p.problem.replace(/\.?$/, "."), p.summary, isPlaceholder(p.outcome) ? "" : `Outcome: ${p.outcome}.`].filter(Boolean).join(" "),
          creator: { "@id": personId },
          ...(p.url ? { url: p.url } : {}),
          keywords: p.stack.filter((s) => !isPlaceholder(s)).join(", "),
        },
      })),
    });
  }
  const realLibs = libraries.filter((l) => !isPlaceholder(l.name));
  if (realLibs.length) {
    graph.push({
      "@type": "ItemList",
      "@id": `${SITE_URL}/#open-source`,
      name: `npm packages published by ${person.name}`,
      itemListElement: realLibs.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareSourceCode",
          name: l.name,
          description: `${l.tagline} ${l.description}`,
          author: { "@id": personId },
          programmingLanguage: l.stack.filter((x) => !isPlaceholder(x)).join(", "),
          ...(isPlaceholder(l.repoUrl) ? {} : { codeRepository: l.repoUrl }),
          ...(isPlaceholder(l.npmUrl) ? {} : { url: l.npmUrl }),
        },
      })),
    });
  }
  const realApps = mobileApps.filter((a) => !isPlaceholder(a.name));
  if (realApps.length) {
    graph.push({
      "@type": "ItemList",
      "@id": `${SITE_URL}/#mobile-apps`,
      name: `Mobile apps by ${person.name}`,
      itemListElement: realApps.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "MobileApplication",
          name: a.name,
          description: `${a.idea} ${a.summary}`,
          creator: { "@id": personId },
        },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export function articleGraph(slug: string) {
  const w = writings.find((x) => x.slug === slug);
  if (!w) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: w.title,
    description: w.summary,
    datePublished: w.date,
    url: `${SITE_URL}/writing/${w.slug}/`,
    author: { "@type": "Person", "@id": personId, name: person.name, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/writing/${w.slug}/`,
  };
}

/** A project page: the product or package itself, plus a breadcrumb back to the portfolio. */
export function projectGraph(slug: string) {
  const page = projectPages.find((x) => x.slug === slug)!;
  const url = `${SITE_URL}${page.href}`;
  const p = products.find((x) => x.slug === slug);
  const l = libraries.find((x) => x.slug === slug);
  const item = p
    ? {
        "@type": "WebApplication",
        name: p.name,
        description: `${p.problem} ${p.summary}`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        ...(p.url ? { url: p.url } : {}),
        creator: { "@id": personId },
        keywords: p.stack.join(", "),
      }
    : {
        "@type": "SoftwareSourceCode",
        name: l!.name,
        description: `${l!.tagline} ${l!.description}`,
        author: { "@id": personId },
        programmingLanguage: l!.stack.filter((x) => !isPlaceholder(x)).join(", "),
        license: "https://opensource.org/licenses/MIT",
        ...(isPlaceholder(l!.repoUrl) ? {} : { codeRepository: l!.repoUrl }),
        url: l!.npmUrl,
      };
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${url}#page`, url, name: page.name, about: item, author: { "@id": personId } },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: person.name, item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: page.name, item: url },
        ],
      },
    ],
  };
}

/** Use inside <script type="application/ld+json">: escapes "<" so content can't close the tag. */
export const toJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
