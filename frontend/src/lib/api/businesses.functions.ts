import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// The backend Express server URL — reads from VITE_API_BASE_URL (set in frontend/.env)
const BACKEND_URL =
  (typeof process !== "undefined" && process.env.VITE_API_BASE_URL) ||
  import.meta.env?.VITE_API_BASE_URL ||
  "http://localhost:3001";

export interface BusinessQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  district?: string;
  assembly?: string;
}

export interface BusinessResult {
  businesses: any[];
  total: number;
  page: number;
  limit: number;
}

// ─── Get businesses list ──────────────────────────────────────────────────────
export const getBusinesses = createServerFn({ method: "GET" })
  .inputValidator(
    z
      .object({
        page: z.union([z.number(), z.string()]).optional(),
        limit: z.union([z.number(), z.string()]).optional(),
        search: z.string().optional(),
        category: z.string().optional(),
        district: z.string().optional(),
        assembly: z.string().optional(),
        subCategory: z.string().optional(),
      })
      .optional(),
  )
  .handler(async (ctx: any) => {
    try {
      const reqData = ctx.data || {};
      const params = new URLSearchParams();
      if (reqData.page)        params.set("page",        String(reqData.page));
      if (reqData.limit)       params.set("limit",       String(reqData.limit));
      if (reqData.search)      params.set("search",      reqData.search);
      if (reqData.category)    params.set("category",    reqData.category);
      if (reqData.district)    params.set("district",    reqData.district);
      if (reqData.assembly)    params.set("assembly",    reqData.assembly);
      if (reqData.subCategory) params.set("subCategory", reqData.subCategory);

      const response = await fetch(`${BACKEND_URL}/api/businesses?${params}`, {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      });

      if (!response.ok) throw new Error(`Backend error: ${response.status}`);
      return (await response.json()) as BusinessResult;
    } catch (error) {
      console.error("getBusinesses error:", error);
      throw error;
    }
  });

// ─── Get categories ───────────────────────────────────────────────────────────
export const getCategories = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/categories`, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
});

// ─── Get districts ────────────────────────────────────────────────────────────
export const getDistricts = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/districts`, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
});

// ─── Get assemblies ───────────────────────────────────────────────────────────
export const getAssemblies = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/assemblies`, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
});

// ─── Get single business by ID ────────────────────────────────────────────────
export const getBusinessById = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async (ctx: any) => {
    try {
      const id = (ctx.data || {}).id;
      if (!id) throw new Error("Business ID is required");

      const response = await fetch(`${BACKEND_URL}/api/businesses/${id}`, {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      });

      if (!response.ok) throw new Error(`Failed to fetch business: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("getBusinessById error:", error);
      throw error;
    }
  });
