"use client";

import { useState } from "react";
import { skills } from "@/content";
import { useSkillGrid } from "@/hooks/useSkillGrid";
import { SplitHeading } from "@/components/SplitHeading";

const cells = skills.groups.flatMap((g) => g.items.map((item) => ({ item, group: g.name })));
// Pad to a multiple of 6 so every row is complete at 2, 3 and 6 columns.
const fillers = (6 - (cells.length % 6)) % 6;

export function Skills() {
  const grid = useSkillGrid<HTMLUListElement>();
  const [filter, setFilter] = useState<string | null>(null);

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative z-10 bg-black py-28 sm:py-36">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="mb-10 flex flex-col gap-8 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[640px]">
            <SplitHeading id="skills-title" className="type-headline">
              {skills.headline}
            </SplitHeading>
            <p className="mt-5 max-w-[46ch] text-[19px] leading-[1.42] text-ash">{skills.intro}</p>
          </div>
          <div role="group" aria-label="Highlight a group" className="flex flex-wrap gap-2">
            {skills.groups.map((g) => {
              const on = filter === g.name;
              return (
                <button
                  key={g.name}
                  type="button"
                  aria-pressed={on}
                  data-cursor="link"
                  onClick={() => setFilter(on ? null : g.name)}
                  className={`rounded-full px-4 py-2 text-[14px] transition-colors duration-300 ${on ? "bg-porcelain text-black" : "bg-steel/70 text-porcelain/85 hover:bg-steel"}`}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        </div>

        <ul
          ref={grid}
          data-filter={filter ?? undefined}
          aria-label="Technologies"
          className="skill-grid grid grid-cols-2 gap-px overflow-hidden rounded-[28px] sm:grid-cols-3 lg:grid-cols-6"
        >
          {cells.map(({ item, group }) => (
            <li
              key={`${group}-${item}`}
              data-cell
              data-match={filter === group ? "" : undefined}
              className="skill-cell flex min-h-[80px] flex-col justify-between gap-3 bg-black p-4 sm:min-h-[112px] sm:p-5"
            >
              <span className="text-[17px] leading-tight font-semibold tracking-[-0.01em] sm:text-[19px]">{item}</span>
              <span className="text-[12px] text-ash">{group}</span>
            </li>
          ))}
          {Array.from({ length: fillers }, (_, i) => (
            <li key={`filler-${i}`} aria-hidden="true" className="bg-black" />
          ))}
        </ul>
      </div>
    </section>
  );
}
