-- ============================================================
-- GARHY | HYPER — One-time catalog cleanup
--
-- Run this ONCE in the Supabase SQL Editor on an existing project that was
-- previously seeded with demo data. It:
--   1. Removes all demo rows (schema, indexes and RLS are preserved), and
--   2. Grants the service_role the table privileges the admin dashboard needs
--      (older deployments of 001 only granted SELECT to anon/authenticated).
--
-- ⚠️  TRUNCATE is destructive and permanent. Only run this when you intend to
--     start from an empty catalog. Do NOT re-run it on a populated catalog.
-- ============================================================

-- 1. Empty the catalog (CASCADE handles the foreign-key relationships).
TRUNCATE public.products, public.flash_deals, public.brands, public.categories CASCADE;

-- 2. Ensure the admin dashboard (service_role key) can write.
GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.categories, public.brands, public.products, public.flash_deals
  TO service_role;
