# Muhammad Hamza — portfolio

Next.js 16 (App Router) · Three.js · GSAP · Hamza Brand System (Doto, Funnel Display, Funnel Sans, Departure Mono).

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (Vercel or any Node host)
npm run export     # static copy in ./out (any static host)
```

Set your domain before deploying (used for canonical URLs, sitemap, JSON-LD and llms.txt):

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Edit content

Everything lives in **`content/site.ts`**: profile, manifesto, why-hire points, stack, products, experience, certifications, writing, quick answers.
Anything in `[brackets]` is a placeholder. Placeholders are left out of the structured data and llms.txt automatically, but they still show on the page, so fill them in before launch.

- Products: replace the three `[Product N]` entries (name, problem, summary, stack, phases owned, outcome with a number).
- Writing: set `published: true` and fill `body` to publish a post. Drafts get no page in the sitemap and are `noindex`.
- Stack: keep only what Hamza actually uses; remove the `[...?]` guesses.

## SEO and AEO (answer engines)

- `app/layout.tsx`: title, description, canonical, Open Graph (profile), Twitter card, robots.
- `app/opengraph-image.png`: social preview (re-capture after the hero changes).
- `lib/structured-data.ts`: one JSON-LD `@graph` with WebSite, ProfilePage, Person (job, employer, skills, credentials, sameAs), experience as roles, products as an ItemList, and FAQPage.
- Quick answers block on the page mirrors the FAQPage data, written as direct, quotable answers.
- `/llms.txt` and `/llms-full.txt`: plain-text profile for LLM crawlers (llmstxt.org format).
- `/robots.txt`: allows search engines and AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended and others).
- `/sitemap.xml`: home, writing, published posts.
- Every word is server-rendered HTML; animations only style what is already there.

After launch: verify the domain in Google Search Console and Bing Webmaster Tools, submit the sitemap, and run the page through Google's Rich Results Test.

## Motion

- `components/DotField.tsx`: one fixed Three.js dot field that morphs per section (sphere → wall → ring → terrain → helix → cloud → sphere).
- `components/ScrollFX.tsx`: GSAP ScrollTrigger: pinned manifesto, stack rows, horizontal products, timeline, section rail.
- All motion is off under `prefers-reduced-motion`.
"# hamza-v1-portfolio" 
