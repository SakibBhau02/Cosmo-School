import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { authorizeAdmin, canWrite } from "@/lib/auth";
import {
  getContentRecord,
  getPageSchema,
  isContentKey,
  publishDraft,
  resetDocument,
  restoreVersion,
  saveDraft,
} from "@/content/store";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ key: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const user = await authorizeAdmin(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { key } = await ctx.params;
  if (!isContentKey(key)) return NextResponse.json({ error: "unknown page" }, { status: 404 });

  const page = getPageSchema(key);
  const record = await getContentRecord(key);
  return NextResponse.json({ page, record, user });
}

async function finish(key: string) {
  revalidateTag("content", "max");
  const page = getPageSchema(key);
  if (page?.path) revalidatePath(page.path, "page");
}

export async function PUT(req: Request, ctx: Ctx) {
  const user = await authorizeAdmin(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!canWrite(user)) return NextResponse.json({ error: "read-only account" }, { status: 403 });

  const { key } = await ctx.params;
  if (!isContentKey(key)) return NextResponse.json({ error: "unknown page" }, { status: 404 });

  let doc: unknown;
  try {
    const body = (await req.json()) as { doc?: unknown };
    doc = body.doc;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  if (!doc || typeof doc !== "object") {
    return NextResponse.json({ error: "missing document" }, { status: 400 });
  }

  try {
    const saved = await saveDraft(key, doc, user.email);
    return NextResponse.json({ ok: true, doc: saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request, ctx: Ctx) {
  const user = await authorizeAdmin(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!canWrite(user)) return NextResponse.json({ error: "read-only account" }, { status: 403 });

  const { key } = await ctx.params;
  if (!isContentKey(key)) return NextResponse.json({ error: "unknown page" }, { status: 404 });

  let action = "";
  let version = 0;
  try {
    const body = (await req.json()) as { action?: unknown; version?: unknown };
    action = typeof body.action === "string" ? body.action : "";
    version = typeof body.version === "number" ? body.version : 0;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  try {
    if (action === "publish") {
      const result = await publishDraft(key, user.email);
      await finish(key);
      return NextResponse.json({ ok: true, version: result.version });
    }
    if (action === "reset") {
      await resetDocument(key, user.email);
      await finish(key);
      return NextResponse.json({ ok: true });
    }
    if (action === "restore") {
      if (!version) return NextResponse.json({ error: "version required" }, { status: 400 });
      const doc = await restoreVersion(key, version, user.email);
      return NextResponse.json({ ok: true, doc });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "action failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
