"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Moves every [data-speed] child at its own rate while the section scrolls past.
 * data-speed="0.2" drifts up 20% of the section height relative to normal flow; negative values drift down.
 */
export function useParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-speed]", root).forEach((el) => {
          const speed = parseFloat(el.dataset.speed ?? "0");
          gsap.fromTo(
            el,
            { yPercent: speed * 50 },
            {
              yPercent: -speed * 50,
              ease: "none",
              scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
    },
    { scope: ref },
  );

  return ref;
}
