import process from "node:process";

/**
 * Server-only privileged Supabase access for admin write operations.
 *
 * Uses the SERVICE-ROLE key (full DB access, bypasses RLS), so this file must
 * NEVER reach the client bundle. The `.server.ts` suffix guarantees Vite strips
 * it from the browser build, and it is only ever imported from server-side
 * middleware / createServerFn handlers.
 *
 * We talk to PostgREST over plain fetch (no @supabase/supabase-js client) to
 * avoid the realtime/WebSocket initialisation that throws under Node.js 20 SSR
 * â€” the same approach used by the read-only catalog layer.
 */

function getServiceConfig() {
  const url = process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !key) {
    const missing = [
      ...(!url ? ["SUPABASE_URL"] : []),
      ...(!key ? ["SUPABASE_SERVICE_ROLE_KEY"] : []),
    ];
    throw new Error(`Missing Supabase admin env var(s): ${missing.join(", ")}`);
  }
  return { url, key };
}

function serviceHeaders(extra?: Record<string, string>) {
  const { key } = getServiceConfig();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    ...extra,
  };
}

async function failOnError(res: Response, action: string): Promise<void> {
  if (res.ok) return;
  const body = await res.text().catch(() => "");
  let message = body;
  try {
    const parsed = JSON.parse(body) as { message?: string; details?: string; hint?: string };
    message = parsed.message || parsed.details || parsed.hint || body;
  } catch {
    /* keep raw body */
  }
  throw new Error(`${action} failed (${res.status}): ${message || res.statusText}`);
}

/** SELECT rows from a table. */
export async function adminSelect<T>(table: string, params: Record<string, string>): Promise<T[]> {
  const { url } = getServiceConfig();
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${url}/rest/v1/${table}?${qs}`, {
    headers: serviceHeaders(),
  });
  await failOnError(res, `Read ${table}`);
  return (await res.json()) as T[];
}

/** INSERT a single row and return the created record. */
export async function adminInsert<T>(table: string, row: Record<string, unknown>): Promise<T> {
  const { url } = getServiceConfig();
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: serviceHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(row),
  });
  await failOnError(res, `Create ${table}`);
  const rows = (await res.json()) as T[];
  return rows[0];
}

/** UPDATE a single row by id and return the updated record. */
export async function adminUpdate<T>(
  table: string,
  id: string,
  patch: Record<string, unknown>,
): Promise<T> {
  const { url } = getServiceConfig();
  const res = await fetch(`${url}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: serviceHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(patch),
  });
  await failOnError(res, `Update ${table}`);
  const rows = (await res.json()) as T[];
  if (!rows[0]) throw new Error(`Update ${table} failed: no row with id ${id}`);
  return rows[0];
}

/** DELETE a single row by id. */
export async function adminDelete(table: string, id: string): Promise<void> {
  const { url } = getServiceConfig();
  const res = await fetch(`${url}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: serviceHeaders({ Prefer: "return=minimal" }),
  });
  await failOnError(res, `Delete ${table}`);
}

/** True if the given user id has the `admin` role in user_roles. */
export async function userHasAdminRole(userId: string): Promise<boolean> {
  const rows = await adminSelect<{ user_id: string }>("user_roles", {
    select: "user_id",
    user_id: `eq.${userId}`,
    role: "eq.admin",
    limit: "1",
  });
  return rows.length > 0;
}

