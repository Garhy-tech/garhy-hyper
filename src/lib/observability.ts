// Lightweight structured logging + request correlation for the server
// boundaries (request middleware, Nitro fetch entry, auth/rate-limit guards).
// Output is single-line JSON so it is greppable in deployment logs. Kept
// dependency-free and additive â€” existing console.error sites are untouched.

export type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

// Keys whose values must never be written to logs.
const SENSITIVE_KEY =
  /(authorization|cookie|set-cookie|api[-_]?key|token|password|secret|service[-_]?role)/i;

function sanitize(context?: LogContext): LogContext | undefined {
  if (!context) return undefined;
  const out: LogContext = {};
  for (const [key, value] of Object.entries(context)) {
    out[key] = SENSITIVE_KEY.test(key) ? "[redacted]" : value;
  }
  return out;
}

/** Stable request correlation id; uses Web Crypto when available. */
export function createRequestId(): string {
  const cryptoObj = (globalThis as { crypto?: Crypto }).crypto;
  if (cryptoObj && typeof cryptoObj.randomUUID === "function") {
    return cryptoObj.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Normalise an unknown thrown value into a safe, loggable shape. */
export function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return { value: String(error) };
}

function emit(level: LogLevel, message: string, context?: LogContext): void {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    msg: message,
    ...sanitize(context),
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export function logInfo(message: string, context?: LogContext): void {
  emit("info", message, context);
}

export function logWarn(message: string, context?: LogContext): void {
  emit("warn", message, context);
}

export function logError(message: string, context?: LogContext): void {
  emit("error", message, context);
}

