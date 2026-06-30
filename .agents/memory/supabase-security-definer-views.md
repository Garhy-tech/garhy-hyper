---
name: Supabase security-definer views are an RLS bypass
description: Curated public views over locked-down base tables must carry every publication/active filter themselves; child-table RLS needs SECURITY DEFINER helpers to avoid recursion.
---

# security_invoker=false views bypass RLS â€” the view WHERE clause is the only gate

When you expose sensitive base tables to `anon` through a curated view created `WITH
(security_invoker = false)` (owner-privileged, the default), the view runs as its
owner (postgres) and **bypasses RLS on every base table it reads**. The view's own
`WHERE`/`JOIN` predicates are therefore the *only* access control on that data.

**Why:** This pattern is used to keep base pricing/inventory tables `service_role`-only
(zero anon grant) while still publishing a safe projection. But it is easy to forget
that the base-table RLS no longer protects anything reached through the view â€” a
review caught public price/availability views leaking rows for draft / inactive /
channel-ineligible products and inactive variants, plus tier rows outside their
validity window, purely because the view didn't re-filter them.

**How to apply:**
- In any owner-privileged public view, JOIN to the parent entity and replicate ALL
  publication filters explicitly: e.g. `p.is_active AND p.status='active' AND
  p.eligible_retail`, variant `is_active`, price-list `is_active`/channel, and
  validity windows (`valid_from <= now()`, `valid_to >= now()`) on every pricing view.
- A `CREATE OR REPLACE VIEW` cannot rename/reorder/retype existing columns â€” keep the
  exact SELECT column list when patching a view in place.

# Gating child-table RLS by parent publication without recursion

For public detail tables (variants, specs, media, options, etc.) whose rows belong to
a product, `USING (true)` leaks the relational detail of unpublished products. Gate
them by parent publication using a `SECURITY DEFINER STABLE` helper, e.g.
`is_public_product(uuid)` / `is_public_variant(uuid)` that `EXISTS`-checks a published
parent.

**Why:** A SECURITY DEFINER helper runs as the owner and bypasses RLS on the tables it
queries, so a child policy that calls it does **not** re-trigger the child's own RLS â†’
no recursion, and the check is deterministic regardless of caller role. Always pin
`SET search_path = public` and `REVOKE ALL ... FROM PUBLIC` then `GRANT EXECUTE` to the
specific roles, so the definer function can't be hijacked via search_path.


