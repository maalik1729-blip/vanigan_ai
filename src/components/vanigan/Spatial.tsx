import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail, Send, Search, MapPin, ChevronDown, ArrowRight } from "lucide-react";
import communityImage from "./community.png";

/* ============ Sticky Contact Dock (right-side floating) ============ */
export function ContactDock() {
  const items = [
    { label: "WhatsApp", href: "https://wa.me/910000000000", Icon: MessageCircle, color: "hover:bg-[#25D366]" },
    { label: "Call", href: "tel:+910000000000", Icon: Phone, color: "hover:bg-sage" },
    { label: "Email", href: "mailto:hello@vanigan.org", Icon: Mail, color: "hover:bg-sage" },
    { label: "Chat", href: "#cta", Icon: Send, color: "hover:bg-sage" },
  ];
  return (
    <aside
      aria-label="Quick contact"
      className="fixed right-4 top-1/2 -translate-y-1/2 z-80 hidden md:flex flex-col gap-3"
    >
      {items.map(({ label, href, Icon, color }, i) => (
        <motion.a
          key={label}
          href={href}
          aria-label={label}
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.6 + i * 0.08, duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
          whileHover={{ scale: 1.08 }}
          className={`group relative size-12 rounded-full bg-forest-deep/90 backdrop-blur-md border border-text-light/10 grid place-items-center text-text-light shadow-xl transition-colors ${color} hover:text-forest-deep`}
        >
          <Icon className="size-5" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-medium px-2 py-1 rounded-md bg-forest-deep text-text-light opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {label}
          </span>
        </motion.a>
      ))}
    </aside>
  );
}

/* ============ Spatial Hero (dark-mode depth with 3D-ish composition) ============ */
const tickerWords = ["Discover", "Connect", "Grow", "Tamil Nadu", "Verified", "12,000+ Businesses", "38 Districts"];

export function SpatialHero() {
  return (
    <section className="relative bg-forest-deep text-text-light overflow-hidden pt-28 pb-32 md:pt-36 md:pb-40">
      {/* Ambient glow layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 size-[600px] rounded-full bg-sage/20 blur-[180px] animate-float" />
        <div className="absolute bottom-0 right-1/4 size-[500px] rounded-full bg-forest/40 blur-[160px]" />
        <div className="absolute top-10 right-10 size-[320px] rounded-full bg-sage/10 blur-[120px]" />
      </div>

      {/* Kolam-inspired SVG pattern at ultra-low opacity */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" aria-hidden="true">
        <defs>
          <pattern id="kolam-spatial" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1.5" fill="currentColor" />
            <circle cx="0" cy="0" r="1.5" fill="currentColor" />
            <circle cx="60" cy="0" r="1.5" fill="currentColor" />
            <circle cx="0" cy="60" r="1.5" fill="currentColor" />
            <circle cx="60" cy="60" r="1.5" fill="currentColor" />
            <path d="M30 10 Q50 30 30 50 Q10 30 30 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kolam-spatial)" />
      </svg>

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(101,196,155,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(101,196,155,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="relative container-x grid lg:grid-cols-12 gap-12 items-center">
        {/* Copy & Search Bar */}
        <div className="lg:col-span-6 z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-label"
          >
            [ 01 · Tamil Nadu's Business Network ]
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-4 font-display font-black text-3xl md:text-5xl lg:text-[56px] leading-[1.08] tracking-tight"
          >
            Tamil Nadu's
            <br />
            <span className="italic text-sage font-bold shimmer">Most Trusted</span>
            <br />
            Business Network.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-5 text-text-light/70 text-sm md:text-base max-w-xl leading-relaxed"
          >
            Discover verified businesses, service providers, and professionals across every district of Tamil Nadu.
          </motion.p>

          {/* Frosted Glass Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-8 max-w-2xl rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-2.5 flex flex-col md:flex-row items-stretch gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] pointer-events-auto"
          >
            <label className="flex-1 flex items-center gap-2 px-4 py-2 border-b md:border-b-0 md:border-r border-white/10">
              <span className="text-[10px] font-mono tracking-widest text-text-light/45 uppercase shrink-0">Category</span>
              <select className="flex-1 bg-transparent text-xs font-semibold text-text-light outline-none cursor-pointer w-full [&>option]:bg-forest-deep">
                <option>All Categories</option>
                <option>Restaurants</option>
                <option>Healthcare</option>
                <option>Real Estate</option>
              </select>
              <ChevronDown className="size-4 text-text-light/40 shrink-0" />
            </label>
            <label className="flex-1 flex items-center gap-2 px-4 py-2">
              <MapPin className="size-4 text-sage shrink-0" />
              <select className="flex-1 bg-transparent text-xs font-semibold text-text-light outline-none cursor-pointer w-full [&>option]:bg-forest-deep">
                <option>All Tamil Nadu</option>
                <option>Chennai</option>
                <option>Coimbatore</option>
                <option>Madurai</option>
              </select>
            </label>
            <button className="rounded-xl bg-sage hover:bg-white text-forest-deep font-display font-bold text-xs px-8 py-3.5 flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(101,196,155,0.3)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.4)] cursor-pointer w-full md:w-auto">
              <Search className="size-3.5 shrink-0" /> Search
            </button>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-4 pointer-events-auto"
          >
            <a
              href="#categories"
              className="group relative inline-flex items-center gap-2 rounded-full bg-sage text-forest-deep font-bold px-7 py-3.5 overflow-hidden shadow-lg transition-transform hover:scale-[1.02]"
            >
              <span className="absolute inset-0 bg-text-light translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative">Find a Business</span>
              <span className="relative transition-transform group-hover:translate-x-1">➔</span>
            </a>
            <a 
              href="#cta" 
              className="inline-flex items-center rounded-full border border-text-light/20 text-text-light/80 hover:text-text-light hover:border-text-light font-semibold px-7 py-3.5 transition-all duration-300"
            >
              List Your Business Free
            </a>
          </motion.div>

          {/* Premium Grid Stats Layout */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 0.6 }} 
            className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8 mt-10"
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-sage tracking-tight">12K+</h3>
              <p className="text-[9px] md:text-[10px] font-medium text-text-light/50 uppercase tracking-widest mt-1">Listed Businesses</p>
            </div>
            <div className="border-x border-white/10 px-4 md:px-6">
              <h3 className="text-2xl md:text-3xl font-extrabold text-sage tracking-tight">38</h3>
              <p className="text-[9px] md:text-[10px] font-medium text-text-light/50 uppercase tracking-widest mt-1">Districts</p>
            </div>
            <div className="pl-2">
              <h3 className="text-2xl md:text-3xl font-extrabold text-sage tracking-tight">4.8★</h3>
              <p className="text-[9px] md:text-[10px] font-medium text-text-light/50 uppercase tracking-widest mt-1">Average Rating</p>
            </div>
          </motion.div>
        </div>

        {/* Unified Community Image Composition with Spatial Depth */}
        <div className="lg:col-span-6 relative h-[420px] md:h-[560px] flex items-center justify-center" style={{ perspective: 1400 }}>
          {/* Orbital ring (subtle, in the background) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
            className="absolute inset-0 m-auto size-[360px] md:size-[460px] rounded-full border border-sage/20 pointer-events-none"
            style={{ transform: "rotateX(72deg)" }}
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 size-2.5 rounded-full bg-sage shadow-[0_0_24px_8px_rgba(101,196,155,0.4)]" />
          </motion.div>
          
          {/* Main Floating Community Logo (without borders or background) */}
          <motion.div
            initial={{ y: 0, rotate: -2 }}
            animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            className="relative pointer-events-auto w-[300px] h-[300px] md:w-[380px] md:h-[380px] flex items-center justify-center group rounded-full overflow-hidden"
          >
            {/* The Community Image itself */}
            <img 
              src={communityImage} 
              alt="Tamil Nadu Business Network Community" 
              className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-700 rounded-full" 
            />
          </motion.div>

          {/* Floating UI chips with glow */}
          <motion.div
            initial={{ x: 30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="absolute top-6 right-2 px-4 py-3 rounded-xl bg-forest/80 backdrop-blur-md border border-sage/30 shadow-[0_0_40px_rgba(101,196,155,0.25)] pointer-events-auto"
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-sage">verified</p>
            <p className="mt-1 font-display font-bold text-sm">12,480+ listings</p>
          </motion.div>
          <motion.div
            initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.55 }}
            className="absolute bottom-8 left-0 px-4 py-3 rounded-xl bg-forest/80 backdrop-blur-md border border-sage/30 shadow-[0_0_40px_rgba(101,196,155,0.25)] pointer-events-auto"
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-sage">live now</p>
            <p className="mt-1 font-display font-bold text-sm">38 districts · TN</p>
          </motion.div>
        </div>
      </div>

      {/* Subtle bottom ticker marquee */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 bg-black/20 backdrop-blur-md py-3.5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee-slow">
          {[...tickerWords, ...tickerWords, ...tickerWords, ...tickerWords].map((w, i) => (
            <span key={i} className="px-8 font-display font-semibold text-[11px] tracking-[0.2em] uppercase text-text-light/50">
              {w} <span className="ml-8 text-sage">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
