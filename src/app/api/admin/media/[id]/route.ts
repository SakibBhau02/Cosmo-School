import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { authorizeAdmin, canWrite } from "@/lib/auth";
import { db, schema } from "@/lib/db/client";
import { deleteStored } from "@/lib/storage";

type Ctx = { params: Promise<{ id: string }> };

/** Update the alt text (used by the media library and the image picker). */
export async function PATCH(req: Request, { params }: Ctx) {
  if (!canWrite(await authorizeAdmin(req)))
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as {
    altEn?: unknown;
    altBn?: unknown;
  } | null;
  if (!body) return NextResponse.json({ message: "invalid JSON" }, { status: 400 });

  const values: Partial<typeof schema.media.$inferInsert> = {};
  if (typeof body.altEn === "string") values.altEn = body.altEn.slice(0, 300);
  if (typeof body.altBn === "string") values.altBn = body.altBn.slice(0, 300);
  if (Object.keys(values).length === 0)
    return NextResponse.json({ message: "nothing to update" }, { status: 400 });

  const rows = await db()
    .update(schema.media)
    .set(values)
    .where(eq(schema.media.id, Number(id)))
    .returning();
  if (!rows[0]) return NextResponse.json({ message: "not-found" }, { status: 404 });
  return NextResponse.json({ ok: true, media: rows[0] });
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!canWrite(await authorizeAdmin(req)))
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const rows = await db().select().from(schema.media).where(eq(schema.media.id, Number(id)));
  const row = rows[0];
  if (!row) return NextResponse.json({ message: "not-found" }, { status: 404 });
  await db().delete(schema.media).where(eq(schema.media.id, Number(id)));
  // Remove the stored object too — R2 key, local file, or nothing at all.
  await deleteStored(row.filePath);
  return NextResponse.json({ ok: true });
}
