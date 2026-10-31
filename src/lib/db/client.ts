import { Pool } from "pg";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// Singleton pool — safe for Next.js dev (HMR) and for Vercel, where each
// serverless instance keeps its own small pool alive between invocations.
//
// Neon notes:
//   • Use the **pooled** connection string (host contains `-pooler`) for the
//     app. Neon's PgBouncer multiplexes those connections, so `max` can stay
//     small without starving concurrent lambdas.
//   • Use the **direct** string for migrations (`DATABASE_URL_MIGRATE`),
//     because DDL through a transaction pooler is unreliable.
const globalForDb = globalThis as unknown as { __cosmoPool?: Pool };

function isLocal(connStr: string): boolean {
  return /(?:^|@)(localhost|127\.0\.0\.1|::1)(?::|\/|$)/i.test(connStr);
}

function sslFor(connStr: string): false | { rejectUnauthorized: boolean } {
  // Managed Postgres (Neon, Supabase, RDS, Railway) always requires TLS.
  if (isLocal(connStr)) return false;
  if (/[?&]sslmode=(disable|allow|prefer)/i.test(connStr)) return false;
  if (process.env.PGSSL === "no-verify") return { rejectUnauthorized: false };
  return { rejectUnauthorized: true };
}

function pool(): Pool {
  const connStr = process.env.DATABASE_URL;
  if (!connStr) throw new Error("DATABASE_URL missing");
  if (!globalForDb.__cosmoPool) {
    globalForDb.__cosmoPool = new Pool({
      connectionString: connStr,
      ssl: sslFor(connStr),
      // A long-running Node server (self-hosted) can afford a real pool; a
      // serverless function cannot, so keep that case small.
      max: Number(process.env.PG_POOL_MAX ?? (process.env.VERCEL ? 3 : 10)),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      allowExitOnIdle: true,
      // A stuck query should fail the request, not the function's whole budget.
      statement_timeout: Number(process.env.PG_STATEMENT_TIMEOUT_MS ?? 15_000),
    });
    // Without this, an idle-client error takes down the process.
    globalForDb.__cosmoPool.on("error", (err) => {
      console.error("[db] idle client error:", err.message);
    });
  }
  return globalForDb.__cosmoPool;
}

export function db(): NodePgDatabase<typeof schema> {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL missing");
  return drizzle(pool(), { schema });
}

/** True when a database is configured. Lets callers fall back to JSON seeds. */
export function dbAvailable(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/** Cheap liveness probe used by /api/health. */
export async function dbPing(): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const started = Date.now();
  try {
    await pool().query("select 1");
    return { ok: true, latencyMs: Date.now() - started };
  } catch (e) {
    return { ok: false, latencyMs: Date.now() - started, error: (e as Error).message };
  }
}

export { schema };
