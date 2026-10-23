"use client";

import { useRef } from "react";
import { work } from "@/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SplitHeading } from "@/components/SplitHeading";
import { ProjectCard } from "./ProjectCard";

const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4"];

export function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-card-wrap]", { autoAlpha: 0, y: 70 });
        ScrollTrigger.batch("[data-card-wrap]", {
          start: "top 88%",
          once: true,
          onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.1 }),
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="work" ref={root} aria-labelledby="work-title" className="relative z-10 bg-carbon py-28 sm:py-36">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="mb-14 max-w-[760px] sm:mb-20">
          <SplitHeading id="work-title" className="type-headline">
            {work.headline}
          </SplitHeading>
          <p className="mt-5 max-w-[46ch] text-[19px] leading-[1.42] text-ash">{work.intro}</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">
          {work.projects.map((p, i) => (
            <div key={p.slug} data-card-wrap className={`${spans[i] ?? "lg:col-span-4"} ${i === 0 ? "sm:col-span-2" : ""}`}>
              <ProjectCard project={p} wide={i < 2} className="h-full" />
            </div>
          ))}
        </div>
        {work.more.length > 0 && (
          <div className="mt-14 border-t border-white/10 pt-8">
            <h3 className="text-[14px] text-ash">{work.moreLabel}</h3>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
              {work.more.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" data-cursor="link" className="text-[17px] text-accent-link underline-offset-4 hover:underline">
                    {l.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
