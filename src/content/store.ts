import "server-only";

import { unstable_cache } from "next/cache";
import { and, desc, eq, sql } from "drizzle-orm";
import { db, dbAvailable } from "@/lib/db/client";
import { auditLog, contentDocs, contentVersions } from "@/lib/db/schema";
import { previewMode } from "@/lib/preview";
import { cloneDoc, coerceToShape, mergeDoc } from "./merge";
import { CONTENT_DEFAULTS, CONTENT_PAGES, getPageSchema, isContentKey } from "./registry";
import type { ContentRecord, ContentSummary } from "./types";
import { globalDefaults } from "./defaults/global";
import { homeDefaults } from "./defaults/home";

type Row = {
  key: string;
  draft: unknown;
  published: unknown;
  updatedBy: string;
  updatedAt: Date;
  publishedAt: Date | null;
  publishedBy: string;
};

async function readRow(key: string): Promise<Row | null> {
  if (!dbAvailable()) return null;
  try {
    const rows = (await db()
      .select()
      .from(contentDocs)
      .where(eq(contentDocs.key, key))
      .limit(1)) as Row[];
    return rows[0] ?? null;
  } catch {
    // A cold or unreachable database must never take the public site down.
    return null;
  }
}

/**
 * Published documents are cached and tagged so a single `revalidateTag`
 * after publishing refreshes every page that renders them.
 */
const cachedPublished = unstable_cache(
  async (key: string): Promise<unknown> => {
    const defaults = CONTENT_DEFAULTS[key];
    const row = await readRow(key);
    return mergeDoc(defaults, row?.published ?? null);
  },
  ["content-published"],
  { tags: ["content"], revalidate: 300 },
);

export async function getPublishedDoc<T = unknown>(key: string): Promise<T> {
  if (!isContentKey(key)) throw new Error(`Unknown content key: ${key}`);
  return (await cachedPublished(key)) as T;
}

/**
 * What a page should render right now: the published document for visitors, or
 * the editor's draft while an admin is in preview mode. Public pages call this
 * instead of `getPublishedDoc` so “Preview draft” needs no per-page wiring.
 */
export async function getDocForView<T = unknown>(key: string): Promise<T> {
  if (!isContentKey(key)) throw new Error(`Unknown content key: ${key}`);
  if (await previewMode()) {
    const record = await getContentRecord(key);
    return record.draft as T;
  }
  return getPublishedDoc<T>(key);
}

export async function getGlobalContent() {
  return getPublishedDoc<typeof globalDefaults>("global");
}

export async function getHomeContent() {
  return getPublishedDoc<typeof homeDefaults>("home");
}

/** Site settings for the current request (draft while previewing). */
export async function getGlobalForView() {
  return getDocForView<typeof globalDefaults>("global");
}

/** Home document for the current request (draft while previewing). */
export async function getHomeForView() {
  return getDocForView<typeof homeDefaults>("home");
}

/** Draft (what the editor sees) falling back to published, then defaults. */
export async function getContentRecord(key: string): Promise<ContentRecord> {
  if (!isContentKey(key)) throw new Error(`Unknown content key: ${key}`);
  const defaults = CONTENT_DEFAULTS[key];
  const row = await readRow(key);
  const published = mergeDoc(defaults, row?.published ?? null) as Record<string, unknown>;
  const draft = row?.draft
    ? (mergeDoc(defaults, row.draft) as Record<string, unknown>)
    : cloneDoc(published);
  return {
    key,
    draft,
    published,
    hasDraft: Boolean(row?.draft) && JSON.stringify(row?.draft) !== JSON.stringify(row?.published),
    updatedAt: row?.updatedAt ? row.updatedAt.toISOString() : null,
    updatedBy: row?.updatedBy || null,
  };
}

export async function saveDraft(
  key: string,
  patch: unknown,
  user: string,
): Promise<Record<string, unknown>> {
  if (!isContentKey(key)) throw new Error(`Unknown content key: ${key}`);
  const defaults = CONTENT_DEFAULTS[key];
  const doc = coerceToShape(defaults, patch) as Record<string, unknown>;

  if (!dbAvailable()) throw new Error("Database is not configured");

  const existing = await readRow(key);
  const now = new Date();

  await db()
    .insert(contentDocs)
    .values({
      key,
      draft: doc,
      published: existing?.published ?? null,
      updatedBy: user,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: contentDocs.key,
      set: { draft: doc, updatedBy: user, updatedAt: now },
    });

  await db().insert(auditLog).values({
    who: user,
    action: "update",
    tableName: "content_docs",
    rowId: key,
    after: doc,
  });

  return doc;
}

export async function publishDraft(
  key: string,
  user: string,
): Promise<{ doc: Record<string, unknown>; version: number }> {
  const row = await readRow(key);
  if (!row) throw new Error("Nothing to publish yet — save a draft first.");

  const defaults = CONTENT_DEFAULTS[key];
  const doc = coerceToShape(defaults, row.draft) as Record<string, unknown>;
  const now = new Date();

  const versionRow = await db()
    .select({ max: sql<number>`coalesce(max(${contentVersions.version}), 0)` })
    .from(contentVersions)
    .where(eq(contentVersions.key, key));
  const version = Number(versionRow[0]?.max ?? 0) + 1;

  await db()
    .update(contentDocs)
    .set({ published: doc, publishedAt: now, publishedBy: user, updatedBy: user, updatedAt: now })
    .where(eq(contentDocs.key, key));

  await db().insert(contentVersions).values({ key, version, doc, savedBy: user });
  await db().insert(auditLog).values({
    who: user,
    action: "publish",
    tableName: "content_docs",
    rowId: key,
    after: doc,
  });

  return { doc, version };
}

export async function resetDocument(key: string, user: string): Promise<void> {
  if (!isContentKey(key)) throw new Error(`Unknown content key: ${key}`);
  if (!dbAvailable()) throw new Error("Database is not configured");
  await db().delete(contentDocs).where(eq(contentDocs.key, key));
  await db().insert(auditLog).values({
    who: user,
    action: "delete",
    tableName: "content_docs",
    rowId: key,
  });
}

export async function listContentVersions(key: string, limit = 10) {
  if (!dbAvailable()) return [];
  try {
    return await db()
      .select()
      .from(contentVersions)
      .where(eq(contentVersions.key, key))
      .orderBy(desc(contentVersions.version))
      .limit(limit);
  } catch {
    return [];
  }
}

/** Load an old published snapshot back into the draft (publish is still manual). */
export async function restoreVersion(
  key: string,
  version: number,
  user: string,
): Promise<Record<string, unknown>> {
  if (!isContentKey(key)) throw new Error(`Unknown content key: ${key}`);
  if (!dbAvailable()) throw new Error("Database is not configured");

  const rows = await db()
    .select({ doc: contentVersions.doc })
    .from(contentVersions)
    .where(and(eq(contentVersions.key, key), eq(contentVersions.version, version)))
    .limit(1);

  const snapshot = rows[0]?.doc;
  if (!snapshot) throw new Error(`Version ${version} not found.`);

  const defaults = CONTENT_DEFAULTS[key];
  const doc = coerceToShape(defaults, snapshot) as Record<string, unknown>;
  const now = new Date();

  await db()
    .insert(contentDocs)
    .values({ key, draft: doc, updatedBy: user, updatedAt: now })
    .onConflictDoUpdate({
      target: contentDocs.key,
      set: { draft: doc, updatedBy: user, updatedAt: now },
    });

  await db().insert(auditLog).values({
    who: user,
    action: "restore",
    tableName: "content_docs",
    rowId: key,
    after: { version },
  });

  return doc;
}

export async function listRecentActivity(limit = 8) {
  if (!dbAvailable()) return [];
  try {
    return await db()
      .select({
        id: auditLog.id,
        who: auditLog.who,
        action: auditLog.action,
        tableName: auditLog.tableName,
        rowId: auditLog.rowId,
        at: auditLog.at,
      })
      .from(auditLog)
      .orderBy(desc(auditLog.id))
      .limit(limit);
  } catch {
    return [];
  }
}

export async function listContent(): Promise<ContentSummary[]> {  const rows = dbAvailable()
    ? await db()
        .select({
          key: contentDocs.key,
          updatedAt: contentDocs.updatedAt,
          updatedBy: contentDocs.updatedBy,
          draft: contentDocs.draft,
          published: contentDocs.published,
        })
        .from(contentDocs)
        .catch(() => [])
    : [];

  const byKey = new Map(rows.map((r) => [r.key, r]));

  return CONTENT_PAGES.map((page) => {
    const row = byKey.get(page.key);
    const hasDraft =
      Boolean(row) && JSON.stringify(row!.draft) !== JSON.stringify(row!.published ?? null);
    return {
      key: page.key,
      label: page.label,
      path: page.path,
      group: page.group,
      status: !row ? "default" : hasDraft ? "draft" : "published",
      hasDraft,
      updatedAt: row?.updatedAt ? row.updatedAt.toISOString() : null,
      updatedBy: row?.updatedBy || null,
    } satisfies ContentSummary;
  });
}

export { getPageSchema, isContentKey };
