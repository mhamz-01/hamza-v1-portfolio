"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scroll choreography for the project pages. Every effect hooks onto server-rendered markup,
 * so all copy stays in the HTML. With reduced motion, nothing moves and every scene shows its end state.
 */
export default function ProjectFX() {
  const path = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = document.documentElement;
    root.classList.add("js");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.toggle("reduce", reduce);

    // These are not motion, so they run either way.
    const cleanups = [setupEditorTabs(), setupAutosaveBadge()];

    const ctx = gsap.context(() => {
      if (reduce) return;

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 36 }, {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          delay: Number(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // Any hero screenshot tilts up off the "desk" as you scroll in
      gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((el) => {
        gsap.fromTo(el, { rotateX: 22, y: 80, scale: 0.92, transformPerspective: 1600 }, {
          rotateX: 0, y: 0, scale: 1, ease: "none",
          scrollTrigger: { trigger: el, start: "top 98%", end: "top 30%", scrub: 0.6 },
        });
      });

      const mm = gsap.matchMedia();

      // EasyFlow: the clutter scatters and leaves only what a team needs
      const declutter = document.querySelector<HTMLElement>(".ef-declutter");
      if (declutter) {
        const noise = gsap.utils.toArray<HTMLElement>(".ef-noise span");
        mm.add({ wide: "(min-width: 900px)", narrow: "(max-width: 899px)" }, (c) => {
          const wide = c.conditions?.wide;
          const tl = gsap.timeline({
            scrollTrigger: wide
              ? { trigger: declutter, start: "top top", end: "+=110%", pin: true, scrub: 0.6, anticipatePin: 1 }
              : { trigger: ".ef-stage", start: "top 75%", end: "bottom 40%", scrub: 0.6 },
          });
          tl.fromTo(noise, { opacity: 1, x: 0, y: 0, rotate: (i) => (i % 2 ? -4 : 5) }, {
            opacity: 0, ease: "power2.in", stagger: 0.03,
            x: (i) => (i % 2 ? -1 : 1) * gsap.utils.random(140, 320),
            y: (i) => (i % 3 === 0 ? -1 : 1) * gsap.utils.random(60, 200),
            rotate: () => gsap.utils.random(-40, 40),
          });
          tl.fromTo(".ef-clean", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, ease: "power2.out", duration: 0.5 }, "-=0.35");
          tl.fromTo(".ef-clean li", { opacity: 0, x: -12 }, { opacity: 1, x: 0, stagger: 0.08, duration: 0.3 }, "-=0.2");
        });
      }

      // EasyFlow: each ticket walks To do → Doing → Done as you scroll
      const lanes = document.querySelector<HTMLElement>(".ef-lanes");
      if (lanes) {
        mm.add("(min-width: 760px)", () => {
          gsap.utils.toArray<HTMLElement>(".ef-ticket").forEach((t, i) => {
            const status = t.querySelector<HTMLElement>(".ef-status");
            gsap.fromTo(t, { x: 0, xPercent: 0 }, {
              xPercent: 200, ease: "power1.inOut",
              scrollTrigger: {
                trigger: lanes, start: `top+=${i * 70} 75%`, end: `top+=${i * 70 + 260} 35%`, scrub: 0.6,
                onUpdate: (s) => {
                  const state = s.progress < 0.35 ? "todo" : s.progress < 0.97 ? "doing" : "done";
                  if (t.dataset.state !== state) {
                    t.dataset.state = state;
                    if (status) status.textContent = state === "todo" ? "To do" : state === "doing" ? "Doing" : "Done";
                  }
                },
              },
            });
          });
        });
      }

      // EasyFlow: the feature checklist ticks itself off
      gsap.utils.toArray<HTMLElement>(".ef-checks li").forEach((li) => {
        li.classList.add("is-off");
        ScrollTrigger.create({ trigger: li, start: "top 80%", onEnter: () => li.classList.remove("is-off"), onLeaveBack: () => li.classList.add("is-off") });
      });

      // Whiteboard: the canvas grid drifts under the page, connectors draw between the story notes
      const canvas = document.querySelector<HTMLElement>(".wb-page");
      if (canvas) {
        gsap.to(canvas, { backgroundPositionY: "-240px", ease: "none", scrollTrigger: { trigger: canvas, start: "top top", end: "bottom bottom", scrub: true } });
      }
      gsap.utils.toArray<HTMLElement>(".wb-wire").forEach((w) => {
        gsap.fromTo(w, { "--draw": 0 }, { "--draw": 1, ease: "none", scrollTrigger: { trigger: w.closest("ol") || w, start: "top 80%", end: "bottom 55%", scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>(".wb-note").forEach((n, i) => {
        gsap.fromTo(n, { y: 60, rotate: 0, opacity: 0 }, {
          y: 0, rotate: Number(n.dataset.tilt || 0), opacity: 1, ease: "back.out(1.6)", duration: 0.8, delay: (i % 4) * 0.08,
          scrollTrigger: { trigger: n, start: "top 88%", once: true },
        });
      });

      // Editor: the title types itself
      const typed = document.querySelector<HTMLElement>("[data-type]");
      if (typed) {
        const full = typed.textContent || "";
        const o = { n: 0 };
        gsap.to(o, {
          n: full.length, duration: Math.min(1.6, full.length * 0.06), ease: "none",
          onUpdate: () => { typed.dataset.shown = full.slice(0, Math.round(o.n)); },
          onStart: () => typed.classList.add("is-typing"),
          onComplete: () => typed.classList.remove("is-typing"),
        });
      }
    });

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(t);
      cleanups.forEach((c) => c?.());
      ctx.revert();
    };
  }, [path]);

  return null;
}

/** Editor page: the sidebar tab for the section you are reading is the selected one. */
function setupEditorTabs() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".ed-side a[href^='#']"));
  if (!links.length) return;
  const sections = links.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean) as HTMLElement[];
  const set = (id: string) => links.forEach((a) => {
    const on = a.hash === `#${id}`;
    a.classList.toggle("on", on);
    if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
  });
  const update = () => {
    const mid = window.innerHeight * 0.35;
    let id = sections[0]?.id;
    sections.forEach((s) => { if (s.getBoundingClientRect().top <= mid) id = s.id; });
    if (id) set(id);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  return () => window.removeEventListener("scroll", update);
}

/** Editor page: the save badge behaves like the package's debounced autosave. Scrolling is "typing". */
function setupAutosaveBadge() {
  const badge = document.querySelector<HTMLElement>(".ed-save");
  if (!badge) return;
  const text = badge.querySelector<HTMLElement>(".ed-save-text");
  let timer = 0;
  const onScroll = () => {
    if (badge.dataset.state !== "saving") {
      badge.dataset.state = "saving";
      if (text) text.textContent = "Saving…";
    }
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      badge.dataset.state = "saved";
      if (text) text.textContent = "Saved";
    }, 900);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => { window.removeEventListener("scroll", onScroll); window.clearTimeout(timer); };
}
