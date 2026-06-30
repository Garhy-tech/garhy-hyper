---
name: Premium design system (deepen, don't rewrite)
description: The storefront already ships a mature glassmorphism design system; how to extend it safely.
---

# Premium glassmorphism design system

The storefront already has a complete, enterprise-grade premium design system. When
a request says "redesign / make it premium / glassmorphism", **deepen the existing
direction â€” do not rip it up and rebuild.** A from-scratch redesign here is wasted
effort and risks regressing a well-architected system.

What already exists (all token-driven in `src/styles.css`, Tailwind v4 `@theme`):
- oklch palette matching the brief: Premium/Royal Blue (`--brand`/`--primary`),
  Luxury Purple, Cyan accent, Gold; soft near-`#F7F9FC` light bg; deep-navy (never
  black) dark bg via `.dark`.
- `.glass-panel` / `.glass-strong` / `.glass-header` / `.glass-popover` with
  `@supports`/`prefers-reduced-transparency` opaque fallbacks; elevated/soft/glass
  shadows; `gradient-brand` / `text-gradient-brand` utilities.
- Full RTL via logical props + Tajawal fonts; next-themes light/dark; existing
  mobile bottom nav, mega-menu, cart drawer, search overlay; framer-motion cards.

**Why:** when "the live site looks unpolished/has demo data," the cause is almost
always a stale deployment, not the code (see deployment-staleness.md). The dev build
is already premium.

**How to apply / safe extension points:**
- Global ambient depth: a token-driven aurora via `body::before` (fixed,
  `z-index:-1`, `pointer-events:none`, with a `.dark` variant + reduced-transparency
  opt-out). It only shows where route wrappers are transparent â€” the home wrapper
  must NOT set an opaque `bg-background` (body supplies the base color).
- Buttons that navigate: use `<Button asChild><Link/></Button>`, never
  `<Link><Button/></Link>` (the latter nests `<button>` inside `<a>` = invalid HTML,
  bad a11y). Note: legacy code across the app still uses the wrong pattern.
- Empty catalog: render elegant, intentional empty states (e.g. a "launching soon"
  glass band on home), never blank gaps or infinite shimmer.


