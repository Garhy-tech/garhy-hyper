---
name: Bilingual hardcoded-copy trap
description: This AR/EN app has screens/components that hardcode single-language copy instead of using t()/lang checks â€” bilingual or polish sweeps must grep for it.
---

# Bilingual hardcoded-copy trap

This storefront is bilingual (AR-RTL / EN-LTR), but not every screen routes its
copy through `t()` or `lang === "ar" ? â€¦ : â€¦`. Some files hardcode Arabic-only
strings, so in EN mode they still render Arabic (and vice-versa). The route
`head()` meta can also be hardcoded in one language.

**Why:** during a "polish every screen / make it bilingual" pass, styling-only
review missed that the contact surface rendered Arabic in EN mode â€” a real
bilingual acceptance failure that a CSS-only diff does not surface.

**How to apply:** for any bilingual / i18n / polish sweep, do NOT assume `t()` is
used everywhere. Grep components AND route files for Arabic literals (e.g.
`rg "[\u0600-\u06FF]" src`) and for hardcoded English headings; convert found
copy to bilingual via the established inline pattern (`const ar = lang === "ar"`)
using `useLanguage()` â€” note that editing `src/lib/locales/*` is often
out-of-scope, so inline `lang` checks are the safe way to translate existing
visible copy without touching locale files. Also check each route's `head()`
meta `title`/`description` â€” keep them consistent with sibling routes (the rest
of the app uses English titles like `"Shop â€” GARHY | HYPER"`).


