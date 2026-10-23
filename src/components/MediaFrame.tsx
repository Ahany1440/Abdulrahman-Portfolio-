"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Media } from "@/content";

type Props = {
  media: Media;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Inner element for parallax; receives data-parallax-inner. */
  parallax?: boolean;
};

/**
 * A rounded media frame. Shows the screenshot, and swaps in a muted screen-recording loop once the
 * frame is near the viewport (if one is provided in content.ts).
 */
export function MediaFrame({ media, sizes, priority, className = "", imgClassName = "", parallax }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    if (!media.video || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setPlayVideo(true), { rootMargin: "200px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [media.video]);

  return (
    <div ref={ref} className={`relative overflow-hidden rounded-[28px] bg-carbon ${className}`}>
      <div data-parallax-inner={parallax ? "" : undefined} className={`absolute ${parallax ? "-inset-[6%]" : "inset-0"}`}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className={`object-cover ${imgClassName}`}
        />
        {playVideo && media.video && (
          <video className="absolute inset-0 h-full w-full object-cover" src={media.video} autoPlay muted loop playsInline aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
