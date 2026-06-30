-- ============================================================
-- GARHY | HYPER — Catalog Schema Migration
-- Run this in the Supabase SQL Editor for your project.
--
-- This creates the catalog tables, indexes, row-level security and the
-- grants required by the public storefront (read) and the admin dashboard
-- (write, via the service_role key). It intentionally ships NO seed data —
-- the catalog starts empty and is populated through the admin dashboard.
-- ============================================================

-- ─── TABLES ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.categories (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text        UNIQUE NOT NULL,
  name_ar       text        NOT NULL,
  name_en       text        NOT NULL,
  display_order integer     NOT NULL DEFAULT 0,
  is_active     boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.brands (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text        UNIQUE NOT NULL,
  name          text        NOT NULL,
  logo_url      text,
  display_order integer     NOT NULL DEFAULT 0,
  is_active     boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id               uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text           UNIQUE NOT NULL,
  title_ar         text           NOT NULL,
  title_en         text           NOT NULL,
  description_ar   text,
  description_en   text,
  brand_name       text,
  brand_id         uuid           REFERENCES public.brands(id) ON DELETE SET NULL,
  category_id      uuid           REFERENCES public.categories(id) ON DELETE SET NULL,
  price            numeric(10,2)  NOT NULL,
  compare_at_price numeric(10,2),
  image_url        text           NOT NULL,
  gallery_urls     text[]         NOT NULL DEFAULT '{}',
  rating           numeric(3,2)   NOT NULL DEFAULT 4.5,
  review_count     integer        NOT NULL DEFAULT 0,
  badge            text           CHECK (badge IN ('best-seller','trending','new','limited')),
  is_active        boolean        NOT NULL DEFAULT true,
  is_featured      boolean        NOT NULL DEFAULT false,
  is_best_seller   boolean        NOT NULL DEFAULT false,
  is_new_arrival   boolean        NOT NULL DEFAULT false,
  is_trending      boolean        NOT NULL DEFAULT false,
  is_recommended   boolean        NOT NULL DEFAULT false,
  free_shipping    boolean        NOT NULL DEFAULT false,
  fast_delivery    boolean        NOT NULL DEFAULT false,
  stock_quantity   integer        NOT NULL DEFAULT 0,
  created_at       timestamptz    NOT NULL DEFAULT now(),
  updated_at       timestamptz    NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.flash_deals (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  label_ar      text        NOT NULL,
  label_en      text        NOT NULL,
  hint_ar       text        NOT NULL,
  hint_en       text        NOT NULL,
  discount_pct  text        NOT NULL,
  category_id   uuid        REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active     boolean     NOT NULL DEFAULT true,
  ends_at       timestamptz,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ─── INDEXES ─────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_products_slug         ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category     ON public.products(category_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_best_seller  ON public.products(is_best_seller) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_new_arrival  ON public.products(is_new_arrival) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_trending     ON public.products(is_trending)    WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_recommended  ON public.products(is_recommended) WHERE is_active = true;

-- ─── ROW-LEVEL SECURITY ──────────────────────────────────────

ALTER TABLE public.categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flash_deals  ENABLE ROW LEVEL SECURITY;

-- Public read: anyone (including anon) can read active rows
CREATE POLICY "public_read_categories"  ON public.categories  FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_brands"      ON public.brands       FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_products"    ON public.products     FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_flash_deals" ON public.flash_deals  FOR SELECT USING (is_active = true);

-- ─── GRANTS ──────────────────────────────────────────────────

-- Public storefront read access (PostgREST anon + authenticated roles).
GRANT USAGE  ON SCHEMA public                                         TO anon;
GRANT SELECT ON public.categories, public.brands, public.products, public.flash_deals TO anon;
GRANT SELECT ON public.categories, public.brands, public.products, public.flash_deals TO authenticated;

-- Admin write access uses the service_role key. service_role bypasses RLS but
-- still needs table privileges granted explicitly — without this, admin
-- inserts/updates/deletes fail with "permission denied for table ...".
GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.categories, public.brands, public.products, public.flash_deals
  TO service_role;

-- ─── NO SEED DATA ────────────────────────────────────────────
-- The catalog ships empty. Add categories, brands, products and flash deals
-- through the admin dashboard at /admin.
