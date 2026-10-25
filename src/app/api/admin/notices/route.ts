import { NextRequest, NextResponse } from "next/server";
import { addNotice, checkAdminKey, type CmsNotice } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as CmsNotice | null;
  if (!body?.slug || !body?.titleBn || !body?.bodyBn) {
    return NextResponse.json({ message: "slug, titleBn, bodyBn required" }, { status: 400 });
  }
  try {
    await addNotice({
      slug: body.slug.trim(),
      date: body.date?.trim() || "চলমান",
      titleBn: body.titleBn.trim(),
      titleEn: body.titleEn?.trim() || body.titleBn.trim(),
      tag: body.tag?.trim() || "নোটিশ",
      bodyBn: body.bodyBn.trim(),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "slug-exists" }, { status: 409 });
  }
}
