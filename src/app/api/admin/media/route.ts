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
  const altBn = String(form.get("altBn") ?? "");
  const altEn = String(form.get("altEn") ?? "");
  const files = [...form.getAll("files"), ...form.getAll("file")].filter(
    (value): value is File => value instanceof File,
  );
  if (files.length === 0) return NextResponse.json({ message: "file missing" }, { status: 400 });
  if (files.length > 30)
    return NextResponse.json({ message: "Upload at most 30 files at a time." }, { status: 400 });

  for (const file of files) {
    const err = validateImage(file.type, file.size);
    if (err) return NextResponse.json({ message: `${file.name}: ${err}` }, { status: 400 });
  }

  const rows = [];
  for (const file of files) {
    const buf = Buffer.from(await file.arrayBuffer());
    const stored = await storeImage(buf, (file as File).name ?? "upload");
    const autoAlt = (file as File).name
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]+/g, " ")
      .trim()
      .slice(0, 300);
    const [row] = await db()
      .insert(schema.media)
      .values({
        filePath: stored.filePath,
        url: stored.url,
        width: stored.width,
        height: stored.height,
        size: stored.size,
        altBn,
        altEn: altEn || autoAlt,
        uploadedBy: "admin",
      })
      .returning();
    rows.push(row);
  }

  return NextResponse.json(files.length === 1 ? rows[0] : rows);
}
