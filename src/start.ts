import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
import { applySecurityHeaders } from "./lib/security-headers";
import { createRequestId, logError, serializeError } from "./lib/observability";

// Wraps every server request: assigns a correlation id, applies security
// headers to success and 500 responses, and emits a structured log when an
// unhandled error is converted to the fallback error page. Framework control
// flow (redirects / HTTP errors carrying `statusCode`) is rethrown untouched,
// preserving the prior behavior.
const requestPipeline = createMiddleware().server(async ({ next }) => {
  const requestId = createRequestId();
  try {
    const result = await next();
    applySecurityHeaders(result.response, requestId);
    return result;
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    logError("ssr.request.unhandled", { requestId, error: serializeError(error) });
    const response = new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
    return applySecurityHeaders(response, requestId);
  }
});

export const startInstance = createStart(() => {
  return {
    functionMiddleware: [attachSupabaseAuth],
    requestMiddleware: [requestPipeline],
  };
});

