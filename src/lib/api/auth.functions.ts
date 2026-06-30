import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireAdmin } from "@/integrations/supabase/admin-guard";
import { authGuardRateLimit } from "@/lib/rate-limit";

/**
 * Server-side defense-in-depth for the `_authenticated` route group. The route
 * also checks the session client-side, but this revalidates the bearer token at
 * the server boundary (via the generated `requireSupabaseAuth` middleware) and
 * is rate limited to blunt credential-stuffing against the guard.
 */
export const verifyAuthenticated = createServerFn({ method: "GET" })
  .middleware([authGuardRateLimit, requireSupabaseAuth])
  .handler(async () => {
    return { ok: true as const };
  });

/**
 * Server-side defense-in-depth for the admin section. Reuses `requireAdmin`
 * (rate limit + bearer-token validation + admin-role check) so the admin route
 * cannot be entered on a client-only `has_role` check alone.
 */
export const verifyAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    return { ok: true as const };
  });
