"use client";

import { featured } from "@/content";
import { usePinnedStory } from "@/hooks/usePinnedStory";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MediaFrame } from "@/components/MediaFrame";
import { SplitHeading } from "@/components/SplitHeading";

function Links() {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {featured.links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          className="text-[17px] text-accent-link underline-offset-4 hover:underline"
        >
          {l.label} <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}

/** Static version for reduced motion: every step, stacked, no pinning. */
function StaticStory() {
  return (
    <div className="mx-auto flex max-w-[1080px] flex-col gap-20 px-6 pb-32">
      {featured.steps.map((s, i) => (
        <div key={s.title} className="flex flex-col gap-6">
          <MediaFrame media={s.media} sizes="(min-width: 1100px) 1080px, 100vw" className="aspect-[16/10] w-full" />
          <div className="max-w-[46ch]">
            <p className="text-small text-ash">{String(i + 1).padStart(2, "0")} / {String(featured.steps.length).padStart(2, "0")}</p>
            <h3 className="type-title mt-2">{s.title}</h3>
            <p className="mt-3 text-ash">{s.body}</p>
          </div>
        </div>
      ))}
      <Links />
    </div>
  );
}

export function Featured() {
  const reduced = useReducedMotion();
  const stage = usePinnedStory<HTMLDivElement>(featured.steps.length);
  const total = String(featured.steps.length).padStart(2, "0");

  return (
    <section id="featured" aria-labelledby="featured-title" className="relative z-10">
      <div className="mx-auto flex min-h-[90svh] max-w-[1100px] flex-col items-center justify-center px-6 pt-[18vh] pb-[14vh] text-center">
        <p className="text-[21px] font-semibold tracking-[0.01em] text-porcelain sm:text-[28px]">{featured.name}</p>
        <SplitHeading id="featured-title" className="type-display mt-3 max-w-[14ch]">
          {featured.headline}
        </SplitHeading>
        <p className="mt-8 text-small text-ash">{featured.stack.join(" · ")}</p>
      </div>

      {reduced ? (
        <StaticStory />
      ) : (
        <div id="featured-stage" ref={stage} className="relative h-[100svh] bg-black">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-48 h-48 bg-gradient-to-b from-transparent to-black" />
          <div className="mx-auto flex h-full max-w-[1180px] flex-col justify-center gap-6 px-5 pt-[calc(var(--nav-h)+12px)] pb-8 sm:gap-8 sm:px-8">
            <div
              data-story-frame
              className="relative mx-auto aspect-[16/10] w-full max-w-[min(1080px,calc((100svh-280px)*1.6))] overflow-hidden rounded-[28px] bg-carbon will-change-transform"
            >
              {featured.steps.map((s, i) => (
                <div key={s.media.src} data-story-media className="absolute inset-0 will-change-[opacity,transform]">
                  <MediaFrame media={s.media} sizes="(min-width: 1100px) 1080px, 100vw" priority={i === 0} className="h-full w-full rounded-none" />
                </div>
              ))}
            </div>

            <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 items-end gap-4 sm:grid-cols-[1fr_auto]">
              <div className="grid">
                {featured.steps.map((s) => (
                  <div key={s.title} data-story-caption className="[grid-area:1/1] max-w-[52ch]">
                    <h3 className="text-[24px] leading-[1.15] font-semibold tracking-[-0.01em] sm:text-[32px]">{s.title}</h3>
                    <p className="mt-2 text-[15px] leading-[1.47] text-ash sm:text-[17px]">{s.body}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                <p className="text-small tabular-nums text-ash" aria-hidden="true">
                  <span data-story-count className="text-porcelain">01</span> / {total}
                </p>
                <span className="block h-px w-24 overflow-hidden bg-white/15" aria-hidden="true">
                  <span data-story-bar className="block h-full w-full origin-left bg-porcelain" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!reduced && (
        <div className="mx-auto max-w-[1080px] px-5 pt-10 pb-28 sm:px-8">
          <Links />
        </div>
      )}
    </section>
  );
}
