import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { authorizeAdmin, canWrite } from "@/lib/auth";
import { db, schema } from "@/lib/db/client";
import { storeImage, validateImage } from "@/lib/storage";

export async function GET(req: Request) {
  if (!(await authorizeAdmin(req)))
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  const rows = await db().select().from(schema.media).orderBy(desc(schema.media.id)).limit(100);
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  if (!canWrite(await authorizeAdmin(req)))
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  const altBn = String(form.get("altBn") ?? "");
  const altEn = String(form.get("altEn") ?? "");
  if (!(file instanceof Blob)) return NextResponse.json({ message: "file missing" }, { status: 400 });
  const err = validateImage(file.type, file.size);
  if (err) return NextResponse.json({ message: err }, { status: 400 });
  const buf = Buffer.from(await file.arrayBuffer());
  const stored = await storeImage(buf, (file as File).name ?? "upload");
  const [row] = await db()
    .insert(schema.media)
    .values({
      filePath: stored.filePath,
      url: stored.url,
      width: stored.width,
      height: stored.height,
      size: stored.size,
      altBn,
      altEn,
      uploadedBy: "admin",
    })
    .returning();
  return NextResponse.json(row);
}
