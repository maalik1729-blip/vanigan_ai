/**
 * Deep analysis script for business listings
 * Analyzes dummy/test entries and image issues
 * Run: node backend/scripts/analyze_businesses.js
 */

import "dotenv/config";
import { readFileSync, writeFileSync } from "fs";

const API_BASE = "https://vanigan-app-automation-5il0.onrender.com";

// Unsplash category-to-keyword mapping for relevant images
const CATEGORY_UNSPLASH = {
  "Hotels & Restaurants":        "restaurant food",
  "Electricals & Electronics":   "electronics shop",
  "Transport":                   "transport taxi",
  "Organic Products":            "organic food",
  "Education":                   "education classroom",
  "IT & Software":               "technology software",
  "Doctors":                     "medical clinic",
  "Real Estate":                 "real estate house",
  "Wedding Services":            "wedding decoration",
  "Construction Materials":      "construction materials",
  "Textiles & Garments":         "textile garment shop",
  "Agriculture":                 "agriculture farm",
  "Spa & Beauty":                "beauty salon spa",
  "Printing Services":           "printing shop",
  "Advertising":                 "advertising agency",
  "Daily Needs":                 "grocery store",
  "Caterers":                    "catering food",
  "B2B Services":                "business meeting",
  "Civil Contractors":           "construction building",
  "":                            "business shop",
};

function getUnsplashUrl(category, name) {
  const keyword = CATEGORY_UNSPLASH[category] || "business shop";
  // Use a deterministic hash from the name so the same business always gets the same image
  const seed = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 1000;
  return `https://source.unsplash.com/400x300/?${encodeURIComponent(keyword)}&sig=${seed}`;
}

// Dummy/test detection patterns
const DUMMY_PATTERNS = [
  // Gibberish names
  /^[0-9]{7,}$/,               // Pure phone number as name
  /^[klmnd]+$/i,               // Repeated consonants
  /gjgjg|hjhj|jgjg|lkjl/i,    // Keyboard mashing
  /^(test|dummy|asdf|qwerty|abc|xyz)/i,
  // Names that are just phone numbers
  /^07[0-9]{9,}/,
  /^[0-9]{10}$/,
];

const DUMMY_DESCRIPTIONS = [
  /^[klmnd]{5,}$/i,
  /gjgjg|hjhj|jgjgjg|ljljlj/i,
  /^(test|testing|dummy|sample|asdf|qwerty|kkkkk)/i,
  /^[a-z]{1,3}repeated/i,
  /fffffffffff|kkkkkkkkkkk|jjjjjjjj|lllllllll/i,
];

function isDummy(b) {
  const reasons = [];

  // Name is a phone number pattern or gibberish
  if (DUMMY_PATTERNS.some(r => r.test(b.name))) reasons.push("name_is_gibberish_or_phone");

  // Description is gibberish
  if (b.description && DUMMY_DESCRIPTIONS.some(r => r.test(b.description))) {
    reasons.push("description_is_gibberish");
  }

  // Phone number looks like test data (all same digit, or obvious test)
  if (b.phone && /^(\d)\1{9,}$/.test(b.phone)) reasons.push("phone_is_test_number");
  if (b.phone2 && /^(\d)\1{9,}$/.test(b.phone2)) reasons.push("phone2_is_test_number");

  // Email is gibberish
  if (b.email && /^[klmndfjg]{5,}$|^[0-9]{5,}$/.test(b.email.split("@")[0])) {
    reasons.push("email_is_gibberish");
  }

  // Category is empty and name/description are short or numbers
  if (!b.category && b.name.length < 20 && /[0-9]/.test(b.name)) {
    reasons.push("no_category_numeric_name");
  }

  // Wrong category (e.g., car dealer listed as "Doctors")
  if (b.category === "Doctors" && b.description && 
      /cars|bikes|vehicles|used cars/i.test(b.description)) {
    reasons.push("wrong_category");
  }

  return reasons;
}

async function fetchAllBusinesses() {
  const all = [];
  let page = 1;
  const limit = 100;

  while (true) {
    const resp = await fetch(`${API_BASE}/api/public/businesses?limit=${limit}&page=${page}`);
    if (!resp.ok) break;
    const data = await resp.json();
    const businesses = data.businesses || [];
    all.push(...businesses);
    if (businesses.length < limit) break;
    page++;
    if (page > 30) break; // safety cap
  }

  return all;
}

async function main() {
  console.log("🔍 Fetching all businesses from API...");
  const businesses = await fetchAllBusinesses();
  console.log(`✅ Fetched ${businesses.length} businesses total\n`);

  const dummyEntries = [];
  const noImageEntries = [];
  const hasImage = [];
  const imageUrls = new Map(); // url -> [business names]

  for (const b of businesses) {
    const dummyReasons = isDummy(b);
    if (dummyReasons.length > 0) {
      dummyEntries.push({ ...b, _dummyReasons: dummyReasons });
    }

    const imgUrl = b.image || (b.galleryImages?.[0]?.url) || "";
    if (!imgUrl) {
      noImageEntries.push({
        _id: b._id,
        listingCode: b.listingCode,
        name: b.name,
        category: b.category,
        district: b.district,
        isDummy: dummyReasons.length > 0,
        suggestedImage: getUnsplashUrl(b.category, b.name),
      });
    } else {
      hasImage.push(b);
      if (!imageUrls.has(imgUrl)) imageUrls.set(imgUrl, []);
      imageUrls.get(imgUrl).push({ _id: b._id, name: b.name, listingCode: b.listingCode });
    }
  }

  // Find repeated/duplicate images
  const repeatedImages = [];
  for (const [url, entries] of imageUrls.entries()) {
    if (entries.length > 1) {
      repeatedImages.push({
        imageUrl: url,
        usedBy: entries,
        count: entries.length,
      });
    }
  }

  // Build report
  const report = {
    summary: {
      total: businesses.length,
      dummyCount: dummyEntries.length,
      dummyPercent: ((dummyEntries.length / businesses.length) * 100).toFixed(1) + "%",
      noImageCount: noImageEntries.length,
      noImagePercent: ((noImageEntries.length / businesses.length) * 100).toFixed(1) + "%",
      hasImageCount: hasImage.length,
      repeatedImageGroups: repeatedImages.length,
      totalWithRepeatedImages: repeatedImages.reduce((s, r) => s + r.count, 0),
    },
    dummyEntries: dummyEntries.map(b => ({
      _id: b._id,
      listingCode: b.listingCode,
      name: b.name,
      category: b.category,
      district: b.district,
      phone: b.phone,
      description: b.description?.slice(0, 80),
      reasons: b._dummyReasons,
    })),
    noImageBusinesses: noImageEntries,
    repeatedImages,
  };

  // Print summary
  console.log("═══════════════════════════════════════════════════════");
  console.log("📊 BUSINESS LISTING DEEP ANALYSIS REPORT");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`Total businesses:          ${report.summary.total}`);
  console.log(`🚨 Dummy/test entries:     ${report.summary.dummyCount} (${report.summary.dummyPercent})`);
  console.log(`🖼️  No image:              ${report.summary.noImageCount} (${report.summary.noImagePercent})`);
  console.log(`✅ Has image:              ${report.summary.hasImageCount}`);
  console.log(`🔁 Repeated image groups:  ${report.summary.repeatedImageGroups}`);
  console.log(`   Businesses with dupes:  ${report.summary.totalWithRepeatedImages}`);
  console.log("═══════════════════════════════════════════════════════\n");

  console.log("🚨 TOP DUMMY/TEST ENTRIES:");
  for (const d of report.dummyEntries.slice(0, 20)) {
    console.log(`  [${d.listingCode}] "${d.name}" → ${d.reasons.join(", ")}`);
  }

  console.log(`\n🔁 REPEATED IMAGES (top 10):`);
  for (const r of report.repeatedImages.slice(0, 10)) {
    console.log(`  URL: ${r.imageUrl.slice(0, 80)}...`);
    console.log(`  Used by ${r.count} businesses: ${r.usedBy.map(b => b.listingCode).join(", ")}`);
  }

  // Save full report as JSON
  const outPath = "backend/scripts/business_analysis_report.json";
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`\n✅ Full report saved to: ${outPath}`);
}

main().catch(console.error);
