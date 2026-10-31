import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { authorizeAdmin, canWrite } from "@/lib/auth";
import { createNotice, listAllNotices, type NoticeInput } from "@/lib/notices";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await authorizeAdmin(req)))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ notices: await listAllNotices() });
}

export async function POST(req: Request) {
  if (!canWrite(await authorizeAdmin(req)))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as NoticeInput | null;
  if (!body) return NextResponse.json({ error: "invalid JSON" }, { status: 400 });

  try {
    const notice = await createNotice(body);
    revalidateTag("notices", "max");
    revalidatePath("/notices");
    revalidatePath(`/notices/${notice.slug}`);
    return NextResponse.json({ ok: true, notice });
  } catch (error) {
    const message = error instanceof Error ? error.message : "create failed";
    const status = message === "slug-exists" ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
