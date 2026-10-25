// Shared env loader for the node scripts (migrations, seeds, checks).
// Next.js loads .env.local on its own; plain node does not, so we do it here
// without pulling in dotenv.
//
// Precedence: real process env > first matching file.
// Order: .env.local, .env.production.local, .env (override with COSMO_ENV_FILE).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parse(text) {
  const out = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    } else {
      const hash = value.indexOf(" #");
      if (hash !== -1) value = value.slice(0, hash).trim();
    }
    out[m[1]] = value;
  }
  return out;
}

export function loadEnv(files) {
  const list = files ?? (process.env.COSMO_ENV_FILE ? [process.env.COSMO_ENV_FILE] : [".env.local", ".env.production.local", ".env"]);
  const loaded = [];
  for (const name of list) {
    const file = path.isAbsolute(name) ? name : path.join(ROOT, name);
    if (!fs.existsSync(file)) continue;
    for (const [k, v] of Object.entries(parse(fs.readFileSync(file, "utf8")))) {
      if (process.env[k] === undefined) process.env[k] = v;
    }
    loaded.push(path.basename(file));
  }
  return loaded;
}

/** Migrations prefer the direct (unpooled) Neon URL when both are present. */
export function databaseUrl() {
  return process.env.DATABASE_URL_MIGRATE || process.env.DATABASE_URL || "";
}

/** `postgres://user:pw@host/db` → `user@host/db` for safe logging. */
export function describeUrl(url) {
  try {
    const u = new URL(url);
    return `${u.username}@${u.hostname}${u.port ? ":" + u.port : ""}${u.pathname}`;
  } catch {
    return "(invalid DATABASE_URL)";
  }
}

export function isLocalUrl(url) {
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return false;
  }
}

/** Neon and every managed provider need TLS; local Docker Postgres does not. */
export function poolConfig(url) {
  const local = isLocalUrl(url);
  const ssl =
    local || /[?&]sslmode=(disable|allow|prefer)/i.test(url)
      ? undefined
      : { rejectUnauthorized: process.env.PGSSL !== "no-verify" };
  return { connectionString: url, ssl, max: 1 };
}
