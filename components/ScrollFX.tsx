"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * All scroll choreography lives here and runs on the server-rendered DOM,
 * so every word stays in the HTML for search engines and LLM crawlers.
 */
export default function ScrollFX() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("js");
    if (reduce) {
      document.documentElement.classList.add("reduce");
      setupRail();
      return;
    }

    // the dot-field intro (idea -> ship) runs first; the hero content arrives after it
    const introPending = document.documentElement.classList.contains("intro");
    let onReveal: (() => void) | null = null;
    let onDone: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const flyItems = ".hero .line, .hero [data-hero-in]:not(.scroll-cue)";

      const playClassic = () => {
        gsap.fromTo(".hero-name .line", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: "power3.out", delay: 0.15 });
        gsap.fromTo(".hero [data-hero-in]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", delay: 0.6 });
      };

      // every hero piece starts at the centre of the screen and flies to its place
      const playFromCenter = () => {
        const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        const offset = (axis: "x" | "y") => (_: number, el: Element) => {
          const r = el.getBoundingClientRect();
          return axis === "x" ? cx - (r.left + r.width / 2) : cy - (r.top + r.height / 2);
        };
        gsap.fromTo(flyItems,
          { opacity: 0, scale: 0.3, filter: "blur(14px)", x: offset("x"), y: offset("y") },
          { opacity: 1, scale: 1, filter: "blur(0px)", x: 0, y: 0, duration: 1.4, stagger: 0.1, ease: "expo.out", clearProps: "filter,transform" });
        gsap.fromTo(".hero .scroll-cue", { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 1.2, ease: "power2.out" });
      };

      if (introPending) {
        gsap.set(`${flyItems}, .hero .scroll-cue`, { opacity: 0 });
        onReveal = () => ctx.add(playFromCenter);
        onDone = () => ScrollTrigger.refresh();
        window.addEventListener("intro:reveal", onReveal, { once: true });
        window.addEventListener("intro:done", onDone, { once: true });
      } else {
        playClassic();
      }

      // 01 Manifesto: pinned, words light up as you scroll
      const story = document.querySelector<HTMLElement>(".story-pin");
      if (story) {
        const words = story.querySelectorAll(".w");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: story, start: "top top", end: () => `+=${window.innerHeight * 2.2}`, pin: true, scrub: 0.6, anticipatePin: 1 },
        });
        tl.to(words, { opacity: 1, stagger: 0.12, ease: "none", duration: 0.4 });
        tl.to(".story-progress span", { scaleX: 1, ease: "none", duration: words.length * 0.12 }, 0);
      }

      // 01b Reasons: one card per screen. Scroll brings the next; after the last, the page moves on.
      setupReasons();

      // Generic reveals
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 36 }, {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          delay: Number(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // 02 Stack: rows drift opposite ways with scroll
      gsap.utils.toArray<HTMLElement>(".marquee-row").forEach((row, i) => {
        gsap.fromTo(row, { xPercent: i % 2 ? -18 : 0 }, {
          xPercent: i % 2 ? 0 : -18, ease: "none",
          scrollTrigger: { trigger: "#stack", start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      // 03 Products: horizontal track on wide screens
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        const track = document.querySelector<HTMLElement>(".work-track");
        const pin = document.querySelector<HTMLElement>(".work-pin");
        if (!track || !pin) return;
        const dist = () => Math.max(0, track.scrollWidth - pin.clientWidth);
        gsap.to(track, {
          x: () => -dist(), ease: "none",
          scrollTrigger: { trigger: pin, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
        });
      });

      // 04 Experience: the line draws, each role lights up as it passes
      const tlist = document.querySelector<HTMLElement>(".timeline");
      if (tlist) {
        gsap.fromTo(".timeline-fill", { scaleY: 0 }, {
          scaleY: 1, ease: "none",
          scrollTrigger: { trigger: tlist, start: "top 70%", end: "bottom 60%", scrub: true },
        });
        gsap.utils.toArray<HTMLElement>(".timeline li").forEach((li) => {
          ScrollTrigger.create({ trigger: li, start: "top 65%", onEnter: () => li.classList.add("is-on"), onLeaveBack: () => li.classList.remove("is-on") });
        });
      }

      // Contact: big line powers on
      gsap.fromTo(".cta-big", { opacity: 0.08 }, {
        opacity: 1, ease: "none",
        scrollTrigger: { trigger: ".cta-big", start: "top 90%", end: "top 45%", scrub: true },
      });
    });

    setupRail();
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(t);
      if (onReveal) window.removeEventListener("intro:reveal", onReveal);
      if (onDone) window.removeEventListener("intro:done", onDone);
      ctx.revert();
    };
  }, []);

  return null;
}

function setupReasons() {
  const stage = document.querySelector<HTMLElement>(".reasons-pin");
  const cards = gsap.utils.toArray<HTMLElement>(".reasons .reason");
  const n = cards.length;
  if (!stage || n < 2) return;

  const now = stage.querySelector<HTMLElement>(".rc-now");
  const segs = Array.from(stage.querySelectorAll<HTMLElement>(".rc-bar span"));
  const D = n - 1 + 0.6; // timeline length: one unit per hand-off plus a short hold on the last card
  const inner = (c: HTMLElement) => c.querySelectorAll("[data-r]");

  // scroll progress at which each card is fully shown (first at the start, last at the end)
  const snapPoints = cards.map((_, i) => (i === 0 ? 0 : i === n - 1 ? 1 : (i + 0.3) / D));

  let active = -1;
  const setActive = (a: number) => {
    if (a === active) return;
    active = a;
    cards.forEach((c, i) => c.classList.toggle("is-active", i === a));
    segs.forEach((s, i) => s.classList.toggle("on", i <= a));
    if (now) now.textContent = String(a + 1).padStart(2, "0");
  };
  setActive(0);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: "top top",
      end: () => `+=${window.innerHeight * D}`,
      pin: true,
      scrub: 0.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // settle on the nearest card (no velocity carry-over, so a hard flick can't skip cards)
      snap: { snapTo: snapPoints, inertia: false, duration: { min: 0.25, max: 0.7 }, delay: 0.12, ease: "power1.inOut" },
      onUpdate: (self) => {
        const t = self.progress * D;
        let a = 0;
        for (let i = 1; i < n; i++) if (t >= i + 0.1) a = i;
        setActive(a);
      },
    },
  });

  tl.addLabel("r0", 0);
  for (let i = 1; i < n; i++) {
    // previous card lifts away, the next one rises in and its parts stagger on
    tl.to(cards[i - 1], { opacity: 0, y: -60, scale: 1.03, duration: 0.3, ease: "power2.in" }, i - 0.25);
    tl.fromTo(cards[i], { opacity: 0, y: 80, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power2.out" }, i - 0.05);
    tl.fromTo(inner(cards[i]), { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: "power2.out" }, i);
    tl.addLabel(`r${i}`, i === n - 1 ? D : i + 0.3);
  }
  tl.set({}, {}, D); // pad to full length so the last card holds briefly before the pin releases
}

function setupRail() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".rail a"));
  const fill = document.querySelector<HTMLElement>(".rail-fill");
  const ids = links.map((a) => a.getAttribute("href")!.slice(1));
  const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
  const update = () => {
    const mid = window.scrollY + window.innerHeight * 0.45;
    let active = 0;
    els.forEach((el, i) => { if (el.getBoundingClientRect().top + window.scrollY <= mid) active = i; });
    links.forEach((a, i) => {
      a.classList.toggle("is-active", i === active);
      if (i === active) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (fill) fill.style.transform = `scaleY(${max > 0 ? window.scrollY / max : 0})`;
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}
