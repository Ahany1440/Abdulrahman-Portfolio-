"use client";

import { useCountUp } from "@/hooks/useCountUp";

export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useCountUp<HTMLSpanElement>(value);
  return (
    <span className="tabular-nums">
      <span ref={ref}>{value}</span>
      {suffix}
    </span>
  );
}
