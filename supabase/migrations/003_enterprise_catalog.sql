-- ============================================================
-- GARHY | HYPER — Enterprise Catalog Architecture (additive)
--
-- Run this in the Supabase SQL Editor (or via psql as the postgres
-- superuser). It is ADDITIVE and IDEMPOTENT — safe to re-run.
--
-- Strategy: AUGMENT, don't rewrite. The existing flat tables
-- (products, categories, brands, flash_deals) are preserved as the v1
-- backward-compatibility surface that the storefront (anon REST) and the
-- admin dashboard (service_role REST) already use. Their existing columns
-- remain the denormalized "primary/default" values. This migration:
--   1. adds nullable / defaulted enterprise columns to those tables,
--   2. adds the full normalized enterprise model as NEW side tables, and
--   3. wires RLS + grants so public catalog data is anon-readable while
--      sensitive B2B data (partner terms, non-retail pricing, inventory
--      internals, customs cost, interaction logs) stays service_role-only.
--      Public retail pricing + stock availability are exposed through
--      curated views — never by granting anon on the base tables.
--
-- No seed/demo data. The catalog still ships EMPTY.
-- ============================================================

-- ─── EXTENSIONS ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pg_trgm;     -- fuzzy / ILIKE search readiness

-- ─── ENUMS ───────────────────────────────────────────────────
DO $$ BEGIN CREATE TYPE public.product_status AS ENUM ('draft','active','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.sales_channel AS ENUM ('retail','wholesale','distributor','factory_direct');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.attribute_data_type AS ENUM ('text','number','boolean','select');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.media_type AS ENUM ('image','video');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.product_relationship_type AS ENUM ('related','cross_sell','up_sell');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.interaction_type AS ENUM ('view','click','add_to_cart','add_to_wishlist','purchase','search');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── SHARED updated_at TRIGGER FN ────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- 1. LOCALIZATION / REFERENCE (public)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.currencies (
  code           text        PRIMARY KEY,            -- ISO 4217 (USD, SAR, …)
  name_ar        text        NOT NULL,
  name_en        text        NOT NULL,
  symbol         text        NOT NULL,
  decimal_digits smallint    NOT NULL DEFAULT 2,
  rate_to_usd    numeric(18,8) NOT NULL DEFAULT 1,   -- 1 unit of this currency in USD
  is_active      boolean     NOT NULL DEFAULT true,
  display_order  integer     NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.countries (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  iso2             text        UNIQUE NOT NULL,
  iso3             text,
  slug             text        UNIQUE NOT NULL,
  name_ar          text        NOT NULL,
  name_en          text        NOT NULL,
  flag_emoji       text,
  dial_code        text,
  is_origin_region boolean     NOT NULL DEFAULT false,
  display_order    integer     NOT NULL DEFAULT 0,
  is_active        boolean     NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. HIERARCHIES (public) — augment existing + new tables
-- ============================================================

-- categories: self-referential tree + SEO + bilingual description
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS parent_id          uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS description_ar     text,
  ADD COLUMN IF NOT EXISTS description_en     text,
  ADD COLUMN IF NOT EXISTS image_url          text,
  ADD COLUMN IF NOT EXISTS seo_title_ar       text,
  ADD COLUMN IF NOT EXISTS seo_title_en       text,
  ADD COLUMN IF NOT EXISTS seo_description_ar text,
  ADD COLUMN IF NOT EXISTS seo_description_en text,
  ADD COLUMN IF NOT EXISTS canonical_url      text,
  ADD COLUMN IF NOT EXISTS updated_at         timestamptz NOT NULL DEFAULT now();

-- brands: self-referential + bilingual names (keep `name` for compat) + origin + SEO
ALTER TABLE public.brands
  ADD COLUMN IF NOT EXISTS parent_id          uuid REFERENCES public.brands(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS name_ar            text,
  ADD COLUMN IF NOT EXISTS name_en            text,
  ADD COLUMN IF NOT EXISTS description_ar     text,
  ADD COLUMN IF NOT EXISTS description_en     text,
  ADD COLUMN IF NOT EXISTS country_id         uuid REFERENCES public.countries(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS seo_title_ar       text,
  ADD COLUMN IF NOT EXISTS seo_title_en       text,
  ADD COLUMN IF NOT EXISTS seo_description_ar text,
  ADD COLUMN IF NOT EXISTS seo_description_en text,
  ADD COLUMN IF NOT EXISTS canonical_url      text,
  ADD COLUMN IF NOT EXISTS updated_at         timestamptz NOT NULL DEFAULT now();

-- factories / manufacturers (public "made by" / origin info — no commercial terms)
CREATE TABLE IF NOT EXISTS public.factories (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               text        UNIQUE NOT NULL,
  name_ar            text        NOT NULL,
  name_en            text        NOT NULL,
  parent_id          uuid        REFERENCES public.factories(id) ON DELETE SET NULL,
  country_id         uuid        REFERENCES public.countries(id) ON DELETE SET NULL,
  description_ar     text,
  description_en     text,
  logo_url           text,
  seo_title_ar       text,
  seo_title_en       text,
  seo_description_ar text,
  seo_description_en text,
  canonical_url      text,
  display_order      integer     NOT NULL DEFAULT 0,
  is_active          boolean     NOT NULL DEFAULT true,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. PRIVATE PARTNERS (service_role only)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.suppliers (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text        UNIQUE NOT NULL,
  name_ar         text        NOT NULL,
  name_en         text        NOT NULL,
  parent_id       uuid        REFERENCES public.suppliers(id) ON DELETE SET NULL,
  country_id      uuid        REFERENCES public.countries(id) ON DELETE SET NULL,
  contact_name    text,
  contact_email   text,
  contact_phone   text,
  payment_terms   text,
  lead_time_days  integer,
  notes           text,
  is_active       boolean     NOT NULL DEFAULT true,
  display_order   integer     NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.distributors (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text        UNIQUE NOT NULL,
  name_ar         text        NOT NULL,
  name_en         text        NOT NULL,
  parent_id       uuid        REFERENCES public.distributors(id) ON DELETE SET NULL,
  country_id      uuid        REFERENCES public.countries(id) ON DELETE SET NULL,
  territory       text,
  contact_name    text,
  contact_email   text,
  contact_phone   text,
  terms           text,
  notes           text,
  is_active       boolean     NOT NULL DEFAULT true,
  display_order   integer     NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. CORE PRODUCT — augment (decoupled from price/stock going forward)
-- ============================================================

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS status                   public.product_status NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS factory_id               uuid REFERENCES public.factories(id)    ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS supplier_id              uuid REFERENCES public.suppliers(id)    ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS origin_country_id        uuid REFERENCES public.countries(id)    ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS eligible_retail          boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS eligible_wholesale       boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS eligible_distributor     boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS eligible_factory_direct  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS slug_ar                  text,
  ADD COLUMN IF NOT EXISTS slug_en                  text,
  ADD COLUMN IF NOT EXISTS seo_title_ar             text,
  ADD COLUMN IF NOT EXISTS seo_title_en             text,
  ADD COLUMN IF NOT EXISTS seo_description_ar       text,
  ADD COLUMN IF NOT EXISTS seo_description_en       text,
  ADD COLUMN IF NOT EXISTS meta_keywords            text,
  ADD COLUMN IF NOT EXISTS canonical_url            text;

-- Per-locale SEO slugs (NULLs allowed many times; uniqueness enforced when set)
CREATE UNIQUE INDEX IF NOT EXISTS uq_products_slug_ar ON public.products(slug_ar) WHERE slug_ar IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_products_slug_en ON public.products(slug_en) WHERE slug_en IS NOT NULL;

-- Bilingual full-text search vector ('simple' config: no language-specific
-- stemming, works for both AR and EN). Generated + GIN indexed.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('simple',
      coalesce(title_ar,'')       || ' ' || coalesce(title_en,'')       || ' ' ||
      coalesce(description_ar,'')  || ' ' || coalesce(description_en,'') || ' ' ||
      coalesce(brand_name,'')
    )
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_products_search_vector ON public.products USING gin (search_vector);
CREATE INDEX IF NOT EXISTS idx_products_title_en_trgm ON public.products USING gin (title_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_title_ar_trgm ON public.products USING gin (title_ar gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_brand_id      ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_factory       ON public.products(factory_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier      ON public.products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_origin        ON public.products(origin_country_id);
CREATE INDEX IF NOT EXISTS idx_products_status        ON public.products(status) WHERE is_active = true;

-- ============================================================
-- 5. VARIANTS, OPTIONS & ATTRIBUTES (public)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.product_variants (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku         text,
  barcode     text,
  title_ar    text,
  title_en    text,
  is_default  boolean     NOT NULL DEFAULT false,
  is_active   boolean     NOT NULL DEFAULT true,
  position    integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_product_variants_sku ON public.product_variants(sku) WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);

CREATE TABLE IF NOT EXISTS public.product_options (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name_ar     text        NOT NULL,
  name_en     text        NOT NULL,
  position    integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_options_product ON public.product_options(product_id);

CREATE TABLE IF NOT EXISTS public.product_option_values (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  option_id   uuid        NOT NULL REFERENCES public.product_options(id) ON DELETE CASCADE,
  value_ar    text        NOT NULL,
  value_en    text        NOT NULL,
  swatch_hex  text,
  position    integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_option_values_option ON public.product_option_values(option_id);

CREATE TABLE IF NOT EXISTS public.variant_option_values (
  variant_id      uuid NOT NULL REFERENCES public.product_variants(id)     ON DELETE CASCADE,
  option_value_id uuid NOT NULL REFERENCES public.product_option_values(id) ON DELETE CASCADE,
  PRIMARY KEY (variant_id, option_value_id)
);
CREATE INDEX IF NOT EXISTS idx_variant_option_values_value ON public.variant_option_values(option_value_id);

CREATE TABLE IF NOT EXISTS public.attributes (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  code          text        UNIQUE NOT NULL,
  name_ar       text        NOT NULL,
  name_en       text        NOT NULL,
  data_type     public.attribute_data_type NOT NULL DEFAULT 'text',
  unit          text,
  is_filterable boolean     NOT NULL DEFAULT false,
  is_active     boolean     NOT NULL DEFAULT true,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_attribute_values (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    uuid        NOT NULL REFERENCES public.products(id)   ON DELETE CASCADE,
  attribute_id  uuid        NOT NULL REFERENCES public.attributes(id) ON DELETE CASCADE,
  value_text    text,
  value_number  numeric(18,4),
  value_boolean boolean,
  value_ar      text,
  value_en      text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, attribute_id)
);
CREATE INDEX IF NOT EXISTS idx_pav_product   ON public.product_attribute_values(product_id);
CREATE INDEX IF NOT EXISTS idx_pav_attribute ON public.product_attribute_values(attribute_id);
CREATE INDEX IF NOT EXISTS idx_pav_filter_num ON public.product_attribute_values(attribute_id, value_number);

-- ============================================================
-- 6. SPECIFICATIONS & CERTIFICATIONS (public)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.product_specs (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    uuid        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  group_ar      text,
  group_en      text,
  label_ar      text        NOT NULL,
  label_en      text        NOT NULL,
  value_ar      text,
  value_en      text,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_specs_product ON public.product_specs(product_id);

CREATE TABLE IF NOT EXISTS public.product_certifications (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    uuid        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name_ar       text        NOT NULL,
  name_en       text        NOT NULL,
  issuing_body  text,
  document_ref  text,
  document_url  text,
  issued_at     date,
  expires_at    date,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_certifications_product ON public.product_certifications(product_id);

-- ============================================================
-- 7. PRICING ENGINE (base tables service_role-only; public via views)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.price_lists (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  code             text        UNIQUE NOT NULL,
  name_ar          text        NOT NULL,
  name_en          text        NOT NULL,
  channel          public.sales_channel NOT NULL,
  currency_code    text        NOT NULL REFERENCES public.currencies(code),
  customer_segment text,
  is_active        boolean     NOT NULL DEFAULT true,
  display_order    integer     NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_price_lists_channel ON public.price_lists(channel) WHERE is_active = true;

CREATE TABLE IF NOT EXISTS public.product_prices (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       uuid        NOT NULL REFERENCES public.products(id)         ON DELETE CASCADE,
  variant_id       uuid        REFERENCES public.product_variants(id)          ON DELETE CASCADE,
  price_list_id    uuid        NOT NULL REFERENCES public.price_lists(id)      ON DELETE CASCADE,
  price            numeric(12,2) NOT NULL,
  compare_at_price numeric(12,2),
  min_order_qty    integer     NOT NULL DEFAULT 1,
  valid_from       timestamptz,
  valid_to         timestamptz,
  is_active        boolean     NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_prices_product    ON public.product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_product_prices_variant    ON public.product_prices(variant_id);
CREATE INDEX IF NOT EXISTS idx_product_prices_price_list ON public.product_prices(price_list_id);

CREATE TABLE IF NOT EXISTS public.price_tiers (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_price_id uuid        NOT NULL REFERENCES public.product_prices(id) ON DELETE CASCADE,
  min_qty          integer     NOT NULL,
  max_qty          integer,
  unit_price       numeric(12,2) NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_price_tiers_price ON public.price_tiers(product_price_id);

-- ============================================================
-- 8. INVENTORY & WAREHOUSES (service_role-only; availability via view)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.warehouses (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  code          text        UNIQUE NOT NULL,
  name_ar       text        NOT NULL,
  name_en       text        NOT NULL,
  country_id    uuid        REFERENCES public.countries(id) ON DELETE SET NULL,
  city          text,
  address       text,
  is_active     boolean     NOT NULL DEFAULT true,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.variant_inventory (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id    uuid        NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  warehouse_id  uuid        NOT NULL REFERENCES public.warehouses(id)       ON DELETE CASCADE,
  on_hand       integer     NOT NULL DEFAULT 0,
  reserved      integer     NOT NULL DEFAULT 0,
  available     integer     GENERATED ALWAYS AS (on_hand - reserved) STORED,
  reorder_point integer     NOT NULL DEFAULT 0,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (variant_id, warehouse_id)
);
CREATE INDEX IF NOT EXISTS idx_variant_inventory_variant   ON public.variant_inventory(variant_id);
CREATE INDEX IF NOT EXISTS idx_variant_inventory_warehouse ON public.variant_inventory(warehouse_id);

-- ============================================================
-- 9. LOGISTICS & COMPLIANCE
-- ============================================================

-- Shipping dims/weight per variant (public — often shown on PDP)
CREATE TABLE IF NOT EXISTS public.variant_logistics (
  variant_id   uuid        PRIMARY KEY REFERENCES public.product_variants(id) ON DELETE CASCADE,
  weight_grams numeric(10,2),
  length_cm    numeric(10,2),
  width_cm     numeric(10,2),
  height_cm    numeric(10,2),
  package_type text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- HS code reference (public)
CREATE TABLE IF NOT EXISTS public.hs_codes (
  code           text        PRIMARY KEY,
  description_ar text,
  description_en text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Customs / import-export data per variant (cost-sensitive → service_role only)
CREATE TABLE IF NOT EXISTS public.variant_customs (
  variant_id           uuid        PRIMARY KEY REFERENCES public.product_variants(id) ON DELETE CASCADE,
  hs_code              text        REFERENCES public.hs_codes(code) ON DELETE SET NULL,
  country_of_origin_id uuid        REFERENCES public.countries(id)  ON DELETE SET NULL,
  customs_value        numeric(12,2),
  import_duty_pct      numeric(6,3),
  export_notes         text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 10. MEDIA (public)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.product_media (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    uuid        NOT NULL REFERENCES public.products(id)        ON DELETE CASCADE,
  variant_id    uuid        REFERENCES public.product_variants(id)         ON DELETE SET NULL,
  media_type    public.media_type NOT NULL DEFAULT 'image',
  url           text        NOT NULL,
  poster_url    text,
  provider      text,
  alt_ar        text,
  alt_en        text,
  display_order integer     NOT NULL DEFAULT 0,
  is_primary    boolean     NOT NULL DEFAULT false,
  is_active     boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_media_product ON public.product_media(product_id);
CREATE INDEX IF NOT EXISTS idx_product_media_variant ON public.product_media(variant_id);

-- ============================================================
-- 11. MERCHANDISING & RECOMMENDATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.product_relationships (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  source_product_id uuid        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  target_product_id uuid        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  relationship_type public.product_relationship_type NOT NULL,
  display_order     integer     NOT NULL DEFAULT 0,
  is_active         boolean     NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_product_id, target_product_id, relationship_type),
  CHECK (source_product_id <> target_product_id)
);
CREATE INDEX IF NOT EXISTS idx_product_rel_source ON public.product_relationships(source_product_id);
CREATE INDEX IF NOT EXISTS idx_product_rel_target ON public.product_relationships(target_product_id);

CREATE TABLE IF NOT EXISTS public.product_bundles (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           text        UNIQUE NOT NULL,
  name_ar        text        NOT NULL,
  name_en        text        NOT NULL,
  description_ar text,
  description_en text,
  is_active      boolean     NOT NULL DEFAULT true,
  display_order  integer     NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bundle_items (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id     uuid        NOT NULL REFERENCES public.product_bundles(id)  ON DELETE CASCADE,
  product_id    uuid        NOT NULL REFERENCES public.products(id)         ON DELETE CASCADE,
  variant_id    uuid        REFERENCES public.product_variants(id)          ON DELETE SET NULL,
  quantity      integer     NOT NULL DEFAULT 1,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bundle_items_bundle  ON public.bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_items_product ON public.bundle_items(product_id);

-- Recommendation associations (public)
CREATE TABLE IF NOT EXISTS public.recommendation_sets (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  code       text        UNIQUE NOT NULL,
  name_ar    text        NOT NULL,
  name_en    text        NOT NULL,
  algorithm  text,
  is_active  boolean     NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.recommendation_items (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id                 uuid        NOT NULL REFERENCES public.recommendation_sets(id) ON DELETE CASCADE,
  product_id             uuid        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  recommended_product_id uuid        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  score                  numeric(8,4) NOT NULL DEFAULT 0,
  display_order          integer     NOT NULL DEFAULT 0,
  created_at             timestamptz NOT NULL DEFAULT now(),
  UNIQUE (set_id, product_id, recommended_product_id)
);
CREATE INDEX IF NOT EXISTS idx_rec_items_set     ON public.recommendation_items(set_id);
CREATE INDEX IF NOT EXISTS idx_rec_items_product ON public.recommendation_items(product_id);

-- AI signal storage — partitioned by month for scale (service_role only)
CREATE TABLE IF NOT EXISTS public.customer_product_interactions (
  id               uuid        NOT NULL DEFAULT gen_random_uuid(),
  session_id       text,
  user_id          uuid,
  product_id       uuid        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id       uuid,
  interaction_type public.interaction_type NOT NULL,
  weight           numeric(6,2) NOT NULL DEFAULT 1,
  metadata         jsonb       NOT NULL DEFAULT '{}'::jsonb,
  occurred_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, occurred_at)
) PARTITION BY RANGE (occurred_at);

-- DEFAULT partition makes the table immediately writable; monthly partitions
-- can be added ahead of volume without downtime.
CREATE TABLE IF NOT EXISTS public.customer_product_interactions_default
  PARTITION OF public.customer_product_interactions DEFAULT;

CREATE INDEX IF NOT EXISTS idx_cpi_product  ON public.customer_product_interactions(product_id);
CREATE INDEX IF NOT EXISTS idx_cpi_type     ON public.customer_product_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_cpi_occurred ON public.customer_product_interactions(occurred_at);

-- ============================================================
-- 12. updated_at TRIGGERS
-- ============================================================
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'categories','brands','factories','suppliers','distributors',
    'product_variants','price_lists','product_prices','warehouses',
    'variant_inventory','variant_logistics','variant_customs','product_bundles'
  ] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_set_updated_at ON public.%I;', t);
    EXECUTE format(
      'CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON public.%I
         FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();', t);
  END LOOP;
END $$;

-- ============================================================
-- 13. ROW-LEVEL SECURITY + GRANTS
-- ============================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Enable RLS on every new table.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'currencies','countries','factories','suppliers','distributors',
    'product_variants','product_options','product_option_values','variant_option_values',
    'attributes','product_attribute_values','product_specs','product_certifications',
    'price_lists','product_prices','price_tiers','warehouses','variant_inventory',
    'variant_logistics','hs_codes','variant_customs','product_media',
    'product_relationships','product_bundles','bundle_items',
    'recommendation_sets','recommendation_items','customer_product_interactions'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
  END LOOP;
END $$;

-- Publication helpers (SECURITY DEFINER → run as owner, bypass products RLS) so
-- child-table policies can gate visibility by PARENT publication status without
-- exposing a draft/archived product's relational detail through the public role.
CREATE OR REPLACE FUNCTION public.is_public_product(p_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $fn$
  SELECT EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = p_id AND p.is_active AND p.status = 'active'
  );
$fn$;
REVOKE ALL ON FUNCTION public.is_public_product(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_public_product(uuid) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.is_public_variant(v_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $fn$
  SELECT EXISTS (
    SELECT 1 FROM public.product_variants v
    JOIN public.products p ON p.id = v.product_id
    WHERE v.id = v_id AND v.is_active AND p.is_active AND p.status = 'active'
  );
$fn$;
REVOKE ALL ON FUNCTION public.is_public_variant(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_public_variant(uuid) TO anon, authenticated, service_role;

-- ─── PUBLIC reference/global tables: gate by own is_active only ───
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'currencies','countries','factories','attributes',
    'product_bundles','recommendation_sets'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS public_read_active ON public.%I;', t);
    EXECUTE format(
      'CREATE POLICY public_read_active ON public.%I FOR SELECT USING (is_active = true);', t);
  END LOOP;
END $$;

-- hs_codes: global customs reference (no own is_active, no product link) ──
DROP POLICY IF EXISTS public_read_all ON public.hs_codes;
CREATE POLICY public_read_all ON public.hs_codes FOR SELECT USING (true);

-- ─── PRODUCT/VARIANT-scoped public tables: visible only for PUBLISHED parents ──
DROP POLICY IF EXISTS public_read_active ON public.product_variants;
CREATE POLICY public_read_active ON public.product_variants
  FOR SELECT USING (is_active = true AND public.is_public_product(product_id));

DROP POLICY IF EXISTS public_read_active ON public.product_media;
CREATE POLICY public_read_active ON public.product_media
  FOR SELECT USING (is_active = true AND public.is_public_product(product_id));

DROP POLICY IF EXISTS public_read_active ON public.product_relationships;
CREATE POLICY public_read_active ON public.product_relationships
  FOR SELECT USING (is_active = true AND public.is_public_product(source_product_id));

DROP POLICY IF EXISTS public_read_all ON public.product_options;
CREATE POLICY public_read_all ON public.product_options
  FOR SELECT USING (public.is_public_product(product_id));

DROP POLICY IF EXISTS public_read_all ON public.product_attribute_values;
CREATE POLICY public_read_all ON public.product_attribute_values
  FOR SELECT USING (public.is_public_product(product_id));

DROP POLICY IF EXISTS public_read_all ON public.product_specs;
CREATE POLICY public_read_all ON public.product_specs
  FOR SELECT USING (public.is_public_product(product_id));

DROP POLICY IF EXISTS public_read_all ON public.product_certifications;
CREATE POLICY public_read_all ON public.product_certifications
  FOR SELECT USING (public.is_public_product(product_id));

DROP POLICY IF EXISTS public_read_all ON public.product_option_values;
CREATE POLICY public_read_all ON public.product_option_values
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.product_options o
    WHERE o.id = option_id AND public.is_public_product(o.product_id)));

DROP POLICY IF EXISTS public_read_all ON public.variant_option_values;
CREATE POLICY public_read_all ON public.variant_option_values
  FOR SELECT USING (public.is_public_variant(variant_id));

DROP POLICY IF EXISTS public_read_all ON public.variant_logistics;
CREATE POLICY public_read_all ON public.variant_logistics
  FOR SELECT USING (public.is_public_variant(variant_id));

DROP POLICY IF EXISTS public_read_all ON public.bundle_items;
CREATE POLICY public_read_all ON public.bundle_items
  FOR SELECT USING (
    public.is_public_product(product_id)
    AND EXISTS (SELECT 1 FROM public.product_bundles b
                WHERE b.id = bundle_id AND b.is_active));

DROP POLICY IF EXISTS public_read_all ON public.recommendation_items;
CREATE POLICY public_read_all ON public.recommendation_items
  FOR SELECT USING (
    public.is_public_product(recommended_product_id)
    AND EXISTS (SELECT 1 FROM public.recommendation_sets s
                WHERE s.id = set_id AND s.is_active));

-- Grants for public tables. REVOKE ALL first to strip the non-data privileges
-- (REFERENCES / TRIGGER / TRUNCATE) that Supabase default-privileges auto-grant
-- to anon/authenticated on every new public table, then grant exactly SELECT.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'currencies','countries','factories','attributes','product_variants',
    'product_certifications','product_media','product_relationships',
    'product_bundles','recommendation_sets','product_options','product_option_values',
    'variant_option_values','product_attribute_values','product_specs',
    'variant_logistics','hs_codes','bundle_items','recommendation_items'
  ] LOOP
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated;', t);
    EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated;', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO service_role;', t);
  END LOOP;
END $$;

-- ─── SERVICE-ROLE-ONLY tables (revoke ALL from anon/authenticated) ──
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'suppliers','distributors','price_lists','product_prices','price_tiers',
    'warehouses','variant_inventory','variant_customs',
    'customer_product_interactions','customer_product_interactions_default'
  ] LOOP
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated;', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO service_role;', t);
  END LOOP;
END $$;

-- ============================================================
-- 14. CURATED PUBLIC VIEWS
--   Expose ONLY retail-channel active pricing + aggregate availability to the
--   public, without granting anon on the sensitive base tables. These views run
--   with the (owner) postgres privileges (security_invoker = false), so the base
--   tables stay locked down while the curated projection is anon-readable.
-- ============================================================

-- Public retail product predicate (inlined here; views run as owner so RLS does
-- not apply — every filter must be explicit). A row is exposed only when its
-- product is a published, retail-eligible product (and its variant, if any, is
-- active), the price list is an active retail list, the price row is active, and
-- the validity window is current.
CREATE OR REPLACE VIEW public.v_public_product_prices
WITH (security_invoker = false) AS
  SELECT pp.id, pp.product_id, pp.variant_id, pp.price_list_id,
         pl.currency_code, pp.price, pp.compare_at_price, pp.min_order_qty,
         pp.valid_from, pp.valid_to
  FROM public.product_prices pp
  JOIN public.price_lists pl ON pl.id = pp.price_list_id
  JOIN public.products p     ON p.id = pp.product_id
  LEFT JOIN public.product_variants pv ON pv.id = pp.variant_id
  WHERE pl.channel = 'retail' AND pl.is_active AND pp.is_active
    AND p.is_active AND p.status = 'active' AND p.eligible_retail
    AND (pp.variant_id IS NULL OR pv.is_active)
    AND (pp.valid_from IS NULL OR pp.valid_from <= now())
    AND (pp.valid_to   IS NULL OR pp.valid_to   >= now());

CREATE OR REPLACE VIEW public.v_public_price_tiers
WITH (security_invoker = false) AS
  SELECT t.id, t.product_price_id, t.min_qty, t.max_qty, t.unit_price
  FROM public.price_tiers t
  JOIN public.product_prices pp ON pp.id = t.product_price_id
  JOIN public.price_lists pl    ON pl.id = pp.price_list_id
  JOIN public.products p        ON p.id = pp.product_id
  LEFT JOIN public.product_variants pv ON pv.id = pp.variant_id
  WHERE pl.channel = 'retail' AND pl.is_active AND pp.is_active
    AND p.is_active AND p.status = 'active' AND p.eligible_retail
    AND (pp.variant_id IS NULL OR pv.is_active)
    AND (pp.valid_from IS NULL OR pp.valid_from <= now())
    AND (pp.valid_to   IS NULL OR pp.valid_to   >= now());

CREATE OR REPLACE VIEW public.v_public_variant_availability
WITH (security_invoker = false) AS
  SELECT vi.variant_id,
         sum(vi.available)::int     AS available_qty,
         bool_or(vi.available > 0)  AS in_stock
  FROM public.variant_inventory vi
  JOIN public.product_variants pv ON pv.id = vi.variant_id
  JOIN public.products p          ON p.id = pv.product_id
  WHERE pv.is_active
    AND p.is_active AND p.status = 'active' AND p.eligible_retail
  GROUP BY vi.variant_id;

REVOKE ALL ON public.v_public_product_prices       FROM anon, authenticated;
REVOKE ALL ON public.v_public_price_tiers          FROM anon, authenticated;
REVOKE ALL ON public.v_public_variant_availability FROM anon, authenticated;
GRANT SELECT ON public.v_public_product_prices       TO anon, authenticated;
GRANT SELECT ON public.v_public_price_tiers          TO anon, authenticated;
GRANT SELECT ON public.v_public_variant_availability TO anon, authenticated;
GRANT SELECT ON public.v_public_product_prices       TO service_role;
GRANT SELECT ON public.v_public_price_tiers          TO service_role;
GRANT SELECT ON public.v_public_variant_availability TO service_role;

-- ============================================================
-- 15. RELOAD POSTGREST SCHEMA CACHE
-- ============================================================
NOTIFY pgrst, 'reload schema';

-- ─── NO SEED DATA ────────────────────────────────────────────
-- The catalog ships empty. Content is added through the admin dashboard.
