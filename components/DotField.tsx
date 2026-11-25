"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * One fixed WebGL particle field behind the page.
 *
 * 1. INTRO (first ~5s on landing): the dots tell the process, centred on screen:
 *    idea -> discover -> design -> build -> ship. When the sphere forms it drifts
 *    into the hero lane and the hero content arrives from the centre.
 * 2. SCROLL: each section (data-scene="0..6") has a formation in a lane BESIDE the text.
 */

const N = 3600;
const COLS = 60;
const SCENES = 7;

// intro timing (seconds / stage units)
const LEAD = 0.8; // the spark sits alone for a moment
const DUR = 0.9; // seconds per stage
const REVEAL_AT = 4.3; // stage units: sphere starts moving to the hero lane, content arrives
const INTRO_END = 5;

const STAGES = [
  { word: "Idea", sub: "a client says: “I need…”", color: "#fafaf7", tilt: 0 },
  { word: "Discover", sub: "separating needs from wants", color: "#5ec4c4", tilt: 0 },
  { word: "Design", sub: "sketching the shape of v1", color: "#f2c14e", tilt: -0.85 },
  { word: "Build", sub: "turning it into something real", color: "#7b93ff", tilt: 0.4 },
  { word: "Ship", sub: "v1 is live. v2 is already brewing", color: "#ff5a1f", tilt: 0.1 },
];

function fib(i: number, r: number): [number, number, number] {
  const y = 1 - (i / (N - 1)) * 2;
  const rad = Math.sqrt(1 - y * y);
  const th = Math.PI * (3 - Math.sqrt(5)) * i;
  return [Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r];
}

function seeded(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function ball(i: number, r: number, falloff = 1): [number, number, number] {
  const rr = r * Math.pow(seeded(i + 5), falloff);
  const th = seeded(i + 9) * Math.PI * 2;
  const ph = Math.acos(2 * seeded(i + 17) - 1);
  return [rr * Math.sin(ph) * Math.cos(th), rr * Math.cos(ph), rr * Math.sin(ph) * Math.sin(th)];
}

type Gen = (i: number) => [number, number, number];

function make(fn: Gen) {
  const a = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) a.set(fn(i), i * 3);
  return a;
}

function buildFormations(m: boolean) {
  const X = m ? 0 : 1; // desktop pushes shapes into the right lane
  const gridXY = (i: number) => [(i % COLS) - COLS / 2, Math.floor(i / COLS) - N / COLS / 2];

  return [
    // 0 hero: sphere, right lane
    make((i) => { const [x, y, z] = fib(i, 2.3); return [x + 3.8 * X, y, z - (m ? 2 : 0)]; }),
    // 1 why (needs vs wants): rippled sheet, deep and faint, behind centred copy
    make((i) => {
      const [c, r] = gridXY(i);
      const x = c * 0.26, y = r * 0.26;
      return [x, y * 0.4 - 1, -4 + Math.sin(x * 0.8) * 0.9 + Math.cos(y * 1.2) * 0.6];
    }),
    // 2 stack: tilted torus, right lane
    make((i) => {
      const u = (i / N) * Math.PI * 2, t = u * 18, R = 2.6, r = 0.7;
      const x = (R + r * Math.cos(t)) * Math.cos(u), z = (R + r * Math.cos(t)) * Math.sin(u), y = r * Math.sin(t);
      return [x * 0.95 + 3.9 * X, y + z * 0.35, z * 0.8 - 3];
    }),
    // 3 work: sweeping terrain along the bottom
    make((i) => {
      const [c, r] = gridXY(i);
      const x = c * 0.3, z = r * 0.3;
      return [x, -3 + Math.sin(x * 0.6) * 0.6 + Math.cos(z * 0.9) * 0.5, z - 3];
    }),
    // 4 experience: double helix (a timeline), right lane
    make((i) => {
      const t = i / N, ang = t * Math.PI * 2 * 7 + (i % 2) * Math.PI;
      return [Math.cos(ang) * 1.15 + 4.2 * X, (t - 0.5) * 9.5, Math.sin(ang) * 1.15 - 1.5];
    }),
    // 5 writing: drifting ideas, weighted to the right
    make((i) => [(seeded(i) - 0.15) * 12, (seeded(i + 7) - 0.5) * 8, (seeded(i + 13) - 0.5) * 6 - 3]),
    // 6 contact: converged sphere, right lane
    make((i) => { const [x, y, z] = fib(i, 1.9); return [x + 4.6 * X, y + 0.2, z - 2]; }),
  ];
}

/** idea -> discover -> design -> build -> ship, all centred; the last entry is the hero lane. */
function buildIntro(m: boolean, hero: Float32Array) {
  const s = m ? 0.55 : 1;
  return [
    // idea: one bright spark, dense core with a thin halo
    make((i) => ball(i, 0.9 * s, 2.2)),
    // discover: a wide cloud of raw information
    make((i) => ball(i, 4.2 * s, 0.34)),
    // design: a flat blueprint grid (tilted by the group rotation)
    make((i) => [((i % COLS) - COLS / 2 + 0.5) * 0.17 * s, (Math.floor(i / COLS) - COLS / 2 + 0.5) * 0.17 * s, 0]),
    // build: a solid lattice block
    make((i) => {
      const idx = i % 3375;
      return [((idx % 15) - 7) * 0.3 * s, ((Math.floor(idx / 15) % 15) - 7) * 0.3 * s, (Math.floor(idx / 225) - 7) * 0.3 * s];
    }),
    // ship: the finished, converged sphere
    make((i) => fib(i, 2.1 * s)),
    hero,
  ];
}

// Per-scene brightness. Lane scenes are bright; scenes with copy over them stay faint.
const OP_DESKTOP = [0.95, 0.08, 0.4, 0.08, 0.6, 0.1, 0.65];
const OP_MOBILE = [0.4, 0.05, 0.06, 0.05, 0.08, 0.05, 0.12];

const vertex = /* glsl */ `
  attribute vec3 aA;
  attribute vec3 aB;
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uMix;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2 uPointer;
  uniform vec3 uTint;
  uniform float uTintAmt;
  varying vec3 vColor;
  varying float vDepth;

  void main() {
    float sw = sin(uMix * 3.14159265);
    vec3 p = mix(aA, aB, uMix);

    // swirl: particles curve through space while changing formation
    float ang = sw * (aPhase - 3.14159) * 0.3;
    float c = cos(ang), s = sin(ang);
    p.xz = mat2(c, -s, s, c) * p.xz;
    p.y += sw * sin(aPhase * 2.0 + uTime) * 0.5;

    // idle drift
    p.x += cos(uTime * 0.5 + aPhase) * 0.03;
    p.y += sin(uTime * 0.8 + aPhase) * 0.04;

    vec4 w = modelMatrix * vec4(p, 1.0);

    // pointer repulsion
    vec2 d = w.xy - uPointer;
    float f = smoothstep(1.8, 0.0, length(d));
    w.xy += normalize(d + 1e-4) * f * 0.6;
    w.z += f * 0.4;

    vec4 mv = viewMatrix * w;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aSize * uPixelRatio * (8.0 / -mv.z);

    // stage tint (intro): accent dots keep part of their own colour
    float acc = step(0.1, abs(aColor.r - aColor.g) + abs(aColor.g - aColor.b));
    vColor = mix(aColor, uTint, uTintAmt * (1.0 - 0.6 * acc));
    vDepth = clamp(1.0 - (-mv.z - 6.0) / 12.0, 0.15, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vDepth;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    float a = (core * core * 0.9 + core * 0.25) * uOpacity * vDepth;
    gl_FragColor = vec4(vColor * a, a);
  }
`;

function buildAttributes(isMobile: boolean) {
  const paper = new THREE.Color("#fafaf7");
  const accents = ["#5ec4c4", "#f2c14e", "#7b93ff", "#ff5a1f"].map((h) => new THREE.Color(h));
  const sizes = new Float32Array(N);
  const colors = new Float32Array(N * 3);
  const phase = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const accent = i % 23 === 0;
    const col = accent ? accents[Math.floor(i / 23) % 4] : paper;
    colors.set([col.r, col.g, col.b], i * 3);
    sizes[i] = accent ? 1.5 : 0.55 + seeded(i + 3) * 0.55;
    phase[i] = seeded(i + 21) * Math.PI * 2;
  }
  return { sizes, colors, phase, size: isMobile ? 3.4 : 4.6 };
}

function readScene(scenes: HTMLElement[]) {
  const mid = window.scrollY + window.innerHeight * 0.5;
  let t = 0;
  for (let i = 0; i < scenes.length; i++) {
    const top = scenes[i].offsetTop, h = scenes[i].offsetHeight || 1;
    if (mid >= top) t = i + Math.min(1, (mid - top) / h);
  }
  return Math.max(0, Math.min(scenes.length - 1, t - 0.5 < 0 ? 0 : t - 0.5));
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => x * x * (3 - 2 * x);

export default function DotField() {
  const host = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const stepRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    (window as unknown as { __introAlive?: boolean }).__introAlive = true;

    // the inline boot script in <head> plans the intro (home page, no reduced motion)
    const intro = { active: !reduce && root.dataset.introPlan === "1", revealed: false };
    const clearIntroClasses = () => root.classList.remove("intro", "intro-reveal");
    const endIntro = () => { intro.active = false; root.dataset.introPlan = "0"; clearIntroClasses(); };

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      el.dataset.fallback = "1";
      endIntro();
      return;
    }
    const isMobile = window.innerWidth < 820;
    const pr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(pr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const formations = buildFormations(isMobile);
    const introForms = buildIntro(isMobile, formations[0]);
    const attrs = buildAttributes(isMobile);
    const aA = new Float32Array(formations[0]);
    const aB = new Float32Array(formations[1]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    geo.setAttribute("aA", new THREE.BufferAttribute(aA, 3));
    geo.setAttribute("aB", new THREE.BufferAttribute(aB, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(attrs.sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(attrs.phase, 1));
    geo.setAttribute("aColor", new THREE.BufferAttribute(attrs.colors, 3));
    const tint = new THREE.Color(STAGES[0].color);
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uMix: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: attrs.size },
        uPixelRatio: { value: pr },
        uOpacity: { value: 0 },
        uPointer: { value: new THREE.Vector2(99, 99) },
        uTint: { value: tint },
        uTintAmt: { value: 0 },
      },
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    let target = readScene(scenes);
    let smooth = target;
    const onScroll = () => { target = readScene(scenes); };

    // pointer in world units on the z=0 plane
    const ptr = { x: 0, y: 0, wx: 99, wy: 99 };
    const onMove = (e: PointerEvent) => {
      ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.y = (e.clientY / window.innerHeight) * 2 - 1;
      const hh = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      ptr.wx = ptr.x * hh * camera.aspect;
      ptr.wy = -ptr.y * hh;
    };
    const onLeave = () => { ptr.wx = 99; ptr.wy = 99; };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    if (!reduce && !isMobile) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

    // ---- intro plumbing ------------------------------------------------
    const t0 = performance.now();
    let shift = 0; // seconds added by "skip"
    let stageShown = -1;
    const bars = barRef.current ? Array.from(barRef.current.children) : [];

    const showStage = (idx: number) => {
      if (idx === stageShown) return;
      stageShown = idx;
      const st = STAGES[idx];
      const word = wordRef.current;
      if (word) {
        word.textContent = st.word;
        word.classList.remove("in");
        void word.offsetWidth; // restart the CSS animation
        word.classList.add("in");
      }
      if (subRef.current) subRef.current.textContent = st.sub;
      if (stepRef.current) stepRef.current.textContent = `0${idx + 1}`;
      introRef.current?.style.setProperty("--stage", st.color);
      bars.forEach((b, i) => b.classList.toggle("on", i <= idx));
    };

    const reveal = () => {
      intro.revealed = true;
      root.classList.add("intro-reveal");
      window.dispatchEvent(new Event("intro:reveal"));
    };

    const lockEvents = ["wheel", "touchmove"] as const;
    const onKey = (e: KeyboardEvent) => {
      if (["Escape", "Enter", " ", "ArrowDown", "PageDown", "End"].includes(e.key)) skip();
    };
    const unlock = () => {
      lockEvents.forEach((n) => window.removeEventListener(n, skip));
      window.removeEventListener("keydown", onKey);
    };
    const finish = () => {
      unlock();
      endIntro();
      window.dispatchEvent(new Event("intro:done"));
    };
    function skip() {
      if (!intro.active) return;
      const time = (performance.now() - t0) / 1000 + shift;
      const reveal_t = LEAD + REVEAL_AT * DUR;
      if (time < reveal_t) {
        shift += reveal_t - time;
        mat.uniforms.uOpacity.value = 0; // fade back in instead of a hard pop
      }
    }

    if (intro.active) {
      window.scrollTo(0, 0);
      root.classList.add("intro");
      showStage(0);
      lockEvents.forEach((n) => window.addEventListener(n, skip, { passive: true }));
      window.addEventListener("keydown", onKey);
      skipRef.current?.addEventListener("click", skip);
    }

    // ---- frame ---------------------------------------------------------
    const table = isMobile ? OP_MOBILE : OP_DESKTOP;
    const stageColors = STAGES.map((s) => new THREE.Color(s.color));
    let loaded = -1;
    let raf = 0;
    let running = true;

    const frame = () => {
      const time = (performance.now() - t0) / 1000 + shift;
      let A: Float32Array, B: Float32Array, frac: number, key: number, it = INTRO_END, k = 0;
      let stageIdx = 4;

      if (intro.active) {
        it = Math.min(Math.max(0, (time - LEAD) / DUR), INTRO_END);
        k = Math.min(Math.floor(it), 4);
        frac = ease(clamp01((it - k - 0.3) / 0.7));
        A = introForms[k];
        B = introForms[k + 1];
        key = 100 + k;
        stageIdx = Math.min(4, Math.floor(it + 0.7));
        showStage(stageIdx);
        if (it >= REVEAL_AT && !intro.revealed) reveal();
      } else {
        smooth += (target - smooth) * (reduce ? 1 : 0.07);
        k = Math.min(Math.floor(smooth), SCENES - 2);
        frac = ease(Math.min(1, smooth - k));
        A = formations[k];
        B = formations[k + 1];
        key = k;
      }

      if (key !== loaded) {
        aA.set(A);
        aB.set(B);
        geo.attributes.aA.needsUpdate = true;
        geo.attributes.aB.needsUpdate = true;
        loaded = key;
      }

      const inIntro = intro.active && it < REVEAL_AT;
      const u = mat.uniforms;
      u.uMix.value = frac;
      u.uTime.value = reduce ? 0 : time;
      u.uPointer.value.set(ptr.wx, ptr.wy);
      u.uSize.value = attrs.size * (inIntro ? 1.2 : 1);

      // brightness + stage tint
      const sceneGoal = table[k] + (table[Math.min(k + 1, SCENES - 1)] - table[k]) * frac;
      const goal = intro.active ? (inIntro ? 1 : table[0]) : sceneGoal;
      u.uOpacity.value += (goal - u.uOpacity.value) * (reduce ? 1 : 0.06);
      tint.lerp(stageColors[stageIdx], 0.1);
      u.uTintAmt.value += ((inIntro ? 0.75 : 0) - u.uTintAmt.value) * 0.06;

      if (!reduce) {
        const tx = inIntro ? STAGES[stageIdx].tilt : ptr.y * 0.1;
        const ty = inIntro ? Math.sin(time * 0.8) * 0.45 : ptr.x * 0.2 + Math.sin(time * 0.15) * 0.2;
        group.rotation.y += (ty - group.rotation.y) * 0.04;
        group.rotation.x += (tx - group.rotation.x) * 0.04;
      }
      renderer.render(scene, camera);
      if (intro.active && it >= INTRO_END) finish();
      if (running && !reduce) raf = requestAnimationFrame(frame);
    };

    let still: (() => void) | null = null;
    if (reduce) {
      still = () => { onScroll(); frame(); };
      window.addEventListener("scroll", still, { passive: true });
      frame();
    } else {
      raf = requestAnimationFrame(frame);
    }

    const onVis = () => {
      if (reduce) return;
      running = !document.hidden;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);

    const skipBtn = skipRef.current;
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      unlock();
      skipBtn?.removeEventListener("click", skip);
      if (intro.active) clearIntroClasses(); // leaving mid-intro must never leave the page locked
      window.removeEventListener("scroll", onScroll);
      if (still) window.removeEventListener("scroll", still);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <>
      <div ref={host} className="dotfield" aria-hidden="true" />
      <div ref={introRef} className="intro-ui">
        <p className="label intro-step" aria-hidden="true"><span ref={stepRef}>01</span> / 05</p>
        <p ref={wordRef} className="intro-word" aria-hidden="true">Idea</p>
        <p ref={subRef} className="intro-sub" aria-hidden="true">a client says: “I need…”</p>
        <div ref={barRef} className="intro-bar" aria-hidden="true"><span /><span /><span /><span /><span /></div>
        <button ref={skipRef} type="button" className="intro-skip" aria-label="Skip intro animation">Skip</button>
      </div>
    </>
  );
}
