import { NextResponse } from "next/server";

import { authorizeAdmin, canWrite } from "@/lib/auth";
import { deleteGalleryEvent, getGalleryEventById, updateGalleryEvent } from "@/lib/gallery";
import { revalidateGallery } from "../../_revalidate";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

async function idFrom(ctx: Ctx) {
  const { id } = await ctx.params;
  return Number.parseInt(id, 10);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const user = await authorizeAdmin(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!canWrite(user)) return NextResponse.json({ error: "read-only account" }, { status: 403 });

  const id = await idFrom(ctx);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  try {
    const existing = await getGalleryEventById(id);
    const event = await updateGalleryEvent(
      id,
      {
        titleEn: body.titleEn === undefined ? undefined : String(body.titleEn),
        titleBn: body.titleBn === undefined ? undefined : String(body.titleBn),
        slug: body.slug === undefined ? undefined : String(body.slug),
        descriptionEn:
          body.descriptionEn === undefined ? undefined : String(body.descriptionEn),
        descriptionBn:
          body.descriptionBn === undefined ? undefined : String(body.descriptionBn),
        eventDate: body.eventDate === undefined ? undefined : String(body.eventDate),
        location: body.location === undefined ? undefined : String(body.location),
        status: body.status === "draft" ? "draft" : body.status === "published" ? "published" : undefined,
        sort: body.sort === undefined ? undefined : Number(body.sort),
        coverUrl: body.coverUrl === undefined ? undefined : String(body.coverUrl),
        coverFile: body.coverFile === undefined ? undefined : String(body.coverFile),
      },
      user.email,
    );
    revalidateGallery(event.slug);
    if (existing && existing.slug !== event.slug) revalidateGallery(existing.slug);
    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save the album." },
      { status: 400 },
    );
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  const user = await authorizeAdmin(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!canWrite(user)) return NextResponse.json({ error: "read-only account" }, { status: 403 });

  const id = await idFrom(ctx);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });

  try {
    const existing = await getGalleryEventById(id);
    await deleteGalleryEvent(id, user.email);
    revalidateGallery(existing?.slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not delete the album." },
      { status: 400 },
    );
  }
}
