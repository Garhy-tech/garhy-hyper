# Memory Index

- [Supabase catalog admin](supabase-catalog-admin.md) â€” service_role REST is 403 (no grants); wipe/seed catalog only via psql superuser using POSTGRES_URL_NON_POOLING.
- [Demo-content vs value-prop policy](demo-content-policy.md) â€” strip fabricated catalog data & inaccurate stats; keep legitimate store value props; numeric claims must trace to real config.
- [Live storefront staleness vs dev/DB](deployment-staleness.md) â€” "demo content still on live" after cleaning dev is usually a stale autoscale build; one shared Supabase project; confirm via getDeploymentInfo + curl/screenshot prod, then republish.
- [Premium design system](premium-design-system.md) â€” storefront already ships a mature glassmorphism system; deepen via tokens, don't rewrite; `Button asChild`+`Link`; ambient via `body::before`.
- [Security-definer views = RLS bypass](supabase-security-definer-views.md) â€” owner-privileged public views must re-filter ALL publication/active/validity predicates themselves; gate child-table RLS via SECURITY DEFINER `is_public_*` helpers (no recursion).

