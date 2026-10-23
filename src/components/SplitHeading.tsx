"use client";

import type { ReactNode } from "react";
import { useSplitReveal } from "@/hooks/useSplitReveal";

type Props = {
  as?: "h1" | "h2" | "h3" | "p";
  by?: "lines" | "words";
  className?: string;
  id?: string;
  start?: string | false;
  delay?: number;
  children: ReactNode;
};

/** A heading that reveals line by line (or word by word) from behind a mask when it scrolls into view. */
export function SplitHeading({ as: Tag = "h2", by = "lines", className = "", id, start, delay, children }: Props) {
  const ref = useSplitReveal<HTMLHeadingElement>({ by, start, delay });
  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
