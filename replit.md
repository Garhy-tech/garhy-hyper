# GARHY | HYPER

Full-stack bilingual (Arabic / English) e-commerce storefront and admin
dashboard built on TanStack Start (React 19, SSR), Supabase, and Tailwind CSS v4.

## Overview

- **Framework:** TanStack Start + TanStack Router (file-based routing), React 19 SSR.
- **Server build:** Nitro `node-server` preset â†’ `.output/server/index.mjs`.
- **Data / auth:** Supabase (`@supabase/ssr`, PostgREST), TanStack Query.
- **Styling:** Tailwind CSS v4 + Lightning CSS.
- **i18n:** i18next (AR/EN, RTL aware).
- **Runtime:** Node.js â‰¥ 20, npm â‰¥ 10. Dev server on `0.0.0.0:5000`.

## Running

- `npm run dev` â€” dev server (port 5000).
- `npm run build` â€” production build.
- `npm run start` â€” run the built server (`node .output/server/index.mjs`).
- `npm run lint` / `npm run format` â€” ESLint / Prettier.
- `npx tsc --noEmit` â€” type check.

## Environment

Requires four Supabase variables â€” `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`
(server) and `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (client).
Copy `.env.example` to `.env`. See `docs/ENVIRONMENT.md`.

## Documentation

- `README.md` â€” developer guide and scripts.
- `docs/ARCHITECTURE.md` â€” runtime architecture.
- `docs/ENVIRONMENT.md` â€” env vars, secrets, deployment.
- `src/routes/README.md` â€” routing conventions.

## Conventions

- Do not edit `src/routeTree.gen.ts` (generated) or rename/move files under
  `src/routes/` (breaks file-based routing).
- `@/*` resolves to `src/*` (tsconfig paths + Vite alias).
- Keep secrets in server-only `process.env`; never behind `VITE_` names.

## User preferences

_None recorded yet._

