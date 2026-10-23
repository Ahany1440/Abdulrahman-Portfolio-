"use client";

import type { ReactNode } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  download?: string | boolean;
  external?: boolean;
  className?: string;
};

/** Pill-shaped CTA. Primary uses the accent fill; secondary is a hairline outline. Magnetic on desktop. */
export function Pill({ href, children, variant = "primary", download, external, className = "" }: Props) {
  const ref = useMagnetic<HTMLAnchorElement>(0.28);
  const look =
    variant === "primary"
      ? "bg-accent text-white hover:brightness-110"
      : "border border-slate/80 text-porcelain hover:border-porcelain hover:bg-white/5";
  return (
    <a
      ref={ref}
      href={href}
      download={download}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      data-cursor="link"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-[17px] font-medium tracking-[-0.022em] transition-[filter,background-color,border-color] duration-300 will-change-transform ${look} ${className}`}
    >
      <span data-magnetic-inner className="inline-flex items-center gap-2">
        {children}
      </span>
    </a>
  );
}
