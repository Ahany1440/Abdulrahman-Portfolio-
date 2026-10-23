"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "./useReducedMotion";

type Options = {
  /** Reveal by line (default) or by word. */
  by?: "lines" | "words";
  /** ScrollTrigger start. Pass false to play immediately on mount. */
  start?: string | false;
  delay?: number;
  stagger?: number;
};

/**
 * Splits a heading into lines or words and slides each piece up from behind a mask as it enters view.
 * Re-splits on resize and after webfonts load, so line breaks always match the layout.
 */
export function useSplitReveal<T extends HTMLElement>({ by = "lines", start = "top 85%", delay = 0, stagger }: Options = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const scrollTrigger = start === false ? undefined : { trigger: el, start, once: true };

      if (prefersReducedMotion()) {
        gsap.from(el, { autoAlpha: 0, duration: 0.6, ease: "none", delay, scrollTrigger });
        return;
      }

      SplitText.create(el, {
        type: by === "words" ? "words,lines" : "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        aria: "auto",
        onSplit(self) {
          const targets = by === "words" ? self.words : self.lines;
          return gsap.from(targets, {
            yPercent: 115,
            duration: 1.25,
            ease: "expo.out",
            stagger: stagger ?? (by === "words" ? 0.06 : 0.1),
            delay,
            scrollTrigger,
          });
        },
      });
    },
    { scope: ref },
  );

  return ref;
}
