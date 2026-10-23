"use client";

import { useState } from "react";
import { contact, site } from "@/content";
import { SplitHeading } from "@/components/SplitHeading";
import { Pill } from "@/components/Pill";
import { useMagnetic } from "@/hooks/useMagnetic";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const email = useMagnetic<HTMLButtonElement>(0.12);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative z-10 bg-black pt-32 pb-16 sm:pt-44">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <SplitHeading id="contact-title" by="words" className="type-display max-w-[11ch]">
          {contact.headline}
        </SplitHeading>
        <p className="mt-6 max-w-[48ch] text-[19px] leading-[1.42] text-ash">{contact.body}</p>

        <div className="mt-14 flex flex-col gap-3">
          <button
            ref={email}
            type="button"
            onClick={copy}
            data-cursor="link"
            className="group w-fit text-left"
            aria-describedby="email-hint"
          >
            <span data-magnetic-inner className="block text-[24px] leading-tight font-semibold tracking-[-0.02em] [overflow-wrap:anywhere] text-porcelain transition-colors group-hover:text-accent-link sm:text-[44px]">
              {site.email}
            </span>
          </button>
          <p id="email-hint" className="text-[14px] text-ash" aria-live="polite">
            {copied ? contact.copied : contact.copyHint} ·{" "}
            <a href={`mailto:${site.email}`} className="text-accent-link underline-offset-4 hover:underline">
              open in mail app
            </a>
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Pill href={contact.cv.href} download={site.cvFileName}>
            {contact.cv.label}
          </Pill>
          {contact.links.map((l) => (
            <Pill key={l.href} href={l.href} variant="secondary" external>
              {l.label} <span aria-hidden="true">↗</span>
            </Pill>
          ))}
        </div>
      </div>
    </section>
  );
}
