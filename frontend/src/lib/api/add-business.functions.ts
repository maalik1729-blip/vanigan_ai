import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// The backend Express server URL
const BACKEND_URL =
  (typeof process !== "undefined" && process.env.VITE_API_BASE_URL) ||
  import.meta.env?.VITE_API_BASE_URL ||
  "http://localhost:3001";

export const addBusiness = createServerFn({ method: "POST" })
  .inputValidator(z.any())
  .handler(async (ctx: any) => {
    try {
      const body = ctx.data || {};

      const response = await fetch(`${BACKEND_URL}/api/businesses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Backend error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("addBusiness error:", error);
      throw new Error((error as Error).message || "Failed to add business");
    }
  });
