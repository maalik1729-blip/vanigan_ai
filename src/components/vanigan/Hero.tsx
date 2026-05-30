import { motion } from "framer-motion";
import { Search, MapPin, ChevronDown, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay: i * 0.1 },
  }),
};

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100vh] bg-forest text-text-light overflow-hidden flex items-center -mt-20 pt-32 pb-20">
      {/* Kolam-inspired SVG pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" aria-hidden="true">
        <defs>
          <pattern id="kolam" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1.5" fill="currentColor" />
            <circle cx="0" cy="0" r="1.5" fill="currentColor" />
            <circle cx="60" cy="0" r="1.5" fill="currentColor" />
            <circle cx="0" cy="60" r="1.5" fill="currentColor" />
            <circle cx="60" cy="60" r="1.5" fill="currentColor" />
            <path d="M30 10 Q50 30 30 50 Q10 30 30 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kolam)" />
      </svg>

      <div className="container-x relative z-10 w-full">
        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0} className="section-label">
          [01] Tamil Nadu's Business Directory
        </motion.p>

        <motion.h1
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="mt-6 font-display font-extrabold leading-[1.05] text-5xl md:text-7xl lg:text-[80px] max-w-5xl"
        >
          Tamil Nadu's
          <br />
          <span className="italic font-bold text-sage">Most Trusted</span> Business Network.
        </motion.h1>

        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="mt-6 max-w-2xl text-base md:text-lg text-text-light/75 leading-relaxed"
        >
          Discover verified businesses, service providers, and professionals across every district of Tamil Nadu.
        </motion.p>

        {/* Search bar */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="mt-10 max-w-3xl rounded-full bg-background text-foreground p-2 flex flex-col sm:flex-row items-stretch gap-2 shadow-2xl"
        >
          <label className="flex-1 flex items-center gap-2 px-4 py-2 border-b sm:border-b-0 sm:border-r border-border">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Category</span>
            <select className="flex-1 bg-transparent text-sm font-medium outline-none cursor-pointer">
              <option>All Categories</option>
              <option>Restaurants</option>
              <option>Healthcare</option>
              <option>Real Estate</option>
            </select>
            <ChevronDown className="size-4 text-text-muted" />
          </label>
          <label className="flex-1 flex items-center gap-2 px-4 py-2">
            <MapPin className="size-4 text-sage" />
            <select className="flex-1 bg-transparent text-sm font-medium outline-none cursor-pointer">
              <option>All Tamil Nadu</option>
              <option>Chennai</option>
              <option>Coimbatore</option>
              <option>Madurai</option>
            </select>
          </label>
          <button className="rounded-full bg-sage hover:bg-forest text-forest-deep hover:text-text-light font-display font-bold text-sm px-6 py-3 flex items-center justify-center gap-2 transition-colors">
            <Search className="size-4" /> Search
          </button>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="mt-6 flex flex-wrap gap-3">
          <a href="#categories" className="inline-flex items-center gap-2 rounded-full bg-sage text-forest-deep font-display font-bold px-6 py-3 hover:bg-sage-soft transition-colors">
            Find a Business <ArrowRight className="size-4" />
          </a>
          <a href="#cta" className="inline-flex items-center rounded-full border border-text-light/30 text-text-light font-display font-semibold px-6 py-3 hover:bg-text-light/10 transition-colors">
            List Your Business Free
          </a>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5} className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-text-light/70">
          <span><strong className="text-sage font-display font-bold">12,000+</strong> Listed Businesses</span>
          <span className="opacity-30">·</span>
          <span><strong className="text-sage font-display font-bold">38</strong> Districts</span>
          <span className="opacity-30">·</span>
          <span><strong className="text-sage font-display font-bold">4.8★</strong> Rated</span>
        </motion.div>
      </div>
    </section>
  );
}
