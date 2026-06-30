/**
 * TanStack Start server-side Supabase client using @supabase/ssr.
 *
 * Usage inside createServerFn handlers or server middleware:
 *   import { createSupabaseServerClient } from "@/integrations/supabase/server";
 *   const supabase = createSupabaseServerClient(request);
 *
 * The caller must pass in the Web Request object so cookies can be read.
 * Cookie writes (Set-Cookie) are returned as headers you can append to the response.
 */
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./types";

/** Parse a Cookie header string into the array shape @supabase/ssr expects. */
function parseCookieHeader(header: string): { name: string; value: string }[] {
  if (!header) return [];
  return header
    .split(";")
    .map((pair) => {
      const idx = pair.indexOf("=");
      if (idx === -1) return null;
      return {
        name: pair.slice(0, idx).trim(),
        value: pair.slice(idx + 1).trim(),
      };
    })
    .filter(Boolean) as { name: string; value: string }[];
}

export type SerializedCookie = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

/**
 * Create a Supabase client for server-side use.
 *
 * @param request - The incoming Web Request (from getRequest() in TanStack Start)
 * @returns An object with `supabase` client and `cookiesToSet` array for response headers.
 */
export function createSupabaseServerClient(request: Request) {
  const url = process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || "";

  if (!url || !key) {
    throw new Error(`Missing Supabase env vars: SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY`);
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const pendingCookies: SerializedCookie[] = [];

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return parseCookieHeader(cookieHeader);
      },
      setAll(cookiesToSet) {
        pendingCookies.push(...cookiesToSet);
      },
    },
  });

  return { supabase, cookiesToSet: pendingCookies };
}


