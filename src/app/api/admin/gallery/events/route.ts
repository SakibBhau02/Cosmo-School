import { NextResponse } from "next/server";

import { authorizeAdmin, canWrite } from "@/lib/auth";
import { createGalleryEvent, listGalleryEvents } from "@/lib/gallery";
import { revalidateGallery } from "../_revalidate";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await authorizeAdmin(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ events: await listGalleryEvents() });
}

export async function POST(req: Request) {
  const user = await authorizeAdmin(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!canWrite(user)) return NextResponse.json({ error: "read-only account" }, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  try {
    const event = await createGalleryEvent(
      {
        titleEn: String(body.titleEn ?? ""),
        titleBn: String(body.titleBn ?? ""),
        slug: String(body.slug ?? ""),
        descriptionEn: String(body.descriptionEn ?? ""),
        descriptionBn: String(body.descriptionBn ?? ""),
        eventDate: String(body.eventDate ?? ""),
        location: String(body.location ?? ""),
        status: body.status === "draft" ? "draft" : "published",
        sort: Number(body.sort ?? 0),
      },
      user.email,
    );
    revalidateGallery(event.slug);
    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create the album." },
      { status: 400 },
    );
  }
}
