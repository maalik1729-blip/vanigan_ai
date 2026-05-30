import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "PLATFORM", href: "#categories" },
  { label: "COMPANY", href: "#why" },
  { label: "NEWSROOM", href: "#blog" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Floating pill navbar */}
      <header className="fixed top-4 inset-x-0 z-50 flex justify-between items-center px-4 pointer-events-none">
        <a
          href="#top"
          className={`pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-full border backdrop-blur-xl transition-all duration-500 ${
            scrolled
              ? "bg-black/85 border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]"
              : "bg-black/60 border-white/10 shadow-lg"
          } text-sm font-display font-extrabold tracking-tight text-text-light`}
        >
          <span className="size-2 rounded-full bg-sage animate-pulse" />
          <span>Vanigan<span className="text-sage font-medium">.org</span></span>
        </a>

        <nav
          aria-label="Primary"
          className={`pointer-events-auto flex items-center gap-2 rounded-full border backdrop-blur-xl transition-all duration-500 ${
            scrolled
              ? "bg-black/85 border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]"
              : "bg-black/60 border-white/10 shadow-lg"
          }`}
          style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
        >
          <ul className="hidden md:flex items-center">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="px-4 py-2 text-[11px] font-semibold tracking-[0.22em] uppercase text-text-light/85 hover:text-text-light transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#cta"
            className="ml-1 hidden sm:inline-flex items-center rounded-full bg-black text-text-light px-5 py-2.5 text-[11px] font-semibold tracking-[0.22em] uppercase hover:bg-forest-deep transition-colors"
          >
            WORK WITH US
          </a>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(true)}
            className="md:hidden text-text-light p-2"
          >
            <Menu className="size-5" />
          </button>
        </nav>
      </header>

      {/* Spacer so content doesn't sit under the floating nav */}
      <div aria-hidden className="h-20" />

      {/* Mobile menu */}
      {open && (
        <div
          className="fixed inset-0 z-60 bg-forest-deep flex flex-col p-6 md:hidden"
          style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-lg font-display font-extrabold tracking-tight text-text-light">
              <span className="size-2 rounded-full bg-sage animate-pulse" />
              <span>Vanigan<span className="text-sage font-medium">.org</span></span>
            </div>
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="text-text-light p-2">
              <X className="size-6" />
            </button>
          </div>
          <ul className="mt-12 flex flex-col gap-6">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-2xl font-semibold tracking-[0.22em] uppercase text-text-light hover:text-sage"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#cta"
            onClick={() => setOpen(false)}
            className="mt-auto inline-flex justify-center rounded-full bg-black text-text-light px-6 py-4 text-xs font-semibold tracking-[0.22em] uppercase"
          >
            WORK WITH US
          </a>
        </div>
      )}
    </>
  );
}
