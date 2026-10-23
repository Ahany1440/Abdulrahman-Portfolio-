"use client";

import { useCursor } from "@/hooks/useCursor";

export function Cursor() {
  const { dot, ring, enabled, state, label } = useCursor();
  if (!enabled) return null;
  const size = state === "project" ? "h-20 w-20 bg-porcelain text-black" : state === "link" ? "h-14 w-14 border border-porcelain/80" : "h-9 w-9 border border-porcelain/50";
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ring}
        className={`fixed top-0 left-0 grid place-items-center rounded-full text-[13px] font-medium tracking-[-0.01em] transition-[width,height,background-color,border-color] duration-300 ease-[cubic-bezier(.16,1,.3,1)] ${size}`}
      >
        {label}
      </div>
      <div ref={dot} className="fixed top-0 left-0">
        <span className={`block h-1.5 w-1.5 rounded-full bg-porcelain transition-opacity duration-200 ${state === "project" ? "opacity-0" : ""}`} />
      </div>
    </div>
  );
}
