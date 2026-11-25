import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="article">
      <div className="wrap">
        <p className="label">404</p>
        <h1>This page isn’t built yet.</h1>
        <Link className="btn" href="/">Back home</Link>
      </div>
    </main>
  );
}
