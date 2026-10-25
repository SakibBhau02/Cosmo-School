import { promises as fs } from "fs";
import path from "path";
import { revalidateTag } from "next/cache";
import { resolveImg } from "./img";
import { daylongSeed, type DaylongContent } from "@/config/site";
import { dbAvailable } from "./db/client";
import {
  deleteDbNotice,
  getDbNotice,
  insertDbInquiry,
  insertDbNotice,
  listDbInquiries,
  listDbNotices,
  listSiteDocs,
  putSiteDocs,
  updateDbNotice,
} from "./db/store";

export { resolveImg };

// The repo filesystem is writable locally and read-only on Vercel/serverless.
// Every write path below therefore targets Postgres first and only mirrors to
// the JSON seed files when they are actually writable.
const FS_WRITABLE = !process.env.VERCEL;

// CMS data layer — WordPress FIRST, local file fallback.
//
// Primary: WordPress REST  (GET {WORDPRESS_REST_URL}/posts?categories=notice)
//   Local WP:  WORDPRESS_REST_URL=http://localhost:8080/wp-json/wp/v2
//   Seeded via: node backend/seed.mjs  (admin: http://localhost:8080/wp-admin)
// Fallback: data/cms.json (same shape) — site works even with WP stopped.

export type CmsNotice = {
  slug: string;
  date: string;
  titleBn: string;
  titleEn: string;
  tag: string;
  bodyBn: string;
};

export type CmsInquiry = Record<string, unknown> & { at: string };

type CmsDb = { notices: CmsNotice[]; inquiries: CmsInquiry[] };

const DB_PATH = path.join(process.cwd(), "data", "cms.json");
const WP_REST = (process.env.WORDPRESS_REST_URL ?? "").replace(/\/$/, "");

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h\d|li|div)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

// Seed format: <h2>{titleBn}</h2><p><strong>{date}</strong></p><p>{bodyBn}</p>
function fromWpPost(p: {
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  _embedded?: { "wp:term"?: { name: string }[][] };
}): CmsNotice {
  const html = p.content.rendered;
  const h2 = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? "";
  const strong = html.match(/<p[^>]*>\s*<strong[^>]*>([\s\S]*?)<\/strong>\s*<\/p>/i)?.[1] ?? "";
  const rest = html
    .replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, "")
    .replace(/<p[^>]*>\s*<strong[^>]*>[\s\S]*?<\/strong>\s*<\/p>/i, "");
  const body = stripHtml(rest);
  const terms = p._embedded?.["wp:term"]?.flat() ?? [];
  const tag = terms.find((x) => x.name && !["Notice", "Uncategorized"].includes(x.name))?.name;
  return {
    slug: p.slug,
    date: stripHtml(strong) || "চলমান",
    titleBn: stripHtml(h2) || stripHtml(p.title.rendered),
    titleEn: stripHtml(p.title.rendered),
    tag: tag ?? "নোটিশ",
    bodyBn: body,
  };
}

async function wpListNotices(): Promise<CmsNotice[] | null> {
  if (!WP_REST) return null;
  try {
    const cats: { id: number }[] = await (
      await fetch(`${WP_REST}/categories?slug=notice`, {
        signal: AbortSignal.timeout(4000),
        next: { tags: ["wp-notices"], revalidate: 60 },
      })
    ).json();
    const catId = cats[0]?.id;
    if (!catId) return null;
    const posts = await (
      await fetch(`${WP_REST}/posts?categories=${catId}&per_page=20&_embed=wp:term`, {
        signal: AbortSignal.timeout(4000),
        next: { tags: ["wp-notices"], revalidate: 60 },
      })
    ).json();
    if (!Array.isArray(posts) || posts.length === 0) return null;
    return posts.map(fromWpPost);
  } catch {
    return null;
  }
}

async function readDb(): Promise<CmsDb> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw.replace(/^\uFEFF/, "")) as Partial<CmsDb>;
    return { notices: parsed.notices ?? [], inquiries: parsed.inquiries ?? [] };
  } catch {
    // Missing/unreadable seed file is not an error — Postgres is the master
    // copy in production and the seed is optional everywhere.
    return { notices: [], inquiries: [] };
  }
}

/** Mirrors to the JSON seed when the filesystem allows it. */
async function writeDb(db: CmsDb): Promise<boolean> {
  if (!FS_WRITABLE) return false;
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2) + "\n", "utf-8");
  return true;
}

export async function listNotices(): Promise<CmsNotice[]> {
  const [wp, dbRows, file] = await Promise.all([
    wpListNotices(),
    listDbNotices(),
    readDb().then((d) => d.notices),
  ]);
  // Precedence: Postgres (admin edits) > local seed file > WordPress.
  const bySlug = new Map<string, CmsNotice>();
  for (const n of file) bySlug.set(n.slug, n);
  for (const n of dbRows ?? []) bySlug.set(n.slug, n);
  const merged = [...bySlug.values()];
  if (!wp) return merged;
  const seen = new Set(merged.map((n) => n.slug));
  return [...merged, ...wp.filter((n) => !seen.has(n.slug))];
}

export async function getNotice(slug: string): Promise<CmsNotice | null> {
  const fromDb = await getDbNotice(slug);
  if (fromDb) return fromDb;
  const db = await readDb();
  const local = db.notices.find((n) => n.slug === slug) ?? null;
  if (local) return local;
  const wp = await (async () => {
    if (!WP_REST) return null;
    try {
      const posts = await (
        await fetch(`${WP_REST}/posts?slug=${slug}&_embed=wp:term`, {
          signal: AbortSignal.timeout(4000),
          next: { tags: ["wp-notices"], revalidate: 60 },
        })
      ).json();
      if (Array.isArray(posts) && posts.length > 0) return fromWpPost(posts[0]);
      return null;
    } catch {
      return null;
    }
  })();
  if (wp) return wp;
  return null;
}

export async function addNotice(n: CmsNotice): Promise<void> {
  if (dbAvailable()) {
    // insertDbNotice throws `slug-exists` on a duplicate primary key.
    await insertDbNotice(n);
  } else {
    const db = await readDb();
    if (db.notices.some((x) => x.slug === n.slug)) {
      throw new Error("slug-exists");
    }
    db.notices.unshift(n);
    await writeDb(db);
  }
  revalidateTag("wp-notices", { expire: 0 });
}

export async function updateNotice(slug: string, patch: Partial<CmsNotice>): Promise<boolean> {
  if (await updateDbNotice(slug, patch)) {
    revalidateTag("wp-notices", { expire: 0 });
    return true;
  }
  const db = await readDb();
  const i = db.notices.findIndex((x) => x.slug === slug);
  if (i === -1) return false;
  db.notices[i] = { ...db.notices[i], ...patch, slug };
  if (!(await writeDb(db))) return false;
  revalidateTag("wp-notices", { expire: 0 });
  return true;
}

export async function deleteNotice(slug: string): Promise<boolean> {
  if (await deleteDbNotice(slug)) {
    revalidateTag("wp-notices", { expire: 0 });
    return true;
  }
  const db = await readDb();
  const before = db.notices.length;
  db.notices = db.notices.filter((x) => x.slug !== slug);
  if (db.notices.length === before) return false;
  if (!(await writeDb(db))) return false;
  revalidateTag("wp-notices", { expire: 0 });
  return true;
}

// ---------- Editable site content (hero, events, fees, testimonials, plans) ----------

const SITE_PATH = path.join(process.cwd(), "data", "site.json");

export type SiteContent = {
  hero: { mode: "slider" | "video"; youtubeId: string };
  stats: { value: number; suffix: string; labelBn: string; labelEn: string }[];
  events: { date: string; titleBn: string; titleEn: string; kind: string }[];
  fees: {
    admission: { item: string; amount: string }[];
    monthly: { level: string; amount: string }[];
    noteBn: string;
  };
  testimonials: { name: string; meta: string; text: string }[];
  daycarePlans: { name: string; en: string; time: string; price: string }[];
  media: Record<string, string>;
  programs: Program[];
  clubs: Club[];
  gallery: GalleryItem[];
  faqs: { q: string; a: string }[];
  trustees: { name: string; en: string; msgBn: string }[];
  principal: { nameBn: string; nameEn: string; quoteBn: string; bodyBn: string[] };
  contact: { address: string; phone: string; ipPhone: string; email: string; hoursBn: string };
  heroSlides: { src: string; captionBn: string; captionEn: string; cta?: { labelBn: string; labelEn: string; href: string; variant?: "gold" | "outline" }[] }[];
  daycareFull: {
    schedule: { time: string; title: string; desc: string }[];
    safety: { e: string; t: string; d: string }[];
    menu: { day: string; lunch: string; snack: string }[];
    included: string[];
    daycareFaqs: { q: string; a: string }[];
  };
  academics: {
    missionPoints: string[];
    weeklyRoutine: { day: string; time: string; note: string }[];
  };
  results: { total: number; passed: number; aPlus: number; golden: number; gradeA: number; successRate: number };
  daylong: DaylongContent;
};

export type Program = {
  slug: string;
  titleBn: string;
  titleEn: string;
  age: string;
  descBn: string;
  descEn: string;
  img: string;
};

export type Club = {
  slug: string;
  nameBn: string;
  nameEn: string;
  descBn: string;
  descEn: string;
  img: string;
  icon?: string;
  shortBn?: string;
  shortEn?: string;
};

export type GalleryItem = { slug: string; title: string; cat: string; img: string };

export type Teacher = {
  slug: string;
  name: string;
  en: string;
  roleBn: string;
  subject: string;
  exp: string;
};

const LISTS_PATH = path.join(process.cwd(), "data", "lists.json");
const TEACHERS_PATH = path.join(process.cwd(), "data", "teachers.json");

type ListsFile = {
  programs: Program[];
  clubs: Club[];
  gallery: GalleryItem[];
  faqs: SiteContent["faqs"];
  trustees: SiteContent["trustees"];
  principal: SiteContent["principal"];
  contact: SiteContent["contact"];
  heroSlides?: SiteContent["heroSlides"];
  daycareFull?: SiteContent["daycareFull"];
  academics?: SiteContent["academics"];
  results?: SiteContent["results"];
};

async function readListsFile(): Promise<ListsFile> {
  const raw = await fs.readFile(LISTS_PATH, "utf-8");
  return JSON.parse(raw.replace(/^﻿/, "")) as ListsFile;
}

function wpAuth(): Record<string, string> {
  const u = process.env.WP_APP_USER ?? "admin";
  const p = process.env.WP_APP_PASSWORD ?? "";
  if (!p) return {};
  return { Authorization: "Basic " + Buffer.from(`${u}:${p}`).toString("base64") };
}

async function wpGet<T>(path: string, opts?: { auth?: boolean }): Promise<T | null> {
  if (!WP_REST) return null;
  try {
    const res = await fetch(`${WP_REST}${path}`, {
      signal: AbortSignal.timeout(5000),
      headers: opts?.auth ? wpAuth() : {},
      next: { tags: ["wp-cms"], revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type WpPost = {
  slug: string;
  title: { rendered: string };
  content: { rendered: string; raw?: string };
  meta?: Record<string, unknown>;
  _embedded?: {
    "wp:term"?: { name: string }[][];
    "wp:featuredmedia"?: { source_url: string }[];
  };
};

function featured(p: WpPost): string {
  return p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "";
}

export async function listPrograms(): Promise<Program[]> {
  const posts = await wpGet<WpPost[]>(`/programs?per_page=20&_embed=wp:featuredmedia`);
  if (posts && posts.length > 0) {
    // WP returns newest-first; restore the canonical learning-stage order
    // so home + academics always pair each stage with its own image.
    const rank = (s: string) => {
      const k = (s || "").toLowerCase();
      if (k.includes("pre-school") || k.includes("preschool")) return 0;
      if (k.includes("pre-primary") || k.includes("preprimary")) return 1;
      if (k.includes("primary")) return 2;
      if (k.includes("secondary")) return 3;
      return 9;
    };
    return [...posts]
      .sort((a, b) => rank(a.slug) - rank(b.slug))
      .map((p) => ({
        slug: p.slug,
        titleBn: stripHtml(p.title.rendered),
        titleEn: stripHtml(String(p.meta?.title_en ?? "").split("—")[0]),
        age: String(p.meta?.age ?? ""),
        descBn: stripHtml(p.content.rendered),
        descEn: stripHtml(String(p.meta?.desc_en ?? "")),
        img: featured(p) || String(p.meta?.img_src ?? ""),
      }));
  }
  const { programs } = await import("@/config/site");
  return programs.map((p) => ({ ...p, slug: p.titleEn.toLowerCase().replace(/[^a-z]+/g, "-") }));
}

export async function listClubs(): Promise<Club[]> {
  const posts = await wpGet<WpPost[]>(`/clubs?per_page=20&_embed=wp:featuredmedia`);
  if (posts && posts.length > 0) {
    return posts.map((p) => ({
      slug: p.slug,
      nameBn: stripHtml(p.title.rendered),
      nameEn: stripHtml(String(p.meta?.title_en ?? "")),
      descBn: stripHtml(p.content.rendered),
      descEn: stripHtml(String(p.meta?.desc_en ?? "")),
      img: featured(p) || String(p.meta?.img_src ?? ""),
    }));
  }
  const { clubs } = await import("@/config/site");
  return clubs.map((c) => ({ ...c, slug: c.nameEn.toLowerCase().replace(/[^a-z]+/g, "-") }));
}

export async function listGallery(): Promise<GalleryItem[]> {
  const posts = await wpGet<WpPost[]>(`/gallery?per_page=30&_embed=wp:featuredmedia`);
  if (posts && posts.length > 0) {
    return posts.map((p) => ({
      slug: p.slug,
      title: stripHtml(p.title.rendered),
      cat: String(p.meta?.cat ?? ""),
      img: featured(p) || String(p.meta?.img_src ?? ""),
    }));
  }
  const { gallery } = await import("@/config/site");
  return gallery.map((g, i) => ({ slug: `g-${i}`, title: g.title, cat: g.cat, img: g.src }));
}

// JSON docs stored in the `siteoption` CPT — read raw (auth) to dodge wptexturize.
async function wpOption<T>(slug: string): Promise<T | null> {
  const posts = await wpGet<WpPost[]>(`/siteoptions?slug=${slug}&context=edit`, { auth: true });
  const raw = posts?.[0]?.content.raw ?? posts?.[0]?.content.rendered ?? "";
  if (!raw) return null;
  try {
    return JSON.parse(stripHtml(raw)) as T;
  } catch {
    return null;
  }
}

export async function listTeachers(): Promise<Teacher[]> {
  const posts = await wpGet<WpPost[]>(`/teachers?per_page=50&_fields=slug,title,content,meta`);
  if (posts && posts.length > 0) {
    return posts.map((p) => ({
      slug: p.slug,
      name: stripHtml(p.title.rendered),
      en: stripHtml(p.content.rendered),
      roleBn: String(p.meta?.role_bn ?? ""),
      subject: String(p.meta?.subject ?? ""),
      exp: String(p.meta?.exp ?? ""),
    }));
  }
  try {
    const raw = await fs.readFile(TEACHERS_PATH, "utf-8");
    return JSON.parse(raw.replace(/^﻿/, "")) as Teacher[];
  } catch {
    return [];
  }
}

export async function listTestimonials(): Promise<SiteContent["testimonials"]> {
  const posts = await wpGet<WpPost[]>(`/testimonials?per_page=50&_fields=title,content,meta`);
  if (posts && posts.length > 0) {
    return posts.map((p) => ({
      name: stripHtml(p.title.rendered),
      meta: String(p.meta?.meta_line ?? ""),
      text: stripHtml(p.content.rendered),
    }));
  }
  return (await readSiteFile()).testimonials;
}

export async function getWpPage(slug: string): Promise<{ title: string; html: string } | null> {
  type Page = { title: { rendered: string }; content: { rendered: string } };
  const pages = await wpGet<Page[]>(`/pages?slug=${slug}`);
  const p = posts0(pages);
  if (!p) return null;
  return { title: stripHtml(p.title.rendered), html: p.content.rendered };
}

function posts0<T>(arr: T[] | null): T | null {
  return arr && arr.length > 0 ? arr[0] : null;
}

export async function listEvents(): Promise<SiteContent["events"]> {  const posts = await wpGet<WpPost[]>(`/events?per_page=50&_fields=title,content,meta`);
  if (posts && posts.length > 0) {
    return posts.map((p) => ({
      date: String(p.meta?.event_date ?? ""),
      titleBn: stripHtml(p.title.rendered),
      titleEn: stripHtml(p.content.rendered),
      kind: String(p.meta?.event_kind ?? ""),
    }));
  }
  return (await readSiteFile()).events;
}

async function readSiteFile(): Promise<SiteContent> {
  const raw = await fs.readFile(SITE_PATH, "utf-8");
  const parsed = JSON.parse(raw.replace(/^﻿/, ""));
  return { media: {}, ...parsed } as SiteContent;
}

// Deep-merge a partial daylong doc over seeds: objects merge per-field,
// lists replace wholly when non-empty (so delete/add rows works).
export function mergeDaylong(
  seed: DaylongContent,
  over?: Partial<DaylongContent> | null
): DaylongContent {
  if (!over || typeof over !== "object") return seed;
  const out = { ...seed } as DaylongContent;
  (Object.keys(seed) as (keyof DaylongContent)[]).forEach((k) => {
    const s = seed[k];
    const o = (over as Record<string, unknown>)[k as string];
    if (o === undefined || o === null) return;
    if (Array.isArray(s)) {
      (out as Record<string, unknown>)[k as string] = (o as unknown[]).length > 0 ? o : s;
    } else if (typeof s === "object") {
      (out as Record<string, unknown>)[k as string] = { ...s, ...(o as Record<string, unknown>) };
    }
  });
  return out;
}

export async function getSiteContent(): Promise<SiteContent> {
  const [file, lists, hero, fees, stats, daycarePlans, media, testimonials, events, faqs, trustees, principal, contact, programs, clubs, gallery, heroSlides, daycareFull, academics, results, daylongOpt] =
    await Promise.all([
      readSiteFile(),
      readListsFile().catch(() => null),
      wpOption<SiteContent["hero"]>("hero"),
      wpOption<SiteContent["fees"]>("fees"),
      wpOption<SiteContent["stats"]>("stats"),
      wpOption<SiteContent["daycarePlans"]>("daycarePlans"),
      wpOption<Record<string, string>>("media"),
      listTestimonials(),
      listEvents(),
      wpOption<SiteContent["faqs"]>("faqs"),
      wpOption<SiteContent["trustees"]>("trustees"),
      wpOption<SiteContent["principal"]>("principal"),
      wpOption<SiteContent["contact"]>("contact"),
      listPrograms(),
      listClubs(),
      listGallery(),
      wpOption<SiteContent["heroSlides"]>("heroSlides"),
      wpOption<SiteContent["daycareFull"]>("daycareFull"),
      wpOption<SiteContent["academics"]>("academics"),
      wpOption<SiteContent["results"]>("results"),
      wpOption<Partial<DaylongContent>>("daylong"),
    ]);
  const out: SiteContent = {
    hero: hero ?? file.hero,
    fees: fees ?? file.fees,
    stats: stats ?? file.stats,
    daycarePlans: daycarePlans ?? file.daycarePlans,
    media: media ?? {},
    testimonials,
    events,
    programs,
    clubs,
    gallery,
    faqs: faqs ?? lists?.faqs ?? [],
    trustees: trustees ?? lists?.trustees ?? [],
    principal: principal ?? lists?.principal ?? { nameBn: "", nameEn: "", quoteBn: "", bodyBn: [] },
    contact: contact ?? lists?.contact ?? { address: "", phone: "", ipPhone: "", email: "", hoursBn: "" },
    heroSlides: heroSlides ?? lists?.heroSlides ?? [],
    daycareFull: daycareFull ?? lists?.daycareFull ?? { schedule: [], safety: [], menu: [], included: [], daycareFaqs: [] },
    academics: academics ?? lists?.academics ?? { missionPoints: [], weeklyRoutine: [] },
    results: results ?? lists?.results ?? { total: 0, passed: 0, aPlus: 0, golden: 0, gradeA: 0, successRate: 0 },
    daylong: mergeDaylong(daylongSeed, daylongOpt ?? (file as Partial<SiteContent>).daylong),
  };

  // /admin saves in production land in Postgres; overlay them on top of the
  // file + WordPress result so reads never depend on a writable disk.
  const docs = await listSiteDocs();
  return docs ? applySiteDocs(out, docs) : out;
}

/** Overlay site_docs rows, ignoring keys that are not part of SiteContent. */
function applySiteDocs(base: SiteContent, docs: Record<string, unknown>): SiteContent {
  const out = { ...base } as Record<string, unknown>;
  for (const [k, v] of Object.entries(docs)) {
    if (v === undefined || v === null || !(k in base)) continue;
    if (k === "daylong") {
      out[k] = mergeDaylong(base.daylong, v as Partial<DaylongContent>);
    } else {
      out[k] = v;
    }
  }
  return out as SiteContent;
}

// Write-through: /admin saves land in the FILE and (best-effort) in WORDPRESS
// siteoptions, so WP stays the master copy.
async function wpUpsertCpt(base: string, slug: string, payload: Record<string, unknown>): Promise<void> {
  if (!WP_REST) return;
  try {
    const headers = { "Content-Type": "application/json", ...wpAuth() };
    const found = await wpGet<{ id: number }[]>(`/${base}?slug=${slug}&context=edit`, { auth: true });
    if (found && found.length > 0) {
      await fetch(`${WP_REST}/${base}/${found[0].id}`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      });
    } else {
      await fetch(`${WP_REST}/${base}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ slug, status: "publish", ...payload }),
        signal: AbortSignal.timeout(5000),
      });
    }
  } catch {
    /* ignore — file fallback covers */
  }
}

async function wpDeleteCpt(base: string, slug: string): Promise<void> {
  if (!WP_REST) return;
  try {
    const found = await wpGet<{ id: number }[]>(`/${base}?slug=${slug}&context=edit`, { auth: true });
    if (found && found.length > 0) {
      await fetch(`${WP_REST}/${base}/${found[0].id}?force=true`, {
        method: "DELETE",
        headers: wpAuth(),
        signal: AbortSignal.timeout(5000),
      });
    }
  } catch {
    /* ignore */
  }
}
async function wpUpsertOption(slug: string, obj: unknown): Promise<void> {
  if (!WP_REST) return;
  try {
    const found = await wpGet<WpPost[]>(`/siteoptions?slug=${slug}&context=edit`, { auth: true });
    const body = { title: slug, content: JSON.stringify(obj), status: "publish" };
    if (found && found.length > 0) {
      const id = (found[0] as unknown as { id: number }).id;
      await fetch(`${WP_REST}/siteoptions/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...wpAuth() },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(5000),
      });
    } else {
      await fetch(`${WP_REST}/siteoptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...wpAuth() },
        body: JSON.stringify({ slug, ...body }),
        signal: AbortSignal.timeout(5000),
      });
    }
  } catch {
    /* file remains source of truth when WP unreachable */
  }
}

export async function saveSiteContent(patch: Partial<SiteContent>): Promise<SiteContent> {
  // Postgres first — the only writable store on Vercel.
  const savedToDb = await putSiteDocs(patch as Record<string, unknown>);

  // Mirror into the JSON seed when the filesystem is writable (local dev), so
  // edits stay visible in git and a DB-less dev setup keeps working.
  if (FS_WRITABLE) {
    try {
      const current = await readSiteFile();
      const next = { ...current, ...patch };
      await fs.writeFile(SITE_PATH, JSON.stringify(next, null, 2) + "\n", "utf-8");
    } catch (e) {
      console.error("[cms] local site.json mirror failed:", (e as Error).message);
    }
  }

  if (!savedToDb && !FS_WRITABLE && !WP_REST) {
    throw new Error("no writable content store (need DATABASE_URL)");
  }
  // Mirror editable docs into WordPress (best-effort).
  await Promise.all(
    (["hero", "heroSlides", "fees", "stats", "daycarePlans", "daycareFull", "academics", "results", "faqs", "daylong"] as const)
      .filter((k) => patch[k] !== undefined)
      .map((k) => wpUpsertOption(k, patch[k]))
  );
  // Mirror voices/events into their CPTs (stable slugs voice-N / event-N).
  if (patch.testimonials) {
    const items = patch.testimonials;
    await Promise.all(
      items.map((tm, i) =>
        wpUpsertCpt("testimonials", `voice-${i + 1}`, {
          title: tm.name,
          content: tm.text,
          meta: { meta_line: tm.meta },
        })
      )
    );
    await wpPrune("testimonials", "voice-", items.length);
  }
  if (patch.events) {
    const items = patch.events;
    await Promise.all(
      items.map((ev, i) =>
        wpUpsertCpt("events", `event-${i + 1}`, {
          title: ev.titleBn,
          content: ev.titleEn,
          meta: { event_date: ev.date, event_kind: ev.kind },
        })
      )
    );
    await wpPrune("events", "event-", items.length);
  }
  revalidateTag("wp-cms", { expire: 0 });
  return getSiteContent();
}

async function wpPrune(base: string, prefix: string, keep: number): Promise<void> {
  if (!WP_REST) return;
  try {
    const all = await wpGet<{ slug: string }[]>(`/${base}?per_page=100&_fields=slug`, { auth: true });
    if (!all) return;
    const extras = all
      .map((x) => x.slug)
      .filter((s) => s.startsWith(prefix))
      .map((s) => Number(s.slice(prefix.length)))
      .filter((n) => Number.isFinite(n) && n > keep);
    await Promise.all(extras.map((n) => wpDeleteCpt(base, `${prefix}${n}`)));
  } catch {
    /* ignore */
  }
}

export async function saveInquiry(data: Record<string, unknown>): Promise<void> {
  // Postgres is the inbox in production; the JSON file is a dev-only mirror.
  const saved = await insertDbInquiry({ ...data, at: new Date().toISOString() });
  if (!saved && FS_WRITABLE) {
    const db = await readDb();
    db.inquiries.unshift({ ...data, at: new Date().toISOString() });
    await writeDb(db);
  }
  if (!saved && !FS_WRITABLE) {
    // Never swallow a lost lead silently — surface it in the function logs.
    console.error("[cms] inquiry NOT persisted (no database, read-only fs):", JSON.stringify(data));
  }
}

export async function listInquiries(): Promise<CmsInquiry[]> {
  const fromDb = await listDbInquiries();
  if (fromDb) return fromDb;
  return (await readDb()).inquiries;
}

export function checkAdminKey(req: Request): boolean {
  const expected = process.env.ADMIN_KEY;
  // Fail closed: the old "cosmo123" fallback is public knowledge, so a
  // deployment that forgets ADMIN_KEY must not have an open admin panel.
  if (!expected) {
    if (process.env.NODE_ENV === "production") {
      console.error("[cms] ADMIN_KEY is not set — admin endpoints are locked.");
      return false;
    }
    return req.headers.get("x-admin-key") === "cosmo123";
  }
  return req.headers.get("x-admin-key") === expected;
}
