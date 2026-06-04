async function run() {
  try {
    const res = await fetch("https://vanigan-app-automation-5il0.onrender.com/api/public/businesses?limit=12");
    if (!res.ok) throw new Error("status " + res.status);
    const data = await res.json();
    const businesses = data.businesses || data;
    console.log(`Fetched ${businesses.length} businesses from production API:`);
    for (let i = 0; i < Math.min(5, businesses.length); i++) {
      const b = businesses[i];
      console.log(`Index ${i}:`);
      console.log(`  Name: ${b.name}`);
      console.log(`  img: ${b.img ? b.img.slice(0, 60) + '...' : 'null'}`);
      console.log(`  image: ${b.image ? b.image.slice(0, 60) + '...' : 'null'}`);
      console.log(`  imageUrl: ${b.imageUrl ? b.imageUrl.slice(0, 60) + '...' : 'null'}`);
    }
  } catch (err) {
    console.error(err);
  }
}

run();
