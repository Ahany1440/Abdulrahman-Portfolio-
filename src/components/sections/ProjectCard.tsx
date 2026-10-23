"use client";

import type { Project } from "@/content";
import { useTilt } from "@/hooks/useTilt";
import { MediaFrame } from "@/components/MediaFrame";

type Props = { project: Project; className?: string; wide?: boolean };

export function ProjectCard({ project, className = "", wide }: Props) {
  const ref = useTilt<HTMLElement>(7);
  const primary = project.links[0];
  return (
    <article
      ref={ref}
      data-card
      data-cursor="project"
      className={`project-card group relative flex flex-col overflow-hidden rounded-[28px] bg-black ring-1 ring-white/[0.08] will-change-transform ${className}`}
    >
      <MediaFrame
        media={project.media}
        sizes={wide ? "(min-width: 1024px) 680px, 100vw" : "(min-width: 1024px) 460px, (min-width: 640px) 50vw, 100vw"}
        className="m-3 mb-0 aspect-[16/10] rounded-[20px]"
        imgClassName="transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]"
        parallax
      />
      <div className="flex flex-1 flex-col gap-3 px-6 pt-6 pb-6 sm:px-7">
        <h3 className="text-[28px] leading-none font-semibold tracking-[0.004em]">
          {/* The title link covers the card so the whole tile is clickable; the other links sit above it. */}
          <a href={primary.href} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 after:rounded-[28px] after:content-['']">
            {project.name}
          </a>
        </h3>
        <p className="max-w-[44ch] text-[15px] leading-[1.47] text-ash sm:text-[17px]">{project.oneLiner}</p>
        <ul className="mt-1 flex flex-wrap gap-1.5" aria-label="Stack">
          {project.stack.map((t) => (
            <li key={t} className="rounded-full bg-white/[0.07] px-3 py-1 text-[12px] text-porcelain/80">
              {t}
            </li>
          ))}
        </ul>
        <div className="relative z-10 mt-auto flex gap-5 pt-3">
          {project.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="text-[15px] text-accent-link underline-offset-4 hover:underline"
            >
              {l.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="card-sheen pointer-events-none absolute inset-0 rounded-[28px]" />
    </article>
  );
}
