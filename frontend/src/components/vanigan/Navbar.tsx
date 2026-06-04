import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import communityLogo from "./community.png";

function makeImageTransparent(imgUrl: string): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(imgUrl);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(imgUrl);
        return;
      }
      ctx.drawImage(img, 0, 0);
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const maxVal = Math.max(r, g, b);
          if (maxVal < 55) {
            if (maxVal < 20) {
              data[i + 3] = 0;
            } else {
              data[i + 3] = Math.round(((maxVal - 20) / 35) * 255);
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (e) {
        resolve(imgUrl);
      }
    };
    img.onerror = () => {
      resolve(imgUrl);
    };
    img.src = imgUrl;
  });
}

const links = [
  { label: "PLATFORM", href: "#categories" },
  { label: "COMPANY",  href: "#why"        },
  { label: "NEWSROOM", href: "#blog"       },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [logoSrc, setLogoSrc]   = useState<string>(communityLogo);

  useEffect(() => {
    makeImageTransparent(communityLogo).then((res) => {
      setLogoSrc(res);
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Editorial light navbar ─────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 w-full transition-all duration-500 border-b backdrop-blur-md flex items-center ${
          scrolled
            ? "bg-background/95 border-border shadow-sm h-16"
            : "bg-background/85 border-transparent h-20"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">

          {/* Logo — serif wordmark */}
          <a
            href="#top"
            className="flex items-center gap-2.5 font-display font-normal text-base tracking-tight text-foreground hover:opacity-75 transition-opacity"
          >
            <img
              src={logoSrc}
              alt="Vanigan logo"
              className="size-6 object-contain shrink-0"
              style={{ animation: "spin 15s linear infinite" }}
            />
            <span>Vanigan<span className="italic text-sage">.org</span></span>
          </a>

          {/* Centre nav — mono caps */}
          <nav aria-label="Primary" className="hidden md:flex items-center">
            <ul className="flex items-center gap-1" style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="px-4 py-2 text-[10px] font-semibold tracking-[0.22em] uppercase text-foreground/50 hover:text-sage hover:bg-bg-section rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right — CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/add-business"
              className="hidden lg:inline-flex items-center rounded-xl bg-sage hover:bg-sage-soft text-white px-5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage cursor-pointer"
            >
              + Add Business
            </Link>
            
            <Link
              to="/list-business"
              className="hidden sm:inline-flex items-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 cursor-pointer"
            >
              Explore
            </Link>

            <button
              aria-label="Toggle menu"
              onClick={() => setOpen(true)}
              className="md:hidden text-foreground p-2 hover:text-sage transition-colors cursor-pointer"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div aria-hidden className="h-20" />

      {/* ── Mobile menu — warm editorial ──────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-60 bg-background flex flex-col p-6 md:hidden border-r border-border"
          style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
        >
          {/* Header row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5 font-display font-normal text-lg tracking-tight text-foreground">
              <img
                src={logoSrc}
                alt="Vanigan logo"
                className="size-6 object-contain shrink-0"
                style={{ animation: "spin 15s linear infinite" }}
              />
              <span>Vanigan<span className="italic text-sage">.org</span></span>
            </div>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="text-foreground p-2 hover:text-sage transition-colors cursor-pointer"
            >
              <X className="size-6" />
            </button>
          </div>

          {/* Nav links */}
          <ul className="mt-12 flex flex-col gap-6">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-2xl font-semibold tracking-[0.22em] uppercase text-foreground/60 hover:text-sage transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile CTA */}
          <div className="mt-auto flex flex-col gap-3">
            <Link
              to="/add-business"
              onClick={() => setOpen(false)}
              className="inline-flex justify-center rounded-xl bg-sage hover:bg-sage-soft text-white px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage cursor-pointer"
            >
              + Add Your Business
            </Link>
            
            <Link
              to="/list-business"
              onClick={() => setOpen(false)}
              className="inline-flex justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 cursor-pointer"
            >
              Explore Directory
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
