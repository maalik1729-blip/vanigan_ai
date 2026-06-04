import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search, MapPin, LayoutGrid, ChevronDown, Star, ArrowRight,
  ArrowLeft, Phone, Globe, Building2, Filter, X,
} from "lucide-react";
import { getBusinesses, getCategories, getDistricts, getAssemblies, type BusinessResult } from "../lib/api/businesses.functions";

const CLOUDINARY_BASE = "https://res.cloudinary.com/dr5tkzmva/image/upload/";
const UNS = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&q=75&fit=crop&auto=format`;

const CATEGORY_IMAGES: Record<string, string[]> = {
  "Hotels & Restaurants": [UNS("1517248135467-4c7edcad34c4"),UNS("1414235077428-338989a2e8c0"),UNS("1504674900247-0877df9cc836"),UNS("1546833999-b9f581a1996d"),UNS("1555396273-367ea4eb4db5"),UNS("1565299624946-b28f40a0ae38")],
  "Caterers":             [UNS("1555244162-803834f70033"),UNS("1567620905732-2d1ec7ab7445"),UNS("1563245372-f21724e3856d"),UNS("1414235077428-338989a2e8c0")],
  "Daily Needs":          [UNS("1542838132-92c53300491e"),UNS("1604719312566-8912e9c8a213"),UNS("1578916171728-46686eac8d58"),UNS("1506484381205-f7945653044d")],
  "Organic Products":     [UNS("1490818387583-1baba5e638af"),UNS("1506484381205-f7945653044d"),UNS("1540420773420-3366772f4999"),UNS("1464226184884-fa280b87c399"),UNS("1488459716781-9d82e8a15580")],
  "Doctors":              [UNS("1551601651-2a8555f1a136"),UNS("1559757175-5700dde675bc"),UNS("1612277795421-9bc7706a4a34"),UNS("1576091160399-112ba8d25d1d"),UNS("1538108149393-fbbd81895907")],
  "Hospitals & Clinics":  [UNS("1538108149393-fbbd81895907"),UNS("1576091160399-112ba8d25d1d"),UNS("1519494026892-ab4058a6a5a4"),UNS("1551076805-e1869033e561")],
  "Pharmacy":             [UNS("1585435557343-3b092031a831"),UNS("1471864190281-a93a3070b6de"),UNS("1584308666744-89f57aa11b6c")],
  "Spa & Beauty":         [UNS("1560750588-73207b1ef5b8"),UNS("1522337360788-8b13dee7a37e"),UNS("1470259078422-826894b933aa"),UNS("1515377905703-c4788e51af15"),UNS("1487412912498-0447578fcca8")],
  "Education":            [UNS("1503676260728-1c00da094a0b"),UNS("1434030216411-0b793f4b4173"),UNS("1513258496099-48168024aec0"),UNS("1546410531-bb4caa6b424d"),UNS("1456513080510-7bf3a84b82f8")],
  "Coaching Centers":     [UNS("1434030216411-0b793f4b4173"),UNS("1580582932707-520aed937b7b"),UNS("1513258496099-48168024aec0"),UNS("1522202176988-66273c2fd55f")],
  "IT & Software":        [UNS("1461749280684-dccba630e2f6"),UNS("1555066931-4365d14bab8c"),UNS("1517694712202-14dd9538aa97"),UNS("1504639725590-34d0984388bd"),UNS("1571171637578-41bc2dd41cd2")],
  "Electricals & Electronics": [UNS("1518770660439-4636190af475"),UNS("1550009158-9ebf69173e03"),UNS("1498049794561-7780e7231661"),UNS("1563770660941-20978e870e13"),UNS("1574944985070-8f3ebc6b79d2")],
  "Construction Materials": [UNS("1504307651254-35680f356dfd"),UNS("1621905251918-48416bd8575a"),UNS("1590674899484-d5640e854abe"),UNS("1541888838-76b4e68b1751"),UNS("1486325212027-8081e485255e")],
  "Civil Contractors":    [UNS("1581094794329-c8112a89af12"),UNS("1503387762-592deb58ef4e"),UNS("1504307651254-35680f356dfd"),UNS("1486325212027-8081e485255e"),UNS("1574600436408-8c79e2c69ea2")],
  "Real Estate":          [UNS("1560518883-ce09059eeffa"),UNS("1570129477492-45c003edd2be"),UNS("1545324418-cc1a3fa10c00"),UNS("1582407947304-fd86f28f3da6"),UNS("1613977257363-707ba9028ad0")],
  "Interior Design":      [UNS("1555041469-a586c61ea9bc"),UNS("1618219908412-a29a1bb7b86e"),UNS("1586023492125-27b2c045efd3"),UNS("1600607687939-ce8a6c25118c")],
  "Transport":            [UNS("1492144534655-ae79c964c9d7"),UNS("1544620347-c4fd4a3d5957"),UNS("1449965408869-eaa3f722e40d"),UNS("1530046339160-ce3e530c7d2f"),UNS("1558981403-c5f9899a28bc"),UNS("1568605117036-5fe5e7bab0b7")],
  "Automobiles":          [UNS("1503376780353-7e6692767b70"),UNS("1492144534655-ae79c964c9d7"),UNS("1541899481282-d53bffe3c35d"),UNS("1502877338535-766e1452684a")],
  "Textiles & Garments":  [UNS("1558618666-fcd25c85cd64"),UNS("1489987707025-afc232f7ea0f"),UNS("1596755094514-f87e34085b2c"),UNS("1620799140408-edc6dcb6d633"),UNS("1545291730-faff8ca1d4b0")],
  "Jewellery":            [UNS("1515562141207-7a88fb7ce338"),UNS("1599643478518-a784e5dc4c8f"),UNS("1611591437281-460bfbe1220a"),UNS("1602173574767-37c1faa8f242"),UNS("1573408301185-9521e7198254")],
  "Footwear":             [UNS("1542291026-7eec264c27ff"),UNS("1543163521-1bf539c55dd2"),UNS("1491553895911-0055eca6402d"),UNS("1560769629-975ec94e6a86")],
  "Agriculture":          [UNS("1500937386664-56d1dfef3854"),UNS("1464226184884-fa280b87c399"),UNS("1523348837708-15d4a09cfac2"),UNS("1574943320219-553eb213f72d"),UNS("1416879595882-3373a0480b5b"),UNS("1601459227413-e0f27b73e4e3")],
  "Nursery & Plants":     [UNS("1416879595882-3373a0480b5b"),UNS("1585320806297-9c5e3d4305de"),UNS("1501004318641-b39e6451bec6"),UNS("1558618047-3c8c76ca7d13")],
  "B2B Services":         [UNS("1486406146926-c627a92ad1ab"),UNS("1454165804606-c3d57bc86b40"),UNS("1521791136064-7986c2920216"),UNS("1542744173-8e7e53415bb0"),UNS("1507679799987-c73779587ccf"),UNS("1519389950473-47ba0277781c")],
  "Finance & Banking":    [UNS("1554224155-6726b3ff858f"),UNS("1611974789855-9c702a8b7aef"),UNS("1579621970563-ebec7560ff3e"),UNS("1565514020179-026b92b84bb6")],
  "Legal Services":       [UNS("1589829545856-d10d557cf95f"),UNS("1589829153745-3e92a96c0e2e"),UNS("1555374018-13a8994ab246"),UNS("1450101499163-c8848c66ca85")],
  "Advertising":          [UNS("1504711434969-e33886168f5c"),UNS("1533750349088-cd871a92f312"),UNS("1557804506-669a67965ba0"),UNS("1432888622747-4eb9a8f2c293"),UNS("1460925895917-afdab827c52f")],
  "Printing Services":    [UNS("1562776977-f5db5477e89c"),UNS("1586717799252-bd134ad00e26"),UNS("1584810179025-bef9901933a7"),UNS("1568605117036-5fe5e7bab0b7")],
  "Photography":          [UNS("1471341971476-ae15ff5dd4ea"),UNS("1452587925148-ce544e77e70d"),UNS("1493863531406-2e58b68da1b2"),UNS("1542038784456-1ea8e935640e")],
  "Wedding Services":     [UNS("1519741497674-611481863552"),UNS("1511285560929-80b456fea0bc"),UNS("1464366400600-7168b8af9bc3"),UNS("1606800052052-a08af7148866"),UNS("1583939003579-730e3918a45a"),UNS("1522673607200-164d1b6ce486")],
  "Event Management":     [UNS("1511578314322-379afb476865"),UNS("1492684223066-81342ee5ff30"),UNS("1540575467537-26b93a5a74f4"),UNS("1528495612343-dc9b507b6a4b")],
  "Home Appliances":      [UNS("1556909114-f6e7ad7d3136"),UNS("1558618047-3c8c76ca7d13"),UNS("1585771724684-38269d6639fd"),UNS("1574269909626-c91d3d88ccf7")],
  "Furniture":            [UNS("1555041469-a586c61ea9bc"),UNS("1586023492125-27b2c045efd3"),UNS("1493663284031-b7e3aefcae8e"),UNS("1538688525198-9b2f24dc934d"),UNS("1524758631624-e2822e304c36")],
  "Hardware & Tools":     [UNS("1572981779307-38b8cabb2407"),UNS("1504328345606-18bbc8c9d7d1"),UNS("1581244683861-a5effd04ee90"),UNS("1530124566582-a618bc2615dc")],
};
const DEFAULT_IMAGES = [UNS("1486406146926-c627a92ad1ab"),UNS("1521791136064-7986c2920216"),UNS("1507679799987-c73779587ccf"),UNS("1454165804606-c3d57bc86b40")];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  return Math.abs(h);
}

function getCategoryImage(category: string, subCategory: string, businessId: string): string {
  // Try exact category key
  let pool = CATEGORY_IMAGES[category];
  
  // Try partial match if no exact key
  if (!pool && category) {
    const key = Object.keys(CATEGORY_IMAGES).find(
      (k) => k.toLowerCase().includes(category.toLowerCase()) ||
             category.toLowerCase().includes(k.toLowerCase())
    );
    if (key) pool = CATEGORY_IMAGES[key];
  }
  
  // Try subCategory as a secondary key for better matching
  if (!pool && subCategory) {
    const key = Object.keys(CATEGORY_IMAGES).find(
      (k) => k.toLowerCase().includes(subCategory.toLowerCase()) ||
             subCategory.toLowerCase().includes(k.toLowerCase())
    );
    if (key) pool = CATEGORY_IMAGES[key];
  }
  
  const images = pool ?? DEFAULT_IMAGES;
  return images[hashString(businessId || category) % images.length];
}

/** Resolves the best available image — always returns a string */
function getBestImage(b: any): string {
  if (b.coverImage && b.coverImage.trim()) return b.coverImage.trim();
  if (b.img && b.img.trim()) return b.img.trim();
  if (b.image && b.image.trim()) return b.image.trim();
  if (b.imageUrl && b.imageUrl.trim()) return b.imageUrl.trim();
  if (b.logo && b.logo.trim()) return b.logo.trim();
  if (Array.isArray(b.galleryImages) && b.galleryImages.length > 0) {
    const first = b.galleryImages[0];
    if (first?.url && first.url.trim()) return first.url.trim();
  }
  if (b.imagePublicId && b.imagePublicId.trim()) {
    return `${CLOUDINARY_BASE}${b.imagePublicId.trim()}.jpg`;
  }
  return getCategoryImage(b.category ?? "", b.subCategory ?? "", b._id ?? b.listingCode ?? b.name ?? "");
}

export const Route = createFileRoute("/list-business")({
  head: () => ({
    meta: [
      { title: "Business Directory — Vanigan.org" },
      { name: "description", content: "Browse 18,424+ verified businesses across all 38 districts of Tamil Nadu." },
    ],
  }),
  component: ListBusinessPage,
});

/* ─── Animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const, delay: i * 0.03 },
  }),
};

const LIMIT = 12;

/* Helper to build query string for the server function */
function buildSearchParams(params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "" && v !== 0) sp.set(k, String(v));
  }
  return sp.toString();
}

/* ─── Main Page ─── */
function ListBusinessPage() {
  const [searchInput, setSearchInput]       = useState("");
  const [search, setSearch]                 = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedAssembly, setSelectedAssembly] = useState("");
  const [currentPage, setCurrentPage]       = useState(1);

  /* ── Server-side Businesses fetch ── */
  const queryParams = buildSearchParams({
    page: currentPage,
    limit: LIMIT,
    search: search || undefined,
    category: selectedCategory || undefined,
    district: selectedDistrict || undefined,
    assembly: selectedAssembly || undefined,
  });

  const { data, isLoading, error, isFetching } = useQuery<BusinessResult>({
    queryKey: ["businesses", currentPage, search, selectedCategory, selectedDistrict, selectedAssembly],
    queryFn: () => getBusinesses({
      data: {
        page: currentPage,
        limit: LIMIT,
        search: search || undefined,
        category: selectedCategory || undefined,
        district: selectedDistrict || undefined,
        assembly: selectedAssembly || undefined,
      }
    }),
    placeholderData: (prev) => prev,
    retry: 1,
  });

  const businesses = data?.businesses ?? [];
  const total      = data?.total      ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  /* ── Filter helpers ── */
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: () => getCategories() });
  const { data: districts  = [] } = useQuery({ queryKey: ["districts"],  queryFn: () => getDistricts()  });
  const { data: assemblies = [] } = useQuery({ queryKey: ["assemblies"], queryFn: () => getAssemblies() });

  const applySearch = useCallback(() => {
    setSearch(searchInput);
    setCurrentPage(1);
  }, [searchInput]);

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setSelectedCategory("");
    setSelectedDistrict("");
    setSelectedAssembly("");
    setCurrentPage(1);
  };

  const activeFilters = [search, selectedCategory, selectedDistrict, selectedAssembly].filter(Boolean).length;

  /* ── Page window (max 7 buttons) ── */
  const pageButtons = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const half = 3;
    let start = Math.max(1, currentPage - half);
    let end   = Math.min(totalPages, currentPage + half);
    if (currentPage <= half + 1) end   = Math.min(totalPages, 7);
    if (currentPage >= totalPages - half) start = Math.max(1, totalPages - 6);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  })();

  return (
    <>
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-normal text-base tracking-tight text-foreground hover:opacity-75 transition-opacity"
          >
            <span className="size-2 rounded-full bg-sage animate-pulse shrink-0" />
            <span>Vanigan<span className="italic text-sage">.org</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-text-muted">
              {isFetching ? "Updating..." : `${total.toLocaleString()} businesses found`}
            </span>
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-sage transition-colors"
            >
              <ArrowLeft className="size-4" /> Home
            </Link>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-background">
        {/* ── Hero Banner ── */}
        <section className="bg-forest text-text-light py-14 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none flex items-center justify-center">
            <div className="text-[16rem] font-display font-extrabold">TN</div>
          </div>
          <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold tracking-[0.22em] uppercase text-sage"
            >
              Business Directory
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 font-display font-black text-4xl md:text-6xl leading-tight"
            >
              Explore All <span className="italic text-sage">Businesses</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-text-light/70 text-lg max-w-2xl"
            >
              Browse verified businesses, service providers, and professionals across every district of Tamil Nadu.
            </motion.p>
          </div>
        </section>

        {/* ── Search & Filters ── */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 -mt-8 relative z-20">
          <div className="bg-card border border-border rounded-2xl shadow-xl p-5 md:p-6 flex flex-col gap-4">
            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center bg-background rounded-xl px-4 py-3 border border-border">
                <Search className="size-5 text-text-muted shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applySearch()}
                  placeholder="Search businesses, categories, cities..."
                  className="flex-1 ml-3 bg-transparent outline-none text-foreground placeholder:text-text-muted font-medium text-sm"
                />
                {searchInput && (
                  <button onClick={() => { setSearchInput(""); setSearch(""); setCurrentPage(1); }} className="text-text-muted hover:text-foreground">
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <button
                onClick={applySearch}
                className="bg-forest text-text-light font-display font-bold tracking-[0.12em] text-sm uppercase px-8 py-3 rounded-xl hover:bg-forest-deep transition-colors shrink-0"
              >
                <Search className="size-4 inline mr-2" />Search
              </button>
            </div>

            {/* Filter row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Category */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LayoutGrid className="size-4 text-text-muted" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="w-full py-3 pl-10 pr-10 bg-background border border-border rounded-xl text-foreground font-semibold text-sm appearance-none outline-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((c: any) => (
                    <option key={c._id || c.id || c.name} value={c.name || c}>{c.name || c}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <ChevronDown className="size-4 text-text-muted" />
                </div>
              </div>

              {/* District */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="size-4 text-text-muted" />
                </div>
                <select
                  value={selectedDistrict}
                  onChange={(e) => { setSelectedDistrict(e.target.value); setCurrentPage(1); }}
                  className="w-full py-3 pl-10 pr-10 bg-background border border-border rounded-xl text-foreground font-semibold text-sm appearance-none outline-none cursor-pointer"
                >
                  <option value="">All Districts</option>
                  {districts.map((d: any) => (
                    <option key={d._id || d.id || d.name} value={d.name || d}>{d.name || d}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <ChevronDown className="size-4 text-text-muted" />
                </div>
              </div>

              {/* Assembly */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="size-4 text-text-muted" />
                </div>
                <select
                  value={selectedAssembly}
                  onChange={(e) => { setSelectedAssembly(e.target.value); setCurrentPage(1); }}
                  className="w-full py-3 pl-10 pr-10 bg-background border border-border rounded-xl text-foreground font-semibold text-sm appearance-none outline-none cursor-pointer"
                >
                  <option value="">All Assemblies</option>
                  {assemblies.map((a: any) => (
                    <option key={a._id || a.id || a.name} value={a.name || a}>{a.name || a}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <ChevronDown className="size-4 text-text-muted" />
                </div>
              </div>
            </div>

            {/* Active filter pills */}
            {activeFilters > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="size-4 text-sage" />
                {search && (
                  <span className="inline-flex items-center gap-1 bg-sage/15 text-sage text-xs font-semibold px-3 py-1 rounded-full">
                    &ldquo;{search}&rdquo;
                    <button onClick={() => { setSearch(""); setSearchInput(""); setCurrentPage(1); }}><X className="size-3" /></button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 bg-sage/15 text-sage text-xs font-semibold px-3 py-1 rounded-full">
                    {selectedCategory}
                    <button onClick={() => { setSelectedCategory(""); setCurrentPage(1); }}><X className="size-3" /></button>
                  </span>
                )}
                {selectedDistrict && (
                  <span className="inline-flex items-center gap-1 bg-sage/15 text-sage text-xs font-semibold px-3 py-1 rounded-full">
                    {selectedDistrict}
                    <button onClick={() => { setSelectedDistrict(""); setCurrentPage(1); }}><X className="size-3" /></button>
                  </span>
                )}
                {selectedAssembly && (
                  <span className="inline-flex items-center gap-1 bg-sage/15 text-sage text-xs font-semibold px-3 py-1 rounded-full">
                    {selectedAssembly}
                    <button onClick={() => { setSelectedAssembly(""); setCurrentPage(1); }}><X className="size-3" /></button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-xs font-semibold text-text-muted hover:text-sage underline ml-2">
                  Clear all
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── Results ── */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-14">
          {/* Loading initial */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-text-muted">
              <div className="size-10 border-4 border-sage/30 border-t-sage rounded-full animate-spin" />
              <span className="text-sm animate-pulse">Loading businesses from database...</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl p-8 text-center max-w-xl mx-auto">
              <p className="font-display font-bold text-xl">Unable to load businesses</p>
              <p className="mt-2 text-sm">{(error as Error).message}</p>
            </div>
          )}

          {/* Results count + page */}
          {!isLoading && !error && (
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-text-muted">
                Showing <strong className="text-foreground">{businesses.length}</strong> of{" "}
                <strong className="text-foreground">{total.toLocaleString()}</strong> businesses
                {isFetching && <span className="ml-2 text-sage animate-pulse">· updating…</span>}
              </p>
              <p className="text-sm text-text-muted hidden sm:block">
                Page {currentPage} of {totalPages || 1}
              </p>
            </div>
          )}

          {/* Business Cards Grid */}
          {!isLoading && !error && businesses.length > 0 && (
            <motion.div
              key={`page-${currentPage}-${search}-${selectedCategory}-${selectedDistrict}`}
              initial="hidden" animate="visible"
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}
            >
              {businesses.map((b: any, i: number) => (
                <motion.article
                  key={b._id || b.id || i}
                  custom={i}
                  variants={fadeUp}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Clickable image area → detail page */}
                  <Link
                    to="/business/$id"
                    params={{ id: b._id || b.id }}
                    className="relative aspect-video overflow-hidden bg-forest/10 block"
                  >
                    {(() => {
                      const imgSrc = getBestImage(b);
                      return (
                        <img
                          src={imgSrc}
                          alt={b.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = getCategoryImage(b.category ?? "", b.subCategory ?? "", b._id ?? b.listingCode ?? b.name ?? "");
                          }}
                        />
                      );
                    })()}
                    {(b.category || b.cat) && (
                      <span className="absolute top-3 left-3 bg-forest-deep/80 backdrop-blur-sm text-text-light text-[10px] font-semibold tracking-[0.15em] uppercase px-3 py-1 rounded-full">
                        {b.category || b.cat}
                      </span>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col">
                    <Link
                      to="/business/$id"
                      params={{ id: b._id || b.id }}
                      className="font-display font-bold text-lg leading-snug line-clamp-1 hover:text-sage transition-colors"
                    >
                      {b.name}
                    </Link>

                    {(b.city || b.district) && (
                      <div className="mt-1.5 flex items-center gap-1 text-text-muted text-xs">
                        <MapPin className="size-3" />
                        <span>{[b.district, b.city].filter(Boolean).join(", ")}</span>
                      </div>
                    )}

                    {(b.description || b.desc) && (
                      <p className="mt-2 text-sm text-text-muted line-clamp-2 leading-relaxed">{b.description || b.desc}</p>
                    )}

                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                      {b.avgRating ? (
                        <span className="inline-flex items-center gap-1 text-sm">
                          <Star className="size-3.5 fill-sage text-sage" />
                          <span className="font-semibold">{b.avgRating}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted">New listing</span>
                      )}
                      <div className="flex items-center gap-2">
                        {b.phone && (
                          <a
                            href={`tel:${b.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="size-7 rounded-full bg-sage/10 text-sage hover:bg-sage hover:text-forest-deep flex items-center justify-center transition-colors"
                            title="Call"
                          >
                            <Phone className="size-3.5" />
                          </a>
                        )}
                        {b.website && (
                          <a
                            href={b.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="size-7 rounded-full bg-sage/10 text-sage hover:bg-sage hover:text-forest-deep flex items-center justify-center transition-colors"
                            title="Website"
                          >
                            <Globe className="size-3.5" />
                          </a>
                        )}
                        <Link
                          to="/business/$id"
                          params={{ id: b._id || b.id }}
                          className="size-7 rounded-full bg-forest/10 text-forest hover:bg-forest hover:text-text-light flex items-center justify-center transition-colors"
                          title="View Details"
                        >
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && !error && businesses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Building2 className="size-16 text-text-muted/30" strokeWidth={1} />
              <h3 className="mt-6 font-display font-bold text-xl text-foreground">No businesses found</h3>
              <p className="mt-2 text-sm text-text-muted max-w-md">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              {activeFilters > 0 && (
                <button onClick={clearFilters} className="mt-4 text-sm font-semibold text-sage hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={currentPage === 1 || isFetching}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="size-4 inline mr-1" /> Prev
                </button>

                {pageButtons[0] > 1 && (
                  <>
                    <button onClick={() => { setCurrentPage(1); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="size-10 rounded-xl text-sm font-semibold border border-border hover:bg-card transition-colors">1</button>
                    {pageButtons[0] > 2 && <span className="text-text-muted px-1">…</span>}
                  </>
                )}

                {pageButtons.map((page) => (
                  <button
                    key={page}
                    onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    disabled={isFetching}
                    className={`size-10 rounded-xl text-sm font-semibold transition-colors ${
                      page === currentPage
                        ? "bg-forest text-text-light"
                        : "border border-border hover:bg-card"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {pageButtons[pageButtons.length - 1] < totalPages && (
                  <>
                    {pageButtons[pageButtons.length - 1] < totalPages - 1 && <span className="text-text-muted px-1">…</span>}
                    <button onClick={() => { setCurrentPage(totalPages); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="size-10 rounded-xl text-sm font-semibold border border-border hover:bg-card transition-colors">{totalPages}</button>
                  </>
                )}

                <button
                  onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={currentPage === totalPages || isFetching}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ArrowRight className="size-4 inline ml-1" />
                </button>
              </div>

              {/* Jump to page */}
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <span>Go to page</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  defaultValue={currentPage}
                  key={currentPage}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = Number((e.target as HTMLInputElement).value);
                      if (val >= 1 && val <= totalPages) {
                        setCurrentPage(val);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }
                  }}
                  className="w-16 px-2 py-1 rounded-lg border border-border bg-background text-center text-foreground font-semibold outline-none focus:border-sage"
                />
                <span>of {totalPages.toLocaleString()}</span>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
