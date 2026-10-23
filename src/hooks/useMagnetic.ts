"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { isPointerFine } from "./usePointerFine";
import { prefersReducedMotion } from "./useReducedMotion";

/**
 * Pulls an element toward the cursor while it hovers, then lets it spring back.
 * A child marked [data-magnetic-inner] travels a little further for a parallax feel.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.32) {
  const ref = useRef<T>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe || !isPointerFine() || prefersReducedMotion()) return;
      const inner = el.querySelector<HTMLElement>("[data-magnetic-inner]");
      const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "expo.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "expo.out" });
      const ixTo = inner ? gsap.quickTo(inner, "x", { duration: 0.7, ease: "expo.out" }) : null;
      const iyTo = inner ? gsap.quickTo(inner, "y", { duration: 0.7, ease: "expo.out" }) : null;

      const move = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        xTo(x * strength);
        yTo(y * strength);
        ixTo?.(x * strength * 0.45);
        iyTo?.(y * strength * 0.45);
      });
      const leave = contextSafe(() => {
        xTo(0);
        yTo(0);
        ixTo?.(0);
        iyTo?.(0);
      });

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  return ref;
}
