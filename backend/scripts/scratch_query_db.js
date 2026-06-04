import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "vanigan",
  port: 3306,
};

async function run() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT id, name, SUBSTRING(img, 1, 100) as img, SUBSTRING(image, 1, 100) as image, SUBSTRING(imageUrl, 1, 100) as imageUrl FROM businesses ORDER BY created_at DESC LIMIT 5");
    for (const r of rows) {
      console.log(`Name: ${r.name}`);
      console.log(`  img: ${r.img ? r.img.slice(0, 40) + '...' : 'null'}`);
      console.log(`  image: ${r.image ? r.image.slice(0, 40) + '...' : 'null'}`);
      console.log(`  imageUrl: ${r.imageUrl ? r.imageUrl.slice(0, 40) + '...' : 'null'}`);
    }
    await connection.end();
  } catch (err) {
    console.error(err);
  }
}

run();
