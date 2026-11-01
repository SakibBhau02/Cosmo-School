import { NextResponse } from "next/server";

import { authorizeAdmin, canWrite } from "@/lib/auth";
import { deleteGalleryPhoto, galleryPhotoEventSlug, updateGalleryPhoto } from "@/lib/gallery";
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
    const slug = await galleryPhotoEventSlug(id);
    const photo = await updateGalleryPhoto(
      id,
      {
        altEn: body.altEn === undefined ? undefined : String(body.altEn),
        altBn: body.altBn === undefined ? undefined : String(body.altBn),
        captionEn: body.captionEn === undefined ? undefined : String(body.captionEn),
        captionBn: body.captionBn === undefined ? undefined : String(body.captionBn),
        sort: body.sort === undefined ? undefined : Number(body.sort),
      },
      user.email,
    );
    revalidateGallery(slug);
    return NextResponse.json({ photo });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save the photo." },
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
    const slug = await galleryPhotoEventSlug(id);
    await deleteGalleryPhoto(id, user.email);
    revalidateGallery(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not delete the photo." },
      { status: 400 },
    );
  }
}
