import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Phone, Globe, Mail, Clock, Building2,
  Star, ChevronRight, Calendar, Tag, Share2, ExternalLink,
  Navigation, Layers,
} from "lucide-react";
import { getBusinessById } from "../lib/api/businesses.functions";

export const Route = createFileRoute("/business/$id")({
  head: () => ({
    meta: [
      { title: "Business Details — Vanigan.org" },
      { name: "description", content: "View full business details, contact info, gallery and more." },
    ],
  }),
  component: BusinessDetailPage,
});

/* ─── Helpers ─── */
const API = (import.meta as any).env?.VITE_API_BASE_URL ?? "https://vanigan-app-automation-5il0.onrender.com";
const CLOUDINARY_BASE = "https://res.cloudinary.com/dr5tkzmva/image/upload/";
const UNS = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&fit=crop&auto=format`;

/**
 * Each category has an ARRAY of 4–6 different curated Unsplash photos.
 * A deterministic hash of the business _id picks one — so every
 * business gets its own distinct image that never changes on reload.
 */
const CATEGORY_IMAGES: Record<string, string[]> = {
  // ── Food & Hospitality ──────────────────────────────────────────────
  "Hotels & Restaurants": [
    UNS("1517248135467-4c7edcad34c4"),  // warm restaurant interior
    UNS("1414235077428-338989a2e8c0"),  // fine dining plated dish
    UNS("1504674900247-0877df9cc836"),  // food flat lay spread
    UNS("1546833999-b9f581a1996d"),     // cozy cafe counter
    UNS("1555396273-367ea4eb4db5"),     // restaurant tables & ambience
    UNS("1565299624946-b28f40a0ae38"),  // pizza / Italian vibes
  ],
  "Caterers": [
    UNS("1555244162-803834f70033"),  // buffet catering spread
    UNS("1567620905732-2d1ec7ab7445"),  // food service
    UNS("1563245372-f21724e3856d"),  // wedding banquet
    UNS("1414235077428-338989a2e8c0"),  // elegant catered table
  ],
  "Daily Needs": [
    UNS("1542838132-92c53300491e"),  // grocery store aisle
    UNS("1604719312566-8912e9c8a213"),  // supermarket shelves
    UNS("1578916171728-46686eac8d58"),  // local provisions shop
    UNS("1506484381205-f7945653044d"),  // fresh vegetables market
  ],
  "Organic Products": [
    UNS("1490818387583-1baba5e638af"),  // organic food arrangement
    UNS("1506484381205-f7945653044d"),  // fresh produce market
    UNS("1540420773420-3366772f4999"),  // healthy clean eating
    UNS("1464226184884-fa280b87c399"),  // natural farm fresh
    UNS("1488459716781-9d82e8a15580"),  // herbs and spices
  ],

  // ── Medical & Health ────────────────────────────────────────────────
  "Doctors": [
    UNS("1551601651-2a8555f1a136"),  // doctor with stethoscope
    UNS("1559757175-5700dde675bc"),  // medical examination
    UNS("1612277795421-9bc7706a4a34"),  // close-up stethoscope
    UNS("1576091160399-112ba8d25d1d"),  // clinical setting
    UNS("1538108149393-fbbd81895907"),  // hospital corridor
  ],
  "Hospitals & Clinics": [
    UNS("1538108149393-fbbd81895907"),  // hospital exterior
    UNS("1576091160399-112ba8d25d1d"),  // patient room
    UNS("1519494026892-ab4058a6a5a4"),  // medical team
    UNS("1551076805-e1869033e561"),     // clinic reception
  ],
  "Pharmacy": [
    UNS("1585435557343-3b092031a831"),  // pharmacy shelves
    UNS("1471864190281-a93a3070b6de"),  // medicine bottles
    UNS("1584308666744-89f57aa11b6c"),  // drug store aisle
  ],
  "Spa & Beauty": [
    UNS("1560750588-73207b1ef5b8"),  // luxury spa stones
    UNS("1522337360788-8b13dee7a37e"),  // beauty treatment
    UNS("1470259078422-826894b933aa"),  // hair salon
    UNS("1515377905703-c4788e51af15"),  // wellness spa pool
    UNS("1487412912498-0447578fcca8"),  // skincare products
  ],

  // ── Education ───────────────────────────────────────────────────────
  "Education": [
    UNS("1503676260728-1c00da094a0b"),  // library books
    UNS("1434030216411-0b793f4b4173"),  // classroom chalkboard
    UNS("1513258496099-48168024aec0"),  // student studying laptop
    UNS("1546410531-bb4caa6b424d"),     // school building
    UNS("1456513080510-7bf3a84b82f8"),  // open textbook
  ],
  "Coaching Centers": [
    UNS("1434030216411-0b793f4b4173"),  // chalkboard classroom
    UNS("1580582932707-520aed937b7b"),  // students in class
    UNS("1513258496099-48168024aec0"),  // laptop study
    UNS("1522202176988-66273c2fd55f"),  // group learning
  ],

  // ── Technology ──────────────────────────────────────────────────────
  "IT & Software": [
    UNS("1461749280684-dccba630e2f6"),  // code on monitor
    UNS("1555066931-4365d14bab8c"),     // programming dark theme
    UNS("1517694712202-14dd9538aa97"),  // laptop code screen
    UNS("1504639725590-34d0984388bd"),  // developer workspace
    UNS("1571171637578-41bc2dd41cd2"),  // software team meeting
  ],
  "Electricals & Electronics": [
    UNS("1518770660439-4636190af475"),  // circuit board close-up
    UNS("1550009158-9ebf69173e03"),     // electronics components
    UNS("1498049794561-7780e7231661"),  // tech devices flat lay
    UNS("1563770660941-20978e870e13"),  // electrical wiring
    UNS("1574944985070-8f3ebc6b79d2"),  // electronics shop
  ],

  // ── Construction & Real Estate ───────────────────────────────────────
  "Construction Materials": [
    UNS("1504307651254-35680f356dfd"),  // construction site workers
    UNS("1621905251918-48416bd8575a"),  // building materials pile
    UNS("1590674899484-d5640e854abe"),  // cement concrete
    UNS("1541888838-76b4e68b1751"),     // hardware materials
    UNS("1486325212027-8081e485255e"),  // bricks
  ],
  "Civil Contractors": [
    UNS("1581094794329-c8112a89af12"),  // architect blueprint
    UNS("1503387762-592deb58ef4e"),     // architect drawing plans
    UNS("1504307651254-35680f356dfd"),  // on-site construction
    UNS("1486325212027-8081e485255e"),  // building under construction
    UNS("1574600436408-8c79e2c69ea2"),  // finished modern building
  ],
  "Real Estate": [
    UNS("1560518883-ce09059eeffa"),  // modern house exterior
    UNS("1570129477492-45c003edd2be"),  // dream home
    UNS("1545324418-cc1a3fa10c00"),  // apartment block
    UNS("1582407947304-fd86f28f3da6"),  // luxury villa
    UNS("1613977257363-707ba9028ad0"),  // real estate aerial
  ],
  "Interior Design": [
    UNS("1555041469-a586c61ea9bc"),  // modern living room
    UNS("1618219908412-a29a1bb7b86e"),  // interior design bedroom
    UNS("1586023492125-27b2c045efd3"),  // elegant interior
    UNS("1600607687939-ce8a6c25118c"),  // styled dining room
  ],

  // ── Transport & Automotive ───────────────────────────────────────────
  "Transport": [
    UNS("1492144534655-ae79c964c9d7"),  // car on road
    UNS("1544620347-c4fd4a3d5957"),     // bus
    UNS("1449965408869-eaa3f722e40d"),  // highway road trip
    UNS("1530046339160-ce3e530c7d2f"),  // truck logistics
    UNS("1558981403-c5f9899a28bc"),     // auto rickshaw
    UNS("1568605117036-5fe5e7bab0b7"),  // cab taxi
  ],
  "Automobiles": [
    UNS("1503376780353-7e6692767b70"),  // sports car
    UNS("1492144534655-ae79c964c9d7"),  // car detail
    UNS("1541899481282-d53bffe3c35d"),  // car showroom
    UNS("1502877338535-766e1452684a"),  // car service workshop
  ],

  // ── Textiles & Fashion ───────────────────────────────────────────────
  "Textiles & Garments": [
    UNS("1558618666-fcd25c85cd64"),  // colourful fabric rolls
    UNS("1489987707025-afc232f7ea0f"),  // clothing rack
    UNS("1596755094514-f87e34085b2c"),  // garment display
    UNS("1620799140408-edc6dcb6d633"),  // Indian saree textiles
    UNS("1545291730-faff8ca1d4b0"),     // fashion boutique
  ],
  "Jewellery": [
    UNS("1515562141207-7a88fb7ce338"),  // gold jewellery
    UNS("1599643478518-a784e5dc4c8f"),  // diamond ring
    UNS("1611591437281-460bfbe1220a"),  // bracelet necklace
    UNS("1602173574767-37c1faa8f242"),  // jewellery store display
    UNS("1573408301185-9521e7198254"),  // gold bangles
  ],
  "Footwear": [
    UNS("1542291026-7eec264c27ff"),  // sneakers
    UNS("1543163521-1bf539c55dd2"),  // formal shoes
    UNS("1491553895911-0055eca6402d"),  // shoe store
    UNS("1560769629-975ec94e6a86"),  // sandals footwear
  ],

  // ── Agriculture ─────────────────────────────────────────────────────
  "Agriculture": [
    UNS("1500937386664-56d1dfef3854"),  // wheat field
    UNS("1464226184884-fa280b87c399"),  // farm landscape
    UNS("1523348837708-15d4a09cfac2"),  // crops harvest
    UNS("1574943320219-553eb213f72d"),  // tractor farming
    UNS("1416879595882-3373a0480b5b"),  // nursery plants
    UNS("1601459227413-e0f27b73e4e3"),  // vegetable garden
  ],
  "Nursery & Plants": [
    UNS("1416879595882-3373a0480b5b"),  // plant nursery
    UNS("1585320806297-9c5e3d4305de"),  // potted plants row
    UNS("1501004318641-b39e6451bec6"),  // seedlings
    UNS("1558618047-3c8c76ca7d13"),     // garden centre
  ],

  // ── Business & Finance ──────────────────────────────────────────────
  "B2B Services": [
    UNS("1486406146926-c627a92ad1ab"),  // modern office building
    UNS("1454165804606-c3d57bc86b40"),  // business meeting
    UNS("1521791136064-7986c2920216"),  // handshake deal
    UNS("1542744173-8e7e53415bb0"),     // business strategy
    UNS("1507679799987-c73779587ccf"),  // corporate office
    UNS("1519389950473-47ba0277781c"),  // team collaboration
  ],
  "Finance & Banking": [
    UNS("1554224155-6726b3ff858f"),  // money financial
    UNS("1611974789855-9c702a8b7aef"),  // stock market charts
    UNS("1579621970563-ebec7560ff3e"),  // banking
    UNS("1565514020179-026b92b84bb6"),  // financial planning
  ],
  "Legal Services": [
    UNS("1589829545856-d10d557cf95f"),  // justice scales
    UNS("1589829153745-3e92a96c0e2e"),  // law books
    UNS("1555374018-13a8994ab246"),     // courthouse
    UNS("1450101499163-c8848c66ca85"),  // signing legal document
  ],

  // ── Creative & Media ────────────────────────────────────────────────
  "Advertising": [
    UNS("1504711434969-e33886168f5c"),  // billboard advertising
    UNS("1533750349088-cd871a92f312"),  // digital marketing
    UNS("1557804506-669a67965ba0"),     // marketing team brainstorm
    UNS("1432888622747-4eb9a8f2c293"),  // outdoor ads
    UNS("1460925895917-afdab827c52f"),  // creative agency
  ],
  "Printing Services": [
    UNS("1562776977-f5db5477e89c"),  // printing press
    UNS("1586717799252-bd134ad00e26"),  // print machine
    UNS("1584810179025-bef9901933a7"),  // offset printing
    UNS("1568605117036-5fe5e7bab0b7"),  // print shop
  ],
  "Photography": [
    UNS("1471341971476-ae15ff5dd4ea"),  // camera lens
    UNS("1452587925148-ce544e77e70d"),  // photographer at work
    UNS("1493863531406-2e58b68da1b2"),  // photo studio
    UNS("1542038784456-1ea8e935640e"),  // camera gear
  ],

  // ── Events & Wedding ────────────────────────────────────────────────
  "Wedding Services": [
    UNS("1519741497674-611481863552"),  // wedding ceremony
    UNS("1511285560929-80b456fea0bc"),  // bride and groom
    UNS("1464366400600-7168b8af9bc3"),  // wedding decoration flowers
    UNS("1606800052052-a08af7148866"),  // Indian wedding rituals
    UNS("1583939003579-730e3918a45a"),  // wedding hall decorated
    UNS("1522673607200-164d1b6ce486"),  // couple reception
  ],
  "Event Management": [
    UNS("1511578314322-379afb476865"),  // event stage lights
    UNS("1492684223066-81342ee5ff30"),  // concert event
    UNS("1540575467537-26b93a5a74f4"),  // corporate event
    UNS("1528495612343-dc9b507b6a4b"),  // event planning setup
  ],

  // ── Home & Appliances ────────────────────────────────────────────────
  "Home Appliances": [
    UNS("1556909114-f6e7ad7d3136"),  // modern kitchen appliances
    UNS("1558618047-3c8c76ca7d13"),  // home appliance store
    UNS("1585771724684-38269d6639fd"),  // washing machine
    UNS("1574269909626-c91d3d88ccf7"),  // electronics display
  ],
  "Furniture": [
    UNS("1555041469-a586c61ea9bc"),  // modern sofa living room
    UNS("1586023492125-27b2c045efd3"),  // furniture showroom
    UNS("1493663284031-b7e3aefcae8e"),  // bedroom furniture
    UNS("1538688525198-9b2f24dc934d"),  // wooden furniture
    UNS("1524758631624-e2822e304c36"),  // minimalist interior
  ],
  "Hardware & Tools": [
    UNS("1572981779307-38b8cabb2407"),  // tools hardware
    UNS("1504328345606-18bbc8c9d7d1"),  // workshop tools
    UNS("1581244683861-a5effd04ee90"),  // hardware store shelf
    UNS("1530124566582-a618bc2615dc"),  // construction tools
  ],
};

/** Fallback pool for businesses with no category or unknown category */
const DEFAULT_IMAGES = [
  UNS("1486406146926-c627a92ad1ab"),  // office building
  UNS("1521791136064-7986c2920216"),  // business handshake
  UNS("1507679799987-c73779587ccf"),  // corporate interior
  UNS("1454165804606-c3d57bc86b40"),  // business meeting
];

/**
 * Fast deterministic hash of a string → non-negative integer.
 * Same input always gives same output (no randomness on reload).
 */
function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return Math.abs(h);
}

/**
 * Pick one image from a category's pool based on the business's unique ID.
 * Same business → same image every time. Different businesses → different images.
 */
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

  // Try subCategory as a secondary key
  if (!pool && subCategory) {
    const key = Object.keys(CATEGORY_IMAGES).find(
      (k) => k.toLowerCase().includes(subCategory.toLowerCase()) ||
             subCategory.toLowerCase().includes(k.toLowerCase())
    );
    if (key) pool = CATEGORY_IMAGES[key];
  }

  const images = pool ?? DEFAULT_IMAGES;
  // Hash the business ID to deterministically pick an image from the pool
  return images[hashString(businessId || category) % images.length];
}

/**
 * Priority chain — always returns a string:
 * 1. coverImage  → real uploaded cover photo
 * 2. image       → real profile photo
 * 3. galleryImages[0] → first gallery photo
 * 4. imagePublicId → Cloudinary URL
 * 5. getCategoryImage → unique category stock photo per business ID
 */
function getBestImage(b: any): string {
  if (b.coverImage && b.coverImage.trim()) return b.coverImage.trim();
  if (b.image && b.image.trim()) return b.image.trim();
  if (Array.isArray(b.galleryImages) && b.galleryImages.length > 0) {
    const first = b.galleryImages[0];
    if (first?.url && first.url.trim()) return first.url.trim();
  }
  if (b.imagePublicId && b.imagePublicId.trim()) {
    return `${CLOUDINARY_BASE}${b.imagePublicId.trim()}.jpg`;
  }
  return getCategoryImage(b.category ?? "", b.subCategory ?? "", b._id ?? b.listingCode ?? b.name ?? "");
}

const DAYS_SHORT: Record<string, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thrusday: "Thu",
  Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};

function formatDays(openDays: string): string {
  if (!openDays) return "";
  return openDays.split(",").map((d) => DAYS_SHORT[d.trim()] ?? d.trim()).join(", ");
}

function formatTime(t: string): string {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const, delay: i * 0.07 },
  }),
};

/* ─── Main Page Component ─── */
function BusinessDetailPage() {
  const { id } = Route.useParams();

  const { data: business, isLoading, error } = useQuery({
    queryKey: ["business", id],
    queryFn: () => getBusinessById({ data: { id } }),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  /* ─── Loading State ─── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <div className="size-12 border-4 border-sage/30 border-t-sage rounded-full animate-spin" />
        <p className="text-text-muted animate-pulse text-sm">Loading business details…</p>
      </div>
    );
  }

  /* ─── Error State ─── */
  if (error || !business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <Building2 className="size-16 text-text-muted/30 mx-auto" strokeWidth={1} />
          <h1 className="mt-6 font-display font-bold text-2xl">Business not found</h1>
          <p className="mt-2 text-text-muted text-sm">
            {(error as Error)?.message ?? "This business listing could not be loaded."}
          </p>
          <Link
            to="/list-business"
            className="mt-6 inline-flex items-center gap-2 bg-forest text-text-light font-semibold px-6 py-3 rounded-xl hover:bg-forest-deep transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const b = business;

  // Resolve best image — always returns an image (real photo or category stock)
  const heroImage = getBestImage(b);
  // True only if the business has an actual uploaded photo from DB
  const hasDbImage = !!(b.coverImage?.trim() || b.image?.trim() ||
    (Array.isArray(b.galleryImages) && b.galleryImages.length > 0) ||
    b.imagePublicId?.trim());

  const gallery: { url: string }[] = b.galleryImages ?? [];
  const hasLocation = b.lat && b.lng && parseFloat(b.lat) !== 0 && parseFloat(b.lng) !== 0;
  const openDaysFormatted = formatDays(b.openDays ?? "");
  const hasHours = b.openTime || b.closeTime;
  const mapUrl = hasLocation
    ? `https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}`
    : b.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.address)}`
    : null;

  /* ─── Share ─── */
  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: b.name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      alert("Link copied to clipboard!");
    }
  }

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
          <div className="flex items-center gap-3">
            <button
              id="share-business-btn"
              onClick={handleShare}
              className="inline-flex items-center gap-1 text-sm font-semibold text-text-muted hover:text-foreground transition-colors"
            >
              <Share2 className="size-4" /> Share
            </button>
            <Link
              to="/list-business"
              className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-sage transition-colors"
            >
              <ArrowLeft className="size-4" /> Directory
            </Link>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-background">

        {/* ── Hero Image ── */}
        <section className="relative h-72 md:h-96 overflow-hidden bg-forest/10">
          <img
            src={heroImage}
            alt={b.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // If a Cloudinary image fails to load, fall back to category image
              e.currentTarget.src = getCategoryImage(b.category ?? "", b.subCategory ?? "", b._id ?? b.listingCode ?? b.name ?? "");
            }}
          />
          {/* Stock photo label — only show when using category fallback */}
          {!hasDbImage && (
            <div className="absolute top-4 right-4">
              <span className="bg-black/40 backdrop-blur-sm text-white/70 text-[10px] font-semibold px-2 py-1 rounded-full tracking-wide">
                📷 Illustrative photo
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

          {/* Breadcrumb on hero */}
          <div className="absolute top-6 left-6 flex items-center gap-2 text-white/80 text-xs font-semibold">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="size-3" />
            <Link to="/list-business" className="hover:text-white transition-colors">Directory</Link>
            <ChevronRight className="size-3" />
            <span className="text-white line-clamp-1 max-w-[160px]">{b.name}</span>
          </div>

          {/* Category badge on hero */}
          {(b.category || b.subCategory) && (
            <div className="absolute bottom-6 left-6 flex items-center gap-2 flex-wrap">
              {b.category && (
                <span className="bg-forest-deep/80 backdrop-blur-sm text-white text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1 rounded-full">
                  {b.category}
                </span>
              )}
              {b.subCategory && (
                <span className="bg-sage/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {b.subCategory}
                </span>
              )}
            </div>
          )}

          {/* Listing code */}
          {b.listingCode && (
            <div className="absolute bottom-6 right-6">
              <span className="bg-black/50 backdrop-blur-sm text-white/70 text-[10px] font-mono px-2 py-1 rounded-lg">
                {b.listingCode}
              </span>
            </div>
          )}
        </section>

        {/* ── Main Content ── */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

            {/* ── Left Column: Details ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Business Name & Rating */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                <h1 className="font-display font-black text-3xl md:text-4xl leading-tight text-foreground">
                  {b.name}
                </h1>

                <div className="mt-3 flex items-center gap-4 flex-wrap">
                  {/* Rating */}
                  {b.avgRating > 0 ? (
                    <span className="inline-flex items-center gap-1.5 bg-sage/10 text-sage text-sm font-semibold px-3 py-1 rounded-full">
                      <Star className="size-4 fill-sage" />
                      {b.avgRating.toFixed(1)}
                      {b.reviewCount > 0 && (
                        <span className="text-text-muted font-normal">({b.reviewCount} reviews)</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-sm text-text-muted">No reviews yet</span>
                  )}

                  {/* Location */}
                  {(b.district || b.assembly || b.city) && (
                    <span className="inline-flex items-center gap-1 text-sm text-text-muted">
                      <MapPin className="size-4 text-sage shrink-0" />
                      {[b.assembly, b.district].filter(Boolean).join(", ")}
                    </span>
                  )}

                  {/* Active badge */}
                  {b.active && (
                    <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                      <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                      Active Listing
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Description */}
              {b.description && (
                <motion.section initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                  <h2 className="font-display font-bold text-lg text-foreground mb-3">About</h2>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-sm md:text-base">
                    {b.description}
                  </p>
                </motion.section>
              )}

              {/* Business Details Grid */}
              <motion.section initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                <h2 className="font-display font-bold text-lg text-foreground mb-4">Business Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* Category */}
                  {b.category && (
                    <DetailCard icon={<Layers className="size-4 text-sage" />} label="Category">
                      <span className="font-semibold">{b.category}</span>
                      {b.subCategory && <span className="text-text-muted text-xs block">{b.subCategory}</span>}
                    </DetailCard>
                  )}

                  {/* Address */}
                  {b.address && (
                    <DetailCard icon={<MapPin className="size-4 text-sage" />} label="Address">
                      <span className="font-semibold">{b.address}</span>
                      {b.pincode && <span className="text-text-muted text-xs block">PIN: {b.pincode}</span>}
                    </DetailCard>
                  )}

                  {/* Landmark */}
                  {b.landmark && b.landmark !== b.address && (
                    <DetailCard icon={<Navigation className="size-4 text-sage" />} label="Landmark">
                      <span className="font-semibold">{b.landmark}</span>
                    </DetailCard>
                  )}

                  {/* District & Assembly */}
                  {(b.district || b.assembly) && (
                    <DetailCard icon={<MapPin className="size-4 text-sage" />} label="Location">
                      <span className="font-semibold">{[b.assembly, b.district].filter(Boolean).join(", ")}</span>
                    </DetailCard>
                  )}

                  {/* Open Days */}
                  {openDaysFormatted && (
                    <DetailCard icon={<Calendar className="size-4 text-sage" />} label="Open Days">
                      <span className="font-semibold">{openDaysFormatted}</span>
                    </DetailCard>
                  )}

                  {/* Hours */}
                  {hasHours && (
                    <DetailCard icon={<Clock className="size-4 text-sage" />} label="Hours">
                      <span className="font-semibold">
                        {formatTime(b.openTime)} – {formatTime(b.closeTime)}
                      </span>
                    </DetailCard>
                  )}

                  {/* Listing Code */}
                  {b.listingCode && (
                    <DetailCard icon={<Tag className="size-4 text-sage" />} label="Listing Code">
                      <span className="font-mono font-semibold">{b.listingCode}</span>
                    </DetailCard>
                  )}
                </div>
              </motion.section>

              {/* Gallery */}
              {gallery.length > 0 && (
                <motion.section initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                  <h2 className="font-display font-bold text-lg text-foreground mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {gallery.map((img, i) => (
                      <a
                        key={i}
                        href={img.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative aspect-square rounded-xl overflow-hidden bg-card border border-border"
                      >
                        <img
                          src={img.url}
                          alt={`${b.name} photo ${i + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <ExternalLink className="size-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </a>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Map */}
              {(hasLocation || b.address) && (
                <motion.section initial="hidden" animate="visible" variants={fadeUp} custom={4}>
                  <h2 className="font-display font-bold text-lg text-foreground mb-4">Location</h2>
                  {hasLocation ? (
                    <div className="rounded-2xl overflow-hidden border border-border h-64 md:h-80">
                      <iframe
                        title={`Map for ${b.name}`}
                        src={`https://maps.google.com/maps?q=${b.lat},${b.lng}&z=15&output=embed`}
                        className="w-full h-full border-0"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                  {mapUrl && (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sage hover:underline"
                    >
                      <Navigation className="size-4" /> Open in Google Maps
                    </a>
                  )}
                </motion.section>
              )}

            </div>

            {/* ── Right Column: Contact Card ── */}
            <div className="space-y-5">

              {/* Contact Card */}
              <motion.div
                initial="hidden" animate="visible" variants={fadeUp} custom={1}
                className="bg-card border border-border rounded-2xl p-6 shadow-lg sticky top-24"
              >
                <h2 className="font-display font-bold text-lg mb-5">Contact & Connect</h2>

                <div className="space-y-3">
                  {/* Phone 1 */}
                  {b.phone && (
                    <a
                      href={`tel:${b.phone}`}
                      id="contact-phone-primary"
                      className="flex items-center gap-3 bg-sage/10 hover:bg-sage text-sage hover:text-white rounded-xl px-4 py-3 transition-all group"
                    >
                      <Phone className="size-5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider opacity-70 group-hover:opacity-90">Primary Phone</p>
                        <p className="font-bold text-sm">{b.phone}</p>
                      </div>
                    </a>
                  )}

                  {/* Phone 2 */}
                  {b.phone2 && b.phone2 !== b.phone && (
                    <a
                      href={`tel:${b.phone2}`}
                      id="contact-phone-secondary"
                      className="flex items-center gap-3 bg-background border border-border hover:border-sage rounded-xl px-4 py-3 transition-all group"
                    >
                      <Phone className="size-5 text-sage shrink-0" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Alternate Phone</p>
                        <p className="font-bold text-sm text-foreground">{b.phone2}</p>
                      </div>
                    </a>
                  )}

                  {/* Email */}
                  {b.email && (
                    <a
                      href={`mailto:${b.email}`}
                      id="contact-email"
                      className="flex items-center gap-3 bg-background border border-border hover:border-sage rounded-xl px-4 py-3 transition-all group"
                    >
                      <Mail className="size-5 text-sage shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Email</p>
                        <p className="font-semibold text-sm text-foreground truncate">{b.email}</p>
                      </div>
                    </a>
                  )}

                  {/* Website */}
                  {b.website && (
                    <a
                      href={b.website.startsWith("http") ? b.website : `https://${b.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      id="contact-website"
                      className="flex items-center gap-3 bg-background border border-border hover:border-sage rounded-xl px-4 py-3 transition-all group"
                    >
                      <Globe className="size-5 text-sage shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Website</p>
                        <p className="font-semibold text-sm text-sage truncate">{b.website}</p>
                      </div>
                    </a>
                  )}

                  {/* Map / Directions */}
                  {mapUrl && (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      id="get-directions-btn"
                      className="flex items-center justify-center gap-2 w-full bg-forest text-text-light font-bold py-3 rounded-xl hover:bg-forest-deep transition-colors text-sm"
                    >
                      <Navigation className="size-4" /> Get Directions
                    </a>
                  )}
                </div>

                {/* Hours summary in card */}
                {hasHours && (
                  <div className="mt-5 pt-5 border-t border-border">
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Business Hours</p>
                    <p className="text-sm font-semibold text-foreground">
                      <Clock className="size-3.5 inline mr-1 text-sage" />
                      {formatTime(b.openTime)} – {formatTime(b.closeTime)}
                    </p>
                    {openDaysFormatted && (
                      <p className="mt-1 text-xs text-text-muted">{openDaysFormatted}</p>
                    )}
                  </div>
                )}

                {/* Meta info */}
                <div className="mt-5 pt-5 border-t border-border space-y-1">
                  {b.listingCode && (
                    <p className="text-xs text-text-muted">
                      Listing: <span className="font-mono text-foreground">{b.listingCode}</span>
                    </p>
                  )}
                  {b.createdAt && (
                    <p className="text-xs text-text-muted">
                      Listed:{" "}
                      <span className="text-foreground">
                        {new Date(b.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Back to directory */}
              <Link
                to="/list-business"
                className="flex items-center justify-center gap-2 w-full border border-border rounded-xl py-3 text-sm font-semibold text-foreground hover:bg-card transition-colors"
              >
                <ArrowLeft className="size-4" /> Back to Directory
              </Link>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}

/* ─── Detail Card helper ─── */
function DetailCard({
  icon, label, children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-start gap-3">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-0.5">{label}</p>
        <div className="text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}
