import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail, Send } from "lucide-react";

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
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[80] hidden md:flex flex-col gap-3"
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
export function SpatialHero() {
  return (
    <section className="relative bg-forest-deep text-text-light overflow-hidden py-24 md:py-36">
      {/* Ambient glow layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 size-[600px] rounded-full bg-sage/20 blur-[180px] animate-float" />
        <div className="absolute bottom-0 right-1/4 size-[500px] rounded-full bg-forest/40 blur-[160px]" />
        <div className="absolute top-10 right-10 size-[320px] rounded-full bg-sage/10 blur-[120px]" />
      </div>

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,165,116,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,165,116,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="relative container-x grid lg:grid-cols-12 gap-12 items-center">
        {/* Copy */}
        <div className="lg:col-span-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-label"
          >
            [ Built in the spatial age ]
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-4 font-display font-black text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight"
          >
            A directory with <span className="italic text-sage">depth</span> — not just data.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-6 text-text-light/70 text-lg max-w-lg"
          >
            Engineered like a precision instrument. Every interaction has weight, every surface has reflection — every business has a story.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#cta"
              className="group relative inline-flex items-center gap-2 rounded-full bg-sage text-forest-deep font-bold px-7 py-4 overflow-hidden"
            >
              <span className="absolute inset-0 bg-text-light translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative">Start a listing</span>
              <span className="relative transition-transform group-hover:translate-x-1">➔</span>
            </a>
            <a href="#categories" className="text-text-light/80 hover:text-sage transition-colors font-medium link-underline">
              Explore the directory
            </a>
          </motion.div>
        </div>

        {/* 3D-ish composition */}
        <div className="lg:col-span-6 relative h-[420px] md:h-[560px]" style={{ perspective: 1400 }}>
          {/* Orbital ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
            className="absolute inset-0 m-auto size-[360px] md:size-[460px] rounded-full border border-sage/40"
            style={{ transform: "rotateX(72deg)" }}
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 size-3 rounded-full bg-sage shadow-[0_0_24px_8px_rgba(212,165,116,0.6)]" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 55, ease: "linear", repeat: Infinity }}
            className="absolute inset-0 m-auto size-[260px] md:size-[340px] rounded-full border border-text-light/15"
            style={{ transform: "rotateX(58deg) rotateZ(20deg)" }}
          />

          {/* Floating rock (gradient + clip-path) */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-12, 12, -12] }}
            transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-56 md:size-72"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="size-full bg-gradient-to-br from-forest via-forest-deep to-black shadow-[0_30px_80px_-20px_rgba(212,165,116,0.5)]"
              style={{
                clipPath: "polygon(30% 0%, 70% 5%, 100% 35%, 92% 78%, 60% 100%, 18% 92%, 0% 55%, 8% 18%)",
              }}
            />
            {/* Highlight */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                clipPath: "polygon(30% 0%, 70% 5%, 100% 35%, 92% 78%, 60% 100%, 18% 92%, 0% 55%, 8% 18%)",
                background: "linear-gradient(135deg, rgba(212,165,116,0.55), transparent 55%)",
              }}
            />
          </motion.div>

          {/* Glass pane */}
          <motion.div
            initial={{ rotate: -16 }}
            animate={{ rotate: [-16, -12, -16] }}
            transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[200px] md:w-[420px] md:h-[260px] rounded-2xl border border-text-light/20 bg-gradient-to-br from-text-light/10 to-text-light/[0.02] backdrop-blur-sm shadow-[0_10px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(115deg,transparent_40%,rgba(212,165,116,0.25)_50%,transparent_60%)]" />
          </motion.div>

          {/* Floating UI chips with glow */}
          <motion.div
            initial={{ x: 30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="absolute top-6 right-2 px-4 py-3 rounded-xl bg-forest/80 backdrop-blur-md border border-sage/30 shadow-[0_0_40px_rgba(212,165,116,0.25)]"
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-sage">verified</p>
            <p className="mt-1 font-display font-bold text-sm">12,480+ listings</p>
          </motion.div>
          <motion.div
            initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.55 }}
            className="absolute bottom-8 left-0 px-4 py-3 rounded-xl bg-forest/80 backdrop-blur-md border border-sage/30 shadow-[0_0_40px_rgba(212,165,116,0.25)]"
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-sage">live now</p>
            <p className="mt-1 font-display font-bold text-sm">38 districts · TN</p>
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-10 size-14 rounded-full bg-sage text-forest-deep grid place-items-center font-display font-black text-xl shadow-[0_0_50px_rgba(212,165,116,0.7)]"
          >
            V
          </motion.div>
        </div>
      </div>
    </section>
  );
}
