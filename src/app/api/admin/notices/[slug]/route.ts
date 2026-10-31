import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { authorizeAdmin, canWrite } from "@/lib/auth";
import {
  deleteNoticeBySlug,
  updateNoticeBySlug,
  type NoticeInput,
} from "@/lib/notices";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

function revalidate(slug: string) {
  revalidateTag("notices", "max");
  revalidatePath("/notices");
  revalidatePath(`/notices/${slug}`);
}

export async function PATCH(req: Request, ctx: Ctx) {
  if (!canWrite(await authorizeAdmin(req)))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { slug } = await ctx.params;
  const patch = (await req.json().catch(() => null)) as NoticeInput | null;
  if (!patch) return NextResponse.json({ error: "invalid JSON" }, { status: 400 });

  try {
    const notice = await updateNoticeBySlug(slug, patch);
    if (!notice) return NextResponse.json({ error: "not-found" }, { status: 404 });
    revalidate(slug);
    return NextResponse.json({ ok: true, notice });
  } catch (error) {
    const message = error instanceof Error ? error.message : "update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  if (!canWrite(await authorizeAdmin(req)))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { slug } = await ctx.params;
  try {
    const ok = await deleteNoticeBySlug(slug);
    if (!ok) return NextResponse.json({ error: "not-found" }, { status: 404 });
    revalidate(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "delete failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
