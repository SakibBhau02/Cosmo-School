// Create (or reset) the admin login used by /admin.
//
//   npm run db:migrate     # ensure the schema exists
//   npm run seed:admin     # create/reset the login
//
// Credentials come from ADMIN_EMAIL / ADMIN_PASSWORD. If ADMIN_PASSWORD is not
// set a strong one is generated and printed once — copy it before closing the
// terminal. Pass --prod to use .env.production.local.
import { randomBytes, scryptSync } from "node:crypto";
import pg from "pg";

import { databaseUrl, describeUrl, isLocalUrl, loadEnv, poolConfig } from "./env.mjs";

const prod = process.argv.includes("--prod");
const loaded = loadEnv(prod ? [".env.production.local"] : undefined);
const url = databaseUrl();

if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const email = (process.env.ADMIN_EMAIL || "admin@cosmoschools.org").trim().toLowerCase();
const generated = !process.env.ADMIN_PASSWORD;
const password = process.env.ADMIN_PASSWORD || randomBytes(9).toString("base64url");
const name = process.env.ADMIN_NAME || "Site Admin";
const role = process.env.ADMIN_ROLE || "superadmin";

if (!isLocalUrl(url) && prod && process.env.ALLOW_PROD_SEED !== "1") {
  console.error(
    `Refusing to touch ${describeUrl(url)}.\n` +
      "Re-run with ALLOW_PROD_SEED=1 if this is intentional.",
  );
  process.exit(1);
}

function hash(password) {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

const client = new pg.Client(poolConfig(url));

try {
  await client.connect();

  const table = await client.query(
    "select to_regclass('public.users') as name, to_regclass('public.sessions') as sessions",
  );
  if (!table.rows[0]?.name || !table.rows[0]?.sessions) {
    console.error("Schema is missing. Run `npm run db:migrate` first.");
    process.exit(1);
  }

  await client.query(
    `insert into users (email, password_hash, name, role)
     values ($1, $2, $3, $4)
     on conflict (email) do update
       set password_hash = excluded.password_hash,
           name = excluded.name,
           role = excluded.role`,
    [email, hash(password), name, role],
  );

  // Any existing session for this account is now stale.
  await client.query(
    "delete from sessions where user_id in (select id from users where email = $1)",
    [email],
  );

  console.log(`Admin login ready on ${describeUrl(url)} (env: ${loaded.join(", ") || "process env"})`);
  console.log(`  email:    ${email}`);
  console.log(`  password: ${password}${generated ? "   ← generated, save it now" : ""}`);
  console.log(`  role:     ${role}`);
  console.log("\nSign in at /admin/login");
} catch (error) {
  console.error("Failed:", error.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
