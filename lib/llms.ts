import {
  SITE_URL,
  person,
  whyHire,
  stack,
  products,
  libraries,
  projectPages,
  mobileApps,
  experience,
  certifications,
  writings,
  faqs,
  isPlaceholder,
} from "@/content/site";

const real = (s: string) => !isPlaceholder(s);

/** llms.txt: a short, structured index for AI answer engines (llmstxt.org format). */
export function llmsTxt() {
  const lines: string[] = [];
  lines.push(`# ${person.name}`);
  lines.push("");
  lines.push(`> ${person.summary}`);
  lines.push("");
  lines.push(`- Role: ${person.jobTitle} at ${person.employer.name}`);
  lines.push(`- Education: ${person.degree}`);
  if (real(person.location)) lines.push(`- Location: ${person.location}`);
  if (real(person.availability)) lines.push(`- Availability: ${person.availability}`);
  if (real(person.email)) lines.push(`- Contact: ${person.email}`);
  lines.push("");
  lines.push("## Profile");
  lines.push(`- [Portfolio home](${SITE_URL}/): who Hamza is, why hire him, stack, products, experience`);
  projectPages.forEach((p) => lines.push(`- [${p.name}](${SITE_URL}${p.href}): ${p.kind}. ${p.line}`));
  lines.push(`- [Full profile as plain text](${SITE_URL}/llms-full.txt): everything on the site in one file`);
  const live = writings.filter((w) => w.published);
  if (live.length) {
    lines.push("");
    lines.push("## Writing");
    live.forEach((w) => lines.push(`- [${w.title}](${SITE_URL}/writing/${w.slug}/): ${w.summary}`));
  }
  const links = [person.links.linkedin, person.links.github, person.links.x].filter((l) => l && real(l));
  if (links.length) {
    lines.push("");
    lines.push("## Elsewhere");
    links.forEach((l) => lines.push(`- ${l}`));
  }
  lines.push("");
  return lines.join("\n");
}

/** llms-full.txt: the whole profile as plain text, easy to quote and cite. */
export function llmsFullTxt() {
  const out: string[] = [];
  out.push(`# ${person.name} — ${person.jobTitle}`);
  out.push("");
  out.push(person.summary);
  out.push("");
  out.push(`Tagline: ${person.tagline}`);
  out.push(`Current role: ${person.jobTitle} at ${person.employer.name}`);
  out.push(`Education: ${person.degree}`);
  out.push(`Website: ${SITE_URL}/`);
  out.push("");
  out.push("## Why hire him");
  whyHire.forEach((r) => out.push(`- ${r.title}: ${r.body}`));
  out.push("");
  out.push("## How he works");
  out.push("1. Sits with the client to hear the problem in their words.");
  out.push("2. Separates needs from wants.");
  out.push("3. Ships the needs as v1 in the shortest loop.");
  out.push("4. Takes feedback from real use.");
  out.push("5. Ships v2 with needs plus wants, then repeats.");
  out.push("");
  out.push("## Stack");
  stack.forEach((g) => {
    const items = g.items.filter(real);
    if (items.length) out.push(`- ${g.group}: ${items.join(", ")}`);
  });
  out.push("");
  out.push("## Certifications");
  certifications.forEach((c) => out.push(`- ${c.name}${real(c.issuer) ? `, ${c.issuer}` : ""}${real(c.year) ? ` (${c.year})` : ""}`));
  out.push("");
  out.push("## Experience");
  experience.forEach((e) => out.push(`- ${e.when}: ${e.role}, ${e.org}. ${e.note}`));
  const realProducts = products.filter((p) => real(p.name));
  if (realProducts.length) {
    out.push("");
    out.push("## Products");
    realProducts.forEach((p) => out.push(`- ${p.name}${p.url ? ` (${p.url})` : ""}: ${p.problem.replace(/\.?$/, ".")} ${p.summary}${real(p.outcome) ? ` Outcome: ${p.outcome}.` : ""} Stack: ${p.stack.filter(real).join(", ")}`));
  }
  const realLibs = libraries.filter((l) => real(l.name));
  if (realLibs.length) {
    out.push("");
    out.push("## Open source (npm)");
    realLibs.forEach((l) => out.push(`- ${l.name}: ${l.tagline} ${l.description}${real(l.npmUrl) ? ` ${l.npmUrl}` : ""}`));
  }
  const realApps = mobileApps.filter((a) => real(a.name));
  if (realApps.length) {
    out.push("");
    out.push("## Mobile apps");
    realApps.forEach((a) => out.push(`- ${a.name}: ${a.idea} ${a.summary}`));
  }
  out.push("");
  out.push("## Quick answers");
  faqs.forEach((f) => { out.push(`Q: ${f.q}`); out.push(`A: ${f.a}`); out.push(""); });
  return out.join("\n");
}
