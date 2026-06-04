async function run() {
  try {
    const API = "https://vanigan-app-automation-5il0.onrender.com";
    console.log("Fetching unique categories and subcategories from production API...");
    
    // We can fetch in pages of 1000 to be safe
    const catToSub = {};
    const limit = 1000;
    
    for (let page = 1; page <= 5; page++) {
      console.log(`Fetching page ${page}...`);
      const resp = await fetch(`${API}/api/public/businesses?page=${page}&limit=${limit}`);
      if (!resp.ok) {
        console.error(`Error on page ${page}: ${resp.status}`);
        break;
      }
      const data = await resp.json();
      const businesses = data.businesses || data || [];
      if (businesses.length === 0) break;
      
      businesses.forEach(b => {
        const cat = b.category || b.cat;
        const sub = b.subCategory || b.subcat || b.sub_category;
        
        if (cat && cat.trim()) {
          const category = cat.trim();
          if (!catToSub[category]) {
            catToSub[category] = new Set();
          }
          if (sub && sub.trim()) {
            catToSub[category].add(sub.trim());
          }
        }
      });
    }
    
    const result = {};
    Object.keys(catToSub).sort().forEach(cat => {
      result[cat] = Array.from(catToSub[cat]).sort();
    });
    
    console.log("FULL_SUBCATEGORIES_START");
    console.log(JSON.stringify(result, null, 2));
    console.log("FULL_SUBCATEGORIES_END");
    
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
