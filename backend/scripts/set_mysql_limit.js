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
    console.log("Setting MySQL GLOBAL max_allowed_packet to 64MB (67108864)...");
    
    // Set global packet size
    await connection.query("SET GLOBAL max_allowed_packet = 67108864");
    console.log("GLOBAL max_allowed_packet updated successfully!");
    
    // Verify the setting
    const [rows] = await connection.query("SHOW VARIABLES LIKE 'max_allowed_packet'");
    console.log("Verification results:", rows);

  } catch (err) {
    console.error("Failed to update MySQL packet limit:", err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

run();
