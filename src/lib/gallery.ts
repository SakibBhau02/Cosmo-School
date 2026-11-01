import "server-only";

import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";

import { db, dbAvailable } from "@/lib/db/client";
import { auditLog, galleryEvents, galleryPhotos, media } from "@/lib/db/schema";

export type GalleryPhoto = {
  id: number;
  eventId: number;
  url: string;
  filePath: string;
  width: number | null;
  height: number | null;
  size: number | null;
  altEn: string;
  altBn: string;
  captionEn: string;
  captionBn: string;
  sort: number;
  createdAt: string | null;
};

export type GalleryEvent = {
  id: number;
  slug: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  eventDate: string;
  location: string;
  coverUrl: string;
  coverFile: string;
  status: "draft" | "published";
  sort: number;
  photoCount: number;
  /** Explicit cover, or the first photo as a graceful fallback. */
  cover: string;
  createdAt: string | null;
  updatedAt: string | null;
  photos?: GalleryPhoto[];
};

type EventRow = typeof galleryEvents.$inferSelect;
type PhotoRow = typeof galleryPhotos.$inferSelect;

function toPhoto(row: PhotoRow): GalleryPhoto {
  return {
    id: row.id,
    eventId: row.eventId,
    url: row.url,
    filePath: row.filePath,
    width: row.width,
    height: row.height,
    size: row.size,
    altEn: row.altEn,
    altBn: row.altBn,
    captionEn: row.captionEn,
    captionBn: row.captionBn,
    sort: row.sort,
    createdAt: row.createdAt ? row.createdAt.toISOString() : null,
  };
}

function toEvent(row: EventRow, photos: GalleryPhoto[]): GalleryEvent {
  return {
    id: row.id,
    slug: row.slug,
    titleEn: row.titleEn,
    titleBn: row.titleBn,
    descriptionEn: row.descriptionEn,
    descriptionBn: row.descriptionBn,
    eventDate: row.eventDate,
    location: row.location,
    coverUrl: row.coverUrl,
    coverFile: row.coverFile,
    status: row.status === "draft" ? "draft" : "published",
    sort: row.sort,
    photoCount: photos.length,
    cover: row.coverUrl || photos[0]?.url || "",
    createdAt: row.createdAt ? row.createdAt.toISOString() : null,
    updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
    photos,
  };
}

/** All albums, newest first, with their photos. Fails soft to an empty list. */
export async function listGalleryEvents({
  publishedOnly = false,
}: {
  publishedOnly?: boolean;
} = {}): Promise<GalleryEvent[]> {
  if (!dbAvailable()) return [];
  try {
    const eventRows = await db()
      .select()
      .from(galleryEvents)
      .where(publishedOnly ? eq(galleryEvents.status, "published") : undefined)
      .orderBy(asc(galleryEvents.sort), desc(galleryEvents.id));

    if (eventRows.length === 0) return [];

    const photoRows = await db()
      .select()
      .from(galleryPhotos)
      .where(
        inArray(
          galleryPhotos.eventId,
          eventRows.map((row) => row.id),
        ),
      )
      .orderBy(asc(galleryPhotos.sort), asc(galleryPhotos.id));

    const byEvent = new Map<number, GalleryPhoto[]>();
    for (const row of photoRows) {
      const list = byEvent.get(row.eventId) ?? [];
      list.push(toPhoto(row));
      byEvent.set(row.eventId, list);
    }

    return eventRows.map((row) => toEvent(row, byEvent.get(row.id) ?? []));
  } catch {
    return [];
  }
}

export async function getGalleryEventBySlug(
  slug: string,
  { publishedOnly = true }: { publishedOnly?: boolean } = {},
): Promise<GalleryEvent | null> {
  if (!dbAvailable()) return null;
  try {
    const rows = await db()
      .select()
      .from(galleryEvents)
      .where(
        publishedOnly
          ? and(eq(galleryEvents.slug, slug), eq(galleryEvents.status, "published"))
          : eq(galleryEvents.slug, slug),
      )
      .limit(1);
    const row = rows[0];
    if (!row) return null;

    const photos = await db()
      .select()
      .from(galleryPhotos)
      .where(eq(galleryPhotos.eventId, row.id))
      .orderBy(asc(galleryPhotos.sort), asc(galleryPhotos.id));

    return toEvent(row, photos.map(toPhoto));
  } catch {
    return null;
  }
}

export async function getGalleryEventById(id: number): Promise<GalleryEvent | null> {
  if (!dbAvailable()) return null;
  try {
    const rows = await db().select().from(galleryEvents).where(eq(galleryEvents.id, id)).limit(1);
    const row = rows[0];
    if (!row) return null;

    const photos = await db()
      .select()
      .from(galleryPhotos)
      .where(eq(galleryPhotos.eventId, row.id))
      .orderBy(asc(galleryPhotos.sort), asc(galleryPhotos.id));

    return toEvent(row, photos.map(toPhoto));
  } catch {
    return null;
  }
}

export async function listGallerySlugs(): Promise<{ slug: string; updatedAt: string | null }[]> {
  if (!dbAvailable()) return [];
  try {
    const rows = await db()
      .select({ slug: galleryEvents.slug, updatedAt: galleryEvents.updatedAt })
      .from(galleryEvents)
      .where(eq(galleryEvents.status, "published"))
      .orderBy(desc(galleryEvents.updatedAt));
    return rows.map((row) => ({
      slug: row.slug,
      updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
    }));
  } catch {
    return [];
  }
}

export async function galleryStats(): Promise<{ albums: number; photos: number; drafts: number }> {
  if (!dbAvailable()) return { albums: 0, photos: 0, drafts: 0 };
  try {
    const [events, photos] = await Promise.all([
      db()
        .select({
          total: sql<number>`count(*)::int`,
          drafts: sql<number>`count(*) filter (where ${galleryEvents.status} = 'draft')::int`,
        })
        .from(galleryEvents),
      db().select({ total: sql<number>`count(*)::int` }).from(galleryPhotos),
    ]);
    return {
      albums: Number(events[0]?.total ?? 0),
      drafts: Number(events[0]?.drafts ?? 0),
      photos: Number(photos[0]?.total ?? 0),
    };
  } catch {
    return { albums: 0, photos: 0, drafts: 0 };
  }
}

/* ── writes (admin only) ─────────────────────────────────────────────────── */

export type GalleryEventInput = {
  titleEn?: string;
  titleBn?: string;
  slug?: string;
  descriptionEn?: string;
  descriptionBn?: string;
  eventDate?: string;
  location?: string;
  status?: "draft" | "published";
  sort?: number;
  coverUrl?: string;
  coverFile?: string;
};

function clean(value: unknown, max = 400): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
  return slug || `album-${Math.random().toString(36).slice(2, 8)}`;
}

async function uniqueSlug(base: string, ignoreId?: number): Promise<string> {
  let slug = base;
  for (let i = 2; i < 200; i += 1) {
    const rows = await db()
      .select({ id: galleryEvents.id })
      .from(galleryEvents)
      .where(eq(galleryEvents.slug, slug))
      .limit(1);
    if (!rows[0] || rows[0].id === ignoreId) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

async function audit(user: string, action: string, rowId: string | number, after?: unknown) {
  await db()
    .insert(auditLog)
    .values({
      who: user,
      action,
      tableName: "gallery_events",
      rowId: String(rowId),
      after: (after ?? null) as never,
    })
    .catch(() => {});
}

export async function createGalleryEvent(
  input: GalleryEventInput,
  user: string,
): Promise<GalleryEvent> {
  if (!dbAvailable()) throw new Error("Database is not configured");
  const titleEn = clean(input.titleEn, 160);
  if (!titleEn) throw new Error("An English album title is required.");

  const slug = await uniqueSlug(input.slug ? slugify(input.slug) : slugify(titleEn));
  const [row] = await db()
    .insert(galleryEvents)
    .values({
      slug,
      titleEn,
      titleBn: clean(input.titleBn, 160),
      descriptionEn: clean(input.descriptionEn, 4000),
      descriptionBn: clean(input.descriptionBn, 4000),
      eventDate: clean(input.eventDate, 80),
      location: clean(input.location, 160),
      status: input.status === "draft" ? "draft" : "published",
      sort: Number.isFinite(input.sort) ? Number(input.sort) : 0,
    })
    .returning();

  await audit(user, "create", row.id, { slug, titleEn });
  return toEvent(row, []);
}

export async function updateGalleryEvent(
  id: number,
  input: GalleryEventInput,
  user: string,
): Promise<GalleryEvent> {
  if (!dbAvailable()) throw new Error("Database is not configured");
  const rows = await db().select().from(galleryEvents).where(eq(galleryEvents.id, id)).limit(1);
  const existing = rows[0];
  if (!existing) throw new Error("Album not found.");

  const patch: Partial<typeof galleryEvents.$inferInsert> = { updatedAt: new Date() };
  if (input.titleEn !== undefined) {
    const titleEn = clean(input.titleEn, 160);
    if (!titleEn) throw new Error("An English album title is required.");
    patch.titleEn = titleEn;
  }
  if (input.titleBn !== undefined) patch.titleBn = clean(input.titleBn, 160);
  if (input.descriptionEn !== undefined) patch.descriptionEn = clean(input.descriptionEn, 4000);
  if (input.descriptionBn !== undefined) patch.descriptionBn = clean(input.descriptionBn, 4000);
  if (input.eventDate !== undefined) patch.eventDate = clean(input.eventDate, 80);
  if (input.location !== undefined) patch.location = clean(input.location, 160);
  if (input.status !== undefined) patch.status = input.status === "draft" ? "draft" : "published";
  if (input.sort !== undefined && Number.isFinite(input.sort)) patch.sort = Number(input.sort);
  if (input.coverUrl !== undefined) patch.coverUrl = clean(input.coverUrl, 1000);
  if (input.coverFile !== undefined) patch.coverFile = clean(input.coverFile, 1000);
  if (input.slug !== undefined && input.slug && input.slug !== existing.slug) {
    patch.slug = await uniqueSlug(slugify(input.slug), id);
  }

  await db().update(galleryEvents).set(patch).where(eq(galleryEvents.id, id));
  await audit(user, "update", id, patch);
  const updated = await getGalleryEventById(id);
  if (!updated) throw new Error("Album not found.");
  return updated;
}

/** Album slug for a photo, used to refresh the right public page. */
export async function galleryPhotoEventSlug(id: number): Promise<string | null> {
  if (!dbAvailable()) return null;
  try {
    const rows = await db()
      .select({ slug: galleryEvents.slug })
      .from(galleryPhotos)
      .innerJoin(galleryEvents, eq(galleryEvents.id, galleryPhotos.eventId))
      .where(eq(galleryPhotos.id, id))
      .limit(1);
    return rows[0]?.slug ?? null;
  } catch {
    return null;
  }
}

export async function deleteGalleryEvent(id: number, user: string): Promise<void> {
  if (!dbAvailable()) throw new Error("Database is not configured");
  const rows = await db().select().from(galleryEvents).where(eq(galleryEvents.id, id)).limit(1);
  if (!rows[0]) throw new Error("Album not found.");
  await db().delete(galleryEvents).where(eq(galleryEvents.id, id));
  await audit(user, "delete", id, { slug: rows[0].slug });
}

export type PhotoInput = {
  url: string;
  filePath?: string;
  width?: number | null;
  height?: number | null;
  size?: number | null;
  altEn?: string;
  altBn?: string;
  captionEn?: string;
  captionBn?: string;
};

export async function addGalleryPhotos(
  eventId: number,
  photos: PhotoInput[],
  user: string,
): Promise<GalleryPhoto[]> {
  if (!dbAvailable()) throw new Error("Database is not configured");
  if (photos.length === 0) return [];

  const maxRow = await db()
    .select({ max: sql<number>`coalesce(max(${galleryPhotos.sort}), 0)` })
    .from(galleryPhotos)
    .where(eq(galleryPhotos.eventId, eventId));
  let sort = Number(maxRow[0]?.max ?? 0);

  const rows = await db()
    .insert(galleryPhotos)
    .values(
      photos.map((photo) => ({
        eventId,
        url: clean(photo.url, 1200),
        filePath: clean(photo.filePath, 1200),
        width: photo.width ?? null,
        height: photo.height ?? null,
        size: photo.size ?? null,
        altEn: clean(photo.altEn, 300),
        altBn: clean(photo.altBn, 300),
        captionEn: clean(photo.captionEn, 400),
        captionBn: clean(photo.captionBn, 400),
        sort: (sort += 1),
      })),
    )
    .returning();

  await audit(user, "update", eventId, { addedPhotos: rows.length });
  return rows.map(toPhoto);
}

/** Add copies of existing media-library rows to an album. */
export async function addPhotosFromMedia(
  eventId: number,
  mediaIds: number[],
  user: string,
): Promise<GalleryPhoto[]> {
  if (!dbAvailable()) throw new Error("Database is not configured");
  if (mediaIds.length === 0) return [];
  const rows = await db().select().from(media).where(inArray(media.id, mediaIds));
  return addGalleryPhotos(
    eventId,
    rows.map((row) => ({
      url: row.url,
      filePath: row.filePath,
      width: row.width,
      height: row.height,
      size: row.size,
      altEn: row.altEn,
      altBn: row.altBn,
    })),
    user,
  );
}

export async function updateGalleryPhoto(
  id: number,
  patch: {
    altEn?: string;
    altBn?: string;
    captionEn?: string;
    captionBn?: string;
    sort?: number;
  },
  user: string,
): Promise<GalleryPhoto> {
  if (!dbAvailable()) throw new Error("Database is not configured");
  const values: Partial<typeof galleryPhotos.$inferInsert> = {};
  if (patch.altEn !== undefined) values.altEn = clean(patch.altEn, 300);
  if (patch.altBn !== undefined) values.altBn = clean(patch.altBn, 300);
  if (patch.captionEn !== undefined) values.captionEn = clean(patch.captionEn, 400);
  if (patch.captionBn !== undefined) values.captionBn = clean(patch.captionBn, 400);
  if (patch.sort !== undefined && Number.isFinite(patch.sort)) values.sort = Number(patch.sort);
  if (Object.keys(values).length === 0) {
    const current = await db().select().from(galleryPhotos).where(eq(galleryPhotos.id, id)).limit(1);
    if (!current[0]) throw new Error("Photo not found.");
    return toPhoto(current[0]);
  }
  const [row] = await db().update(galleryPhotos).set(values).where(eq(galleryPhotos.id, id)).returning();
  if (!row) throw new Error("Photo not found.");
  await audit(user, "update", row.eventId, { photo: id, ...values });
  return toPhoto(row);
}

export async function deleteGalleryPhoto(id: number, user: string): Promise<void> {
  if (!dbAvailable()) throw new Error("Database is not configured");
  const rows = await db().select().from(galleryPhotos).where(eq(galleryPhotos.id, id)).limit(1);
  if (!rows[0]) throw new Error("Photo not found.");
  await db().delete(galleryPhotos).where(eq(galleryPhotos.id, id));
  await audit(user, "update", rows[0].eventId, { removedPhoto: id });
}

/** Persist the visual order of an album's photos. */
export async function reorderGalleryPhotos(
  eventId: number,
  order: number[],
  user: string,
): Promise<void> {
  if (!dbAvailable()) throw new Error("Database is not configured");
  const rows = await db()
    .select({ id: galleryPhotos.id })
    .from(galleryPhotos)
    .where(eq(galleryPhotos.eventId, eventId));
  const allowed = new Set(rows.map((row) => row.id));
  const ids = order.filter((id) => allowed.has(id));
  if (ids.length !== rows.length) throw new Error("The photo order is out of date. Reload the album.");

  await Promise.all(
    ids.map((id, index) =>
      db()
        .update(galleryPhotos)
        .set({ sort: index + 1 })
        .where(and(eq(galleryPhotos.id, id), eq(galleryPhotos.eventId, eventId))),
    ),
  );
  await audit(user, "update", eventId, { order: ids });
}
