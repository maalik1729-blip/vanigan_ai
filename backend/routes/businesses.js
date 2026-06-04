import { Router } from "express";
import { getConnection, API_BASE_URL } from "../db.js";

// ─── Dummy / Test Entry Detection ─────────────────────────────────────────────
const DUMMY_NAME_PATTERNS = [
  /^[0-9]{7,}$/,                // Pure phone number as name
  /^07[0-9]{8,}/,               // Starts with 07 followed by 9+ digits
  /^[0-9]{10}$/,                // Exactly 10-digit number
  /^[klmnd]{5,}$/i,             // Keyboard-mash consonants
  /^(test|dummy|asdf|qwerty)/i, // Obvious test prefixes
];

const DUMMY_DESC_PATTERNS = [
  /([a-z])\1{6,}/i,             // Same letter repeated 7+ times (kkkkkkk, fffffffffff)
  /gjgjg|hjhj|jgjgjg|ljljlj/i, // Keyboard mashing patterns
  /^(test|testing|dummy)/i,
  /dfsfssfsg|dfffffffff/i,      // Specific mash patterns found in data
];

function isDummyEntry(b) {
  // Name is a numeric phone number / gibberish
  if (DUMMY_NAME_PATTERNS.some(r => r.test((b.name || "").trim()))) return true;

  // Description is pure gibberish (repeated chars / keyboard mash)
  if (b.description && DUMMY_DESC_PATTERNS.some(r => r.test(b.description.trim()))) return true;

  // Phone number is all-same digit (2222222222, 0000000000, 4545454545)
  if (b.phone && /^(\d)\1{9,}$/.test(b.phone)) return true;
  if (b.phone2 && /^(\d)\1{9,}$/.test(b.phone2)) return true;

  // Has no category AND name is short + numeric
  if (!b.category && (b.name || "").length < 20 && /[0-9]/.test(b.name || "")) return true;

  // Email is obvious gibberish (all consonants or all numbers)
  if (b.email) {
    const localPart = b.email.split("@")[0] || "";
    if (/^[klmndfjg]{5,}$/.test(localPart) || /^[0-9]{5,}$/.test(localPart)) return true;
  }

  return false;
}

const router = Router();

// ─── GET /api/businesses ──────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { page = "1", limit = "12", search = "", category = "", district = "", assembly = "", subCategory = "" } = req.query;

    // 1. Fetch from local MySQL
    let localBusinesses = [];
    let localTotal = 0;
    try {
      const connection = await getConnection();

      let query = "SELECT * FROM businesses WHERE 1=1";
      const values = [];

      if (search) {
        query += " AND (name LIKE ? OR description LIKE ? OR city LIKE ? OR address LIKE ?)";
        const s = `%${search}%`;
        values.push(s, s, s, s);
      }
      if (category) { query += " AND category = ?"; values.push(category); }
      if (district) { query += " AND district = ?"; values.push(district); }
      if (assembly) { query += " AND assembly = ?"; values.push(assembly); }
      if (subCategory) { query += " AND subCategory = ?"; values.push(subCategory); }

      const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as count");
      const [countRows] = await connection.execute(countQuery, values);
      localTotal = countRows[0]?.count ?? 0;

      const limitNum = parseInt(limit, 10) || 12;
      const pageNum  = parseInt(page,  10) || 1;
      const offset   = (pageNum - 1) * limitNum;

      query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
      values.push(limitNum, offset);

      const [rows] = await connection.execute(query, values);
      localBusinesses = rows.map((b) => ({
        ...b,
        avgRating: b.rating ? parseFloat(b.rating) : 0,
        reviewCount: 0,
        active: true,
      }));

      await connection.end();
    } catch (dbErr) {
      console.error("Local MySQL fetch failed:", dbErr.message);
    }

    // 2. Fetch from external API
    let apiBusinesses = [];
    let apiTotal = 0;
    try {
      const params = new URLSearchParams({ page, limit });
      if (search)      params.set("search",      search);
      if (category)    params.set("category",    category);
      if (district)    params.set("district",    district);
      if (assembly)    params.set("assembly",    assembly);
      if (subCategory) params.set("subCategory", subCategory);

      const response = await fetch(`${API_BASE_URL}/api/public/businesses?${params}`, {
        headers: { "Content-Type": "application/json; charset=utf-8", "Accept": "application/json; charset=utf-8" },
      });

      if (response.ok) {
        const data = await response.json();
        apiBusinesses = Array.isArray(data) ? data : (data.businesses || []);
        apiTotal      = Array.isArray(data) ? data.length : (data.total ?? 0);
      }
    } catch (apiErr) {
      console.error("External API fetch failed:", apiErr.message);
    }

    // 3. Merge (deduplicate by _id), then filter dummy/test entries
    const localIds    = new Set(localBusinesses.map((b) => b._id));
    const filteredApi = apiBusinesses.filter((b) => !localIds.has(b._id || b.id));
    const merged      = [...localBusinesses, ...filteredApi];

    // 4. Filter out dummy/test entries — keep a flag for debugging
    const clean = merged.filter((b) => {
      if (isDummyEntry(b)) {
        console.log(`[dummy-filter] Removed: "${b.name}" (${b.listingCode})`);
        return false;
      }
      return true;
    });

    const filteredCount = merged.length - clean.length;
    const adjustedTotal = Math.max(0, (localTotal + apiTotal) - filteredCount);

    return res.json({
      businesses: clean,
      total: adjustedTotal,
      page:  parseInt(page,  10) || 1,
      limit: parseInt(limit, 10) || 12,
      _meta: { filteredDummies: filteredCount },
    });

  } catch (err) {
    console.error("GET /api/businesses error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/businesses/:id ──────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Try local MySQL first
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(
        "SELECT * FROM businesses WHERE _id = ? OR id = ?",
        [id, id]
      );
      await connection.end();
      if (rows.length > 0) {
        const b = rows[0];
        return res.json({ ...b, avgRating: b.rating ? parseFloat(b.rating) : 0, reviewCount: 0, active: true });
      }
    } catch (dbErr) {
      console.error("Local DB fetch by ID failed:", dbErr.message);
    }

    // 2. Fallback to external API
    const response = await fetch(`${API_BASE_URL}/api/public/businesses/${id}`, {
      headers: { "Content-Type": "application/json; charset=utf-8", "Accept": "application/json; charset=utf-8" },
    });
    if (!response.ok) return res.status(404).json({ error: "Business not found" });
    return res.json(await response.json());
  } catch (err) {
    console.error(`GET /api/businesses/${req.params.id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/businesses ─────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.name || !body.phone || !body.category || !body.district || !body.address) {
      return res.status(400).json({ error: "Missing required fields: name, phone, category, district, address" });
    }

    const connection = await getConnection();

    const timestamp   = Date.now();
    const randomId    = Math.random().toString(36).substring(2, 15);
    const _id         = `${timestamp}${randomId}`;
    const listingCode = `VAN${timestamp.toString().slice(-8)}`;

    const query = `
      INSERT INTO businesses (
        _id, name, listingCode, description, category, subCategory,
        phone, phone2, email, website, city, district, assembly, address,
        pincode, landmark, lat, lng, openDays, openTime, closeTime,
        coverImage, img, image, imageUrl, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
      _id, body.name, listingCode, body.description || null,
      body.category, body.subCategory || null,
      body.phone, body.phone2 || null, body.email || null, body.website || null,
      body.city || null, body.district, body.assembly || null, body.address,
      body.pincode || null, body.landmark || null,
      body.lat || null, body.lng || null,
      body.openDays || null, body.openTime || null, body.closeTime || null,
      body.coverImage || null, body.coverImage || null,
      body.coverImage || null, body.coverImage || null,
    ];

    await connection.execute(query, values);
    await connection.end();

    return res.status(201).json({ success: true, message: "Business added successfully", businessId: _id, listingCode });
  } catch (err) {
    console.error("POST /api/businesses error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
