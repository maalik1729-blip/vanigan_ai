/**
 * Analyze Category Image Mappings
 * Checks which categories have images and which don't
 */

const API_BASE = "https://vanigan-app-automation-5il0.onrender.com";

// Current category mappings from list-business.tsx
const CURRENT_MAPPINGS = {
  "Hotels & Restaurants": true,
  "Caterers": true,
  "Daily Needs": true,
  "Organic Products": true,
  "Doctors": true,
  "Hospitals & Clinics": true,
  "Pharmacy": true,
  "Spa & Beauty": true,
  "Education": true,
  "Coaching Centers": true,
  "IT & Software": true,
  "Electricals & Electronics": true,
  "Construction Materials": true,
  "Civil Contractors": true,
  "Real Estate": true,
  "Interior Design": true,
  "Transport": true,
  "Automobiles": true,
  "Textiles & Garments": true,
  "Jewellery": true,
  "Footwear": true,
  "Agriculture": true,
  "Nursery & Plants": true,
  "B2B Services": true,
  "Finance & Banking": true,
  "Legal Services": true,
  "Advertising": true,
  "Printing Services": true,
  "Photography": true,
  "Wedding Services": true,
  "Event Management": true,
  "Home Appliances": true,
  "Furniture": true,
  "Hardware & Tools": true,
};

async function analyzeCategories() {
  console.log("🔍 Analyzing Category Image Mappings\n");
  console.log("=".repeat(70));

  try {
    // Fetch businesses
    const response = await fetch(`${API_BASE}/api/public/businesses?limit=500`);
    const data = await response.json();
    const businesses = data.businesses || data;

    // Analyze categories
    const categoryStats = new Map();
    
    businesses.forEach(b => {
      const cat = b.category || "NO CATEGORY";
      if (!categoryStats.has(cat)) {
        categoryStats.set(cat, {
          count: 0,
          hasMapped: CURRENT_MAPPINGS[cat] || false,
          examples: []
        });
      }
      const stats = categoryStats.get(cat);
      stats.count++;
      if (stats.examples.length < 3) {
        stats.examples.push(b.name);
      }
    });

    // Sort by count
    const sorted = [...categoryStats.entries()]
      .sort((a, b) => b[1].count - a[1].count);

    console.log("\n📊 CATEGORY ANALYSIS\n");
    console.log("=".repeat(70));

    const withMapping = [];
    const withoutMapping = [];

    sorted.forEach(([cat, stats]) => {
      if (stats.hasMapped) {
        withMapping.push({ cat, ...stats });
      } else {
        withoutMapping.push({ cat, ...stats });
      }
    });

    console.log(`\n✅ Categories WITH Image Mapping: ${withMapping.length}\n`);
    withMapping.forEach(({ cat, count }) => {
      console.log(`   • ${cat}: ${count} businesses`);
    });

    console.log(`\n❌ Categories WITHOUT Image Mapping: ${withoutMapping.length}\n`);
    withoutMapping.forEach(({ cat, count, examples }) => {
      console.log(`   • ${cat}: ${count} businesses`);
      console.log(`     Examples: ${examples.slice(0, 2).join(", ")}`);
    });

    // Recommendations
    console.log("\n" + "=".repeat(70));
    console.log("💡 RECOMMENDATIONS");
    console.log("=".repeat(70));

    if (withoutMapping.length === 0) {
      console.log("\n✅ All categories have image mappings!");
    } else {
      console.log("\nCategories needing image mappings:");
      withoutMapping.forEach(({ cat, count }) => {
        if (cat !== "NO CATEGORY") {
          console.log(`   • "${cat}" (${count} businesses)`);
        }
      });
    }

    // Check for close matches (fuzzy matching)
    console.log("\n📝 Potential Mapping Issues (fuzzy matches):\n");
    sorted.forEach(([cat, stats]) => {
      if (!stats.hasMapped && cat !== "NO CATEGORY") {
        // Check for close matches
        const closeMatches = Object.keys(CURRENT_MAPPINGS).filter(mapped => {
          const catLower = cat.toLowerCase();
          const mappedLower = mapped.toLowerCase();
          return catLower.includes(mappedLower) || mappedLower.includes(catLower);
        });
        
        if (closeMatches.length > 0) {
          console.log(`   ⚠️  "${cat}" might match: ${closeMatches.join(", ")}`);
        }
      }
    });

    console.log("\n" + "=".repeat(70));
    console.log("\n✅ Analysis Complete!\n");

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

analyzeCategories();
