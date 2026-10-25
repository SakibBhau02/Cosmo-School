import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { checkAdminKey } from "@/lib/cms";
import { db, schema } from "@/lib/db/client";
import { deleteStored } from "@/lib/storage";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdminKey(req)) return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const rows = await db().select().from(schema.media).where(eq(schema.media.id, Number(id)));
  const row = rows[0];
  if (!row) return NextResponse.json({ message: "not-found" }, { status: 404 });
  await db().delete(schema.media).where(eq(schema.media.id, Number(id)));
  // Remove the stored object too — R2 key, local file, or nothing at all.
  await deleteStored(row.filePath);
  return NextResponse.json({ ok: true });
}
