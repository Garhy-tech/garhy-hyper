---
name: Supabase catalog & DB topology
description: Where catalog data really lives, and why programmatic catalog writes from the agent env fail.
---

# Supabase catalog & DB topology

The product/category/brand catalog lives **only in Supabase**, accessed via
PostgREST (fetch). It is NOT in the Replit-provided Postgres.

**Why this matters:**
- `DATABASE_URL` (and any Replit-provisioned Postgres / "Helium") is a *separate*
  database, not the catalog store. Do not try to wipe or seed the catalog through
  it â€” changes won't show in the app.
- Programmatic catalog writes from the agent environment are blocked:
  - the `service_role` key returns HTTP 403 / Postgres error `42501` because the
    base migration only granted `SELECT` to `anon`/`authenticated` and gave
    `service_role` **no DML privileges**;
  - the publishable/anon key is read-only by RLS.
- Therefore the admin dashboard (which uses `service_role`) cannot write until a
  `GRANT SELECT, INSERT, UPDATE, DELETE ... TO service_role` is applied. The
  catalog schema migration was updated to include this grant, and a one-time
  cleanup migration (`002_clean_catalog.sql`) both truncates demo rows and
  re-applies the grant.

**How to apply:** A privileged change to the live catalog (wipe, seed, grant)
must be run by the project owner in the Supabase SQL Editor â€” the agent has no
privileged DB credential to do it programmatically.

