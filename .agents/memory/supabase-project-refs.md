---
name: Supabase project refs & DDL access
description: Which Supabase project the app actually uses, and where DDL credentials live (multiple conflicting refs exist).
---

# Supabase project refs & DDL access

Multiple, conflicting Supabase project refs exist in this repo. Know which is authoritative before touching the DB.

- **Authoritative (live) project the app reads/writes:** the ref inside the **`VITE_SUPABASE_URL` secret** (resolves in DNS, serves PostgREST/auth/storage). The catalog data layer (`src/lib/api/catalog.functions.ts`) talks to this via PostgREST + the anon/publishable key.
- **Server data path keys off `process.env.SUPABASE_URL` (not the VITE_ vars):** `getSupabaseConfig()` / `catalog.functions.ts` prefer `process.env.SUPABASE_URL` over `import.meta.env.VITE_SUPABASE_URL`. This was the C1 root cause: the `SUPABASE_URL` shared env var was **UNSET** and `.env`'s `SUPABASE_URL` pointed to a *deleted* ref (`getaddrinfo ENOTFOUND`), so SSR catalog fetches failed even though the live URL sat in the VITE_ secrets. **Now RESOLVED:** the `SUPABASE_URL` env var and `.env` both point to the live ref, and the unused `*_PROJECT_ID` vars were dropped from `.env`. Gotcha: a bare shell does NOT auto-load `.env`, so read server env from the running process / a node script, not a plain shell.
- **`supabase/config.toml` `project_id`:** now corrected to the live ref (matches `SUPABASE_URL`), so CLI `link`/`db push` targets the right project. The `SUPABASE_PROJECT_ID` env var may still point to a *different*, non-live ref — don't trust it; trust the ref in `SUPABASE_URL` / the pooler username.
- **Unrelated:** `.env.local` also has a `STORAGE_*` block (different ref again) from a Vercel storage integration — not the catalog DB.

**DDL / migrations:** the anon key cannot run DDL. Use the direct Postgres connection string `POSTGRES_URL_NON_POOLING` in `.env.local` — its pooler username (`postgres.<ref>`) confirms it targets the **live** app project, so it's the right credential for applying `supabase/migrations/*.sql` via `psql`.

**Why:** when applying the catalog schema/seed, three different refs appeared; only POSTGRES_URL_NON_POOLING gave DDL access to the project the app actually serves.

**How to apply:** before any schema migration, confirm the pooler username's `<ref>` matches the ref in `SUPABASE_URL`; ignore config.toml's project_id.
