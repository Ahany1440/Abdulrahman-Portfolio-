"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { hero, site } from "@/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { HERO_READY_EVENT } from "@/hooks/useParticleHero";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePointerFine } from "@/hooks/usePointerFine";
import { Pill } from "@/components/Pill";

const ParticleStage = dynamic(() => import("./ParticleStage"), { ssr: false });

function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const [mountStage, setMountStage] = useState(false);
  const [mobile, setMobile] = useState(true);

  // Load the 3D layer only after the page has loaded and the main thread is idle.
  useEffect(() => {
    setMobile(!fine || window.innerWidth < 768);
    if (!canUseWebGL()) {
      window.dispatchEvent(new Event(HERO_READY_EVENT));
      return;
    }
    let cancelled = false;
    const mount = () => !cancelled && setMountStage(true);
    const go = () => {
      if ("requestIdleCallback" in window) window.requestIdleCallback(mount, { timeout: 1200 });
      else setTimeout(mount, 200);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", go);
    };
  }, [fine]);

  useGSAP(
    (_, contextSafe) => {
      if (!contextSafe) return;
      const q = gsap.utils.selector(root);
      const revealCopy = (delay: number) =>
        gsap.to(q("[data-hero-reveal]"), { autoAlpha: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.12, delay });

      // The DOM name holds the first paint; it hands over to the particles once they start swirling in.
      const onReady = contextSafe(() => {
        gsap.to(q("[data-hero-name]"), { opacity: 0, duration: 1.4, ease: "power2.out", delay: 0.2 });
        revealCopy(reduced ? 0 : 2.2);
      });
      window.addEventListener(HERO_READY_EVENT, onReady, { once: true });
      // If the 3D layer never arrives, show everything anyway.
      const fallback = window.setTimeout(() => revealCopy(0), 4500);

      gsap.to(q("[data-scroll-hint]"), {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "15% top", scrub: true },
      });

      return () => {
        window.removeEventListener(HERO_READY_EVENT, onReady);
        window.clearTimeout(fallback);
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section id="hero" ref={root} aria-labelledby="hero-name" className="relative z-10 h-[100svh] min-h-[600px] overflow-hidden">
      {mountStage && <ParticleStage lines={hero.particleLines} reduced={reduced} mobile={mobile} />}

      <h1
        id="hero-name"
        data-hero-name
        className="type-display absolute inset-x-0 top-[30%] z-10 text-center uppercase sm:top-[34%]"
        aria-label={site.name}
      >
        {hero.particleLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

      <div className="absolute inset-x-0 bottom-[11%] z-10 flex flex-col items-center gap-7 px-6 text-center sm:bottom-[13%]">
        <p data-hero-reveal className="hero-reveal max-w-[34ch] text-[19px] leading-[1.4] text-ash sm:text-[21px]">
          {hero.statement}
        </p>
        <div data-hero-reveal className="hero-reveal flex flex-wrap items-center justify-center gap-3">
          <Pill href={hero.primary.href}>{hero.primary.label}</Pill>
          <Pill href={hero.secondary.href} variant="secondary">
            {hero.secondary.label}
          </Pill>
        </div>
      </div>

      <div data-scroll-hint className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 text-micro text-ash" aria-hidden="true">
        <span>{hero.scrollHint}</span>
        <span className="block h-8 w-px overflow-hidden bg-white/10">
          <span className="scroll-hint-bar block h-full w-full bg-porcelain/70" />
        </span>
      </div>
    </section>
  );
}
