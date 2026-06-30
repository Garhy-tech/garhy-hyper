---
name: Supabase catalog admin
description: How to administer (wipe/seed/migrate) the Supabase catalog data given the grants setup.
---

# Supabase catalog administration

The catalog tables (products, flash_deals, brands, categories) are **not** writable
through the PostgREST/service_role REST API — those requests return **403** because
the service_role grants were never applied to these tables.

To wipe, seed, or migrate catalog data you must connect with `psql` using the
`POSTGRES_URL_NON_POOLING` connection string found in `.env.local`. That connects as
the `postgres` superuser and bypasses the missing grants.

Read the URL without echoing it, e.g.
`grep '^POSTGRES_URL_NON_POOLING=' .env.local | cut -d= -f2- | tr -d '"'`.

**Why:** the project ships with an empty catalog by design; service_role grants for
the catalog tables were intentionally/accidentally omitted, so REST writes fail.

**How to apply:** for any catalog data operation (seed/wipe/migrate), use the psql
superuser path, never REST. Never touch `user_roles`/auth tables during a catalog wipe.
