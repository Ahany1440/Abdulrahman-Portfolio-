"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "./useReducedMotion";

/** Counts a number up from zero the first time it scrolls into view. The final value is in the markup for no-JS. */
export function useCountUp<T extends HTMLElement>(value: number, duration = 1.8) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const counter = { v: 0 };
      el.textContent = "0";
      gsap.to(counter, {
        v: value,
        duration,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => {
          el.textContent = String(Math.round(counter.v));
        },
      });
    },
    { scope: ref, dependencies: [value] },
  );

  return ref;
}
