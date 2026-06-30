---
name: Supabase + Node.js 20 WebSocket fix
description: createClient() throws in Node.js 20 SSR because Realtime needs WebSocket. Fix by providing a transport shim.
---

## The problem

`createClient()` from `@supabase/supabase-js` throws:

> Error: Node.js 20 detected without native WebSocket support.

This happens because `@supabase/realtime-js` checks `typeof globalThis.WebSocket` in its constructor and throws if absent AND no `transport` option is provided. Node.js 22+ has native WebSocket; Node.js 20 does not.

## The fix (implemented in `src/integrations/supabase/client.ts`)

Detect the missing WebSocket and pass a minimal shim class as the `realtime.transport` option:

```typescript
const wsTransport =
  typeof globalThis.WebSocket !== "undefined"
    ? undefined
    : (MinimalWS as unknown as typeof WebSocket); // shim class defined in same file

createClient(url, key, {
  ...(wsTransport ? { realtime: { transport: wsTransport } } : {}),
});
```

**Why:** Auth REST operations (`getSession`, `signIn`) don't use Realtime; they work fine with the shim. Realtime broadcast features become inert server-side (acceptable for SSR).

**How to apply:** Any time the Supabase client is initialized in a Node.js 20 SSR context. The shim is synchronous, ESM-safe, and requires no extra packages.

**Alternative:** Install `ws` and use `realtime: { transport: ws }` to enable real Realtime in SSR.

**Decision:** `ws` / `@types/ws` are intentionally NOT dependencies of this project â€” the self-contained shim above is used instead. Do not re-add `ws` assuming it is a missing dependency; only add it if you genuinely need server-side Realtime channels.

## Status: project now runs on Node 22

The runtime was bumped Node 20 â†’ 22 (`package.json` engines `node >=22.12.0`, `.replit` module `nodejs-22`) â€” TanStack Start deps require >=22.12.0. Node 22 ships a global `WebSocket`, so the shim path above is now **inert** (`wsTransport` resolves to `undefined`) and `createClient()` no longer throws. The shim is harmless and kept for back-compat; the `ws` decision above still stands.


