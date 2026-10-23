import { footer } from "@/content";

export function Footer() {
  return (
    <footer className="relative z-10 bg-black">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-2 border-t border-white/10 px-5 py-8 text-[12px] text-ash sm:flex-row sm:justify-between sm:px-8">
        <p>{footer.line}</p>
        <p>
          {footer.colophon} · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
