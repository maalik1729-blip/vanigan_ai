import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "", // Default XAMPP has no password
  database: "vanigan",
  port: 3306,
};

async function run() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query(`
      SELECT DISTINCT category, subCategory 
      FROM businesses 
      WHERE category IS NOT NULL AND category != ''
      ORDER BY category, subCategory
    `);
    
    // Group by category
    const catToSub = {};
    rows.forEach(r => {
      const cat = r.category.trim();
      const sub = r.subCategory ? r.subCategory.trim() : null;
      if (!catToSub[cat]) {
        catToSub[cat] = [];
      }
      if (sub && !catToSub[cat].includes(sub)) {
        catToSub[cat].push(sub);
      }
    });

    console.log("DB_SUBCATEGORIES_START");
    console.log(JSON.stringify(catToSub, null, 2));
    console.log("DB_SUBCATEGORIES_END");

  } catch (err) {
    console.error("Error querying DB:", err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

run();
