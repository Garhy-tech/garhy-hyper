import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Product } from "@/contexts/commerce-context";

/* ============================================================
   TYPES
============================================================ */

export type CatalogCategory = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  display_order: number;
};

export type CatalogBrand = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
};

export type CatalogFlashDeal = {
  id: string;
  label_ar: string;
  label_en: string;
  hint_ar: string;
  hint_en: string;
  discount_pct: string;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  brand_name: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string;
  gallery_urls: string[];
  rating: number;
  review_count: number;
  badge: "best-seller" | "trending" | "new" | "limited" | null;
  free_shipping: boolean;
  fast_delivery: boolean;
  description_ar: string | null;
  description_en: string | null;
};

export type HomePageData = {
  categories: CatalogCategory[];
  brands: CatalogBrand[];
  flashDeals: CatalogFlashDeal[];
  bestSellers: CatalogProduct[];
  newArrivals: CatalogProduct[];
  recommended: CatalogProduct[];
  trending: CatalogProduct[];
};

/* ============================================================
   MAP HELPER
============================================================ */

/** Map a CatalogProduct row â†’ Product shape used by commerce context + ProductCard */
export function toProduct(p: CatalogProduct, lang: string): Product {
  const l = lang === "en" ? "en" : "ar";
  return {
    id: p.id,
    slug: p.slug,
    title: l === "ar" ? p.title_ar : p.title_en,
    brand: p.brand_name ?? undefined,
    price: Number(p.price),
    compareAt: p.compare_at_price ? Number(p.compare_at_price) : undefined,
    image: p.image_url,
    imageAlt: l === "ar" ? p.title_ar : p.title_en,
    rating: p.rating,
    reviews: p.review_count,
    badge: p.badge ?? undefined,
    freeShipping: p.free_shipping,
    fastDelivery: p.fast_delivery,
  };
}

/* ============================================================
   SUPABASE REST CLIENT (no WebSocket / no Realtime)
   Uses direct fetch against PostgREST â€” safe in Node.js 20 SSR.
============================================================ */

const PRODUCT_SELECT =
  "id,slug,title_ar,title_en,brand_name,price,compare_at_price,image_url,gallery_urls,rating,review_count,badge,free_shipping,fast_delivery,description_ar,description_en";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
  return { url, key };
}

async function pgrest<T>(table: string, params: Record<string, string>): Promise<T[]> {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) {
    console.warn("[catalog] Supabase env vars not set â€” returning empty array for", table);
    return [];
  }

  const qs = new URLSearchParams(params).toString();
  const endpoint = `${url}/rest/v1/${table}?${qs}`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Prefer: "return=representation",
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      // 404 / 406 = table doesn't exist yet (migration not applied)
      if (res.status === 404 || res.status === 406 || body.includes("does not exist")) {
        return [];
      }
      console.error(`[catalog] pgrest error ${res.status} on ${table}:`, body);
      return [];
    }

    return (await res.json()) as T[];
  } catch (err) {
    console.error("[catalog] fetch error on", table, err);
    return [];
  }
}

/**
 * Like `pgrest`, but also returns the total number of rows matching the filters
 * (via PostgREST `Prefer: count=exact` + the `Content-Range` response header),
 * so paged queries can report the real database total instead of the page size.
 */
async function pgrestList<T>(
  table: string,
  params: Record<string, string>,
): Promise<{ rows: T[]; total: number }> {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) {
    console.warn("[catalog] Supabase env vars not set â€” returning empty list for", table);
    return { rows: [], total: 0 };
  }

  const qs = new URLSearchParams(params).toString();
  const endpoint = `${url}/rest/v1/${table}?${qs}`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Prefer: "count=exact",
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      if (res.status === 404 || res.status === 406 || body.includes("does not exist")) {
        return { rows: [], total: 0 };
      }
      console.error(`[catalog] pgrest error ${res.status} on ${table}:`, body);
      return { rows: [], total: 0 };
    }

    const rows = (await res.json()) as T[];
    // Content-Range is "0-23/1234"; the segment after "/" is the full count.
    const range = res.headers.get("content-range");
    const parsed = range && range.includes("/") ? Number(range.split("/")[1]) : NaN;
    const total = Number.isFinite(parsed) ? parsed : rows.length;
    return { rows, total };
  } catch (err) {
    console.error("[catalog] fetch error on", table, err);
    return { rows: [], total: 0 };
  }
}

async function fetchProducts(filter: Record<string, string>, limit = 8): Promise<CatalogProduct[]> {
  return pgrest<CatalogProduct>("products", {
    select: PRODUCT_SELECT,
    is_active: "eq.true",
    order: "review_count.desc",
    limit: String(limit),
    ...filter,
  });
}

/* ============================================================
   SERVER FUNCTIONS
============================================================ */

export const getHomePageData = createServerFn({ method: "GET" }).handler(
  async (): Promise<HomePageData> => {
    const [categories, brands, flashDeals, bestSellers, newArrivals, recommended, trending] =
      await Promise.all([
        pgrest<CatalogCategory>("categories", {
          select: "id,slug,name_ar,name_en,display_order",
          is_active: "eq.true",
          order: "display_order.asc",
        }),
        pgrest<CatalogBrand>("brands", {
          select: "id,slug,name,logo_url",
          is_active: "eq.true",
          order: "display_order.asc",
        }),
        pgrest<CatalogFlashDeal>("flash_deals", {
          select: "id,label_ar,label_en,hint_ar,hint_en,discount_pct",
          is_active: "eq.true",
          order: "display_order.asc",
        }),
        fetchProducts({ is_best_seller: "eq.true" }, 8),
        fetchProducts({ is_new_arrival: "eq.true" }, 8),
        fetchProducts({ is_recommended: "eq.true" }, 8),
        fetchProducts({ is_trending: "eq.true" }, 8),
      ]);

    return {
      categories,
      brands,
      flashDeals,
      bestSellers,
      newArrivals,
      recommended,
      trending,
    };
  },
);

export const getProductBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data }): Promise<CatalogProduct | null> => {
    const rows = await pgrest<CatalogProduct>("products", {
      select: PRODUCT_SELECT,
      slug: `eq.${data.slug}`,
      is_active: "eq.true",
      limit: "1",
    });
    return rows[0] ?? null;
  });

export const getCatalogProducts = createServerFn({ method: "GET" })
  .validator(
    z.object({
      category: z.string().optional(),
      limit: z.number().min(1).max(100).default(24),
      offset: z.number().min(0).default(0),
    }),
  )
  .handler(async ({ data }) => {
    const params: Record<string, string> = {
      select: PRODUCT_SELECT,
      is_active: "eq.true",
      order: "review_count.desc",
      limit: String(data.limit),
      offset: String(data.offset),
    };

    if (data.category) {
      const cats = await pgrest<{ id: string }>("categories", {
        select: "id",
        slug: `eq.${data.category}`,
        limit: "1",
      });
      if (cats[0]?.id) {
        params["category_id"] = `eq.${cats[0].id}`;
      }
    }

    const { rows: products, total } = await pgrestList<CatalogProduct>("products", params);
    return { products, total };
  });

/**
 * Lightweight list of active categories for navigation (e.g. the header mega
 * menu). Returns an empty array when the catalog has no categories yet.
 */
export const getNavCategories = createServerFn({ method: "GET" }).handler(
  async (): Promise<CatalogCategory[]> => {
    return pgrest<CatalogCategory>("categories", {
      select: "id,slug,name_ar,name_en,display_order",
      is_active: "eq.true",
      order: "display_order.asc",
    });
  },
);


