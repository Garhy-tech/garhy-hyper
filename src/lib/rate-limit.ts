import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { logWarn } from "./observability";

// In-memory fixed-window rate limiting, exposed as reusable TanStack Start
// function middleware. State is per-process: this protects single-instance
// deployments (e.g. Replit Reserved VM). A multi-instance / autoscale setup
// would need a shared store (Redis) â€” intentionally out of scope for this phase.

type WindowState = { count: number; resetAt: number };

const buckets = new Map<string, WindowState>();
const SWEEP_THRESHOLD = 5_000;

function clientIp(request: Request | undefined): string {
  if (!request) return "unknown";
  const headers = request.headers;
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? headers.get("cf-connecting-ip") ?? "unknown";
}

// Drop expired buckets only once the map grows large, so abusive traffic
// cannot leak memory indefinitely.
function sweep(now: number): void {
  if (buckets.size < SWEEP_THRESHOLD) return;
  for (const [key, state] of buckets) {
    if (state.resetAt <= now) buckets.delete(key);
  }
}

function take(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  sweep(now);
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  existing.count += 1;
  return existing.count <= limit;
}

export type RateLimitOptions = { name: string; limit: number; windowMs: number };

/** Build a function middleware that limits calls per client IP per window. */
export function createRateLimit({ name, limit, windowMs }: RateLimitOptions) {
  return createMiddleware({ type: "function" }).server(async ({ next }) => {
    const ip = clientIp(getRequest());
    if (!take(`${name}:${ip}`, limit, windowMs)) {
      logWarn("rate_limit.exceeded", { name, ip, limit, windowMs });
      throw new Error("Too many requests. Please slow down and try again shortly.");
    }
    return next();
  });
}

// Generous limits: real admins/users never hit them; runaway abuse is stopped.
export const adminFunctionRateLimit = createRateLimit({
  name: "admin-fn",
  limit: 120,
  windowMs: 60_000,
});

export const authGuardRateLimit = createRateLimit({
  name: "auth-guard",
  limit: 120,
  windowMs: 60_000,
});

