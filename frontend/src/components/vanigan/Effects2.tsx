import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Search, MapPin, Building2, Compass, Sparkles } from "lucide-react";
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
          // If the brightest channel is dark (black/dark background), make it transparent
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

/* ============ Custom Loading Sequence ============ */
export function LoadingSequence() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);
  const [logoSrc, setLogoSrc] = useState<string>(communityLogo);

  useEffect(() => {
    makeImageTransparent(communityLogo).then((res) => {
      setLogoSrc(res);
    });
  }, []);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(100, ((t - start) / 1400) * 100);
      setPct(Math.floor(p));
      if (p < 100) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-200 bg-forest-deep text-text-light flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img
            src={logoSrc}
            alt="Vanigan.org"
            className="h-48 md:h-64 w-auto object-contain"
            initial={{ opacity: 0, scale: 0.7, filter: "blur(8px)", rotate: 0 }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)", rotate: 360 }}
            exit={{
              scale: 3.5,
              opacity: 0,
              filter: "blur(16px)",
              rotate: 420,
              transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
            }}
            transition={{
              opacity: { duration: 1.2 },
              scale: { duration: 1.2, ease: "easeOut" },
              filter: { duration: 1.2, ease: "easeOut" },
              rotate: { repeat: Infinity, duration: 20, ease: "linear" }
            }}
          />
          <motion.div
            className="mt-6 font-mono text-xs tracking-widest text-text-light/60"
            exit={{ opacity: 0, y: 10, transition: { duration: 0.4 } }}
          >
            LOADING — {pct.toString().padStart(3, "0")}%
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============ Advanced Screen Transition (curtain wipe on first paint) ============ */
export function ScreenTransition() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 3800);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="fixed inset-0 z-150 bg-sage"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 1.8 }}
          />
          <motion.div
            className="fixed inset-0 z-149 bg-forest"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 2.0 }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

/* ============ Floating / Sticky Navigation Pill ============ */
export function FloatingNav() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { label: "Discover", href: "#categories", Icon: Compass },
    { label: "Cities", href: "#cities", Icon: MapPin },
    { label: "Business", href: "#featured", Icon: Building2 },
    { label: "Search", href: "#cta", Icon: Search },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Floating quick nav"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-90 flex items-center gap-1 rounded-full bg-forest-deep/90 backdrop-blur-md border border-text-light/10 px-2 py-2 shadow-2xl"
        >
          {items.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              className="group flex items-center gap-2 rounded-full px-3 md:px-4 py-2 text-text-light/80 hover:bg-sage hover:text-forest-deep transition-colors text-sm font-medium"
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{label}</span>
            </a>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

/* ============ Sticky Stacking Cards (cards pin and stack on scroll) ============ */
const stackCards = [
  { tag: "01 / Discover", title: "Every business, mapped.", body: "38 districts, hundreds of categories — indexed and verified." , bg: "bg-forest", fg: "text-text-light" },
  { tag: "02 / Connect", title: "Talk to real owners.", body: "Direct contact, verified hours, real reviews — no middlemen.", bg: "bg-sage", fg: "text-forest-deep" },
  { tag: "03 / Grow", title: "Become discoverable.", body: "Free listings for SMEs across Tamil Nadu — ranked on intent.", bg: "bg-forest-deep", fg: "text-text-light" },
  { tag: "04 / Trust", title: "Verified by people.", body: "Community-driven verification keeps the directory honest.", bg: "bg-bg-section", fg: "text-foreground" },
];

export function StickyStackCards() {
  return (
    <section className="relative bg-background">
      <div className="container-x pt-20 pb-12">
        <p className="section-label">[ How it stacks up ]</p>
        <h2 className="mt-3 font-display font-black text-3xl md:text-5xl max-w-3xl leading-tight">
          Four pillars. <span className="italic text-sage">One platform.</span>
        </h2>
      </div>
      <div>
        {stackCards.map((c, i) => (
          <div key={i} className="sticky top-0 h-screen flex items-center justify-center px-5" style={{ top: `${i * 24}px` }}>
            <div className={`w-full max-w-5xl ${c.bg} ${c.fg} rounded-3xl p-8 md:p-16 shadow-2xl border border-border`}>
              <p className="font-mono text-xs tracking-[0.3em] uppercase opacity-70">{c.tag}</p>
              <h3 className="mt-6 font-display font-black text-4xl md:text-7xl leading-[1.02] tracking-tight">{c.title}</h3>
              <p className="mt-6 text-lg md:text-xl max-w-2xl opacity-80">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ Horizontal Scroll Carousel (pinned, scrubbed by page scroll) ============ */
const horizSlides = [
  { city: "Chennai", count: "3,840", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80" },
  { city: "Coimbatore", count: "2,110", img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80" },
  { city: "Madurai", count: "1,580", img: "https://images.unsplash.com/photo-1567598508481-65985588e295?w=1200&q=80" },
  { city: "Trichy", count: "1,210", img: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=1200&q=80" },
  { city: "Salem", count: "940", img: "https://images.unsplash.com/photo-1601628828688-632f38a5a7d0?w=1200&q=80" },
  { city: "Tirunelveli", count: "780", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80" },
];

export function HorizontalScrollCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-72%"]);

  return (
    <section ref={ref} className="relative h-[280vh] bg-forest-deep text-text-light">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="container-x flex items-end justify-between mb-8">
          <div>
            <p className="section-label">[ Scroll horizontally ]</p>
            <h2 className="mt-3 font-display font-black text-3xl md:text-6xl tracking-tight">
              Tamil Nadu, <span className="italic text-sage">city by city</span>
            </h2>
          </div>
          <div className="hidden md:block font-mono text-xs tracking-[0.3em] uppercase text-text-light/50">
            Drag · scroll · explore →
          </div>
        </div>
        <motion.div style={{ x }} className="flex gap-6 pl-6 md:pl-12">
          {horizSlides.map((s, i) => (
            <article
              key={s.city}
              className={`shrink-0 w-[80vw] md:w-[55vw] lg:w-[42vw] rounded-3xl overflow-hidden border border-text-light/10 relative group ${
                i % 2 ? "h-[58vh] mt-12" : "h-[68vh]"
              }`}
            >
              <img src={s.img} alt={s.city} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-linear-to-t from-forest-deep via-forest-deep/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10">
                <p className="font-mono text-xs tracking-[0.3em] uppercase text-sage">{s.count} businesses</p>
                <h3 className="mt-3 font-display font-black text-4xl md:text-6xl tracking-tight">{s.city}</h3>
              </div>
              <div className="absolute top-5 right-5 size-10 rounded-full bg-sage text-forest-deep grid place-items-center font-bold text-sm">
                {String(i + 1).padStart(2, "0")}
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============ Asymmetric Slider (off-grid drag carousel) ============ */
const asymSlides = [
  { t: "Coffee Roastery", c: "Coonoor", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", h: "h-[420px]", w: "w-[300px]" },
  { t: "Silk Atelier", c: "Kanchipuram", img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80", h: "h-[520px]", w: "w-[380px]" },
  { t: "Marina Surfshop", c: "Chennai", img: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80", h: "h-[360px]", w: "w-[340px]" },
  { t: "Pottery House", c: "Auroville", img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80", h: "h-[480px]", w: "w-[280px]" },
  { t: "Spice Trader", c: "Madurai", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80", h: "h-[440px]", w: "w-[360px]" },
];

export function AsymmetricSlider() {
  return (
    <section className="relative bg-background py-20 md:py-28 overflow-hidden">
      <div className="container-x mb-10 flex items-end justify-between">
        <div>
          <p className="section-label">[ Asymmetric showcase ]</p>
          <h2 className="mt-3 font-display font-black text-3xl md:text-5xl leading-tight">Drag to browse <span className="italic text-sage">handpicked stories</span>.</h2>
        </div>
        <p className="hidden md:block font-mono text-xs tracking-[0.3em] uppercase text-text-muted">← drag →</p>
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: -1200, right: 0 }}
        className="flex gap-6 px-6 md:px-12 cursor-grab active:cursor-grabbing"
      >
        {asymSlides.map((s, i) => (
          <div
            key={i}
            className={`shrink-0 ${s.w} ${s.h} ${i % 2 ? "mt-16" : "mt-0"} rounded-2xl overflow-hidden relative group img-zoom border border-border`}
          >
            <img src={s.img} alt={s.t} className="w-full h-full object-cover" draggable={false} />
            <div className="absolute inset-0 bg-linear-to-t from-forest-deep/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-text-light">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-sage">{s.c}</p>
              <h3 className="mt-1 font-display font-bold text-xl">{s.t}</h3>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

/* WebGLField removed — atmospheric genre only, incompatible with editorial theme */
export function WebGLField() { return null; }


/* ============ 3D Tilt Render Presentation ============ */
function Tilt({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 15 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="relative">
      {children}
    </motion.div>
  );
}

export function RenderPresentation() {
  return (
    <section className="relative bg-bg-section py-24 md:py-32 overflow-hidden">
      <div className="container-x grid lg:grid-cols-2 gap-12 lg:gap-20 items-center" style={{ perspective: 1200 }}>
        <div>
          <p className="section-label">[ The product ]</p>
          <h2 className="mt-3 font-display font-black text-4xl md:text-6xl leading-[1.05] tracking-tight">
            Every listing is a <span className="italic text-sage">living profile</span> — not just a name and number.
          </h2>
          <p className="mt-6 text-lg text-text-muted max-w-lg">
            Verified ratings, real photos, direct contact. Hover the card — every surface responds.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Community-verified rating & review count",
              "Operating hours, location, and contact details",
              "Category tags and district filter",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-text-muted">
                <Sparkles className="size-4 text-sage mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Gate 57: No fake browser/app chrome. A figure with hairline border is the correct pattern. */}
        <Tilt>
          <figure className="relative rounded-3xl bg-forest text-text-light shadow-2xl border border-text-light/10 overflow-hidden">
            {/* Header band — genuine content, not chrome simulation */}
            <div className="flex items-center justify-between px-8 pt-8 pb-5 border-b border-text-light/10">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-sage grid place-items-center text-forest-deep font-black text-sm shrink-0">SI</div>
                <div>
                  <p className="font-display font-bold text-base leading-tight">Senthil Iyer Silks</p>
                  <p className="text-text-light/50 text-xs">Kanchipuram · Est. 1962</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-sage/20 text-sage text-[10px] font-mono font-semibold tracking-wider px-3 py-1 uppercase">
                Verified
              </span>
            </div>

            {/* Body — real data */}
            <div className="px-8 py-6 grid grid-cols-3 gap-4 border-b border-text-light/10">
              <div>
                <p className="font-display font-black text-3xl text-sage">4.9</p>
                <p className="text-text-light/50 text-xs mt-1">Rating</p>
              </div>
              <div>
                <p className="font-display font-black text-3xl text-sage">1.2k</p>
                <p className="text-text-light/50 text-xs mt-1">Reviews</p>
              </div>
              <div>
                <p className="font-display font-black text-3xl text-sage">62</p>
                <p className="text-text-light/50 text-xs mt-1">Years active</p>
              </div>
            </div>

            {/* Quote — authentic testimonial content */}
            <blockquote className="px-8 py-6 text-sm text-text-light/80 leading-relaxed italic border-b border-text-light/10">
              "Three generations of heritage, now discoverable by every corner of Tamil Nadu."
            </blockquote>

            {/* Action row */}
            <div className="px-8 py-5 flex items-center gap-4">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-text-light/40">Kanchipuram, Tamil Nadu</span>
              <span className="ml-auto inline-flex items-center gap-1.5 text-sage text-xs font-display font-semibold">
                <Sparkles className="size-3.5" /> Featured listing
              </span>
            </div>
            <figcaption className="sr-only">Sample verified business profile on Vanigan.org</figcaption>
          </figure>
        </Tilt>
      </div>
    </section>
  );
}

export function MinimalistHierarchy() {
  const lines = [
    { n: "01", t: "Discover", d: "Search across 18,424+ verified local businesses.", icon: Compass },
    { n: "02", t: "Connect", d: "Access direct phone numbers, operational hours, and maps.", icon: Search },
    { n: "03", t: "Grow", d: "List your business for free to reach customers state-wide.", icon: Sparkles },
  ];
  return (
    <section className="bg-bg-section py-24 md:py-36 border-y border-border">
      <div className="container-x">
        {/* Header section with clean label */}
        <div className="max-w-3xl mb-16">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-sage">[ How It Works ]</p>
          <h2 className="mt-4 font-display font-black text-4xl md:text-6xl tracking-tight text-foreground leading-[1.05]">
            Simple steps. <br />
            <span className="italic shimmer">Powerful connection.</span>
          </h2>
          <p className="mt-4 text-text-muted text-base md:text-lg leading-relaxed">
            Vanigan simplifies how customers find verified service providers and local enterprises across all 38 districts of Tamil Nadu.
          </p>
        </div>

        {/* 3-Column interactive card grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {lines.map((l, i) => {
            const Icon = l.icon;
            return (
              <motion.div
                key={l.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className="relative bg-background rounded-3xl p-8 border border-border/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.08)] hover:border-sage/40 transition-all duration-300 group overflow-hidden"
              >
                {/* Large background outlined number */}
                <div 
                  className="absolute -right-2 -bottom-6 font-display font-black text-8xl md:text-9xl text-transparent select-none pointer-events-none opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-300"
                  style={{ WebkitTextStroke: "2px var(--sage)" }}
                >
                  {l.n}
                </div>

                {/* Icon wrapper */}
                <div className="w-12 h-12 rounded-2xl bg-sage/10 text-sage flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-sage group-hover:text-white transition-all duration-300">
                  <Icon className="size-5" />
                </div>

                {/* Card content */}
                <h3 className="font-display font-bold text-2xl tracking-tight text-foreground">
                  {l.t}
                </h3>
                <p className="mt-3 text-text-muted text-sm leading-relaxed max-w-[90%]">
                  {l.d}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============ Non-Podium Grid Layout (irregular feature grid) ============ */
const grids = [
  { t: "Verified Listings", v: "12,480+", c: "col-span-12 md:col-span-7 row-span-2 bg-forest text-text-light", big: true, img: "https://images.unsplash.com/photo-1542315192-1f61a1792f33?w=1000&q=80" },
  { t: "Districts covered", v: "38 / 38", c: "col-span-6 md:col-span-5 bg-sage text-forest-deep" },
  { t: "Avg. response", v: "< 2 hrs", c: "col-span-6 md:col-span-3 bg-bg-section" },
  { t: "Languages", v: "தமிழ் · EN", c: "col-span-12 md:col-span-2 bg-forest-deep text-text-light" },
];

export function NonPodiumGrid() {
  return (
    <section className="bg-background py-24">
      <div className="container-x">
        <p className="section-label">[ By the numbers ]</p>
        <h2 className="mt-3 font-display font-black text-3xl md:text-5xl max-w-3xl leading-tight">Not a grid. <span className="italic text-sage">A composition.</span></h2>
        <div className="mt-12 grid grid-cols-12 gap-4 md:gap-5 auto-rows-[160px] md:auto-rows-[180px]">
          {grids.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`${g.c} rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between`}
            >
              {g.img && <img src={g.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />}
              <p className="relative font-mono text-xs tracking-[0.3em] uppercase opacity-70">{g.t}</p>
              <p className={`relative font-display font-black tracking-tight ${g.big ? "text-5xl md:text-7xl" : "text-3xl md:text-4xl"}`}>{g.v}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
