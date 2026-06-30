# Architecture

GARHY | HYPER is a server-side-rendered React 19 application built on TanStack
Start. This document explains how the runtime fits together.

## 1. Server & SSR pipeline

- **`src/server.ts`** is the SSR entry. It wraps `@tanstack/react-start`'s
  server entry with an error boundary that catches catastrophic render failures
  (including errors h3 would otherwise swallow into a bare 500) and returns a
  clean error page.
- **`src/start.ts`** registers global middleware: a *function* middleware for
  server-function (RPC) calls and a *request* middleware for SSR requests.
- **`src/router.tsx`** creates the TanStack Router and a TanStack Query
  `QueryClient`, injecting the query client into the router context so loaders
  and components share one cache across SSR and the browser.
- **Nitro** produces the production server. `vite.config.ts` enables the
  `node-server` preset only for `command === "build"`, emitting
  `.output/server/index.mjs` (run via `npm run start`).

## 2. Routing

File-based routing lives under `src/routes/` (conventions in
`src/routes/README.md`). Highlights:

- **`__root.tsx`** â€” the app shell: HTML/head, provider tree, i18n wiring, and
  the top-level `<Outlet />`.
- **`_authenticated/route.tsx`** â€” a pathless layout that guards everything
  beneath it. Its `beforeLoad` runs a Supabase `getUser()` check and redirects
  to `/auth` when there is no session. It renders client-side (`ssr: false`) so
  the auth check happens against the browser session.
- **Customer area** â€” `account.*.tsx` (orders, profile, addresses, wallet,
  rewards, security, notifications, â€¦).
- **Admin area** â€” `admin.*.tsx` (analytics, products, categories, customers,
  orders, settings, integrations, notifications).
- **Storefront** â€” `index.tsx`, `catalog.*`, `product.$slug.tsx`, `cart.tsx`,
  `checkout.tsx`, `wishlist.tsx`, `search.tsx`, `contact.tsx`.

`src/routeTree.gen.ts` is generated â€” never edited by hand, and excluded from
lint/format.

## 3. Supabase integration (`src/integrations/supabase/`)

- **`client.ts`** â€” browser client via `createBrowserClient` (`@supabase/ssr`).
  Includes a self-contained `MinimalWS` WebSocket shim so `@supabase/realtime-js`
  does not throw under Node.js 20 SSR (Node 20 lacks a native global
  `WebSocket`; Node 22+ has one). The shim needs no extra packages; Realtime is
  inert server-side, which is fine because auth/REST do not use it.
- **`server.ts`** â€” `createSupabaseServerClient(request)` parses and serializes
  auth cookies so the server sees the same session as the browser.
- **`auth-attacher.ts`** â€” client middleware that attaches the Supabase JWT to
  the `Authorization` header of server-function (RPC) calls.
- **`auth-middleware.ts`** â€” server middleware that validates that JWT and
  exposes `userId` / claims to the function context.

## 4. Data fetching

- **Server functions** live in `src/lib/api/` (`createServerFn`). They issue
  direct `fetch` calls to Supabase PostgREST (`/rest/v1/â€¦`) rather than using a
  Realtime-capable client, keeping SSR lightweight.
- **Route loaders** call these server functions; **TanStack Query** caches and
  hydrates results between server and client.

### Graceful empty states

The PostgREST helper treats `404`/`406` (missing table / no rows â€” common before
migrations are applied) as **empty results** instead of errors. The UI then
renders localized empty states (`src/components/common/empty-state.tsx`) or
loading skeletons. The app never assumes the schema is present.

## 5. Internationalization

- **`src/lib/i18n.ts`** initializes i18next with Arabic and English resources
  (`src/lib/locales/`).
- **`src/hooks/use-language.ts`** syncs the `<html>` `lang` and `dir`
  attributes (RTL for Arabic).
- To avoid hydration mismatches, the server renders a stable default
  (`en` / `ltr`); the detected language is applied on the client after mount.

## 6. Styling

- **Tailwind CSS v4** via `@tailwindcss/vite`.
- **Lightning CSS** is the configured CSS transformer (`css.transformer:
  "lightningcss"` in `vite.config.ts`) so dev output matches the production
  build.
- The design system (luxury tokens â€” gold accents, hairline borders, elevated
  shadows) is defined in the global stylesheet.

## 7. Path aliases

`@/*` maps to `src/*`. This is declared in `tsconfig.json` and mirrored by
`resolve.alias` in `vite.config.ts` â€” no extra Vite plugin is required.

## 8. Catalog data model (enterprise)

Migration `supabase/migrations/003_enterprise_catalog.sql` layers a normalized,
enterprise-grade catalog on top of the original flat schema. It is **additive and
idempotent** â€” it never drops or rewrites existing columns/tables â€” and ships
**empty** (no seed/demo data).

### 8.1 Augment, don't rewrite (backward compatibility)

The original tables (`products`, `categories`, `brands`, `flash_deals`) remain the
**v1 PostgREST contract**. Their existing columns are preserved and act as
denormalized defaults, so the storefront and admin server functions
(`src/lib/api/catalog.functions.ts`, `src/lib/api/admin.functions.ts`) keep working
unchanged. Enterprise capability is added two ways:

- **New nullable columns** on the existing tables (e.g. `products.status`,
  `products.factory_id`, per-locale `slug_ar/slug_en`, SEO fields, a self-referential
  `categories.parent_id` / `brands.parent_id`, bilingual `brands.name_ar/name_en`).
  All are nullable or carry safe defaults, so existing inserts/reads are unaffected.
- **New normalized side tables** that reference `products(id)` (and each other),
  holding the relational detail that does not belong on the flat row.

### 8.2 Domains

- **Org / sourcing:** `countries`, `currencies`, `factories` (public origin info),
  `suppliers`, `distributors` (private commercial partners).
- **Product structure:** `product_variants`, `product_options`,
  `product_option_values`, `variant_option_values` (variant â†” option M:N).
- **Descriptive:** `attributes` + `product_attribute_values` (typed, filterable),
  `product_specs`, `product_certifications`.
- **Pricing engine:** `price_lists` (per channel + currency), `product_prices`
  (channel/variant scoped, validity windows), `price_tiers` (quantity breaks).
- **Inventory & logistics:** `warehouses`, `variant_inventory` (multi-warehouse,
  generated `available = on_hand - reserved`), `variant_logistics`, `hs_codes`,
  `variant_customs`.
- **Media & merchandising:** `product_media`, `product_relationships`
  (related / cross-sell / up-sell), `product_bundles` + `bundle_items`,
  `recommendation_sets` + `recommendation_items`.
- **Signals:** `customer_product_interactions` â€” range-partitioned by
  `occurred_at` (month) with a `DEFAULT` partition so it is writable immediately.

### 8.3 Search

`products.search_vector` is a `STORED GENERATED` `tsvector` (`'simple'` config so it
serves both Arabic and English without language-specific stemming) over the title,
description and brand name, indexed with GIN. Trigram (`pg_trgm`) GIN indexes on
`title_ar` / `title_en` back fuzzy matching.

### 8.4 Security model (RLS + grants)

Row-Level Security is enabled on every new table. Access is split by sensitivity:

- **Public catalog tables** (variants, options, attributes, specs, media, bundles,
  recommendations, reference data, â€¦): `anon` / `authenticated` get **`SELECT`
  only**, backed by permissive read policies.
- **Sensitive tables** (`suppliers`, `distributors`, `price_lists`,
  `product_prices`, `price_tiers`, `warehouses`, `variant_inventory`,
  `variant_customs`, `customer_product_interactions`): **no `anon` /
  `authenticated` privileges at all** â€” `service_role` only.

Because Supabase default privileges auto-grant a few non-data privileges
(`REFERENCES` / `TRIGGER` / `TRUNCATE`) to `anon`/`authenticated` on every new
`public` table, the migration runs `REVOKE ALL` before each grant so the final
privilege set is exact and auditable.

Retail pricing and stock availability still need to reach the public storefront
**without** exposing the sensitive base tables. This is done with three curated,
owner-privileged views (`security_invoker = false`):

- `v_public_product_prices` â€” active **retail-channel** prices only.
- `v_public_price_tiers` â€” quantity breaks for those retail prices.
- `v_public_variant_availability` â€” aggregated `available_qty` / `in_stock` per
  variant (never per-warehouse internals).

`anon` is granted `SELECT` on the views, not on `product_prices` /
`variant_inventory`, so the curated projection is public while the raw commercial
data stays locked down.

