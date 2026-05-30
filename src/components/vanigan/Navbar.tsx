import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "#top" },
  { label: "Categories", href: "#categories" },
  { label: "Cities", href: "#cities" },
  { label: "Blog", href: "#blog" },
  { label: "About", href: "#why" },
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
      {/* Announcement bar */}
      <div className="bg-sage text-text-light text-xs md:text-sm py-2 text-center font-medium">
        🎉 Free business listings for Tamil Nadu SMEs — <a href="#cta" className="underline underline-offset-2">Get Started</a>
      </div>

      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-forest/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <nav aria-label="Primary" className="container-x flex items-center justify-between h-16 md:h-20">
          <a href="#top" className="font-display font-extrabold text-xl md:text-2xl text-sage tracking-tight">
            Vanigan<span className="text-text-light">.org</span>
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-sm font-medium text-text-light/80 hover:text-sage transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#cta"
              className="hidden sm:inline-flex items-center rounded-full bg-sage hover:bg-sage-soft text-forest-deep font-bold text-sm px-5 py-2.5 transition-colors"
            >
              List Your Business
            </a>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen(true)}
              className="md:hidden text-text-light p-2"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-forest-deep flex flex-col p-6 md:hidden">
          <div className="flex justify-between items-center">
            <span className="font-display font-extrabold text-xl text-sage">Vanigan<span className="text-text-light">.org</span></span>
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
                  className="font-display font-bold text-3xl text-text-light hover:text-sage"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#cta"
            onClick={() => setOpen(false)}
            className="mt-auto inline-flex justify-center rounded-full bg-sage text-forest-deep font-bold px-6 py-4"
          >
            List Your Business
          </a>
        </div>
      )}
    </>
  );
}
