import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "@/integrations/supabase/admin-guard";
import {
  adminSelect,
  adminInsert,
  adminUpdate,
  adminDelete,
} from "@/integrations/supabase/admin.server";
import type {
  CatalogCategory,
  CatalogBrand,
  CatalogFlashDeal,
  CatalogProduct,
} from "./catalog.functions";

/* ============================================================
   ADMIN ROW TYPES (full rows, including inactive records)
============================================================ */

export type AdminCategory = CatalogCategory & {
  is_active: boolean;
  created_at: string;
};

export type AdminBrand = CatalogBrand & {
  display_order: number;
  is_active: boolean;
  created_at: string;
};

export type AdminFlashDeal = CatalogFlashDeal & {
  display_order: number;
  is_active: boolean;
  ends_at: string | null;
  created_at: string;
};

export type AdminProduct = CatalogProduct & {
  brand_id: string | null;
  category_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_trending: boolean;
  is_recommended: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
};

const PRODUCT_COLUMNS =
  "id,slug,title_ar,title_en,description_ar,description_en,brand_name,brand_id,category_id,price,compare_at_price,image_url,gallery_urls,rating,review_count,badge,is_active,is_featured,is_best_seller,is_new_arrival,is_trending,is_recommended,free_shipping,fast_delivery,stock_quantity,created_at,updated_at";

/* ============================================================
   VALIDATION SCHEMAS
============================================================ */

const idSchema = z.object({ id: z.string().uuid() });

const optionalString = z
  .string()
  .trim()
  .nullable()
  .optional()
  .transform((v) => (v == null || v === "" ? null : v));

const categoryFields = z.object({
  slug: z.string().trim().min(1),
  name_ar: z.string().trim().min(1),
  name_en: z.string().trim().min(1),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});
const categoryInput = categoryFields.extend({ id: z.string().uuid().optional() });

const brandFields = z.object({
  slug: z.string().trim().min(1),
  name: z.string().trim().min(1),
  logo_url: optionalString,
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});
const brandInput = brandFields.extend({ id: z.string().uuid().optional() });

const flashDealFields = z.object({
  label_ar: z.string().trim().min(1),
  label_en: z.string().trim().min(1),
  hint_ar: z.string().trim().min(1),
  hint_en: z.string().trim().min(1),
  discount_pct: z.string().trim().min(1),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});
const flashDealInput = flashDealFields.extend({ id: z.string().uuid().optional() });

const productFields = z.object({
  slug: z.string().trim().min(1),
  title_ar: z.string().trim().min(1),
  title_en: z.string().trim().min(1),
  description_ar: optionalString,
  description_en: optionalString,
  brand_name: optionalString,
  category_id: z
    .string()
    .uuid()
    .nullable()
    .optional()
    .transform((v) => (v == null || v === "" ? null : v)),
  price: z.number().nonnegative(),
  compare_at_price: z.number().nonnegative().nullable().optional(),
  image_url: z.string().trim().min(1),
  gallery_urls: z.array(z.string().trim()).default([]),
  badge: z.enum(["best-seller", "trending", "new", "limited"]).nullable().optional(),
  stock_quantity: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  is_best_seller: z.boolean().default(false),
  is_new_arrival: z.boolean().default(false),
  is_trending: z.boolean().default(false),
  is_recommended: z.boolean().default(false),
  free_shipping: z.boolean().default(false),
  fast_delivery: z.boolean().default(false),
});
const productInput = productFields.extend({ id: z.string().uuid().optional() });

/* ============================================================
   LIST FUNCTIONS (admin-only, return ALL rows incl. inactive)
============================================================ */

export const listAdminProducts = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async (): Promise<AdminProduct[]> => {
    return adminSelect<AdminProduct>("products", {
      select: PRODUCT_COLUMNS,
      order: "created_at.desc",
    });
  });

export const listAdminCategories = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async (): Promise<AdminCategory[]> => {
    return adminSelect<AdminCategory>("categories", {
      select: "id,slug,name_ar,name_en,display_order,is_active,created_at",
      order: "display_order.asc",
    });
  });

export const listAdminBrands = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async (): Promise<AdminBrand[]> => {
    return adminSelect<AdminBrand>("brands", {
      select: "id,slug,name,logo_url,display_order,is_active,created_at",
      order: "display_order.asc",
    });
  });

export const listAdminFlashDeals = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async (): Promise<AdminFlashDeal[]> => {
    return adminSelect<AdminFlashDeal>("flash_deals", {
      select:
        "id,label_ar,label_en,hint_ar,hint_en,discount_pct,display_order,is_active,ends_at,created_at",
      order: "display_order.asc",
    });
  });

/* ============================================================
   PRODUCT MUTATIONS
============================================================ */

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator(productInput)
  .handler(async ({ data }): Promise<AdminProduct> => {
    const { id, ...fields } = data;
    if (id) {
      return adminUpdate<AdminProduct>("products", id, fields);
    }
    return adminInsert<AdminProduct>("products", fields);
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator(idSchema)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    await adminDelete("products", data.id);
    return { ok: true };
  });

/* ============================================================
   CATEGORY MUTATIONS
============================================================ */

export const saveCategory = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator(categoryInput)
  .handler(async ({ data }): Promise<AdminCategory> => {
    const { id, ...fields } = data;
    if (id) {
      return adminUpdate<AdminCategory>("categories", id, fields);
    }
    return adminInsert<AdminCategory>("categories", fields);
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator(idSchema)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    await adminDelete("categories", data.id);
    return { ok: true };
  });

/* ============================================================
   BRAND MUTATIONS
============================================================ */

export const saveBrand = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator(brandInput)
  .handler(async ({ data }): Promise<AdminBrand> => {
    const { id, ...fields } = data;
    if (id) {
      return adminUpdate<AdminBrand>("brands", id, fields);
    }
    return adminInsert<AdminBrand>("brands", fields);
  });

export const deleteBrand = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator(idSchema)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    await adminDelete("brands", data.id);
    return { ok: true };
  });

/* ============================================================
   FLASH DEAL MUTATIONS
============================================================ */

export const saveFlashDeal = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator(flashDealInput)
  .handler(async ({ data }): Promise<AdminFlashDeal> => {
    const { id, ...fields } = data;
    if (id) {
      return adminUpdate<AdminFlashDeal>("flash_deals", id, fields);
    }
    return adminInsert<AdminFlashDeal>("flash_deals", fields);
  });

export const deleteFlashDeal = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator(idSchema)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    await adminDelete("flash_deals", data.id);
    return { ok: true };
  });


