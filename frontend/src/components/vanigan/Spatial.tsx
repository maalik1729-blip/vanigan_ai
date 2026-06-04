import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail, Send, Search, MapPin, ChevronDown, ArrowRight, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";

/* ══════════════════════════════════════════════════════════════════
   CONTACT DOCK — sticky right-side panel (token remapping updates
   bg-forest-deep → indigo-deep, hover:bg-sage → terracotta)
══════════════════════════════════════════════════════════════════ */
const dockItems = [
  { label: "WhatsApp", href: "https://wa.me/910000000000", Icon: MessageCircle, color: "hover:bg-[#25D366] hover:text-forest-deep" },
  { label: "Call",     href: "tel:+910000000000",          Icon: Phone,         color: "hover:bg-sage hover:text-background" },
  { label: "Email",    href: "mailto:hello@vanigan.org",   Icon: Mail,          color: "hover:bg-sage hover:text-background" },
  { label: "Chat",     href: "#cta",                       Icon: Send,          color: "hover:bg-sage hover:text-background" },
];

export function ContactDock() {
  return (
    <aside
      aria-label="Quick contact"
      className="fixed right-4 top-1/2 -translate-y-1/2 z-80 hidden md:flex flex-col gap-3"
    >
      {dockItems.map(({ label, href, Icon, color }, i) => (
        <motion.a
          key={label}
          href={href}
          aria-label={label}
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.6 + i * 0.08, duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
          whileHover={{ scale: 1.08 }}
          className={`group relative size-12 rounded-full bg-forest-deep/90 backdrop-blur-md border border-text-light/10 grid place-items-center text-text-light shadow-xl transition-colors ${color}`}
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

/* ══════════════════════════════════════════════════════════════════
   MASTHEAD HERO — Editorial typographic hero
   Hallmark genre: editorial · macrostructure: masthead
   No floating image, no ambient glows, no orbital rings.
   Stamp: P5 H5 E5 S5 R5 V5
══════════════════════════════════════════════════════════════════ */
const tickerWords = [
  "Discover", "Connect", "Grow", "Tamil Nadu",
  "Verified", "18,424+ Businesses", "38 Districts", "Free Listings",
];

export function SpatialHero() {
  return (
    <section className="relative bg-background text-foreground overflow-hidden" id="top">

      {/* ── Edition metadata strip ───────────────────────────────── */}
      <div className="bg-bg-section border-b border-border">
        <div className="container-x py-2 flex items-center justify-between">
          <span
            className="text-foreground/40 text-[9px] tracking-[0.35em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
          >
            Est. 2024 · The Tamil Nadu Business Register
          </span>
          <span
            className="text-foreground/40 text-[9px] tracking-[0.35em] uppercase hidden md:block"
            style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
          >
            18,424+ Verified Listings · 38 Districts
          </span>
        </div>
      </div>

      {/* ── Masthead content ─────────────────────────────────────── */}
      <div className="container-x pt-12 md:pt-20 pb-14 md:pb-20">

        {/* Flanked section label */}
        <div className="flex items-center gap-5 justify-center mb-10 md:mb-14">
          <div className="flex-1 max-w-[80px] md:max-w-[160px] h-px bg-border" />
          <p className="section-label whitespace-nowrap">Tamil Nadu's Business Directory</p>
          <div className="flex-1 max-w-[80px] md:max-w-[160px] h-px bg-border" />
        </div>

        {/* Giant editorial headline */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-display font-normal text-center leading-[1.06] tracking-tight text-foreground overflow-wrap-anywhere"
          style={{ fontSize: "clamp(2.4rem, 8.5vw, 7rem)" }}
        >
          Tamil Nadu's
          <br />
          <em className="italic text-sage">Most Trusted</em>
          <br />
          Business Network.
        </motion.h1>

        {/* Subhead descriptor */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-6 text-center max-w-2xl mx-auto text-text-muted text-base md:text-lg leading-relaxed"
        >
          Discover verified businesses, service providers, and professionals
          across every district of Tamil Nadu.
        </motion.p>

        {/* Search bar — warm card bg, editorial form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-10 max-w-2xl mx-auto rounded-2xl bg-card border border-border p-2 flex flex-col md:flex-row items-stretch gap-2 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
        >
          <label className="flex-1 flex items-center gap-2 px-4 py-2 border-b md:border-b-0 md:border-r border-border">
            <span
              className="text-[9px] tracking-widest text-text-muted uppercase shrink-0"
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
            >
              Category
            </span>
            <select className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer">
              <option>All Categories</option>
              <option>Restaurants</option>
              <option>Healthcare</option>
              <option>Real Estate</option>
            </select>
            <ChevronDown className="size-4 text-text-muted shrink-0" />
          </label>
          <label className="flex-1 flex items-center gap-2 px-4 py-2">
            <MapPin className="size-4 text-sage shrink-0" />
            <select className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer">
              <option>All Tamil Nadu</option>
              <option>Chennai</option>
              <option>Coimbatore</option>
              <option>Madurai</option>
            </select>
          </label>
          <button
            className="rounded-xl bg-foreground hover:bg-sage text-background font-sans font-semibold text-sm px-8 py-3.5 flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground cursor-pointer w-full md:w-auto whitespace-nowrap"
          >
            <Search className="size-3.5 shrink-0" /> Search
          </button>
        </motion.div>

        {/* CTA button row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/list-business"
            className="inline-flex items-center gap-2 rounded-full bg-foreground hover:bg-sage text-background font-sans font-semibold px-7 py-3.5 transition-all duration-300 whitespace-nowrap active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          >
            Find a Business <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/add-business"
            className="inline-flex items-center gap-2 rounded-full border-2 border-sage bg-sage/10 text-sage hover:bg-sage hover:text-white font-semibold px-7 py-3.5 transition-all duration-300 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            <Plus className="size-4" /> Add Business
          </Link>
        </motion.div>

        {/* Inline stat strip — editorial, not a full section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-14 pt-10 border-t border-border grid grid-cols-3 gap-6 max-w-md mx-auto text-center"
        >
          <div>
            <p className="font-display font-normal text-4xl text-foreground">18.4K</p>
            <p
              className="text-foreground/40 text-[9px] tracking-[0.3em] uppercase mt-2"
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
            >
              Businesses
            </p>
          </div>
          <div className="border-x border-border">
            <p className="font-display font-normal text-4xl text-foreground">38</p>
            <p
              className="text-foreground/40 text-[9px] tracking-[0.3em] uppercase mt-2"
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
            >
              Districts
            </p>
          </div>
          <div>
            <p className="font-display font-normal text-4xl text-foreground">4.8★</p>
            <p
              className="text-foreground/40 text-[9px] tracking-[0.3em] uppercase mt-2"
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
            >
              Avg Rating
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom ticker — warm editorial ─────────────────────── */}
      <div
        className="border-t border-border bg-bg-section py-3.5"
        style={{ overflow: "clip", contain: "paint" }}
      >
        <div className="flex whitespace-nowrap animate-marquee-slow">
          {[...tickerWords, ...tickerWords, ...tickerWords, ...tickerWords].map((w, i) => (
            <span
              key={i}
              className="px-8 text-foreground/40 text-[10px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
            >
              {w} <span className="ml-8 text-sage">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
