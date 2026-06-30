# Environment & deployment

## Required variables

Copy `.env.example` to `.env` and provide values for all four:

| Variable                       | Scope        | Read via                       | Purpose                                            |
| ------------------------------ | ------------ | ------------------------------ | -------------------------------------------------- |
| `SUPABASE_URL`                 | Server       | `process.env`                  | Supabase project URL for SSR / server functions    |
| `SUPABASE_PUBLISHABLE_KEY`     | Server       | `process.env`                  | Supabase anon/publishable key for SSR              |
| `VITE_SUPABASE_URL`            | Client       | `import.meta.env`              | Supabase project URL for the browser client        |
| `VITE_SUPABASE_PUBLISHABLE_KEY`| Client       | `import.meta.env`              | Supabase anon/publishable key for the browser      |

Notes:

- The server clients (`src/integrations/supabase/server.ts`,
  `auth-middleware.ts`) require `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`
  and throw a clear error if they are missing.
- The browser client (`src/integrations/supabase/client.ts`) and the PostgREST
  data layer (`src/lib/api/catalog.functions.ts`) prefer the `VITE_`-prefixed
  values and fall back to the server names where available.
- Only the **publishable / anon** key belongs in `VITE_` variables — they are
  inlined into the client bundle and shipped to the browser. **Never** put a
  service-role key or any secret behind a `VITE_` name.

## Which Supabase project is authoritative

There are several Supabase project refs scattered across this repo's config —
**only one is the live project** the app reads/writes:

| Ref                    | Status        | Where it appears                                                                 |
| ---------------------- | ------------- | ------------------------------------------------------------------------------- |
| `schysxhvoqsjtscfktwn` | **Live (source of truth)** | `SUPABASE_URL` / `VITE_SUPABASE_URL` secrets, the `POSTGRES_*` pooler usernames in `.env.local`, and `supabase/config.toml` `project_id`. |
| `kpvnvpujuftdwguycthy` | Unrelated     | The `STORAGE_*` / `NEXT_PUBLIC_STORAGE_*` block in `.env.local` — a separate Vercel storage integration project, **not** the catalog/auth DB. |

Always confirm the `postgres.<ref>` pooler username in `.env.local` matches the
ref in `SUPABASE_URL` before running the Supabase CLI (`supabase link` /
`db push`) or applying migrations. `supabase/config.toml` now records the live
ref, so the CLI links to the correct project by default. Ignore the `STORAGE_*`
block for anything database-schema related.

## How variables are loaded

`vite.config.ts` calls `loadEnv(mode, cwd, "VITE_")` and inlines each `VITE_`
variable into `define` (`import.meta.env.<NAME>`), guaranteeing they are
available in both the client and SSR bundles. Server-only variables are read
from `process.env` at request time (see `src/lib/config.server.ts` for the
recommended per-request access pattern).

## Secrets handling

- `.env` is listed in `.gitignore` (`.env*`) and must never be committed.
- Add new server-only secrets through `process.env` (and, if reused across
  handlers, via `src/lib/config.server.ts`) — not through `VITE_` variables.

> **Security note:** A real `.env` file is currently tracked in git history for
> this repository even though `.gitignore` excludes `.env*`. Treat the Supabase
> values it contains as exposed: rotate them and remove the file from version
> control. This cleanup was intentionally left out of the code-cleanup task
> because it requires rewriting git history and rotating live credentials.

## Running in production

```bash
npm run build        # emits .output/server/index.mjs (Nitro node-server)
npm run start        # node .output/server/index.mjs
```

Provide all four environment variables in the production environment before
starting the server. The process listens on the port configured by the host
environment (dev defaults to `0.0.0.0:5000`).

## Database / migrations

This application's catalog data layer only *reads* from Supabase (auth flows
still perform Supabase auth operations). Schema migrations and data seeding are
managed outside the app. When the schema is absent or empty, the data layer
returns empty results and the UI shows localized empty states rather than
failing — so the app boots cleanly against an unmigrated database.
