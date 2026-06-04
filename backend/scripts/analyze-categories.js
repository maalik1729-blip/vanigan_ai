/**
 * Analyze all business categories and their image mappings
 */

const API_BASE = "https://vanigan-app-automation-5il0.onrender.com";

async function analyzeCategories() {
  console.log("🔍 Analyzing Business Categories and Images...\n");

  const categories = new Map();
  const subCategories = new Map();
  let page = 1;
  const limit = 100;

  // Fetch businesses to collect categories
  while (page <= 50) { // Sample first 5000 businesses
    try {
      const response = await fetch(`${API_BASE}/api/public/businesses?page=${page}&limit=${limit}`);
      const data = await response.json();
      const businesses = data.businesses || [];

      if (businesses.length === 0) break;

      businesses.forEach(b => {
        if (b.category && b.category.trim()) {
          categories.set(b.category, (categories.get(b.category) || 0) + 1);
        }
        if (b.subCategory && b.subCategory.trim()) {
          subCategories.set(b.subCategory, (subCategories.get(b.subCategory) || 0) + 1);
        }
      });

      page++;
      if (page % 10 === 0) {
        process.stdout.write(`\r📊 Processed ${page * limit} businesses...`);
      }
    } catch (error) {
      console.error(`\nError on page ${page}:`, error.message);
      break;
    }
  }

  console.log(`\n\n${"=".repeat(60)}`);
  console.log("📊 CATEGORY ANALYSIS");
  console.log("=".repeat(60));

  // Sort categories by count
  const sortedCategories = [...categories.entries()]
    .sort((a, b) => b[1] - a[1]);

  console.log(`\nFound ${sortedCategories.length} unique categories:\n`);
  
  sortedCategories.forEach(([cat, count]) => {
    console.log(`  ${count.toString().padStart(5)} - ${cat}`);
  });

  console.log(`\n\n${"=".repeat(60)}`);
  console.log("📊 TOP SUB-CATEGORIES");
  console.log("=".repeat(60));

  const sortedSubCategories = [...subCategories.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30);

  console.log(`\nTop 30 sub-categories:\n`);
  
  sortedSubCategories.forEach(([subCat, count]) => {
    console.log(`  ${count.toString().padStart(5)} - ${subCat}`);
  });

  // Check which categories have image mappings
  const MAPPED_CATEGORIES = [
    "Hotels & Restaurants",
    "Caterers",
    "Daily Needs",
    "Organic Products",
    "Doctors",
    "Hospitals & Clinics",
    "Pharmacy",
    "Spa & Beauty",
    "Education",
    "Coaching Centers",
    "IT & Software",
    "Electricals & Electronics",
    "Construction Materials",
    "Civil Contractors",
    "Real Estate",
    "Interior Design",
    "Transport",
    "Automobiles",
    "Textiles & Garments",
    "Jewellery",
    "Footwear",
    "Agriculture",
    "Nursery & Plants",
    "B2B Services",
    "Finance & Banking",
    "Legal Services",
    "Advertising",
    "Printing Services",
    "Photography",
    "Wedding Services",
    "Event Management",
    "Home Appliances",
    "Furniture",
    "Hardware & Tools"
  ];

  console.log(`\n\n${"=".repeat(60)}`);
  console.log("🖼️  IMAGE MAPPING STATUS");
  console.log("=".repeat(60));

  const unmappedCategories = sortedCategories.filter(
    ([cat]) => !MAPPED_CATEGORIES.includes(cat)
  );

  const mappedButNotUsed = MAPPED_CATEGORIES.filter(
    cat => !categories.has(cat)
  );

  console.log(`\n✅ Categories with images: ${sortedCategories.length - unmappedCategories.length}`);
  console.log(`❌ Categories without images: ${unmappedCategories.length}`);
  console.log(`⚠️  Mapped but unused: ${mappedButNotUsed.length}`);

  if (unmappedCategories.length > 0) {
    console.log(`\n❌ Categories MISSING image mappings:\n`);
    unmappedCategories.forEach(([cat, count]) => {
      console.log(`  ${count.toString().padStart(5)} businesses - "${cat}"`);
    });
  }

  if (mappedButNotUsed.length > 0) {
    console.log(`\n⚠️  Mapped categories NOT found in database:\n`);
    mappedButNotUsed.forEach(cat => {
      console.log(`  - "${cat}"`);
    });
  }

  console.log(`\n✅ Done!\n`);
}

analyzeCategories().catch(error => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
