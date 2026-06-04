import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, ChevronDown, ArrowRight, LayoutGrid } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay: i * 0.1 },
  }),
};

const tickerWords = ["Discover", "Connect", "Grow", "Tamil Nadu", "Verified", "18,424 Businesses", "38 Districts"];

export function Hero() {
  const [logoSrc, setLogoSrc] = useState<string>(communityLogo);

  useEffect(() => {
    makeImageTransparent(communityLogo).then((res) => {
      setLogoSrc(res);
    });
  }, []);

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
      if (!res.ok) throw new Error();
      return await res.json();
    }
  });

  const { data: districts, isLoading: isLoadingDistricts } = useQuery({
    queryKey: ['districts'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/districts`);
      if (!res.ok) throw new Error();
      return await res.json();
    }
  });

  const { data: assemblies, isLoading: isLoadingAssemblies } = useQuery({
    queryKey: ['assemblies'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/assemblies`);
      if (!res.ok) throw new Error();
      return await res.json();
    }
  });

  return (
    <section id="top" className="relative min-h-screen bg-forest text-text-light overflow-hidden flex items-center -mt-20 pt-32 pb-20">
      {/* Smoothly rotating transparent community logo in top-left corner */}
      <div className="absolute top-28 left-6 md:left-12 lg:left-16 z-20 pointer-events-none select-none">
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          src={logoSrc}
          alt="Tamil Nadu Community"
          className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          style={{ animation: "spin 25s linear infinite" }}
        />
      </div>
      {/* Slow-zooming cobalt gradient backdrop */}
      <div
        className="absolute inset-0 animate-slow-zoom"
        aria-hidden
        style={{
          background:
            "radial-gradient(1200px 600px at 80% 10%, oklch(0.35 0.12 250 / 0.7), transparent 60%), radial-gradient(800px 500px at 10% 90%, oklch(0.4 0.08 250 / 0.5), transparent 60%)",
        }}
      />
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
          className="mt-6 font-display font-black leading-[0.98] tracking-tight text-5xl md:text-7xl lg:text-[88px] max-w-5xl"
        >
          Tamil Nadu's
          <br />
          <span className="italic font-bold shimmer">Most Trusted</span> Business Network.
        </motion.h1>


        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="mt-6 max-w-2xl text-base md:text-lg text-text-light/75 leading-relaxed"
        >
          Discover verified businesses, service providers, and professionals across every district of Tamil Nadu.
        </motion.p>

        {/* Search component matching screenshot */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="mt-10 max-w-4xl flex flex-col gap-4"
        >
          {/* Top Row: Search Input + Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3 sm:py-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100">
              <Search className="size-5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search clinics, doctors or services..." 
                className="flex-1 ml-3 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium" 
              />
            </div>
            <button className="bg-sage text-white font-sans font-semibold text-sm px-10 py-4 sm:py-0 rounded-xl hover:bg-sage-soft transition-all shadow-[0_4px_15px_-3px_rgba(0,0,0,0.1)] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage">
              Search
            </button>
          </div>

          {/* Bottom Row: Three Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Dropdown 1: Categories */}
            <div className="flex-1 relative bg-white rounded-xl shadow-sm border border-slate-100 hover:border-slate-300 transition-colors">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <LayoutGrid className="size-5 text-slate-400" />
              </div>
              <select className="w-full h-full py-3 sm:py-4 pl-12 pr-10 bg-transparent text-slate-700 font-semibold text-sm appearance-none outline-none cursor-pointer">
                <option value="">{isLoadingCategories ? "Loading..." : "All Sub-Categories"}</option>
                {categories?.map((c: any) => (
                  <option key={c._id || c.id || c.name} value={c.name || c}>{c.name || c}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                <ChevronDown className="size-4 text-slate-400" />
              </div>
            </div>

            {/* Dropdown 2: Districts */}
            <div className="flex-1 relative bg-white rounded-xl shadow-sm border border-slate-100 hover:border-slate-300 transition-colors">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <MapPin className="size-5 text-slate-400" />
              </div>
              <select className="w-full h-full py-3 sm:py-4 pl-12 pr-10 bg-transparent text-slate-700 font-semibold text-sm appearance-none outline-none cursor-pointer">
                <option value="">{isLoadingDistricts ? "Loading..." : "All Districts"}</option>
                {districts?.map((d: any) => (
                  <option key={d._id || d.id || d.name} value={d.name || d}>{d.name || d}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                <ChevronDown className="size-4 text-slate-400" />
              </div>
            </div>

            {/* Dropdown 3: Assemblies */}
            <div className="flex-1 relative bg-white rounded-xl shadow-sm border border-slate-100 hover:border-slate-300 transition-colors">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <MapPin className="size-5 text-slate-400" />
              </div>
              <select className="w-full h-full py-3 sm:py-4 pl-12 pr-10 bg-transparent text-slate-700 font-semibold text-sm appearance-none outline-none cursor-pointer">
                <option value="">{isLoadingAssemblies ? "Loading..." : "All Assemblies"}</option>
                {assemblies?.map((a: any) => (
                  <option key={a._id || a.id || a.name} value={a.name || a}>{a.name || a}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                <ChevronDown className="size-4 text-slate-400" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="mt-6 flex flex-wrap gap-3">
          <a href="#categories" className="inline-flex items-center gap-2 rounded-xl bg-sage text-white font-sans font-semibold px-6 py-3 hover:bg-sage-soft transition-all whitespace-nowrap active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage">
            Find a Business <ArrowRight className="size-4" />
          </a>
          <a href="#cta" className="inline-flex items-center rounded-xl border border-text-light/30 text-text-light font-sans font-semibold px-6 py-3 hover:bg-text-light/10 transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-light/60">
            List Your Business Free
          </a>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5} className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-text-light/70">
          <span><strong className="text-sage font-sans font-bold">18,424</strong> Listed Businesses</span>
          <span className="opacity-30">·</span>
          <span><strong className="text-sage font-sans font-bold">38</strong> Districts</span>
          <span className="opacity-30">·</span>
          <span><strong className="text-sage font-sans font-bold">4.8★</strong> Rated</span>
        </motion.div>
      </div>

      {/* Hero marquee strip */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-text-light/10 bg-forest-deep/40 backdrop-blur-sm py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee-slow">
          {[...tickerWords, ...tickerWords, ...tickerWords, ...tickerWords].map((w, i) => (
            <span key={i} className="px-8 font-display font-bold text-sm uppercase tracking-[0.2em] text-text-light/70">
              {w} <span className="ml-8 text-sage">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

