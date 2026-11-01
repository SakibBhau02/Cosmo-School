import { NextResponse } from "next/server";

import { authorizeAdmin, canWrite } from "@/lib/auth";
import {
  addGalleryPhotos,
  addPhotosFromMedia,
  getGalleryEventById,
  reorderGalleryPhotos,
} from "@/lib/gallery";
import { storeImage, validateImage } from "@/lib/storage";
import { revalidateGallery } from "../../../_revalidate";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Ctx = { params: Promise<{ id: string }> };

async function eventIdFrom(ctx: Ctx) {
  const { id } = await ctx.params;
  return Number.parseInt(id, 10);
}

function altFromName(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
}

export async function POST(req: Request, ctx: Ctx) {
  const user = await authorizeAdmin(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!canWrite(user)) return NextResponse.json({ error: "read-only account" }, { status: 403 });

  const eventId = await eventIdFrom(ctx);
  if (!Number.isFinite(eventId)) return NextResponse.json({ error: "bad id" }, { status: 400 });

  const event = await getGalleryEventById(eventId);
  if (!event) return NextResponse.json({ error: "Album not found." }, { status: 404 });

  const contentType = req.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const files = [...form.getAll("files"), ...form.getAll("file")].filter(
        (value): value is File => value instanceof File,
      );
      if (files.length === 0) {
        return NextResponse.json({ error: "Choose at least one image." }, { status: 400 });
      }
      if (files.length > 40) {
        return NextResponse.json({ error: "Upload at most 40 images at a time." }, { status: 400 });
      }

      const uploaded = [];
      for (const file of files) {
        const invalid = validateImage(file.type, file.size);
        if (invalid) throw new Error(`${file.name}: ${invalid}`);
        const stored = await storeImage(Buffer.from(await file.arrayBuffer()), file.name);
        uploaded.push({
          ...stored,
          altEn: altFromName(file.name),
          altBn: "",
        });
      }

      const photos = await addGalleryPhotos(eventId, uploaded, user.email);
      revalidateGallery(event.slug);
      return NextResponse.json({ photos });
    }

    const body = (await req.json()) as { mediaIds?: unknown };
    const mediaIds = Array.isArray(body.mediaIds)
      ? body.mediaIds.map((id) => Number(id)).filter((id) => Number.isFinite(id))
      : [];
    if (mediaIds.length === 0) {
      return NextResponse.json({ error: "Choose at least one media file." }, { status: 400 });
    }
    const photos = await addPhotosFromMedia(eventId, mediaIds, user.email);
    revalidateGallery(event.slug);
    return NextResponse.json({ photos });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 },
    );
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  const user = await authorizeAdmin(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!canWrite(user)) return NextResponse.json({ error: "read-only account" }, { status: 403 });

  const eventId = await eventIdFrom(ctx);
  if (!Number.isFinite(eventId)) return NextResponse.json({ error: "bad id" }, { status: 400 });

  let body: { order?: unknown };
  try {
    body = (await req.json()) as { order?: unknown };
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const order = Array.isArray(body.order)
    ? body.order.map((id) => Number(id)).filter((id) => Number.isFinite(id))
    : [];
  if (order.length === 0) return NextResponse.json({ error: "order is required" }, { status: 400 });

  try {
    const event = await getGalleryEventById(eventId);
    await reorderGalleryPhotos(eventId, order, user.email);
    revalidateGallery(event?.slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not reorder photos." },
      { status: 400 },
    );
  }
}
