"use client";

import { useEffect, useState } from "react";

/** Terminal line that types, holds with a blinking cursor, then moves to the next line. */
export default function StreamLine({ lines }: { lines: string[] }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState(lines[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0, n = 0, timer = 0;
    const type = () => {
      const target = lines[i];
      n++;
      setText(target.slice(0, n));
      if (n < target.length) timer = window.setTimeout(type, 42);
      else timer = window.setTimeout(() => { i = (i + 1) % lines.length; n = 0; setIdx(i); type(); }, 2200);
    };
    setText("");
    timer = window.setTimeout(type, 900);
    return () => window.clearTimeout(timer);
  }, [lines]);

  return (
    <p className="stream" aria-label={lines.join(". ")}>
      <span className="stream-time" aria-hidden="true">{String(idx + 1).padStart(2, "0")}</span>
      <span aria-hidden="true">&gt; {text}</span>
      <span className="cursor" aria-hidden="true" />
    </p>
  );
}
