// Full seed for local WordPress (http://localhost:8080).
// Usage: $env:WP_APP_PASSWORD="..."; node backend/seed.mjs
// Seeds: categories, tags, notices, teachers, testimonials, events,
// site options (hero/fees/stats/daycarePlans/media), uploads images.
// Safe to re-run: skips anything whose slug already exists.
import { readFileSync } from "fs";

const WP = process.env.WORDPRESS_REST_URL ?? "http://localhost:8080/wp-json/wp/v2";
const ORIGIN = "https://cosmoschools.org";
const USER = process.env.WP_APP_USER ?? "admin";
const PASS = process.env.WP_APP_PASSWORD;
if (!PASS) {
  console.error("Set WP_APP_PASSWORD env first (see .env.local)");
  process.exit(1);
}
const auth = "Basic " + Buffer.from(`${USER}:${PASS}`).toString("base64");

async function api(path, opts = {}) {
  const isJson = opts.body !== undefined && typeof opts.body !== "string" && !(opts.body instanceof Buffer);
  const res = await fetch(`${WP}${path}`, {
    ...opts,
    headers: {
      Authorization: auth,
      ...(isJson ? { "Content-Type": "application/json" } : {}),
      ...(opts.headers ?? {}),
    },
    body: isJson ? JSON.stringify(opts.body) : opts.body,
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`${opts.method ?? "GET"} ${path} → ${res.status} ${t.slice(0, 120)}`);
  }
  const ct = res.headers.get("content-type") ?? "";
  return ct.includes("json") ? res.json() : null;
}

const noBOM = (p) => JSON.parse(readFileSync(p, "utf-8").replace(/^﻿/, ""));

// ---------- categories / tags ----------
async function ensureCategory(slug, name) {
  const found = await api(`/categories?slug=${slug}`);
  if (found.length) return found[0].id;
  return (await api(`/categories`, { method: "POST", body: { slug, name } })).id;
}
async function ensureTag(name) {
  const found = await api(`/tags?search=${encodeURIComponent(name)}`);
  const exact = found.find((t) => t.name === name);
  if (exact) return exact.id;
  return (await api(`/tags`, { method: "POST", body: { name } })).id;
}

// ---------- generic upsert by slug ----------
async function upsert(base, slug, payload) {
  const found = await api(`/${base}?slug=${slug}`);
  if (found.length) {
    console.log(`skip (exists): ${base}/${slug}`);
    return found[0];
  }
  const created = await api(`/${base}`, { method: "POST", body: { slug, status: "publish", ...payload } });
  console.log(`created: ${base}/${slug}`);
  return created;
}

const cms = noBOM("data/cms.json");
const site = noBOM("data/site.json");
const teachers = noBOM("data/teachers.json");
const lists = noBOM("data/lists.json");

// ---------- notices ----------
const noticeCat = await ensureCategory("notice", "Notice");
await ensureCategory("event", "Event");
await ensureCategory("result", "Result");
for (const n of cms.notices) {
  const tagId = await ensureTag(n.tag);
  await upsert("posts", n.slug, {
    title: n.titleEn,
    categories: [noticeCat],
    tags: [tagId],
    content: `<h2>${n.titleBn}</h2>\n<p><strong>${n.date}</strong></p>\n<p>${n.bodyBn}</p>`,
  });
}

// ---------- teachers ----------
for (const tc of teachers) {
  await upsert("teachers", tc.slug, {
    title: tc.name,
    content: tc.en,
    meta: { role_bn: tc.roleBn, subject: tc.subject, exp: tc.exp },
  });
}

// ---------- testimonials ----------
for (const [i, tm] of site.testimonials.entries()) {
  await upsert("testimonials", `voice-${i + 1}`, {
    title: tm.name,
    content: tm.text,
    meta: { meta_line: tm.meta },
  });
}

// ---------- events ----------
for (const [i, ev] of site.events.entries()) {
  await upsert("events", `event-${i + 1}`, {
    title: ev.titleBn,
    content: ev.titleEn,
    meta: { event_date: ev.date, event_kind: ev.kind },
  });
}

// ---------- media (images live in WP, frontend falls back to origin) ----------
const IMAGES = [
  "images/school.jpg",
  "images/study-tour.JPG",
  "images/pitha-utshob.jpeg",
  "images/annual-cultural.JPG",
  "image2.jpg",
  "image1.jpg",
  "image4.jpg",
  "image3.jpg",
  "images/it-club.jpeg",
  "gk-club.png",
  "drama-club.png",
  "art-club.png",
  "music-club.png",
  "karate-club.png",
  "assets/img/gallery/emp-27.jpg",
  "assets/img/gallery/emp-25.p.jpg",
  "assets/img/gallery/emp-24.jpg",
  "assets/img/gallery/emp-29-banasree-vp.jpg",
  "assets/img/gallery/emp-30.jpg",
  "assets/img/gallery/emp-31.jpg",
  "assets/img/gallery/emp-36.jpg",
  "assets/img/gallery/emp-7.jpg",
];

const mediaMap = {};
for (const rel of IMAGES) {
  const filename = rel.split("/").pop();
  const key = filename.toLowerCase();
  if (mediaMap[key]) continue;
  const search = await api(`/media?search=${encodeURIComponent(filename.split(".")[0])}&per_page=20`);
  const hit = search.find((m) => (m.source_url ?? "").toLowerCase().endsWith(key));
  if (hit) {
    mediaMap[key] = hit.source_url;
    console.log(`media (exists): ${filename}`);
    continue;
  }
  const dl = await fetch(`${ORIGIN}/${rel}`);
  if (!dl.ok) {
    console.log(`media (download failed ${dl.status}): ${rel}`);
    continue;
  }
  const buf = Buffer.from(await dl.arrayBuffer());
  const up = await fetch(`${WP}/media`, {
    method: "POST",
    headers: {
      Authorization: auth,
      "Content-Type": dl.headers.get("content-type") ?? "image/jpeg",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
    body: buf,
  });
  if (!up.ok) {
    console.log(`media (upload failed ${up.status}): ${filename}`);
    continue;
  }
  const m = await up.json();
  mediaMap[key] = m.source_url;
  console.log(`media (uploaded): ${filename}`);
}

// ---------- site options (JSON docs: hero/fees/stats/daycarePlans/media) ----------
async function upsertOption(slug, obj) {
  const found = await api(`/siteoptions?slug=${slug}`);
  const body = { title: slug, content: JSON.stringify(obj), status: "publish" };
  if (found.length) {
    console.log(`option (exists): ${slug} — updating`);
    await api(`/siteoptions/${found[0].id}`, { method: "POST", body });
  } else {
    await api(`/siteoptions`, { method: "POST", body: { slug, ...body } });
    console.log(`option (created): ${slug}`);
  }
}

await upsertOption("hero", site.hero);
await upsertOption("fees", site.fees);
await upsertOption("stats", site.stats);
await upsertOption("daycarePlans", site.daycarePlans);
await upsertOption("media", mediaMap);
await upsertOption("faqs", lists.faqs);
await upsertOption("trustees", lists.trustees);
await upsertOption("principal", lists.principal);
await upsertOption("contact", lists.contact);
await upsertOption("heroSlides", lists.heroSlides);
await upsertOption("daycareFull", lists.daycareFull);
await upsertOption("academics", lists.academics);
await upsertOption("results", lists.results);

// ---------- programs / clubs / gallery (with featured images) ----------
async function mediaId(filename) {
  const key = filename.toLowerCase();
  const found = await api(`/media?search=${encodeURIComponent(filename.split(".")[0])}&per_page=20`);
  const hit = found.find((m) => (m.source_url ?? "").toLowerCase().endsWith(key));
  return hit ? hit.id : 0;
}

for (const p of lists.programs) {
  const fid = await mediaId(p.img);
  const src = `${ORIGIN}/${/^image\d/i.test(p.img) ? p.img : "images/" + p.img}`;
  await upsert("programs", p.slug, {
    title: p.titleBn,
    content: p.descBn,
    meta: { title_en: `${p.titleEn} — ${p.age}`, desc_en: p.descEn, age: p.age, img_src: src },
    ...(fid ? { featured_media: fid } : {}),
  });
}
for (const c of lists.clubs) {
  const fid = await mediaId(c.img);
  const src = `${ORIGIN}/${c.img === "it-club.jpeg" ? "images/" + c.img : c.img}`;
  await upsert("clubs", c.slug, {
    title: c.nameBn,
    content: c.descBn,
    meta: { title_en: c.nameEn, desc_en: c.descEn, img_src: src },
    ...(fid ? { featured_media: fid } : {}),
  });
}
for (const g of lists.gallery) {
  const fid = await mediaId(g.img);
  await upsert("gallery", g.slug, {
    title: g.title,
    content: g.cat,
    meta: { cat: g.cat, img_src: `${ORIGIN}/images/${g.img}` },
    ...(fid ? { featured_media: fid } : {}),
  });
}

// ---------- Elementor-editable pages ----------
// Edit visually: WP Admin → Pages → "Edit with Elementor".
// Frontend renders content.rendered (prose-styled) with fallback.
const PAGES = [
  {
    slug: "about-extended",
    title: "About Extended (Elementor)",
    content: `<h2>আমাদের গল্প</h2>
<p>২০১৩ সালের জানুয়ারিতে মিরপুরে ছোট্ট একটি ক্যাম্পাস নিয়ে কসমো স্কুলের যাত্রা শুরু। আজ বনশ্রীসহ একাধিক ক্যাম্পাসে সহস্রাধিক শিক্ষার্থী পড়ছে।</p>
<h2>আমাদের বিশ্বাস</h2>
<p>প্রতিটি শিশু আলাদা। কেউ গণিতে ভালো, কেউ ছবি আঁকায়, কেউ খেলায়। আমাদের কাজ — প্রতিটি শিশুর শক্তির জায়গাটা খুঁজে বের করে তাকে এগিয়ে দেওয়া।</p>
<p><em>(এই অংশ Elementor দিয়ে ভিজ্যুয়ালি সাজান — টেক্সট, ছবি, ভিডিও যোগ করুন।)</em></p>`,
  },
];
for (const pg of PAGES) {
  await upsert("pages", pg.slug, { title: pg.title, content: pg.content });
}

console.log("done");
