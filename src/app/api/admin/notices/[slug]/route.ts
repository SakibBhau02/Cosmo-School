import { NextRequest, NextResponse } from "next/server";
import { authorizeAdmin, canWrite } from "@/lib/auth";
import { deleteNotice, updateNotice } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!canWrite(await authorizeAdmin(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const patch = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const ok = await updateNotice(slug, patch);
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ message: "not-found" }, { status: 404 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!canWrite(await authorizeAdmin(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const ok = await deleteNotice(slug);
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ message: "not-found" }, { status: 404 });
}
