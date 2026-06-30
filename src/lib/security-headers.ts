import process from "node:process";

// Server-side response hardening. Applied from the request middleware
// (src/start.ts) and the Nitro fetch boundary (src/server.ts) so every
// document, server-function, and fallback error response carries them.
//
// IMPORTANT (Replit): the dev preview renders the app inside a CROSS-ORIGIN
// iframe and Vite uses HMR websockets. Framing/CSP/HSTS restrictions would
// break that, so those are gated to production only. The always-on headers
// below are safe in development.

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function supabaseOrigin(): string {
  const url = process.env.SUPABASE_URL;
  if (!url) return "";
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
}

function buildContentSecurityPolicy(): string {
  const connectSrc = ["'self'", "https://*.supabase.co", "wss://*.supabase.co", supabaseOrigin()]
    .filter(Boolean)
    .join(" ");

  return [
    "default-src 'self'",
    // SSR hydration injects inline scripts/data; framework assets are same-origin.
    "script-src 'self' 'unsafe-inline'",
    // Tailwind/runtime inline styles + Google Fonts stylesheet.
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    // Product imagery comes from arbitrary https hosts.
    "img-src 'self' data: https:",
    `connect-src ${connectSrc}`,
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}

/**
 * Mutate and return the given response with security headers. Best-effort:
 * never throws on responses whose headers are immutable, so it can wrap any
 * response without risking the render.
 */
export function applySecurityHeaders<T extends { headers: Headers }>(
  response: T,
  requestId?: string,
): T {
  try {
    const headers = response.headers;
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    if (requestId) headers.set("X-Request-Id", requestId);

    if (isProduction()) {
      headers.set("Content-Security-Policy", buildContentSecurityPolicy());
      headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
      headers.set("X-Frame-Options", "SAMEORIGIN");
    }
  } catch {
    // Some responses expose immutable headers; security headers are best-effort
    // and must never break a response.
  }
  return response;
}

