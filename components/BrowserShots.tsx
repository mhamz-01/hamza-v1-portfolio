"use client";

import { useEffect, useRef, useState } from "react";

type Shot = { src: string; alt: string; label: string; w: number; h: number };

/**
 * A browser-window mockup holding real screenshots of a package.
 * Every image is in the server HTML (crawlable); the tabs only change which one is visible.
 * While in view it steps through the shots on its own, and stops for good once someone picks one.
 */
export default function BrowserShots({ shots, url, name }: { shots: Shot[]; url: string; name: string }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const [cycling, setCycling] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const ratio = `${shots[0].w} / ${shots[0].h}`;

  useEffect(() => {
    if (!auto || shots.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(timer);
      setCycling(e.isIntersecting);
      if (e.isIntersecting) timer = window.setInterval(() => setI((n) => (n + 1) % shots.length), 4200);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); window.clearInterval(timer); setCycling(false); };
  }, [auto, shots.length]);

  return (
    <div className="browser" ref={ref}>
      <div className="browser-bar">
        <span className="browser-dots" aria-hidden="true"><i /><i /><i /></span>
        <a className="browser-url" href={url} rel="noopener">
          <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2M3.5 7h9v7h-9z" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
          {host}
        </a>
        {shots.length > 1 && (
          <div className="browser-tabs" role="tablist" aria-label={`${name} screenshots`}>
            {shots.map((s, k) => (
              <button
                key={s.src}
                type="button"
                role="tab"
                aria-selected={k === i}
                className={k === i ? "on" : ""}
                onClick={() => { setAuto(false); setI(k); }}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="browser-view" style={{ aspectRatio: ratio }}>
        {shots.map((s, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            width={s.w}
            height={s.h}
            loading="lazy"
            decoding="async"
            className={k === i ? "on" : ""}
            aria-hidden={k === i ? undefined : true}
          />
        ))}
        {auto && cycling && <span className="browser-progress" key={i} aria-hidden="true" />}
      </div>
    </div>
  );
}
