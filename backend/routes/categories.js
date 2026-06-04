import { Router } from "express";
import { API_BASE_URL } from "../db.js";

const router = Router();

// Helper: proxy a GET request to external API
async function proxyGet(path, res) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json; charset=utf-8",
      },
    });
    if (!response.ok) return res.status(response.status).json({ error: "Upstream error" });
    return res.json(await response.json());
  } catch (err) {
    console.error(`Proxy error for ${path}:`, err.message);
    return res.status(500).json({ error: err.message });
  }
}

// GET /api/categories
router.get("/categories", (req, res) => proxyGet("/api/categories", res));

// GET /api/districts
router.get("/districts", (req, res) => proxyGet("/api/districts", res));

// GET /api/assemblies
router.get("/assemblies", (req, res) => proxyGet("/api/assemblies", res));

export default router;
