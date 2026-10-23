"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { isPointerFine } from "./usePointerFine";
import { prefersReducedMotion } from "./useReducedMotion";
import { cursorLabels } from "@/content";

type CursorState = "idle" | "link" | "project";

/**
 * Dot + trailing ring. The ring grows over links ([data-cursor="link"]) and shows a label over
 * projects ([data-cursor="project"]). Desktop with a fine pointer only; otherwise it never mounts.
 */
export function useCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("idle");

  useEffect(() => {
    if (!isPointerFine()) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const reduced = prefersReducedMotion();
    document.documentElement.classList.add("has-cursor");
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "none" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "none" });
    const rx = gsap.quickTo(ring.current, "x", { duration: reduced ? 0.08 : 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: reduced ? 0.08 : 0.45, ease: "power3.out" });
    let visible = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!visible) {
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
        visible = true;
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      setState((target?.getAttribute("data-cursor") as CursorState) ?? "idle");
    };
    const leave = () => {
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.2 });
      visible = false;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled]);

  const label = state === "project" ? cursorLabels.project : "";
  return { dot, ring, enabled, state, label };
}
