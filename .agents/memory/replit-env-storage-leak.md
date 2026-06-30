---
name: Replit env storage vs leaked secrets
description: Where Replit actually stores env vars/secrets and which location leaks into git.
---

# Replit env storage: plaintext `.replit` vs encrypted Secrets

Replit has TWO distinct stores for environment values, and they have very
different security properties:

- **`[userenv.shared]` (and other `[userenv.*]`) in `.replit`** â€” stored as
  **plaintext in the tracked `.replit` file**, committed to git. In
  `viewEnvVars()` these show up under `envVars.shared`. `setEnvVars(...,
  environment:"shared")` writes here; `deleteEnvVars(keys, environment:"shared")`
  removes them (and edits `.replit`).
- **Encrypted Secrets store** â€” values are hidden; `viewEnvVars()` shows them
  under `secrets{}` as `KEY: true`. Populated only via the Secrets tab or
  `requestEnvVar({requestType:"secret", ...})`. The agent cannot read or set
  secret values directly.

**Why this matters:** putting a real secret (e.g. a Supabase `service_role`
JWT) into `[userenv.shared]` silently leaks it into version control even though
it "looks" like a managed env var. Auditing only `.env` misses this â€” check
`.replit` too.

**How to apply:**
- When securing leaked credentials, grep the working tree for the secret
  pattern (e.g. `eyJ` JWTs, `sb_publishable_`, `supabase.co`) with `rg -uu`
  and inspect tracked config files, especially `.replit`, not just `.env`.
- Public-by-design values (Supabase URL, anon/publishable keys that ship to the
  browser) are acceptable in `[userenv.shared]`. True secrets (service_role,
  DB passwords, API secrets) must live in the encrypted Secrets store instead.

**Neutralizing the historical leak (decision):** the old creds still live in git
history. The user chose to **rotate the Supabase keys** rather than scrub history.
**Why:** rotation instantly turns the leaked strings into dead values, and a
destructive git-history rewrite on Replit is platform-managed (needs Replit
support) â€” the agent cannot run git / rewrite history. After rotation the four
keys (`SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PUBLISHABLE_KEY`,
`VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) live in the encrypted
Secrets store, not `.replit`. To verify a rotation worked, exercise the new keys
against the LIVE project URL (`VITE_SUPABASE_URL` secret), not the dead `.env`
`SUPABASE_URL`: PostgREST read (publishable/anon â†’ 200), auth `/auth/v1/settings`
+ `/auth/v1/admin/users` (service_role â†’ 200). A `42501` table-grant 403 means the
key is valid but the role lacks a GRANT â€” not a credential failure (an invalid
key returns 401).
- The agent is blocked by the platform from writing to `.env` (secrets in the
  filesystem is an anti-pattern); use the env tooling, not file edits.
- Vite `loadEnv(mode, cwd, "VITE_")` overlays `process.env` on top of `.env`
  files (process.env wins), so values from the managed shared env are inlined
  into the build even when `.env` only has placeholders.

