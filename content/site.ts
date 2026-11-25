/**
 * ONE source of truth for the whole site.
 * The page, the JSON-LD structured data, sitemap, llms.txt and llms-full.txt all read from here.
 * Anything wrapped in [brackets] is a placeholder: fill it in before launch.
 * Placeholders are automatically left out of structured data and llms.txt.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, ""); // TODO: set NEXT_PUBLIC_SITE_URL

export const isPlaceholder = (s?: string) => !s || /\[[^\]]*\]/.test(s);

export const person = {
  name: "Muhammad Hamza",
  shortName: "Hamza",
  jobTitle: "Full-Stack Software Engineer",
  employer: { name: "DevBlock Studio", url: "" }, // TODO: add DevBlock Studio's URL
  location: "[City, Country]", // TODO
  email: "[email@domain.com]", // TODO
  degree: "BS Software Engineering",
  tagline: "I build what clients actually need, ship it fast, then ship the better v2.",
  summary:
    "Muhammad Hamza is a full-stack software engineer at DevBlock Studio with a degree in software engineering. He has worked on real client projects since the first year of his bachelor’s, and is known for understanding what a client actually needs, shipping a working version fast, and following up with a v2 shaped by feedback. He works AI-first and knows when to rely on AI and when not to.",
  availability: "[Open to new projects from Month Year]", // TODO
  links: {
    linkedin: "[https://www.linkedin.com/in/...]", // TODO
    github: "[https://github.com/...]", // TODO
    x: "", // optional
  },
};

/** The pinned scroll story. Each sentence lights up word by word. */
export const manifesto = [
  "I didn’t wait until I was ready.",
  "From day one, I took on real client projects and learned by shipping.",
  "I sit in the client’s chair first, ship what they need fast, then ship the better v2.",
];

export const whyHire = [
  {
    k: "01",
    title: "He builds what you need, not just what’s written",
    body: "He reads the non-technical context and asks: if I were the client handing over these requirements, what would I actually need?",
  },
  {
    k: "02",
    title: "In production from week 1, then better every loop",
    body: "The needs ship first, in the shortest loop, so you're live in production from week 1. Feedback comes in, and every version after that adds the wants and improves what's there.",
  },
  {
    k: "03",
    title: "AI-first, with judgment",
    body: "He uses AI tools to raise his output and knows when not to rely on them.",
  },
  {
    k: "04",
    title: "Takes criticism, keeps learning",
    body: "Not the master: the one who accepts criticism, unlearns old concepts and learns new ones.",
  },
];

/** Tech stack. Items in [brackets] are guesses: confirm or remove. */
export const stack: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python"] },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "shadcn/ui"] },
  { group: "Mobile", items: ["React Native", "[Expo?]"] },
  { group: "Backend", items: ["Node.js", "Express", "Python", "[FastAPI / Django?]", "REST APIs"] },
  { group: "Data", items: ["PostgreSQL", "Supabase"] },
  { group: "Cloud", items: ["AWS", "[Which AWS services? e.g. EC2, S3, Lambda]"] },
  { group: "AI", items: ["Agentic AI", "[LLM APIs?]", "AI coding tools"] },
  { group: "Ship", items: ["Git / GitHub", "[Vercel / Docker?]", "[CI/CD?]"] },
];

export type Phase = "discover" | "design" | "build" | "ship";

export type Product = {
  slug: string;
  name: string;
  problem: string;
  summary: string;
  stack: string[];
  phases: Phase[];
  users: string;
  outcome: string;
  url?: string;
  year?: string;
  /** Featured products get a full case study (screens, approach, architecture) above the track. */
  featured?: {
    tagline: string;
    audience: string;
    pain: string; // what is wrong with the alternatives
    approach: { k: string; v: string }[];
    features: string[];
    architecture: { layer: string; tech: string; role: string }[];
    realtime: string; // the live channel drawn under the diagram
    images: { src: string; alt: string; label: string; w: number; h: number }[];
    note?: string; // a link back to something else on the page
  };
};

export const products: Product[] = [
  {
    slug: "easyflow",
    name: "EasyFlow",
    problem: "Project management in fewer clicks, with less clutter.",
    summary:
      "A project management workspace for startups and agencies: projects, tasks, docs, whiteboards and files in one place, with a UI clean enough that a new team member needs almost no training.",
    stack: ["Next.js", "Node.js", "Express", "Supabase"],
    phases: ["discover", "design", "build", "ship"],
    users: "Live · free to use",
    outcome: "[Outcome with a number, e.g. teams onboarded or time to first task]", // TODO
    url: "https://easyflow.space",
    featured: {
      tagline: "Project management in fewer clicks, with less clutter.",
      audience: "Startups and agencies that want to put their whole team on one platform without a week of training.",
      pain: "Most project tools can do everything, but every action is buried under menus, and teams need training before they can use them. Small teams give up and drift back to chat and spreadsheets.",
      approach: [
        { k: "Fewer clicks", v: "Every common action is one or two clicks from where you already are. Create a task, a doc or a board straight from the project." },
        { k: "Less clutter", v: "Only what the team needs on screen. No settings maze, no feature walls." },
        { k: "Self-explanatory", v: "A new teammate can join a workspace and find their work with minimal training." },
        { k: "One workspace", v: "Projects, tasks, docs, whiteboards, sticky notes and files in one place, so nobody switches tools to get work done." },
      ],
      features: ["Projects & tasks", "Real-time docs", "Whiteboards", "Sticky notes", "File storage", "Team workspaces & roles", "Recent activity", "Team chat"],
      architecture: [
        { layer: "Frontend", tech: "Next.js", role: "The workspace UI" },
        { layer: "Backend", tech: "Node.js + Express", role: "API and business logic" },
        { layer: "Data", tech: "Supabase", role: "Postgres database" },
      ],
      realtime: "Supabase Realtime powers team chat",
      images: [
        { label: "Home", src: "/work/easyflow-app/home.webp", w: 1728, h: 1205, alt: "EasyFlow home: workspace sidebar with projects, quick-create cards for whiteboard, document, tasks and Brain, a recent items list and sticky notes" },
        { label: "Task", src: "/work/easyflow-app/task.webp", w: 1435, h: 1205, alt: "EasyFlow task detail: description, linked documents, attachments and links, with state, assignees, priority and dates in one panel" },
        { label: "Whiteboard", src: "/work/easyflow-app/whiteboard.webp", w: 1435, h: 871, alt: "EasyFlow whiteboard: an infinite dotted canvas inside a project with the drawing toolbar" },
      ],
      note: "EasyFlow’s whiteboard is where my open-source easyflow-whiteboard package came from.",
    },
  },
  {
    slug: "product-2",
    name: "[Product 2]",
    problem: "[The problem it solves, in the client’s words]",
    summary: "[What Hamza built and owned, in two sentences]",
    stack: ["React", "Express", "Supabase"], // TODO confirm
    phases: ["discover", "build", "ship"],
    users: "[N active users]",
    outcome: "[Outcome with a number]",
  },
  {
    slug: "product-3",
    name: "[Product 3]",
    problem: "[The problem it solves, in the client’s words]",
    summary: "[What Hamza built and owned, in two sentences]",
    stack: ["Next.js", "Python", "AWS"], // TODO confirm
    phases: ["design", "build", "ship"],
    users: "[N active users]",
    outcome: "[Outcome with a number]",
  },
];

/**
 * Why the packages exist: the origin story told above them.
 * Each step picks up a phase colour (discover → design → build → ship).
 */
export const ossStory = {
  title: "Two free React packages I built and published on npm: a whiteboard and a text editor.",
  lede: "Both are open source under MIT. Here is why I made them, then what each one does.",
  steps: [
    { k: "The need", phase: "discover" as Phase, text: "While building EasyFlow, I needed a whiteboard with the board already done, where all I had to do was add my own nodes." },
    { k: "The gap", phase: "design" as Phase, text: "Everything I found was either a heavy app or a blank canvas engine. Nothing let me just plug my React components in." },
    { k: "The build", phase: "build" as Phase, text: "So I built a lightweight one, then did the same for the editor: Tiptap with the sidebar and save logic already wired." },
    { k: "Given away", phase: "ship" as Phase, text: "Both are open source under MIT, so the next developer with the same problem starts from done. My contribution back." },
  ],
};

/** Two npm packages Hamza published and maintains. Highlighted as his own contribution. */
export const libraries: {
  slug: string;
  name: string; // npm package name
  product: string; // display name
  tagline: string;
  why: string; // the origin story for this package, one or two sentences
  description: string;
  stack: string[];
  install: string;
  usage: string; // the smallest working snippet, shown in the code block
  npmUrl: string;
  repoUrl: string;
  downloads: string;
  docsUrl?: string;
  playgroundUrl?: string;
  version?: string;
  facts?: { k: string; v: string }[]; // quick specs shown on the card
  points?: string[]; // what makes it unique
  images?: { src: string; alt: string; label: string; w: number; h: number }[]; // screenshots in /public
}[] = [
  {
    slug: "easyflow-whiteboard",
    name: "easyflow-whiteboard",
    product: "EasyFlow Whiteboard",
    tagline: "An infinite canvas where your React components are the notes.",
    why: "EasyFlow needed a ready-made board where I could drop in my own nodes. I couldn’t find a light one, so I wrote it and opened it up.",
    description:
      "An embeddable React whiteboard on Fabric.js. Drop in one component and get drawing tools, connectors, a minimap, undo, light and dark themes and autosave. Register your own React components and they live on the board as draggable, connectable nodes.",
    stack: ["React", "TypeScript", "Fabric.js", "Zustand"],
    install: "npm install easyflow-whiteboard fabric zustand",
    usage: `<EasyflowWhiteboard
  nodes={{ task: TaskCard }}
  onSave={(board) => api.save(board)}
/>`,
    npmUrl: "https://www.npmjs.com/package/easyflow-whiteboard",
    repoUrl: "[https://github.com/...]", // TODO
    docsUrl: "https://easyflow-whiteboard-doc.vercel.app",
    playgroundUrl: "https://easyflow-whiteboard-doc.vercel.app/#playground",
    version: "v1.0",
    downloads: "[N downloads / week]", // TODO from npm
    facts: [
      { k: "Packed size", v: "~96 KB" },
      { k: "Runtime deps", v: "1" },
      { k: "React", v: "18 / 19" },
      { k: "Licence", v: "MIT" },
    ],
    points: [
      "Your own React components are real nodes: drag, select, connect and save them, with no Fabric knowledge needed.",
      "Connectors stay attached as shapes move, resize or rotate. Elbow, curved or straight.",
      "Save and restore is plain JSON: a debounced onSave hands it over, initialData brings it back. You own the storage.",
      "One runtime dependency, scoped styles, no CSS reset. Light, dark or follow-the-OS themes, plus a read-only mode.",
    ],
    images: [
      { label: "Dark", src: "/work/easyflow/board-dark.png", w: 2880, h: 1800, alt: "EasyFlow Whiteboard in dark theme: sticky notes, task cards, a link card and shapes joined by connectors, with toolbar, zoom and minimap" },
      { label: "Light", src: "/work/easyflow/board-light.png", w: 2880, h: 1800, alt: "EasyFlow Whiteboard in light theme showing the same launch board" },
      { label: "Custom nodes", src: "/work/easyflow/nodes-dark.png", w: 1360, h: 1000, alt: "Custom React nodes on the board: a sticky note, task cards with status and a link card" },
    ],
  },
  {
    slug: "easyflow-texteditor",
    name: "easyflow-texteditor",
    product: "EasyFlow Editor",
    tagline: "A complete document editor for React, in one component.",
    why: "Every project wanted the same Tiptap setup: a sidebar of pages, autosave, images, tables. I wired it once, properly, and published it so nobody has to wire it again.",
    description:
      "A Tiptap 3 editor with the hard parts already built: a sidebar of tabs and subtabs, debounced autosave with a Saving and Saved badge, image uploads that resize, tables, and light and dark themes. Drop in <Editor /> and ship.",
    stack: ["React", "TypeScript", "Tiptap 3"],
    install: "npm install easyflow-texteditor",
    usage: `<Editor
  initialTabs={tabs}
  onSave={(tabs) => api.save(tabs)}
/>`,
    npmUrl: "https://www.npmjs.com/package/easyflow-texteditor",
    repoUrl: "[https://github.com/...]", // TODO
    docsUrl: "https://easyflow-texteditor-documentation.vercel.app",
    playgroundUrl: "https://easyflow-texteditor-documentation.vercel.app/playground",
    version: "v1.0",
    downloads: "[N downloads / week]", // TODO from npm
    facts: [
      { k: "Built on", v: "Tiptap 3" },
      { k: "Save", v: "Debounced" },
      { k: "React", v: "18+" },
      { k: "Licence", v: "MIT" },
    ],
    points: [
      "Tabs and subtabs in a sidebar: add, rename and nest pages. Switching never loses unsaved text.",
      "Autosave built in: debounced, one request at a time, retries on failure. Or keep it all in localStorage with no backend.",
      "Drag-and-drop images with progress and cancel; corner handles resize and keep the ratio. Tables with merge and headers.",
      "Read-only mode, locked tab actions, scoped styles and full TypeScript types.",
    ],
    images: [
      { label: "Dark", src: "/work/easyflow-editor/editor-dark.webp", w: 1704, h: 986, alt: "EasyFlow Editor in dark theme: a sidebar of documents with nested subtabs, a formatting toolbar, a resizable image and a table" },
      { label: "Light", src: "/work/easyflow-editor/editor-light.webp", w: 1704, h: 986, alt: "EasyFlow Editor in light theme showing the same product spec document with a Saved badge" },
    ],
  },
];

/** Two mobile apps that are Hamza's own ideas, built and ready to launch. */
export const mobileApps: {
  slug: string;
  name: string;
  idea: string;
  summary: string;
  stack: string[];
  status: string;
  platforms: string;
}[] = [
  {
    slug: "app-1",
    name: "[App 1]",
    idea: "[The idea in one line: who it is for and what it fixes]",
    summary: "[What it does and what makes it different, in two sentences]",
    stack: ["React Native", "Supabase"], // TODO confirm
    status: "[Ready to launch / Launching Month Year]",
    platforms: "[iOS + Android]",
  },
  {
    slug: "app-2",
    name: "[App 2]",
    idea: "[The idea in one line: who it is for and what it fixes]",
    summary: "[What it does and what makes it different, in two sentences]",
    stack: ["React Native", "Supabase"], // TODO confirm
    status: "[Ready to launch / Launching Month Year]",
    platforms: "[iOS + Android]",
  },
];

/** Experience. Years for 2025–2026 inferred from order: confirm. */
export const experience = [
  { start: "2026-06", end: "", when: "Jun 2026 – now", role: "Full-Stack Engineer", org: "DevBlock Studio", note: "Owns products from the first client call to production." },
  { start: "2025-06", end: "2026-06", when: "Jun 2025 – Jun 2026", role: "Freelance Software Engineer", org: "Independent", note: "About a year of client work end to end." },
  { start: "2025-01", end: "2025-05", when: "Jan – May 2025", role: "Frontend Developer", org: "Freelance team", note: "Built client-facing interfaces." },
  { start: "2024-07", end: "2024-12", when: "Jul – Dec 2024", role: "Web Developer Intern", org: "DevBlock", note: "First sustained production work." },
  { start: "2024-06", end: "2024-07", when: "Jun – Jul 2024", role: "Intern", org: "Durrani Soft Technologies", note: "One-month internship, the start of the journey." },
];

export const certifications = [
  { name: "Python", issuer: "[Issuer]", year: "[Year]" },
  { name: "React", issuer: "[Issuer]", year: "[Year]" },
  { name: "Web Development (Backend)", issuer: "[Issuer]", year: "[Year]" },
  { name: "Agentic AI", issuer: "[Issuer]", year: "[Year]" },
];

export const writings: {
  slug: string;
  title: string;
  summary: string;
  date: string; // ISO yyyy-mm-dd
  published: boolean;
  body: string[]; // paragraphs
}[] = [
  {
    slug: "sitting-in-the-clients-chair",
    title: "[Sitting in the client’s chair]",
    summary: "[How imagining yourself as the client changes what you build]",
    date: "2026-12-01",
    published: false,
    body: ["[Write the post here, one paragraph per item.]"],
  },
  {
    slug: "needs-first-wants-in-v2",
    title: "[Needs first, wants in v2]",
    summary: "[Why shipping the needs fast beats shipping everything late]",
    date: "2026-12-15",
    published: false,
    body: ["[Write the post here.]"],
  },
  {
    slug: "when-not-to-use-ai",
    title: "[When not to use AI]",
    summary: "[The calls an AI-first engineer still makes by hand]",
    date: "2027-01-05",
    published: false,
    body: ["[Write the post here.]"],
  },
];

/** Visible Q&A block: mirrored into FAQPage JSON-LD and llms.txt for answer engines. */
export const faqs = [
  {
    q: "Who is Muhammad Hamza?",
    a: "Muhammad Hamza is a full-stack software engineer at DevBlock Studio with a BS in Software Engineering. He has worked on real client projects since the start of his degree.",
  },
  {
    q: "Why hire Muhammad Hamza?",
    a: "He builds what the client actually needs, not only what is written in the brief. He ships a working version fast, takes feedback, and delivers a v2 that adds the client’s wants.",
  },
  {
    q: "How does he work with clients?",
    a: "He sits with the client to understand the problem in their words, separates needs from wants, ships the needs in the shortest loop, gathers feedback, then ships v2.",
  },
  {
    q: "What does he work with?",
    a: "Full-stack web development across frontend and backend, with certifications in Python, React, backend web development and agentic AI. He works AI-first.",
  },
  {
    q: "What has he open-sourced?",
    a: "Two MIT-licensed React packages on npm: easyflow-whiteboard, an embeddable infinite canvas where your own React components become connectable nodes, and easyflow-texteditor, a Tiptap 3 document editor with a tabbed sidebar, autosave, image uploads and tables. He built them because he needed them for EasyFlow and couldn’t find lightweight ones.",
  },
  {
    q: "What is his experience?",
    a: "Internship at Durrani Soft Technologies (2024), web developer intern at DevBlock (2024), frontend developer with a freelance team (2025), about a year as a freelance engineer (2025–2026), and full-stack engineer at DevBlock Studio since June 2026.",
  },
];

export const sections = [
  { id: "top", n: "00", label: "Hamza" },
  { id: "why", n: "01", label: "Why hire" },
  { id: "stack", n: "02", label: "Stack" },
  { id: "work", n: "03", label: "Products" },
  { id: "oss", n: "04", label: "Open source" },
  { id: "apps", n: "05", label: "Mobile apps" },
  { id: "experience", n: "06", label: "Experience" },
  { id: "writing", n: "07", label: "Writing" },
  { id: "contact", n: "08", label: "Contact" },
];

/**
 * Projects that have their own page at /work/{slug}/, in reading order.
 * The home page shows a short card for each; every project page links to the next one.
 */
export const projectPages = [
  { slug: "easyflow", name: "EasyFlow", kind: "Product", line: "Project management in fewer clicks, with less clutter." },
  { slug: "easyflow-whiteboard", name: "EasyFlow Whiteboard", kind: "npm package", line: libraries[0].tagline },
  { slug: "easyflow-texteditor", name: "EasyFlow Editor", kind: "npm package", line: libraries[1].tagline },
].map((p) => ({ ...p, href: `/work/${p.slug}/` }));

export const projectHref = (slug: string) => projectPages.find((p) => p.slug === slug)?.href;
