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
      <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 w-full">
        <div
          className={`w-full max-w-5xl flex items-center justify-between rounded-full border backdrop-blur-xl transition-all duration-500 px-6 py-2.5 ${
            scrolled
              ? "bg-forest-deep/85 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              : "bg-forest-deep/60 border-white/5 shadow-lg"
          }`}
        >
          {/* Logo */}
          <a
            href="#top"
            className="flex items-center gap-2 text-sm font-display font-extrabold tracking-tight text-text-light hover:opacity-90 transition-opacity"
          >
            <span className="size-2 rounded-full bg-sage animate-pulse" />
            <span>Vanigan<span className="text-sage font-medium">.org</span></span>
          </a>

          {/* Center Navigation Links */}
          <nav aria-label="Primary" className="hidden md:flex items-center" style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
            <ul className="flex items-center gap-1">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="px-4 py-2 text-[10px] font-semibold tracking-[0.22em] uppercase text-text-light/75 hover:text-sage hover:bg-white/5 rounded-full transition-all duration-200"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right CTA Button & Mobile Trigger */}
          <div className="flex items-center gap-3">
            <a
              href="#cta"
              className="hidden sm:inline-flex items-center rounded-full bg-sage hover:bg-white text-forest-deep px-5 py-2 text-[10px] font-display font-bold tracking-[0.15em] uppercase transition-all duration-300 shadow-[0_4px_12px_rgba(101,196,155,0.2)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] cursor-pointer"
            >
              List Business
            </a>

            <button
              aria-label="Toggle menu"
              onClick={() => setOpen(true)}
              className="md:hidden text-text-light p-2 hover:text-sage transition-colors cursor-pointer"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
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
