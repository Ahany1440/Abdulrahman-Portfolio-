"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { isPointerFine } from "./usePointerFine";

/**
 * The skill grid lights up cell by cell as it scrolls through the viewport (a diagonal sweep),
 * and a spotlight follows the cursor so nearby cell edges glow.
 */
export function useSkillGrid<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useGSAP(
    (_, contextSafe) => {
      const grid = ref.current;
      if (!grid || !contextSafe) return;
      const cells = gsap.utils.toArray<HTMLElement>("[data-cell]", grid);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        cells.forEach((c) => c.setAttribute("data-lit", ""));
      } else {
        // Order cells along a diagonal so the light travels across the grid.
        const order = () => {
          const g = grid.getBoundingClientRect();
          return cells
            .map((c) => {
              const r = c.getBoundingClientRect();
              return { c, k: (r.left - g.left) / g.width + (r.top - g.top) / g.height };
            })
            .sort((a, b) => a.k - b.k);
        };
        let ranked = order();
        gsap.to({}, {
          scrollTrigger: {
            trigger: grid,
            start: "top 80%",
            end: "bottom 45%",
            scrub: true,
            onRefresh: () => (ranked = order()),
            onUpdate: (self) => {
              const n = Math.round(self.progress * ranked.length);
              ranked.forEach(({ c }, i) => c.toggleAttribute("data-lit", i < n));
            },
          },
        });
      }

      if (!isPointerFine()) return;
      const move = contextSafe((e: PointerEvent) => {
        const r = grid.getBoundingClientRect();
        grid.style.setProperty("--gx", `${e.clientX - r.left}px`);
        grid.style.setProperty("--gy", `${e.clientY - r.top}px`);
      });
      const leave = () => {
        grid.style.setProperty("--gx", "-999px");
        grid.style.setProperty("--gy", "-999px");
      };
      grid.addEventListener("pointermove", move);
      grid.addEventListener("pointerleave", leave);
      return () => {
        grid.removeEventListener("pointermove", move);
        grid.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  return ref;
}
