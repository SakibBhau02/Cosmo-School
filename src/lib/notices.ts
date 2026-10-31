import "server-only";

import { desc, eq } from "drizzle-orm";

import { db, dbAvailable } from "@/lib/db/client";
import { notices as noticesTable } from "@/lib/db/schema";
import { notices as seedNotices } from "@/config/site";

export type NoticeStatus = "draft" | "published";

export type Notice = {
  slug: string;
  date: string;
  tag: string;
  tagEn: string;
  titleBn: string;
  titleEn: string;
  bodyBn: string;
  bodyEn: string;
  pinned: boolean;
  status: NoticeStatus;
  publishedAt: string | null;
};

export type NoticeInput = {
  slug?: string;
  date?: string;
  tag?: string;
  tagEn?: string;
  titleBn?: string;
  titleEn?: string;
  bodyBn?: string;
  bodyEn?: string;
  pinned?: boolean;
  status?: NoticeStatus;
};

const MAX = { short: 300, body: 20_000 };
const SLUG = /^[a-z0-9][a-z0-9-]{0,120}$/;

function clamp(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function fromRow(row: typeof noticesTable.$inferSelect): Notice {
  return {
    slug: row.slug,
    date: row.date,
    tag: row.tag,
    tagEn: row.tagEn,
    titleBn: row.titleBn,
    titleEn: row.titleEn,
    bodyBn: row.bodyBn,
    bodyEn: row.bodyEn,
    pinned: row.pinned,
    status: row.status === "draft" ? "draft" : "published",
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
  };
}

function fromSeed(): Notice[] {
  return seedNotices.map((n) => ({
    slug: n.slug,
    date: n.date,
    tag: n.tag,
    tagEn: "",
    titleBn: n.titleBn,
    titleEn: n.titleEn,
    bodyBn: n.bodyBn,
    bodyEn: "",
    pinned: false,
    status: "published" as const,
    publishedAt: null,
  }));
}

async function query<T>(label: string, fn: () => Promise<T>): Promise<T | null> {
  if (!dbAvailable()) return null;
  try {
    return await fn();
  } catch (error) {
    console.error(`[notices] ${label} failed:`, (error as Error).message);
    return null;
  }
}

/** Published notices for the public site: pinned first, newest first. */
export async function listPublishedNotices(): Promise<Notice[]> {
  const rows = await query("listPublished", () =>
    db().select().from(noticesTable).where(eq(noticesTable.status, "published")),
  );
  if (!rows) return fromSeed();

  const mapped = rows.map(fromRow).sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
  });

  return mapped.length > 0 ? mapped : fromSeed();
}

export async function getPublishedNotice(slug: string): Promise<Notice | null> {
  const rows = await query("getPublished", () =>
    db().select().from(noticesTable).where(eq(noticesTable.slug, slug)),
  );
  const row = rows?.[0];
  if (row && row.status === "published") return fromRow(row);
  if (rows) return null;
  return fromSeed().find((n) => n.slug === slug) ?? null;
}

/** Every notice, drafts included — admin only. */
export async function listAllNotices(): Promise<Notice[]> {
  const rows = await query("listAll", () =>
    db().select().from(noticesTable).orderBy(desc(noticesTable.publishedAt), desc(noticesTable.slug)),
  );
  if (!rows) return fromSeed();
  return rows.map(fromRow);
}

export async function getNoticeBySlug(slug: string): Promise<Notice | null> {
  const rows = await query("getBySlug", () =>
    db().select().from(noticesTable).where(eq(noticesTable.slug, slug)),
  );
  if (!rows) return fromSeed().find((n) => n.slug === slug) ?? null;
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function createNotice(input: NoticeInput): Promise<Notice> {
  if (!dbAvailable()) throw new Error("Database is not configured.");

  const titleEn = clamp(input.titleEn, MAX.short);
  const titleBn = clamp(input.titleBn, MAX.short);
  const bodyEn = clamp(input.bodyEn, MAX.body);
  const bodyBn = clamp(input.bodyBn, MAX.body);

  if (!titleEn && !titleBn) throw new Error("A title is required.");
  if (!bodyEn && !bodyBn) throw new Error("A body is required.");

  const slug = clamp(input.slug, 120) || slugify(titleEn || titleBn);
  if (!SLUG.test(slug)) {
    throw new Error("Slug must be lowercase letters, numbers and dashes.");
  }

  const status: NoticeStatus = input.status === "draft" ? "draft" : "published";

  try {
    const rows = await db()
      .insert(noticesTable)
      .values({
        slug,
        date: clamp(input.date, 80),
        tag: clamp(input.tag, 60) || "নোটিশ",
        tagEn: clamp(input.tagEn, 60) || "Notice",
        titleBn: titleBn || titleEn,
        titleEn,
        bodyBn: bodyBn || bodyEn,
        bodyEn,
        pinned: Boolean(input.pinned),
        status,
        publishedAt: status === "published" ? new Date() : null,
      })
      .returning();
    return fromRow(rows[0]);
  } catch (error) {
    if ((error as { code?: string }).code === "23505") throw new Error("slug-exists");
    throw error;
  }
}

export async function updateNoticeBySlug(
  slug: string,
  patch: NoticeInput,
): Promise<Notice | null> {
  if (!dbAvailable()) throw new Error("Database is not configured.");

  const values: Partial<typeof noticesTable.$inferInsert> = {};
  if (patch.date !== undefined) values.date = clamp(patch.date, 80);
  if (patch.tag !== undefined) values.tag = clamp(patch.tag, 60) || "নোটিশ";
  if (patch.tagEn !== undefined) values.tagEn = clamp(patch.tagEn, 60);
  if (patch.titleBn !== undefined) values.titleBn = clamp(patch.titleBn, MAX.short);
  if (patch.titleEn !== undefined) values.titleEn = clamp(patch.titleEn, MAX.short);
  if (patch.bodyBn !== undefined) values.bodyBn = clamp(patch.bodyBn, MAX.body);
  if (patch.bodyEn !== undefined) values.bodyEn = clamp(patch.bodyEn, MAX.body);
  if (patch.pinned !== undefined) values.pinned = Boolean(patch.pinned);

  if (patch.status !== undefined) {
    const status: NoticeStatus = patch.status === "draft" ? "draft" : "published";
    values.status = status;
    if (status === "published") values.publishedAt = new Date();
  }

  if (Object.keys(values).length === 0) return getNoticeBySlug(slug);

  const rows = await db()
    .update(noticesTable)
    .set(values)
    .where(eq(noticesTable.slug, slug))
    .returning();
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function deleteNoticeBySlug(slug: string): Promise<boolean> {
  if (!dbAvailable()) throw new Error("Database is not configured.");
  const rows = await db()
    .delete(noticesTable)
    .where(eq(noticesTable.slug, slug))
    .returning({ slug: noticesTable.slug });
  return rows.length > 0;
}
