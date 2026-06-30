import { createMiddleware } from "@tanstack/react-start";

import { requireSupabaseAuth } from "./auth-middleware";
import { userHasAdminRole } from "./admin.server";
import { adminFunctionRateLimit } from "@/lib/rate-limit";
import { logWarn } from "@/lib/observability";

/**
 * Function middleware that authorizes admin-only server functions. Chains:
 *   1. rate limiting (per client IP),
 *   2. bearer-token authentication (generated `requireSupabaseAuth`),
 *   3. admin-role check via the service-role PostgREST helper.
 * Reused by every admin server function and by the `verifyAdmin` route guard.
 */
export const requireAdmin = createMiddleware({ type: "function" })
  .middleware([adminFunctionRateLimit, requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const isAdmin = await userHasAdminRole(context.userId);
    if (!isAdmin) {
      logWarn("authz.admin.forbidden", { userId: context.userId });
      throw new Error("Forbidden: admin role required");
    }
    return next();
  });
