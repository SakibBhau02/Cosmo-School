// Applies ./drizzle/*.sql to the configured database, in filename order.
// Tracks what has run in __migrations so it is safe to re-run.
//
//   npm run db:migrate                 # uses DATABASE_URL (.env.local)
//   npm run db:migrate -- --prod       # uses DATABASE_URL_MIGRATE / production env
//
// Prefer the *direct* (unpooled) Neon connection string here — DDL through a
// transaction pooler is unreliable.
import fs from "node:fs";
import path from "node:path";
import pg from "pg";
import { ROOT, databaseUrl, describeUrl, loadEnv, poolConfig } from "./env.mjs";

const { Pool } = pg;
const prod = process.argv.includes("--prod");

try {
  const loaded = loadEnv(
    prod
      ? [".env.production.local", ".env.local", ".env"]
      : [".env.local", ".env.production.local", ".env"]
  );
  const url = databaseUrl();
  if (!url) throw new Error("DATABASE_URL is not set");

  console.log(`env: ${loaded.join(", ") || "(process env only)"}`);
  console.log(`db : ${describeUrl(url)}`);

  const dir = path.join(ROOT, "drizzle");
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const pool = new Pool(poolConfig(url));
  await pool.query(
    "CREATE TABLE IF NOT EXISTS __migrations (name TEXT PRIMARY KEY, at TIMESTAMPTZ DEFAULT now())"
  );
  const done = new Set((await pool.query("SELECT name FROM __migrations")).rows.map((r) => r.name));

  for (const f of files) {
    if (done.has(f)) {
      console.log(`skip  ${f}`);
      continue;
    }
    console.log(`apply ${f}`);
    await pool.query(fs.readFileSync(path.join(dir, f), "utf8"));
    await pool.query("INSERT INTO __migrations (name) VALUES ($1)", [f]);
  }

  await pool.end();
  console.log(`migrate ok (${files.length} file${files.length === 1 ? "" : "s"})`);
} catch (e) {
  console.error("ERR", e.message);
  process.exit(1);
}
