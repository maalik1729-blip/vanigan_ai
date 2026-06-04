import mysql from "mysql2/promise";
import "dotenv/config";

// ─── DB Config (reads from backend/.env) ─────────────────────────────────────
export const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "vanigan",
  port: parseInt(process.env.DB_PORT || "3306", 10),
};

export const API_BASE_URL =
  process.env.VITE_API_BASE_URL ||
  "https://vanigan-app-automation-5il0.onrender.com";

// ─── Helper: get a connection ─────────────────────────────────────────────────
export async function getConnection() {
  return mysql.createConnection(dbConfig);
}
