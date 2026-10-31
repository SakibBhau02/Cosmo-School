import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { authorizeAdmin, canWrite } from "@/lib/auth";
import { db, dbAvailable } from "@/lib/db/client";
import { inquiries } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };
const STATUSES = new Set(["new", "contacted", "done"]);

export async function PATCH(req: Request, ctx: Ctx) {
  const user = await authorizeAdmin(req);
  if (!canWrite(user)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!dbAvailable()) return NextResponse.json({ error: "no database" }, { status: 503 });

  const { id } = await ctx.params;
  const body = (await req.json().catch(() => null)) as {
    status?: unknown;
    notes?: unknown;
  } | null;
  if (!body) return NextResponse.json({ error: "invalid JSON" }, { status: 400 });

  const values: Partial<typeof inquiries.$inferInsert> = {};
  if (typeof body.status === "string" && STATUSES.has(body.status)) {
    values.status = body.status;
    values.handledBy = user?.email ?? "";
  }
  if (typeof body.notes === "string") values.notes = body.notes.slice(0, 2000);
  if (Object.keys(values).length === 0) {
    return NextResponse.json({ error: "nothing to update" }, { status: 400 });
  }

  const rows = await db()
    .update(inquiries)
    .set(values)
    .where(eq(inquiries.id, Number(id)))
    .returning({ id: inquiries.id, status: inquiries.status, notes: inquiries.notes });

  if (!rows[0]) return NextResponse.json({ error: "not-found" }, { status: 404 });
  return NextResponse.json({ ok: true, inquiry: rows[0] });
}

export async function DELETE(req: Request, ctx: Ctx) {
  if (!canWrite(await authorizeAdmin(req)))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!dbAvailable()) return NextResponse.json({ error: "no database" }, { status: 503 });

  const { id } = await ctx.params;
  const rows = await db()
    .delete(inquiries)
    .where(eq(inquiries.id, Number(id)))
    .returning({ id: inquiries.id });
  if (!rows[0]) return NextResponse.json({ error: "not-found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
