---
name: Design system tokens & glass
description: Premium palette/token conventions and glass utility rules in src/styles.css â€” what must stay consistent across screen work.
---

# Premium design system (src/styles.css)

The token + glass foundation. When polishing screens, reuse these â€” do NOT
reintroduce ad-hoc hex/oklch colors in components.

## Palette intent (4 brand colors)
- **Premium Blue** = primary identity â†’ drives `--primary`, `--brand`, `--ring`.
- **Luxury Purple** = secondary brand accent â†’ its OWN tokens `--luxury-purple(-foreground/-soft)`. It is NOT the shadcn `--secondary` (that stays a neutral surface).
- **Elegant Cyan** = `--cyan-accent` (used as text/gradient endpoint).
- **Minimal Gold** = `--gold(/-foreground)` â€” a REAL gold value.

**Why:** an earlier version aliased `--gold` to `--brand` (so "gold" rendered violet/blue) and tinted the neutral shadcn surfaces. Both were wrong. Keep gold real, and keep `secondary/accent/muted/card/popover` as NEUTRAL premium surfaces â€” the brand colors live in dedicated tokens, not in the surface tokens.

## Contrast
All token text pairs (fg/bg, primary/fg, brand-as-text, gold-as-text on bg AND on accent chips, cyan-as-text, conversion+white, destructive, muted-fg) are WCAG-AA (â‰¥4.5:1) in BOTH light and dark.
**How to apply:** if you change any token's lightness/chroma, re-verify with an oklchâ†’sRGBâ†’relative-luminance check before shipping.

## Glass
`.glass-panel / .glass-strong / .glass-header / .glass-popover` are plain CSS classes (compose with Tailwind rounding), using `color-mix` backgrounds + `backdrop-filter`. They ship with `@supports not(backdrop-filter)` opaque fallbacks AND a `prefers-reduced-transparency: reduce` fallback. Apply opt-in to shared chrome (header, drawers, dialogs, dropdowns, toaster), not per-screen content.

**Gotcha:** `glass-popover` (and `glass-strong`) already include their OWN `border` + `shadow-elevated`. Do NOT stack `border-hairline` / `shadow-*` on top â€” that double-borders. Swap to glass + keep only the rounding utility (e.g. toaster, country-switcher dropdown use `rounded-2xl glass-popover` with no extra border/shadow).

## Gradients
`gradient-brand` / `text-gradient-brand` / `gradient-conversion` are token-driven `@utility`s â€” use them instead of inline gradients (logo.tsx consumes them).

