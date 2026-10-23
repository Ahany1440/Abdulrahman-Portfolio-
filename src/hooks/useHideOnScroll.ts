"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Slides the element up out of view while scrolling down and brings it back on any scroll up. */
export function useHideOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const show = gsap.quickTo(el, "yPercent", { duration: 0.45, ease: "power3.out" });
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const past = self.scroll() > 120;
          el.toggleAttribute("data-scrolled", self.scroll() > 8);
          show(past && self.direction === 1 && !el.matches(":focus-within") ? -110 : 0);
        },
      });
    },
    { scope: ref },
  );

  return ref;
}
