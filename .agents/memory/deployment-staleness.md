---
name: Live storefront staleness vs dev/DB
description: Why "demo content still on the live site" after cleaning dev is usually a stale deployment, and how to confirm it.
---

# Live storefront staleness vs dev / DB

This project has **one** Supabase project shared by dev and prod (no separate
production database). Wiping the catalog via psql affects what both dev and the
live site read.

The app deploys as an **autoscale** target serving a built artifact
(`.output/server/index.mjs`, Nitro `node-server` SSR â€” no SSG/prerender). Two
consequences:

- The live site fetches catalog data from Supabase **at request time**, so an
  empty DB shows empty catalog/empty-states on the live site immediately, with no
  redeploy needed.
- Autoscale does **not** auto-redeploy when code (or the DB) changes. Source/markup
  changes (hero copy, marquee, section guards, etc.) only reach the live site when
  the user **republishes** (clicks Publish). Until then the live site serves the
  old build's static markup even though the DB is already clean.

So a report of "demo content still visible on the live storefront" after dev was
cleaned is almost always a **stale build**: stale marketing copy and unguarded
section shells, not real demo products (those come from the now-empty DB).

**How to confirm (do this before changing any code):**
1. `getDeploymentInfo()` â†’ get `primaryUrl`, confirm `isDeployed`/`hasSuccessfulBuild`.
2. Screenshot or `curl` the production URL and compare against the dev preview.
3. `curl` the live HTML and grep for product links (`/product/`), external `<img>`
   srcs, supabase `storage` image refs, and demo brand names. Zero of those = no
   real demo data on the live site; the difference is just an old build.

**Fix:** republish (user-initiated Publish). The agent cannot publish; use
`suggestDeploy()` and tell the user to click Publish.

**Why this matters:** it prevents hunting for a non-existent hardcoded/demo data
source in code when the real cause is deployment freshness.


