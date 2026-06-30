---
name: Smoke tests / test runner
description: How to actually run the smoke tests on this project's Node version.
---

# Smoke tests / test runner

`npm test` runs `node --test tests/`, which on Node 22 fails with
`MODULE_NOT_FOUND` (it tries to load `tests/` as a module instead of scanning the
directory).

**How to apply:** Run the test file directly and point it at a running dev/prod
server:

```
SMOKE_BASE_URL=http://localhost:5000 node --test tests/smoke.test.mjs
```

The smoke tests hit a live HTTP server (they don't start one), so a workflow must
be running on the target port first. The `/product/smoke-test-product` case is
expected to pass via the honest "product not found" path (200), not via a seeded
fixture.
