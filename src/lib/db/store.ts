import { desc, eq, sql } from "drizzle-orm";
import { db, dbAvailable } from "./client";
import { inquiries, notices, siteDocs } from "./schema";

// Postgres-backed storage for the things /admin writes.
//
// Every function here is "null on failure" rather than "throw": the public site
// renders from data/*.json, and a cold or briefly unavailable Neon instance must
// never take the marketing pages down with it. Callers fall back to the files.

export type DbNotice = {
  slug: string;
  date: string;
  titleBn: string;
  titleEn: string;
  tag: string;
  bodyBn: string;
};

async function guard<T>(label: string, fn: () => Promise<T>): Promise<T | null> {
  if (!dbAvailable()) return null;
  try {
    return await fn();
  } catch (e) {
    console.error(`[db] ${label} failed:`, (e as Error).message);
    return null;
  }
}

// ---------- notices ----------

export function listDbNotices(): Promise<DbNotice[] | null> {
  return guard("listDbNotices", async () => {
    const rows = await db()
      .select()
      .from(notices)
      .where(eq(notices.status, "published"))
      .orderBy(desc(notices.publishedAt), desc(notices.slug));
    return rows.map((r) => ({
      slug: r.slug,
      date: r.date,
      titleBn: r.titleBn,
      titleEn: r.titleEn,
      tag: r.tag,
      bodyBn: r.bodyBn,
    }));
  });
}

export function getDbNotice(slug: string): Promise<DbNotice | null> {
  return guard("getDbNotice", async () => {
    const rows = await db().select().from(notices).where(eq(notices.slug, slug));
    const r = rows[0];
    return r
      ? { slug: r.slug, date: r.date, titleBn: r.titleBn, titleEn: r.titleEn, tag: r.tag, bodyBn: r.bodyBn }
      : null;
  });
}

/** Throws `slug-exists` when the primary key is taken (mirrors the file layer). */
export async function insertDbNotice(n: DbNotice): Promise<void> {
  if (!dbAvailable()) throw new Error("no-database");
  try {
    await db().insert(notices).values({
      slug: n.slug,
      date: n.date,
      titleBn: n.titleBn,
      titleEn: n.titleEn,
      tag: n.tag,
      bodyBn: n.bodyBn,
      status: "published",
    });
  } catch (e) {
    if ((e as { code?: string }).code === "23505") throw new Error("slug-exists");
    throw e;
  }
}

export async function updateDbNotice(slug: string, patch: Partial<DbNotice>): Promise<boolean> {
  if (!dbAvailable()) return false;
  const { slug: _omit, ...values } = patch;
  void _omit;
  if (Object.keys(values).length === 0) return true;
  const rows = await db().update(notices).set(values).where(eq(notices.slug, slug)).returning({ slug: notices.slug });
  return rows.length > 0;
}

export async function deleteDbNotice(slug: string): Promise<boolean> {
  if (!dbAvailable()) return false;
  const rows = await db().delete(notices).where(eq(notices.slug, slug)).returning({ slug: notices.slug });
  return rows.length > 0;
}

// ---------- inquiries ----------

export type DbInquiry = Record<string, unknown> & { at: string };

export function listDbInquiries(): Promise<DbInquiry[] | null> {
  return guard("listDbInquiries", async () => {
    const rows = await db().select().from(inquiries).orderBy(desc(inquiries.id)).limit(500);
    return rows.map((r) => ({
      ...((r.data as Record<string, unknown>) ?? {}),
      at: (r.at ?? new Date()).toISOString(),
    }));
  });
}

export async function insertDbInquiry(data: Record<string, unknown>): Promise<boolean> {
  if (!dbAvailable()) return false;
  try {
    const at = typeof data.at === "string" ? new Date(data.at) : new Date();
    await db()
      .insert(inquiries)
      .values({ data, status: "new", at: Number.isNaN(at.getTime()) ? new Date() : at });
    return true;
  } catch (e) {
    console.error("[db] insertDbInquiry failed:", (e as Error).message);
    return false;
  }
}

// ---------- site documents ----------

export function listSiteDocs(): Promise<Record<string, unknown> | null> {
  return guard("listSiteDocs", async () => {
    const rows = await db().select().from(siteDocs);
    const out: Record<string, unknown> = {};
    for (const r of rows) out[r.key] = r.doc;
    return out;
  });
}

export async function putSiteDocs(patch: Record<string, unknown>): Promise<boolean> {
  if (!dbAvailable()) return false;
  const entries = Object.entries(patch).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return true;
  try {
    await db()
      .insert(siteDocs)
      .values(entries.map(([key, doc]) => ({ key, doc })))
      .onConflictDoUpdate({
        target: siteDocs.key,
        set: {
          // `excluded` is the row we just tried to insert.
          doc: sql`excluded.doc`,
          updatedAt: new Date(),
        },
      });
    return true;
  } catch (e) {
    console.error("[db] putSiteDocs failed:", (e as Error).message);
    return false;
  }
}
