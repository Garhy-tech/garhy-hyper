---
name: SSR i18n hydration trap
description: Why the storefront crashed on hydration and the rule for i18next language init under SSR.
---

# SSR i18next hydration mismatch

**Rule:** under SSR (TanStack Start / React 19), the i18next initial `lng` must be a
fixed constant that is identical on server AND the first client render. Do NOT set
`lng: undefined` on the client expecting the detector to "switch after hydration."

**Why:** with `initAsync: false` and `i18next-browser-languagedetector` registered,
`lng: undefined` makes the detector run *synchronously during `i18n.init()`* and pick
the user's stored language (e.g. `ar` from localStorage `rw_lang`). The server,
meanwhile, renders with the fixed fallback (`en`). So the first hydrating client
render is Arabic while the SSR HTML is English â†’ React throws a hydration mismatch
(seen as Home vs ط§ظ„ط±ط¦ظٹط³ظٹط© in the mobile bottom nav), which in dev cascades into a
misleading "Invalid hook call" error and a crash. React is correctly deduped, so the
hook error is a symptom, not the cause.

**How to apply:**
- `src/lib/i18n.ts`: set `lng: "en"` unconditionally.
- Apply the user's real language AFTER hydration: a mount-only `useEffect` in
  `LangSync` (providers.tsx) reads `i18n.services.languageDetector.detect()` and calls
  `i18n.changeLanguage(target)` for supported langs only. The detector still persists
  to localStorage via `caches: ["localStorage"]` on changeLanguage.
- `<html lang dir>` in __root.tsx stays `en`/`ltr` with `suppressHydrationWarning`;
  LangSync updates them post-hydration.
- Accepted tradeoff: a brief ENâ†’AR flash on first load for Arabic-preferring users
  (single-fallback SSR has no per-request language). Eliminating it would require
  per-request language (cookie) â€” a larger architecture change, not a bug.


