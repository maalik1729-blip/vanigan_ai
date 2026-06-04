import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

/* ============ Top scroll progress bar (Aircenter style) ============ */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.2 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-sage origin-left z-[100]"
      aria-hidden
    />
  );
}

/* ============ Giant outlined marquee (Wibify style) ============ */
export function MegaMarquee({
  words = ["Discover", "Connect", "Grow"],
  reverse = false,
  outlined = true,
  dark = false,
}: {
  words?: string[];
  reverse?: boolean;
  outlined?: boolean;
  dark?: boolean;
}) {
  const items = [...words, ...words, ...words, ...words];
  return (
    <section
      className={`relative py-10 md:py-16 overflow-hidden border-y ${
        dark ? "bg-forest-deep text-text-light border-text-light/10" : "bg-background text-foreground border-border"
      }`}
    >
      <div className={`flex whitespace-nowrap ${reverse ? "animate-marquee-reverse" : "animate-marquee-slow"}`}>
        {items.map((w, i) => (
          <span
            key={i}
            className={`flex items-center px-6 font-display font-black tracking-tight text-6xl md:text-8xl lg:text-[140px] leading-none ${
              outlined
                ? "text-transparent"
                : "text-foreground"
            }`}
            style={
              outlined
                ? { WebkitTextStroke: `1.5px ${dark ? "var(--sage)" : "var(--forest)"}` }
                : undefined
            }
          >
            {w}
            <span className="px-8 text-sage" aria-hidden>✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* ============ Parallax image band (Aircenter style) ============ */
const parallaxImgs = [
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=900&q=80",
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=900&q=80",
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=900&q=80",
  "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=900&q=80",
];

export function ParallaxBand() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-30%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-20%", "10%"]);

  return (
    <section ref={ref} className="relative bg-background py-20 md:py-28 overflow-hidden">
      <div className="container-x mb-10 md:mb-14">
        <p className="section-label">[ Snapshots ]</p>
        <h2 className="mt-3 font-display font-black text-3xl md:text-5xl max-w-3xl leading-tight">
          A living portrait of <span className="italic text-sage">Tamil Nadu's</span> businesses.
        </h2>
      </div>

      <motion.div style={{ x }} className="flex gap-5 mb-5">
        {parallaxImgs.concat(parallaxImgs).map((src, i) => (
          <div key={`a-${i}`} className="img-zoom shrink-0 w-[280px] md:w-[420px] aspect-[4/3] rounded-2xl overflow-hidden border border-border">
            <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>

      <motion.div style={{ x: x2 }} className="flex gap-5">
        {parallaxImgs.slice().reverse().concat(parallaxImgs).map((src, i) => (
          <div key={`b-${i}`} className="img-zoom shrink-0 w-[240px] md:w-[360px] aspect-[4/3] rounded-2xl overflow-hidden border border-border">
            <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>
    </section>
  );
}

/* ============ Word-by-word reveal heading ============ */
export function RevealHeading({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const words = children.split(" ");
  return (
    <h2 className={`font-display font-black leading-[1.05] tracking-tight ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay: i * 0.06 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

/* ============ Sticky pinned statement (Wibify style) ============ */
export function StickyStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  return (
    <section ref={ref} className="relative h-[180vh] bg-forest-deep text-text-light">
      <motion.div
        style={{ opacity, scale }}
        className="sticky top-0 h-screen flex items-center justify-center px-6"
      >
        <div className="container-x text-center">
          <p className="section-label justify-center">[ Manifesto ]</p>
          <RevealHeading className="mt-6 text-4xl md:text-7xl lg:text-[96px] text-text-light">
            Every street. Every district. Every business — discovered.
          </RevealHeading>
          <p className="mt-8 max-w-2xl mx-auto text-text-light/70 text-lg">
            Vanigan is the living index of Tamil Nadu's commerce — verified, searchable, and built for the people who build the state.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
