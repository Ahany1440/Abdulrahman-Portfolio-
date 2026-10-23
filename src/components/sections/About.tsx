"use client";

import { about } from "@/content";
import { useParallax } from "@/hooks/useParallax";
import { SplitHeading } from "@/components/SplitHeading";
import { CountUp } from "@/components/CountUp";

export function About() {
  const root = useParallax<HTMLElement>();
  return (
    <section id="about" ref={root} aria-labelledby="about-title" className="relative z-10 overflow-hidden bg-carbon py-28 sm:py-40">
      <div className="mx-auto grid max-w-[1180px] gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6" data-speed="0.12">
          <SplitHeading id="about-title" className="type-headline max-w-[12ch]">
            {about.headline}
          </SplitHeading>
          <div className="mt-8 flex max-w-[52ch] flex-col gap-5 text-[17px] leading-[1.6] text-ash sm:text-[19px]">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {about.languages && <p className="text-[14px] text-ash">{about.languages}</p>}
            {about.certificates.length > 0 && (
              <div className="text-[14px] text-ash">
                <h3 className="font-semibold text-porcelain">{about.certificatesLabel}</h3>
                <ul className="mt-2 flex flex-col gap-1">
                  {about.certificates.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-12 self-center lg:col-span-5 lg:col-start-8" data-speed="-0.12">
          {about.stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-2 border-t border-white/10 pt-5">
              <dt className="order-2 text-[14px] leading-[1.43] text-ash">{s.label}</dt>
              <dd className="order-1 text-[56px] leading-none font-semibold tracking-[-0.03em] text-porcelain sm:text-[72px]">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
