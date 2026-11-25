import Link from "next/link";
import ProjectFX from "@/components/project/ProjectFX";
import { person } from "@/content/site";
import "./work.css";

/** Shared chrome for the project pages. Each page under /work/ designs its own body. */
export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="topbar">
        <Link href="/" className="wordmark" aria-label={`${person.name}, home`}>HAMZA</Link>
        <nav aria-label="Primary" className="topnav">
          <Link href="/#work">Products</Link>
          <Link href="/#oss">Open source</Link>
          <Link href="/#experience">Experience</Link>
          <Link href="/writing/">Writing</Link>
        </nav>
        <Link href="/#contact" className="btn btn-signal">Start a project</Link>
      </header>
      <ProjectFX />
      {children}
    </>
  );
}
