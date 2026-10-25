// Seeds Postgres from data/*.json (WP-CPT docs come in Phase 4 migration).
// Idempotent: clears CMS tables first, then inserts.
import fs from "fs";
import pg from "pg";
import { ROOT, databaseUrl, describeUrl, isLocalUrl, loadEnv, poolConfig } from "./env.mjs";

const { Pool } = pg;
const prod = process.argv.includes("--prod");
const read = (f) => JSON.parse(fs.readFileSync(ROOT + "\\data\\" + f, "utf8").replace(/^﻿/, ""));

try {
  loadEnv(
    prod
      ? [".env.production.local", ".env.local", ".env"]
      : [".env.local", ".env.production.local", ".env"]
  );
  const url = databaseUrl();
  if (!url) throw new Error("DATABASE_URL is not set");
  if (!isLocalUrl(url) && !process.env.ALLOW_PROD_SEED) {
    throw new Error(
      `refusing to seed a non-local database (${describeUrl(url)}) — seeding TRUNCATEs tables. ` +
        "Set ALLOW_PROD_SEED=1 if you really mean it."
    );
  }
  console.log(`db : ${describeUrl(url)}`);
  const pool = new Pool(poolConfig(url));
  const q = (t, p) => pool.query(t, p);

  const site = read("site.json");
  const cms = read("cms.json");
  const lists = read("lists.json");
  const teachers = read("teachers.json");

  await q("TRUNCATE audit_log, inquiries, media, testimonials, events, teachers, notices, list_items, sections, pages RESTART IDENTITY CASCADE");

  const pageDefs = [
    ["home", "হোম"], ["about", "আমাদের কথা"], ["academics", "একাডেমিক"],
    ["admission", "ভর্তি"], ["clubs", "ক্লাব"], ["contact", "যোগাযোগ"],
    ["day-long-school", "ডে লং স্কুল"], ["gallery", "গ্যালারি"],
    ["leadership", "নেতৃত্ব"], ["mission-vision", "লক্ষ্য ও স্বপ্ন"],
    ["notices", "নোটিশ"], ["results", "ফলাফল"], ["teachers", "শিক্ষক"],
    ["site", "সাইট-সেটিংস"], ["daycare", "ডে-কেয়ার"],
  ];
  for (const [slug, title] of pageDefs) {
    await q("INSERT INTO pages (slug, title, status) VALUES ($1, $2, 'published')", [slug, title]);
  }

  const secDefs = [
    ["home", "hero", site.hero], ["home", "heroSlides", lists.heroSlides ?? site.heroSlides],
    ["home", "stats", site.stats], ["home", "daycarePlans", site.daycarePlans],
    ["admission", "fees", site.fees],
    ["day-long-school", "daylong", site.daylong],
    ["daycare", "daycareFull", lists.daycareFull],
    ["academics", "academics", lists.academics],
    ["academics", "programs", lists.programs],
    ["clubs", "clubs", lists.clubs],
    ["gallery", "gallery", lists.gallery],
    ["results", "results", lists.results],
    ["site", "media", site.media], ["site", "faqs", lists.faqs],
    ["site", "trustees", lists.trustees], ["site", "principal", lists.principal],
    ["site", "contact", lists.contact],
  ];
  let sort = 0;
  for (const [page, key, doc] of secDefs) {
    if (doc === undefined) { console.log("skip section " + page + "/" + key); continue; }
    await q("INSERT INTO sections (page_slug, key, sort, content_bn) VALUES ($1, $2, $3, $4)", [page, key, sort++, JSON.stringify(doc)]);
  }

  for (const n of cms.notices || []) {
    await q("INSERT INTO notices (slug, date, tag, title_bn, title_en, body_bn, status) VALUES ($1,$2,$3,$4,$5,$6,'published')",
      [n.slug, n.date || "", n.tag || "নোটিশ", n.titleBn, n.titleEn || "", n.bodyBn || ""]);
  }
  for (const t of teachers || []) {
    await q("INSERT INTO teachers (slug, name, name_en, role_bn, subject, exp, sort) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [t.slug, t.name, t.en || "", t.roleBn || "", t.subject || "", t.exp || "", 0]);
  }
  for (const e of site.events || []) {
    await q("INSERT INTO events (date, title_bn, title_en, kind) VALUES ($1,$2,$3,$4)", [e.date || "", e.titleBn, e.titleEn || "", e.kind || ""]);
  }
  let i = 0;
  for (const t of site.testimonials || []) {
    await q("INSERT INTO testimonials (name, meta, text, sort) VALUES ($1,$2,$3,$4)", [t.name, t.meta || "", t.text, i++]);
  }
  for (const iq of cms.inquiries || []) {
    await q("INSERT INTO inquiries (data, status, at) VALUES ($1, 'new', $2)", [JSON.stringify(iq), iq.at || new Date().toISOString()]);
  }
  for (const [name, url] of Object.entries(site.media || {})) {
    await q("INSERT INTO media (file_path, url, alt_bn, uploaded_by) VALUES ($1,$2,$3,'seed')", [url, url, name]);
  }

  const counts = await q(`SELECT (SELECT count(*) FROM pages) pages, (SELECT count(*) FROM sections) sections,
    (SELECT count(*) FROM notices) notices, (SELECT count(*) FROM teachers) teachers,
    (SELECT count(*) FROM events) events, (SELECT count(*) FROM testimonials) testimonials,
    (SELECT count(*) FROM inquiries) inquiries, (SELECT count(*) FROM media) media`);
  console.log("seed ok:", JSON.stringify(counts.rows[0]));
  await pool.end();
} catch (e) {
  console.error("ERR", e.message);
  process.exit(1);
}
