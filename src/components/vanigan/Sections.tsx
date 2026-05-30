import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { ArrowRight, Star, Utensils, Stethoscope, GraduationCap, Home, Car, ShoppingBag, Cpu, Scale, Landmark, HardHat, Hotel, Sparkles, Search, Eye, Phone, CheckCircle2, Users, ShieldCheck, Linkedin, Instagram, Twitter } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay: i * 0.08 },
  }),
};

function SectionHead({ label, title, dark = false }: { label: string; title: ReactNode; dark?: boolean }) {
  return (
    <div className="max-w-3xl">
      <p className="section-label">{label}</p>
      <h2 className={`mt-4 font-display font-bold text-3xl md:text-5xl leading-tight ${dark ? "text-text-light" : "text-foreground"}`}>
        {title}
      </h2>
    </div>
  );
}

/* ============ [02] Categories ============ */
const categories = [
  { name: "Restaurants", count: 1240, Icon: Utensils },
  { name: "Healthcare", count: 980, Icon: Stethoscope },
  { name: "Education", count: 620, Icon: GraduationCap },
  { name: "Real Estate", count: 540, Icon: Home },
  { name: "Automotive", count: 410, Icon: Car },
  { name: "Retail", count: 1580, Icon: ShoppingBag },
  { name: "Technology", count: 360, Icon: Cpu },
  { name: "Legal Services", count: 220, Icon: Scale },
  { name: "Finance", count: 480, Icon: Landmark },
  { name: "Construction", count: 760, Icon: HardHat },
  { name: "Hospitality", count: 390, Icon: Hotel },
  { name: "Beauty & Wellness", count: 670, Icon: Sparkles },
];

export function CategoryGrid() {
  return (
    <section id="categories" className="bg-background py-20 md:py-24">
      <div className="container-x">
        <SectionHead label="[02] Browse by Category" title={<>Find What You Need.</>} />
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {categories.map((c, i) => (
            <motion.a
              href="#" key={c.name} custom={i} variants={fadeUp}
              className="group relative bg-white border border-border rounded-2xl p-5 md:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-sage scale-y-0 group-hover:scale-y-100 origin-top transition-transform" />
              <c.Icon className="size-7 text-sage" strokeWidth={1.5} />
              <h3 className="mt-4 font-display font-bold text-lg">{c.name}</h3>
              <p className="mt-1 text-xs text-text-muted">{c.count.toLocaleString()} businesses</p>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============ [03] How it works ============ */
const steps = [
  { n: "01", title: "Search", Icon: Search, desc: "Browse by category, city, or keyword across Tamil Nadu." },
  { n: "02", title: "Discover", Icon: Eye, desc: "Explore verified profiles with ratings, photos, and contact info." },
  { n: "03", title: "Connect", Icon: Phone, desc: "Call, message, or visit the business — directly from the listing." },
];

export function HowItWorks() {
  return (
    <section className="bg-forest text-text-light py-20 md:py-24">
      <div className="container-x">
        <SectionHead label="[03] Simple Process" dark title={<>From Search to <span className="italic text-sage">Connection.</span></>} />
        <div className="mt-16 grid md:grid-cols-3 gap-10 md:gap-6 relative">
          {steps.map((s, i) => (
            <motion.div
              key={s.n} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
              className="relative"
            >
              <div className="relative w-20 h-20 rounded-full bg-sage/15 flex items-center justify-center">
                <span className="font-display font-extrabold text-2xl text-sage">{s.n}</span>
              </div>
              <s.Icon className="size-6 text-sage mt-6" strokeWidth={1.5} />
              <h3 className="mt-3 font-display font-bold text-2xl">{s.title}</h3>
              <p className="mt-2 text-text-light/70 leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(100%-2rem)] w-12 h-px bg-sage/40" aria-hidden />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ [04] Stats ============ */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.floor(v).toLocaleString() + suffix);
  useEffect(() => {
    if (inView) animate(mv, to, { duration: 2, ease: "easeOut" });
  }, [inView, to, mv]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const stats = [
  { value: 12000, suffix: "+", label: "Listed Businesses" },
  { value: 38, suffix: "", label: "Districts Covered" },
  { value: 200, suffix: "+", label: "Business Categories" },
  { value: 4.8, suffix: "★", label: "Average Rating" },
];

export function StatsSection() {
  return (
    <section className="bg-forest-deep text-text-light py-20 md:py-24 border-y border-text-light/10">
      <div className="container-x">
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display font-bold text-3xl md:text-5xl max-w-3xl leading-tight"
        >
          Tamil Nadu's Business <span className="italic text-sage">Pulse</span> — In Numbers.
        </motion.h2>
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <div className="font-display font-extrabold text-5xl md:text-6xl text-sage">
                {s.value === 4.8 ? <span>4.8★</span> : <Counter to={s.value} suffix={s.suffix} />}
              </div>
              <p className="mt-2 text-text-light/70 text-sm md:text-base">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ [05] Featured Businesses ============ */
const businesses = [
  { name: "Saravana Bhavan", cat: "Restaurants", city: "Chennai", rating: 4.9, img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80", desc: "Iconic South Indian vegetarian cuisine since 1981." },
  { name: "Apollo Hospitals", cat: "Healthcare", city: "Coimbatore", rating: 4.8, img: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&q=80", desc: "Multi-specialty care with world-class infrastructure." },
  { name: "Pothys Silks", cat: "Retail", city: "Madurai", rating: 4.7, img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80", desc: "Heritage silk sarees and traditional wear." },
];

export function FeaturedBusinesses() {
  return (
    <section className="bg-bg-section py-20 md:py-24">
      <div className="container-x">
        <SectionHead label="[05] Featured Listings" title={<>Top Verified Businesses.</>} />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {businesses.map((b, i) => (
            <motion.article
              key={b.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img src={b.img} alt={b.name} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-sage">{b.cat}</span>
                <h3 className="mt-2 font-display font-bold text-xl">{b.name}</h3>
                <p className="text-sm text-text-muted">{b.city}</p>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <Star className="size-4 fill-sage text-sage" />
                  <span className="font-semibold">{b.rating}</span>
                </div>
                <p className="mt-3 text-sm text-text-muted leading-relaxed">{b.desc}</p>
                <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm font-display font-bold text-forest hover:text-sage group">
                  View Profile <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="#" className="inline-flex items-center gap-1 font-display font-bold text-forest hover:text-sage">
            View All Businesses <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============ [06] Cities ============ */
const cities = ["Chennai","Coimbatore","Madurai","Trichy","Salem","Vellore","Erode","Tirunelveli","Thanjavur","Kanchipuram","Ooty","Kumbakonam"];

export function CityExplorer() {
  return (
    <section id="cities" className="relative bg-forest text-text-light py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
        <div className="text-[20rem] font-display font-extrabold">TN</div>
      </div>
      <div className="container-x relative">
        <SectionHead label="[06] Browse by City" dark title={<>Explore Across <span className="italic text-sage">Tamil Nadu.</span></>} />
        <div className="mt-12 flex flex-wrap gap-3">
          {cities.map((c) => (
            <a key={c} href="#" className="px-5 py-2.5 rounded-full border border-sage/50 text-text-light text-sm font-medium hover:bg-sage hover:text-forest-deep hover:border-sage transition-colors duration-150">
              {c}
            </a>
          ))}
          <a href="#" className="px-5 py-2.5 rounded-full bg-sage text-forest-deep text-sm font-display font-bold inline-flex items-center gap-1 hover:bg-sage-soft transition-colors">
            View All 38 Districts <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============ [07] Why Vanigan ============ */
const benefits = [
  { Icon: CheckCircle2, title: "Free to List", desc: "No cost to get started. Add your business in under 5 minutes." },
  { Icon: Users, title: "Reach Local Customers", desc: "Get discovered by thousands of Tamil Nadu customers every day." },
  { Icon: ShieldCheck, title: "Verified Listings", desc: "We verify every listing so customers can trust you." },
];

export function WhyVanigan() {
  return (
    <section id="why" className="bg-background py-20 md:py-24">
      <div className="container-x">
        <SectionHead label="[07] Why Vanigan" title={<>The Smarter Way to <span className="italic">Grow Your Business.</span></>} />
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-white border border-border rounded-2xl p-8"
            >
              <div className="size-12 rounded-full bg-sage/15 flex items-center justify-center">
                <b.Icon className="size-6 text-sage" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 font-display font-bold text-xl">{b.title}</h3>
              <p className="mt-2 text-text-muted leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ [08] Testimonials ============ */
const testimonials = [
  { quote: "Vanigan brought new customers to our restaurant every week. Easy to set up, easy to maintain.", name: "Karthik R.", biz: "Annapoorna Mess", city: "Coimbatore" },
  { quote: "As a small clinic, being verified on Vanigan built immediate trust. Bookings doubled in 3 months.", name: "Dr. Priya S.", biz: "Sree Dental Care", city: "Madurai" },
  { quote: "Best directory for Tamil Nadu businesses. Clean interface, real reviews, real impact.", name: "Murugan V.", biz: "Velavan Motors", city: "Salem" },
  { quote: "Our boutique reaches customers from across the state now. Worth every minute we spent listing.", name: "Lakshmi N.", biz: "Kanchi Silks Boutique", city: "Kanchipuram" },
];

export function Testimonials() {
  return (
    <section className="bg-forest text-text-light py-20 md:py-24">
      <div className="container-x">
        <SectionHead label="[08] What They Say" dark title={<>Trusted by Local Businesses.</>} />
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="rounded-2xl border border-text-light/15 bg-text-light/5 p-6 md:p-8"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="size-4 fill-sage text-sage" />)}
              </div>
              <blockquote className="mt-4 text-lg leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-display font-bold text-text-light">{t.name}</span>
                <span className="text-sage"> · {t.biz}</span>
                <span className="text-text-light/60"> · {t.city}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ [09] Blog ============ */
const posts = [
  { tag: "Growth", title: "5 Ways Tamil Nadu SMEs Win Online in 2026", excerpt: "Practical tactics local business owners can apply this quarter.", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80" },
  { tag: "City Guide", title: "The Coimbatore Industrial Boom — A Founder's Map", excerpt: "Where to set up, who to know, and what's coming next.", img: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80" },
  { tag: "Insight", title: "Why Verified Reviews Convert 3x Better", excerpt: "What we learned from 12,000+ Tamil Nadu listings.", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80" },
];

export function BlogPreview() {
  return (
    <section id="blog" className="bg-bg-section py-20 md:py-24">
      <div className="container-x">
        <SectionHead label="[09] Local Business Insights" title={<>From the Vanigan Blog.</>} />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <motion.article
              key={p.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img src={p.img} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-sage">{p.tag}</span>
                <h3 className="mt-2 font-display font-bold text-lg leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{p.excerpt}</p>
                <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm font-display font-bold text-forest hover:text-sage group">
                  Read More <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="#" className="inline-flex items-center gap-1 font-display font-bold text-forest hover:text-sage">
            View All Articles <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============ [10] CTA Banner ============ */
export function CTABanner() {
  return (
    <section id="cta" className="py-20 md:py-28" style={{ background: "linear-gradient(135deg, oklch(0.68 0.06 140) 0%, oklch(0.55 0.07 150) 100%)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container-x text-center"
      >
        <h2 className="font-display font-extrabold text-4xl md:text-6xl text-forest-deep leading-tight">
          List Your Business <span className="italic">Free</span> Today.
        </h2>
        <p className="mt-5 text-forest-deep/80 text-lg">Join 12,000+ businesses already on Vanigan.org</p>
        <a href="#" className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest-deep text-text-light font-display font-bold px-8 py-4 hover:bg-forest transition-colors text-lg">
          Get Listed Free <ArrowRight className="size-5" />
        </a>
      </motion.div>
    </section>
  );
}

/* ============ [11] Footer ============ */
const tickerItems = ["Tamil Nadu Business Directory", "12,000+ Businesses", "38 Districts", "Discover", "Connect", "Grow"];

export function Footer() {
  return (
    <footer className="bg-forest-deep text-text-light">
      {/* Marquee */}
      <div className="bg-sage text-forest-deep py-3 overflow-hidden border-y border-forest/20">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((t, i) => (
            <span key={i} className="px-6 font-display font-bold text-sm uppercase tracking-wider">
              {t} <span className="ml-6 opacity-50">·</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container-x py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h3 className="font-display font-extrabold text-2xl">Vanigan<span className="text-sage">.org</span></h3>
            <p className="mt-2 text-sage text-sm font-semibold">Tamil Nadu's Business Directory</p>
            <p className="mt-4 text-text-light/60 text-sm leading-relaxed">Discover, connect, and grow with verified businesses across every district of Tamil Nadu.</p>
            <div className="mt-5 flex gap-3">
              {[Linkedin, Instagram, Twitter].map((I, i) => (
                <a key={i} href="#" aria-label="social" className="size-9 rounded-full border border-text-light/20 hover:bg-sage hover:text-forest-deep hover:border-sage flex items-center justify-center transition-colors">
                  <I className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Categories" items={["Restaurants","Healthcare","Education","Real Estate","Automotive","Retail","Technology","Finance"]} />
          <FooterCol title="Top Cities" items={cities.slice(0,8)} />
          <FooterCol title="Company" items={["About","Blog","Advertise","Partner","Contact"]} />

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-sage">Stay Updated</h4>
            <p className="mt-4 text-sm text-text-light/60">Monthly insights for Tamil Nadu businesses.</p>
            <form className="mt-4 flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email" required placeholder="your@email.com" aria-label="Email"
                className="px-4 py-2.5 rounded-full bg-text-light/5 border border-text-light/15 text-sm placeholder:text-text-light/40 focus:outline-none focus:border-sage"
              />
              <button className="rounded-full bg-sage text-forest-deep font-display font-bold text-sm px-5 py-2.5 hover:bg-sage-soft transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-text-light/10 flex flex-col md:flex-row justify-between gap-3 text-xs text-text-light/50">
          <p>© 2026 Vanigan.org · All Rights Reserved</p>
          <p className="flex gap-4">
            <a href="#" className="hover:text-sage">Privacy Policy</a>
            <a href="#" className="hover:text-sage">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-display font-bold text-sm uppercase tracking-wider text-sage">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i}><a href="#" className="text-sm text-text-light/70 hover:text-sage transition-colors">{i}</a></li>
        ))}
      </ul>
    </div>
  );
}
