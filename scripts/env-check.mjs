// Pre-deploy environment audit.
//
//   npm run check:env            # reads .env.local, then .env.production.local
//   npm run check:env -- --prod  # production env files first
//
// Checks variable presence/shape, then actually connects to the database and
// verifies the expected tables exist. R2 credentials are only checked for
// presence here — run `/api/health?deep=1` after deploying to HEAD the bucket.
import pg from "pg";
import { databaseUrl, describeUrl, isLocalUrl, loadEnv, poolConfig } from "./env.mjs";

const { Pool } = pg;
const prod = process.argv.includes("--prod");

const REQUIRED = {
  DATABASE_URL: "Postgres (Neon) connection string",
  ADMIN_KEY: "admin panel key",
  REVALIDATE_SECRET: "ISR webhook secret",
};

const R2_VARS = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "R2_PUBLIC_BASE_URL"];

const WEAK = new Set(["cosmo123", "change-me", "changeme", "admin", "password", "test"]);

let failures = 0;
let warnings = 0;

const pad = (s, n) => (s.length >= n ? s : s + " ".repeat(n - s.length));
function row(label, state, detail = "") {
  const mark = state === "ok" ? "OK  " : state === "warn" ? "WARN" : state === "info" ? "—   " : "FAIL";
  if (state === "fail") failures++;
  if (state === "warn") warnings++;
  console.log(`${mark}  ${pad(label, 26)} ${detail}`);
}

const mask = (v) => (!v ? "" : v.length <= 8 ? "*".repeat(v.length) : `${v.slice(0, 4)}…${v.slice(-4)}`);

const loaded = loadEnv(prod ? [".env.production.local", ".env.local", ".env"] : [".env.local", ".env.production.local", ".env"]);
console.log(`\nenv files: ${loaded.join(", ") || "(process env only)"}`);
console.log(`mode     : ${prod ? "production" : "development"}\n`);

// ---- presence ----
for (const [key, what] of Object.entries(REQUIRED)) {
  const v = process.env[key];
  if (!v) {
    row(key, "fail", `missing — ${what}`);
  } else if (WEAK.has(v)) {
    row(key, "warn", `weak value (${what}) — replace before going live`);
  } else if (key === "ADMIN_KEY" && v.length < 16) {
    row(key, "warn", `short (${v.length} chars) — use 32+ random chars`);
  } else {
    row(key, key === "DATABASE_URL" ? "ok" : "ok", key === "DATABASE_URL" ? describeUrl(v) : `${mask(v)} (${v.length} chars)`);
  }
}

// ---- storage ----
const driver = (process.env.STORAGE_DRIVER || "").toLowerCase();
const r2Present = R2_VARS.filter((k) => process.env[k]);
if (driver === "disk") {
  row("STORAGE_DRIVER", "warn", "disk — uploads will fail on Vercel (read-only fs); use r2");
} else if (r2Present.length === R2_VARS.length) {
  const base = process.env.R2_PUBLIC_BASE_URL;
  let baseUrl = null;
  try {
    const u = new URL(base);
    baseUrl = u.protocol === "https:" ? u : null;
  } catch {
    baseUrl = null;
  }
  row("STORAGE_DRIVER", "ok", `r2 (bucket: ${process.env.R2_BUCKET})`);
  row("R2_PUBLIC_BASE_URL", baseUrl ? "ok" : "fail", baseUrl ? base : `must be an https URL, got "${base}"`);
  if (baseUrl && /\.r2\.dev$/i.test(baseUrl.hostname)) {
    row("R2 public domain", "warn", "r2.dev is rate-limited — attach a custom domain for production");
  }
} else {
  row("R2_*", "fail", `incomplete — missing: ${R2_VARS.filter((k) => !process.env[k]).join(", ")}`);
}

// ---- optional but expected ----
for (const key of ["NEXT_PUBLIC_WP_URL", "WORDPRESS_REST_URL", "WORDPRESS_API_URL"]) {
  if (process.env[key]) row(key, "info", mask(process.env[key]) + " (optional)");
}
if (!process.env.VERCEL) row("VERCEL", "info", "not set — fs writes will go to data/*.json locally");

// ---- database ----
const url = databaseUrl();
if (!url) {
  console.log("\nSkipping DB checks (no DATABASE_URL).");
} else {
  const pool = new Pool(poolConfig(url));
  try {
    const started = Date.now();
    await pool.query("select 1");
    row("db connect", "ok", `${Date.now() - started} ms · ${isLocalUrl(url) ? "local" : "remote"}`);

    const version = (await pool.query("show server_version")).rows[0]?.server_version;
    row("db server_version", "info", version ?? "?");

    const expected = ["pages", "sections", "notices", "media", "inquiries", "site_docs"];
    const { rows } = await pool.query(
      "select table_name from information_schema.tables where table_schema = 'public'"
    );
    const have = new Set(rows.map((r) => r.table_name));
    const missing = expected.filter((t) => !have.has(t));
    if (missing.length) {
      row("db tables", "fail", `missing: ${missing.join(", ")} — run npm run db:migrate`);
    } else {
      row("db tables", "ok", expected.join(", "));
    }

    if (have.has("notices")) {
      const n = (await pool.query("select count(*)::int as c from notices")).rows[0].c;
      row("notices rows", n > 0 ? "ok" : "warn", n > 0 ? String(n) : "empty — run npm run db:seed");
    }
    if (have.has("site_docs")) {
      const n = (await pool.query("select count(*)::int as c from site_docs")).rows[0].c;
      row("site_docs rows", "info", String(n));
    }
  } catch (e) {
    row("db connect", "fail", e.message || e.code || String(e));
  } finally {
    await pool.end().catch(() => {});
  }
}

console.log(`\n${failures ? "FAILED" : "PASSED"} — ${failures} failure(s), ${warnings} warning(s)\n`);
process.exit(failures ? 1 : 0);
