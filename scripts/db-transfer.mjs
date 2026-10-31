// Copy the CMS data from one Postgres to another (e.g. Neon → your own server).
//
//   node scripts/db-transfer.mjs --from="postgres://…neon…" --to="postgres://…self-hosted…"
//   node scripts/db-transfer.mjs --from=… --to=… --dry-run
//   node scripts/db-transfer.mjs --from=… --to=… --only=content_docs,notices
//
// What it does: reads the table list, truncates the target tables (CASCADE,
// RESTART IDENTITY), then streams every row across in batches inside one
// transaction per table. Sessions are never copied — everybody signs in again.
//
// Always take a dump of the target first:
//   pg_dump "$TO" > backup-before-transfer.sql
import pg from "pg";

function arg(name, fallback = "") {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

const from = arg("from", process.env.FROM_DATABASE_URL ?? "");
const to = arg("to", process.env.TO_DATABASE_URL ?? "");
const dryRun = process.argv.includes("--dry-run");
const only = arg("only")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (!from || !to) {
  console.error(
    "Usage: node scripts/db-transfer.mjs --from=<source-url> --to=<target-url> [--only=t1,t2] [--dry-run]",
  );
  process.exit(1);
}
if (from === to) {
  console.error("Source and target are the same database.");
  process.exit(1);
}

/** Parents before children so foreign keys hold. */
const ORDER = [
  "users",
  "media",
  "pages",
  "sections",
  "list_items",
  "teachers",
  "events",
  "testimonials",
  "notices",
  "inquiries",
  "site_docs",
  "content_docs",
  "content_versions",
  "audit_log",
];

const BATCH = 200;

function ssl(url) {
  return /(?:^|@)(localhost|127\.0\.0\.1|db)(?::|\/|$)/.test(url) ||
    /[?&]sslmode=disable/.test(url)
    ? undefined
    : { rejectUnauthorized: process.env.PGSSL !== "no-verify" };
}

async function main() {
  const source = new pg.Client({ connectionString: from, ssl: ssl(from) });
  const target = new pg.Client({ connectionString: to, ssl: ssl(to) });
  await source.connect();
  await target.connect();

  const existing = await target.query(
    "select tablename from pg_tables where schemaname = 'public'",
  );
  const present = new Set(existing.rows.map((r) => r.tablename));

  const tables = ORDER.filter((t) => present.has(t)).filter(
    (t) => only.length === 0 || only.includes(t),
  );

  if (tables.length === 0) {
    console.error("No matching tables in the target database. Run migrations first.");
    process.exit(1);
  }

  console.log(`source: ${from.replace(/\/\/[^@]*@/, "//***@")}`);
  console.log(`target: ${to.replace(/\/\/[^@]*@/, "//***@")}`);
  console.log(`tables: ${tables.join(", ")}${dryRun ? "  (dry run)" : ""}`);

  if (!dryRun) {
    await target.query(
      `TRUNCATE ${tables.map((t) => `"${t}"`).join(", ")} RESTART IDENTITY CASCADE`,
    );
  }

  let total = 0;
  for (const table of tables) {
    const { rows } = await source.query(`SELECT * FROM "${table}"`);
    if (rows.length === 0) {
      console.log(`  ${table}: 0 rows`);
      continue;
    }

    const columns = Object.keys(rows[0]);
    const columnList = columns.map((c) => `"${c}"`).join(", ");

    if (!dryRun) {
      await target.query("BEGIN");
      try {
        for (let i = 0; i < rows.length; i += BATCH) {
          const slice = rows.slice(i, i + BATCH);
          const values = [];
          const tuples = slice.map((row, rowIndex) => {
            const placeholders = columns.map((column, columnIndex) => {
              values.push(row[column]);
              return `$${rowIndex * columns.length + columnIndex + 1}`;
            });
            return `(${placeholders.join(", ")})`;
          });
          await target.query(
            `INSERT INTO "${table}" (${columnList}) VALUES ${tuples.join(", ")}`,
            values,
          );
        }
        // Keep serial sequences in step with the copied ids.
        const hasId = columns.includes("id");
        if (hasId) {
          await target.query(
            `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'),
                           COALESCE((SELECT MAX(id) FROM "${table}"), 1))`,
          );
        }
        await target.query("COMMIT");
      } catch (error) {
        await target.query("ROLLBACK");
        throw new Error(`${table}: ${error.message}`);
      }
    }

    total += rows.length;
    console.log(`  ${table}: ${rows.length} rows${dryRun ? " (not written)" : ""}`);
  }

  console.log(`done — ${total} rows${dryRun ? " would be copied" : " copied"}`);
  await source.end();
  await target.end();
}

main().catch(async (error) => {
  console.error("transfer failed:", error.message);
  process.exit(1);
});
