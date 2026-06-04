import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Grid3x3, List, SlidersHorizontal, 
  Star, Phone, Globe, Mail, ChevronRight, Building2,
  TrendingUp, Sparkles, Filter, X, Loader2
} from "lucide-react";

import { getBusinesses } from "../lib/api/businesses.functions";

const _API = import.meta.env.VITE_API_BASE_URL || "https://vanigan-app-automation-5il0.onrender.com";
void _API; // kept for potential future direct API calls

export const Route = createFileRoute("/businesses")({
  head: () => ({
    meta: [
      { title: "Businesses — Tamil Nadu Business Hub" },
      { name: "description", content: "Discover and explore verified businesses across Tamil Nadu" },
    ],
  }),
  component: BusinessesPage,
});

// Types
interface Business {
  _id: string;
  name: string;
  category?: string;
  subCategory?: string;
  description?: string;
  district?: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  avgRating?: number;
  reviewCount?: number;
  coverImage?: string;
  image?: string;
  img?: string;
  imageUrl?: string;
  galleryImages?: { url: string }[];
  imagePublicId?: string;
  active?: boolean;
}

interface BusinessResult {
  businesses: Business[];
  total: number;
  page: number;
  limit: number;
}

// View modes
type ViewMode = "grid" | "list";

const ITEMS_PER_PAGE = 15;

// ─── Category-aware image resolver ────────────────────────────────────────────
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
  let pool = CATEGORY_IMAGES[category];
  if (!pool && category) {
    const key = Object.keys(CATEGORY_IMAGES).find(
      (k) => k.toLowerCase().includes(category.toLowerCase()) || category.toLowerCase().includes(k.toLowerCase())
    );
    if (key) pool = CATEGORY_IMAGES[key];
  }
  if (!pool && subCategory) {
    const key = Object.keys(CATEGORY_IMAGES).find(
      (k) => k.toLowerCase().includes(subCategory.toLowerCase()) || subCategory.toLowerCase().includes(k.toLowerCase())
    );
    if (key) pool = CATEGORY_IMAGES[key];
  }
  const images = pool ?? DEFAULT_IMAGES;
  return images[hashString(businessId || category) % images.length];
}

// Priority chain: always resolves to a URL
function getBusinessImage(business: Business): string {
  if (business.coverImage?.trim()) return business.coverImage.trim();
  if (business.img?.trim()) return business.img.trim();
  if (business.image?.trim()) return business.image.trim();
  if (business.imageUrl?.trim()) return business.imageUrl.trim();
  if (Array.isArray(business.galleryImages) && business.galleryImages.length > 0) {
    const first = business.galleryImages[0];
    if (first?.url?.trim()) return first.url.trim();
  }
  if (business.imagePublicId?.trim()) {
    return `${CLOUDINARY_BASE}${business.imagePublicId.trim()}.jpg`;
  }
  return getCategoryImage(business.category ?? "", business.subCategory ?? "", business._id ?? "");
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

const cardHover = {
  scale: 1.02,
  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  transition: { duration: 0.2 }
};

function BusinessesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch businesses
  const { data, isLoading, isFetching } = useQuery<BusinessResult>({
    queryKey: ["businesses-new", currentPage, searchQuery, selectedCategory, selectedDistrict],
    queryFn: () => getBusinesses({
      data: {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        district: selectedDistrict || undefined,
      }
    }),
    placeholderData: (prev) => prev,
  });

  const businesses = data?.businesses ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Fetch categories for filter
  const { data: categories = [] } = useQuery({
    queryKey: ["categories-filter"],
    queryFn: async () => {
      const resp = await fetch(`${API}/api/public/categories`);
      if (!resp.ok) return [];
      return resp.json();
    },
  });

  // Fetch districts for filter
  const { data: districts = [] } = useQuery({
    queryKey: ["districts-filter"],
    queryFn: async () => {
      const resp = await fetch(`${API}/api/public/districts`);
      if (!resp.ok) return [];
      return resp.json();
    },
  });

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedDistrict("");
    setCurrentPage(1);
  };

  const activeFiltersCount = [searchQuery, selectedCategory, selectedDistrict].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-sage/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
            >
              <div className="size-8 rounded-lg bg-linear-to-br from-sage to-forest flex items-center justify-center">
                <Building2 className="size-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl group-hover:text-sage transition-colors">
                TN<span className="text-sage">Connect</span>
              </span>
            </Link>

            <nav className="flex items-center gap-4">
              <span className="text-sm text-text-muted hidden sm:block">
                {total.toLocaleString()} businesses
              </span>
              <Link
                to="/"
                className="text-sm font-medium text-foreground hover:text-sage transition-colors"
              >
                Home
              </Link>
              <Link
                to="/list-business"
                className="text-sm font-medium text-foreground hover:text-sage transition-colors"
              >
                Classic View
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-forest via-forest-deep to-sage py-16 sm:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sage rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-forest-deep rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="size-4 text-sage" />
              <span className="text-sm font-semibold text-white">Discover Tamil Nadu Businesses</span>
            </div>
            
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
              Business <span className="text-sage">Directory</span>
            </h1>
            
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Explore verified businesses and services across all 38 districts of Tamil Nadu
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <div className="flex gap-2 bg-white rounded-2xl shadow-2xl p-2">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Search className="size-5 text-text-muted shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="Search businesses, categories, locations..."
                      className="flex-1 bg-transparent outline-none text-foreground placeholder:text-text-muted"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                        className="p-1 hover:bg-sage/10 rounded-lg transition-colors"
                      >
                        <X className="size-4 text-text-muted" />
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
                      showFilters || activeFiltersCount > 0
                        ? "bg-sage text-white"
                        : "bg-forest/5 text-foreground hover:bg-forest/10"
                    }`}
                  >
                    <SlidersHorizontal className="size-4" />
                    <span className="hidden sm:inline">Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="size-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={handleSearch}
                    className="px-6 py-3 bg-linear-to-r from-forest to-forest-deep text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-card border-b border-border"
          >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground outline-none focus:border-sage transition-colors"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat: any) => (
                      <option key={cat._id || cat.name} value={cat.name || cat}>
                        {cat.name || cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District Filter */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    District
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => { setSelectedDistrict(e.target.value); setCurrentPage(1); }}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground outline-none focus:border-sage transition-colors"
                  >
                    <option value="">All Districts</option>
                    {districts.map((dist: any) => (
                      <option key={dist._id || dist.name} value={dist.name || dist}>
                        {dist.name || dist}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Spacer */}
                <div className="hidden lg:block" />

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    disabled={activeFiltersCount === 0}
                    className="w-full px-4 py-2.5 bg-red-500/10 text-red-600 font-semibold rounded-xl hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <Filter className="size-4 text-sage" />
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 bg-sage/10 text-sage px-3 py-1 rounded-full text-sm font-medium">
                      Search: "{searchQuery}"
                      <button onClick={() => { setSearchQuery(""); setCurrentPage(1); }}>
                        <X className="size-3" />
                      </button>
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 bg-sage/10 text-sage px-3 py-1 rounded-full text-sm font-medium">
                      {selectedCategory}
                      <button onClick={() => { setSelectedCategory(""); setCurrentPage(1); }}>
                        <X className="size-3" />
                      </button>
                    </span>
                  )}
                  {selectedDistrict && (
                    <span className="inline-flex items-center gap-1 bg-sage/10 text-sage px-3 py-1 rounded-full text-sm font-medium">
                      {selectedDistrict}
                      <button onClick={() => { setSelectedDistrict(""); setCurrentPage(1); }}>
                        <X className="size-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="font-display font-bold text-2xl text-foreground">
              {isLoading ? "Loading..." : `${total.toLocaleString()} Businesses`}
            </h2>
            {isFetching && (
              <Loader2 className="size-5 text-sage animate-spin" />
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-sage text-white"
                  : "text-text-muted hover:text-foreground"
              }`}
              title="Grid View"
            >
              <Grid3x3 className="size-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-sage text-white"
                  : "text-text-muted hover:text-foreground"
              }`}
              title="List View"
            >
              <List className="size-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="size-12 text-sage animate-spin" />
            <p className="text-text-muted animate-pulse">Loading businesses...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && businesses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-20 rounded-full bg-sage/10 flex items-center justify-center mb-6">
              <Building2 className="size-10 text-sage" />
            </div>
            <h3 className="font-display font-bold text-2xl text-foreground mb-2">
              No businesses found
            </h3>
            <p className="text-text-muted max-w-md mb-6">
              Try adjusting your search criteria or filters to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-sage text-white font-semibold rounded-xl hover:bg-sage/90 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Business Grid/List */}
        {!isLoading && businesses.length > 0 && (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
              }
            >
              {businesses.map((business) => (
                <motion.div key={business._id} variants={itemVariants}>
                  {viewMode === "grid" ? (
                    <BusinessCard business={business} />
                  ) : (
                    <BusinessListItem business={business} />
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-sage hover:text-white hover:border-sage disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        currentPage === pageNum
                          ? "bg-sage text-white"
                          : "border border-border bg-card hover:bg-sage/10"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-sage hover:text-white hover:border-sage disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Business Card Component (Grid View)
function BusinessCard({ business }: { business: Business }) {
  return (
    <motion.div whileHover={cardHover}>
      <Link
        to="/business/$id"
        params={{ id: business._id }}
        className="block group"
      >
        <article className="bg-card border border-border rounded-2xl overflow-hidden h-full flex flex-col hover:border-sage/50 transition-all">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden bg-linear-to-br from-sage/10 to-forest/10">
            <img
              src={getBusinessImage(business)}
              alt={business.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = getCategoryImage(business.category ?? "", business.subCategory ?? "", business._id ?? "");
              }}
            />
            {business.category && (
              <div className="absolute top-3 left-3">
                <span className="inline-block bg-forest-deep/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {business.category}
                </span>
              </div>
            )}
            {business.active && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full">
                  <span className="size-1.5 rounded-full bg-white animate-pulse" />
                  Active
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-display font-bold text-lg text-foreground group-hover:text-sage transition-colors line-clamp-1 mb-2">
              {business.name}
            </h3>

            {(business.district || business.city) && (
              <div className="flex items-center gap-1 text-text-muted text-sm mb-3">
                <MapPin className="size-4 shrink-0 text-sage" />
                <span className="line-clamp-1">
                  {[business.city, business.district].filter(Boolean).join(", ")}
                </span>
              </div>
            )}

            {business.description && (
              <p className="text-sm text-text-muted line-clamp-2 leading-relaxed mb-4">
                {business.description}
              </p>
            )}

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
              {business.avgRating && business.avgRating > 0 ? (
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-sage text-sage" />
                  <span className="font-semibold text-sm">{business.avgRating.toFixed(1)}</span>
                  {business.reviewCount && business.reviewCount > 0 && (
                    <span className="text-xs text-text-muted">({business.reviewCount})</span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-text-muted">No reviews</span>
              )}

              <div className="flex items-center gap-2">
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="size-8 rounded-full bg-sage/10 hover:bg-sage hover:text-white flex items-center justify-center transition-colors"
                    title="Call"
                  >
                    <Phone className="size-4" />
                  </a>
                )}
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="size-8 rounded-full bg-sage/10 hover:bg-sage hover:text-white flex items-center justify-center transition-colors"
                    title="Website"
                  >
                    <Globe className="size-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

// Business List Item Component (List View)
function BusinessListItem({ business }: { business: Business }) {
  return (
    <motion.div whileHover={{ x: 4 }}>
      <Link
        to="/business/$id"
        params={{ id: business._id }}
        className="block group"
      >
        <article className="bg-card border border-border rounded-xl overflow-hidden hover:border-sage/50 hover:shadow-lg transition-all">
          <div className="flex flex-col sm:flex-row gap-4 p-4">
            {/* Image */}
            <div className="relative w-full sm:w-48 aspect-video sm:aspect-square shrink-0 overflow-hidden rounded-lg bg-linear-to-br from-sage/10 to-forest/10">
              <img
                src={getBusinessImage(business)}
                alt={business.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = getCategoryImage(business.category ?? "", business.subCategory ?? "", business._id ?? "");
                }}
              />
              {business.active && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full">
                    <span className="size-1.5 rounded-full bg-white animate-pulse" />
                    Active
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-xl text-foreground group-hover:text-sage transition-colors line-clamp-1 mb-1">
                    {business.name}
                  </h3>
                  {business.category && (
                    <span className="inline-block bg-forest/10 text-forest text-xs font-semibold px-2 py-1 rounded-full">
                      {business.category}
                    </span>
                  )}
                </div>

                {business.avgRating && business.avgRating > 0 && (
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="size-4 fill-sage text-sage" />
                    <span className="font-semibold text-sm">{business.avgRating.toFixed(1)}</span>
                    {business.reviewCount && business.reviewCount > 0 && (
                      <span className="text-xs text-text-muted">({business.reviewCount})</span>
                    )}
                  </div>
                )}
              </div>

              {(business.district || business.city) && (
                <div className="flex items-center gap-1 text-text-muted text-sm mb-3">
                  <MapPin className="size-4 shrink-0 text-sage" />
                  <span>{[business.city, business.district].filter(Boolean).join(", ")}</span>
                </div>
              )}

              {business.description && (
                <p className="text-sm text-text-muted line-clamp-2 leading-relaxed mb-4">
                  {business.description}
                </p>
              )}

              {/* Actions */}
              <div className="mt-auto flex items-center gap-3 pt-3 border-t border-border/50">
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-sage/10 hover:bg-sage text-sage hover:text-white rounded-lg font-semibold text-sm transition-colors"
                  >
                    <Phone className="size-4" />
                    <span className="hidden sm:inline">Call</span>
                  </a>
                )}
                {business.email && (
                  <a
                    href={`mailto:${business.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-forest/10 hover:bg-forest text-forest hover:text-white rounded-lg font-semibold text-sm transition-colors"
                  >
                    <Mail className="size-4" />
                    <span className="hidden sm:inline">Email</span>
                  </a>
                )}
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-forest/10 hover:bg-forest text-forest hover:text-white rounded-lg font-semibold text-sm transition-colors"
                  >
                    <Globe className="size-4" />
                    <span className="hidden sm:inline">Website</span>
                  </a>
                )}
                <div className="ml-auto">
                  <span className="inline-flex items-center gap-1 text-sage text-sm font-semibold group-hover:gap-2 transition-all">
                    View Details
                    <ChevronRight className="size-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
