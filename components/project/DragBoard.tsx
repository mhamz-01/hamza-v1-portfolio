"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type Kind = "sticky" | "task" | "link" | "shape";
type Node = { id: string; kind: Kind; x: number; y: number; title: string; body?: string };

// positions are percentages of the board, so the layout holds at any width
const START: Node[] = [
  { id: "a", kind: "sticky", x: 6, y: 12, title: "Need", body: "A board that’s already done. I just add my own nodes." },
  { id: "b", kind: "task", x: 38, y: 44, title: "<TaskCard />", body: "Your React component, living on the board" },
  { id: "c", kind: "link", x: 70, y: 10, title: "npm i easyflow-whiteboard", body: "npmjs.com" },
  { id: "d", kind: "shape", x: 74, y: 62, title: "Connect" },
];
// a narrow board gets its own starting layout so nothing overlaps on a phone
const NARROW: Record<string, [number, number]> = { a: [4, 4], c: [54, 5], b: [28, 40], d: [62, 74] };
const EDGES: [string, string][] = [["a", "b"], ["b", "c"], ["b", "d"]];

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * A miniature of the whiteboard package: drag the notes and the connectors and minimap follow.
 * It is a demo of the idea, not the package itself (that one runs on Fabric.js).
 */
export default function DragBoard() {
  const [nodes, setNodes] = useState(START);
  const [active, setActive] = useState<string | null>(null);
  const board = useRef<HTMLDivElement>(null);
  const els = useRef<Record<string, HTMLDivElement | null>>({});
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);

  // redraw connectors from the nodes' real boxes (curved, like the package's "curved" connector)
  const draw = useCallback(() => {
    const b = board.current?.getBoundingClientRect();
    if (!b) return;
    EDGES.forEach(([f, t], i) => {
      const A = els.current[f]?.getBoundingClientRect();
      const B = els.current[t]?.getBoundingClientRect();
      const p = paths.current[i];
      if (!A || !B || !p) return;
      const ax = A.left - b.left + A.width / 2, ay = A.top - b.top + A.height / 2;
      const bx = B.left - b.left + B.width / 2, by = B.top - b.top + B.height / 2;
      let d: string;
      if (Math.abs(bx - ax) > Math.abs(by - ay)) {
        const s = Math.sign(bx - ax);
        const x1 = ax + (s * A.width) / 2, x2 = bx - (s * B.width) / 2, k = (x2 - x1) / 2;
        d = `M${x1},${ay} C${x1 + k},${ay} ${x2 - k},${by} ${x2},${by}`;
      } else {
        const s = Math.sign(by - ay);
        const y1 = ay + (s * A.height) / 2, y2 = by - (s * B.height) / 2, k = (y2 - y1) / 2;
        d = `M${ax},${y1} C${ax},${y1 + k} ${bx},${y2 - k} ${bx},${y2}`;
      }
      p.setAttribute("d", d);
    });
  }, []);

  useIso(draw, [nodes, draw]);
  useEffect(() => {
    if ((board.current?.offsetWidth ?? 999) < 560) setNodes((ns) => ns.map((n) => ({ ...n, x: NARROW[n.id][0], y: NARROW[n.id][1] })));
  }, []);
  useEffect(() => {
    const ro = new ResizeObserver(draw);
    if (board.current) ro.observe(board.current);
    return () => ro.disconnect();
  }, [draw]);

  const onDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    const r = e.currentTarget.getBoundingClientRect();
    drag.current = { id, dx: e.clientX - r.left, dy: e.clientY - r.top };
    e.currentTarget.setPointerCapture(e.pointerId);
    setActive(id);
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current, b = board.current?.getBoundingClientRect(), el = d && els.current[d.id];
    if (!d || !b || !el) return;
    const w = el.offsetWidth, h = el.offsetHeight;
    const x = Math.min(Math.max(e.clientX - b.left - d.dx, 0), b.width - w);
    const y = Math.min(Math.max(e.clientY - b.top - d.dy, 0), b.height - h);
    setNodes((ns) => ns.map((n) => (n.id === d.id ? { ...n, x: (x / b.width) * 100, y: (y / b.height) * 100 } : n)));
  };
  const onUp = () => { drag.current = null; };

  return (
    <figure className="db" aria-label="A small interactive whiteboard: drag the notes and the connectors follow">
      <div className="db-board" ref={board} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <svg className="db-wires" aria-hidden="true">
          <defs>
            <marker id="db-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--text-2)" />
            </marker>
          </defs>
          {EDGES.map((_, i) => (
            <path key={i} ref={(el) => { paths.current[i] = el; }} fill="none" stroke="var(--text-2)" strokeWidth="1.5" markerEnd="url(#db-arrow)" />
          ))}
        </svg>

        {nodes.map((n) => (
          <div
            key={n.id}
            ref={(el) => { els.current[n.id] = el; }}
            className={`db-node db-${n.kind}${active === n.id ? " is-active" : ""}`}
            style={{ left: `min(${n.x}%, calc(100% - 150px))`, top: `min(${n.y}%, calc(100% - 140px))` }}
            onPointerDown={(e) => onDown(e, n.id)}
          >
            {n.kind === "task" && <span className="db-task-top"><span className="db-pill">In progress</span><span className="db-av" aria-hidden="true">MH</span></span>}
            {n.kind === "link" && <span className="db-fav" aria-hidden="true">npm</span>}
            <strong>{n.title}</strong>
            {n.body && <span>{n.body}</span>}
            {active === n.id && <i className="db-handles" aria-hidden="true"><b /><b /><b /><b /></i>}
          </div>
        ))}

        <div className="db-tools" aria-hidden="true">
          {["M3 2l9 5-4 1-1 4z", "M3 3h8v8H3z", "M2 7h10M8 3l4 4-4 4", "M7 2v10M3 4h8"].map((d, i) => (
            <span key={i} className={i === 0 ? "on" : ""}><svg viewBox="0 0 14 14" width="14" height="14"><path d={d} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg></span>
          ))}
        </div>
        <div className="db-mini" aria-hidden="true">
          {nodes.map((n) => <i key={n.id} className={`db-${n.kind}`} style={{ left: `${n.x * 0.82}%`, top: `${n.y * 0.8}%` }} />)}
        </div>
        <span className="db-zoom label" aria-hidden="true">100%</span>
      </div>
      <figcaption className="label db-hint"><span className="db-hint-dot" aria-hidden="true" />Drag the notes. The connectors follow.</figcaption>
    </figure>
  );
}
