/**
 * Smoke tests for GARHY | HYPER.
 *
 * Loads the key public routes against a running dev server and asserts each one
 * renders server-side without crashing into the SSR error page. These tests are
 * intentionally lightweight (zero extra dependencies — Node's built-in test
 * runner + global fetch) so they can run in CI or locally as a fast regression
 * check after dependency / dead-code cleanups.
 *
 * They are designed to pass against a clean environment with an empty database:
 * the catalog API helpers return empty arrays when tables are missing/empty and
 * the product route renders a graceful "product not found" state for unknown
 * slugs, so every page should still render without an SSR crash.
 *
 * Usage:
 *   npm test                       # spawns `npm run dev`, runs, then stops it
 *   SMOKE_BASE_URL=http://host npm test   # reuse an already-running server
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import process from "node:process";

const BASE_URL = (process.env.SMOKE_BASE_URL ?? "http://localhost:5000").replace(/\/$/, "");
const SERVER_BOOT_TIMEOUT_MS = 120_000;

/** Marker emitted by src/lib/error-page.ts when SSR throws. */
const ERROR_PAGE_MARKER = "This page didn't load";

/** Routes that should render without an SSR crash in a clean environment. */
const ROUTES = [
  { name: "home", path: "/" },
  { name: "catalog", path: "/catalog" },
  { name: "product", path: "/product/smoke-test-product" },
  { name: "auth", path: "/auth" },
  { name: "admin", path: "/admin" },
];

let serverProc;

async function probe(url) {
  try {
    const res = await fetch(url, { redirect: "manual" });
    return res.status > 0;
  } catch {
    return false;
  }
}

async function waitForServer(url, { timeoutMs, intervalMs = 500 } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await probe(url)) return;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error(`Dev server never became ready at ${url} within ${timeoutMs}ms`);
}

before(
  async () => {
    // Reuse an already-running server (e.g. SMOKE_BASE_URL or a dev workflow).
    if (await probe(`${BASE_URL}/`)) return;

    serverProc = spawn("npm", ["run", "dev"], {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env },
      detached: true,
    });
    // Drain output so the child never blocks on a full pipe buffer.
    serverProc.stdout?.on("data", () => {});
    serverProc.stderr?.on("data", () => {});

    await waitForServer(`${BASE_URL}/`, { timeoutMs: SERVER_BOOT_TIMEOUT_MS });
  },
  { timeout: SERVER_BOOT_TIMEOUT_MS + 10_000 },
);

after(async () => {
  if (serverProc?.pid) {
    try {
      // Kill the whole process group (vite spawns children).
      process.kill(-serverProc.pid, "SIGTERM");
    } catch {
      /* already gone */
    }
  }
});

for (const route of ROUTES) {
  test(`${route.name} (${route.path}) renders without errors`, async () => {
    const res = await fetch(`${BASE_URL}${route.path}`, {
      redirect: "manual",
      headers: { accept: "text/html" },
    });

    // A redirect (e.g. an auth-gated route bouncing to /auth) is an acceptable,
    // non-crashing response; only a 4xx/5xx indicates a broken route.
    const isRedirect = res.status >= 300 && res.status < 400;
    assert.ok(
      res.status === 200 || isRedirect,
      `expected 200 or redirect for ${route.path}, got ${res.status}`,
    );

    if (res.status === 200) {
      const body = await res.text();
      assert.match(body, /<html/i, `${route.path} did not return an HTML document`);
      assert.ok(
        !body.includes(ERROR_PAGE_MARKER),
        `${route.path} rendered the SSR error page`,
      );
    }
  });
}
