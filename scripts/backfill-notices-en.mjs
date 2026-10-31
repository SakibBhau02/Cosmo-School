// One-off: give the six existing notices an English tag + body so the
// English-first site has no Bengali-only fallbacks.
//
//   node scripts/backfill-notices-en.mjs          (uses .env.local)
//   node scripts/backfill-notices-en.mjs --prod   (uses .env.production.local)
import pg from "pg";

import { databaseUrl, describeUrl, loadEnv, poolConfig } from "./env.mjs";

const prod = process.argv.includes("--prod");
const loaded = loadEnv(prod ? [".env.production.local"] : undefined);
const url = databaseUrl();
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const TRANSLATIONS = {
  "annual-exam-2025": {
    tagEn: "Exam",
    bodyEn:
      "The annual examination for Classes III–IX will be held from 20 November to 7 December. Collect the exam routine from your class teacher and the academic office. No one may sit for exams without an admit card.",
  },
  "ssc-test-result": {
    tagEn: "Result",
    bodyEn:
      "The SSC Test Examination 2025 results will be published on 8 November at 10 AM. Students will collect results from their class teachers. Decisions on form fill-up for unsuccessful students will follow discussion with guardians.",
  },
  "ssc-test-exam": {
    tagEn: "Exam",
    bodyEn:
      "The Class X test examination begins on 16 October. Seating and script evaluation will follow board-exam standards. Regular attendance is mandatory.",
  },
  "victory-day": {
    tagEn: "Cultural",
    bodyEn:
      "On Victory Day, the school premises will host art competitions, poetry recitation and a cultural programme. All students must arrive by 8 AM in the designated dress.",
  },
  "annual-result-day": {
    tagEn: "Result",
    bodyEn:
      "Annual exam results will be published on 20 December. Attendance with guardians on result day is mandatory. The 2026 session book-distribution date will be announced the same day.",
  },
  "admission-2027": {
    tagEn: "Admission",
    bodyEn:
      "Admission is open for the 2027 session, Pre-School to Class 9. A 20% waiver on the admission fee applies until 15 November 2026. Seats are limited — fill in the inquiry form today or call the helpline: 01972-900045.",
  },
};

const client = new pg.Client(poolConfig(url));

try {
  await client.connect();
  console.log(`Notices on ${describeUrl(url)} (env: ${loaded.join(", ") || "process env"})`);

  let updated = 0;
  for (const [slug, values] of Object.entries(TRANSLATIONS)) {
    const result = await client.query(
      `update notices
          set tag_en = $2,
              body_en = case when coalesce(body_en, '') = '' then $3 else body_en end
        where slug = $1`,
      [slug, values.tagEn, values.bodyEn],
    );
    updated += result.rowCount ?? 0;
  }

  const missing = await client.query(
    "select slug from notices where coalesce(body_en, '') = '' order by slug",
  );
  console.log(`updated ${updated} rows`);
  console.log(
    missing.rows.length
      ? `still missing English body: ${missing.rows.map((r) => r.slug).join(", ")}`
      : "every notice has an English body",
  );
} catch (error) {
  console.error("Failed:", error.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
