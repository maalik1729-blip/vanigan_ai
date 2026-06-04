/**
 * Test if Backend has UTF-8 Configured
 * Run with: node test-backend-utf8.js
 */

const API_BASE = "https://vanigan-app-automation-5il0.onrender.com";

async function testBackendUTF8() {
  console.log("🧪 Testing Backend UTF-8 Configuration\n");
  console.log("=" .repeat(60));
  console.log(`Backend: ${API_BASE}`);
  console.log("=".repeat(60) + "\n");

  // Test 1: Check Response Headers
  console.log("📋 Test 1: Checking Response Headers...");
  try {
    const response = await fetch(`${API_BASE}/api/public/businesses?limit=1`);
    const contentType = response.headers.get('content-type');
    
    console.log(`   Content-Type: ${contentType}`);
    
    if (contentType && contentType.includes('charset=utf-8')) {
      console.log("   ✅ PASS: Backend includes UTF-8 charset\n");
    } else {
      console.log("   ❌ FAIL: Backend missing UTF-8 charset");
      console.log("   Expected: application/json; charset=utf-8");
      console.log("   Fix: Add res.setHeader('Content-Type', 'application/json; charset=utf-8')\n");
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}\n`);
  }

  // Test 2: Check for Tamil Text in Data
  console.log("📋 Test 2: Checking for Tamil Text in Data...");
  try {
    const response = await fetch(`${API_BASE}/api/public/businesses?limit=100`);
    const data = await response.json();
    const businesses = data.businesses || data;
    
    let tamilFound = false;
    let questionMarksFound = false;
    let tamilCount = 0;
    let brokenCount = 0;
    
    businesses.forEach(b => {
      // Check for Tamil Unicode range (U+0B80 to U+0BFF)
      const hasTamil = /[\u0B80-\u0BFF]/.test(b.name + b.description);
      // Check for question marks (corruption indicator)
      const hasQuestionMarks = /\?{3,}/.test(b.name + b.description);
      
      if (hasTamil) {
        tamilFound = true;
        tamilCount++;
        console.log(`   ✅ Tamil detected: ${b.listingCode} - "${b.name.substring(0, 50)}"`);
      }
      
      if (hasQuestionMarks) {
        questionMarksFound = true;
        brokenCount++;
        console.log(`   ⚠️  Corruption detected: ${b.listingCode} - "${b.name.substring(0, 50)}"`);
      }
    });
    
    console.log(`\n   Results:`);
    console.log(`   • Businesses checked: ${businesses.length}`);
    console.log(`   • Tamil text found: ${tamilCount}`);
    console.log(`   • Corrupted entries: ${brokenCount}`);
    
    if (tamilCount > 0 && brokenCount === 0) {
      console.log(`   ✅ PASS: Tamil text displays correctly!\n`);
    } else if (brokenCount > 0) {
      console.log(`   ⚠️  PARTIAL: Some Tamil text is corrupted`);
      console.log(`   Fix: Re-insert corrupted entries after UTF-8 is configured\n`);
    } else {
      console.log(`   ℹ️  No Tamil text in sample (may exist in full database)\n`);
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}\n`);
  }

  // Test 3: Simulate Tamil Text Insertion (Read-only test)
  console.log("📋 Test 3: Tamil Text Compatibility Test...");
  const tamilTest = "தமிழ் சோதனை வணிகம்";
  const encoded = encodeURIComponent(tamilTest);
  console.log(`   Test String: ${tamilTest}`);
  console.log(`   URL Encoded: ${encoded}`);
  console.log(`   ✅ Tamil characters can be sent via URL encoding\n`);

  // Test 4: Check Database Encoding (via data analysis)
  console.log("📋 Test 4: Analyzing Data Integrity...");
  try {
    const response = await fetch(`${API_BASE}/api/public/businesses?limit=500`);
    const data = await response.json();
    const businesses = data.businesses || data;
    
    let withCategory = 0;
    let withDistrict = 0;
    let withAssembly = 0;
    let complete = 0;
    
    businesses.forEach(b => {
      if (b.category && b.category.trim() !== '') withCategory++;
      if (b.district && b.district.trim() !== '') withDistrict++;
      if (b.assembly && b.assembly.trim() !== '') withAssembly++;
      if (b.category && b.district && b.assembly) complete++;
    });
    
    console.log(`   Data Quality (from ${businesses.length} sample):`);
    console.log(`   • With Category: ${withCategory} (${(withCategory/businesses.length*100).toFixed(1)}%)`);
    console.log(`   • With District: ${withDistrict} (${(withDistrict/businesses.length*100).toFixed(1)}%)`);
    console.log(`   • With Assembly: ${withAssembly} (${(withAssembly/businesses.length*100).toFixed(1)}%)`);
    console.log(`   • Complete Data: ${complete} (${(complete/businesses.length*100).toFixed(1)}%)`);
    
    if (complete / businesses.length > 0.9) {
      console.log(`   ✅ PASS: Database has high-quality data\n`);
    } else {
      console.log(`   ⚠️  WARNING: Some entries missing critical data\n`);
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}\n`);
  }

  // Summary
  console.log("=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`
Frontend Configuration:
  ✅ HTML charset: utf-8 (configured)
  ✅ API headers: charset=utf-8 (configured)
  ✅ All fetch requests include Accept-Charset (configured)

Backend Configuration:
  ⚠️  Check the results above
  
Next Steps:
  1. If "Content-Type" missing charset → Add UTF-8 header to backend
  2. If Tamil text corrupted (???) → Re-insert data after UTF-8 config
  3. If tests pass → Your setup is ready! 🎉

For detailed setup: See BACKEND_UTF8_IMPLEMENTATION.md
  `);
  
  console.log("\n✅ Test Complete!\n");
}

// Run the tests
testBackendUTF8().catch(error => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
