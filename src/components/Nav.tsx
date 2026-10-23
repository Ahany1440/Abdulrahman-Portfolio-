"use client";

import { nav, site } from "@/content";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";

export function Nav() {
  const ref = useHideOnScroll<HTMLElement>();
  return (
    <header
      ref={ref}
      className="group fixed inset-x-0 top-0 z-50 will-change-transform"
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:rounded-full focus:bg-porcelain focus:px-4 focus:py-2 focus:text-black">
        Skip to content
      </a>
      <div className="border-b border-transparent bg-black/0 transition-[background-color,border-color,backdrop-filter] duration-500 group-data-[scrolled]:border-white/10 group-data-[scrolled]:bg-black/65 group-data-[scrolled]:backdrop-blur-xl group-data-[scrolled]:backdrop-saturate-150">
        <nav aria-label="Primary" className="mx-auto flex h-[var(--nav-h)] max-w-[1180px] items-center justify-between gap-6 px-5 sm:px-8">
          <a href="#hero" data-cursor="link" className="text-[15px] font-semibold tracking-[-0.02em] whitespace-nowrap text-porcelain sm:text-[17px]">
            {site.name}
          </a>
          <div className="flex items-center gap-5 sm:gap-7">
            <ul className="flex items-center gap-5 text-[14px] text-porcelain/80 sm:gap-7">
              {nav.links.map((l, i) => (
                <li key={l.href} className={i === 1 || i === 2 ? "hidden sm:block" : ""}>
                  <a href={l.href} data-cursor="link" className="transition-colors hover:text-porcelain">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={nav.cta.href}
              download={site.cvFileName}
              data-cursor="link"
              className="rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-medium text-white transition-[filter] hover:brightness-110"
            >
              {nav.cta.label}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
