"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { isPointerFine } from "./usePointerFine";
import { prefersReducedMotion } from "./useReducedMotion";

/**
 * 3D tilt toward the cursor with a moving light sheen (CSS vars --mx/--my drive the sheen gradient)
 * and a small counter-shift on [data-parallax-inner]. Touch screens get a press-scale instead.
 */
export function useTilt<T extends HTMLElement>(max = 8) {
  const ref = useRef<T>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe || prefersReducedMotion()) return;

      if (!isPointerFine()) {
        const down = contextSafe(() => gsap.to(el, { scale: 0.975, duration: 0.25, ease: "power2.out" }));
        const up = contextSafe(() => gsap.to(el, { scale: 1, duration: 0.5, ease: "expo.out" }));
        el.addEventListener("pointerdown", down);
        el.addEventListener("pointerup", up);
        el.addEventListener("pointercancel", up);
        el.addEventListener("pointerleave", up);
        return () => {
          el.removeEventListener("pointerdown", down);
          el.removeEventListener("pointerup", up);
          el.removeEventListener("pointercancel", up);
          el.removeEventListener("pointerleave", up);
        };
      }

      gsap.set(el, { transformPerspective: 1100, transformStyle: "preserve-3d" });
      const inner = el.querySelector<HTMLElement>("[data-parallax-inner]");
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
      const ix = inner ? gsap.quickTo(inner, "x", { duration: 0.8, ease: "power3.out" }) : null;
      const iy = inner ? gsap.quickTo(inner, "y", { duration: 0.8, ease: "power3.out" }) : null;

      const move = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        rx((0.5 - py) * max);
        ry((px - 0.5) * max * 1.2);
        ix?.((0.5 - px) * 18);
        iy?.((0.5 - py) * 14);
        el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      });
      const enter = () => el.setAttribute("data-hover", "");
      const leave = contextSafe(() => {
        el.removeAttribute("data-hover");
        rx(0);
        ry(0);
        ix?.(0);
        iy?.(0);
      });

      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  return ref;
}
