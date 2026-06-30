import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Minimal WebSocket shim for Node.js 20 SSR.
 * @supabase/realtime-js throws when globalThis.WebSocket is absent.
 * Auth REST operations (getSession, signIn) are unaffected.
 */
function getWsTransport(): typeof WebSocket | undefined {
  if (typeof globalThis.WebSocket !== "undefined") return undefined;
  return class MinimalWS extends EventTarget {
    static CONNECTING = 0 as const;
    static OPEN = 1 as const;
    static CLOSING = 2 as const;
    static CLOSED = 3 as const;
    readyState: number = 3;
    url = "";
    protocol = "";
    extensions = "";
    bufferedAmount = 0;
    binaryType: BinaryType = "blob";
    onopen: ((this: WebSocket, ev: Event) => unknown) | null = null;
    onmessage: ((this: WebSocket, ev: MessageEvent) => unknown) | null = null;
    onerror: ((this: WebSocket, ev: Event) => unknown) | null = null;
    onclose: ((this: WebSocket, ev: CloseEvent) => unknown) | null = null;
    close() {}
    send() {}
  } as unknown as typeof WebSocket;
}

function createSupabaseClient() {
  const url = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "";

  if (!url || !key) {
    const missing = [
      ...(!url ? ["SUPABASE_URL"] : []),
      ...(!key ? ["SUPABASE_PUBLISHABLE_KEY"] : []),
    ];
    throw new Error(`Missing Supabase env var(s): ${missing.join(", ")}`);
  }

  const wsTransport = getWsTransport();

  return createBrowserClient<Database>(url, key, {
    ...(wsTransport ? { realtime: { transport: wsTransport } } : {}),
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});

