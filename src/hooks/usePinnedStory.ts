"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Pins the featured stage and scrubs through its steps: the frame scales up, screens cross-fade,
 * and captions slide in one at a time. Phones get a shorter pin with cross-fades only.
 * Markup contract (inside the stage): [data-story-frame], [data-story-media] x n, [data-story-caption] x n,
 * [data-story-count], [data-story-bar].
 */
export function usePinnedStory<T extends HTMLElement>(steps: number) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const stage = ref.current;
      if (!stage) return;
      const q = gsap.utils.selector(stage);
      const media = q("[data-story-media]");
      const captions = q("[data-story-caption]");
      const frame = q("[data-story-frame]");
      const count = stage.querySelector<HTMLElement>("[data-story-count]");
      const bar = q("[data-story-bar]");
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          phone: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean; phone: boolean };
          gsap.set(media.slice(1), { autoAlpha: 0 });
          gsap.set(captions.slice(1), { autoAlpha: 0, y: 40 });

          const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: () => `+=${window.innerHeight * steps * (desktop ? 0.9 : 0.55)}`,
              pin: true,
              scrub: 0.7,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const i = Math.min(steps - 1, Math.floor(self.progress * steps * 0.999));
                if (count) count.textContent = String(i + 1).padStart(2, "0");
              },
            },
          });

          if (desktop) {
            tl.fromTo(frame, { scale: 0.72, borderRadius: 44 }, { scale: 1, borderRadius: 28, duration: 1, ease: "power3.out" }, 0);
            tl.fromTo(media[0], { scale: 1.12 }, { scale: 1, duration: 1.2, ease: "none" }, 0);
          }
          tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: steps, ease: "none" }, 0);

          for (let i = 1; i < steps; i++) {
            const at = i;
            tl.to(captions[i - 1], { autoAlpha: 0, y: -32, duration: 0.35 }, at - 0.2)
              .fromTo(media[i], { autoAlpha: 0, scale: desktop ? 1.08 : 1 }, { autoAlpha: 1, scale: 1, duration: 0.6 }, at - 0.25)
              .to(captions[i], { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }, at + 0.05);
          }
          tl.to({}, { duration: 0.4 });
        },
      );
    },
    { scope: ref, dependencies: [steps] },
  );

  return ref;
}
