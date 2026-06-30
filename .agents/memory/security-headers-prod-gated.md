---
name: Security headers are production-gated
description: CSP/HSTS/X-Frame-Options only emit when NODE_ENV=production on the BUILT server â€” absent in the dev preview; how to verify them.
---

# Security headers are production-gated

The Phase 2 hardening headers in `src/lib/security-headers.ts` split into two
groups:

- **Always set** (dev + prod): `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `X-Request-Id`.
- **Production-only** (gated by `NODE_ENV === "production"`): full
  `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`.

**Why:** CSP/HSTS would break the Vite dev server (HMR, inline tooling, http),
so they are intentionally skipped in dev. Their absence in the dev preview is
NOT a bug.

**How to verify (QA):** build, then run the standalone server and curl it â€”
`NODE_ENV=production PORT=<p> node .output/server/index.mjs` then
`curl -sI http://localhost:<p>/`. Do not expect CSP/HSTS in `vite dev` on :5000.
Headers are applied at two boundaries: `src/start.ts` (normal pipeline) and
`src/server.ts` (catastrophic SSR fallback).

