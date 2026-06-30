---
name: Demo-content vs value-prop policy
description: What counts as removable demo content vs legitimate store copy during production polish.
---

# Demo-content vs value-prop policy

When polishing this storefront for production ("remove all demo content"):

- **Remove**: fabricated catalog data (sample products, fake brands, fake
  reviews/ratings, fake prices/discounts, hardcoded coupon codes), lorem text, and
  any inaccurate statistic.
- **Keep**: genuine store value propositions — e.g. "secure payments",
  "authentic products", "curated marketplace", free-shipping threshold. Stripping
  these makes the store look unfinished and was not what the user asked for.

**Numeric claims rule:** any number shown to users (e.g. "shipping to N countries")
must trace to real config. The shipping-countries count must equal the configured
country list length (the country array in the commerce context). A hardcoded number
that disagrees with the list is a fake stat and must be corrected to match.

**Why:** the user wanted zero demo/fake content but still a premium-feeling store; a
number that didn't match the real country list (header/marquee said 12, the list had
15) was the kind of "fake stat" to fix, while value props are legitimate.

**How to apply:** during polish, hide/guard sections that have no real data, keep
value-prop copy, and verify every user-facing number against its source of truth.
