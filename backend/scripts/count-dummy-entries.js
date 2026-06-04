/**
 * Script to Count ACTUAL Dummy Entries in Database
 * Run with: node count-dummy-entries.js
 */

const API_BASE = "https://vanigan-app-automation-5il0.onrender.com";

async function countDummyEntries() {
  console.log("🔍 Analyzing all businesses in database...\n");

  let page = 1;
  const limit = 60; // API max limit
  let totalChecked = 0;
  let totalInDatabase = 0;
  let hasMore = true;

  // Counters
  const stats = {
    total: 0,
    noCategory: 0,
    noCategoryList: [],
    invalidPhone: 0,
    invalidEmail: 0,
    repeatedChars: 0,
    numberOnlyName: 0,
    missingLocation: 0,
    confirmedDummy: [],
  };

  while (hasMore) {
    try {
      const url = `${API_BASE}/api/public/businesses?page=${page}&limit=${limit}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`❌ API Error: ${response.status}`);
        break;
      }

      const data = await response.json();
      const businesses = data.businesses || data;

      // Get total from API on first page
      if (page === 1 && data.total) {
        totalInDatabase = data.total;
        const totalPages = Math.ceil(totalInDatabase / limit);
        console.log(`📊 Total businesses in database: ${totalInDatabase}`);
        console.log(`📄 Total pages to fetch: ${totalPages}`);
        console.log(`⏱️  Estimated time: ${Math.ceil(totalPages * 0.3)} seconds\n`);
      }

      if (!businesses || !Array.isArray(businesses) || businesses.length === 0) {
        hasMore = false;
        break;
      }

      // Analyze each business
      businesses.forEach((b) => {
        stats.total++;

        // Check 1: No category (strongest dummy indicator)
        if (!b.category || b.category.trim() === "") {
          stats.noCategory++;
          stats.noCategoryList.push({
            code: b.listingCode,
            name: b.name,
            created: b.createdAt,
          });
        }

        // Check 2: Invalid phone
        if (b.phone && !/^[0-9]{10,}$/.test(b.phone.replace(/\s/g, ""))) {
          stats.invalidPhone++;
        }

        // Check 3: Invalid email
        if (b.email && !b.email.includes("@")) {
          stats.invalidEmail++;
        }

        // Check 4: Repeated characters in description
        if (b.description && /^(.)\1{5,}$/.test(b.description)) {
          stats.repeatedChars++;
        }

        // Check 5: Name is only numbers
        if (b.name && /^[0-9]+$/.test(b.name)) {
          stats.numberOnlyName++;
        }

        // Check 6: Missing critical location data
        if (!b.district || !b.assembly) {
          stats.missingLocation++;
        }

        // Confirmed dummy pattern (matches all dummy criteria)
        if (
          (!b.category || b.category.trim() === "") &&
          (
            (b.description && /^(.)\1{5,}$/.test(b.description)) ||
            (b.name && /^[0-9]+$/.test(b.name)) ||
            (b.phone && !/^[0-9]{10}$/.test(b.phone))
          )
        ) {
          stats.confirmedDummy.push({
            code: b.listingCode,
            name: b.name,
            desc: b.description?.substring(0, 30),
            phone: b.phone,
          });
        }
      });

      totalChecked += businesses.length;
      
      // Progress indicator
      const percentage = totalInDatabase > 0 ? ((totalChecked / totalInDatabase) * 100).toFixed(1) : '?';
      process.stdout.write(`\r📊 Progress: ${totalChecked} / ${totalInDatabase} (${percentage}%) - Page ${page}...`);

      page++;

      // Check if we got fewer results than limit (last page)
      if (businesses.length < limit) {
        hasMore = false;
      }

      // Check if we've reached the total from API
      if (data.total && totalChecked >= data.total) {
        hasMore = false;
      }

      // Small delay to avoid overwhelming the API
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`\n❌ Error on page ${page}:`, error.message);
      break;
    }
  }

  // Print results
  console.log("\n\n" + "=".repeat(60));
  console.log("📊 ANALYSIS COMPLETE");
  console.log("=".repeat(60));
  console.log(`\n✅ Total Businesses Analyzed: ${stats.total}`);
  console.log(`\n🔍 FINDINGS:`);
  console.log(`   • No Category: ${stats.noCategory} (${((stats.noCategory / stats.total) * 100).toFixed(1)}%)`);
  console.log(`   • Invalid Phone: ${stats.invalidPhone} (${((stats.invalidPhone / stats.total) * 100).toFixed(1)}%)`);
  console.log(`   • Invalid Email: ${stats.invalidEmail} (${((stats.invalidEmail / stats.total) * 100).toFixed(1)}%)`);
  console.log(`   • Repeated Chars: ${stats.repeatedChars}`);
  console.log(`   • Number-Only Name: ${stats.numberOnlyName}`);
  console.log(`   • Missing Location: ${stats.missingLocation} (${((stats.missingLocation / stats.total) * 100).toFixed(1)}%)`);
  
  console.log(`\n🚨 CONFIRMED DUMMY ENTRIES: ${stats.confirmedDummy.length}`);
  
  if (stats.confirmedDummy.length > 0) {
    console.log(`\nList of confirmed dummy entries:`);
    stats.confirmedDummy.forEach((d) => {
      console.log(`   • ${d.code}: "${d.name}" - ${d.desc}...`);
    });
  }

  console.log(`\n⚠️  ENTRIES WITH NO CATEGORY: ${stats.noCategory}`);
  if (stats.noCategoryList.length > 0 && stats.noCategoryList.length <= 20) {
    console.log(`\nFirst ${Math.min(20, stats.noCategoryList.length)} entries with no category:`);
    stats.noCategoryList.slice(0, 20).forEach((e) => {
      console.log(`   • ${e.code}: "${e.name}"`);
    });
  } else if (stats.noCategoryList.length > 20) {
    console.log(`\nShowing first 20 of ${stats.noCategoryList.length} entries with no category:`);
    stats.noCategoryList.slice(0, 20).forEach((e) => {
      console.log(`   • ${e.code}: "${e.name}"`);
    });
    console.log(`   ... and ${stats.noCategoryList.length - 20} more`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("💡 RECOMMENDATION:");
  console.log("=".repeat(60));
  console.log(`\n1. Delete ${stats.confirmedDummy.length} confirmed dummy entries`);
  console.log(`2. Review ${stats.noCategory} entries with no category`);
  console.log(`3. Fix ${stats.invalidPhone} entries with invalid phone numbers`);
  console.log(`4. Consider hiding entries with no category from public view`);
  console.log("\n✅ Done!\n");

  return stats;
}

// Run the analysis
countDummyEntries().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
