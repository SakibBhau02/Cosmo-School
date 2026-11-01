// One-time backfill: turn the existing front-end gallery photos into albums,
// so everything visitors already see is also editable in /admin/gallery.
//
//   npm run db:seed:gallery        # uses .env.local (Neon)
//   npm run db:seed:gallery -- --prod
//
// Safe to re-run: it only inserts when gallery_events is empty.
import fs from "node:fs";
import path from "node:path";
import pg from "pg";

import { databaseUrl, describeUrl, loadEnv, poolConfig, ROOT } from "./env.mjs";

const prod = process.argv.includes("--prod");
loadEnv(prod ? [".env.production.local", ".env.local", ".env"] : [".env.local", ".env.production.local", ".env"]);
const url = databaseUrl();
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const lists = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "lists.json"), "utf8"));
const photos = Array.isArray(lists.gallery) ? lists.gallery : [];

function imageUrl(name) {
  if (/^https?:\/\//i.test(name)) return name;
  return /^image\d/i.test(name)
    ? `https://cosmoschools.org/${name}`
    : `https://cosmoschools.org/images/${name}`;
}

const groups = [
  {
    slug: "campus-life",
    titleEn: "Campus Life",
    titleBn: "ক্যাম্পাস জীবন",
    descriptionEn:
      "Classrooms, labs and the everyday spaces where Cosmo students learn, play and grow.",
    descriptionBn:
      "শ্রেণিকক্ষ, ল্যাব ও দৈনন্দিন পরিবেশ — যেখানে কসমোর শিক্ষার্থীরা শেখে, খেলে ও বেড়ে ওঠে।",
    eventDate: "2025",
    location: "Banasree Campus",
    match: (p) => ["Campus", "Classroom", "Labs"].includes(p.cat),
  },
  {
    slug: "cultural-festivals",
    titleEn: "Cultural Festivals",
    titleBn: "সাংস্কৃতিক উৎসব",
    descriptionEn:
      "Pitha Utshob and the annual cultural celebration — colour, music and community.",
    descriptionBn: "পিঠা উৎসব ও বার্ষিক সাংস্কৃতিক আয়োজন — রং, সংগীত ও কমিউনিটির উৎসব।",
    eventDate: "2025",
    location: "Banasree Campus",
    match: (p) => p.cat === "Cultural",
  },
  {
    slug: "study-tours",
    titleEn: "Study Tours & Events",
    titleBn: "শিক্ষা সফর ও অনুষ্ঠান",
    descriptionEn: "Learning beyond the classroom through trips, fairs and school events.",
    descriptionBn: "শ্রেণিকক্ষের বাইরে শিক্ষা — সফর, মেলা ও স্কুলের আয়োজন।",
    eventDate: "2025",
    location: "Banasree Campus",
    match: (p) => p.cat === "Events",
  },
];

const client = new pg.Client(poolConfig(url));

try {
  await client.connect();
  const exists = await client.query("select to_regclass('public.gallery_events') as name");
  if (!exists.rows[0]?.name) {
    console.error("gallery_events is missing. Run `npm run db:migrate` first.");
    process.exit(1);
  }

  const count = await client.query("select count(*)::int as n from gallery_events");
  if (Number(count.rows[0].n) > 0) {
    console.log(`skip — ${count.rows[0].n} album(s) already exist on ${describeUrl(url)}`);
    await client.end();
    process.exit(0);
  }

  let sort = 0;
  let inserted = 0;
  for (const group of groups) {
    const items = photos.filter(group.match);
    if (items.length === 0) continue;
    sort += 1;
    const cover = imageUrl(items[0].img);
    const event = await client.query(
      `insert into gallery_events
         (slug, title_en, title_bn, description_en, description_bn, event_date, location,
          cover_url, cover_file, status, sort)
       values ($1,$2,$3,$4,$5,$6,$7,$8,'',$9,$10)
       returning id`,
      [
        group.slug,
        group.titleEn,
        group.titleBn,
        group.descriptionEn,
        group.descriptionBn,
        group.eventDate,
        group.location,
        cover,
        "published",
        sort,
      ],
    );
    const eventId = event.rows[0].id;
    let photoSort = 0;
    for (const photo of items) {
      photoSort += 1;
      await client.query(
        `insert into gallery_photos
           (event_id, url, file_path, alt_en, caption_en, sort)
         values ($1,$2,'',$3,$4,$5)`,
        [eventId, imageUrl(photo.img), photo.title, photo.title, photoSort],
      );
      inserted += 1;
    }
    console.log(`+ ${group.slug} (${items.length} photo${items.length === 1 ? "" : "s"})`);
  }

  console.log(`seeded ${inserted} photo(s) into ${groups.length} album(s) on ${describeUrl(url)}`);
  await client.end();
} catch (error) {
  console.error("Failed:", error.message);
  process.exitCode = 1;
  await client.end().catch(() => {});
}
