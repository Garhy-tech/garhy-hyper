---
name: Replit preview & security response headers
description: Why framing/CSP/HSTS response headers must be production-gated on Replit, or the dev preview breaks.
---

# Security headers vs the Replit preview

When adding server-set security response headers, **gate the framing-restrictive
ones to production only** (`process.env.NODE_ENV === "production"`):
`Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, and
CSP `frame-ancestors`.

Always-on (safe in dev): `X-Content-Type-Options`, `Referrer-Policy`,
`Permissions-Policy`, `X-Request-Id`.

**Why:** the Replit workspace preview pane renders the running app inside a
**cross-origin iframe** (proxied via mTLS), and dev uses Vite **HMR websockets**.
`X-Frame-Options: SAMEORIGIN` / `frame-ancestors 'self'` block the preview iframe,
and a strict CSP can block HMR â€” both make the preview pane go blank during
development while looking fine in a normal browser tab.

**How to apply:** apply the headers from the request middleware / server fetch
boundary; verify the production set by running the built server with
`NODE_ENV=production node .output/server/index.mjs` on a spare port and
`curl -D -`. CSP `connect-src` must include the Supabase origin (resolve from
`SUPABASE_URL`) plus `https://*.supabase.co` and `wss://*.supabase.co`; product
images come from arbitrary hosts so `img-src` needs `https:`.

